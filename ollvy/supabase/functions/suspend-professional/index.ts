// suspend-professional
// Full implementation per spec §22
//
// Set status=suspended. Fire replace-retainer-professional for all active retainers.
// Cancels active order assignments and sets is_available=false.
// Requires reason >= 50 chars
// Body: { professional_id: string, reason: string }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyAdmin } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface SuspendInput {
  professional_id: string;
  reason: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify JWT and confirm user is an admin
    const authResult = await verifyAdmin(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 403,
        }
      );
    }

    // Only ops_admin and super_admin can suspend
    if (!['ops_admin', 'super_admin'].includes(authResult.role!)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Insufficient permissions' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    const adminId = authResult.adminId!;
    const body: SuspendInput = await req.json();
    const { professional_id, reason } = body;

    if (!professional_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'professional_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!reason || reason.length < 50) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Reason must be at least 50 characters' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const now = new Date();

    // Get the professional
    const { data: professional, error: fetchError } = await supabase
      .from('professionals')
      .select('id, name, display_name, phone, email, status')
      .eq('id', professional_id)
      .single();

    if (fetchError || !professional) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Professional not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Check current status
    if (professional.status === 'suspended') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Professional is already suspended' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (professional.status !== 'approved') {
      return new Response(
        JSON.stringify({ ok: false, error: `Cannot suspend professional with status: ${professional.status}` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Update professional status
    const { error: updateError } = await supabase
      .from('professionals')
      .update({
        status: 'suspended',
        is_available: false,
        suspension_reason: reason,
        suspended_at: now.toISOString(),
        suspended_by: adminId,
        updated_at: now.toISOString(),
      })
      .eq('id', professional_id);

    if (updateError) {
      console.error('Failed to update professional:', updateError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to suspend professional' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Get all active orders assigned to this professional
    const { data: activeOrders } = await supabase
      .from('orders')
      .select('id, order_number, user_id, service_package_id')
      .eq('professional_id', professional_id)
      .in('status', ['assigned', 'in_progress']);

    const reassignedOrders: string[] = [];

    // Reassign active orders
    if (activeOrders && activeOrders.length > 0) {
      for (const order of activeOrders) {
        // Set order to waitlisted for reassignment
        await supabase
          .from('orders')
          .update({
            status: 'waitlisted',
            professional_id: null,
            assigned_at: null,
            force_assigned: false,
            updated_at: now.toISOString(),
          })
          .eq('id', order.id);

        reassignedOrders.push(order.order_number);

        // Notify user about reassignment
        await supabase.from('notifications').insert({
          user_id: order.user_id,
          type: 'order_reassigning',
          title: 'Professional Change',
          body: `Your order ${order.order_number} is being reassigned to a new professional. You will be notified once a new professional is assigned.`,
          data: {
            order_id: order.id,
          },
        });
      }
    }

    // Get all active retainers assigned to this professional
    const { data: activeRetainers } = await supabase
      .from('retainer_subscriptions')
      .select('id, user_id, service_package_id')
      .eq('professional_id', professional_id)
      .eq('status', 'active');

    const pausedRetainers: string[] = [];

    // Handle retainers - auto-pause them (no count deducted) until new professional found
    if (activeRetainers && activeRetainers.length > 0) {
      for (const retainer of activeRetainers) {
        // Auto-pause retainer
        await supabase
          .from('retainer_subscriptions')
          .update({
            status: 'paused',
            professional_id: null,
            pause_reason: 'professional_suspended',
            updated_at: now.toISOString(),
          })
          .eq('id', retainer.id);

        pausedRetainers.push(retainer.id);

        // Notify user
        await supabase.from('notifications').insert({
          user_id: retainer.user_id,
          type: 'retainer_paused',
          title: 'Retainer Service Update',
          body: 'Your retainer service has been temporarily paused while we assign a new professional. You will not be billed during this time.',
          data: {
            retainer_id: retainer.id,
          },
        });

        // Create admin notification for retainer reassignment
        await supabase.from('admin_notifications').insert({
          type: 'retainer_needs_reassignment',
          title: 'Retainer needs new professional',
          body: `Retainer ${retainer.id} needs reassignment due to professional suspension.`,
          related_id: retainer.id,
          related_type: 'retainer_subscription',
        });
      }
    }

    // Create notification for the professional
    await supabase.from('notifications').insert({
      professional_id: professional_id,
      type: 'account_suspended',
      title: 'Account Suspended',
      body: 'Your Ollvy account has been suspended. Please contact support for more information.',
      data: {
        suspended_at: now.toISOString(),
      },
    });

    // Send SMS notification
    const msg91AuthKey = Deno.env.get('MSG91_AUTH_KEY');
    const msg91SenderId = Deno.env.get('MSG91_SENDER_ID');
    const msg91TemplateId = Deno.env.get('MSG91_PROFESSIONAL_SUSPENDED_TEMPLATE_ID');

    if (msg91AuthKey && msg91SenderId && msg91TemplateId && professional.phone) {
      try {
        await fetch('https://api.msg91.com/api/v5/flow/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authkey': msg91AuthKey,
          },
          body: JSON.stringify({
            template_id: msg91TemplateId,
            sender: msg91SenderId,
            mobiles: `91${professional.phone}`,
            VAR1: professional.display_name || professional.name || 'Professional',
          }),
        });
      } catch (smsError) {
        console.error('Failed to send suspension SMS:', smsError);
      }
    }

    // Write to admin audit log
    await supabase.from('admin_audit_log').insert({
      admin_user_id: adminId,
      action: 'suspend_professional',
      target_type: 'professional',
      target_id: professional_id,
      notes: reason,
      payload: {
        orders_reassigned: reassignedOrders,
        retainers_paused: pausedRetainers,
      },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        professional_id,
        status: 'suspended',
        orders_reassigned: reassignedOrders.length,
        retainers_paused: pausedRetainers.length,
        message: `Professional ${professional.display_name || professional.name} has been suspended`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('suspend-professional error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

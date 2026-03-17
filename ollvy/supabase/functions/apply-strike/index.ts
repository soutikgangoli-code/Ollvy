// apply-strike
// Internal function - called by check-sla-alerts
// Increments professionals.strike_count
// Strike 3: admin email + admin_notifications banner + professional push warning
// Strike 5: auto-suspend via suspend-professional. All retainers replaced.
// Writes to admin_audit_log

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

export interface ApplyStrikeInput {
  professional_id: string;
  order_id: string;
  sla_alert_id: string;
  reason: string;
}

export interface ApplyStrikeOutput {
  ok: boolean;
  error?: string;
  strike_count?: number;
  suspended?: boolean;
}

/**
 * apply-strike
 *
 * Spec: Increment strike_count. Admin alert at 3. Auto-suspend at 5.
 */
export async function applyStrike(
  input: ApplyStrikeInput
): Promise<ApplyStrikeOutput> {
  const supabase = getSupabaseAdmin();

  try {
    const { professional_id, order_id, sla_alert_id, reason } = input;

    // Get current professional data
    const { data: professional, error: fetchError } = await supabase
      .from('professionals')
      .select('id, name, strike_count, status, fcm_token, web_push_subscription')
      .eq('id', professional_id)
      .single();

    if (fetchError || !professional) {
      return { ok: false, error: 'Professional not found' };
    }

    // Increment strike count
    const newStrikeCount = (professional.strike_count || 0) + 1;

    // Update professional's strike count
    const { error: updateError } = await supabase
      .from('professionals')
      .update({ strike_count: newStrikeCount })
      .eq('id', professional_id);

    if (updateError) {
      return { ok: false, error: `Failed to update strike count: ${updateError.message}` };
    }

    // Write to admin audit log
    await supabase.from('admin_audit_log').insert({
      admin_user_id: null, // System action
      action: 'apply_strike',
      target_type: 'professional',
      target_id: professional_id,
      notes: reason,
      payload: {
        order_id,
        sla_alert_id,
        old_strike_count: professional.strike_count || 0,
        new_strike_count: newStrikeCount,
      },
    });

    // Send push notification to professional
    await supabase.from('notifications').insert({
      professional_id: professional_id,
      type: 'strike_applied',
      title: 'Strike Applied',
      body: `A strike has been applied to your account for SLA breach. Current strike count: ${newStrikeCount}. If the delay was caused by the client, you can appeal within 24 hours.`,
      data: {
        order_id,
        sla_alert_id,
        strike_count: newStrikeCount,
      },
    });

    let suspended = false;

    // Strike 3: Admin alert
    if (newStrikeCount === 3) {
      // Create admin notification
      await supabase.from('admin_notifications').insert({
        type: 'strike_count_3',
        title: 'Professional Strike Warning',
        body: `${professional.name} has reached 3 strikes. Account review recommended.`,
        related_id: professional_id,
        related_type: 'professional',
      });

      // Send admin email
      await sendAdminEmail(supabase, {
        subject: `[Ollvy] Professional ${professional.name} has 3 strikes`,
        body: `Professional ${professional.name} (ID: ${professional_id}) has reached 3 strikes.

Latest strike reason: ${reason}

Please review the account and take appropriate action.`,
      });

      // Send push warning to professional
      await supabase.from('notifications').insert({
        professional_id: professional_id,
        type: 'strike_warning',
        title: 'Account Warning',
        body: 'You have reached 3 strikes. Your account is under review. 2 more strikes will result in suspension.',
        data: {
          strike_count: newStrikeCount,
        },
      });
    }

    // Strike 5: Auto-suspend
    if (newStrikeCount >= 5) {
      // Suspend professional
      const { error: suspendError } = await supabase
        .from('professionals')
        .update({ status: 'suspended' })
        .eq('id', professional_id);

      if (suspendError) {
        console.error('Failed to suspend professional:', suspendError);
      } else {
        suspended = true;

        // Cancel all active order assignments
        const { data: activeOrders } = await supabase
          .from('orders')
          .select('id, order_number')
          .eq('professional_id', professional_id)
          .in('status', ['pending_assignment', 'in_progress', 'waitlisted']);

        if (activeOrders && activeOrders.length > 0) {
          // Set orders to waitlisted for reassignment
          await supabase
            .from('orders')
            .update({
              professional_id: null,
              status: 'waitlisted',
            })
            .eq('professional_id', professional_id)
            .in('status', ['pending_assignment', 'in_progress']);

          // Create waitlist entries
          for (let i = 0; i < activeOrders.length; i++) {
            await supabase.from('order_waitlist').upsert({
              order_id: activeOrders[i].id,
              position: i + 1,
            });
          }
        }

        // Replace professional on all active retainers
        const { data: activeRetainers } = await supabase
          .from('retainer_subscriptions')
          .select('id')
          .eq('assigned_professional_id', professional_id)
          .in('status', ['active', 'onboarding']);

        if (activeRetainers && activeRetainers.length > 0) {
          // Clear professional assignment, triggering need for reassignment
          await supabase
            .from('retainer_subscriptions')
            .update({
              assigned_professional_id: null,
              status: 'paused', // Auto-pause until new professional assigned
            })
            .eq('assigned_professional_id', professional_id)
            .in('status', ['active', 'onboarding']);

          // Create admin notification for retainer reassignment
          await supabase.from('admin_notifications').insert({
            type: 'retainer_reassignment_needed',
            title: 'Retainer Reassignment Required',
            body: `${activeRetainers.length} retainers need reassignment due to professional ${professional.name} suspension.`,
            related_id: professional_id,
            related_type: 'professional',
          });
        }

        // Write suspension to audit log
        await supabase.from('admin_audit_log').insert({
          admin_user_id: null,
          action: 'auto_suspend',
          target_type: 'professional',
          target_id: professional_id,
          notes: `Auto-suspended due to reaching 5 strikes. ${activeOrders?.length || 0} orders reassigned, ${activeRetainers?.length || 0} retainers paused.`,
          payload: {
            strike_count: newStrikeCount,
            orders_affected: activeOrders?.length || 0,
            retainers_affected: activeRetainers?.length || 0,
          },
        });

        // Admin notification
        await supabase.from('admin_notifications').insert({
          type: 'professional_suspended',
          title: 'Professional Auto-Suspended',
          body: `${professional.name} has been auto-suspended after reaching 5 strikes. ${activeOrders?.length || 0} orders need reassignment.`,
          related_id: professional_id,
          related_type: 'professional',
        });

        // Send admin email
        await sendAdminEmail(supabase, {
          subject: `[Ollvy] URGENT: Professional ${professional.name} auto-suspended`,
          body: `Professional ${professional.name} (ID: ${professional_id}) has been auto-suspended after reaching 5 strikes.

Actions taken:
- ${activeOrders?.length || 0} active orders moved to waitlist for reassignment
- ${activeRetainers?.length || 0} retainers paused pending reassignment

Please review and reassign affected orders and retainers immediately.`,
        });

        // Notify professional
        await supabase.from('notifications').insert({
          professional_id: professional_id,
          type: 'account_suspended',
          title: 'Account Suspended',
          body: 'Your account has been suspended due to multiple SLA breaches. Please contact support for more information.',
          data: {
            strike_count: newStrikeCount,
          },
        });
      }
    }

    return {
      ok: true,
      strike_count: newStrikeCount,
      suspended,
    };
  } catch (error) {
    console.error('apply-strike error:', error);
    return { ok: false, error: (error as Error).message };
  }
}

async function sendAdminEmail(supabase: any, { subject, body }: { subject: string; body: string }) {
  // Get admin email recipients from app_settings
  const { data: settings } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'admin_email_recipients')
    .single();

  const recipients = settings?.value?.split(',') || ['admin@ollvy.com'];

  // For now, just log the email (actual email sending via Resend/SendGrid would be here)
  console.log(`Admin email to ${recipients.join(', ')}:`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);

  // TODO: Implement actual email sending via Resend/SendGrid
}

// For direct HTTP invocation during development/testing
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // For testing: require service role key
  const authResult = verifyCron(req);
  if (!authResult.success) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal function - requires service role key' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    );
  }

  const body = await req.json();
  const result = await applyStrike(body);

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: result.ok ? 200 : 500 }
  );
});

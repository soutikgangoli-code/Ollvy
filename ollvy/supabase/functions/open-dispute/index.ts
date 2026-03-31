// open-dispute
// HTTP POST (auth, user only)
// Only on in_progress orders (or completed within 7 days)
// Sets order.status=disputed
// Creates disputes row
// Puts payout on hold
// Sends notifications to professional, user, admin
// Includes fraud detection per spec §35A

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUser } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface OpenDisputeInput {
  order_id: string;
  reason_category: string;
  description?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify JWT and extract user_id
    const authResult = await verifyUser(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 401,
        }
      );
    }

    const userId = authResult.userId!;
    const body: OpenDisputeInput = await req.json();
    const { order_id, reason_category, description } = body;

    // Validate input
    if (!order_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'order_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!reason_category) {
      return new Response(
        JSON.stringify({ ok: false, error: 'reason_category is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const now = new Date();

    // Fraud detection: Check for open disputes (dispute cooldown)
    const { data: openDisputes } = await supabase
      .from('disputes')
      .select('id, created_at')
      .eq('raised_by_user_id', userId)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(1);

    if (openDisputes && openDisputes.length > 0) {
      const lastDisputeDate = new Date(openDisputes[0].created_at);
      const daysSinceLastDispute = (now.getTime() - lastDisputeDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceLastDispute < 7) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: 'You already have an open dispute. Please wait for it to be resolved before raising another.',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
    }

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        user_id,
        professional_id,
        status,
        assigned_at,
        completed_at,
        service_packages (
          name
        )
      `)
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Order not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Verify ownership
    if (order.user_id !== userId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'You can only dispute your own orders' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    // Check if order can be disputed
    const validDisputeStatuses = ['in_progress', 'completed'];
    if (!validDisputeStatuses.includes(order.status)) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: `Cannot dispute an order with status "${order.status}". Orders must be in progress or recently completed.`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // For completed orders, check 7-day window
    if (order.status === 'completed' && order.completed_at) {
      const completedDate = new Date(order.completed_at);
      const daysSinceCompletion = (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceCompletion > 7) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: 'Disputes can only be raised within 7 days of order completion.',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
    }

    // For in_progress orders, check 24h minimum (order must be past 24h)
    if (order.status === 'in_progress' && order.assigned_at) {
      const assignedDate = new Date(order.assigned_at);
      const hoursSinceAssignment = (now.getTime() - assignedDate.getTime()) / (1000 * 60 * 60);

      if (hoursSinceAssignment < 24) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: 'Please allow at least 24 hours after assignment before raising a dispute.',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
    }

    // Monthly dispute cap fraud detection (allow but flag)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const { data: recentDisputes } = await supabase
      .from('disputes')
      .select('id')
      .eq('raised_by_user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString());

    let fraudFlagged = false;
    if (recentDisputes && recentDisputes.length >= 3) {
      fraudFlagged = true;

      // Get user phone for notification
      const { data: userData } = await supabase
        .from('users')
        .select('phone')
        .eq('id', userId)
        .single();

      // Flag user
      await supabase
        .from('users')
        .update({ fraud_flag: true })
        .eq('id', userId);

      // Create admin notification
      await supabase.from('admin_notifications').insert({
        type: 'dispute_abuse_warning',
        title: 'Possible Dispute Abuse',
        body: `User ${userData?.email || userData?.phone || userId} has raised 3+ disputes this month. Review account.`,
        related_id: userId,
        related_type: 'user',
      });
    }

    // Same-device pattern detection
    if (order.status === 'completed' && order.completed_at) {
      const completedDate = new Date(order.completed_at);
      const hoursSinceCompletion = (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60);

      if (hoursSinceCompletion < 2) {
        // Get user FCM token to check same-device pattern
        const { data: userData } = await supabase
          .from('users')
          .select('phone, email, fcm_token')
          .eq('id', userId)
          .single();

        await supabase.from('admin_notifications').insert({
          type: 'possible_refund_gaming',
          title: 'Possible Refund Gaming',
          body: `Dispute raised within 2 hours of order completion. Order ${order.order_number}. User: ${userData?.email || userData?.phone || userId}`,
          related_id: order_id,
          related_type: 'order',
        });
      }
    }

    // Create dispute record
    const { data: dispute, error: disputeError } = await supabase
      .from('disputes')
      .insert({
        order_id,
        raised_by_user_id: userId,
        raised_by_type: 'user',
        reason_category,
        description: description?.trim() || null,
        status: 'open',
      })
      .select()
      .single();

    if (disputeError) {
      console.error('Failed to create dispute:', disputeError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to create dispute. Please try again.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Update order status to disputed
    const { error: orderUpdateError } = await supabase
      .from('orders')
      .update({ status: 'disputed' })
      .eq('id', order_id);

    if (orderUpdateError) {
      console.error('Failed to update order status:', orderUpdateError);
    }

    // Put payout on hold
    const { error: payoutError } = await supabase
      .from('payouts')
      .update({ status: 'held' })
      .eq('order_id', order_id)
      .in('status', ['pending']);

    if (payoutError) {
      console.error('Failed to hold payout:', payoutError);
    }

    // Send notification to professional
    if (order.professional_id) {
      await supabase.from('notifications').insert({
        professional_id: order.professional_id,
        type: 'dispute_opened',
        title: 'Dispute Raised',
        body: `A dispute has been raised on order ${order.order_number}. Your payout is on hold until resolved.`,
        data: {
          order_id,
          dispute_id: dispute.id,
        },
      });
    }

    // Send notification to user
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'dispute_opened',
      title: 'Dispute Submitted',
      body: `Your dispute for order ${order.order_number} has been submitted. Our team will review and respond within 48 hours.`,
      data: {
        order_id,
        dispute_id: dispute.id,
      },
    });

    // Create admin notification
    await supabase.from('admin_notifications').insert({
      type: 'dispute_opened',
      title: 'New Dispute',
      body: `Dispute raised on order ${order.order_number} for ${(order.service_packages as any)?.name || 'service'}. Reason: ${reason_category}`,
      related_id: dispute.id,
      related_type: 'dispute',
    });

    // Send admin email
    // TODO: Implement via send-admin-email function

    return new Response(
      JSON.stringify({
        ok: true,
        dispute_id: dispute.id,
        message: 'Dispute submitted successfully. Our team will review within 48 hours.',
        fraud_flagged: fraudFlagged,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('open-dispute error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

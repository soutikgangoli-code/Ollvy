// check-dispute-sla
// Cron: runs daily at 10am IST
// Finds disputes open past auto_refund_days (from app_settings)
// Calls resolve-dispute with refund=true automatically
// Sends admin notification before auto-resolving (1 day warning)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify service role key for cron jobs
    const authResult = verifyCron(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 401,
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const now = new Date();

    // Get auto_refund_days from app_settings (default 7)
    const { data: settings } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'dispute_auto_refund_days')
      .single();

    const autoRefundDays = parseInt(settings?.value || '7', 10);
    const warningDays = autoRefundDays - 1; // 1 day warning

    const autoRefundDeadline = new Date(now.getTime() - autoRefundDays * 24 * 60 * 60 * 1000);
    const warningDeadline = new Date(now.getTime() - warningDays * 24 * 60 * 60 * 1000);

    const results = {
      warnings_sent: 0,
      auto_refunds: 0,
      errors: [] as string[],
    };

    // Find disputes that are about to hit auto-refund (1 day warning)
    const { data: warningDisputes } = await supabase
      .from('disputes')
      .select(`
        id,
        order_id,
        created_at,
        orders!inner (
          order_number,
          user_id,
          professional_id
        )
      `)
      .in('status', ['open', 'admin_reviewing'])
      .lte('created_at', warningDeadline.toISOString())
      .gt('created_at', autoRefundDeadline.toISOString());

    for (const dispute of (warningDisputes || [])) {
      const order = dispute.orders as any;

      // Check if warning was already sent for this dispute
      const { data: existingWarning } = await supabase
        .from('admin_notifications')
        .select('id')
        .eq('type', 'dispute_auto_refund_warning')
        .eq('related_id', dispute.id)
        .single();

      if (!existingWarning) {
        // Send warning notification
        await supabase.from('admin_notifications').insert({
          type: 'dispute_auto_refund_warning',
          title: 'Dispute Auto-Refund Warning',
          body: `Dispute on order ${order.order_number} will auto-refund tomorrow if not resolved. Please review immediately.`,
          related_id: dispute.id,
          related_type: 'dispute',
        });

        results.warnings_sent++;
      }
    }

    // Find disputes that have passed auto-refund deadline
    const { data: overdueDisputes } = await supabase
      .from('disputes')
      .select(`
        id,
        order_id,
        raised_by_user_id,
        created_at,
        orders!inner (
          id,
          order_number,
          user_id,
          professional_id,
          total_paisa_snapshot,
          razorpay_payment_id,
          retainer_subscription_id,
          chat_conversation_id,
          service_packages (
            name
          )
        )
      `)
      .in('status', ['open', 'admin_reviewing'])
      .lte('created_at', autoRefundDeadline.toISOString());

    for (const dispute of (overdueDisputes || [])) {
      try {
        const order = dispute.orders as any;

        // Auto-resolve with refund
        // Update dispute
        const { error: updateDisputeError } = await supabase
          .from('disputes')
          .update({
            status: 'resolved_refund',
            resolved_at: now.toISOString(),
            resolved_by: null, // System action
            resolution_amount_paisa: order.total_paisa_snapshot,
          })
          .eq('id', dispute.id);

        if (updateDisputeError) {
          results.errors.push(`Failed to update dispute ${dispute.id}: ${updateDisputeError.message}`);
          continue;
        }

        // Update order status to cancelled
        await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', order.id);

        // Cancel professional payout
        await supabase
          .from('payouts')
          .update({ status: 'failed' })
          .eq('order_id', order.id);

        // Trigger Razorpay refund
        if (order.razorpay_payment_id) {
          try {
            await processRazorpayRefund(
              order.razorpay_payment_id,
              order.total_paisa_snapshot,
              `Auto-refund: Dispute SLA exceeded for order ${order.order_number}`
            );
          } catch (refundError) {
            console.error('Razorpay refund failed:', refundError);
            results.errors.push(`Razorpay refund failed for order ${order.id}: ${(refundError as Error).message}`);
          }
        }

        // If retainer, revert compliance obligations
        if (order.retainer_subscription_id) {
          await supabase
            .from('compliance_obligations')
            .update({
              status: 'overdue',
              retainer_subscription_id: null,
            })
            .eq('retainer_subscription_id', order.retainer_subscription_id)
            .eq('status', 'covered_by_retainer');
        }

        // Notify user
        await supabase.from('notifications').insert({
          user_id: order.user_id,
          type: 'dispute_auto_refund',
          title: 'Dispute Auto-Resolved',
          body: `Your dispute for order ${order.order_number} has been automatically resolved with a full refund. The refund will be processed within 5-7 business days.`,
          data: {
            order_id: order.id,
            dispute_id: dispute.id,
            refund_amount: order.total_paisa_snapshot,
          },
        });

        // Notify professional
        if (order.professional_id) {
          await supabase.from('notifications').insert({
            professional_id: order.professional_id,
            type: 'dispute_auto_refund',
            title: 'Dispute Auto-Resolved',
            body: `The dispute on order ${order.order_number} was automatically resolved with a refund to the client due to review SLA breach. No payout will be made.`,
            data: {
              order_id: order.id,
              dispute_id: dispute.id,
            },
          });
        }

        // Create system chat message
        if (order.chat_conversation_id) {
          await supabase.from('chat_messages').insert({
            conversation_id: order.chat_conversation_id,
            sender_id: null,
            sender_type: 'system',
            content: `Dispute auto-resolved: Full refund of Rs ${order.total_paisa_snapshot / 100} has been processed due to admin review SLA breach.`,
            message_type: 'system',
          });
        }

        // Admin notification
        await supabase.from('admin_notifications').insert({
          type: 'dispute_auto_refund',
          title: 'Dispute Auto-Refunded',
          body: `Dispute on order ${order.order_number} was auto-refunded after ${autoRefundDays} days without resolution.`,
          related_id: dispute.id,
          related_type: 'dispute',
        });

        // Write to audit log
        await supabase.from('admin_audit_log').insert({
          admin_user_id: null, // System action
          action: 'auto_refund_dispute',
          target_type: 'dispute',
          target_id: dispute.id,
          notes: `Auto-refund triggered after ${autoRefundDays} days without resolution`,
          payload: {
            order_id: order.id,
            refund_amount: order.total_paisa_snapshot,
            days_open: autoRefundDays,
          },
        });

        results.auto_refunds++;
      } catch (err) {
        results.errors.push(`Error processing dispute ${dispute.id}: ${(err as Error).message}`);
      }
    }

    // Send summary to admin email if any auto-refunds occurred
    if (results.auto_refunds > 0) {
      // TODO: Send admin email via send-admin-email function
      console.log(`Auto-refunded ${results.auto_refunds} disputes`);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        ...results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('check-dispute-sla error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function processRazorpayRefund(
  paymentId: string,
  amountPaisa: number,
  notes: string
): Promise<void> {
  const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
  const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

  if (!razorpayKeyId || !razorpayKeySecret) {
    console.log('Razorpay credentials not configured - skipping refund API call');
    return;
  }

  const credentials = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    },
    body: JSON.stringify({
      amount: amountPaisa,
      notes: {
        reason: notes,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Razorpay refund failed: ${JSON.stringify(errorData)}`);
  }
}

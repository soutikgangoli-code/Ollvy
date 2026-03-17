// resolve-dispute
// HTTP POST (admin only)
// Two outcomes: refund=true or refund=false
// refund=true: trigger Razorpay refund, cancel professional payout, set order=cancelled
// refund=false: release payout hold, set order=completed
// Both write to admin_audit_log

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyAdmin } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface ResolveDisputeInput {
  dispute_id: string;
  refund: boolean;
  resolution_notes?: string;
  partial_amount_paisa?: number; // For partial refunds
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

    const adminId = authResult.adminId!;
    const body: ResolveDisputeInput = await req.json();
    const { dispute_id, refund, resolution_notes, partial_amount_paisa } = body;

    // Validate input
    if (!dispute_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'dispute_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (typeof refund !== 'boolean') {
      return new Response(
        JSON.stringify({ ok: false, error: 'refund (true/false) is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const now = new Date();

    // Get the dispute
    const { data: dispute, error: disputeError } = await supabase
      .from('disputes')
      .select(`
        id,
        order_id,
        raised_by_user_id,
        status,
        orders!inner (
          id,
          order_number,
          user_id,
          professional_id,
          status,
          total_paisa_snapshot,
          razorpay_payment_id,
          retainer_subscription_id,
          chat_conversation_id,
          service_packages (
            name
          )
        )
      `)
      .eq('id', dispute_id)
      .single();

    if (disputeError || !dispute) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Dispute not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Check if dispute is still open
    if (!['open', 'admin_reviewing'].includes(dispute.status)) {
      return new Response(
        JSON.stringify({ ok: false, error: `Dispute is already resolved with status: ${dispute.status}` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const order = dispute.orders as any;
    let newDisputeStatus: string;
    let newOrderStatus: string;
    let refundAmount = 0;

    if (refund) {
      // REFUND CASE
      if (partial_amount_paisa && partial_amount_paisa > 0) {
        // Partial refund
        refundAmount = partial_amount_paisa;
        newDisputeStatus = 'resolved_partial';
        newOrderStatus = 'cancelled';
      } else {
        // Full refund
        refundAmount = order.total_paisa_snapshot;
        newDisputeStatus = 'resolved_refund';
        newOrderStatus = 'cancelled';
      }

      // Trigger Razorpay refund if payment exists
      if (order.razorpay_payment_id) {
        try {
          await processRazorpayRefund(
            order.razorpay_payment_id,
            refundAmount,
            `Dispute resolution for order ${order.order_number}`
          );
        } catch (refundError) {
          console.error('Razorpay refund failed:', refundError);
          // Continue anyway - admin can manually process refund
        }
      }

      // Cancel professional payout
      await supabase
        .from('payouts')
        .update({
          status: 'failed',
        })
        .eq('order_id', order.id);

      // If retainer order, revert compliance obligation to overdue
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

      // Notify professional (no payout)
      if (order.professional_id) {
        await supabase.from('notifications').insert({
          professional_id: order.professional_id,
          type: 'dispute_resolved_refund',
          title: 'Dispute Resolved - No Payout',
          body: `The dispute on order ${order.order_number} has been resolved in favor of the client. No payout will be made for this order.`,
          data: {
            order_id: order.id,
            dispute_id: dispute.id,
          },
        });
      }

      // Notify user (refund coming)
      await supabase.from('notifications').insert({
        user_id: order.user_id,
        type: 'dispute_resolved_refund',
        title: 'Dispute Resolved - Refund Approved',
        body: `Your dispute for order ${order.order_number} has been resolved. A refund of Rs ${refundAmount / 100} will be processed within 5-7 business days.`,
        data: {
          order_id: order.id,
          dispute_id: dispute.id,
          refund_amount: refundAmount,
        },
      });
    } else {
      // NO REFUND CASE
      newDisputeStatus = 'resolved_no_refund';
      newOrderStatus = 'completed';

      // Release payout hold
      await supabase
        .from('payouts')
        .update({
          status: 'pending',
        })
        .eq('order_id', order.id)
        .eq('status', 'held');

      // Notify professional (payout released)
      if (order.professional_id) {
        await supabase.from('notifications').insert({
          professional_id: order.professional_id,
          type: 'dispute_resolved_no_refund',
          title: 'Dispute Resolved - Payout Released',
          body: `The dispute on order ${order.order_number} has been resolved. Your payout hold has been released.`,
          data: {
            order_id: order.id,
            dispute_id: dispute.id,
          },
        });
      }

      // Notify user (no refund)
      await supabase.from('notifications').insert({
        user_id: order.user_id,
        type: 'dispute_resolved_no_refund',
        title: 'Dispute Resolved',
        body: `Your dispute for order ${order.order_number} has been reviewed. Based on our investigation, no refund will be issued. See details for more information.`,
        data: {
          order_id: order.id,
          dispute_id: dispute.id,
          notes: resolution_notes || null,
        },
      });
    }

    // Update dispute
    const { error: updateDisputeError } = await supabase
      .from('disputes')
      .update({
        status: newDisputeStatus,
        resolved_at: now.toISOString(),
        resolved_by: adminId,
        resolution_amount_paisa: refundAmount || null,
      })
      .eq('id', dispute_id);

    if (updateDisputeError) {
      console.error('Failed to update dispute:', updateDisputeError);
    }

    // Update order status
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({
        status: newOrderStatus,
        completed_at: newOrderStatus === 'completed' ? now.toISOString() : null,
      })
      .eq('id', order.id);

    if (updateOrderError) {
      console.error('Failed to update order:', updateOrderError);
    }

    // Create system chat message
    if (order.chat_conversation_id) {
      await supabase.from('chat_messages').insert({
        conversation_id: order.chat_conversation_id,
        sender_id: null,
        sender_type: 'system',
        content: refund
          ? `Dispute resolved: Refund of Rs ${refundAmount / 100} has been approved.`
          : 'Dispute resolved: No refund will be issued.',
        message_type: 'system',
      });
    }

    // Write to admin audit log
    await supabase.from('admin_audit_log').insert({
      admin_user_id: adminId,
      action: 'resolve_dispute',
      target_type: 'dispute',
      target_id: dispute_id,
      notes: resolution_notes || `Dispute resolved: ${refund ? 'refund' : 'no refund'}`,
      payload: {
        order_id: order.id,
        refund,
        refund_amount: refundAmount,
        new_order_status: newOrderStatus,
        new_dispute_status: newDisputeStatus,
      },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        dispute_id,
        resolution: newDisputeStatus,
        order_status: newOrderStatus,
        refund_amount: refundAmount,
        message: refund
          ? `Dispute resolved with ${partial_amount_paisa ? 'partial' : 'full'} refund of Rs ${refundAmount / 100}`
          : 'Dispute resolved without refund',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('resolve-dispute error:', error);
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

  console.log('Razorpay refund processed successfully');
}

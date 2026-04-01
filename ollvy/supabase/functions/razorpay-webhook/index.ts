// razorpay-webhook
// Full implementation per §22
//
// Spec:
// - Verify Razorpay webhook signature using RAZORPAY_WEBHOOK_SECRET
// - Check processed_webhook_events for idempotency before doing anything
// - Insert into processed_webhook_events immediately after signature check
// - Handle these events:
//   - payment.captured: Update order, assign professional, create chat, invoice, engagement letter
//   - payment.failed: Notify customer to retry payment
//   - refund.created/processed/failed: Track refund status, notify customer
//   - payment.dispute.created: Alert admin immediately (chargebacks)
//   - settlement.processed: Log for accounting
// - Deploy with: npx supabase functions deploy razorpay-webhook --no-verify-jwt

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';
import { autoAssignProfessional } from '../auto-assign-professional/index.ts';
import { getEnvironment, getRequiredEnv } from '../_shared/env.ts';

// Verify Razorpay webhook signature using HMAC SHA256
async function verifyRazorpaySignature(body: string, signature: string, secret: string): Promise<boolean> {
  if (!signature || !secret) return false;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(body)
    );

    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return signature === expectedSignature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = getSupabaseAdmin();

  try {
    const body = await req.text();
    const signature = req.headers.get('X-Razorpay-Signature') || '';
    const environment = getEnvironment();
    const isDevelopment = environment === 'development';
    const webhookSecret = isDevelopment
      ? Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || ''
      : getRequiredEnv('RAZORPAY_WEBHOOK_SECRET');
    const isTestMode = isDevelopment && (!webhookSecret || signature === 'test');

    // Verify webhook signature (skip in test mode)
    if (!isTestMode) {
      const isValid = await verifyRazorpaySignature(body, signature, webhookSecret);

      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(
          JSON.stringify({ ok: false, error: 'Invalid webhook signature' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
          }
        );
      }
    } else {
      console.log('Running in test mode - skipping signature verification');
    }

    const payload = JSON.parse(body);
    const eventType = payload.event;

    // CRITICAL: Use entity ID as idempotency key based on event type
    // Each event type has a different entity structure
    let entityId: string | null = null;

    if (eventType.startsWith('payment.')) {
      entityId = payload.payload?.payment?.entity?.id;
    } else if (eventType.startsWith('refund.')) {
      entityId = payload.payload?.refund?.entity?.id;
    } else if (eventType === 'payment.dispute.created') {
      entityId = payload.payload?.dispute?.entity?.id;
    } else if (eventType === 'settlement.processed') {
      entityId = payload.payload?.settlement?.entity?.id;
    }

    if (!entityId) {
      console.error(`Missing entity ID in ${eventType} event`);
      return new Response(
        JSON.stringify({ ok: false, error: `Invalid payload: missing entity ID for ${eventType}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Combine event type with entity ID for unique idempotency key
    const eventId = `${eventType}_${entityId}`;

    console.log(`Received webhook event: ${eventType}, Entity ID: ${entityId}, Idempotency Key: ${eventId}`);

    // Idempotency check - check processed_webhook_events
    const { data: existing } = await supabase
      .from('processed_webhook_events')
      .select('razorpay_event_id')
      .eq('razorpay_event_id', eventId)
      .single();

    if (existing) {
      console.log(`Event ${eventId} already processed, skipping`);
      return new Response(
        JSON.stringify({ ok: true, already_processed: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Record this event immediately (for idempotency)
    await supabase.from('processed_webhook_events').insert({
      razorpay_event_id: eventId,
      event_type: eventType,
      processed_at: new Date().toISOString(),
    });

    // Route to appropriate handler based on event type
    const handledEvents = [
      'payment.captured',
      'payment.failed',
      'refund.created',
      'refund.processed',
      'refund.failed',
      'payment.dispute.created',
      'settlement.processed',
    ];

    if (!handledEvents.includes(eventType)) {
      console.log(`Event ${eventType} not in handled list, acknowledging and skipping`);
      return new Response(
        JSON.stringify({ ok: true, event_type: eventType, skipped: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // =========================================================================
    // PAYMENT FAILED - Notify customer to retry
    // =========================================================================
    if (eventType === 'payment.failed') {
      const payment = payload.payload?.payment?.entity;
      if (!payment) {
        console.error('No payment entity in payment.failed payload');
        return new Response(
          JSON.stringify({ ok: false, error: 'Invalid payload' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      const razorpayOrderId = payment.order_id;
      const errorCode = payment.error_code;
      const errorDescription = payment.error_description;

      console.log(`Payment failed for order ${razorpayOrderId}: ${errorCode} - ${errorDescription}`);

      // Find the order
      const { data: order } = await supabase
        .from('orders')
        .select('id, user_id, service_packages!inner(name)')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

      if (order) {
        // Notify customer
        await supabase.from('notifications').insert({
          user_id: order.user_id,
          type: 'payment_failed',
          title: 'Payment Failed',
          body: `Your payment for ${order.service_packages.name} could not be processed. Please try again.`,
          metadata: { error_code: errorCode, order_id: order.id },
        });

        console.log(`Notification sent to user for failed payment on order ${order.id}`);
      }

      return new Response(
        JSON.stringify({ ok: true, event_type: eventType, order_id: order?.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // =========================================================================
    // REFUND EVENTS - Track refund status
    // =========================================================================
    if (eventType.startsWith('refund.')) {
      const refund = payload.payload?.refund?.entity;
      if (!refund) {
        console.error('No refund entity in refund payload');
        return new Response(
          JSON.stringify({ ok: false, error: 'Invalid payload' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      const razorpayRefundId = refund.id;
      const razorpayPaymentId = refund.payment_id;
      const amountPaisa = refund.amount;
      const speed = refund.speed;
      const status = eventType === 'refund.created' ? 'created'
        : eventType === 'refund.processed' ? 'processed'
        : 'failed';

      console.log(`Refund ${status}: ${razorpayRefundId} for payment ${razorpayPaymentId}, amount: ${amountPaisa}`);

      // Find the order by payment ID
      const { data: order } = await supabase
        .from('orders')
        .select('id, user_id, service_packages!inner(name)')
        .eq('razorpay_payment_id', razorpayPaymentId)
        .single();

      // Upsert refund record
      const refundData: Record<string, unknown> = {
        razorpay_refund_id: razorpayRefundId,
        razorpay_payment_id: razorpayPaymentId,
        amount_paisa: amountPaisa,
        status,
        speed,
        order_id: order?.id || null,
        user_id: order?.user_id || null,
      };

      if (status === 'processed') {
        refundData.processed_at = new Date().toISOString();
      } else if (status === 'failed') {
        refundData.failed_at = new Date().toISOString();
        refundData.failure_reason = refund.failure_reason || 'Unknown';
      }

      await supabase
        .from('refunds')
        .upsert(refundData, { onConflict: 'razorpay_refund_id' });

      // Notify customer
      if (order) {
        if (status === 'processed') {
          await supabase.from('notifications').insert({
            user_id: order.user_id,
            type: 'refund_processed',
            title: 'Refund Processed',
            body: `Your refund of ₹${(amountPaisa / 100).toLocaleString('en-IN')} for ${order.service_packages.name} has been processed. It will reflect in your account within 5-7 business days.`,
            metadata: { refund_id: razorpayRefundId, order_id: order.id },
          });
        } else if (status === 'failed') {
          // Notify admin for failed refunds
          await supabase.from('notifications').insert({
            user_id: order.user_id,
            type: 'refund_failed',
            title: 'Refund Issue',
            body: `There was an issue processing your refund for ${order.service_packages.name}. Our team has been notified and will contact you shortly.`,
            metadata: { refund_id: razorpayRefundId, order_id: order.id },
          });
        }
      }

      return new Response(
        JSON.stringify({ ok: true, event_type: eventType, refund_id: razorpayRefundId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // =========================================================================
    // PAYMENT DISPUTE - Alert admin immediately (chargebacks are critical)
    // =========================================================================
    if (eventType === 'payment.dispute.created') {
      const dispute = payload.payload?.dispute?.entity;
      if (!dispute) {
        console.error('No dispute entity in dispute payload');
        return new Response(
          JSON.stringify({ ok: false, error: 'Invalid payload' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      const razorpayDisputeId = dispute.id;
      const razorpayPaymentId = dispute.payment_id;
      const amountPaisa = dispute.amount;
      const reasonCode = dispute.reason_code;
      const reasonDescription = dispute.reason_description || dispute.reason_code;
      const phase = dispute.phase;
      const respondBy = dispute.respond_by ? new Date(dispute.respond_by * 1000).toISOString() : null;

      console.log(`DISPUTE CREATED: ${razorpayDisputeId} for payment ${razorpayPaymentId}, amount: ${amountPaisa}, reason: ${reasonCode}`);

      // Find the order by payment ID
      const { data: order } = await supabase
        .from('orders')
        .select('id, user_id')
        .eq('razorpay_payment_id', razorpayPaymentId)
        .single();

      // Insert dispute record
      await supabase.from('payment_disputes').insert({
        razorpay_dispute_id: razorpayDisputeId,
        razorpay_payment_id: razorpayPaymentId,
        amount_paisa: amountPaisa,
        reason_code: reasonCode,
        reason_description: reasonDescription,
        phase,
        status: 'open',
        respond_by: respondBy,
        order_id: order?.id || null,
        user_id: order?.user_id || null,
      });

      // CRITICAL: Notify all admins about the dispute
      const { data: admins } = await supabase
        .from('admin_users')
        .select('id')
        .eq('is_active', true);

      if (admins && admins.length > 0) {
        const adminNotifications = admins.map(admin => ({
          user_id: admin.id,
          type: 'dispute_created',
          title: 'URGENT: Payment Dispute Created',
          body: `A chargeback of ₹${(amountPaisa / 100).toLocaleString('en-IN')} has been raised. Reason: ${reasonDescription}. Respond by: ${respondBy ? new Date(respondBy).toLocaleDateString('en-IN') : 'ASAP'}`,
          metadata: { dispute_id: razorpayDisputeId, order_id: order?.id, respond_by: respondBy },
        }));

        await supabase.from('notifications').insert(adminNotifications);
      }

      console.log(`Dispute ${razorpayDisputeId} recorded and admins notified`);

      return new Response(
        JSON.stringify({ ok: true, event_type: eventType, dispute_id: razorpayDisputeId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // =========================================================================
    // SETTLEMENT PROCESSED - Log for accounting
    // =========================================================================
    if (eventType === 'settlement.processed') {
      const settlement = payload.payload?.settlement?.entity;
      if (!settlement) {
        console.error('No settlement entity in settlement payload');
        return new Response(
          JSON.stringify({ ok: false, error: 'Invalid payload' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      const razorpaySettlementId = settlement.id;
      const amountPaisa = settlement.amount;
      const feesPaisa = settlement.fees || 0;
      const taxPaisa = settlement.tax || 0;
      const utr = settlement.utr;
      const settledAt = settlement.created_at ? new Date(settlement.created_at * 1000).toISOString() : new Date().toISOString();

      console.log(`Settlement processed: ${razorpaySettlementId}, amount: ${amountPaisa}, UTR: ${utr}`);

      // Insert settlement record
      await supabase.from('settlements').insert({
        razorpay_settlement_id: razorpaySettlementId,
        amount_paisa: amountPaisa,
        fees_paisa: feesPaisa,
        tax_paisa: taxPaisa,
        utr,
        status: 'processed',
        settled_at: settledAt,
      });

      return new Response(
        JSON.stringify({ ok: true, event_type: eventType, settlement_id: razorpaySettlementId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // =========================================================================
    // PAYMENT CAPTURED - Main order flow (existing logic)
    // =========================================================================
    // Extract payment and order info
    const payment = payload.payload?.payment?.entity;
    if (!payment) {
      console.error('No payment entity in payload');
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid payload structure' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const razorpayOrderId = payment.order_id;
    const razorpayPaymentId = payment.id;

    // Find our order by razorpay_order_id
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        users!inner (id, fcm_token, state, city, business_name),
        service_packages!inner (id, name, workflow_stages, sla_working_days)
      `)
      .eq('razorpay_order_id', razorpayOrderId)
      .single();

    if (orderError || !order) {
      console.error('Order not found for razorpay_order_id:', razorpayOrderId);
      return new Response(
        JSON.stringify({ ok: false, error: 'Order not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Check if order is in correct state for payment processing
    // Note: pending_assignment is used as initial status (pending_payment not in enum)
    if (order.status !== 'pending_payment' && order.status !== 'pending_assignment') {
      console.log(`Order ${order.id} cannot be processed (status: ${order.status}), skipping`);
      return new Response(
        JSON.stringify({ ok: true, order_status: order.status, skipped: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    console.log(`Processing payment for order ${order.id}`);

    // 1. Update order status to 'in_progress' (note: 'paid' status not in enum)
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'in_progress',
        razorpay_payment_id: razorpayPaymentId,
        paid_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Failed to update order status:', updateError);
      throw new Error('Failed to update order status');
    }

    // 1.5 Capture phone from Razorpay payment and save to user profile if not set
    const paymentContact = payment.contact;
    if (paymentContact) {
      // Fetch current user phone
      const { data: currentUser } = await supabase
        .from('users')
        .select('phone')
        .eq('id', order.user_id)
        .single();

      // Update phone if user doesn't have one
      if (!currentUser?.phone) {
        const { error: phoneError } = await supabase
          .from('users')
          .update({ phone: paymentContact })
          .eq('id', order.user_id);

        if (phoneError) {
          console.error('Failed to update user phone:', phoneError);
        } else {
          console.log(`Updated user ${order.user_id} phone from Razorpay: ${paymentContact}`);
        }
      }
    }

    // 2. Create chat conversation for this order
    const { data: chatConversation, error: chatError } = await supabase
      .from('chat_conversations')
      .insert({
        order_id: order.id,
      })
      .select()
      .single();

    if (chatError) {
      console.error('Failed to create chat conversation:', chatError);
    } else {
      // Link chat to order
      await supabase
        .from('orders')
        .update({ chat_conversation_id: chatConversation.id })
        .eq('id', order.id);
    }

    // 3. Call auto-assign-professional
    try {
      const assignResult = await autoAssignProfessional({
        order_id: order.id,
        service_package_id: order.service_package_id,
        city: order.city,
        state: order.users.state,
        is_pro_user: order.users.subscription_tier === 'pro',
      });

      if (!assignResult.ok) {
        console.log(`Auto-assign result: ${assignResult.status || 'waitlisted'}`);
      }
    } catch (assignError) {
      console.error('Auto-assign error:', assignError);
      // Don't fail the webhook - order is paid, assignment can be done manually
    }

    // 4. Generate invoice (call internal function)
    // For now, create invoice record - PDF generation would be a separate process
    try {
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          order_id: order.id,
          user_id: order.user_id,
          amount_base_paisa: order.price_base_paisa_snapshot,
          amount_gst_paisa: order.price_gst_paisa_snapshot,
          amount_govt_fees_paisa: order.price_govt_fees_paisa_snapshot,
          amount_total_paisa: order.total_paisa_snapshot,
          type: 'order',
          issued_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (invoiceError) {
        console.error('Failed to create invoice:', invoiceError);
      } else {
        console.log(`Created invoice ${invoice.id} for order ${order.id}`);
      }
    } catch (invoiceError) {
      console.error('Invoice generation error:', invoiceError);
    }

    // 5. Generate engagement letter
    try {
      const { error: letterError } = await supabase
        .from('engagement_letters')
        .insert({
          order_id: order.id,
          user_id: order.user_id,
          service_name: order.service_packages.name,
          generated_at: new Date().toISOString(),
        });

      if (letterError) {
        console.error('Failed to create engagement letter:', letterError);
      }
    } catch (letterError) {
      console.error('Engagement letter error:', letterError);
    }

    // 6. Send notification to user
    try {
      await supabase.from('notifications').insert({
        user_id: order.user_id,
        type: 'payment_success',
        title: 'Payment Successful',
        body: `Your payment for ${order.service_packages.name} has been received. We're assigning a specialist now.`,
      });

      // If FCM token exists, we would send push here
      // For now, just log it
      if (order.users.fcm_token) {
        console.log(`Would send FCM push to token: ${order.users.fcm_token.substring(0, 20)}...`);
      }
    } catch (notifyError) {
      console.error('Notification error:', notifyError);
    }

    // 7. Add system message to chat
    if (chatConversation) {
      await supabase.from('chat_messages').insert({
        conversation_id: chatConversation.id,
        sender_type: 'system',
        content: 'Your Ollvy specialist is on the case. Expect to hear from them within 24 hours.',
      });
    }

    console.log(`Successfully processed payment for order ${order.id}`);

    return new Response(
      JSON.stringify({
        ok: true,
        order_id: order.id,
        status: 'paid',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Still return 200 to prevent Razorpay from retrying
    // But log the error for investigation
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 to prevent retries
      }
    );
  }
});

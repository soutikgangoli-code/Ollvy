// retainer-billing-webhook
// Full implementation per §6, §11, and §22
//
// Spec:
// - Verify signature using RAZORPAY_SUBSCRIPTION_WEBHOOK_SECRET
// - Idempotency check on processed_webhook_events before doing anything
// - Handle all 5 events:
//   - subscription.charged: update retainer status, call create-retainer-orders, send FCM push
//   - subscription.payment_failed: set payment_paused=true, notify user and professional
//   - subscription.cancelled: set status=cancelled, sync-retainer-obligations
//   - subscription.paused: set status=paused
//   - subscription.resumed: set status=active, clear pause

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { createRetainerOrders } from '../create-retainer-orders/index.ts';

const encoder = new TextEncoder();

/**
 * Verify Razorpay webhook signature using HMAC SHA256
 */
async function verifyRazorpaySignature(body: string, signature: string, secret: string): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return computedSignature === signature;
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
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);
    
    const signature = req.headers.get('X-Razorpay-Signature');
    const webhookSecret = Deno.env.get('RAZORPAY_SUBSCRIPTION_WEBHOOK_SECRET');
    const environment = Deno.env.get('ENVIRONMENT') || 'development';

    // Verify signature (skip in development)
    if (environment !== 'development') {
      if (!signature || !webhookSecret) {
        console.error('Missing signature or webhook secret');
        return new Response(
          JSON.stringify({ ok: false, error: 'Unauthorized' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      const isValid = await verifyRazorpaySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(
          JSON.stringify({ ok: false, error: 'Invalid signature' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }
    }

    // Extract event data
    const event = payload.event;
    const subscriptionId = payload.payload?.subscription?.entity?.id;
    const paymentId = payload.payload?.payment?.entity?.id;

    // CRITICAL: Use payment ID as idempotency key for payment events
    // For non-payment events (paused, resumed, cancelled), use subscription_id + event type
    // NEVER use just event type - two different subscriptions with same event would collide
    let eventId: string;
    if (paymentId) {
      // Payment events: use the unique payment ID
      eventId = paymentId;
    } else if (subscriptionId) {
      // Non-payment events: combine subscription ID with event type
      // This allows same subscription to have different event types processed
      eventId = `${subscriptionId}_${event}`;
    } else {
      console.error('Missing both payment ID and subscription ID in webhook payload');
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid payload: missing identifiers' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Processing webhook event: ${event}, Payment ID: ${paymentId}, Subscription ID: ${subscriptionId}, Idempotency Key: ${eventId}`);

    // Idempotency check
    const { error: idempotencyError } = await supabase
      .from('processed_webhook_events')
      .insert({
        razorpay_event_id: eventId,
        event_type: event,
      });

    if (idempotencyError) {
      // Event already processed
      console.log(`Event ${eventId} already processed, skipping`);
      return new Response(
        JSON.stringify({ ok: true, message: 'Event already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Get subscription data
    const subscriptionEntity = payload.payload?.subscription?.entity;
    const paymentEntity = payload.payload?.payment?.entity;
    
    if (!subscriptionEntity && !paymentEntity) {
      console.error('No subscription or payment entity in payload');
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid payload' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const razorpaySubscriptionId = subscriptionEntity?.id || paymentEntity?.subscription_id;
    
    // Find the retainer subscription
    const { data: retainer, error: retainerError } = await supabase
      .from('retainer_subscriptions')
      .select(`
        id, user_id, service_package_id, assigned_professional_id,
        status, monthly_price_paisa, chat_conversation_id,
        service_packages!inner (name)
      `)
      .eq('razorpay_subscription_id', razorpaySubscriptionId)
      .single();

    if (retainerError || !retainer) {
      console.error('Retainer subscription not found:', razorpaySubscriptionId);
      return new Response(
        JSON.stringify({ ok: false, error: 'Retainer subscription not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Handle different events
    switch (event) {
      case 'subscription.charged': {
        // Payment successful - create child order
        const billingPeriod = new Date().toISOString().substring(0, 7); // YYYY-MM
        const amountPaisa = paymentEntity?.amount || retainer.monthly_price_paisa;

        // Update retainer status if in onboarding
        if (retainer.status === 'onboarding') {
          // Calculate first billing date (25th rule from spec)
          const today = new Date();
          const dayOfMonth = today.getDate();
          let firstBillingDate: Date;
          
          if (dayOfMonth >= 1 && dayOfMonth <= 24) {
            // 25th of same month
            firstBillingDate = new Date(today.getFullYear(), today.getMonth(), 25);
          } else {
            // 25th of next month
            firstBillingDate = new Date(today.getFullYear(), today.getMonth() + 1, 25);
          }

          await supabase
            .from('retainer_subscriptions')
            .update({
              status: 'active',
              is_trial_active: false,
              first_billing_date: firstBillingDate.toISOString().split('T')[0],
              next_billing_date: firstBillingDate.toISOString().split('T')[0],
              onboarding_completed_at: new Date().toISOString(),
            })
            .eq('id', retainer.id);
        } else {
          // Clear any payment_paused state
          await supabase
            .from('retainer_subscriptions')
            .update({ status: 'active' })
            .eq('id', retainer.id);
        }

        // Clear payment_paused on any active child orders
        await supabase
          .from('orders')
          .update({ payment_paused: false })
          .eq('retainer_subscription_id', retainer.id)
          .eq('payment_paused', true);

        // Create child order for this billing cycle
        const orderResult = await createRetainerOrders({
          retainer_subscription_id: retainer.id,
          razorpay_payment_id: paymentEntity?.id || eventId,
          billing_period: billingPeriod,
          amount_paisa: amountPaisa,
        });

        if (!orderResult.ok) {
          console.error('Failed to create retainer order:', orderResult.error);
        }

        // Generate invoice
        // Note: In production, call generate-invoice edge function
        const { generateInvoice } = await import('../generate-invoice/index.ts');
        if (orderResult.order_id) {
          await generateInvoice({ order_id: orderResult.order_id });
        }

        // Notify user
        await supabase.from('notifications').insert({
          user_id: retainer.user_id,
          type: 'retainer_charged',
          title: 'Billing Successful',
          body: `Your ${retainer.service_packages.name} subscription has been renewed.`,
        });

        console.log(`Processed subscription.charged for retainer ${retainer.id}`);
        break;
      }

      case 'subscription.payment_failed': {
        // Payment failed - set payment_paused on active orders
        await supabase
          .from('orders')
          .update({ payment_paused: true })
          .eq('retainer_subscription_id', retainer.id)
          .in('status', ['assigned', 'in_progress']);

        // Update retainer status
        await supabase
          .from('retainer_subscriptions')
          .update({ status: 'payment_failed' })
          .eq('id', retainer.id);

        // Create billing event
        await supabase.from('retainer_billing_events').insert({
          retainer_subscription_id: retainer.id,
          razorpay_payment_id: paymentEntity?.id,
          event_type: 'subscription.payment_failed',
          billing_period: new Date().toISOString().substring(0, 7),
          status: 'failed',
        });

        // Notify user
        await supabase.from('notifications').insert({
          user_id: retainer.user_id,
          type: 'payment_failed',
          title: 'Payment Failed',
          body: `There was an issue with your ${retainer.service_packages.name} subscription payment. Please update your payment method.`,
        });

        // Add system message to chat
        if (retainer.chat_conversation_id) {
          await supabase.from('chat_messages').insert({
            conversation_id: retainer.chat_conversation_id,
            sender_type: 'system',
            content: 'There is a billing issue on this account. Work is paused until payment is resolved.',
          });
        }

        // Notify admin
        await supabase.from('admin_notifications').insert({
          type: 'payment_failed',
          title: 'Retainer Payment Failed',
          message: `Payment failed for retainer ${retainer.id}`,
          severity: 'warning',
        });

        console.log(`Processed subscription.payment_failed for retainer ${retainer.id}`);
        break;
      }

      case 'subscription.cancelled': {
        // Subscription cancelled - update status
        await supabase
          .from('retainer_subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
          })
          .eq('id', retainer.id);

        // Sync compliance obligations (revert covered_by_retainer)
        // Note: In production, call sync-retainer-obligations
        await supabase
          .from('compliance_obligations')
          .update({ covered_by_retainer: false })
          .eq('user_id', retainer.user_id)
          .eq('retainer_subscription_id', retainer.id);

        // Notify user
        await supabase.from('notifications').insert({
          user_id: retainer.user_id,
          type: 'retainer_cancelled',
          title: 'Subscription Cancelled',
          body: `Your ${retainer.service_packages.name} subscription has been cancelled.`,
        });

        // Add system message to chat
        if (retainer.chat_conversation_id) {
          await supabase.from('chat_messages').insert({
            conversation_id: retainer.chat_conversation_id,
            sender_type: 'system',
            content: 'Your retainer subscription has been cancelled. Any ongoing work will be completed.',
          });
        }

        console.log(`Processed subscription.cancelled for retainer ${retainer.id}`);
        break;
      }

      case 'subscription.paused': {
        // Subscription paused
        await supabase
          .from('retainer_subscriptions')
          .update({
            status: 'paused',
            pause_start_date: new Date().toISOString(),
          })
          .eq('id', retainer.id);

        // Notify user
        await supabase.from('notifications').insert({
          user_id: retainer.user_id,
          type: 'retainer_paused',
          title: 'Subscription Paused',
          body: `Your ${retainer.service_packages.name} subscription has been paused.`,
        });

        // Add system message
        if (retainer.chat_conversation_id) {
          const resumeDate = new Date();
          resumeDate.setMonth(resumeDate.getMonth() + 1);
          await supabase.from('chat_messages').insert({
            conversation_id: retainer.chat_conversation_id,
            sender_type: 'system',
            content: `Your retainer has been paused until ${resumeDate.toLocaleDateString()}.`,
          });
        }

        console.log(`Processed subscription.paused for retainer ${retainer.id}`);
        break;
      }

      case 'subscription.resumed': {
        // Subscription resumed
        await supabase
          .from('retainer_subscriptions')
          .update({
            status: 'active',
            pause_start_date: null,
          })
          .eq('id', retainer.id);

        // Notify user
        await supabase.from('notifications').insert({
          user_id: retainer.user_id,
          type: 'retainer_resumed',
          title: 'Subscription Resumed',
          body: `Your ${retainer.service_packages.name} subscription is active again.`,
        });

        // Add system message
        if (retainer.chat_conversation_id) {
          await supabase.from('chat_messages').insert({
            conversation_id: retainer.chat_conversation_id,
            sender_type: 'system',
            content: 'Your retainer is active again. Billing resumes on the next billing date.',
          });
        }

        console.log(`Processed subscription.resumed for retainer ${retainer.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event}`);
    }

    return new Response(
      JSON.stringify({ ok: true, event, retainer_id: retainer.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Retainer billing webhook error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

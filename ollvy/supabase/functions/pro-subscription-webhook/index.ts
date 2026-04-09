// pro-subscription-webhook
// Full implementation per §22
//
// Webhook endpoint for Ollvy Pro subscription events from Razorpay
// Handles subscription.charged, subscription.cancelled, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { getEnvironment, getRequiredEnv } from '../_shared/env.ts';

async function verifyRazorpaySignature(body: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
    const expectedSignature = Array.from(new Uint8Array(sig))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return expectedSignature === signature;
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('X-Razorpay-Signature');
    const rawBody = await req.text();
    const isDevelopment = getEnvironment() === 'development';
    const webhookSecret = isDevelopment
      ? Deno.env.get('RAZORPAY_PRO_WEBHOOK_SECRET')
      : getRequiredEnv('RAZORPAY_PRO_WEBHOOK_SECRET');

    // Verify signature in non-development environments.
    if (!isDevelopment) {
      if (!signature) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Missing signature' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
          }
        );
      }
      const isValid = await verifyRazorpaySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Invalid signature' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
          }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const subscription = payload.payload?.subscription?.entity;
    const payment = payload.payload?.payment?.entity;

    const supabase = getSupabaseAdmin();
    const now = new Date();

    // Build idempotency key from event type + entity ID
    const entityId = subscription?.id || payment?.id || payload.payload?.entity?.id || 'unknown';
    const eventId = `${event}_${entityId}`;

    console.log(`Received pro-subscription webhook: ${event}, Entity ID: ${entityId}, Idempotency Key: ${eventId}`);

    // Idempotency check - skip if already processed
    const { data: existing } = await supabase
      .from('processed_webhook_events')
      .select('razorpay_event_id')
      .eq('razorpay_event_id', eventId)
      .single();

    if (existing) {
      console.log(`Skipping already processed event: ${eventId}`);
      return new Response(
        JSON.stringify({ ok: true, message: 'Event already processed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Record this event immediately (for idempotency)
    await supabase.from('processed_webhook_events').insert({
      razorpay_event_id: eventId,
      event_type: event,
      processed_at: new Date().toISOString(),
    });

    switch (event) {
      case 'subscription.charged': {
        // Pro subscription charged successfully
        const subscriptionId = subscription?.id;

        // Find user by subscription ID
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, ollvy_pro_status')
          .eq('ollvy_pro_subscription_id', subscriptionId)
          .single();

        if (userError || !user) {
          console.error('User not found for subscription:', subscriptionId);
          break;
        }

        // Update user Pro status
        await supabase
          .from('users')
          .update({
            ollvy_pro_status: 'active',
            ollvy_pro_last_charged_at: now.toISOString(),
            ollvy_pro_next_billing_date: subscription?.current_end
              ? new Date(subscription.current_end * 1000).toISOString()
              : null,
          })
          .eq('id', user.id);

        // Log billing event
        await supabase.from('ollvy_pro_billing_events').insert({
          user_id: user.id,
          event_type: 'charged',
          razorpay_subscription_id: subscriptionId,
          razorpay_payment_id: payment?.id,
          amount_paisa: payment?.amount || subscription?.amount || 0,
          created_at: now.toISOString(),
        });

        // Notify user
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'pro_charged',
          title: 'Ollvy Pro subscription renewed',
          body: `Your Ollvy Pro subscription has been renewed for ₹${(payment?.amount || 0) / 100}.`,
          data: { subscription_id: subscriptionId },
          read: false,
        });
        break;
      }

      case 'subscription.cancelled': {
        const subscriptionId = subscription?.id;

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('ollvy_pro_subscription_id', subscriptionId)
          .single();

        if (user) {
          // Set grace period - don't immediately revoke
          await supabase
            .from('users')
            .update({
              ollvy_pro_status: 'grace',
              ollvy_pro_cancelled_at: now.toISOString(),
            })
            .eq('id', user.id);

          await supabase.from('notifications').insert({
            user_id: user.id,
            type: 'pro_cancelled',
            title: 'Ollvy Pro subscription cancelled',
            body: 'Your subscription has been cancelled. You have 7 days to resubscribe before losing Pro features.',
            data: { subscription_id: subscriptionId },
            read: false,
          });
        }
        break;
      }

      case 'subscription.halted': {
        const subscriptionId = subscription?.id;

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('ollvy_pro_subscription_id', subscriptionId)
          .single();

        if (user) {
          await supabase
            .from('users')
            .update({
              ollvy_pro_status: 'grace',
              ollvy_pro_halted_at: now.toISOString(),
            })
            .eq('id', user.id);

          await supabase.from('notifications').insert({
            user_id: user.id,
            type: 'pro_halted',
            title: 'Payment failed for Ollvy Pro',
            body: 'We couldn\'t charge your card. Please update your payment method to continue using Pro features.',
            data: { subscription_id: subscriptionId },
            read: false,
          });

          // Admin notification
          await supabase.from('admin_notifications').insert({
            type: 'pro_payment_failed',
            title: 'Pro subscription payment failed',
            message: `User ${user.id} Pro subscription halted due to payment failure.`,
            data: { user_id: user.id, subscription_id: subscriptionId },
            read: false,
          });
        }
        break;
      }

      default:
        console.log('Unhandled pro subscription event:', event);
    }

    return new Response(
      JSON.stringify({ ok: true, event }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('pro-subscription-webhook error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// check-retainer-pauses
// Full implementation per §22
//
// Cron: daily 11:30am IST
// Auto-resume retainers where pause_start_date > 1 month ago
// Calls Razorpay resume API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
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
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    let retainersResumed = 0;

    // Find paused retainers where pause_start_date > 1 month ago
    const { data: pausedRetainers, error: fetchError } = await supabase
      .from('retainer_subscriptions')
      .select('id, razorpay_subscription_id, user_id, pause_start_date')
      .eq('status', 'paused')
      .lt('pause_start_date', oneMonthAgo.toISOString());

    if (fetchError) {
      throw new Error(`Failed to fetch paused retainers: ${fetchError.message}`);
    }

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    for (const retainer of pausedRetainers || []) {
      try {
        // Resume Razorpay subscription
        if (retainer.razorpay_subscription_id && razorpayKeyId && razorpayKeySecret) {
          const authHeader = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

          const rzpResponse = await fetch(
            `https://api.razorpay.com/v1/subscriptions/${retainer.razorpay_subscription_id}/resume`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${authHeader}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ resume_at: 'now' }),
            }
          );

          if (!rzpResponse.ok) {
            console.error(`Failed to resume Razorpay subscription ${retainer.razorpay_subscription_id}`);
            continue;
          }
        }

        // Update retainer status
        const { error: updateError } = await supabase
          .from('retainer_subscriptions')
          .update({
            status: 'active',
            pause_start_date: null,
            resumed_at: now.toISOString()
          })
          .eq('id', retainer.id);

        if (!updateError) {
          retainersResumed++;

          // Send notification to user
          await supabase.from('notifications').insert({
            user_id: retainer.user_id,
            type: 'retainer_resumed',
            title: 'Your retainer has been resumed',
            body: 'Your retainer subscription has been automatically resumed after the 1-month pause period.',
            data: { retainer_id: retainer.id },
            read: false,
          });
        }
      } catch (e) {
        console.error(`Error resuming retainer ${retainer.id}:`, e);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        retainers_resumed: retainersResumed,
        processed_at: now.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('check-retainer-pauses error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// resume-retainer
// Full implementation per §6 and §22
//
// Spec:
// - Manual resume by user OR auto-resume by check-retainer-pauses cron
// - Razorpay resume API call

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUser, verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface ResumeRetainerBody {
  retainer_subscription_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseAdmin();
    let userId: string | undefined;
    let isCronJob = false;

    // Check if this is a cron job or user request
    const cronAuth = verifyCron(req);
    if (cronAuth.success) {
      isCronJob = true;
    } else {
      const authResult = await verifyUser(req);
      if (!authResult.success) {
        return new Response(
          JSON.stringify({ ok: false, error: authResult.error }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: authResult.status || 401 }
        );
      }
      userId = authResult.userId!;
    }

    const body: ResumeRetainerBody = await req.json();
    const { retainer_subscription_id } = body;

    if (!retainer_subscription_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'retainer_subscription_id is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Fetch retainer
    let query = supabase
      .from('retainer_subscriptions')
      .select('*, service_packages!inner (name)')
      .eq('id', retainer_subscription_id);

    // If user request, verify ownership
    if (!isCronJob && userId) {
      query = query.eq('user_id', userId);
    }

    const { data: retainer, error: retainerError } = await query.single();

    if (retainerError || !retainer) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Retainer subscription not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Check current status
    if (retainer.status !== 'paused') {
      return new Response(
        JSON.stringify({ ok: false, error: `Cannot resume retainer with status: ${retainer.status}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Call Razorpay resume API
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    const environment = Deno.env.get('ENVIRONMENT') || 'development';

    if (environment !== 'development' && retainer.razorpay_subscription_id) {
      const razorpayResponse = await fetch(
        `https://api.razorpay.com/v1/subscriptions/${retainer.razorpay_subscription_id}/resume`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        console.error('Razorpay resume failed:', errorData);
        return new Response(
          JSON.stringify({ ok: false, error: 'Failed to resume subscription with payment provider' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    // Calculate next billing date (25th of next month)
    const nextBillingDate = new Date();
    if (nextBillingDate.getDate() >= 25) {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    }
    nextBillingDate.setDate(25);

    // Update retainer status
    await supabase
      .from('retainer_subscriptions')
      .update({
        status: 'active',
        pause_start_date: null,
        next_billing_date: nextBillingDate.toISOString().split('T')[0],
      })
      .eq('id', retainer_subscription_id);

    // Notify user
    await supabase.from('notifications').insert({
      user_id: retainer.user_id,
      type: 'retainer_resumed',
      title: 'Subscription Resumed',
      body: `Your ${retainer.service_packages.name} subscription is active again. Billing resumes on ${nextBillingDate.toLocaleDateString()}.`,
    });

    // Add system message to chat
    if (retainer.chat_conversation_id) {
      await supabase.from('chat_messages').insert({
        conversation_id: retainer.chat_conversation_id,
        sender_type: 'system',
        content: `Your retainer is active again. Billing resumes on ${nextBillingDate.toLocaleDateString()}.`,
      });
    }

    console.log(`Resumed retainer ${retainer_subscription_id}${isCronJob ? ' (auto-resume)' : ''}`);

    return new Response(
      JSON.stringify({
        ok: true,
        retainer_subscription_id,
        next_billing_date: nextBillingDate.toISOString(),
        message: 'Subscription resumed successfully',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Resume retainer error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

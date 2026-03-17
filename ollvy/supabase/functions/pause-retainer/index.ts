// pause-retainer
// Full implementation per §6 and §22
//
// Spec:
// - Max 2 pauses per calendar year per retainer
// - Max 1 month per pause
// - Mid-cycle pause: current month's order completes normally
// - Razorpay pause API call

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUser } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface PauseRetainerBody {
  retainer_subscription_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await verifyUser(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: authResult.status || 401 }
      );
    }

    const userId = authResult.userId!;
    const supabase = getSupabaseAdmin();

    const body: PauseRetainerBody = await req.json();
    const { retainer_subscription_id } = body;

    if (!retainer_subscription_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'retainer_subscription_id is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Fetch retainer
    const { data: retainer, error: retainerError } = await supabase
      .from('retainer_subscriptions')
      .select('*, service_packages!inner (name)')
      .eq('id', retainer_subscription_id)
      .eq('user_id', userId)
      .single();

    if (retainerError || !retainer) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Retainer subscription not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Check current status
    if (retainer.status !== 'active') {
      return new Response(
        JSON.stringify({ ok: false, error: `Cannot pause retainer with status: ${retainer.status}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check pause count (max 2 per year)
    const pauseCount = await supabase.rpc('get_retainer_pause_count_this_year', { retainer_id: retainer_subscription_id });
    
    if ((pauseCount.data || 0) >= 2) {
      const nextYear = new Date().getFullYear() + 1;
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: `Maximum 2 pauses per year. Next available: January 1, ${nextYear}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Calculate auto-resume date (1 month from now)
    const resumeDate = new Date();
    resumeDate.setMonth(resumeDate.getMonth() + 1);

    // Call Razorpay pause API
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    const environment = Deno.env.get('ENVIRONMENT') || 'development';

    if (environment !== 'development' && retainer.razorpay_subscription_id) {
      const razorpayResponse = await fetch(
        `https://api.razorpay.com/v1/subscriptions/${retainer.razorpay_subscription_id}/pause`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pause_initiated_by: 'customer' }),
        }
      );

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        console.error('Razorpay pause failed:', errorData);
        return new Response(
          JSON.stringify({ ok: false, error: 'Failed to pause subscription with payment provider' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    // Update retainer status
    await supabase
      .from('retainer_subscriptions')
      .update({
        status: 'paused',
        pause_count: (retainer.pause_count || 0) + 1,
        pause_start_date: new Date().toISOString(),
      })
      .eq('id', retainer_subscription_id);

    // Notify user
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'retainer_paused',
      title: 'Subscription Paused',
      body: `Your ${retainer.service_packages.name} subscription has been paused until ${resumeDate.toLocaleDateString()}.`,
    });

    // Add system message to chat
    if (retainer.chat_conversation_id) {
      await supabase.from('chat_messages').insert({
        conversation_id: retainer.chat_conversation_id,
        sender_type: 'system',
        content: `Your retainer has been paused until ${resumeDate.toLocaleDateString()}.`,
      });
    }

    console.log(`Paused retainer ${retainer_subscription_id}`);

    return new Response(
      JSON.stringify({
        ok: true,
        retainer_subscription_id,
        pause_count: (retainer.pause_count || 0) + 1,
        resume_date: resumeDate.toISOString(),
        message: 'Subscription paused successfully',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Pause retainer error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

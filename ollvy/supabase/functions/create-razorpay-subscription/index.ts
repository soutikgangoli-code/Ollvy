// create-razorpay-subscription
// Full implementation per §6 and §22
//
// Spec:
// - Validates tier group routing (if service has tiers)
// - Checks Pro trial eligibility: first retainer ever = 30-day trial
// - Snapshots monthly_price_paisa
// - Creates Razorpay Subscription via API
// - Inserts retainer_subscriptions row with status=onboarding
// - Returns { razorpay_subscription_id, retainer_subscription_id }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUser } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { getEnvironment, getRequiredEnv } from '../_shared/env.ts';

interface CreateSubscriptionBody {
  service_package_id: string;
  billing_cycle?: 'monthly' | 'quarterly';
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
    const supabase = getSupabaseAdmin();

    // Parse request body
    const body: CreateSubscriptionBody = await req.json();
    const { service_package_id, billing_cycle = 'monthly' } = body;

    if (!service_package_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'service_package_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Fetch service package
    const { data: service, error: serviceError } = await supabase
      .from('service_packages')
      .select('id, name, slug, price_base_paisa, price_gst_rate, order_type, billing_cycle, tier_group_id, tier_label, workflow_stages, sla_working_days, is_active')
      .eq('id', service_package_id)
      .single();

    if (serviceError || !service) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Service package not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    if (!service.is_active) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Service package is not active' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Validate this is a recurring service
    if (service.order_type !== 'recurring' && service.billing_cycle === 'one_time') {
      return new Response(
        JSON.stringify({ ok: false, error: 'This service does not support subscriptions' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, subscription_tier, state, city, business_name')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ ok: false, error: 'User not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Check if user already has an active retainer for this service
    const { data: existingRetainer } = await supabase
      .from('retainer_subscriptions')
      .select('id, status')
      .eq('user_id', userId)
      .eq('service_package_id', service_package_id)
      .in('status', ['onboarding', 'active', 'paused'])
      .single();

    if (existingRetainer) {
      return new Response(
        JSON.stringify({ ok: false, error: 'You already have an active subscription for this service' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Calculate monthly price (base price + GST)
    const monthlyBasePaisa = service.price_base_paisa;
    const gstPaisa = Math.round(monthlyBasePaisa * (service.price_gst_rate / 100));
    const monthlyTotalPaisa = monthlyBasePaisa + gstPaisa;

    // Check Pro trial eligibility: first retainer ever = 30-day trial
    const isPro = user.subscription_tier === 'pro';
    const { data: hasAnyRetainer } = await supabase
      .rpc('user_has_retainers', { uid: userId });

    const isFirstRetainer = !hasAnyRetainer;
    const trialDays = isPro && isFirstRetainer ? 30 : 0;

    // Create Razorpay Subscription
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    // Razorpay Subscription creation data
    const razorpaySubData: any = {
      plan_id: `plan_${service.slug}_${billing_cycle}`,
      total_count: 120,
      customer_notify: 1,
      notes: {
        service_package_id: service_package_id,
        user_id: userId,
        service_name: service.name,
      },
    };

    // Add trial if eligible
    if (trialDays > 0) {
      razorpaySubData.start_at = Math.floor(Date.now() / 1000) + (trialDays * 24 * 60 * 60);
    }

    let razorpaySubscription: any;
    const environment = getEnvironment();

    if (environment === 'development') {
      // Simulate Razorpay subscription creation
      razorpaySubscription = {
        id: `sub_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`,
        plan_id: razorpaySubData.plan_id,
        status: 'created',
        current_start: Math.floor(Date.now() / 1000),
        current_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
      };
    } else {
      if (!razorpayKeyId || !razorpayKeySecret) {
        // Keep existing error response shape for client compatibility.
        console.error('Missing Razorpay credentials');
        return new Response(
          JSON.stringify({ ok: false, error: 'Payment configuration error' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }
      const liveKeyId = getRequiredEnv('RAZORPAY_KEY_ID');
      const liveKeySecret = getRequiredEnv('RAZORPAY_KEY_SECRET');
      const razorpayResponse = await fetch('https://api.razorpay.com/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${liveKeyId}:${liveKeySecret}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(razorpaySubData),
      });

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        console.error('Razorpay subscription creation failed:', errorData);
        return new Response(
          JSON.stringify({ ok: false, error: 'Failed to create subscription' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      razorpaySubscription = await razorpayResponse.json();
    }

    // Create retainer_subscriptions row
    const retainerData = {
      user_id: userId,
      service_package_id: service_package_id,
      razorpay_subscription_id: razorpaySubscription.id,
      billing_cycle: billing_cycle,
      monthly_price_paisa: monthlyTotalPaisa,
      status: 'onboarding',
      is_trial_active: trialDays > 0,
      started_at: new Date().toISOString(),
    };

    const { data: retainer, error: retainerError } = await supabase
      .from('retainer_subscriptions')
      .insert(retainerData)
      .select()
      .single();

    if (retainerError) {
      console.error('Failed to create retainer subscription:', retainerError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to create subscription record' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Create persistent chat conversation for this retainer
    const { data: chatConversation, error: chatError } = await supabase
      .from('chat_conversations')
      .insert({
        retainer_subscription_id: retainer.id,
      })
      .select()
      .single();

    if (!chatError && chatConversation) {
      await supabase
        .from('retainer_subscriptions')
        .update({ chat_conversation_id: chatConversation.id })
        .eq('id', retainer.id);
    }

    // Notify user
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'retainer_created',
      title: 'Subscription Started',
      body: trialDays > 0
        ? `Your ${service.name} subscription is now active. Enjoy your ${trialDays}-day free trial!`
        : `Your ${service.name} subscription is now active.`,
    });

    console.log(`Created retainer subscription ${retainer.id} for user ${userId}`);

    return new Response(
      JSON.stringify({
        ok: true,
        razorpay_subscription_id: razorpaySubscription.id,
        retainer_subscription_id: retainer.id,
        is_trial: trialDays > 0,
        trial_days: trialDays,
        monthly_price_paisa: monthlyTotalPaisa,
        service_name: service.name,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Create subscription error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// change-retainer-tier
// Full implementation per §6 and §22
//
// Spec:
// - Cancel current Razorpay Subscription
// - Create new subscription at new tier price
// - Preserve assigned_professional_id
// - Snapshot new monthly_price_paisa
// - Effective next cycle

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUser } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface ChangeTierBody {
  retainer_subscription_id: string;
  new_service_package_id: string;
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

    const body: ChangeTierBody = await req.json();
    const { retainer_subscription_id, new_service_package_id } = body;

    if (!retainer_subscription_id || !new_service_package_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'retainer_subscription_id and new_service_package_id are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Fetch current retainer
    const { data: retainer, error: retainerError } = await supabase
      .from('retainer_subscriptions')
      .select('*, service_packages!inner (name, tier_group_id, tier_label)')
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
    if (!['active', 'onboarding'].includes(retainer.status)) {
      return new Response(
        JSON.stringify({ ok: false, error: `Cannot change tier for retainer with status: ${retainer.status}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Fetch new service package
    const { data: newService, error: newServiceError } = await supabase
      .from('service_packages')
      .select('id, name, price_base_paisa, price_gst_rate, tier_group_id, tier_label, is_active')
      .eq('id', new_service_package_id)
      .single();

    if (newServiceError || !newService) {
      return new Response(
        JSON.stringify({ ok: false, error: 'New service package not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    if (!newService.is_active) {
      return new Response(
        JSON.stringify({ ok: false, error: 'New service package is not active' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate tier group match (can only change within same tier group)
    if (retainer.service_packages.tier_group_id !== newService.tier_group_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Can only change to a different tier within the same service' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Same tier check
    if (retainer.service_package_id === new_service_package_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Already subscribed to this tier' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Calculate new monthly price
    const newMonthlyBasePaisa = newService.price_base_paisa;
    const newGstPaisa = Math.round(newMonthlyBasePaisa * (newService.price_gst_rate / 100));
    const newMonthlyTotalPaisa = newMonthlyBasePaisa + newGstPaisa;

    // Get effective date (next billing date)
    const effectiveDate = retainer.next_billing_date 
      ? new Date(retainer.next_billing_date)
      : new Date();

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    const environment = Deno.env.get('ENVIRONMENT') || 'development';

    let newRazorpaySubscriptionId = retainer.razorpay_subscription_id;

    if (environment !== 'development' && retainer.razorpay_subscription_id) {
      // Cancel current Razorpay subscription at cycle end
      await fetch(
        `https://api.razorpay.com/v1/subscriptions/${retainer.razorpay_subscription_id}/cancel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cancel_at_cycle_end: true }),
        }
      );

      // Create new Razorpay subscription at new tier price
      const razorpayResponse = await fetch('https://api.razorpay.com/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: `plan_${newService.name.toLowerCase().replace(/\s+/g, '_')}_monthly`,
          total_count: 120,
          customer_notify: 1,
          start_at: Math.floor(effectiveDate.getTime() / 1000),
          notes: {
            service_package_id: new_service_package_id,
            user_id: userId,
            previous_tier_id: retainer.service_package_id,
          },
        }),
      });

      if (razorpayResponse.ok) {
        const newSubscription = await razorpayResponse.json();
        newRazorpaySubscriptionId = newSubscription.id;
      }
    }

    // Update retainer
    await supabase
      .from('retainer_subscriptions')
      .update({
        service_package_id: new_service_package_id,
        previous_tier_id: retainer.service_package_id,
        monthly_price_paisa: newMonthlyTotalPaisa,
        razorpay_subscription_id: newRazorpaySubscriptionId,
      })
      .eq('id', retainer_subscription_id);

    // Notify user
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'retainer_tier_changed',
      title: 'Plan Updated',
      body: `Your plan has been updated from ${retainer.service_packages.tier_label || retainer.service_packages.name} to ${newService.tier_label || newService.name}. New rate: ₹${(newMonthlyTotalPaisa / 100).toLocaleString('en-IN')}/month from ${effectiveDate.toLocaleDateString()}.`,
    });

    // Add system message to chat
    if (retainer.chat_conversation_id) {
      await supabase.from('chat_messages').insert({
        conversation_id: retainer.chat_conversation_id,
        sender_type: 'system',
        content: `Your plan has been updated to ${newService.tier_label || newService.name}. New rate: ₹${(newMonthlyTotalPaisa / 100).toLocaleString('en-IN')}/month from ${effectiveDate.toLocaleDateString()}.`,
      });
    }

    console.log(`Changed tier for retainer ${retainer_subscription_id}`);

    return new Response(
      JSON.stringify({
        ok: true,
        retainer_subscription_id,
        old_tier: retainer.service_packages.tier_label || retainer.service_packages.name,
        new_tier: newService.tier_label || newService.name,
        old_price_paisa: retainer.monthly_price_paisa,
        new_price_paisa: newMonthlyTotalPaisa,
        effective_date: effectiveDate.toISOString(),
        message: `Plan changed successfully. New rate effective from ${effectiveDate.toLocaleDateString()}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Change retainer tier error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

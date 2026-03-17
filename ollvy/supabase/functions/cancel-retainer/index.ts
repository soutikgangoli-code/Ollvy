// cancel-retainer
// Full implementation per §6 and §22
//
// Spec:
// - If is_trial_active: immediate cancel. No charge.
// - Else: effective end of billing cycle. Current month's work completes.
// - sync-retainer-obligations called to revert covered_by_retainer
// - admin_override=true bypasses end-of-cycle logic (for admin force cancel)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUser, verifyAdmin } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface CancelRetainerBody {
  retainer_subscription_id: string;
  reason?: string;
  admin_override?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseAdmin();
    let userId: string | undefined;
    let isAdmin = false;

    // Try admin auth first, then user auth
    const adminAuth = await verifyAdmin(req);
    if (adminAuth.success) {
      isAdmin = true;
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

    const body: CancelRetainerBody = await req.json();
    const { retainer_subscription_id, reason, admin_override } = body;

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
    if (!isAdmin && userId) {
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
    if (retainer.status === 'cancelled') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Retainer is already cancelled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Determine if immediate cancel or end-of-cycle
    const isImmediate = retainer.is_trial_active || (isAdmin && admin_override);

    // Calculate effective cancellation date
    let effectiveDate: Date;
    if (isImmediate) {
      effectiveDate = new Date();
    } else {
      // End of current billing cycle (next billing date)
      effectiveDate = retainer.next_billing_date 
        ? new Date(retainer.next_billing_date)
        : new Date();
    }

    // Document delivery date (5 working days after effective date)
    const documentDeliveryDate = new Date(effectiveDate);
    let workingDays = 0;
    while (workingDays < 5) {
      documentDeliveryDate.setDate(documentDeliveryDate.getDate() + 1);
      const dayOfWeek = documentDeliveryDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
    }

    // Call Razorpay cancel API
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    const environment = Deno.env.get('ENVIRONMENT') || 'development';

    if (environment !== 'development' && retainer.razorpay_subscription_id) {
      const razorpayResponse = await fetch(
        `https://api.razorpay.com/v1/subscriptions/${retainer.razorpay_subscription_id}/cancel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cancel_at_cycle_end: !isImmediate,
          }),
        }
      );

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        console.error('Razorpay cancel failed:', errorData);
        // Don't fail the request - continue with DB update
      }
    }

    // Update retainer status
    await supabase
      .from('retainer_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_effective_date: effectiveDate.toISOString().split('T')[0],
      })
      .eq('id', retainer_subscription_id);

    // Sync compliance obligations - revert covered_by_retainer
    await supabase
      .from('compliance_obligations')
      .update({ covered_by_retainer: false })
      .eq('user_id', retainer.user_id)
      .eq('retainer_subscription_id', retainer_subscription_id);

    // Notify user
    await supabase.from('notifications').insert({
      user_id: retainer.user_id,
      type: 'retainer_cancelled',
      title: 'Subscription Cancelled',
      body: isImmediate 
        ? `Your ${retainer.service_packages.name} subscription has been cancelled.`
        : `Your ${retainer.service_packages.name} subscription will end on ${effectiveDate.toLocaleDateString()}.`,
    });

    // Add system message to chat
    if (retainer.chat_conversation_id) {
      await supabase.from('chat_messages').insert({
        conversation_id: retainer.chat_conversation_id,
        sender_type: 'system',
        content: isImmediate
          ? 'Your retainer subscription has been cancelled.'
          : `Your retainer subscription will end on ${effectiveDate.toLocaleDateString()}. Any ongoing work will be completed.`,
      });
    }

    // Create admin notification if admin cancelled
    if (isAdmin) {
      await supabase.from('admin_notifications').insert({
        type: 'retainer_force_cancelled',
        title: 'Retainer Force Cancelled',
        message: `Retainer ${retainer_subscription_id} was force cancelled by admin. Reason: ${reason || 'Not specified'}`,
        severity: 'info',
      });
    }

    console.log(`Cancelled retainer ${retainer_subscription_id}${isImmediate ? ' (immediate)' : ' (end of cycle)'}`);

    return new Response(
      JSON.stringify({
        ok: true,
        retainer_subscription_id,
        immediate: isImmediate,
        effective_date: effectiveDate.toISOString(),
        document_delivery_date: documentDeliveryDate.toISOString(),
        message: isImmediate 
          ? 'Subscription cancelled immediately'
          : `Subscription will end on ${effectiveDate.toLocaleDateString()}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Cancel retainer error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

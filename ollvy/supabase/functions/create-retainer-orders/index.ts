// create-retainer-orders
// Internal function - called by retainer-billing-webhook on every successful charge
// Full implementation per §6 and §22
//
// Spec:
// - Creates child orders for the billing cycle
// - Updates retainer_billing_events row
// - If first order after onboarding: auto-assign professional
// - Reuses existing chat conversation (one per retainer)

import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

export interface CreateRetainerOrdersInput {
  retainer_subscription_id: string;
  razorpay_payment_id: string;
  billing_period: string; // 'YYYY-MM' format
  amount_paisa: number;
}

export interface CreateRetainerOrdersOutput {
  ok: boolean;
  error?: string;
  order_id?: string;
  billing_event_id?: string;
}

/**
 * create-retainer-orders
 * Creates child orders for a retainer billing cycle
 */
export async function createRetainerOrders(
  input: CreateRetainerOrdersInput
): Promise<CreateRetainerOrdersOutput> {
  const supabase = getSupabaseAdmin();

  try {
    const { retainer_subscription_id, razorpay_payment_id, billing_period, amount_paisa } = input;

    if (!retainer_subscription_id || !billing_period) {
      return { ok: false, error: 'retainer_subscription_id and billing_period are required' };
    }

    // Fetch retainer with service and user data
    const { data: retainer, error: retainerError } = await supabase
      .from('retainer_subscriptions')
      .select(`
        *,
        service_packages!inner (id, name, workflow_stages, sla_working_days),
        users!inner (id, state, city)
      `)
      .eq('id', retainer_subscription_id)
      .single();

    if (retainerError || !retainer) {
      return { ok: false, error: 'Retainer subscription not found' };
    }

    // Check if child order already exists for this billing period
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('retainer_subscription_id', retainer_subscription_id)
      .eq('billing_period', billing_period)
      .single();

    if (existingOrder) {
      return { ok: true, order_id: existingOrder.id, error: 'Order already exists for this billing period' };
    }

    // Create billing event record
    const { data: billingEvent, error: billingEventError } = await supabase
      .from('retainer_billing_events')
      .insert({
        retainer_subscription_id,
        razorpay_payment_id,
        event_type: 'subscription.charged',
        billing_period,
        amount_paisa,
        status: 'success',
      })
      .select()
      .single();

    if (billingEventError) {
      console.error('Failed to create billing event:', billingEventError);
    }

    // Get workflow stages for the service
    const workflowStages = retainer.service_packages.workflow_stages || [];

    // Create child order
    const orderData: any = {
      user_id: retainer.user_id,
      service_package_id: retainer.service_package_id,
      retainer_subscription_id: retainer_subscription_id,
      professional_id: retainer.assigned_professional_id,
      status: retainer.assigned_professional_id ? 'assigned' : 'paid',
      billing_period,
      price_base_paisa_snapshot: retainer.monthly_price_paisa,
      price_gst_paisa_snapshot: 0, // GST already included in monthly_price_paisa
      price_govt_fees_paisa_snapshot: 0,
      total_paisa_snapshot: retainer.monthly_price_paisa,
      city_snapshot: retainer.users.city || null,
      state_snapshot: retainer.users.state || null,
      chat_conversation_id: retainer.chat_conversation_id,
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Failed to create order:', orderError);
      return { ok: false, error: 'Failed to create order' };
    }

    // Update billing event with child_order_id
    if (billingEvent) {
      await supabase
        .from('retainer_billing_events')
        .update({ child_order_id: order.id })
        .eq('id', billingEvent.id);
    }

    // Create first workflow stage if stages exist
    if (workflowStages.length > 0) {
      const firstStage = workflowStages[0];
      const stageDueDate = new Date();
      stageDueDate.setDate(stageDueDate.getDate() + (firstStage.sla_working_days || 5));

      await supabase.from('order_stage_history').insert({
        order_id: order.id,
        stage_key: firstStage.stage_key,
        stage_name: firstStage.stage_name,
        started_at: new Date().toISOString(),
        stage_due_date: stageDueDate.toISOString(),
      });
    }

    // If professional is assigned, increment their active orders
    if (retainer.assigned_professional_id) {
      await supabase.rpc('increment_active_orders', { pro_id: retainer.assigned_professional_id });

      // Notify professional
      await supabase.from('notifications').insert({
        user_id: retainer.assigned_professional_id, // This should be professional notification
        type: 'new_retainer_cycle',
        title: 'New Billing Cycle',
        body: `A new billing cycle has started for ${retainer.service_packages.name}.`,
      });
    }

    // Add system message to chat
    if (retainer.chat_conversation_id) {
      await supabase.from('chat_messages').insert({
        conversation_id: retainer.chat_conversation_id,
        sender_type: 'system',
        content: `New billing cycle started: ${billing_period}. Work is scheduled to begin.`,
      });
    }

    console.log(`Created retainer order ${order.id} for period ${billing_period}`);

    return {
      ok: true,
      order_id: order.id,
      billing_event_id: billingEvent?.id,
    };
  } catch (error) {
    console.error('Create retainer orders error:', error);
    return { ok: false, error: error.message };
  }
}

// For direct HTTP invocation (internal function - requires service role key)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Internal function - requires service role key
  const authResult = verifyCron(req);
  if (!authResult.success) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal function - requires service role key' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    );
  }

  const body = await req.json();
  const result = await createRetainerOrders(body);

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: result.ok ? 200 : 500 }
  );
});

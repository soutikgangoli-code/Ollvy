// generate-engagement-letter
// Full implementation per §22
// Internal function - called by razorpay-webhook after payment confirmation
//
// Spec:
// - Generate engagement letter for the order
// - Contains: service scope, timeline, business details
// - In production: generate PDF via @react-pdf/renderer and store in /engagement-letters/

import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

export interface GenerateEngagementLetterInput {
  order_id: string;
}

export interface GenerateEngagementLetterOutput {
  ok: boolean;
  error?: string;
  engagement_letter_id?: string;
}

/**
 * generate-engagement-letter
 *
 * Creates an engagement letter record for the order with service scope and timeline.
 * In production, would generate a PDF document.
 */
export async function generateEngagementLetter(
  input: GenerateEngagementLetterInput
): Promise<GenerateEngagementLetterOutput> {
  const supabase = getSupabaseAdmin();

  try {
    const { order_id } = input;

    if (!order_id) {
      return { ok: false, error: 'order_id is required' };
    }

    // Fetch order with service and user details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        service_packages!inner (id, name, short_description, sla_working_days, workflow_stages),
        users!inner (id, business_name, business_type, state, city)
      `)
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return { ok: false, error: 'Order not found' };
    }

    // Check if engagement letter already exists
    const { data: existing } = await supabase
      .from('engagement_letters')
      .select('id')
      .eq('order_id', order_id)
      .single();

    if (existing) {
      return { ok: true, engagement_letter_id: existing.id, error: 'Engagement letter already exists' };
    }

    // Generate engagement letter content
    const workflowStages = order.service_packages.workflow_stages || [];
    const stageDescriptions = workflowStages.map((stage: any, index: number) => ({
      step: index + 1,
      name: stage.stage_name,
      description: stage.description || '',
      sla_days: stage.sla_working_days || 1,
    }));

    const letterContent = {
      service_name: order.service_packages.name,
      service_description: order.service_packages.short_description,
      business_name: order.users.business_name || 'Client',
      business_type: order.users.business_type,
      location: `${order.users.city || ''}, ${order.users.state || ''}`.trim().replace(/^,\s*|,\s*$/g, ''),
      total_amount_paisa: order.total_paisa_snapshot,
      sla_working_days: order.service_packages.sla_working_days,
      workflow_stages: stageDescriptions,
      order_date: order.created_at,
      expected_completion_date: calculateCompletionDate(order.created_at, order.service_packages.sla_working_days),
    };

    // Create engagement letter record
    const { data: letter, error: insertError } = await supabase
      .from('engagement_letters')
      .insert({
        order_id,
        user_id: order.user_id,
        service_name: order.service_packages.name,
        content: letterContent,
        generated_at: new Date().toISOString(),
        // pdf_url will be set after PDF generation in production
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create engagement letter:', insertError);
      return { ok: false, error: 'Failed to create engagement letter' };
    }

    // Notify user
    await supabase.from('notifications').insert({
      user_id: order.user_id,
      type: 'engagement_letter_ready',
      title: 'Engagement Letter Ready',
      body: 'Your engagement letter is now available for download.',
    });

    console.log(`Generated engagement letter ${letter.id} for order ${order_id}`);

    return {
      ok: true,
      engagement_letter_id: letter.id,
    };
  } catch (error) {
    console.error('Generate engagement letter error:', error);
    return { ok: false, error: error.message };
  }
}

/**
 * Calculate expected completion date based on SLA working days
 */
function calculateCompletionDate(startDate: string, slaWorkingDays: number): string {
  const start = new Date(startDate);
  let daysAdded = 0;
  const result = new Date(start);

  while (daysAdded < slaWorkingDays) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }

  return result.toISOString();
}

// For direct HTTP invocation during development/testing
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // For testing: require service role key (internal function)
  const authResult = verifyCron(req);
  if (!authResult.success) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal function - requires service role key' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    );
  }

  const body = await req.json();
  const result = await generateEngagementLetter(body);

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: result.ok ? 200 : 500 }
  );
});

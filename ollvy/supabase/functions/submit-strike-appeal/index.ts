// submit-strike-appeal
// HTTP POST (auth, professional)
// Rate limit: 1 appeal per sla_alert_id
// 24h window from strike time
// Inserts strike_appeals row
// Creates admin_notification

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyProfessional } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface SubmitAppealInput {
  sla_alert_id: string;
  reason: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify JWT and confirm user is a professional
    const authResult = await verifyProfessional(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 403,
        }
      );
    }

    const professionalId = authResult.professionalId!;
    const body: SubmitAppealInput = await req.json();
    const { sla_alert_id, reason } = body;

    // Validate input
    if (!sla_alert_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'sla_alert_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!reason || reason.trim().length < 10) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Please provide a detailed reason (at least 10 characters)' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get the SLA alert and verify ownership
    const { data: slaAlert, error: alertError } = await supabase
      .from('sla_alerts')
      .select(`
        id,
        order_id,
        stage_key,
        created_at,
        professional_strike_applied,
        orders!inner (
          id,
          professional_id,
          order_number
        )
      `)
      .eq('id', sla_alert_id)
      .single();

    if (alertError || !slaAlert) {
      return new Response(
        JSON.stringify({ ok: false, error: 'SLA alert not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    const order = slaAlert.orders as any;

    // Verify this professional owns the order
    if (order.professional_id !== professionalId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'You can only appeal strikes on your own orders' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    // Check if a strike was actually applied
    if (!slaAlert.professional_strike_applied) {
      return new Response(
        JSON.stringify({ ok: false, error: 'No strike was applied for this SLA alert' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Check 24h window
    const strikeTime = new Date(slaAlert.created_at);
    const now = new Date();
    const hoursSinceStrike = (now.getTime() - strikeTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceStrike > 24) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Appeal window has expired. You can only appeal within 24 hours of the strike.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Check if an appeal already exists for this SLA alert (rate limit)
    const { data: existingAppeal } = await supabase
      .from('strike_appeals')
      .select('id')
      .eq('sla_alert_id', sla_alert_id)
      .single();

    if (existingAppeal) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'You have already submitted an appeal for this strike.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Insert strike appeal
    const { data: appeal, error: insertError } = await supabase
      .from('strike_appeals')
      .insert({
        professional_id: professionalId,
        order_id: slaAlert.order_id,
        sla_alert_id: sla_alert_id,
        reason: reason.trim(),
        submitted_at: now.toISOString(),
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to insert appeal:', insertError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to submit appeal. Please try again.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Get professional name for notification
    const { data: professional } = await supabase
      .from('professionals')
      .select('name')
      .eq('id', professionalId)
      .single();

    // Create admin notification
    await supabase.from('admin_notifications').insert({
      type: 'strike_appeal',
      title: 'New Strike Appeal',
      body: `${professional?.name || 'Professional'} has appealed a strike on order ${order.order_number}. Please review within 48 hours.`,
      related_id: appeal.id,
      related_type: 'strike_appeal',
    });

    return new Response(
      JSON.stringify({
        ok: true,
        appeal_id: appeal.id,
        message: 'Your appeal has been submitted. Admin will review within 48 hours.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('submit-strike-appeal error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

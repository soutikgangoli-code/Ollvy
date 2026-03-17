// reapply-professional
// Full implementation per §22
//
// HTTP POST (auth, professional)
// Allows rejected professionals to reapply after cooldown period
// Creates new application preserving some data

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyProfessional } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const COOLDOWN_DAYS = 30; // 30 day cooldown before reapplication

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await verifyProfessional(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 401,
        }
      );
    }

    const professionalId = authResult.professionalId;
    const supabase = getSupabaseAdmin();

    // Get professional details
    const { data: professional, error: proError } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', professionalId)
      .single();

    if (proError || !professional) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Professional not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Check if status is rejected or suspended
    if (!['rejected', 'suspended'].includes(professional.status)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Only rejected or suspended professionals can reapply' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Check cooldown period
    const lastRejection = professional.rejected_at || professional.suspended_at;
    if (lastRejection) {
      const cooldownEnd = new Date(new Date(lastRejection).getTime() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
      if (new Date() < cooldownEnd) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: `You can reapply after ${cooldownEnd.toLocaleDateString('en-IN')}`,
            cooldown_ends: cooldownEnd.toISOString()
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
    }

    // Create new application
    const { data: application, error: insertError } = await supabase
      .from('professional_applications')
      .insert({
        name: professional.name,
        phone: professional.phone,
        email: professional.email,
        city: professional.city,
        state: professional.state,
        profession_type: professional.profession_type,
        years_experience: professional.years_experience,
        services_offered: professional.services_offered,
        monthly_capacity: professional.monthly_order_capacity,
        linkedin_url: professional.linkedin_url,
        source: 'reapplication',
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        previous_professional_id: professionalId,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to create application' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Create admin notification
    await supabase.from('admin_notifications').insert({
      type: 'professional_reapplication',
      title: 'Professional reapplication received',
      message: `${professional.name} has reapplied after previous ${professional.status} status.`,
      data: {
        application_id: application.id,
        professional_id: professionalId,
        previous_status: professional.status
      },
      read: false,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        application_id: application.id,
        message: 'Reapplication submitted successfully. We will review it within 72 hours.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('reapply-professional error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

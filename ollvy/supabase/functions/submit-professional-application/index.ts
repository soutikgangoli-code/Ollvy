// submit-professional-application
// Full implementation per §28
//
// HTTP POST (public)
// Inserts professional_applications row
// Rate limit: 3 submissions/phone/day to prevent spam
// Notifies admin via badge

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface ApplicationInput {
  name: string;
  phone: string;
  email?: string;
  city: string;
  state?: string;
  profession_type: 'ca' | 'lawyer' | 'cs' | 'tax_professional' | 'payroll_specialist' | 'licensing_consultant';
  years_experience: number;
  services_offered?: string[];
  monthly_capacity?: number;
  linkedin_url?: string;
  bar_council_number?: string;
  icai_membership?: string;
  source?: string;
  referral_source?: string;
  referral_code_used?: string;
}

const DAILY_SUBMISSION_LIMIT = 3;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseAdmin();

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Method not allowed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405,
        }
      );
    }

    const body: ApplicationInput = await req.json();

    // Validate required fields
    if (!body.name || !body.phone || !body.city || !body.profession_type || body.years_experience === undefined) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Missing required fields: name, phone, city, profession_type, years_experience',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Normalize phone number
    const normalizedPhone = body.phone.replace(/\D/g, '').slice(-10);
    if (normalizedPhone.length !== 10) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid phone number' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Check rate limit (3 submissions per phone per day)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentSubmissions } = await supabase
      .from('professional_applications')
      .select('id', { count: 'exact', head: true })
      .eq('phone', normalizedPhone)
      .gte('submitted_at', twentyFourHoursAgo);

    if (recentSubmissions !== null && recentSubmissions >= DAILY_SUBMISSION_LIMIT) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Too many applications. Please try again tomorrow.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429,
        }
      );
    }

    // Check for existing application with same phone
    const { data: existingApp } = await supabase
      .from('professional_applications')
      .select('id, status')
      .eq('phone', normalizedPhone)
      .in('status', ['submitted', 'under_review', 'approved'])
      .single();

    if (existingApp) {
      if (existingApp.status === 'approved') {
        return new Response(
          JSON.stringify({
            ok: false,
            error: 'An application with this phone number has already been approved. Please log in to pro.ollvy.com.',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'An application with this phone number is already under review.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Insert application
    const { data: application, error: insertError } = await supabase
      .from('professional_applications')
      .insert({
        name: body.name.trim(),
        phone: normalizedPhone,
        email: body.email?.trim() || null,
        city: body.city.trim(),
        state: body.state?.trim() || null,
        profession_type: body.profession_type,
        years_experience: body.years_experience,
        services_offered: body.services_offered || [],
        monthly_capacity: body.monthly_capacity || 5,
        linkedin_url: body.linkedin_url?.trim() || null,
        bar_council_number: body.bar_council_number?.trim() || null,
        icai_membership: body.icai_membership?.trim() || null,
        source: body.source || 'join_page',
        referral_code_used: body.referral_code_used || null,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Failed to submit application. Please try again.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Create admin notification badge
    await supabase.from('admin_notifications').insert({
      type: 'professional_application',
      title: 'New professional application',
      message: `${body.name} (${body.profession_type}) from ${body.city} has applied.`,
      data: {
        application_id: application.id,
        name: body.name,
        profession_type: body.profession_type,
        city: body.city,
      },
      read: false,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        application_id: application.id,
        message: 'Application submitted successfully. We will review it within 72 hours.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('submit-professional-application error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

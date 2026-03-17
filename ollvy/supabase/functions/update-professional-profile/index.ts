// update-professional-profile
// Full implementation per spec §22
//
// Body: { step: 1|2|3|4, data: {...} }
// Step 1 (P03 Basics): full_name, display_name, bio, years_experience, profession_type
// Step 2 (P04 Service Areas): service_areas[], cities[], max_concurrent_orders
// Step 3 (P05 Certifications): certifications array (handled separately)
// Step 4 (P15 Profile Edit): same as steps 1+2 combined

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyProfessional } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface Step1Data {
  full_name: string;
  display_name?: string;
  email?: string;
  bio?: string;
  years_experience: number;
  profession_type: 'ca' | 'lawyer' | 'cs' | 'licensing_consultant' | 'payroll_specialist' | 'registered_valuer';
}

interface Step2Data {
  service_areas: string[];
  cities: string[];
  max_concurrent_orders?: number;
}

interface Step4Data {
  bio?: string;
  years_experience?: number;
  languages?: string[];
  max_concurrent_orders?: number;
}

interface RequestBody {
  step: 1 | 2 | 3 | 4;
  data: Step1Data | Step2Data | Step4Data | Record<string, unknown>;
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

    const professionalId = authResult.professionalId;
    const supabase = getSupabaseAdmin();

    // Parse request body
    const body: RequestBody = await req.json();
    const { step, data } = body;

    if (!step || ![1, 2, 3, 4].includes(step)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid step. Must be 1, 2, 3, or 4.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Get current professional data
    const { data: currentProf, error: fetchError } = await supabase
      .from('professionals')
      .select('onboarding_step, status')
      .eq('id', professionalId)
      .single();

    if (fetchError || !currentProf) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Professional not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    let updateData: Record<string, unknown> = {};
    let newOnboardingStep = currentProf.onboarding_step || 0;

    // Process based on step
    switch (step) {
      case 1: {
        const stepData = data as Step1Data;

        // Validate required fields
        if (!stepData.full_name?.trim()) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Full name is required' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }

        if (!stepData.profession_type) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Profession type is required' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }

        if (stepData.years_experience === undefined || stepData.years_experience < 0) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Valid years of experience required' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }

        updateData = {
          name: stepData.full_name.trim(),
          display_name: stepData.display_name?.trim() || stepData.full_name.trim(),
          email: stepData.email?.trim() || null,
          bio: stepData.bio?.trim() || null,
          experience_years: stepData.years_experience,
          profession_type: stepData.profession_type,
        };

        newOnboardingStep = Math.max(newOnboardingStep, 1);
        break;
      }

      case 2: {
        const stepData = data as Step2Data;

        // Validate required fields
        if (!stepData.service_areas || stepData.service_areas.length === 0) {
          return new Response(
            JSON.stringify({ ok: false, error: 'At least one service area is required' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }

        if (!stepData.cities || stepData.cities.length === 0) {
          return new Response(
            JSON.stringify({ ok: false, error: 'At least one city is required' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }

        updateData = {
          service_areas: stepData.service_areas,
          cities: stepData.cities,
          max_concurrent_orders: stepData.max_concurrent_orders || 5,
        };

        // Also upsert professional_availability for each city
        for (const city of stepData.cities) {
          await supabase
            .from('professional_availability')
            .upsert({
              professional_id: professionalId,
              city,
              is_available: true,
              max_concurrent_orders: stepData.max_concurrent_orders || 5,
              current_active_orders: 0,
            }, { onConflict: 'professional_id,city' });
        }

        newOnboardingStep = Math.max(newOnboardingStep, 2);
        break;
      }

      case 3: {
        // Step 3 is handled by upload-certification-doc
        // Just update the onboarding step and set status to pending_review
        updateData = {
          status: 'pending_review',
        };
        newOnboardingStep = Math.max(newOnboardingStep, 3);
        break;
      }

      case 4: {
        // Post-onboarding profile edit
        const stepData = data as Step4Data;

        updateData = {};

        if (stepData.bio !== undefined) {
          updateData.bio = stepData.bio.trim();
        }

        if (stepData.years_experience !== undefined) {
          updateData.experience_years = stepData.years_experience;
        }

        if (stepData.languages !== undefined) {
          updateData.languages = stepData.languages;
        }

        if (stepData.max_concurrent_orders !== undefined) {
          updateData.max_concurrent_orders = stepData.max_concurrent_orders;

          // Update availability records too
          await supabase
            .from('professional_availability')
            .update({ max_concurrent_orders: stepData.max_concurrent_orders })
            .eq('professional_id', professionalId);
        }

        // Step 4 doesn't change onboarding step
        break;
      }
    }

    // Add onboarding_step and updated_at to update
    updateData.onboarding_step = newOnboardingStep;
    updateData.updated_at = new Date().toISOString();

    // Perform the update
    const { data: updatedProf, error: updateError } = await supabase
      .from('professionals')
      .update(updateData)
      .eq('id', professionalId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating professional:', updateError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to update profile' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        professional: updatedProf,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('update-professional-profile error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

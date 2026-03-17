// get-recommendations
// Returns service recommendations based on user situations
//
// Spec from §22:
// Matches situations to situation_tags[]. Ranks by urgency_score DESC.
// Returns up to 5 services ranked by urgency_score DESC.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUser } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface GetRecommendationsRequest {
  situations: string[];
  business_type?: string;
  state?: string;
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

    const userId = authResult.userId;

    // Parse request body
    const body: GetRecommendationsRequest = await req.json();
    const { situations, business_type, state } = body;

    const supabase = getSupabaseAdmin();

    // Get all active service packages
    const { data: services, error: servicesError } = await supabase
      .from('service_packages')
      .select('id, name, short_description, base_price_paisa, urgency_score, situation_tags, is_active')
      .eq('is_active', true)
      .order('urgency_score', { ascending: false });

    if (servicesError) {
      console.error('Error fetching services:', servicesError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to fetch services' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    if (!services || services.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, recommendations: [], userId }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Match services based on situation_tags
    const recommendations = services
      .map(service => {
        // Count matching situation tags
        const serviceTags = service.situation_tags || [];
        const matchingTags = situations.filter(situation =>
          serviceTags.some((tag: string) =>
            tag.toLowerCase().includes(situation.toLowerCase()) ||
            situation.toLowerCase().includes(tag.toLowerCase())
          )
        );

        // Generate reason based on match
        let reason = '';
        if (matchingTags.length > 0) {
          reason = `Matches: ${matchingTags.slice(0, 2).join(', ')}`;
        }

        return {
          ...service,
          matchScore: matchingTags.length,
          reason,
        };
      })
      // Filter to only services with at least one match, or include high urgency ones
      .filter(service => service.matchScore > 0 || service.urgency_score >= 8)
      // Sort by match score first, then urgency_score
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return b.urgency_score - a.urgency_score;
      })
      // Take top 5
      .slice(0, 5)
      // Clean up response
      .map(({ matchScore, situation_tags, is_active, ...rest }) => rest);

    // Store recommendations for user (optional - for analytics)
    // Could insert into user_service_recommendations table here

    return new Response(
      JSON.stringify({
        ok: true,
        recommendations,
        userId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('get-recommendations error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

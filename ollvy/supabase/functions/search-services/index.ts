// search-services
// Full implementation per §22
//
// Spec:
// - Queries name + short_description + situation_tags[]
// - Public endpoint (no auth required)
// - Filter by situation_tags[] if provided
// - Order by urgency_score DESC
// - Results ranked: exact name match first, then short_description match, then situation_tag match
// - Minimum 2 characters to trigger (enforced here)
// - 300ms debounce (enforced client-side, not here)
// - Rate limit: 60 req/IP/min (handled by Supabase)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface ServicePackage {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  price_base_paisa: number;
  price_govt_fees_paisa: number;
  price_gst_rate: number;
  price_varies_by_state: boolean;
  sla_working_days: number;
  situation_tags: string[];
  urgency_score: number;
  order_type: string;
  billing_cycle: string;
  tier_group_id: string | null;
  tier_label: string | null;
  is_active: boolean;
}

interface SearchRequest {
  query?: string;           // Search term (min 2 chars)
  situation_tags?: string[]; // Filter by situation tags
  limit?: number;           // Max results (default 20)
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Public endpoint - no auth required
    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch (e) {
      console.error('Failed to create Supabase client:', e);
      return new Response(
        JSON.stringify({ ok: false, error: `Config error: ${e.message}` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Parse request (GET with query params or POST with body)
    let searchParams: SearchRequest = {};

    if (req.method === 'GET') {
      const url = new URL(req.url);
      searchParams = {
        query: url.searchParams.get('query') || undefined,
        situation_tags: url.searchParams.get('situation_tags')
          ? url.searchParams.get('situation_tags')!.split(',')
          : undefined,
        limit: url.searchParams.get('limit')
          ? parseInt(url.searchParams.get('limit')!)
          : 20,
      };
    } else if (req.method === 'POST') {
      searchParams = await req.json();
    }

    const { query, situation_tags, limit = 20 } = searchParams;

    // Minimum 2 characters for search query
    if (query && query.length < 2) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Search query must be at least 2 characters'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Build query - only return active services
    // Select only public fields (no sensitive data)
    // Note: Only selecting columns that exist in the database schema
    let dbQuery = supabase
      .from('service_packages')
      .select(`
        id,
        slug,
        name,
        short_description,
        price_base_paisa,
        price_govt_fees_paisa,
        price_gst_rate,
        price_varies_by_state,
        sla_working_days,
        situation_tags,
        urgency_score,
        order_type,
        billing_cycle,
        tier_group_id,
        tier_label,
        is_active
      `)
      .eq('is_active', true)
      .order('urgency_score', { ascending: false })
      .limit(limit);

    // Filter by situation_tags if provided (array overlap)
    if (situation_tags && situation_tags.length > 0) {
      dbQuery = dbQuery.overlaps('situation_tags', situation_tags);
    }

    const { data: services, error } = await dbQuery;

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ ok: false, error: `Database error: ${error.message}`, code: error.code }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // If search query provided, filter and rank results
    let results: ServicePackage[] = services || [];

    if (query) {
      const searchTerm = query.toLowerCase();

      // Categorize matches
      const exactNameMatches: ServicePackage[] = [];
      const nameContainsMatches: ServicePackage[] = [];
      const descriptionMatches: ServicePackage[] = [];
      const tagMatches: ServicePackage[] = [];

      for (const service of results) {
        const nameLower = service.name.toLowerCase();
        const descLower = service.short_description.toLowerCase();
        const tags = service.situation_tags || [];

        if (nameLower === searchTerm) {
          exactNameMatches.push(service);
        } else if (nameLower.includes(searchTerm)) {
          nameContainsMatches.push(service);
        } else if (descLower.includes(searchTerm)) {
          descriptionMatches.push(service);
        } else if (tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
          tagMatches.push(service);
        }
        // If no match, exclude from results
      }

      // Combine results in ranking order
      // Each category maintains urgency_score DESC ordering from the original query
      results = [
        ...exactNameMatches,
        ...nameContainsMatches,
        ...descriptionMatches,
        ...tagMatches,
      ];
    }

    // Return public response (no sensitive fields)
    return new Response(
      JSON.stringify({
        ok: true,
        services: results,
        count: results.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Search services error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// get-public-profile
// Full implementation per §36 and §22
//
// Public endpoint (no auth required), rate limit 30 req/min per IP
// Returns only: business_name, business_type, state, city, compliance_health_score,
// profile_created_at (year only), active_retainers count, completed_orders count,
// services_active string[], ollvy_verified: true
// NEVER returns: phone, email, order details, invoice amounts, professional names, user UUID
// If public_profile_enabled=false: return 404

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

// Simple in-memory rate limiter (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               req.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Rate limit exceeded. Please try again later.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429,
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const url = new URL(req.url);

    // Check if this is a stats-only request (for homepage)
    const statsOnly = url.searchParams.get('stats_only') === 'true';

    // Check if this is a referral code lookup
    const referralCode = url.searchParams.get('referral_code');

    // Get user_id for profile lookup
    const userId = url.searchParams.get('user_id');

    // If stats_only, return platform stats
    if (statsOnly) {
      const { data: settings, error: settingsError } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'platform_stats')
        .single();

      if (settingsError || !settings) {
        // Return default stats if not yet populated
        return new Response(
          JSON.stringify({
            ok: true,
            stats: {
              users_count: 0,
              professionals_count: 0,
              services_count: 0,
              cities_served: 0,
              orders_completed_total: 0,
            },
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      const stats = typeof settings.value === 'string'
        ? JSON.parse(settings.value)
        : settings.value;

      return new Response(
        JSON.stringify({ ok: true, stats }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // If referral code lookup
    if (referralCode) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('business_name')
        .eq('referral_code', referralCode)
        .single();

      if (userError || !user) {
        return new Response(
          JSON.stringify({ ok: true, referrer: null }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      // Extract first name from business_name (or just use first word)
      const firstName = user.business_name?.split(' ')[0] || 'A friend';

      return new Response(
        JSON.stringify({
          ok: true,
          referrer: { first_name: firstName },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // User profile lookup
    if (!userId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'user_id parameter is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Fetch user with public profile check
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        business_name,
        business_type,
        state,
        city,
        compliance_health_score,
        created_at,
        public_profile_enabled
      `)
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Profile not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Check if public profile is enabled
    if (user.public_profile_enabled === false) {
      return new Response(
        JSON.stringify({ ok: false, error: 'This profile is not publicly available' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Count active retainers
    const { count: activeRetainers } = await supabase
      .from('retainer_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active');

    // Count completed orders
    const { count: completedOrders } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'completed');

    // Get active services (names only, no pricing or sensitive data)
    const { data: activeServices } = await supabase
      .from('orders')
      .select(`
        service_package_id,
        service_packages!inner(name)
      `)
      .eq('user_id', userId)
      .in('status', ['in_progress', 'completed'])
      .limit(10);

    // Get service names from retainers
    const { data: retainerServices } = await supabase
      .from('retainer_subscriptions')
      .select(`
        service_package_id,
        service_packages!inner(name)
      `)
      .eq('user_id', userId)
      .eq('status', 'active');

    // Combine unique service names
    const serviceNames = new Set<string>();
    activeServices?.forEach((order: any) => {
      if (order.service_packages?.name) {
        serviceNames.add(order.service_packages.name);
      }
    });
    retainerServices?.forEach((retainer: any) => {
      if (retainer.service_packages?.name) {
        serviceNames.add(retainer.service_packages.name + ' (ongoing)');
      }
    });

    // Extract year from created_at
    const profileCreatedYear = new Date(user.created_at).getFullYear();

    // Build public profile response
    // NEVER include: phone, email, order details, invoice amounts, professional names, user UUID
    const publicProfile = {
      business_name: user.business_name || 'Unnamed Business',
      business_type: user.business_type || 'Business',
      state: user.state || '',
      city: user.city || '',
      compliance_health_score: user.compliance_health_score || 0,
      profile_created_at: profileCreatedYear,
      active_retainers: activeRetainers || 0,
      completed_orders: completedOrders || 0,
      services_active: Array.from(serviceNames),
      ollvy_verified: true,
    };

    return new Response(
      JSON.stringify({ ok: true, profile: publicProfile }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('get-public-profile error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

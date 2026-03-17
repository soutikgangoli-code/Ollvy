// update-platform-stats
// Full implementation per §22
//
// Cron: daily at 11:45pm IST
// Updates app_settings key=platform_stats with:
// users_count, professionals_count, services_count, cities_served, orders_completed_total

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify service role key for cron jobs
    const authResult = verifyCron(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 401,
        }
      );
    }

    const supabase = getSupabaseAdmin();

    // Count users
    const { count: users_count } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true });

    // Count active professionals
    const { count: professionals_count } = await supabase
      .from('professionals')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved');

    // Count active services
    const { count: services_count } = await supabase
      .from('service_packages')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    // Count distinct cities served (from orders)
    const { data: cities } = await supabase
      .from('orders')
      .select('city')
      .not('city', 'is', null);

    const uniqueCities = new Set<string>();
    if (cities) {
      for (const order of cities) {
        if (order.city) {
          uniqueCities.add(order.city.toLowerCase());
        }
      }
    }
    const cities_served = uniqueCities.size || 1; // At least 1

    // Count completed orders
    const { count: orders_completed_total } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Calculate average platform rating
    const { data: ratings } = await supabase
      .from('feedback')
      .select('rating');

    const avg_platform_rating =
      ratings && ratings.length > 0
        ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length
        : 4.8;

    const platformStats = {
      users_count: users_count || 0,
      professionals_count: professionals_count || 0,
      services_count: services_count || 0,
      cities_served,
      orders_completed_total: orders_completed_total || 0,
      avg_platform_rating: Math.round(avg_platform_rating * 10) / 10,
      updated_at: new Date().toISOString(),
    };

    // Upsert app_settings
    const { error: upsertError } = await supabase
      .from('app_settings')
      .upsert(
        {
          key: 'platform_stats',
          value: platformStats,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

    if (upsertError) {
      throw new Error(`Failed to update platform stats: ${upsertError.message}`);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        stats: platformStats,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('update-platform-stats error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

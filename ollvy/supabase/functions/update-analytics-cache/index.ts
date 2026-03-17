// update-analytics-cache
// Full implementation per §22
//
// Cron: daily at 7:05am IST
// Calculates: MRR, active orders, SLA compliance rate, churn, avg rating,
// city breakdown, service breakdown
// Upserts analytics_cache row for today

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
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Calculate MRR from active retainers
    const { data: retainers } = await supabase
      .from('retainer_subscriptions')
      .select('monthly_price_paisa')
      .eq('status', 'active');

    const mrr_paisa = retainers?.reduce(
      (sum: number, r: any) => sum + (r.monthly_price_paisa || 0),
      0
    ) || 0;

    // Count active orders
    const { count: active_orders_count } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .in('status', ['assigned', 'in_progress']);

    // Count completed orders in last 7 days
    const { count: completed_orders_7d } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('completed_at', sevenDaysAgo);

    // Count completed orders in last 30 days
    const { count: completed_orders_30d } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('completed_at', thirtyDaysAgo);

    // Calculate SLA compliance rate (orders completed within SLA in last 30 days)
    const { data: completedOrders } = await supabase
      .from('orders')
      .select('id, created_at, completed_at, service_packages!inner(sla_working_days)')
      .eq('status', 'completed')
      .gte('completed_at', thirtyDaysAgo);

    let slaCompliantCount = 0;
    if (completedOrders) {
      for (const order of completedOrders) {
        const created = new Date(order.created_at);
        const completed = new Date(order.completed_at);
        const slaWorkingDays = (order.service_packages as any)?.sla_working_days || 7;

        // Simple check: days between created and completed
        const daysDiff = Math.ceil(
          (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff <= slaWorkingDays * 1.5) {
          // Allow 50% buffer for non-working days
          slaCompliantCount++;
        }
      }
    }

    const sla_compliance_rate_30d =
      completed_orders_30d && completed_orders_30d > 0
        ? (slaCompliantCount / completed_orders_30d) * 100
        : 100;

    // Count churn (cancelled retainers in last 30 days)
    const { count: churn_count_30d } = await supabase
      .from('retainer_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'cancelled')
      .gte('updated_at', thirtyDaysAgo);

    // Average rating in last 30 days
    const { data: ratings } = await supabase
      .from('feedback')
      .select('rating')
      .gte('created_at', thirtyDaysAgo);

    const avg_rating_30d =
      ratings && ratings.length > 0
        ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length
        : 0;

    // City breakdown
    const { data: cityOrders } = await supabase
      .from('orders')
      .select('city')
      .gte('created_at', thirtyDaysAgo)
      .not('city', 'is', null);

    const cityBreakdown: Record<string, number> = {};
    if (cityOrders) {
      for (const order of cityOrders) {
        const city = order.city || 'Unknown';
        cityBreakdown[city] = (cityBreakdown[city] || 0) + 1;
      }
    }

    // Service breakdown
    const { data: serviceOrders } = await supabase
      .from('orders')
      .select('service_packages!inner(name)')
      .gte('created_at', thirtyDaysAgo);

    const serviceBreakdown: Record<string, number> = {};
    if (serviceOrders) {
      for (const order of serviceOrders) {
        const serviceName = (order.service_packages as any)?.name || 'Unknown';
        serviceBreakdown[serviceName] = (serviceBreakdown[serviceName] || 0) + 1;
      }
    }

    // Upsert analytics_cache row
    const { error: upsertError } = await supabase
      .from('analytics_cache')
      .upsert(
        {
          cache_date: today,
          mrr_paisa,
          active_orders_count: active_orders_count || 0,
          completed_orders_7d: completed_orders_7d || 0,
          completed_orders_30d: completed_orders_30d || 0,
          sla_compliance_rate_30d: Math.round(sla_compliance_rate_30d * 100) / 100,
          churn_count_30d: churn_count_30d || 0,
          avg_rating_30d: Math.round(avg_rating_30d * 100) / 100,
          city_breakdown: cityBreakdown,
          service_breakdown: serviceBreakdown,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'cache_date' }
      );

    if (upsertError) {
      throw new Error(`Failed to upsert analytics: ${upsertError.message}`);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        cache_date: today,
        metrics: {
          mrr_paisa,
          active_orders_count: active_orders_count || 0,
          completed_orders_7d: completed_orders_7d || 0,
          completed_orders_30d: completed_orders_30d || 0,
          sla_compliance_rate_30d: Math.round(sla_compliance_rate_30d * 100) / 100,
          churn_count_30d: churn_count_30d || 0,
          avg_rating_30d: Math.round(avg_rating_30d * 100) / 100,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('update-analytics-cache error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

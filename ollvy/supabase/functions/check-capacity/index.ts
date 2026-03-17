// check-capacity
// Full implementation per §22
//
// Cron: 6am daily IST
// Checks city × service load
// Creates admin_notification banner at 80% capacity
// Sends email at 95% capacity

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const WARNING_THRESHOLD = 0.80;
const CRITICAL_THRESHOLD = 0.95;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
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
    const now = new Date();
    const alerts: Array<{ city: string; service: string; utilization: number; level: string }> = [];

    // Get all active professionals grouped by city
    const { data: professionals } = await supabase
      .from('professionals')
      .select('id, city, monthly_order_capacity, services_offered')
      .eq('status', 'active')
      .not('razorpay_fund_account_id', 'is', null);

    if (!professionals || professionals.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, message: 'No active professionals found', alerts: [] }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Group capacity by city
    const cityCapacity: Record<string, { total: number; professionals: string[] }> = {};

    for (const pro of professionals) {
      const city = pro.city || 'Unknown';
      if (!cityCapacity[city]) {
        cityCapacity[city] = { total: 0, professionals: [] };
      }
      cityCapacity[city].total += pro.monthly_order_capacity || 5;
      cityCapacity[city].professionals.push(pro.id);
    }

    // Get current month's order count by city
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    for (const [city, capacity] of Object.entries(cityCapacity)) {
      const { count: orderCount } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .in('professional_id', capacity.professionals)
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth)
        .not('status', 'in', '("cancelled","rejected")');

      const currentOrders = orderCount || 0;
      const utilization = capacity.total > 0 ? currentOrders / capacity.total : 0;

      if (utilization >= CRITICAL_THRESHOLD) {
        alerts.push({ city, service: 'all', utilization, level: 'critical' });

        // Create admin notification
        await supabase.from('admin_notifications').insert({
          type: 'capacity_critical',
          title: `Critical: ${city} at ${Math.round(utilization * 100)}% capacity`,
          message: `${city} has ${currentOrders}/${capacity.total} orders this month. Immediate action required.`,
          data: { city, utilization, current: currentOrders, capacity: capacity.total },
          read: false,
        });

        // Send admin email for critical alerts
        const adminEmail = Deno.env.get('ADMIN_EMAIL');
        const resendKey = Deno.env.get('RESEND_API_KEY');
        if (adminEmail && resendKey) {
          try {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'Ollvy System <system@ollvy.com>',
                to: adminEmail,
                subject: `CRITICAL: ${city} at ${Math.round(utilization * 100)}% capacity`,
                text: `${city} has reached critical capacity (${currentOrders}/${capacity.total} orders). Please add more professionals or adjust capacity.`,
              }),
            });
          } catch (e) {
            console.error('Failed to send capacity email:', e);
          }
        }
      } else if (utilization >= WARNING_THRESHOLD) {
        alerts.push({ city, service: 'all', utilization, level: 'warning' });

        // Create admin notification for warning
        await supabase.from('admin_notifications').insert({
          type: 'capacity_warning',
          title: `Warning: ${city} at ${Math.round(utilization * 100)}% capacity`,
          message: `${city} is approaching full capacity (${currentOrders}/${capacity.total} orders).`,
          data: { city, utilization, current: currentOrders, capacity: capacity.total },
          read: false,
        });
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        alerts,
        cities_checked: Object.keys(cityCapacity).length,
        processed_at: now.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('check-capacity error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// check-waitlist
// Full implementation per §22
//
// Cron: 11am daily IST
// Retry auto-assign for waitlisted orders
// Alert admin + user if order > 48h in waitlist

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

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
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    let ordersAssigned = 0;
    let alertsCreated = 0;

    // Find waitlisted orders
    const { data: waitlistedOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id, user_id, service_package_id, city, waitlisted_at, service_packages(name)')
      .eq('status', 'waitlisted')
      .order('waitlisted_at', { ascending: true });

    if (fetchError) {
      throw new Error(`Failed to fetch waitlisted orders: ${fetchError.message}`);
    }

    for (const order of waitlistedOrders || []) {
      // Try to find an available professional
      const { data: availablePros } = await supabase
        .from('professionals')
        .select('id, monthly_order_capacity')
        .eq('status', 'active')
        .eq('city', order.city)
        .eq('is_on_leave', false)
        .not('razorpay_fund_account_id', 'is', null)
        .contains('services_offered', [order.service_package_id]);

      // Check capacity for each professional
      let assignedPro = null;
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      for (const pro of availablePros || []) {
        const { count: currentOrders } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('professional_id', pro.id)
          .gte('created_at', startOfMonth)
          .not('status', 'in', '("cancelled","rejected")');

        if ((currentOrders || 0) < (pro.monthly_order_capacity || 5)) {
          assignedPro = pro;
          break;
        }
      }

      if (assignedPro) {
        // Assign the order
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'assigned',
            professional_id: assignedPro.id,
            assigned_at: now.toISOString(),
            waitlisted_at: null
          })
          .eq('id', order.id);

        if (!updateError) {
          ordersAssigned++;

          // Notify user
          await supabase.from('notifications').insert({
            user_id: order.user_id,
            type: 'order_assigned',
            title: 'Professional assigned to your order',
            body: `A professional has been assigned to your ${(order.service_packages as any)?.name} order.`,
            data: { order_id: order.id },
            read: false,
          });
        }
      } else if (order.waitlisted_at && new Date(order.waitlisted_at) < fortyEightHoursAgo) {
        // Check if already alerted
        const { data: existingAlert } = await supabase
          .from('admin_notifications')
          .select('id')
          .eq('type', 'waitlist_alert')
          .contains('data', { order_id: order.id })
          .single();

        if (!existingAlert) {
          // Create admin alert
          await supabase.from('admin_notifications').insert({
            type: 'waitlist_alert',
            title: `Order waitlisted over 48 hours`,
            message: `Order ${order.id} for ${(order.service_packages as any)?.name} in ${order.city} has been in waitlist over 48 hours.`,
            data: { order_id: order.id, city: order.city },
            read: false,
          });

          // Notify user
          await supabase.from('notifications').insert({
            user_id: order.user_id,
            type: 'waitlist_delay',
            title: 'Your order is taking longer than expected',
            body: 'We\'re working to find a professional for your order. We\'ll notify you as soon as one is assigned.',
            data: { order_id: order.id },
            read: false,
          });

          alertsCreated++;
        }
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        orders_assigned: ordersAssigned,
        alerts_created: alertsCreated,
        waitlisted_total: waitlistedOrders?.length || 0,
        processed_at: now.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('check-waitlist error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// send-renewal-reminders
// Full implementation per §22
//
// Cron: daily at 8:15am IST
// Sends reminders at 60 / 30 / 7 days before expiry for annual-renewal services
// (e.g., Shops and Establishments, FSSAI, Trademark)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

// Reminder intervals in days
const REMINDER_DAYS = [60, 30, 7];

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
    const now = new Date();
    let remindersSent = 0;

    // Get services that require annual renewal (has renewal_cycle or specific service types)
    const { data: renewalServices } = await supabase
      .from('service_packages')
      .select('id, name')
      .eq('is_active', true)
      .or('renewal_cycle.eq.annual,name.ilike.%FSSAI%,name.ilike.%Trademark%,name.ilike.%Shops%');

    if (!renewalServices || renewalServices.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, reminders_sent: 0, message: 'No renewal services found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const serviceIds = renewalServices.map(s => s.id);

    // For each reminder interval
    for (const daysBeforeExpiry of REMINDER_DAYS) {
      // Calculate the target completion date (1 year - daysBeforeExpiry ago)
      const targetDate = new Date(now);
      targetDate.setFullYear(targetDate.getFullYear() - 1);
      targetDate.setDate(targetDate.getDate() + daysBeforeExpiry);

      // Find orders completed around this date (±1 day for tolerance)
      const startDate = new Date(targetDate);
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date(targetDate);
      endDate.setDate(endDate.getDate() + 1);

      const { data: eligibleOrders } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          service_package_id,
          completed_at,
          service_packages!inner(name),
          users!inner(id, fcm_token, business_name)
        `)
        .in('service_package_id', serviceIds)
        .eq('status', 'completed')
        .gte('completed_at', startDate.toISOString())
        .lte('completed_at', endDate.toISOString());

      if (!eligibleOrders) continue;

      for (const order of eligibleOrders) {
        const user = order.users as any;
        const service = order.service_packages as any;

        // Check if we already sent a reminder for this interval
        const { data: existingReminder } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', order.user_id)
          .eq('type', 'renewal_reminder')
          .ilike('title', `%${service.name}%`)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .single();

        if (existingReminder) continue;

        // Calculate expiry date
        const completedDate = new Date(order.completed_at);
        const expiryDate = new Date(completedDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        // Send push notification
        // In production, this would call send-notification function
        const notificationTitle = `${service.name} renewal due in ${daysBeforeExpiry} days`;
        const notificationBody = `Your ${service.name} is due for renewal on ${expiryDate.toLocaleDateString('en-IN')}. Book now to stay compliant.`;

        // Log the notification
        await supabase.from('notifications').insert({
          user_id: order.user_id,
          type: 'renewal_reminder',
          title: notificationTitle,
          body: notificationBody,
          data: {
            order_id: order.id,
            service_package_id: order.service_package_id,
            expiry_date: expiryDate.toISOString(),
            days_before: daysBeforeExpiry,
          },
          read: false,
        });

        // Send FCM push if token exists
        if (user.fcm_token) {
          const fcmKey = Deno.env.get('FCM_SERVER_KEY');
          if (fcmKey) {
            try {
              await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                  'Authorization': `key=${fcmKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  to: user.fcm_token,
                  notification: {
                    title: notificationTitle,
                    body: notificationBody,
                  },
                  data: {
                    type: 'renewal_reminder',
                    order_id: order.id,
                    service_package_id: order.service_package_id,
                  },
                }),
              });
            } catch (e) {
              console.error('FCM send error:', e);
            }
          }
        }

        remindersSent++;
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        reminders_sent: remindersSent,
        reminder_intervals: REMINDER_DAYS,
        processed_at: now.toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('send-renewal-reminders error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

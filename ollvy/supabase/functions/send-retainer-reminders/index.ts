// send-retainer-reminders
// Full implementation per §22
//
// Cron: 18th of month at 8am IST
// Billing advance notification (7 days before) to all active retainers
// Sent via push notification and in-app notification

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
    let remindersSent = 0;

    // Get all active retainers
    const { data: activeRetainers, error: fetchError } = await supabase
      .from('retainer_subscriptions')
      .select(`
        id,
        user_id,
        amount_paisa,
        tier_id,
        service_package_id,
        next_billing_date,
        users(id, fcm_token, business_name),
        service_packages(name)
      `)
      .eq('status', 'active');

    if (fetchError) {
      throw new Error(`Failed to fetch retainers: ${fetchError.message}`);
    }

    for (const retainer of activeRetainers || []) {
      const user = retainer.users as any;
      const service = retainer.service_packages as any;
      const amount = (retainer.amount_paisa / 100).toLocaleString('en-IN');

      // Create notification
      await supabase.from('notifications').insert({
        user_id: retainer.user_id,
        type: 'retainer_billing_reminder',
        title: 'Upcoming retainer billing',
        body: `Your ${service?.name} retainer of ₹${amount} will be charged on the 25th. Ensure sufficient balance.`,
        data: {
          retainer_id: retainer.id,
          amount_paisa: retainer.amount_paisa,
          billing_date: retainer.next_billing_date
        },
        read: false,
      });

      // Send FCM push if available
      if (user?.fcm_token) {
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
                  title: 'Upcoming retainer billing',
                  body: `Your ${service?.name} retainer of ₹${amount} will be charged on the 25th.`,
                },
                data: {
                  type: 'retainer_billing_reminder',
                  retainer_id: retainer.id
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

    return new Response(
      JSON.stringify({
        ok: true,
        reminders_sent: remindersSent,
        processed_at: now.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('send-retainer-reminders error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

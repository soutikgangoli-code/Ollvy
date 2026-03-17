// send-compliance-reminders
// Full implementation per §22
//
// Cron: 8am daily IST
// Pro users only: push + SMS at 30/7/1 days before due_date

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const REMINDER_DAYS = [30, 7, 1];

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

    // Get Ollvy Pro users
    const { data: proUsers } = await supabase
      .from('users')
      .select('id')
      .eq('ollvy_pro_status', 'active');

    if (!proUsers || proUsers.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, reminders_sent: 0, message: 'No Pro users found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const proUserIds = proUsers.map(u => u.id);

    for (const daysBeforeDue of REMINDER_DAYS) {
      const targetDate = new Date(Date.now() + daysBeforeDue * 24 * 60 * 60 * 1000);
      const targetDateStr = targetDate.toISOString().split('T')[0];
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      // Find pending obligations due on this date
      const { data: dueObligations, error: fetchError } = await supabase
        .from('compliance_obligations')
        .select('id, user_id, name, due_date, users(fcm_token, phone)')
        .in('user_id', proUserIds)
        .eq('status', 'pending')
        .gte('due_date', targetDateStr)
        .lt('due_date', nextDay.toISOString().split('T')[0]);

      if (fetchError) {
        console.error(`Failed to fetch obligations for ${daysBeforeDue} days:`, fetchError);
        continue;
      }

      for (const obligation of dueObligations || []) {
        const user = obligation.users as any;

        // Check if already reminded at this threshold
        const { data: existingReminder } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', obligation.user_id)
          .eq('type', 'compliance_reminder')
          .contains('data', { obligation_id: obligation.id, days_before: daysBeforeDue })
          .single();

        if (existingReminder) continue;

        const message = daysBeforeDue === 1
          ? `TOMORROW: ${obligation.name} is due. Complete it now to stay compliant.`
          : `${obligation.name} is due in ${daysBeforeDue} days (${new Date(obligation.due_date).toLocaleDateString('en-IN')}).`;

        // Create in-app notification
        await supabase.from('notifications').insert({
          user_id: obligation.user_id,
          type: 'compliance_reminder',
          title: daysBeforeDue === 1 ? 'Compliance due tomorrow!' : 'Upcoming compliance deadline',
          body: message,
          data: { obligation_id: obligation.id, days_before: daysBeforeDue },
          read: false,
        });

        // Send FCM push
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
                    title: daysBeforeDue === 1 ? 'Compliance due tomorrow!' : 'Upcoming compliance deadline',
                    body: message,
                  },
                  data: { type: 'compliance_reminder', obligation_id: obligation.id },
                }),
              });
            } catch (e) {
              console.error('FCM send error:', e);
            }
          }
        }

        // Send SMS for 1-day reminder
        if (daysBeforeDue === 1 && user?.phone) {
          const msg91Key = Deno.env.get('MSG91_AUTH_KEY');
          if (msg91Key) {
            try {
              await fetch('https://api.msg91.com/api/v5/flow/', {
                method: 'POST',
                headers: {
                  'authkey': msg91Key,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  template_id: 'compliance_reminder',
                  recipients: [{ mobiles: `91${user.phone}`, name: obligation.name }],
                }),
              });
            } catch (e) {
              console.error('SMS send error:', e);
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
        reminder_days: REMINDER_DAYS,
        processed_at: now.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('send-compliance-reminders error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

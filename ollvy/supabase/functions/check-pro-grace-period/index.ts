// check-pro-grace-period
// Full implementation per §22
//
// Cron: 6:30am daily IST
// Push nudges at day 1/5/7 post-trial
// Revert to free at day 8

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const NUDGE_DAYS = [1, 5, 7];
const REVERT_DAY = 8;

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
    let nudgesSent = 0;
    let usersReverted = 0;

    // Find users in grace period (trial ended but not yet subscribed)
    const { data: graceUsers, error: fetchError } = await supabase
      .from('users')
      .select('id, fcm_token, ollvy_pro_trial_end_date, ollvy_pro_status')
      .eq('ollvy_pro_status', 'grace')
      .not('ollvy_pro_trial_end_date', 'is', null);

    if (fetchError) {
      throw new Error(`Failed to fetch grace period users: ${fetchError.message}`);
    }

    for (const user of graceUsers || []) {
      const trialEnd = new Date(user.ollvy_pro_trial_end_date);
      const daysSinceTrialEnd = Math.floor((now.getTime() - trialEnd.getTime()) / (24 * 60 * 60 * 1000));

      // Check if should revert to free
      if (daysSinceTrialEnd >= REVERT_DAY) {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            ollvy_pro_status: 'free',
            ollvy_pro_grace_ended_at: now.toISOString()
          })
          .eq('id', user.id);

        if (!updateError) {
          usersReverted++;

          // Notify user
          await supabase.from('notifications').insert({
            user_id: user.id,
            type: 'pro_reverted',
            title: 'Your Ollvy Pro trial has ended',
            body: 'You have been reverted to the free plan. Subscribe to Pro anytime to unlock advanced features.',
            data: {},
            read: false,
          });
        }
        continue;
      }

      // Check if nudge day
      if (NUDGE_DAYS.includes(daysSinceTrialEnd)) {
        // Check if already nudged today
        const { data: existingNudge } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', user.id)
          .eq('type', 'pro_grace_nudge')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .single();

        if (!existingNudge) {
          const daysLeft = REVERT_DAY - daysSinceTrialEnd;
          const message = daysLeft === 1
            ? 'Last day! Subscribe to Ollvy Pro now to keep your advanced features.'
            : `${daysLeft} days left to subscribe to Ollvy Pro and keep your advanced features.`;

          await supabase.from('notifications').insert({
            user_id: user.id,
            type: 'pro_grace_nudge',
            title: 'Don\'t lose your Pro features',
            body: message,
            data: { days_left: daysLeft },
            read: false,
          });

          // Send FCM push
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
                      title: 'Don\'t lose your Pro features',
                      body: message,
                    },
                    data: { type: 'pro_grace_nudge', days_left: daysLeft },
                  }),
                });
              } catch (e) {
                console.error('FCM send error:', e);
              }
            }
          }

          nudgesSent++;
        }
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        nudges_sent: nudgesSent,
        users_reverted: usersReverted,
        processed_at: now.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('check-pro-grace-period error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

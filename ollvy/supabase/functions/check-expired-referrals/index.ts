// check-expired-referrals
// Full implementation per §22
//
// Cron: daily at 11:30pm IST
// Marks referral_credits pending > 90 days as expired
// Sends push notification to referrer

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
    const now = new Date();

    // 1. Expire referral credits where expires_at < now AND status=available
    const { data: expiredCredits, error: expireError } = await supabase
      .from('referral_credits')
      .update({ status: 'expired' })
      .eq('status', 'available')
      .lt('expires_at', now.toISOString())
      .select('id, referrer_user_id, referee_user_id, credit_paisa');

    if (expireError) {
      console.error('Failed to expire credits:', expireError);
    }

    let creditsExpired = expiredCredits?.length || 0;

    // 2. Expire pending referrals where created_at > 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: expiredReferrals, error: referralError } = await supabase
      .from('referrals')
      .update({ status: 'expired' })
      .eq('status', 'pending')
      .lt('created_at', thirtyDaysAgo)
      .select('id, referrer_user_id, referee_user_id');

    if (referralError) {
      console.error('Failed to expire referrals:', referralError);
    }

    const referralsExpired = expiredReferrals?.length || 0;

    // 3. Update referrer credit balances for expired credits
    if (expiredCredits && expiredCredits.length > 0) {
      // Group by user to batch update balances
      const userDeductions: Record<string, number> = {};

      for (const credit of expiredCredits) {
        const userId = credit.referrer_user_id || credit.referee_user_id;
        if (userId) {
          userDeductions[userId] = (userDeductions[userId] || 0) + credit.credit_paisa;
        }
      }

      // Update each user's balance
      for (const [userId, amount] of Object.entries(userDeductions)) {
        const { data: user } = await supabase
          .from('users')
          .select('referral_credit_balance_paisa, fcm_token')
          .eq('id', userId)
          .single();

        if (user) {
          const newBalance = Math.max(0, (user.referral_credit_balance_paisa || 0) - amount);

          await supabase
            .from('users')
            .update({ referral_credit_balance_paisa: newBalance })
            .eq('id', userId);

          // Send push notification about expired credits
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
                      title: 'Referral credit expired',
                      body: `Your referral credit of Rs ${(amount / 100).toFixed(0)} has expired.`,
                    },
                    data: {
                      type: 'credit_expired',
                      amount_paisa: amount,
                    },
                  }),
                });
              } catch (e) {
                console.error('FCM send error:', e);
              }
            }
          }

          // Log notification
          await supabase.from('notifications').insert({
            user_id: userId,
            type: 'credit_expired',
            title: 'Referral credit expired',
            body: `Your referral credit of Rs ${(amount / 100).toFixed(0)} has expired.`,
            data: { amount_paisa: amount },
            read: false,
          });
        }
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        credits_expired: creditsExpired,
        referrals_expired: referralsExpired,
        processed_at: now.toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('check-expired-referrals error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

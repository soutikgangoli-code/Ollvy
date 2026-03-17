// check-expired-quotes
// Full implementation per §22
//
// Cron: 9:30am daily IST
// Sets status=expired on quotes where expires_at < now
// Notifies user

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
    let quotesExpired = 0;

    // Find expired quotes
    const { data: expiredQuotes, error: fetchError } = await supabase
      .from('quote_requests')
      .select('id, user_id, service_package_id, service_packages(name)')
      .eq('status', 'quoted')
      .lt('expires_at', now.toISOString());

    if (fetchError) {
      throw new Error(`Failed to fetch expired quotes: ${fetchError.message}`);
    }

    for (const quote of expiredQuotes || []) {
      // Update quote status
      const { error: updateError } = await supabase
        .from('quote_requests')
        .update({ status: 'expired' })
        .eq('id', quote.id);

      if (!updateError) {
        quotesExpired++;

        // Notify user
        const serviceName = (quote.service_packages as any)?.name || 'your service';
        await supabase.from('notifications').insert({
          user_id: quote.user_id,
          type: 'quote_expired',
          title: 'Quote expired',
          body: `Your quote for ${serviceName} has expired. Request a new quote to continue.`,
          data: { quote_id: quote.id, service_package_id: quote.service_package_id },
          read: false,
        });

        // Send FCM push if available
        const { data: user } = await supabase
          .from('users')
          .select('fcm_token')
          .eq('id', quote.user_id)
          .single();

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
                    title: 'Quote expired',
                    body: `Your quote for ${serviceName} has expired.`,
                  },
                  data: { type: 'quote_expired', quote_id: quote.id },
                }),
              });
            } catch (e) {
              console.error('FCM send error:', e);
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        quotes_expired: quotesExpired,
        processed_at: now.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('check-expired-quotes error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

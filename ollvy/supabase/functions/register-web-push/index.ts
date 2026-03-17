// register-web-push
// Full implementation per §22
//
// HTTP POST (auth, professional) - PROFESSIONAL WEB PANEL ONLY
// Body: { subscription: PushSubscriptionJSON } from browser Push API
// Stores in professionals.web_push_subscription (JSONB)
// Called after user grants Web Push permission at pro.ollvy.com
// On logout: sets to NULL

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyProfessional } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface PushSubscription {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface RequestBody {
  subscription: PushSubscription | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await verifyProfessional(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 401,
        }
      );
    }

    const professionalId = authResult.professionalId;
    const body: RequestBody = await req.json();

    const supabase = getSupabaseAdmin();

    // If subscription is null, this is a logout/unregister request
    if (body.subscription === null) {
      const { error: updateError } = await supabase
        .from('professionals')
        .update({ web_push_subscription: null })
        .eq('id', professionalId);

      if (updateError) {
        console.error('Failed to clear web push subscription:', updateError);
        return new Response(
          JSON.stringify({ ok: false, error: 'Failed to unregister' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, unregistered: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Validate subscription object
    if (!body.subscription?.endpoint || !body.subscription?.keys?.p256dh || !body.subscription?.keys?.auth) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid subscription object' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Store the web push subscription
    const { error: updateError } = await supabase
      .from('professionals')
      .update({
        web_push_subscription: body.subscription,
        web_push_updated_at: new Date().toISOString()
      })
      .eq('id', professionalId);

    if (updateError) {
      console.error('Failed to update web push subscription:', updateError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to register subscription' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, registered: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('register-web-push error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

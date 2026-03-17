// register-fcm-token
// Full implementation per §22
//
// HTTP POST (auth) - USER APP ONLY
// Updates users.fcm_token. Professionals use register-web-push.
// Called on every user app launch immediately after auth.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUser } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface RequestBody {
  fcm_token: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await verifyUser(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 401,
        }
      );
    }

    const userId = authResult.userId;
    const body: RequestBody = await req.json();

    if (!body.fcm_token || typeof body.fcm_token !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, error: 'fcm_token is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();

    // Update the user's FCM token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        fcm_token: body.fcm_token,
        fcm_token_updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Failed to update FCM token:', updateError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to register token' }),
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
    console.error('register-fcm-token error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// send-notification
// Stub file - no business logic implemented yet
// Internal function - called by other edge functions, not directly via HTTP
//
// Spec from §22:
// Checks fcm_token for users (FCM). Checks web_push_subscription for professionals (Web Push). Graceful null handling for both. SMS fallback for SMS_ALLOWED_EVENTS if push unavailable.

import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

export interface SendNotificationInput {
  // TODO: Define input parameters
}

export interface SendNotificationOutput {
  ok: boolean;
  error?: string;
  // TODO: Define output fields
}

/**
 * send-notification
 * 
 * Spec: Checks fcm_token for users (FCM). Checks web_push_subscription for professionals (Web Push). Graceful null handling for both. SMS fallback for SMS_ALLOWED_EVENTS if push unavailable.
 */
export async function sendnotification(
  input: SendNotificationInput
): Promise<SendNotificationOutput> {
  const supabase = getSupabaseAdmin();

  try {
    // TODO: Implement business logic
    // Spec: Checks fcm_token for users (FCM). Checks web_push_subscription for professionals (Web Push). Graceful null handling for both. SMS fallback for SMS_ALLOWED_EVENTS if push unavailable.

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

// For direct HTTP invocation during development/testing
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // For testing: require service role key
  const authResult = verifyCron(req);
  if (!authResult.success) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal function - requires service role key' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    );
  }

  const body = await req.json();
  const result = await sendnotification(body);

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: result.ok ? 200 : 500 }
  );
});

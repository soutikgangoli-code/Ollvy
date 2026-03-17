// send-admin-email
// Stub file - no business logic implemented yet
// Internal function - called by other edge functions, not directly via HTTP
//
// Spec from §22:
// Reads admin_email_recipients from app_settings. Sends via Resend/SendGrid.

import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

export interface SendAdminEmailInput {
  // TODO: Define input parameters
}

export interface SendAdminEmailOutput {
  ok: boolean;
  error?: string;
  // TODO: Define output fields
}

/**
 * send-admin-email
 * 
 * Spec: Reads admin_email_recipients from app_settings. Sends via Resend/SendGrid.
 */
export async function sendadminemail(
  input: SendAdminEmailInput
): Promise<SendAdminEmailOutput> {
  const supabase = getSupabaseAdmin();

  try {
    // TODO: Implement business logic
    // Spec: Reads admin_email_recipients from app_settings. Sends via Resend/SendGrid.

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
  const result = await sendadminemail(body);

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: result.ok ? 200 : 500 }
  );
});

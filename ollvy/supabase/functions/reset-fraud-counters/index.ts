// reset-fraud-counters
// Full implementation per §22
//
// Cron: 1st of month at 3am IST
// Resets fraud_review_queue monthly_count and users.referral_credit_30d_count
// Does NOT clear fraud_review_queue rows — those persist for audit

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

    // Reset fraud_review_queue monthly_count
    const { error: fraudError, count: fraudResetCount } = await supabase
      .from('fraud_review_queue')
      .update({ monthly_count: 0 })
      .gt('monthly_count', 0)
      .select('id', { count: 'exact', head: true });

    if (fraudError) {
      console.error('Failed to reset fraud counters:', fraudError);
    }

    // Reset users.referral_credit_30d_count
    const { error: userError, count: userResetCount } = await supabase
      .from('users')
      .update({ referral_credit_30d_count: 0 })
      .gt('referral_credit_30d_count', 0)
      .select('id', { count: 'exact', head: true });

    if (userError) {
      console.error('Failed to reset user referral counters:', userError);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        fraud_counters_reset: fraudResetCount || 0,
        user_counters_reset: userResetCount || 0,
        reset_date: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('reset-fraud-counters error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

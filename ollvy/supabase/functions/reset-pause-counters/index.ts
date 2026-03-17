// reset-pause-counters
// Full implementation per §22
//
// Cron: January 1st at 2am IST (annually)
// Resets retainer_subscriptions.pause_count = 0 for all active retainers
// Pause count is a per-year limit (max 2 pauses per year)
// Annual reset allows users to pause again in the new year

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

    // Reset pause_count for all active retainers
    const { error: resetError, count: resetCount } = await supabase
      .from('retainer_subscriptions')
      .update({ pause_count: 0 })
      .eq('status', 'active')
      .gt('pause_count', 0)
      .select('id', { count: 'exact', head: true });

    if (resetError) {
      throw new Error(`Failed to reset pause counters: ${resetError.message}`);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        retainers_reset: resetCount || 0,
        year: new Date().getFullYear(),
        reset_date: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('reset-pause-counters error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

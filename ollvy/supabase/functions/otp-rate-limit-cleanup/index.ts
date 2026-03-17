// otp-rate-limit-cleanup
// Full implementation per §22
//
// Cron: daily at 3:30am IST
// Deletes otp_rate_limits rows older than 24h
// Keeps the table small. No business logic — purely housekeeping.

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

    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Delete old rate limit records
    const { error: deleteError, count: deletedCount } = await supabase
      .from('otp_rate_limits')
      .delete()
      .lt('created_at', twentyFourHoursAgo)
      .select('id', { count: 'exact', head: true });

    if (deleteError) {
      throw new Error(`Failed to delete old records: ${deleteError.message}`);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        deleted_count: deletedCount || 0,
        cutoff_time: twentyFourHoursAgo,
        cleanup_at: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('otp-rate-limit-cleanup error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// daily-summary-pulse
//
// Two cron schedules registered in Supabase Dashboard, both pointing here
// with a query parameter:
//   - 30 6 * * *   (12:00 PM IST = 06:30 UTC) → ?type=midday
//   - 30 17 * * *  (11:00 PM IST = 17:30 UTC) → ?type=eod
//
// Both pulses cover the same window: from today 00:00 IST through now.
// Midday is "so far today", EOD is "today" (full day rollup).

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { postToSlack, notifySlackError } from '../_shared/slack.ts';
import { formatDateHuman, formatTimestampIST } from '../_shared/format.ts';
import { buildDailySummaryMessage } from '../_shared/slack-messages.ts';

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

// Returns the UTC instant corresponding to 00:00 IST of the IST-calendar day
// that `now` falls into. Floor-to-IST-day-start strategy:
//   1. Shift `now` forward by IST offset so its UTC fields read as IST values.
//   2. Floor to that day's UTC midnight.
//   3. Shift back by IST offset to recover the UTC instant.
function istDayStartUTC(now: Date): Date {
  const istShifted = new Date(now.getTime() + IST_OFFSET_MS);
  const istMidnight = Date.UTC(
    istShifted.getUTCFullYear(),
    istShifted.getUTCMonth(),
    istShifted.getUTCDate(),
  );
  return new Date(istMidnight - IST_OFFSET_MS);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const authResult = verifyCron(req);
  if (!authResult.success) {
    return new Response(
      JSON.stringify({ ok: false, error: authResult.error }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: authResult.status || 401,
      },
    );
  }

  try {
    const url = new URL(req.url);
    const typeParam = url.searchParams.get('type');
    const pulseType: 'midday' | 'eod' = typeParam === 'eod' ? 'eod' : 'midday';

    const now = new Date();
    const windowStart = istDayStartUTC(now);
    const windowStartIso = windowStart.toISOString();
    const nowIso = now.toISOString();

    const supabase = getSupabaseAdmin();

    const [signupsRes, ordersRes, revenueRes, completionsRes] = await Promise.all([
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', windowStartIso)
        .lt('created_at', nowIso),
      supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('paid_at', windowStartIso)
        .lt('paid_at', nowIso),
      supabase
        .from('orders')
        .select('total_paisa_snapshot')
        .gte('paid_at', windowStartIso)
        .lt('paid_at', nowIso),
      supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('completed_at', windowStartIso)
        .lt('completed_at', nowIso),
    ]);

    const signups = signupsRes.count ?? 0;
    const orders = ordersRes.count ?? 0;
    const completions = completionsRes.count ?? 0;
    const revenue_paisa = (revenueRes.data ?? []).reduce(
      (sum: number, row: { total_paisa_snapshot: number | null }) =>
        sum + (row.total_paisa_snapshot ?? 0),
      0,
    );

    const text = buildDailySummaryMessage({
      pulse_type: pulseType,
      date_human: formatDateHuman(now),
      signups,
      orders,
      revenue_paisa,
      completions,
      generated_at_ist: formatTimestampIST(now),
    });

    const postResult = await postToSlack({ channel: 'daily_summary', text });
    if (!postResult.success) {
      await notifySlackError({
        function_name: 'daily-summary-pulse',
        error: `Failed to post ${pulseType} pulse: ${postResult.error}`,
        context: `window ${windowStartIso} to ${nowIso}`,
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        type: pulseType,
        window_start: windowStartIso,
        window_end: nowIso,
        signups,
        orders,
        revenue_paisa,
        completions,
        posted: postResult.success,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (err) {
    console.error('daily-summary-pulse error:', err);
    await notifySlackError({
      function_name: 'daily-summary-pulse',
      error: err instanceof Error ? err : String(err),
      context: 'top-level handler caught an unexpected error',
    });
    return new Response(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

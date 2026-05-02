// drain-slack-notifications-queue
//
// Cron schedule: every 1 minute (* * * * *).
// Register via Supabase Dashboard -> Edge Functions -> Schedule.
//
// Sends Slack pings that originate from places where a synchronous HTTP call
// isn't safe - today, only new-signup pings written from inside the
// ensure_user_exists Postgres RPC. Mirrors drain-customer-notifications-queue
// but with no debounce window: signups should ping Slack ASAP.
//
// Cross-recursion guard: if posting to a non-#errors channel fails on the
// final attempt, we notify #errors. We do NOT call notifySlackError when the
// failed channel was already 'errors' - that would loop.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { postToSlack, notifySlackError, type SlackChannel } from '../_shared/slack.ts';
import { formatTimestampIST } from '../_shared/format.ts';
import { buildNewSignupMessage } from '../_shared/slack-messages.ts';

const MAX_ATTEMPTS = 3;

interface QueueRow {
  id: string;
  channel: SlackChannel;
  event_type: string;
  payload: Record<string, unknown>;
  send_attempt_count: number;
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

  const supabase = getSupabaseAdmin();
  const stats = { processed: 0, success: 0, failed: 0 };

  try {
    const { data: pending, error: fetchError } = await supabase
      .from('slack_notifications_queue')
      .select('id, channel, event_type, payload, send_attempt_count')
      .is('sent_at', null)
      .lt('send_attempt_count', MAX_ATTEMPTS)
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('Failed to fetch slack queue:', fetchError);
      return new Response(
        JSON.stringify({ ok: false, error: fetchError.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      );
    }

    const rows = (pending ?? []) as QueueRow[];

    for (const row of rows) {
      stats.processed++;

      const text = renderMessage(row);
      if (text === null) {
        // Unknown event_type - mark sent so we don't retry forever after a
        // mismatched deploy. Log loudly.
        console.error(JSON.stringify({
          event: 'slack_queue_unknown_event_type',
          row_id: row.id,
          event_type: row.event_type,
        }));
        await supabase
          .from('slack_notifications_queue')
          .update({
            sent_at: new Date().toISOString(),
            last_error: 'unknown_event_type',
          })
          .eq('id', row.id);
        stats.failed++;
        continue;
      }

      const result = await postToSlack({ channel: row.channel, text });

      if (result.success) {
        await supabase
          .from('slack_notifications_queue')
          .update({ sent_at: new Date().toISOString() })
          .eq('id', row.id)
          .is('sent_at', null);
        stats.success++;
      } else {
        const newCount = row.send_attempt_count + 1;
        const update: Record<string, unknown> = {
          send_attempt_count: newCount,
          last_error: result.error,
        };
        if (newCount >= MAX_ATTEMPTS) {
          update.sent_at = new Date().toISOString();
          console.error(JSON.stringify({
            event: 'slack_queue_giving_up',
            row_id: row.id,
            channel: row.channel,
            event_type: row.event_type,
            attempts: newCount,
            error: result.error,
          }));
          // Don't recurse if the failing channel was already #errors.
          if (row.channel !== 'errors') {
            await notifySlackError({
              function_name: 'drain-slack-notifications-queue',
              error: `Slack post to #${row.channel} gave up after ${newCount} attempts: ${result.error}`,
              context: `event_type=${row.event_type}`,
            });
          }
        }
        await supabase
          .from('slack_notifications_queue')
          .update(update)
          .eq('id', row.id);
        stats.failed++;
      }
    }

    return new Response(
      JSON.stringify({ ok: true, ...stats }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (err) {
    console.error('Slack queue drain error:', err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        ...stats,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

// Returns null if the row's event_type isn't recognized.
function renderMessage(row: QueueRow): string | null {
  switch (row.event_type) {
    case 'new_signup': {
      const payload = row.payload ?? {};
      const userName = (payload.business_name as string | null | undefined)
        || (payload.email as string | null | undefined)?.split('@')[0]
        || 'Unknown';
      const userEmail = (payload.email as string | null | undefined) || '(no email)';
      const authProvider = (payload.auth_provider as string | undefined) || 'google';
      return buildNewSignupMessage({
        user_name: userName,
        user_email: userEmail,
        auth_provider: authProvider,
        signed_up_at_ist: formatTimestampIST(new Date()),
      });
    }
    default:
      return null;
  }
}

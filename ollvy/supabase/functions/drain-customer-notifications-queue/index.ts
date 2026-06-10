// drain-customer-notifications-queue
//
// Cron schedule: every 2 minutes (*/2 * * * *).
// Register via Supabase Dashboard -> Edge Functions -> Schedule (same pattern
// as the rest of the crons in this repo, per ollvy_spec.md §23).
//
// Coalesces customer_notifications_queue rows per order_id and sends one
// "admin update" email per order after a 10-minute quiet window. The window
// is measured against the LAST queued event for that order, so a burst of
// admin actions still produces just one email.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { sendEmail } from '../_shared/email.ts';
import { resolveCustomerGreeting, formatDateHuman } from '../_shared/format.ts';
import { buildAdminUpdate } from '../_shared/email-templates/admin-update.ts';
import { notifySlackError } from '../_shared/slack.ts';

const QUIET_WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 3;

interface QueueRow {
  id: string;
  order_id: string;
  event_type: string;
  created_at: string;
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
  const stats = {
    processed_orders: 0,
    success: 0,
    failed: 0,
    skipped_no_email: 0,
  };

  try {
    // Pull all unsent rows under the attempt cap. We filter by quiet-window
    // per order in JS so a single new event correctly resets the timer for
    // that order's whole burst.
    const { data: pending, error: fetchError } = await supabase
      .from('customer_notifications_queue')
      .select('id, order_id, event_type, created_at, send_attempt_count')
      .is('sent_at', null)
      .lt('send_attempt_count', MAX_ATTEMPTS)
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('Failed to fetch queue:', fetchError);
      return new Response(
        JSON.stringify({ ok: false, error: fetchError.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      );
    }

    const rows = (pending ?? []) as QueueRow[];
    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, ...stats }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }

    // Group by order_id and find each order's latest queued event.
    const byOrder = new Map<string, { rows: QueueRow[]; lastCreated: number }>();
    for (const r of rows) {
      const ts = new Date(r.created_at).getTime();
      const existing = byOrder.get(r.order_id);
      if (existing) {
        existing.rows.push(r);
        if (ts > existing.lastCreated) existing.lastCreated = ts;
      } else {
        byOrder.set(r.order_id, { rows: [r], lastCreated: ts });
      }
    }

    const cutoff = Date.now() - QUIET_WINDOW_MS;

    for (const [orderId, group] of byOrder.entries()) {
      // Skip orders still inside the debounce window. We'll get them next tick.
      if (group.lastCreated > cutoff) continue;

      stats.processed_orders++;

      // Look up everything we need for the email in one query.
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          users!inner (id, email, business_name),
          service_packages!inner (id, name)
        `)
        .eq('id', orderId)
        .single();

      const queueIds = group.rows.map((r) => r.id);

      if (orderError || !order) {
        console.error(JSON.stringify({
          event: 'drain_order_lookup_failed',
          order_id: orderId,
          error: orderError?.message,
        }));
        await markRowsFailed(supabase, group.rows, 'order_lookup_failed');
        stats.failed++;
        continue;
      }

      const userRow = Array.isArray(order.users) ? order.users[0] : order.users;
      const serviceRow = Array.isArray(order.service_packages)
        ? order.service_packages[0]
        : order.service_packages;

      const customerEmail = userRow?.email as string | null | undefined;
      if (!customerEmail) {
        // Stop retrying - the user has no email on file.
        console.warn(JSON.stringify({
          event: 'email_skipped',
          reason: 'no_email_on_user',
          order_id: orderId,
          intended_template: 'admin_update',
        }));
        await supabase
          .from('customer_notifications_queue')
          .update({
            sent_at: new Date().toISOString(),
            last_error: 'no_email_on_user',
          })
          .in('id', queueIds);
        stats.skipped_no_email++;
        continue;
      }

      // Map queued event types to customer-facing lines. Internal "round
      // moving" events (round_created / round_completed) are not shown to the
      // customer. If the batch has nothing customer-relevant, skip the email.
      const RELEVANT: Record<string, string> = {
        admin_document_uploaded: 'We have uploaded a document to your order for you to review.',
        question_added: 'We have added a few questions for you to answer.',
      };
      const eventTypes = new Set(group.rows.map((r) => r.event_type));
      const updates = Object.keys(RELEVANT)
        .filter((t) => eventTypes.has(t))
        .map((t) => RELEVANT[t]);

      if (updates.length === 0) {
        // Internal-only batch: mark handled so it does not requeue, no email.
        await supabase
          .from('customer_notifications_queue')
          .update({ sent_at: new Date().toISOString(), last_error: 'no_customer_relevant_events' })
          .in('id', queueIds);
        continue;
      }

      const { subject, html } = buildAdminUpdate({
        customer_greeting: resolveCustomerGreeting({
          business_name: userRow?.business_name ?? null,
          email: customerEmail,
        }),
        service_name: serviceRow?.name ?? 'your order',
        order_number: order.order_number,
        order_id: order.id,
        // Date of the most recent queued event in this coalesced batch.
        update_date_human: formatDateHuman(new Date(group.lastCreated)),
        updates,
      });

      const sendResult = await sendEmail({
        to: customerEmail,
        subject,
        html,
        tags: [
          { name: 'template', value: 'admin_update' },
          { name: 'order_id', value: order.id },
        ],
      });

      if (sendResult.success) {
        await supabase
          .from('customer_notifications_queue')
          .update({ sent_at: new Date().toISOString() })
          .in('id', queueIds)
          .is('sent_at', null);
        stats.success++;
      } else {
        // Increment attempt count. If we've hit the cap on this row, mark sent
        // (give up) and log loudly so it surfaces in observability.
        for (const row of group.rows) {
          const newCount = row.send_attempt_count + 1;
          const update: Record<string, unknown> = {
            send_attempt_count: newCount,
            last_error: sendResult.error,
          };
          if (newCount >= MAX_ATTEMPTS) {
            update.sent_at = new Date().toISOString();
            console.error(JSON.stringify({
              event: 'admin_update_email_giving_up',
              order_id: orderId,
              attempts: newCount,
              error: sendResult.error,
            }));
            await notifySlackError({
              function_name: 'drain-customer-notifications-queue',
              error: `admin_update email gave up after ${newCount} attempts: ${sendResult.error}`,
              order_id: orderId,
              context: 'customer_notifications_queue final-attempt failure',
            });
          }
          await supabase
            .from('customer_notifications_queue')
            .update(update)
            .eq('id', row.id);
        }
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
    console.error('Drain error:', err);
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

async function markRowsFailed(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  rows: QueueRow[],
  reason: string,
): Promise<void> {
  for (const row of rows) {
    const newCount = row.send_attempt_count + 1;
    const update: Record<string, unknown> = {
      send_attempt_count: newCount,
      last_error: reason,
    };
    if (newCount >= MAX_ATTEMPTS) {
      update.sent_at = new Date().toISOString();
    }
    await supabase
      .from('customer_notifications_queue')
      .update(update)
      .eq('id', row.id);
  }
}

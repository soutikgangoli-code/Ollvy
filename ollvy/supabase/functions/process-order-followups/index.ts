// process-order-followups
//
// Cron schedule: every 20 minutes (*/20 * * * *).
// Register via Supabase Dashboard -> Edge Functions -> Schedule (same pattern
// as the rest of the crons in this repo). One cron, two passes per run, so we
// do NOT add a separate scheduled function per task and keep cron load low.
//
// Pass A - delayed submission-complete email:
//   Sends the "we have everything, work starts now" email once BOTH
//   questionnaire_completed_at and documents_completed_at are set AND the later
//   of the two is at least 2 hours old AND submission_complete_email_sent_at is
//   still null. The 2-hour settle window lets a customer who fat-fingers a
//   document and re-uploads avoid getting the "all done" email prematurely.
//   Idempotent via submission_complete_email_sent_at.
//
// Pass B - incomplete-order reminders:
//   For paid orders that are NOT yet both-complete, sends a nudge at 3, 6 and 9
//   days after paid_at, max 3 total, and stops forever once both are done.
//   Idempotent via orders.incomplete_reminders_sent (guarded UPDATE).

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { sendEmail } from '../_shared/email.ts';
import { formatDateHuman, resolveCustomerGreeting } from '../_shared/format.ts';
import { getCompletionEstimate } from '../_shared/guaranteed-date.ts';
import { buildSubmissionComplete } from '../_shared/email-templates/submission-complete.ts';
import { buildIncompleteOrderReminder } from '../_shared/email-templates/incomplete-order-reminder.ts';
import { notifySlackError } from '../_shared/slack.ts';

// Reminder thresholds in days-since-paid. reminder N (1..3) fires at REMINDER_DAYS[N-1].
const REMINDER_DAYS = [3, 6, 9];
const SUBMISSION_SETTLE_MS = 2 * 60 * 60 * 1000; // 2 hours
const DAY_MS = 24 * 60 * 60 * 1000;

// deno-lint-ignore no-explicit-any
type Supa = any;

interface ServicePackageRow {
  name: string;
  sla_working_days: number | null;
  has_govt_processing: boolean | null;
  completion_max_days: number | null;
  completion_range_text: string | null;
}

interface UserRow {
  email: string | null;
  business_name: string | null;
}

interface OrderRow {
  id: string;
  order_number: string;
  user_id: string;
  service_package_id: string;
  paid_at: string | null;
  questionnaire_completed_at: string | null;
  documents_completed_at: string | null;
  submission_complete_email_sent_at: string | null;
  incomplete_reminders_sent: number | null;
  last_incomplete_reminder_at: string | null;
  users: UserRow | UserRow[] | null;
  service_packages: ServicePackageRow | ServicePackageRow[] | null;
}

function one<T>(v: T | T[] | null): T | null {
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

const ORDER_SELECT = `
  id,
  order_number,
  user_id,
  service_package_id,
  paid_at,
  questionnaire_completed_at,
  documents_completed_at,
  submission_complete_email_sent_at,
  incomplete_reminders_sent,
  last_incomplete_reminder_at,
  users!inner (email, business_name),
  service_packages!inner (name, sla_working_days, has_govt_processing, completion_max_days, completion_range_text)
`;

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
    submission_sent: 0,
    submission_failed: 0,
    submission_skipped_no_email: 0,
    reminder_sent: 0,
    reminder_failed: 0,
    reminder_skipped_no_email: 0,
  };

  try {
    await runSubmissionPass(supabase, stats);
    await runReminderPass(supabase, stats);

    return new Response(
      JSON.stringify({ ok: true, ...stats }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (err) {
    console.error('process-order-followups error:', err);
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

// ---------------------------------------------------------------------------
// Pass A: delayed submission-complete email
// ---------------------------------------------------------------------------
async function runSubmissionPass(
  supabase: Supa,
  stats: Record<string, number>,
): Promise<void> {
  // Both completions set, email not yet sent. We apply the 2-hour settle check
  // in JS against max(questionnaire, documents).
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .not('questionnaire_completed_at', 'is', null)
    .not('documents_completed_at', 'is', null)
    .is('submission_complete_email_sent_at', null);

  if (error) {
    console.error(JSON.stringify({ event: 'followups_submission_fetch_failed', error: error.message }));
    return;
  }

  const orders = (data ?? []) as OrderRow[];
  const now = Date.now();

  for (const order of orders) {
    const qDone = new Date(order.questionnaire_completed_at as string).getTime();
    const dDone = new Date(order.documents_completed_at as string).getTime();
    const submittedAt = Math.max(qDone, dDone);

    // Hold until the later completion is at least 2 hours old.
    if (submittedAt > now - SUBMISSION_SETTLE_MS) continue;

    const userRow = one(order.users);
    const serviceRow = one(order.service_packages);
    const email = userRow?.email ?? null;

    if (!email) {
      console.warn(JSON.stringify({
        event: 'email_skipped',
        reason: 'no_email_on_user',
        order_id: order.id,
        intended_template: 'submission_complete',
      }));
      // Stamp so we stop re-evaluating this order every run.
      await supabase
        .from('orders')
        .update({ submission_complete_email_sent_at: new Date().toISOString() })
        .eq('id', order.id)
        .is('submission_complete_email_sent_at', null);
      stats.submission_skipped_no_email++;
      continue;
    }

    const estimate = serviceRow
      ? getCompletionEstimate(
          serviceRow.sla_working_days ?? 0,
          Boolean(serviceRow.has_govt_processing),
          serviceRow.completion_max_days,
          serviceRow.completion_range_text,
        )
      : null;
    const guaranteedDate = estimate?.guaranteedDate ?? 'your order page';

    const { subject, html } = buildSubmissionComplete({
      customer_greeting: resolveCustomerGreeting({
        business_name: userRow?.business_name ?? null,
        email,
      }),
      service_name: serviceRow?.name ?? 'your order',
      order_number: order.order_number,
      order_id: order.id,
      submitted_at_human: formatDateHuman(new Date(submittedAt)),
      guaranteed_date: guaranteedDate,
    });

    const result = await sendEmail({
      to: email,
      subject,
      html,
      tags: [
        { name: 'template', value: 'submission_complete' },
        { name: 'order_id', value: order.id },
      ],
    });

    if (!result.success) {
      console.error(JSON.stringify({
        event: 'submission_complete_email_failed',
        order_id: order.id,
        error: result.error,
      }));
      stats.submission_failed++;
      continue;
    }

    // Idempotency guard: only the run that flips null -> now "wins" the send.
    await supabase
      .from('orders')
      .update({ submission_complete_email_sent_at: new Date().toISOString() })
      .eq('id', order.id)
      .is('submission_complete_email_sent_at', null);
    stats.submission_sent++;
  }
}

// ---------------------------------------------------------------------------
// Pass B: incomplete-order reminders (3 / 6 / 9 days, max 3)
// ---------------------------------------------------------------------------
async function runReminderPass(
  supabase: Supa,
  stats: Record<string, number>,
): Promise<void> {
  // Paid, fewer than 3 reminders sent, and NOT both complete (one of the two
  // completion stamps is still null). Once both are complete the order drops
  // out of this set forever.
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .not('paid_at', 'is', null)
    .lt('incomplete_reminders_sent', REMINDER_DAYS.length)
    .or('questionnaire_completed_at.is.null,documents_completed_at.is.null');

  if (error) {
    console.error(JSON.stringify({ event: 'followups_reminder_fetch_failed', error: error.message }));
    return;
  }

  const orders = (data ?? []) as OrderRow[];
  const now = Date.now();

  for (const order of orders) {
    const sentSoFar = order.incomplete_reminders_sent ?? 0;
    const nextReminder = sentSoFar + 1; // N we would send now
    if (nextReminder > REMINDER_DAYS.length) continue;

    const paidAt = new Date(order.paid_at as string).getTime();
    const daysSincePaid = Math.floor((now - paidAt) / DAY_MS);
    if (daysSincePaid < REMINDER_DAYS[nextReminder - 1]) continue;

    const userRow = one(order.users);
    const serviceRow = one(order.service_packages);
    const email = userRow?.email ?? null;

    const questionnaireDone = order.questionnaire_completed_at != null;
    const documentsDone = order.documents_completed_at != null;

    // Compute remaining questions / documents.
    const { total, remaining } = await computeQuestionnaireProgress(
      supabase,
      order.service_package_id,
      order.id,
    );
    const { pending, uploaded } = await computeDocumentProgress(supabase, order.id);

    if (!email) {
      console.warn(JSON.stringify({
        event: 'email_skipped',
        reason: 'no_email_on_user',
        order_id: order.id,
        intended_template: 'incomplete_order_reminder',
      }));
      // Advance the counter so we don't reconsider this order endlessly.
      await stampReminder(supabase, order.id, sentSoFar);
      stats.reminder_skipped_no_email++;
      continue;
    }

    const { subject, html } = buildIncompleteOrderReminder({
      customer_greeting: resolveCustomerGreeting({
        business_name: userRow?.business_name ?? null,
        email,
      }),
      service_name: serviceRow?.name ?? 'your order',
      order_number: order.order_number,
      order_id: order.id,
      paid_at_human: formatDateHuman(new Date(paidAt)),
      reminder_number: nextReminder,
      questionnaire_done: questionnaireDone,
      documents_done: documentsDone,
      total_questions: total,
      remaining_questions: remaining,
      pending_documents: pending,
      uploaded_documents: uploaded,
    });

    const result = await sendEmail({
      to: email,
      subject,
      html,
      tags: [
        { name: 'template', value: 'incomplete_order_reminder' },
        { name: 'order_id', value: order.id },
      ],
    });

    if (!result.success) {
      console.error(JSON.stringify({
        event: 'incomplete_order_reminder_failed',
        order_id: order.id,
        reminder_number: nextReminder,
        error: result.error,
      }));
      stats.reminder_failed++;
      if (nextReminder >= REMINDER_DAYS.length) {
        await notifySlackError({
          function_name: 'process-order-followups',
          error: `incomplete_order_reminder final send failed: ${result.error}`,
          order_id: order.id,
          context: 'incomplete-order reminder (final attempt)',
        });
      }
      continue;
    }

    await stampReminder(supabase, order.id, sentSoFar);
    stats.reminder_sent++;
  }
}

// Guarded increment: only succeeds if incomplete_reminders_sent is still the
// value we read, so a concurrent run can never push the counter past N.
async function stampReminder(
  supabase: Supa,
  orderId: string,
  expectedSentSoFar: number,
): Promise<void> {
  await supabase
    .from('orders')
    .update({
      incomplete_reminders_sent: expectedSentSoFar + 1,
      last_incomplete_reminder_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('incomplete_reminders_sent', expectedSentSoFar);
}

// total = active questions for the service (BASE total, depends_on NOT
// evaluated). remaining = max(0, total - answered responses).
async function computeQuestionnaireProgress(
  supabase: Supa,
  servicePackageId: string,
  orderId: string,
): Promise<{ total: number; remaining: number }> {
  // is_active != false  ->  true OR null. PostgREST: not.is.false catches null too.
  const { count: totalCount } = await supabase
    .from('service_questionnaires')
    .select('question_key', { count: 'exact', head: true })
    .eq('service_package_id', servicePackageId)
    .not('is_active', 'is', false);

  const { count: answeredCount } = await supabase
    .from('order_questionnaire_responses')
    .select('question_key', { count: 'exact', head: true })
    .eq('order_id', orderId);

  const total = totalCount ?? 0;
  const answered = answeredCount ?? 0;
  return { total, remaining: Math.max(0, total - answered) };
}

// pending = required docs not yet uploaded; uploaded = required docs already in.
async function computeDocumentProgress(
  supabase: Supa,
  orderId: string,
): Promise<{ pending: string[]; uploaded: string[] }> {
  const { data, error } = await supabase
    .from('order_documents')
    .select('document_label, is_required, uploaded_at')
    .eq('order_id', orderId)
    .eq('is_required', true);

  if (error || !data) return { pending: [], uploaded: [] };

  const pending: string[] = [];
  const uploaded: string[] = [];
  for (const row of data as Array<{ document_label: string; uploaded_at: string | null }>) {
    if (row.uploaded_at) uploaded.push(row.document_label);
    else pending.push(row.document_label);
  }
  return { pending, uploaded };
}

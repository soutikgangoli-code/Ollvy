// Deno-side Slack client. Mirrors apps/customer/lib/slack/notify.ts.
//
// Returns structured results rather than throwing - Slack failures must
// never break the parent operation (webhook, server action, cron).

import {
  buildEdgeFunctionErrorMessage,
  buildEmailFailureMessage,
} from './slack-messages.ts';
import { formatTimestampIST } from './format.ts';

export type SlackChannel = 'payments' | 'ops' | 'errors' | 'leads' | 'daily_summary';

export type SlackResult =
  | { success: true }
  | { success: false; error: string; status?: number };

const channelToEnvVar: Record<SlackChannel, string> = {
  payments: 'SLACK_WEBHOOK_PAYMENTS',
  ops: 'SLACK_WEBHOOK_OPS',
  errors: 'SLACK_WEBHOOK_ERRORS',
  leads: 'SLACK_WEBHOOK_LEADS',
  daily_summary: 'SLACK_WEBHOOK_DAILY_SUMMARY',
};

export async function postToSlack(params: {
  channel: SlackChannel;
  text: string;
}): Promise<SlackResult> {
  const envVar = channelToEnvVar[params.channel];
  const url = Deno.env.get(envVar);

  if (!url) {
    console.warn(JSON.stringify({
      event: 'slack_skipped',
      reason: 'webhook_not_configured',
      channel: params.channel,
    }));
    return { success: false, error: 'webhook_not_configured' };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: params.text }),
    });

    if (!res.ok) {
      let errorMessage = `Slack HTTP ${res.status}`;
      try {
        const body = await res.text();
        if (body) errorMessage = `${errorMessage}: ${body.slice(0, 200)}`;
      } catch {
        // body unreadable
      }
      console.log(JSON.stringify({
        event: 'slack_post',
        channel: params.channel,
        success: false,
        error: errorMessage,
        status: res.status,
      }));
      return { success: false, error: errorMessage, status: res.status };
    }

    console.log(JSON.stringify({
      event: 'slack_post',
      channel: params.channel,
      success: true,
    }));
    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.log(JSON.stringify({
      event: 'slack_post',
      channel: params.channel,
      success: false,
      error,
    }));
    return { success: false, error };
  }
}

// Best-effort error notification. Wrapped internally so it cannot throw.
// Refuses to recurse into #errors when the failing call is already on #errors.
export async function notifySlackError(params: {
  function_name: string;
  error: Error | string;
  order_id?: string;
  context?: string;
}): Promise<void> {
  try {
    const errorMessage = params.error instanceof Error ? params.error.message : params.error;
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const projectRefMatch = supabaseUrl.match(/^https?:\/\/([^.]+)\./);
    const projectRef = projectRefMatch ? projectRefMatch[1] : 'unknown';

    const text = buildEdgeFunctionErrorMessage({
      function_name: params.function_name,
      error_message: errorMessage,
      order_id: params.order_id,
      context: params.context,
      occurred_at_ist: formatTimestampIST(new Date()),
      supabase_project_ref: projectRef,
    });
    await postToSlack({ channel: 'errors', text });
  } catch (err) {
    console.error(JSON.stringify({
      event: 'notify_slack_error_failed',
      error: err instanceof Error ? err.message : String(err),
    }));
  }
}

export async function notifySlackEmailFailure(params: {
  template_name: string;
  recipient_email: string;
  order_id?: string;
  error_message: string;
}): Promise<void> {
  try {
    const text = buildEmailFailureMessage({
      template_name: params.template_name,
      recipient_email: params.recipient_email,
      order_id: params.order_id,
      error_message: params.error_message,
      attempted_at_ist: formatTimestampIST(new Date()),
    });
    await postToSlack({ channel: 'errors', text });
  } catch (err) {
    console.error(JSON.stringify({
      event: 'notify_slack_email_failure_failed',
      error: err instanceof Error ? err.message : String(err),
    }));
  }
}

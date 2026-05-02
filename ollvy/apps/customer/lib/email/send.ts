// Node (Next.js server) Resend client. Mirrors supabase/functions/_shared/email.ts.
//
// Returns a structured result rather than throwing - customer-facing email
// failures should not break the server action that triggered them.

import { notifySlackEmailFailure } from '@/lib/slack/notify';

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

export type SendEmailResult =
  | { success: true; id: string }
  | { success: false; error: string; status?: number };

const DEFAULT_FROM = 'Ollvy <hello@ollvy.com>';
const DEFAULT_REPLY_TO = 'support@ollvy.com';

function htmlToText(html: string): string {
  return html
    .replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<br\s*\/?>(\s*)/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Missing required environment variable: RESEND_API_KEY');
  }

  const from = params.from || DEFAULT_FROM;
  const replyTo = params.replyTo || DEFAULT_REPLY_TO;
  const html = params.html;
  const text = params.text || (html ? htmlToText(html) : undefined);

  const payload: Record<string, unknown> = {
    from,
    to: params.to,
    subject: params.subject,
    reply_to: replyTo,
  };
  if (html) payload.html = html;
  if (text) payload.text = text;
  if (params.tags) payload.tags = params.tags;

  const recipientForLog = Array.isArray(params.to) ? params.to.join(',') : params.to;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errorMessage = `Resend HTTP ${res.status}`;
      try {
        const errorBody = await res.json();
        if (errorBody?.message) errorMessage = errorBody.message;
        else if (errorBody?.error) errorMessage = String(errorBody.error);
      } catch {
        // Non-JSON error body.
      }
      console.log(JSON.stringify({
        event: 'email_send',
        success: false,
        to: recipientForLog,
        subject: params.subject,
        error: errorMessage,
        status: res.status,
      }));
      await postSlackFailureNotice(params, errorMessage);
      return { success: false, error: errorMessage, status: res.status };
    }

    const body = await res.json();
    const id = String(body?.id ?? '');
    console.log(JSON.stringify({
      event: 'email_send',
      success: true,
      to: recipientForLog,
      subject: params.subject,
      id,
    }));
    return { success: true, id };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.log(JSON.stringify({
      event: 'email_send',
      success: false,
      to: recipientForLog,
      subject: params.subject,
      error,
    }));
    await postSlackFailureNotice(params, error);
    return { success: false, error };
  }
}

// Best-effort #errors notification on email failure. Pulls template_name and
// order_id out of params.tags so callers don't need to pass extra fields.
async function postSlackFailureNotice(
  params: SendEmailParams,
  errorMessage: string,
): Promise<void> {
  try {
    const tagFor = (name: string): string | undefined =>
      params.tags?.find((t) => t.name === name)?.value;
    const templateName = tagFor('template') ?? 'unknown_template';
    const orderId = tagFor('order_id');
    const recipient = Array.isArray(params.to) ? params.to.join(',') : params.to;
    await notifySlackEmailFailure({
      template_name: templateName,
      recipient_email: recipient,
      order_id: orderId,
      error_message: errorMessage,
    });
  } catch {
    // notifySlackEmailFailure is internally try/catched, but belt-and-braces.
  }
}

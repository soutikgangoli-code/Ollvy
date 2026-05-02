// Deno mirror of apps/customer/lib/slack/messages.ts. Only the builders
// actually invoked from edge functions are duplicated here:
//   - buildPaymentCapturedMessage  (razorpay-webhook)
//   - buildEdgeFunctionErrorMessage (notifySlackError in Deno helpers)
//   - buildEmailFailureMessage     (notifySlackEmailFailure in Deno helpers)
//   - buildNewSignupMessage        (drain-slack-notifications-queue)
//   - buildDailySummaryMessage     (daily-summary-pulse)
//
// buildReadyForWorkMessage and buildOrderCompletedMessage live only Node-side.
// Keep this file in sync with the Node version when copy changes.

import { formatPaisa } from './format.ts';

export const ADMIN_ROOT_URL = 'https://www.ollvy.com';

export function buildPaymentCapturedMessage(input: {
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  service_name: string;
  total_paisa: number;
  order_number: string;
  order_id: string;
  paid_at_ist: string;
  admin_root_url: string;
}): string {
  const phoneLine = input.customer_phone ? `\n📞 ${input.customer_phone}` : '';
  return [
    `💰 ${formatPaisa(input.total_paisa)} · ${input.service_name}`,
    `👤 ${input.customer_name}${phoneLine}`,
    `✉️ ${input.customer_email}`,
    `🆔 ${input.order_number}`,
    `👉 <${input.admin_root_url}/admin/orders/${input.order_id}|View in admin>`,
    `🕐 ${input.paid_at_ist}`,
  ].join('\n');
}

export function buildEdgeFunctionErrorMessage(input: {
  function_name: string;
  error_message: string;
  order_id?: string;
  context?: string;
  occurred_at_ist: string;
  supabase_project_ref: string;
}): string {
  const lines = [
    '🚨 Edge function failure',
    `🔧 ${input.function_name}`,
    `💥 ${input.error_message}`,
  ];
  if (input.order_id) lines.push(`🆔 order_id: ${input.order_id}`);
  if (input.context) lines.push(`📋 ${input.context}`);
  lines.push(
    `👉 <https://supabase.com/dashboard/project/${input.supabase_project_ref}/functions/${input.function_name}/logs|View Supabase logs>`,
  );
  lines.push(`🕐 ${input.occurred_at_ist}`);
  return lines.join('\n');
}

export function buildEmailFailureMessage(input: {
  template_name: string;
  recipient_email: string;
  order_id?: string;
  error_message: string;
  attempted_at_ist: string;
}): string {
  const lines = [
    '🚨 Email send failure',
    `📧 Template: ${input.template_name}`,
    `👤 To: ${input.recipient_email}`,
  ];
  if (input.order_id) lines.push(`🆔 order_id: ${input.order_id}`);
  lines.push(`💥 ${input.error_message}`);
  lines.push(`🕐 ${input.attempted_at_ist}`);
  return lines.join('\n');
}

export function buildNewSignupMessage(input: {
  user_name: string;
  user_email: string;
  auth_provider: string;
  signed_up_at_ist: string;
}): string {
  const provider = input.auth_provider === 'google'
    ? 'Google OAuth'
    : input.auth_provider.charAt(0).toUpperCase() + input.auth_provider.slice(1);

  return [
    '🎉 New signup',
    `👤 ${input.user_name}`,
    `✉️ ${input.user_email}`,
    `🔐 Via: ${provider}`,
    `🕐 ${input.signed_up_at_ist}`,
  ].join('\n');
}

export function buildDailySummaryMessage(input: {
  pulse_type: 'midday' | 'eod';
  date_human: string;
  signups: number;
  orders: number;
  revenue_paisa: number;
  completions: number;
  generated_at_ist: string;
}): string {
  const header = input.pulse_type === 'midday'
    ? `☀️ Midday pulse · ${input.date_human}`
    : `🌙 Daily summary · ${input.date_human}`;
  const suffix = input.pulse_type === 'midday' ? 'so far' : 'today';

  const lines: string[] = [header];
  if (input.signups > 0) lines.push(`🚪 New signups ${suffix}: ${input.signups}`);
  if (input.orders > 0) lines.push(`📦 New orders ${suffix}: ${input.orders}`);
  if (input.revenue_paisa > 0) lines.push(`💰 Revenue ${suffix}: ${formatPaisa(input.revenue_paisa)}`);
  if (input.completions > 0) lines.push(`🎯 Orders completed ${suffix}: ${input.completions}`);

  if (lines.length === 1) lines.push('Nothing to report today.');

  lines.push(`🕐 ${input.generated_at_ist}`);
  return lines.join('\n');
}

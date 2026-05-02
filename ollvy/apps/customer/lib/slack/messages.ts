// Node-side Slack message builders. Pure string functions, no side effects.
//
// Each builder returns a Slack-compatible plain-text message. Slack renders
// `<url|label>` as a hyperlink. Emoji are inline literals, not :name: codes,
// so no Slack-side translation is required.

import { formatPaisa } from '@/lib/utils'

// Stable production root. There is no separate admin domain - admin lives
// under the customer app at /admin/*. Hardcoded so this module has no env deps.
export const ADMIN_ROOT_URL = 'https://www.ollvy.com'

export function buildPaymentCapturedMessage(input: {
  customer_name: string
  customer_email: string
  customer_phone: string | null
  service_name: string
  total_paisa: number
  order_number: string
  order_id: string
  paid_at_ist: string
  admin_root_url: string
}): string {
  const phoneLine = input.customer_phone ? `\n📞 ${input.customer_phone}` : ''
  return [
    `💰 ${formatPaisa(input.total_paisa)} · ${input.service_name}`,
    `👤 ${input.customer_name}${phoneLine}`,
    `✉️ ${input.customer_email}`,
    `🆔 ${input.order_number}`,
    `👉 <${input.admin_root_url}/admin/orders/${input.order_id}|View in admin>`,
    `🕐 ${input.paid_at_ist}`,
  ].join('\n')
}

export function buildReadyForWorkMessage(input: {
  customer_name: string
  service_name: string
  order_number: string
  order_id: string
  hours_after_payment: number
  days_after_payment: number
  assigned_professional_name: string | null
  submitted_at_ist: string
  admin_root_url: string
}): string {
  const timePhrase = input.hours_after_payment < 48
    ? `${input.hours_after_payment} hours after payment`
    : `${input.days_after_payment} days after payment`

  return [
    `✅ Ready for work: ${input.order_number}`,
    `🛍️ ${input.service_name}`,
    `👤 ${input.customer_name}`,
    `📝 Questionnaire ✓`,
    `📎 Documents ✓`,
    `⏱️ Submitted ${timePhrase}`,
    `👨‍💼 Assigned to: ${input.assigned_professional_name || 'Not assigned yet'}`,
    `👉 <${input.admin_root_url}/admin/orders/${input.order_id}|Open order>`,
    `🕐 ${input.submitted_at_ist}`,
  ].join('\n')
}

export function buildOrderCompletedMessage(input: {
  customer_name: string
  service_name: string
  order_number: string
  order_id: string
  working_days_taken: number
  sla_working_days: number
  completed_by_name: string
  completed_at_ist: string
  admin_root_url: string
}): string {
  const slaStatus = input.working_days_taken <= input.sla_working_days
    ? 'within SLA'
    : `breached SLA by ${input.working_days_taken - input.sla_working_days} day${
        input.working_days_taken - input.sla_working_days === 1 ? '' : 's'
      }`

  return [
    `🎯 Completed: ${input.order_number}`,
    `🛍️ ${input.service_name}`,
    `👤 ${input.customer_name}`,
    `⏱️ ${input.working_days_taken} working days (${slaStatus})`,
    `👨‍💼 Completed by: ${input.completed_by_name}`,
    `👉 <${input.admin_root_url}/admin/orders/${input.order_id}|Open order>`,
    `🕐 ${input.completed_at_ist}`,
  ].join('\n')
}

export function buildEdgeFunctionErrorMessage(input: {
  function_name: string
  error_message: string
  order_id?: string
  context?: string
  occurred_at_ist: string
  supabase_project_ref: string
}): string {
  const lines = [
    '🚨 Edge function failure',
    `🔧 ${input.function_name}`,
    `💥 ${input.error_message}`,
  ]
  if (input.order_id) lines.push(`🆔 order_id: ${input.order_id}`)
  if (input.context) lines.push(`📋 ${input.context}`)
  lines.push(
    `👉 <https://supabase.com/dashboard/project/${input.supabase_project_ref}/functions/${input.function_name}/logs|View Supabase logs>`,
  )
  lines.push(`🕐 ${input.occurred_at_ist}`)
  return lines.join('\n')
}

export function buildEmailFailureMessage(input: {
  template_name: string
  recipient_email: string
  order_id?: string
  error_message: string
  attempted_at_ist: string
}): string {
  const lines = [
    '🚨 Email send failure',
    `📧 Template: ${input.template_name}`,
    `👤 To: ${input.recipient_email}`,
  ]
  if (input.order_id) lines.push(`🆔 order_id: ${input.order_id}`)
  lines.push(`💥 ${input.error_message}`)
  lines.push(`🕐 ${input.attempted_at_ist}`)
  return lines.join('\n')
}

export function buildNewSignupMessage(input: {
  user_name: string
  user_email: string
  auth_provider: string
  signed_up_at_ist: string
}): string {
  const provider = input.auth_provider === 'google'
    ? 'Google OAuth'
    : input.auth_provider.charAt(0).toUpperCase() + input.auth_provider.slice(1)

  return [
    '🎉 New signup',
    `👤 ${input.user_name}`,
    `✉️ ${input.user_email}`,
    `🔐 Via: ${provider}`,
    `🕐 ${input.signed_up_at_ist}`,
  ].join('\n')
}

export function buildDailySummaryMessage(input: {
  pulse_type: 'midday' | 'eod'
  date_human: string
  signups: number
  orders: number
  revenue_paisa: number
  completions: number
  generated_at_ist: string
}): string {
  const header = input.pulse_type === 'midday'
    ? `☀️ Midday pulse · ${input.date_human}`
    : `🌙 Daily summary · ${input.date_human}`
  const suffix = input.pulse_type === 'midday' ? 'so far' : 'today'

  const lines: string[] = [header]
  if (input.signups > 0) lines.push(`🚪 New signups ${suffix}: ${input.signups}`)
  if (input.orders > 0) lines.push(`📦 New orders ${suffix}: ${input.orders}`)
  if (input.revenue_paisa > 0) lines.push(`💰 Revenue ${suffix}: ${formatPaisa(input.revenue_paisa)}`)
  if (input.completions > 0) lines.push(`🎯 Orders completed ${suffix}: ${input.completions}`)

  // Quiet day - one explicit line beats silent-cron ambiguity.
  if (lines.length === 1) lines.push('Nothing to report today.')

  lines.push(`🕐 ${input.generated_at_ist}`)
  return lines.join('\n')
}

'use server'

import { createServerSupabase, getUser, supabaseServer } from '@/lib/supabase-server'
import { logActivity, LOG_ACTIONS } from '@/lib/admin/log-activity'
import { sendEmail } from '@/lib/email/send'
import { formatDateHuman, resolveCustomerGreeting } from '@/lib/email/format'
import { buildSubmissionComplete } from '@/lib/email/templates/submission-complete'

/**
 * Log customer document upload to activity log
 */
export async function logCustomerDocumentUpload(orderId: string, documentName: string) {
  const user = await getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Verify the user owns this order
  const supabase = await createServerSupabase()
  const { data: order } = await supabase
    .from('orders')
    .select('id, user_id')
    .eq('id', orderId)
    .single()

  if (!order || order.user_id !== user.id) {
    return { success: false, error: 'Not authorized' }
  }

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.DOCUMENT_UPLOADED,
    actorType: 'user',
    actorId: user.id,
    actorName: user.name || user.email || 'Customer',
    description: `Customer uploaded document: ${documentName}`,
    metadata: { documentName },
  })

  return { success: true }
}

/**
 * Log customer questionnaire answer to activity log
 */
export async function logCustomerQuestionnaireAnswer(
  orderId: string,
  questionKeys: string[],
  stepNumber?: number
) {
  const user = await getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Verify the user owns this order
  const supabase = await createServerSupabase()
  const { data: order } = await supabase
    .from('orders')
    .select('id, user_id')
    .eq('id', orderId)
    .single()

  if (!order || order.user_id !== user.id) {
    return { success: false, error: 'Not authorized' }
  }

  const questionCount = questionKeys.length
  const description = stepNumber
    ? `Customer answered ${questionCount} question${questionCount > 1 ? 's' : ''} in step ${stepNumber}`
    : `Customer answered ${questionCount} question${questionCount > 1 ? 's' : ''}`

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.QUESTION_ANSWERED,
    actorType: 'user',
    actorId: user.id,
    actorName: user.name || user.email || 'Customer',
    description,
    metadata: { questionKeys, stepNumber },
  })

  return { success: true }
}

/**
 * Fires the "submission complete" customer email when BOTH the questionnaire
 * and required documents are done. Idempotent via submission_complete_email_sent_at.
 *
 * Called from QuestionnaireWizard (after final-step save) and DocumentsPageClient
 * (after each upload completes). Whichever finishes second triggers the send.
 *
 * Failures are logged but never thrown - this should not break the calling flow.
 */
export async function checkAndFireSubmissionEmail(orderId: string): Promise<void> {
  const user = await getUser()
  if (!user) return

  if (!supabaseServer) {
    console.error('checkAndFireSubmissionEmail: service client unavailable')
    return
  }

  // Single query: ownership check + completion timestamps + service/user context.
  const { data: order, error } = await supabaseServer
    .from('orders')
    .select(`
      id,
      user_id,
      order_number,
      questionnaire_completed_at,
      documents_completed_at,
      submission_complete_email_sent_at,
      users!inner (id, email, business_name),
      service_packages!inner (id, name)
    `)
    .eq('id', orderId)
    .single()

  if (error || !order) {
    console.error('checkAndFireSubmissionEmail: order lookup failed', error)
    return
  }

  if (order.user_id !== user.id) {
    console.warn(JSON.stringify({
      event: 'submission_email_skipped',
      reason: 'not_owner',
      order_id: orderId,
      user_id: user.id,
    }))
    return
  }

  if (
    !order.questionnaire_completed_at ||
    !order.documents_completed_at ||
    order.submission_complete_email_sent_at
  ) {
    return
  }

  // users!inner / service_packages!inner come back as objects; PostgREST types
  // sometimes infer them as arrays under generated typings.
  const userRow = Array.isArray(order.users) ? order.users[0] : order.users
  const serviceRow = Array.isArray(order.service_packages)
    ? order.service_packages[0]
    : order.service_packages

  const customerEmail = userRow?.email as string | null | undefined
  if (!customerEmail) {
    console.warn(JSON.stringify({
      event: 'email_skipped',
      reason: 'no_email_on_user',
      user_id: order.user_id,
      order_id: order.id,
      intended_template: 'submission_complete',
    }))
    return
  }

  // The "submitted at" instant is whichever completion happened second.
  const qDone = new Date(order.questionnaire_completed_at).getTime()
  const dDone = new Date(order.documents_completed_at).getTime()
  const submittedAt = new Date(Math.max(qDone, dDone))

  const { subject, html } = buildSubmissionComplete({
    customer_greeting: resolveCustomerGreeting({
      business_name: userRow?.business_name ?? null,
      email: customerEmail,
    }),
    service_name: serviceRow?.name ?? 'your order',
    order_number: order.order_number,
    order_id: order.id,
    submitted_at_human: formatDateHuman(submittedAt),
  })

  const result = await sendEmail({
    to: customerEmail,
    subject,
    html,
    tags: [
      { name: 'template', value: 'submission_complete' },
      { name: 'order_id', value: order.id },
    ],
  })

  if (!result.success) {
    console.error(JSON.stringify({
      event: 'submission_complete_email_failed',
      order_id: order.id,
      error: result.error,
    }))
    return
  }

  // Idempotency guard in the WHERE clause prevents a double-send if a second
  // caller raced past our null check above.
  const { error: stampError } = await supabaseServer
    .from('orders')
    .update({ submission_complete_email_sent_at: new Date().toISOString() })
    .eq('id', orderId)
    .is('submission_complete_email_sent_at', null)

  if (stampError) {
    console.error(JSON.stringify({
      event: 'submission_complete_email_stamp_failed',
      order_id: order.id,
      error: stampError.message,
    }))
  }
}

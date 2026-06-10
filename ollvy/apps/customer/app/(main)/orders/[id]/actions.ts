'use server'

import { createServerSupabase, getUser } from '@/lib/supabase-server'
import { logActivity, LOG_ACTIONS } from '@/lib/admin/log-activity'

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
 * No-op retained for backward compatibility.
 *
 * The "submission complete" customer email (and the Slack #ops ready-for-work
 * ping that accompanied it) used to fire synchronously from here the moment the
 * questionnaire AND documents were both done. That immediate send has been moved
 * to the process-order-followups cron, which enforces a 2-hour settle window
 * before sending and computes a guaranteed delivery date at send time. See
 * supabase/functions/process-order-followups/index.ts.
 *
 * Callers (QuestionnaireWizard, DocumentsPageClient) still invoke this after a
 * save; we keep the exported signature so they compile unchanged, but there is
 * nothing to do here now. The completion timestamps themselves are written by
 * the questionnaire / document save paths, not by this function, so dropping the
 * email send does not affect them.
 */
export async function checkAndFireSubmissionEmail(_orderId: string): Promise<void> {
  // Intentionally a no-op. The submission-complete email is now sent by the
  // process-order-followups cron after a 2-hour settle window.
}

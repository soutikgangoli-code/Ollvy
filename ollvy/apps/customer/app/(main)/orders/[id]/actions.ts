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

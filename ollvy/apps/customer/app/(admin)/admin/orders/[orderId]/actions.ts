'use server'

import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { logActivity, LOG_ACTIONS } from '@/lib/admin/log-activity'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/email/send'
import { formatDateHuman, formatTimestampIST, resolveCustomerGreeting } from '@/lib/email/format'
import { buildOrderCompleted } from '@/lib/email/templates/order-completed'
import { countWorkingDaysBetween } from '@/lib/utils'
import { postToSlack } from '@/lib/slack/notify'
import { ADMIN_ROOT_URL, buildOrderCompletedMessage } from '@/lib/slack/messages'

type CustomerNotificationEvent =
  | 'admin_document_uploaded'
  | 'round_created'
  | 'question_added'
  | 'round_completed'

// Enqueues a debounced customer-notification row. Failures are logged but
// never thrown - missing one email beats failing the parent admin action.
async function enqueueCustomerNotification(
  orderId: string,
  eventType: CustomerNotificationEvent,
  actorUserId: string | null,
): Promise<void> {
  if (!supabaseServer) return
  try {
    const { error } = await supabaseServer
      .from('customer_notifications_queue')
      .insert({
        order_id: orderId,
        event_type: eventType,
        actor_user_id: actorUserId,
      })
    if (error) {
      console.error(JSON.stringify({
        event: 'customer_notification_enqueue_failed',
        order_id: orderId,
        event_type: eventType,
        error: error.message,
      }))
    }
  } catch (err) {
    console.error(JSON.stringify({
      event: 'customer_notification_enqueue_failed',
      order_id: orderId,
      event_type: eventType,
      error: err instanceof Error ? err.message : String(err),
    }))
  }
}

// Trim + validate a required freeform text field before it hits the DB. Keeps
// empty/whitespace-only and pathologically long values out of writes that admins
// and customers later read back.
function requireText(value: string | null | undefined, field: string, maxLen = 2000): string {
  const trimmed = (value ?? '').trim()
  if (!trimmed) throw new Error(`${field} is required`)
  if (trimmed.length > maxLen) throw new Error(`${field} must be ${maxLen} characters or fewer`)
  return trimmed
}

// Cancellation reason labels
const CANCELLATION_REASON_LABELS: Record<string, string> = {
  user_requested: 'User requested cancellation',
  user_unresponsive: 'User unresponsive for 7+ days',
  duplicate_order: 'Duplicate order',
  service_unavailable: 'Service not available in region',
  payment_issue: 'Payment issue',
  internal_error: 'Internal error',
  other: 'Other',
}

// Update order status
export async function updateOrderStatus(orderId: string, newStatus: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  // Get current status for logging
  const { data: order } = await supabaseServer
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single()

  const oldStatus = order?.status

  // Idempotency: if the order is already in the target state, do nothing.
  // Without this, a double-click or a retried request re-stamps completed_at and
  // re-fires the completion email + Slack post (duplicate customer notifications).
  if (oldStatus === newStatus) {
    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath('/admin/queue')
    return
  }

  // Stamp completed_at when transitioning to 'completed' so the daily-summary
  // cron's "completions today" query and Slack 3's working-days math both work.
  // Pre-fix orders left this column null, so historical reports were undercounting.
  const completedAtNow = new Date().toISOString()
  const orderUpdates: Record<string, string> = { status: newStatus }
  if (newStatus === 'completed') {
    orderUpdates.completed_at = completedAtNow
  }

  await supabaseServer
    .from('orders')
    .update(orderUpdates)
    .eq('id', orderId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.STATUS_CHANGED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Status changed from ${oldStatus} to ${newStatus}`,
    metadata: { from: oldStatus, to: newStatus },
  })

  // Fire order-completed customer email when transitioning to 'completed'.
  // Other status transitions don't email; admin-update emails go through the
  // debounced queue, not this path.
  if (newStatus === 'completed') {
    try {
      const { data: orderForEmail } = await supabaseServer
        .from('orders')
        .select(`
          id,
          order_number,
          total_paisa_snapshot,
          paid_at,
          professional_id,
          users!inner (id, email, business_name),
          service_packages!inner (id, name, sla_working_days),
          professionals (id, full_name)
        `)
        .eq('id', orderId)
        .single()

      const userRow = orderForEmail
        ? Array.isArray(orderForEmail.users) ? orderForEmail.users[0] : orderForEmail.users
        : null
      const serviceRow = orderForEmail
        ? Array.isArray(orderForEmail.service_packages)
          ? orderForEmail.service_packages[0]
          : orderForEmail.service_packages
        : null
      const proRow = orderForEmail
        ? Array.isArray(orderForEmail.professionals)
          ? orderForEmail.professionals[0]
          : orderForEmail.professionals
        : null

      const customerEmail = userRow?.email as string | null | undefined

      if (!orderForEmail || !customerEmail) {
        console.warn(JSON.stringify({
          event: 'email_skipped',
          reason: customerEmail ? 'order_lookup_failed' : 'no_email_on_user',
          order_id: orderId,
          intended_template: 'order_completed',
        }))
      } else {
        const { subject, html } = buildOrderCompleted({
          customer_greeting: resolveCustomerGreeting({
            business_name: userRow?.business_name ?? null,
            email: customerEmail,
          }),
          service_name: serviceRow?.name ?? 'your order',
          order_number: orderForEmail.order_number,
          order_id: orderForEmail.id,
          completed_at_human: formatDateHuman(new Date()),
          total_paisa: orderForEmail.total_paisa_snapshot ?? 0,
        })

        const result = await sendEmail({
          to: customerEmail,
          subject,
          html,
          tags: [
            { name: 'template', value: 'order_completed' },
            { name: 'order_id', value: orderForEmail.id },
          ],
        })

        if (!result.success) {
          console.error(JSON.stringify({
            event: 'order_completed_email_failed',
            order_id: orderId,
            error: result.error,
          }))
        }
      }

      // Post to Slack #ops "completed". Best effort - never breaks the action.
      // We post even if the email was skipped (no customer email); ops still
      // wants to know the order finished.
      if (orderForEmail) {
        try {
          const completedAtDate = new Date(completedAtNow)
          const workingDaysTaken = orderForEmail.paid_at
            ? countWorkingDaysBetween(new Date(orderForEmail.paid_at), completedAtDate)
            : 0
          const slaWorkingDays = (serviceRow?.sla_working_days as number | null | undefined) ?? 0
          const customerNameForSlack =
            (userRow?.business_name as string | null | undefined) ||
            (customerEmail ? customerEmail.split('@')[0] : 'Unknown')
          const proName = (proRow?.full_name as string | null | undefined) ?? 'Unassigned'

          const text = buildOrderCompletedMessage({
            customer_name: customerNameForSlack,
            service_name: serviceRow?.name ?? 'your order',
            order_number: orderForEmail.order_number,
            order_id: orderForEmail.id,
            working_days_taken: workingDaysTaken,
            sla_working_days: slaWorkingDays,
            completed_by_name: adminUser.name,
            completed_at_ist: formatTimestampIST(completedAtDate),
            admin_root_url: ADMIN_ROOT_URL,
          })
          await postToSlack({ channel: 'ops', text })
        } catch (slackErr) {
          console.error(JSON.stringify({
            event: 'order_completed_slack_error',
            order_id: orderId,
            error: slackErr instanceof Error ? slackErr.message : String(slackErr),
          }))
        }
      }
    } catch (err) {
      console.error(JSON.stringify({
        event: 'order_completed_email_error',
        order_id: orderId,
        error: err instanceof Error ? err.message : String(err),
      }))
    }
  }

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/queue')
}

// Assign professional to order
export async function assignProfessional(orderId: string, professionalId: string, currentStatus: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  // Get previous professional if any
  const { data: order } = await supabaseServer
    .from('orders')
    .select('professional_id')
    .eq('id', orderId)
    .single()

  const oldProfessionalId = order?.professional_id
  const isReassignment = !!oldProfessionalId

  // Get professional name
  const { data: professional } = await supabaseServer
    .from('professionals')
    .select('full_name')
    .eq('id', professionalId)
    .single()

  const updates: Record<string, string> = { professional_id: professionalId }
  if (currentStatus === 'pending_assignment') {
    updates.status = 'in_progress'
  }

  await supabaseServer.from('orders').update(updates).eq('id', orderId)

  // Close old professional assignment history row if exists
  if (isReassignment) {
    await supabaseServer
      .from('order_professional_assignment_history')
      .update({ unassigned_at: new Date().toISOString() })
      .eq('order_id', orderId)
      .is('unassigned_at', null)
  }

  // Insert new professional assignment history
  await supabaseServer.from('order_professional_assignment_history').insert({
    order_id: orderId,
    professional_id: professionalId,
    assigned_by_admin_id: adminUser.id,
    professional_name: professional?.full_name || 'Unknown',
    assigned_by_name: adminUser.name,
    assigned_at: new Date().toISOString(),
  })

  // Post system chat message if reassignment (non-critical - don't fail the whole operation)
  if (isReassignment) {
    try {
      const { data: chatOrder } = await supabaseServer
        .from('orders')
        .select('chat_conversation_id')
        .eq('id', orderId)
        .single()

      if (chatOrder?.chat_conversation_id) {
        const { error: chatError } = await supabaseServer.from('chat_messages').insert({
          conversation_id: chatOrder.chat_conversation_id,
          sender_type: 'system',
          content: 'Your assigned expert has been updated.',
          message_type: 'system',
          sent_at: new Date().toISOString(),
        })
        if (chatError) {
          console.error('Failed to post reassignment chat message (non-critical):', chatError)
        }
      }
    } catch (chatErr) {
      // Log but don't fail - chat message is non-critical
      console.error('Failed to post reassignment notification (non-critical):', chatErr)
    }
  }

  await logActivity({
    orderId,
    actionType: isReassignment ? LOG_ACTIONS.PROFESSIONAL_REASSIGNED : LOG_ACTIONS.PROFESSIONAL_ASSIGNED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: isReassignment
      ? `Professional reassigned to ${professional?.full_name}`
      : `Professional assigned: ${professional?.full_name}`,
    metadata: { professional_id: professionalId, professional_name: professional?.full_name },
  })

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/queue')
}

// Verify initial document (order_documents)
export async function verifyInitialDocument(documentId: string, orderId: string, documentLabel: string, internalNote?: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  const updateData: Record<string, any> = {
    verified_at: new Date().toISOString(),
    verified_by: adminUser.id,
    rejection_reason: null
  }

  if (internalNote?.trim()) {
    updateData.internal_note = internalNote.trim()
    updateData.internal_note_by = adminUser.id
    updateData.internal_note_at = new Date().toISOString()
  }

  await supabaseServer.from('order_documents')
    .update(updateData)
    .eq('id', documentId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.DOCUMENT_VERIFIED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Document verified: ${documentLabel}`,
    metadata: { document_label: documentLabel, document_id: documentId },
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Reject initial document (order_documents)
export async function rejectInitialDocument(documentId: string, orderId: string, documentLabel: string, rejectionReason: string, internalNote?: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')
  rejectionReason = requireText(rejectionReason, 'Rejection reason', 500)

  const updateData: Record<string, any> = {
    rejection_reason: rejectionReason,
    verified_at: null,
    verified_by: null
  }

  if (internalNote?.trim()) {
    updateData.internal_note = internalNote.trim()
    updateData.internal_note_by = adminUser.id
    updateData.internal_note_at = new Date().toISOString()
  }

  await supabaseServer.from('order_documents')
    .update(updateData)
    .eq('id', documentId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.DOCUMENT_REJECTED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Document rejected: ${documentLabel} - ${rejectionReason}`,
    metadata: { document_label: documentLabel, rejection_reason: rejectionReason, document_id: documentId },
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Verify work document (order_work_documents)
export async function verifyWorkDocument(documentId: string, orderId: string, documentLabel: string, internalNote?: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  const updateData: Record<string, any> = {
    status: 'verified',
    verified_at: new Date().toISOString(),
    verified_by: adminUser.id,
    rejection_reason: null
  }

  if (internalNote?.trim()) {
    updateData.internal_note = internalNote.trim()
    updateData.internal_note_by = adminUser.id
    updateData.internal_note_at = new Date().toISOString()
  }

  await supabaseServer.from('order_work_documents')
    .update(updateData)
    .eq('id', documentId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.DOCUMENT_VERIFIED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Document verified: ${documentLabel}`,
    metadata: { document_label: documentLabel, document_id: documentId },
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Reject work document (order_work_documents)
export async function rejectWorkDocument(documentId: string, orderId: string, documentLabel: string, rejectionReason: string, internalNote?: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')
  rejectionReason = requireText(rejectionReason, 'Rejection reason', 500)

  const updateData: Record<string, any> = {
    status: 'rejected',
    rejection_reason: rejectionReason,
    verified_at: null,
    verified_by: null
  }

  if (internalNote?.trim()) {
    updateData.internal_note = internalNote.trim()
    updateData.internal_note_by = adminUser.id
    updateData.internal_note_at = new Date().toISOString()
  }

  await supabaseServer.from('order_work_documents')
    .update(updateData)
    .eq('id', documentId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.DOCUMENT_REJECTED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Document rejected: ${documentLabel} - ${rejectionReason}`,
    metadata: { document_label: documentLabel, rejection_reason: rejectionReason, document_id: documentId },
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Approve the customer's setup — locks BOTH their questionnaire answers and their
// uploaded documents from further customer edits in one step. The admin can still
// request changes via round questions, and can reopen with unlockSetup().
export async function approveSetup(orderId: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  await supabaseServer.from('orders')
    .update({
      setup_locked_at: new Date().toISOString(),
      setup_locked_by: adminUser.id,
    })
    .eq('id', orderId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.SETUP_APPROVED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: 'Setup approved — answers and documents locked from customer edits',
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Reopen the customer's setup for editing (clears the approval lock).
export async function unlockSetup(orderId: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  await supabaseServer.from('orders')
    .update({
      setup_locked_at: null,
      setup_locked_by: null,
    })
    .eq('id', orderId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.SETUP_UNLOCKED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: 'Setup reopened — customer can edit answers and documents again',
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Skip work document
export async function skipWorkDocument(documentId: string, orderId: string, documentLabel: string, skipReason: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')
  skipReason = requireText(skipReason, 'Skip reason', 500)

  await supabaseServer.from('order_work_documents')
    .update({
      skipped_at: new Date().toISOString(),
      skip_reason: skipReason
    })
    .eq('id', documentId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.DOCUMENT_SKIPPED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Document skipped: ${documentLabel} - ${skipReason}`,
    metadata: { document_label: documentLabel, skip_reason: skipReason, document_id: documentId },
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Undo verification
export async function undoVerification(documentId: string, orderId: string, tableType: 'initial' | 'work') {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  if (tableType === 'initial') {
    await supabaseServer.from('order_documents')
      .update({ verified_at: null, verified_by: null })
      .eq('id', documentId)
  } else {
    await supabaseServer.from('order_work_documents')
      .update({ status: 'uploaded', verified_at: null, verified_by: null })
      .eq('id', documentId)
  }

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.DOCUMENT_VERIFY_UNDONE,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: 'Document verification undone',
    metadata: { document_id: documentId, table: tableType },
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Undo rejection
export async function undoRejection(documentId: string, orderId: string, tableType: 'initial' | 'work') {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  if (tableType === 'initial') {
    await supabaseServer.from('order_documents')
      .update({ rejection_reason: null })
      .eq('id', documentId)
  } else {
    await supabaseServer.from('order_work_documents')
      .update({ status: 'uploaded', rejection_reason: null })
      .eq('id', documentId)
  }

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.DOCUMENT_REJECT_UNDONE,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: 'Document rejection undone',
    metadata: { document_id: documentId, table: tableType },
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Update round title
export async function updateRoundTitle(roundId: string, orderId: string, newTitle: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')
  newTitle = requireText(newTitle, 'Round title', 200)

  await supabaseServer.from('order_rounds')
    .update({ title: newTitle })
    .eq('id', roundId)

  revalidatePath(`/admin/orders/${orderId}`)
}

// Mark round complete
export async function markRoundComplete(roundId: string, orderId: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  // Get round info for logging
  const { data: round } = await supabaseServer
    .from('order_rounds')
    .select('round_number, title')
    .eq('id', roundId)
    .single()

  await supabaseServer.from('order_rounds')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', roundId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.ROUND_COMPLETED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Round ${round?.round_number} completed: ${round?.title}`,
    metadata: { round_id: roundId, round_number: round?.round_number, round_title: round?.title },
  })

  await enqueueCustomerNotification(orderId, 'round_completed', adminUser.id)

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/queue')
}

// Add question to round
export async function addQuestionToRound(roundId: string, orderId: string, questionText: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')
  questionText = requireText(questionText, 'Question', 1000)

  // Get max position
  const { data: existing } = await supabaseServer
    .from('round_question_requests')
    .select('position')
    .eq('round_id', roundId)
    .order('position', { ascending: false })
    .limit(1)

  const nextPosition = (existing?.[0]?.position ?? -1) + 1

  await supabaseServer.from('round_question_requests').insert({
    round_id: roundId,
    question_text: questionText,
    position: nextPosition,
  })

  // Set round status to awaiting_user
  await supabaseServer.from('order_rounds')
    .update({ status: 'awaiting_user' })
    .eq('id', roundId)

  await enqueueCustomerNotification(orderId, 'question_added', adminUser.id)

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/queue')
}

// Create admin note
export async function createAdminNote(orderId: string, content: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')
  content = requireText(content, 'Note', 5000)

  const { error } = await supabaseServer.from('order_admin_notes').insert({
    order_id: orderId,
    admin_id: adminUser.id,
    content,
  })

  if (error) {
    console.error('Failed to create admin note:', error)
    throw new Error(`Failed to save note: ${error.message}`)
  }

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.NOTE_ADDED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Internal note added by ${adminUser.name}`,
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Delete admin note
export async function deleteAdminNote(noteId: string, orderId: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  // Only allow deleting own notes
  await supabaseServer.from('order_admin_notes')
    .delete()
    .eq('id', noteId)
    .eq('admin_id', adminUser.id)

  revalidatePath(`/admin/orders/${orderId}`)
}

// Resolve dispute - Refund
export async function resolveDisputeRefund(orderId: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  // Check if dispute row exists
  const { data: disputeRow } = await supabaseServer
    .from('disputes')
    .select('id')
    .eq('order_id', orderId)
    .in('status', ['open', 'admin_reviewing'])
    .maybeSingle()

  if (disputeRow) {
    await supabaseServer.from('disputes')
      .update({
        status: 'resolved_refund',
        resolved_at: new Date().toISOString(),
        resolved_by: adminUser.id
      })
      .eq('id', disputeRow.id)
  }

  await supabaseServer.from('orders')
    .update({ status: 'cancelled', dispute_outcome: 'refund' })
    .eq('id', orderId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.DISPUTE_RESOLVED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Dispute resolved with refund`,
    metadata: { outcome: 'refund' },
  })

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/queue')
}

// Resolve dispute - Continue
export async function resolveDisputeContinue(orderId: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  const { data: disputeRow } = await supabaseServer
    .from('disputes')
    .select('id')
    .eq('order_id', orderId)
    .in('status', ['open', 'admin_reviewing'])
    .maybeSingle()

  if (disputeRow) {
    await supabaseServer.from('disputes')
      .update({
        status: 'resolved_no_refund',
        resolved_at: new Date().toISOString(),
        resolved_by: adminUser.id
      })
      .eq('id', disputeRow.id)
  }

  await supabaseServer.from('orders')
    .update({ status: 'in_progress', dispute_outcome: 'continue' })
    .eq('id', orderId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.DISPUTE_RESOLVED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Dispute resolved - order continuing`,
    metadata: { outcome: 'continue' },
  })

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/queue')
}

// Resolve dispute - Close
export async function resolveDisputeClose(orderId: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  const { data: disputeRow } = await supabaseServer
    .from('disputes')
    .select('id')
    .eq('order_id', orderId)
    .in('status', ['open', 'admin_reviewing'])
    .maybeSingle()

  if (disputeRow) {
    await supabaseServer.from('disputes')
      .update({
        status: 'resolved_no_refund',
        resolved_at: new Date().toISOString(),
        resolved_by: adminUser.id
      })
      .eq('id', disputeRow.id)
  }

  await supabaseServer.from('orders')
    .update({ status: 'cancelled', dispute_outcome: 'closed' })
    .eq('id', orderId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.DISPUTE_RESOLVED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Dispute closed without refund`,
    metadata: { outcome: 'closed' },
  })

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/queue')
}

// Insert completion notification
export async function insertCompletionNotification(orderId: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  await supabaseServer.from('round_notifications').insert({
    order_id: orderId,
    message: 'Your order is complete. Your final document is ready to download.',
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Upload admin document (to_customer)
export async function uploadAdminDocument(
  orderId: string,
  roundId: string,
  fileUrl: string,
  fileName: string,
  tag: string,
  documentLabel: string,
  description: string | null,
  signLabel?: string
) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  // Insert to_customer document
  const { data: toCustomerRow, error: insertError } = await supabaseServer
    .from('order_work_documents')
    .insert({
      order_id: orderId,
      direction: 'to_customer',
      round_id: roundId,
      tag,
      document_label: documentLabel,
      description,
      file_url: fileUrl,
      file_name: fileName,
      uploaded_at: new Date().toISOString(),
      uploaded_by_type: 'admin',
      status: 'uploaded',
    })
    .select()
    .single()

  if (insertError) {
    console.error('Failed to insert to_customer document:', insertError)
    throw new Error(`Failed to upload document: ${insertError.message}`)
  }

  // If for_signing, create linked from_customer row
  if (tag === 'for_signing' && signLabel && toCustomerRow) {
    const { data: fromCustomerRow, error: fromCustomerError } = await supabaseServer
      .from('order_work_documents')
      .insert({
        order_id: orderId,
        direction: 'from_customer',
        round_id: roundId,
        document_label: signLabel,
        status: 'pending',
      })
      .select()
      .single()

    if (fromCustomerError) {
      console.error('Failed to create signing request:', fromCustomerError)
      // Don't throw - the main document was uploaded successfully
    }

    if (fromCustomerRow && toCustomerRow) {
      await supabaseServer
        .from('order_work_documents')
        .update({ linked_request_id: fromCustomerRow.id })
        .eq('id', toCustomerRow.id)
    }

    // Set round status to awaiting_user
    await supabaseServer.from('order_rounds')
      .update({ status: 'awaiting_user' })
      .eq('id', roundId)
  }

  // If government_processing, set round status to active
  if (tag === 'government_processing') {
    await supabaseServer.from('order_rounds')
      .update({ status: 'active' })
      .eq('id', roundId)
  }

  await enqueueCustomerNotification(orderId, 'admin_document_uploaded', adminUser.id)

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/queue')
  return toCustomerRow
}

// Delete work document
export async function deleteWorkDocument(documentId: string, orderId: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  await supabaseServer.from('order_work_documents')
    .delete()
    .eq('id', documentId)

  revalidatePath(`/admin/orders/${orderId}`)
}

// Form data type for createRound
interface AddRoundFormData {
  title: string
  questions: string[]
  docRequests: Array<{
    label: string
    description?: string
    isReuploadOfWorkDocId?: string
  }>
  adminUpload?: {
    tag: string
    label: string
    description?: string
    fileUrl: string
    fileName: string
    signLabel?: string
  }
  notificationMessage?: string
  isVisibleToUser: boolean
}

// Create round
export async function createRound(orderId: string, formData: AddRoundFormData) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')
  formData.title = requireText(formData.title, 'Round title', 200)

  // Step 1: Calculate the next round_number
  const { data: existingRounds } = await supabaseServer
    .from('order_rounds')
    .select('round_number')
    .eq('order_id', orderId)
    .order('round_number', { ascending: false })
    .limit(1)

  const nextRoundNumber = existingRounds?.[0]?.round_number != null
    ? existingRounds[0].round_number + 1
    : 1 // Round 0 always exists for paid orders; first manual round is always 1

  // Step 2: Determine round status
  const requiresUserAction = formData.questions.length > 0 || formData.docRequests.length > 0
  const roundStatus = requiresUserAction ? 'awaiting_user' : 'active'

  // Step 3: Insert order_rounds
  const { data: newRound } = await supabaseServer
    .from('order_rounds')
    .insert({
      order_id: orderId,
      created_by_admin_id: adminUser.id,
      round_number: nextRoundNumber,
      title: formData.title,
      status: roundStatus,
      is_visible_to_user: formData.isVisibleToUser,
    })
    .select()
    .single()

  if (!newRound) throw new Error('Failed to create round')

  // Steps 4-8 build the round's children. Previously each insert ignored its
  // error, so a mid-sequence failure left a half-built round behind. Now any
  // failure rolls the whole thing back by deleting the round — round_question_
  // requests and order_work_documents cascade-delete with it. The happy path is
  // unchanged; only the (rare) failure path now fails cleanly instead of
  // orphaning rows.
  try {
    // Step 4: Insert round_question_requests
    if (formData.questions.length > 0) {
      const { error } = await supabaseServer.from('round_question_requests').insert(
        formData.questions.map((q, i) => ({
          round_id: newRound.id,
          question_text: q,
          position: i,
        }))
      )
      if (error) throw error
    }

    // Step 5: Insert from_customer doc request rows
    for (const docReq of formData.docRequests) {
      const { error } = await supabaseServer.from('order_work_documents').insert({
        order_id: orderId,
        direction: 'from_customer',
        round_id: newRound.id,
        document_label: docReq.label,
        description: docReq.description || null,
        status: 'pending',
        linked_request_id: docReq.isReuploadOfWorkDocId ?? null,
      })
      if (error) throw error
    }

    // Step 6: Insert to_customer upload if admin uploaded a file
    if (formData.adminUpload) {
      const { data: toCustomerRow, error: uploadError } = await supabaseServer
        .from('order_work_documents')
        .insert({
          order_id: orderId,
          direction: 'to_customer',
          round_id: newRound.id,
          tag: formData.adminUpload.tag,
          document_label: formData.adminUpload.label,
          description: formData.adminUpload.description || null,
          file_url: formData.adminUpload.fileUrl,
          file_name: formData.adminUpload.fileName,
          uploaded_at: new Date().toISOString(),
          uploaded_by_type: 'admin',
          status: 'uploaded',
        })
        .select()
        .single()
      if (uploadError) throw uploadError

      // If for_signing: create linked from_customer row and set linked_request_id
      if (formData.adminUpload.tag === 'for_signing' && formData.adminUpload.signLabel && toCustomerRow) {
        const { data: signingRequest, error: signingError } = await supabaseServer
          .from('order_work_documents')
          .insert({
            order_id: orderId,
            direction: 'from_customer',
            round_id: newRound.id,
            document_label: formData.adminUpload.signLabel,
            status: 'pending',
          })
          .select()
          .single()
        if (signingError) throw signingError

        if (signingRequest) {
          const { error: linkError } = await supabaseServer
            .from('order_work_documents')
            .update({ linked_request_id: signingRequest.id })
            .eq('id', toCustomerRow.id)
          if (linkError) throw linkError
        }
      }
    }

    // Step 7: Insert round_notifications if visible to user
    if (formData.isVisibleToUser && formData.notificationMessage) {
      const { error } = await supabaseServer.from('round_notifications').insert({
        order_id: orderId,
        round_id: newRound.id,
        message: formData.notificationMessage,
      })
      if (error) throw error
    }

    // Step 8: Set user_response_deadline on round if awaiting_user
    if (roundStatus === 'awaiting_user') {
      const { error } = await supabaseServer.from('order_rounds')
        .update({ user_response_deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() })
        .eq('id', newRound.id)
      if (error) throw error
    }
  } catch (err) {
    // Roll back the partially-created round. round_notifications.round_id is
    // ON DELETE SET NULL, so clear those explicitly first; the rest cascade.
    await supabaseServer.from('round_notifications').delete().eq('round_id', newRound.id)
    await supabaseServer.from('order_rounds').delete().eq('id', newRound.id)
    throw err
  }

  // Step 9: Log activity
  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.ROUND_CREATED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Round ${nextRoundNumber} created: ${formData.title}`,
    metadata: { round_number: nextRoundNumber, round_title: formData.title, round_id: newRound.id },
  })

  await enqueueCustomerNotification(orderId, 'round_created', adminUser.id)

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/queue')
  return newRound
}

// Cancel order with reason
export async function cancelOrderWithReason(
  orderId: string,
  reason: string,
  reasonDetail: string | null,
  userMessage: string
) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')
  reason = requireText(reason, 'Cancellation reason', 100)
  userMessage = requireText(userMessage, 'Message to customer', 2000)
  reasonDetail = reasonDetail?.trim() || null

  // Update order
  await supabaseServer.from('orders')
    .update({
      status: 'cancelled',
      cancellation_reason: reason,
      cancellation_reason_detail: reasonDetail || null,
    })
    .eq('id', orderId)

  // Insert banner notification for user
  await supabaseServer.from('round_notifications').insert({
    order_id: orderId,
    message: userMessage,
    is_dismissed: false,
    created_at: new Date().toISOString(),
  })

  // Log activity
  const reasonLabel = CANCELLATION_REASON_LABELS[reason] || reason
  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.ORDER_CANCELLED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Order cancelled. Reason: ${reasonLabel}${reasonDetail ? ` - ${reasonDetail}` : ''}`,
    metadata: { reason, detail: reasonDetail, message_to_user: userMessage },
  })

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/queue')
}

// Assign admin to order
export async function assignAdminToOrder(
  orderId: string,
  assignToAdminId: string,
  assignToAdminName: string
) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')
  const now = new Date().toISOString()

  // Get current assignment
  const { data: order } = await supabaseServer
    .from('orders')
    .select('assigned_admin_id')
    .eq('id', orderId)
    .single()

  const isReassignment = !!order?.assigned_admin_id

  // Update order
  await supabaseServer.from('orders')
    .update({ assigned_admin_id: assignToAdminId })
    .eq('id', orderId)

  // Close old assignment history row if exists
  if (isReassignment) {
    await supabaseServer.from('order_admin_assignment_history')
      .update({ unassigned_at: now })
      .eq('order_id', orderId)
      .is('unassigned_at', null)
  }

  // Insert new history row
  await supabaseServer.from('order_admin_assignment_history').insert({
    order_id: orderId,
    assigned_to_admin_id: assignToAdminId,
    assigned_by_admin_id: adminUser.id,
    assigned_to_name: assignToAdminName,
    assigned_by_name: adminUser.name,
    assigned_at: now,
  })

  // Log activity
  await logActivity({
    orderId,
    actionType: isReassignment ? LOG_ACTIONS.ADMIN_REASSIGNED : LOG_ACTIONS.ADMIN_ASSIGNED,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `Order assigned to ${assignToAdminName} by ${adminUser.name}`,
    metadata: { assigned_to: assignToAdminName, assigned_to_id: assignToAdminId },
  })

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/queue')
}

// Update SLA deadline
export async function updateSlaDeadline(orderId: string, newDate: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  await supabaseServer.from('orders')
    .update({ expected_completion_date: newDate })
    .eq('id', orderId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.SLA_MANUALLY_OVERRIDDEN,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `SLA deadline manually set to ${newDate} by ${adminUser.name}`,
    metadata: { new_date: newDate },
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Update round deadline
export async function updateRoundDeadline(roundId: string, orderId: string, newDeadline: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  await supabaseServer.from('order_rounds')
    .update({
      user_response_deadline: newDeadline,
      deadline_manually_overridden: true,
    })
    .eq('id', roundId)

  await logActivity({
    orderId,
    actionType: LOG_ACTIONS.SLA_MANUALLY_OVERRIDDEN,
    actorType: 'admin',
    actorId: adminUser.id,
    actorName: adminUser.name,
    description: `User response deadline manually set by ${adminUser.name}`,
    metadata: { round_id: roundId, new_deadline: newDeadline },
  })

  revalidatePath(`/admin/orders/${orderId}`)
}

// Admin file upload to storage (uses service role to bypass RLS)
export async function adminUploadFile(formData: FormData): Promise<{ storagePath: string; fileName: string }> {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  const file = formData.get('file') as File
  const orderId = formData.get('orderId') as string

  if (!file || !orderId) {
    throw new Error('File and orderId are required')
  }

  const ext = file.name.split('.').pop()
  const path = `${orderId}/${crypto.randomUUID()}/${Date.now()}.${ext}`

  // Convert File to ArrayBuffer for server-side upload
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await supabaseServer.storage
    .from('work-documents')
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  // Return the storage path (not public URL) for signed URL generation later
  const storagePath = `work-documents/${path}`

  return { storagePath, fileName: file.name }
}

// Generate signed URLs for admin file access (bypasses RLS)
export async function adminGetSignedUrls(
  files: Array<{ url: string; bucket: 'order-documents' | 'work-documents' }>
): Promise<Array<{ originalUrl: string; signedUrl: string | null }>> {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  const results = await Promise.all(
    files.map(async ({ url, bucket }) => {
      try {
        let filePath: string | null = null

        if (url.startsWith('http://') || url.startsWith('https://')) {
          // Legacy full public URL: https://xxx.supabase.co/storage/v1/object/public/<bucket>/<path>
          const urlObj = new URL(url)
          const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/(?:public|sign)\/[^/]+\/(.+)/)
          if (pathMatch) {
            filePath = decodeURIComponent(pathMatch[1])
          }
        } else {
          // Storage-path format: "<bucket>/<path>" or bare "<path>"
          const prefix = `${bucket}/`
          filePath = url.startsWith(prefix) ? url.slice(prefix.length) : url
        }

        if (!filePath) {
          console.error('Could not parse file path from url:', url)
          return { originalUrl: url, signedUrl: null }
        }

        // Create signed URL (valid for 1 hour)
        const { data, error } = await supabaseServer!.storage
          .from(bucket)
          .createSignedUrl(filePath, 3600)

        if (error || !data?.signedUrl) {
          console.error('Failed to create signed URL:', { url, bucket, filePath, error })
          return { originalUrl: url, signedUrl: null }
        }

        return { originalUrl: url, signedUrl: data.signedUrl }
      } catch (err) {
        console.error('Error processing URL:', url, err)
        return { originalUrl: url, signedUrl: null }
      }
    })
  )

  return results
}

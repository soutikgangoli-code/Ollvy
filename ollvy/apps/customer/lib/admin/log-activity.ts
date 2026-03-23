import { supabaseServer } from '@/lib/supabase-server'

interface LogActivityParams {
  orderId: string
  actionType: string
  actorType: 'admin' | 'system' | 'user'
  actorId?: string
  actorName: string
  description: string
  metadata?: Record<string, any>
}

export async function logActivity(params: LogActivityParams) {
  if (!supabaseServer) return
  await supabaseServer.from('order_activity_log').insert({
    order_id: params.orderId,
    action_type: params.actionType,
    actor_type: params.actorType,
    actor_id: params.actorId ?? null,
    actor_name: params.actorName,
    description: params.description,
    metadata: params.metadata ?? null,
    created_at: new Date().toISOString(),
  })
}

export const LOG_ACTIONS = {
  ORDER_PAID: 'order_paid',
  STATUS_CHANGED: 'status_changed',
  ADMIN_ASSIGNED: 'admin_assigned',
  ADMIN_REASSIGNED: 'admin_reassigned',
  PROFESSIONAL_ASSIGNED: 'professional_assigned',
  PROFESSIONAL_REASSIGNED: 'professional_reassigned',
  ROUND_CREATED: 'round_created',
  ROUND_COMPLETED: 'round_completed',
  DOCUMENT_UPLOADED: 'document_uploaded',
  DOCUMENT_VERIFIED: 'document_verified',
  DOCUMENT_REJECTED: 'document_rejected',
  DOCUMENT_SKIPPED: 'document_skipped',
  ADMIN_UPLOAD_ADDED: 'admin_upload_added',
  QUESTION_ADDED: 'question_added',
  QUESTION_ANSWERED: 'question_answered',
  NOTE_ADDED: 'note_added',
  DISPUTE_OPENED: 'dispute_opened',
  DISPUTE_RESOLVED: 'dispute_resolved',
  ORDER_COMPLETED: 'order_completed',
  ORDER_CANCELLED: 'order_cancelled',
  SLA_AUTO_EXTENDED: 'sla_auto_extended',
  SLA_MANUALLY_OVERRIDDEN: 'sla_manually_overridden',
  CANCELLATION_NOTIFIED: 'cancellation_notified',
} as const

export type LogActionType = typeof LOG_ACTIONS[keyof typeof LOG_ACTIONS]

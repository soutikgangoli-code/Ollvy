'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmModal from '@/components/ConfirmModal'
import { formatPaisa } from '@ollvy/shared'

interface OrderDetailClientProps {
  order: any
  stageHistory: any[]
  documents: any[]
  chatMessages: any[]
  dispute: any
  auditLog: any[]
}

function formatCurrency(paisa: number): string {
  return formatPaisa(paisa)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrderDetailClient({
  order,
  stageHistory,
  documents,
  chatMessages,
  dispute,
  auditLog,
}: OrderDetailClientProps) {
  const router = useRouter()
  const [resolveModal, setResolveModal] = useState<'refund' | 'completed' | null>(null)
  const [loading, setLoading] = useState(false)

  const handleResolveDispute = async (reason: string) => {
    if (!dispute || !resolveModal) return

    setLoading(true)
    try {
      const res = await fetch('/api/admin/disputes/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispute_id: dispute.id,
          resolution: resolveModal,
          reason,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to resolve dispute')
        return
      }

      router.refresh()
    } finally {
      setLoading(false)
      setResolveModal(null)
    }
  }

  const workflowStages = order.service_packages.workflow_stages || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Summary */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Order Summary</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-text">User City</p>
              <p className="font-medium">{order.users.city || '-'}</p>
            </div>
            <div>
              <p className="text-muted-text">Business Type</p>
              <p className="font-medium">{order.users.business_type || '-'}</p>
            </div>
            <div>
              <p className="text-muted-text">Professional</p>
              <p className="font-medium">{order.professionals?.display_name || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-muted-text">Assigned At</p>
              <p className="font-medium">{order.assigned_at ? formatDate(order.assigned_at) : '-'}</p>
            </div>
          </div>

          <div className="border-t border-border mt-4 pt-4">
            <h3 className="font-medium text-body-text mb-2">Price Breakdown</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-text">Base Price</span>
                <span>{formatCurrency(order.price_base_paisa_snapshot || 0)}</span>
              </div>
              {order.price_govt_fees_paisa_snapshot > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-text">Govt Fees</span>
                  <span>{formatCurrency(order.price_govt_fees_paisa_snapshot)}</span>
                </div>
              )}
              {order.promo_discount_paisa > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Discount</span>
                  <span>-{formatCurrency(order.promo_discount_paisa)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatCurrency(order.total_paisa_snapshot)}</span>
              </div>
            </div>
          </div>

          {order.razorpay_payment_id && (
            <div className="border-t border-border mt-4 pt-4">
              <p className="text-sm text-muted-text">Razorpay Payment ID</p>
              <p className="font-mono text-sm">{order.razorpay_payment_id}</p>
            </div>
          )}
        </div>

        {/* Workflow Stages */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Workflow Stages</h2>
          <div className="space-y-4">
            {workflowStages.map((stage: any, index: number) => {
              const history = stageHistory.find(h => h.stage_key === stage.stage_key)
              const isCompleted = !!history?.completed_at
              const isCurrent = order.current_stage === stage.stage_key

              return (
                <div key={stage.stage_key} className="flex items-start gap-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isCompleted ? 'bg-green-100 text-green-700' : isCurrent ? 'bg-navy text-white' : 'bg-gray-100 text-muted-text'}
                  `}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isCompleted ? 'text-green-700' : isCurrent ? 'text-navy' : 'text-muted-text'}`}>
                      {stage.stage_label || stage.stage_key}
                    </p>
                    {history?.completed_at && (
                      <p className="text-xs text-muted-text">
                        Completed {formatDate(history.completed_at)}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Documents */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Documents</h2>
          {documents.length === 0 ? (
            <p className="text-muted-text">No documents uploaded</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{doc.document_type}</p>
                    <p className="text-xs text-muted-text">
                      Uploaded by {doc.uploaded_by} • {formatDate(doc.created_at)}
                    </p>
                  </div>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy hover:underline text-sm"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Transcript */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Chat Transcript</h2>
          {chatMessages.length === 0 ? (
            <p className="text-muted-text">No messages</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`p-3 rounded-lg ${
                  msg.sender_type === 'user' ? 'bg-blue-50' : msg.sender_type === 'system' ? 'bg-gray-100' : 'bg-green-50'
                }`}>
                  <div className="flex justify-between text-xs text-muted-text mb-1">
                    <span className="font-medium capitalize">{msg.sender_type}</span>
                    <span>{formatDate(msg.created_at)}</span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Dispute Panel */}
        {dispute && (
          <div className="card p-6 border-red-200 bg-red-50">
            <h2 className="text-lg font-semibold text-red-700 mb-4">Dispute</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-text">Reason</p>
                <p className="font-medium">{dispute.reason}</p>
              </div>
              <div>
                <p className="text-muted-text">Opened</p>
                <p className="font-medium">{formatDate(dispute.opened_at)}</p>
              </div>
              <div>
                <p className="text-muted-text">Status</p>
                <span className={`badge badge-${dispute.status}`}>{dispute.status}</span>
              </div>
            </div>

            {dispute.status === 'open' && (
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setResolveModal('refund')}
                  className="btn-danger w-full text-sm"
                >
                  Resolve as Refund
                </button>
                <button
                  onClick={() => setResolveModal('completed')}
                  className="btn-primary w-full text-sm"
                >
                  Resolve as Completed
                </button>
              </div>
            )}
          </div>
        )}

        {/* Audit Log */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Audit Log</h2>
          {auditLog.length === 0 ? (
            <p className="text-muted-text text-sm">No admin actions recorded</p>
          ) : (
            <div className="space-y-3">
              {auditLog.map((entry) => (
                <div key={entry.id} className="text-sm border-b border-border pb-2 last:border-0">
                  <p className="font-medium">{entry.action}</p>
                  {entry.notes && <p className="text-muted-text">{entry.notes}</p>}
                  <p className="text-xs text-muted-text">{formatDate(entry.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resolve Modal */}
      <ConfirmModal
        isOpen={!!resolveModal}
        title={resolveModal === 'refund' ? 'Resolve as Refund' : 'Resolve as Completed'}
        message={
          resolveModal === 'refund'
            ? 'This will trigger a full refund to the user and cancel the professional payout.'
            : 'This will mark the order as completed and release the professional payout.'
        }
        confirmLabel={resolveModal === 'refund' ? 'Process Refund' : 'Mark Completed'}
        variant={resolveModal === 'refund' ? 'danger' : 'default'}
        requireReason
        minReasonLength={10}
        onConfirm={(reason) => handleResolveDispute(reason!)}
        onCancel={() => setResolveModal(null)}
      />
    </div>
  )
}

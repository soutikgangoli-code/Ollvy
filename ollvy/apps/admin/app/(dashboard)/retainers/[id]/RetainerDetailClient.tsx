'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ConfirmModal from '@/components/ConfirmModal'
import { formatPaisa } from '@ollvy/shared'

interface RetainerDetailClientProps {
  retainer: any
  usageLogs: any[]
  billingHistory: any[]
  pauseHistory: any[]
  auditLog: any[]
}

function formatCurrency(paisa: number): string {
  return formatPaisa(paisa)
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function RetainerDetailClient({
  retainer,
  usageLogs,
  billingHistory,
  pauseHistory,
  auditLog,
}: RetainerDetailClientProps) {
  const router = useRouter()
  const [actionModal, setActionModal] = useState<'pause' | 'resume' | 'cancel' | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAction = async (reason?: string) => {
    if (!actionModal) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/retainers/${actionModal}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retainer_id: retainer.id,
          reason,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || `Failed to ${actionModal} retainer`)
        return
      }

      router.refresh()
    } finally {
      setLoading(false)
      setActionModal(null)
    }
  }

  const hoursUsed = usageLogs.reduce((sum, log) => sum + (log.hours_used || 0), 0)
  const hoursRemaining = retainer.retainer_tiers.hours_per_month - hoursUsed

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Retainer Info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Retainer Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-text">User</p>
              <Link href={`/users/${retainer.users.id}`} className="font-medium text-navy hover:underline">
                {retainer.users.phone}
              </Link>
              <p className="text-xs text-muted-text">{retainer.users.city} - {retainer.users.business_type}</p>
            </div>
            <div>
              <p className="text-muted-text">Professional</p>
              {retainer.professionals ? (
                <Link href={`/professionals/${retainer.professionals.id}`} className="font-medium text-navy hover:underline">
                  {retainer.professionals.display_name}
                </Link>
              ) : (
                <span className="text-muted-text">Not assigned</span>
              )}
            </div>
            <div>
              <p className="text-muted-text">Tier</p>
              <p className="font-medium">{retainer.retainer_tiers.name}</p>
              <p className="text-xs text-muted-text">
                {retainer.retainer_tiers.hours_per_month}h/mo • {formatCurrency(retainer.retainer_tiers.price_paisa)}
              </p>
            </div>
            <div>
              <p className="text-muted-text">Billing Cycle</p>
              <p className="font-medium capitalize">{retainer.billing_cycle}</p>
            </div>
            <div>
              <p className="text-muted-text">Current Period</p>
              <p className="font-medium">
                {formatDate(retainer.current_period_start)} - {formatDate(retainer.current_period_end)}
              </p>
            </div>
            <div>
              <p className="text-muted-text">Next Billing</p>
              <p className="font-medium">{formatDate(retainer.next_billing_date)}</p>
            </div>
          </div>

          {/* Hours Usage */}
          <div className="border-t border-border mt-4 pt-4">
            <h3 className="font-medium text-body-text mb-3">Hours This Period</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${hoursRemaining < 0 ? 'bg-red-500' : 'bg-navy'}`}
                  style={{ width: `${Math.min(100, (hoursUsed / retainer.retainer_tiers.hours_per_month) * 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {hoursUsed.toFixed(1)} / {retainer.retainer_tiers.hours_per_month}h
              </span>
            </div>
            {hoursRemaining < 0 && (
              <p className="text-sm text-red-600 mt-2">
                {Math.abs(hoursRemaining).toFixed(1)} hours over limit
              </p>
            )}
          </div>

          {retainer.razorpay_subscription_id && (
            <div className="border-t border-border mt-4 pt-4">
              <p className="text-sm text-muted-text">Razorpay Subscription ID</p>
              <p className="font-mono text-sm">{retainer.razorpay_subscription_id}</p>
            </div>
          )}
        </div>

        {/* Usage Logs */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Usage Logs</h2>
          {usageLogs.length === 0 ? (
            <p className="text-muted-text">No usage recorded this period</p>
          ) : (
            <div className="space-y-2">
              {usageLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{log.description}</p>
                    {log.orders && (
                      <Link href={`/orders/${log.orders.id}`} className="text-xs text-navy hover:underline">
                        {log.orders.service_packages?.name}
                      </Link>
                    )}
                    <p className="text-xs text-muted-text">{formatDate(log.created_at)}</p>
                  </div>
                  <span className="font-medium">{log.hours_used}h</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Billing History */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Billing History</h2>
          {billingHistory.length === 0 ? (
            <p className="text-muted-text">No invoices yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-text font-medium">Date</th>
                    <th className="text-left py-2 text-muted-text font-medium">Amount</th>
                    <th className="text-left py-2 text-muted-text font-medium">Status</th>
                    <th className="text-left py-2 text-muted-text font-medium">Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border">
                      <td className="py-2">{formatDate(invoice.created_at)}</td>
                      <td className="py-2 font-medium">{formatCurrency(invoice.amount_paisa)}</td>
                      <td className="py-2">
                        <span className={`badge badge-${invoice.status}`}>{invoice.status}</span>
                      </td>
                      <td className="py-2 font-mono text-xs">{invoice.razorpay_payment_id || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Actions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Actions</h2>
          <div className="space-y-2">
            {retainer.status === 'active' && (
              <button
                onClick={() => setActionModal('pause')}
                className="btn-secondary w-full text-sm"
                disabled={loading}
              >
                Pause Retainer
              </button>
            )}
            {retainer.status === 'paused' && (
              <button
                onClick={() => setActionModal('resume')}
                className="btn-primary w-full text-sm"
                disabled={loading}
              >
                Resume Retainer
              </button>
            )}
            {['active', 'paused'].includes(retainer.status) && (
              <button
                onClick={() => setActionModal('cancel')}
                className="btn-danger w-full text-sm"
                disabled={loading}
              >
                Cancel Retainer
              </button>
            )}
          </div>
        </div>

        {/* Pause History */}
        {pauseHistory.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-body-text mb-4">Pause History</h2>
            <div className="space-y-3">
              {pauseHistory.map((pause) => (
                <div key={pause.id} className="text-sm border-b border-border pb-2 last:border-0">
                  <p className="font-medium">
                    {pause.resumed_at ? 'Paused & Resumed' : 'Paused'}
                  </p>
                  <p className="text-muted-text">{pause.reason}</p>
                  <p className="text-xs text-muted-text">
                    {formatDate(pause.paused_at)}
                    {pause.resumed_at && ` - ${formatDate(pause.resumed_at)}`}
                  </p>
                </div>
              ))}
            </div>
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

      {/* Action Modals */}
      <ConfirmModal
        isOpen={actionModal === 'pause'}
        title="Pause Retainer"
        message="Pausing will stop billing and usage tracking. The user can resume later."
        confirmLabel="Pause"
        requireReason
        minReasonLength={10}
        onConfirm={(reason) => handleAction(reason)}
        onCancel={() => setActionModal(null)}
      />

      <ConfirmModal
        isOpen={actionModal === 'resume'}
        title="Resume Retainer"
        message="Resuming will restart billing from the next cycle."
        confirmLabel="Resume"
        onConfirm={() => handleAction()}
        onCancel={() => setActionModal(null)}
      />

      <ConfirmModal
        isOpen={actionModal === 'cancel'}
        title="Cancel Retainer"
        message="Cancelling is permanent. The user will need to create a new retainer to continue."
        confirmLabel="Cancel Retainer"
        variant="danger"
        requireReason
        minReasonLength={20}
        onConfirm={(reason) => handleAction(reason)}
        onCancel={() => setActionModal(null)}
      />
    </div>
  )
}

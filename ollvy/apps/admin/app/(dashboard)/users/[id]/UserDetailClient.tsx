'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ConfirmModal from '@/components/ConfirmModal'
import { formatPaisa } from '@ollvy/shared'

interface UserDetailClientProps {
  user: any
  orders: any[]
  retainers: any[]
  disputes: any[]
  fraudSignals: any[]
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

export default function UserDetailClient({
  user,
  orders,
  retainers,
  disputes,
  fraudSignals,
  auditLog,
}: UserDetailClientProps) {
  const router = useRouter()
  const [actionModal, setActionModal] = useState<'flag' | 'unflag' | 'restrict' | 'unrestrict' | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAction = async (reason?: string) => {
    if (!actionModal) return

    setLoading(true)
    try {
      const res = await fetch('/api/admin/users/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          action: actionModal,
          reason,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || `Failed to ${actionModal} user`)
        return
      }

      router.refresh()
    } finally {
      setLoading(false)
      setActionModal(null)
    }
  }

  // Calculate stats
  const totalSpent = orders.reduce((sum, o) =>
    ['completed', 'in_progress', 'assigned'].includes(o.status) ? sum + o.total_paisa_snapshot : sum, 0
  )
  const completedOrders = orders.filter(o => o.status === 'completed').length
  const disputedOrders = orders.filter(o => o.status === 'disputed').length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* User Info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">User Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-text">Phone</p>
              <p className="font-medium font-mono">{user.phone}</p>
            </div>
            <div>
              <p className="text-muted-text">City</p>
              <p className="font-medium">{user.city || '-'}</p>
            </div>
            <div>
              <p className="text-muted-text">Business Type</p>
              <p className="font-medium">{user.business_type || '-'}</p>
            </div>
            <div>
              <p className="text-muted-text">Joined</p>
              <p className="font-medium">{formatDate(user.created_at)}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-border mt-4 pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-body-text">{formatCurrency(totalSpent)}</p>
                <p className="text-xs text-muted-text">Total Spent</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-body-text">{completedOrders}</p>
                <p className="text-xs text-muted-text">Completed Orders</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{disputedOrders}</p>
                <p className="text-xs text-muted-text">Disputes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-muted-text">No orders</p>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Link href={`/orders/${order.id}`} className="font-medium text-navy hover:underline">
                      {order.service_packages?.name}
                    </Link>
                    <p className="text-xs text-muted-text">
                      {order.professionals?.display_name || 'Unassigned'} • {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`badge badge-${order.status}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                    <p className="text-sm font-medium mt-1">{formatCurrency(order.total_paisa_snapshot)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Retainers */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Retainers</h2>
          {retainers.length === 0 ? (
            <p className="text-muted-text">No retainers</p>
          ) : (
            <div className="space-y-2">
              {retainers.map((retainer) => (
                <div key={retainer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Link href={`/retainers/${retainer.id}`} className="font-medium text-navy hover:underline">
                      {retainer.retainer_tiers?.name}
                    </Link>
                    <p className="text-xs text-muted-text">
                      {retainer.professionals?.display_name || 'Unassigned'} • {retainer.billing_cycle}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`badge badge-${retainer.status}`}>
                      {retainer.status}
                    </span>
                    <p className="text-sm font-medium mt-1">
                      {formatCurrency(retainer.retainer_tiers?.price_paisa || 0)}/mo
                    </p>
                  </div>
                </div>
              ))}
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
            {user.is_flagged ? (
              <button
                onClick={() => setActionModal('unflag')}
                className="btn-secondary w-full text-sm"
                disabled={loading}
              >
                Remove Flag
              </button>
            ) : (
              <button
                onClick={() => setActionModal('flag')}
                className="btn-secondary w-full text-sm"
                disabled={loading}
              >
                Flag User
              </button>
            )}
            {user.is_restricted ? (
              <button
                onClick={() => setActionModal('unrestrict')}
                className="btn-primary w-full text-sm"
                disabled={loading}
              >
                Remove Restriction
              </button>
            ) : (
              <button
                onClick={() => setActionModal('restrict')}
                className="btn-danger w-full text-sm"
                disabled={loading}
              >
                Restrict User
              </button>
            )}
          </div>
        </div>

        {/* Fraud Signals */}
        {fraudSignals.length > 0 && (
          <div className="card p-6 border-red-200 bg-red-50">
            <h2 className="text-lg font-semibold text-red-700 mb-4">Fraud Signals</h2>
            <div className="space-y-3">
              {fraudSignals.map((signal) => (
                <div key={signal.id} className="text-sm border-b border-red-200 pb-2 last:border-0">
                  <p className="font-medium text-red-700">{signal.signal_type}</p>
                  <p className="text-red-600">{signal.description}</p>
                  <p className="text-xs text-red-500">{formatDate(signal.created_at)}</p>
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
        isOpen={actionModal === 'flag'}
        title="Flag User"
        message="Flagging this user will mark them for review. They can still use the platform."
        confirmLabel="Flag User"
        requireReason
        minReasonLength={10}
        onConfirm={(reason) => handleAction(reason)}
        onCancel={() => setActionModal(null)}
      />

      <ConfirmModal
        isOpen={actionModal === 'unflag'}
        title="Remove Flag"
        message="Are you sure you want to remove the flag from this user?"
        confirmLabel="Remove Flag"
        onConfirm={() => handleAction()}
        onCancel={() => setActionModal(null)}
      />

      <ConfirmModal
        isOpen={actionModal === 'restrict'}
        title="Restrict User"
        message="Restricting this user will prevent them from placing new orders."
        confirmLabel="Restrict User"
        variant="danger"
        requireReason
        minReasonLength={20}
        onConfirm={(reason) => handleAction(reason)}
        onCancel={() => setActionModal(null)}
      />

      <ConfirmModal
        isOpen={actionModal === 'unrestrict'}
        title="Remove Restriction"
        message="Are you sure you want to remove the restriction from this user?"
        confirmLabel="Remove Restriction"
        onConfirm={() => handleAction()}
        onCancel={() => setActionModal(null)}
      />
    </div>
  )
}

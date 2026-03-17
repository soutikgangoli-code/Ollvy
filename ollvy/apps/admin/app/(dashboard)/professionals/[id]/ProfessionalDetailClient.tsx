'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ConfirmModal from '@/components/ConfirmModal'
import { formatPaisa } from '@ollvy/shared'

interface ProfessionalDetailClientProps {
  professional: any
  orders: any[]
  reviews: any[]
  strikes: any[]
  auditLog: any[]
  payouts: any[]
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

export default function ProfessionalDetailClient({
  professional,
  orders,
  reviews,
  strikes,
  auditLog,
  payouts,
}: ProfessionalDetailClientProps) {
  const router = useRouter()
  const [actionModal, setActionModal] = useState<'approve' | 'reject' | 'suspend' | 'strike' | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAction = async (reason?: string) => {
    if (!actionModal) return

    setLoading(true)
    try {
      let endpoint = ''
      let body: any = { professional_id: professional.id }

      switch (actionModal) {
        case 'approve':
          endpoint = '/api/admin/professionals/approve'
          break
        case 'reject':
          endpoint = '/api/admin/professionals/reject'
          body.reason = reason
          break
        case 'suspend':
          endpoint = '/api/admin/professionals/suspend'
          body.reason = reason
          break
        case 'strike':
          endpoint = '/api/admin/professionals/strike'
          body.reason = reason
          break
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || `Failed to ${actionModal} professional`)
        return
      }

      router.refresh()
    } finally {
      setLoading(false)
      setActionModal(null)
    }
  }

  const availability = professional.professional_availability?.[0]
  const situations = professional.professional_situations || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Profile Info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Profile Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-text">Phone</p>
              <p className="font-medium">{professional.phone || '-'}</p>
            </div>
            <div>
              <p className="text-muted-text">Email</p>
              <p className="font-medium">{professional.email || '-'}</p>
            </div>
            <div>
              <p className="text-muted-text">UPI ID</p>
              <p className="font-medium font-mono">{professional.upi_id || '-'}</p>
            </div>
            <div>
              <p className="text-muted-text">PAN</p>
              <p className="font-medium font-mono">{professional.pan_number || '-'}</p>
            </div>
            <div>
              <p className="text-muted-text">GST Number</p>
              <p className="font-medium font-mono">{professional.gst_number || '-'}</p>
            </div>
            <div>
              <p className="text-muted-text">Joined</p>
              <p className="font-medium">{formatDate(professional.created_at)}</p>
            </div>
          </div>

          {/* Capacity */}
          <div className="border-t border-border mt-4 pt-4">
            <h3 className="font-medium text-body-text mb-2">Capacity</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-text">Active Orders</p>
                <p className="font-medium">{availability?.current_active_orders || 0}</p>
              </div>
              <div>
                <p className="text-muted-text">Max Concurrent</p>
                <p className="font-medium">{availability?.max_concurrent_orders || 5}</p>
              </div>
            </div>
          </div>

          {/* Situations */}
          {situations.length > 0 && (
            <div className="border-t border-border mt-4 pt-4">
              <h3 className="font-medium text-body-text mb-2">Situation Tags</h3>
              <div className="flex flex-wrap gap-2">
                {situations.flatMap((s: any) => s.situation_tags || []).map((tag: string, i: number) => (
                  <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Orders */}
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
                    <p className="text-xs text-muted-text">{formatDate(order.created_at)}</p>
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

        {/* Reviews */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-body-text">Reviews</h2>
            {professional.avg_rating && (
              <span className="text-lg font-bold text-yellow-600">
                {professional.avg_rating.toFixed(1)} ★
              </span>
            )}
          </div>
          {reviews.length === 0 ? (
            <p className="text-muted-text">No reviews yet</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-yellow-600">{review.rating} ★</span>
                    <span className="text-xs text-muted-text">{formatDate(review.created_at)}</span>
                  </div>
                  {review.comment && <p className="text-sm mt-1">{review.comment}</p>}
                  <p className="text-xs text-muted-text mt-1">User from {review.users?.city || 'Unknown'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payouts */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Recent Payouts</h2>
          {payouts.length === 0 ? (
            <p className="text-muted-text">No payouts</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-text font-medium">Date</th>
                    <th className="text-left py-2 text-muted-text font-medium">Amount</th>
                    <th className="text-left py-2 text-muted-text font-medium">Status</th>
                    <th className="text-left py-2 text-muted-text font-medium">UTR</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-border">
                      <td className="py-2">{formatDate(payout.created_at)}</td>
                      <td className="py-2 font-medium">{formatCurrency(payout.amount_paisa)}</td>
                      <td className="py-2">
                        <span className={`badge badge-${payout.status}`}>{payout.status}</span>
                      </td>
                      <td className="py-2 font-mono text-xs">{payout.utr || '-'}</td>
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
            {professional.status === 'pending_review' && (
              <>
                <button
                  onClick={() => setActionModal('approve')}
                  className="btn-primary w-full text-sm"
                  disabled={loading}
                >
                  Approve Professional
                </button>
                <button
                  onClick={() => setActionModal('reject')}
                  className="btn-danger w-full text-sm"
                  disabled={loading}
                >
                  Reject Application
                </button>
              </>
            )}
            {professional.status === 'approved' && (
              <>
                <button
                  onClick={() => setActionModal('suspend')}
                  className="btn-danger w-full text-sm"
                  disabled={loading}
                >
                  Suspend Professional
                </button>
                <button
                  onClick={() => setActionModal('strike')}
                  className="btn-secondary w-full text-sm"
                  disabled={loading}
                >
                  Add Strike
                </button>
              </>
            )}
          </div>
        </div>

        {/* Strikes */}
        <div className={`card p-6 ${strikes.length > 0 ? 'border-yellow-200 bg-yellow-50' : ''}`}>
          <h2 className="text-lg font-semibold text-body-text mb-4">
            Strikes ({professional.strike_count || 0})
          </h2>
          {strikes.length === 0 ? (
            <p className="text-muted-text text-sm">No strikes recorded</p>
          ) : (
            <div className="space-y-3">
              {strikes.map((strike) => (
                <div key={strike.id} className="text-sm border-b border-border pb-2 last:border-0">
                  <p className="font-medium">{strike.reason}</p>
                  <p className="text-xs text-muted-text">{formatDate(strike.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

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
        isOpen={actionModal === 'approve'}
        title="Approve Professional"
        message={`Are you sure you want to approve ${professional.display_name}? They will receive an SMS notification and can start receiving orders.`}
        confirmLabel="Approve"
        onConfirm={() => handleAction()}
        onCancel={() => setActionModal(null)}
      />

      <ConfirmModal
        isOpen={actionModal === 'reject'}
        title="Reject Application"
        message={`Are you sure you want to reject ${professional.display_name}'s application?`}
        confirmLabel="Reject"
        variant="danger"
        requireReason
        minReasonLength={10}
        onConfirm={(reason) => handleAction(reason)}
        onCancel={() => setActionModal(null)}
      />

      <ConfirmModal
        isOpen={actionModal === 'suspend'}
        title="Suspend Professional"
        message={`Are you sure you want to suspend ${professional.display_name}? This will cancel all their active assignments.`}
        confirmLabel="Suspend"
        variant="danger"
        requireReason
        minReasonLength={50}
        onConfirm={(reason) => handleAction(reason)}
        onCancel={() => setActionModal(null)}
      />

      <ConfirmModal
        isOpen={actionModal === 'strike'}
        title="Add Strike"
        message={`Add a strike to ${professional.display_name}'s record. 3 strikes will result in automatic suspension.`}
        confirmLabel="Add Strike"
        variant="danger"
        requireReason
        minReasonLength={20}
        onConfirm={(reason) => handleAction(reason)}
        onCancel={() => setActionModal(null)}
      />
    </div>
  )
}

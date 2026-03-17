'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Pagination from '@/components/Pagination'
import ConfirmModal from '@/components/ConfirmModal'
import { formatPaisa } from '@ollvy/shared'

interface Dispute {
  id: string
  reason: string
  status: string
  resolution: string | null
  opened_at: string
  resolved_at: string | null
  orders: {
    id: string
    total_paisa_snapshot: number
    service_packages: { name: string }
    users: { id: string; city: string }
    professionals: { id: string; display_name: string } | null
  }
}

interface DisputesTableProps {
  disputes: Dispute[]
  totalCount: number
  currentPage: number
  perPage: number
  searchParams: Record<string, string | undefined>
}

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
]

function formatCurrency(paisa: number): string {
  return formatPaisa(paisa)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DisputesTable({
  disputes,
  totalCount,
  currentPage,
  perPage,
  searchParams,
}: DisputesTableProps) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<string[]>(
    searchParams.status?.split(',') || []
  )
  const [resolveModal, setResolveModal] = useState<{
    disputeId: string
    resolution: 'refund' | 'completed'
  } | null>(null)

  const totalPages = Math.ceil(totalCount / perPage)

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedStatus.length > 0) params.set('status', selectedStatus.join(','))
    router.push(`/disputes?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedStatus([])
    router.push('/disputes')
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>)
    params.set('page', page.toString())
    router.push(`/disputes?${params.toString()}`)
  }

  const handleResolve = async (reason: string) => {
    if (!resolveModal) return

    try {
      const res = await fetch('/api/admin/disputes/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispute_id: resolveModal.disputeId,
          resolution: resolveModal.resolution,
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
      setResolveModal(null)
    }
  }

  return (
    <>
      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-text mb-1">Status</label>
            <select
              multiple
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(Array.from(e.target.selectedOptions, o => o.value))}
              className="input text-sm h-16"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="col-span-3 flex items-end gap-2">
            <button onClick={applyFilters} className="btn-primary text-sm">
              Apply
            </button>
            <button onClick={clearFilters} className="btn-secondary text-sm">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Order</th>
                <th className="table-header">Service</th>
                <th className="table-header">User</th>
                <th className="table-header">Professional</th>
                <th className="table-header">Reason</th>
                <th className="table-header">Status</th>
                <th className="table-header">Opened</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {disputes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-cell text-center text-muted-text py-12">
                    No disputes found
                  </td>
                </tr>
              ) : (
                disputes.map((dispute) => (
                  <tr key={dispute.id} className="border-b border-border hover:bg-gray-50">
                    <td className="table-cell">
                      <Link href={`/orders/${dispute.orders.id}`} className="text-navy hover:underline font-mono text-xs">
                        {dispute.orders.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="table-cell">{dispute.orders.service_packages.name}</td>
                    <td className="table-cell">
                      <Link href={`/users/${dispute.orders.users.id}`} className="text-navy hover:underline">
                        {dispute.orders.users.city || 'Unknown'}
                      </Link>
                    </td>
                    <td className="table-cell">
                      {dispute.orders.professionals ? (
                        <Link href={`/professionals/${dispute.orders.professionals.id}`} className="text-navy hover:underline">
                          {dispute.orders.professionals.display_name}
                        </Link>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="table-cell max-w-xs truncate" title={dispute.reason}>
                      {dispute.reason}
                    </td>
                    <td className="table-cell">
                      <span className={`badge badge-${dispute.status}`}>
                        {dispute.status}
                        {dispute.resolution && ` (${dispute.resolution})`}
                      </span>
                    </td>
                    <td className="table-cell text-sm">{formatDate(dispute.opened_at)}</td>
                    <td className="table-cell font-medium">
                      {formatCurrency(dispute.orders.total_paisa_snapshot)}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Link href={`/orders/${dispute.orders.id}`} className="text-navy hover:underline text-sm">
                          View
                        </Link>
                        {dispute.status === 'open' && (
                          <>
                            <button
                              onClick={() => setResolveModal({ disputeId: dispute.id, resolution: 'refund' })}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Refund
                            </button>
                            <button
                              onClick={() => setResolveModal({ disputeId: dispute.id, resolution: 'completed' })}
                              className="text-green-600 hover:underline text-sm"
                            >
                              Complete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={perPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Resolve Modals */}
      <ConfirmModal
        isOpen={resolveModal?.resolution === 'refund'}
        title="Resolve as Refund"
        message="This will trigger a full refund to the user and cancel the professional payout."
        confirmLabel="Process Refund"
        variant="danger"
        requireReason
        minReasonLength={10}
        onConfirm={(reason) => handleResolve(reason!)}
        onCancel={() => setResolveModal(null)}
      />

      <ConfirmModal
        isOpen={resolveModal?.resolution === 'completed'}
        title="Resolve as Completed"
        message="This will mark the order as completed and release the professional payout."
        confirmLabel="Mark Completed"
        requireReason
        minReasonLength={10}
        onConfirm={(reason) => handleResolve(reason!)}
        onCancel={() => setResolveModal(null)}
      />
    </>
  )
}

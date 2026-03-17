'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Pagination from '@/components/Pagination'
import ConfirmModal from '@/components/ConfirmModal'
import { formatPaisa } from '@ollvy/shared'

interface Payout {
  id: string
  amount_paisa: number
  status: string
  utr: string | null
  created_at: string
  processed_at: string | null
  professionals: {
    id: string
    display_name: string
    upi_id: string
  }
  orders: {
    id: string
    service_packages: { name: string }
  }
}

interface PayoutsClientProps {
  payouts: Payout[]
  totalCount: number
  currentPage: number
  perPage: number
  pendingTotal: number
  readyTotal: number
  searchParams: Record<string, string | undefined>
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'ready', label: 'Ready' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
]

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

export default function PayoutsClient({
  payouts,
  totalCount,
  currentPage,
  perPage,
  pendingTotal,
  readyTotal,
  searchParams,
}: PayoutsClientProps) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState(searchParams.status || '')
  const [processModal, setProcessModal] = useState<string | null>(null)
  const [bulkProcessing, setBulkProcessing] = useState(false)

  const totalPages = Math.ceil(totalCount / perPage)

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedStatus) params.set('status', selectedStatus)
    router.push(`/payouts?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedStatus('')
    router.push('/payouts')
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>)
    params.set('page', page.toString())
    router.push(`/payouts?${params.toString()}`)
  }

  const handleProcessPayout = async (utr?: string) => {
    if (!processModal) return

    try {
      const res = await fetch('/api/admin/payouts/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payout_id: processModal, utr }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to process payout')
        return
      }

      router.refresh()
    } finally {
      setProcessModal(null)
    }
  }

  const handleBulkProcess = async () => {
    setBulkProcessing(true)
    try {
      const res = await fetch('/api/admin/payouts/bulk-process', {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to process payouts')
        return
      }

      const data = await res.json()
      alert(`Processed ${data.count} payouts`)
      router.refresh()
    } finally {
      setBulkProcessing(false)
    }
  }

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <p className="text-sm text-muted-text">Pending</p>
          <p className="text-2xl font-bold text-body-text">{formatCurrency(pendingTotal)}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-muted-text">Ready to Process</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(readyTotal)}</p>
        </div>
        <div className="card p-6 col-span-2 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-text">Bulk Actions</p>
            <p className="text-xs text-muted-text">Process all ready payouts at once</p>
          </div>
          <button
            onClick={handleBulkProcess}
            disabled={bulkProcessing || readyTotal === 0}
            className="btn-primary"
          >
            {bulkProcessing ? 'Processing...' : 'Process All Ready'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-text mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input text-sm"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <button onClick={applyFilters} className="btn-primary text-sm">
            Apply
          </button>
          <button onClick={clearFilters} className="btn-secondary text-sm">
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Professional</th>
                <th className="table-header">Order</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Status</th>
                <th className="table-header">UTR</th>
                <th className="table-header">Created</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-cell text-center text-muted-text py-12">
                    No payouts found
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-border hover:bg-gray-50">
                    <td className="table-cell">
                      <Link href={`/professionals/${payout.professionals?.id}`} className="text-navy hover:underline">
                        {payout.professionals?.display_name}
                      </Link>
                      <p className="text-xs text-muted-text font-mono">{payout.professionals?.upi_id}</p>
                    </td>
                    <td className="table-cell">
                      <Link href={`/orders/${payout.orders?.id}`} className="text-navy hover:underline text-sm">
                        {payout.orders?.service_packages?.name}
                      </Link>
                    </td>
                    <td className="table-cell font-medium">{formatCurrency(payout.amount_paisa)}</td>
                    <td className="table-cell">
                      <span className={`badge badge-${payout.status}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="table-cell font-mono text-xs">{payout.utr || '-'}</td>
                    <td className="table-cell text-sm">{formatDate(payout.created_at)}</td>
                    <td className="table-cell">
                      {payout.status === 'ready' && (
                        <button
                          onClick={() => setProcessModal(payout.id)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Process
                        </button>
                      )}
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

      {/* Process Modal */}
      <ConfirmModal
        isOpen={!!processModal}
        title="Process Payout"
        message="Enter the UTR (Unique Transaction Reference) after completing the UPI transfer."
        confirmLabel="Mark as Completed"
        requireReason
        reasonLabel="UTR Number"
        minReasonLength={10}
        onConfirm={(utr) => handleProcessPayout(utr)}
        onCancel={() => setProcessModal(null)}
      />
    </>
  )
}

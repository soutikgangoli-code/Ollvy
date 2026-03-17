'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPaisa } from '@ollvy/shared'

interface Quote {
  id: string
  user_id: string
  service_package_id: string
  status: string
  created_at: string
  expires_at: string | null
  confirmed_at: string | null
  confirmed_price_paisa: number | null
  notes: string | null
  ageText: string
  isUrgent: boolean
  users: {
    id: string
    phone: string
    city: string
    business_type: string | null
  } | null
  service_packages: {
    id: string
    name: string
    slug: string
  } | null
}

interface QuotesTableProps {
  quotes: Quote[]
  totalCount: number
  currentPage: number
  perPage: number
  currentStatus: string
}

export default function QuotesTable({
  quotes,
  totalCount,
  currentPage,
  perPage,
  currentStatus,
}: QuotesTableProps) {
  const router = useRouter()
  const [showConfirmModal, setShowConfirmModal] = useState<Quote | null>(null)
  const [confirmPrice, setConfirmPrice] = useState('')
  const [confirmNotes, setConfirmNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const totalPages = Math.ceil(totalCount / perPage)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPhone = (phone: string) => {
    if (phone.length >= 10) {
      const last4 = phone.slice(-4)
      return `+91 XXXXX ${last4.slice(0, 1)}${last4.slice(1)}`
    }
    return phone
  }

  const formatCurrency = (paisa: number) => {
    return formatPaisa(paisa)
  }

  const handleConfirmQuote = async () => {
    if (!showConfirmModal || !confirmPrice) return

    const pricePaisa = Math.round(parseFloat(confirmPrice) * 100)
    if (isNaN(pricePaisa) || pricePaisa <= 0) {
      alert('Please enter a valid price')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/quotes/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote_id: showConfirmModal.id,
          confirmed_price_paisa: pricePaisa,
          notes: confirmNotes,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to confirm quote')
        return
      }

      setShowConfirmModal(null)
      setConfirmPrice('')
      setConfirmNotes('')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'badge badge-warning',
      confirmed: 'badge badge-approved',
      expired: 'badge badge-suspended',
      converted: 'badge badge-info',
    }
    return styles[status] || 'badge'
  }

  return (
    <>
      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-xs text-muted-text mb-1">Status</label>
            <select
              value={currentStatus}
              onChange={(e) => router.push(`/quotes?status=${e.target.value}`)}
              className="input text-sm py-1.5"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="expired">Expired</option>
              <option value="converted">Converted to Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Service
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  User
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Age
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Confirmed Price
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-body-text">
                      {quote.service_packages?.name || 'Unknown Service'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-body-text">
                      {formatPhone(quote.users?.phone || '')}
                    </div>
                    <div className="text-xs text-muted-text">
                      {quote.users?.city} • {quote.users?.business_type || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${quote.isUrgent ? 'text-red-600 font-medium' : 'text-muted-text'}`}>
                      {quote.ageText}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={getStatusBadge(quote.status)}>
                      {quote.status}
                    </span>
                    {quote.expires_at && quote.status === 'confirmed' && (
                      <div className="text-xs text-muted-text mt-1">
                        Expires: {formatDate(quote.expires_at)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-body-text">
                    {quote.confirmed_price_paisa
                      ? formatCurrency(quote.confirmed_price_paisa)
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {quote.status === 'pending' && (
                      <button
                        onClick={() => setShowConfirmModal(quote)}
                        className="text-xs bg-navy text-white px-3 py-1.5 rounded hover:bg-opacity-90"
                      >
                        Confirm Quote
                      </button>
                    )}
                    {quote.notes && (
                      <div className="text-xs text-muted-text mt-1 max-w-xs truncate">
                        Note: {quote.notes}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-text">
                    No quote requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <div className="text-sm text-muted-text">
              Showing {((currentPage - 1) * perPage) + 1} - {Math.min(currentPage * perPage, totalCount)} of {totalCount}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/quotes?page=${currentPage - 1}&status=${currentStatus}`}
                className={`btn-secondary text-sm ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Previous
              </Link>
              <Link
                href={`/quotes?page=${currentPage + 1}&status=${currentStatus}`}
                className={`btn-secondary text-sm ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Quote Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-body-text mb-4">
              Confirm Quote
            </h3>
            <p className="text-sm text-muted-text mb-4">
              Set the price for {showConfirmModal.service_packages?.name}. The user will have 48 hours to accept.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price (Rs)</label>
              <input
                type="number"
                value={confirmPrice}
                onChange={(e) => setConfirmPrice(e.target.value)}
                className="input w-full"
                placeholder="e.g. 4999"
                min={0}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Notes (optional)</label>
              <textarea
                value={confirmNotes}
                onChange={(e) => setConfirmNotes(e.target.value)}
                className="input w-full"
                rows={3}
                placeholder="Any additional notes for the user..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirmModal(null)
                  setConfirmPrice('')
                  setConfirmNotes('')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmQuote}
                disabled={!confirmPrice || loading}
                className="btn-primary"
              >
                {loading ? 'Confirming...' : 'Confirm Quote'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

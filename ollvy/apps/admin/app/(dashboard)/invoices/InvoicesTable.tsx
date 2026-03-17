'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPaisa } from '@ollvy/shared'

interface Invoice {
  id: string
  invoice_number: string
  order_id: string
  user_id: string
  total_paisa: number
  cgst_paisa: number | null
  sgst_paisa: number | null
  igst_paisa: number | null
  status: string
  created_at: string
  pdf_path: string | null
  orders: {
    order_number: string
    service_packages: {
      name: string
    } | null
  } | null
  users: {
    phone: string
    city: string | null
    business_name: string | null
  } | null
}

interface InvoicesTableProps {
  invoices: Invoice[]
  totalCount: number
  currentPage: number
  perPage: number
  searchParams: {
    status?: string
    from?: string
    to?: string
  }
}

export default function InvoicesTable({
  invoices,
  totalCount,
  currentPage,
  perPage,
  searchParams,
}: InvoicesTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const totalPages = Math.ceil(totalCount / perPage)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  const handleDownload = async (invoice: Invoice) => {
    setLoading(invoice.id)
    try {
      const res = await fetch(`/api/admin/invoices/download?invoice_id=${invoice.id}`)
      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Failed to get invoice URL')
        return
      }

      // Open PDF in new tab
      window.open(data.url, '_blank')
    } finally {
      setLoading(null)
    }
  }

  const handleResend = async (invoice: Invoice) => {
    if (!confirm(`Resend invoice ${invoice.invoice_number} to user?`)) {
      return
    }

    setLoading(invoice.id)
    try {
      const res = await fetch('/api/admin/invoices/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: invoice.id }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to resend invoice')
        return
      }

      alert('Invoice resent successfully')
    } finally {
      setLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      generated: 'badge badge-approved',
      pending: 'badge badge-warning',
      failed: 'badge badge-suspended',
    }
    return styles[status] || 'badge'
  }

  const buildFilterUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const newParams = { ...searchParams, ...updates }

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })

    return `/invoices?${params.toString()}`
  }

  return (
    <>
      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-muted-text mb-1">Status</label>
            <select
              value={searchParams.status || ''}
              onChange={(e) => router.push(buildFilterUrl({ status: e.target.value || undefined, page: undefined }))}
              className="input text-sm py-1.5"
            >
              <option value="">All Statuses</option>
              <option value="generated">Generated</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-text mb-1">From Date</label>
            <input
              type="date"
              value={searchParams.from || ''}
              onChange={(e) => router.push(buildFilterUrl({ from: e.target.value || undefined, page: undefined }))}
              className="input text-sm py-1.5"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-text mb-1">To Date</label>
            <input
              type="date"
              value={searchParams.to || ''}
              onChange={(e) => router.push(buildFilterUrl({ to: e.target.value || undefined, page: undefined }))}
              className="input text-sm py-1.5"
            />
          </div>
          {(searchParams.status || searchParams.from || searchParams.to) && (
            <button
              onClick={() => router.push('/invoices')}
              className="text-sm text-navy hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Invoice #
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Order
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Service
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Amount
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  GST
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-body-text">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/orders/${invoice.order_id}`} className="text-navy hover:underline">
                      {invoice.orders?.order_number || invoice.order_id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-body-text">
                    {invoice.orders?.service_packages?.name || 'Unknown'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-body-text">
                      {invoice.users?.business_name || formatPhone(invoice.users?.phone || '')}
                    </div>
                    {invoice.users?.city && (
                      <div className="text-xs text-muted-text">{invoice.users.city}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-body-text">
                    {formatCurrency(invoice.total_paisa)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-text">
                    {invoice.igst_paisa ? (
                      <span>IGST: {formatCurrency(invoice.igst_paisa)}</span>
                    ) : (
                      <span>
                        CGST: {formatCurrency(invoice.cgst_paisa || 0)}<br />
                        SGST: {formatCurrency(invoice.sgst_paisa || 0)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={getStatusBadge(invoice.status)}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-text">
                    {formatDate(invoice.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {invoice.pdf_path && (
                        <button
                          onClick={() => handleDownload(invoice)}
                          disabled={loading === invoice.id}
                          className="text-xs bg-gray-100 text-body-text px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                        >
                          {loading === invoice.id ? '...' : 'Download'}
                        </button>
                      )}
                      <button
                        onClick={() => handleResend(invoice)}
                        disabled={loading === invoice.id}
                        className="text-xs bg-gray-100 text-body-text px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                      >
                        Resend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-text">
                    No invoices found
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
                href={buildFilterUrl({ page: String(currentPage - 1) })}
                className={`btn-secondary text-sm ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Previous
              </Link>
              <Link
                href={buildFilterUrl({ page: String(currentPage + 1) })}
                className={`btn-secondary text-sm ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

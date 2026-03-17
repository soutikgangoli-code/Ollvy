'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Pagination from '@/components/Pagination'
import { formatPaisa } from '@ollvy/shared'

interface Retainer {
  id: string
  status: string
  billing_cycle: string
  next_billing_date: string | null
  current_period_start: string
  current_period_end: string
  razorpay_subscription_id: string | null
  created_at: string
  users: {
    id: string
    city: string
    business_type: string
    phone: string
  }
  retainer_tiers: {
    id: string
    name: string
    hours_per_month: number
    price_paisa: number
  }
  professionals: {
    id: string
    display_name: string
  } | null
}

interface RetainersTableProps {
  retainers: Retainer[]
  totalCount: number
  currentPage: number
  perPage: number
  searchParams: Record<string, string | undefined>
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'past_due', label: 'Past Due' },
]

const BILLING_CYCLE_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
]

function formatCurrency(paisa: number): string {
  return formatPaisa(paisa)
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function RetainersTable({
  retainers,
  totalCount,
  currentPage,
  perPage,
  searchParams,
}: RetainersTableProps) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<string[]>(
    searchParams.status?.split(',') || []
  )
  const [selectedBillingCycle, setSelectedBillingCycle] = useState(searchParams.billing_cycle || '')

  const totalPages = Math.ceil(totalCount / perPage)

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedStatus.length > 0) params.set('status', selectedStatus.join(','))
    if (selectedBillingCycle) params.set('billing_cycle', selectedBillingCycle)
    router.push(`/retainers?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedStatus([])
    setSelectedBillingCycle('')
    router.push('/retainers')
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>)
    params.set('page', page.toString())
    router.push(`/retainers?${params.toString()}`)
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
              className="input text-sm h-20"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-text mb-1">Billing Cycle</label>
            <select
              value={selectedBillingCycle}
              onChange={(e) => setSelectedBillingCycle(e.target.value)}
              className="input text-sm"
            >
              <option value="">All Cycles</option>
              {BILLING_CYCLE_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 flex items-end gap-2">
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
                <th className="table-header">User</th>
                <th className="table-header">Tier</th>
                <th className="table-header">Professional</th>
                <th className="table-header">Billing</th>
                <th className="table-header">Status</th>
                <th className="table-header">Next Billing</th>
                <th className="table-header">Period</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {retainers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center text-muted-text py-12">
                    No retainers found
                  </td>
                </tr>
              ) : (
                retainers.map((retainer) => (
                  <tr key={retainer.id} className="border-b border-border hover:bg-gray-50">
                    <td className="table-cell">
                      <Link href={`/users/${retainer.users.id}`} className="text-navy hover:underline">
                        {retainer.users.city || 'Unknown'} - {retainer.users.business_type || 'N/A'}
                      </Link>
                      <p className="text-xs text-muted-text">{retainer.users.phone}</p>
                    </td>
                    <td className="table-cell">
                      <p className="font-medium">{retainer.retainer_tiers.name}</p>
                      <p className="text-xs text-muted-text">
                        {retainer.retainer_tiers.hours_per_month}h/mo • {formatCurrency(retainer.retainer_tiers.price_paisa)}
                      </p>
                    </td>
                    <td className="table-cell">
                      {retainer.professionals ? (
                        <Link href={`/professionals/${retainer.professionals.id}`} className="text-navy hover:underline">
                          {retainer.professionals.display_name}
                        </Link>
                      ) : (
                        <span className="text-muted-text">Not assigned</span>
                      )}
                    </td>
                    <td className="table-cell capitalize">{retainer.billing_cycle}</td>
                    <td className="table-cell">
                      <span className={`badge badge-${retainer.status}`}>
                        {retainer.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="table-cell">{formatDate(retainer.next_billing_date)}</td>
                    <td className="table-cell">
                      <p className="text-xs">
                        {formatDate(retainer.current_period_start)} - {formatDate(retainer.current_period_end)}
                      </p>
                    </td>
                    <td className="table-cell">
                      <Link href={`/retainers/${retainer.id}`} className="text-navy hover:underline text-sm">
                        View
                      </Link>
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
    </>
  )
}

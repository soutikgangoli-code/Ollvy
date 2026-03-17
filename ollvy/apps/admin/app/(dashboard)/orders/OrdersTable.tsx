'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Pagination from '@/components/Pagination'
import ConfirmModal from '@/components/ConfirmModal'
import { formatPaisa } from '@ollvy/shared'

interface Order {
  id: string
  status: string
  total_paisa_snapshot: number
  created_at: string
  assigned_at: string | null
  service_packages: {
    id: string
    name: string
    sla_working_days: number
  }
  users: {
    id: string
    city: string
  }
  professionals: {
    id: string
    display_name: string
  } | null
}

interface OrdersTableProps {
  orders: Order[]
  totalCount: number
  currentPage: number
  perPage: number
  services: { id: string; name: string }[]
  cities: string[]
  professionals: { id: string; display_name: string }[]
  searchParams: Record<string, string | undefined>
}

const STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'paid', label: 'Paid' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'disputed', label: 'Disputed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatCurrency(paisa: number): string {
  return formatPaisa(paisa)
}

function getSLACountdown(order: Order): { text: string; isOverdue: boolean } {
  if (!['assigned', 'in_progress'].includes(order.status)) {
    return { text: '-', isOverdue: false }
  }

  const startDate = order.assigned_at ? new Date(order.assigned_at) : new Date(order.created_at)
  const slaDays = order.service_packages.sla_working_days
  const deadline = new Date(startDate)
  deadline.setDate(deadline.getDate() + slaDays)

  const now = new Date()
  const diff = deadline.getTime() - now.getTime()

  if (diff < 0) {
    const daysOverdue = Math.ceil(Math.abs(diff) / (1000 * 60 * 60 * 24))
    return { text: `${daysOverdue}d overdue`, isOverdue: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  return { text: `${days}d ${hours}h`, isOverdue: false }
}

export default function OrdersTable({
  orders,
  totalCount,
  currentPage,
  perPage,
  services,
  cities,
  professionals,
  searchParams,
}: OrdersTableProps) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<string[]>(
    searchParams.status?.split(',') || []
  )
  const [selectedService, setSelectedService] = useState(searchParams.service || '')
  const [selectedCity, setSelectedCity] = useState(searchParams.city || '')
  const [selectedProfessional, setSelectedProfessional] = useState(searchParams.professional || '')
  const [dateFrom, setDateFrom] = useState(searchParams.from || '')
  const [dateTo, setDateTo] = useState(searchParams.to || '')
  const [cancelModal, setCancelModal] = useState<{ orderId: string } | null>(null)

  const totalPages = Math.ceil(totalCount / perPage)

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedStatus.length > 0) params.set('status', selectedStatus.join(','))
    if (selectedService) params.set('service', selectedService)
    if (selectedCity) params.set('city', selectedCity)
    if (selectedProfessional) params.set('professional', selectedProfessional)
    if (dateFrom) params.set('from', dateFrom)
    if (dateTo) params.set('to', dateTo)
    router.push(`/orders?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedStatus([])
    setSelectedService('')
    setSelectedCity('')
    setSelectedProfessional('')
    setDateFrom('')
    setDateTo('')
    router.push('/orders')
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>)
    params.set('page', page.toString())
    router.push(`/orders?${params.toString()}`)
  }

  const handleCancelOrder = async (reason: string) => {
    if (!cancelModal) return

    try {
      const res = await fetch('/api/admin/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: cancelModal.orderId, reason }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to cancel order')
        return
      }

      router.refresh()
    } finally {
      setCancelModal(null)
    }
  }

  return (
    <>
      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
            <label className="block text-xs font-medium text-muted-text mb-1">Service</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="input text-sm"
            >
              <option value="">All Services</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-text mb-1">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="input text-sm"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-text mb-1">Professional</label>
            <select
              value={selectedProfessional}
              onChange={(e) => setSelectedProfessional(e.target.value)}
              className="input text-sm"
            >
              <option value="">All Professionals</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>{p.display_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-text mb-1">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-text mb-1">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={applyFilters} className="btn-primary text-sm">
            Apply Filters
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
                <th className="table-header">Order ID</th>
                <th className="table-header">Service</th>
                <th className="table-header">User City</th>
                <th className="table-header">Professional</th>
                <th className="table-header">Status</th>
                <th className="table-header">SLA</th>
                <th className="table-header">Created</th>
                <th className="table-header">Total</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-cell text-center text-muted-text py-12">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const sla = getSLACountdown(order)
                  return (
                    <tr key={order.id} className="border-b border-border hover:bg-gray-50">
                      <td className="table-cell">
                        <Link href={`/orders/${order.id}`} className="text-navy hover:underline font-mono text-xs">
                          {order.id.slice(0, 8)}...
                        </Link>
                      </td>
                      <td className="table-cell">{order.service_packages.name}</td>
                      <td className="table-cell">{order.users.city || '-'}</td>
                      <td className="table-cell">{order.professionals?.display_name || '-'}</td>
                      <td className="table-cell">
                        <span className={`badge badge-${order.status}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={sla.isOverdue ? 'text-red-600 font-medium' : ''}>
                          {sla.text}
                        </span>
                      </td>
                      <td className="table-cell">{formatDate(order.created_at)}</td>
                      <td className="table-cell font-medium">{formatCurrency(order.total_paisa_snapshot)}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <Link href={`/orders/${order.id}`} className="text-navy hover:underline text-sm">
                            View
                          </Link>
                          {order.status !== 'completed' && order.status !== 'cancelled' && (
                            <button
                              onClick={() => setCancelModal({ orderId: order.id })}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
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

      {/* Cancel Modal */}
      <ConfirmModal
        isOpen={!!cancelModal}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This will trigger a refund if payment was captured."
        confirmLabel="Cancel Order"
        variant="danger"
        requireReason
        minReasonLength={20}
        onConfirm={(reason) => handleCancelOrder(reason!)}
        onCancel={() => setCancelModal(null)}
      />
    </>
  )
}

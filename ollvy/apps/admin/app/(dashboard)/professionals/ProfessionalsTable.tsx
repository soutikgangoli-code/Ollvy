'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Pagination from '@/components/Pagination'
import ConfirmModal from '@/components/ConfirmModal'

interface Professional {
  id: string
  display_name: string
  city: string
  profession_type: string
  status: string
  is_available: boolean
  strike_count: number
  avg_rating: number | null
  created_at: string
  professional_availability?: { current_active_orders: number }[]
}

interface ProfessionalsTableProps {
  professionals: Professional[]
  totalCount: number
  currentPage: number
  perPage: number
  cities: string[]
  searchParams: Record<string, string | undefined>
}

const STATUS_OPTIONS = [
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'rejected', label: 'Rejected' },
]

const PROFESSION_TYPES = ['CA', 'CS', 'Tax Professional', 'Payroll Specialist', 'Labour Law Consultant']

export default function ProfessionalsTable({
  professionals,
  totalCount,
  currentPage,
  perPage,
  cities,
  searchParams,
}: ProfessionalsTableProps) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<string[]>(
    searchParams.status?.split(',') || []
  )
  const [selectedCity, setSelectedCity] = useState(searchParams.city || '')
  const [selectedType, setSelectedType] = useState(searchParams.profession_type || '')
  const [actionModal, setActionModal] = useState<{
    id: string
    action: 'approve' | 'reject' | 'suspend'
    name: string
  } | null>(null)

  const totalPages = Math.ceil(totalCount / perPage)

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedStatus.length > 0) params.set('status', selectedStatus.join(','))
    if (selectedCity) params.set('city', selectedCity)
    if (selectedType) params.set('profession_type', selectedType)
    router.push(`/professionals?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedStatus([])
    setSelectedCity('')
    setSelectedType('')
    router.push('/professionals')
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>)
    params.set('page', page.toString())
    router.push(`/professionals?${params.toString()}`)
  }

  const handleAction = async (reason?: string) => {
    if (!actionModal) return

    const endpoint = actionModal.action === 'approve'
      ? '/api/admin/professionals/approve'
      : actionModal.action === 'reject'
      ? '/api/admin/professionals/reject'
      : '/api/admin/professionals/suspend'

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professional_id: actionModal.id,
          reason,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || `Failed to ${actionModal.action} professional`)
        return
      }

      router.refresh()
    } finally {
      setActionModal(null)
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
              className="input text-sm h-20"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
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
            <label className="block text-xs font-medium text-muted-text mb-1">Profession Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input text-sm"
            >
              <option value="">All Types</option>
              {PROFESSION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
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
                <th className="table-header">Name</th>
                <th className="table-header">City</th>
                <th className="table-header">Type</th>
                <th className="table-header">Status</th>
                <th className="table-header">Active Orders</th>
                <th className="table-header">Rating</th>
                <th className="table-header">Strikes</th>
                <th className="table-header">Joined</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {professionals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-cell text-center text-muted-text py-12">
                    No professionals found
                  </td>
                </tr>
              ) : (
                professionals.map((pro) => (
                  <tr key={pro.id} className="border-b border-border hover:bg-gray-50">
                    <td className="table-cell">
                      <Link href={`/professionals/${pro.id}`} className="text-navy hover:underline font-medium">
                        {pro.display_name}
                      </Link>
                    </td>
                    <td className="table-cell">{pro.city || '-'}</td>
                    <td className="table-cell">{pro.profession_type}</td>
                    <td className="table-cell">
                      <span className={`badge badge-${pro.status}`}>
                        {pro.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="table-cell">
                      {pro.professional_availability?.[0]?.current_active_orders || 0}
                    </td>
                    <td className="table-cell">
                      {pro.avg_rating ? `${pro.avg_rating.toFixed(1)} ★` : 'N/A'}
                    </td>
                    <td className="table-cell">
                      <span className={`
                        font-medium
                        ${pro.strike_count >= 3 ? 'text-red-600' : pro.strike_count >= 1 ? 'text-yellow-600' : ''}
                      `}>
                        {pro.strike_count}
                      </span>
                    </td>
                    <td className="table-cell">
                      {new Date(pro.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Link href={`/professionals/${pro.id}`} className="text-navy hover:underline text-sm">
                          View
                        </Link>
                        {pro.status === 'pending_review' && (
                          <>
                            <button
                              onClick={() => setActionModal({ id: pro.id, action: 'approve', name: pro.display_name })}
                              className="text-green-600 hover:underline text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setActionModal({ id: pro.id, action: 'reject', name: pro.display_name })}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {pro.status === 'approved' && (
                          <button
                            onClick={() => setActionModal({ id: pro.id, action: 'suspend', name: pro.display_name })}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Suspend
                          </button>
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

      {/* Action Modals */}
      <ConfirmModal
        isOpen={actionModal?.action === 'approve'}
        title="Approve Professional"
        message={`Are you sure you want to approve ${actionModal?.name}? They will receive an SMS notification and can start receiving orders.`}
        confirmLabel="Approve"
        onConfirm={() => handleAction()}
        onCancel={() => setActionModal(null)}
      />

      <ConfirmModal
        isOpen={actionModal?.action === 'reject'}
        title="Reject Professional"
        message={`Are you sure you want to reject ${actionModal?.name}?`}
        confirmLabel="Reject"
        variant="danger"
        requireReason
        minReasonLength={10}
        onConfirm={(reason) => handleAction(reason)}
        onCancel={() => setActionModal(null)}
      />

      <ConfirmModal
        isOpen={actionModal?.action === 'suspend'}
        title="Suspend Professional"
        message={`Are you sure you want to suspend ${actionModal?.name}? This will cancel all their active assignments.`}
        confirmLabel="Suspend"
        variant="danger"
        requireReason
        minReasonLength={50}
        onConfirm={(reason) => handleAction(reason)}
        onCancel={() => setActionModal(null)}
      />
    </>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Application {
  id: string
  full_name: string
  phone: string
  email: string | null
  city: string
  profession_type: string
  years_experience: number
  status: string
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  rejection_reason: string | null
  reapply_after_date: string | null
}

interface ApplicationsTableProps {
  applications: Application[]
  totalCount: number
  currentPage: number
  perPage: number
  currentStatus: string
}

const REJECTION_REASONS = [
  { code: 'insufficient_certs', label: 'Insufficient certifications' },
  { code: 'incomplete_profile', label: 'Incomplete profile' },
  { code: 'location_not_served', label: 'Location not served' },
  { code: 'duplicate_account', label: 'Duplicate account' },
  { code: 'other', label: 'Other' },
]

export default function ApplicationsTable({
  applications,
  totalCount,
  currentPage,
  perPage,
  currentStatus,
}: ApplicationsTableProps) {
  const router = useRouter()
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showRejectModal, setShowRejectModal] = useState<Application | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectNotes, setRejectNotes] = useState('')

  const totalPages = Math.ceil(totalCount / perPage)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatPhone = (phone: string) => {
    // Mask phone: +91 XXXXX X1234
    if (phone.length >= 10) {
      const last4 = phone.slice(-4)
      return `+91 XXXXX ${last4.slice(0, 1)}${last4.slice(1)}`
    }
    return phone
  }

  const handleApprove = async (application: Application) => {
    if (!confirm(`Approve ${application.full_name}? This will create a professional account and send them an invitation SMS.`)) {
      return
    }

    setActionLoading(application.id)
    try {
      // First, create the professional from the application
      const res = await fetch('/api/admin/professionals/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: application.id,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to approve application')
        return
      }

      router.refresh()
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!showRejectModal || !rejectReason) return

    setActionLoading(showRejectModal.id)
    try {
      const res = await fetch('/api/admin/professionals/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: showRejectModal.id,
          reason_code: rejectReason,
          reason_notes: rejectNotes,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to reject application')
        return
      }

      setShowRejectModal(null)
      setRejectReason('')
      setRejectNotes('')
      router.refresh()
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      submitted: 'badge badge-warning',
      approved: 'badge badge-approved',
      rejected: 'badge badge-suspended',
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
              onChange={(e) => router.push(`/professionals/applications?status=${e.target.value}`)}
              className="input text-sm py-1.5"
            >
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
                  Applicant
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Phone
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  City
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Profession
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Experience
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Submitted
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-body-text">{app.full_name}</div>
                    {app.email && (
                      <div className="text-xs text-muted-text">{app.email}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-text font-mono">
                    {formatPhone(app.phone)}
                  </td>
                  <td className="px-4 py-3 text-sm text-body-text">
                    {app.city}
                  </td>
                  <td className="px-4 py-3 text-sm text-body-text">
                    {app.profession_type}
                  </td>
                  <td className="px-4 py-3 text-sm text-body-text">
                    {app.years_experience} years
                  </td>
                  <td className="px-4 py-3">
                    <span className={getStatusBadge(app.status)}>
                      {app.status}
                    </span>
                    {app.rejection_reason && (
                      <div className="text-xs text-muted-text mt-1">
                        {app.rejection_reason}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-text">
                    {formatDate(app.submitted_at)}
                  </td>
                  <td className="px-4 py-3">
                    {app.status === 'submitted' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(app)}
                          disabled={actionLoading === app.id}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 disabled:opacity-50"
                        >
                          {actionLoading === app.id ? '...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => setShowRejectModal(app)}
                          disabled={actionLoading === app.id}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {app.status === 'rejected' && app.reapply_after_date && (
                      <div className="text-xs text-muted-text">
                        Can reapply: {formatDate(app.reapply_after_date)}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-text">
                    No applications found
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
                href={`/professionals/applications?page=${currentPage - 1}&status=${currentStatus}`}
                className={`btn-secondary text-sm ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Previous
              </Link>
              <Link
                href={`/professionals/applications?page=${currentPage + 1}&status=${currentStatus}`}
                className={`btn-secondary text-sm ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-body-text mb-4">
              Reject Application
            </h3>
            <p className="text-sm text-muted-text mb-4">
              Rejecting application for {showRejectModal.full_name}. They will be able to reapply after 30 days.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Reason</label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="input w-full"
              >
                <option value="">Select a reason</option>
                {REJECTION_REASONS.map((r) => (
                  <option key={r.code} value={r.code}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Additional Notes (optional)</label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                className="input w-full"
                rows={3}
                placeholder="Provide additional context..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(null)
                  setRejectReason('')
                  setRejectNotes('')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason || actionLoading === showRejectModal.id}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                {actionLoading === showRejectModal.id ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

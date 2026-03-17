'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Pagination from '@/components/Pagination'

interface User {
  id: string
  phone: string
  city: string | null
  business_type: string | null
  is_flagged: boolean
  is_restricted: boolean
  created_at: string
}

interface UsersTableProps {
  users: User[]
  totalCount: number
  currentPage: number
  perPage: number
  cities: string[]
  businessTypes: string[]
  searchParams: Record<string, string | undefined>
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function UsersTable({
  users,
  totalCount,
  currentPage,
  perPage,
  cities,
  businessTypes,
  searchParams,
}: UsersTableProps) {
  const router = useRouter()
  const [selectedCity, setSelectedCity] = useState(searchParams.city || '')
  const [selectedBusinessType, setSelectedBusinessType] = useState(searchParams.business_type || '')
  const [showFlagged, setShowFlagged] = useState(searchParams.flagged === 'true')
  const [showRestricted, setShowRestricted] = useState(searchParams.restricted === 'true')
  const [search, setSearch] = useState(searchParams.search || '')

  const totalPages = Math.ceil(totalCount / perPage)

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedCity) params.set('city', selectedCity)
    if (selectedBusinessType) params.set('business_type', selectedBusinessType)
    if (showFlagged) params.set('flagged', 'true')
    if (showRestricted) params.set('restricted', 'true')
    if (search) params.set('search', search)
    router.push(`/users?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedCity('')
    setSelectedBusinessType('')
    setShowFlagged(false)
    setShowRestricted(false)
    setSearch('')
    router.push('/users')
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>)
    params.set('page', page.toString())
    router.push(`/users?${params.toString()}`)
  }

  return (
    <>
      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-text mb-1">Search Phone</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Phone number..."
              className="input text-sm"
            />
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
            <label className="block text-xs font-medium text-muted-text mb-1">Business Type</label>
            <select
              value={selectedBusinessType}
              onChange={(e) => setSelectedBusinessType(e.target.value)}
              className="input text-sm"
            >
              <option value="">All Types</option>
              {businessTypes.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showFlagged}
                onChange={(e) => setShowFlagged(e.target.checked)}
                className="rounded border-border"
              />
              Flagged
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showRestricted}
                onChange={(e) => setShowRestricted(e.target.checked)}
                className="rounded border-border"
              />
              Restricted
            </label>
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
                <th className="table-header">Phone</th>
                <th className="table-header">City</th>
                <th className="table-header">Business Type</th>
                <th className="table-header">Status</th>
                <th className="table-header">Joined</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-cell text-center text-muted-text py-12">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-gray-50">
                    <td className="table-cell font-mono">{user.phone}</td>
                    <td className="table-cell">{user.city || '-'}</td>
                    <td className="table-cell">{user.business_type || '-'}</td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        {user.is_flagged && (
                          <span className="badge badge-disputed">Flagged</span>
                        )}
                        {user.is_restricted && (
                          <span className="badge badge-cancelled">Restricted</span>
                        )}
                        {!user.is_flagged && !user.is_restricted && (
                          <span className="badge badge-approved">Active</span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">{formatDate(user.created_at)}</td>
                    <td className="table-cell">
                      <Link href={`/users/${user.id}`} className="text-navy hover:underline text-sm">
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

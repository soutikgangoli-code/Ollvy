'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPaisa, formatDate } from '@/lib/utils'

interface SearchResult {
  id: string
  order_number: string
  status: string
  total_paisa_snapshot: number
  paid_at: string
  service_name: string
  user_name: string
  user_phone: string
  professional_name?: string
  assigned_admin_id?: string
}

interface SearchClientProps {
  results: SearchResult[]
  query: string
  statusFilter: string | null
  pendingFilter: string | null
}

const STATUS_TABS = [
  { label: 'All', value: null },
  { label: 'Active', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

const PENDING_TABS = [
  { label: 'All', value: null },
  { label: 'Pending on us', value: 'pending_admin' },
  { label: 'Pending on user', value: 'pending_user' },
]

const STATUS_BADGE_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending_assignment: 'secondary',
  waitlisted: 'outline',
  in_progress: 'default',
  completed: 'default',
  disputed: 'destructive',
  cancelled: 'destructive',
}

export function SearchClient({ results, query, statusFilter, pendingFilter }: SearchClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(query)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (statusFilter) params.set('status', statusFilter)
    if (pendingFilter) params.set('pending', pendingFilter)
    router.push(`/admin/search?${params.toString()}`)
  }

  const handleStatusChange = (status: string | null) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (status) params.set('status', status)
    if (pendingFilter) params.set('pending', pendingFilter)
    router.push(`/admin/search?${params.toString()}`)
  }

  const handlePendingChange = (pending: string | null) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (statusFilter) params.set('status', statusFilter)
    if (pending) params.set('pending', pending)
    router.push(`/admin/search?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Search</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search across orders, users, and services
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order number, user name, phone, or service..."
          className="max-w-lg"
        />
        <Button type="submit">Search</Button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Status filter */}
        <div className="flex items-center gap-1">
          {STATUS_TABS.map(tab => (
            <Button
              key={tab.label}
              variant={statusFilter === tab.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Pending filter */}
        <div className="flex items-center gap-1">
          {PENDING_TABS.map(tab => (
            <Button
              key={tab.label}
              variant={pendingFilter === tab.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePendingChange(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {query && (
        <p className="text-sm text-muted-foreground">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </p>
      )}

      {/* Results list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Search Results
            <span className="text-muted-foreground font-normal ml-2">
              ({results.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              {query ? 'No results found' : 'Enter a search query to find orders'}
            </p>
          ) : (
            <div className="divide-y divide-border">
              {results.map(result => (
                <div
                  key={result.id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-medium">
                        {result.order_number}
                      </span>
                      <Badge variant={STATUS_BADGE_VARIANTS[result.status] || 'outline'}>
                        {result.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {result.service_name}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {result.user_name || 'Unknown'} - {result.user_phone}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-medium">
                      {formatPaisa(result.total_paisa_snapshot)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(result.paid_at)}
                    </div>
                  </div>
                  <Link href={`/admin/orders/${result.id}`}>
                    <Button variant="outline" size="sm">
                      Open
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

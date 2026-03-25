'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPaisa, formatDate } from '@/lib/utils'

interface SearchResult {
  result_type: 'order' | 'user'
  id: string
  primary_text: string
  secondary_text: string
  tertiary_text: string
  status: string | null
  amount_paisa: number | null
  created_at: string
}

interface SearchClientProps {
  results: SearchResult[]
  query: string
}

const STATUS_BADGE_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending_assignment: 'secondary',
  waitlisted: 'outline',
  in_progress: 'default',
  completed: 'default',
  disputed: 'destructive',
  cancelled: 'destructive',
}

export function SearchClient({ results, query }: SearchClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(query)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    router.push(`/admin/search?${params.toString()}`)
  }

  const handleResultClick = (result: SearchResult) => {
    if (result.result_type === 'order') {
      router.push(`/admin/orders/${result.id}`)
    } else {
      router.push(`/admin/users/${result.id}`)
    }
  }

  // Count by type
  const orderCount = results.filter(r => r.result_type === 'order').length
  const userCount = results.filter(r => r.result_type === 'user').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Search</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search across orders and users
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order number, user name, phone, email, or service..."
          className="max-w-lg"
        />
        <Button type="submit">Search</Button>
      </form>

      {/* Results count */}
      {query && (
        <p className="text-sm text-muted-foreground">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          {results.length > 0 && (
            <span className="ml-2">
              ({orderCount} order{orderCount !== 1 ? 's' : ''}, {userCount} user{userCount !== 1 ? 's' : ''})
            </span>
          )}
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
              {query ? 'No results found' : 'Enter a search query to find orders and users'}
            </p>
          ) : (
            <div className="divide-y divide-border">
              {results.map(result => (
                <div
                  key={`${result.result_type}-${result.id}`}
                  className="py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/50 transition-colors -mx-4 px-4"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={result.result_type === 'order' ? 'default' : 'secondary'}>
                        {result.result_type === 'order' ? 'Order' : 'User'}
                      </Badge>
                      <span className="font-mono text-sm font-medium">
                        {result.primary_text}
                      </span>
                      {result.status && (
                        <Badge variant={STATUS_BADGE_VARIANTS[result.status] || 'outline'}>
                          {result.status.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {result.secondary_text}
                    </div>
                    {result.tertiary_text && (
                      <div className="text-sm text-muted-foreground truncate">
                        {result.tertiary_text}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {result.amount_paisa && (
                      <div className="font-medium">
                        {formatPaisa(result.amount_paisa)}
                      </div>
                    )}
                    {result.created_at && (
                      <div className="text-sm text-muted-foreground">
                        {formatDate(result.created_at)}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleResultClick(result)
                    }}
                  >
                    Open
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPaisa, formatDate } from '@/lib/utils'

interface Order {
  id: string
  order_number: string
  status: string
  paid_at: string
  total_paisa_snapshot: number
  service_name: string
  user_name: string
}

interface OrdersListClientProps {
  orders: Order[]
  currentPage: number
  totalCount: number
  pageSize: number
  activeTab: string
}

type FilterTab = 'all' | 'active' | 'needs_attention' | 'completed' | 'cancelled'

export function OrdersListClient({ orders, currentPage, totalCount, pageSize, activeTab }: OrdersListClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const totalPages = Math.ceil(totalCount / pageSize)

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders
    const query = searchQuery.toLowerCase()
    return orders.filter(o =>
      o.order_number.toLowerCase().includes(query) ||
      o.user_name.toLowerCase().includes(query) ||
      o.service_name.toLowerCase().includes(query)
    )
  }, [orders, searchQuery])

  function navigateTo(tab: string, page: number) {
    const params = new URLSearchParams()
    if (tab !== 'all') params.set('tab', tab)
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    router.push(`/admin/orders${qs ? `?${qs}` : ''}`)
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'needs_attention', label: 'Needs Attention' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in_progress': return 'secondary'
      case 'pending_assignment': return 'outline'
      case 'disputed': return 'destructive'
      case 'cancelled': return 'outline'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">All Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {orders.length} total orders
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map(tab => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => navigateTo(tab.key, 1)}
          >
            {tab.label}
          </Button>
        ))}
        <Input
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm ml-auto"
        />
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">
            Orders
            <span className="text-muted-foreground font-normal ml-2">
              ({filteredOrders.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No orders found
            </p>
          ) : (
            <div className="divide-y divide-border">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="py-4 flex items-center justify-between gap-4"
                  onMouseEnter={() => router.prefetch(`/admin/orders/${order.id}`)}
                  onFocus={() => router.prefetch(`/admin/orders/${order.id}`)}
                  tabIndex={0}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-medium">
                        {order.order_number}
                      </span>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {order.service_name}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {order.user_name}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-medium">
                      {formatPaisa(order.total_paisa_snapshot)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.paid_at ? formatDate(order.paid_at) : 'Unpaid'}
                    </div>
                  </div>
                  <Link href={`/admin/orders/${order.id}`}>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalCount)} of {totalCount}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => navigateTo(activeTab, currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => navigateTo(activeTab, currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

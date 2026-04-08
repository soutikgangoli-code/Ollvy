'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPaisa, formatDate } from '@/lib/utils'
import { usePersistedState } from '@/lib/hooks/use-persisted-state'

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
}

type FilterTab = 'all' | 'active' | 'needs_attention' | 'completed' | 'cancelled'

export function OrdersListClient({ orders }: OrdersListClientProps) {
  // Persisted filter state - survives page navigation
  const [activeTab, setActiveTab] = usePersistedState<FilterTab>('admin-orders-tab', 'all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = useMemo(() => {
    let result = orders

    // Filter by tab
    switch (activeTab) {
      case 'active':
        result = result.filter(o => ['pending_assignment', 'waitlisted', 'in_progress'].includes(o.status))
        break
      case 'needs_attention':
        result = result.filter(o => ['pending_assignment', 'disputed'].includes(o.status))
        break
      case 'completed':
        result = result.filter(o => o.status === 'completed')
        break
      case 'cancelled':
        result = result.filter(o => o.status === 'cancelled')
        break
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(o =>
        o.order_number.toLowerCase().includes(query) ||
        o.user_name.toLowerCase().includes(query) ||
        o.service_name.toLowerCase().includes(query)
      )
    }

    return result
  }, [orders, activeTab, searchQuery])

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
            onClick={() => setActiveTab(tab.key)}
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
    </div>
  )
}

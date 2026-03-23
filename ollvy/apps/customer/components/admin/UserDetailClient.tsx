'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPaisa, formatDate } from '@/lib/utils'

interface Order {
  id: string
  order_number: string
  status: string
  paid_at: string
  total_paisa_snapshot: number
  service_name: string
}

interface User {
  id: string
  business_name?: string
  phone: string
  email?: string
  business_type?: string
  gstin?: string
  state?: string
  city?: string
  address?: string
  created_at: string
}

interface UserDetailClientProps {
  user: User
  orders: Order[]
}

export function UserDetailClient({ user, orders }: UserDetailClientProps) {
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
      <Link href="/admin/users" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back to Users
      </Link>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>{user.business_name || 'No Business Name'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{user.phone}</p>
            </div>
            {user.email && (
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            )}
            {user.business_type && (
              <div>
                <p className="text-xs text-muted-foreground">Business Type</p>
                <p className="text-sm font-medium">{user.business_type}</p>
              </div>
            )}
            {user.gstin && (
              <div>
                <p className="text-xs text-muted-foreground">GSTIN</p>
                <p className="text-sm font-medium">{user.gstin}</p>
              </div>
            )}
            {(user.city || user.state) && (
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium">
                  {[user.city, user.state].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
            {user.address && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium">{user.address}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Orders
            <span className="text-muted-foreground font-normal ml-2">
              ({orders.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No orders yet
            </p>
          ) : (
            <div className="divide-y divide-border">
              {orders.map(order => (
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
                    <p className="text-sm text-muted-foreground truncate">
                      {order.service_name}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-medium">
                      {formatPaisa(order.total_paisa_snapshot)}
                    </div>
                    <div className="text-xs text-muted-foreground">
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

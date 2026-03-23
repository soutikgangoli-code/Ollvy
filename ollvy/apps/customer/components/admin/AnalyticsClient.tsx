'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPaisa, formatDate } from '@/lib/utils'

interface AnalyticsClientProps {
  metrics: {
    usersToday: number
    usersAll: number
    ordersToday: number
    activeOrders: number
    ordersAll: number
    revenueTodayPaisa: number
    revenueAllPaisa: number
  }
  topServices: Array<{ name: string; count: number; revenue: number }>
  needsAttention: Array<{
    id: string
    order_number: string
    status: string
    service_name: string
    user_name: string
    days_active: number
  }>
  recentCompleted: Array<{
    id: string
    order_number: string
    completed_at: string
    total_paisa_snapshot: number
    service_name: string
    user_name: string
  }>
}

export function AnalyticsClient({
  metrics,
  topServices,
  needsAttention,
  recentCompleted,
}: AnalyticsClientProps) {
  const totalServiceOrders = topServices.reduce((s, t) => s + t.count, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform overview and metrics
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <MetricCard label="Users Today" value={metrics.usersToday} />
        <MetricCard label="Total Users" value={metrics.usersAll} />
        <MetricCard label="Orders Today" value={metrics.ordersToday} />
        <MetricCard label="Active Orders" value={metrics.activeOrders} />
        <MetricCard label="Total Orders" value={metrics.ordersAll} />
        <MetricCard label="Revenue Today" value={formatPaisa(metrics.revenueTodayPaisa)} />
        <MetricCard label="Total Revenue" value={formatPaisa(metrics.revenueAllPaisa)} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Services (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {topServices.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No data available
              </p>
            ) : (
              <div className="space-y-3">
                {topServices.map((service, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.count} orders - {formatPaisa(service.revenue)}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {totalServiceOrders > 0 ? Math.round((service.count / totalServiceOrders) * 100) : 0}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Needs Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            {needsAttention.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                All clear
              </p>
            ) : (
              <div className="space-y-3">
                {needsAttention.map(order => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{order.order_number}</span>
                        <Badge variant={order.status === 'disputed' ? 'destructive' : 'outline'}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {order.service_name} - {order.user_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${order.days_active > 3 ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {order.days_active}d
                      </span>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">Open</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Completed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Completed</CardTitle>
        </CardHeader>
        <CardContent>
          {recentCompleted.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No completed orders yet
            </p>
          ) : (
            <div className="divide-y divide-border">
              {recentCompleted.map(order => (
                <div key={order.id} className="py-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{order.order_number}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {order.service_name} - {order.user_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatPaisa(order.total_paisa_snapshot)}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.completed_at ? formatDate(order.completed_at) : '-'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}

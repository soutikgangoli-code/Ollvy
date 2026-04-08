'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatPaisa, formatDate, cn } from '@/lib/utils'
import { usePersistedState } from '@/lib/hooks/use-persisted-state'

interface Order {
  id: string
  orderNumber: string
  serviceName: string
  customerName: string
  customerId: string | null
  totalPaisa: number
  ollvyFeePaisa: number
  govtFeePaisa: number
  paidAt: string
  status: string
}

interface Summary {
  totalRevenue: number
  platformRevenue: number
  govtFees: number
  orderCount: number
}

interface UserRevenue {
  userId: string
  name: string
  orderCount: number
  totalSpent: number
  ollvyFees: number
  govtFees: number
}

interface ReportsClientProps {
  orders: Order[]
  summaryAll: Summary
  summaryToday: Summary
  summaryWeek: Summary
  summaryMonth: Summary
  revenueByUser: UserRevenue[]
}

type DateFilter = 'today' | 'week' | 'month' | 'all'

export function ReportsClient({
  orders,
  summaryAll,
  summaryToday,
  summaryWeek,
  summaryMonth,
  revenueByUser,
}: ReportsClientProps) {
  // Persisted filter state - survives page navigation
  const [dateFilter, setDateFilter] = usePersistedState<DateFilter>('admin-reports-date-filter', 'month')

  const currentSummary = useMemo(() => {
    switch (dateFilter) {
      case 'today': return summaryToday
      case 'week': return summaryWeek
      case 'month': return summaryMonth
      default: return summaryAll
    }
  }, [dateFilter, summaryToday, summaryWeek, summaryMonth, summaryAll])

  const filteredOrders = useMemo(() => {
    const now = new Date()
    let startDate: Date | null = null

    switch (dateFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate = null
    }

    if (!startDate) return orders
    return orders.filter(o => o.paidAt && new Date(o.paidAt) >= startDate!)
  }, [orders, dateFilter])

  const exportToCSV = () => {
    const headers = ['Order Number', 'Service', 'Customer', 'Total', 'Platform Fee', 'Govt Fee', 'Date']
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      o.serviceName,
      o.customerName,
      (o.totalPaisa / 100).toFixed(2),
      (o.ollvyFeePaisa / 100).toFixed(2),
      (o.govtFeePaisa / 100).toFixed(2),
      new Date(o.paidAt).toLocaleDateString('en-IN'),
    ])

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ollvy-revenue-report-${dateFilter}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Financial Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Revenue breakdown and financial analytics
          </p>
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          Export CSV
        </Button>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Period:</span>
        <div className="flex gap-1">
          {(['today', 'week', 'month', 'all'] as const).map((filter) => (
            <Button
              key={filter}
              variant={dateFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateFilter(filter)}
            >
              {filter === 'today' && 'Today'}
              {filter === 'week' && 'This Week'}
              {filter === 'month' && 'This Month'}
              {filter === 'all' && 'All Time'}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Revenue"
          value={formatPaisa(currentSummary.totalRevenue)}
          subtitle={`${currentSummary.orderCount} orders`}
        />
        <SummaryCard
          label="Platform Revenue"
          value={formatPaisa(currentSummary.platformRevenue)}
          subtitle="Ollvy fees"
          highlight
        />
        <SummaryCard
          label="Government Fees"
          value={formatPaisa(currentSummary.govtFees)}
          subtitle="Pass-through"
        />
        <SummaryCard
          label="Avg Order Value"
          value={formatPaisa(
            currentSummary.orderCount > 0
              ? Math.round(currentSummary.totalRevenue / currentSummary.orderCount)
              : 0
          )}
          subtitle="Per order"
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="by-order" className="space-y-4">
        <TabsList>
          <TabsTrigger value="by-order">By Order</TabsTrigger>
          <TabsTrigger value="by-user">By User</TabsTrigger>
        </TabsList>

        {/* Revenue by Order */}
        <TabsContent value="by-order">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Revenue by Order</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No orders in the selected period
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-medium">Order</th>
                        <th className="text-left py-3 px-2 font-medium">Service</th>
                        <th className="text-left py-3 px-2 font-medium">Customer</th>
                        <th className="text-right py-3 px-2 font-medium">Total</th>
                        <th className="text-right py-3 px-2 font-medium">Platform Fee</th>
                        <th className="text-right py-3 px-2 font-medium">Govt Fee</th>
                        <th className="text-right py-3 px-2 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.slice(0, 100).map((order) => (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-2">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="font-mono text-xs hover:underline"
                            >
                              {order.orderNumber}
                            </Link>
                          </td>
                          <td className="py-3 px-2 max-w-[150px] truncate">
                            {order.serviceName}
                          </td>
                          <td className="py-3 px-2 max-w-[150px] truncate">
                            {order.customerName}
                          </td>
                          <td className="py-3 px-2 text-right font-medium">
                            {formatPaisa(order.totalPaisa)}
                          </td>
                          <td className="py-3 px-2 text-right text-green-600 dark:text-green-400">
                            {formatPaisa(order.ollvyFeePaisa)}
                          </td>
                          <td className="py-3 px-2 text-right text-muted-foreground">
                            {formatPaisa(order.govtFeePaisa)}
                          </td>
                          <td className="py-3 px-2 text-right text-muted-foreground text-xs">
                            {formatDate(order.paidAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border font-medium">
                        <td className="py-3 px-2" colSpan={3}>
                          Total ({filteredOrders.length} orders)
                        </td>
                        <td className="py-3 px-2 text-right">
                          {formatPaisa(currentSummary.totalRevenue)}
                        </td>
                        <td className="py-3 px-2 text-right text-green-600 dark:text-green-400">
                          {formatPaisa(currentSummary.platformRevenue)}
                        </td>
                        <td className="py-3 px-2 text-right text-muted-foreground">
                          {formatPaisa(currentSummary.govtFees)}
                        </td>
                        <td className="py-3 px-2"></td>
                      </tr>
                    </tfoot>
                  </table>
                  {filteredOrders.length > 100 && (
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Showing first 100 orders. Export CSV for full data.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue by User */}
        <TabsContent value="by-user">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Revenue by User</CardTitle>
            </CardHeader>
            <CardContent>
              {revenueByUser.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No user data available
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-medium">Customer</th>
                        <th className="text-right py-3 px-2 font-medium">Orders</th>
                        <th className="text-right py-3 px-2 font-medium">Total Spent</th>
                        <th className="text-right py-3 px-2 font-medium">Platform Fees</th>
                        <th className="text-right py-3 px-2 font-medium">Govt Fees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueByUser.slice(0, 50).map((user) => (
                        <tr key={user.userId} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-2">
                            <Link
                              href={`/admin/users/${user.userId}`}
                              className="hover:underline"
                            >
                              {user.name}
                            </Link>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <Badge variant="outline">{user.orderCount}</Badge>
                          </td>
                          <td className="py-3 px-2 text-right font-medium">
                            {formatPaisa(user.totalSpent)}
                          </td>
                          <td className="py-3 px-2 text-right text-green-600 dark:text-green-400">
                            {formatPaisa(user.ollvyFees)}
                          </td>
                          <td className="py-3 px-2 text-right text-muted-foreground">
                            {formatPaisa(user.govtFees)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {revenueByUser.length > 50 && (
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Showing top 50 customers by revenue
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  subtitle,
  highlight,
}: {
  label: string
  value: string
  subtitle: string
  highlight?: boolean
}) {
  return (
    <Card className={cn('overflow-hidden', highlight && 'border-green-500/50 bg-green-500/5')}>
      <CardContent className="p-4">
        <div className={cn('text-xl md:text-2xl font-bold truncate', highlight ? 'text-green-600 dark:text-green-400' : 'text-foreground')}>
          {value}
        </div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </CardContent>
    </Card>
  )
}

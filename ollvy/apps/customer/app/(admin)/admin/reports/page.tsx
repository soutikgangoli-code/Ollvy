import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { redirect } from 'next/navigation'
import { ReportsClient } from '@/components/admin/ReportsClient'

export const metadata = { robots: 'noindex, nofollow' }

export default async function AdminReportsPage() {
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  // Calculate date ranges
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // Default to last 90 days for performance
  const ninetyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90).toISOString()

  // Fetch paid orders with user info (limited to recent orders for performance)
  const { data: orders, error } = await supabaseServer
    .from('orders')
    .select(`
      id,
      order_number,
      total_paisa_snapshot,
      price_govt_fees_paisa_snapshot,
      paid_at,
      status,
      service_packages (name),
      users (id, business_name, email)
    `)
    .not('paid_at', 'is', null)
    .neq('status', 'cancelled')
    .gte('paid_at', ninetyDaysAgo)
    .order('paid_at', { ascending: false })
    .limit(1000)

  if (error) {
    console.error('Error fetching orders:', error)
  }

  // Format orders for client
  const formattedOrders = (orders || []).map(order => {
    const total = order.total_paisa_snapshot || 0
    const govtFee = order.price_govt_fees_paisa_snapshot || 0
    const ollvyFee = total - govtFee

    return {
      id: order.id,
      orderNumber: order.order_number,
      serviceName: (order.service_packages as any)?.name || 'Unknown',
      customerName: (order.users as any)?.business_name || 'Unknown',
      customerId: (order.users as any)?.id || null,
      totalPaisa: total,
      ollvyFeePaisa: ollvyFee,
      govtFeePaisa: govtFee,
      paidAt: order.paid_at,
      status: order.status,
    }
  })

  // Summaries + per-user revenue are aggregated in SQL over ALL matching orders
  // (not the display-capped list above), so totals stay correct past 1000 orders.
  const emptySummary = { totalRevenue: 0, platformRevenue: 0, govtFees: 0, orderCount: 0 }
  const { data: reportData } = await supabaseServer.rpc('get_admin_reports', {
    p_since: ninetyDaysAgo,
    p_today: todayStart,
    p_week: weekStart,
    p_month: monthStart,
  })
  const report = (reportData as {
    summaryAll: typeof emptySummary
    summaryToday: typeof emptySummary
    summaryWeek: typeof emptySummary
    summaryMonth: typeof emptySummary
    revenueByUser: Array<{
      userId: string
      name: string
      orderCount: number
      totalSpent: number
      ollvyFees: number
      govtFees: number
    }>
  } | null) ?? null

  return (
    <ReportsClient
      orders={formattedOrders}
      summaryAll={report?.summaryAll ?? emptySummary}
      summaryToday={report?.summaryToday ?? emptySummary}
      summaryWeek={report?.summaryWeek ?? emptySummary}
      summaryMonth={report?.summaryMonth ?? emptySummary}
      revenueByUser={report?.revenueByUser ?? []}
    />
  )
}

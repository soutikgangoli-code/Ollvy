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

  // Fetch all paid orders with user info
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
    .order('paid_at', { ascending: false })

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

  // Calculate summary metrics
  const calculateSummary = (orders: typeof formattedOrders, startDate?: string) => {
    const filtered = startDate
      ? orders.filter(o => o.paidAt && o.paidAt >= startDate)
      : orders

    return {
      totalRevenue: filtered.reduce((sum, o) => sum + o.totalPaisa, 0),
      platformRevenue: filtered.reduce((sum, o) => sum + o.ollvyFeePaisa, 0),
      govtFees: filtered.reduce((sum, o) => sum + o.govtFeePaisa, 0),
      orderCount: filtered.length,
    }
  }

  // Calculate revenue by user
  const userRevenueMap = new Map<string, {
    userId: string
    name: string
    orderCount: number
    totalSpent: number
    ollvyFees: number
    govtFees: number
  }>()

  for (const order of formattedOrders) {
    if (!order.customerId) continue

    const existing = userRevenueMap.get(order.customerId)
    if (existing) {
      existing.orderCount += 1
      existing.totalSpent += order.totalPaisa
      existing.ollvyFees += order.ollvyFeePaisa
      existing.govtFees += order.govtFeePaisa
    } else {
      userRevenueMap.set(order.customerId, {
        userId: order.customerId,
        name: order.customerName,
        orderCount: 1,
        totalSpent: order.totalPaisa,
        ollvyFees: order.ollvyFeePaisa,
        govtFees: order.govtFeePaisa,
      })
    }
  }

  const revenueByUser = Array.from(userRevenueMap.values())
    .sort((a, b) => b.totalSpent - a.totalSpent)

  return (
    <ReportsClient
      orders={formattedOrders}
      summaryAll={calculateSummary(formattedOrders)}
      summaryToday={calculateSummary(formattedOrders, todayStart)}
      summaryWeek={calculateSummary(formattedOrders, weekStart)}
      summaryMonth={calculateSummary(formattedOrders, monthStart)}
      revenueByUser={revenueByUser}
    />
  )
}

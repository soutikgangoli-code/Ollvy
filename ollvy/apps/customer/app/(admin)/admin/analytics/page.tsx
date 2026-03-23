import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { redirect } from 'next/navigation'
import { AnalyticsClient } from '@/components/admin/AnalyticsClient'

export const metadata = { robots: 'noindex, nofollow' }

export default async function AdminAnalyticsPage() {
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  const todayStart = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    usersToday,
    usersAll,
    ordersToday,
    activeOrders,
    ordersAll,
    revenueToday,
    revenueAll,
    topServicesRaw,
    needsAttention,
    recentCompleted,
  ] = await Promise.all([
    supabaseServer.from('users').select('id', { count: 'exact', head: true })
      .gte('created_at', todayStart),
    supabaseServer.from('users').select('id', { count: 'exact', head: true }),
    supabaseServer.from('orders').select('id', { count: 'exact', head: true })
      .gte('paid_at', todayStart),
    supabaseServer.from('orders').select('id', { count: 'exact', head: true })
      .eq('status', 'in_progress'),
    supabaseServer.from('orders').select('id', { count: 'exact', head: true })
      .not('paid_at', 'is', null),
    supabaseServer.from('orders')
      .select('total_paisa_snapshot')
      .gte('paid_at', todayStart)
      .neq('status', 'cancelled'),
    supabaseServer.from('orders')
      .select('total_paisa_snapshot')
      .not('paid_at', 'is', null)
      .neq('status', 'cancelled'),
    supabaseServer.from('orders')
      .select('service_package_id, service_packages(name), total_paisa_snapshot')
      .gte('paid_at', thirtyDaysAgo)
      .neq('status', 'cancelled'),
    supabaseServer.from('orders')
      .select('id, order_number, status, paid_at, total_paisa_snapshot, service_packages(name), users(business_name)')
      .in('status', ['pending_assignment', 'disputed'])
      .order('paid_at', { ascending: false })
      .limit(10),
    supabaseServer.from('orders')
      .select('id, order_number, completed_at, total_paisa_snapshot, service_packages(name), users(business_name)')
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(20),
  ])

  const revTodayPaisa = revenueToday.data?.reduce((s, o) => s + (o.total_paisa_snapshot || 0), 0) ?? 0
  const revAllPaisa = revenueAll.data?.reduce((s, o) => s + (o.total_paisa_snapshot || 0), 0) ?? 0

  // Calculate top services
  const serviceMap = new Map<string, { name: string; count: number; revenue: number }>()
  for (const row of topServicesRaw.data || []) {
    const id = row.service_package_id
    const existing = serviceMap.get(id) ?? { name: (row.service_packages as any)?.name ?? id, count: 0, revenue: 0 }
    serviceMap.set(id, {
      name: existing.name,
      count: existing.count + 1,
      revenue: existing.revenue + (row.total_paisa_snapshot ?? 0),
    })
  }
  const topServices = Array.from(serviceMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Calculate days active for needs attention
  const needsAttentionFormatted = (needsAttention.data || []).map(order => {
    const daysActive = order.paid_at
      ? Math.floor((Date.now() - new Date(order.paid_at).getTime()) / (1000 * 60 * 60 * 24))
      : 0
    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      service_name: (order.service_packages as any)?.name || 'Unknown',
      user_name: (order.users as any)?.business_name || 'Unknown',
      days_active: daysActive,
    }
  })

  const recentCompletedFormatted = (recentCompleted.data || []).map(order => ({
    id: order.id,
    order_number: order.order_number,
    completed_at: order.completed_at,
    total_paisa_snapshot: order.total_paisa_snapshot,
    service_name: (order.service_packages as any)?.name || 'Unknown',
    user_name: (order.users as any)?.business_name || 'Unknown',
  }))

  return (
    <AnalyticsClient
      metrics={{
        usersToday: usersToday.count ?? 0,
        usersAll: usersAll.count ?? 0,
        ordersToday: ordersToday.count ?? 0,
        activeOrders: activeOrders.count ?? 0,
        ordersAll: ordersAll.count ?? 0,
        revenueTodayPaisa: revTodayPaisa,
        revenueAllPaisa: revAllPaisa,
      }}
      topServices={topServices}
      needsAttention={needsAttentionFormatted}
      recentCompleted={recentCompletedFormatted}
    />
  )
}

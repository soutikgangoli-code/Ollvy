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
    analytics,
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
    // Revenue sums + top-services grouped in SQL over all matching rows.
    supabaseServer.rpc('get_admin_analytics', { p_today: todayStart, p_thirty: thirtyDaysAgo }),
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

  const analyticsData = (analytics.data as {
    revTodayPaisa: number
    revAllPaisa: number
    topServices: Array<{ name: string; count: number; revenue: number }>
  } | null) ?? null
  const revTodayPaisa = analyticsData?.revTodayPaisa ?? 0
  const revAllPaisa = analyticsData?.revAllPaisa ?? 0
  const topServices = analyticsData?.topServices ?? []

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

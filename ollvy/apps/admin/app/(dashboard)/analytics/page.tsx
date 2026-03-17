import { createAdminSupabase } from '@/lib/supabase-server'
import AnalyticsClient from './AnalyticsClient'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const supabase = createAdminSupabase()
  const tab = searchParams.tab || 'overview'
  const period = searchParams.period || '30d'

  // Calculate date range
  const now = new Date()
  let startDate: Date
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  // Fetch overview metrics
  const { data: orderStats } = await supabase
    .from('orders')
    .select('status, total_paisa_snapshot')
    .gte('created_at', startDate.toISOString())

  const { data: retainerStats } = await supabase
    .from('retainers')
    .select('status, retainer_tiers(price_paisa)')
    .eq('status', 'active')

  const { data: professionalStats } = await supabase
    .from('professionals')
    .select('status')

  const { data: userStats } = await supabase
    .from('users')
    .select('id')
    .gte('created_at', startDate.toISOString())

  const { data: disputeStats } = await supabase
    .from('disputes')
    .select('status')
    .gte('opened_at', startDate.toISOString())

  // Calculate metrics
  const totalRevenue = orderStats?.reduce((sum, o) =>
    ['completed', 'in_progress', 'assigned'].includes(o.status) ? sum + o.total_paisa_snapshot : sum, 0
  ) || 0

  const completedOrders = orderStats?.filter(o => o.status === 'completed').length || 0
  const totalOrders = orderStats?.length || 0
  const activeRetainers = retainerStats?.filter(r => r.status === 'active').length || 0
  const mrr = retainerStats?.reduce((sum, r) => sum + ((r.retainer_tiers as any)?.price_paisa || 0), 0) || 0
  const activeProfessionals = professionalStats?.filter(p => p.status === 'approved').length || 0
  const newUsers = userStats?.length || 0
  const openDisputes = disputeStats?.filter(d => d.status === 'open').length || 0

  // Fetch daily revenue for chart
  const { data: dailyRevenue } = await supabase
    .from('orders')
    .select('created_at, total_paisa_snapshot, status')
    .gte('created_at', startDate.toISOString())
    .in('status', ['completed', 'in_progress', 'assigned'])
    .order('created_at')

  // Group by date
  const revenueByDate: Record<string, number> = {}
  dailyRevenue?.forEach(o => {
    const date = new Date(o.created_at).toISOString().split('T')[0]
    revenueByDate[date] = (revenueByDate[date] || 0) + o.total_paisa_snapshot
  })

  // Fetch service breakdown
  const { data: serviceBreakdown } = await supabase
    .from('orders')
    .select('service_packages(name), total_paisa_snapshot, status')
    .gte('created_at', startDate.toISOString())
    .in('status', ['completed', 'in_progress', 'assigned'])

  const revenueByService: Record<string, number> = {}
  serviceBreakdown?.forEach(o => {
    const name = (o.service_packages as any)?.name || 'Unknown'
    revenueByService[name] = (revenueByService[name] || 0) + o.total_paisa_snapshot
  })

  const metrics = {
    totalRevenue,
    completedOrders,
    totalOrders,
    activeRetainers,
    mrr,
    activeProfessionals,
    newUsers,
    openDisputes,
    revenueByDate,
    revenueByService,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-body-text">Analytics</h1>
        <p className="text-muted-text mt-1">Business intelligence and metrics</p>
      </div>

      <AnalyticsClient
        metrics={metrics}
        currentTab={tab}
        currentPeriod={period}
      />
    </div>
  )
}

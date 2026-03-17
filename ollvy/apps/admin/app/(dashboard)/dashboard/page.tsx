import { createAdminSupabase } from '@/lib/supabase-server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface KPICardProps {
  title: string
  value: string
  subtitle?: string
  trend?: number
  href?: string
  variant?: 'default' | 'warning' | 'danger'
}

function KPICard({ title, value, subtitle, trend, href, variant = 'default' }: KPICardProps) {
  const content = (
    <div className={`
      card p-6
      ${variant === 'warning' ? 'border-yellow-300 bg-yellow-50' : ''}
      ${variant === 'danger' ? 'border-red-300 bg-red-50' : ''}
      ${href ? 'hover:border-navy cursor-pointer transition-colors' : ''}
    `}>
      <p className="text-sm font-medium text-muted-text">{title}</p>
      <p className="text-3xl font-bold text-body-text mt-2">{value}</p>
      {subtitle && (
        <p className="text-sm text-muted-text mt-1">{subtitle}</p>
      )}
      {trend !== undefined && (
        <div className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '+' : ''}{trend}% vs last month
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

async function getAnalyticsCache(key: string) {
  const supabase = createAdminSupabase()
  const { data } = await supabase
    .from('analytics_cache')
    .select('value')
    .eq('key', key)
    .single()
  return data?.value
}

async function getActiveOrdersCount() {
  const supabase = createAdminSupabase()
  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .in('status', ['paid', 'assigned', 'waitlisted', 'in_progress'])
  return count || 0
}

async function getOpenDisputesCount() {
  const supabase = createAdminSupabase()
  const { count } = await supabase
    .from('disputes')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'open')
  return count || 0
}

async function getSLABreachesToday() {
  const supabase = createAdminSupabase()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('sla_alerts')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', today.toISOString())
  return count || 0
}

async function getCapacityAlerts() {
  const supabase = createAdminSupabase()

  // Get professionals at > 80% capacity
  const { data: professionals } = await supabase
    .from('professional_availability')
    .select(`
      professional_id,
      current_active_orders,
      max_concurrent_orders,
      professionals!inner (display_name, city)
    `)
    .gt('current_active_orders', 0)

  const alerts = professionals?.filter(p => {
    const utilization = p.current_active_orders / (p.max_concurrent_orders || 5)
    return utilization > 0.8
  }) || []

  return alerts.length
}

async function getMRR() {
  // Try cache first
  const cached = await getAnalyticsCache('mrr_current')
  if (cached) return cached as number

  // Calculate from DB
  const supabase = createAdminSupabase()

  // Retainer MRR
  const { data: retainers } = await supabase
    .from('retainer_subscriptions')
    .select('monthly_price_paisa')
    .eq('status', 'active')

  const retainerMRR = retainers?.reduce((sum, r) => sum + (r.monthly_price_paisa || 0), 0) || 0

  // Pro subscriptions MRR (Rs 999 per month)
  const { count: proCount } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('subscription_tier', 'pro')

  const proMRR = (proCount || 0) * 99900 // 999 rupees in paisa

  return retainerMRR + proMRR
}

function formatCurrency(paisa: number): string {
  const rupees = paisa / 100
  if (rupees >= 100000) {
    return `Rs ${(rupees / 100000).toFixed(1)}L`
  }
  if (rupees >= 1000) {
    return `Rs ${(rupees / 1000).toFixed(1)}K`
  }
  return `Rs ${rupees.toLocaleString('en-IN')}`
}

export default async function DashboardPage() {
  const [mrr, activeOrders, openDisputes, slaBreaches, capacityAlerts] = await Promise.all([
    getMRR(),
    getActiveOrdersCount(),
    getOpenDisputesCount(),
    getSLABreachesToday(),
    getCapacityAlerts(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-body-text">Dashboard</h1>
        <p className="text-muted-text mt-1">Welcome to Ollvy Admin</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <KPICard
          title="Monthly Recurring Revenue"
          value={formatCurrency(mrr)}
          subtitle="Retainers + Pro subscriptions"
          href="/analytics"
        />

        <KPICard
          title="Active Orders"
          value={activeOrders.toString()}
          subtitle="In progress or assigned"
          href="/orders?status=in_progress,assigned"
        />

        <KPICard
          title="Open Disputes"
          value={openDisputes.toString()}
          subtitle="Require resolution"
          href="/disputes"
          variant={openDisputes > 0 ? 'danger' : 'default'}
        />

        <KPICard
          title="SLA Breaches Today"
          value={slaBreaches.toString()}
          subtitle="Orders past deadline"
          href="/sla"
          variant={slaBreaches > 0 ? 'warning' : 'default'}
        />

        <KPICard
          title="Capacity Alerts"
          value={capacityAlerts.toString()}
          subtitle="Professionals at >80% capacity"
          href="/capacity"
          variant={capacityAlerts > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-body-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/professionals?status=pending_review"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
          >
            <p className="font-medium text-body-text">Pending Applications</p>
            <p className="text-sm text-muted-text mt-1">Review professionals</p>
          </Link>

          <Link
            href="/quotes"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
          >
            <p className="font-medium text-body-text">Quote Requests</p>
            <p className="text-sm text-muted-text mt-1">Confirm pricing</p>
          </Link>

          <Link
            href="/services/builder"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
          >
            <p className="font-medium text-body-text">New Service</p>
            <p className="text-sm text-muted-text mt-1">Create service package</p>
          </Link>

          <Link
            href="/payouts"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
          >
            <p className="font-medium text-body-text">Process Payouts</p>
            <p className="text-sm text-muted-text mt-1">Trigger payout batch</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-body-text mb-4">Recent Activity</h2>
        <p className="text-muted-text">Activity feed coming soon...</p>
      </div>
    </div>
  )
}

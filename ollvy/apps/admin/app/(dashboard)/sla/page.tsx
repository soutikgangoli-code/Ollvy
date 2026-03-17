import { createAdminSupabase } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

interface SLAAlert {
  id: string
  order_id: string
  professional_id: string
  stage_key: string
  breach_date: string
  strike_applied: boolean
  orders: {
    order_number: string
    service_packages: {
      name: string
    } | null
    users: {
      city: string
    } | null
  } | null
  professionals: {
    display_name: string
  } | null
}

async function getSLAStats(supabase: ReturnType<typeof createAdminSupabase>) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    { count: todayBreaches },
    { count: weekBreaches },
    { count: monthBreaches },
    { count: totalOrders },
    { count: onTimeOrders },
  ] = await Promise.all([
    supabase
      .from('sla_alerts')
      .select('id', { count: 'exact', head: true })
      .gte('breach_date', today.toISOString()),
    supabase
      .from('sla_alerts')
      .select('id', { count: 'exact', head: true })
      .gte('breach_date', weekAgo.toISOString()),
    supabase
      .from('sla_alerts')
      .select('id', { count: 'exact', head: true })
      .gte('breach_date', monthAgo.toISOString()),
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('completed_at', monthAgo.toISOString()),
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed')
      .eq('sla_breached', false)
      .gte('completed_at', monthAgo.toISOString()),
  ])

  const complianceRate = totalOrders && totalOrders > 0
    ? Math.round((onTimeOrders || 0) / totalOrders * 100)
    : 100

  return {
    todayBreaches: todayBreaches || 0,
    weekBreaches: weekBreaches || 0,
    monthBreaches: monthBreaches || 0,
    complianceRate,
  }
}

async function getRecentBreaches(supabase: ReturnType<typeof createAdminSupabase>) {
  const { data } = await supabase
    .from('sla_alerts')
    .select(`
      id,
      order_id,
      professional_id,
      stage_key,
      breach_date,
      strike_applied,
      orders (
        order_number,
        service_packages (name),
        users (city)
      ),
      professionals (display_name)
    `)
    .order('breach_date', { ascending: false })
    .limit(50)

  return data || []
}

async function getBreachesByProfessional(supabase: ReturnType<typeof createAdminSupabase>) {
  const monthAgo = new Date()
  monthAgo.setDate(monthAgo.getDate() - 30)

  const { data } = await supabase
    .from('sla_alerts')
    .select(`
      professional_id,
      professionals (display_name, strike_count)
    `)
    .gte('breach_date', monthAgo.toISOString())

  // Group by professional
  const byProfessional: Record<string, { name: string; count: number; strikeCount: number }> = {}
  data?.forEach((alert: any) => {
    const profId = alert.professional_id
    if (!byProfessional[profId]) {
      byProfessional[profId] = {
        name: alert.professionals?.display_name || 'Unknown',
        count: 0,
        strikeCount: alert.professionals?.strike_count || 0,
      }
    }
    byProfessional[profId].count++
  })

  return Object.entries(byProfessional)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

async function getBreachesByService(supabase: ReturnType<typeof createAdminSupabase>) {
  const monthAgo = new Date()
  monthAgo.setDate(monthAgo.getDate() - 30)

  const { data } = await supabase
    .from('sla_alerts')
    .select(`
      orders!inner (
        service_package_id,
        service_packages (name)
      )
    `)
    .gte('breach_date', monthAgo.toISOString())

  // Group by service
  const byService: Record<string, { name: string; count: number }> = {}
  data?.forEach((alert: any) => {
    const serviceId = alert.orders?.service_package_id
    const serviceName = alert.orders?.service_packages?.name || 'Unknown'
    if (!byService[serviceId]) {
      byService[serviceId] = { name: serviceName, count: 0 }
    }
    byService[serviceId].count++
  })

  return Object.entries(byService)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

export default async function SLAPage() {
  const supabase = createAdminSupabase()

  const [stats, recentBreaches, byProfessional, byService] = await Promise.all([
    getSLAStats(supabase),
    getRecentBreaches(supabase),
    getBreachesByProfessional(supabase),
    getBreachesByService(supabase),
  ])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-body-text">SLA Dashboard</h1>
        <p className="text-muted-text mt-1">Monitor service level agreement compliance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-muted-text">SLA Compliance (30d)</p>
          <p className={`text-3xl font-bold ${stats.complianceRate >= 95 ? 'text-green-600' : stats.complianceRate >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
            {stats.complianceRate}%
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-text">Today's Breaches</p>
          <p className={`text-3xl font-bold ${stats.todayBreaches > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {stats.todayBreaches}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-text">This Week</p>
          <p className="text-3xl font-bold text-body-text">{stats.weekBreaches}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-text">This Month</p>
          <p className="text-3xl font-bold text-body-text">{stats.monthBreaches}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Professional */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Top Breaches by Professional (30d)</h2>
          {byProfessional.length > 0 ? (
            <div className="space-y-3">
              {byProfessional.map((prof) => (
                <div key={prof.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-body-text">{prof.name}</p>
                    <p className="text-xs text-muted-text">
                      Strikes: <span className={prof.strikeCount >= 3 ? 'text-red-600' : prof.strikeCount >= 1 ? 'text-amber-600' : ''}>{prof.strikeCount}</span>
                    </p>
                  </div>
                  <span className="text-sm font-medium text-red-600">{prof.count} breaches</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-text text-sm">No breaches recorded</p>
          )}
        </div>

        {/* By Service */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">Top Breaches by Service (30d)</h2>
          {byService.length > 0 ? (
            <div className="space-y-3">
              {byService.map((svc) => (
                <div key={svc.id} className="flex items-center justify-between">
                  <p className="font-medium text-body-text">{svc.name}</p>
                  <span className="text-sm font-medium text-red-600">{svc.count} breaches</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-text text-sm">No breaches recorded</p>
          )}
        </div>
      </div>

      {/* Recent Breaches Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-body-text">Recent SLA Breaches</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Order
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Service
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Professional
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Stage
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Breach Date
                </th>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3">
                  Strike
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentBreaches.map((breach: any) => (
                <tr key={breach.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <a href={`/orders/${breach.order_id}`} className="text-navy hover:underline">
                      {breach.orders?.order_number || breach.order_id.slice(0, 8)}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-body-text">
                    {breach.orders?.service_packages?.name || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-sm text-body-text">
                    <a href={`/professionals/${breach.professional_id}`} className="hover:underline">
                      {breach.professionals?.display_name || 'Unknown'}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-text">
                    {breach.stage_key?.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-text">
                    {formatDate(breach.breach_date)}
                  </td>
                  <td className="px-4 py-3">
                    {breach.strike_applied ? (
                      <span className="badge badge-suspended">Applied</span>
                    ) : (
                      <span className="badge">Not Applied</span>
                    )}
                  </td>
                </tr>
              ))}
              {recentBreaches.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-text">
                    No SLA breaches recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { createAdminSupabase } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

const CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Gurgaon', 'Noida',
]

const SERVICE_CATEGORIES = [
  'Registrations',
  'Tax Filings',
  'Monthly Compliance',
  'Legal',
  'Payroll',
  'Licensing',
]

interface CapacityData {
  city: string
  category: string
  professionalCount: number
  totalCapacity: number
  activeOrders: number
  utilization: number
}

async function getCapacityData(supabase: ReturnType<typeof createAdminSupabase>) {
  // Get professional availability by city
  const { data: availability } = await supabase
    .from('professional_availability')
    .select(`
      city,
      current_active_orders,
      max_concurrent_orders,
      professionals!inner (
        id,
        status,
        profession_type,
        service_areas
      )
    `)
    .eq('is_available', true)
    .eq('professionals.status', 'approved')

  // Build capacity matrix
  const capacityMatrix: Record<string, Record<string, CapacityData>> = {}

  CITIES.forEach(city => {
    capacityMatrix[city] = {}
    SERVICE_CATEGORIES.forEach(category => {
      capacityMatrix[city][category] = {
        city,
        category,
        professionalCount: 0,
        totalCapacity: 0,
        activeOrders: 0,
        utilization: 0,
      }
    })
  })

  // Map profession types to categories (simplified)
  const professionToCategory: Record<string, string[]> = {
    'ca': ['Tax Filings', 'Monthly Compliance', 'Registrations'],
    'cs': ['Registrations', 'Legal'],
    'lawyer': ['Legal'],
    'tax_professional': ['Tax Filings', 'Monthly Compliance'],
    'payroll_specialist': ['Payroll'],
    'licensing_consultant': ['Licensing', 'Registrations'],
  }

  availability?.forEach((avail: any) => {
    const city = avail.city
    const prof = avail.professionals
    if (!city || !prof || !capacityMatrix[city]) return

    const profType = prof.profession_type?.toLowerCase() || ''
    const categories = professionToCategory[profType] || []

    categories.forEach(category => {
      if (capacityMatrix[city][category]) {
        capacityMatrix[city][category].professionalCount++
        capacityMatrix[city][category].totalCapacity += avail.max_concurrent_orders || 5
        capacityMatrix[city][category].activeOrders += avail.current_active_orders || 0
      }
    })
  })

  // Calculate utilization
  Object.values(capacityMatrix).forEach(cityData => {
    Object.values(cityData).forEach(data => {
      if (data.totalCapacity > 0) {
        data.utilization = Math.round((data.activeOrders / data.totalCapacity) * 100)
      }
    })
  })

  return capacityMatrix
}

async function getCapacityAlerts(supabase: ReturnType<typeof createAdminSupabase>) {
  // Get professionals at > 80% capacity
  const { data } = await supabase
    .from('professional_availability')
    .select(`
      city,
      current_active_orders,
      max_concurrent_orders,
      professionals!inner (
        id,
        display_name,
        profession_type
      )
    `)
    .eq('is_available', true)
    .eq('professionals.status', 'approved')

  const alerts = data?.filter((avail: any) => {
    const utilization = (avail.current_active_orders || 0) / (avail.max_concurrent_orders || 5)
    return utilization >= 0.8
  }).map((avail: any) => ({
    professionalId: avail.professionals?.id,
    name: avail.professionals?.display_name,
    city: avail.city,
    professionType: avail.professionals?.profession_type,
    activeOrders: avail.current_active_orders,
    maxOrders: avail.max_concurrent_orders,
    utilization: Math.round(((avail.current_active_orders || 0) / (avail.max_concurrent_orders || 5)) * 100),
  })) || []

  return alerts.sort((a, b) => b.utilization - a.utilization)
}

function getUtilizationColor(utilization: number): string {
  if (utilization === 0) return 'bg-gray-100 text-gray-400'
  if (utilization < 50) return 'bg-green-100 text-green-700'
  if (utilization < 80) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

export default async function CapacityPage() {
  const supabase = createAdminSupabase()

  const [capacityMatrix, alerts] = await Promise.all([
    getCapacityData(supabase),
    getCapacityAlerts(supabase),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-body-text">Capacity Heatmap</h1>
        <p className="text-muted-text mt-1">Professional capacity by city and service category</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="card p-4 border-amber-300 bg-amber-50">
          <h2 className="text-lg font-semibold text-amber-800 mb-3">
            Capacity Alerts ({alerts.length} professionals at &gt;80%)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {alerts.slice(0, 6).map((alert) => (
              <div key={alert.professionalId} className="bg-white p-3 rounded-lg border border-amber-200">
                <div className="font-medium text-body-text">{alert.name}</div>
                <div className="text-sm text-muted-text">{alert.city} • {alert.professionType}</div>
                <div className="text-sm mt-1">
                  <span className="text-red-600 font-medium">{alert.utilization}%</span> ({alert.activeOrders}/{alert.maxOrders} orders)
                </div>
              </div>
            ))}
          </div>
          {alerts.length > 6 && (
            <p className="text-sm text-amber-700 mt-3">And {alerts.length - 6} more...</p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-text">Utilization:</span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-green-100"></span> &lt;50%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-amber-100"></span> 50-80%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-red-100"></span> &gt;80%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-gray-100"></span> No professionals
        </span>
      </div>

      {/* Heatmap Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3 sticky left-0 bg-gray-50">
                  City
                </th>
                {SERVICE_CATEGORIES.map((cat) => (
                  <th key={cat} className="text-center text-xs font-medium text-muted-text uppercase tracking-wider px-4 py-3 min-w-[120px]">
                    {cat}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CITIES.map((city) => (
                <tr key={city} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-body-text sticky left-0 bg-white">
                    {city}
                  </td>
                  {SERVICE_CATEGORIES.map((category) => {
                    const data = capacityMatrix[city]?.[category]
                    return (
                      <td key={category} className="px-4 py-3">
                        <div className={`text-center rounded-lg p-2 ${getUtilizationColor(data?.utilization || 0)}`}>
                          <div className="font-medium">{data?.utilization || 0}%</div>
                          <div className="text-xs">
                            {data?.professionalCount || 0} pros • {data?.activeOrders || 0}/{data?.totalCapacity || 0}
                          </div>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-sm text-muted-text">Total Active Professionals</p>
          <p className="text-2xl font-bold text-body-text">
            {Object.values(capacityMatrix).reduce((sum, cityData) => {
              return sum + Math.max(...Object.values(cityData).map(d => d.professionalCount))
            }, 0)}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-text">Cities with &gt;80% Utilization</p>
          <p className="text-2xl font-bold text-red-600">
            {Object.entries(capacityMatrix).filter(([_, cityData]) =>
              Object.values(cityData).some(d => d.utilization > 80)
            ).length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-text">Categories Needing Professionals</p>
          <p className="text-2xl font-bold text-amber-600">
            {Object.values(capacityMatrix).reduce((sum, cityData) => {
              return sum + Object.values(cityData).filter(d => d.professionalCount === 0).length
            }, 0)}
          </p>
        </div>
      </div>
    </div>
  )
}

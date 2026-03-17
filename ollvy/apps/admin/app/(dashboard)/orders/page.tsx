import { createAdminSupabase } from '@/lib/supabase-server'
import OrdersTable from './OrdersTable'

export const dynamic = 'force-dynamic'

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const supabase = createAdminSupabase()
  const page = parseInt(searchParams.page || '1')
  const perPage = 50
  const offset = (page - 1) * perPage

  // Build query
  let query = supabase
    .from('orders')
    .select(`
      id,
      status,
      total_paisa_snapshot,
      created_at,
      assigned_at,
      service_packages!inner (id, name, sla_working_days),
      users!inner (id, city),
      professionals (id, display_name)
    `, { count: 'exact' })
    .is('retainer_subscription_id', null) // Exclude retainer child orders
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  // Apply filters
  if (searchParams.status) {
    const statuses = searchParams.status.split(',')
    query = query.in('status', statuses)
  }

  if (searchParams.service) {
    query = query.eq('service_package_id', searchParams.service)
  }

  if (searchParams.city) {
    query = query.eq('users.city', searchParams.city)
  }

  if (searchParams.professional) {
    query = query.eq('professional_id', searchParams.professional)
  }

  if (searchParams.from) {
    query = query.gte('created_at', searchParams.from)
  }

  if (searchParams.to) {
    query = query.lte('created_at', searchParams.to)
  }

  const { data: orders, count } = await query

  // Get filter options
  const [
    { data: services },
    { data: cities },
    { data: professionals },
  ] = await Promise.all([
    supabase.from('service_packages').select('id, name').eq('is_active', true).order('name'),
    supabase.from('users').select('city').not('city', 'is', null),
    supabase.from('professionals').select('id, display_name').eq('status', 'approved').order('display_name'),
  ])

  // Get unique cities
  const uniqueCities = [...new Set(cities?.map(c => c.city).filter(Boolean))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-body-text">Orders</h1>
        <p className="text-muted-text mt-1">Manage all orders</p>
      </div>

      <OrdersTable
        orders={(orders as any) || []}
        totalCount={count || 0}
        currentPage={page}
        perPage={perPage}
        services={services || []}
        cities={uniqueCities}
        professionals={(professionals as any) || []}
        searchParams={searchParams}
      />
    </div>
  )
}

import { createAdminSupabase } from '@/lib/supabase-server'
import RetainersTable from './RetainersTable'

export const dynamic = 'force-dynamic'

export default async function RetainersPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const supabase = createAdminSupabase()
  const page = parseInt(searchParams.page || '1')
  const perPage = 50
  const offset = (page - 1) * perPage

  let query = supabase
    .from('retainers')
    .select(`
      id,
      status,
      billing_cycle,
      next_billing_date,
      current_period_start,
      current_period_end,
      razorpay_subscription_id,
      created_at,
      users!inner (id, city, business_type, phone),
      retainer_tiers!inner (id, name, hours_per_month, price_paisa),
      professionals (id, display_name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (searchParams.status) {
    const statuses = searchParams.status.split(',')
    query = query.in('status', statuses)
  }

  if (searchParams.billing_cycle) {
    query = query.eq('billing_cycle', searchParams.billing_cycle)
  }

  const { data: retainers, count } = await query

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-body-text">Retainers</h1>
          <p className="text-muted-text mt-1">Manage retainer subscriptions</p>
        </div>
      </div>

      <RetainersTable
        retainers={(retainers as any) || []}
        totalCount={count || 0}
        currentPage={page}
        perPage={perPage}
        searchParams={searchParams}
      />
    </div>
  )
}

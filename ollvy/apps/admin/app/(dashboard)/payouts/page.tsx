import { createAdminSupabase } from '@/lib/supabase-server'
import PayoutsClient from './PayoutsClient'

export const dynamic = 'force-dynamic'

export default async function PayoutsPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const supabase = createAdminSupabase()
  const page = parseInt(searchParams.page || '1')
  const perPage = 50
  const offset = (page - 1) * perPage
  const status = searchParams.status

  let query = supabase
    .from('payouts')
    .select(`
      id,
      amount_paisa,
      status,
      utr,
      created_at,
      processed_at,
      professionals (id, display_name, upi_id),
      orders (id, service_packages (name))
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (status) {
    query = query.eq('status', status)
  }

  const { data: payouts, count } = await query

  // Get payout summary
  const { data: pendingSum } = await supabase
    .from('payouts')
    .select('amount_paisa')
    .eq('status', 'pending')

  const { data: readySum } = await supabase
    .from('payouts')
    .select('amount_paisa')
    .eq('status', 'ready')

  const pendingTotal = pendingSum?.reduce((sum, p) => sum + p.amount_paisa, 0) || 0
  const readyTotal = readySum?.reduce((sum, p) => sum + p.amount_paisa, 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-body-text">Payouts</h1>
        <p className="text-muted-text mt-1">Manage professional payouts</p>
      </div>

      <PayoutsClient
        payouts={(payouts as any) || []}
        totalCount={count || 0}
        currentPage={page}
        perPage={perPage}
        pendingTotal={pendingTotal}
        readyTotal={readyTotal}
        searchParams={searchParams}
      />
    </div>
  )
}

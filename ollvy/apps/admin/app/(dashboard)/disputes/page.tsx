import { createAdminSupabase } from '@/lib/supabase-server'
import DisputesTable from './DisputesTable'

export const dynamic = 'force-dynamic'

export default async function DisputesPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const supabase = createAdminSupabase()
  const page = parseInt(searchParams.page || '1')
  const perPage = 50
  const offset = (page - 1) * perPage

  let query = supabase
    .from('disputes')
    .select(`
      id,
      reason,
      status,
      resolution,
      opened_at,
      resolved_at,
      orders!inner (
        id,
        total_paisa_snapshot,
        service_packages (name),
        users (id, city),
        professionals (id, display_name)
      )
    `, { count: 'exact' })
    .order('opened_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (searchParams.status) {
    const statuses = searchParams.status.split(',')
    query = query.in('status', statuses)
  }

  const { data: disputes, count } = await query

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-body-text">Disputes</h1>
          <p className="text-muted-text mt-1">Review and resolve order disputes</p>
        </div>
      </div>

      <DisputesTable
        disputes={(disputes as any) || []}
        totalCount={count || 0}
        currentPage={page}
        perPage={perPage}
        searchParams={searchParams}
      />
    </div>
  )
}

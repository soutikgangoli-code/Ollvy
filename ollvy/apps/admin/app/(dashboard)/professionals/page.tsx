import { createAdminSupabase } from '@/lib/supabase-server'
import ProfessionalsTable from './ProfessionalsTable'

export const dynamic = 'force-dynamic'

export default async function ProfessionalsPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const supabase = createAdminSupabase()
  const page = parseInt(searchParams.page || '1')
  const perPage = 50
  const offset = (page - 1) * perPage

  let query = supabase
    .from('professionals')
    .select(`
      id,
      display_name,
      city,
      profession_type,
      status,
      is_available,
      strike_count,
      avg_rating,
      created_at,
      professional_availability (current_active_orders)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (searchParams.status) {
    const statuses = searchParams.status.split(',')
    query = query.in('status', statuses)
  }

  if (searchParams.city) {
    query = query.eq('city', searchParams.city)
  }

  if (searchParams.profession_type) {
    query = query.eq('profession_type', searchParams.profession_type)
  }

  const { data: professionals, count } = await query

  // Get filter options
  const { data: cities } = await supabase
    .from('professionals')
    .select('city')
    .not('city', 'is', null)

  const uniqueCities = [...new Set(cities?.map(c => c.city).filter(Boolean))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-body-text">Professionals</h1>
          <p className="text-muted-text mt-1">Manage professional accounts</p>
        </div>
      </div>

      <ProfessionalsTable
        professionals={professionals || []}
        totalCount={count || 0}
        currentPage={page}
        perPage={perPage}
        cities={uniqueCities}
        searchParams={searchParams}
      />
    </div>
  )
}

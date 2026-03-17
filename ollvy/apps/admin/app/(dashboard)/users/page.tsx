import { createAdminSupabase } from '@/lib/supabase-server'
import UsersTable from './UsersTable'

export const dynamic = 'force-dynamic'

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const supabase = createAdminSupabase()
  const page = parseInt(searchParams.page || '1')
  const perPage = 50
  const offset = (page - 1) * perPage

  let query = supabase
    .from('users')
    .select(`
      id,
      phone,
      city,
      business_type,
      is_flagged,
      is_restricted,
      created_at
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (searchParams.city) {
    query = query.eq('city', searchParams.city)
  }

  if (searchParams.business_type) {
    query = query.eq('business_type', searchParams.business_type)
  }

  if (searchParams.flagged === 'true') {
    query = query.eq('is_flagged', true)
  }

  if (searchParams.restricted === 'true') {
    query = query.eq('is_restricted', true)
  }

  if (searchParams.search) {
    query = query.ilike('phone', `%${searchParams.search}%`)
  }

  const { data: users, count } = await query

  // Get filter options
  const { data: cities } = await supabase
    .from('users')
    .select('city')
    .not('city', 'is', null)

  const { data: businessTypes } = await supabase
    .from('users')
    .select('business_type')
    .not('business_type', 'is', null)

  const uniqueCities = [...new Set(cities?.map(c => c.city).filter(Boolean))]
  const uniqueBusinessTypes = [...new Set(businessTypes?.map(b => b.business_type).filter(Boolean))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-body-text">Users</h1>
          <p className="text-muted-text mt-1">Manage user accounts</p>
        </div>
      </div>

      <UsersTable
        users={users || []}
        totalCount={count || 0}
        currentPage={page}
        perPage={perPage}
        cities={uniqueCities}
        businessTypes={uniqueBusinessTypes}
        searchParams={searchParams}
      />
    </div>
  )
}

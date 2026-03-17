import { createAdminSupabase } from '@/lib/supabase-server'
import ApplicationsTable from './ApplicationsTable'

export const dynamic = 'force-dynamic'

interface SearchParams {
  page?: string
  status?: string
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createAdminSupabase()
  const page = parseInt(searchParams.page || '1')
  const perPage = 50
  const offset = (page - 1) * perPage

  // Build query
  let query = supabase
    .from('professional_applications')
    .select(`
      id,
      full_name,
      phone,
      email,
      city,
      profession_type,
      years_experience,
      status,
      submitted_at,
      reviewed_at,
      reviewed_by,
      rejection_reason,
      reapply_after_date
    `, { count: 'exact' })
    .order('submitted_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  // Apply filters
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  } else {
    // Default: show submitted only
    query = query.eq('status', 'submitted')
  }

  const { data: applications, count } = await query

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-body-text">Professional Applications</h1>
          <p className="text-muted-text mt-1">Review pending professional applications</p>
        </div>
      </div>

      <ApplicationsTable
        applications={applications || []}
        totalCount={count || 0}
        currentPage={page}
        perPage={perPage}
        currentStatus={searchParams.status || 'submitted'}
      />
    </div>
  )
}

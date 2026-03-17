import { createAdminSupabase } from '@/lib/supabase-server'
import QuotesTable from './QuotesTable'

export const dynamic = 'force-dynamic'

interface SearchParams {
  page?: string
  status?: string
}

export default async function QuotesPage({
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
    .from('quote_requests')
    .select(`
      id,
      user_id,
      service_package_id,
      status,
      created_at,
      expires_at,
      confirmed_at,
      confirmed_price_paisa,
      notes,
      users (
        id,
        phone,
        city,
        business_type
      ),
      service_packages (
        id,
        name,
        slug
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  // Apply filters
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  } else {
    // Default: show pending quotes
    query = query.eq('status', 'pending')
  }

  const { data: quotes, count } = await query

  // Calculate age for pending quotes and transform data
  const quotesWithAge = quotes?.map(quote => {
    const createdAt = new Date(quote.created_at)
    const now = new Date()
    const ageHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60))
    const ageText = ageHours < 24
      ? `${ageHours}h ago`
      : `${Math.floor(ageHours / 24)}d ${ageHours % 24}h ago`
    const isUrgent = ageHours > 24 // More than 24h old
    // Transform Supabase array responses to single objects
    return {
      ...quote,
      users: Array.isArray(quote.users) ? quote.users[0] || null : quote.users,
      service_packages: Array.isArray(quote.service_packages) ? quote.service_packages[0] || null : quote.service_packages,
      ageText,
      isUrgent
    }
  }) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-body-text">Quote Requests</h1>
          <p className="text-muted-text mt-1">Confirm pricing for custom quote services</p>
        </div>
      </div>

      <QuotesTable
        quotes={quotesWithAge}
        totalCount={count || 0}
        currentPage={page}
        perPage={perPage}
        currentStatus={searchParams.status || 'pending'}
      />
    </div>
  )
}

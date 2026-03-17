import { createAdminSupabase } from '@/lib/supabase-server'
import InvoicesTable from './InvoicesTable'

export const dynamic = 'force-dynamic'

interface SearchParams {
  page?: string
  status?: string
  from?: string
  to?: string
}

export default async function InvoicesPage({
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
    .from('invoices')
    .select(`
      id,
      invoice_number,
      order_id,
      user_id,
      total_paisa,
      cgst_paisa,
      sgst_paisa,
      igst_paisa,
      status,
      created_at,
      pdf_path,
      orders (
        order_number,
        service_packages (name)
      ),
      users (
        phone,
        city,
        business_name
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  // Apply filters
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  if (searchParams.from) {
    query = query.gte('created_at', searchParams.from)
  }

  if (searchParams.to) {
    query = query.lte('created_at', searchParams.to)
  }

  const { data: invoices, count } = await query

  // Transform data to match expected types (Supabase returns arrays for relations)
  const transformedInvoices = invoices?.map(invoice => ({
    ...invoice,
    orders: Array.isArray(invoice.orders) ? invoice.orders[0] || null : invoice.orders,
    users: Array.isArray(invoice.users) ? invoice.users[0] || null : invoice.users,
  })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-body-text">Invoices</h1>
        <p className="text-muted-text mt-1">View and manage all invoices</p>
      </div>

      <InvoicesTable
        invoices={transformedInvoices as any}
        totalCount={count || 0}
        currentPage={page}
        perPage={perPage}
        searchParams={searchParams}
      />
    </div>
  )
}

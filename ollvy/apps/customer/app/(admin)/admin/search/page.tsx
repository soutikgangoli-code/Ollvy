import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { SearchClient } from '@/components/admin/SearchClient'
import { redirect } from 'next/navigation'

export const metadata = { robots: 'noindex, nofollow' }

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string; pending?: string }>
}

export default async function AdminSearchPage({ searchParams }: PageProps) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  const params = await searchParams
  const q = params?.q ?? ''
  const statusFilter = params?.status ?? null
  const pendingFilter = params?.pending ?? null

  // Non-super_admin can only search their own assigned orders
  const assignedFilter = adminUser.role !== 'super_admin' ? adminUser.id : null

  // Use RPC to search orders
  const { data: results, error } = await supabaseServer.rpc('search_orders', {
    search_query: q,
    status_filter: statusFilter,
    pending_filter: pendingFilter,
    assigned_admin_id_filter: assignedFilter,
  })

  if (error) {
    console.error('Search error:', error)
  }

  return (
    <SearchClient
      results={results || []}
      query={q}
      statusFilter={statusFilter}
      pendingFilter={pendingFilter}
    />
  )
}

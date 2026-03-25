import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { SearchClient } from '@/components/admin/SearchClient'
import { redirect } from 'next/navigation'

export const metadata = { robots: 'noindex, nofollow' }

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function AdminSearchPage({ searchParams }: PageProps) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) redirect('/admin/login')

  const params = await searchParams
  const q = params?.q ?? ''

  // Non-super_admin can only search their own assigned orders
  const assignedFilter = adminUser.role !== 'super_admin' ? adminUser.id : null

  // Use unified RPC to search orders and users
  const { data: results, error } = await supabaseServer.rpc('search_admin_unified', {
    search_query: q,
    assigned_admin_id_filter: assignedFilter,
  })

  if (error) {
    console.error('Search error:', error)
  }

  return (
    <SearchClient
      results={results || []}
      query={q}
    />
  )
}

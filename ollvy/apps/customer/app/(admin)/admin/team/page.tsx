import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { redirect } from 'next/navigation'
import { TeamClient } from '@/components/admin/TeamClient'

export const metadata = { robots: 'noindex, nofollow' }

export default async function AdminTeamPage() {
  const adminUser = await getAdminUser()

  // Only super_admin can access this page
  if (adminUser.role !== 'super_admin') {
    redirect('/admin/queue')
  }

  if (!supabaseServer) redirect('/admin/login')

  const { data: teamMembers } = await supabaseServer
    .from('admin_users')
    .select('id, name, email, role, is_active, last_login_at, created_at')
    .order('created_at', { ascending: false })

  return <TeamClient teamMembers={teamMembers || []} currentAdminId={adminUser.id} />
}

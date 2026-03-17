import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession } from '@/lib/auth'
import SettingsClient from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = createAdminSupabase()
  const session = await getAdminSession()

  // Fetch current admin user
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, email, role, totp_enabled, created_at, last_login')
    .eq('id', session?.adminId)
    .single()

  // Fetch all admin users (for super_admin only)
  let allAdmins: any[] = []
  if (session?.role === 'super_admin') {
    const { data } = await supabase
      .from('admin_users')
      .select('id, email, role, totp_enabled, created_at, last_login')
      .order('created_at', { ascending: false })
    allAdmins = data || []
  }

  // Fetch app settings
  const { data: settings } = await supabase
    .from('app_settings')
    .select('*')
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-body-text">Settings</h1>
        <p className="text-muted-text mt-1">Manage admin accounts and app configuration</p>
      </div>

      <SettingsClient
        currentAdmin={adminUser}
        allAdmins={allAdmins}
        settings={settings}
        isSuperAdmin={session?.role === 'super_admin'}
      />
    </div>
  )
}

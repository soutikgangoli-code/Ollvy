import { createServerSupabase, supabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/admin/AdminNav'
// NOTE: Do NOT import Toaster here - it is already in app/layout.tsx (root layout)
// Adding it again causes duplicate toasts

export const metadata = { robots: 'noindex, nofollow' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')

  // supabaseServer is a direct export that can be null at build time
  if (!supabaseServer) redirect('/admin/login')

  const { data: adminUser } = await supabaseServer
    .from('admin_users')
    .select('id, name, email, role, is_active')  // role required for super_admin checks
    .eq('auth_user_id', session.user.id)
    .single()

  if (!adminUser?.is_active) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNav adminName={adminUser.name} isSuperAdmin={adminUser.role === 'super_admin'} />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}

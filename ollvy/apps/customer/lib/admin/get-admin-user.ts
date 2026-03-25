import { supabaseServer } from '@/lib/supabase-server'
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { cache } from 'react'

export interface AdminUser {
  id: string
  auth_user_id: string
  name: string
  email: string
  role: 'super_admin' | 'ops_admin' | 'finance_admin'
  is_active: boolean
}

// Use React cache to dedupe requests within a single render cycle
export const getAdminUser = cache(async (): Promise<AdminUser> => {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')
  if (!supabaseServer) redirect('/admin/login')

  const { data: adminUser } = await supabaseServer
    .from('admin_users')
    .select('id, auth_user_id, name, email, role, is_active')
    .eq('auth_user_id', session.user.id)
    .single()

  if (!adminUser?.is_active) redirect('/admin/login')
  return adminUser as AdminUser
})

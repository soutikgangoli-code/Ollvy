import { supabaseServer, createServerSupabase } from '@/lib/supabase-server'
import { headers } from 'next/headers'
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

// Module-level cache: persists across requests on warm serverless instances.
// Keyed by auth_user_id. TTL: 60s.
// Trade-off: if an admin is deactivated or role-changed, they have up to 60s of
// stale access. Acceptable for an internal tool with a handful of admins.
// Forced invalidation available via invalidateAdminCache().
const ADMIN_CACHE_TTL_MS = 60_000
type CacheEntry = { user: AdminUser; expiresAt: number }
const adminCache = new Map<string, CacheEntry>()

async function fetchAdminByAuthId(authUserId: string): Promise<AdminUser | null> {
  if (!supabaseServer) return null
  const { data } = await supabaseServer
    .from('admin_users')
    .select('id, auth_user_id, name, email, role, is_active')
    .eq('auth_user_id', authUserId)
    .single()
  return (data as AdminUser | null) ?? null
}

// React cache() dedupes within a single render tree.
// Module-level Map dedupes across requests on the same warm instance.
// Performance: fast-path reads x-auth-user-id from middleware-verified header
// (skips ~200-500ms auth.getUser() roundtrip); cache hit skips the
// admin_users DB query (~20-50ms). Cold cold: same as before.
export const getAdminUser = cache(async (): Promise<AdminUser> => {
  if (!supabaseServer) redirect('/admin/login')

  const headerStore = await headers()
  let resolvedAuthUserId = headerStore.get('x-auth-user-id')

  if (!resolvedAuthUserId) {
    // Fallback: middleware didn't set the header. Verify via auth.getUser().
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/admin/login')
    resolvedAuthUserId = user.id
  }

  const now = Date.now()
  const cached = adminCache.get(resolvedAuthUserId)
  if (cached && cached.expiresAt > now) {
    if (!cached.user.is_active) {
      adminCache.delete(resolvedAuthUserId)
      redirect('/admin/login')
    }
    return cached.user
  }

  const adminUser = await fetchAdminByAuthId(resolvedAuthUserId)
  if (!adminUser?.is_active) {
    adminCache.delete(resolvedAuthUserId)
    redirect('/admin/login')
  }

  adminCache.set(resolvedAuthUserId, {
    user: adminUser,
    expiresAt: now + ADMIN_CACHE_TTL_MS,
  })
  return adminUser
})

// Forced cache invalidation. Call after admin role changes / deactivation.
export function invalidateAdminCache(authUserId?: string) {
  if (authUserId) adminCache.delete(authUserId)
  else adminCache.clear()
}

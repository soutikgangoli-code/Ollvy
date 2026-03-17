import { cookies } from 'next/headers'
import { createServerSupabase, createAdminSupabase } from './supabase-server'
import type { AdminSession, AdminUser, AdminRole } from './types'

const SESSION_COOKIE = 'admin_session'
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 hours

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const session: AdminSession = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString()
    )

    // Check expiry
    if (Date.now() > session.expires_at) {
      return null
    }

    // Check TOTP verification
    if (!session.totp_verified) {
      return null
    }

    // Verify admin is still active
    const supabase = createAdminSupabase()
    const { data: admin } = await supabase
      .from('admin_users')
      .select('is_active')
      .eq('id', session.admin_user_id)
      .single()

    if (!admin?.is_active) {
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function createAdminSession(
  adminUser: AdminUser,
  totpVerified: boolean = false
): Promise<string> {
  const session: AdminSession = {
    admin_user_id: adminUser.id,
    adminId: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
    totp_verified: totpVerified,
    expires_at: Date.now() + SESSION_DURATION,
  }

  const sessionValue = Buffer.from(JSON.stringify(session)).toString('base64')

  cookies().set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })

  return sessionValue
}

export async function updateSessionTOTP(verified: boolean): Promise<void> {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE)

  if (!sessionCookie?.value) {
    return
  }

  try {
    const session: AdminSession = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString()
    )

    session.totp_verified = verified
    session.expires_at = Date.now() + SESSION_DURATION

    const sessionValue = Buffer.from(JSON.stringify(session)).toString('base64')

    cookies().set(SESSION_COOKIE, sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000,
      path: '/',
    })
  } catch {
    // Invalid session
  }
}

export async function getPartialSession(): Promise<AdminSession | null> {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const session: AdminSession = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString()
    )

    if (Date.now() > session.expires_at) {
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function clearAdminSession(): Promise<void> {
  cookies().delete(SESSION_COOKIE)
}

export function hasPermission(role: AdminRole, page: string): boolean {
  const permissions: Record<AdminRole, string[]> = {
    super_admin: ['*'],
    ops_admin: [
      'dashboard', 'orders', 'retainers', 'quotes', 'disputes', 'sla', 'capacity',
      'professionals', 'users', 'services', 'tier-groups', 'invoices', 'analytics',
      'fraud', 'promo-codes'
    ],
    finance_admin: ['dashboard', 'invoices', 'payouts', 'analytics'],
  }

  const allowed = permissions[role]
  return allowed.includes('*') || allowed.includes(page)
}

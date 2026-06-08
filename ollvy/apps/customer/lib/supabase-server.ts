import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { withTimeout, AUTH_TIMEOUT_MS } from './with-timeout'

// Service role client for ISR/SSG fetching - bypasses RLS
// Per §23: "Server-side client for ISR/SSG fetching - has unrestricted reads"
// Returns null if service role key is not configured (build-time fallback to static data)
function createServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    // During build without service role key, return null to trigger static fallback
    return null
  }

  return createClient(url, key)
}

export const supabaseServer = createServiceRoleClient()

export async function createServerSupabase() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle in middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle in middleware
          }
        },
      },
    }
  )
}

export async function getUser() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await withTimeout(
    supabase.auth.getUser(), AUTH_TIMEOUT_MS, 'getUser.auth',
  )

  if (!user) return null

  // Fetch full user data from users table
  const { data: userData } = await withTimeout(
    supabase.from('users').select('*').eq('auth_user_id', user.id).single(),
    AUTH_TIMEOUT_MS, 'getUser.users',
  )

  return userData
}

/**
 * Fast user lookup using auth ID from middleware header.
 * Skips the redundant auth.getUser() call (~200ms saved) since
 * middleware already verified the JWT.
 * Falls back to full getUser() if header is missing.
 */
export async function getUserFast() {
  const { headers } = await import('next/headers')
  const headerStore = await headers()
  const authUserId = headerStore.get('x-auth-user-id')

  if (!authUserId) {
    // Fallback: middleware didn't set header (direct access, etc.)
    return getUser()
  }

  // Skip auth.getUser() — middleware already verified the JWT
  // Just fetch user data from the users table (single DB query)
  if (!supabaseServer) return getUser()

  const { data: userData } = await withTimeout(
    supabaseServer.from('users').select('*').eq('auth_user_id', authUserId).single(),
    AUTH_TIMEOUT_MS, 'getUserFast.users',
  )

  return userData
}

export async function getSession() {
  const supabase = await createServerSupabase()
  const { data: { session } } = await withTimeout(
    supabase.auth.getSession(), AUTH_TIMEOUT_MS, 'getSession',
  )
  return session
}

import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withTimeout, AUTH_TIMEOUT_MS } from '@/lib/with-timeout'

// Service role client for user creation - bypasses RLS
function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error('[auth/callback] Missing SUPABASE_SERVICE_ROLE_KEY')
    return null
  }

  return createClient(url, key)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next')
  const origin = request.nextUrl.origin
  const next = nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/'

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent('Missing OAuth authorization code')}`
    )
  }

  // Add freshLogin param to trigger welcome banner
  const separator = next.includes('?') ? '&' : '?'
  const redirectUrl = `${origin}${next}${separator}freshLogin=1`
  const response = NextResponse.redirect(redirectUrl)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  let session
  try {
    const { data, error } = await withTimeout(
      supabase.auth.exchangeCodeForSession(code),
      AUTH_TIMEOUT_MS,
      'auth/callback.exchangeCode',
    )
    if (error) {
      console.error('OAuth error:', error.message)
      return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error.message)}`)
    }
    session = data.session
  } catch (err) {
    // Timed out / network failure exchanging the code — send the user to a
    // retryable error instead of hanging the login redirect indefinitely.
    console.error('[auth/callback] code exchange timed out/failed:', err)
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent('Sign-in timed out. Please try again.')}`,
    )
  }

  if (session) {
    // Use service role client for user creation (bypasses RLS).
    const serviceClient = getServiceRoleClient()

    if (serviceClient) {
      try {
        const { data: existingUser } = await withTimeout(
          serviceClient
            .from('users')
            .select('id')
            .eq('auth_user_id', session.user.id)
            .single(),
          AUTH_TIMEOUT_MS,
          'auth/callback.userLookup',
        )

        if (!existingUser) {
          const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
          const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name

          console.log('[auth/callback] Creating new user for:', session.user.email)

          const { error: insertError } = await withTimeout(
            serviceClient.from('users').insert({
              auth_user_id: session.user.id,
              email: session.user.email,
              phone: null,
              auth_provider: 'google',
              avatar_url: avatarUrl,
              business_name: fullName,
              referral_code: `OLV${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            }),
            AUTH_TIMEOUT_MS,
            'auth/callback.userInsert',
          )

          if (insertError) {
            console.error('[auth/callback] Error creating user:', insertError)
          } else {
            console.log('[auth/callback] User created successfully')
          }
        }
      } catch (err) {
        // Never block the login redirect on user provisioning — the row is
        // re-created idempotently by refreshSession's ensure_user_exists RPC on
        // the next load if this timed out or failed.
        console.error('[auth/callback] user provisioning failed (will retry on next load):', err)
      }
    }
  }

  return response
}

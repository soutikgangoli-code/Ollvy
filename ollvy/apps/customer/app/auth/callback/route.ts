import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth error:', error.message)
    return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error.message)}`)
  }

  if (data.session) {
    // Use service role client for user creation (bypasses RLS)
    const serviceClient = getServiceRoleClient()

    if (serviceClient) {
      const { data: existingUser } = await serviceClient
        .from('users')
        .select('id')
        .eq('auth_user_id', data.session.user.id)
        .single()

      if (!existingUser) {
        const avatarUrl = data.session.user.user_metadata?.avatar_url || data.session.user.user_metadata?.picture
        const fullName = data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name

        console.log('[auth/callback] Creating new user for:', data.session.user.email)

        const { error: insertError } = await serviceClient.from('users').insert({
          auth_user_id: data.session.user.id,
          email: data.session.user.email,
          phone: null,
          auth_provider: 'google',
          avatar_url: avatarUrl,
          business_name: fullName,
          referral_code: `OLV${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        })

        if (insertError) {
          console.error('[auth/callback] Error creating user:', insertError)
        } else {
          console.log('[auth/callback] User created successfully')
        }
      }
    }
  }

  return response
}

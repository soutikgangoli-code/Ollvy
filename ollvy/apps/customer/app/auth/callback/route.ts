import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const origin = request.nextUrl.origin

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=no_code`)
  }

  const redirectUrl = `${origin}${next}`
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
    // Check/create user in our database
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', data.session.user.id)
      .single()

    if (!existingUser) {
      const avatarUrl = data.session.user.user_metadata?.avatar_url || data.session.user.user_metadata?.picture
      const fullName = data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name

      await supabase.from('users').insert({
        auth_user_id: data.session.user.id,
        email: data.session.user.email,
        phone: null,
        auth_provider: 'google',
        avatar_url: avatarUrl,
        business_name: fullName,
        referral_code: `OLV${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      })
    }
  }

  return response
}

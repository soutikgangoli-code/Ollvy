import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()

    // Create response first - we'll set cookies on this response
    const redirectUrl = new URL(next, origin)
    const response = NextResponse.redirect(redirectUrl)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Set cookie on the response object
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Exchange code for session - this will set cookies via the handlers above
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error('OAuth callback error:', sessionError)
      return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(sessionError.message)}`)
    }

    if (session) {
      // Check if user already exists in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', session.user.id)
        .single()

      if (!existingUser) {
        // Create new user row with Google OAuth data
        const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
        const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name

        const { error: insertError } = await supabase
          .from('users')
          .insert({
            auth_user_id: session.user.id,
            email: session.user.email,
            phone: null,
            auth_provider: 'google',
            avatar_url: avatarUrl,
            business_name: fullName,
            referral_code: `OLV${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          })

        if (insertError) {
          console.error('Error creating user:', insertError)
        }
      }

      // Return the response with cookies set
      return response
    }
  }

  return NextResponse.redirect(`${origin}/`)
}

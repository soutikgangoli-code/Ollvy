import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )

    // Exchange code for session
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
        // Phone is null - will be collected post-payment in questionnaire
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            auth_user_id: session.user.id,
            email: session.user.email,
            phone: null, // Will be collected post-payment
            auth_provider: 'google',
            // Generate referral code
            referral_code: `OLV${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          })

        if (insertError) {
          console.error('Error creating user:', insertError)
          // Don't fail the login - user can still use the app
          // The user row will be created when they first make a purchase
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Something went wrong, redirect to home
  return NextResponse.redirect(`${origin}/`)
}

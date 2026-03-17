import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const isLoginPage = request.nextUrl.pathname === '/login'
  const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding')
  const isProtectedPage = !isLoginPage

  // If no session and trying to access protected page, redirect to login
  if (!session && isProtectedPage) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If has session and trying to access login page, redirect based on status
  if (session && isLoginPage) {
    // Check professional status
    const { data: professional } = await supabase
      .from('professionals')
      .select('status, onboarding_step')
      .eq('auth_user_id', session.user.id)
      .single()

    if (!professional) {
      // Not a professional yet, might need to register
      const redirectUrl = new URL('/onboarding/basics', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    if (professional.status === 'pending' || professional.status === 'pending_review') {
      if (professional.onboarding_step < 3) {
        // Still in onboarding
        const step = professional.onboarding_step || 0
        if (step < 1) {
          return NextResponse.redirect(new URL('/onboarding/basics', request.url))
        } else if (step < 2) {
          return NextResponse.redirect(new URL('/onboarding/services', request.url))
        } else {
          return NextResponse.redirect(new URL('/onboarding/certifications', request.url))
        }
      }
      return NextResponse.redirect(new URL('/onboarding/pending', request.url))
    }

    if (professional.status === 'approved') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (professional.status === 'rejected') {
      return NextResponse.redirect(new URL('/onboarding/pending', request.url))
    }
  }

  // If has session and on authenticated pages, verify professional status
  if (session && isProtectedPage && !isOnboardingPage) {
    const { data: professional } = await supabase
      .from('professionals')
      .select('status')
      .eq('auth_user_id', session.user.id)
      .single()

    // If not approved, redirect to appropriate onboarding page
    if (!professional || professional.status !== 'approved') {
      if (!professional) {
        return NextResponse.redirect(new URL('/onboarding/basics', request.url))
      }
      if (professional.status === 'pending' || professional.status === 'pending_review' || professional.status === 'rejected') {
        return NextResponse.redirect(new URL('/onboarding/pending', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

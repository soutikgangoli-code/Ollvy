import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/verify', '/auth/callback', '/auth/error']

// Routes that require authentication (server-side redirect to /login)
const PROTECTED_ROUTES = ['/orders', '/profile', '/retainers', '/compliance', '/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect non-www to www (SEO canonical enforcement)
  const host = request.headers.get('host') || ''
  if (host === 'ollvy.com') {
    const url = request.nextUrl.clone()
    url.host = 'www.ollvy.com'
    url.protocol = 'https'
    return NextResponse.redirect(url, 308) // 308 = permanent redirect
  }

  // Skip auth for public routes entirely — no Supabase client needed
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/guides') ||
    pathname.startsWith('/tools') ||
    pathname.startsWith('/join') ||
    pathname.startsWith('/startup') ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/director-kyc') ||
    pathname.startsWith('/itr-') ||
    pathname.startsWith('/gst-annual') ||
    pathname.startsWith('/tds-return') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/cancellation') ||
    pathname.startsWith('/refunds') ||
    pathname.startsWith('/about') ||
    /^\/[^/]+\/[^/]+$/.test(pathname)

  if (isPublicRoute) {
    return NextResponse.next()
  }

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
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Use getSession() instead of getUser() — reads JWT from cookie locally
  // without a network call to Supabase auth server (~150-200ms saved).
  // Pages verify auth independently via getUser()/getUserFast()/getAdminUser().
  const { data: { session } } = await supabase.auth.getSession()

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isAuthRoute = pathname === '/login' || pathname === '/verify'

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to home if accessing auth routes with valid session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Pass auth user ID to page via header so pages can skip redundant auth.getUser()
  if (session?.user) {
    response.headers.set('x-auth-user-id', session.user.id)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

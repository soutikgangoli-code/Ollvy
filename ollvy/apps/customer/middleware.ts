import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/verify', '/auth/callback', '/auth/error']

// Routes that require authentication (server-side redirect to /login)
const PROTECTED_ROUTES = ['/orders', '/profile', '/retainers', '/compliance', '/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Note: ollvy.com → www.ollvy.com redirect is configured at the edge via the
  // Vercel dashboard (Domains → ollvy.com redirects to www.ollvy.com). Doing it
  // here would wake a serverless function just to issue a 308, adding ~300ms to
  // every bare-domain hit. See DEPLOYMENT_NOTES.md.

  // Check protected routes FIRST. Previously the public-route check below
  // included a generic 2-segment regex (/^\/[^/]+\/[^/]+$/) that was meant
  // to catch /services/<slug>, /guides/<slug>, etc. — but it also matched
  // /orders/<id>, /retainers/<id>, and /admin/<page>, causing those routes
  // to skip the entire auth header logic. Result: getUserFast() always fell
  // through to its slow fallback, adding ~1-3 seconds to every protected
  // detail-page load.
  //
  // /admin/login must be reachable without a session (it IS the way you sign
  // in). Without this carve-out, pathname.startsWith('/admin') matched it as
  // protected, redirecting unauthenticated admins to the customer /login
  // (phone-OTP modal) instead of the admin email+password form.
  const isProtectedRoute =
    PROTECTED_ROUTES.some(route => pathname.startsWith(route)) &&
    pathname !== '/admin/login'

  if (!isProtectedRoute) {
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
  }

  // Build a forwarded-request header set so we can pass auth context to server
  // components. Mutating response.headers (the previous behavior) does NOT
  // reach next/headers — server components read REQUEST headers, so the
  // x-auth-user-id was never visible and getUserFast() always fell through
  // to its slow auth.getUser() fallback (+~200-500ms per page; observed
  // ~1.3-1.6s in production due to network jitter). Setting it on the
  // forwarded request makes getUserFast take its single-DB-query fast path.
  const forwardedHeaders = new Headers(request.headers)

  let response = NextResponse.next({
    request: {
      headers: forwardedHeaders,
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
            request: { headers: forwardedHeaders },
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

  // isProtectedRoute already determined at the top
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

  // Pass auth user ID to page via FORWARDED REQUEST header so pages can skip
  // the redundant auth.getUser() roundtrip. Setting on response.headers
  // (previous behavior) only affects the response sent to the browser; server
  // components see request headers, so this must be set on the forwarded
  // headers, then re-applied via NextResponse.next.
  if (session?.user) {
    forwardedHeaders.set('x-auth-user-id', session.user.id)
    response = NextResponse.next({
      request: { headers: forwardedHeaders },
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

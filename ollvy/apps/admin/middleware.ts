import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'admin_session'

// Public routes that don't require auth
const PUBLIC_ROUTES = ['/login', '/login/verify-totp', '/login/setup-2fa']

// Route to role mapping
const ROUTE_ROLES: Record<string, string[]> = {
  '/payouts': ['super_admin', 'finance_admin'],
  '/settings': ['super_admin'],
  '/fraud': ['super_admin', 'ops_admin'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE)

  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const session = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString()
    )

    // Check expiry
    if (Date.now() > session.expires_at) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete(SESSION_COOKIE)
      return response
    }

    // Check TOTP verification
    if (!session.totp_verified) {
      // Allow access to TOTP verification page
      if (pathname === '/login/verify-totp' || pathname === '/login/setup-2fa') {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL('/login/verify-totp', request.url))
    }

    // Check role permissions for specific routes
    for (const [route, allowedRoles] of Object.entries(ROUTE_ROLES)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(session.role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return NextResponse.next()
  } catch {
    // Invalid session
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete(SESSION_COOKIE)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

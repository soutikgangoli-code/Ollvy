'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'

/**
 * Background warmer for protected routes.
 *
 * Vercel serverless functions go cold after ~5-15 min of inactivity. The first
 * hit on a cold function pays a 500-1500ms boot cost before our code even runs,
 * which is exactly what users experience as "the orders page is slow the first
 * time but fast after that". Each route is its own function — `/orders` and
 * `/orders/[id]` warm independently — so a user who lands on `/` and then
 * clicks straight to `/orders/[id]` hits TWO cold starts back to back.
 *
 * This component fires fire-and-forget HEAD pings to the most commonly-visited
 * protected routes once the user is authenticated AND any in-progress login /
 * post-login navigation has completed, so by the time they navigate, the
 * destination function instance is already warm.
 *
 * Why HEAD: Next.js page handlers run the same server work for HEAD as for GET
 * (the response body is stripped, but the function executes), so the route's
 * Vercel function instance spins up. Cheap and fast.
 *
 * Why we wait for isHydrated AND defer via requestIdleCallback: the auth flow
 * itself (Supabase auth events, refreshSession, redirect to /orders post-login)
 * uses CPU and network during the first second after login. Firing 2-3 HEAD
 * requests in parallel during that window competes for the same resources and
 * slows down the user's actual page transition. Waiting for browser idle means
 * warmup happens after the immediate user-visible work settles.
 *
 * Why skip routes already being viewed: no point pinging /orders if the user
 * is already on /orders — the function is already warm by virtue of being
 * what they're looking at.
 *
 * Why gate via ref: useEffect can re-run if session reference changes
 * (re-renders, hot reload). The ref ensures we only warm once per mount.
 */
const WARM_ROUTES = ['/orders', '/profile']

export function WarmupProtected() {
  const session = useAuthStore((s) => s.session)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const pathname = usePathname()
  const hasFiredRef = useRef(false)

  useEffect(() => {
    if (hasFiredRef.current) return
    // Only logged-in users — anon users hitting /orders just bounce to /login.
    if (!session) return
    // Wait until the auth flow has fully settled. isHydrated flips true once
    // refreshSession() resolves; isLoading should also be false. Together they
    // mean the SIGNED_IN event has been processed and any post-login redirect
    // has had time to start, so we're not stealing CPU/network from the user.
    if (!isHydrated || isLoading) return
    hasFiredRef.current = true

    const fire = () => {
      const routesToWarm = WARM_ROUTES.filter(
        // Don't warm a route the user is currently on — that function is
        // already warm by virtue of having just rendered the page.
        (r) => !pathname || !pathname.startsWith(r)
      )
      for (const route of routesToWarm) {
        fetch(route, {
          method: 'HEAD',
          credentials: 'include',
          keepalive: true,
        }).catch(() => {
          // Fire-and-forget; warmup failures are not user-visible.
        })
      }
    }

    // Defer to browser idle so the post-login redirect, hydration, and any
    // analytics calls all complete first. requestIdleCallback isn't available
    // in Safari < 17, so fall back to a 1.5s setTimeout — still plenty of
    // buffer past the typical post-login redirect.
    const ric = (
      window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      }
    ).requestIdleCallback
    if (typeof ric === 'function') {
      ric(fire, { timeout: 3000 })
    } else {
      setTimeout(fire, 1500)
    }
  }, [session, isHydrated, isLoading, pathname])

  return null
}

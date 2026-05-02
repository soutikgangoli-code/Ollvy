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
    // Wait until auth-store has settled (post-login event processed, any
    // redirect underway).
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

    // Two-stage deferral so warmup never competes with the page load itself:
    //
    //   1. Wait for window.load (full page load — images, iframes, all
    //      of it). The login banner can be on screen at this point; that's
    //      fine — the banner is just a CSS animation, not server work, so
    //      our network pings don't slow it down.
    //
    //   2. Run inside requestIdleCallback so the actual fetches fire during
    //      a genuine browser idle window — not while React is reconciling
    //      or images are decoding. Falls back to setTimeout(0) on Safari < 17
    //      which lacks rIC.
    const scheduleWarmup = () => {
      const ric = (
        window as unknown as {
          requestIdleCallback?: (
            cb: () => void,
            opts?: { timeout: number }
          ) => number
        }
      ).requestIdleCallback
      if (typeof ric === 'function') {
        ric(fire, { timeout: 2000 })
      } else {
        setTimeout(fire, 0)
      }
    }

    if (document.readyState === 'complete') {
      scheduleWarmup()
    } else {
      window.addEventListener('load', scheduleWarmup, { once: true })
    }
  }, [session, isHydrated, isLoading, pathname])

  return null
}

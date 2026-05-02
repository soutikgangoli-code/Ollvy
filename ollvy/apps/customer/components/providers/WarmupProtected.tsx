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

    // Three-stage deferral to make sure the warmup pings never compete with
    // anything the user can perceive:
    //
    //   1. Wait for window.load (full page load including images/iframes,
    //      not just DOMContentLoaded). If the page is already loaded, we
    //      proceed immediately — but typically auth settles slightly after
    //      load, so this gate is mostly for first-page-visit timing.
    //
    //   2. Wait an additional 3.5s. LoginSuccessBanner auto-dismisses at 3s;
    //      we add 500ms slack so warmup never overlaps with the banner's
    //      animation or any post-login redirect work.
    //
    //   3. Run inside requestIdleCallback (with setTimeout fallback for
    //      Safari < 17) so the actual fetches happen during the next idle
    //      window — not while React is reconciling, not while images are
    //      loading.
    const scheduleWarmup = () => {
      setTimeout(() => {
        const ric = (
          window as unknown as {
            requestIdleCallback?: (
              cb: () => void,
              opts?: { timeout: number }
            ) => number
          }
        ).requestIdleCallback
        if (typeof ric === 'function') {
          ric(fire, { timeout: 4000 })
        } else {
          setTimeout(fire, 200)
        }
      }, 3500)
    }

    if (document.readyState === 'complete') {
      scheduleWarmup()
    } else {
      window.addEventListener('load', scheduleWarmup, { once: true })
    }
  }, [session, isHydrated, isLoading, pathname])

  return null
}

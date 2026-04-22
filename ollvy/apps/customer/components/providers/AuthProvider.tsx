'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refreshSession, setSession, setUser } = useAuthStore()
  const hasHydrated = useRef(false)
  const initialHydrationComplete = useRef(false)

  useEffect(() => {
    if (hasHydrated.current) return
    hasHydrated.current = true

    // Skip network calls for first-time visitors with no session
    const hasAuthCookie = document.cookie.includes('sb-')
    if (!hasAuthCookie) {
      useAuthStore.setState({ isHydrated: true })
      initialHydrationComplete.current = true
      console.log('[AuthProvider] No auth cookie, skipping hydration')
      return
    }

    let isMounted = true
    let unsubscribe: (() => void) | null = null

    console.log('[AuthProvider] Mounting, starting hydration')

    const init = async () => {
      // Dynamic import keeps @supabase/ssr out of the homepage shared chunk.
      // Only runs when an auth cookie is present (logged-in users).
      const { getClient } = await import('@/lib/supabase')
      if (!isMounted) return
      const supabase = getClient()

      const hydrate = async () => {
        await refreshSession()
        initialHydrationComplete.current = true
        console.log('[AuthProvider] Initial hydration complete')
      }

      hydrate()

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('[AuthProvider] Auth event:', event)
        if (!isMounted) return

        if (initialHydrationComplete.current) {
          if (event === 'SIGNED_OUT') {
            setSession(null)
            setUser(null)
          } else if (event === 'TOKEN_REFRESHED' && session) {
            setSession(session)
          } else if (event === 'SIGNED_IN' && session) {
            const hasPendingFreshLogin = sessionStorage.getItem('ollvy_fresh_login') === '1'
            if (hasPendingFreshLogin) {
              console.log('[AuthProvider] SIGNED_IN with pending fresh login, calling refreshSession')
              await refreshSession()
            }
          }
          return
        }

        if (session) {
          await refreshSession()
        } else {
          setSession(null)
          setUser(null)
        }
      })
      unsubscribe = () => subscription.unsubscribe()
    }

    init()

    return () => {
      isMounted = false
      if (unsubscribe) unsubscribe()
    }
  }, [])

  return <>{children}</>
}

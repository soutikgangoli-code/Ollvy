'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getClient } from '@/lib/supabase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refreshSession, setSession, setUser } = useAuthStore()
  const hasHydrated = useRef(false)
  const initialHydrationComplete = useRef(false)

  useEffect(() => {
    // Only run once
    if (hasHydrated.current) return
    hasHydrated.current = true

    const supabase = getClient()
    let isMounted = true

    console.log('[AuthProvider] Mounting, starting hydration')

    const hydrate = async () => {
      await refreshSession()
      initialHydrationComplete.current = true
      console.log('[AuthProvider] Initial hydration complete')
    }

    hydrate()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthProvider] Auth event:', event)
      if (!isMounted) return

      // After initial hydration, only respond to specific events
      if (initialHydrationComplete.current) {
        if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Only update session token, don't re-fetch user data
          setSession(session)
        } else if (event === 'SIGNED_IN' && session) {
          // Check for pending fresh login that wasn't processed during hydration
          // This handles the race condition where getSession() returns null initially
          // but the session is established shortly after
          const hasPendingFreshLogin = sessionStorage.getItem('ollvy_fresh_login') === '1'
          if (hasPendingFreshLogin) {
            console.log('[AuthProvider] SIGNED_IN with pending fresh login, calling refreshSession')
            // Call refreshSession which will detect the sessionStorage flag,
            // fetch user data, show the banner, and clear the flag
            await refreshSession()
          }
        }
        // Ignore INITIAL_SESSION after hydration
        return
      }

      // During initial hydration, let refreshSession handle everything
      if (session) {
        await refreshSession()
      } else {
        setSession(null)
        setUser(null)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, []) // Empty dependency array - run once only

  return <>{children}</>
}

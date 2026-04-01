'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getClient } from '@/lib/supabase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refreshSession, setSession, setUser } = useAuthStore()
  const hasHydrated = useRef(false)

  useEffect(() => {
    // Only run once
    if (hasHydrated.current) return
    hasHydrated.current = true

    const supabase = getClient()
    let isMounted = true

    console.log('[AuthProvider] Mounting, starting hydration')

    const hydrate = async () => {
      await refreshSession()
      console.log('[AuthProvider] Initial hydration complete')
    }

    hydrate()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthProvider] Auth event:', event)
      if (!isMounted) return

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

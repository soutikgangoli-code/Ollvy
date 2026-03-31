'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getClient } from '@/lib/supabase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refreshSession, setSession, setUser } = useAuthStore()

  useEffect(() => {
    const supabase = getClient()
    let isMounted = true

    const hydrate = async () => {
      await refreshSession()
    }

    hydrate()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
  }, [refreshSession, setSession, setUser])

  return <>{children}</>
}

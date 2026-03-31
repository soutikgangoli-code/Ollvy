'use client'

import { useEffect } from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getClient } from '@/lib/supabase'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { refreshSession, setSession, setUser } = useAuthStore()

  useEffect(() => {
    // Initial session check
    refreshSession()

    // Listen for auth state changes (handles OAuth redirects, sign out, etc.)
    const supabase = getClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Fetch user data and update store
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single()

          setSession(session)
          setUser(userData || null)
        } else if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshSession, setSession, setUser])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}

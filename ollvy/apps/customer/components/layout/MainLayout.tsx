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
    const supabase = getClient()

    // Check for session from URL hash (implicit flow) or cookies
    const initSession = async () => {
      // This will detect tokens in URL fragment for implicit flow
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Session error:', error)
        return
      }

      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single()

        setSession(session)
        setUser(userData || null)
      }
    }

    initSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
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
  }, [setSession, setUser])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}

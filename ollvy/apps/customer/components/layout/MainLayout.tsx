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

    // Check for tokens in URL hash (implicit flow)
    const handleHashTokens = async () => {
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        console.log('Found tokens in URL hash, processing...')

        // Parse the hash
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
          // Set the session manually
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error('Error setting session:', error)
          } else if (data.session) {
            console.log('Session set successfully')
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname)

            // Fetch user data
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('auth_user_id', data.session.user.id)
              .single()

            setSession(data.session)
            setUser(userData || null)
          }
        }
      } else {
        // No hash, check for existing session
        const { data: { session } } = await supabase.auth.getSession()
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
    }

    handleHashTokens()

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

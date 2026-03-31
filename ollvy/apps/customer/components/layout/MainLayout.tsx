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

            // Fetch or create user data
            let { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('auth_user_id', data.session.user.id)
              .single()

            // Create user if doesn't exist (new OAuth user via implicit flow)
            if (!userData) {
              const authUser = data.session.user
              const avatarUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture
              const fullName = authUser.user_metadata?.full_name || authUser.user_metadata?.name

              const { data: newUser } = await supabase
                .from('users')
                .insert({
                  auth_user_id: authUser.id,
                  email: authUser.email,
                  phone: null,
                  auth_provider: 'google',
                  avatar_url: avatarUrl,
                  business_name: fullName,
                  referral_code: `OLV${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                })
                .select()
                .single()

              userData = newUser
              console.log('Created new user:', userData?.id)
            }

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
          let { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single()

          // Create user if doesn't exist (new OAuth user)
          if (!userData && event === 'SIGNED_IN') {
            const authUser = session.user
            const avatarUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture
            const fullName = authUser.user_metadata?.full_name || authUser.user_metadata?.name

            const { data: newUser } = await supabase
              .from('users')
              .insert({
                auth_user_id: authUser.id,
                email: authUser.email,
                phone: null,
                auth_provider: 'google',
                avatar_url: avatarUrl,
                business_name: fullName,
                referral_code: `OLV${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
              })
              .select()
              .single()

            userData = newUser
            console.log('Created new user via auth event:', userData?.id)
          }

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

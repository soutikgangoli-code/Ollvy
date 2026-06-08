import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { fetchWithTimeout, TIMEOUTS } from '../fetch-with-timeout'
import { withTimeout, AUTH_TIMEOUT_MS } from '../with-timeout'

export interface User {
  id: string
  auth_user_id: string
  phone: string | null // Now nullable - collected post-payment for Google OAuth users
  email?: string
  business_name?: string
  business_type?: 'sole_proprietorship' | 'partnership' | 'pvt_ltd' | 'llp' | 'opc' | 'not_registered'
  // Identity documents
  pan_number?: string
  aadhaar_number?: string
  // Registration numbers (auto-filled from completed orders)
  gstin?: string
  cin?: string
  din?: string
  tan?: string
  iec?: string
  fssai_number?: string
  udyam_number?: string
  shop_establishment_number?: string
  pt_number?: string
  trademark_number?: string
  // Location
  state?: string
  city?: string
  address?: string
  subscription_tier: string
  compliance_health_score: number
  profile_completeness_score: number
  is_returning: boolean
  avatar_url?: string
  referral_code: string
  referral_credit_paisa: number
  referral_credit_balance_paisa?: number
  auth_provider?: 'phone' | 'google'
  created_at: string
}

// ============================================================================
// OTP Types (preserved for future use)
// ============================================================================
// interface SendOtpResponse {
//   sent?: boolean
//   error?: string
//   retryAfter?: number
//   remainingAttempts?: number
//   message?: string
// }
//
// interface VerifyOtpResponse {
//   session?: Session
//   user?: User
//   isNewUser?: boolean
//   error?: string
//   message?: string
// }

interface AuthState {
  session: Session | null
  user: User | null
  isLoading: boolean
  isHydrated: boolean // True after first session check completes
  isNewUser: boolean
  // OTP state (preserved for future use)
  lastOtpError: string | null
  retryAfter: number | null
  remainingAttempts: number | null
  // Modal state
  isAuthModalOpen: boolean
  authModalStep: 'phone' | 'otp' | 'google' // Added 'google' step
  authModalPhone: string | null
  returnUrl: string | null // URL to return to after sign-in
  // Login success banner
  showLoginSuccessBanner: boolean
}

interface AuthActions {
  // Google OAuth
  signInWithGoogle: (returnUrl?: string) => Promise<void>
  // OTP methods (preserved for future use - currently commented out in implementation)
  // sendOtp: (phone: string) => Promise<SendOtpResponse>
  // verifyOtp: (phone: string, code: string) => Promise<VerifyOtpResponse>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  setSession: (session: Session | null) => void
  setUser: (user: User | null) => void
  setIsNewUser: (isNew: boolean) => void
  clearOtpError: () => void
  // Modal actions
  openAuthModal: (returnUrl?: string) => void
  closeAuthModal: () => void
  setAuthModalStep: (step: 'phone' | 'otp' | 'google') => void
  setAuthModalPhone: (phone: string | null) => void
  // Phone update (for questionnaire)
  updateUserPhone: (phone: string) => Promise<boolean>
  // Login success banner
  setShowLoginSuccessBanner: (show: boolean) => void
  hideLoginSuccessBanner: () => void
}

function getOAuthRedirectUrl(): string {
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()

  if (configuredAppUrl) {
    const baseUrl = configuredAppUrl.replace(/\/+$/, '')
    return `${baseUrl}/auth/callback`
  }

  return `${window.location.origin}/auth/callback`
}

// Deduplication guard to prevent concurrent refreshSession calls
let _isRefreshingSession = false

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // State
  session: null,
  user: null,
  isLoading: false,
  isHydrated: false,
  isNewUser: false,
  lastOtpError: null,
  retryAfter: null,
  remainingAttempts: null,
  // Modal state
  isAuthModalOpen: false,
  authModalStep: 'google', // Default to Google sign-in
  authModalPhone: null,
  returnUrl: null,
  // Login success banner
  showLoginSuccessBanner: false,

  // Google OAuth Sign In
  signInWithGoogle: async (returnUrl?: string) => {
    set({ isLoading: true })

    try {
      const { getClient } = await import('../supabase')
      const supabase = getClient()

      // Build redirect URL with next parameter if returnUrl provided
      let redirectTo = getOAuthRedirectUrl()
      if (returnUrl) {
        redirectTo = `${redirectTo}?next=${encodeURIComponent(returnUrl)}`
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Google sign-in error:', error)
        set({ isLoading: false, lastOtpError: error.message })
      }
      // Note: On success, the page will redirect to Google OAuth
      // isLoading stays true until redirect
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google'
      console.error('Google sign-in error:', error)
      set({ isLoading: false, lastOtpError: errorMessage })
    }
  },

  // ============================================================================
  // OTP Methods (preserved for future use)
  // ============================================================================
  // sendOtp: async (phone: string) => {
  //   set({ isLoading: true, lastOtpError: null })
  //
  //   try {
  //     const response = await fetchWithTimeout(getEdgeFunctionUrl('send-otp'), {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ phone }),
  //       timeout: TIMEOUTS.OTP,
  //     })
  //
  //     const data: SendOtpResponse = await response.json()
  //
  //     if (!response.ok || data.error) {
  //       set({
  //         isLoading: false,
  //         lastOtpError: data.error || 'Failed to send OTP',
  //         retryAfter: data.retryAfter || null,
  //       })
  //       return data
  //     }
  //
  //     set({
  //       isLoading: false,
  //       remainingAttempts: data.remainingAttempts || null,
  //     })
  //
  //     return data
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Network error'
  //     set({ isLoading: false, lastOtpError: errorMessage })
  //     return { error: errorMessage }
  //   }
  // },
  //
  // verifyOtp: async (phone: string, code: string) => {
  //   set({ isLoading: true, lastOtpError: null })
  //
  //   try {
  //     const response = await fetchWithTimeout(getEdgeFunctionUrl('verify-otp'), {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ phone, otp: code }),
  //       timeout: TIMEOUTS.OTP,
  //     })
  //
  //     const data: VerifyOtpResponse = await response.json()
  //
  //     if (!response.ok || data.error) {
  //       set({
  //         isLoading: false,
  //         lastOtpError: data.error || 'Failed to verify OTP',
  //       })
  //       return data
  //     }
  //
  //     // Set session in Supabase client
  //     const supabase = getClient()
  //     if (data.session) {
  //       await supabase.auth.setSession({
  //         access_token: data.session.access_token,
  //         refresh_token: data.session.refresh_token,
  //       })
  //     }
  //
  //     set({
  //       session: data.session || null,
  //       user: data.user || null,
  //       isNewUser: data.isNewUser || false,
  //       isLoading: false,
  //     })
  //
  //     return data
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Network error'
  //     set({ isLoading: false, lastOtpError: errorMessage })
  //     return { error: errorMessage }
  //   }
  // },

  logout: async () => {
    set({ isLoading: true })

    try {
      const { getClient } = await import('../supabase')
      const supabase = getClient()
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }

    set({
      session: null,
      user: null,
      isLoading: false,
      isNewUser: false,
    })
  },

  refreshSession: async () => {
    // Dedupe concurrent calls
    if (_isRefreshingSession) {
      console.log('[auth-store] refreshSession already running, skipping')
      return
    }

    _isRefreshingSession = true

    // Check for freshLogin URL param (set by /auth/callback after OAuth)
    // Also check sessionStorage in case URL param was consumed by a previous render (React Strict Mode)
    const FRESH_LOGIN_KEY = 'ollvy_fresh_login'
    let isFreshLogin = false

    if (typeof window !== 'undefined') {
      const urlHasFreshLogin = new URLSearchParams(window.location.search).get('freshLogin') === '1'
      const storageHasFreshLogin = sessionStorage.getItem(FRESH_LOGIN_KEY) === '1'

      isFreshLogin = urlHasFreshLogin || storageHasFreshLogin

      // If URL has freshLogin, store it in sessionStorage for resilience
      if (urlHasFreshLogin) {
        sessionStorage.setItem(FRESH_LOGIN_KEY, '1')
      }

      // Remove freshLogin param from URL to prevent banner on refresh
      if (urlHasFreshLogin) {
        const url = new URL(window.location.href)
        url.searchParams.delete('freshLogin')
        window.history.replaceState({}, '', url.toString())
      }
    }

    console.log('[auth-store] isFreshLogin:', isFreshLogin, 'URL:', typeof window !== 'undefined' ? window.location.href : 'SSR')

    set({ isLoading: true })
    console.log('[auth-store] refreshSession starting')

    try {
      const { getClient } = await import('../supabase')
      const supabase = getClient()
      const { data: { session } } = await withTimeout(
        supabase.auth.getSession(), AUTH_TIMEOUT_MS, 'refreshSession.getSession',
      )
      console.log('[auth-store] getSession result:', session ? 'has session' : 'no session')

      if (session) {
        // Fetch user data from our users table. Wrapped so a DB blip can't hang
        // hydration — on failure we keep the session and retry on the next auth
        // event. User creation happens server-side in /auth/callback route.
        let userData: any = null
        try {
          const res = await withTimeout(
            supabase.from('users').select('*').eq('auth_user_id', session.user.id).single(),
            AUTH_TIMEOUT_MS, 'refreshSession.users',
          )
          userData = res.data

          // If user not found, create via RPC (fallback for failed callback creation)
          if (!userData) {
            console.log('[auth-store] User not found, creating via ensure_user_exists RPC')
            const { data: rpcResult, error: rpcError } = await withTimeout(
              supabase.rpc('ensure_user_exists', {
                p_email: session.user.email,
                p_avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
                p_full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
              }),
              AUTH_TIMEOUT_MS, 'refreshSession.ensureUser',
            )

            if (rpcError) {
              console.error('[auth-store] Error creating user:', rpcError)
            } else if (rpcResult && !rpcResult.error) {
              userData = rpcResult
              console.log('[auth-store] User created via RPC:', userData?.id)
            }
          }
        } catch (profileErr) {
          // Keep the session — user stays logged in; profile retries on next auth event.
          console.error('[auth-store] profile load failed (keeping session):', profileErr)
        }

        console.log('[auth-store] User data:', userData?.id || 'not found')

        // Show login success banner ONLY on fresh login (OAuth callback)
        const shouldShowBanner = isFreshLogin && session !== null
        console.log('[auth-store] shouldShowBanner:', shouldShowBanner, 'isFreshLogin:', isFreshLogin, 'hasSession:', !!session)

        // Clear the fresh login flag from sessionStorage once we've processed it
        if (shouldShowBanner && typeof window !== 'undefined') {
          sessionStorage.removeItem('ollvy_fresh_login')
        }

        set({
          session,
          user: userData || null,
          isNewUser: userData ? !userData.business_type : true,
          isLoading: false,
          isHydrated: true,
          showLoginSuccessBanner: shouldShowBanner,
        })
      } else {
        // Don't clear fresh login flag here - session might still be loading
        // The flag will be cleared when the banner is successfully shown
        set({
          session: null,
          user: null,
          isLoading: false,
          isHydrated: true,
          isNewUser: false,
        })
      }
    } catch (error) {
      console.error('[auth-store] refreshSession error:', error)
      // Don't clear fresh login flag on error - might retry and succeed
      set({ isLoading: false, isHydrated: true })
    } finally {
      _isRefreshingSession = false
    }
  },

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setIsNewUser: (isNew) => set({ isNewUser: isNew }),
  clearOtpError: () => set({ lastOtpError: null, retryAfter: null }),
  // Modal actions
  openAuthModal: (returnUrl?: string) => set({
    isAuthModalOpen: true,
    authModalStep: 'google',
    authModalPhone: null,
    lastOtpError: null,
    returnUrl: returnUrl ?? (typeof window !== 'undefined' ? window.location.pathname + window.location.search : null),
  }),
  closeAuthModal: () => set({ isAuthModalOpen: false, authModalStep: 'google', authModalPhone: null, lastOtpError: null, returnUrl: null }),
  setAuthModalStep: (step) => set({ authModalStep: step }),
  setAuthModalPhone: (phone) => set({ authModalPhone: phone }),

  // Login success banner
  setShowLoginSuccessBanner: (show) => set({ showLoginSuccessBanner: show }),
  hideLoginSuccessBanner: () => set({ showLoginSuccessBanner: false }),

  // Update user's phone number (called from questionnaire)
  updateUserPhone: async (phone: string) => {
    const { user } = get()
    if (!user) return false

    try {
      const { getClient } = await import('../supabase')
      const supabase = getClient()

      const { error } = await supabase
        .from('users')
        .update({ phone })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating phone:', error)
        return false
      }

      // Update local state
      set({ user: { ...user, phone } })
      return true
    } catch (error) {
      console.error('Error updating phone:', error)
      return false
    }
  },
}))

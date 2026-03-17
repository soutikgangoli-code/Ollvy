import { create } from 'zustand'
import { Session } from '@supabase/supabase-js'
import { getClient, getEdgeFunctionUrl } from '../supabase'

export interface User {
  id: string
  auth_user_id: string
  phone: string
  business_name?: string
  business_type?: string
  gstin?: string
  state?: string
  city?: string
  subscription_tier: string
  compliance_health_score: number
  profile_completeness_score: number
  is_returning: boolean
  avatar_url?: string
  referral_code: string
  referral_credit_paisa: number
  referral_credit_balance_paisa?: number
  created_at: string
}

interface SendOtpResponse {
  sent?: boolean
  error?: string
  retryAfter?: number
  remainingAttempts?: number
  message?: string
}

interface VerifyOtpResponse {
  session?: Session
  user?: User
  isNewUser?: boolean
  error?: string
  message?: string
}

interface AuthState {
  session: Session | null
  user: User | null
  isLoading: boolean
  isNewUser: boolean
  lastOtpError: string | null
  retryAfter: number | null
  remainingAttempts: number | null
}

interface AuthActions {
  sendOtp: (phone: string) => Promise<SendOtpResponse>
  verifyOtp: (phone: string, code: string) => Promise<VerifyOtpResponse>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  setSession: (session: Session | null) => void
  setUser: (user: User | null) => void
  setIsNewUser: (isNew: boolean) => void
  clearOtpError: () => void
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // State
  session: null,
  user: null,
  isLoading: true,
  isNewUser: false,
  lastOtpError: null,
  retryAfter: null,
  remainingAttempts: null,

  // Actions
  sendOtp: async (phone: string) => {
    set({ isLoading: true, lastOtpError: null })

    try {
      const response = await fetch(getEdgeFunctionUrl('send-otp'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      })

      const data: SendOtpResponse = await response.json()

      if (!response.ok || data.error) {
        set({
          isLoading: false,
          lastOtpError: data.error || 'Failed to send OTP',
          retryAfter: data.retryAfter || null,
        })
        return data
      }

      set({
        isLoading: false,
        remainingAttempts: data.remainingAttempts || null,
      })

      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error'
      set({ isLoading: false, lastOtpError: errorMessage })
      return { error: errorMessage }
    }
  },

  verifyOtp: async (phone: string, code: string) => {
    set({ isLoading: true, lastOtpError: null })

    try {
      const response = await fetch(getEdgeFunctionUrl('verify-otp'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp: code }),
      })

      const data: VerifyOtpResponse = await response.json()

      if (!response.ok || data.error) {
        set({
          isLoading: false,
          lastOtpError: data.error || 'Failed to verify OTP',
        })
        return data
      }

      // Set session in Supabase client
      const supabase = getClient()
      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
      }

      set({
        session: data.session || null,
        user: data.user || null,
        isNewUser: data.isNewUser || false,
        isLoading: false,
      })

      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error'
      set({ isLoading: false, lastOtpError: errorMessage })
      return { error: errorMessage }
    }
  },

  logout: async () => {
    set({ isLoading: true })

    try {
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
    set({ isLoading: true })

    try {
      const supabase = getClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // Fetch user data from our users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single()

        set({
          session,
          user: userData || null,
          isNewUser: userData ? !userData.business_type : true,
          isLoading: false,
        })
      } else {
        set({
          session: null,
          user: null,
          isLoading: false,
          isNewUser: false,
        })
      }
    } catch (error) {
      console.error('Refresh session error:', error)
      set({ isLoading: false })
    }
  },

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setIsNewUser: (isNew) => set({ isNewUser: isNew }),
  clearOtpError: () => set({ lastOtpError: null, retryAfter: null }),
}))

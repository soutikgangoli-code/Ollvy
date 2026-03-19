'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'

export default function VerifyPage() {
  const router = useRouter()
  const { openAuthModal, setAuthModalStep, setAuthModalPhone, session } = useAuthStore()

  useEffect(() => {
    // If already logged in, redirect to home
    if (session) {
      router.replace('/')
      return
    }

    // Check if there's a phone in session storage (from old flow)
    const storedPhone = sessionStorage.getItem('auth_phone')

    if (storedPhone) {
      // Open modal first, then set to OTP step with the stored phone
      openAuthModal()
      // Set after openAuthModal since it resets state
      setAuthModalPhone(storedPhone)
      setAuthModalStep('otp')

      // Clean up session storage
      sessionStorage.removeItem('auth_phone')
      sessionStorage.removeItem('auth_returnUrl')
    } else {
      // No phone stored, just open modal at phone step
      openAuthModal()
    }

    // Redirect to home (modal will be open)
    router.replace('/')
  }, [session, openAuthModal, setAuthModalStep, setAuthModalPhone, router])

  // Show nothing while redirecting
  return null
}

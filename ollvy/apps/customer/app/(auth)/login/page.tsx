'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/'
  const { openAuthModal, session, isHydrated } = useAuthStore()

  useEffect(() => {
    // Wait for auth store to hydrate
    if (!isHydrated) return

    // If logged in, redirect to return URL
    if (session) {
      router.replace(returnUrl)
      return
    }

    // Not logged in - open the auth modal and stay on this page
    // When auth completes, session will become truthy and we'll redirect
    openAuthModal(returnUrl)
  }, [session, isHydrated, openAuthModal, router, returnUrl])

  // Show a minimal loading state while on login page
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        {isHydrated && !session ? 'Please sign in to continue' : 'Redirecting...'}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}

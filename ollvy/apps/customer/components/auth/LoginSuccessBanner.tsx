'use client'

import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'

export function LoginSuccessBanner() {
  const { session, showLoginSuccessBanner, hideLoginSuccessBanner } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Get the user's name from Google OAuth metadata
  const userName = session?.user?.user_metadata?.full_name ||
                   session?.user?.user_metadata?.name ||
                   null

  // Debug: Log session metadata to see what Google provides
  if (showLoginSuccessBanner && session) {
    console.log('[LoginSuccessBanner] user_metadata:', session.user?.user_metadata)
  }

  // Handle mount animation and auto-dismiss
  useEffect(() => {
    if (showLoginSuccessBanner) {
      // Small delay for slide-in animation
      const mountTimer = setTimeout(() => {
        setMounted(true)
        setIsVisible(true)
      }, 100)

      // Auto-dismiss after 4 seconds
      const dismissTimer = setTimeout(() => {
        handleDismiss()
      }, 4000)

      return () => {
        clearTimeout(mountTimer)
        clearTimeout(dismissTimer)
      }
    } else {
      setMounted(false)
      setIsVisible(false)
    }
  }, [showLoginSuccessBanner])

  const handleDismiss = () => {
    setIsVisible(false)
    // Wait for slide-out animation before hiding
    setTimeout(() => {
      setMounted(false)
      hideLoginSuccessBanner()
    }, 300)
  }

  if (!showLoginSuccessBanner && !mounted) return null

  return (
    <div
      className={cn(
        'fixed top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4',
        'transition-all duration-300 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      )}
    >
      <div className="bg-card border border-border rounded-xl shadow-lg p-4">
        <div className="flex items-center gap-4">
          {/* Green checkmark */}
          <div
            className={cn(
              'w-10 h-10 rounded-full bg-[hsl(var(--ollvy-green))] flex items-center justify-center flex-shrink-0 transition-all duration-500',
              isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            )}
          >
            <Check className="h-5 w-5 text-white stroke-[3]" />
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-widest text-[hsl(var(--ollvy-green))] font-mono mb-0.5">
              SIGNED IN
            </p>
            <p className="text-sm font-medium text-foreground truncate">
              {userName ? `Welcome, ${userName}!` : 'You have signed in successfully'}
            </p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}

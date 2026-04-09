'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, Suspense, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

let posthogInitialized = false

function initPostHog() {
  if (posthogInitialized || !POSTHOG_KEY) return
  posthogInitialized = true
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') {
        ph.debug()
      }
    },
  })
}

// Component to track page views
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthogClient = usePostHog()

  useEffect(() => {
    if (pathname && posthogClient) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }
      posthogClient.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams, posthogClient])

  return null
}

// Wrapper with Suspense for useSearchParams
function SuspendedPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    // Defer PostHog init until after page is interactive
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => initPostHog())
    } else {
      setTimeout(() => initPostHog(), 2000)
    }
  }, [])

  if (!POSTHOG_KEY) {
    return <>{children}</>
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPageView />
      {children}
    </PHProvider>
  )
}

// Export posthog instance for direct usage
export { posthog }

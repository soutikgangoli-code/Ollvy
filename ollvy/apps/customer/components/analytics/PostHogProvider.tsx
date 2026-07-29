'use client'

import { useEffect, Suspense, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { posthog, schedulePostHogLoad } from '@/lib/analytics/posthog-lite'

// Component to track page views. Captures go through the lazy facade, which
// queues them until the posthog-js core loads on idle — nothing is lost.
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }
      posthog.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams])

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
    schedulePostHogLoad()
  }, [])

  return (
    <>
      <SuspendedPageView />
      {children}
    </>
  )
}

// Re-export the lazy facade so existing `import { posthog }` call sites keep working
export { posthog }

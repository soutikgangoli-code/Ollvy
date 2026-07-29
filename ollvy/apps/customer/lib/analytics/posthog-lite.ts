'use client'

/**
 * Lazy PostHog facade. The real posthog-js core (~50 KiB gzipped) stays out of
 * the shared first-load bundle: it is dynamic-imported on browser idle, and any
 * calls made before that are queued and flushed after init. Import `posthog`
 * from here instead of 'posthog-js' anywhere in client code.
 */

import type { PostHog } from 'posthog-js'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

let client: PostHog | null = null
let loadStarted = false
const queue: Array<(ph: PostHog) => void> = []

function enqueue(fn: (ph: PostHog) => void) {
  if (client) {
    fn(client)
  } else if (POSTHOG_KEY) {
    queue.push(fn)
  }
}

/** Queue-backed subset of the PostHog API used across the app. */
export const posthog = {
  capture: (event: string, properties?: Record<string, unknown>) =>
    enqueue((ph) => ph.capture(event, properties)),
  identify: (distinctId: string, properties?: Record<string, unknown>) =>
    enqueue((ph) => ph.identify(distinctId, properties)),
  reset: () => enqueue((ph) => ph.reset()),
  register: (properties: Record<string, unknown>) => enqueue((ph) => ph.register(properties)),
}

function detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua) || (window.innerWidth >= 768 && window.innerWidth <= 1024 && 'ontouchstart' in window)
  if (isTablet) return 'tablet'
  const isMobile = /Mobi|Android|iPhone|iPod|BlackBerry|Opera Mini|IEMobile/i.test(ua) || window.innerWidth < 768
  return isMobile ? 'mobile' : 'desktop'
}

async function loadAndInit() {
  if (loadStarted || !POSTHOG_KEY) return
  loadStarted = true

  const { default: ph } = await import('posthog-js')
  ph.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    session_recording: {
      maskAllInputs: true,
      maskInputOptions: { password: true, email: true },
    },
    disable_session_recording: false,
    loaded: (instance) => {
      // Tag every event with device_type so funnels can split mobile vs desktop
      instance.register({
        device_type: detectDeviceType(),
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
      })
      if (process.env.NODE_ENV === 'development') {
        instance.debug()
      }
    },
  })
  // init() is synchronous; posthog-js buffers internally until its remote
  // config arrives. Flush our queue now (incl. any $pageview captured early).
  client = ph
  queue.splice(0).forEach((fn) => fn(ph))
}

/** Kick off the deferred load. Safe to call more than once. */
export function schedulePostHogLoad() {
  if (loadStarted || !POSTHOG_KEY || typeof window === 'undefined') return
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => loadAndInit())
  } else {
    setTimeout(() => loadAndInit(), 2000)
  }
}

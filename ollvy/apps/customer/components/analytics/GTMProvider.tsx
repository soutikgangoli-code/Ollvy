'use client'

import { useEffect, useRef } from 'react'

// Replace with your actual GTM Container ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'

function gtmEnabled() {
  return Boolean(GTM_ID) && GTM_ID !== 'GTM-XXXXXXX'
}

// Inject the GTM container exactly once. Any dataLayer.push() calls that happened
// before this runs (view_item, begin_checkout, purchase, etc.) are buffered on
// window.dataLayer and processed by GTM as soon as gtm.js finishes loading.
function loadGTM() {
  const w = window as unknown as {
    dataLayer?: unknown[]
    __gtmLoaded?: boolean
  }
  if (w.__gtmLoaded) return
  w.__gtmLoaded = true

  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(script)
}

/**
 * Loads GTM off the critical path — on the first user interaction OR when the
 * browser goes idle, whichever comes first. This keeps ~450 KiB of GTM/gtag JS
 * and its main-thread cost out of the initial page render (big mobile TBT win),
 * while still firing for bouncers via the idle timeout + visibility backstop.
 */
export function GTMProvider() {
  const started = useRef(false)

  useEffect(() => {
    if (!gtmEnabled() || started.current) return
    started.current = true

    let done = false
    const interactionEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart']
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const cleanup = () => {
      interactionEvents.forEach((e) => window.removeEventListener(e, trigger))
      document.removeEventListener('visibilitychange', onHidden)
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        ;(window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId)
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }

    function trigger() {
      if (done) return
      done = true
      cleanup()
      loadGTM()
    }

    const onHidden = () => {
      // Catch fast bouncers before they leave so pageviews still register.
      if (document.visibilityState === 'hidden') trigger()
    }

    interactionEvents.forEach((e) =>
      window.addEventListener(e, trigger, { once: true, passive: true })
    )
    document.addEventListener('visibilitychange', onHidden)

    if ('requestIdleCallback' in window) {
      idleId = (
        window as unknown as {
          requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number
        }
      ).requestIdleCallback(trigger, { timeout: 4000 })
    } else {
      timeoutId = setTimeout(trigger, 3000)
    }

    return cleanup
  }, [])

  return null
}

export function GTMNoScript() {
  if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') {
    return null
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}

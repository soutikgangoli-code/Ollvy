'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { usePostHogEvents } from '@/lib/hooks/usePostHogEvents'

interface TrackedSectionProps {
  /** Stable section id used as the analytics key, e.g. "hero", "services_grid", "faqs" */
  id: string
  /** Human-readable label shown in PostHog dashboards, e.g. "Hero", "Service Grid" */
  label: string
  /** Component name being tracked, e.g. "Hero", "ServiceGrid", "HomeFAQ" */
  component: string
  /** Page bucket: "homepage" | "service" | "tool" | "guide" | "checkout" */
  pageType: string
  /** Optional extra properties merged into both events */
  properties?: Record<string, unknown>
  /** Min dwell ms before section_dwell_time fires (filters scroll-throughs). Default 3000. */
  dwellThresholdMs?: number
  /** If false, render no wrapping element — children are wrapped in a span. Default false (uses div). */
  asSpan?: boolean
  className?: string
  children: ReactNode
}

/**
 * Wraps a page section with PostHog analytics:
 *   - Fires `section_viewed` once per pageview when the section first enters the viewport.
 *   - Fires `section_dwell_time` (with `dwell_ms`) when the section leaves the viewport,
 *     unmounts, or the page is hidden — provided dwell exceeded the threshold.
 *
 * Designed to be safe to drop into server components (the wrapper itself is client-only).
 */
export function TrackedSection({
  id,
  label,
  component,
  pageType,
  properties,
  dwellThresholdMs = 3000,
  asSpan = false,
  className,
  children,
}: TrackedSectionProps) {
  const { trackSectionView, trackSectionDwellTime } = usePostHogEvents()
  const ref = useRef<HTMLDivElement | HTMLSpanElement | null>(null)
  const enteredAtRef = useRef<number | null>(null)
  const viewedThisPageRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const flushDwell = () => {
      if (enteredAtRef.current == null) return
      const dwellMs = Date.now() - enteredAtRef.current
      enteredAtRef.current = null
      if (dwellMs >= dwellThresholdMs) {
        trackSectionDwellTime(id, dwellMs, pageType, {
          section_label: label,
          component,
          ...properties,
        })
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          enteredAtRef.current = Date.now()
          if (!viewedThisPageRef.current) {
            viewedThisPageRef.current = true
            trackSectionView(id, pageType, {
              section_label: label,
              component,
              ...properties,
            })
          }
        } else {
          flushDwell()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)

    const onPageHide = () => flushDwell()
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushDwell()
    }
    window.addEventListener('pagehide', onPageHide)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      flushDwell()
      observer.disconnect()
      window.removeEventListener('pagehide', onPageHide)
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, label, component, pageType, dwellThresholdMs])

  const Tag = asSpan ? 'span' : 'div'
  return (
    <Tag ref={ref as any} className={className} data-tracked-section={id}>
      {children}
    </Tag>
  )
}

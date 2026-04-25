'use client'

import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'

/**
 * Custom hook for PostHog analytics events
 * Provides typed methods for common tracking scenarios
 */
export function usePostHogEvents() {
  const posthog = usePostHog()

  // Track a custom event
  const trackEvent = useCallback(
    (eventName: string, properties?: Record<string, unknown>) => {
      posthog?.capture(eventName, properties)
    },
    [posthog]
  )

  // Track service view
  const trackServiceView = useCallback(
    (
      serviceId: string,
      serviceName: string,
      price?: number,
      properties?: Record<string, unknown>
    ) => {
      posthog?.capture('service_viewed', {
        service_id: serviceId,
        service_name: serviceName,
        price,
        ...properties,
      })
    },
    [posthog]
  )

  // Track service card click (homepage grid, /services index, related services)
  const trackServiceCardClick = useCallback(
    (serviceSlug: string, source: string, properties?: Record<string, unknown>) => {
      posthog?.capture('service_card_clicked', {
        service_slug: serviceSlug,
        source,
        ...properties,
      })
    },
    [posthog]
  )

  // Track checkout CTA click (the "Start Application" button on service page)
  const trackCheckoutCTAClick = useCallback(
    (serviceSlug: string, properties?: Record<string, unknown>) => {
      posthog?.capture('checkout_cta_clicked', {
        service_slug: serviceSlug,
        ...properties,
      })
    },
    [posthog]
  )

  // Track payment initiated (Razorpay modal opened)
  const trackPaymentInitiated = useCallback(
    (
      orderId: string,
      serviceId: string,
      serviceName: string,
      price: number,
      properties?: Record<string, unknown>
    ) => {
      posthog?.capture('payment_initiated', {
        order_id: orderId,
        service_id: serviceId,
        service_name: serviceName,
        price,
        ...properties,
      })
    },
    [posthog]
  )

  // Track section visibility (which page sections were actually viewed)
  const trackSectionView = useCallback(
    (sectionId: string, pageType: string, properties?: Record<string, unknown>) => {
      posthog?.capture('section_viewed', {
        section_id: sectionId,
        page_type: pageType,
        ...properties,
      })
    },
    [posthog]
  )

  // Track how long a section was actually visible (filters out scroll-throughs upstream)
  const trackSectionDwellTime = useCallback(
    (
      sectionId: string,
      dwellMs: number,
      pageType: string,
      properties?: Record<string, unknown>
    ) => {
      posthog?.capture('section_dwell_time', {
        section_id: sectionId,
        dwell_ms: dwellMs,
        dwell_seconds: Math.round(dwellMs / 1000),
        page_type: pageType,
        ...properties,
      })
    },
    [posthog]
  )

  // Track tool interaction (calculators, eligibility, document checklists)
  const trackToolInteraction = useCallback(
    (
      toolType: string,
      toolSlug: string,
      action: 'input_changed' | 'result_shown' | 'cta_clicked',
      properties?: Record<string, unknown>
    ) => {
      posthog?.capture('tool_interaction', {
        tool_type: toolType,
        tool_slug: toolSlug,
        action,
        ...properties,
      })
    },
    [posthog]
  )

  // Track checkout started
  const trackCheckoutStarted = useCallback(
    (serviceId: string, serviceName: string, price: number) => {
      posthog?.capture('checkout_started', {
        service_id: serviceId,
        service_name: serviceName,
        price,
      })
    },
    [posthog]
  )

  // Track purchase completed
  const trackPurchase = useCallback(
    (
      orderId: string,
      serviceId: string,
      serviceName: string,
      price: number,
      currency: string = 'INR'
    ) => {
      posthog?.capture('purchase_completed', {
        order_id: orderId,
        service_id: serviceId,
        service_name: serviceName,
        price,
        currency,
      })
    },
    [posthog]
  )

  // Track button click
  const trackButtonClick = useCallback(
    (buttonName: string, location?: string, properties?: Record<string, unknown>) => {
      posthog?.capture('button_clicked', {
        button_name: buttonName,
        location,
        ...properties,
      })
    },
    [posthog]
  )

  return {
    posthog,
    trackEvent,
    trackServiceView,
    trackServiceCardClick,
    trackCheckoutCTAClick,
    trackCheckoutStarted,
    trackPaymentInitiated,
    trackPurchase,
    trackButtonClick,
    trackSectionView,
    trackSectionDwellTime,
    trackToolInteraction,
  }
}

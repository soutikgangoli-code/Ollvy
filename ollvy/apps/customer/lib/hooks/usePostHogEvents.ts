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
    (serviceId: string, serviceName: string, price?: number) => {
      posthog?.capture('service_viewed', {
        service_id: serviceId,
        service_name: serviceName,
        price,
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
    trackCheckoutStarted,
    trackPurchase,
    trackButtonClick,
  }
}

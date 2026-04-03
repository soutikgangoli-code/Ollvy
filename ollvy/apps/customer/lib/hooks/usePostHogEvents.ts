'use client'

import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'

/**
 * Custom hook for PostHog analytics events
 * Provides typed methods for common tracking scenarios
 */
export function usePostHogEvents() {
  const posthog = usePostHog()

  // Identify a user (call after login)
  const identifyUser = useCallback(
    (userId: string, properties?: Record<string, unknown>) => {
      posthog?.identify(userId, properties)
    },
    [posthog]
  )

  // Reset user identity (call on logout)
  const resetUser = useCallback(() => {
    posthog?.reset()
  }, [posthog])

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

  // Track form submission
  const trackFormSubmit = useCallback(
    (formName: string, formData?: Record<string, unknown>) => {
      posthog?.capture('form_submitted', {
        form_name: formName,
        ...formData,
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

  // Track signup
  const trackSignup = useCallback(
    (method: string, userId?: string) => {
      posthog?.capture('user_signed_up', {
        method,
        user_id: userId,
      })
    },
    [posthog]
  )

  // Track login
  const trackLogin = useCallback(
    (method: string, userId?: string) => {
      posthog?.capture('user_logged_in', {
        method,
        user_id: userId,
      })
    },
    [posthog]
  )

  // Set user properties
  const setUserProperties = useCallback(
    (properties: Record<string, unknown>) => {
      posthog?.setPersonProperties(properties)
    },
    [posthog]
  )

  return {
    posthog,
    identifyUser,
    resetUser,
    trackEvent,
    trackServiceView,
    trackCheckoutStarted,
    trackPurchase,
    trackFormSubmit,
    trackButtonClick,
    trackSignup,
    trackLogin,
    setUserProperties,
  }
}

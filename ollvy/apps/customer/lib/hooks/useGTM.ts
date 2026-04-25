'use client'

/**
 * Google Tag Manager Data Layer Hook
 * Provides methods to push e-commerce and custom events to GTM
 *
 * Events follow Google's GA4 e-commerce specification:
 * https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

interface ServiceItem {
  item_id: string
  item_name: string
  item_category?: string
  price: number // In rupees (not paisa)
  quantity?: number
}

interface PurchaseData {
  transaction_id: string
  value: number // Total in rupees
  currency?: string
  items: ServiceItem[]
}

interface CheckoutData {
  value: number
  currency?: string
  items: ServiceItem[]
}

/**
 * Push event to GTM data layer
 */
function pushToDataLayer(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event,
    ...data,
  })

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[GTM Event]', event, data)
  }
}

/**
 * Clear e-commerce data before pushing new event
 * Recommended by Google to prevent data bleed between events
 */
function clearEcommerce() {
  pushToDataLayer('clear_ecommerce', { ecommerce: null })
}

export function useGTM() {
  /**
   * Track when user views a service page
   * GA4 Event: view_item
   */
  const trackViewService = (service: {
    id: string
    name: string
    slug: string
    category?: string
    price: number // In paisa
  }) => {
    clearEcommerce()
    pushToDataLayer('view_item', {
      ecommerce: {
        currency: 'INR',
        value: service.price / 100,
        items: [
          {
            item_id: service.id,
            item_name: service.name,
            item_category: service.category || 'Services',
            price: service.price / 100,
            quantity: 1,
          },
        ],
      },
    })
  }

  /**
   * Track when user starts checkout
   * GA4 Event: begin_checkout
   */
  const trackBeginCheckout = (data: CheckoutData) => {
    clearEcommerce()
    pushToDataLayer('begin_checkout', {
      ecommerce: {
        currency: data.currency || 'INR',
        value: data.value,
        items: data.items.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        })),
      },
    })
  }

  /**
   * Track when user initiates payment
   * GA4 Event: add_payment_info
   */
  const trackAddPaymentInfo = (data: CheckoutData & { payment_type?: string }) => {
    clearEcommerce()
    pushToDataLayer('add_payment_info', {
      ecommerce: {
        currency: data.currency || 'INR',
        value: data.value,
        payment_type: data.payment_type || 'Razorpay',
        items: data.items.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        })),
      },
    })
  }

  /**
   * Track successful purchase
   * GA4 Event: purchase
   * This is the main conversion event for Google Ads
   */
  const trackPurchase = (data: PurchaseData) => {
    clearEcommerce()
    pushToDataLayer('purchase', {
      ecommerce: {
        transaction_id: data.transaction_id,
        value: data.value,
        currency: data.currency || 'INR',
        items: data.items.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        })),
      },
    })
  }

  return {
    trackViewService,
    trackBeginCheckout,
    trackAddPaymentInfo,
    trackPurchase,
  }
}

/**
 * Utility to convert paisa to rupees for GTM
 */
export function paisaToRupees(paisa: number): number {
  return paisa / 100
}

/**
 * Cross-page eager-order cache.
 *
 * Lets /eligibility fire create-razorpay-order in the background as the user
 * clicks Continue, and lets /checkout consume the result on mount instead of
 * firing its own duplicate request. SPA navigation preserves this module's
 * state, so the in-flight Promise and cached result survive router.push.
 *
 * Cleared on hard reload (module state is lost). Cleared explicitly when
 * /checkout adopts the order so we don't accidentally reuse a stale one.
 */

export interface PreCreatedOrder {
  orderId: string
  orderNumber: string
  razorpayOrderId: string
  amount: number
  fingerprint: string
  createdAt: number
}

let cached: PreCreatedOrder | null = null
let inflight: Promise<PreCreatedOrder | null> | null = null

const MAX_AGE_MS = 5 * 60 * 1000 // 5 minutes — Razorpay orders live for 24h, but
// stale ones risk pricing-config drift if the user changes anything on /checkout

export function getCachedPreCreatedOrder(): PreCreatedOrder | null {
  if (cached && Date.now() - cached.createdAt > MAX_AGE_MS) {
    cached = null
  }
  return cached
}

export function getInflightPreCreatedOrder(): Promise<PreCreatedOrder | null> | null {
  return inflight
}

export function clearCachedPreCreatedOrder() {
  cached = null
}

interface FireOptions {
  supabaseUrl: string
  accessToken: string
  servicePackageId: string
  userId: string
  variantId: string | null
  addonIds: string[]
  preCursorAnswers: Record<string, unknown>
  attribution: {
    utm?: {
      utm_source?: string
      utm_medium?: string
      utm_campaign?: string
      utm_content?: string
      utm_term?: string
    } | null
    referralCode?: string | null
    landingPage?: string | null
  }
}

/**
 * Fire create-razorpay-order in the background. Result lands in `cached`
 * for /checkout to pick up. Caller passes the fingerprint /checkout will
 * compute on mount so we can verify a match before adopting.
 */
export function firePreCreateOrder(opts: FireOptions, fingerprint: string): Promise<PreCreatedOrder | null> {
  // Already have a fresh cache for this exact config — no work to do.
  if (cached && cached.fingerprint === fingerprint && Date.now() - cached.createdAt < MAX_AGE_MS) {
    return Promise.resolve(cached)
  }

  const promise: Promise<PreCreatedOrder | null> = (async (): Promise<PreCreatedOrder | null> => {
    const t0 = performance.now()
    try {
      const response = await fetch(`${opts.supabaseUrl}/functions/v1/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${opts.accessToken}`,
        },
        body: JSON.stringify({
          service_package_id: opts.servicePackageId,
          user_id: opts.userId,
          variant_id: opts.variantId || undefined,
          addon_ids: opts.addonIds.length > 0 ? opts.addonIds : undefined,
          engagement_agreed: true,
          pre_cursor_answers:
            Object.keys(opts.preCursorAnswers).length > 0 ? opts.preCursorAnswers : undefined,
          utm_source: opts.attribution.utm?.utm_source,
          utm_medium: opts.attribution.utm?.utm_medium,
          utm_campaign: opts.attribution.utm?.utm_campaign,
          utm_content: opts.attribution.utm?.utm_content,
          utm_term: opts.attribution.utm?.utm_term,
          referral_code: opts.attribution.referralCode,
          landing_page: opts.attribution.landingPage,
        }),
        keepalive: true,
      })
      const data = await response.json()
      if (!response.ok || data.error || !data.razorpay_order_id) {
        console.log(
          `[pre-create] failed in ${Math.round(performance.now() - t0)}ms — ${data.error ?? response.status}`
        )
        return null
      }
      const order: PreCreatedOrder = {
        orderId: data.order_id,
        orderNumber: data.order_number,
        razorpayOrderId: data.razorpay_order_id,
        amount: data.amount,
        fingerprint,
        createdAt: Date.now(),
      }
      cached = order
      console.log(
        `[pre-create] order ready in ${Math.round(performance.now() - t0)}ms (${order.razorpayOrderId})`
      )
      return order
    } catch (e: unknown) {
      const errorName = e instanceof Error ? e.name : 'unknown'
      console.log(`[pre-create] exception in ${Math.round(performance.now() - t0)}ms — ${errorName}`)
      return null
    }
  })()

  inflight = promise
  // Clear inflight when this promise settles (but only if it's still the
  // current one — a newer call may have replaced it).
  promise.finally(() => {
    if (inflight === promise) {
      inflight = null
    }
  })
  return promise
}

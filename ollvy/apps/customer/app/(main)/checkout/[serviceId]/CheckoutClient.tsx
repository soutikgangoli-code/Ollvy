'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { ArrowLeft, Loader2, ArrowRight, Check, X, ChevronDown, ChevronUp, CheckCircle, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getClient } from '@/lib/supabase'
import { withTimeout, AUTH_TIMEOUT_MS } from '@/lib/with-timeout'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getFullAttributionData, clearAllAttributionData } from '@/lib/utm'
import { getPreCursorAnswers, clearPreCursorAnswers } from '@/lib/pre-cursor'
import {
  getCachedPreCreatedOrder,
  getInflightPreCreatedOrder,
  clearCachedPreCreatedOrder,
} from '@/lib/checkout-warmup'
import { isEligibilityFlow } from '@/lib/services/eligibility'
import type { ServicePackage, ServiceAddon, ServiceVariant } from '@/lib/types'
import { cn } from '@/lib/utils'
import { getCompletionEstimate } from '@/lib/dates'
import { useToast } from '@/lib/hooks/use-toast'
import { getWhatsAppLink, getPhoneLink } from '@/lib/constants'
import { fetchWithTimeout, TIMEOUTS } from '@/lib/fetch-with-timeout'
import { useGTM, paisaToRupees } from '@/lib/hooks/useGTM'
import { usePostHogEvents } from '@/lib/hooks/usePostHogEvents'

import dynamic from 'next/dynamic'
import {
  CheckoutStepper,
  FilingTimeline,
  AddOnsSection,
  WhatsIncludedCard,
  WhatsNotIncludedCard,
} from '@/components/checkout'
import { DocumentChecklist } from '@/components/landing/DocumentChecklist'

// Below-fold modals - only rendered after user triggers payment / success / dismissal.
// Import the module file directly — the barrel (@/components/checkout) pulls every
// re-exported component into the initial chunk and defeats code-splitting.
const PaymentSuccessModal = dynamic(
  () => import('@/components/checkout/PaymentSuccessModal').then((m) => m.PaymentSuccessModal),
  { ssr: false }
)
const PaymentRetryModal = dynamic(
  () => import('@/components/checkout/PaymentSuccessModal').then((m) => m.PaymentRetryModal),
  { ssr: false }
)

interface PriceBreakdown {
  serviceFee: number
  govtFees: number
  addonsTotal: number
  gst: number
  gstRate: number
  promoDiscount: number
  total: number
}

// Session storage helpers for checkout persistence
const CHECKOUT_STATE_KEY = 'ollvy_checkout_state'


// Cloud kitchen add-on display labels for "What's Included" section
const CLOUD_KITCHEN_ADDON_LABELS: Record<string, string> = {
  'gst-registration': 'GST Registration',
  'shop-establishment': 'Shop & Establishment Registration',
  'trade-license': 'Trade Licence / Eating House Licence',
}

interface CheckoutState {
  serviceId: string
  variant: string | null
  addons: string[]
  promoCode: string
  timestamp: number
}

function saveCheckoutState(state: CheckoutState) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify(state))
  } catch (e) {
    // sessionStorage might be full or disabled
  }
}

function getCheckoutState(serviceId: string): CheckoutState | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = sessionStorage.getItem(CHECKOUT_STATE_KEY)
    if (!stored) return null
    const state = JSON.parse(stored) as CheckoutState
    // Only use if it's for the same service and less than 1 hour old
    if (state.serviceId === serviceId && Date.now() - state.timestamp < 3600000) {
      return state
    }
    return null
  } catch (e) {
    return null
  }
}

function clearCheckoutState() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(CHECKOUT_STATE_KEY)
  } catch (e) {
    // ignore
  }
}

function formatPrice(paisa: number): string {
  return '\u20B9' + Math.ceil(paisa / 100).toLocaleString('en-IN')
}

// Snapshot of an order pre-created in the background while the user is still on
// the checkout page, so the Pay click can skip the ~2s create-razorpay-order
// roundtrip and open the Razorpay modal almost instantly. The fingerprint
// captures every input that affects price (variant, addons, promo); if the user
// changes any of them, the existing eager order becomes stale and we fire a new
// one. Stale eager orders sit in the DB at status='pending_payment' until a
// cleanup job (or Razorpay's 24h auto-expiry) marks them abandoned.
interface EagerOrder {
  orderId: string
  orderNumber: string
  razorpayOrderId: string
  amount: number
  fingerprint: string
}

interface CheckoutClientProps {
  initialService: ServicePackage
  serviceId: string
}

export default function CheckoutClient({ initialService, serviceId }: CheckoutClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, session, isHydrated, openAuthModal, isAuthModalOpen } = useAuthStore()
  const { toast } = useToast()
  const { trackBeginCheckout, trackAddPaymentInfo, trackPurchase } = useGTM()
  const {
    trackCheckoutStarted,
    trackPaymentInitiated,
    trackEvent,
  } = usePostHogEvents()

  // Service is server-fetched and passed in as prop — guaranteed non-null.
  const service = initialService
  const [hasTrackedCheckout, setHasTrackedCheckout] = useState(false)

  // Read variant and addons from URL params (passed from BookingPanel)
  const variantFromUrl = searchParams.get('variant')
  const addonsFromUrl = searchParams.get('addons')

  // Selected variant (from URL or default)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  // Add-ons - initialize from URL params or service defaults
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([])

  // Promo code
  const [promoCode, setPromoCode] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null)

  // Payment
  const [isProcessing, setIsProcessing] = useState(false)
  const [razorpayReady, setRazorpayReady] = useState(false)


  // Success modal
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean
    orderId: string
    orderNumber: string
  } | null>(null)

  // Retry modal (shown when user dismisses Razorpay without paying)
  const [showRetryModal, setShowRetryModal] = useState(false)

  // Razorpay instance ref (for retry functionality)
  const razorpayRef = useRef<any>(null)

  // Eager pre-created order. See EagerOrder type comment for rationale.
  // Ref because we never need to re-render on its change — only consume it
  // synchronously inside handleCheckout.
  const eagerOrderRef = useRef<EagerOrder | null>(null)
  const eagerInflightRef = useRef<Promise<EagerOrder | null> | null>(null)

  // Track if we've shown the initial auth prompt (don't keep re-opening if user dismisses)
  const [hasShownAuthPrompt, setHasShownAuthPrompt] = useState(false)

  // Pre-cursor answers from eligibility page (stored in sessionStorage).
  // `preCursorReady` flips true after the first load attempt completes — used to
  // gate the eager-order effect so it doesn't fire twice (once with empty
  // answers, once with the real ones) and waste a cold-start round-trip.
  const [preCursorAnswers, setPreCursorAnswers] = useState<Record<string, unknown>>({})
  const [preCursorReady, setPreCursorReady] = useState(false)

  // Service data is now provided by the server component — no client fetch needed.

  // Check if Razorpay is already loaded (e.g., from cache)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      setRazorpayReady(true)
    }
  }, [])

  // Warm up the create-razorpay-order edge function once the user has a
  // session. The Deno isolate is cold after ~30s of inactivity; without a
  // warmup the user's Pay click pays a 1-3s cold-start penalty. We send a
  // POST authenticated with the user's real JWT carrying X-Warmup: 1. The
  // function's X-Warmup short-circuit returns 204 immediately — no DB
  // queries, no inner JWT parsing — just the isolate spinning up so the
  // real Pay click hits a hot function.
  //
  // Why we wait for session.access_token: Supabase's gateway with
  // verify_jwt:true rejects anon-role JWTs at the gateway level (they lack
  // the user claim). Sending the anon key returned 401 BEFORE the function
  // ran, so the X-Warmup short-circuit was dead code. The user's real JWT
  // passes the gateway and reaches the function.
  const hasWarmedRef = useRef(false)
  useEffect(() => {
    if (hasWarmedRef.current) return
    if (!isHydrated) return
    const accessToken = session?.access_token
    if (!accessToken) return
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url) return
    hasWarmedRef.current = true

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)
    const warmupStart = performance.now()
    console.log('[checkout-perf] warmup: starting POST with user JWT')
    fetch(`${url}/functions/v1/create-razorpay-order`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Warmup': '1',
      },
      body: '{}',
      signal: controller.signal,
      keepalive: true,
    })
      .then((r) =>
        console.log(
          `[checkout-perf] warmup: HTTP ${r.status} in ${Math.round(performance.now() - warmupStart)}ms (expect 204)`
        )
      )
      .catch((e) =>
        console.log(
          `[checkout-perf] warmup: failed in ${Math.round(performance.now() - warmupStart)}ms — ${e?.name ?? 'unknown'}`
        )
      )
      .finally(() => clearTimeout(timeoutId))
  }, [isHydrated, session?.access_token])

  // Open auth modal once on initial load if user is not logged in
  useEffect(() => {
    if (!isHydrated) return
    if (!user && !hasShownAuthPrompt) {
      openAuthModal()
      setHasShownAuthPrompt(true)
    }
  }, [user, isHydrated, hasShownAuthPrompt, openAuthModal])

  // Load pre-cursor answers from sessionStorage when service is available.
  // Flip preCursorReady afterward so the eager-order effect fires exactly once
  // with the final fingerprint.
  useEffect(() => {
    if (!service) return
    const stored = getPreCursorAnswers(service.slug)
    if (stored) {
      setPreCursorAnswers(stored)
    }
    setPreCursorReady(true)
  }, [service])

  // Initialize variant and addons from sessionStorage, URL params, or service defaults
  useEffect(() => {
    if (!service) return

    // Check sessionStorage first for persisted state
    const savedState = getCheckoutState(service.id)

    // Initialize variant
    if (service.variants && service.variants.length > 0) {
      // Priority: sessionStorage > URL params > service default
      let variant: string | null = null

      if (savedState?.variant && service.variants.some(v => v.id === savedState.variant)) {
        variant = savedState.variant
      } else if (variantFromUrl && service.variants.some(v => v.id === variantFromUrl)) {
        variant = variantFromUrl
      } else {
        variant = service.variants[0].id
      }
      setSelectedVariant(variant)
    }

    // Initialize addons
    if (service.addons && service.addons.length > 0) {
      let addonIds: string[] = []

      if (savedState?.addons && savedState.addons.length > 0) {
        // Use saved addons (filter to valid ones)
        addonIds = savedState.addons.filter(id => service.addons?.some(a => a.id === id))
      } else if (addonsFromUrl) {
        // Use addons from URL
        addonIds = addonsFromUrl.split(',').filter(id => service.addons?.some(a => a.id === id))
      } else {
        // Use default selections from service config (defaultSelected or required)
        addonIds = service.addons
          .filter(addon => addon.defaultSelected || addon.required)
          .map(addon => addon.id)
      }
      setSelectedAddonIds(addonIds)
    }

    // Restore promo code if saved
    if (savedState?.promoCode) {
      setPromoCode(savedState.promoCode)
    }
  }, [service, variantFromUrl, addonsFromUrl])

  // Save checkout state whenever selections change
  useEffect(() => {
    if (!service) return
    saveCheckoutState({
      serviceId: service.id,
      variant: selectedVariant,
      addons: selectedAddonIds,
      promoCode: promoCode,
      timestamp: Date.now(),
    })
  }, [service, selectedVariant, selectedAddonIds, promoCode])

  // Track begin_checkout in GTM when service is loaded
  useEffect(() => {
    if (!service || hasTrackedCheckout) return

    const totalPaisa = service.price_base_paisa + (service.price_govt_fees_paisa || 0)
    trackBeginCheckout({
      value: paisaToRupees(totalPaisa),
      currency: 'INR',
      items: [
        {
          item_id: service.id,
          item_name: service.name,
          item_category: 'Services',
          price: paisaToRupees(totalPaisa),
          quantity: 1,
        },
      ],
    })
    trackCheckoutStarted(service.id, service.name, totalPaisa)
    setHasTrackedCheckout(true)
  }, [service, hasTrackedCheckout, trackBeginCheckout, trackCheckoutStarted])

  // Get selected variant data for price adjustments
  const selectedVariantData = useMemo(() => {
    if (!service?.variants || !selectedVariant) return null
    return service.variants.find(v => v.id === selectedVariant) || null
  }, [service?.variants, selectedVariant])

  // Calculate price with variant adjustments, actual service addons, and pre-cursor adjustments
  const priceBreakdown = useMemo((): PriceBreakdown | null => {
    if (!service) return null

    // Apply variant price adjustments (priceAdjustment is in paisa)
    const variantPriceAdjustment = selectedVariantData?.priceAdjustment ?? 0
    const variantGovtFeeAdjustment = selectedVariantData?.govtFeeAdjustment ?? 0

    const serviceFee = service.price_base_paisa + variantPriceAdjustment

    // Calculate govt fees - may be overridden by pre-cursor answers
    let govtFeePaisa = (service.price_govt_fees_paisa || 0) + variantGovtFeeAdjustment

    // --- TRADEMARK ---
    // Govt fee = rate per class x number of classes
    // Ollvy fee stays fixed at price_base_paisa
    if (service.slug === 'trademark-registration' && preCursorAnswers.trademark_class_count) {
      const classCount = Number(preCursorAnswers.trademark_class_count)
      const applicantType = String(preCursorAnswers.applicant_type || '')
      const isDiscountEligible = ['individual', 'proprietorship', 'msme', 'startup'].includes(applicantType)
      // Individual/Proprietor/MSME/Startup: Rs 4,500/class (450000 paisa)
      // Company/LLP/Partnership/Others: Rs 9,000/class (900000 paisa)
      govtFeePaisa = (isDiscountEligible ? 450000 : 900000) * classCount
    }

    // --- PRIVATE LIMITED COMPANY ---
    // Govt fee = MCA ROC filing fee + Delhi stamp duty on authorized capital
    // Ollvy fee stays fixed at price_base_paisa
    // Base case (Rs 1L capital, 2 directors) = Rs 7,999 govt fee (current seeded value)
    // DSC base covers 2 directors. Each additional director = Rs 1,200 extra
    if (service.slug === 'pvt-ltd-incorporation' && preCursorAnswers.authorized_capital) {
      const capital = String(preCursorAnswers.authorized_capital)
      const directors = Number(preCursorAnswers.number_of_directors) || 2
      const additionalDSCCost = Math.max(0, directors - 2) * 120000 // Rs 1,200 per director beyond 2

      // Delhi-based stamp duty + MCA ROC fee slabs (approximate)
      const capitalSlabs: Record<string, number> = {
        '100000':   799900,   // Rs 1L   -> Rs 7,999 govt fee  (current base)
        '500000':   1000000,  // Rs 5L   -> Rs 10,000 govt fee
        '1000000':  1500000,  // Rs 10L  -> Rs 15,000 govt fee
        '2500000':  2500000,  // Rs 25L  -> Rs 25,000 govt fee
        '5000000':  3500000,  // Rs 50L  -> Rs 35,000 govt fee
      }

      govtFeePaisa = (capitalSlabs[capital] ?? 799900) + additionalDSCCost
    }

    // --- LLP ---
    // Govt fee = FiLLiP stamp duty on total capital contribution
    // Ollvy fee stays fixed at price_base_paisa
    // Base case (up to Rs 1L contribution, 2 partners) = Rs 5,000 govt fee
    // DSC/DPIN base covers 2 partners. Each additional partner = Rs 1,200 extra
    if (service.slug === 'llp-incorporation' && preCursorAnswers.total_contribution) {
      const contribution = String(preCursorAnswers.total_contribution)
      const partners = Number(preCursorAnswers.number_of_partners) || 2
      const additionalDSCCost = Math.max(0, partners - 2) * 120000 // Rs 1,200 per partner beyond 2

      // FiLLiP govt fee slabs (central government - uniform across states)
      const contributionSlabs: Record<string, number> = {
        'upto_1l':    50000,   // Up to Rs 1L   -> Rs 500 govt fee
        '1l_to_5l':   200000,  // Rs 1L-Rs 5L   -> Rs 2,000 govt fee
        '5l_to_10l':  400000,  // Rs 5L-Rs 10L  -> Rs 4,000 govt fee
        'above_10l':  500000,  // Above Rs 10L  -> Rs 5,000 govt fee
      }

      govtFeePaisa = (contributionSlabs[contribution] ?? 500000) + additionalDSCCost
    }

    const gstRate = service.price_gst_rate || 18

    // Calculate add-ons total from service's actual addons (not hardcoded)
    const addonsTotal = selectedAddonIds.reduce((sum, id) => {
      const addon = service.addons?.find(a => a.id === id)
      if (!addon) return sum
      // Addon price includes both pricePaisa and govtFeePaisa
      return sum + addon.pricePaisa + (addon.govtFeePaisa ?? 0)
    }, 0)

    // GST only on service fee + addons, not govt fees
    const taxableAmount = serviceFee + addonsTotal
    const gst = Math.round(taxableAmount * (gstRate / 100))

    const promoDiscount = promoApplied?.discount || 0
    const total = serviceFee + govtFeePaisa + addonsTotal + gst - promoDiscount

    return {
      serviceFee,
      govtFees: govtFeePaisa,
      addonsTotal,
      gst,
      gstRate,
      promoDiscount,
      total: Math.max(0, total),
    }
  }, [service, selectedAddonIds, promoApplied, selectedVariantData, preCursorAnswers])

  // Fingerprint for the eager-order cache. Anything that affects the order
  // body sent to create-razorpay-order belongs here. NOTE: attribution (UTM,
  // referral_code, landing_page) intentionally excluded — those are tracking
  // metadata that don't change pricing, and they would otherwise invalidate the
  // eager order on every render due to subtle param parsing differences.
  const orderFingerprint = useMemo(
    () =>
      [
        service?.id ?? '',
        selectedVariant ?? '',
        [...selectedAddonIds].sort().join(','),
        promoApplied?.code ?? '',
        // Pre-cursor answers feed into pricing for some services (LLP). Hash
        // them so any change invalidates the eager order.
        JSON.stringify(preCursorAnswers),
      ].join('|'),
    [service?.id, selectedVariant, selectedAddonIds, promoApplied?.code, preCursorAnswers]
  )

  // Eager order creation: fire create-razorpay-order in the background once
  // we know who the user is and what they're buying. By the time they click
  // Pay, the razorpay_order_id is already in eagerOrderRef.current, and
  // handleCheckout below skips the ~2s fetch. If the user changes
  // variant/addon/promo, the fingerprint shifts and we fire a fresh order;
  // the previous one becomes orphan-pending until 24h cleanup.
  useEffect(() => {
    if (!isHydrated) return
    if (!user || !session?.access_token) return
    if (!service || !priceBreakdown || priceBreakdown.total <= 0) return
    if (service.price_varies_by_state) return // these route to /quote, no eager order
    // Wait until pre-cursor answers have been loaded from sessionStorage so we
    // don't fire a first (empty) request whose result is then dropped at settle
    // time because the fingerprint shifted under it. For non-eligibility flows
    // this flips true on first render's effect; for eligibility flows it flips
    // after the stored answers arrive — either way, exactly one request fires.
    if (!preCursorReady) return
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url) return

    // Already have a fresh order for this exact config — no work to do.
    if (eagerOrderRef.current?.fingerprint === orderFingerprint) return

    // /eligibility may have pre-created an order for this exact config and
    // dropped it in the module-level cache. Adopt it instead of firing a
    // duplicate create-order. This is the fast path that makes the
    // eligibility-routed flow (pvt-ltd, llp, trademark, iepf-consultation)
    // open the Razorpay modal instantly on Pay click.
    const preCreated = getCachedPreCreatedOrder()
    if (preCreated && preCreated.fingerprint === orderFingerprint) {
      eagerOrderRef.current = {
        orderId: preCreated.orderId,
        orderNumber: preCreated.orderNumber,
        razorpayOrderId: preCreated.razorpayOrderId,
        amount: preCreated.amount,
        fingerprint: preCreated.fingerprint,
      }
      clearCachedPreCreatedOrder()
      console.log('[checkout-perf] eager: adopted pre-created order from /eligibility')
      return
    }

    // Pre-create is still in flight from /eligibility. Piggy-back on its
    // Promise instead of firing a duplicate request.
    const preCreatedInflight = getInflightPreCreatedOrder()
    if (preCreatedInflight) {
      console.log('[checkout-perf] eager: awaiting /eligibility inflight pre-create')
      const adoptedPromise: Promise<EagerOrder | null> = preCreatedInflight.then((result) => {
        if (result && result.fingerprint === orderFingerprint) {
          const adopted: EagerOrder = {
            orderId: result.orderId,
            orderNumber: result.orderNumber,
            razorpayOrderId: result.razorpayOrderId,
            amount: result.amount,
            fingerprint: result.fingerprint,
          }
          if (orderFingerprintAtSettleRef.current === orderFingerprint) {
            eagerOrderRef.current = adopted
            clearCachedPreCreatedOrder()
            console.log('[checkout-perf] eager: pre-created order adopted post-settle')
          }
          return adopted
        }
        return null
      })
      eagerInflightRef.current = adoptedPromise
      adoptedPromise.finally(() => {
        if (eagerInflightRef.current === adoptedPromise) {
          eagerInflightRef.current = null
        }
      })
      return
    }

    const accessToken = session.access_token
    const fingerprint = orderFingerprint
    const userId = user.id
    const serviceId = service.id
    const promoCode = promoApplied?.code
    const addonIds = selectedAddonIds
    const variantId = selectedVariant
    const preCursorAnswersSnapshot = preCursorAnswers

    const promise = (async (): Promise<EagerOrder | null> => {
      const t0 = performance.now()
      console.log('[checkout-perf] eager: starting background create-order')
      try {
        const attribution = getFullAttributionData()
        const response = await fetchWithTimeout(
          `${url}/functions/v1/create-razorpay-order`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              service_package_id: serviceId,
              user_id: userId,
              promo_code: promoCode,
              addon_ids: addonIds.length > 0 ? addonIds : undefined,
              variant_id: variantId || undefined,
              engagement_agreed: true,
              // Govt fee for pvt-ltd / llp / trademark is computed server-side
              // from these. For all other slugs they're ignored.
              pre_cursor_answers: Object.keys(preCursorAnswersSnapshot).length > 0 ? preCursorAnswersSnapshot : undefined,
              utm_source: attribution.utm?.utm_source,
              utm_medium: attribution.utm?.utm_medium,
              utm_campaign: attribution.utm?.utm_campaign,
              utm_content: attribution.utm?.utm_content,
              utm_term: attribution.utm?.utm_term,
              referral_code: attribution.referralCode,
              landing_page: attribution.landingPage,
            }),
            timeout: TIMEOUTS.PAYMENT,
          }
        )
        const data = await response.json()
        if (!response.ok || data.error || !data.razorpay_order_id) {
          console.log(
            `[checkout-perf] eager: failed in ${Math.round(performance.now() - t0)}ms — ${data.error ?? response.status}`
          )
          return null
        }
        const order: EagerOrder = {
          orderId: data.order_id,
          orderNumber: data.order_number,
          razorpayOrderId: data.razorpay_order_id,
          amount: data.amount,
          fingerprint,
        }
        // Only adopt this result if the user hasn't moved on to a different
        // config in the meantime. If the fingerprints differ, this order
        // becomes orphan-pending and a newer effect already fired for the
        // current config.
        if (orderFingerprintAtSettleRef.current === fingerprint) {
          eagerOrderRef.current = order
          console.log(
            `[checkout-perf] eager: order ready in ${Math.round(performance.now() - t0)}ms (razorpay_order_id ${order.razorpayOrderId})`
          )
        } else {
          console.log(
            `[checkout-perf] eager: order arrived in ${Math.round(performance.now() - t0)}ms but fingerprint changed; dropping`
          )
        }
        return order
      } catch (e: any) {
        console.log(
          `[checkout-perf] eager: exception in ${Math.round(performance.now() - t0)}ms — ${e?.name ?? 'error'}`
        )
        return null
      }
    })()

    eagerInflightRef.current = promise
    promise.finally(() => {
      if (eagerInflightRef.current === promise) {
        eagerInflightRef.current = null
      }
    })
  }, [isHydrated, user, session?.access_token, service, priceBreakdown, orderFingerprint, selectedVariant, selectedAddonIds, promoApplied?.code, preCursorReady])

  // Mirror of orderFingerprint for the async eager closure to compare against
  // *current* fingerprint at settle time (closures see stale values).
  const orderFingerprintAtSettleRef = useRef(orderFingerprint)
  useEffect(() => {
    orderFingerprintAtSettleRef.current = orderFingerprint
  }, [orderFingerprint])

  const handleToggleAddon = (id: string) => {
    // Don't toggle required addons
    const addon = service?.addons?.find(a => a.id === id)
    if (addon?.required) return

    setSelectedAddonIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim() || !service) return
    setPromoLoading(true)
    setPromoError(null)

    try {
      const supabase = getClient()
      const { data: { session: promoSession } } = await withTimeout(
        supabase.auth.getSession(), AUTH_TIMEOUT_MS, 'checkout.promoSession',
      )
      if (!promoSession?.access_token) {
        setPromoError('Please log in to apply promo codes')
        setPromoLoading(false)
        return
      }

      const response = await fetchWithTimeout(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/resolve-promo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${promoSession.access_token}`,
          },
          body: JSON.stringify({
            code: promoCode.toUpperCase(),
            service_package_id: serviceId,
            base_price_paisa: service.price_base_paisa,
          }),
          timeout: TIMEOUTS.DEFAULT,
        }
      )
      const data = await response.json()
      if (!response.ok || data.error) {
        setPromoError(data.error || 'Invalid code')
        return
      }
      setPromoApplied({ code: promoCode.toUpperCase(), discount: data.discount_paisa || 0 })
    } catch (err) {
      setPromoError('Failed to apply promo code')
    } finally {
      setPromoLoading(false)
    }
  }

  const handleRemovePromo = () => {
    setPromoApplied(null)
    setPromoCode('')
    setPromoError(null)
  }

  const handleCheckout = async () => {
    const __t0 = performance.now()
    console.log('[checkout-perf] click: handleCheckout entered')
    if (!service || !priceBreakdown) return

    // Require auth to checkout
    if (!user) {
      openAuthModal()
      return
    }

    setIsProcessing(true)
    try {
      // Get fresh session token before checkout (handles expired tokens)
      const __tSession = performance.now()
      const supabase = getClient()
      const { data: { session: freshSession } } = await withTimeout(
        supabase.auth.getSession(), AUTH_TIMEOUT_MS, 'checkout.freshSession',
      )
      console.log(`[checkout-perf] getSession: ${Math.round(performance.now() - __tSession)}ms`)

      if (!freshSession?.access_token) {
        openAuthModal()
        setIsProcessing(false)
        return
      }

      const attribution = getFullAttributionData()

      // Fast path: eager order pre-created in the background already matches
      // the current price config — use it directly, no fetch needed.
      // Slow path: no eager order or fingerprint mismatch — fall back to the
      // original on-click fetch.
      let data: {
        order_id: string
        order_number: string
        razorpay_order_id: string
        amount: number
      }

      const eager = eagerOrderRef.current
      const inflight = eagerInflightRef.current
      const __tEager = performance.now()

      if (eager && eager.fingerprint === orderFingerprint) {
        console.log('[checkout-perf] eager: cache hit — skipping fetch')
        data = {
          order_id: eager.orderId,
          order_number: eager.orderNumber,
          razorpay_order_id: eager.razorpayOrderId,
          amount: eager.amount,
        }
      } else if (inflight) {
        // Eager creation is still in flight — wait for it instead of firing
        // a parallel duplicate request.
        console.log('[checkout-perf] eager: in-flight, awaiting')
        const result = await inflight
        if (result && result.fingerprint === orderFingerprint) {
          console.log(
            `[checkout-perf] eager: in-flight resolved in ${Math.round(performance.now() - __tEager)}ms`
          )
          data = {
            order_id: result.orderId,
            order_number: result.orderNumber,
            razorpay_order_id: result.razorpayOrderId,
            amount: result.amount,
          }
        } else {
          // Fingerprint shifted between when in-flight started and now (e.g.
          // user toggled an addon while the request was traveling). Fall back
          // to a fresh fetch with the current config.
          console.log('[checkout-perf] eager: in-flight result stale; falling back to live fetch')
          data = await createOrderLive()
        }
      } else {
        console.log('[checkout-perf] eager: miss — falling back to live fetch')
        data = await createOrderLive()
      }

      // Helper, declared as a closure to capture freshSession + auth + body args.
      // Hoisted by JS, so calling it above the declaration is fine.
      // eslint-disable-next-line no-inner-declarations
      async function createOrderLive() {
        const __tFetch = performance.now()
        console.log('[checkout-perf] create-order: starting fetch')
        const response = await fetchWithTimeout(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-razorpay-order`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${freshSession!.access_token}`,
            },
            body: JSON.stringify({
              service_package_id: service!.id,
              user_id: user!.id,
              promo_code: promoApplied?.code,
              addon_ids: selectedAddonIds.length > 0 ? selectedAddonIds : undefined,
              variant_id: selectedVariant || undefined,
              engagement_agreed: true,
              // Govt fee for pvt-ltd / llp / trademark is computed server-side
              // from these. For all other slugs they're ignored.
              pre_cursor_answers: Object.keys(preCursorAnswers).length > 0 ? preCursorAnswers : undefined,
              utm_source: attribution.utm?.utm_source,
              utm_medium: attribution.utm?.utm_medium,
              utm_campaign: attribution.utm?.utm_campaign,
              utm_content: attribution.utm?.utm_content,
              utm_term: attribution.utm?.utm_term,
              referral_code: attribution.referralCode,
              landing_page: attribution.landingPage,
            }),
            timeout: TIMEOUTS.PAYMENT,
          }
        )
        console.log(
          `[checkout-perf] create-order: HTTP ${response.status} in ${Math.round(performance.now() - __tFetch)}ms`
        )
        const liveData = await response.json()
        if (!response.ok || liveData.error) {
          throw new Error(liveData.error || 'Failed to create order')
        }
        return liveData
      }

      // For test mode (no Razorpay credentials), the edge function still creates
      // a real order and returns order_id/order_number - skip Razorpay modal
      if (data.razorpay_order_id?.startsWith('order_test_')) {
        // Save pre-cursor answers to order_questionnaire_responses if present
        if (Object.keys(preCursorAnswers).length > 0) {
          const supabaseClient = getClient()
          await supabaseClient.from('order_questionnaire_responses').upsert(
            Object.entries(preCursorAnswers).map(([question_key, response_value]) => ({
              order_id: data.order_id,
              question_key,
              response_value,
            })),
            { onConflict: 'order_id,question_key' }
          )
        }
        clearPreCursorAnswers()
        clearAllAttributionData()
        clearCheckoutState()
        trackPurchase({
          transaction_id: data.order_number,
          value: paisaToRupees(data.amount),
          currency: 'INR',
          items: [
            {
              item_id: service.id,
              item_name: service.name,
              item_category: 'Services',
              price: paisaToRupees(data.amount),
              quantity: 1,
            },
          ],
        })
        setSuccessModal({
          isOpen: true,
          orderId: data.order_id,
          orderNumber: data.order_number,
        })
        return
      }

      // Track add_payment_info in GTM
      trackAddPaymentInfo({
        value: paisaToRupees(priceBreakdown.total),
        currency: 'INR',
        payment_type: 'Razorpay',
        items: [
          {
            item_id: service.id,
            item_name: service.name,
            item_category: 'Services',
            price: paisaToRupees(priceBreakdown.total),
            quantity: 1,
          },
        ],
      })

      // Production: Open Razorpay payment modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Ollvy',
        description: service.name,
        order_id: data.razorpay_order_id,
        handler: async () => {
          // Save pre-cursor answers to order_questionnaire_responses if present
          if (Object.keys(preCursorAnswers).length > 0) {
            const supabaseClient = getClient()
            await supabaseClient.from('order_questionnaire_responses').upsert(
              Object.entries(preCursorAnswers).map(([question_key, response_value]) => ({
                order_id: data.order_id,
                question_key,
                response_value,
              })),
              { onConflict: 'order_id,question_key' }
            )
          }
          clearPreCursorAnswers()
          clearAllAttributionData()
          clearCheckoutState()
          trackPurchase({
            transaction_id: data.order_number,
            value: paisaToRupees(data.amount),
            currency: 'INR',
            items: [
              {
                item_id: service.id,
                item_name: service.name,
                item_category: 'Services',
                price: paisaToRupees(data.amount),
                quantity: 1,
              },
            ],
          })
          setSuccessModal({
            isOpen: true,
            orderId: data.order_id,
            orderNumber: data.order_number,
          })
        },
        prefill: {
          contact: user.phone || undefined,
          email: user.email || undefined,
        },
        theme: { color: '#2D5A27', backdrop_color: 'rgba(0,0,0,0.9)' },
        modal: {
          ondismiss: () => {
            // Show retry modal when user dismisses without paying
            trackEvent('payment_dismissed', {
              order_id: data.order_id,
              order_number: data.order_number,
              service_id: service.id,
              service_name: service.name,
              amount_paisa: data.amount,
            })
            setShowRetryModal(true)
            setIsProcessing(false)
          },
        },
      }

      // Check Razorpay script loaded
      if (typeof window === 'undefined' || !(window as any).Razorpay) {
        toast({
          title: 'Payment loading...',
          description: 'Please wait a moment and try again.',
        })
        setIsProcessing(false)
        // Script might still be loading, don't show error
        return
      }

      const __tRzp = performance.now()
      const razorpay = new (window as any).Razorpay(options)
      razorpayRef.current = razorpay
      // Razorpay fires `payment.failed` for declined cards, OTP failure, network errors, etc.
      razorpay.on('payment.failed', (resp: any) => {
        trackEvent('payment_failed', {
          order_id: data.order_id,
          order_number: data.order_number,
          service_id: service.id,
          service_name: service.name,
          amount_paisa: data.amount,
          error_code: resp?.error?.code,
          error_description: resp?.error?.description,
          error_source: resp?.error?.source,
          error_step: resp?.error?.step,
          error_reason: resp?.error?.reason,
          payment_method: resp?.error?.metadata?.payment_id ? 'attempted' : 'unknown',
        })
      })
      razorpay.open()
      console.log(
        `[checkout-perf] razorpay.open() called: ${Math.round(performance.now() - __tRzp)}ms after Razorpay ctor; total click→open ${Math.round(performance.now() - __t0)}ms`
      )
      trackPaymentInitiated(
        data.order_id,
        service.id,
        service.name,
        paisaToRupees(data.amount),
        { order_number: data.order_number }
      )
    } catch (err: any) {
      console.error('Checkout error:', err)
      alert(err.message || 'Checkout failed')
    } finally {
      setIsProcessing(false)
    }
  }

  // Get selected addons from service's actual addons (with price for display)
  // NOTE: These hooks must be called before early returns to follow React rules of hooks
  const selectedAddons = useMemo(() => {
    if (!service?.addons) return []
    return service.addons
      .filter(a => selectedAddonIds.includes(a.id))
      .map(a => ({
        name: a.name,
        price: a.pricePaisa + (a.govtFeePaisa ?? 0), // Combined price
      }))
  }, [service?.addons, selectedAddonIds])

  // Format addons for AddOnsSection component (needs id, name, price, description)
  const addonsForDisplay = useMemo(() => {
    if (!service?.addons) return []
    return service.addons.map(addon => ({
      id: addon.id,
      name: addon.name,
      price: addon.pricePaisa + (addon.govtFeePaisa ?? 0),
      description: addon.description,
      required: addon.required,
    }))
  }, [service?.addons])

  // Cloud kitchen: Dynamic "What's Included" based on selected add-ons
  const dynamicScopeIncluded = useMemo(() => {
    // Only apply dynamic logic for cloud-kitchen-setup
    if (service?.slug !== 'cloud-kitchen-setup') {
      return service?.scope_included || []
    }

    // Base item always included
    const items = ['FSSAI State Licence']

    // Add selected add-ons
    selectedAddonIds.forEach(addonId => {
      const label = CLOUD_KITCHEN_ADDON_LABELS[addonId]
      if (label) {
        items.push(label)
      }
    })

    return items
  }, [service?.slug, service?.scope_included, selectedAddonIds])

  const canSubmit = priceBreakdown && priceBreakdown.total > 0 && isHydrated

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Service
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Checkout</h1>
          <p className="text-muted-foreground mt-1">{service.name}</p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left column - Main flow */}
          <div className="space-y-8">
            {/* Pre-cursor answers summary.
                - When answers are present: render the card.
                - When empty AND the service uses the eligibility flow: reserve height
                  so the card arriving from sessionStorage post-hydration doesn't shift.
                - For services without an eligibility flow (gst, esop, monthly filings, etc.)
                  preCursorAnswers will never populate — render nothing, no wasted space. */}
            {Object.keys(preCursorAnswers).length > 0 ? (
              <PreCursorSummaryCard
                answers={preCursorAnswers}
                serviceSlug={service.slug}
                onEdit={() => {
                  // Redirect to eligibility page with edit flag (keep answers for editing)
                  const params = new URLSearchParams()
                  params.set('edit', 'true')
                  if (variantFromUrl) params.set('variant', variantFromUrl)
                  if (addonsFromUrl) params.set('addons', addonsFromUrl)
                  router.push(`/checkout/${serviceId}/eligibility?${params.toString()}`)
                }}
              />
            ) : isEligibilityFlow(service.slug) ? (
              <div className="min-h-[120px]" aria-hidden="true" />
            ) : null}

            {/* Step 1: Stepper */}
            <CheckoutStepper currentStep={1} />

            {/* Step 2: Filing Timeline */}
            <FilingTimeline
              steps={service.workflow_stages}
              serviceName={service.name}
            />

            {/* Step 3: Documents Required */}
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-mono">DOCUMENTS</p>
                <h3 className="text-lg md:text-xl font-semibold text-foreground">Documents You'll Need</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep these ready - Ollvy CA will guide you through each one
                </p>
              </div>
              <DocumentChecklist
                serviceSlug={service.slug}
                serviceName={service.name}
                showSectionHeader={false}
                customHeading=""
              />
            </div>

            {/* Step 4: Scope of Work */}
            <ScopeOfWorkCard
              serviceName={service.name}
              scopeIncluded={dynamicScopeIncluded.length > 0 ? dynamicScopeIncluded : [
                'Name availability check via MCA RUN portal',
                'Drafting of MoA and AoA',
                'DSC for up to 2 directors',
                'SPICe+ form filing with MCA',
                'Certificate of Incorporation (CIN)',
                'PAN + TAN application',
              ]}
              scopeExcluded={service.scope_excluded || [
                'GST Registration',
                'Trademark registration',
                'Registered office address',
                'Post-incorporation compliance',
              ]}
            />

            {/* Step 5: Add-ons (only show if service has configurable addons) */}
            {addonsForDisplay.length > 0 && (
              <AddOnsSection
                addons={addonsForDisplay}
                selectedIds={selectedAddonIds}
                onToggle={handleToggleAddon}
              />
            )}
          </div>

          {/* Right column - Sticky order summary (desktop) */}
          <div className="hidden lg:block sticky top-20 self-start">
            <OrderSummarySidebar
                serviceName={service.name}
                serviceDisplayName={selectedVariantData?.sublabel}
                serviceFee={priceBreakdown?.serviceFee || 0}
                govtFees={priceBreakdown?.govtFees || 0}
                addons={selectedAddons}
                gstRate={priceBreakdown?.gstRate || 18}
                gstAmount={priceBreakdown?.gst || 0}
                total={priceBreakdown?.total || 0}
                promoInput={promoCode}
                onPromoChange={setPromoCode}
                onApplyPromo={handleApplyPromo}
                onRemovePromo={handleRemovePromo}
                promoLoading={promoLoading}
                promoError={promoError}
                promoApplied={promoApplied}
                isProcessing={isProcessing}
                canSubmit={canSubmit || false}
                paymentReady={razorpayReady}
                onSubmit={handleCheckout}
                slaDays={service.sla_working_days || 15}
                hasGovtProcessing={service.has_govt_processing ?? false}
                completionMaxDays={service.completion_max_days}
                completionRangeText={service.completion_range_text}
                mrpPaisa={service.price_mrp_paisa}
              />
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden">
        <MobileBottomBarComponent
          total={priceBreakdown?.total || 0}
          serviceFee={priceBreakdown?.serviceFee || 0}
          govtFees={priceBreakdown?.govtFees || 0}
          gstAmount={priceBreakdown?.gst || 0}
          gstRate={priceBreakdown?.gstRate || 18}
          isProcessing={isProcessing}
          canSubmit={canSubmit || false}
          paymentReady={razorpayReady}
          onSubmit={handleCheckout}
          guaranteedDate={
            getCompletionEstimate(
              service.sla_working_days || 15,
              service.has_govt_processing ?? false,
              service.completion_max_days,
              service.completion_range_text
            )?.guaranteedDate || ''
          }
          mrpPaisa={service.price_mrp_paisa}
        />
      </div>

      {/* Razorpay checkout script. Loaded `afterInteractive` rather than
          `lazyOnload` because we're already on /checkout — the user is here
          to pay, so the SDK should be ready as soon as the page is interactive
          rather than waiting for browser idle (which on a heavy checkout page
          can take 3-5s and leave the Pay button disabled). */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRazorpayReady(true)}
      />

      {/* Success Modal */}
      {successModal && (
        <PaymentSuccessModal
          isOpen={successModal.isOpen}
          orderNumber={successModal.orderNumber}
          serviceName={service.name}
          orderId={successModal.orderId}
          amountPaisa={priceBreakdown?.total || 0}
          slaDays={service.sla_working_days || 15}
          hasGovtProcessing={service.has_govt_processing ?? false}
          completionMaxDays={service.completion_max_days}
          completionRangeText={service.completion_range_text}
          onClose={() => {
            const orderId = successModal.orderId
            setSuccessModal(null)
            // Redirect to questionnaire flow (will redirect to documents if no questionnaire)
            router.push(`/orders/${orderId}/questionnaire`)
          }}
        />
      )}

      {/* Retry Modal (shown when user dismisses Razorpay without paying) */}
      <PaymentRetryModal
        isOpen={showRetryModal}
        serviceName={service.name}
        onRetry={() => {
          setShowRetryModal(false)
          // Reopen Razorpay with existing razorpay_order_id
          if (razorpayRef.current) {
            razorpayRef.current.open()
          }
        }}
        onClose={() => setShowRetryModal(false)}
      />
    </div>
  )
}

// Scope of Work Card Component - Touch Scrollable Carousel
interface ScopeOfWorkCardProps {
  serviceName: string
  scopeIncluded: string[]
  scopeExcluded: string[]
}

function ScopeOfWorkCard({
  serviceName,
  scopeIncluded,
  scopeExcluded,
}: ScopeOfWorkCardProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      title: "What's Included",
      description: `Everything covered in your ${serviceName} order. Review the deliverables before proceeding.`,
      items: scopeIncluded,
      isIncluded: true,
    },
    {
      title: "What's Not Included",
      description: "These items are available as add-ons or separate services if needed.",
      items: scopeExcluded,
      isIncluded: false,
    },
  ]

  // Find the max number of items to ensure equal card heights
  const maxItems = Math.max(scopeIncluded.length, scopeExcluded.length)

  // Handle scroll to update active dot
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const scrollLeft = container.scrollLeft
    const cardWidth = container.offsetWidth
    const newIndex = Math.round(scrollLeft / cardWidth)
    setActiveIndex(newIndex)
  }

  // Scroll to card when dot is clicked
  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const cardWidth = container.offsetWidth
    container.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">SCOPE OF WORK</p>
        <h3 className="text-lg md:text-xl font-semibold text-foreground">What's Included in Your Order</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Review the scope before you proceed to payment
        </p>
      </div>

      {/* Scrollable Cards Container */}
      <div className="relative">
        {/* Horizontal scroll container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {steps.map((step, stepIndex) => (
            <div
              key={stepIndex}
              className="flex-shrink-0 w-full snap-center"
            >
              <div className="border border-border rounded-xl overflow-hidden bg-card h-full flex flex-col">
                {/* Header */}
                <div className="p-5 border-b border-border">
                  <h4 className="font-semibold text-foreground text-lg">
                    {step.title}
                  </h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {step.description}
                  </p>
                </div>

                {/* Content - Items list with fixed min-height for equal sizing */}
                <div className="p-5 flex-1">
                  <div className="divide-y divide-border">
                    {step.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        {step.isIncluded ? (
                          <span className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))]/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-[hsl(var(--ollvy-green))]" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <X className="w-3 h-3 text-muted-foreground" />
                          </span>
                        )}
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                    {/* Spacer items for equal height */}
                    {Array.from({ length: maxItems - step.items.length }).map((_, i) => (
                      <div key={`spacer-${i}`} className="py-3 invisible">
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm">&nbsp;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicator dots (centered below cards) */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === activeIndex
                  ? "bg-foreground"
                  : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Order Summary Sidebar Component
interface OrderSummarySidebarProps {
  serviceName: string
  serviceDisplayName?: string // Optional variant label for display
  serviceFee: number
  govtFees: number
  addons: Array<{ name: string; price: number }>
  gstRate: number
  gstAmount: number
  total: number
  promoInput: string
  onPromoChange: (value: string) => void
  onApplyPromo: () => void
  onRemovePromo: () => void
  promoLoading: boolean
  promoError: string | null
  promoApplied: { code: string; discount: number } | null
  isProcessing: boolean
  canSubmit: boolean
  paymentReady: boolean
  onSubmit: () => void
  slaDays?: number
  // Completion estimate fields for govt processing awareness
  hasGovtProcessing?: boolean
  completionMaxDays?: number | null
  completionRangeText?: string | null
  mrpPaisa?: number
}

function OrderSummarySidebar({
  serviceName,
  serviceDisplayName,
  serviceFee,
  govtFees,
  addons,
  gstRate,
  gstAmount,
  total,
  promoInput,
  onPromoChange,
  onApplyPromo,
  onRemovePromo,
  promoLoading,
  promoError,
  promoApplied,
  isProcessing,
  canSubmit,
  paymentReady,
  onSubmit,
  slaDays = 15,
  hasGovtProcessing = false,
  completionMaxDays,
  completionRangeText,
  mrpPaisa,
}: OrderSummarySidebarProps) {
  // Calculate completion estimate with govt processing awareness
  const completionEstimate = getCompletionEstimate(
    slaDays,
    hasGovtProcessing,
    completionMaxDays,
    completionRangeText
  )
  const guaranteedDate = completionEstimate?.guaranteedDate ?? ''

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Guaranteed date at top */}
      <div className="pb-5 border-b border-border mb-5">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3.5 w-3.5 text-[hsl(var(--ollvy-green))] shrink-0" />
          <p className="text-sm font-semibold text-foreground font-mono">
            Guaranteed by {guaranteedDate}
          </p>
        </div>
        {completionEstimate?.govtDisclaimer && (
          <p className="text-xs text-muted-foreground mt-1 ml-[22px]">
            ({completionEstimate.govtDisclaimer})
          </p>
        )}
        {/* Free if not delivered guarantee */}
        <div className="flex items-center gap-1.5 mt-2 ml-[22px]">
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ollvy-green))]" />
          <span className="text-xs text-[hsl(var(--ollvy-green-fg))]">
            Free if not delivered by {guaranteedDate}
          </span>
        </div>
      </div>

      {/* Total amount - prominent */}
      <div className="mb-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
          Total to pay now
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="font-mono text-4xl font-bold text-foreground">
            {formatPrice(total)}
          </p>
          {mrpPaisa && mrpPaisa > 0 && mrpPaisa > total && (
            <p className="font-mono text-lg text-muted-foreground line-through">
              {formatPrice(mrpPaisa)}
            </p>
          )}
        </div>
      </div>

      {/* Fee breakdown */}
      <div className="mt-5 space-y-3">
        {/* Base service fee (includes govt fees like in services page) */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center mt-0.5 shrink-0">
              <CheckCircle className="h-2.5 w-2.5 text-[hsl(var(--ollvy-green))]" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{serviceDisplayName || serviceName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Service fee</p>
            </div>
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">
            {formatPrice(serviceFee + govtFees)}
          </span>
        </div>

        {/* Selected addons */}
        {addons.map((addon, i) => (
          <div key={i} className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center mt-0.5 shrink-0">
                <CheckCircle className="h-2.5 w-2.5 text-[hsl(var(--ollvy-green))]" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{addon.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Service fee</p>
              </div>
            </div>
            <span className="font-mono text-sm text-foreground">
              {formatPrice(addon.price)}
            </span>
          </div>
        ))}

        {/* GST */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5 shrink-0">
              <span className="text-[7px] font-bold text-muted-foreground">GST</span>
            </div>
            <p className="text-sm font-medium text-foreground">GST ({gstRate}%)</p>
          </div>
          <span className="font-mono text-sm text-foreground">
            {formatPrice(gstAmount)}
          </span>
        </div>

        {/* Total line */}
        <div className="flex justify-between items-center pt-3 border-t border-border">
          <span className="text-sm font-semibold text-foreground">Total Amount</span>
          <span className="font-mono text-lg font-bold text-foreground">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Promo code input */}
      {!promoApplied && (
        <div className="mt-5 border border-border rounded-xl p-4">
          <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-3">
            HAVE A PROMO CODE?
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Enter code"
              value={promoInput}
              onChange={(e) => onPromoChange(e.target.value.toUpperCase())}
              className="h-10 text-sm border-border"
            />
            <Button
              variant="outline"
              onClick={onApplyPromo}
              disabled={!promoInput.trim() || promoLoading}
              className="h-10 px-4 border-border"
            >
              {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
            </Button>
          </div>
          {promoError && <p className="text-xs text-destructive mt-2">{promoError}</p>}
        </div>
      )}

      {/* Promo applied badge */}
      {promoApplied && (
        <div className="mt-5 flex items-center justify-between bg-[hsl(var(--ollvy-green))]/5 border border-[hsl(var(--ollvy-green))]/20 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
            <span className="text-sm font-medium text-[hsl(var(--ollvy-green-fg))]">
              {promoApplied.code} - {formatPrice(promoApplied.discount)} off
            </span>
          </div>
          <button onClick={onRemovePromo} className="text-xs text-muted-foreground hover:text-foreground">
            Remove
          </button>
        </div>
      )}

      {/* Pay button — disabled until Razorpay checkout.js has loaded so a tap
          never silently fails on slow connections. */}
      <Button
        onClick={onSubmit}
        disabled={!canSubmit || isProcessing || !paymentReady}
        size="lg"
        className="w-full mt-5"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Securing your payment…
          </>
        ) : !paymentReady ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Preparing payment…
          </>
        ) : (
          `Pay ${formatPrice(total)}`
        )}
      </Button>

      {/* GST invoice note */}
      <p className="text-xs text-muted-foreground text-center mt-2">
        GST-compliant invoice generated at checkout
      </p>

      {/* Have queries */}
      <div className="mt-5 pt-5 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">
          Questions about documents, process, or price?
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
            <a
              href={getWhatsAppLink(`Hi, I have a question about ${serviceName}`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
            <a href={getPhoneLink()}>
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Pre-cursor Summary Card Component
interface PreCursorSummaryCardProps {
  answers: Record<string, unknown>
  serviceSlug: string
  onEdit: () => void
}

function PreCursorSummaryCard({ answers, serviceSlug, onEdit }: PreCursorSummaryCardProps) {
  // Human-readable labels for question keys
  const getLabel = (key: string): string => {
    const labels: Record<string, string> = {
      // Trademark
      applicant_type: 'Applicant Type',
      trademark_type: 'Trademark Type',
      trademark_class_count: 'Number of Classes',
      // Pvt Ltd
      authorized_capital: 'Authorized Capital',
      number_of_directors: 'Number of Directors',
      // LLP
      total_contribution: 'Total Capital Contribution',
      number_of_partners: 'Number of Partners',
      // Professional Tax
      state: 'State',
      registration_type: 'Registration Type',
      // ESI/PF
      employee_count: 'Number of Employees',
      voluntary_registration: 'Voluntary Registration',
      // Copyright
      work_category: 'Work Category',
    }
    return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  // Format value for display
  const formatValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined) return '-'

    // Format capital amounts
    if (key === 'authorized_capital') {
      const capitalLabels: Record<string, string> = {
        '100000': 'Rs 1 Lakh',
        '500000': 'Rs 5 Lakhs',
        '1000000': 'Rs 10 Lakhs',
        '2500000': 'Rs 25 Lakhs',
        '5000000': 'Rs 50 Lakhs',
      }
      return capitalLabels[String(value)] || String(value)
    }

    // Format contribution amounts
    if (key === 'total_contribution') {
      const contributionLabels: Record<string, string> = {
        'upto_1l': 'Up to Rs 1 Lakh',
        '1l_to_5l': 'Rs 1 Lakh - Rs 5 Lakhs',
        '5l_to_10l': 'Rs 5 Lakhs - Rs 10 Lakhs',
        'above_10l': 'Above Rs 10 Lakhs',
      }
      return contributionLabels[String(value)] || String(value)
    }

    // Format applicant type
    if (key === 'applicant_type') {
      const typeLabels: Record<string, string> = {
        'individual': 'Individual',
        'proprietorship': 'Proprietorship',
        'msme': 'MSME',
        'startup': 'Startup India Registered',
        'company': 'Company',
        'llp': 'LLP',
        'partnership': 'Partnership',
        'others': 'Others',
      }
      return typeLabels[String(value)] || String(value)
    }

    // Format yes/no values
    if (key === 'voluntary_registration') {
      return String(value) === 'yes' ? 'Yes' : 'No'
    }

    return String(value)
  }

  // Filter out irrelevant answers
  const relevantAnswers = Object.entries(answers).filter(([, value]) =>
    value !== null && value !== undefined && value !== ''
  )

  if (relevantAnswers.length === 0) return null

  // Check if a value looks like a number
  const isNumericValue = (val: unknown): boolean => {
    const str = String(val)
    return /^\d+$/.test(str)
  }

  return (
    <div className="rounded-xl border border-border bg-muted/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
            Your Selections
          </p>
        </div>
        <button
          onClick={onEdit}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          Edit
        </button>
      </div>
      <div className="space-y-3">
        {relevantAnswers.map(([key, value]) => {
          const formattedValue = formatValue(key, value)
          const useMonoFont = isNumericValue(formattedValue) || key === 'trademark_class_count' || key === 'director_count' || key === 'partner_count'
          return (
            <div key={key} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{getLabel(key)}</span>
              <span className={`text-foreground ${useMonoFont ? 'font-mono font-semibold' : 'font-medium'}`}>
                {formattedValue}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Mobile Bottom Bar Component with collapsed/expanded states
interface MobileBottomBarComponentProps {
  total: number
  serviceFee: number
  govtFees: number
  gstAmount: number
  gstRate: number
  isProcessing: boolean
  canSubmit: boolean
  paymentReady: boolean
  onSubmit: () => void
  guaranteedDate: string
  mrpPaisa?: number
}

function MobileBottomBarComponent({
  total,
  serviceFee,
  govtFees,
  gstAmount,
  gstRate,
  isProcessing,
  canSubmit,
  paymentReady,
  onSubmit,
  guaranteedDate,
  mrpPaisa,
}: MobileBottomBarComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Service fee for display = base service + govt fees (combined)
  const displayServiceFee = serviceFee + govtFees

  return (
    <>
      {/* Fixed bottom bar container - grows upward when expanded */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border transition-all duration-300"
      >
        {/* Collapsed bar - always visible at top of container */}
        <div className="px-4 py-3 flex items-center justify-between h-[76px]">
          {/* Left side - tappable to toggle expanded */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-left flex-1"
          >
            {/* Guaranteed by date - green badge style */}
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-1 rounded-full text-xs font-medium bg-[hsl(var(--ollvy-green))]/10 border border-[hsl(var(--ollvy-green))]/30 text-[hsl(var(--ollvy-green-fg))]">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ollvy-green))]" />
              Guaranteed by {guaranteedDate}
            </span>
            {/* Total with chevron - UP when collapsed (tap to expand), DOWN when expanded */}
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-lg font-bold text-foreground">{formatPrice(total)}</span>
              {mrpPaisa && mrpPaisa > 0 && mrpPaisa > total && (
                <span className="font-mono text-sm text-muted-foreground line-through">
                  {formatPrice(mrpPaisa)}
                </span>
              )}
              <ChevronUp
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform duration-200 self-center',
                  isExpanded ? 'rotate-180' : 'rotate-0'
                )}
              />
            </div>
          </button>

          {/* Right side - Pay Now button */}
          <Button
            onClick={onSubmit}
            disabled={isProcessing || !canSubmit || !paymentReady}
            className="h-11 px-6 text-base font-medium rounded-md bg-[hsl(var(--ollvy-green))] hover:bg-[hsl(var(--ollvy-green))]/90 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Securing payment…
              </>
            ) : !paymentReady ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading…
              </>
            ) : (
              <>
                Pay Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Breakdown - appears below the bar when expanded */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-border">
            {/* Fee breakdown */}
            <div className="space-y-2 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Service fee</span>
                <span className="font-mono text-sm text-foreground">{formatPrice(displayServiceFee)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">GST ({gstRate}%)</span>
                <span className="font-mono text-sm text-foreground">{formatPrice(gstAmount)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="font-mono text-sm font-bold text-foreground">{formatPrice(total)}</span>
              </div>
            </div>
            {/* Free if not delivered guarantee */}
            <div className="flex items-center gap-1.5 mt-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ollvy-green))]" />
              <span className="text-xs text-[hsl(var(--ollvy-green-fg))]">
                Free if not delivered by {guaranteedDate}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Spacer - accounts for collapsed bar height */}
      <div className="h-[76px]" />
    </>
  )
}

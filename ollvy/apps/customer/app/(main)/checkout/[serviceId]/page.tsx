'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, ArrowRight, Check, X, ChevronDown, CheckCircle, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getFullAttributionData, clearAllAttributionData } from '@/lib/utm'
import { getPreCursorAnswers, clearPreCursorAnswers } from '@/lib/pre-cursor'
import type { ServicePackage, ServiceAddon, ServiceVariant } from '@/lib/types'
import { cn } from '@/lib/utils'

import {
  CheckoutStepper,
  FilingTimeline,
  AddOnsSection,
  PaymentSuccessModal,
  WhatsIncludedCard,
  WhatsNotIncludedCard,
} from '@/components/checkout'
import { DocumentChecklist } from '@/components/landing/DocumentChecklist'

interface PriceBreakdown {
  serviceFee: number
  govtFees: number
  addonsTotal: number
  gst: number
  gstRate: number
  promoDiscount: number
  total: number
}

function formatPrice(paisa: number): string {
  return '\u20B9' + Math.ceil(paisa / 100).toLocaleString('en-IN')
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = params.serviceId as string
  const { user, session, isHydrated, openAuthModal, isAuthModalOpen } = useAuthStore()

  const [service, setService] = useState<ServicePackage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  // Mobile bottom sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Success modal
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean
    orderId: string
    orderNumber: string
  } | null>(null)

  // Track if we've shown the initial auth prompt (don't keep re-opening if user dismisses)
  const [hasShownAuthPrompt, setHasShownAuthPrompt] = useState(false)

  // Pre-cursor answers from eligibility page (stored in sessionStorage)
  const [preCursorAnswers, setPreCursorAnswers] = useState<Record<string, unknown>>({})

  // Fetch service data regardless of auth status (public data)
  useEffect(() => {
    if (!isHydrated) return
    fetchService()
  }, [serviceId, isHydrated])

  // Open auth modal once on initial load if user is not logged in
  useEffect(() => {
    if (!isHydrated) return
    if (!user && !hasShownAuthPrompt) {
      openAuthModal()
      setHasShownAuthPrompt(true)
    }
  }, [user, isHydrated, hasShownAuthPrompt, openAuthModal])

  // Load pre-cursor answers from sessionStorage when service is available
  useEffect(() => {
    if (!service) return
    const stored = getPreCursorAnswers(service.slug)
    if (stored) {
      setPreCursorAnswers(stored)
    }
  }, [service])

  // Check for pre-payment questions and redirect if user hasn't answered them
  useEffect(() => {
    if (!service) return

    // If user already has answers, don't redirect
    const existingAnswers = getPreCursorAnswers(service.slug)
    if (existingAnswers && Object.keys(existingAnswers).length > 0) {
      return
    }

    // Check if service has pre-payment questions
    const checkForPrePaymentQuestions = async () => {
      const supabase = getClient()
      const { count } = await supabase
        .from('service_questionnaires')
        .select('*', { count: 'exact', head: true })
        .eq('service_package_id', service.id)
        .eq('is_active', true)
        .eq('is_pre_payment', true)

      if (count && count > 0) {
        // Preserve URL params when redirecting
        const params = new URLSearchParams()
        if (variantFromUrl) params.set('variant', variantFromUrl)
        if (addonsFromUrl) params.set('addons', addonsFromUrl)
        const queryString = params.toString()
        const eligibilityUrl = `/checkout/${serviceId}/eligibility${queryString ? '?' + queryString : ''}`
        router.replace(eligibilityUrl)
      }
    }

    checkForPrePaymentQuestions()
  }, [service, serviceId, router, variantFromUrl, addonsFromUrl])

  // Initialize variant and addons from URL params or service defaults after service loads
  useEffect(() => {
    if (!service) return

    // Initialize variant from URL or default
    if (service.variants && service.variants.length > 0) {
      const urlVariant = variantFromUrl
      if (urlVariant && service.variants.some(v => v.id === urlVariant)) {
        setSelectedVariant(urlVariant)
      } else {
        // Use first variant as default
        setSelectedVariant(service.variants[0].id)
      }
    }

    // Initialize addons from URL params or service defaults
    if (service.addons && service.addons.length > 0) {
      if (addonsFromUrl) {
        // Use addons from URL
        const urlAddonIds = addonsFromUrl.split(',').filter(id =>
          service.addons?.some(a => a.id === id)
        )
        setSelectedAddonIds(urlAddonIds)
      } else {
        // Use default selections from service config (defaultSelected or required)
        const defaultIds = service.addons
          .filter(addon => addon.defaultSelected || addon.required)
          .map(addon => addon.id)
        setSelectedAddonIds(defaultIds)
      }
    }
  }, [service, variantFromUrl, addonsFromUrl])

  const fetchService = async () => {
    if (!serviceId) return
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getClient()
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(serviceId)

      let data = null
      if (isUUID) {
        const result = await supabase
          .from('service_packages')
          .select('*')
          .eq('id', serviceId)
          .single()
        data = result.data
      }

      if (!data) {
        const slugResult = await supabase
          .from('service_packages')
          .select('*')
          .eq('slug', serviceId)
          .single()
        data = slugResult.data
      }

      if (!data) throw new Error('Service not found')

      if (data.price_varies_by_state) {
        router.push(`/quote/request/${data.id}`)
        return
      }

      setService(data)
    } catch (err) {
      console.error('Failed to fetch service:', err)
      setError('Service not found')
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleToggleAddon = (id: string) => {
    // Don't toggle required addons
    const addon = service?.addons?.find(a => a.id === id)
    if (addon?.required) return

    setSelectedAddonIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    setPromoLoading(true)
    setPromoError(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/resolve-promo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            code: promoCode.toUpperCase(),
            service_id: serviceId,
            user_id: user?.id,
          }),
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
    if (!service || !priceBreakdown) return

    // Require auth to checkout
    if (!user) {
      openAuthModal()
      return
    }

    setIsProcessing(true)
    try {
      // Get fresh session token before checkout (handles expired tokens)
      const supabase = getClient()
      const { data: { session: freshSession } } = await supabase.auth.getSession()

      if (!freshSession?.access_token) {
        openAuthModal()
        setIsProcessing(false)
        return
      }

      const attribution = getFullAttributionData()

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-razorpay-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${freshSession.access_token}`,
          },
          body: JSON.stringify({
            service_package_id: service.id,
            user_id: user.id,
            promo_code: promoApplied?.code,
            addon_ids: selectedAddonIds.length > 0 ? selectedAddonIds : undefined,
            variant_id: selectedVariant || undefined,
            engagement_agreed: true,
            utm_source: attribution.utm?.utm_source,
            utm_medium: attribution.utm?.utm_medium,
            utm_campaign: attribution.utm?.utm_campaign,
            utm_content: attribution.utm?.utm_content,
            utm_term: attribution.utm?.utm_term,
            referral_code: attribution.referralCode,
            landing_page: attribution.landingPage,
          }),
        }
      )

      const data = await response.json()
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to create order')
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
        setSuccessModal({
          isOpen: true,
          orderId: data.order_id,
          orderNumber: data.order_number,
        })
        return
      }

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
          setSuccessModal({
            isOpen: true,
            orderId: data.order_id,
            orderNumber: data.order_number,
          })
        },
        prefill: { contact: user.phone },
        theme: { color: '#2D5A27', backdrop_color: 'rgba(0,0,0,0.9)' },
      }

      // @ts-ignore
      const razorpay = new window.Razorpay(options)
      razorpay.open()
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

  const canSubmit = priceBreakdown && priceBreakdown.total > 0

  // Show loading state while waiting for hydration (very brief)
  if (!isHydrated) {
    return (
      <div className="container py-12 max-w-6xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
          <Skeleton className="h-[500px] rounded-lg" />
        </div>
      </div>
    )
  }

  // Error state (only after loading completes)
  if (!isLoading && (error || !service)) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-4">Service Not Found</h1>
        <p className="text-muted-foreground mb-8">{error || 'The service you\'re looking for doesn\'t exist.'}</p>
        <Link href="/services">
          <Button>Browse Services</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          {isLoading || !service ? (
            <>
              <Skeleton className="h-5 w-28 mb-4" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </>
          ) : (
            <>
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Service
              </Link>
              <h1 className="text-2xl font-semibold text-foreground">Checkout</h1>
              <p className="text-muted-foreground mt-1">{service.name}</p>
            </>
          )}
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left column - Main flow */}
          <div className="space-y-8">
            {/* Pre-cursor answers summary (if present) */}
            {service && Object.keys(preCursorAnswers).length > 0 && (
              <PreCursorSummaryCard
                answers={preCursorAnswers}
                serviceSlug={service.slug}
              />
            )}

            {/* Step 1: Stepper */}
            <CheckoutStepper currentStep={1} />

            {/* Step 2: Filing Timeline */}
            {isLoading || !service ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-48 rounded-lg" />
              </div>
            ) : (
              <FilingTimeline
                steps={service.workflow_stages}
                serviceName={service.name}
              />
            )}

            {/* Step 3: Documents Required */}
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-mono">DOCUMENTS</p>
                <h3 className="text-lg md:text-xl font-semibold text-foreground">Documents You'll Need</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep these ready - your CA will guide you through each one
                </p>
              </div>
              {isLoading || !service ? (
                <Skeleton className="h-40 rounded-lg" />
              ) : (
                <DocumentChecklist
                  serviceSlug={service.slug}
                  serviceName={service.name}
                  showSectionHeader={false}
                  customHeading=""
                />
              )}
            </div>

            {/* Step 4: Scope of Work */}
            {isLoading || !service ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-64 rounded-lg" />
              </div>
            ) : (
              <ScopeOfWorkCard
                serviceName={service.name}
                scopeIncluded={service.scope_included || [
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
            )}

            {/* Step 5: Add-ons (only show if service has configurable addons) */}
            {!isLoading && service && addonsForDisplay.length > 0 && (
              <AddOnsSection
                addons={addonsForDisplay}
                selectedIds={selectedAddonIds}
                onToggle={handleToggleAddon}
              />
            )}
          </div>

          {/* Right column - Sticky order summary (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              {isLoading || !service ? (
                <Skeleton className="h-[500px] rounded-lg" />
              ) : (
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
                  onSubmit={handleCheckout}
                  slaDays={service.sla_working_days || 15}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      {service && (
        <div className="lg:hidden">
          <MobileBottomBarComponent
            total={priceBreakdown?.total || 0}
            isProcessing={isProcessing}
            canSubmit={canSubmit || false}
            onSubmit={handleCheckout}
            isSheetOpen={isSheetOpen}
            setIsSheetOpen={setIsSheetOpen}
            orderSummary={
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
                onSubmit={handleCheckout}
                isMobile
                slaDays={service.sla_working_days || 15}
              />
            }
          />
        </div>
      )}

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      {/* Success Modal */}
      {successModal && service && (
        <PaymentSuccessModal
          isOpen={successModal.isOpen}
          orderNumber={successModal.orderNumber}
          serviceName={service.name}
          orderId={successModal.orderId}
          amountPaisa={priceBreakdown?.total || 0}
          slaDays={service.sla_working_days || 15}
          onClose={() => {
            const orderId = successModal.orderId
            setSuccessModal(null)
            // Redirect to questionnaire flow (will redirect to documents if no questionnaire)
            router.push(`/orders/${orderId}/questionnaire`)
          }}
        />
      )}
    </div>
  )
}

// Scope of Work Card Component - Stepper Carousel
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
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 2

  const steps = [
    {
      title: "What's Included",
      description: `Everything covered in your ${serviceName} order. Review the deliverables before proceeding.`,
      items: scopeIncluded,
    },
    {
      title: "What's Not Included",
      description: "These items are available as add-ons or separate services if needed.",
      items: scopeExcluded,
    },
  ]

  const currentStepData = steps[currentStep]

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

      {/* Card */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {/* Header with title and slider dots */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground text-lg">
              {currentStepData.title}
            </h4>
            {/* Slider dots */}
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentStep
                      ? "bg-foreground"
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {currentStepData.description}
          </p>
        </div>

        {/* Content - Items list */}
        <div className="p-5">
          <div className="divide-y divide-border">
            {currentStepData.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                {currentStep === 0 ? (
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
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-border" />
        <div className="p-5 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={cn(
              "flex items-center gap-1 text-sm font-medium transition-colors",
              currentStep === 0
                ? "text-muted-foreground/50 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Step
          </button>

          <button
            onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
            disabled={currentStep === totalSteps - 1}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              currentStep === totalSteps - 1
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-[hsl(var(--ollvy-green))] text-white hover:bg-[hsl(var(--ollvy-green))]/90"
            )}
          >
            Next Step
            <ChevronRight className="h-4 w-4" />
          </button>
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
  onSubmit: () => void
  isMobile?: boolean
  slaDays?: number
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
  onSubmit,
  isMobile = false,
  slaDays = 15,
}: OrderSummarySidebarProps) {
  // Calculate guaranteed date
  const getGuaranteedDate = (days: number) => {
    const date = new Date()
    let addedDays = 0
    while (addedDays < days) {
      date.setDate(date.getDate() + 1)
      const dayOfWeek = date.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++
      }
    }
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const guaranteedDate = getGuaranteedDate(slaDays)

  return (
    <div className={cn('bg-card border border-border rounded-xl p-6', isMobile && 'border-0 p-0')}>
      {/* Guaranteed date at top */}
      <div className="flex items-center gap-2 pb-5 border-b border-border mb-5">
        <CheckCircle className="h-3.5 w-3.5 text-[hsl(var(--ollvy-green))] shrink-0" />
        <p className="text-sm font-semibold text-foreground font-mono">
          Guaranteed by {guaranteedDate}
        </p>
      </div>

      {/* Total amount - prominent */}
      <div className="mb-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
          Total to pay now
        </p>
        <p className="font-mono text-4xl font-bold text-foreground mt-1">
          {formatPrice(total)}
        </p>
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

      {/* Pay button */}
      <Button
        onClick={onSubmit}
        disabled={!canSubmit || isProcessing}
        size="lg"
        className="w-full mt-5"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
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
              href={`https://wa.me/919876543210?text=Hi, I have a question about ${encodeURIComponent(serviceName)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
            <a href="tel:+919876543210">
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
}

function PreCursorSummaryCard({ answers, serviceSlug }: PreCursorSummaryCardProps) {
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

  return (
    <div className="rounded-xl border border-[hsl(var(--ollvy-green))]/20 bg-[hsl(var(--ollvy-green))]/5 p-5">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
        <h3 className="font-semibold text-foreground text-sm">Confirmed Before Payment</h3>
      </div>
      <div className="space-y-2">
        {relevantAnswers.map(([key, value]) => (
          <div key={key} className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{getLabel(key)}</span>
            <span className="font-medium text-foreground">{formatValue(key, value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Mobile Bottom Bar Component
interface MobileBottomBarComponentProps {
  total: number
  isProcessing: boolean
  canSubmit: boolean
  onSubmit: () => void
  isSheetOpen: boolean
  setIsSheetOpen: (open: boolean) => void
  orderSummary: React.ReactNode
}

function MobileBottomBarComponent({
  total,
  isProcessing,
  canSubmit,
  onSubmit,
  isSheetOpen,
  setIsSheetOpen,
  orderSummary,
}: MobileBottomBarComponentProps) {
  return (
    <>
      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-40">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => setIsSheetOpen(true)} className="text-left">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-mono text-lg font-bold text-foreground">{formatPrice(total)}</p>
          </button>
          <Button
            onClick={canSubmit ? onSubmit : () => setIsSheetOpen(true)}
            disabled={isProcessing}
            className={cn(
              'h-11 px-6 text-base font-medium rounded-md',
              canSubmit ? 'bg-[hsl(var(--ollvy-green))] hover:bg-[hsl(var(--ollvy-green))]/90 text-white' : 'bg-[hsl(var(--ollvy-green))]/50 text-white'
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {isSheetOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsSheetOpen(false)} />
      )}

      {/* Bottom sheet */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 transition-transform duration-300 max-h-[85vh] overflow-y-auto',
          isSheetOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Order Summary</h3>
          <button onClick={() => setIsSheetOpen(false)} className="p-1 hover:bg-muted rounded">
            <span className="text-muted-foreground">✕</span>
          </button>
        </div>
        <div className="p-4">{orderSummary}</div>
      </div>

      {/* Spacer */}
      <div className="h-20" />
    </>
  )
}

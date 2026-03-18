'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { formatPaisa } from '@/lib/utils'
import { getFullAttributionData, clearAllAttributionData } from '@/lib/utm'
import type { ServicePackage, ServiceAddon } from '@/lib/types'
import {
  ArrowLeft,
  Check,
  Tag,
  Loader2,
  AlertCircle,
} from 'lucide-react'

import {
  EngagementLetterCard,
  VariantSelector,
  AddonSelector,
  OrderSummaryPanel,
  TrustSignalsCard,
  PaymentMethodLogos,
} from '@/components/checkout'

interface Variant {
  id: string
  label: string
  sublabel: string
  priceAdjustment?: number
  govtFeeAdjustment?: number
}

interface PriceBreakdown {
  base: number
  govtFees: number
  gst: number
  gstRate: number
  proDiscount: number
  promoDiscount: number
  addonTotal: number
  total: number
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = params.serviceId as string
  const { user } = useAuthStore()

  const [service, setService] = useState<ServicePackage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Variant state (from URL or default)
  const [selectedVariant, setSelectedVariant] = useState<string>('')

  // Addon state (from URL or defaults)
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([])

  // Engagement letter agreement
  const [engagementAgreed, setEngagementAgreed] = useState(false)

  // Promo code state
  const [promoCode, setPromoCode] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null)

  // Payment state
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push(`/login?returnUrl=/checkout/${serviceId}`)
      return
    }
    fetchService()
  }, [serviceId, user])

  // Initialize variant and addons from URL params after service loads
  useEffect(() => {
    if (service) {
      // Initialize variant from URL or use first variant
      const urlVariant = searchParams.get('variant')
      if (service.variants && service.variants.length > 0) {
        const validVariant = service.variants.find(v => v.id === urlVariant)
        setSelectedVariant(validVariant ? urlVariant! : service.variants[0].id)
      }

      // Initialize addons from URL or use defaults
      const urlAddons = searchParams.get('addons')
      if (service.addons && service.addons.length > 0) {
        if (urlAddons) {
          const addonIds = urlAddons.split(',')
          // Include required addons plus URL-specified addons
          const requiredIds = service.addons.filter(a => a.required).map(a => a.id)
          const validIds = addonIds.filter(id => service.addons!.some(a => a.id === id))
          setSelectedAddonIds([...new Set([...requiredIds, ...validIds])])
        } else {
          // Use default selection
          setSelectedAddonIds(
            service.addons
              .filter(addon => addon.defaultSelected || addon.required)
              .map(addon => addon.id)
          )
        }
      }
    }
  }, [service, searchParams])

  const fetchService = async () => {
    if (!serviceId) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = getClient()

      const { data, error: fetchError } = await supabase
        .from('service_packages')
        .select('*')
        .eq('id', serviceId)
        .single()

      if (fetchError) throw fetchError

      if (data.price_varies_by_state) {
        router.push(`/quote/request/${serviceId}`)
        return
      }

      // Parse variants from workflow_stages or a variants column if exists
      // For now, check if the service has variant data in addons or other field
      setService(data)
    } catch (err) {
      console.error('Failed to fetch service:', err)
      setError('Service not found')
    } finally {
      setIsLoading(false)
    }
  }

  // Parse variants from service data (they may be stored in a variants column)
  const variants = useMemo((): Variant[] => {
    if (!service) return []
    // Check if service has variants field (may be stored differently)
    // For FSSAI services, variants are typically turnover-based
    // This would come from the database - for now return empty if not present
    return []
  }, [service])

  // Parse addons from service data
  const addons = useMemo((): ServiceAddon[] => {
    if (!service?.addons) return []
    return service.addons
  }, [service])

  // Get selected addon objects for price calculation
  const selectedAddons = useMemo(() => {
    return addons.filter(addon => selectedAddonIds.includes(addon.id))
  }, [addons, selectedAddonIds])

  const calculatePrice = (): PriceBreakdown | null => {
    if (!service) return null

    // Base price (may be adjusted by variant)
    let base = service.price_base_paisa
    let govtFees = service.price_govt_fees_paisa || 0

    // Apply variant adjustments if applicable
    if (selectedVariant && variants.length > 0) {
      const variant = variants.find(v => v.id === selectedVariant)
      if (variant) {
        base += (variant.priceAdjustment ?? 0)
        govtFees += (variant.govtFeeAdjustment ?? 0)
      }
    }

    // Calculate addon totals
    const addonTotal = selectedAddons.reduce((sum, addon) => {
      return sum + addon.pricePaisa + (addon.govtFeePaisa ?? 0)
    }, 0)

    const gstRate = service.price_gst_rate || 18
    const gst = Math.round((base + addonTotal) * (gstRate / 100))

    // Pro discount (5% for pro users)
    const proDiscount = user?.subscription_tier === 'pro' ? Math.round((base + addonTotal) * 0.05) : 0

    // Promo discount
    const promoDiscount = promoApplied?.discount || 0

    const total = base + govtFees + addonTotal + gst - proDiscount - promoDiscount

    return {
      base,
      govtFees,
      gst,
      gstRate,
      proDiscount,
      promoDiscount,
      addonTotal,
      total: Math.max(0, total),
    }
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
        setPromoError(data.error || 'Invalid promo code')
        return
      }

      setPromoApplied({
        code: promoCode.toUpperCase(),
        discount: data.discount_paisa || 0,
      })
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
    if (!service || !user || !engagementAgreed) return

    setIsProcessing(true)

    try {
      const priceBreakdown = calculatePrice()
      if (!priceBreakdown) throw new Error('Price calculation failed')

      // Get attribution data
      const attribution = getFullAttributionData()

      // Create Razorpay order with variant and addon data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-razorpay-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            service_package_id: service.id,
            user_id: user.id,
            promo_code: promoApplied?.code,
            variant_id: selectedVariant || undefined,
            addon_ids: selectedAddonIds.length > 0 ? selectedAddonIds : undefined,
            engagement_agreed: true,
            // Attribution data
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

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Ollvy',
        description: service.name,
        order_id: data.razorpay_order_id,
        handler: async (response: any) => {
          // Payment successful - clear attribution and redirect to success page
          clearAllAttributionData()
          router.push(`/orders/${data.order_id}/success`)
        },
        prefill: {
          contact: user.phone,
        },
        theme: {
          color: '#ffffff',
          backdrop_color: 'rgba(0,0,0,0.9)',
        },
      }

      // @ts-ignore
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Checkout failed')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 max-w-5xl">
        <Skeleton className="h-9 w-32 mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="container py-20 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-foreground mb-4">Service Not Found</h1>
        <p className="text-muted-foreground mb-8">{error || 'The service you\'re looking for doesn\'t exist.'}</p>
        <Link href="/services">
          <Button>Browse Services</Button>
        </Link>
      </div>
    )
  }

  const priceBreakdown = calculatePrice()
  const canSubmit = engagementAgreed && priceBreakdown && priceBreakdown.total > 0

  return (
    <div className="container py-12 max-w-5xl">
      {/* Back Button */}
      <Link href={`/services/${service.slug}`}>
        <Button variant="ghost" className="mb-8 gap-2 text-muted-foreground hover:text-foreground -ml-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Service
        </Button>
      </Link>

      <h1 className="text-2xl font-semibold text-foreground mb-2">Checkout</h1>
      <p className="text-muted-foreground mb-8">{service.name}</p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Engagement Letter */}
          <EngagementLetterCard
            serviceName={service.name}
            scopeIncluded={service.scope_included || []}
            scopeExcluded={service.scope_excluded || []}
            slaDays={service.sla_working_days}
            isAgreed={engagementAgreed}
            onAgreementChange={setEngagementAgreed}
          />

          {/* Variant Selector */}
          {variants.length > 0 && (
            <VariantSelector
              variants={variants}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
              title="Select Your Option"
              subtitle="Choose based on your business requirements"
            />
          )}

          {/* Addon Selector */}
          {addons.length > 0 && (
            <AddonSelector
              addons={addons}
              selectedAddons={selectedAddonIds}
              onAddonsChange={setSelectedAddonIds}
            />
          )}

          {/* Promo Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="h-5 w-5 text-muted-foreground" />
                Promo Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              {promoApplied ? (
                <div className="flex items-center justify-between bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center">
                      <Check className="h-5 w-5 text-[hsl(var(--ollvy-green))]" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{promoApplied.code}</p>
                      <p className="text-sm text-muted-foreground">
                        -{formatPaisa(promoApplied.discount)} applied
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemovePromo} className="text-muted-foreground">
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase())
                      setPromoError(null)
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim() || promoLoading}
                  >
                    {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                  </Button>
                </div>
              )}
              {promoError && (
                <p className="text-sm text-destructive mt-2">{promoError}</p>
              )}
            </CardContent>
          </Card>

          {/* Trust Signals */}
          <TrustSignalsCard />

          {/* Payment Methods */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">Accepted Payment Methods</p>
            <PaymentMethodLogos />
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          {priceBreakdown && (
            <OrderSummaryPanel
              serviceName={service.name}
              priceBreakdown={priceBreakdown}
              selectedAddons={selectedAddons}
              promoCode={promoApplied?.code}
              isProUser={user?.subscription_tier === 'pro'}
              isProcessing={isProcessing}
              canSubmit={canSubmit || false}
              onSubmit={handleCheckout}
            />
          )}
        </div>
      </div>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  )
}

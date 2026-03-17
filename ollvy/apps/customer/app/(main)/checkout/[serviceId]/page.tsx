'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { formatPaisa } from '@/lib/utils'
import { getFullAttributionData, clearAllAttributionData } from '@/lib/utm'
import type { ServicePackage } from '@/lib/types'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Shield,
  Tag,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PriceBreakdown {
  base: number
  govtFees: number
  gst: number
  gstRate: number
  proDiscount: number
  promoDiscount: number
  total: number
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.serviceId as string
  const { user } = useAuthStore()

  const [service, setService] = useState<ServicePackage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      setService(data)
    } catch (err) {
      console.error('Failed to fetch service:', err)
      setError('Service not found')
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePrice = (): PriceBreakdown | null => {
    if (!service) return null

    const base = service.price_base_paisa
    const govtFees = service.price_govt_fees_paisa || 0
    const gstRate = service.price_gst_rate || 18
    const gst = Math.round(base * (gstRate / 100))

    // Pro discount (5% for pro users - check user.subscription_tier)
    const proDiscount = user?.subscription_tier === 'pro' ? Math.round(base * 0.05) : 0

    // Promo discount
    const promoDiscount = promoApplied?.discount || 0

    const total = base + govtFees + gst - proDiscount - promoDiscount

    return {
      base,
      govtFees,
      gst,
      gstRate,
      proDiscount,
      promoDiscount,
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
    if (!service || !user) return

    setIsProcessing(true)

    try {
      const priceBreakdown = calculatePrice()
      if (!priceBreakdown) throw new Error('Price calculation failed')

      // Get attribution data (UTM, referral code, landing page) per §23 Connection Points 3 & 9
      const attribution = getFullAttributionData()

      // Create Razorpay order
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
            // Attribution data per §23
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
          // Payment successful - clear attribution and redirect
          clearAllAttributionData()
          router.push(`/orders/${data.order_id}`)
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
      <div className="container py-12 max-w-4xl">
        <Skeleton className="h-9 w-32 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-64 rounded-2xl" />
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="container py-20 text-center">
        <AlertCircle className="h-12 w-12 text-white/30 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-white mb-4">Service Not Found</h1>
        <p className="text-white/40 mb-8">{error || 'The service you\'re looking for doesn\'t exist.'}</p>
        <Link href="/services">
          <Button>Browse Services</Button>
        </Link>
      </div>
    )
  }

  const priceBreakdown = calculatePrice()

  return (
    <div className="container py-12 max-w-4xl">
      {/* Back Button */}
      <Link href={`/services/${service.slug}`}>
        <Button variant="ghost" className="mb-8 gap-2 text-white/50 hover:text-white -ml-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Service
        </Button>
      </Link>

      <h1 className="text-2xl font-semibold text-white mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Service Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white text-lg mb-1">{service.name}</h3>
                  <p className="text-white/40 text-sm mb-4">{service.short_description}</p>
                  <div className="flex items-center gap-4 text-sm text-white/50">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {service.sla_working_days} working days
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-4 w-4" />
                      Verified Expert
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promo Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-white/40" />
                Promo Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              {promoApplied ? (
                <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{promoApplied.code}</p>
                      <p className="text-sm text-white/50">
                        -{formatPaisa(promoApplied.discount)} applied
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemovePromo} className="text-white/50">
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
                <p className="text-sm text-white/50 mt-2">{promoError}</p>
              )}
            </CardContent>
          </Card>

          {/* What's Included */}
          {service.scope_included.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.scope_included.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-white/50 flex-shrink-0 mt-0.5" />
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {priceBreakdown && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Professional Fee</span>
                    <span className="text-white">{formatPaisa(priceBreakdown.base)}</span>
                  </div>
                  {priceBreakdown.govtFees > 0 && (
                    <div className="flex justify-between">
                      <span className="text-white/50">Government Fees</span>
                      <span className="text-white">{formatPaisa(priceBreakdown.govtFees)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/50">GST ({priceBreakdown.gstRate}%)</span>
                    <span className="text-white">{formatPaisa(priceBreakdown.gst)}</span>
                  </div>
                  {priceBreakdown.proDiscount > 0 && (
                    <div className="flex justify-between text-white/60">
                      <span>Pro Discount (5%)</span>
                      <span>-{formatPaisa(priceBreakdown.proDiscount)}</span>
                    </div>
                  )}
                  {priceBreakdown.promoDiscount > 0 && (
                    <div className="flex justify-between text-white/60">
                      <span>Promo Discount</span>
                      <span>-{formatPaisa(priceBreakdown.promoDiscount)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/[0.06] pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-white text-xl">{formatPaisa(priceBreakdown.total)}</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay {priceBreakdown && formatPaisa(priceBreakdown.total)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-white/30 text-center">
                Secure payment powered by Razorpay
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  )
}

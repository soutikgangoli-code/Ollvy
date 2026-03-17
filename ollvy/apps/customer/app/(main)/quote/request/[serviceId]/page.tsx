'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getFullAttributionData } from '@/lib/utm'
import type { ServicePackage } from '@/lib/types'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
  MapPin,
} from 'lucide-react'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
]

export default function QuoteRequestPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.serviceId as string
  const { user } = useAuthStore()

  const [service, setService] = useState<ServicePackage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [selectedState, setSelectedState] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push(`/login?returnUrl=/quote/request/${serviceId}`)
      return
    }
    setBusinessName(user.business_name || '')
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

      // If fixed price, redirect to checkout
      if (!data.price_varies_by_state) {
        router.push(`/checkout/${serviceId}`)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!service || !user || !selectedState) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Get attribution data per §23 Connection Points 3 & 9
      const attribution = getFullAttributionData()

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-quote-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            service_package_id: service.id,
            user_id: user.id,
            state: selectedState,
            business_name: businessName,
            additional_info: additionalInfo,
            // Attribution data per §23
            utm_source: attribution.utm?.utm_source,
            utm_medium: attribution.utm?.utm_medium,
            utm_campaign: attribution.utm?.utm_campaign,
            referral_code: attribution.referralCode,
            landing_page: attribution.landingPage,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to submit quote request')
      }

      // Redirect to quote detail page
      router.push(`/quote/${data.quote_request_id}`)
    } catch (err: any) {
      console.error('Quote request error:', err)
      setError(err.message || 'Failed to submit quote request')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 max-w-2xl">
        <Skeleton className="h-9 w-32 mb-8" />
        <Skeleton className="h-8 w-64 mb-3" />
        <Skeleton className="h-5 w-full mb-8" />
        <Skeleton className="h-96 rounded-2xl" />
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

  return (
    <div className="container py-12 max-w-2xl">
      {/* Back Button */}
      <Link href={`/services/${service.slug}`}>
        <Button variant="ghost" className="mb-8 gap-2 text-white/50 hover:text-white -ml-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Service
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-3">Get a Quote</h1>
        <p className="text-white/40">
          Government fees vary by state. Fill in your details to get exact pricing.
        </p>
      </div>

      {/* Service Info */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-white/40" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">{service.name}</h3>
              <p className="text-sm text-white/40 mb-3">{service.short_description}</p>
              <div className="flex items-center gap-1.5 text-sm text-white/50">
                <Clock className="h-4 w-4" />
                {service.sla_working_days} working days
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quote Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
          <CardDescription className="text-white/40">
            We'll use this information to calculate exact pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* State Selection */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-white/70">
                State <span className="text-white/30">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <select
                  id="state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required
                  className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-11 pr-4 py-2 text-sm text-white placeholder:text-white/30 transition-all duration-200 focus:outline-none focus:border-white/25 focus:bg-white/[0.07] appearance-none"
                >
                  <option value="" className="bg-[#1a1a1a]">Select your state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state} className="bg-[#1a1a1a]">
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-white/70">
                Business Name
              </Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
              />
            </div>

            {/* Additional Info */}
            <div className="space-y-2">
              <Label htmlFor="additionalInfo" className="text-white/70">
                Additional Information
              </Label>
              <textarea
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Any specific requirements or questions?"
                rows={4}
                className="flex w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-all duration-200 focus:outline-none focus:border-white/25 focus:bg-white/[0.07] resize-none"
              />
            </div>

            {error && (
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/70">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!selectedState || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Get Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-xs text-white/30 text-center">
              You'll receive your quote within 2 hours during business hours
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard'
import { LivePricePreview, LivePricePreviewCompact } from '@/components/questionnaire/LivePricePreview'
import { storePreCursorAnswers } from '@/lib/pre-cursor'
import type { ServicePackage } from '@/lib/types'

export default function EligibilityPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = params.serviceId as string

  // Live values for price preview (updated in real-time as user fills form)
  const [liveValues, setLiveValues] = useState<Record<string, unknown>>({})

  // Debug: log when liveValues changes
  useEffect(() => {
    console.log('[EligibilityPage] liveValues updated:', liveValues)
  }, [liveValues])

  const [service, setService] = useState<ServicePackage | null>(null)
  const [hasPrePaymentQuestions, setHasPrePaymentQuestions] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is editing (coming from checkout Edit button)
  const isEditing = searchParams.get('edit') === 'true'

  // Fetch service data + pre-payment question count in parallel
  // No auth needed — eligibility page is open to all users
  useEffect(() => {
    const fetchService = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const supabase = getClient()

        // Fetch service first to get the resolved UUID
        const { data: serviceData, error: serviceError } = await supabase
          .from('service_packages')
          .select('*')
          .or(`id.eq.${serviceId},slug.eq.${serviceId}`)
          .eq('is_active', true)
          .single()

        if (serviceError || !serviceData) {
          setError('Service not found')
          setIsLoading(false)
          return
        }

        setService(serviceData as ServicePackage)

        // Now use the resolved UUID for the questionnaire count
        const { count, error: countError } = await supabase
          .from('service_questionnaires')
          .select('*', { count: 'exact', head: true })
          .eq('service_package_id', serviceData.id)
          .eq('is_active', true)
          .eq('is_pre_payment', true)

        if (countError) {
          console.error('Error checking pre-payment questions:', countError)
          setHasPrePaymentQuestions(null)
          setError('Failed to load eligibility questions. Please refresh the page.')
        } else {
          setHasPrePaymentQuestions((count ?? 0) > 0)
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Failed to fetch service:', err)
        setError('Failed to load service')
        setIsLoading(false)
      }
    }

    fetchService()
  }, [serviceId])

  // No auth prompt on eligibility — let users fill the questionnaire freely.
  // Auth is handled on the checkout page (auto-prompt + Pay Now button).

  // Redirect to checkout if no pre-payment questions
  useEffect(() => {
    // Only redirect if we DEFINITELY know there are no pre-payment questions
    // (not on error, not on null/undefined)
    if (hasPrePaymentQuestions === false && service && !error) {
      const checkoutUrl = `/checkout/${serviceId}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
      router.replace(checkoutUrl)
    }
  }, [hasPrePaymentQuestions, service, serviceId, router, searchParams, error])

  // Handle completion of pre-payment questionnaire
  // Always proceed to checkout — auth is handled there
  const handleComplete = useCallback((answers: Record<string, unknown>) => {
    if (!service) return

    storePreCursorAnswers(service.slug, answers)

    const checkoutUrl = `/checkout/${serviceId}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
    router.push(checkoutUrl)
  }, [service, serviceId, router, searchParams])

  // Still loading — show questionnaire skeleton
  if (isLoading || hasPrePaymentQuestions === null) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-8 w-72 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="rounded-xl border border-border p-6 space-y-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg mt-4" />
        </div>
      </div>
    )
  }

  // No pre-payment questions — redirecting to checkout, show checkout skeleton
  if (hasPrePaymentQuestions === false) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            <Skeleton className="h-5 w-28 mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  // Error state - service not found
  if (!service) {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4">
        <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-8 text-center">
          <p className="text-destructive mb-4">{error || 'Service not found'}</p>
          <Button asChild>
            <Link href="/services">Browse Services</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Error state - pre-payment questions check failed (but service loaded)
  if (error && service) {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4">
        <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-8 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Service price config for live preview
  const servicePriceConfig = {
    slug: service.slug,
    priceBasePaisa: service.price_base_paisa || 0,
    priceGovtFeesPaisa: service.price_govt_fees_paisa || 0,
    priceGstRate: service.price_gst_rate || 18,
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
          <Link href={`/services/${service.slug}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {service.name}
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          Check Eligibility & Price
        </h1>
        <p className="text-muted-foreground mt-1">
          Answer a few questions to see your exact price for {service.name}
        </p>
      </div>

      {/* Two column layout on desktop */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Questionnaire */}
        <QuestionnaireWizard
          serviceId={service.id}
          serviceSlug={service.slug}
          mode="pre_payment"
          loadExisting={isEditing}
          onComplete={handleComplete}
          onValuesChange={setLiveValues}
        />

        {/* Live Price Preview - Desktop sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <LivePricePreview
              service={servicePriceConfig}
              answers={liveValues}
              showBreakdown={true}
            />
          </div>
        </div>
      </div>

      {/* Live Price Preview - Mobile sticky footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <LivePricePreviewCompact
          service={servicePriceConfig}
          answers={liveValues}
        />
      </div>

      {/* Spacer for mobile sticky footer */}
      <div className="lg:hidden h-16" />
    </div>
  )
}

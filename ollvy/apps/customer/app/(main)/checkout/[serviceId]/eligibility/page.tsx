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
import { useAuthStore } from '@/lib/stores/auth-store'
import type { ServicePackage } from '@/lib/types'

export default function EligibilityPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = params.serviceId as string
  const { session } = useAuthStore()

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
      const __t0 = performance.now()
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      const sinceNav = nav ? Math.round(performance.now() - nav.startTime) : null
      console.log(
        `[eligibility-perf] fetch starting (mount @ ${sinceNav}ms since navigation)`
      )
      setIsLoading(true)
      setError(null)

      try {
        const supabase = getClient()

        // Two-phase fetch with a fast path:
        //  - If serviceId looks like a UUID, fire BOTH queries in parallel
        //    (service_questionnaires can key off the UUID directly, no need
        //    to wait for the service_packages roundtrip first).
        //  - If it's a slug, fall back to sequential (resolve slug→id, then
        //    query questions). Slug usage is rare; UUID is the common path
        //    coming from /services or BookingPanel.
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(serviceId)
        const __tSvcStart = performance.now()

        if (isUuid) {
          const [serviceResult, countResult] = await Promise.all([
            supabase
              .from('service_packages')
              .select('*')
              .eq('id', serviceId)
              .eq('is_active', true)
              .single(),
            supabase
              .from('service_questionnaires')
              .select('*', { count: 'exact', head: true })
              .eq('service_package_id', serviceId)
              .eq('is_active', true)
              .eq('is_pre_payment', true),
          ])
          const __tParallelMs = Math.round(performance.now() - __tSvcStart)

          if (serviceResult.error || !serviceResult.data) {
            console.log(`[eligibility-perf] service fetch failed in ${__tParallelMs}ms`)
            setError('Service not found')
            setIsLoading(false)
            return
          }

          setService(serviceResult.data as ServicePackage)

          if (countResult.error) {
            console.error('Error checking pre-payment questions:', countResult.error)
            setHasPrePaymentQuestions(null)
            setError('Failed to load eligibility questions. Please refresh the page.')
          } else {
            setHasPrePaymentQuestions((countResult.count ?? 0) > 0)
          }

          console.log(
            `[eligibility-perf] done (parallel): total=${Math.round(performance.now() - __t0)}ms (parallel=${__tParallelMs}ms, hasQuestions=${(countResult.count ?? 0) > 0})`
          )
          setIsLoading(false)
          return
        }

        // Slug path — sequential waterfall (rare)
        const { data: serviceData, error: serviceError } = await supabase
          .from('service_packages')
          .select('*')
          .eq('slug', serviceId)
          .eq('is_active', true)
          .single()
        const __tSvcMs = Math.round(performance.now() - __tSvcStart)

        if (serviceError || !serviceData) {
          console.log(`[eligibility-perf] service fetch failed in ${__tSvcMs}ms`)
          setError('Service not found')
          setIsLoading(false)
          return
        }

        setService(serviceData as ServicePackage)

        const __tCntStart = performance.now()
        const { count, error: countError } = await supabase
          .from('service_questionnaires')
          .select('*', { count: 'exact', head: true })
          .eq('service_package_id', serviceData.id)
          .eq('is_active', true)
          .eq('is_pre_payment', true)
        const __tCntMs = Math.round(performance.now() - __tCntStart)

        if (countError) {
          console.error('Error checking pre-payment questions:', countError)
          setHasPrePaymentQuestions(null)
          setError('Failed to load eligibility questions. Please refresh the page.')
        } else {
          setHasPrePaymentQuestions((count ?? 0) > 0)
        }

        console.log(
          `[eligibility-perf] done (slug-sequential): total=${Math.round(performance.now() - __t0)}ms (servicePackage=${__tSvcMs}ms, questionsCount=${__tCntMs}ms, hasQuestions=${(count ?? 0) > 0})`
        )

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

    // Warm up create-razorpay-order so /checkout's eager order request hits a
    // hot isolate. The Deno isolate goes cold after ~30s and the user has
    // typically spent 30s-2min on this page filling the questionnaire. Without
    // this, the eligibility-routed flow pays a 1-3s cold-start tax that the
    // direct-checkout flow (e.g. GST) avoids. keepalive=true lets the request
    // continue through the navigation. Requires a real user JWT — the Supabase
    // gateway rejects anon-role tokens before the X-Warmup short-circuit runs.
    const accessToken = session?.access_token
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (accessToken && url) {
      fetch(`${url}/functions/v1/create-razorpay-order`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Warmup': '1',
        },
        body: '{}',
        keepalive: true,
      }).catch(() => {
        // Best-effort — never block navigation on warmup
      })
    }

    const checkoutUrl = `/checkout/${serviceId}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
    router.push(checkoutUrl)
  }, [service, serviceId, router, searchParams, session?.access_token])

  // Loading — show questionnaire skeleton (matches final layout)
  if (isLoading || hasPrePaymentQuestions === null) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-7 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            <div className="rounded-xl border border-border p-6 space-y-6">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-11 w-full rounded-lg" />
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-11 w-full rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg mt-2" />
            </div>
          </div>
          <div className="hidden lg:block">
            <Skeleton className="h-[280px] rounded-xl" />
          </div>
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

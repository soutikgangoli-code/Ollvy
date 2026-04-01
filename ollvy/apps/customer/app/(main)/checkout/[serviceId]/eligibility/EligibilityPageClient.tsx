'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard'
import { LivePricePreview, LivePricePreviewCompact } from '@/components/questionnaire/LivePricePreview'
import { storePreCursorAnswers } from '@/lib/pre-cursor'

interface InitialService {
  id: string
  slug: string
  name: string
  price_base_paisa: number
  price_govt_fees_paisa: number | null
  price_gst_rate: number | null
}

interface EligibilityPageClientProps {
  serviceId: string
  initialService?: InitialService
}

export function EligibilityPageClient({ serviceId, initialService }: EligibilityPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isHydrated, openAuthModal } = useAuthStore()

  // Live values for price preview (updated in real-time as user fills form)
  const [liveValues, setLiveValues] = useState<Record<string, unknown>>({})

  const [service, setService] = useState<InitialService | null>(initialService ?? null)
  const [isLoading, setIsLoading] = useState(!initialService)
  const [error, setError] = useState<string | null>(null)
  const [hasShownAuthPrompt, setHasShownAuthPrompt] = useState(false)

  // Check if user is editing (coming from checkout Edit button)
  const isEditing = searchParams.get('edit') === 'true'

  // Fetch service data only if not provided (fallback for direct navigation)
  useEffect(() => {
    if (initialService) return

    const fetchService = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const supabase = getClient()

        const { data: serviceData, error: serviceError } = await supabase
          .from('service_packages')
          .select('id, slug, name, price_base_paisa, price_govt_fees_paisa, price_gst_rate')
          .or(`id.eq.${serviceId},slug.eq.${serviceId}`)
          .eq('is_active', true)
          .single()

        if (serviceError || !serviceData) {
          throw new Error('Service not found')
        }

        setService(serviceData)
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to fetch service:', err)
        setError('Failed to load service')
        setIsLoading(false)
      }
    }

    fetchService()
  }, [serviceId, initialService])

  // Open auth modal once if user is not logged in
  useEffect(() => {
    if (!isHydrated) return
    if (!user && !hasShownAuthPrompt) {
      openAuthModal()
      setHasShownAuthPrompt(true)
    }
  }, [user, isHydrated, hasShownAuthPrompt, openAuthModal])

  // Handle completion of pre-payment questionnaire
  const handleComplete = useCallback((answers: Record<string, unknown>) => {
    if (!service) return

    // Store answers in sessionStorage
    storePreCursorAnswers(service.slug, answers)

    // Navigate to checkout
    const checkoutUrl = `/checkout/${serviceId}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
    router.push(checkoutUrl)
  }, [service, serviceId, router, searchParams])

  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="space-y-4">
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-12 w-full bg-muted rounded animate-pulse" />
            <div className="h-12 w-full bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !service) {
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

  // Auth required state - show questionnaire but prompt auth
  // Don't block rendering while waiting for hydration
  if (isHydrated && !user) {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Please sign in to check eligibility and pricing
          </p>
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

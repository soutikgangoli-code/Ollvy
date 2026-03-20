'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard'
import { storePreCursorAnswers } from '@/lib/pre-cursor'
import type { ServicePackage } from '@/lib/types'

export default function EligibilityPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = params.serviceId as string
  const { user, isHydrated, openAuthModal } = useAuthStore()

  const [service, setService] = useState<ServicePackage | null>(null)
  const [hasPrePaymentQuestions, setHasPrePaymentQuestions] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasShownAuthPrompt, setHasShownAuthPrompt] = useState(false)

  // Fetch service data
  useEffect(() => {
    if (!isHydrated) return

    const fetchService = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const supabase = getClient()

        // Fetch service package
        const { data: serviceData, error: serviceError } = await supabase
          .from('service_packages')
          .select('*')
          .or(`id.eq.${serviceId},slug.eq.${serviceId}`)
          .eq('is_active', true)
          .single()

        if (serviceError || !serviceData) {
          throw new Error('Service not found')
        }

        setService(serviceData as ServicePackage)

        // Check if this service has pre_payment questions
        const { count, error: countError } = await supabase
          .from('service_questionnaires')
          .select('*', { count: 'exact', head: true })
          .eq('service_package_id', serviceData.id)
          .eq('is_active', true)
          .eq('is_pre_payment', true)

        if (countError) {
          console.error('Error checking pre-payment questions:', countError)
          setHasPrePaymentQuestions(false)
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
  }, [serviceId, isHydrated])

  // Open auth modal once if user is not logged in
  useEffect(() => {
    if (!isHydrated) return
    if (!user && !hasShownAuthPrompt) {
      openAuthModal()
      setHasShownAuthPrompt(true)
    }
  }, [user, isHydrated, hasShownAuthPrompt, openAuthModal])

  // Redirect to checkout if no pre-payment questions
  useEffect(() => {
    if (hasPrePaymentQuestions === false && service) {
      // No pre-payment questions - redirect to checkout
      const checkoutUrl = `/checkout/${serviceId}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
      router.replace(checkoutUrl)
    }
  }, [hasPrePaymentQuestions, service, serviceId, router, searchParams])

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
  if (isLoading || !isHydrated) {
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

  // Auth required state - show loading while waiting for auth
  if (!user) {
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

  // Waiting for pre-payment questions check
  if (hasPrePaymentQuestions === null) {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
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

      {/* Questionnaire */}
      <QuestionnaireWizard
        serviceId={service.id}
        serviceSlug={service.slug}
        mode="pre_payment"
        onComplete={handleComplete}
      />
    </div>
  )
}

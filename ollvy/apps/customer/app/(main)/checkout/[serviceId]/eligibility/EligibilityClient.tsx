'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard'
import { LivePricePreview, LivePricePreviewCompact } from '@/components/questionnaire/LivePricePreview'
import { storePreCursorAnswers } from '@/lib/pre-cursor'
import { useAuthStore } from '@/lib/stores/auth-store'
import { firePreCreateOrder } from '@/lib/checkout-warmup'
import { getFullAttributionData } from '@/lib/utm'
import type { ServicePackage } from '@/lib/types'
import type { ServiceQuestion } from '@/lib/questionnaire/types'

interface EligibilityClientProps {
  // Fetched server-side (cached, ISR) and passed in so the questionnaire paints
  // with the page instead of waiting on two client-side Supabase round-trips.
  initialService: ServicePackage
  initialQuestions: ServiceQuestion[]
  serviceId: string
}

export default function EligibilityClient({
  initialService: service,
  initialQuestions,
  serviceId,
}: EligibilityClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Narrow selectors: subscribing to the whole store re-rendered this page on
  // every isLoading / isHydrated / banner flip during the AuthProvider hydrate.
  const session = useAuthStore((s) => s.session)
  const user = useAuthStore((s) => s.user)

  // Live values for price preview (updated in real-time as user fills form)
  const [liveValues, setLiveValues] = useState<Record<string, unknown>>({})

  // Check if user is editing (coming from checkout Edit button)
  const isEditing = searchParams.get('edit') === 'true'

  // Handle completion of pre-payment questionnaire
  // Always proceed to checkout — auth is handled there
  const handleComplete = useCallback((answers: Record<string, unknown>) => {
    if (!service) return

    // Wrap every potentially-throwing pre-navigation step in its own try/catch
    // so a single failure (sessionStorage quota, JSON.stringify weirdness,
    // attribution helper, useAuthStore hydration race) can't strand the user
    // on /eligibility. We always reach the router.push at the end.
    try {
      storePreCursorAnswers(service.slug, answers)
    } catch (e) {
      console.error('[eligibility] storePreCursorAnswers failed:', e)
    }

    // Pre-create the actual Razorpay order in the background. The result
    // lands in a module-level cache that /checkout's eager useEffect consumes
    // on mount — so the user's Pay click skips the create-order roundtrip
    // entirely. Fingerprint must match what CheckoutClient.tsx computes for
    // the same config or /checkout will fire its own request as a fallback.
    try {
      const accessToken = session?.access_token
      const userId = user?.id
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL

      if (accessToken && userId && url) {
        // Resolve effective variant/addons same way CheckoutClient does so
        // the fingerprints align.
        const variantFromUrl = searchParams.get('variant')
        const addonsFromUrl = searchParams.get('addons')

        let effectiveVariant: string | null = null
        if (service.variants && service.variants.length > 0) {
          if (variantFromUrl && service.variants.some((v) => v.id === variantFromUrl)) {
            effectiveVariant = variantFromUrl
          } else {
            effectiveVariant = service.variants[0].id
          }
        }

        let effectiveAddons: string[] = []
        if (service.addons && service.addons.length > 0) {
          if (addonsFromUrl) {
            effectiveAddons = addonsFromUrl
              .split(',')
              .filter((id) => service.addons!.some((a) => a.id === id))
          } else {
            effectiveAddons = service.addons
              .filter((a) => a.defaultSelected || a.required)
              .map((a) => a.id)
          }
        }

        // Fingerprint format must mirror CheckoutClient.tsx orderFingerprint
        const fingerprint = [
          service.id,
          effectiveVariant ?? '',
          [...effectiveAddons].sort().join(','),
          '', // no promo applied yet on /eligibility
          JSON.stringify(answers),
        ].join('|')

        firePreCreateOrder(
          {
            supabaseUrl: url,
            accessToken,
            servicePackageId: service.id,
            userId,
            variantId: effectiveVariant,
            addonIds: effectiveAddons,
            preCursorAnswers: answers,
            attribution: getFullAttributionData(),
          },
          fingerprint,
        ).catch((err) => {
          // Already caught and logged inside firePreCreateOrder; this is
          // belt-and-braces against rejection escaping.
          console.error('[eligibility] pre-create unexpected rejection:', err)
        })
      } else if (accessToken && url) {
        // Not logged in yet but have a session token (edge case). Fall back
        // to a plain warmup so the isolate is hot by the time the auth flow
        // completes on /checkout.
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
    } catch (e) {
      console.error('[eligibility] pre-create setup failed:', e)
    }

    // Navigate. If router.push throws for any reason, hard-redirect so the
    // user never gets stuck on the eligibility page after submitting.
    const checkoutUrl = `/checkout/${serviceId}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
    try {
      router.push(checkoutUrl)
    } catch (e) {
      console.error('[eligibility] router.push failed, falling back to window.location:', e)
      if (typeof window !== 'undefined') {
        window.location.href = checkoutUrl
      }
    }
  }, [service, serviceId, router, searchParams, session?.access_token, user?.id])

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
          serviceName={service.name}
          prefetchedQuestions={initialQuestions}
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

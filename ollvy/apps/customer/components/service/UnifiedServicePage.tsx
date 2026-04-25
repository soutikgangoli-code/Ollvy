'use client'

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { DBServiceConfig, ServicePricingData, ServiceReview, RelatedServiceCard } from '@/lib/data/services'
import { servicesBySlug } from '@/lib/services/data'
import {
  PRICE_VARIES_BY_QUESTIONNAIRE_SLUGS,
  isEligibilityFlow,
} from '@/lib/services/eligibility'
import { fallbackReviews, defaultFallbackReviews, type FallbackReview } from '@/lib/data/fallback-reviews'
import { ProcessStepper } from './ProcessStepper'

// Below-fold sections — code-split via next/dynamic. Default ssr:true means
// the HTML is still server-rendered for Googlebot; only the JS chunk defers.
// Each import has a loading skeleton matching the real component's rendered
// height so chunks arriving post-paint don't push content below them.
const BookingPanel = dynamic(
  () => import('./BookingPanel').then(m => ({ default: m.BookingPanel })),
  { loading: () => <div className="min-h-[500px] rounded-xl bg-muted/10" aria-hidden="true" /> }
)
const ExplainerStepper = dynamic(
  () => import('./ExplainerStepper').then(m => ({ default: m.ExplainerStepper })),
  { loading: () => <div className="min-h-[300px] rounded-xl bg-muted/10" aria-hidden="true" /> }
)
const ServiceRisks = dynamic(
  () => import('./ServiceRisks').then(m => ({ default: m.ServiceRisks })),
  { loading: () => <div className="min-h-[420px] rounded-xl bg-muted/10" aria-hidden="true" /> }
)
const ProfilePersonas = dynamic(
  () => import('./ProfilePersonas').then(m => ({ default: m.ProfilePersonas })),
  { loading: () => <div className="min-h-[360px] rounded-xl bg-muted/10" aria-hidden="true" /> }
)
const RelatedServices = dynamic(
  () => import('./RelatedServices').then(m => ({ default: m.RelatedServices })),
  { loading: () => <div className="min-h-[580px] sm:min-h-[320px] rounded-xl bg-muted/10" aria-hidden="true" /> }
)
const HowWeReviewed = dynamic(
  () => import('./HowWeReviewed').then(m => ({ default: m.HowWeReviewed })),
  { loading: () => <div className="min-h-[260px] rounded-xl bg-muted/10" aria-hidden="true" /> }
)
import { RelatedGuides } from './RelatedGuides'
const DIYvsOllvy = dynamic(
  () => import('@/components/service/DIYvsOllvy').then(m => ({ default: m.DIYvsOllvy })),
  { loading: () => <div className="min-h-[700px] rounded-xl bg-muted/10" aria-hidden="true" /> }
)
import { getClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getCompletionEstimate } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { useGTM } from '@/lib/hooks/useGTM'
import { usePostHogEvents } from '@/lib/hooks/usePostHogEvents'
import {
  CheckCircle,
  Star,
  ArrowRight,
  Check,
  Shield,
  Clock,
  Users,
  Award,
  X,
  HelpCircle,
  ChevronDown,
  FileText,
} from 'lucide-react'

// Mapping from service slug to document checklist page path
/**
 * For Tier A services, the first N FAQs render expanded by default; any
 * beyond N go behind a "Show more questions" expander. N = the pre-Phase-2
 * FAQ count for each service, so users see the curated original set on
 * first paint and can opt into the newer long-tail questions.
 *
 * Services not in this map show all FAQs unconditionally.
 *
 * Crawl/SEO: extra FAQs remain in the DOM when collapsed (max-h-0
 * overflow-hidden pattern) AND are duplicated as semantic HTML in the
 * sr-only block in app/(main)/services/[slug]/page.tsx AND appear in the
 * FAQPage JSON-LD schema. Three paths to Google; expander is visual only.
 */
const FAQ_INITIAL_VISIBLE_COUNT: Record<string, number> = {
  'gst-registration': 6,
  'pvt-ltd-incorporation': 10,
  'llp-incorporation': 5,
  'business-itr': 4,
  'trademark-registration': 5,
}

const documentChecklistPaths: Record<string, string> = {
  'pvt-ltd-incorporation': '/tools/documents/private-limited-company',
  'llp-incorporation': '/tools/documents/llp',
  'gst-registration': '/tools/documents/gst-registration',
  'trademark-registration': '/tools/documents/trademark',
  'business-itr': '/tools/documents/business-itr',
  'cloud-kitchen-setup': '/tools/documents/fssai',
}

interface UnifiedServicePageProps {
  service: DBServiceConfig
  pricing: ServicePricingData | null
  reviews?: ServiceReview[]
  relatedServices?: RelatedServiceCard[]
}

// Section definitions for navigation
const SECTIONS = [
  { id: 'process', label: 'How it works', component: 'ProcessStepper' },
  { id: 'included', label: 'What you get', component: 'WhatsIncluded' },
  { id: 'why-ollvy', label: 'Why Ollvy', component: 'DIYvsOllvy' },
  { id: 'risks', label: 'Risks', component: 'ServiceRisks' },
  { id: 'reviews', label: 'Reviews', component: 'Reviews_HowWeReviewed' },
  { id: 'documents', label: 'Documents', component: 'DocumentChecklist' },
  { id: 'faqs', label: 'FAQs', component: 'FAQs' },
] as const

type SectionId = typeof SECTIONS[number]['id']

// Helper to wrap numbers and currency in font-mono spans
function formatWithMonoNumbers(text: string | undefined | null): React.ReactNode {
  if (!text) return null
  // Match numbers (with optional commas, decimals) and currency symbols
  const parts = text.split(/(₹[\d,]+(?:\.\d+)?|\d+(?:,\d+)*(?:\.\d+)?%?)/g)
  return parts.map((part, i) => {
    // Check if this part is a number or currency
    if (/^₹?[\d,]+(?:\.\d+)?%?$/.test(part)) {
      return <span key={i} className="font-mono">{part}</span>
    }
    return part
  })
}

// Helper to generate contextually appropriate "How it works" heading
function getProcessHeading(serviceName: string, shortName: string): string {
  const nameLower = serviceName.toLowerCase()
  const shortLower = shortName.toLowerCase()

  // Company/entity formation
  if (
    nameLower.includes('company') ||
    nameLower.includes('incorporation') ||
    shortLower === 'private limited' ||
    shortLower === 'llp' ||
    shortLower === 'opc' ||
    shortLower === 'one person company' ||
    shortLower === 'partnership'
  ) {
    return `How Ollvy incorporates a ${shortName}`
  }

  // Registration services
  if (nameLower.includes('registration')) {
    // e.g., "GST Registration" -> "How Ollvy registers your GST"
    const subject = serviceName.replace(/\s*registration\s*/i, '').trim()
    return `How Ollvy registers your ${subject}`
  }

  // Filing/Return services
  if (nameLower.includes('return') || nameLower.includes('filing')) {
    return `How Ollvy files your ${shortName}`
  }

  // ITR services
  if (nameLower.includes('itr') || nameLower.includes('income tax')) {
    return `How Ollvy files your ${shortName}`
  }

  // KYC services
  if (nameLower.includes('kyc')) {
    return `How Ollvy completes your ${shortName}`
  }

  // Compliance services
  if (nameLower.includes('compliance') || nameLower.includes('annual')) {
    return `How Ollvy handles your ${shortName}`
  }

  // Default fallback
  return `How Ollvy handles your ${serviceName}`
}

// Reviews list — show 3 initially, expand to 5
function ReviewsList({
  reviews,
  fallback,
  serviceSlug,
}: {
  reviews: ServiceReview[]
  fallback: FallbackReview[]
  serviceSlug: string
}) {
  const [expanded, setExpanded] = useState(false)
  const hasDBReviews = reviews.length > 0
  const allItems = hasDBReviews ? reviews : fallback
  const visibleItems = expanded ? allItems.slice(0, 5) : allItems.slice(0, 3)
  const hasMore = allItems.length > 3 && !expanded

  return (
    <div className="space-y-4">
      {hasDBReviews
        ? visibleItems.map((review, index) => {
            const r = review as ServiceReview
            return (
              <Card key={`${r.created_at}-${index}`} className="border border-border bg-card p-3.5 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">{formatReviewDate(r.created_at)}</span>
                </div>
                {r.comment && <p className="text-sm text-foreground leading-relaxed">"{r.comment}"</p>}
                <p className="text-xs text-muted-foreground mt-3">- Verified customer</p>
              </Card>
            )
          })
        : visibleItems.map((review, index) => {
            const r = review as FallbackReview
            return (
              <Card key={index} className="border border-border bg-card p-3.5 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">{r.date}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">"{r.comment}"</p>
                <p className="text-xs text-muted-foreground mt-3">- {r.name}</p>
              </Card>
            )
          })}
      {hasMore && (
        <button
          onClick={() => setExpanded(true)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          Show more reviews
        </button>
      )}
    </div>
  )
}

// Mini mock visual components for What's Included section
function MockVisual({
  type,
  data,
}: {
  type?: 'receipt' | 'status' | 'checklist' | 'calendar' | 'arn'
  data?: Record<string, string>
}) {
  if (!type || !data) return null

  return (
    <div className="rounded-xl bg-background border border-border p-3 sm:p-4 font-mono text-[11px] sm:text-xs">
      {type === 'status' && (
        <div className="space-y-2">
          {data.label && (
            <p className="text-muted-foreground mb-3 font-sans text-xs uppercase tracking-widest">
              {data.label}
            </p>
          )}
          {Object.entries(data)
            .filter(([k]) => k.startsWith('row'))
            .map(([k, v]) => (
              <div
                key={k}
                className={cn(
                  'flex items-center gap-2',
                  v.includes('✓')
                    ? 'text-[hsl(var(--ollvy-green-fg))]'
                    : 'text-muted-foreground'
                )}
              >
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full shrink-0',
                    v.includes('✓')
                      ? 'bg-[hsl(var(--ollvy-green))]'
                      : 'bg-muted'
                  )}
                />
                {v}
              </div>
            ))}
          {data.note && (
            <p className="text-muted-foreground/60 text-[10px] border-t border-border pt-2 mt-2 font-sans">
              {data.note}
            </p>
          )}
        </div>
      )}
      {type === 'arn' && (
        <div className="space-y-2">
          {data.label && (
            <p className="text-muted-foreground font-sans text-xs uppercase tracking-widest mb-2">
              {data.label}
            </p>
          )}
          <p className="text-foreground text-[15px] sm:text-base font-bold tracking-wider">
            {data.value}
          </p>
          <p className="text-[hsl(var(--ollvy-green-fg))]">{data.status}</p>
          <p className="text-muted-foreground text-[10px]">{data.filed}</p>
          {data.verify && (
            <p className="text-muted-foreground/60 text-[10px] border-t border-border pt-2 mt-2 font-sans">
              {data.verify}
            </p>
          )}
        </div>
      )}
      {type === 'calendar' && (
        <div className="space-y-2">
          {data.label && (
            <p className="text-muted-foreground font-sans text-xs uppercase tracking-widest mb-2">
              {data.label}
            </p>
          )}
          {Object.entries(data)
            .filter(([k]) => k.startsWith('row'))
            .map(([k, v]) => {
              const [name, ...rest] = v?.split(' - ') ?? []
              return (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-foreground">{name}</span>
                  <span className="text-[hsl(var(--ollvy-amber))] text-[10px]">
                    {rest.join(' - ')}
                  </span>
                </div>
              )
            })}
          {data.note && (
            <p className="text-muted-foreground/60 text-[10px] border-t border-border pt-2 mt-1 font-sans">
              {data.note}
            </p>
          )}
        </div>
      )}
      {type === 'receipt' && (
        <div className="space-y-1.5">
          {data.label && (
            <p className="text-foreground font-semibold mb-2 font-sans text-xs">
              {data.label}
            </p>
          )}
          {Object.entries(data)
            .filter(([k]) => k.startsWith('row'))
            .map(([k, v]) => (
              <p key={k} className="text-muted-foreground">
                {v}
              </p>
            ))}
        </div>
      )}
    </div>
  )
}

function formatReviewDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function UnifiedServicePage({
  service,
  pricing,
  reviews = [],
  relatedServices = [],
}: UnifiedServicePageProps) {
  // Look up static config for govtFees and documents tables
  const staticConfig = servicesBySlug[service.slug]

  // Hide "Documents" tab for services that don't have a documents table
  const visibleSections = staticConfig?.documents
    ? SECTIONS
    : SECTIONS.filter(s => s.id !== 'documents')

  const [heroVisible, setHeroVisible] = useState(true)
  const [showAllFaqs, setShowAllFaqs] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  // Split FAQs: first N visible, rest behind a "Show more" expander.
  // Tier A services get the split; others show all.
  const faqInitialCount = FAQ_INITIAL_VISIBLE_COUNT[service.slug] ?? service.faqs.length
  const visibleFaqs = service.faqs.slice(0, faqInitialCount)
  const extraFaqs = service.faqs.slice(faqInitialCount)
  const hasExtraFaqs = extraFaqs.length > 0
  // activeSection is tracked in a ref — never re-renders the component
  const activeSectionRef = useRef<SectionId>('process')
  // Flag set during tap-triggered smooth-scroll so IO doesn't flicker through intermediate sections
  const programmaticScrollRef = useRef(false)

  // Variant selection state (shared with BookingPanel via callback)
  const [selectedVariant, setSelectedVariant] = useState<string>(
    service.defaultVariantId ?? service.variants?.[0]?.id ?? ''
  )

  // Explainer stepper open state
  const [explainerOpen, setExplainerOpen] = useState(false)
  const [docsExpanded, setDocsExpanded] = useState(false)

  // Prefetch checkout service data on CTA hover — warms browser cache
  const prefetchedRef = useRef(false)
  const prefetchCheckout = useCallback(() => {
    if (prefetchedRef.current) return
    prefetchedRef.current = true
    const supabase = getClient()
    supabase.from('service_packages').select('*').eq('slug', service.slug).single()
      .then(({ data }) => {
        if (!data) return
        // Also prefetch questionnaire count for services that go through eligibility
        if (isEligibilityFlow(service.slug)) {
          supabase
            .from('service_questionnaires')
            .select('*', { count: 'exact', head: true })
            .eq('service_package_id', data.id)
            .eq('is_active', true)
            .eq('is_pre_payment', true)
        }
      })
  }, [service.slug])

  // GTM + PostHog tracking
  const { trackViewService } = useGTM()
  const { trackServiceView, trackSectionView, trackSectionDwellTime } = usePostHogEvents()
  const [hasTrackedView, setHasTrackedView] = useState(false)
  const sectionsViewedRef = useRef<Set<string>>(new Set())
  // Per-section dwell tracking: when a section enters viewport, store ms timestamp.
  const sectionDwellStartRef = useRef<Record<string, number>>({})
  const DWELL_THRESHOLD_MS = 3000

  // Track view_item in GTM + service_viewed in PostHog when service page loads
  useEffect(() => {
    if (service && !hasTrackedView) {
      const priceInPaisa = (pricing?.ollvyFee ?? service.ollvyFee ?? 0) * 100 +
                          (pricing?.govtFee ?? service.govtFee ?? 0) * 100
      trackViewService({
        id: service.id,
        name: service.name,
        slug: service.slug,
        category: service.category,
        price: priceInPaisa,
      })
      trackServiceView(service.id, service.name, priceInPaisa, {
        service_slug: service.slug,
        category: service.category,
      })
      setHasTrackedView(true)
    }
  }, [service, pricing, hasTrackedView, trackViewService, trackServiceView])

  // Refs for smooth underline indicator — indicator position is updated imperatively
  const heroNavRef = useRef<HTMLDivElement>(null)
  const stickyNavRef = useRef<HTMLElement>(null)
  const mobileTabsRef = useRef<HTMLDivElement>(null)
  const heroIndicatorRef = useRef<HTMLDivElement>(null)
  const stickyIndicatorRef = useRef<HTMLDivElement>(null)

  // Section refs for scroll tracking
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    process: null,
    included: null,
    'why-ollvy': null,
    risks: null,
    reviews: null,
    documents: null,
    faqs: null,
  })

  // For retainers, use pre-computed nextDueDateValue
  // Otherwise, calculate the guaranteed date based on SLA days with govt processing awareness
  const completionEstimate = service.isRetainer
    ? null
    : getCompletionEstimate(
        service.slaDays,
        service.hasGovtProcessing ?? false,
        service.completionMaxDays,
        service.completionRangeText
      )

  const guaranteedDate = service.isRetainer
    ? service.nextDueDateValue
    : completionEstimate?.guaranteedDate ?? null

  // Show rating if DB rating exists and has sufficient reviews (>=5)
  const showRating =
    service.avgRating !== null &&
    service.avgRating !== undefined &&
    service.totalRatings >= 5

  // Calculate price with variant adjustment
  const selectedVariantData = service.variants?.find(v => v.id === selectedVariant)
  const priceAdjustment = selectedVariantData?.priceAdjustment ?? 0
  const govtFeeAdjustment = selectedVariantData?.govtFeeAdjustment ?? 0
  const adjustedOllvyFee = service.ollvyFee + (priceAdjustment / 100)
  const adjustedGovtFee = (service.govtFee ?? 0) + (govtFeeAdjustment / 100)

  // Calculate default addon total (for display in "Everything included")
  const defaultAddonTotal = service.addons
    ?.filter(addon => addon.defaultSelected)
    .reduce((sum, addon) => sum + addon.pricePaisa, 0) ?? 0
  const displayTotalOllvyFee = adjustedOllvyFee + (defaultAddonTotal / 100)

  const totalFee = adjustedOllvyFee + adjustedGovtFee

  // Services where govt fees vary based on questionnaire answers
  // These show "Starting from" prefix and use eligibility flow
  const priceVariesByQuestionnaire = (
    PRICE_VARIES_BY_QUESTIONNAIRE_SLUGS as readonly string[]
  ).includes(service.slug)

  // Determine CTA label and URL for this service
  const ctaLabel = service.priceVariesByState
    ? 'Get Quote'
    : priceVariesByQuestionnaire
    ? 'Check Eligibility & Price'
    : 'Start Application'

  // Build base checkout/eligibility URL
  // Services with pre-payment questions (pricing or context) go through eligibility
  // Others go directly to checkout - no intermediate loading screen
  const getCtaUrl = (includeVariant = false) => {
    const serviceId = service.id || service.slug
    const baseUrl = service.priceVariesByState
      ? `/quote/request/${serviceId}`
      : isEligibilityFlow(service.slug)
      ? `/checkout/${serviceId}/eligibility`
      : `/checkout/${serviceId}`
    if (includeVariant && service.variants && selectedVariant) {
      return `${baseUrl}?variant=${selectedVariant}`
    }
    return baseUrl
  }

  // Imperatively set active nav state — no React state, no re-renders.
  // Runs from IO callbacks (scrolling) and from tab taps.
  const applyActiveSection = useCallback((id: SectionId) => {
    activeSectionRef.current = id

    const paintNav = (container: HTMLElement | null): HTMLElement | null => {
      if (!container) return null
      const buttons = container.querySelectorAll<HTMLButtonElement>('[data-section]')
      let activeBtn: HTMLButtonElement | null = null
      buttons.forEach((btn) => {
        const isActive = btn.dataset.section === id
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false')
        btn.classList.toggle('text-foreground', isActive)
        btn.classList.toggle('text-muted-foreground', !isActive)
        btn.classList.toggle('hover:text-foreground', !isActive)
        // Mobile sticky tabs also toggle a bottom border color
        if (btn.dataset.navVariant === 'mobile-sticky') {
          btn.classList.toggle('border-foreground', isActive)
          btn.classList.toggle('border-transparent', !isActive)
        }
        if (isActive) activeBtn = btn
      })
      return activeBtn
    }

    const heroActive = paintNav(heroNavRef.current)
    const stickyActive = paintNav(stickyNavRef.current)
    paintNav(mobileTabsRef.current)

    // Position underline indicators imperatively
    if (heroActive && heroIndicatorRef.current) {
      heroIndicatorRef.current.style.transform = `translateX(${heroActive.offsetLeft}px)`
      heroIndicatorRef.current.style.width = `${heroActive.offsetWidth}px`
    }
    if (stickyActive && stickyIndicatorRef.current) {
      stickyIndicatorRef.current.style.transform = `translateX(${stickyActive.offsetLeft}px)`
      stickyIndicatorRef.current.style.width = `${stickyActive.offsetWidth}px`
    }

    // Center active tab inside mobile horizontal scroller
    if (mobileTabsRef.current) {
      const btn = mobileTabsRef.current.querySelector<HTMLButtonElement>(`[data-section="${id}"]`)
      if (btn) {
        const scrollLeft = btn.offsetLeft - mobileTabsRef.current.offsetWidth / 2 + btn.offsetWidth / 2
        mobileTabsRef.current.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' })
      }
    }
  }, [])

  // Scroll to section — tap handler. Suppresses IO-driven flicker during the smooth-scroll animation.
  const scrollToSection = useCallback((sectionId: SectionId) => {
    const element = sectionRefs.current[sectionId]
    if (!element) return
    programmaticScrollRef.current = true
    applyActiveSection(sectionId)
    const offset = 100
    const top = element.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    setTimeout(() => {
      programmaticScrollRef.current = false
    }, 600)
  }, [applyActiveSection])

  // Track active section via IntersectionObserver — off main thread, no layout reads
  useEffect(() => {
    const flushSectionDwell = (id: string) => {
      const startedAt = sectionDwellStartRef.current[id]
      if (!startedAt) return
      const dwellMs = Date.now() - startedAt
      delete sectionDwellStartRef.current[id]
      if (dwellMs < DWELL_THRESHOLD_MS) return
      const meta = SECTIONS.find((s) => s.id === id)
      trackSectionDwellTime(id, dwellMs, 'service', {
        service_slug: service.slug,
        section_label: meta?.label,
        component: meta?.component,
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Per-section dwell time: track entry/exit timestamps regardless of programmaticScroll
        for (const entry of entries) {
          const id = entry.target.id
          if (entry.isIntersecting) {
            if (!sectionDwellStartRef.current[id]) {
              sectionDwellStartRef.current[id] = Date.now()
            }
          } else {
            flushSectionDwell(id)
          }
        }

        if (programmaticScrollRef.current) return
        const intersectingIds = new Set(
          entries.filter((e) => e.isIntersecting).map((e) => e.target.id)
        )
        if (intersectingIds.size === 0) return
        // Fire PostHog section_viewed once per section per pageview
        for (const id of intersectingIds) {
          if (!sectionsViewedRef.current.has(id)) {
            sectionsViewedRef.current.add(id)
            const meta = SECTIONS.find((s) => s.id === id)
            trackSectionView(id, 'service', {
              service_slug: service.slug,
              section_label: meta?.label,
              component: meta?.component,
            })
          }
        }
        // Prefer the topmost section (earliest in SECTIONS order)
        for (const section of SECTIONS) {
          if (intersectingIds.has(section.id)) {
            if (activeSectionRef.current !== section.id) {
              applyActiveSection(section.id)
            }
            break
          }
        }
      },
      { rootMargin: '-150px 0px -70% 0px', threshold: 0 }
    )

    for (const section of SECTIONS) {
      const el = sectionRefs.current[section.id]
      if (el) observer.observe(el)
    }

    // Flush any active dwell when the user leaves the page
    const flushAll = () => {
      for (const id of Object.keys(sectionDwellStartRef.current)) flushSectionDwell(id)
    }
    const onPageHide = () => flushAll()
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushAll()
    }
    window.addEventListener('pagehide', onPageHide)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      flushAll()
      observer.disconnect()
      window.removeEventListener('pagehide', onPageHide)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [applyActiveSection, trackSectionView, trackSectionDwellTime, service.slug])

  // Initial mount + resize: sync nav to whichever section is currently active
  useEffect(() => {
    applyActiveSection(activeSectionRef.current)
    const handleResize = () => applyActiveSection(activeSectionRef.current)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [applyActiveSection])

  // Sticky bar: show when hero scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  // Hide global header when service sticky header is active
  useEffect(() => {
    if (heroVisible) {
      document.body.classList.remove('service-header-active')
    } else {
      document.body.classList.add('service-header-active')
    }
    return () => {
      document.body.classList.remove('service-header-active')
    }
  }, [heroVisible])

  return (
    <>
      {/* Sticky top bar - replaces navbar when hero scrolls out */}
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-[60] bg-background border-b border-border transition-all duration-300',
          heroVisible
            ? '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        )}
      >
        {/* Desktop: Full bar with logo, centered tabs */}
        <div className="hidden md:block max-w-[1200px] mx-auto px-6 overflow-hidden">
          <div className="relative flex items-center justify-center h-16">
            {/* Logo + Service name - absolute left */}
            <div className="absolute left-0 flex items-center gap-4 bg-background pr-4 z-10">
              <Link href="/" className="font-mono text-xl font-bold text-foreground tracking-tight">
                Ollvy
              </Link>
              <span className="text-muted-foreground">|</span>
              <span className="font-semibold text-foreground">
                {service.shortName}
              </span>
            </div>

            {/* Section tabs - centered, matching hero styling exactly */}
            <nav ref={stickyNavRef} className="flex gap-0 relative" role="tablist">
              {visibleSections.map((section) => (
                <button
                  key={section.id}
                  data-section={section.id}
                  role="tab"
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    'shrink-0 px-3 md:px-5 py-3 text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                    section.id === 'process'
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {section.label}
                </button>
              ))}
              {/* Sliding underline indicator — position updated imperatively */}
              <div
                ref={stickyIndicatorRef}
                className="absolute bottom-0 left-0 h-0.5 bg-foreground transition-[transform,width] duration-300 ease-out"
                style={{ width: 0 }}
              />
            </nav>
          </div>
        </div>

        {/* Mobile: Only section tabs */}
        <div ref={mobileTabsRef} className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-0 min-w-max px-4">
            {visibleSections.filter(s => s.id !== 'included').map((section) => (
              <button
                key={section.id}
                data-section={section.id}
                data-nav-variant="mobile-sticky"
                role="tab"
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  'shrink-0 px-3 py-3 text-xs font-medium transition-colors whitespace-nowrap border-b-2',
                  section.id === 'process'
                    ? 'text-foreground border-foreground'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                )}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-background">
        <main>
          {/* === HERO SECTION === */}
          <section
            ref={heroRef}
            className="relative min-h-[58vh] md:min-h-[63vh] flex flex-col items-center justify-center bg-background overflow-hidden pb-6 md:pb-8"
          >
            <div className="relative z-10 text-center w-full max-w-[800px] px-4 md:px-6">
              {/* Service name - large and bold */}
              <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight md:leading-[1.1] font-mono break-words">
                {service.name}
              </h1>

              {/* Tagline */}
              <p className="text-sm md:text-base text-muted-foreground mt-3 md:mt-4 px-2">
                {service.tagline}
              </p>

              {/* CTA row */}
              <div className="mt-5 md:mt-6 flex flex-col items-center gap-2">
                {/* Guarantee badge */}
                {guaranteedDate && (
                  <div className="text-center mb-1">
                    <p className="text-sm md:text-lg font-mono text-foreground">
                      <CheckCircle size={14} className="inline mr-1 text-[hsl(var(--ollvy-green))]" />
                      {service.isRetainer
                        ? `Current cycle due: ${guaranteedDate}`
                        : `Guaranteed by ${guaranteedDate}`}
                    </p>
                  </div>
                )}

                <Button size="lg" className="h-11 md:h-12 px-8 md:px-10" asChild onMouseEnter={prefetchCheckout} onTouchStart={prefetchCheckout}>
                  <Link href={getCtaUrl()} prefetch={true}>
                    {ctaLabel}
                  </Link>
                </Button>
              </div>

              {/* Metadata pills */}
              <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 mt-4 md:mt-8">
                <div className="px-2.5 md:px-4 py-1 md:py-2 rounded-full bg-muted/50 border border-border/50 font-mono">
                  <span className="text-[10px] md:text-xs text-muted-foreground">For </span>
                  <span className="text-[10px] md:text-xs font-medium text-foreground">{service.mandatoryFor}</span>
                </div>
                <div className="px-2.5 md:px-4 py-1 md:py-2 rounded-full bg-muted/50 border border-border/50 font-mono">
                  <span className="text-[10px] md:text-xs text-muted-foreground">Type </span>
                  <span className="text-[10px] md:text-xs font-medium text-foreground">{service.serviceType}</span>
                </div>
                <div className="px-2.5 md:px-4 py-1 md:py-2 rounded-full bg-muted/50 border border-border/50 font-mono">
                  <span className="text-[10px] md:text-xs text-muted-foreground">Turnaround </span>
                  <span className="text-[10px] md:text-xs font-medium text-foreground">
                    {service.isRetainer ? 'Ongoing' : `${service.slaDays} days`}
                  </span>
                </div>
                {showRating && service.avgRating && (
                  <div className="px-2.5 md:px-4 py-1 md:py-2 rounded-full bg-muted/50 border border-border/50 flex items-center gap-1 font-mono">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] md:text-xs font-medium text-foreground">
                      {service.avgRating.toFixed(1)}
                    </span>
                    <span className="text-[10px] md:text-xs text-muted-foreground">
                      ({service.totalRatings})
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Section navigation tabs - flush to bottom of hero */}
            <nav
              className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-sm"
              role="tablist"
            >
              <div className="max-w-[1200px] mx-auto px-4 md:px-6 overflow-x-auto scrollbar-hide overscroll-x-contain touch-pan-y">
                <div ref={heroNavRef} className="flex gap-0 -mb-px relative min-w-max md:min-w-0 md:justify-center">
                  {visibleSections.map((section) => (
                    <button
                      key={section.id}
                      data-section={section.id}
                      role="tab"
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        'shrink-0 px-3 md:px-5 py-3 text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                        section.id === 'included' && 'hidden md:block',
                        section.id === 'process'
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {section.label}
                    </button>
                  ))}
                  {/* Sliding underline indicator — position updated imperatively */}
                  <div
                    ref={heroIndicatorRef}
                    className="absolute bottom-0 left-0 h-0.5 bg-foreground transition-[transform,width] duration-300 ease-out"
                    style={{ width: 0 }}
                  />
                </div>
              </div>
            </nav>
          </section>

          {/* === MAIN CONTENT WITH STICKY SIDEBAR === */}
          <div className="max-w-[1200px] mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
              {/* Left: All content sections flowing */}
              <div className="min-w-0 space-y-0">

                {/* Section: How it works (Process Steps) */}
                <section
                  id="process"
                  ref={(el) => { sectionRefs.current.process = el }}
                  className={cn(
                    "pb-16 border-b border-border scroll-mt-28",
                    "pt-0"
                  )}
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                    THE PROCESS
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
                    {getProcessHeading(service.name, service.shortName)}
                  </h2>
                  <ProcessStepper steps={service.processSteps} serviceId={service.id || service.slug} serviceSlug={service.slug} priceVariesByState={service.priceVariesByState} />

                  {/* What is [Service Type]? - Trigger */}
                  {service.serviceExplainer && service.serviceExplainer.steps.length > 0 && (
                    <div className="mt-8">
                      <div className="flex justify-center">
                        <button
                          onClick={() => setExplainerOpen(!explainerOpen)}
                          className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
                        >
                          What is {service.name}?
                          <ChevronDown
                            size={14}
                            className={cn(
                              'transition-transform duration-200',
                              explainerOpen && 'rotate-180'
                            )}
                          />
                        </button>
                      </div>

                      {/* Always render for SEO, hide visually when collapsed */}
                      <div
                        className={cn(
                          'transition-all duration-300 overflow-hidden',
                          explainerOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        )}
                      >
                        <ExplainerStepper
                          serviceName={service.name}
                          steps={service.serviceExplainer.steps}
                        />
                      </div>
                    </div>
                  )}
                </section>

                {/* Section: What's Included — desktop only */}
                <section
                  id="included"
                  ref={(el) => { sectionRefs.current.included = el }}
                  className="hidden md:block py-10 sm:py-16 border-b border-border scroll-mt-28"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3 font-mono">
                    WHAT YOU GET
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-5 sm:mb-10">
                    Everything included
                  </h2>

                  <div className="divide-y divide-border">
                    {service.whatsIncluded.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          'grid gap-2.5 sm:gap-6 items-center py-2.5 sm:py-5',
                          item.mockVisualType
                            ? 'grid-cols-1 md:grid-cols-2'
                            : 'grid-cols-1'
                        )}
                      >
                        {/* Visual - alternating left/right */}
                        {item.mockVisualType && item.mockVisualData && Object.keys(item.mockVisualData).length > 0 && (
                          <div
                            className={cn(
                              'order-2',
                              index % 2 === 1 ? 'md:order-first' : 'md:order-last'
                            )}
                          >
                            <div className="max-w-[280px] sm:max-w-[320px] mx-auto">
                              <MockVisual
                                type={item.mockVisualType}
                                data={item.mockVisualData}
                              />
                            </div>
                          </div>
                        )}

                        {/* Text */}
                        <div className={cn(item.mockVisualType ? 'order-1' : '')}>
                          <div className="flex items-start gap-2.5 sm:gap-3">
                            <div className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))]/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={11} className="text-[hsl(var(--ollvy-green))]" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">
                                {formatWithMonoNumbers(item.title)}
                              </h3>
                              {/* Show body only when there's no comparison card and no mock visual - otherwise title is enough */}
                              {item.body && !item.comparisonWithout && !item.comparisonWithOllvy && !item.mockVisualType ? (
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                  {formatWithMonoNumbers(item.body)}
                                </p>
                              ) : item.body ? (
                                <span className="sr-only">{item.body}</span>
                              ) : null}

                              {/* Comparison */}
                              {(item.comparisonWithout || item.comparisonWithOllvy) && (
                                <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-2 sm:gap-3">
                                  <div className="border border-border bg-muted/30 rounded-lg p-2.5 sm:p-4">
                                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground mb-1.5 sm:mb-3 font-mono">
                                      Others
                                    </p>
                                    <p className="text-sm font-normal text-muted-foreground leading-snug">
                                      {item.comparisonWithout && formatWithMonoNumbers(item.comparisonWithout)}
                                    </p>
                                  </div>
                                  <div className="border border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 rounded-lg p-2.5 sm:p-4">
                                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[hsl(var(--ollvy-green-fg))] mb-1.5 sm:mb-3 font-mono">
                                      Ollvy
                                    </p>
                                    <p className="text-sm font-normal text-foreground leading-snug">
                                      {item.comparisonWithOllvy && formatWithMonoNumbers(item.comparisonWithOllvy)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section: DIY vs Ollvy comparison (replaces old govt fees section) */}
                <section className="py-16 border-b border-border">
                  <div className="mt-0" suppressHydrationWarning>
                    <DIYvsOllvy
                      slug={service.slug}
                      guaranteedDate={guaranteedDate}
                      isRetainer={service.isRetainer}
                      totalFee={totalFee}
                    />
                  </div>
                </section>

                {/* Section: Why Ollvy */}
                <section
                  id="why-ollvy"
                  ref={(el) => { sectionRefs.current['why-ollvy'] = el }}
                  className="py-16 border-b border-border scroll-mt-28"
                >
                  <div className="inline-flex items-center gap-2 bg-[hsl(var(--ollvy-green))]/10 border border-[hsl(var(--ollvy-green))]/20 rounded-full px-3 py-1 mb-5">
                    <span className="text-xs font-medium text-[hsl(var(--ollvy-green-fg))]">
                      Ollvy Guided
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug mb-4">
                    We file correctly.
                    <br />
                    Not just on time.
                  </h2>

                  {/* Others vs Ollvy comparison */}
                  {service.comparisonWithout && service.comparisonWith ? (
                    // Service-specific comparison with bullet points
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-[720px]">
                      <Card className="border border-red-500/30 bg-red-500/5 p-5">
                        <p className="text-xs uppercase tracking-widest text-red-600 dark:text-red-400 mb-4 font-mono">
                          Without Ollvy
                        </p>
                        <ul className="space-y-3">
                          {service.comparisonWithout.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                      <Card className="border border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 p-5">
                        <p className="text-xs uppercase tracking-widest text-[hsl(var(--ollvy-green-fg))] mb-4 font-mono">
                          With Ollvy
                        </p>
                        <ul className="space-y-3">
                          {service.comparisonWith.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                              <Check className="w-4 h-4 text-[hsl(var(--ollvy-green))] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  ) : (
                    // Generic comparison for services without specific data
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-10 max-w-[560px]">
                      <Card className="border border-border bg-muted/30 p-4 sm:p-5">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3 font-mono">
                          Others
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Documents taken as-is. Query or rejection? Your problem.
                        </p>
                      </Card>
                      <Card className="border border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 p-4 sm:p-5">
                        <p className="text-xs uppercase tracking-widest text-[hsl(var(--ollvy-green-fg))] mb-2 sm:mb-3 font-mono">
                          Ollvy
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          Every document reviewed before filing. Mismatches and format issues caught upfront.
                        </p>
                      </Card>
                    </div>
                  )}


                  {/* Profile Personas (merged into Why Ollvy section) */}
                  <div className="mt-7 sm:mt-16">
                    <ProfilePersonas
                      personas={service.profilePersonas}
                      serviceName={service.shortName}
                    />
                  </div>
                </section>

                {/* Section: Service Risks */}
                <section
                  id="risks"
                  ref={(el) => { sectionRefs.current.risks = el }}
                  className="py-16 border-b border-border scroll-mt-28"
                >
                  <ServiceRisks
                    risks={service.serviceRisks}
                    serviceShortName={service.shortName}
                  />
                </section>

                {/* Section: Unlocks (what this service unlocks) — renders unconditionally
                    so the section height is reserved; falls back to a single line when empty. */}
                <section className="py-16 border-b border-border">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                    NEXT STEPS
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                    What {service.shortName} unlocks
                  </h2>
                  <p className="text-sm text-muted-foreground mb-8">
                    Services that become available or mandatory after completion.
                  </p>

                  {service.unlocks && service.unlocks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.unlocks.map((item, i) => (
                        <Card
                          key={i}
                          className={cn(
                            'border p-5',
                            item.type === 'required'
                              ? 'border-[hsl(var(--ollvy-amber))]/30 bg-[hsl(var(--ollvy-amber))]/5'
                              : 'border-border bg-card'
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground">
                                  {item.name}
                                </h4>
                                {item.type === 'required' && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] border-[hsl(var(--ollvy-amber))]/50 text-[hsl(var(--ollvy-amber))]"
                                  >
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {item.explanation}
                              </p>
                            </div>
                            <span className="text-sm font-mono font-semibold text-foreground shrink-0">
                              {item.price}
                            </span>
                          </div>
                          <Link
                            href={`/services/${item.slug}`}
                            className="inline-flex items-center gap-1 text-xs text-[hsl(var(--ollvy-green-fg))] mt-3 hover:underline"
                          >
                            Learn more
                            <ArrowRight size={10} />
                          </Link>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nothing else follows this one.
                    </p>
                  )}
                </section>

                {/* Section: Reviews */}
                <section
                  id="reviews"
                  ref={(el) => { sectionRefs.current.reviews = el }}
                  className="py-16 border-b border-border scroll-mt-28"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                    CUSTOMER REVIEWS
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                    What customers say about {service.shortName}
                  </h2>

                  {/* Keyword chips from config */}
                  {service.reviewKeywordChips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 mb-8">
                      {service.reviewKeywordChips.map((chip) => (
                        <span
                          key={chip}
                          className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-foreground"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Rating summary */}
                  {showRating && service.avgRating && (
                    <div className="flex items-center gap-4 mb-8 p-4 bg-card border border-border rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <Star size={20} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold text-foreground">
                          {service.avgRating.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Based on {service.totalRatings} verified reviews
                      </div>
                    </div>
                  )}

                  {/* Reviews — show 3, expand to 5 */}
                  <ReviewsList
                    reviews={reviews}
                    fallback={fallbackReviews[service.slug] ?? defaultFallbackReviews}
                    serviceSlug={service.slug}
                  />
                </section>

                {/* Section: Documents Required (from static config) — collapsible */}
                {staticConfig?.documents && (
                  <section
                    id="documents"
                    ref={(el) => { sectionRefs.current.documents = el }}
                    className="py-16 border-b border-border scroll-mt-28"
                  >
                    <button
                      type="button"
                      onClick={() => setDocsExpanded(!docsExpanded)}
                      className="w-full text-left flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                          DOCUMENTS REQUIRED
                        </p>
                        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                          What you will provide
                        </h2>
                      </div>
                      <ChevronDown
                        size={20}
                        className={cn(
                          'text-muted-foreground transition-transform duration-200 shrink-0 ml-4',
                          docsExpanded && 'rotate-180'
                        )}
                      />
                    </button>

                    <div className={cn("mt-5 overflow-hidden transition-all", docsExpanded ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0")}>
                    <div className="rounded-xl border border-border overflow-hidden">
                      <table className="w-full text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/40">
                            {staticConfig.documents.headers.map((header, j) => (
                              <th
                                key={j}
                                className={cn(
                                  'text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-foreground font-mono text-xs uppercase tracking-widest',
                                  j > 0 && 'border-l border-border'
                                )}
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {staticConfig.documents.rows.map((row, i) => (
                            <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                              {row.map((cell, j) => (
                                <td
                                  key={j}
                                  className={cn(
                                    'py-2 sm:py-3 px-2 sm:px-4',
                                    j > 0 && 'border-l border-border',
                                    j === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
                                  )}
                                >
                                  {formatWithMonoNumbers(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {documentChecklistPaths[service.slug] && (
                      <div className="mt-6">
                        <Link
                          href={documentChecklistPaths[service.slug]}
                          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          See full document checklist
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-6">
                      Your documents are encrypted, visible only to your assigned professional, and deleted 90 days after your order closes.
                    </p>
                    </div>
                  </section>
                )}

                {/* Section: FAQs */}
                <section
                  id="faqs"
                  ref={(el) => { sectionRefs.current.faqs = el }}
                  className="py-16 border-b border-border scroll-mt-28"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                    COMMON QUESTIONS
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
                    Frequently asked questions
                  </h2>

                  <Accordion type="single" collapsible className="space-y-0 max-w-[720px]">
                    {/* Initial visible FAQs — always rendered normally */}
                    {visibleFaqs.map((faq, i) => (
                      <AccordionItem
                        key={i}
                        value={`faq-${i}`}
                        className="border-b border-border last:border-0"
                      >
                        <AccordionTrigger className="text-sm font-medium text-foreground text-left py-4 hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent forceMount className="text-sm text-muted-foreground leading-relaxed pb-5">
                          {faq.a.includes('\n') ? (
                            faq.a.split('\n').filter(Boolean).map((line, j) => (
                              <p key={j} className={j > 0 ? 'mt-2' : ''}>
                                {line}
                              </p>
                            ))
                          ) : (
                            faq.a
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}

                    {/* Extra FAQs — crawlable but visually collapsed until user expands.
                        max-h-0 overflow-hidden pattern keeps them in DOM for Google
                        (FAQPage schema + sr-only block on page.tsx already duplicate
                        the same content, so this wrapper is visual-only). */}
                    {hasExtraFaqs && (
                      <div
                        id="faq-extras"
                        aria-hidden={!showAllFaqs}
                        className={cn(
                          'grid transition-[grid-template-rows] duration-300 ease-out',
                          showAllFaqs ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        )}
                      >
                        <div className="overflow-hidden">
                          {extraFaqs.map((faq, i) => (
                            <AccordionItem
                              key={`extra-${i}`}
                              value={`faq-extra-${i}`}
                              className="border-b border-border last:border-0"
                            >
                              <AccordionTrigger className="text-sm font-medium text-foreground text-left py-4 hover:no-underline">
                                {faq.q}
                              </AccordionTrigger>
                              <AccordionContent forceMount className="text-sm text-muted-foreground leading-relaxed pb-5">
                                {faq.a.includes('\n') ? (
                                  faq.a.split('\n').filter(Boolean).map((line, j) => (
                                    <p key={j} className={j > 0 ? 'mt-2' : ''}>
                                      {line}
                                    </p>
                                  ))
                                ) : (
                                  faq.a
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Government fees FAQ with rich table */}
                    {staticConfig?.govtFees && (
                      <AccordionItem
                        value="faq-govt-fees"
                        className="border-b border-border last:border-0"
                      >
                        <AccordionTrigger className="text-sm font-medium text-foreground text-left py-4 hover:no-underline">
                          What government fees apply for {service.name}?
                        </AccordionTrigger>
                        <AccordionContent forceMount className="pb-5">
                          <div className="rounded-xl border border-border overflow-hidden">
                            {/* Caption */}
                            {staticConfig.govtFees.caption && (
                              <div className="px-4 py-3 border-b border-border bg-muted/30">
                                <p className="text-xs font-medium text-muted-foreground">
                                  {staticConfig.govtFees.caption}
                                </p>
                              </div>
                            )}
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border bg-muted/20">
                                  {staticConfig.govtFees.headers.map((header, j) => (
                                    <th
                                      key={j}
                                      className="text-left py-3 px-4 font-semibold text-foreground"
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {staticConfig.govtFees.rows.map((row, ri) => (
                                  <tr
                                    key={ri}
                                    className="border-b border-border last:border-0"
                                  >
                                    {row.map((cell, ci) => (
                                      <td
                                        key={ci}
                                        className={cn(
                                          'py-3 px-4',
                                          ci === 0
                                            ? 'text-foreground font-medium'
                                            : 'text-muted-foreground'
                                        )}
                                      >
                                        {formatWithMonoNumbers(cell)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>

                  {/* Show-more / show-less toggle for extra FAQs.
                      Extras are already in DOM above (aria-hidden toggled);
                      this button switches the max-height animation. */}
                  {hasExtraFaqs && (
                    <button
                      type="button"
                      onClick={() => setShowAllFaqs(!showAllFaqs)}
                      aria-expanded={showAllFaqs}
                      aria-controls="faq-extras"
                      className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
                    >
                      {showAllFaqs ? 'Show less' : 'Show more'}
                      <ChevronDown
                        size={14}
                        className={cn(
                          'transition-transform duration-200',
                          showAllFaqs && 'rotate-180'
                        )}
                      />
                    </button>
                  )}
                </section>

                {/* Section: Related Services */}
                <section className="py-16 border-b border-border">
                  <RelatedServices services={relatedServices} />
                </section>

                {/* Section: Related Guides (cross-links to deep-dive guides) */}
                <RelatedGuides
                  serviceSlug={service.slug}
                  serviceShortName={service.shortName}
                />

                {/* Section: How We Reviewed */}
                <HowWeReviewed service={service} />
              </div>

              {/* Right: Booking panel - sticky sidebar */}
              <aside className="hidden lg:block sticky top-20 self-start">
                <BookingPanel
                  service={service}
                  serviceId={service.id || service.slug}
                  priceVariesByState={service.priceVariesByState}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />
              </aside>
            </div>
          </div>

          {/* Final CTA Section — desktop only */}
          <section className="bg-card py-24 hidden lg:block">
            <div className="container text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                Get {service.shortName} done now
              </h2>
              <p className="text-base text-muted-foreground mt-4 whitespace-nowrap">
                Fixed price. Verified CA. Done within {service.slaDays} working days.
              </p>
              <Button size="lg" className="mt-8" asChild onMouseEnter={prefetchCheckout} onTouchStart={prefetchCheckout}>
                <Link href={getCtaUrl()} prefetch={true}>
                  {ctaLabel}
                </Link>
              </Button>
            </div>
          </section>
        </main>
      </div>

      {/* Mobile booking bar - fixed bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-3 py-2 lg:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="shrink-0">
            <div className="flex items-baseline gap-1.5">
              <p className="font-mono font-bold text-foreground text-base">
                ₹{totalFee.toLocaleString('en-IN')}
              </p>
              {service.mrp && service.mrp > totalFee && (
                <p className="font-mono text-sm text-muted-foreground line-through">
                  ₹{service.mrp.toLocaleString('en-IN')}
                </p>
              )}
            </div>
            {guaranteedDate && (
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ollvy-green))]" />
                <p className="text-[11px] text-muted-foreground font-mono">
                  {service.isRetainer
                    ? `Due: ${guaranteedDate}`
                    : `Guaranteed by ${guaranteedDate}`}
                </p>
              </div>
            )}
          </div>
          <Button size="lg" className="w-[55%] h-10" asChild onMouseEnter={prefetchCheckout} onTouchStart={prefetchCheckout}>
            <Link href={getCtaUrl(true)} prefetch={true}>
              {ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}

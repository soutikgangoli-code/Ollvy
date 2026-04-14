'use client'

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import Link from 'next/link'
import { DBServiceConfig, ServicePricingData, ServiceReview, RelatedServiceCard } from '@/lib/data/services'
import { servicesBySlug } from '@/lib/services/data'
import { fallbackReviews, defaultFallbackReviews } from '@/lib/data/fallback-reviews'
import { BookingPanel } from './BookingPanel'
import { ProcessStepper } from './ProcessStepper'
import { ExplainerStepper } from './ExplainerStepper'
import { ServiceRisks } from './ServiceRisks'
import { ProfilePersonas } from './ProfilePersonas'
// Import directly for SEO crawlability - dynamic imports hide content from Google
import { RelatedServices } from './RelatedServices'
import { HowWeReviewed } from './HowWeReviewed'
import { DIYvsOllvy } from '@/components/service/DIYvsOllvy'
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

interface GeoContext {
  city: string
  state: string
}

// Mapping from service slug to document checklist page path
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
  geoContext?: GeoContext
}

// Section definitions for navigation
const SECTIONS = [
  { id: 'process', label: 'How it works' },
  { id: 'included', label: 'What you get' },
  { id: 'why-ollvy', label: 'Why Ollvy' },
  { id: 'risks', label: 'Risks' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faqs', label: 'FAQs' },
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
    <div className="rounded-xl bg-background border border-border p-4 font-mono text-xs">
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
          <p className="text-foreground text-base font-bold tracking-wider">
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
  geoContext,
}: UnifiedServicePageProps) {
  // Look up static config for govtFees and documents tables
  const staticConfig = servicesBySlug[service.slug]

  const [heroVisible, setHeroVisible] = useState(true)
  const [activeSection, setActiveSection] = useState<SectionId>('process')
  const heroRef = useRef<HTMLDivElement>(null)

  // Variant selection state (shared with BookingPanel via callback)
  const [selectedVariant, setSelectedVariant] = useState<string>(
    service.defaultVariantId ?? service.variants?.[0]?.id ?? ''
  )

  // Explainer stepper open state
  const [explainerOpen, setExplainerOpen] = useState(false)
  const [docsExpanded, setDocsExpanded] = useState(false)

  // GTM tracking
  const { trackViewService } = useGTM()
  const [hasTrackedView, setHasTrackedView] = useState(false)

  // Track view_item in GTM when service page loads
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
      setHasTrackedView(true)
    }
  }, [service, pricing, hasTrackedView, trackViewService])

  // Refs for smooth underline indicator
  const heroNavRef = useRef<HTMLDivElement>(null)
  const stickyNavRef = useRef<HTMLElement>(null)
  const mobileTabsRef = useRef<HTMLDivElement>(null)
  const [heroIndicator, setHeroIndicator] = useState({ left: 0, width: 0 })
  const [stickyIndicator, setStickyIndicator] = useState({ left: 0, width: 0 })

  // Section refs for scroll tracking
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    process: null,
    included: null,
    'why-ollvy': null,
    risks: null,
    reviews: null,
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

  // Show rating if DB rating exists and has sufficient reviews (>=10)
  const showRating =
    service.avgRating !== null &&
    service.avgRating !== undefined &&
    service.totalRatings >= 10

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
  const priceVariesByQuestionnaire = [
    'trademark-registration',
    'pvt-ltd-incorporation',
    'llp-incorporation',
  ].includes(service.slug)

  // Services with pre-payment questions that don't affect pricing
  // These route through eligibility for context collection but keep fixed pricing labels
  const hasPrePaymentQuestions = [
    'iepf-consultation',
  ].includes(service.slug)

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
      : (priceVariesByQuestionnaire || hasPrePaymentQuestions)
      ? `/checkout/${serviceId}/eligibility`
      : `/checkout/${serviceId}`
    if (includeVariant && service.variants && selectedVariant) {
      return `${baseUrl}?variant=${selectedVariant}`
    }
    return baseUrl
  }

  // Scroll to section
  const scrollToSection = useCallback((sectionId: SectionId) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      const offset = 100 // Account for sticky header
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150 // Offset for header

      // Find the current section
      for (const section of [...SECTIONS].reverse()) {
        const element = sectionRefs.current[section.id]
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update indicator position when active section changes
  useEffect(() => {
    const updateIndicators = () => {
      // Hero nav indicator
      if (heroNavRef.current) {
        const activeButton = heroNavRef.current.querySelector(`[data-section="${activeSection}"]`) as HTMLElement
        if (activeButton) {
          setHeroIndicator({
            left: activeButton.offsetLeft,
            width: activeButton.offsetWidth,
          })
        }
      }

      // Sticky nav indicator
      if (stickyNavRef.current) {
        const activeButton = stickyNavRef.current.querySelector(`[data-section="${activeSection}"]`) as HTMLElement
        if (activeButton) {
          setStickyIndicator({
            left: activeButton.offsetLeft,
            width: activeButton.offsetWidth,
          })
        }
      }

      // Mobile tabs: scroll active tab into center of container
      if (mobileTabsRef.current) {
        const activeButton = mobileTabsRef.current.querySelector(`[data-section="${activeSection}"]`) as HTMLElement
        if (activeButton) {
          const container = mobileTabsRef.current
          const scrollLeft = activeButton.offsetLeft - (container.offsetWidth / 2) + (activeButton.offsetWidth / 2)
          container.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: 'smooth'
          })
        }
      }
    }

    updateIndicators()
    // Also update on resize
    window.addEventListener('resize', updateIndicators)
    return () => window.removeEventListener('resize', updateIndicators)
  }, [activeSection])

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
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  data-section={section.id}
                  role="tab"
                  aria-selected={activeSection === section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    'shrink-0 px-3 md:px-5 py-3 text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                    activeSection === section.id
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {section.label}
                </button>
              ))}
              {/* Sliding underline indicator */}
              <div
                className="absolute bottom-0 h-0.5 bg-foreground transition-all duration-300 ease-out"
                style={{
                  left: stickyIndicator.left,
                  width: stickyIndicator.width,
                }}
              />
            </nav>
          </div>
        </div>

        {/* Mobile: Only section tabs */}
        <div ref={mobileTabsRef} className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-0 min-w-max px-4">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                data-section={section.id}
                role="tab"
                aria-selected={activeSection === section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  'shrink-0 px-3 py-3 text-xs font-medium transition-colors whitespace-nowrap border-b-2',
                  activeSection === section.id
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
            className="relative min-h-[65vh] flex flex-col items-center justify-center bg-background overflow-hidden pb-10"
          >
            <div className="relative z-10 text-center w-full max-w-[800px] px-4 md:px-6">
              {/* Service name - large and bold */}
              <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight md:leading-[1.1] font-mono break-words">
                {service.name}
                {geoContext && (
                  <span className="text-muted-foreground"> in {geoContext.city}</span>
                )}
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

                <Button size="lg" className="h-11 md:h-12 px-8 md:px-10" asChild>
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
              <div className="max-w-[1200px] mx-auto px-4 md:px-6 overflow-x-auto scrollbar-hide">
                <div ref={heroNavRef} className="flex gap-0 -mb-px relative min-w-max md:min-w-0 md:justify-center">
                  {SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      data-section={section.id}
                      role="tab"
                      aria-selected={activeSection === section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        'shrink-0 px-3 md:px-5 py-3 text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                        activeSection === section.id
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {section.label}
                    </button>
                  ))}
                  {/* Sliding underline indicator */}
                  <div
                    className="absolute bottom-0 h-0.5 bg-foreground transition-all duration-300 ease-out"
                    style={{
                      left: heroIndicator.left,
                      width: heroIndicator.width,
                    }}
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
                        aria-hidden={!explainerOpen}
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

                {/* Section: What's Included */}
                <section
                  id="included"
                  ref={(el) => { sectionRefs.current.included = el }}
                  className="py-16 border-b border-border scroll-mt-28"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                    WHAT YOU GET
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 sm:mb-10">
                    Everything included
                  </h2>

                  <div className="divide-y divide-border">
                    {service.whatsIncluded.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          'grid gap-3 sm:gap-6 items-center py-3 sm:py-5',
                          item.mockVisualType
                            ? 'grid-cols-1 md:grid-cols-2'
                            : 'grid-cols-1'
                        )}
                      >
                        {/* Visual - alternating left/right */}
                        {item.mockVisualType && (
                          <div
                            className={cn(
                              'order-2',
                              index % 2 === 1 ? 'md:order-first' : 'md:order-last'
                            )}
                          >
                            <div className="max-w-[320px] mx-auto">
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
                              {item.body && (
                                item.body.includes('\n') ? (
                                  <ul className="text-sm text-muted-foreground mt-1 leading-relaxed list-disc list-inside space-y-0.5">
                                    {item.body.split('\n').filter(Boolean).map((line, li) => (
                                      <li key={li}>{formatWithMonoNumbers(line)}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                    {formatWithMonoNumbers(item.body)}
                                  </p>
                                )
                              )}

                              {/* Comparison */}
                              {(item.comparisonWithout || item.comparisonWithOllvy) && (
                                <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
                                  <div className="bg-muted/40 rounded-lg p-2.5 border border-border">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-mono">
                                      Without Ollvy
                                    </p>
                                    <p className="text-xs sm:text-sm font-medium text-foreground">
                                      {item.comparisonWithout && formatWithMonoNumbers(item.comparisonWithout)}
                                    </p>
                                  </div>
                                  <div className="bg-[hsl(var(--ollvy-green))]/5 rounded-lg p-2.5 border border-[hsl(var(--ollvy-green))]/20">
                                    <p className="text-[10px] text-[hsl(var(--ollvy-green-fg))] uppercase tracking-widest mb-1 font-mono">
                                      With Ollvy
                                    </p>
                                    <p className="text-xs sm:text-sm font-medium text-foreground">
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

                {/* Section: Documents Required (from static config) — collapsible */}
                {staticConfig?.documents && (
                  <section className="py-16 border-b border-border">
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

                    {docsExpanded && (
                    <div className="mt-5">
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
                    )}
                  </section>
                )}

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

                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[560px]">
                    Every order carries a guaranteed completion date. If we miss it, the full service fee is refunded automatically. No claim needed.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[560px] mt-3">
                    Your Ollvy CA is a qualified, practicing chartered accountant with at least three years of experience. Ask for their credentials at any point.
                  </p>

                  {/* Profile Personas (merged into Why Ollvy section) */}
                  <div className="mt-10 sm:mt-16">
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

                {/* Section: Unlocks (what this service unlocks) */}
                {service.unlocks && service.unlocks.length > 0 && (
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
                  </section>
                )}

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

                  {/* Reviews */}
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review, index) => (
                        <Card
                          key={`${review.created_at}-${index}`}
                          className="border border-border bg-card p-5"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatReviewDate(review.created_at)}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-foreground leading-relaxed">
                              "{review.comment}"
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-3">
                            - Verified customer
                          </p>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(fallbackReviews[service.slug] ?? defaultFallbackReviews).map((review, index) => (
                        <Card key={index} className="border border-border bg-card p-5">
                          <div className="flex items-center gap-2 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">
                              {review.date}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            "{review.comment}"
                          </p>
                          <p className="text-xs text-muted-foreground mt-3">
                            - {review.name}
                          </p>
                        </Card>
                      ))}
                    </div>
                  )}
                </section>

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
                    {service.faqs.map((faq, i) => (
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
                </section>

                {/* Section: Related Services */}
                <section className="py-16 border-b border-border">
                  <RelatedServices services={relatedServices} />
                </section>

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
              <Button size="lg" className="mt-8" asChild>
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
          <Button size="lg" className="w-[55%] h-10" asChild>
            <Link href={getCtaUrl(true)} prefetch={true}>
              {ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}

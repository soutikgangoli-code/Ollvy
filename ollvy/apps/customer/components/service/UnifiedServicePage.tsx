'use client'

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { DBServiceConfig, ServicePricingData, ServiceReview, RelatedServiceCard } from '@/lib/data/services'
import { BookingPanel } from './BookingPanel'
import { ProcessStepper } from './ProcessStepper'
import { ExplainerStepper } from './ExplainerStepper'
import { ServiceRisks } from './ServiceRisks'
import { ProfilePersonas } from './ProfilePersonas'
import { RelatedServices } from './RelatedServices'
import { HowWeReviewed } from './HowWeReviewed'
import { CompletionStats } from './CompletionStats'
import { DocumentChecklist } from '@/components/landing/DocumentChecklist'
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
} from 'lucide-react'

interface GeoContext {
  city: string
  state: string
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
  { id: 'process', label: 'Process' },
  { id: 'included', label: "What's Included" },
  { id: 'why-ollvy', label: 'Why Ollvy' },
  { id: 'risks', label: 'Risks' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'documents', label: 'Documents' },
  { id: 'faqs', label: 'FAQs' },
] as const

type SectionId = typeof SECTIONS[number]['id']

// Helper to wrap numbers and currency in font-mono spans
function formatWithMonoNumbers(text: string): React.ReactNode {
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
    const subject = shortName.replace(/\s*registration\s*/i, '').trim()
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
              const [name, ...rest] = v.split(' - ')
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
  const [heroVisible, setHeroVisible] = useState(true)
  const [activeSection, setActiveSection] = useState<SectionId>('process')
  const heroRef = useRef<HTMLDivElement>(null)

  // Variant selection state (shared with BookingPanel via callback)
  const [selectedVariant, setSelectedVariant] = useState<string>(
    service.defaultVariantId ?? service.variants?.[0]?.id ?? ''
  )

  // Explainer stepper open state
  const [explainerOpen, setExplainerOpen] = useState(false)

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

  // Determine CTA label and URL for this service
  const ctaLabel = service.priceVariesByState
    ? 'Get Quote'
    : priceVariesByQuestionnaire
    ? 'Check Eligibility & Price'
    : 'Book Now'

  // Build base checkout/eligibility URL
  // Always go through eligibility first - it handles redirect to checkout if no questions
  const getCtaUrl = (utmMedium: string, includeVariant = false) => {
    const serviceId = service.id || service.slug
    const baseUrl = service.priceVariesByState
      ? `/quote/request/${serviceId}`
      : `/checkout/${serviceId}/eligibility`
    const params = new URLSearchParams({
      utm_source: 'service_page',
      utm_medium: utmMedium,
    })
    if (includeVariant && service.variants && selectedVariant) {
      params.set('variant', selectedVariant)
    }
    return `${baseUrl}?${params.toString()}`
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

      // Mobile tabs: scroll active tab into view (at the start)
      if (mobileTabsRef.current) {
        const activeButton = mobileTabsRef.current.querySelector(`[data-section="${activeSection}"]`) as HTMLElement
        if (activeButton) {
          // Scroll the active tab to the left edge with some padding
          mobileTabsRef.current.scrollTo({
            left: activeButton.offsetLeft - 16,
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

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.tagline,
    url: service.canonicalUrl,
    provider: {
      '@type': 'Organization',
      name: 'Ollvy Technologies Private Limited',
      url: 'https://ollvy.com',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    offers: {
      '@type': 'Offer',
      price: totalFee.toString(),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    ...(service.avgRating && service.totalRatings >= 10
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: service.avgRating.toFixed(1),
            reviewCount: service.totalRatings,
          },
        }
      : {}),
  }

  return (
    <>
      <Script
        id="service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky top bar - replaces navbar when hero scrolls out */}
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-background border-b border-border transition-all duration-300',
          heroVisible
            ? '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        )}
      >
        {/* Desktop: Full bar with logo, tabs, CTA */}
        <div className="hidden md:block max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Service name */}
            <div className="flex items-center gap-4">
              <Link href="/" className="font-mono text-xl font-bold text-foreground tracking-tight">
                Ollvy
              </Link>
              <span className="text-muted-foreground">|</span>
              <span className="font-semibold text-foreground">
                {service.shortName}
              </span>
              <span className="hidden sm:inline text-sm text-muted-foreground font-mono">
                ₹{totalFee.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Center: Section tabs */}
            <nav ref={stickyNavRef} className="flex items-center gap-6 relative" role="tablist">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  data-section={section.id}
                  role="tab"
                  aria-selected={activeSection === section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    'text-xs font-medium transition-colors py-1',
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

            {/* Right: CTA */}
            <Button size="sm" asChild>
              <a href={getCtaUrl('sticky_header')}>
                {ctaLabel}
              </a>
            </Button>
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
                  'shrink-0 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2',
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
                    <p className="text-sm md:text-[15px] font-mono text-foreground">
                      <CheckCircle size={14} className="inline mr-1 text-[hsl(var(--ollvy-green))]" />
                      {service.isRetainer
                        ? `Current cycle due: ${guaranteedDate}`
                        : `Guaranteed by ${guaranteedDate}`}
                    </p>
                  </div>
                )}

                <Button size="lg" className="h-11 md:h-12 px-8 md:px-10" asChild>
                  <a href={getCtaUrl('hero')}>
                    {ctaLabel}
                  </a>
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
                {/* Section: Stats (if enabled) */}
                {service.showCompletionStats && (
                  <section className="pb-16 border-b border-border">
                    <CompletionStats service={service} />
                  </section>
                )}

                {/* Section: How it works (Process Steps) */}
                <section
                  id="process"
                  ref={(el) => { sectionRefs.current.process = el }}
                  className={cn(
                    "pb-16 border-b border-border scroll-mt-28",
                    service.showCompletionStats ? "pt-16" : "pt-0"
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

                      {explainerOpen && (
                        <ExplainerStepper
                          serviceName={service.name}
                          steps={service.serviceExplainer.steps}
                        />
                      )}
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
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                    Everything included for <span className="font-mono">₹{displayTotalOllvyFee.toLocaleString('en-IN')}</span>
                  </h2>
                  <p className="text-sm text-muted-foreground mb-10">
                    What your CA handles on your behalf. Nothing hidden.
                  </p>

                  <div className="divide-y divide-border">
                    {service.whatsIncluded.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          'grid gap-8 items-center py-10',
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
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[hsl(var(--ollvy-green))]/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={12} className="text-[hsl(var(--ollvy-green))]" />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-foreground">
                                {formatWithMonoNumbers(item.title)}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                {formatWithMonoNumbers(item.body)}
                              </p>

                              {/* Comparison */}
                              {(item.comparisonWithout || item.comparisonWithOllvy) && (
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                  <div className="bg-muted/40 rounded-lg p-3 border border-border">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 font-mono">
                                      Without Ollvy
                                    </p>
                                    <p className="text-sm font-medium text-foreground">
                                      {item.comparisonWithout && formatWithMonoNumbers(item.comparisonWithout)}
                                    </p>
                                  </div>
                                  <div className="bg-[hsl(var(--ollvy-green))]/5 rounded-lg p-3 border border-[hsl(var(--ollvy-green))]/20">
                                    <p className="text-xs text-[hsl(var(--ollvy-green-fg))] uppercase tracking-widest mb-1.5 font-mono">
                                      With Ollvy
                                    </p>
                                    <p className="text-sm font-medium text-foreground">
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
                  <p className="text-sm text-muted-foreground mb-8 max-w-[520px] leading-relaxed">
                    Most CAs submit what you give them and hope for the best. Ollvy
                    reviews your documents before filing - not after a notice arrives.
                  </p>

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
                    <div className="grid grid-cols-2 gap-4 mb-10 max-w-[560px]">
                      <Card className="border border-border bg-muted/30 p-5">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                          Others
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Take your documents as-is. Submit the application. If there's a
                          query or rejection, it's your problem.
                        </p>
                      </Card>
                      <Card className="border border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 p-5">
                        <p className="text-xs uppercase tracking-widest text-[hsl(var(--ollvy-green-fg))] mb-3 font-mono">
                          Ollvy
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          Review every document before filing. Catch mismatches, expired
                          items, and format issues. Then file.
                        </p>
                      </Card>
                    </div>
                  )}

                  {/* 4-step flow */}
                  <Card className="border border-border bg-card p-8">
                    <h3 className="text-base font-semibold text-foreground mb-6">
                      We catch compliance gaps before regulators do.
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        {
                          step: 'we review',
                          label: 'your documents',
                          description: 'Every upload checked before anything is filed',
                        },
                        {
                          step: 'we flag',
                          label: 'the risks',
                          description:
                            'Issues identified - expiry dates, mismatches, format errors',
                        },
                        {
                          step: 'we fix',
                          label: 'if possible',
                          description: 'Fixable issues resolved before filing, not after',
                        },
                        {
                          step: 'we file',
                          label: 'correctly',
                          description: 'Clean submission - lower chance of officer query',
                        },
                      ].map((item, i) => (
                        <div key={i} className="text-center">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                            <span className="text-xs font-mono font-bold text-foreground">
                              {i + 1}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-foreground">
                            {item.step}
                          </p>
                          <p className="text-xs text-[hsl(var(--ollvy-green-fg))] mt-0.5">
                            {item.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 leading-snug">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </section>

                {/* Section: Profile Personas (We handle messy situations) */}
                <section className="py-16 border-b border-border">
                  <ProfilePersonas
                    personas={service.profilePersonas}
                    serviceName={service.shortName}
                  />
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
                      <Card className="border border-border bg-card p-5">
                        <div className="flex items-center gap-2 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < 5
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-2">
                            March 2025
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          "Very smooth process. The CS assigned was responsive and
                          explained every step. Got my certificate within the promised
                          timeframe."
                        </p>
                        <p className="text-xs text-muted-foreground mt-3">
                          - Verified customer
                        </p>
                      </Card>

                      <Card className="border border-border bg-card p-5">
                        <div className="flex items-center gap-2 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < 4
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-2">
                            February 2025
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          "No surprises on fees, everything was explained upfront. The
                          dashboard made tracking easy."
                        </p>
                        <p className="text-xs text-muted-foreground mt-3">
                          - Verified customer
                        </p>
                      </Card>
                    </div>
                  )}
                </section>

                {/* Section: Documents */}
                <section
                  id="documents"
                  ref={(el) => { sectionRefs.current.documents = el }}
                  className="py-16 border-b border-border scroll-mt-28"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                    DOCUMENTS REQUIRED
                  </p>
                  <DocumentChecklist
                    serviceSlug={service.slug}
                    serviceName={service.shortName}
                    showSectionHeader={true}
                  />
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
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
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

          {/* Final CTA Section */}
          <section className="bg-card py-24">
            <div className="container text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                Get {service.shortName} done now
              </h2>
              <p className="text-base text-muted-foreground mt-4 whitespace-nowrap">
                Fixed price. Verified CA. Done within {service.slaDays} working days.
              </p>
              <Button size="lg" className="mt-8" asChild>
                <a href={getCtaUrl('final_cta')}>
                  {ctaLabel}
                </a>
              </Button>
            </div>
          </section>
        </main>
      </div>

      {/* Mobile booking bar - fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 flex items-center justify-between lg:hidden">
        <div>
          <p className="text-xs text-muted-foreground">
            {priceVariesByQuestionnaire ? 'Starting from' : 'Total'}
          </p>
          <p className="font-mono font-bold text-foreground">
            ₹{totalFee.toLocaleString('en-IN')}
          </p>
        </div>
        <Button size="lg" className="flex-1 ml-4" asChild>
          <a href={getCtaUrl('mobile_bar', true)}>
            {ctaLabel}
          </a>
        </Button>
      </div>
    </>
  )
}

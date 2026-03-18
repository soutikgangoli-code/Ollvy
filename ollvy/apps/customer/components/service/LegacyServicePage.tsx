'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { DocumentChecklist } from '@/components/landing/DocumentChecklist'
import { getClient } from '@/lib/supabase'
import { formatPaisa, cn } from '@/lib/utils'
import type { ServicePackage } from '@/lib/types'
import {
  Clock,
  ArrowLeft,
  Check,
  ArrowRight,
  Star,
  FileText,
  Shield,
  X,
  Calculator,
  Building2,
  Scale,
  Users,
  Landmark,
  CheckCircle,
  Phone,
  MessageCircle,
} from 'lucide-react'

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Scale,
  Building2,
  Shield,
  Calculator,
  Users,
  Landmark,
}

interface TierService {
  id: string
  name: string
  slug: string
  tier_label: string
  price_base_paisa: number
}

interface LegacyServicePageProps {
  slug: string
}

/**
 * Legacy Service Page
 * For services that exist in DB but don't have static ServiceConfig.
 * Uses a unified flowing layout similar to UnifiedServicePage.
 */
export function LegacyServicePage({ slug }: LegacyServicePageProps) {
  const router = useRouter()
  const [service, setService] = useState<ServicePackage | null>(null)
  const [tierServices, setTierServices] = useState<TierService[]>([])
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [heroVisible, setHeroVisible] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (slug) {
      fetchService()
    }
  }, [slug])

  // Sticky bar: show when hero scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  const fetchService = async () => {
    if (!slug) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = getClient()

      const { data: serviceData, error: serviceError } = await supabase
        .from('service_packages')
        .select('*')
        .eq('slug', slug)
        .single()

      if (serviceError) {
        console.error('Service fetch error:', serviceError)
        setError('Service not found')
        setIsLoading(false)
        return
      }

      if (!serviceData) {
        setError('Service not found')
        setIsLoading(false)
        return
      }

      setService(serviceData)
      setSelectedTierId(serviceData.id)

      if (serviceData.tier_group_id) {
        const { data: tiersData } = await supabase
          .from('service_packages')
          .select('id, name, slug, tier_label, price_base_paisa')
          .eq('tier_group_id', serviceData.tier_group_id)
          .eq('is_active', true)
          .order('price_base_paisa', { ascending: true })

        if (tiersData) {
          setTierServices(tiersData)
        }
      }
    } catch (err) {
      console.error('Failed to fetch service:', err)
      setError('Failed to load service')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetStarted = () => {
    const targetId = selectedTierId || service?.id
    if (!targetId) return

    if (service?.price_varies_by_state) {
      router.push(`/quote/request/${targetId}?utm_source=service_page&utm_medium=cta&utm_content=${slug}`)
    } else {
      router.push(`/checkout/${targetId}?utm_source=service_page&utm_medium=cta&utm_content=${slug}`)
    }
  }

  const handleTierSelect = (tier: TierService) => {
    setSelectedTierId(tier.id)
    if (service) {
      setService({
        ...service,
        id: tier.id,
        name: tier.name,
        tier_label: tier.tier_label,
        price_base_paisa: tier.price_base_paisa,
      })
    }
    router.replace(`/services/${tier.slug}`, { scroll: false })
  }

  const calculatePriceBreakdown = () => {
    if (!service) return null

    const basePaisa = service.price_base_paisa || 0
    const govtFeesPaisa = service.price_govt_fees_paisa || 0
    const gstRate = service.price_gst_rate || 18
    const gstPaisa = Math.round(basePaisa * (gstRate / 100))
    const totalPaisa = basePaisa + govtFeesPaisa + gstPaisa

    return {
      base: basePaisa,
      govtFees: govtFeesPaisa,
      gst: gstPaisa,
      gstRate: gstRate,
      total: totalPaisa,
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 max-w-[1200px]">
          <Skeleton className="h-9 w-32 mb-8" />
          <Skeleton className="h-16 w-3/4 mb-3" />
          <Skeleton className="h-6 w-full mb-10" />
          <div className="grid md:grid-cols-[1fr_380px] gap-12">
            <div className="space-y-6">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The service you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/services">
            <Button>Browse All Services</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const priceBreakdown = calculatePriceBreakdown()
  const workflowStages = service.workflow_stages || []
  const billingLabel = service.billing_cycle === 'monthly' ? '/mo' : ''
  const ctaLabel = service.price_varies_by_state ? 'Get Quote' : 'Get Started'
  const isUrgent = (service.urgency_score || 0) >= 80
  const scopeIncluded = service.scope_included || []
  const scopeExcluded = service.scope_excluded || []
  const totalPaisa = priceBreakdown?.total || 0

  // Get icon component
  const IconComponent = service.icon_name && iconMap[service.icon_name]
    ? iconMap[service.icon_name]
    : FileText

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Sticky top bar when hero scrolls out */}
      {!heroVisible && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-foreground">
                {service.name}
              </span>
              <Badge
                variant="outline"
                className="text-xs bg-muted/50"
              >
                {service.sla_working_days} working days
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-foreground">
                {formatPaisa(totalPaisa)}
              </span>
              <Button size="sm" onClick={handleGetStarted}>
                {ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="pt-16">
        {/* === HERO SECTION === */}
        <section
          ref={heroRef}
          className="relative min-h-[60vh] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,hsl(142_71%_35%_/_0.07),transparent_60%)]" />

          <div className="relative z-10 text-center max-w-[720px] px-6">
            {/* Breadcrumb */}
            <p className="text-xs text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">
                Ollvy
              </Link>
              <span className="mx-1.5">→</span>
              <Link
                href="/services"
                className="hover:text-foreground transition-colors capitalize"
              >
                Services
              </Link>
              <span className="mx-1.5">→</span>
              <span className="text-foreground">{service.name}</span>
            </p>

            {/* Service Image/Icon */}
            {service.image_url ? (
              <div className="relative h-24 w-24 rounded-2xl overflow-hidden mb-6 mx-auto border border-border">
                <Image
                  src={service.image_url}
                  alt={service.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="h-24 w-24 rounded-2xl bg-muted/10 border border-border flex items-center justify-center mb-6 mx-auto">
                <IconComponent className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}

            {/* Service name */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground font-display leading-tight">
              {service.name}
            </h1>

            {/* Badges */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {isUrgent && (
                <Badge variant="outline" className="text-xs uppercase tracking-wider">
                  Urgent
                </Badge>
              )}
              {service.tier_label && (
                <Badge variant="secondary">{service.tier_label}</Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-[560px] mx-auto">
              {service.short_description}
            </p>

            {/* Metadata row */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Turnaround
                </p>
                <p className="font-semibold text-foreground text-sm mt-1">
                  {service.sla_working_days} working days
                </p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Type
                </p>
                <p className="font-semibold text-foreground text-sm mt-1 capitalize">
                  {service.billing_cycle || 'One-time'}
                </p>
              </div>
            </div>

            {/* CTA button */}
            <Button size="lg" className="mt-8 min-w-[280px]" onClick={handleGetStarted}>
              {ctaLabel} - {formatPaisa(totalPaisa)}
            </Button>
          </div>
        </section>

        {/* === MAIN CONTENT WITH STICKY SIDEBAR === */}
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            {/* Left: All content sections flowing */}
            <div className="min-w-0 space-y-0">
              {/* Section: Tier Picker */}
              {tierServices.length > 1 && (
                <section className="pb-16 border-b border-border">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    SELECT YOUR PLAN
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
                    Choose the right plan for you
                  </h2>

                  <div className="space-y-3">
                    {tierServices.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => handleTierSelect(tier)}
                        className={cn(
                          'w-full flex items-center justify-between p-5 rounded-xl border transition-all duration-200',
                          selectedTierId === tier.id
                            ? 'border-foreground/30 bg-muted/20'
                            : 'border-border hover:border-foreground/20 hover:bg-muted/10'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                              selectedTierId === tier.id
                                ? 'border-foreground bg-foreground'
                                : 'border-muted-foreground/50'
                            )}
                          >
                            {selectedTierId === tier.id && (
                              <Check className="h-3 w-3 text-background" />
                            )}
                          </div>
                          <span className="font-medium text-foreground">{tier.tier_label || tier.name}</span>
                        </div>
                        <span className="font-semibold text-foreground font-mono">
                          {formatPaisa(tier.price_base_paisa)}/mo
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Section: Timeline */}
              <section className="py-16 border-b border-border">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  TIMELINE
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
                  How long it takes
                </h2>

                <Card className="border border-border bg-card">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-center py-8 bg-muted/10 rounded-xl border border-border">
                      <div className="text-center">
                        <p className="text-6xl font-bold text-foreground mb-2">
                          {service.sla_working_days || 7}
                        </p>
                        <p className="text-muted-foreground text-lg">working days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section: Workflow Stages */}
              {workflowStages.length > 0 && (
                <section className="py-16 border-b border-border">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    THE PROCESS
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
                    What we'll do
                  </h2>

                  <div className="space-y-6">
                    {workflowStages.map((stage: any, index: number) => (
                      <div key={stage.stage_key || index} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1 pt-1.5">
                          <p className="font-semibold text-foreground text-lg">{stage.stage_name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {stage.sla_working_days} working days
                            {stage.wait_for_govt && ' (depends on government processing)'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Section: What's Included */}
              {(scopeIncluded.length > 0 || scopeExcluded.length > 0) && (
                <section className="py-16 border-b border-border">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    WHAT YOU GET
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
                    What's included
                  </h2>

                  {scopeIncluded.length > 0 && (
                    <ul className="space-y-4 mb-8">
                      {scopeIncluded.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[hsl(var(--ollvy-green))]/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={12} className="text-[hsl(var(--ollvy-green))]" />
                          </div>
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {scopeExcluded.length > 0 && (
                    <div className="pt-6 border-t border-border">
                      <p className="text-sm font-semibold text-muted-foreground mb-4">
                        Not Included:
                      </p>
                      <ul className="space-y-3 text-muted-foreground">
                        {scopeExcluded.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 mt-1" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {/* Section: Documents Required */}
              <section className="py-16 border-b border-border">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  DOCUMENTS REQUIRED
                </p>
                <DocumentChecklist
                  serviceSlug={slug}
                  serviceName={service?.name}
                  showSectionHeader={true}
                />
              </section>

              {/* Section: Why Ollvy */}
              <section className="py-16">
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
            </div>

            {/* Right: Sticky booking panel */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <Card className="border border-border bg-card p-6 w-full">
                  {/* Total amount - prominent */}
                  <div className="mb-1">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Total to pay now
                    </p>
                    <p className="font-mono text-4xl font-bold text-foreground mt-1">
                      {formatPaisa(totalPaisa)}
                    </p>
                  </div>

                  {/* Fee breakdown */}
                  <div className="mt-5 space-y-3">
                    {service.price_varies_by_state ? (
                      <div className="bg-muted/20 border border-border rounded-xl p-4">
                        <p className="text-sm text-muted-foreground">
                          Government fees vary by state. Request a quote to get exact
                          pricing for your location.
                        </p>
                      </div>
                    ) : (
                      priceBreakdown && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Professional Fee</span>
                            <span className="text-foreground">{formatPaisa(priceBreakdown.base)}{billingLabel}</span>
                          </div>
                          {priceBreakdown.govtFees > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Government Fees</span>
                              <span className="text-foreground">{formatPaisa(priceBreakdown.govtFees)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              GST ({priceBreakdown.gstRate}%)
                            </span>
                            <span className="text-foreground">{formatPaisa(priceBreakdown.gst)}</span>
                          </div>
                          <div className="border-t border-border pt-3 mt-3">
                            <div className="flex justify-between font-semibold">
                              <span className="text-foreground">Total</span>
                              <span className="text-foreground text-lg">
                                {formatPaisa(priceBreakdown.total)}{billingLabel}
                              </span>
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </div>

                  <Button className="w-full mt-5" size="lg" onClick={handleGetStarted}>
                    {ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  {/* GST invoice note */}
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    GST-compliant invoice generated at checkout
                  </p>

                  {/* Have queries */}
                  <div className="mt-5 pt-5 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-3">
                      Questions about documents, process, or price?
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
                        <a
                          href={`https://wa.me/919876543210?text=Hi, I have a question about ${encodeURIComponent(service.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle size={13} />
                          WhatsApp
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
                        <a href="tel:+919876543210">
                          <Phone size={13} />
                          Call
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Trust micro-signals */}
                  <div className="mt-4 space-y-1.5">
                    {[
                      'GST-compliant invoice included',
                      'Engagement letter before you pay',
                      'Cancel within 2 hours for full refund',
                    ].map((line) => (
                      <p
                        key={line}
                        className="text-xs text-muted-foreground flex items-center gap-1.5"
                      >
                        <CheckCircle
                          size={10}
                          className="text-[hsl(var(--ollvy-green))] shrink-0"
                        />
                        {line}
                      </p>
                    ))}
                  </div>

                  {service.avg_rating && (service.rating_count || 0) > 0 && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4 mt-4 border-t border-border">
                      <Star className="h-4 w-4 fill-muted-foreground text-muted-foreground" />
                      <span>
                        {service.avg_rating.toFixed(1)} ({service.rating_count} reviews)
                      </span>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <section className="bg-card py-24">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Get {service.name} done now
            </h2>
            <p className="text-base text-muted-foreground mt-4 whitespace-nowrap">
              Fixed price. Verified CA. Done within {service.sla_working_days} working days.
            </p>
            <Button size="lg" className="mt-8" onClick={handleGetStarted}>
              {ctaLabel} - {formatPaisa(totalPaisa)}
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Mobile booking bar - fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 flex items-center justify-between lg:hidden">
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="font-mono font-bold text-foreground">
            {formatPaisa(totalPaisa)}
          </p>
        </div>
        <Button size="lg" className="flex-1 ml-4" onClick={handleGetStarted}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  )
}

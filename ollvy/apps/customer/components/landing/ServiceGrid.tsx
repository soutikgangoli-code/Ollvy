'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getGuaranteedDate } from '@/lib/dates'
import { ServiceCardData } from '@/lib/types/database'

interface ServiceCardProps {
  slug?: string
  name: string
  description: string
  ollvyFee: number
  govtFee?: number
  slaDays: number
  avgRating?: number | null
  totalRatings?: number
  category: string
  isPopular?: boolean
  isRetainer?: boolean
  isBundle?: boolean
}

interface ServiceGridProps {
  services?: ServiceCardData[]
}

const MVP_SERVICES: ServiceCardProps[] = [
  {
    slug: 'pvt-ltd-incorporation',
    name: 'Private Limited Incorporation',
    description:
      "Name reservation, DSC, DIN, MOA/AOA, and Certificate of Incorporation. You get the CIN. Govt stamp duty is ₹15,000 on top - shown upfront, not at checkout.",
    ollvyFee: 24999,
    govtFee: 15000,
    slaDays: 15,
    category: 'Registrations',
    isPopular: true,
    avgRating: 4.8,
    totalRatings: 127,
  },
  {
    slug: 'gst-registration',
    name: 'GST Registration',
    description:
      'Your GSTIN, applied for and obtained. Mandatory once turnover crosses ₹40L (₹20L for service businesses). No govt fee on top.',
    ollvyFee: 8999,
    govtFee: 0,
    slaDays: 7,
    category: 'Registrations',
    isPopular: true,
    avgRating: 4.9,
    totalRatings: 243,
  },
  {
    slug: 'gst-monthly-filing',
    name: 'GST Monthly Filing',
    description:
      "GSTR-1 filed by the 11th. GSTR-3B filed by the 20th. Every month. Acknowledgements saved. Monthly report sent. You don't think about it.",
    ollvyFee: 2999,
    govtFee: 0,
    slaDays: 0,
    category: 'Monthly Compliance',
    isPopular: true,
    isRetainer: true,
    avgRating: 4.7,
    totalRatings: 89,
  },
  {
    slug: 'business-itr',
    name: 'Business ITR Filing',
    description:
      'ITR-6 for Pvt Ltd companies, ITR-5 for LLPs and partnerships. Includes P&L review, depreciation, and director remuneration treatment.',
    ollvyFee: 11999,
    govtFee: 0,
    slaDays: 10,
    category: 'Tax Filings',
    isPopular: true,
    avgRating: 4.8,
    totalRatings: 156,
  },
  {
    slug: 'trademark-registration',
    name: 'Trademark Registration',
    description: 'Protect your brand name and logo with trademark registration. Class search, application filing, and TM symbol ready.',
    ollvyFee: 14999,
    govtFee: 4500,
    slaDays: 5,
    category: 'Legal',
    avgRating: 4.6,
    totalRatings: 78,
  },
  {
    slug: 'llp-incorporation',
    name: 'LLP Incorporation',
    description: 'Register your Limited Liability Partnership with MCA. DPIN, name approval, and incorporation certificate.',
    ollvyFee: 19999,
    govtFee: 5000,
    slaDays: 12,
    category: 'Registrations',
    avgRating: 4.7,
    totalRatings: 45,
  },
]

function ServiceCard({
  name,
  ollvyFee,
  govtFee,
  slaDays,
  avgRating,
  totalRatings,
  isPopular,
  isRetainer,
}: ServiceCardProps) {
  const guaranteedDate = slaDays > 0 ? getGuaranteedDate(slaDays) : null
  const showRating = totalRatings !== undefined && totalRatings >= 10 && avgRating !== undefined
  const totalPrice = ollvyFee + (govtFee ?? 0)

  return (
    <div className="h-full rounded-lg border border-border/50 bg-card hover:border-border transition-all duration-200 cursor-pointer group overflow-hidden flex flex-col">
      {/* Title */}
      <div className="px-5 pt-5 pb-3">
        <h3 className="font-medium text-foreground text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>
      </div>

      {/* Price section */}
      <div className="px-5 pb-4 flex-1 flex flex-col justify-end">
        <p className="text-3xl font-mono font-semibold text-foreground tracking-tight">
          ₹{totalPrice.toLocaleString('en-IN')}
          {isRetainer && <span className="text-base font-normal text-muted-foreground ml-0.5">/mo</span>}
        </p>

        {/* Timeline */}
        <div className="mt-2">
          {isRetainer ? (
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
              Monthly retainer
            </span>
          ) : guaranteedDate ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Guaranteed by {guaranteedDate}
            </span>
          ) : (
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
              {slaDays} working days
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-muted/30 border-t border-border/30 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          {isPopular && (
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              POPULAR
            </span>
          )}
          {showRating && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-mono text-[10px] text-muted-foreground">
                {avgRating!.toFixed(1)}
              </span>
            </span>
          )}
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
      </div>
    </div>
  )
}

export function ServiceGrid({ services }: ServiceGridProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Use DB services if available, otherwise fall back to hardcoded data
  const dbServices: ServiceCardProps[] = services?.map(s => ({
    slug: s.slug,
    name: s.name,
    description: s.description,
    ollvyFee: s.ollvyFee,
    govtFee: s.govtFee > 0 ? s.govtFee : undefined,
    slaDays: s.slaDays,
    avgRating: s.avgRating,
    totalRatings: s.totalRatings,
    category: s.category,
    isRetainer: s.isRetainer,
    isPopular: s.totalRatings >= 50,
    isBundle: s.isBundle,
  })) ?? []

  // Use DB data if available, otherwise fallback to hardcoded - show all services
  const displayServices = dbServices.length > 0 ? dbServices : MVP_SERVICES

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / 4 // Scroll 1 card at a time
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      setTimeout(updateScrollButtons, 300)
    }
  }

  // Touch handlers to update buttons after swipe
  const onTouchEnd = useCallback(() => {
    // Update scroll buttons after touch scroll ends
    setTimeout(updateScrollButtons, 100)
  }, [])

  return (
    <section id="services" className="bg-background pt-12 pb-24">
      <div className="container">
        {/* Section Heading - per SEO mandate Section 3.5 */}
        <h2 className="font-mono text-2xl md:text-3xl lg:text-4xl uppercase tracking-wider text-foreground text-center">
          What do you need done?
        </h2>

        {/* Carousel Navigation */}
        <div className="flex items-center justify-end gap-2 mt-8 mb-4">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full border-border",
              !canScrollLeft && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full border-border",
              !canScrollRight && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Service Cards Carousel - 2 visible at a time */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 touch-pan-x"
            onScroll={updateScrollButtons}
            onTouchEnd={onTouchEnd}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayServices.map((service) => (
              <Link
                key={service.name}
                href={service.slug
                  ? `/services/${service.slug}`
                  : `/services`
                }
                className="flex-shrink-0 w-[260px] md:w-[calc(25%-12px)] snap-start h-[200px]"
              >
                <ServiceCard {...service} />
              </Link>
            ))}
          </div>
        </div>

        {/* Show More Button */}
        <div className="text-center mt-8">
          <Button asChild className="px-8">
            <Link href="/services">
              View all services
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

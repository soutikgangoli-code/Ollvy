'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface ReviewStats {
  avg_rating: number
  total_ratings_count: number
}

interface Testimonial {
  quote: string
  name: string
  role: string
  business: string
  city: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We were stuck in a loop with MCA for weeks because our previous CA kept submitting forms with errors. Switched to Ollvy mid-process and they got the incorporation done in 8 working days. The difference in attention to detail is night and day.",
    name: 'Arun Krishnamurthy',
    role: 'Co-Founder',
    business: 'Fintech Startup',
    city: 'Bangalore',
  },
  {
    quote:
      "I specifically chose them because they gave me a written scope before I paid anything. Three years with my old CA and I never once got clarity on what was included vs extra. This should be standard but apparently it's rare.",
    name: 'Priya Nair',
    role: 'Founder',
    business: 'Consulting Firm',
    city: 'Mumbai',
  },
  {
    quote:
      "The GSTR-9 reconciliation caught ₹47,000 in ITC I would have lost. My turnover is around 80 lakhs so that's significant. The CA actually went through my 2A data line by line. I didn't expect that level of involvement for the fee I paid.",
    name: 'Suresh Agarwal',
    role: 'Proprietor',
    business: 'Textile Trading',
    city: 'Surat',
  },
  {
    quote:
      "Honestly I was skeptical about online CA services. But my chartered accountant retired and his replacement was unresponsive. Tried Ollvy for GST filing first, then moved everything over. Six months in and I haven't had a single compliance issue.",
    name: 'Meenakshi Sundaram',
    role: 'Managing Partner',
    business: 'Architecture Firm',
    city: 'Chennai',
  },
  {
    quote:
      "They handled a complicated LLP to Pvt Ltd conversion for us. Kept me updated at every step without me having to chase. The whole thing took about 6 weeks which I'm told is fast for this kind of restructuring.",
    name: 'Rahul Deshmukh',
    role: 'Director',
    business: 'Marketing Agency',
    city: 'Pune',
  },
  {
    quote:
      "I run a cloud kitchen with 3 locations. Managing GST across multiple GSTINs was a nightmare until I started using the retainer service. One dashboard, one point of contact. My month-end stress has reduced considerably.",
    name: 'Faisal Ahmed',
    role: 'Founder',
    business: 'Food Delivery Brand',
    city: 'Hyderabad',
  },
  {
    quote:
      "Got a scrutiny notice last year for FY 2021-22. The CA assigned to my case was thorough - prepared the response, attended the hearing virtually, got the matter closed in two months. Professional handling throughout.",
    name: 'Neha Kapoor',
    role: 'Director',
    business: 'Import Export',
    city: 'Delhi',
  },
  {
    quote:
      "We had 11 employees and didn't realize PF registration was mandatory. Ollvy flagged this during onboarding itself. They did the registration and first challan filing together. That kind of proactive compliance advice is valuable.",
    name: 'Venkatesh Rao',
    role: 'CEO',
    business: 'Software Services',
    city: 'Bangalore',
  },
  {
    quote:
      "Simple thing but important to me - I get the acknowledgement receipt within hours of filing, not days later when I have to ask for it. Every filing, every time. Seems basic but my previous CA never managed this.",
    name: 'Anjali Mehta',
    role: 'Founder',
    business: 'E-commerce',
    city: 'Ahmedabad',
  },
  {
    quote:
      "Used them for Startup India registration and 80IAC application. The 80IAC especially requires a lot of documentation - projections, board resolutions, detailed write-ups. They guided us through the entire process. Got approved in 4 months.",
    name: 'Karthik Subramanian',
    role: 'Founder & CEO',
    business: 'SaaS Company',
    city: 'Chennai',
  },
  {
    quote:
      "What convinced me was the pricing page - everything listed clearly with government fees separate. No surprises at checkout, no hidden charges after. I've recommended Ollvy to at least four other founders in my network.",
    name: 'Simran Kaur',
    role: 'Co-Founder',
    business: 'Healthcare Startup',
    city: 'Chandigarh',
  },
]

const KEYWORD_CHIPS = [
  'filed before deadline',
  'no hidden charges',
  'actually picked up the phone',
  'knew what they were doing',
  'would use again',
]

// Function to wrap only numbers in mono font
function formatQuoteWithMono(text: string): React.ReactNode {
  // Pattern matches only numbers (with surrounding spaces):
  // - Currency amounts (₹47,000, Rs 20,000)
  // - Numbers with units (8 working days, 80 lakhs, 6 weeks, etc.)
  // - Standalone numbers
  // - Percentages
  const pattern = /(\s?(?:₹[\d,]+(?:\.\d+)?|Rs\s*[\d,]+(?:-[\d,]+)?|\d+(?:,\d+)*(?:\.\d+)?\s*(?:lakhs?|crores?|working days?|days?|weeks?|months?|years?|employees?|locations?)?|\d+%)\s?)/g

  const parts = text.split(pattern)
  const matches = text.match(pattern) || []

  const result: React.ReactNode[] = []
  let matchIndex = 0

  parts.forEach((part, index) => {
    if (part) {
      result.push(part)
    }
    if (matchIndex < matches.length && index < parts.length - 1) {
      result.push(
        <span key={`mono-${index}`} className="font-mono">
          {matches[matchIndex]}
        </span>
      )
      matchIndex++
    }
  })

  return result
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating)
        const halfFilled = !filled && star === Math.ceil(rating) && rating % 1 >= 0.5

        return (
          <Star
            key={star}
            size={16}
            aria-hidden="true"
            className={
              filled
                ? 'fill-yellow-400 text-yellow-400'
                : halfFilled
                  ? 'fill-yellow-400/50 text-yellow-400'
                  : 'fill-muted text-muted'
            }
          />
        )
      })}
    </div>
  )
}

export function Reviews() {
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)

  // Determine how many cards to show based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1)
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2)
      } else {
        setVisibleCount(3)
      }
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/functions/v1/get-public-profile')
        if (!res.ok) return
        const data = await res.json()
        if (data?.avg_rating && data?.total_ratings_count) {
          setStats(data)
        }
      } catch {
        // Silently fail
      }
    }
    fetchStats()
  }, [])

  const maxIndex = TESTIMONIALS.length - visibleCount

  const goLeft = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }, [])

  const goRight = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }, [maxIndex])

  // Touch swipe handling for mobile
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const minSwipeDistance = 50

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEndX.current = null
    touchStartX.current = e.targetTouches[0].clientX
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goRight()
    } else if (isRightSwipe) {
      goLeft()
    }

    touchStartX.current = null
    touchEndX.current = null
  }, [goLeft, goRight])

  const visibleTestimonials = TESTIMONIALS.slice(currentIndex, currentIndex + visibleCount)

  return (
    <section className="bg-background py-24">
      <div className="container">
        {/* Section Heading - per SEO mandate Section 3.5 */}
        <h2 className="font-mono text-2xl md:text-3xl lg:text-4xl uppercase tracking-wider text-foreground text-center">
          What our clients say
        </h2>

        {/* Aggregate Rating (conditional on >= 10 reviews) */}
        {stats && stats.total_ratings_count >= 10 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 mb-10">
            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold font-mono leading-none">
                {stats.avg_rating.toFixed(1)}
              </span>
              <div className="pb-1">
                <StarRow rating={stats.avg_rating} />
                <p className="text-sm text-muted-foreground mt-1">
                  Outstanding · {stats.total_ratings_count} reviews
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Keyword Chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-10 mb-12">
          {KEYWORD_CHIPS.map((chip) => (
            <span
              key={chip}
              className="border border-border bg-muted/30 text-muted-foreground rounded-full px-3 py-1.5 text-sm"
            >
              "{chip}"
            </span>
          ))}
        </div>

        {/* Testimonial Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={goLeft}
              disabled={currentIndex === 0}
              className="rounded-full h-10 w-10 bg-background shadow-md disabled:opacity-30"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={goRight}
              disabled={currentIndex >= maxIndex}
              className="rounded-full h-10 w-10 bg-background shadow-md disabled:opacity-30"
              aria-label="Next reviews"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Cards Container */}
          <div
            className="overflow-hidden px-2 touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="grid gap-6 transition-transform duration-300 ease-out"
              style={{
                gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
              }}
            >
              {visibleTestimonials.map((t) => (
                <Card key={t.name} className="border border-border bg-card p-6 h-[320px] flex flex-col">
                  <div className="text-4xl leading-none text-muted-foreground/20 font-serif">
                    &ldquo;
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mt-3 flex-grow">{formatQuoteWithMono(t.quote)}</p>
                  <div className="border-t border-border pt-4 mt-auto">
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.role} · {t.business} · {t.city}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-6 bg-primary'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to review set ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

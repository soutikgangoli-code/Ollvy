'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { IndianRupee, FileText, ClipboardList, BarChart2, Check, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * §6 - Trust Layer
 *
 * Carousel showing 1 card at a time
 */

const trustCards = [
  {
    icon: IndianRupee,
    title: 'The price you see is what you pay.',
    description:
      'Ollvy fee and government fee are broken out separately on every service card. You see both before you click anything. No quote-first. No invoice-after. No "it depends on the complexity."',
    visual: (
      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Ollvy fee</span>
          <span className="font-mono text-foreground">₹9,999</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Govt fee (MCA)</span>
          <span className="font-mono text-muted-foreground">₹15,000</span>
        </div>
        <div className="flex justify-between text-xs border-t border-border pt-2">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-mono font-bold text-foreground text-sm">₹24,999</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1.5 border-t border-border/50">
          <span>1,240+ companies incorporated</span>
          <span className="text-[hsl(var(--ollvy-green))]">98% success rate</span>
        </div>
      </div>
    ),
    visualCaption: 'Pvt Ltd Incorporation - both fees shown upfront',
  },
  {
    icon: FileText,
    title: 'A proper invoice. Every time.',
    description:
      "Every payment auto-generates a GST-compliant tax invoice with the right CGST/SGST or IGST split for your state. It's in your account permanently - not in an email you'll lose.",
    visual: (
      <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Invoice</span>
          <span className="font-mono text-foreground">OLV-INV-2025-4821</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">GSTIN</span>
          <span className="font-mono text-muted-foreground">29AADCO4821M1ZK</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">CGST (9%)</span>
          <span className="font-mono text-muted-foreground">₹900</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">SGST (9%)</span>
          <span className="font-mono text-muted-foreground">₹900</span>
        </div>
        <div className="flex justify-between text-xs border-t border-border pt-2">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-mono font-bold text-foreground text-sm">₹11,799</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1.5 border-t border-border/50">
          <span>100% ITC-eligible invoices</span>
          <span className="text-[hsl(var(--ollvy-green))]">Instant download</span>
        </div>
      </div>
    ),
    visualCaption: 'Stored in your account permanently',
  },
  {
    icon: ClipboardList,
    title: "You see the scope before you pay. Including what's excluded.",
    description:
      "Before checkout, you get an Engagement Letter: what the service covers, and what it doesn't. This is generated automatically and stored in your account. If there's ever a dispute about what was agreed, there's a document.",
    visual: (
      <div className="space-y-2">
        <p className="text-xs font-medium text-foreground">
          GST Monthly Filing retainer - scope preview:
        </p>
        <div className="flex gap-2 text-xs text-muted-foreground items-start">
          <Check className="h-4 w-4 text-[hsl(var(--ollvy-green))] mt-0.5 shrink-0" />
          <span>GSTR-1, GSTR-3B, late fee computation, monthly report</span>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground items-start">
          <Minus className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground/60" />
          <span>Audit response, demand notices, amendment returns</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/50 mt-2">
          <span>No scope disputes in 2,100+ orders</span>
          <span className="text-[hsl(var(--ollvy-green))]">Clear terms ✓</span>
        </div>
      </div>
    ),
    visualCaption: null,
  },
  {
    icon: BarChart2,
    title: 'Every month, a report. Not just a payment request.',
    description:
      'After every billing cycle on a retainer, a Proof-of-Work Report is generated: what was filed, when it was filed, the acknowledgement numbers, any notices received. You know exactly what happened that month.',
    visual: (
      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
        <div className="flex justify-between text-xs items-center">
          <span className="text-foreground font-medium">GSTR-3B</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Filed 18 Mar</span>
            <span className="font-mono text-[hsl(var(--ollvy-green))]">ARN: AA1234 ✓</span>
          </div>
        </div>
        <div className="flex justify-between text-xs items-center">
          <span className="text-foreground font-medium">GSTR-1</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Filed 10 Mar</span>
            <span className="font-mono text-[hsl(var(--ollvy-green))]">ARN: BB5678 ✓</span>
          </div>
        </div>
        <div className="flex justify-between text-xs items-center border-t border-border pt-2">
          <span className="text-foreground font-medium">Late fees</span>
          <span className="font-mono text-foreground">₹0</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1.5 border-t border-border/50">
          <span>Zero late fees in 99.2% cases</span>
          <span className="text-[hsl(var(--ollvy-green))]">Filed 3 days early</span>
        </div>
      </div>
    ),
    visualCaption: 'March 2025 Compliance Report',
  },
]

export function TrustLayer() {
  const [currentIndex, setCurrentIndex] = useState(0)
  // On mobile show 1 card, on desktop show 2
  const [visibleCount, setVisibleCount] = useState(2)

  useEffect(() => {
    const updateVisibleCount = () => {
      // md breakpoint is 768px
      setVisibleCount(window.innerWidth < 768 ? 1 : 2)
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  // Max index depends on how many cards we show at once
  const maxIndex = trustCards.length - visibleCount

  // Clamp currentIndex if it becomes invalid after resize
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [currentIndex, maxIndex])

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
  }, [maxIndex])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
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
      goNext()
    } else if (isRightSwipe) {
      goPrev()
    }

    touchStartX.current = null
    touchEndX.current = null
  }, [goNext, goPrev])

  // Get visible cards based on screen size
  const visibleCards = trustCards.slice(currentIndex, currentIndex + visibleCount)

  return (
    <section className="relative bg-card py-16 overflow-hidden">
      <div className="container relative">
        {/* Section Heading */}
        <h2 className="font-mono text-2xl md:text-3xl lg:text-4xl uppercase tracking-wider text-foreground text-center">
          Why Ollvy
        </h2>

        {/* Carousel Container */}
        <div
          className="relative mt-8 touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Cards Display - 1 on mobile, 2 on desktop */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {visibleCards.map((card, idx) => (
                <Card
                  key={`${currentIndex}-${idx}`}
                  className={cn(
                    "border border-border bg-background p-6 md:p-8 flex flex-col h-full",
                    idx === 1 && "hidden md:block"
                  )}
                >
                  <h3 className="text-xl font-semibold text-foreground leading-snug">
                    {card.title}
                  </h3>

                  <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Visual Element */}
                  <div className="mt-6 pt-6 border-t border-border flex-1 flex flex-col">
                    <div className="flex-1">{card.visual}</div>
                    <p className="text-sm text-muted-foreground italic mt-3 min-h-[1.25rem]">
                      {card.visualCaption || '\u00A0'}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - hidden on mobile */}
          <button
            onClick={goPrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-12 w-10 h-10 rounded-full bg-background border border-border items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors shadow-md"
            aria-label="Previous card"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-12 w-10 h-10 rounded-full bg-background border border-border items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors shadow-md"
            aria-label="Next card"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dots Indicator - 1 per position (3 positions for 4 cards showing 2 at a time) */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setCurrentIndex(dotIndex)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  currentIndex === dotIndex
                    ? 'bg-foreground w-8'
                    : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to position ${dotIndex + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

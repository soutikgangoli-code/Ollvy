'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

interface Review {
  quote: string
  highlight?: string
  name: string
  initials: string
  role: string
  context: string
  date: string
}

const REVIEWS: Review[] = [
  {
    quote: "I was paying ₹30,000 a year to a CA who missed 3 deadlines. Switched to Ollvy - ",
    highlight: "zero missed deadlines",
    name: 'Sushant Tiwari',
    initials: 'ST',
    role: 'Founder',
    context: 'Pvt Ltd · 12 employees · Bangalore',
    date: '12 Mar 2026',
  },
  {
    quote: "The order tracking page is what sold me. I can see exactly which stage my MCA filing is at - documents verified, CS reviewing, filed. No more texting my CA 'kya hua?' every other day.",
    name: 'Raghav Menon',
    initials: 'RM',
    role: 'Director',
    context: 'Pvt Ltd · 8 employees · Bangalore',
    date: '28 Mar 2026',
  },
  {
    quote: "Uploaded my docs through the app on a Sunday night. By Monday afternoon my CA had reviewed everything and flagged that my address proof didn't match. Caught it before filing, not after an officer query.",
    name: 'Deepika Joshi',
    initials: 'DJ',
    role: 'Founder',
    context: 'D2C Brand · Mumbai',
    date: '5 Mar 2026',
  },
  {
    quote: "The compliance calendar shows every upcoming deadline with days remaining. GSTR-1 by 11th, GSTR-3B by 20th, TDS by 7th - all tracked. Haven't paid a single late fee in 4 months.",
    name: 'Arjun Reddy',
    initials: 'AR',
    role: 'Co-Founder',
    context: 'SaaS Startup · Hyderabad',
    date: '19 Mar 2026',
  },
  {
    quote: "Got my GSTIN in 5 working days. The guaranteed date said 7 days and they beat it. The acknowledgement and certificate both showed up in the app automatically - didn't have to ask.",
    name: 'Kavita Sharma',
    initials: 'KS',
    role: 'Proprietor',
    context: 'Interior Design · Delhi',
    date: '2 Apr 2026',
  },
  {
    quote: "Our previous CA took 3 weeks to respond to an MCA deficiency notice. With Ollvy, the CS picked it up in the chat within hours and filed the response same day. The chat feature with the assigned professional is genuinely useful.",
    name: 'Nikhil Patel',
    initials: 'NP',
    role: 'Managing Partner',
    context: 'LLP · Ahmedabad',
    date: '8 Apr 2026',
  },
]

export function SingleTestimonial() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, scrollLeft: 0, lastX: 0, lastTime: 0, velocity: 0 })
  const momentumRef = useRef<number>(0)

  const getCardWidth = useCallback(() => {
    if (!scrollRef.current) return 0
    return scrollRef.current.offsetWidth
  }, [])

  const snapToNearest = useCallback(() => {
    if (!scrollRef.current) return
    const cardWidth = getCardWidth()
    if (cardWidth === 0) return
    const nearest = Math.round(scrollRef.current.scrollLeft / cardWidth)
    const clamped = Math.min(Math.max(0, nearest), REVIEWS.length - 1)
    scrollRef.current.scrollTo({ left: cardWidth * clamped, behavior: 'smooth' })
    setCurrentIndex(clamped)
  }, [getCardWidth])

  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollTickingRef = useRef(false)

  const handleScroll = useCallback(() => {
    if (scrollTickingRef.current) return
    scrollTickingRef.current = true
    requestAnimationFrame(() => {
      scrollTickingRef.current = false
      if (!scrollRef.current || isDragging) return
      const cardWidth = getCardWidth()
      if (cardWidth === 0) return
      const newIndex = Math.round(scrollRef.current.scrollLeft / cardWidth)
      setCurrentIndex(Math.min(Math.max(0, newIndex), REVIEWS.length - 1))

      // Debounced snap for touch/native scroll
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      scrollTimerRef.current = setTimeout(() => {
        snapToNearest()
      }, 150)
    })
  }, [getCardWidth, isDragging, snapToNearest])

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return
    const cardWidth = getCardWidth()
    scrollRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
    setCurrentIndex(index)
  }, [getCardWidth])

  const startMomentum = useCallback((velocity: number) => {
    cancelAnimationFrame(momentumRef.current)
    const container = scrollRef.current
    if (!container) return
    let v = velocity
    const friction = 0.95
    const step = () => {
      if (Math.abs(v) < 0.5) { snapToNearest(); return }
      container.scrollLeft -= v
      v *= friction
      momentumRef.current = requestAnimationFrame(step)
    }
    momentumRef.current = requestAnimationFrame(step)
  }, [snapToNearest])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return
    cancelAnimationFrame(momentumRef.current)
    setIsDragging(true)
    const now = performance.now()
    dragRef.current = { startX: e.pageX, scrollLeft: scrollRef.current.scrollLeft, lastX: e.pageX, lastTime: now, velocity: 0 }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const now = performance.now()
    const dx = e.pageX - dragRef.current.lastX
    const dt = now - dragRef.current.lastTime
    if (dt > 0) dragRef.current.velocity = dx / dt * 16
    dragRef.current.lastX = e.pageX
    dragRef.current.lastTime = now
    scrollRef.current.scrollLeft = dragRef.current.scrollLeft - (e.pageX - dragRef.current.startX)
  }, [isDragging])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    Math.abs(dragRef.current.velocity) > 1 ? startMomentum(dragRef.current.velocity) : snapToNearest()
  }, [isDragging, startMomentum, snapToNearest])

  useEffect(() => {
    return () => cancelAnimationFrame(momentumRef.current)
  }, [])

  return (
    <section className="py-16 md:py-28 bg-background relative overflow-hidden">
      <div className="container max-w-4xl relative px-4 md:px-6">

        {/* Draggable scroll container — each review is full width */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          className={`flex overflow-x-auto select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {REVIEWS.map((review) => (
            <article
              key={review.name}
              className="flex-shrink-0 w-full text-center"
              draggable={false}
            >
              {/* Large decorative quotation mark */}
              <div className="flex justify-center mb-4 md:mb-8">
                <span className="text-6xl md:text-8xl lg:text-9xl font-serif text-muted-foreground/20 select-none leading-none" aria-hidden="true">
                  &ldquo;
                </span>
              </div>

              {/* Big quote */}
              <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-foreground leading-relaxed tracking-tight px-2">
                {review.highlight ? (
                  <>
                    {review.quote}
                    <span className="text-foreground font-semibold">{review.highlight}</span>
                    {' '}in the last 1 month, and at fixed prices.
                    <br /><br />
                    The tracking dashboard alone is worth it - I always know where every filing stands.
                  </>
                ) : (
                  review.quote
                )}
              </blockquote>

              {/* Attribution */}
              <div className="mt-8 md:mt-12 flex flex-col items-center">
                <div className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-muted/80 border-2 border-border flex items-center justify-center mb-3 md:mb-4 shadow-sm">
                  <span className="text-base md:text-xl font-bold text-muted-foreground">{review.initials}</span>
                </div>
                <p className="font-bold text-base md:text-lg text-foreground">{review.name}</p>
                <p className="text-sm md:text-base text-muted-foreground mt-0.5">{review.role}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1.5 px-3 py-1 rounded-full bg-muted/50">{review.context}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8 md:mt-12">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex
                  ? 'w-6 bg-muted-foreground/50'
                  : 'w-2 bg-muted-foreground/20 hover:bg-muted-foreground/30'
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

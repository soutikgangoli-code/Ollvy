'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

interface Review {
  quote: string
  name: string
  initials: string
  role: string
  context: string
  date: string
}

const REVIEWS: Review[] = [
  {
    quote:
      "I was paying ₹30,000 a year to a CA who missed 3 deadlines. Switched to Ollvy - zero missed deadlines in the last 1 month, and at fixed prices. The tracking dashboard alone is worth it - I always know where every filing stands.",
    name: 'Sushant Tiwari',
    initials: 'ST',
    role: 'Founder',
    context: 'Pvt Ltd · 12 employees · Bangalore',
    date: '12 Mar 2026',
  },
  {
    quote:
      "The order tracking page is what sold me. I can see exactly which stage my MCA filing is at - documents verified, CS reviewing, filed. No more texting my CA 'kya hua?' every other day.",
    name: 'Raghav Menon',
    initials: 'RM',
    role: 'Director',
    context: 'Pvt Ltd · 8 employees · Bangalore',
    date: '28 Mar 2026',
  },
  {
    quote:
      "Uploaded my docs through the app on a Sunday night. By Monday afternoon my CA had reviewed everything and flagged that my address proof didn't match. Caught it before filing, not after an officer query.",
    name: 'Deepika Joshi',
    initials: 'DJ',
    role: 'Founder',
    context: 'D2C Brand · Mumbai',
    date: '5 Mar 2026',
  },
  {
    quote:
      "The compliance calendar shows every upcoming deadline with days remaining. GSTR-1 by 11th, GSTR-3B by 20th, TDS by 7th - all tracked. Haven't paid a single late fee in 4 months.",
    name: 'Arjun Reddy',
    initials: 'AR',
    role: 'Co-Founder',
    context: 'SaaS Startup · Hyderabad',
    date: '19 Mar 2026',
  },
  {
    quote:
      "Got my GSTIN in 5 working days. The guaranteed date said 7 days and they beat it. The acknowledgement and certificate both showed up in the app automatically - didn't have to ask.",
    name: 'Kavita Sharma',
    initials: 'KS',
    role: 'Proprietor',
    context: 'Interior Design · Delhi',
    date: '2 Apr 2026',
  },
  {
    quote:
      "Our previous CA took 3 weeks to respond to an MCA deficiency notice. With Ollvy, the CS picked it up in the chat within hours and filed the response same day. The chat feature with the assigned professional is genuinely useful.",
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
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, scrollLeft: 0, lastX: 0, lastTime: 0, velocity: 0 })
  const momentumRef = useRef<number>(0)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const itemsPerView = isMobile ? 1 : 3
  const maxIndex = REVIEWS.length - itemsPerView

  const getCardWidth = useCallback(() => {
    if (!scrollRef.current) return 0
    const gap = isMobile ? 16 : 24
    return (scrollRef.current.offsetWidth - gap * (itemsPerView - 1)) / itemsPerView + gap
  }, [isMobile, itemsPerView])

  const snapToNearest = useCallback(() => {
    if (!scrollRef.current) return
    const cardWidth = getCardWidth()
    if (cardWidth === 0) return
    const nearest = Math.round(scrollRef.current.scrollLeft / cardWidth)
    const clamped = Math.min(Math.max(0, nearest), maxIndex)
    scrollRef.current.scrollTo({ left: cardWidth * clamped, behavior: 'smooth' })
    setCurrentIndex(clamped)
  }, [getCardWidth, maxIndex])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isDragging) return
    const cardWidth = getCardWidth()
    if (cardWidth === 0) return
    const newIndex = Math.round(scrollRef.current.scrollLeft / cardWidth)
    setCurrentIndex(Math.min(Math.max(0, newIndex), maxIndex))
  }, [getCardWidth, maxIndex, isDragging])

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

  const totalPages = maxIndex + 1

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono text-center mb-2">
          What clients say
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-10">
          Real businesses. Real results.
        </h2>

        {/* Draggable scroll container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          className={`flex overflow-x-auto gap-4 md:gap-6 select-none pb-4 ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {REVIEWS.map((review) => (
            <article
              key={review.name}
              className="flex-shrink-0 w-[85vw] md:w-[calc(33.333%-16px)] rounded-xl border border-border bg-card flex flex-col"
              draggable={false}
            >
              {/* Quote */}
              <div className="px-5 pt-5 pb-4 sm:px-6 sm:pt-6 flex-1">
                <p className="text-sm sm:text-[15px] text-foreground leading-[1.75] sm:leading-[1.8]">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              {/* Attribution */}
              <div className="px-5 py-4 sm:px-6 border-t border-border/40 bg-muted/20 rounded-b-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-muted-foreground font-mono">
                    {review.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {review.role} · {review.context}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                  {review.date}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex
                  ? 'w-5 bg-foreground'
                  : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to review set ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

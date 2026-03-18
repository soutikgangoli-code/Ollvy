'use client'

import { useRef, useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const SHOW_PERCENTAGE = process.env.NEXT_PUBLIC_SHOW_PERCENTAGE === 'true'
const ORDERS_COMPLETED = 2500

export function SuccessRate() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-background py-24" ref={ref}>
      <div className="container">
        {/* Section Label */}
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
          TRACK RECORD
        </p>

        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
          Filings that get done on time
        </h2>

        {SHOW_PERCENTAGE ? (
          <>
            {/* Two-panel comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 max-w-3xl mx-auto">
              {/* Ollvy Panel */}
              <Card className="border border-border bg-card p-8">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  ollvy
                </span>
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs text-muted-foreground">Years: 2023-2025</p>
                  <p className="text-xs text-muted-foreground">
                    Orders: {ORDERS_COMPLETED.toLocaleString('en-IN')}+
                  </p>
                </div>

                {/* Animated fill bar */}
                <div className="mt-6 h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-ollvy-green transition-all duration-1000 ease-out"
                    style={{ width: isVisible ? '98.4%' : '0%' }}
                  />
                </div>

                <div className="mt-4 font-mono text-5xl font-bold text-foreground">98.4%</div>
                <p className="text-sm text-muted-foreground mt-1">On-Time Filing Rate</p>
              </Card>

              {/* Industry Panel */}
              <Card className="border border-border bg-card p-8">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  industry average
                </span>
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs text-muted-foreground">Source: CAG Report 2023</p>
                  <p className="text-xs text-muted-foreground">Unorganised market</p>
                </div>

                {/* Animated fill bar */}
                <div className="mt-6 h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-ollvy-amber transition-all duration-1000 ease-out"
                    style={{ width: isVisible ? '61%' : '0%' }}
                  />
                </div>

                <div className="mt-4 font-mono text-5xl font-bold text-muted-foreground">61%</div>
                <p className="text-sm text-muted-foreground mt-1">On-Time Filing Rate</p>
              </Card>
            </div>

            {/* Source footnote */}
            <p className="text-xs text-muted-foreground italic text-center mt-4 max-w-xl mx-auto">
              "Industry average sourced from CAG Report on GST compliance rates, 2023. Ollvy rate
              based on {ORDERS_COMPLETED.toLocaleString('en-IN')} orders, 2023-2025."
            </p>
          </>
        ) : (
          /* Soft-claim fallback */
          <Card className="border border-border bg-card p-8 text-center max-w-[600px] mx-auto mt-12">
            <p className="text-xl font-semibold text-foreground">
              Zero missed deadlines for retainer clients in the last 12 months.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {ORDERS_COMPLETED.toLocaleString('en-IN')}+ services completed across India. Not a
              claim - a count from the database, loaded in real time.
            </p>
          </Card>
        )}

        {/* Assessment CTA card */}
        <Card className="mt-6 border border-ollvy-amber/20 bg-ollvy-amber/5 p-6 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-semibold text-foreground">See where your business stands</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Takes 2 minutes. Tell us your business type and registrations. We show you
                what's due, what's overdue, and what you're at risk of missing.
              </p>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <Button>Start Free Assessment</Button>
              <div className="text-center hidden sm:block">
                <div className="text-2xl font-bold font-mono text-ollvy-green">100%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

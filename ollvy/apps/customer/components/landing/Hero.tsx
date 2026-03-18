'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function FloatingCards() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Cycle through cards every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-[420px] h-[520px] hidden lg:block shrink-0">
      {/* Card 1 - GST Filing with proof */}
      <Card
        className={cn(
          'absolute top-0 right-0 w-[240px] border border-border bg-card p-4 transition-all duration-700 ease-out origin-center',
          activeIndex === 0 ? 'scale-[1.05] z-20' : 'scale-100 z-10'
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">GSTR-3B Filed</span>
          <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
            <Check className="h-2.5 w-2.5 inline mr-0.5" />
            Done
          </span>
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Filed on</span>
            <span className="text-foreground">18 Mar 2025</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">ARN</span>
            <span className="font-mono text-emerald-500 text-[11px]">AA290325001234X</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Late fees</span>
            <span className="font-mono text-foreground">₹0</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border">
          Filed 2 days before deadline
        </p>
      </Card>

      {/* Card 2 - Pvt Ltd Progress */}
      <Card
        className={cn(
          'absolute top-[200px] -left-2 w-[250px] border border-border bg-card p-4 transition-all duration-700 ease-out origin-center',
          activeIndex === 1 ? 'scale-[1.05] z-20' : 'scale-100 z-10'
        )}
      >
        <span className="text-sm font-semibold text-foreground">Pvt Ltd Incorporation</span>
        <div className="flex gap-1 mt-3">
          {['Name', 'DSC', 'DIN', 'MOA', 'Cert'].map((stage, i) => (
            <div
              key={stage}
              className={cn(
                'h-1.5 flex-1 rounded-full',
                i < 3 ? 'bg-emerald-500' : 'bg-muted'
              )}
            />
          ))}
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">Stage 3 of 5</p>
          <span className="text-[10px] text-emerald-500 font-medium">In Progress</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border">
          Expected completion: 28 Mar 2025
        </p>
      </Card>

      {/* Card 3 - Compliance Score */}
      <Card
        className={cn(
          'absolute bottom-0 right-8 w-[220px] border border-border bg-card p-4 transition-all duration-700 ease-out origin-center',
          activeIndex === 2 ? 'scale-[1.05] z-20' : 'scale-100 z-10'
        )}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-foreground">Compliance Score</span>
          <span className="text-[10px] text-emerald-500 font-medium">On Track</span>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <svg viewBox="0 0 50 50" width="50" height="50" className="shrink-0">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="3"
            />
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="hsl(var(--ollvy-green))"
              strokeWidth="3"
              strokeDasharray={`${(84 / 100) * 125.6} 125.6`}
              strokeLinecap="round"
              transform="rotate(-90 25 25)"
            />
            <text
              x="25"
              y="29"
              textAnchor="middle"
              className="text-sm fill-foreground font-bold font-mono"
            >
              84
            </text>
          </svg>
          <div>
            <p className="text-xs text-foreground font-medium">3 deadlines</p>
            <p className="text-[10px] text-muted-foreground">this month</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border">
          All filings up to date
        </p>
      </Card>
    </div>
  )
}

export function Hero() {
  const scrollToServices = () => {
    const element = document.getElementById('services')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-[85vh] flex items-center bg-background pt-24 pb-16 overflow-hidden">
      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-20 items-center">
          {/* Left Column */}
          <div className="max-w-[580px]">
            {/* Main Headline */}
            <h1 className="font-mono text-[2rem] md:text-[3.5rem] lg:text-[4rem] font-normal text-foreground leading-[1.1] tracking-tight uppercase">
              Your business<br />
              compliance,<span className="text-muted-foreground ml-2">handled.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-[15px] text-muted-foreground mt-10 max-w-[620px] leading-[1.7]">
              A CA files your GST. A lawyer handles your trademark. A CS manages your MCA filings.
              Track everything in one place. Pay fixed prices. No surprises.
            </p>

            {/* CTA Row */}
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Button size="lg" className="px-8 h-12 text-sm font-medium rounded-lg" asChild>
                <Link href="/services?utm_source=homepage&utm_medium=landing&utm_content=hero">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={scrollToServices}
                className="text-muted-foreground hover:text-foreground h-12 text-sm"
              >
                View all services
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 mt-14 pt-8 border-t border-border">
              {[
                'Fixed prices',
                'GST invoices',
                'Cancel anytime',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-[hsl(var(--ollvy-green))]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Cards */}
          <FloatingCards />
        </div>
      </div>
    </section>
  )
}

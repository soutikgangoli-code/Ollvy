'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

const obligations = [
  {
    name: 'GSTR-3B',
    status: 'due_soon',
    label: 'Due in 7 days — Apr 20',
    badgeText: 'Due Soon',
    leftBorderColor: 'border-l-ollvy-amber',
  },
  {
    name: 'TDS Deposit',
    status: 'filed',
    label: 'Paid Mar 7',
    badgeText: 'Filed',
    leftBorderColor: 'border-l-ollvy-green',
  },
  {
    name: 'Director KYC',
    status: 'upcoming',
    label: 'Due Sep 30 · 5 months away',
    badgeText: 'Upcoming',
    leftBorderColor: 'border-l-transparent',
  },
  {
    name: 'Business ITR',
    status: 'upcoming',
    label: 'Due Oct 31 · 6 months away',
    badgeText: 'Upcoming',
    leftBorderColor: 'border-l-transparent',
    isProLocked: true,
  },
]

function badgeStyle(status: string) {
  if (status === 'due_soon') return 'bg-ollvy-amber/10 text-amber-400 border border-amber-400/20'
  if (status === 'filed') return 'bg-ollvy-green/10 text-green-400 border border-green-400/20'
  return 'border-border text-muted-foreground'
}

export function ComplianceCalendarPreview() {
  return (
    <section id="compliance-calendar" className="bg-card py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left - Copy */}
          <div>
            {/* Section Label */}
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              PRO FEATURE
            </p>

            {/* Section Heading */}
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Your compliance deadlines, tracked automatically.
            </h2>

            {/* Body */}
            <div className="text-sm text-muted-foreground mt-4 max-w-[440px] leading-relaxed space-y-4">
              <p>
                GST returns. TDS deposits. MCA filings. Director KYC. PF and ESIC. These have
                different due dates, different penalties, and most founders are tracking zero of
                them.
              </p>
              <p>
                Ollvy Pro tracks all of them for your specific business. You get a reminder 30 days
                out, 7 days out, and the day before. Not a generic calendar — your obligations.
              </p>
            </div>

            {/* Tier comparison */}
            <div className="mt-6 border-t border-border pt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Free:</span>
                See all your compliance obligations. No reminders.
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge className="bg-ollvy-gold/10 text-yellow-400 border border-yellow-400/20 text-xs">
                  Pro
                </Badge>
                <span className="text-muted-foreground">
                  Reminders at 30d / 7d / 1d · Health score · One-tap booking · ₹999/month
                </span>
              </div>
            </div>

            {/* CTA */}
            <Button variant="outline" className="mt-8" asChild>
              <Link href="/upgrade">Upgrade to Pro</Link>
            </Button>
          </div>

          {/* Right - Calendar Card */}
          <Card className="border border-border bg-background p-6">
            {/* Header row */}
            <div className="flex justify-between items-center mb-5">
              <span className="text-sm font-semibold text-foreground">Compliance Calendar</span>
              <span className="text-sm text-muted-foreground">April 2025</span>
            </div>

            {/* Obligation rows */}
            <div className="divide-y divide-border/50">
              {obligations.map((obligation) => (
                <div
                  key={obligation.name}
                  className={cn(
                    'flex items-center justify-between py-3 pl-3 border-l-2',
                    obligation.leftBorderColor
                  )}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{obligation.name}</span>
                      {obligation.isProLocked && (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{obligation.label}</p>
                  </div>
                  <Badge className={cn('text-xs', badgeStyle(obligation.status))}>
                    {obligation.badgeText}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Health score block */}
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-3xl font-bold font-mono text-foreground">84</span>
                  <span className="text-lg text-muted-foreground">/100</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Compliance Score</p>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-ollvy-green">On Track ✓</span>
                    <span className="text-muted-foreground">3 due this month</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full">
                    <div className="h-2 rounded-full bg-ollvy-green" style={{ width: '84%' }} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

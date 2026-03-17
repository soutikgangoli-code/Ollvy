'use client'

import { Clock, GitBranch, AlertTriangle, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const risks = [
  {
    icon: Clock,
    title: 'Late filing',
    body: "GSTR-3B was due on the 20th. Your CA filed on the 22nd. That's ₹100 in late fees plus 18% annual interest on whatever tax was due — and it starts accruing from day 21, not from when you find out.",
  },
  {
    icon: GitBranch,
    title: "GSTR-1 and GSTR-3B don't match",
    body: "If the outward supply figures in your GSTR-1 don't match what you declared in GSTR-3B, the GSTN system flags it automatically under Section 61. You get a notice. You then need a CA to respond to it — which is not included in most retainers.",
  },
  {
    icon: AlertTriangle,
    title: "Claiming ITC for a vendor who hasn't filed",
    body: "You paid the vendor. You have the invoice. You claimed the ITC. But if that vendor hasn't filed their GSTR-1, your ITC claim gets blocked and you get a notice — even though you did nothing wrong. You're liable for someone else's non-compliance.",
  },
  {
    icon: Building2,
    title: 'Director KYC missed',
    body: "MCA requires DIR-3 KYC every year before Sep 30. If you miss it, your DIN gets deactivated, you can't sign on any MCA document, and the penalty is ₹5,000/day until it's filed. Most founders don't know this deadline exists until they've already missed it.",
  },
]

export function ComplianceRisks() {
  return (
    <section className="bg-card py-24">
      <div className="container">
        {/* Section Label */}
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
          COMPLIANCE RISK
        </p>

        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
          The most common reasons businesses get GST notices
        </h2>

        {/* Subheading */}
        <p className="text-base text-muted-foreground text-center max-w-[560px] mx-auto mt-4">
          Most compliance failures are predictable and preventable.
        </p>

        {/* Risk List */}
        <div className="mt-12 max-w-[720px] mx-auto divide-y divide-border">
          {risks.map((risk) => {
            const Icon = risk.icon
            return (
              <div key={risk.title} className="flex items-start gap-5 py-6 first:pt-0 last:pb-0">
                <div className="mt-0.5 shrink-0 text-ollvy-amber">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base">{risk.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {risk.body}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground">
            Ollvy's compliance calendar tracks all these deadlines automatically — for your
            specific business type and registrations.
          </p>
          <button
            onClick={() =>
              document
                .getElementById('compliance-calendar')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-3 underline underline-offset-4"
          >
            See the compliance calendar ↓
          </button>
        </div>
      </div>
    </section>
  )
}

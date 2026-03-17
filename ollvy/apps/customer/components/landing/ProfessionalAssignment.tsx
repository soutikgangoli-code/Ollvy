'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

const verifications = [
  'ICAI membership number confirmed for all CAs',
  'Bar Council enrollment number confirmed for all lawyers',
  'ICSI certificate number confirmed for Company Secretaries',
  'ID proof and practice certificate reviewed before first order',
  '5-strike SLA enforcement — automatic suspension on the 5th breach',
  'All disputes mediated by Ollvy. The professional is not your problem.',
]

export function ProfessionalAssignment() {
  return (
    <section className="bg-card py-24">
      <div className="container">
        {/* Section Label */}
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
          HOW IT WORKS
        </p>

        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
          Handled by verified professionals. You never have to find one.
        </h2>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Left - Explanation */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              You book Ollvy. Not a CA.
            </h3>

            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Every order gets matched to a verified CA, lawyer, or company secretary
              automatically. Matched by city, service type, and current workload. You don't get
              to pick — and that's the point.
            </p>

            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              The professional works inside the app. You see their first name. That's the extent
              of the relationship. If they miss an SLA, we reassign and fix it. Not you.
            </p>

            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              This matters because: when the professional is directly accountable to you, they
              also have leverage over you. Every Indian founder has experienced a CA who goes
              quiet before a deadline. On Ollvy, Ollvy is accountable — not the individual.
            </p>

            {/* Pull quote */}
            <blockquote className="mt-8 pl-4 border-l-2 border-ollvy-green">
              <p className="text-sm text-muted-foreground italic">
                "You book Ollvy. If anything goes wrong, Ollvy fixes it. The CA is invisible
                infrastructure."
              </p>
            </blockquote>
          </div>

          {/* Right - Verification Checklist */}
          <Card className="border border-border bg-background p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
              HOW PROFESSIONALS ARE VERIFIED
            </p>

            <ul className="space-y-3">
              {verifications.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-ollvy-green mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}

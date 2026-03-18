'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ForProfessionals() {
  return (
    <section id="professionals" className="bg-card py-24">
      <div className="container">
        <div className="max-w-[640px] mx-auto text-center">
          {/* Section Label */}
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            FOR CAs, CSs, AND LAWYERS
          </p>

          {/* Section Heading */}
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            Clients come to you. Not the other way around.
          </h2>

          {/* Body */}
          <p className="text-base text-muted-foreground mt-4 leading-relaxed max-w-[540px] mx-auto">
            Join as a verified professional and get matched with clients based on your city and
            service type. Orders come in through the app. You handle them in the app. Payouts hit
            your account every week.
          </p>

          <p className="text-base text-muted-foreground mt-4">
            No cold calls. No rate negotiations. No chasing invoices.
          </p>

          {/* Earnings Context Card */}
          <Card className="border border-border rounded-xl p-5 mt-6 text-left">
            <p className="text-sm font-medium text-foreground">
              What professionals on Ollvy earn
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              A CA in Delhi handling 8-12 GST retainer clients through Ollvy earns approximately
              ₹24,000-₹36,000/month from the platform - on top of their existing practice. This is
              based on current platform activity, not a guarantee.
            </p>
          </Card>

          {/* CTA */}
          <div className="mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link href="/join">Apply to join →</Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Verification takes 2-3 working days. ICAI/ICSI/Bar Council registration number
              required.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

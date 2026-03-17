'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Minus } from 'lucide-react'

interface RetainerCard {
  name: string
  price: string
  capacity: string
  included: string[]
  excluded: string[]
}

const retainers: RetainerCard[] = [
  {
    name: 'GST Monthly Filing',
    price: 'From ₹2,999/month',
    capacity: 'Up to ₹50L annual turnover',
    included: [
      'GSTR-1 (outward supply return)',
      'GSTR-3B (net tax payment)',
      'Late fee computation and reporting',
      'Monthly compliance report',
    ],
    excluded: [
      'Audit response or scrutiny notices',
      'Demand notice replies',
      'Amendment returns (GSTR-1A)',
      'ITC mismatches with GSTR-2B',
    ],
  },
  {
    name: 'Payroll Management',
    price: 'From ₹5,999/month',
    capacity: 'Up to 10 employees',
    included: [
      'Monthly salary processing',
      'PF and ESIC computation',
      'Payslip generation',
      'Challan preparation and tracking',
    ],
    excluded: [
      'HR policy drafting',
      'Termination or relieving letters',
      'Full-and-final settlement disputes',
      'New joiner onboarding paperwork',
    ],
  },
  {
    name: 'TDS Monthly Compliance',
    price: '₹3,999/month',
    capacity: 'Standard deductee count',
    included: [
      'Monthly TDS challan filing',
      'Form 26Q and 24Q quarterly returns',
      'TDS deposit deadline tracking',
    ],
    excluded: [
      'TDS notice replies',
      'Demand resolution or rectification',
      'Lower TDS certificate applications',
    ],
  },
]

export function RetainerModel() {
  return (
    <section className="bg-background py-24">
      <div className="container">
        {/* Section Label */}
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
          MONTHLY RETAINERS
        </p>

        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
          Monthly obligations. Handled monthly.
        </h2>

        {/* Body paragraph */}
        <div className="text-sm text-muted-foreground text-center max-w-[600px] mx-auto mt-4 space-y-4 leading-relaxed">
          <p>
            GST filings don't file themselves. TDS doesn't deposit itself. Payroll doesn't
            process itself. These happen every month whether or not you're thinking about them.
          </p>
          <p>
            A retainer on Ollvy means a specialist is assigned to your account. They handle it
            each cycle. You get a report when it's done. Fixed price. No negotiation every month.
          </p>
        </div>

        {/* Retainer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {retainers.map((retainer) => (
            <Card key={retainer.name} className="border border-border bg-card p-6">
              <h3 className="font-semibold text-base text-foreground">{retainer.name}</h3>
              <p className="font-mono text-xl font-bold text-foreground mt-1">{retainer.price}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{retainer.capacity}</p>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  INCLUDED
                </p>
                <ul className="space-y-1.5">
                  {retainer.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="h-3 w-3 text-ollvy-green mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  NOT INCLUDED
                </p>
                <ul className="space-y-1.5">
                  {retainer.excluded.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Minus className="h-3 w-3 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="outline" className="w-full mt-6" asChild>
                <Link href="/services?utm_source=homepage&utm_medium=landing&utm_content=retainer_model">Book Retainer</Link>
              </Button>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button variant="ghost" asChild>
            <Link href="/services?utm_source=homepage&utm_medium=landing&utm_content=retainer_model">See all retainer services →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Activity, Zap, Check } from 'lucide-react'

/**
 * §11 — Ollvy Pro Pricing (Condensed Homepage Version)
 *
 * Per spec architecture decision:
 * - Homepage shows condensed 3-card version
 * - Full comparison table lives on /pro standalone page
 * - This is discovery, not deep comparison
 *
 * Per §23 Connection Point 6:
 * - Pricing data fetched from DB via getProPlanPricing()
 * - Falls back to defaults if DB not available
 */

interface ProPricingProps {
  annualPrice?: number  // in rupees, e.g. 9990
  monthlyPrice?: number // in rupees, e.g. 999
}

const proFeatures = [
  {
    icon: Calendar,
    title: 'Compliance calendar with reminders',
    body: 'Every deadline tracked for your specific business. Reminders at 30d, 7d, and 1d before. Never miss a filing.',
  },
  {
    icon: Activity,
    title: 'Business health score',
    body: 'A single number that tells you where you stand. Based on filings completed, pending, and overdue.',
  },
  {
    icon: Zap,
    title: 'Priority assignment + 5% discount',
    body: "Pro orders go to the front of the queue. Plus 5% off every service — pays for itself after 2 bookings.",
  },
]

export function ProPricing({ annualPrice = 9990, monthlyPrice = 999 }: ProPricingProps) {
  // Calculate monthly equivalent and savings
  const monthlyEquivalent = Math.round(annualPrice / 12)
  const annualSavings = (monthlyPrice * 12) - annualPrice

  // Format prices
  const formatPrice = (price: number) => price.toLocaleString('en-IN')
  return (
    <section id="pricing" className="bg-card py-24">
      <div className="container">
        {/* Section Label */}
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
          OLLVY PRO
        </p>

        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
          ₹{formatPrice(monthlyEquivalent)}/month. Know everything that's due before it's late.
        </h2>

        {/* Price Badge */}
        <div className="flex justify-center mt-6">
          <Badge className="bg-ollvy-gold/10 text-yellow-400 border border-yellow-400/20 px-4 py-1.5">
            ₹{formatPrice(annualPrice)}/year · Save ₹{formatPrice(annualSavings)} vs monthly
          </Badge>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-[960px] mx-auto">
          {proFeatures.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card key={i} className="border border-border bg-background p-6">
                <Icon size={20} className="text-yellow-400" strokeWidth={1.5} />
                <h3 className="font-semibold mt-4 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{feature.body}</p>
              </Card>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button size="lg" asChild>
            <Link href="/upgrade?utm_source=homepage&utm_medium=landing&utm_content=pro_pricing">
              Start Ollvy Pro — ₹{formatPrice(annualPrice)}/year
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            That's ₹{formatPrice(monthlyEquivalent)}/month.{' '}
            <Link href="/pricing" className="underline hover:text-foreground">
              See all pricing options →
            </Link>
          </p>
        </div>

        {/* Trust Lines */}
        <div className="flex flex-col items-center gap-2 mt-8">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Check size={14} className="text-ollvy-green" />
            14-day money-back guarantee
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Check size={14} className="text-ollvy-green" />
            Cancel anytime. No lock-in.
          </p>
        </div>
      </div>
    </section>
  )
}

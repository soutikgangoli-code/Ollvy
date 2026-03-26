import { Metadata } from 'next'
import { ProPricing } from '@/components/landing/ProPricing'
import { RetainerModel } from '@/components/landing/RetainerModel'
import { getProPlanPricing } from '@/lib/data/services'

export const metadata: Metadata = {
  title: 'Pricing - Ollvy Pro & Monthly Retainers | Ollvy',
  description:
    'Ollvy Pro subscription for compliance tracking and reminders. Monthly retainer packages for GST filing, payroll, and TDS compliance. Fixed pricing, no surprises.',
  alternates: {
    canonical: 'https://www.ollvy.com/pricing',
  },
  openGraph: {
    title: 'Pricing - Ollvy Pro & Monthly Retainers | Ollvy',
    description: 'Ollvy Pro subscription for compliance tracking and reminders. Monthly retainer packages for GST filing, payroll, and TDS compliance.',
    url: 'https://www.ollvy.com/pricing',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing - Ollvy Pro & Monthly Retainers | Ollvy',
    description: 'Ollvy Pro subscription and monthly retainer packages. Fixed pricing, no surprises.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

// ISR - revalidate hourly
export const revalidate = 3600

export default async function PricingPage() {
  const proPricing = await getProPlanPricing()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background pt-24 pb-12">
        <div className="container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
            PRICING
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground text-center max-w-[720px] mx-auto">
            Simple pricing. No negotiation every month.
          </h1>
          <p className="text-base text-muted-foreground text-center max-w-[560px] mx-auto mt-4">
            Choose Ollvy Pro for compliance tracking and priority service, or subscribe to monthly
            retainers for ongoing filings handled by a dedicated specialist.
          </p>
        </div>
      </section>

      {/* Ollvy Pro Section */}
      <ProPricing
        annualPrice={proPricing.annualPricePaisa / 100}
        monthlyPrice={proPricing.monthlyPricePaisa / 100}
      />

      {/* Monthly Retainers Section */}
      <RetainerModel />
    </div>
  )
}

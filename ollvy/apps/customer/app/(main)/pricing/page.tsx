import { Metadata } from 'next'
import { ProPricing } from '@/components/landing/ProPricing'
import { RetainerModel } from '@/components/landing/RetainerModel'
import { getProPlanPricing } from '@/lib/data/services'

export const metadata: Metadata = {
  title: 'Pricing - Ollvy Pro & Monthly Retainers | Ollvy',
  description:
    'Ollvy Pro subscription for compliance tracking and reminders starting at Rs. 999/month. Monthly retainer packages for GST filing, payroll, and TDS compliance. Fixed pricing, no hidden fees.',
  keywords: [
    'compliance pricing India',
    'GST filing cost',
    'company compliance packages',
    'Ollvy Pro subscription',
    'monthly retainer accounting',
  ],
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

// Generate Product/Offer schema for pricing page
function generatePricingSchema(annualPrice: number, monthlyPrice: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Ollvy Pro',
    description: 'Compliance tracking, deadline reminders, and priority support for Indian businesses. Never miss a filing deadline again.',
    brand: {
      '@type': 'Brand',
      name: 'Ollvy',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Ollvy Pro Annual',
        price: annualPrice,
        priceCurrency: 'INR',
        priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
        url: 'https://www.ollvy.com/pricing',
        description: 'Annual subscription - Save over 15% compared to monthly billing',
      },
      {
        '@type': 'Offer',
        name: 'Ollvy Pro Monthly',
        price: monthlyPrice,
        priceCurrency: 'INR',
        priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
        url: 'https://www.ollvy.com/pricing',
        description: 'Monthly subscription - Flexible month-to-month billing',
      },
    ],
  }
}

// Breadcrumb schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://www.ollvy.com/pricing' },
  ],
}

export default async function PricingPage() {
  const proPricing = await getProPlanPricing()
  const annualPrice = proPricing.annualPricePaisa / 100
  const monthlyPrice = proPricing.monthlyPricePaisa / 100
  const pricingSchema = generatePricingSchema(annualPrice, monthlyPrice)

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />

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
          annualPrice={annualPrice}
          monthlyPrice={monthlyPrice}
        />

        {/* Monthly Retainers Section */}
        <RetainerModel />
      </div>
    </>
  )
}

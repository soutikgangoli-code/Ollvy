import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Receipt, FileText, Building2, UserCheck, Banknote } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Penalty Calculators for Indian Business Compliance | Ollvy',
  description: 'Calculate penalties for late GST filing, ITR filing, MCA annual filing, Director KYC, and TDS compliance. Real calculations based on Indian law.',
  alternates: {
    canonical: 'https://www.ollvy.com/tools/penalty-calculator',
  },
  openGraph: {
    title: 'Penalty Calculators for Indian Business Compliance | Ollvy',
    description: 'Calculate penalties for late GST filing, ITR filing, MCA annual filing, Director KYC, and TDS compliance.',
    url: 'https://www.ollvy.com/tools/penalty-calculator',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Penalty Calculators for Business Compliance | Ollvy',
    description: 'Calculate penalties for late GST, ITR, MCA, Director KYC, and TDS filings. Real calculations based on Indian law.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

const penaltyCalculators = [
  {
    title: 'GST Late Filing Penalty',
    description: 'Calculate penalties and interest for delayed GSTR-3B and GSTR-1 filing. Rs. 100/day late fee plus 18% interest on unpaid tax.',
    href: '/tools/penalty-calculator/gst-late-filing',
    icon: Receipt,
  },
  {
    title: 'ITR Late Filing Penalty',
    description: 'Calculate late filing fees under Section 234F. Rs. 5,000 or Rs. 10,000 penalty plus 1% monthly interest on unpaid tax.',
    href: '/tools/penalty-calculator/itr-late-filing',
    icon: FileText,
  },
  {
    title: 'MCA Annual Filing Penalty',
    description: 'Calculate penalties for delayed AOC-4 and MGT-7 filing for Private Limited Companies and LLPs. Rs. 200/day combined penalty.',
    href: '/tools/penalty-calculator/mca-annual-filing',
    icon: Building2,
  },
  {
    title: 'Director KYC Penalty',
    description: 'Calculate the Rs. 5,000 penalty for late DIR-3 KYC filing and understand DIN deactivation consequences.',
    href: '/tools/penalty-calculator/director-kyc',
    icon: UserCheck,
  },
  {
    title: 'TDS Late Filing Penalty',
    description: 'Calculate penalties for delayed TDS return filing (24Q/26Q) and late TDS deposit. Rs. 200/day plus 1.5% monthly interest.',
    href: '/tools/penalty-calculator/tds-late-filing',
    icon: Banknote,
  },
]

export default function PenaltyCalculatorPage() {
  // BreadcrumbList schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.ollvy.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: 'https://www.ollvy.com/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Penalty Calculators',
        item: 'https://www.ollvy.com/tools/penalty-calculator',
      },
    ],
  }

  // CollectionPage + ItemList schema
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Penalty Calculators for Indian Business Compliance',
    description: 'Calculate penalties for late GST filing, ITR filing, MCA annual filing, Director KYC, and TDS compliance.',
    url: 'https://www.ollvy.com/tools/penalty-calculator',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: penaltyCalculators.map((calc, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: calc.title,
        url: `https://www.ollvy.com${calc.href}`,
      })),
    },
  }

  return (
    <div className="py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            PENALTY CALCULATORS
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground">
            What's the Penalty for Missing a Deadline?
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Real calculations based on Indian compliance law. See exactly how much you owe
            for late filings and missed deadlines.
          </p>
        </div>

        {/* Calculator Cards */}
        <div className="space-y-4">
          {penaltyCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href}>
              <Card className="border border-border hover:border-ollvy-red/50 transition-colors cursor-pointer group">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="p-3 rounded-lg bg-ollvy-red/10 shrink-0">
                    <calc.icon className="h-6 w-6 text-ollvy-red" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl flex items-center justify-between">
                      {calc.title}
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-ollvy-red transition-colors" />
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">{calc.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

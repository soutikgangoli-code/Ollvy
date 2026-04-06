import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Calculator, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Free Business Tools | Ollvy',
  description: 'Free tools to help Indian businesses - Document checklists for company registration and penalty calculators for compliance deadlines.',
  alternates: {
    canonical: 'https://www.ollvy.com/tools',
  },
  openGraph: {
    title: 'Free Business Tools | Ollvy',
    description: 'Free tools to help Indian businesses - Document checklists and penalty calculators.',
    url: 'https://www.ollvy.com/tools',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Business Tools | Ollvy',
    description: 'Free tools to help Indian businesses - Document checklists and penalty calculators.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

const documentTools = [
  {
    title: 'Documents for Private Limited Company',
    description: 'Complete checklist of documents needed to register a Private Limited Company in India',
    href: '/tools/documents/private-limited-company',
  },
  {
    title: 'Documents for LLP Registration',
    description: 'All documents required to incorporate a Limited Liability Partnership',
    href: '/tools/documents/llp',
  },
  {
    title: 'Documents for Partnership Firm',
    description: 'Documents needed to create a Partnership Deed and register your firm',
    href: '/tools/documents/partnership',
  },
  {
    title: 'Documents for Sole Proprietorship',
    description: 'Documents required for sole proprietorship registration and compliance',
    href: '/tools/documents/sole-proprietor',
  },
  {
    title: 'Documents for GST Registration',
    description: 'Complete document checklist for GST registration as a sole proprietor or business',
    href: '/tools/documents/gst-registration',
  },
  {
    title: 'Documents for Individual ITR Filing',
    description: 'Documents needed to file individual income tax return in India',
    href: '/tools/documents/individual-itr',
  },
  {
    title: 'Documents for Business ITR Filing',
    description: 'Documents required for business income tax return filing',
    href: '/tools/documents/business-itr',
  },
  {
    title: 'Documents for Trademark Registration',
    description: 'Complete document checklist for trademark registration in India',
    href: '/tools/documents/trademark',
  },
]

const penaltyTools = [
  {
    title: 'GST Late Filing Penalty Calculator',
    description: 'Calculate penalties and interest for delayed GST return filing (GSTR-3B, GSTR-1)',
    href: '/tools/penalty-calculator/gst-late-filing',
  },
  {
    title: 'GST Demand Notice Calculator',
    description: 'Calculate interest and penalties on GST demand notices under Section 73/74',
    href: '/tools/penalty-calculator/gst-demand-notice',
  },
  {
    title: 'ITR Late Filing Penalty Calculator',
    description: 'Calculate late filing fees and interest for delayed Income Tax Return filing',
    href: '/tools/penalty-calculator/itr-late-filing',
  },
  {
    title: 'MCA Annual Filing Penalty Calculator',
    description: 'Calculate penalties for delayed ROC filing (AOC-4, MGT-7) for companies',
    href: '/tools/penalty-calculator/mca-annual-filing',
  },
  {
    title: 'Director KYC Penalty Calculator',
    description: 'Calculate the penalty for delayed DIR-3 KYC filing and DIN deactivation',
    href: '/tools/penalty-calculator/director-kyc',
  },
  {
    title: 'TDS Late Filing Penalty Calculator',
    description: 'Calculate penalties for delayed TDS return filing and late TDS payment',
    href: '/tools/penalty-calculator/tds-late-filing',
  },
  {
    title: 'Professional Tax Penalty Calculator',
    description: 'Calculate penalties for delayed professional tax registration and payment',
    href: '/tools/penalty-calculator/professional-tax-penalty',
  },
  {
    title: 'PF/ESIC Penalty Calculator',
    description: 'Calculate penalties for delayed PF and ESIC contributions and returns',
    href: '/tools/penalty-calculator/pf-esic-penalty',
  },
  {
    title: 'Shops & Establishment Penalty Calculator',
    description: 'Calculate penalties for Shops & Establishment Act non-compliance',
    href: '/tools/penalty-calculator/shops-establishment-penalty',
  },
  {
    title: 'Startup DPIIT Compliance Calculator',
    description: 'Calculate penalties for DPIIT-recognized startup compliance lapses',
    href: '/tools/penalty-calculator/startup-dpiit-compliance',
  },
]

// BreadcrumbList JSON-LD schema
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
  ],
}

// WebPage + ItemList JSON-LD schema
const toolsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Free Business Tools',
  description: 'Free tools to help Indian businesses - Document checklists for company registration and penalty calculators for compliance deadlines.',
  url: 'https://www.ollvy.com/tools',
  mainEntity: {
    '@type': 'ItemList',
    name: 'Business Tools Collection',
    numberOfItems: documentTools.length + penaltyTools.length,
    itemListElement: [...documentTools, ...penaltyTools].map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.title,
      description: tool.description,
      url: `https://www.ollvy.com${tool.href}`,
    })),
  },
}

export default function ToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsJsonLd) }}
      />
      <div className="py-24">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            FREE TOOLS
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground">
            Business Tools
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Free tools to help you understand compliance requirements and calculate penalties
            for missed deadlines.
          </p>
        </div>

        {/* Document Checklists Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Document Checklists</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Know exactly what documents you need before starting your registration process.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {documentTools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <Card className="h-full border border-border hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {tool.title}
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Penalty Calculators Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-muted">
              <Calculator className="h-5 w-5 text-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Penalty Calculators</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Calculate the real cost of missing compliance deadlines based on Indian law.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {penaltyTools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <Card className="h-full border border-border hover:border-border transition-colors cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {tool.title}
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

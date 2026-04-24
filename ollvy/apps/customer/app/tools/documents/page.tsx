import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Building2, Users, Handshake, Receipt, User, FileText, Briefcase, Shield, CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Document Checklists for Business Registration & Compliance | Ollvy',
  description: 'Complete document checklists for registering Private Limited Company, LLP, Partnership Firm, GST, ITR filing, and Trademark in India. Know exactly what you need.',
  alternates: {
    canonical: 'https://www.ollvy.com/tools/documents',
  },
  openGraph: {
    title: 'Document Checklists for Business Registration & Compliance | Ollvy',
    description: 'Complete document checklists for registering Private Limited Company, LLP, Partnership Firm, GST, ITR filing, and Trademark in India.',
    url: 'https://www.ollvy.com/tools/documents',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Document Checklists for Business Registration | Ollvy',
    description: 'Complete document checklists for registering Pvt Ltd, LLP, Partnership, GST, ITR, and Trademark in India.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

const documentTypes = [
  {
    title: 'Documents for Private Limited Company',
    description: 'Complete checklist of documents needed to register a Private Limited Company in India. Includes director KYC, registered office proof, and more.',
    href: '/tools/documents/private-limited-company',
    icon: Building2,
  },
  {
    title: 'Documents for LLP Registration',
    description: 'All documents required to incorporate a Limited Liability Partnership. Partner identity, office proof, and LLP agreement requirements.',
    href: '/tools/documents/llp',
    icon: Users,
  },
  {
    title: 'Documents for Partnership Firm',
    description: 'Documents needed to create a Partnership Deed and register your firm. Partner details, business premises, and deed requirements.',
    href: '/tools/documents/partnership',
    icon: Handshake,
  },
  {
    title: 'Documents for Sole Proprietorship / GST',
    description: 'Complete document checklist for GST registration as a sole proprietor. Identity, address proof, bank details, and business registration.',
    href: '/tools/documents/sole-proprietor',
    icon: User,
  },
  {
    title: 'Documents for GST Registration',
    description: 'Everything you need for GST registration for any business type. PAN, Aadhaar, address proof, bank account details.',
    href: '/tools/documents/gst-registration',
    icon: Receipt,
  },
  {
    title: 'Documents for Individual ITR Filing',
    description: 'Form 16, bank statements, investment proofs, and capital gains documents for personal income tax return filing.',
    href: '/tools/documents/individual-itr',
    icon: FileText,
  },
  {
    title: 'Documents for Business ITR Filing',
    description: 'Audited financials, Form 26AS, GST returns, and compliance documents for company/LLP income tax return.',
    href: '/tools/documents/business-itr',
    icon: Briefcase,
  },
  {
    title: 'Documents for Trademark Registration',
    description: 'Brand name, logo, applicant identity, and business documents needed to register and protect your trademark.',
    href: '/tools/documents/trademark',
    icon: Shield,
  },
  {
    title: 'Documents for Business PAN',
    description: 'PAN application for a Company, LLP, or Partnership Firm. Form 49A, identity + address proof of directors/partners, and entity documents required.',
    href: '/tools/documents/business-pan',
    icon: CreditCard,
  },
]

export default function DocumentsPage() {
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
        name: 'Document Checklists',
        item: 'https://www.ollvy.com/tools/documents',
      },
    ],
  }

  // CollectionPage + ItemList schema
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Document Checklists for Business Registration & Compliance',
    description: 'Complete document checklists for registering Private Limited Company, LLP, Partnership Firm, GST, ITR filing, and Trademark in India.',
    url: 'https://www.ollvy.com/tools/documents',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: documentTypes.map((doc, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: doc.title,
        url: `https://www.ollvy.com${doc.href}`,
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
            DOCUMENT CHECKLISTS
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground">
            What Documents Do You Need?
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Know exactly what documents you need before starting your business registration.
            Click on any option below to see the complete checklist.
          </p>
        </div>

        {/* Document Type Cards */}
        <div className="space-y-3">
          {documentTypes.map((doc) => (
            <Link key={doc.href} href={doc.href}>
              <Card className="border border-border hover:border-[hsl(var(--ollvy-green))] transition-colors cursor-pointer group">
                <CardHeader className="flex flex-row items-start gap-3 py-4 px-4">
                  <div className="p-2 rounded-lg bg-muted shrink-0">
                    <doc.icon className="h-4 w-4 text-muted-foreground group-hover:text-[hsl(var(--ollvy-green))] transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium flex items-center justify-between gap-2 text-foreground/80">
                      <span className="truncate">{doc.title}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[hsl(var(--ollvy-green))] transition-colors shrink-0" />
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs line-clamp-2">{doc.description}</CardDescription>
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

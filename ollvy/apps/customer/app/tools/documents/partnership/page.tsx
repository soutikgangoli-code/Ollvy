import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { partnershipDocuments } from '@/lib/data/document-checklists'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'Partnership Documents', item: 'https://ollvy.com/tools/documents/partnership' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Gather Documents for Partnership Firm Registration',
  description: 'Step-by-step guide to collecting all documents required for Partnership Firm registration in India',
  totalTime: 'P2D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '0',
  },
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Gather Partner Identity Documents',
      text: 'Collect PAN card, Aadhaar card, and passport-size photograph for all partners (minimum 2 partners required).',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Prepare Address Proof',
      text: 'Collect residential address proof for each partner - bank statement, utility bill, or Aadhaar card.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Draft Partnership Deed',
      text: 'Prepare the partnership deed detailing profit sharing ratio, capital contribution, roles and responsibilities - Ollvy can draft this for you.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Arrange Stamp Paper',
      text: 'Purchase non-judicial stamp paper of appropriate value as per your state (ranges from Rs 100 to Rs 500).',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Prepare Business Place Proof',
      text: 'Obtain rent agreement or ownership proof for the principal place of business along with utility bill.',
    },
  ],
}

export const metadata: Metadata = {
  title: 'Documents Required for Partnership Firm Registration in India | Ollvy',
  description: 'Complete checklist of documents needed to register a Partnership Firm in India. Partner identity proof, partnership deed, stamp paper, and firm registration requirements.',
  keywords: ['partnership firm documents', 'partnership deed documents', 'partnership registration india', 'partnership firm registration documents'],
  alternates: {
    canonical: 'https://ollvy.com/tools/documents/partnership',
  },
  openGraph: {
    title: 'Documents Required for Partnership Firm Registration in India | Ollvy',
    description: 'Complete checklist of documents needed to register a Partnership Firm in India.',
    url: 'https://ollvy.com/tools/documents/partnership',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documents Required for Partnership Firm Registration | Ollvy',
    description: 'Complete checklist of documents needed to register a Partnership Firm in India.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function PartnershipDocumentsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <DocumentChecklistContent
        categories={partnershipDocuments}
        pageTitle="Partnership Firm Registration"
        pageSubtitle="Complete list of documents required to register a Partnership Firm in India"
        ctaTitle="Ready to create your partnership?"
        ctaDescription="Get started with Ollvy. We draft your partnership deed, handle stamp paper, and complete firm registration if needed."
        ctaButtonText="Start Partnership Registration"
        ctaButtonHref="/services?utm_source=tools&utm_medium=documents&utm_content=partnership"
      />
    </>
  )
}

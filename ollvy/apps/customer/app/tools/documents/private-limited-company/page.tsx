import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { pvtLtdDocuments } from '@/lib/data/document-checklists'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'Pvt Ltd Documents', item: 'https://ollvy.com/tools/documents/private-limited-company' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Gather Documents for Private Limited Company Registration',
  description: 'Step-by-step guide to collecting all documents required for Pvt Ltd company registration in India',
  totalTime: 'P3D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '0',
  },
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Gather Director Identity Documents',
      text: 'Collect PAN card, Aadhaar card, passport-size photograph, and specimen signature for all proposed directors (minimum 2 directors required).',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Arrange Shareholder Documents',
      text: 'Collect PAN and address proof for all shareholders. If a shareholder is a company, provide its PAN and board resolution.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Prepare Registered Office Proof',
      text: 'Obtain rent agreement or sale deed for the registered office address, along with a recent utility bill (electricity/water) as proof of address.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Get NOC from Property Owner',
      text: 'Obtain a No Objection Certificate from the property owner consenting to use the premises as your registered office address.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Apply for Digital Signature Certificate',
      text: 'Apply for DSC (Digital Signature Certificate) for all directors - Ollvy handles this as part of the registration process.',
    },
  ],
}

export const metadata: Metadata = {
  title: 'Pvt Ltd Documents Checklist | Ollvy',
  description: 'Complete checklist of documents needed to register a Private Limited Company in India. Director PAN, Aadhaar, registered office proof, DSC, DIN requirements and more.',
  keywords: ['private limited company documents', 'pvt ltd registration documents', 'company incorporation documents india', 'director documents for company registration'],
  alternates: {
    canonical: 'https://ollvy.com/tools/documents/private-limited-company',
  },
  openGraph: {
    title: 'Pvt Ltd Company Documents Checklist | Ollvy',
    description: 'Complete checklist of documents needed to register a Private Limited Company in India.',
    url: 'https://ollvy.com/tools/documents/private-limited-company',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pvt Ltd Documents Checklist | Ollvy',
    description: 'Complete checklist of documents needed to register a Private Limited Company in India.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function PrivateLimitedDocumentsPage() {
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
        categories={pvtLtdDocuments}
        pageTitle="Private Limited Company Registration"
        pageSubtitle="Complete list of documents required to incorporate a Pvt Ltd company in India"
        ctaTitle="Ready to incorporate your company?"
        ctaDescription="Get started with Ollvy. We handle DSC, DIN, name approval, and all MCA filings. Most companies are incorporated within 7-10 days."
        ctaButtonText="Start Company Registration"
        ctaButtonHref="/services/pvt-ltd-incorporation?utm_source=tools&utm_medium=documents&utm_content=pvt_ltd"
      />
    </>
  )
}

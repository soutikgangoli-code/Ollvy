import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { gstDocuments } from '@/lib/data/document-checklists'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'Sole Proprietorship Documents', item: 'https://ollvy.com/tools/documents/sole-proprietor' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Gather Documents for Sole Proprietorship Registration',
  description: 'Step-by-step guide to collecting all documents required for sole proprietorship registration in India',
  totalTime: 'P1D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '0',
  },
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Gather Identity Documents',
      text: 'Collect your PAN card and Aadhaar card. These are mandatory for all registrations including GST.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Prepare Business Place Proof',
      text: 'Get rent agreement or ownership proof for your business address, along with a recent electricity bill.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Get NOC from Landlord',
      text: 'Obtain a No Objection Certificate from your landlord consenting to business operations at the premises.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Open Current Account',
      text: 'Open a current bank account in the business name and get a cancelled cheque or bank statement.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Passport Size Photo',
      text: 'Keep recent passport-size photographs ready for registration applications.',
    },
  ],
}

export const metadata: Metadata = {
  title: 'Documents Required for Sole Proprietorship Registration in India | Ollvy',
  description: 'Complete checklist of documents needed to register a Sole Proprietorship in India. PAN, Aadhaar, address proof, bank account details for GST registration.',
  keywords: ['sole proprietorship documents', 'proprietorship registration documents', 'GST registration documents india', 'sole prop documents'],
  alternates: {
    canonical: 'https://ollvy.com/tools/documents/sole-proprietor',
  },
  openGraph: {
    title: 'Documents Required for Sole Proprietorship Registration | Ollvy',
    description: 'Complete checklist of documents needed to register a Sole Proprietorship in India.',
    url: 'https://ollvy.com/tools/documents/sole-proprietor',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documents Required for Sole Proprietorship Registration | Ollvy',
    description: 'Complete checklist of documents needed to register a Sole Proprietorship in India.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function SoleProprietorDocumentsPage() {
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
        categories={gstDocuments}
        pageTitle="Sole Proprietorship Registration"
        pageSubtitle="Complete list of documents required to register a Sole Proprietorship in India"
        ctaTitle="Ready to register your business?"
        ctaDescription="Get started with Ollvy. We handle GST registration, Shop Act license, and all compliance for sole proprietors."
        ctaButtonText="Start GST Registration"
        ctaButtonHref="/services/gst-registration?utm_source=tools&utm_medium=documents&utm_content=sole_prop"
      />
    </>
  )
}

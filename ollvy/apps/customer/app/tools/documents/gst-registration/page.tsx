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
    { '@type': 'ListItem', position: 4, name: 'GST Documents', item: 'https://ollvy.com/tools/documents/gst-registration' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Gather Documents for GST Registration',
  description: 'Step-by-step guide to collecting all documents required for GST registration in India',
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
      text: 'Collect PAN card and Aadhaar card of the proprietor or all partners/directors depending on business type.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Prepare Business Registration Proof',
      text: 'For companies and LLPs, keep the Certificate of Incorporation ready. For partnerships, keep the partnership deed.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Arrange Principal Place of Business Proof',
      text: 'Collect rent agreement or property ownership documents along with a recent electricity bill for the business address.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Get NOC from Property Owner',
      text: 'Obtain a No Objection Certificate from the landlord or property owner consenting to GST registration at the premises.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Bank Account Details',
      text: 'Keep a cancelled cheque or bank statement showing account holder name, account number, and IFSC code.',
    },
  ],
}

export const metadata: Metadata = {
  title: 'Documents Required for GST Registration in India | Ollvy',
  description: 'Complete checklist of documents needed for GST registration in India. PAN, Aadhaar, address proof, bank statement requirements for sole proprietors and businesses.',
  keywords: ['GST registration documents', 'GST documents list', 'documents for GST number', 'GST registration requirements india'],
  alternates: {
    canonical: 'https://ollvy.com/tools/documents/gst-registration',
  },
  openGraph: {
    title: 'Documents Required for GST Registration in India | Ollvy',
    description: 'Complete checklist of documents needed for GST registration in India.',
    url: 'https://ollvy.com/tools/documents/gst-registration',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documents Required for GST Registration | Ollvy',
    description: 'Complete checklist of documents needed for GST registration in India.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function GSTDocumentsPage() {
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
        pageTitle="GST Registration"
        pageSubtitle="Complete list of documents required to get your GSTIN in India"
        ctaTitle="Ready to get your GST number?"
        ctaDescription="Get started with Ollvy. We handle the entire GST registration process - from document verification to ARN tracking to GSTIN delivery."
        ctaButtonText="Start GST Registration"
        ctaButtonHref="/services/gst-registration?utm_source=tools&utm_medium=documents&utm_content=gst"
      />
    </>
  )
}

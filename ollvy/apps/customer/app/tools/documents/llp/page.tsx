import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { llpDocuments } from '@/lib/data/document-checklists'

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Gather Documents for LLP Registration',
  description: 'Step-by-step guide to collecting all documents required for Limited Liability Partnership registration in India',
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
      name: 'Gather Partner Identity Documents',
      text: 'Collect PAN card, Aadhaar card, passport-size photograph, and specimen signature for all designated partners (minimum 2 partners required).',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Prepare Address Proof for Partners',
      text: 'Collect address proof (bank statement, utility bill, or Aadhaar) for each partner showing current residential address.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Arrange Registered Office Proof',
      text: 'Obtain rent agreement or ownership proof for the registered office, along with a utility bill not older than 2 months.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Get NOC from Property Owner',
      text: 'Obtain a No Objection Certificate from the property owner allowing use of the premises as LLP registered office.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Apply for Digital Signature Certificate',
      text: 'Apply for DSC and DPIN for all designated partners - Ollvy handles this as part of the registration process.',
    },
  ],
}

export const metadata: Metadata = {
  title: 'Documents Required for LLP Registration in India | Ollvy',
  description: 'Complete checklist of documents needed to register an LLP (Limited Liability Partnership) in India. Partner PAN, Aadhaar, DPIN, DSC, LLP Agreement requirements.',
  keywords: ['LLP registration documents', 'LLP incorporation documents india', 'designated partner documents', 'DPIN documents', 'LLP agreement'],
  alternates: {
    canonical: 'https://ollvy.com/tools/documents/llp',
  },
  openGraph: {
    title: 'Documents Required for LLP Registration in India | Ollvy',
    description: 'Complete checklist of documents needed to register an LLP in India.',
    url: 'https://ollvy.com/tools/documents/llp',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documents Required for LLP Registration | Ollvy',
    description: 'Complete checklist of documents needed to register an LLP in India.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function LLPDocumentsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <DocumentChecklistContent
        categories={llpDocuments}
        pageTitle="LLP Registration"
        pageSubtitle="Complete list of documents required to register a Limited Liability Partnership in India"
        ctaTitle="Ready to register your LLP?"
        ctaDescription="Get started with Ollvy. We handle DSC, DPIN, name approval, LLP Agreement drafting, and all MCA filings."
        ctaButtonText="Start LLP Registration"
        ctaButtonHref="/services/llp-incorporation?utm_source=tools&utm_medium=documents&utm_content=llp"
      />
    </>
  )
}

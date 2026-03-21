import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { trademarkDocuments } from '@/lib/data/document-checklists'

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Gather Documents for Trademark Registration',
  description: 'Step-by-step guide to collecting all documents required for trademark registration in India',
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
      name: 'Prepare Your Logo or Brand Name',
      text: 'Create a high-resolution image of your logo or wordmark in JPEG format. The image should be clear and on a white background.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Gather Identity Documents',
      text: 'Collect PAN card and Aadhaar of the applicant. For companies, provide Certificate of Incorporation.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Determine Trademark Classes',
      text: 'Identify which trademark classes apply to your goods or services. Ollvy can help you select the right classes.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Prepare Business Proof',
      text: 'Collect business registration documents - GST certificate, Udyam registration, or incorporation certificate.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Sign Authorization Form',
      text: 'Sign Form TM-48 authorizing your trademark attorney to file on your behalf - Ollvy provides this form.',
    },
  ],
}

export const metadata: Metadata = {
  title: 'Documents Required for Trademark Registration India 2025 | Ollvy',
  description: 'Complete trademark registration document checklist: Form TM-A, TM-48, logo, identity proof, business entity documents. Class selection and fee guide included.',
  keywords: ['trademark documents', 'trademark registration documents india', 'brand registration documents', 'TM application documents'],
  alternates: {
    canonical: 'https://ollvy.com/tools/documents/trademark',
  },
  openGraph: {
    title: 'Documents Required for Trademark Registration India | Ollvy',
    description: 'Complete trademark registration document checklist for Indian businesses.',
    url: 'https://ollvy.com/tools/documents/trademark',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documents Required for Trademark Registration | Ollvy',
    description: 'Complete trademark registration document checklist for India.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function TrademarkDocumentsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <DocumentChecklistContent
        categories={trademarkDocuments}
        pageTitle="Trademark Registration"
        pageSubtitle="Complete list of documents required to register your brand or logo in India"
        ctaTitle="Ready to protect your brand?"
        ctaDescription="Ollvy handles complete trademark registration - from search to filing to monitoring. Protect your brand with experienced IP attorneys."
        ctaButtonText="Register Trademark"
        ctaButtonHref="/services/trademark-registration?utm_source=tools&utm_medium=documents&utm_content=trademark"
      />
    </>
  )
}

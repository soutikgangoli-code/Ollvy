import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { individualITRDocuments } from '@/lib/data/document-checklists'

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Gather Documents for Individual ITR Filing',
  description: 'Step-by-step guide to collecting all documents required for personal income tax return filing in India',
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
      name: 'Collect Form 16 from Employer',
      text: 'Get Form 16 Part A and Part B from your employer. This shows your salary details and TDS deducted.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Download Form 26AS and AIS',
      text: 'Download Form 26AS and Annual Information Statement from incometax.gov.in to verify all TDS credits.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Gather Investment Proofs',
      text: 'Collect 80C proofs (LIC, PPF, ELSS), 80D health insurance premium receipts, and home loan interest certificates.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Compile Capital Gains Documents',
      text: 'Get broker statements for equity/mutual fund transactions and property sale deeds if applicable.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Bank Interest Certificates',
      text: 'Collect interest certificates from banks for savings account and fixed deposit interest earned.',
    },
  ],
}

export const metadata: Metadata = {
  title: 'Documents Required to File Individual ITR India FY 2024-25 | Ollvy',
  description: 'Complete document checklist for salaried ITR filing: Form 16, 26AS, AIS, investment proofs, capital gains documents. Free checklist with step-by-step guidance.',
  keywords: ['ITR documents', 'income tax return documents', 'Form 16', 'individual ITR filing documents', 'ITR documents checklist'],
  alternates: {
    canonical: 'https://ollvy.com/tools/documents/individual-itr',
  },
  openGraph: {
    title: 'Documents Required to File Individual ITR India | Ollvy',
    description: 'Complete document checklist for salaried ITR filing: Form 16, 26AS, AIS, investment proofs.',
    url: 'https://ollvy.com/tools/documents/individual-itr',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documents Required to File Individual ITR | Ollvy',
    description: 'Complete document checklist for salaried ITR filing in India.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function IndividualITRDocumentsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <DocumentChecklistContent
        categories={individualITRDocuments}
        pageTitle="Personal ITR Filing"
        pageSubtitle="Complete list of documents required to file your Individual Income Tax Return"
        ctaTitle="Ready to file your ITR?"
        ctaDescription="Just share your documents with us. Ollvy's CAs review everything, maximize your deductions, and file your return correctly."
        ctaButtonText="File My ITR"
        ctaButtonHref="/services/income-tax-return?utm_source=tools&utm_medium=documents&utm_content=individual_itr"
      />
    </>
  )
}

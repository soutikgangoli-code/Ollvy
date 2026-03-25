import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentPageIntro } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { gstDocuments } from '@/lib/data/document-checklists'
import { gstRegistrationContent } from '@/lib/tools/document-content'

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
  name: 'How to Register for GST in India',
  description: 'Complete guide to GST registration process, documents required, and step-by-step instructions',
  totalTime: 'P7D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '999',
  },
  step: gstRegistrationContent.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
}

const faqJsonLd = generateFAQSchema(gstRegistrationContent)

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Educational intro content */}
      <DocumentPageIntro content={gstRegistrationContent} />

      {/* Step-by-step process */}
      <DocumentSteps content={gstRegistrationContent} />

      {/* Document checklist header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Documents required</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Click on any document to see detailed requirements and how to obtain it
        </p>
      </div>

      {/* Document checklist */}
      <DocumentChecklistContent
        categories={gstDocuments}
        pageTitle="GST Registration"
        pageSubtitle="Complete list of documents required to get your GSTIN in India"
        ctaTitle="Ready to get your GST number?"
        ctaDescription="Get started with Ollvy. We handle the entire GST registration process - from document verification to ARN tracking to GSTIN delivery."
        ctaButtonText="Start GST Registration"
        ctaButtonHref="/services/gst-registration?utm_source=tools&utm_medium=documents&utm_content=gst"
      />

      {/* FAQ section */}
      <DocumentFAQSection content={gstRegistrationContent} />

      {/* Common mistakes */}
      <DocumentCommonMistakes content={gstRegistrationContent} />

      {/* Next steps */}
      <DocumentNextSteps content={gstRegistrationContent} />
    </>
  )
}

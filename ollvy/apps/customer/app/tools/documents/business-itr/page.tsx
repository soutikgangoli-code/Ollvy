import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentPageIntro } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { businessITRDocuments } from '@/lib/data/document-checklists'
import { businessItrContent } from '@/lib/tools/document-content'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'Business ITR Documents', item: 'https://ollvy.com/tools/documents/business-itr' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to File ITR for Business and Professionals',
  description: 'Complete guide to business income tax return filing, documents required, and step-by-step instructions',
  totalTime: 'P7D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '1999',
  },
  step: businessItrContent.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
}

const faqJsonLd = generateFAQSchema(businessItrContent)

export const metadata: Metadata = {
  title: 'How to File Business ITR - Documents & Process | Ollvy',
  description: 'Complete guide to business ITR filing in India. ITR-3, ITR-4, tax audit, presumptive taxation, P&L, balance sheet, documents required, and FAQs.',
  keywords: ['business ITR filing', 'how to file ITR-3', 'ITR-4 filing', 'tax audit', 'presumptive taxation 44AD', 'business income tax return', 'freelancer ITR'],
  alternates: {
    canonical: 'https://ollvy.com/tools/documents/business-itr',
  },
  openGraph: {
    title: 'How to File Business ITR in India | Ollvy',
    description: 'Complete guide to business income tax return filing - process, audit, and documents.',
    url: 'https://ollvy.com/tools/documents/business-itr',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to File Business ITR | Ollvy',
    description: 'Complete guide to business income tax return filing in India.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function BusinessITRDocumentsPage() {
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
      <DocumentPageIntro content={businessItrContent} />

      {/* Step-by-step process */}
      <DocumentSteps content={businessItrContent} />

      {/* Document checklist header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Documents required</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Click on any document to see detailed requirements and how to obtain it
        </p>
      </div>

      {/* Document checklist */}
      <DocumentChecklistContent
        categories={businessITRDocuments}
        pageTitle="Business ITR Filing"
        pageSubtitle="Complete list of documents required for Company, LLP, or Partnership tax return filing"
        ctaTitle="Need help with Business ITR?"
        ctaDescription="Ollvy handles complete business ITR filing - from audit coordination to return filing. CA assigned within 24 hours."
        ctaButtonText="File Business ITR"
        ctaButtonHref="/services/business-itr?utm_source=tools&utm_medium=documents&utm_content=business_itr"
      />

      {/* FAQ section */}
      <DocumentFAQSection content={businessItrContent} />

      {/* Common mistakes */}
      <DocumentCommonMistakes content={businessItrContent} />

      {/* Next steps */}
      <DocumentNextSteps content={businessItrContent} />
    </>
  )
}

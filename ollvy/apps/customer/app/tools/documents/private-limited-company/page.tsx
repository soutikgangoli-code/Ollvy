import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentPageIntro } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { pvtLtdDocuments } from '@/lib/data/document-checklists'
import { privateLimitedContent } from '@/lib/tools/document-content'

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
  name: 'How to Register a Private Limited Company in India',
  description: 'Complete guide to private limited company registration process, documents required, and step-by-step instructions',
  totalTime: 'P15D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '6999',
  },
  step: privateLimitedContent.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
}

const faqJsonLd = generateFAQSchema(privateLimitedContent)

export const metadata: Metadata = {
  title: 'How to Register Pvt Ltd Company - Documents & Process | Ollvy',
  description: 'Complete guide to Private Limited Company registration in India. Step-by-step process, required documents checklist, costs, timeline, and FAQs answered.',
  keywords: ['private limited company registration', 'how to register pvt ltd company', 'pvt ltd registration process', 'company incorporation documents india', 'SPICe+ form'],
  alternates: {
    canonical: 'https://ollvy.com/tools/documents/private-limited-company',
  },
  openGraph: {
    title: 'How to Register Pvt Ltd Company in India | Ollvy',
    description: 'Complete guide to Private Limited Company registration - process, documents, costs, and timeline.',
    url: 'https://ollvy.com/tools/documents/private-limited-company',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Register Pvt Ltd Company | Ollvy',
    description: 'Complete guide to Private Limited Company registration in India.',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Educational intro content */}
      <DocumentPageIntro content={privateLimitedContent} />

      {/* Step-by-step process */}
      <DocumentSteps content={privateLimitedContent} />

      {/* Document checklist header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Documents required</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Click on any document to see detailed requirements and how to obtain it
        </p>
      </div>

      {/* Document checklist */}
      <DocumentChecklistContent
        categories={pvtLtdDocuments}
        pageTitle="Private Limited Company Registration"
        pageSubtitle="Complete list of documents required to incorporate a Pvt Ltd company in India"
        ctaTitle="Ready to incorporate your company?"
        ctaDescription="Get started with Ollvy. We handle DSC, DIN, name approval, and all MCA filings. Most companies are incorporated within 7-10 days."
        ctaButtonText="Start Company Registration"
        ctaButtonHref="/services/pvt-ltd-incorporation?utm_source=tools&utm_medium=documents&utm_content=pvt_ltd"
      />

      {/* FAQ section */}
      <DocumentFAQSection content={privateLimitedContent} />

      {/* Common mistakes */}
      <DocumentCommonMistakes content={privateLimitedContent} />

      {/* Next steps */}
      <DocumentNextSteps content={privateLimitedContent} />
    </>
  )
}

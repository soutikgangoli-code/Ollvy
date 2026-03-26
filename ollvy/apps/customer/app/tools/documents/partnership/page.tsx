import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentPageIntro } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { partnershipDocuments } from '@/lib/data/document-checklists'
import { partnershipContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://www.ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'Partnership Documents', item: 'https://www.ollvy.com/tools/documents/partnership' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Register a Partnership Firm in India',
  description: 'Complete guide to partnership firm registration process, documents required, and step-by-step instructions',
  totalTime: 'P15D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '2999',
  },
  step: partnershipContent.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
}

const faqJsonLd = generateFAQSchema(partnershipContent)

const documentListJsonLd = generateDocumentListSchema(
  partnershipDocuments,
  'Partnership Firm Registration',
  'https://www.ollvy.com/tools/documents/partnership'
)

export const metadata: Metadata = {
  title: 'How to Register Partnership Firm - Documents & Process | Ollvy',
  description: 'Complete guide to partnership firm registration in India. Step-by-step process, partnership deed, required documents, costs, timeline, and FAQs answered.',
  keywords: ['partnership firm registration', 'how to register partnership firm', 'partnership deed', 'partnership registration process', 'partnership firm documents'],
  alternates: {
    canonical: 'https://www.ollvy.com/tools/documents/partnership',
  },
  openGraph: {
    title: 'How to Register Partnership Firm in India | Ollvy',
    description: 'Complete guide to partnership firm registration - process, documents, costs, and timeline.',
    url: 'https://www.ollvy.com/tools/documents/partnership',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Register Partnership Firm | Ollvy',
    description: 'Complete guide to partnership firm registration in India.',
    images: ['https://www.ollvy.com/logo.png'],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(documentListJsonLd) }}
      />

      {/* Educational intro content */}
      <DocumentPageIntro content={partnershipContent} />

      {/* Document checklist header */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] text-muted-foreground">02</span>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Documents required</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-7">
          Click on any document to see detailed requirements and how to obtain it
        </p>
      </div>

      {/* Document checklist */}
      <DocumentChecklistContent
        categories={partnershipDocuments}
        pageTitle="Partnership Firm Registration"
        pageSubtitle="Complete list of documents required to register a Partnership Firm in India"
        ctaTitle="Ready to create your partnership?"
        ctaDescription="Get started with Ollvy. We draft your partnership deed, handle stamp paper, and complete firm registration if needed."
        ctaButtonText="Start Partnership Registration"
        ctaButtonHref="/services?utm_source=tools&utm_medium=documents&utm_content=partnership"
      />

      {/* Step-by-step process */}
      <DocumentSteps content={partnershipContent} />

      {/* FAQ section */}
      <DocumentFAQSection content={partnershipContent} />

      {/* Common mistakes */}
      <DocumentCommonMistakes content={partnershipContent} />

      {/* Next steps */}
      <DocumentNextSteps content={partnershipContent} />
    </>
  )
}

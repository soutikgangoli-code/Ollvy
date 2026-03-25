import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentPageIntro } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { llpDocuments } from '@/lib/data/document-checklists'
import { llpContent } from '@/lib/tools/document-content'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'LLP Documents', item: 'https://ollvy.com/tools/documents/llp' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Register an LLP in India',
  description: 'Complete guide to LLP registration process, documents required, and step-by-step instructions',
  totalTime: 'P15D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '4999',
  },
  step: llpContent.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
}

const faqJsonLd = generateFAQSchema(llpContent)

export const metadata: Metadata = {
  title: 'How to Register LLP in India - Documents & Process | Ollvy',
  description: 'Complete guide to LLP registration in India. Step-by-step process, required documents checklist, LLP Agreement, DPIN, costs, timeline, and FAQs answered.',
  keywords: ['LLP registration', 'how to register LLP in India', 'LLP registration process', 'LLP documents', 'DPIN', 'LLP Agreement', 'FiLLiP form'],
  alternates: {
    canonical: 'https://ollvy.com/tools/documents/llp',
  },
  openGraph: {
    title: 'How to Register LLP in India | Ollvy',
    description: 'Complete guide to LLP registration - process, documents, costs, and timeline.',
    url: 'https://ollvy.com/tools/documents/llp',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Register LLP in India | Ollvy',
    description: 'Complete guide to LLP registration in India.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function LLPDocumentsPage() {
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
      <DocumentPageIntro content={llpContent} />

      {/* Step-by-step process */}
      <DocumentSteps content={llpContent} />

      {/* Document checklist header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Documents required</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Click on any document to see detailed requirements and how to obtain it
        </p>
      </div>

      {/* Document checklist */}
      <DocumentChecklistContent
        categories={llpDocuments}
        pageTitle="LLP Registration"
        pageSubtitle="Complete list of documents required to register a Limited Liability Partnership in India"
        ctaTitle="Ready to register your LLP?"
        ctaDescription="Get started with Ollvy. We handle DSC, DPIN, name approval, LLP Agreement drafting, and all MCA filings."
        ctaButtonText="Start LLP Registration"
        ctaButtonHref="/services/llp-incorporation?utm_source=tools&utm_medium=documents&utm_content=llp"
      />

      {/* FAQ section */}
      <DocumentFAQSection content={llpContent} />

      {/* Common mistakes */}
      <DocumentCommonMistakes content={llpContent} />

      {/* Next steps */}
      <DocumentNextSteps content={llpContent} />
    </>
  )
}

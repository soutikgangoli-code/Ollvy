import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentPageIntro } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { trademarkDocuments } from '@/lib/data/document-checklists'
import { trademarkContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://www.ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'Trademark Documents', item: 'https://www.ollvy.com/tools/documents/trademark' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Register a Trademark in India',
  description: 'Complete guide to trademark registration process, documents required, and step-by-step instructions',
  totalTime: 'P540D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '4999',
  },
  step: trademarkContent.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
}

const faqJsonLd = generateFAQSchema(trademarkContent)

const documentListJsonLd = generateDocumentListSchema(
  trademarkDocuments,
  'Trademark Registration',
  'https://www.ollvy.com/tools/documents/trademark'
)

export const metadata: Metadata = {
  title: 'How to Register Trademark - Documents & Process | Ollvy',
  description: 'Complete guide to trademark registration in India. Step-by-step process, classes, TM vs R symbol, opposition, documents required, costs, and FAQs.',
  keywords: ['trademark registration', 'how to register trademark in India', 'trademark registration process', 'trademark classes', 'brand registration', 'logo trademark'],
  alternates: {
    canonical: 'https://www.ollvy.com/tools/documents/trademark',
  },
  openGraph: {
    title: 'How to Register Trademark in India | Ollvy',
    description: 'Complete guide to trademark registration - process, classes, costs, and timeline.',
    url: 'https://www.ollvy.com/tools/documents/trademark',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Register Trademark in India | Ollvy',
    description: 'Complete guide to trademark registration in India.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

export default function TrademarkDocumentsPage() {
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
      <DocumentPageIntro content={trademarkContent} />

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
        categories={trademarkDocuments}
        pageTitle="Trademark Registration"
        pageSubtitle="Complete list of documents required to register your brand or logo in India"
        ctaTitle="Ready to protect your brand?"
        ctaDescription="Ollvy handles complete trademark registration - from search to filing to monitoring. Protect your brand with experienced IP attorneys."
        ctaButtonText="Register Trademark"
        ctaButtonHref="/services/trademark-registration?utm_source=tools&utm_medium=documents&utm_content=trademark"
      />

      {/* Step-by-step process */}
      <DocumentSteps content={trademarkContent} />

      {/* FAQ section */}
      <DocumentFAQSection content={trademarkContent} />

      {/* Common mistakes */}
      <DocumentCommonMistakes content={trademarkContent} />

      {/* Next steps */}
      <DocumentNextSteps content={trademarkContent} />
    </>
  )
}

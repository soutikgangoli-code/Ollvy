import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentPageIntro } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { DocumentPageHeader } from '@/components/tools/DocumentPageHeader'
import { ToolIntroSection, ToolIntroCTA, ToolFAQSection } from '@/components/tools/DocumentPageToolExtensions'
import { individualITRDocuments } from '@/lib/data/document-checklists'
import { individualItrContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'
import { individualItrChecklistPage } from '@/lib/tools/document-checklist-pages'
import { generateToolFAQSchema } from '@/lib/tools/types'

const config = individualItrChecklistPage

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://www.ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'Individual ITR Documents', item: 'https://www.ollvy.com/tools/documents/individual-itr' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to File ITR for Salaried Individuals',
  description: 'Complete guide to individual income tax return filing, documents required, and step-by-step instructions',
  totalTime: 'P3D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '499',
  },
  step: individualItrContent.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
}

const faqJsonLd = generateFAQSchema(individualItrContent)

const documentListJsonLd = generateDocumentListSchema(
  individualITRDocuments,
  'Individual ITR Filing',
  'https://www.ollvy.com/tools/documents/individual-itr'
)

const configFaqJsonLd = generateToolFAQSchema(config)

export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription,
  keywords: ['how to file ITR', 'ITR filing process', 'salaried ITR documents', 'Form 16', 'income tax return filing', 'ITR-1 Sahaj', '80C deductions'],
  alternates: {
    canonical: config.canonicalUrl,
  },
  openGraph: {
    title: config.seoTitle,
    description: config.seoDescription,
    url: config.canonicalUrl,
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: config.seoTitle,
    description: config.seoDescription,
    images: ['https://www.ollvy.com/logo.png'],
  },
}

export default function IndividualITRDocumentsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-5xl">
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(configFaqJsonLd) }}
        />

        {/* New intro section from config - at the very top */}
        <ToolIntroSection text={config.intro} />

        {/* CTA link after intro */}
        <ToolIntroCTA config={config} />

        {/* Header with H1 - Server Rendered */}
        <DocumentPageHeader
          h1="How to File ITR for Salaried Individuals"
          label="Personal ITR Filing"
          href="/tools/documents/individual-itr"
        />

        {/* Educational intro content */}
        <DocumentPageIntro content={individualItrContent} />

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
          categories={individualITRDocuments}
          pageTitle="Personal ITR Filing"
          pageSubtitle="Complete list of documents required to file your Individual Income Tax Return"
          ctaTitle="Ready to file your ITR?"
          ctaDescription="Just share your documents with us. Ollvy's CAs review everything, maximize your deductions, and file your return correctly."
          ctaButtonText="File My ITR"
          ctaButtonHref="/services/business-itr"
          penaltyCalcHref="/tools/penalty-calculator/itr-late-filing"
          penaltyCalcText="Calculate ITR late filing penalty"
        />

        {/* Step-by-step process */}
        <DocumentSteps content={individualItrContent} />

        {/* FAQ section */}
        <DocumentFAQSection content={individualItrContent} />

        {/* Common mistakes */}
        <DocumentCommonMistakes content={individualItrContent} />

        {/* Next steps */}
        <DocumentNextSteps content={individualItrContent} />

        {/* New FAQ section from config - at the very bottom */}
        <ToolFAQSection faqs={config.faqs} sectionNumber="07" />
      </div>
    </div>
  )
}

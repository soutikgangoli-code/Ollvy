import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentPageIntro } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { DocumentPageHeader } from '@/components/tools/DocumentPageHeader'
import { ToolIntroSection, ToolIntroCTA, ToolFAQSection } from '@/components/tools/DocumentPageToolExtensions'
import { llpDocuments } from '@/lib/data/document-checklists'
import { llpContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'
import { llpChecklistPage } from '@/lib/tools/document-checklist-pages'
import { generateToolFAQSchema } from '@/lib/tools/types'

const config = llpChecklistPage

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://www.ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'LLP Documents', item: 'https://www.ollvy.com/tools/documents/llp' },
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

const documentListJsonLd = generateDocumentListSchema(
  llpDocuments,
  'LLP Registration',
  'https://www.ollvy.com/tools/documents/llp'
)

const configFaqJsonLd = generateToolFAQSchema(config)

export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription,
  keywords: ['LLP registration', 'how to register LLP in India', 'LLP registration process', 'LLP documents', 'DPIN', 'LLP Agreement', 'FiLLiP form'],
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

export default function LLPDocumentsPage() {
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
          h1="How to Register an LLP in India"
          label="LLP Registration"
          href="/tools/documents/llp"
        />

        {/* Educational intro content */}
        <DocumentPageIntro content={llpContent} />

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
          categories={llpDocuments}
          pageTitle="LLP Registration"
          pageSubtitle="Complete list of documents required to register a Limited Liability Partnership in India"
          ctaTitle="Ready to register your LLP?"
          ctaDescription="Get started with Ollvy. We handle DSC, DPIN, name approval, LLP Agreement drafting, and all MCA filings."
          ctaButtonText="Start LLP Registration"
          ctaButtonHref="/services/llp-incorporation"
          penaltyCalcHref="/tools/penalty-calculator/mca-annual-filing"
          penaltyCalcText="Calculate MCA filing penalty"
        />

        {/* Step-by-step process */}
        <DocumentSteps content={llpContent} />

        {/* FAQ section */}
        <DocumentFAQSection content={llpContent} />

        {/* Common mistakes */}
        <DocumentCommonMistakes content={llpContent} />

        {/* Next steps */}
        <DocumentNextSteps content={llpContent} />

        {/* New FAQ section from config - at the very bottom */}
        <ToolFAQSection faqs={config.faqs} sectionNumber="07" />
      </div>
    </div>
  )
}

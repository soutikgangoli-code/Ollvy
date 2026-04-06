import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentPageIntro } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { DocumentPageHeader } from '@/components/tools/DocumentPageHeader'
import { ToolIntroSection, ToolIntroCTA, ToolFAQSection } from '@/components/tools/DocumentPageToolExtensions'
import { gstDocuments } from '@/lib/data/document-checklists'
import { gstRegistrationContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'
import { gstChecklistPage } from '@/lib/tools/document-checklist-pages'
import { generateToolFAQSchema } from '@/lib/tools/types'

const config = gstChecklistPage

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://www.ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'GST Documents', item: 'https://www.ollvy.com/tools/documents/gst-registration' },
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

const documentListJsonLd = generateDocumentListSchema(
  gstDocuments,
  'GST Registration',
  'https://www.ollvy.com/tools/documents/gst-registration'
)

const configFaqJsonLd = generateToolFAQSchema(config)

export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription,
  keywords: ['GST registration documents', 'GST documents list', 'documents for GST number', 'GST registration requirements india', 'how to register for GST', 'GSTIN documents 2025'],
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

export default function GSTDocumentsPage() {
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
          h1="How to Register for GST in India"
          label="GST Registration"
          href="/tools/documents/gst-registration"
        />

        {/* Educational intro content */}
        <DocumentPageIntro content={gstRegistrationContent} />

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
          categories={gstDocuments}
          pageTitle="GST Registration"
          pageSubtitle="Complete list of documents required to get your GSTIN in India"
          ctaTitle="Ready to get your GST number?"
          ctaDescription="Get started with Ollvy. We handle the entire GST registration process - from document verification to ARN tracking to GSTIN delivery."
          ctaButtonText="Start GST Registration"
          ctaButtonHref="/services/gst-registration"
          penaltyCalcHref="/tools/penalty-calculator/gst-late-filing"
          penaltyCalcText="Calculate GST late filing penalty"
        />

        {/* Step-by-step process */}
        <DocumentSteps content={gstRegistrationContent} />

        {/* FAQ section */}
        <DocumentFAQSection content={gstRegistrationContent} />

        {/* Common mistakes */}
        <DocumentCommonMistakes content={gstRegistrationContent} />

        {/* Next steps */}
        <DocumentNextSteps content={gstRegistrationContent} />

        {/* New FAQ section from config - at the very bottom */}
        <ToolFAQSection faqs={config.faqs} sectionNumber="07" />
      </div>
    </div>
  )
}

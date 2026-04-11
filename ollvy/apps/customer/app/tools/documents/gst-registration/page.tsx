import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentTimelineCost, DocumentEditorialIntro, DocumentWhoNeedsThis } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { DocumentPageHeader } from '@/components/tools/DocumentPageHeader'
import { ToolIntroSection, DocumentCTA, ToolFAQSection, ToolLastReviewed } from '@/components/tools/DocumentPageToolExtensions'
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

        {/* Header with H1 - Server Rendered */}
        <DocumentPageHeader
          h1="How to Register for GST in India"
          label="GST Registration"
          href="/tools/documents/gst-registration"
        />

        {/* Timeline and Government Fee bar */}
        <DocumentTimelineCost content={gstRegistrationContent} />

        {/* Document checklist - shown first for mobile usability */}
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
          hideCta
        />

        {/* Editorial intro */}
        <DocumentEditorialIntro content={gstRegistrationContent} />

        {/* Practical intro from config */}
        <ToolIntroSection text={config.intro} />

        {/* Who Needs This - section 01 */}
        <DocumentWhoNeedsThis content={gstRegistrationContent} sectionNumber="01" />

        {/* Step-by-step process - section 02 */}
        <DocumentSteps content={gstRegistrationContent} sectionNumber="02" />

        {/* FAQ section from content - section 03 */}
        <DocumentFAQSection content={gstRegistrationContent} sectionNumber="03" />

        {/* Common mistakes - section 04 */}
        <DocumentCommonMistakes content={gstRegistrationContent} sectionNumber="04" />

        {/* Next steps - section 05 */}
        <DocumentNextSteps content={gstRegistrationContent} sectionNumber="05" />

        {/* CTA Section - moved to end, before FAQs */}
        <DocumentCTA
          title="Ready to get your GST number?"
          description="Get started with Ollvy. We handle the entire GST registration process - from document verification to ARN tracking to GSTIN delivery."
          buttonText="Start GST Registration"
          buttonHref="/services/gst-registration"
          penaltyCalcHref="/tools/penalty-calculator/gst-late-filing"
          penaltyCalcText="Calculate GST late filing penalty"
        />

        {/* More FAQs from config - section 06 */}
        <ToolFAQSection faqs={config.faqs} sectionNumber="06" />

        {/* Last reviewed - at the very bottom like service pages */}
        <ToolLastReviewed lastReviewed={config.lastReviewed} sources={config.reviewSources} />
      </div>
    </div>
  )
}

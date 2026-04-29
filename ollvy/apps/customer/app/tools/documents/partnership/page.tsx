import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentTimelineCost, DocumentEditorialIntro, DocumentWhoNeedsThis } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateMergedDocFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { DocumentPageHeader } from '@/components/tools/DocumentPageHeader'
import { ToolIntroSection, DocumentCTA, ToolFAQSection, ToolLastReviewed } from '@/components/tools/DocumentPageToolExtensions'
import { partnershipDocuments } from '@/lib/data/document-checklists'
import { partnershipContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'
import { partnershipChecklistPage } from '@/lib/tools/document-checklist-pages'

const config = partnershipChecklistPage

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

const faqJsonLd = generateMergedDocFAQSchema(partnershipContent, config)

const documentListJsonLd = generateDocumentListSchema(
  partnershipDocuments,
  'Partnership Firm Registration',
  'https://www.ollvy.com/tools/documents/partnership'
)


export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription,
  keywords: ['partnership firm registration', 'how to register partnership firm', 'partnership deed', 'partnership registration process', 'partnership firm documents'],
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

export default function PartnershipDocumentsPage() {
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
        {/* Header with H1 - Server Rendered */}
        <DocumentPageHeader
          h1="How to Register a Partnership Firm"
          label="Partnership Firm"
          href="/tools/documents/partnership"
        />

        {/* Timeline and Government Fee bar */}
        <DocumentTimelineCost content={partnershipContent} />

        {/* Document checklist - shown first for mobile usability */}
        <DocumentChecklistContent
          categories={partnershipDocuments}
          pageTitle="Partnership Firm Registration"
          pageSubtitle="Complete list of documents required to register a Partnership Firm in India"
          ctaTitle="Ready to create your partnership?"
          ctaDescription="Get started with Ollvy. We draft your partnership deed, handle stamp paper, and complete firm registration if needed."
          ctaButtonText="Start Partnership Registration"
          ctaButtonHref="/services"
          hideCta
        />

        {/* Editorial intro */}
        <DocumentEditorialIntro content={partnershipContent} />

        {/* Practical intro from config */}
        <ToolIntroSection text={config.intro} />

        {/* Who Needs This - section 01 */}
        <DocumentWhoNeedsThis content={partnershipContent} sectionNumber="01" />

        {/* Step-by-step process - section 02 */}
        <DocumentSteps content={partnershipContent} sectionNumber="02" />

        {/* FAQ section from content - section 03 */}
        <DocumentFAQSection content={partnershipContent} sectionNumber="03" />

        {/* Common mistakes - section 04 */}
        <DocumentCommonMistakes content={partnershipContent} sectionNumber="04" />

        {/* Next steps - section 05 */}
        <DocumentNextSteps content={partnershipContent} sectionNumber="05" />

        {/* CTA Section - moved to end, before FAQs */}
        <DocumentCTA
          title="Ready to create your partnership?"
          description="Get started with Ollvy. We draft your partnership deed, handle stamp paper, and complete firm registration if needed."
          buttonText="Start Partnership Registration"
          buttonHref="/services"
        />

        {/* More FAQs from config - section 06 */}
        <ToolFAQSection faqs={config.faqs} sectionNumber="06" />

        {/* Last reviewed - at the very bottom like service pages */}
        <ToolLastReviewed lastReviewed={config.lastReviewed} sources={config.reviewSources} />
      </div>
    </div>
  )
}

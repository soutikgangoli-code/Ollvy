import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentTimelineCost, DocumentEditorialIntro, DocumentWhoNeedsThis } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { DocumentPageHeader } from '@/components/tools/DocumentPageHeader'
import { ToolIntroSection, DocumentCTA, ToolFAQSection, ToolLastReviewed } from '@/components/tools/DocumentPageToolExtensions'
import { businessPanDocuments } from '@/lib/data/document-checklists'
import { businessPanContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'
import { businessPanChecklistPage } from '@/lib/tools/document-checklist-pages'
import { generateToolFAQSchema } from '@/lib/tools/types'

const config = businessPanChecklistPage

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://www.ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'Business PAN Documents', item: 'https://www.ollvy.com/tools/documents/business-pan' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Get PAN for Your Company or LLP',
  description: 'Complete guide to business PAN registration process, documents required, and step-by-step instructions',
  totalTime: 'P7D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '999',
  },
  step: businessPanContent.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
}

const faqJsonLd = generateFAQSchema(businessPanContent)

const documentListJsonLd = generateDocumentListSchema(
  businessPanDocuments,
  'Business PAN Registration',
  'https://www.ollvy.com/tools/documents/business-pan'
)

const configFaqJsonLd = generateToolFAQSchema(config)

export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription,
  keywords: ['business PAN documents', 'company PAN registration', 'PAN for LLP', 'Form 49A documents', 'business PAN card requirements', 'company PAN documents 2025'],
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

export default function BusinessPanDocumentsPage() {
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
          h1="How to Get PAN for Your Company or LLP"
          label="Business PAN Registration"
          href="/tools/documents/business-pan"
        />

        {/* Timeline and Government Fee bar */}
        <DocumentTimelineCost content={businessPanContent} />

        {/* Editorial intro - describes the service/process */}
        <DocumentEditorialIntro content={businessPanContent} />

        {/* Practical intro from config */}
        <ToolIntroSection text={config.intro} />

        {/* Document checklist - CTA hidden, will be rendered separately below */}
        <DocumentChecklistContent
          categories={businessPanDocuments}
          pageTitle="Business PAN Registration"
          pageSubtitle="Complete list of documents required to register PAN for your company, LLP, or firm"
          ctaTitle="Ready to get your business PAN?"
          ctaDescription="Get started with Ollvy. We handle the entire PAN registration process - from document verification to Form 49A filing to e-PAN delivery."
          ctaButtonText="Start PAN Registration"
          ctaButtonHref="/services/business-pan"
          hideCta
        />

        {/* Who Needs This - section 01 */}
        <DocumentWhoNeedsThis content={businessPanContent} sectionNumber="01" />

        {/* Step-by-step process - section 02 */}
        <DocumentSteps content={businessPanContent} sectionNumber="02" />

        {/* FAQ section from content - section 03 */}
        <DocumentFAQSection content={businessPanContent} sectionNumber="03" />

        {/* Common mistakes - section 04 */}
        <DocumentCommonMistakes content={businessPanContent} sectionNumber="04" />

        {/* Next steps - section 05 */}
        <DocumentNextSteps content={businessPanContent} sectionNumber="05" />

        {/* CTA Section - moved to end, before FAQs */}
        <DocumentCTA
          title="Ready to get your business PAN?"
          description="Get started with Ollvy. We handle the entire PAN registration process - from document verification to Form 49A filing to e-PAN delivery."
          buttonText="Start PAN Registration"
          buttonHref="/services/business-pan"
        />

        {/* More FAQs from config - section 06 */}
        <ToolFAQSection faqs={config.faqs} sectionNumber="06" />

        {/* Last reviewed - at the very bottom like service pages */}
        <ToolLastReviewed lastReviewed={config.lastReviewed} sources={config.reviewSources} />
      </div>
    </div>
  )
}

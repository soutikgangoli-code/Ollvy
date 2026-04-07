import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentTimelineCost, DocumentEditorialIntro, DocumentWhoNeedsThis } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { DocumentPageHeader } from '@/components/tools/DocumentPageHeader'
import { ToolIntroSection, DocumentCTA, ToolFAQSection, ToolLastReviewed } from '@/components/tools/DocumentPageToolExtensions'
import { trademarkDocuments } from '@/lib/data/document-checklists'
import { trademarkContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'
import { trademarkChecklistPage } from '@/lib/tools/document-checklist-pages'
import { generateToolFAQSchema } from '@/lib/tools/types'

const config = trademarkChecklistPage

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

const configFaqJsonLd = generateToolFAQSchema(config)

export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription,
  keywords: ['trademark registration', 'how to register trademark in India', 'trademark registration process', 'trademark classes', 'brand registration', 'logo trademark'],
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

export default function TrademarkDocumentsPage() {
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
          h1="How to Register a Trademark in India"
          label="Trademark Registration"
          href="/tools/documents/trademark"
        />

        {/* Timeline and Government Fee bar */}
        <DocumentTimelineCost content={trademarkContent} />

        {/* Editorial intro - describes the service/process */}
        <DocumentEditorialIntro content={trademarkContent} />

        {/* Practical intro from config */}
        <ToolIntroSection text={config.intro} />

        {/* Document checklist - CTA hidden, will be rendered separately below */}
        <DocumentChecklistContent
          categories={trademarkDocuments}
          pageTitle="Trademark Registration"
          pageSubtitle="Complete list of documents required to register your brand or logo in India"
          ctaTitle="Ready to protect your brand?"
          ctaDescription="Ollvy handles complete trademark registration - from search to filing to monitoring. Protect your brand with experienced IP attorneys."
          ctaButtonText="Register Trademark"
          ctaButtonHref="/services/trademark-registration"
          hideCta
        />

        {/* Who Needs This - section 01 */}
        <DocumentWhoNeedsThis content={trademarkContent} sectionNumber="01" />

        {/* Step-by-step process - section 02 */}
        <DocumentSteps content={trademarkContent} sectionNumber="02" />

        {/* FAQ section from content - section 03 */}
        <DocumentFAQSection content={trademarkContent} sectionNumber="03" />

        {/* Common mistakes - section 04 */}
        <DocumentCommonMistakes content={trademarkContent} sectionNumber="04" />

        {/* Next steps - section 05 */}
        <DocumentNextSteps content={trademarkContent} sectionNumber="05" />

        {/* CTA Section - moved to end, before FAQs */}
        <DocumentCTA
          title="Ready to protect your brand?"
          description="Ollvy handles complete trademark registration - from search to filing to monitoring. Protect your brand with experienced IP attorneys."
          buttonText="Register Trademark"
          buttonHref="/services/trademark-registration"
        />

        {/* More FAQs from config - section 06 */}
        <ToolFAQSection faqs={config.faqs} sectionNumber="06" />

        {/* Last reviewed - at the very bottom like service pages */}
        <ToolLastReviewed lastReviewed={config.lastReviewed} sources={config.reviewSources} />
      </div>
    </div>
  )
}

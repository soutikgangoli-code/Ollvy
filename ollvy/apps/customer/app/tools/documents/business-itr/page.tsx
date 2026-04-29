import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentTimelineCost, DocumentEditorialIntro, DocumentWhoNeedsThis } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateMergedDocFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { DocumentPageHeader } from '@/components/tools/DocumentPageHeader'
import { ToolIntroSection, DocumentCTA, ToolFAQSection, ToolLastReviewed } from '@/components/tools/DocumentPageToolExtensions'
import { businessITRDocuments } from '@/lib/data/document-checklists'
import { businessItrContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'
import { businessItrChecklistPage } from '@/lib/tools/document-checklist-pages'

const config = businessItrChecklistPage

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://www.ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'Business ITR Documents', item: 'https://www.ollvy.com/tools/documents/business-itr' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to File ITR for Business and Professionals',
  description: 'Complete guide to business income tax return filing, documents required, and step-by-step instructions',
  totalTime: 'P7D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '1999',
  },
  step: businessItrContent.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
}

const faqJsonLd = generateMergedDocFAQSchema(businessItrContent, config)

const documentListJsonLd = generateDocumentListSchema(
  businessITRDocuments,
  'Business ITR Filing',
  'https://www.ollvy.com/tools/documents/business-itr'
)


export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription,
  keywords: ['business ITR filing', 'how to file ITR-3', 'ITR-4 filing', 'tax audit', 'presumptive taxation 44AD', 'business income tax return', 'freelancer ITR'],
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

export default function BusinessITRDocumentsPage() {
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
          h1="How to File ITR for Business"
          label="Business ITR Filing"
          href="/tools/documents/business-itr"
        />

        {/* Timeline and Government Fee bar */}
        <DocumentTimelineCost content={businessItrContent} />

        {/* Document checklist - shown first for mobile usability */}
        <DocumentChecklistContent
          categories={businessITRDocuments}
          pageTitle="Business ITR Filing"
          pageSubtitle="Complete list of documents required for Company, LLP, or Partnership tax return filing"
          ctaTitle="Need help with Business ITR?"
          ctaDescription="Ollvy handles complete business ITR filing - from audit coordination to return filing. CA assigned within 24 hours."
          ctaButtonText="File Business ITR"
          ctaButtonHref="/services/business-itr"
          penaltyCalcHref="/tools/penalty-calculator/itr-late-filing"
          penaltyCalcText="Calculate ITR late filing penalty"
          hideCta
        />

        {/* Editorial intro */}
        <DocumentEditorialIntro content={businessItrContent} />

        {/* Practical intro from config */}
        <ToolIntroSection text={config.intro} />

        {/* Who Needs This - section 01 */}
        <DocumentWhoNeedsThis content={businessItrContent} sectionNumber="01" />

        {/* Step-by-step process - section 02 */}
        <DocumentSteps content={businessItrContent} sectionNumber="02" />

        {/* FAQ section from content - section 03 */}
        <DocumentFAQSection content={businessItrContent} sectionNumber="03" />

        {/* Common mistakes - section 04 */}
        <DocumentCommonMistakes content={businessItrContent} sectionNumber="04" />

        {/* Next steps - section 05 */}
        <DocumentNextSteps content={businessItrContent} sectionNumber="05" />

        {/* CTA Section - moved to end, before FAQs */}
        <DocumentCTA
          title="Need help with Business ITR?"
          description="Ollvy handles complete business ITR filing - from audit coordination to return filing. CA assigned within 24 hours."
          buttonText="File Business ITR"
          buttonHref="/services/business-itr"
          penaltyCalcHref="/tools/penalty-calculator/itr-late-filing"
          penaltyCalcText="Calculate ITR late filing penalty"
        />

        {/* More FAQs from config - section 06 */}
        <ToolFAQSection faqs={config.faqs} sectionNumber="06" />

        {/* Last reviewed - at the very bottom like service pages */}
        <ToolLastReviewed lastReviewed={config.lastReviewed} sources={config.reviewSources} />
      </div>
    </div>
  )
}

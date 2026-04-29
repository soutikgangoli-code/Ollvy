import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentTimelineCost, DocumentEditorialIntro, DocumentWhoNeedsThis } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateMergedDocFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { DocumentPageHeader } from '@/components/tools/DocumentPageHeader'
import { ToolIntroSection, DocumentCTA, ToolFAQSection, ToolLastReviewed } from '@/components/tools/DocumentPageToolExtensions'
import { pvtLtdDocuments } from '@/lib/data/document-checklists'
import { privateLimitedContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'
import { pvtLtdChecklistPage } from '@/lib/tools/document-checklist-pages'

const config = pvtLtdChecklistPage

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://www.ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'Pvt Ltd Documents', item: 'https://www.ollvy.com/tools/documents/private-limited-company' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Register a Private Limited Company in India',
  description: 'Complete guide to private limited company registration process, documents required, and step-by-step instructions',
  totalTime: 'P15D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '6999',
  },
  step: privateLimitedContent.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
}

const faqJsonLd = generateMergedDocFAQSchema(privateLimitedContent, config)

const documentListJsonLd = generateDocumentListSchema(
  pvtLtdDocuments,
  'Private Limited Company Registration',
  'https://www.ollvy.com/tools/documents/private-limited-company'
)


export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription,
  keywords: ['private limited company registration', 'how to register pvt ltd company', 'pvt ltd registration process', 'company incorporation documents india', 'SPICe+ form'],
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

export default function PrivateLimitedDocumentsPage() {
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
          h1="Documents Required for Private Limited Company Registration"
          label="Private Limited Company"
          href="/tools/documents/private-limited-company"
        />

        {/* Timeline and Government Fee bar */}
        <DocumentTimelineCost content={privateLimitedContent} />

        {/* Document checklist - shown first for mobile usability */}
        <DocumentChecklistContent
          categories={pvtLtdDocuments}
          pageTitle="Private Limited Company Registration"
          pageSubtitle="Complete list of documents required to incorporate a Pvt Ltd company in India"
          ctaTitle="Ready to incorporate your company?"
          ctaDescription="Get started with Ollvy. We handle DSC, DIN, name approval, and all MCA filings. Most companies are incorporated within 7-10 days."
          ctaButtonText="Start Company Registration"
          ctaButtonHref="/services/pvt-ltd-incorporation"
          penaltyCalcHref="/tools/penalty-calculator/mca-annual-filing"
          penaltyCalcText="Calculate MCA filing penalty"
          hideCta
        />

        {/* Editorial intro */}
        <DocumentEditorialIntro content={privateLimitedContent} />

        {/* Practical intro from config */}
        <ToolIntroSection text={config.intro} />

        {/* Who Needs This - section 01 */}
        <DocumentWhoNeedsThis content={privateLimitedContent} sectionNumber="01" />

        {/* Step-by-step process - section 02 */}
        <DocumentSteps content={privateLimitedContent} sectionNumber="02" />

        {/* FAQ section from content - section 03 */}
        <DocumentFAQSection content={privateLimitedContent} sectionNumber="03" />

        {/* Common mistakes - section 04 */}
        <DocumentCommonMistakes content={privateLimitedContent} sectionNumber="04" />

        {/* Next steps - section 05 */}
        <DocumentNextSteps content={privateLimitedContent} sectionNumber="05" />

        {/* CTA Section - moved to end, before FAQs */}
        <DocumentCTA
          title="Ready to incorporate your company?"
          description="Get started with Ollvy. We handle DSC, DIN, name approval, and all MCA filings. Most companies are incorporated within 7-10 days."
          buttonText="Start Company Registration"
          buttonHref="/services/pvt-ltd-incorporation"
          penaltyCalcHref="/tools/penalty-calculator/mca-annual-filing"
          penaltyCalcText="Calculate MCA filing penalty"
        />

        {/* More FAQs from config - section 06 */}
        <ToolFAQSection faqs={config.faqs} sectionNumber="06" />

        {/* Last reviewed - at the very bottom like service pages */}
        <ToolLastReviewed lastReviewed={config.lastReviewed} sources={config.reviewSources} />
      </div>
    </div>
  )
}

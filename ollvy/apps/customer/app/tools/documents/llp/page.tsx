import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentTimelineCost, DocumentEditorialIntro, DocumentWhoNeedsThis } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateMergedDocFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { DocumentPageHeader } from '@/components/tools/DocumentPageHeader'
import { ToolIntroSection, DocumentCTA, ToolFAQSection, ToolLastReviewed } from '@/components/tools/DocumentPageToolExtensions'
import { llpDocuments } from '@/lib/data/document-checklists'
import { llpContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'
import { llpChecklistPage } from '@/lib/tools/document-checklist-pages'

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

const faqJsonLd = generateMergedDocFAQSchema(llpContent, config)

const documentListJsonLd = generateDocumentListSchema(
  llpDocuments,
  'LLP Registration',
  'https://www.ollvy.com/tools/documents/llp'
)


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
        {/* Header with H1 - Server Rendered */}
        <DocumentPageHeader
          h1="How to Register an LLP in India"
          label="LLP Registration"
          href="/tools/documents/llp"
        />

        {/* Timeline and Government Fee bar */}
        <DocumentTimelineCost content={llpContent} />

        {/* Document checklist - shown first for mobile usability */}
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
          hideCta
        />

        {/* Editorial intro */}
        <DocumentEditorialIntro content={llpContent} />

        {/* Practical intro from config */}
        <ToolIntroSection text={config.intro} />

        {/* Who Needs This - section 01 */}
        <DocumentWhoNeedsThis content={llpContent} sectionNumber="01" />

        {/* Step-by-step process - section 02 */}
        <DocumentSteps content={llpContent} sectionNumber="02" />

        {/* FAQ section from content - section 03 */}
        <DocumentFAQSection content={llpContent} sectionNumber="03" />

        {/* Common mistakes - section 04 */}
        <DocumentCommonMistakes content={llpContent} sectionNumber="04" />

        {/* Next steps - section 05 */}
        <DocumentNextSteps content={llpContent} sectionNumber="05" />

        {/* CTA Section - moved to end, before FAQs */}
        <DocumentCTA
          title="Ready to register your LLP?"
          description="Get started with Ollvy. We handle DSC, DPIN, name approval, LLP Agreement drafting, and all MCA filings."
          buttonText="Start LLP Registration"
          buttonHref="/services/llp-incorporation"
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

import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentTimelineCost, DocumentEditorialIntro, DocumentWhoNeedsThis } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { DocumentPageHeader } from '@/components/tools/DocumentPageHeader'
import { ToolIntroSection, DocumentCTA, ToolFAQSection, ToolLastReviewed } from '@/components/tools/DocumentPageToolExtensions'
import { soleProprietorDocuments } from '@/lib/data/document-checklists'
import { soleProprietorContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'
import { soleProprietorChecklistPage } from '@/lib/tools/document-checklist-pages'
import { generateToolFAQSchema } from '@/lib/tools/types'

const config = soleProprietorChecklistPage

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://www.ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'Sole Proprietorship Documents', item: 'https://www.ollvy.com/tools/documents/sole-proprietor' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Register a Sole Proprietorship in India',
  description: 'Complete guide to sole proprietorship registration, documents required, and step-by-step instructions',
  totalTime: 'P7D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '999',
  },
  step: soleProprietorContent.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
}

const faqJsonLd = generateFAQSchema(soleProprietorContent)

const documentListJsonLd = generateDocumentListSchema(
  soleProprietorDocuments,
  'Sole Proprietorship Registration',
  'https://www.ollvy.com/tools/documents/sole-proprietor'
)

const configFaqJsonLd = generateToolFAQSchema(config)

export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription,
  keywords: ['sole proprietorship registration', 'how to register proprietorship', 'sole proprietorship documents', 'proprietorship GST registration', 'Udyam registration'],
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

export default function SoleProprietorDocumentsPage() {
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
          h1="How to Register a Sole Proprietorship"
          label="Sole Proprietorship"
          href="/tools/documents/sole-proprietor"
        />

        {/* Timeline and Government Fee bar */}
        <DocumentTimelineCost content={soleProprietorContent} />

        {/* Editorial intro - describes the service/process */}
        <DocumentEditorialIntro content={soleProprietorContent} />

        {/* Who Needs This - section 01 */}
        <DocumentWhoNeedsThis content={soleProprietorContent} sectionNumber="01" />

        {/* Practical intro from config - right before checklist */}
        <ToolIntroSection text={config.intro} />

        {/* Document checklist header - section 02 */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] text-muted-foreground">02</span>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Documents required</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-7">
            Click on any document to see detailed requirements and how to obtain it
          </p>
        </div>

        {/* Document checklist - CTA hidden, will be rendered separately below */}
        <DocumentChecklistContent
          categories={soleProprietorDocuments}
          pageTitle="Sole Proprietorship Registration"
          pageSubtitle="Complete list of documents required to register a Sole Proprietorship in India"
          ctaTitle="Ready to register your business?"
          ctaDescription="Get started with Ollvy. We handle GST registration, Shop Act license, and all compliance for sole proprietors."
          ctaButtonText="Start GST Registration"
          ctaButtonHref="/services/gst-registration"
          hideCta
        />

        {/* Step-by-step process - section 03 */}
        <DocumentSteps content={soleProprietorContent} sectionNumber="03" />

        {/* FAQ section from content - section 04 */}
        <DocumentFAQSection content={soleProprietorContent} sectionNumber="04" />

        {/* Common mistakes - section 05 */}
        <DocumentCommonMistakes content={soleProprietorContent} sectionNumber="05" />

        {/* Next steps - section 06 */}
        <DocumentNextSteps content={soleProprietorContent} sectionNumber="06" />

        {/* CTA Section - moved to end, before FAQs */}
        <DocumentCTA
          title="Ready to register your business?"
          description="Get started with Ollvy. We handle GST registration, Shop Act license, and all compliance for sole proprietors."
          buttonText="Start GST Registration"
          buttonHref="/services/gst-registration"
        />

        {/* More FAQs from config - section 07 */}
        <ToolFAQSection faqs={config.faqs} sectionNumber="07" />

        {/* Last reviewed - at the very bottom like service pages */}
        <ToolLastReviewed lastReviewed={config.lastReviewed} sources={config.reviewSources} />
      </div>
    </div>
  )
}

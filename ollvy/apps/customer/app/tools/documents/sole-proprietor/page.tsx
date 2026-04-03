import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { DocumentPageIntro } from '@/components/tools/DocumentPageIntro'
import { DocumentSteps } from '@/components/tools/DocumentSteps'
import { DocumentFAQSection, generateFAQSchema } from '@/components/tools/DocumentFAQSection'
import { DocumentCommonMistakes } from '@/components/tools/DocumentCommonMistakes'
import { DocumentNextSteps } from '@/components/tools/DocumentNextSteps'
import { DocumentPageHeader } from '@/components/tools/DocumentPageHeader'
import { soleProprietorDocuments } from '@/lib/data/document-checklists'
import { soleProprietorContent } from '@/lib/tools/document-content'
import { generateDocumentListSchema } from '@/lib/tools/document-schemas'

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

export const metadata: Metadata = {
  title: 'How to Register Sole Proprietorship - Documents & Process | Ollvy',
  description: 'Complete guide to sole proprietorship registration in India. Step-by-step process, GST registration, Udyam, Shop Act, required documents, and FAQs answered.',
  keywords: ['sole proprietorship registration', 'how to register proprietorship', 'sole proprietorship documents', 'proprietorship GST registration', 'Udyam registration'],
  alternates: {
    canonical: 'https://www.ollvy.com/tools/documents/sole-proprietor',
  },
  openGraph: {
    title: 'How to Register Sole Proprietorship in India | Ollvy',
    description: 'Complete guide to sole proprietorship registration - process, documents, and requirements.',
    url: 'https://www.ollvy.com/tools/documents/sole-proprietor',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Register Sole Proprietorship | Ollvy',
    description: 'Complete guide to sole proprietorship registration in India.',
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

        {/* Header with H1 - Server Rendered */}
        <DocumentPageHeader
          h1="How to Register a Sole Proprietorship"
          label="Sole Proprietorship"
          href="/tools/documents/sole-proprietor"
        />

        {/* Educational intro content */}
        <DocumentPageIntro content={soleProprietorContent} />

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
          categories={soleProprietorDocuments}
          pageTitle="Sole Proprietorship Registration"
          pageSubtitle="Complete list of documents required to register a Sole Proprietorship in India"
          ctaTitle="Ready to register your business?"
          ctaDescription="Get started with Ollvy. We handle GST registration, Shop Act license, and all compliance for sole proprietors."
          ctaButtonText="Start GST Registration"
          ctaButtonHref="/services/gst-registration"
        />

        {/* Step-by-step process */}
        <DocumentSteps content={soleProprietorContent} />

        {/* FAQ section */}
        <DocumentFAQSection content={soleProprietorContent} />

        {/* Common mistakes */}
        <DocumentCommonMistakes content={soleProprietorContent} />

        {/* Next steps */}
        <DocumentNextSteps content={soleProprietorContent} />
      </div>
    </div>
  )
}

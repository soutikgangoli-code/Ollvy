import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { partnershipDocuments } from '@/lib/data/document-checklists'

export const metadata: Metadata = {
  title: 'Documents Required for Partnership Firm Registration in India | Ollvy',
  description: 'Complete checklist of documents needed to register a Partnership Firm in India. Partner identity proof, partnership deed, stamp paper, and firm registration requirements.',
  keywords: ['partnership firm documents', 'partnership deed documents', 'partnership registration india', 'partnership firm registration documents'],
}

export default function PartnershipDocumentsPage() {
  return (
    <DocumentChecklistContent
      categories={partnershipDocuments}
      ctaTitle="Ready to create your partnership?"
      ctaDescription="Get started with Ollvy. We draft your partnership deed, handle stamp paper, and complete firm registration if needed."
      ctaButtonText="Start Partnership Registration"
      ctaButtonHref="/services/partnership-registration?utm_source=tools&utm_medium=documents&utm_content=partnership"
    />
  )
}

import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { gstDocuments } from '@/lib/data/document-checklists'

export const metadata: Metadata = {
  title: 'Documents Required for Sole Proprietorship Registration in India | Ollvy',
  description: 'Complete checklist of documents needed to register a Sole Proprietorship in India. PAN, Aadhaar, address proof, bank account details for GST registration.',
  keywords: ['sole proprietorship documents', 'proprietorship registration documents', 'GST registration documents india', 'sole prop documents'],
}

export default function SoleProprietorDocumentsPage() {
  return (
    <DocumentChecklistContent
      categories={gstDocuments}
      ctaTitle="Ready to register your business?"
      ctaDescription="Get started with Ollvy. We handle GST registration, Shop Act license, and all compliance for sole proprietors."
      ctaButtonText="Start GST Registration"
      ctaButtonHref="/services/gst-registration?utm_source=tools&utm_medium=documents&utm_content=sole_prop"
    />
  )
}

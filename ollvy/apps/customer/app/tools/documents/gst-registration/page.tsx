import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { gstDocuments } from '@/lib/data/document-checklists'

export const metadata: Metadata = {
  title: 'Documents Required for GST Registration in India | Ollvy',
  description: 'Complete checklist of documents needed for GST registration in India. PAN, Aadhaar, address proof, bank statement requirements for sole proprietors and businesses.',
  keywords: ['GST registration documents', 'GST documents list', 'documents for GST number', 'GST registration requirements india'],
}

export default function GSTDocumentsPage() {
  return (
    <DocumentChecklistContent
      categories={gstDocuments}
      ctaTitle="Ready to get your GST number?"
      ctaDescription="Get started with Ollvy. We handle the entire GST registration process - from document verification to ARN tracking to GSTIN delivery."
      ctaButtonText="Start GST Registration"
      ctaButtonHref="/services/gst-registration?utm_source=tools&utm_medium=documents&utm_content=gst"
    />
  )
}

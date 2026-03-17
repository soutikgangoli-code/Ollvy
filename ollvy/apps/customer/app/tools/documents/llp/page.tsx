import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { llpDocuments } from '@/lib/data/document-checklists'

export const metadata: Metadata = {
  title: 'Documents Required for LLP Registration in India | Ollvy',
  description: 'Complete checklist of documents needed to register an LLP (Limited Liability Partnership) in India. Partner PAN, Aadhaar, DPIN, DSC, LLP Agreement requirements.',
  keywords: ['LLP registration documents', 'LLP incorporation documents india', 'designated partner documents', 'DPIN documents', 'LLP agreement'],
}

export default function LLPDocumentsPage() {
  return (
    <DocumentChecklistContent
      categories={llpDocuments}
      ctaTitle="Ready to register your LLP?"
      ctaDescription="Get started with Ollvy. We handle DSC, DPIN, name approval, LLP Agreement drafting, and all MCA filings."
      ctaButtonText="Start LLP Registration"
      ctaButtonHref="/services/llp-incorporation?utm_source=tools&utm_medium=documents&utm_content=llp"
    />
  )
}

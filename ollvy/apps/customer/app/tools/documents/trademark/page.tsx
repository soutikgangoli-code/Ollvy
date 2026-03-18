import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { trademarkDocuments } from '@/lib/data/document-checklists'

export const metadata: Metadata = {
  title: 'Documents Required for Trademark Registration India 2025 | Ollvy',
  description: 'Complete trademark registration document checklist: Form TM-A, TM-48, logo, identity proof, business entity documents. Class selection and fee guide included.',
  keywords: ['trademark documents', 'trademark registration documents india', 'brand registration documents', 'TM application documents'],
}

export default function TrademarkDocumentsPage() {
  return (
    <DocumentChecklistContent
      categories={trademarkDocuments}
      pageTitle="Trademark Registration"
      pageSubtitle="Complete list of documents required to register your brand or logo in India"
      ctaTitle="Ready to protect your brand?"
      ctaDescription="Ollvy handles complete trademark registration — from search to filing to monitoring. Protect your brand with experienced IP attorneys."
      ctaButtonText="Register Trademark"
      ctaButtonHref="/services/trademark-registration?utm_source=tools&utm_medium=documents&utm_content=trademark"
    />
  )
}

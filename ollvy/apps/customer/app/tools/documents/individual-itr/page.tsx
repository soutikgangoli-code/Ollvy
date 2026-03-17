import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { individualITRDocuments } from '@/lib/data/document-checklists'

export const metadata: Metadata = {
  title: 'Documents Required to File Individual ITR India FY 2024-25 | Ollvy',
  description: 'Complete document checklist for salaried ITR filing: Form 16, 26AS, AIS, investment proofs, capital gains documents. Free checklist with step-by-step guidance.',
  keywords: ['ITR documents', 'income tax return documents', 'Form 16', 'individual ITR filing documents', 'ITR documents checklist'],
}

export default function IndividualITRDocumentsPage() {
  return (
    <DocumentChecklistContent
      categories={individualITRDocuments}
      ctaTitle="Ready to file your ITR?"
      ctaDescription="Just share your documents with us. Ollvy's CAs review everything, maximize your deductions, and file your return correctly."
      ctaButtonText="File My ITR"
      ctaButtonHref="/services/income-tax-return?utm_source=tools&utm_medium=documents&utm_content=individual_itr"
    />
  )
}

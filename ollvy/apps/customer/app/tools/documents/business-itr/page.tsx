import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { businessITRDocuments } from '@/lib/data/document-checklists'

export const metadata: Metadata = {
  title: 'Documents for Business ITR Filing India FY 2024-25 | Ollvy',
  description: 'Full document checklist for business income tax return: audited accounts, Form 3CA/3CD, GST returns, TDS certificates — everything your CA needs.',
  keywords: ['business ITR documents', 'company ITR filing documents', 'LLP ITR documents', 'corporate tax return documents', 'tax audit documents'],
}

export default function BusinessITRDocumentsPage() {
  return (
    <DocumentChecklistContent
      categories={businessITRDocuments}
      ctaTitle="Need help with Business ITR?"
      ctaDescription="Ollvy handles complete business ITR filing — from audit coordination to return filing. CA assigned within 24 hours."
      ctaButtonText="File Business ITR"
      ctaButtonHref="/services/business-itr?utm_source=tools&utm_medium=documents&utm_content=business_itr"
    />
  )
}

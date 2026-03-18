import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { pvtLtdDocuments } from '@/lib/data/document-checklists'

export const metadata: Metadata = {
  title: 'Documents Required for Private Limited Company Registration in India | Ollvy',
  description: 'Complete checklist of documents needed to register a Private Limited Company in India. Director PAN, Aadhaar, registered office proof, DSC, DIN requirements and more.',
  keywords: ['private limited company documents', 'pvt ltd registration documents', 'company incorporation documents india', 'director documents for company registration'],
}

export default function PrivateLimitedDocumentsPage() {
  return (
    <DocumentChecklistContent
      categories={pvtLtdDocuments}
      pageTitle="Private Limited Company Registration"
      pageSubtitle="Complete list of documents required to incorporate a Pvt Ltd company in India"
      ctaTitle="Ready to incorporate your company?"
      ctaDescription="Get started with Ollvy. We handle DSC, DIN, name approval, and all MCA filings. Most companies are incorporated within 7-10 days."
      ctaButtonText="Start Company Registration"
      ctaButtonHref="/services/pvt-ltd-incorporation?utm_source=tools&utm_medium=documents&utm_content=pvt_ltd"
    />
  )
}

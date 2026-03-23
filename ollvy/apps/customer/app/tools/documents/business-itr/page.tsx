import { Metadata } from 'next'
import { DocumentChecklistContent } from '@/components/tools/DocumentChecklistContent'
import { businessITRDocuments } from '@/lib/data/document-checklists'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://ollvy.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://ollvy.com/tools/documents' },
    { '@type': 'ListItem', position: 4, name: 'Business ITR Documents', item: 'https://ollvy.com/tools/documents/business-itr' },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Gather Documents for Business ITR Filing',
  description: 'Step-by-step guide to collecting all documents required for business income tax return filing in India',
  totalTime: 'P3D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: '0',
  },
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Gather Financial Statements',
      text: 'Prepare audited Balance Sheet, Profit and Loss statement, and notes to accounts for the financial year.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Collect Tax Audit Report',
      text: 'Get Form 3CA/3CB and Form 3CD tax audit report from your auditor if turnover exceeds audit threshold.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Download Form 26AS and AIS',
      text: 'Download Form 26AS (tax credit statement) and Annual Information Statement from the income tax portal.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Compile GST Returns',
      text: 'Gather all GSTR-3B and GSTR-1 returns filed during the year for reconciliation with books.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Collect TDS Certificates',
      text: 'Collect all Form 16A certificates from clients who deducted TDS on your payments.',
    },
  ],
}

export const metadata: Metadata = {
  title: 'Documents for Business ITR Filing India FY 2024-25 | Ollvy',
  description: 'Full document checklist for business income tax return: audited accounts, Form 3CA/3CD, GST returns, TDS certificates - everything your CA needs.',
  keywords: ['business ITR documents', 'company ITR filing documents', 'LLP ITR documents', 'corporate tax return documents', 'tax audit documents'],
  alternates: {
    canonical: 'https://ollvy.com/tools/documents/business-itr',
  },
  openGraph: {
    title: 'Documents for Business ITR Filing India | Ollvy',
    description: 'Full document checklist for business income tax return filing.',
    url: 'https://ollvy.com/tools/documents/business-itr',
    images: [{ url: 'https://ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documents for Business ITR Filing | Ollvy',
    description: 'Full document checklist for business income tax return filing in India.',
    images: ['https://ollvy.com/logo.png'],
  },
}

export default function BusinessITRDocumentsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <DocumentChecklistContent
        categories={businessITRDocuments}
        pageTitle="Business ITR Filing"
        pageSubtitle="Complete list of documents required for Company, LLP, or Partnership tax return filing"
        ctaTitle="Need help with Business ITR?"
        ctaDescription="Ollvy handles complete business ITR filing - from audit coordination to return filing. CA assigned within 24 hours."
        ctaButtonText="File Business ITR"
        ctaButtonHref="/services/business-itr?utm_source=tools&utm_medium=documents&utm_content=business_itr"
      />
    </>
  )
}

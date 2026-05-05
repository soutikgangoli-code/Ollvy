import { ServiceConfig } from '../services'

// Static SERVICE_CONFIGS entry. Live /services/business-pan page is DB-driven
// (service_packages row); this stub exists so the static SERVICE_CONFIGS lookup
// in /guides/[slug]/page.tsx resolves the CTA without 404-ing the guide page.
export const businessPan: ServiceConfig = {
  slug: 'business-pan',
  name: 'Business PAN Registration',
  shortName: 'Business PAN',
  category: 'Registrations',
  tagline: 'Company PAN in 7 working days. Required before bank account, GST, or ITR.',

  ollvyFee: 999,
  govtFee: 107,
  govtFeeLabel: 'NSDL processing fee',
  govtFeeNote: 'Paid to NSDL. Rs. 107 for domestic delivery, Rs. 1,017 for international.',

  slaDays: 7,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'All companies, LLPs, partnership firms, trusts, and societies',
  legalBasis: 'Section 139A, Income Tax Act 1961',
  penaltyForMissing: 'Cannot open bank account, register for GST, or file income tax without PAN',
  penaltyColor: 'red',

  seoTitle: 'Business PAN Registration for Company, LLP and Firm | Ollvy',
  seoDescription:
    'Get your company or LLP PAN registered in 7 working days. Required for bank account opening, GST registration, and income tax filing. CA-handled, documents collected online.',
  canonicalUrl: 'https://www.ollvy.com/services/business-pan',

  processSteps: [],
  whatsIncluded: [],
  serviceRisks: [],
  profilePersonas: [],
  faqs: [],
  reviewKeywordChips: [],
  relatedSlugs: ['gst-registration', 'pvt-ltd-incorporation', 'llp-incorporation'],
  reviewSources: [],
  unlocks: [],

  showCompletionStats: false,
  showApprovalRate: false,
}

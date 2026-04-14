import { ServiceConfig } from '../services'

export const gstRevocation: ServiceConfig = {
  slug: 'gst-revocation',
  name: 'GST Revocation',
  shortName: 'GST Revoke',
  category: 'Tax Filings',
  tagline: 'GST cancelled by the department? We restore it.',

  ollvyFee: 4999,
  govtFee: undefined,

  slaDays: 30,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Businesses whose GST was cancelled by a GST officer (suo motu cancellation)',
  legalBasis: 'CGST Act 2017, Section 30',
  penaltyForMissing: 'Cannot issue GST invoices, collect ITC, or operate formally without active GSTIN',
  penaltyColor: 'red',

  seoTitle: 'GST Revocation Online India | Restore Cancelled GSTIN | ₹2,999 | Ollvy',
  seoDescription:
    'GST cancelled by officer? File all pending returns and restore your GSTIN. Fixed price ₹2,999. CA assigned same day. 90-day window - act fast.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-revocation',

  processSteps: [
    {
      step: 1,
      title: 'Review cancellation order',
      timeline: 'Day 0-1',
      body: 'Reason and date of suo-moto cancellation confirmed. Outstanding returns identified.',
      visual: 'checklist',
      milestone: 'Cancellation order reviewed',
    },
    {
      step: 2,
      title: 'File all pending returns',
      timeline: 'Day 1-5',
      body: 'All outstanding GSTR-1 and GSTR-3B filed with interest on late payment.',
      visual: 'form',
      milestone: 'Pending returns cleared',
    },
    {
      step: 3,
      title: 'REG-21 filed',
      timeline: 'Day 5-7',
      body: 'Revocation application submitted with explanation.',
      visual: 'form',
      milestone: 'Revocation application filed',
    },
    {
      step: 4,
      title: 'GST registration restored',
      timeline: 'Day 7-10',
      body: 'Officer reviews and restores registration.',
      visual: 'stamp',
      milestone: 'GSTIN active',
      isCompletion: true,
    },
  ],

  whatsIncluded: [
    {
      title: 'All pending returns filed',
      body: 'Every outstanding GSTR-1 and GSTR-3B cleared before revocation application. Interest on late payment calculated and paid.',
    },
    {
      title: 'REG-21 application',
      body: 'Revocation request with explanation of the default and confirmation that returns are now current.',
    },
    {
      title: 'Interest calculation',
      body: 'Exact interest liability on late-deposited tax calculated before filing so you know the total amount upfront.',
    },
  ],

  serviceRisks: [
    {
      icon: 'clock',
      title: '30-day deadline',
      body: 'Must apply within 30 days of cancellation order\nExtensions possible but require separate application\nAct immediately',
    },
    {
      icon: 'alert',
      title: 'All pending returns must be filed first',
      body: 'REG-21 not processed until all returns filed and taxes paid with interest',
    },
  ],

  profilePersonas: [
    {
      label: 'Missed filings for several months',
      detail: 'GST cancelled for non-filing. All returns cleared and registration restored.',
    },
    {
      label: 'Need to continue invoicing clients',
      detail: 'GSTIN required for ongoing business. We treat this as urgent.',
    },
  ],

  reviewKeywordChips: [
    '✓ GSTIN restored',
    '✓ Pending returns handled',
    '✓ Fast response',
    '✓ Officer query handled',
    '✓ Moved fast on deadline',
  ],

  relatedSlugs: ['gst-registration', 'gst-cancellation', 'gst-monthly'],

  faqs: [
    {
      category: 'General',
      q: 'Why was my GST cancelled?',
      a: 'Suo-moto cancellation is typically triggered after 6 or more consecutive months of non-filing.',
    },
    {
      category: 'General',
      q: 'What is the time limit for applying for revocation?',
      a: '30 days from the date of the cancellation order. Apply immediately - do not wait.',
    },
    {
      category: 'Process',
      q: 'Can I re-register if revocation fails?',
      a: 'If the revocation window is missed, you must file an appeal with the Appellate Authority. This is a more involved process. Acting within 30 days avoids this.',
    },
  ],

  reviewSources: [
    {
      name: 'GST Portal',
      url: 'https://cbic-gst.gov.in',
      description: 'Form REG-21 revocation filing and status tracking',
    },
    {
      name: 'CGST Act, 2017',
      url: 'https://cbic-gst.gov.in/cgst-act.html',
      description: 'Section 30: Revocation of cancellation of registration',
    },
  ],

  unlocks: [
    {
      name: 'GST Monthly Filing',
      explanation: 'Once GSTIN is restored, monthly returns are mandatory again.',
      price: 'From ₹2,999/month',
      type: 'required',
      slug: 'gst-monthly',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}

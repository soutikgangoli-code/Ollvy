import { ServiceConfig } from '../services'

export const gstCancellation: ServiceConfig = {
  slug: 'gst-cancellation',
  name: 'GST Cancellation',
  shortName: 'GST Cancel',
  category: 'Tax Filings',
  tagline: 'Close your GST registration cleanly. Pending returns filed. Certificate surrendered.',

  ollvyFee: 1999,
  govtFee: undefined,

  slaDays: 15,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Businesses closing down, falling below threshold, or restructuring',
  legalBasis: 'CGST Act 2017, Section 29',
  penaltyForMissing: 'Continued filing obligations even after stopping business',
  penaltyColor: 'amber',

  seoTitle: 'GST Cancellation Online India | Surrender GSTIN | ₹1,999 | Ollvy',
  seoDescription:
    'Cancel your GST registration online. All pending returns filed. GSTIN surrendered cleanly. Fixed price ₹1,999. CA assigned same day.',
  canonicalUrl: 'https://ollvy.com/services/gst-cancellation',

  processSteps: [
    {
      step: 1,
      title: 'Answer 4 questions - CA identifies every pending return',
      timeline: 'Day 0',
      body: 'Reason for cancellation, effective date, last filed return period, and stock held at time of cancellation. A CA is assigned within 4 hours. They pull your complete filing history from the GST portal and identify every unfiled period before doing anything else. You cannot cancel GST registration with unfiled returns - we find them all upfront.',
      visual: 'checklist',
      milestone: 'CA assigned, pending returns identified',
    },
    {
      step: 2,
      title: 'Pending returns filed - all of them',
      timeline: 'Day 1-7',
      body: 'Your CA files every unfiled GSTR-1, GSTR-3B, or annual return before submitting the cancellation application. The GST portal will reject REG-16 if any period is outstanding - there is no shortcut. If you have multiple pending periods, your CA works through them in sequence. This is within scope - not an extra charge.',
      visual: 'form',
      milestone: 'All pending GST returns filed',
    },
    {
      step: 3,
      title: 'Cancellation application filed (REG-16)',
      timeline: 'Day 7-10',
      body: 'With all returns clear, your CA files Form GST REG-16 on the portal. An ARN is generated immediately. The GST officer has 30 days by law to process it - most cases are cleared within 15 working days. We track it daily.',
      visual: 'form',
      milestone: 'REG-16 submitted, ARN generated',
    },
    {
      step: 4,
      title: 'Officer query handled if raised',
      timeline: 'Day 10-15 (if applicable)',
      body: 'GST officers sometimes request clarification on the reason for cancellation or ask for additional documents. Your CA responds within 24 hours. Common queries: ITC reversal calculation, stock valuation, address proof. All handled within scope.',
      visual: 'form',
    },
    {
      step: 5,
      title: 'Cancellation order issued + GSTR-10 filed',
      timeline: 'Day 15',
      body: 'The officer issues Form GST REG-19 confirming your GSTIN is cancelled from the effective date. Your CA also files GSTR-10 - the mandatory final return that must be filed within 3 months of cancellation. Missing GSTR-10 attracts ₹200/day penalty. We file it before we close the order.',
      visual: 'stamp',
      isCompletion: true,
      milestone: 'GSTIN cancelled, REG-19 and GSTR-10 delivered',
    },
  ],

  whatsIncluded: [
    {
      title: 'Pending returns identified and filed - within scope',
      body: 'Before filing cancellation, your CA checks every period going back to your registration date. Unfiled returns are filed in sequence. This is included - not a separate charge. The number of pending periods affects the timeline but not the price.',
      comparisonWithout: 'File REG-16 without clearing returns - portal rejects it - back to square one',
      comparisonWithOllvy: 'CA clears all pending returns first - REG-16 accepted first time',
    },
    {
      title: 'GSTR-10 final return filed',
      body: 'Every cancelled GST registrant must file GSTR-10 within 3 months of cancellation. Missing it attracts ₹200/day penalty. Your CA files GSTR-10 as part of this service - you do not have to track another deadline.',
    },
    {
      title: 'ITC reversal calculated and handled',
      body: 'If you hold stock at the time of cancellation, you must reverse the Input Tax Credit claimed on it. Your CA calculates the exact reversal amount, includes it in the final return, and advises on payment. This is a tax liability you cannot avoid - but it must be calculated correctly.',
    },
    {
      title: 'REG-19 cancellation order delivered to your account',
      body: 'The official cancellation order is uploaded to your Ollvy account permanently. Keep it. Banks, vendors, and future registrations will ask for proof that your GSTIN was properly surrendered.',
    },
  ],

  serviceRisks: [
    {
      icon: 'alert',
      title: 'Pending returns will block your cancellation',
      body: 'The single most common reason cancellations fail or get delayed. The GST portal checks filing history automatically when you submit REG-16. One unfiled month = rejection. Your CA clears everything first.',
    },
    {
      icon: 'clock',
      title: 'GSTR-10 attracts ₹200/day if missed',
      body: 'After cancellation, most businesses forget about GSTR-10. It is due within 3 months of the cancellation order. Late filing: ₹200/day. Your CA files it before closing the order.',
    },
    {
      icon: 'document',
      title: 'ITC on stock must be reversed',
      body: 'Any Input Tax Credit on goods held on the cancellation date must be paid back. No exception. Your CA calculates the exact amount from your questionnaire answers and handles the reversal in the final return.',
    },
  ],

  profilePersonas: [
    {
      label: 'Business is closing',
      detail: 'Shutting down completely. We cancel GST, file all pending returns, and deliver clean closure documents.',
    },
    {
      label: 'Turnover fell below threshold',
      detail: 'No longer required to be registered. We close the registration cleanly with no loose ends.',
    },
    {
      label: 'Restructuring to a new entity',
      detail: 'Closing old GST registration before opening a fresh one under the new structure.',
    },
    {
      label: 'Voluntary registration no longer needed',
      detail: 'Registered voluntarily but the business no longer needs to issue GST invoices.',
    },
  ],

  reviewKeywordChips: [
    '✓ Clean cancellation',
    '✓ Pending returns handled',
    '✓ Fast closure',
    '✓ No hidden charges',
    '✓ GSTR-10 filed',
  ],

  relatedSlugs: ['gst-registration', 'gst-revocation', 'business-itr'],

  faqs: [
    {
      category: 'General',
      q: 'Can I cancel GST registration myself?',
      a: "Yes - but you must clear all pending returns first, and GSTR-10 must be filed within 3 months of cancellation. Missing either step creates penalties that exceed the cost of this service. We handle both.",
    },
    {
      category: 'General',
      q: 'How long does GST cancellation take?',
      a: 'The officer has 30 days by law to process REG-16. In practice, most cases are cleared in 10-15 working days. Pending returns add time at the front of the process - the more periods outstanding, the longer it takes.',
    },
    {
      category: 'Process',
      q: 'What is GSTR-10 and why is it mandatory?',
      a: 'GSTR-10 is the final return that every GST registrant must file within 3 months of the cancellation order. It declares your final stock, ITC reversal, and outstanding tax. Late filing attracts ₹200/day. Your CA files it as part of this service.',
    },
    {
      category: 'Process',
      q: 'What if I have 12+ months of pending returns?',
      a: 'Your CA files them all - it is within scope. The timeline will be longer (potentially 3-4 weeks), but the price does not change. We tell you upfront how many periods are outstanding after the initial assessment.',
    },
    {
      category: 'Process',
      q: 'Can I cancel if I have outstanding tax liability?',
      a: 'You must clear all outstanding tax before cancellation can be processed. If you have liability, your CA will calculate it and advise on payment before proceeding.',
    },
    {
      category: 'Documents',
      q: 'What documents do I need?',
      a: 'Your GST certificate (REG-06), PAN card, and a list of stock held on the cancellation date (if any). Your CA downloads the rest from the GST portal directly.',
    },
  ],

  reviewSources: [
    {
      name: 'GST Portal',
      url: 'https://www.gst.gov.in',
      description: 'Form REG-16 filing and cancellation tracking',
    },
    {
      name: 'CGST Act, 2017',
      url: 'https://cbic-gst.gov.in/cgst-act.html',
      description: 'Section 29: Cancellation of registration. Section 45: Final return.',
    },
  ],

  unlocks: [],

  showCompletionStats: false,
  showApprovalRate: false,
}

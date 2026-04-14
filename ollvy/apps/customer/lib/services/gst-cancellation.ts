import { ServiceConfig } from '../services'

export const gstCancellation: ServiceConfig = {
  slug: 'gst-cancellation',
  name: 'GST Cancellation',
  shortName: 'GST Cancel',
  category: 'Tax Filings',
  tagline: 'Close your GST registration properly. Final return filed.',

  ollvyFee: 2999,
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
  canonicalUrl: 'https://www.ollvy.com/services/gst-cancellation',

  processSteps: [
    {
      step: 1,
      title: 'ITC and liability review',
      timeline: 'Day 0-2',
      body: 'Remaining ITC balance and pending tax liabilities reviewed. ITC on closing stock must be reversed.',
      visual: 'checklist',
      milestone: 'Liability position confirmed',
    },
    {
      step: 2,
      title: 'GSTR-10 prepared',
      timeline: 'Day 2-5',
      body: 'Final return prepared with closing stock details and ITC reversal calculation.',
      visual: 'form',
      milestone: 'Final return ready',
    },
    {
      step: 3,
      title: 'REG-16 and GSTR-10 filed',
      timeline: 'Day 5-10',
      body: 'Cancellation application and final return filed simultaneously.',
      visual: 'form',
      milestone: 'Cancellation filed',
    },
    {
      step: 4,
      title: 'Cancellation order received',
      timeline: 'Day 10-15',
      body: 'GST officer reviews and issues the cancellation order.',
      visual: 'stamp',
      milestone: 'GST registration cancelled',
      isCompletion: true,
    },
  ],

  whatsIncluded: [
    {
      title: 'Final return GSTR-10',
      body: 'Closing stock details, ITC reversal calculation, and final return prepared and filed.',
    },
    {
      title: 'REG-16 filing',
      body: 'Cancellation application with reason and supporting details.',
    },
    {
      title: 'ITC reversal handled',
      body: 'Remaining ITC on closing stock reversed correctly - prevents demand notices after cancellation.',
    },
  ],

  serviceRisks: [
    {
      icon: 'alert',
      title: 'ITC reversal is mandatory',
      body: 'ITC on goods in stock at cancellation must be reversed or paid back\nCalculated before filing',
    },
    {
      icon: 'document',
      title: 'Pending returns must be cleared first',
      body: 'All outstanding GSTR-1 and GSTR-3B must be filed first\nCancellation cannot be processed otherwise',
    },
  ],

  profilePersonas: [
    {
      label: 'Closing business',
      detail: 'Winding down operations. Full clean-up handled.',
    },
    {
      label: 'Below threshold',
      detail: 'Turnover dropped below Rs 40 lakh and you no longer need to be registered.',
    },
    {
      label: 'Switching to composition scheme',
      detail: 'Cancelling regular registration before registering as composition dealer.',
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
      q: 'What happens to my remaining ITC balance?',
      a: 'ITC on closing stock must be reversed and paid back to the government. We calculate this before filing.',
    },
    {
      category: 'General',
      q: 'Can I re-register for GST later?',
      a: 'Yes. A fresh registration application can be filed if your turnover crosses the threshold again.',
    },
    {
      category: 'Process',
      q: 'How long does cancellation take?',
      a: '15 working days from application to cancellation order, assuming no pending returns or outstanding liabilities.',
    },
    {
      category: 'Process',
      q: 'What if I have pending returns?',
      a: 'All pending GSTR-1 and GSTR-3B must be filed before we can file the cancellation application. We file those first.',
    },
  ],

  reviewSources: [
    {
      name: 'GST Portal',
      url: 'https://cbic-gst.gov.in',
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

import { ServiceConfig } from '../services'

export const dinReactivation: ServiceConfig = {
  slug: 'din-reactivation',
  name: 'DIN Reactivation',
  shortName: 'DIN Reactivation',
  category: 'Registrations',
  tagline: 'DIN deactivated? We restore it.',

  ollvyFee: 3499,
  govtFee: 5000,
  govtFeeLabel: 'MCA late filing fee',
  govtFeeNote: 'The ₹500 late fee is charged by MCA for filing DIR-3 KYC after Sep 30. This is the government fee - passed through at cost, no markup.',

  slaDays: 3,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Directors whose DIN has been deactivated due to non-filing of DIR-3 KYC',
  legalBasis: 'Companies (Appointment and Qualification of Directors) Rules, 2014 - Rule 12A',
  penaltyForMissing: '₹5,000/day continues until filed. All company filings blocked.',
  penaltyColor: 'red',

  seoTitle: 'DIN Reactivation India | DIR-3 KYC Late Filing | ₹1,999 | Ollvy',
  seoDescription:
    'DIN deactivated? File DIR-3 KYC with late fee and reactivate your DIN in 3 working days. Fixed price ₹1,999. CS assigned within 2 hours.',
  canonicalUrl: 'https://www.ollvy.com/services/din-reactivation',

  processSteps: [
    {
      step: 1,
      title: 'Check reason for deactivation',
      timeline: 'Day 0-1',
      body: 'DIN status verified on MCA21. Years of outstanding KYC identified.',
      visual: 'checklist',
      milestone: 'Deactivation reason confirmed',
    },
    {
      step: 2,
      title: 'File all pending DIR-3 KYC',
      timeline: 'Day 1-5',
      body: 'DIR-3 KYC filed for all outstanding years with OTP verification. Rs 5,000 late fee applies per missed year.',
      visual: 'form',
      milestone: 'All KYC filings cleared',
    },
    {
      step: 3,
      title: 'DIR-3C reactivation application',
      timeline: 'Day 5-7',
      body: 'Reactivation form filed with explanation and payment.',
      visual: 'form',
      milestone: 'Reactivation application submitted',
    },
    {
      step: 4,
      title: 'DIN reactivated',
      timeline: 'Day 7-10',
      body: 'DIN status changed to Active on MCA21.',
      visual: 'stamp',
      milestone: 'DIN active, all directorships restored',
      isCompletion: true,
    },
  ],

  whatsIncluded: [
    {
      title: 'All outstanding DIR-3 KYC filed',
      body: 'Every year of missed KYC cleared. OTP verification coordinated in real time.',
    },
    {
      title: 'DIR-3C application',
      body: 'Reactivation form with explanation submitted to MCA.',
    },
    {
      title: 'DIN fully restored',
      body: 'All directorial rights, signing authority, and MCA filing access restored across all companies.',
    },
  ],

  serviceRisks: [
    {
      icon: 'clock',
      title: 'Rs 5,000 per missed year',
      body: '₹5,000 govt fee per missed year — mandatory, non-negotiable\nMultiple missed years = multiple fees',
    },
    {
      icon: 'building',
      title: 'All companies blocked until DIN is active',
      body: 'Every company where you are director is blocked from MCA filings\nImpact not limited to one company',
    },
  ],

  profilePersonas: [
    {
      label: 'Missed DIR-3 KYC',
      detail: 'DIN deactivated for one or more years of missed KYC. Act before the company\'s filing deadlines pass.',
    },
    {
      label: 'Multiple directorships',
      detail: 'One DIN reactivation covers all companies. We verify all directorships are unblocked.',
    },
  ],

  reviewKeywordChips: [
    '✓ DIN reactivated same day',
    '✓ Penalty stopped immediately',
    '✓ OTP handled smoothly',
    '✓ All companies unblocked',
    '✓ CS was available instantly',
  ],

  relatedSlugs: ['director-kyc', 'mca-annual-filing', 'pvt-ltd-incorporation'],

  faqs: [
    {
      category: 'General',
      q: 'Why was my DIN deactivated?',
      a: 'Deactivated when DIR-3 KYC is not filed by September 30 each year. Automated by MCA from October 1.',
    },
    {
      category: 'General',
      q: 'What is the late fee?',
      a: 'Rs 5,000 per year of missed DIR-3 KYC. This is a government fee and is fixed.',
    },
    {
      category: 'Process',
      q: 'How long does reactivation take?',
      a: '10 working days from when we receive your documents.',
    },
    {
      category: 'Process',
      q: 'Does reactivation fix the issue for all companies where I am a director?',
      a: 'Yes. Your DIN is a single identifier. Reactivating it restores your status across all directorships.',
    },
  ],

  reviewSources: [
    {
      name: 'MCA21 Portal',
      url: 'https://www.mca.gov.in',
      description: 'DIR-3 KYC filing and DIN status verification',
    },
    {
      name: 'Companies (Appointment and Qualification of Directors) Rules, 2014',
      url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html',
      description: 'Rule 12A: Annual KYC requirement and reactivation process',
    },
  ],

  unlocks: [],

  showCompletionStats: false,
  showApprovalRate: false,
}

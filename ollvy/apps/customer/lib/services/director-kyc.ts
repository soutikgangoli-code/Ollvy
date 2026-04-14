import { ServiceConfig } from '../services'

export const directorKyc: ServiceConfig = {
  slug: 'director-kyc',
  name: 'Director KYC (DIR-3 KYC)',
  shortName: 'Director KYC',
  category: 'Registrations',
  tagline: 'Annual filing. ₹5,000/day penalty if missed. Takes 15 minutes.',

  ollvyFee: 3999,
  govtFee: undefined,

  slaDays: 2,
  isRetainer: false,
  serviceType: 'Annual',
  mandatoryFor: 'All directors of Indian companies',
  legalBasis: 'Companies (Appointment and Qualification of Directors) Rules, 2014',
  penaltyForMissing: '₹5,000/day until filed',
  penaltyColor: 'red',

  seoTitle: 'Director KYC 2025 | DIR-3 KYC Filing | ₹1,499 | Ollvy',
  seoDescription:
    'File DIR-3 KYC before Sep 30. Avoid DIN deactivation and ₹5,000/day penalty. Fixed price ₹1,499 per director. Filed within 2 working days.',
  canonicalUrl: 'https://www.ollvy.com/services/director-kyc',

  processSteps: [
    {
      step: 1,
      title: 'Upload PAN and Aadhaar',
      timeline: 'Day 0',
      body: "Two documents — that's it\nCS assigned within 4 hours\nDIN status checked on MCA portal\nIf DIN already deactivated, you're told upfront",
      visual: 'upload',
      milestone: 'Documents received, DIN status checked',
    },
    {
      step: 2,
      title: 'CS files DIR-3 KYC',
      timeline: 'Day 1',
      body: "DIR-3 KYC form filled on MCA21\nOTP sent to registered mobile and email — you approve\n~10 minutes of your time",
      visual: 'form',
      milestone: 'DIR-3 KYC submitted to MCA',
    },
    {
      step: 3,
      title: 'Acknowledgement delivered',
      timeline: 'Day 1-2',
      body: "MCA processes within 24 hours\nAcknowledgement uploaded to your account\nDeactivated DIN → reactivated\nCompliance calendar updated with next Sep 30 deadline",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'DIN verified and active',
    },
  ],

  whatsIncluded: [
    {
      title: 'DIN status check before filing',
      body: "Before we file, your CS checks your DIN status on MCA21. If it's already deactivated, we tell you upfront. The filing process is the same, but you know where you stand.",
      mockVisualType: 'status',
      mockVisualData: {
        row1: 'DIN: 08765432',
        row2: 'Status: Active ✓',
        row3: 'Last KYC: 15 Sep 2024',
      },
    },
    {
      title: 'OTP verification handled live',
      body: "DIR-3 KYC requires OTP verification on your registered mobile and email. Your CS coordinates this with you in real-time - they file, you receive OTP, you share, they submit. Takes 10 minutes.",
    },
    {
      title: 'Next year reminder added automatically',
      body: "The moment we file, next year's Sep 30 deadline is added to your compliance calendar. You'll get reminders at 30d, 7d, and 1d before. You won't forget again.",
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'DIR-3 KYC - Due Sep 30, 2026',
        row2: 'Reminder: Aug 31, 2026',
        row3: 'Status: Scheduled',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'clock',
      title: '₹5,000/day penalty - starts immediately',
      body: "Penalty starts Oct 1 — ₹91,000 per director by Dec 31\nMultiple directors multiply this\nDIN deactivated, all company filings blocked",
    },
    {
      icon: 'building',
      title: 'All MCA filings blocked',
      body: "Deactivated DIN blocks: annual returns, director changes, share transfers\nEverything stops until KYC is filed",
    },
  ],

  profilePersonas: [
    {
      label: 'Filing on time',
      detail: 'Sep 30 is coming up. We file it in 2 days. Done.',
    },
    {
      label: 'Already missed deadline',
      detail: "DIN may be deactivated. We file immediately to stop the penalty clock.",
    },
    {
      label: 'Multiple directorships',
      detail: 'One KYC covers all directorships. We verify all your DINs.',
    },
    {
      label: 'First time as director',
      detail: "New to this. We explain why it's needed and handle everything.",
    },
  ],

  reviewKeywordChips: [
    '✓ Done in 1 day',
    '✓ Simple process',
    '✓ CS was responsive',
    '✓ DIN reactivated',
    '✓ Reminder added',
  ],

  relatedSlugs: ['mca-annual-filing', 'pvt-ltd-incorporation', 'business-itr'],

  faqs: [
    {
      category: 'General',
      q: 'What is DIR-3 KYC?',
      a: "DIR-3 KYC is an annual verification that every director of an Indian company must file with MCA. It confirms your PAN, Aadhaar, and contact details are current. It's due every Sep 30.",
    },
    {
      category: 'General',
      q: 'Why is this required every year?',
      a: "MCA wants to verify that directors are real people with valid IDs. It's a fraud prevention measure. Before this rule, shell companies used fake directors.",
    },
    {
      category: 'Process',
      q: 'What happens if I miss Sep 30?',
      a: "Your DIN is deactivated on Oct 1. You can't sign any MCA documents. Penalty of ₹5,000/day starts accruing. The only way to stop it is to file the KYC.",
    },
    {
      category: 'Process',
      q: 'If my DIN is deactivated, can I still file?',
      a: "Yes. File the DIR-3 KYC, pay the penalty (calculated by MCA), and your DIN is reactivated within 24-48 hours. We handle the entire process.",
    },
    {
      category: 'Documents',
      q: 'What documents do I need?',
      a: "PAN card and Aadhaar card. That's it. You also need access to the mobile number linked to your Aadhaar for OTP verification.",
    },
  ],

  reviewSources: [
    {
      name: 'MCA21 Portal',
      url: 'https://www.mca.gov.in',
      description: 'DIR-3 KYC filing and DIN verification',
    },
    {
      name: 'Companies (Appointment and Qualification of Directors) Rules, 2014',
      url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html',
      description: 'Rule 12A: Annual KYC requirement for directors',
    },
  ],

  unlocks: [],

  showCompletionStats: false,
  showApprovalRate: false,
}

import { ServiceConfig } from '../services'

export const directorKyc: ServiceConfig = {
  slug: 'director-kyc',
  name: 'Director KYC (DIR-3 KYC)',
  shortName: 'Director KYC',
  category: 'Registrations',
  tagline: 'Triennial filing (every 3 years). Rs 5,000 penalty if missed. Takes 15 minutes.',

  ollvyFee: 999,
  govtFee: undefined,
  mrp: 3500,

  slaDays: 2,
  isRetainer: false,
  serviceType: 'Triennial',
  mandatoryFor: 'All directors of Indian companies',
  legalBasis: 'Companies (Appointment and Qualification of Directors) Rules, 2014',
  penaltyForMissing: 'Rs 5,000 per director for late filing',
  penaltyColor: 'red',

  seoTitle: 'Director KYC 2026 | DIR-3 KYC Web Filing | Rs 999 | Ollvy',
  seoDescription:
    'Director KYC now triennial. Next due Jun 30, 2028. Missed the last deadline? Rs 5,000 penalty per director. Ollvy files DIR-3 KYC Web in 2 working days. Rs 999 per director.',
  canonicalUrl: 'https://www.ollvy.com/services/director-kyc',

  processSteps: [
    {
      step: 1,
      title: 'Upload PAN and Aadhaar',
      timeline: 'Day 0',
      body: "Two documents. That's it\nCS assigned within 4 hours\nDIN status checked on MCA portal\nIf DIN already deactivated, you're told upfront",
      visual: 'upload',
      milestone: 'Documents received, DIN status checked',
    },
    {
      step: 2,
      title: 'Ollvy CS files DIR-3 KYC Web',
      timeline: 'Day 1',
      body: "DIR-3 KYC Web form filed on MCA21\nOTP sent to registered mobile and email. You approve\n10 minutes of your time",
      visual: 'form',
      milestone: 'DIR-3 KYC submitted to MCA',
    },
    {
      step: 3,
      title: 'Acknowledgement delivered',
      timeline: 'Day 1-2',
      body: "MCA processes within 24 hours\nAcknowledgement uploaded to your account\nDeactivated DIN reactivated\nCompliance calendar updated with next triennial deadline (Jun 30, 2028)",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'DIN verified and active',
    },
  ],

  whatsIncluded: [
    {
      title: 'DIN status check before filing',
      body: "DIN status checked on MCA21 before filing\nIf it's already deactivated, you know upfront",
      mockVisualType: 'status',
      mockVisualData: {
        row1: 'DIN: 08765432',
        row2: 'Status: Active ✓',
        row3: 'Last KYC: 15 Sep 2024',
      },
    },
    {
      title: 'OTP verification handled live',
      body: "OTP verification on your registered mobile and email\nCS coordinates live. They file, you approve the OTP. About 10 minutes",
    },
    {
      title: 'Next triennial deadline added automatically',
      body: "Next filing deadline (Jun 30, 2028) auto-added to your compliance calendar\nReminders at 30 days, 7 days, and 1 day before",
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'DIR-3 KYC - Due Jun 30, 2028',
        row2: 'Reminder: May 31, 2028',
        row3: 'Status: Scheduled',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'clock',
      title: 'Rs 5,000 flat penalty per director',
      body: "Rs 5,000 per director for late filing (flat fee, not per day)\n3 directors = Rs 15,000\nDIN deactivated, all company filings blocked until filed",
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
      detail: 'Next triennial filing due Jun 30, 2028. Ollvy files in 2 days.',
    },
    {
      label: 'Already missed deadline',
      detail: "DIN may be deactivated. Ollvy files immediately. Rs 5,000 MCA penalty applies.",
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
      a: "DIR-3 KYC is a triennial verification (every 3 years) that every director of an Indian company must file with MCA. It confirms your PAN, Aadhaar, and contact details are current. Next due date is Jun 30, 2028. Only DIR-3 KYC Web is permitted - the e-Form has been discontinued.",
    },
    {
      category: 'General',
      q: 'How often is Director KYC required?',
      a: "MCA changed Director KYC from annual to triennial (every 3 years) effective March 31, 2026. If you filed by Sep 30, 2025, next filing is Jun 30, 2028. Changes to mobile, email, or residential address still require filing DIR-3 KYC Web within 30 days.",
    },
    {
      category: 'Process',
      q: 'What happens if I miss the deadline?',
      a: "Your DIN is deactivated by MCA. You cannot sign any MCA documents. Penalty of Rs 5,000 per director (flat fee, not per day). The only way to restore it is to file DIR-3 KYC Web with the late fee.",
    },
    {
      category: 'Process',
      q: 'If my DIN is deactivated, can I still file?',
      a: "Yes. File DIR-3 KYC Web, pay the Rs 5,000 penalty, and your DIN is reactivated within 24-48 hours. Ollvy handles the entire process.",
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
      description: 'Rule 12A: Triennial KYC requirement for directors (amended Dec 2025)',
    },
  ],

  unlocks: [],

  showCompletionStats: false,
  showApprovalRate: false,
}

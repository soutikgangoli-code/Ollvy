import { ServiceConfig } from '../services'

export const dinReactivation: ServiceConfig = {
  slug: 'din-reactivation',
  name: 'DIN Reactivation',
  shortName: 'DIN Reactivation',
  category: 'Registrations',
  tagline: 'DIN deactivated? File DIR-3 KYC and restore it within 3 working days.',

  ollvyFee: 1499,
  govtFee: 500,
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
  canonicalUrl: 'https://ollvy.com/services/din-reactivation',

  processSteps: [
    {
      step: 1,
      title: 'Share your DIN and documents - CS checks status immediately',
      timeline: 'Day 0',
      body: "Your DIN number, PAN card, Aadhaar card, and mobile number linked to Aadhaar. A company secretary is assigned within 2 hours. They verify your DIN status on MCA21 and confirm the deactivation date. The ₹5,000/day penalty stops the moment DIR-3 KYC is filed - every hour you wait adds to the accumulated liability.",
      visual: 'upload',
      milestone: 'CS assigned, DIN status and penalty calculated',
    },
    {
      step: 2,
      title: 'DIR-3 KYC filed with late fee - OTP in real time',
      timeline: 'Day 1',
      body: "Your CS fills DIR-3 KYC on MCA21 and triggers OTP verification. OTP is sent to the mobile number linked to your Aadhaar. You share it with your CS. Form is submitted. The ₹500 late fee is paid to MCA as part of the filing. This step takes about 10 minutes of your time. The penalty clock stops the moment the form is submitted.",
      visual: 'form',
      milestone: 'DIR-3 KYC submitted to MCA, penalty clock stopped',
    },
    {
      step: 3,
      title: 'DIN reactivated',
      timeline: 'Day 1-3',
      body: "MCA processes DIR-3 KYC within 24-72 hours. DIN status changes to Active on MCA21. If you hold directorships in multiple companies, all are restored by one filing. The DIR-3 KYC acknowledgement is uploaded to your Ollvy account. Your compliance calendar is updated with next year's Sep 30 deadline.",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'DIN active on MCA21, all directorships restored',
    },
  ],

  whatsIncluded: [
    {
      title: 'Penalty clock stops on Day 1',
      body: "The ₹5,000/day penalty stops accumulating the moment DIR-3 KYC is submitted - not when MCA processes it, not when the DIN is confirmed active. Submitted = stopped. Your CS files on Day 1.",
      mockVisualType: 'status',
      mockVisualData: {
        row1: 'DIN: 08765432',
        row2: 'Status: Deactivated',
        row3: 'Penalty accrued: ₹4,35,000 (87 days)',
        note: 'Filing today stops the clock immediately',
      },
    },
    {
      title: 'OTP verification coordinated live',
      body: "DIR-3 KYC requires Aadhaar OTP. Your CS coordinates the verification in real time - they file, OTP arrives on your phone, you share it, they submit. Takes 10 minutes. You need to be available for this step.",
    },
    {
      title: 'All directorships restored - one filing',
      body: "DIR-3 KYC is tied to your DIN, not to any specific company. Filing once restores your DIN across every company where you are a director. All blocked MCA filings for all those companies are unblocked simultaneously.",
    },
    {
      title: 'Compliance calendar updated - Sep 30 reminder set',
      body: "The moment we file, next year's Sep 30 deadline is added to your compliance calendar with automated reminders. You will not miss it again.",
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
      title: '₹5,000/day penalty is accumulating right now',
      body: "Every day of delay adds ₹5,000 to your accumulated liability. By day 90, that is ₹4,50,000. The accumulated penalty does not disappear when you file - it is a liability that may need to be paid separately. Filing today stops it from growing further.",
    },
    {
      icon: 'building',
      title: 'Every company you direct is affected',
      body: "A deactivated DIN blocks all MCA filings for every company where you hold a directorship. Annual returns, share transfers, director changes, address changes - everything is frozen until your DIN is restored.",
    },
    {
      icon: 'alert',
      title: 'This is for DIR-3 KYC deactivation only',
      body: "This service reactivates DINs deactivated for non-filing of annual DIR-3 KYC. If your DIN was deactivated under Section 164 (director disqualification), that is a different process requiring legal intervention. Contact us before ordering if you are unsure which applies.",
    },
  ],

  profilePersonas: [
    {
      label: 'Missed the Sep 30 deadline',
      detail: "DIN deactivated on Oct 1. ₹5,000/day running. CS files the same day - penalty stops today.",
    },
    {
      label: 'Penalty has been accumulating for months',
      detail: "DIN inactive for a long time. We file immediately to stop further accumulation. The accumulated amount is a separate liability.",
    },
    {
      label: 'Multiple directorships blocked',
      detail: "Director in 3+ companies. All their MCA filings are frozen. One DIR-3 KYC filing restores all.",
    },
    {
      label: "Did not know the DIN was deactivated",
      detail: "Found out when trying to sign an annual return. We verify DIN status first and file the same day.",
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
      a: "MCA deactivates DINs on Oct 1 every year for every director who did not file DIR-3 KYC by Sep 30. It is an automatic process - not a targeted action against you.",
    },
    {
      category: 'General',
      q: 'What is the late fee?',
      a: "MCA charges ₹500 as the late filing fee for DIR-3 KYC filed after Sep 30. This is separate from the ₹5,000/day penalty that was accumulating. The late fee is the government's charge for processing the late filing - we pass it through at cost.",
    },
    {
      category: 'Process',
      q: 'How long does reactivation take after filing?',
      a: "MCA confirms reactivation within 24-72 hours of submission. Most cases are confirmed within 1 working day. The DIN is not immediately active the moment we file - MCA must process it.",
    },
    {
      category: 'Process',
      q: 'Does filing stop the ₹5,000/day penalty immediately?',
      a: "Yes - the penalty stops accruing from the date of DIR-3 KYC submission, not from the date MCA confirms processing. We share the submission acknowledgement immediately so you have proof of the stop date.",
    },
    {
      category: 'Process',
      q: 'Does this cover Section 164 disqualification?',
      a: "No. Section 164 disqualification (for not filing annual returns for 3 consecutive years) is a legal matter that requires an application to the NCLT. This service only covers DIN deactivation from non-filing of DIR-3 KYC. Contact us before ordering if you are unsure which applies to you.",
    },
    {
      category: 'Documents',
      q: 'What do I need?',
      a: "PAN card, Aadhaar card, and the mobile number linked to your Aadhaar. You must be available for OTP verification during the filing session - it takes 10 minutes.",
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

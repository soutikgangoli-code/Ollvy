// lib/guides/pages/director-kyc-2026.ts
import { LearnPageConfig } from '../pages';

export const directorKYC2026: LearnPageConfig = {
  slug: 'director-kyc-2026',
  title: 'Director KYC 2026: New Triennial Filing Rules',
  seoTitle: 'Director KYC 2026 - New 3-Year Filing Rule | Due June 30, 2028 | Ollvy',
  seoDescription:
    'Director KYC filing rules have changed to triennial (every 3 years) from FY2025-26. Last annual filing was September 30, 2025. Next due date is June 30, 2028. Understand the new DIR-3 KYC requirements.',
  canonicalUrl: 'https://www.ollvy.com/guides/director-kyc-2026',
  lastReviewed: 'April 2026',
  category: 'ROC Filing',
  ctaServiceSlug: 'director-kyc',
  ctaSecondarySlug: 'mca-annual-filing',
  relatedServiceSlugs: ['director-kyc', 'mca-annual-filing'],
  relatedLearnSlugs: ['dir-3-kyc-din-deactivation', 'roc-annual-filing-default-notice'],
  relatedTools: {
    penaltyCalculators: ['director-kyc', 'mca-annual-filing'],
    documentChecklists: ['private-limited-company'],
  },
  deadline: 'June 30, 2028 (Next triennial filing)',
  deadlineNote:
    'Annual DIR-3 KYC requirement has been replaced with triennial filing. Directors who filed KYC by September 30, 2025 do not need to file again until June 30, 2028.',

  sections: [
    {
      number: '01',
      heading: 'MAJOR CHANGE: TRIENNIAL DIRECTOR KYC FROM FY2025-26',
      body: 'The Ministry of Corporate Affairs (MCA) has amended the Companies (Appointment and Qualification of Directors) Rules, 2014, changing Director KYC from an annual requirement to a triennial (every 3 years) requirement.\n\nThis means directors no longer need to file DIR-3 KYC every year. If you filed your KYC by September 30, 2025, your next filing is due only on June 30, 2028. This reduces compliance burden significantly while maintaining verification of director details.',
      note: 'Source: MCA notification dated [2025] amending Rule 12A of Companies (Appointment and Qualification of Directors) Rules, 2014.',
    },
    {
      number: '02',
      heading: 'NEW TIMELINE AND DEADLINES',
      body: 'Understanding the new triennial cycle:',
      bullets: [
        'Last annual filing: September 30, 2025 - this was the final annual DIR-3 KYC deadline',
        'Current period: April 2026 - no DIR-3 KYC filing required if you filed in 2025',
        'Next triennial filing: Due by June 30, 2028 for all directors',
        'Subsequent filings: Every 3 years from the last filing date',
        'Note: The deadline has shifted from September 30 (annual) to June 30 (triennial)',
      ],
      note: 'Directors who missed the September 30, 2025 deadline must still file with late fee to restore active DIN status.',
    },
    {
      number: '03',
      heading: 'WHO NEEDS TO FILE AND WHEN',
      body: 'The filing requirement depends on your current status:',
      bullets: [
        'Filed KYC by Sep 30, 2025: No action needed until June 30, 2028',
        'Missed Sep 30, 2025 deadline: Your DIN is likely deactivated - file immediately with Rs. 5,000 late fee',
        'New directors (DIN issued after Oct 2025): Must file DIR-3 KYC within 30 days of DIN allotment, then follow triennial cycle',
        'Directors with details changed: Must file DIR-3 KYC within 30 days of change, regardless of triennial cycle',
        'Directors with deactivated DIN: Must file to reactivate before any company filings can be made',
      ],
    },
    {
      number: '04',
      heading: 'WHAT TRIGGERS IMMEDIATE KYC FILING',
      body: 'Even with triennial filing, certain events require immediate DIR-3 KYC:',
      bullets: [
        'Change in personal mobile number registered with MCA',
        'Change in personal email address registered with MCA',
        'Change in residential address (current or permanent)',
        'Change in PAN details (rare, but if corrected)',
        'New DIN allotment - within 30 days of receiving DIN',
        'Reactivation of deactivated DIN - immediate filing required',
      ],
      note: 'The 30-day window for change-triggered filing remains unchanged.',
    },
    {
      number: '05',
      heading: 'DOCUMENTS REQUIRED FOR DIR-3 KYC',
      body: 'Keep these ready for your triennial filing:',
      bullets: [
        'PAN card copy - must be linked with Aadhaar',
        'Aadhaar card copy - for identity verification',
        'Current address proof - utility bill, bank statement, or Aadhaar (not older than 2 months)',
        'Permanent address proof - if different from current address',
        'Passport-size photograph - recent photo if using eForm',
        'Mobile number - registered with Aadhaar for OTP verification',
        'Email address - for OTP verification',
        'Digital signature of practicing CA/CS - if filing through eForm',
      ],
    },
    {
      number: '06',
      heading: 'DIR-3 KYC FILING OPTIONS',
      body: 'Two methods are available for filing:',
      bullets: [
        'DIR-3 KYC Web is now the only permitted mode. The e-Form (DIR-3 KYC) has been discontinued by MCA.',
        'DIR-3 KYC Web requires OTP verification on registered mobile and email. No professional signature needed.',
        'For triennial filing in 2028: Most directors can use DIR-3 KYC-Web unless details have changed',
        'Filing fee: Rs. 50 if filed on time. Rs. 5,000 late fee if filed after the due date.',
      ],
    },
  ],

  faqs: [
    {
      q: 'I filed DIR-3 KYC in September 2025. Do I need to file again in 2026?',
      a: 'No. With the shift to triennial filing, your next DIR-3 KYC is due only on June 30, 2028. You do not need to file in 2026 or 2027 unless your registered details (mobile, email, address) change.',
    },
    {
      q: 'My DIN was deactivated because I missed the September 2025 deadline. What should I do?',
      a: 'You need to file DIR-3 KYC immediately with a late fee of Rs. 5,000 to reactivate your DIN. Until reactivation, you cannot sign any MCA forms, be shown as an active director, or file any company documents. Use the eForm if your details have changed, or DIR-3 KYC-Web if details are unchanged.',
    },
    {
      q: 'I became a director in January 2026. When is my KYC due?',
      a: 'New directors must file DIR-3 KYC within 30 days of DIN allotment. After that initial filing, you follow the triennial cycle. If you filed in January 2026, your next filing would be due by June 30, 2028 along with other directors.',
    },
    {
      q: 'Why did the deadline change from September 30 to June 30?',
      a: 'The shift to June 30 aligns director KYC with the end of Q1 of the financial year and reduces overlap with annual filing deadlines (AOC-4, MGT-7) that fall around September-October. This spreads compliance workload more evenly through the year.',
    },
    {
      q: 'What happens if I change my phone number before June 2028?',
      a: 'Any change in registered mobile number, email, or address triggers an immediate DIR-3 KYC filing requirement within 30 days of the change. This is separate from the triennial cycle. Failing to update changed details can cause issues with OTP verification for future MCA filings.',
    },
  ],
};

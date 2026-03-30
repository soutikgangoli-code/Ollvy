// lib/guides/pages/roc-annual-filing-default-notice.ts
import { LearnPageConfig } from '../pages';

export const rocAnnualFilingDefaultNotice: LearnPageConfig = {
  slug: 'roc-annual-filing-default-notice',
  title: 'ROC / MCA Show Cause Notice for Annual Filing Default',
  seoTitle: 'ROC Annual Filing Default Notice 2025 | Ollvy',
  seoDescription: 'Got an ROC or MCA show cause notice for not filing annual returns? Understand the director disqualification risk, penalties, and how to regularise before it is too late.',
  canonicalUrl: 'https://www.ollvy.com/guides/roc-annual-filing-default-notice',
  lastReviewed: 'March 2025',
  category: 'ROC Notice',
  ctaServiceSlug: 'mca-annual-filing',
  relatedServiceSlugs: ['mca-annual-filing', 'director-kyc'],
  relatedLearnSlugs: ['dir-3-kyc-din-deactivation', 'income-tax-143-1-intimation'],
  relatedTools: {
    penaltyCalculators: ['mca-annual-filing', 'director-kyc'],
    documentChecklists: ['private-limited-company'],
  },
  severity: 'urgent',
  deadline: '15-30 days as specified in notice',
  deadlineNote: 'If defaults continue for 3 consecutive years, directors are disqualified under Section 164(2). Disqualification affects all directorships, not just the defaulting company.',

  sections: [
    {
      number: '01',
      heading: 'THIS IS NOT JUST ABOUT PAPERWORK - DIRECTORS CAN BE DISQUALIFIED',
      body: "Every Private Limited Company is required to file two annual returns with the Ministry of Corporate Affairs (MCA): AOC-4 (Financial Statements including Balance Sheet, P&L, and auditor's report) and MGT-7 (Annual Return showing shareholding, directors, etc.).\n\nWhen these are not filed, the Registrar of Companies (ROC) issues a notice under Section 234 of the Companies Act, 2013. If defaults continue for three consecutive financial years, every director of the defaulting company is disqualified under Section 164(2) - meaning they cannot be appointed as a director in any company for 5 years.",
      note: 'Source: Sections 92, 137, 164(2), 234, Companies Act 2013.',
    },
    {
      number: '02',
      heading: 'WHAT EXACTLY ARE THE FILING OBLIGATIONS',
      body: '',
      bullets: [
        'AOC-4 (Financial Statements): Must be filed within 30 days of the AGM (Annual General Meeting). The AGM must be held within 6 months of the close of the financial year. So for FY 2023-24 (ending March 31, 2024), the AGM should be held by September 30, 2024, and AOC-4 filed by October 30, 2024.',
        'MGT-7 (Annual Return): Must be filed within 60 days of the AGM. Using the same example: deadline is November 29, 2024.',
        'MGT-8 (Certification by Company Secretary): Required for listed companies and companies with paid-up capital above Rs. 10 crore or turnover above Rs. 50 crore.',
        'ADT-1 (Auditor appointment): Filed within 15 days of the AGM where auditors are appointed.',
      ],
      note: 'Every year of non-filing separately attracts penalties. The three consecutive years rule for disqualification is cumulative.',
    },
    {
      number: '03',
      heading: 'THE PENALTY STRUCTURE',
      body: 'Penalties for late filing have a base amount plus a per-day component.',
      bullets: [
        'AOC-4 (Financial Statements - Section 137): Company penalty of Rs. 10,000 plus Rs. 100 per day of default. Director penalty: Rs. 10,000 plus Rs. 100 per day. No cap mentioned in the Act, though practical limits exist.',
        'MGT-7 (Annual Return - Section 92): Company: Rs. 10,000 plus Rs. 100 per day. Director/KMP: Rs. 10,000 to Rs. 2 lakh.',
        'Additional fee on MCA portal: The MCA portal charges additional fees for delayed filing on a slab basis. For delays above 720 days, the additional fee can be 12 times the normal filing fee.',
        'The ROC notice will specify the total penalty being demanded.',
      ],
      note: 'Use our penalty calculator for specific MCA penalty amounts: /tools/penalty-calculator/mca-annual-filing',
    },
    {
      number: '04',
      heading: 'HOW TO RESPOND AND REGULARISE',
      body: '',
      bullets: [
        'Step 1 - File all pending returns immediately: Even before responding to the notice, get your financial statements prepared (this requires your auditor), hold the board meeting to approve them, hold the AGM, and then file AOC-4 and MGT-7. The filing must happen before you can meaningfully respond.',
        'Step 2 - File the ROC response: Once filings are done, respond to the notice with the filing details, late fees paid, and an explanation for the delay (even genuine ones: difficulty getting auditors, COVID disruption for earlier years, key person absence).',
        'Step 3 - Address any penalty demand: If the ROC has issued a specific penalty amount, pay it through the MCA portal.',
        'Step 4 - Check director disqualification status: If the default has been running for 3 or more years, check whether DIN disqualification has already been triggered by looking up DIN status on the MCA portal.',
      ],
      note: 'For companies that have not filed for multiple years, consider the Companies Fresh Start Scheme (CFSS) if it is currently active - the MCA periodically runs amnesty schemes with reduced penalties for regularising defaults.',
    },
    {
      number: '05',
      heading: 'WHAT DIRECTOR DISQUALIFICATION UNDER SECTION 164(2) MEANS IN PRACTICE',
      body: 'If you are disqualified:',
      bullets: [
        'You cannot be appointed or continue as director of any company for 5 years from the date of disqualification',
        'This affects ALL your directorships - you must vacate directorship in every company, not just the defaulting one',
        'Banks often run DIN status checks during director due diligence for loans',
        'SEBI registered entities and listed companies check for director disqualification',
        "Restoring the directorship requires filing a representation with the ROC and separately with each company's board",
      ],
    },
  ],

  faqs: [
    {
      q: 'Our company has been inactive for 3 years and we have not filed any returns. Is it too late?',
      a: 'Not necessarily. You have options: (a) regularise all pending filings (expensive in fees for multiple years but clears the record), (b) apply for striking off the company as a defunct company under Section 248 (easier, but requires at least 2 years of zero activity and bank account closure), or (c) apply to the NCLT to have the company wound up. Each option has different cost and consequence implications - get professional guidance.',
    },
    {
      q: 'I am a director in 6 companies. If one company defaults for 3 years and my DIN is disqualified, am I automatically removed from all 6?',
      a: 'Yes. Section 164(2) disqualification attaches to your DIN and applies to all companies where you are a director. You must vacate all directorships within 30 days of the default being completed. Each company where you are a director must then fill your position. This is why catching annual filing defaults early matters so much.',
    },
  ],
};

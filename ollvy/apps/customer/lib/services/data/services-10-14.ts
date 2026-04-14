import type { ServicePageConfig } from '../types'

// ─── 10. GST Cancellation ─────────────────────────────────────────────────────

export const gstCancellation: ServicePageConfig = {
  slug: 'gst-cancellation',
  title: 'GST Cancellation',
  tagline: 'Close your GST registration properly. Final return filed, tax credits settled.',
  seoTitle: 'GST Registration Cancellation India 2025 | GSTR-10 and REG-16 | Ollvy',
  seoDescription: 'Voluntary GST cancellation with GSTR-10 final return and ITC reversal. Clean closure in 15 working days. No pending liabilities left behind.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-cancellation',
  lastReviewed: 'April 2026',
  category: 'GST',

  relatedServiceSlugs: ['gst-registration', 'gst-revocation', 'gst-monthly'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'GST cancellation is the formal closure of your GST number. It involves filing a cancellation application and a final return that declares your remaining stock and settles any tax credits you claimed. The GST officer reviews and issues a cancellation order.',
    whyYouNeedIt: 'If you close your business or drop below the mandatory threshold, continuing to hold a GST number means continuing to file monthly returns - even empty ones. Missed returns on an inactive registration trigger penalties, and eventually the department cancels your registration on its own, which is harder to resolve.',
    whatHappensWithout: 'Your monthly sales return and tax return remain mandatory. Each missed return: Rs. 50/day late fee (Rs. 20/day for empty returns). After 6 months of not filing, the department cancels your registration on its own - at which point you owe all pending returns, interest, and penalties before anything can be done.',
  },

  workflow: [
    {
      step: 1,
      title: 'Tax credit and liability review',
      timeframe: 'Day 0-2',
      description: 'Remaining tax credit balance and pending liabilities reviewed. Tax credits on goods still in stock must be returned to the government - Ollvy CA calculates the exact amount.',
      milestone: 'Tax position confirmed',
    },
    {
      step: 2,
      title: 'Final return prepared',
      timeframe: 'Day 2-5',
      description: 'Final return prepared with your remaining stock details and the tax credit amount to be returned.',
      milestone: 'Final return ready',
    },
    {
      step: 3,
      title: 'Cancellation application and final return filed',
      timeframe: 'Day 5-10',
      description: 'Cancellation application and final return filed simultaneously by Ollvy CA.',
      milestone: 'Cancellation filed',
    },
    {
      step: 4,
      title: 'Cancellation order received',
      timeframe: 'Day 10-15',
      description: 'GST officer reviews and issues the cancellation order.',
      milestone: 'GST registration cancelled',
    },
  ],

  included: [
    {
      title: 'Final return',
      description: 'Your remaining stock details, tax credit settlement, and final return - all prepared and filed by Ollvy CA.',
    },
    {
      title: 'Cancellation application',
      description: 'Cancellation application with reason and supporting details.',
    },
    {
      title: 'Tax credit settlement calculated',
      description: 'Any tax credits you claimed on goods still in stock when you close must be returned. Ollvy CA calculates the exact amount before filing - no surprise demands later.',
    },
  ],

  risks: [
    {
      title: 'All pending returns must be cleared first',
      description: 'Every outstanding monthly return must be filed before the cancellation can go through. Ollvy CA files those first if they\'re pending.',
    },
    {
      title: 'Tax credit settlement is mandatory',
      description: 'Any tax credits you claimed on goods still in stock must be returned. This cannot be skipped - the department checks your final return against your credit balance.',
    },
  ],

  personas: [
    {
      title: 'Closing business',
      description: 'Winding down operations. Full clean closure handled by Ollvy CA - all returns filed, tax credits settled, cancellation obtained.',
    },
    {
      title: 'Turnover dropped below threshold',
      description: 'No longer legally required to be registered. Voluntary cancellation prevents unnecessary return filing obligations.',
    },
    {
      title: 'Switching to composition scheme',
      description: 'Cancelling regular registration before registering as a composition dealer.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'What happens to my remaining tax credits when I cancel GST?',
      a: 'Tax credits on goods still in stock when you cancel must be returned to the government. Ollvy CA calculates this in the final return before filing. If you have a cash balance with the government, it can be claimed as a refund.',
    },
    {
      category: 'General',
      q: 'Can I re-register for GST after cancelling?',
      a: 'Yes. A fresh GST registration can be applied for if your turnover crosses the threshold again. Voluntary cancellation and subsequent re-registration is allowed.',
    },
    {
      category: 'General',
      q: 'How long does GST cancellation take?',
      a: '15 working days from application to cancellation order, assuming no pending returns or outstanding liabilities.',
    },
    {
      category: 'General',
      q: 'What if I have pending GST returns?',
      a: 'All pending monthly returns must be filed before Ollvy CA can submit the cancellation application. Ollvy CA files those first - it adds to the timeline but is mandatory.',
    },
    {
      category: 'General',
      q: 'What is the difference between voluntary and forced cancellation?',
      a: 'Voluntary cancellation: you apply to close your GST number cleanly. Forced cancellation: the department cancels your GST number for not filing returns for 6 or more months. Forced cancellation leaves you with penalties, back-payments, and a much harder restoration process.',
    },
  ],

  govtFees: {
    caption: 'Costs involved in closing your GST',
    headers: ['Item', 'Amount', 'Notes'],
    rows: [
      ['Cancellation application', 'Nil', 'No government fee for voluntary cancellation'],
      ['Final return filing', 'Nil', 'No fee to file, but tax credit amount must be paid'],
      ['Tax credits returned on remaining stock', 'Credit amount + 18% interest (if paid late)', 'Mandatory - all credits on goods in stock must be returned'],
      ['Pending return late fees (if any)', 'Rs. 50/day per return (Rs. 20/day for empty returns)', 'Must clear all pending returns before cancellation is accepted'],
    ],
  },

  documents: {
    caption: 'Documents you\'ll need',
    headers: ['Document', 'Required For', 'Notes'],
    rows: [
      ['Reason for cancellation', 'Cancellation application', 'Closing business, below threshold, switching to composition, etc.'],
      ['Remaining stock details', 'Final return', 'Stock as on cancellation date - item-wise quantity and value'],
      ['Tax credit balance', 'Final return', 'Balance as on date of cancellation'],
      ['Last filed monthly return', 'Reference', 'Confirm all dues are cleared before filing'],
      ['Bank account details', 'Refund if applicable', 'If credits result in a cash refund after settlement'],
    ],
  },
}


// ─── 11. GST Revocation ───────────────────────────────────────────────────────

export const gstRevocation: ServicePageConfig = {
  slug: 'gst-revocation',
  title: 'GST Revocation',
  tagline: 'GST cancelled by the department? Ollvy CA restores it.',
  seoTitle: 'GST Registration Revocation India 2025 | Suo-Moto Cancellation Reversal | Ollvy',
  seoDescription: 'Restore a suo-moto GST cancellation. Pending returns filed, REG-21 submitted, GSTIN restored. Act within 30 days of cancellation order.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-revocation',
  lastReviewed: 'April 2026',
  category: 'GST',

  relatedServiceSlugs: ['gst-registration', 'gst-monthly', 'gst-cancellation'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'GST revocation restores a GST number that was cancelled by the department - typically for not filing returns for 6 or more consecutive months. It involves filing all pending returns, paying interest, and submitting the revocation application within 30 days of the cancellation order.',
    whyYouNeedIt: 'A cancelled GST number means you cannot issue GST invoices, claim tax credits, or generate e-way bills. If you want to continue business, revocation is the only path - you cannot simply re-register if cancelled for non-compliance.',
    whatHappensWithout: 'Business operations requiring GST invoicing are blocked. Clients cannot claim tax credits on any invoices you raise after cancellation. If the 30-day revocation window closes, reinstatement requires a formal appeal - longer and more expensive.',
  },

  workflow: [
    {
      step: 1,
      title: 'Review cancellation order',
      timeframe: 'Day 0-1',
      description: 'Reason and date of cancellation confirmed. 30-day window calculated. Outstanding returns identified.',
      milestone: 'Cancellation order reviewed',
    },
    {
      step: 2,
      title: 'File all pending returns',
      timeframe: 'Day 1-5',
      description: 'All outstanding monthly returns filed. Ollvy CA calculates and pays the interest on late payments.',
      milestone: 'Pending returns cleared',
    },
    {
      step: 3,
      title: 'Revocation application filed',
      timeframe: 'Day 5-7',
      description: 'Revocation application submitted with explanation of default and confirmation that all returns are now current.',
      milestone: 'Revocation application filed',
    },
    {
      step: 4,
      title: 'GST registration restored',
      timeframe: 'Day 7-10',
      description: 'Officer reviews and restores the registration.',
      milestone: 'GST number active',
    },
  ],

  included: [
    {
      title: 'All pending returns filed',
      description: 'Every outstanding monthly return cleared. Ollvy CA calculates interest on late payments before the revocation application.',
    },
    {
      title: 'Revocation application',
      description: 'Revocation request with explanation of the default and confirmation that returns are now current.',
    },
    {
      title: 'Interest calculation upfront',
      description: 'Exact interest on late-paid tax calculated before filing so you know the total cost upfront.',
    },
  ],

  risks: [
    {
      title: '30-day window from cancellation date',
      description: 'Revocation must be applied for within 30 days of the cancellation order. After that, you must file a formal appeal - longer and more expensive. Act immediately.',
    },
    {
      title: 'All pending returns must be filed first',
      description: 'The department will not process the revocation unless all outstanding returns are filed and tax with interest paid.',
    },
  ],

  personas: [
    {
      title: 'GST cancelled for non-filing',
      description: 'Missed returns for 6+ months, registration cancelled by the department. Ollvy CA clears all returns and restores your registration.',
    },
    {
      title: 'Need to continue invoicing clients urgently',
      description: 'GST number required for ongoing business. Ollvy CA treats this as urgent from day one.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'Why was my GST registration cancelled?',
      a: 'Forced cancellation happens after 6 or more consecutive months of not filing your monthly tax return. The department issues a notice, then a show-cause notice, and finally a cancellation order.',
    },
    {
      category: 'General',
      q: 'What is the time limit for revocation?',
      a: '30 days from the date of the cancellation order. This is the standard window. Extensions of up to 30 more days can be granted for good reason - but do not rely on this. Apply immediately.',
    },
    {
      category: 'General',
      q: 'Can I raise GST invoices while revocation is pending?',
      a: 'No. Your GST number is invalid until restored. Any invoices you raise during this period cannot be used by your clients to claim tax credits, and you face legal exposure for issuing invoices on a cancelled registration.',
    },
    {
      category: 'General',
      q: 'What if I missed the 30-day window?',
      a: 'You must file a formal appeal. This takes longer and requires specific grounds for delay. Ollvy handles this but it is more involved than a standard revocation.',
    },
    {
      category: 'General',
      q: 'How much will I owe in late fees and interest?',
      a: 'Rs. 50/day per return (Rs. 20/day for empty returns), capped at Rs. 10,000 per return. Plus 18% per annum interest on any unpaid tax from the original due date. Ollvy CA calculates the exact amount before you commit.',
    },
  ],

  govtFees: {
    caption: 'Costs involved in restoring your GST',
    headers: ['Item', 'Amount', 'Notes'],
    rows: [
      ['Revocation application', 'Nil', 'No government fee'],
      ['Pending sales return late fee', 'Rs. 50/day per return, capped at Rs. 10,000', 'Must be paid before revocation is accepted'],
      ['Pending tax return late fee', 'Rs. 50/day per return, capped at Rs. 10,000', 'Must be paid before revocation is accepted'],
      ['Interest on unpaid tax', '18% per annum from original due date', 'Accrues daily - calculated before filing'],
    ],
  },

  documents: {
    caption: 'Documents you\'ll need',
    headers: ['Document', 'Required', 'Notes'],
    rows: [
      ['GST cancellation order', 'Yes', 'Date of cancellation determines the 30-day window'],
      ['Reason for non-compliance', 'Yes - for the revocation application', 'Explanation of why returns were missed'],
      ['Proof of pending returns filed', 'Yes', 'Receipt numbers for all cleared monthly returns'],
      ['Proof of tax and interest paid', 'Yes', 'Payment receipts showing all outstanding amounts cleared'],
      ['GST portal credentials', 'Yes', 'For filing pending returns and revocation application'],
    ],
  },
}


// ─── 12. DIN Reactivation ─────────────────────────────────────────────────────

export const dinReactivation: ServicePageConfig = {
  slug: 'din-reactivation',
  title: 'DIN Reactivation',
  tagline: 'Director Identification Number deactivated? Active in 10 working days.',
  seoTitle: 'DIN Reactivation India 2025 | DIR-3 KYC Late Filing | Rs. 5,000 Fee | Ollvy',
  seoDescription: 'Reactivate a deactivated DIN in 10 working days. All pending DIR-3 KYC filed, Rs. 5,000 late fee per year, DIR-3C submitted. All directorships unblocked.',
  canonicalUrl: 'https://www.ollvy.com/services/din-reactivation',
  lastReviewed: 'April 2026',
  category: 'Compliance',

  relatedServiceSlugs: ['mca-annual-filing', 'pvt-ltd-incorporation'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp'],

  explainer: {
    whatItIs: 'Your Director ID (DIN) gets deactivated automatically if you don\'t file the annual director KYC by September 30. Reactivation involves filing the KYC for every missed year, paying the Rs. 5,000 late fee per year, and submitting a reactivation application.',
    whyYouNeedIt: 'A deactivated Director ID means you cannot sign any company filing, resolution, or official document. Every company where you are a director is blocked from filing anything with the government until your ID is restored.',
    whatHappensWithout: 'All companies where you are a director cannot file their annual returns or any government form. Penalty of Rs. 100/day per form continues to accrue on missed annual filings. Those companies get marked as in default on government records - visible to investors, banks, and anyone checking.',
  },

  workflow: [
    {
      step: 1,
      title: 'Check deactivation reason and years outstanding',
      timeframe: 'Day 0-1',
      description: 'Director ID status verified on the government portal. Years of outstanding KYC identified.',
      milestone: 'Outstanding years confirmed',
    },
    {
      step: 2,
      title: 'File all pending director KYC',
      timeframe: 'Day 1-5',
      description: 'Director KYC filed for each outstanding year by Ollvy CS. Aadhaar OTP verification required for each filing. Rs. 5,000 late fee applies per year.',
      milestone: 'All KYC filings cleared',
    },
    {
      step: 3,
      title: 'Reactivation application filed',
      timeframe: 'Day 5-7',
      description: 'Reactivation form filed with the government by Ollvy CS.',
      milestone: 'Reactivation application submitted',
    },
    {
      step: 4,
      title: 'Director ID reactivated',
      timeframe: 'Day 7-10',
      description: 'Director ID status changed to Active. All your signing authority and filing access restored across every company where you are a director.',
      milestone: 'Director ID active',
    },
  ],

  included: [
    {
      title: 'All outstanding director KYC filed',
      description: 'Every year of missed KYC cleared by Ollvy CS. Aadhaar OTP verification coordinated in real time.',
    },
    {
      title: 'Reactivation application',
      description: 'Reactivation form submitted to the government by Ollvy CS.',
    },
    {
      title: 'All directorships unblocked',
      description: 'One reactivation unblocks every company where you are a director. Ollvy CS verifies all directorships are restored.',
    },
  ],

  risks: [
    {
      title: 'Rs. 5,000 per year of missed KYC',
      description: 'Government late fee of Rs. 5,000 per year is fixed and non-negotiable. 3 years of missed KYC = Rs. 15,000 in late fees, payable to the government.',
    },
    {
      title: 'Aadhaar-linked mobile must be active',
      description: 'The director KYC requires Aadhaar OTP for each year\'s filing. If the mobile linked to Aadhaar is inactive, it must be updated at an Aadhaar enrolment centre before filing.',
    },
    {
      title: 'All directorships blocked until Director ID is active',
      description: 'The impact is not limited to one company. Every company where you are a director is blocked from government filings until your Director ID is restored.',
    },
  ],

  personas: [
    {
      title: 'Missed director KYC for one or more years',
      description: 'Director ID deactivated on October 1 after missing the September 30 deadline. Act before your companies miss their annual filing deadlines.',
    },
    {
      title: 'Director in multiple companies',
      description: 'One reactivation restores all directorships. Ollvy CS verifies every company is unblocked.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'Why was my Director ID deactivated?',
      a: 'Director IDs deactivate automatically on October 1 every year if the annual KYC is not filed by September 30. This is an automated government process - no individual notice is sent.',
    },
    {
      category: 'General',
      q: 'What is the late fee for director KYC?',
      a: 'Rs. 5,000 per financial year of missed KYC. This is a fixed government fee - it cannot be reduced or waived. 2 years missed = Rs. 10,000; 3 years = Rs. 15,000.',
    },
    {
      category: 'General',
      q: 'How long does reactivation take?',
      a: '10 working days from when Ollvy CS receives your documents and completes the Aadhaar OTP verifications.',
    },
    {
      category: 'General',
      q: 'Does reactivation fix the issue for all companies where I am a director?',
      a: 'Yes. Your Director ID is a single identifier across all directorships. Reactivating it restores your signing authority and filing access across every company where you hold a position.',
    },
    {
      category: 'General',
      q: 'What if my mobile and email are already verified on the government portal?',
      a: 'If your mobile and email are already verified from a previous filing, you may be eligible for the online version of director KYC which has no fee and takes 2 minutes. Ollvy CS checks your status before recommending the approach.',
    },
    {
      category: 'General',
      q: 'Can I prevent deactivation in future?',
      a: 'Yes. File director KYC every year by September 30. It takes 15 minutes. If your mobile and email are verified on the government portal, you can use the quick online version - a 2-minute web form with no late fee. Your Ollvy compliance calendar shows this deadline.',
    },
  ],

  govtFees: {
    caption: 'Government fees',
    headers: ['Item', 'Fee', 'Notes'],
    rows: [
      ['Director KYC late fee (per year)', 'Rs. 5,000', 'Fixed government fee; paid per financial year of missed KYC'],
      ['Reactivation form', 'Included in KYC late fee', 'No separate filing fee for the reactivation form'],
      ['Example: 1 year missed', 'Rs. 5,000 total', ''],
      ['Example: 2 years missed', 'Rs. 10,000 total', ''],
      ['Example: 3 years missed', 'Rs. 15,000 total', ''],
    ],
  },

  documents: {
    caption: 'Documents you\'ll need',
    headers: ['Document', 'Required', 'Notes'],
    rows: [
      ['Director PAN card', 'Yes', 'For identity verification'],
      ['Director Aadhaar card', 'Yes', 'OTP sent to Aadhaar-linked mobile - must be active'],
      ['Mobile linked to Aadhaar', 'Yes - must be active', 'OTP required for each year\'s director KYC filing'],
      ['Email address', 'Yes', 'For email OTP verification'],
      ['Passport photo', 'Yes', 'Current photo for KYC filing'],
      ['Director ID number', 'Yes', 'The deactivated Director ID to be restored'],
    ],
  },
}


// ─── 13. Company Name Change ──────────────────────────────────────────────────

export const companyNameChange: ServicePageConfig = {
  slug: 'company-name-change',
  title: 'Company Name Change',
  tagline: 'New name. Same company. Same registration number, PAN, and TAN.',
  seoTitle: 'Company Name Change MCA India 2025 | INC-24 and RUN Filing | Ollvy',
  seoDescription: 'Change your Pvt Ltd company name with MCA in 20 working days. Special resolution, RUN filing, INC-24, MOA amendment, new Certificate of Incorporation.',
  canonicalUrl: 'https://www.ollvy.com/services/company-name-change',
  lastReviewed: 'April 2026',
  category: 'Compliance',

  relatedServiceSlugs: ['pvt-ltd-incorporation', 'mca-annual-filing', 'trademark-registration'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp'],

  explainer: {
    whatItIs: 'Changing your company\'s legal name involves a shareholder vote (75% must approve), reserving the new name with the government, updating your company\'s founding document, and filing the name change application. The government issues a fresh Certificate of Incorporation with the new name.',
    whyYouNeedIt: 'If you are rebranding, pivoting, or resolving a name conflict, the legal name must be changed through the government. Using a trading name different from your registered name creates mismatches in contracts, invoices, and bank records - and raises red flags for investors and banks.',
    whatHappensWithout: 'Operating under a name different from your government-registered name creates legal and commercial mismatches. Bank accounts, GST, trademark, and other registrations remain in the old name. Investors, banks, and partners will find the mismatch.',
  },

  workflow: [
    {
      step: 1,
      title: 'Name availability check',
      timeframe: 'Day 0-2',
      description: 'New name searched against the government company registry and trademark database by Ollvy CS. Conflicts identified before any filing.',
      milestone: 'Name confirmed available',
    },
    {
      step: 2,
      title: 'Board and shareholder resolution',
      timeframe: 'Day 2-7',
      description: 'Shareholder vote required (75% must approve). Board resolution and meeting notice drafted by Ollvy CS.',
      milestone: 'Shareholder approval obtained',
    },
    {
      step: 3,
      title: 'New name reserved with the government',
      timeframe: 'Day 7-12',
      description: 'Name reservation application submitted to the government by Ollvy CS.',
      milestone: 'New name reserved',
    },
    {
      step: 4,
      title: 'Name change application filed',
      timeframe: 'Day 12-18',
      description: 'Name change application filed with the updated founding document by Ollvy CS.',
      milestone: 'Name change application submitted',
    },
    {
      step: 5,
      title: 'New Certificate of Incorporation issued',
      timeframe: 'Day 18-20',
      description: 'Fresh Certificate with your new company name issued by the government. Your registration number, PAN, and TAN remain unchanged.',
      milestone: 'Name change complete',
    },
  ],

  included: [
    {
      title: 'Name availability search',
      description: 'Government registry and trademark database checked by Ollvy CS before filing to minimise rejection risk.',
    },
    {
      title: 'Shareholder resolution drafting',
      description: 'Shareholder resolution, board resolution, and meeting notice drafted by Ollvy CS. All legal requirements covered.',
    },
    {
      title: 'Founding document updated',
      description: 'The name clause of your company\'s founding document updated with the new name.',
    },
    {
      title: 'New Certificate of Incorporation',
      description: 'Fresh certificate issued by the government. Your registration number, PAN, and TAN stay the same.',
    },
  ],

  risks: [
    {
      title: 'Other registrations must be updated separately',
      description: 'The government name change does not automatically update your GST, bank accounts, trademark, import-export code, or FSSAI. Each requires a separate update.',
    },
    {
      title: 'Trademark conflict',
      description: 'If someone has registered a similar trademark, the government may reject the name, or you may receive a legal notice after the change. Ollvy\'s trademark search reduces this risk.',
    },
  ],

  personas: [
    {
      title: 'Rebranding',
      description: 'New brand identity. Legal name aligned with the new brand across all government records.',
    },
    {
      title: 'Business pivot',
      description: 'Core business changed. Existing name no longer reflects what the company does.',
    },
    {
      title: 'Name conflict with another company',
      description: 'Another company has a similar name causing confusion. Changing to a clearly distinct name.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'How long does a company name change take?',
      a: '20 working days from start to new Certificate of Incorporation - subject to government processing time.',
    },
    {
      category: 'General',
      q: 'Does PAN or GST change when I change the company name?',
      a: 'PAN and TAN remain the same. GST requires a name update on the GST portal - a separate process but straightforward. Bank accounts, trademark, and other registrations must also be updated separately.',
    },
    {
      category: 'General',
      q: 'Do I need a shareholder vote for a name change?',
      a: 'Yes. A shareholder resolution with 75% voting in favour is required. It can be passed at a shareholder meeting or through postal ballot.',
    },
    {
      category: 'General',
      q: 'Can I change the name to anything?',
      a: 'Subject to government availability: the name must be distinct from all existing company and LLP names, not contain restricted words (Bank, Insurance, Exchange, etc.), and ideally not conflict with registered trademarks.',
    },
    {
      category: 'General',
      q: 'What happens to existing contracts when the company name changes?',
      a: 'Existing contracts remain valid - your company registration number stays the same, only the name changes. Going forward, use the new name in all agreements and notify key partners of the change.',
    },
  ],

  govtFees: {
    caption: 'Government fees for company name change',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['Name reservation application', 'Rs. 1,000', 'Name reservation valid for 60 days from approval'],
      ['Name change application fee', 'Rs. 1,200-56,000', 'Based on paid-up capital per the government fee schedule; Rs. 1,200 for up to Rs. 1 lakh capital'],
      ['Stamp duty on updated founding document', 'Varies by state', 'Updated founding document must be printed on stamp paper; varies significantly by state'],
      ['GST name update (after name change)', 'Nil', 'Name update on the GST portal is free but must be done'],
      ['Typical total govt fee', 'Rs. 3,000-8,000', 'Company with paid-up capital up to Rs. 25 lakh'],
    ],
  },

  documents: {
    caption: 'Documents you\'ll need',
    headers: ['Document', 'Required', 'Notes'],
    rows: [
      ['Board resolution recommending name change', 'Yes', 'Passed by Board of Directors'],
      ['Meeting notice to shareholders', 'Yes', '21 days notice required unless shorter notice is consented to'],
      ['Shareholder resolution', 'Yes', '75%+ majority; minutes of the shareholder meeting or postal ballot results'],
      ['Updated founding document', 'Yes', 'Name clause updated; stamped per state stamp duty'],
      ['Name reservation approval from government', 'Yes', 'Obtained in Step 3 before filing the name change application'],
      ['Certificate of Incorporation (existing)', 'Yes', 'Current certificate; surrendered to the government as part of name change'],
      ['Trademark search report', 'Recommended', 'To verify new name does not conflict with registered trademarks'],
    ],
  },
}


// ─── 14. Cloud Kitchen Setup ──────────────────────────────────────────────────

export const cloudKitchenSetup: ServicePageConfig = {
  slug: 'cloud-kitchen-setup',
  title: 'Cloud Kitchen Setup',
  tagline: 'Every licence a delivery kitchen needs. FSSAI, GST, and trade licence together.',
  seoTitle: 'Cloud Kitchen Licence India 2025 | FSSAI + GST Setup | Ollvy',
  seoDescription: 'Complete cloud kitchen licensing - FSSAI State Licence, GST registration, and local trade licence. Swiggy and Zomato require FSSAI before onboarding.',
  canonicalUrl: 'https://www.ollvy.com/services/cloud-kitchen-setup',
  lastReviewed: 'April 2026',
  category: 'Licensing',

  relatedServiceSlugs: ['gst-registration', 'gst-monthly', 'msme-registration'],
  relatedLearnSlugs: ['do-i-need-fssai-license', 'do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'Cloud Kitchen Setup is a bundled service covering all mandatory licences for a delivery-only commercial kitchen: FSSAI Licence (Basic, State, or Central based on turnover), GST Registration, and local trade/health licence from your municipal authority.',
    whyYouNeedIt: 'Swiggy, Zomato, and all major food delivery platforms require a valid FSSAI licence number at onboarding - you cannot list without it. Without GST registration, you cannot issue compliant invoices or claim tax credits on kitchen equipment and supplies. Operating without a trade licence risks closure notices.',
    whatHappensWithout: 'Cannot list on food delivery platforms - the primary revenue channel for cloud kitchens. FSSAI penalty for operating without a licence: up to Rs. 5 lakh under the Food Safety Act. Food safety officers can seal unlicensed premises and seize stock without a court order.',
  },

  workflow: [
    {
      step: 1,
      title: 'Business details and kitchen address',
      timeframe: 'Day 0',
      description: 'Turnover, kitchen area, menu category, GST status, city. Ollvy determines the correct FSSAI licence type and local authority requirements for your specific location.',
      milestone: 'Licence types confirmed, expert assigned',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeframe: 'Day 0-2',
      description: 'Business registration proof, kitchen layout plan, food safety plan, equipment list, address proof, and owner ID.',
      milestone: 'Documents verified',
    },
    {
      step: 3,
      title: 'FSSAI and GST applications filed in parallel',
      timeframe: 'Day 2-5',
      description: 'FSSAI application filed on the government portal. GST registration filed simultaneously if not already registered. Application receipts shared same day.',
      milestone: 'Applications submitted',
    },
    {
      step: 4,
      title: 'Local trade/health licence application',
      timeframe: 'Day 3-7',
      description: 'Application filed with your municipal authority. Requirements vary by city - Delhi, Mumbai, and Bangalore each have different processes.',
      milestone: 'Trade licence application filed',
    },
    {
      step: 5,
      title: 'FSSAI inspection coordinated',
      timeframe: 'Day 7-14',
      description: 'State and Central FSSAI licences require a physical inspection. Ollvy provides a pre-inspection checklist: pest control certificate, water test report, equipment hygiene, food safety plan.',
      milestone: 'Inspection completed',
    },
    {
      step: 6,
      title: 'All licences issued',
      timeframe: 'Day 10-21',
      description: 'FSSAI licence number, GST number, and trade licence received. All uploaded to your Ollvy account.',
      milestone: 'Kitchen ready to list on platforms',
    },
  ],

  included: [
    {
      title: 'FSSAI licence - correct type determined upfront',
      description: 'Basic (below Rs. 12 lakh), State (Rs. 12 lakh to Rs. 20 crore), or Central (above Rs. 20 crore or multi-state). Ollvy confirms the type before you pay the government fee.',
      without: 'Apply for wrong licence type, get rejected, restart process',
      withOllvy: 'Correct licence type confirmed upfront based on your turnover and operation',
    },
    {
      title: 'GST registration',
      description: 'Full GST registration including Ollvy CA assignment, document verification, and application tracking. Included in the bundle.',
    },
    {
      title: 'Local trade/health licence',
      description: 'Filed with your municipal authority. Different requirements for Delhi (MCD), Mumbai (BMC), Bangalore (BBMP), and other cities - Ollvy handles your specific city.',
    },
    {
      title: 'Pre-inspection checklist',
      description: 'For State and Central FSSAI licences, Ollvy provides a checklist of what inspectors check: pest control certificate, water testing, equipment hygiene labels, food safety plan.',
      without: 'Inspection failure - entire process restarts',
      withOllvy: 'Pre-inspection checklist reduces failure risk',
    },
    {
      title: 'FSSAI renewal reminder',
      description: 'FSSAI licence valid for 1-5 years (chosen at application). Renewal reminder in your compliance calendar before expiry.',
    },
  ],

  risks: [
    {
      title: 'FSSAI inspection failure',
      description: 'State and Central licences require physical inspection. Common failure points: no pest control certificate, missing water quality test report, equipment without hygiene labels. Ollvy\'s pre-inspection checklist addresses all standard failure points.',
    },
    {
      title: 'Wrong FSSAI licence type',
      description: 'Basic Registration when you need State Licence gets rejected by platforms. Ollvy verifies turnover and operation type before filing.',
    },
    {
      title: 'Trade licence requirements vary by city',
      description: 'Each municipal authority has different documents, fees, and timelines. Delhi (MCD), Mumbai (BMC), Bangalore (BBMP) are all different. Ollvy applies for the correct licence from the correct authority.',
    },
  ],

  personas: [
    {
      title: 'New cloud kitchen, starting from scratch',
      description: 'No existing licences. All three handled together - FSSAI, GST, and trade licence.',
    },
    {
      title: 'Home baker scaling to commercial kitchen',
      description: 'Moving from home to a commercial kitchen. State Licence now required (was Basic before).',
    },
    {
      title: 'Already have GST, need FSSAI',
      description: 'Partial bundle. FSSAI and trade licence only.',
    },
    {
      title: 'Multi-city expansion',
      description: 'New kitchen in a new city. Fresh local licences required for each location. Ollvy handles the city-specific requirements.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'Do I need FSSAI even for a small home-based food business?',
      a: 'Yes. All food businesses at any scale require FSSAI. Below Rs. 12 lakh annual turnover: Basic Registration (no inspection, Rs. 100/year). Above Rs. 12 lakh: State Licence (inspection required). There is no exemption for home-based or small operations.',
    },
    {
      category: 'General',
      q: 'Can I list on Swiggy or Zomato before getting FSSAI?',
      a: 'No. Both platforms require a valid FSSAI licence number at onboarding. You cannot list without it. They also periodically verify it against the FSSAI database and can suspend accounts with expired or invalid licences.',
    },
    {
      category: 'General',
      q: 'What is the difference between FSSAI Basic Registration and State Licence?',
      a: 'Basic Registration (Form A): turnover below Rs. 12 lakh, issued by local Food Safety Officer, no inspection, Rs. 100/year. State Licence (Form B): Rs. 12 lakh to Rs. 20 crore, issued by State Food Safety Authority, inspection required, Rs. 2,000-7,500/year.',
    },
    {
      category: 'General',
      q: 'How long is the FSSAI licence valid?',
      a: '1 to 5 years - you choose at the time of application. Renewal must be applied for before expiry. Operating with an expired FSSAI is treated the same as operating without one.',
    },
    {
      category: 'General',
      q: 'Can multiple brands operate from one cloud kitchen under one FSSAI licence?',
      a: 'Yes. Multiple virtual restaurants or brands can operate from one kitchen at one address under a single FSSAI licence.',
    },
    {
      category: 'General',
      q: 'What does the FSSAI inspection check?',
      a: 'Pest control certificate, water quality test report, equipment hygiene labels (manufacturer, use-by date), food safety plan, storage conditions, kitchen cleanliness, and waste disposal setup. Ollvy sends you a pre-inspection checklist covering all standard points.',
    },
    {
      category: 'General',
      q: 'Is GST mandatory for a cloud kitchen?',
      a: 'Mandatory once turnover crosses Rs. 20 lakh (services threshold, which applies to restaurants and food businesses). Voluntary registration is possible below this threshold and recommended if you want to claim tax credits on kitchen equipment, packaging, and supplies.',
    },
  ],

  govtFees: {
    caption: 'Government fees for all licences',
    headers: ['Licence', 'Government Fee', 'Validity', 'Notes'],
    rows: [
      ['FSSAI Basic Registration', 'Rs. 100/year', '1-5 years', 'Below Rs. 12 lakh annual turnover; no inspection'],
      ['FSSAI State Licence', 'Rs. 2,000-7,500/year by category', '1-5 years', 'Rs. 12 lakh to Rs. 20 crore; inspection required'],
      ['FSSAI Central Licence', 'Rs. 7,500/year', '1-5 years', 'Above Rs. 20 crore or multi-state or importer/exporter'],
      ['GST Registration', 'Nil', 'Permanent', 'Monthly filing obligations begin after registration'],
      ['Trade Licence - Delhi (MCD)', 'Rs. 500-5,000 depending on area', 'Annual', 'Municipal Corporation of Delhi'],
      ['Trade Licence - Mumbai (BMC)', 'Rs. 1,000-10,000 by category', 'Annual', 'Brihanmumbai Municipal Corporation'],
      ['Trade Licence - Bangalore (BBMP)', 'Rs. 500-5,000', 'Annual', 'Bruhat Bengaluru Mahanagara Palike'],
    ],
  },

  documents: {
    caption: 'Documents you\'ll need',
    headers: ['Document', 'FSSAI', 'GST', 'Trade Licence'],
    rows: [
      ['PAN card (owner or entity)', 'Yes', 'Yes', 'Yes'],
      ['Aadhaar card', 'Yes', 'Yes', 'Yes'],
      ['Address proof (owner)', 'Yes', 'Yes', 'Yes'],
      ['Kitchen electricity bill', 'Yes', 'Yes (business address)', 'Yes'],
      ['Rent agreement or ownership proof', 'Yes', 'No-objection letter if rented', 'Yes'],
      ['Business registration proof', 'If company/LLP', 'If company/LLP', 'Yes'],
      ['Kitchen layout plan (to scale)', 'State/Central only', 'No', 'Sometimes'],
      ['Food safety plan', 'State/Central only', 'No', 'No'],
      ['Equipment list with make/model', 'State/Central only', 'No', 'No'],
      ['Pest control certificate', 'State/Central only', 'No', 'Sometimes'],
      ['Water test report', 'State/Central only', 'No', 'No'],
      ['Passport photo of proprietor/director', 'Yes', 'Yes', 'Yes'],
    ],
  },
}

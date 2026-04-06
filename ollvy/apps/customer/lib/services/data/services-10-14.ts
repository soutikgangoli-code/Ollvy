import type { ServicePageConfig } from '../types'

// ─── 10. GST Cancellation ─────────────────────────────────────────────────────

export const gstCancellation: ServicePageConfig = {
  slug: 'gst-cancellation',
  title: 'GST Cancellation',
  tagline: 'Close your GST registration properly. Final return filed, ITC reversed.',
  seoTitle: 'GST Registration Cancellation India 2025 | GSTR-10 and REG-16 | Ollvy',
  seoDescription: 'Voluntary GST cancellation with GSTR-10 final return and ITC reversal. Clean closure in 15 working days. No pending liabilities left behind.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-cancellation',
  lastReviewed: 'April 2026',
  category: 'GST',

  relatedServiceSlugs: ['gst-registration', 'gst-revocation', 'gst-monthly-50l'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'GST cancellation is the formal surrender of your GSTIN. It involves filing REG-16 (cancellation application) and GSTR-10 (final return declaring closing stock and reversing Input Tax Credit). The GST officer reviews and issues a cancellation order.',
    whyYouNeedIt: 'If you close your business or drop below the mandatory threshold, continuing to hold a GSTIN means continuing to file monthly returns - even nil ones. Missed returns on an inactive registration trigger penalties and eventually suo-moto cancellation by the department, which is harder to resolve.',
    whatHappensWithout: 'Monthly GSTR-1 and GSTR-3B remain mandatory. Each missed return: Rs. 50/day late fee for non-nil returns (Rs. 20/day for nil). After 6 months of non-filing, the department cancels suo-moto - at which point you owe all pending returns, interest, and penalties before anything can be done.',
  },

  workflow: [
    {
      step: 1,
      title: 'ITC and liability review',
      timeframe: 'Day 0-2',
      description: 'Remaining ITC balance and pending tax liabilities reviewed. ITC on closing stock must be reversed - we calculate the exact amount.',
      milestone: 'Liability position confirmed',
    },
    {
      step: 2,
      title: 'GSTR-10 prepared',
      timeframe: 'Day 2-5',
      description: 'Final return prepared with closing stock details and ITC reversal calculation.',
      milestone: 'Final return ready',
    },
    {
      step: 3,
      title: 'REG-16 and GSTR-10 filed',
      timeframe: 'Day 5-10',
      description: 'Cancellation application and final return filed simultaneously.',
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
      title: 'GSTR-10 final return',
      description: 'Closing stock details, ITC reversal calculation, and final return prepared and filed.',
    },
    {
      title: 'REG-16 filing',
      description: 'Cancellation application with reason and supporting details.',
    },
    {
      title: 'ITC reversal calculated',
      description: 'Any ITC taken on goods still in stock at cancellation must be reversed. We calculate the exact amount before filing so there are no surprise demands after.',
    },
  ],

  risks: [
    {
      title: 'All pending returns must be cleared first',
      description: 'Every outstanding GSTR-1 and GSTR-3B must be filed before the cancellation application can be processed. We file those first if they are pending.',
    },
    {
      title: 'ITC reversal is mandatory',
      description: 'Any ITC claimed on goods still in stock at cancellation must be reversed or paid back. This cannot be skipped - the department checks GSTR-10 against your credit ledger.',
    },
  ],

  personas: [
    {
      title: 'Closing business',
      description: 'Winding down operations. Full clean closure handled - all returns filed, ITC reversed, cancellation obtained.',
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
      q: 'What happens to my remaining ITC balance when I cancel GST?',
      a: 'ITC on closing stock (goods still held at the time of cancellation) must be reversed and paid back to the government. We calculate this in GSTR-10 before filing. If your electronic cash ledger has a balance, it can be claimed as a refund.',
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
      a: 'All pending GSTR-1 and GSTR-3B must be filed before we can submit the cancellation application. We file those first - it adds to the total timeline but is mandatory.',
    },
    {
      category: 'General',
      q: 'What is the difference between voluntary cancellation and suo-moto cancellation?',
      a: 'Voluntary cancellation (REG-16): you apply to close your GSTIN cleanly. Suo-moto cancellation: the department cancels your GSTIN for non-filing of returns for 6+ consecutive months. Suo-moto cancellation leaves you with penalties, arrears, and a more complex restoration process.',
    },
  ],

  govtFees: {
    caption: 'Costs Involved - GST Cancellation',
    headers: ['Item', 'Amount', 'Notes'],
    rows: [
      ['REG-16 cancellation application', 'Nil', 'No government fee for voluntary cancellation'],
      ['GSTR-10 final return filing', 'Nil', 'No fee to file, but ITC reversal amount must be paid'],
      ['ITC reversal on closing stock', 'ITC amount + 18% interest (if paid late)', 'Mandatory - all ITC on goods in stock must be returned'],
      ['Pending return late fees (if any)', 'Rs. 50/day per return (nil: Rs. 20/day)', 'Must clear all pending returns before cancellation is accepted'],
    ],
  },

  documents: {
    caption: 'Documents Required - GST Cancellation',
    headers: ['Document', 'Required For', 'Notes'],
    rows: [
      ['Reason for cancellation', 'REG-16', 'Cessation of business, below threshold, switching to composition, etc.'],
      ['Closing stock details', 'GSTR-10', 'Stock as on cancellation date - item-wise quantity and value'],
      ['ITC balance in credit ledger', 'GSTR-10', 'Balance as on date of cancellation'],
      ['Last filed GSTR-3B', 'Reference', 'Confirm all dues are cleared before filing'],
      ['Bank account details', 'Refund if applicable', 'If ITC results in a cash refund after reversal'],
    ],
  },
}


// ─── 11. GST Revocation ───────────────────────────────────────────────────────

export const gstRevocation: ServicePageConfig = {
  slug: 'gst-revocation',
  title: 'GST Revocation',
  tagline: 'GST cancelled by the department? We restore it.',
  seoTitle: 'GST Registration Revocation India 2025 | Suo-Moto Cancellation Reversal | Ollvy',
  seoDescription: 'Restore a suo-moto GST cancellation. Pending returns filed, REG-21 submitted, GSTIN restored. Act within 30 days of cancellation order.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-revocation',
  lastReviewed: 'April 2026',
  category: 'GST',

  relatedServiceSlugs: ['gst-registration', 'gst-monthly-50l', 'gst-cancellation'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'GST revocation restores a GSTIN that was cancelled suo-moto by the GST department - typically for non-filing of returns for 6 or more consecutive months. It involves filing all pending returns, paying interest, and submitting REG-21 (revocation application) within 30 days of the cancellation order.',
    whyYouNeedIt: 'A cancelled GSTIN means you cannot issue GST invoices, claim ITC, or generate e-way bills. If you want to continue business, revocation is the only path - you cannot simply re-register if cancelled for non-compliance.',
    whatHappensWithout: 'Business operations requiring GST invoicing are blocked. Clients cannot claim ITC on any invoices raised after cancellation. If the 30-day revocation window closes, reinstatement requires an appeal to the Appellate Authority - a more complex and time-consuming process.',
  },

  workflow: [
    {
      step: 1,
      title: 'Review cancellation order',
      timeframe: 'Day 0-1',
      description: 'Reason and date of suo-moto cancellation confirmed. 30-day window calculated. Outstanding returns identified.',
      milestone: 'Cancellation order reviewed',
    },
    {
      step: 2,
      title: 'File all pending returns',
      timeframe: 'Day 1-5',
      description: 'All outstanding GSTR-1 and GSTR-3B filed with interest on late payment calculated and paid.',
      milestone: 'Pending returns cleared',
    },
    {
      step: 3,
      title: 'REG-21 filed',
      timeframe: 'Day 5-7',
      description: 'Revocation application submitted with explanation of default and confirmation that all returns are now current.',
      milestone: 'Revocation application filed',
    },
    {
      step: 4,
      title: 'GST registration restored',
      timeframe: 'Day 7-10',
      description: 'Officer reviews and restores the registration.',
      milestone: 'GSTIN active',
    },
  ],

  included: [
    {
      title: 'All pending returns filed',
      description: 'Every outstanding GSTR-1 and GSTR-3B cleared. Interest on late payment calculated and paid before revocation application.',
    },
    {
      title: 'REG-21 revocation application',
      description: 'Revocation request with explanation of the default and confirmation that returns are now current.',
    },
    {
      title: 'Interest calculation upfront',
      description: 'Exact interest liability on late-deposited tax calculated before filing so you know the total amount.',
    },
  ],

  risks: [
    {
      title: '30-day window from cancellation date',
      description: 'Revocation must be applied for within 30 days of the cancellation order. After that, you must file an appeal with the Appellate Authority - longer and more complex. Act immediately.',
    },
    {
      title: 'All pending returns must be filed first',
      description: 'The department will not process REG-21 unless all outstanding returns are filed and tax with interest paid.',
    },
  ],

  personas: [
    {
      title: 'GST cancelled for non-filing',
      description: 'Missed returns for 6+ months, registration cancelled suo-moto. All returns cleared and registration restored.',
    },
    {
      title: 'Need to continue invoicing clients urgently',
      description: 'GSTIN required for ongoing business operations. We treat this as urgent from day one.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'Why was my GST registration cancelled?',
      a: 'Suo-moto cancellation is triggered after 6 or more consecutive months of non-filing of GSTR-3B. The department issues a notice, then a show-cause notice, and finally a cancellation order.',
    },
    {
      category: 'General',
      q: 'What is the time limit for revocation?',
      a: '30 days from the date of the cancellation order. This is the standard window. Extensions of up to 30 more days can be granted by the Commissioner for sufficient cause - but do not rely on this. Apply immediately.',
    },
    {
      category: 'General',
      q: 'Can I raise GST invoices while revocation is pending?',
      a: 'No. Your GSTIN is invalid until restored. Any invoices raised during this period cannot be used by your clients to claim ITC, and you face legal exposure for issuing invoices on a cancelled registration.',
    },
    {
      category: 'General',
      q: 'What if I missed the 30-day window?',
      a: 'You must file an appeal with the Appellate Authority under GST. This is a formal legal process that takes longer and requires specific grounds for delay. Our team handles this but it is more involved than a standard revocation.',
    },
    {
      category: 'General',
      q: 'How much will I owe in late fees and interest?',
      a: 'Rs. 50/day per return for non-nil returns (Rs. 20 for nil), capped at Rs. 10,000 per return. Plus 18% per annum interest on any unpaid tax from the original due date. We calculate the exact amount before you commit.',
    },
  ],

  govtFees: {
    caption: 'Costs Involved - GST Revocation',
    headers: ['Item', 'Amount', 'Notes'],
    rows: [
      ['REG-21 revocation application', 'Nil', 'No government fee'],
      ['Pending GSTR-1 late fee (non-nil)', 'Rs. 50/day per return, capped at Rs. 10,000', 'Must be paid before REG-21 is accepted'],
      ['Pending GSTR-3B late fee (non-nil)', 'Rs. 50/day per return, capped at Rs. 10,000', 'Must be paid before REG-21 is accepted'],
      ['Interest on unpaid tax', '18% per annum from original due date', 'Accrues daily - calculated before filing'],
    ],
  },

  documents: {
    caption: 'Documents Required - GST Revocation',
    headers: ['Document', 'Required', 'Notes'],
    rows: [
      ['GST cancellation order', 'Yes', 'Date of cancellation determines the 30-day window'],
      ['Reason for non-compliance', 'Yes (REG-21)', 'Explanation of why returns were missed'],
      ['Proof of pending returns filed', 'Yes', 'ARN for all cleared GSTR-1 and GSTR-3B'],
      ['Proof of tax and interest paid', 'Yes', 'Challans showing all outstanding amounts cleared'],
      ['GST portal credentials', 'Yes', 'For filing pending returns and REG-21'],
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
    whatItIs: 'DIN Reactivation restores a Director Identification Number deactivated for non-filing of DIR-3 KYC by September 30. It involves filing all outstanding DIR-3 KYC forms, paying the Rs. 5,000 late fee per missed year, and submitting a DIR-3C reactivation application.',
    whyYouNeedIt: 'A deactivated DIN means you cannot sign any company filing, resolution, or official document. Every company where you hold a directorship is blocked from filing any MCA form - AOC-4, MGT-7, or any other - until your DIN is restored.',
    whatHappensWithout: 'All companies where you are a director cannot file their annual returns or any MCA form. Penalty of Rs. 100/day per form continues to accrue on missed MCA filings. Those companies can be marked as Default on MCA - visible to anyone doing due diligence.',
  },

  workflow: [
    {
      step: 1,
      title: 'Check deactivation reason and years outstanding',
      timeframe: 'Day 0-1',
      description: 'DIN status verified on MCA21. Years of outstanding DIR-3 KYC identified.',
      milestone: 'Outstanding years confirmed',
    },
    {
      step: 2,
      title: 'File all pending DIR-3 KYC',
      timeframe: 'Day 1-5',
      description: 'DIR-3 KYC filed for each outstanding year. Aadhaar OTP verification required for each filing. Rs. 5,000 late fee applies per year.',
      milestone: 'All KYC filings cleared',
    },
    {
      step: 3,
      title: 'DIR-3C reactivation application',
      timeframe: 'Day 5-7',
      description: 'Reactivation form filed with MCA.',
      milestone: 'Reactivation application submitted',
    },
    {
      step: 4,
      title: 'DIN reactivated',
      timeframe: 'Day 7-10',
      description: 'DIN status changed to Active on MCA21. All directorial rights and MCA filing access restored across all companies.',
      milestone: 'DIN active',
    },
  ],

  included: [
    {
      title: 'All outstanding DIR-3 KYC filed',
      description: 'Every year of missed KYC cleared. Aadhaar OTP verification coordinated in real time.',
    },
    {
      title: 'DIR-3C reactivation application',
      description: 'Reactivation form submitted to MCA.',
    },
    {
      title: 'All directorships unblocked',
      description: 'One DIN reactivation unblocks every company where you are a director. We verify all directorships are restored.',
    },
  ],

  risks: [
    {
      title: 'Rs. 5,000 per year of missed KYC',
      description: 'Government late fee of Rs. 5,000 per year is fixed and non-negotiable. 3 years of missed KYC = Rs. 15,000 in late fees, payable to MCA.',
    },
    {
      title: 'Aadhaar-linked mobile must be active',
      description: 'DIR-3 KYC requires Aadhaar OTP for each year\'s filing. If the mobile linked to Aadhaar is inactive, it must be updated at an Aadhaar enrolment centre before filing.',
    },
    {
      title: 'All directorships blocked until DIN is active',
      description: 'The impact is not limited to one company. Every company where you are a director is blocked from MCA filing until your DIN is restored.',
    },
  ],

  personas: [
    {
      title: 'Missed DIR-3 KYC for one or more years',
      description: 'DIN deactivated on October 1 after missing the September 30 deadline. Act before your companies miss their MCA filing deadlines.',
    },
    {
      title: 'Director in multiple companies',
      description: 'One DIN reactivation restores all directorships. We verify the MCA status of all companies is unblocked.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'Why was my DIN deactivated?',
      a: 'DINs deactivate automatically on October 1 every year when DIR-3 KYC is not filed by September 30. This is an automated MCA process - no individual notice is sent.',
    },
    {
      category: 'General',
      q: 'What is the late fee for DIR-3 KYC?',
      a: 'Rs. 5,000 per financial year of missed KYC. This is a fixed government fee - it cannot be reduced or waived. 2 years missed = Rs. 10,000; 3 years = Rs. 15,000.',
    },
    {
      category: 'General',
      q: 'How long does DIN reactivation take?',
      a: '10 working days from when we receive your documents and complete the Aadhaar OTP verifications.',
    },
    {
      category: 'General',
      q: 'Does reactivation fix the issue for all companies where I am a director?',
      a: 'Yes. Your DIN is a single identifier across all directorships. Reactivating it restores your signing authority and MCA filing access across every company where you hold a position.',
    },
    {
      category: 'General',
      q: 'What if I have active DIR-3 KYC (with verified mobile and email on MCA)?',
      a: 'If your mobile and email are already verified on MCA from a previous filing, you may be eligible for DIR-3 KYC-Web (the online version) which has no fee and takes 2 minutes. We check your MCA status before recommending the approach.',
    },
    {
      category: 'General',
      q: 'Can I prevent DIN deactivation in future?',
      a: 'Yes. File DIR-3 KYC every year by September 30. It takes 15 minutes. If your mobile and email are verified on MCA, you use DIR-3 KYC-Web - a 2-minute web form with no late fee. Your Ollvy compliance calendar shows this deadline.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - DIN Reactivation',
    headers: ['Item', 'Fee', 'Notes'],
    rows: [
      ['DIR-3 KYC late fee (per year)', 'Rs. 5,000', 'Fixed government fee; paid per financial year of missed KYC'],
      ['DIR-3C reactivation form', 'Included in KYC late fee', 'No separate filing fee for the reactivation form'],
      ['Example: 1 year missed', 'Rs. 5,000 total', ''],
      ['Example: 2 years missed', 'Rs. 10,000 total', ''],
      ['Example: 3 years missed', 'Rs. 15,000 total', ''],
    ],
  },

  documents: {
    caption: 'Documents Required - DIN Reactivation',
    headers: ['Document', 'Required', 'Notes'],
    rows: [
      ['Director PAN card', 'Yes', 'For identity in DIR-3 KYC'],
      ['Director Aadhaar card', 'Yes', 'OTP sent to Aadhaar-linked mobile - must be active'],
      ['Mobile linked to Aadhaar', 'Yes - must be active', 'OTP required for each year\'s KYC filing'],
      ['Email address', 'Yes', 'For DIR-3 KYC email OTP verification'],
      ['Passport photo', 'Yes', 'Current photo for KYC filing'],
      ['DIN number', 'Yes', 'The deactivated DIN to be restored'],
    ],
  },
}


// ─── 13. Company Name Change ──────────────────────────────────────────────────

export const companyNameChange: ServicePageConfig = {
  slug: 'company-name-change',
  title: 'Company Name Change',
  tagline: 'New name. Same company. Same CIN, PAN, and TAN.',
  seoTitle: 'Company Name Change MCA India 2025 | INC-24 and RUN Filing | Ollvy',
  seoDescription: 'Change your Pvt Ltd company name with MCA in 20 working days. Special resolution, RUN filing, INC-24, MOA amendment, new Certificate of Incorporation.',
  canonicalUrl: 'https://www.ollvy.com/services/company-name-change',
  lastReviewed: 'April 2026',
  category: 'Compliance',

  relatedServiceSlugs: ['pvt-ltd-incorporation', 'mca-annual-filing', 'trademark-registration'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp'],

  explainer: {
    whatItIs: 'A company name change under Section 13 of the Companies Act, 2013 involves a special resolution of shareholders, reserving the new name via RUN, amending the Memorandum of Association, and filing INC-24 with MCA. MCA issues a new Certificate of Incorporation with the updated name.',
    whyYouNeedIt: 'If you are rebranding, pivoting, or resolving a name conflict, the legal name must be changed through MCA. Using a trading name different from your registered name creates inconsistencies in contracts, invoices, and bank records - and raises red flags in due diligence.',
    whatHappensWithout: 'Operating under a name different from your MCA-registered name creates legal and commercial inconsistencies. Bank accounts, GST, trademark, and other registrations remain in the old name. Counterparties doing due diligence will find the mismatch.',
  },

  workflow: [
    {
      step: 1,
      title: 'Name availability check',
      timeframe: 'Day 0-2',
      description: 'New name searched against MCA company registry and trademark database. Conflicts identified before any filing.',
      milestone: 'Name confirmed available',
    },
    {
      step: 2,
      title: 'Board and shareholder resolution',
      timeframe: 'Day 2-7',
      description: 'Special resolution of shareholders required (75% majority). Board resolution and EGM notice drafted.',
      milestone: 'Special resolution passed',
    },
    {
      step: 3,
      title: 'RUN filed',
      timeframe: 'Day 7-12',
      description: 'Reserve Unique Name application submitted to MCA.',
      milestone: 'New name reserved',
    },
    {
      step: 4,
      title: 'INC-24 filed with MOA amendment',
      timeframe: 'Day 12-18',
      description: 'Name change application filed with amended Memorandum of Association.',
      milestone: 'INC-24 submitted',
    },
    {
      step: 5,
      title: 'New Certificate of Incorporation issued',
      timeframe: 'Day 18-20',
      description: 'Fresh Certificate with new company name issued by MCA. CIN, PAN, and TAN remain unchanged.',
      milestone: 'Name change complete',
    },
  ],

  included: [
    {
      title: 'Name availability search',
      description: 'MCA registry and trademark database checked before filing to minimise rejection risk.',
    },
    {
      title: 'Special resolution drafting',
      description: 'Shareholder special resolution, board resolution, and EGM notice drafted per Companies Act requirements.',
    },
    {
      title: 'MOA amendment',
      description: 'Clause I (name clause) of the Memorandum of Association updated with the new name.',
    },
    {
      title: 'New Certificate of Incorporation',
      description: 'Fresh certificate issued by MCA. CIN, PAN, TAN remain unchanged.',
    },
  ],

  risks: [
    {
      title: 'Downstream registrations must be updated separately',
      description: 'The MCA name change does not cascade to GST (core amendment needed), bank accounts, trademark, import-export code, or FSSAI. Each requires a separate update process.',
    },
    {
      title: 'Trademark conflict',
      description: 'If someone has registered a similar trademark, MCA may reject the name or you may receive a legal notice post-change. Our trademark search reduces this risk.',
    },
  ],

  personas: [
    {
      title: 'Rebranding',
      description: 'New brand identity. Legal name aligned with the new brand across all MCA records.',
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
      a: '20 working days from start to new Certificate of Incorporation - subject to MCA processing time.',
    },
    {
      category: 'General',
      q: 'Does PAN or GST change when I change the company name?',
      a: 'PAN and TAN remain the same. GST requires a core amendment (name update) on the GSTN portal - a separate process but straightforward. Bank accounts, trademark, and other registrations must also be updated separately.',
    },
    {
      category: 'General',
      q: 'Do I need a special resolution for a name change?',
      a: 'Yes. A special resolution requires 75% of shareholders voting in favour. It can be passed at an Extraordinary General Meeting (EGM) or through postal ballot.',
    },
    {
      category: 'General',
      q: 'Can I change the name to anything?',
      a: 'Subject to MCA availability: the name must be distinct from all existing company and LLP names, not contain restricted words (Bank, Insurance, Exchange, etc.), and ideally not conflict with registered trademarks.',
    },
    {
      category: 'General',
      q: 'What happens to existing contracts when the company name changes?',
      a: 'Existing contracts remain valid - the CIN (Company Identification Number) does not change, only the name. However, going forward you should use the new name in all agreements and notify key counterparties of the change.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - Company Name Change (2025)',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['RUN (Reserve Unique Name)', 'Rs. 1,000', 'Name reservation valid for 60 days from approval'],
      ['INC-24 filing fee', 'Rs. 1,200-56,000', 'Based on paid-up capital per MCA fee schedule; Rs. 1,200 for up to Rs. 1 lakh capital'],
      ['Stamp duty on amended MOA', 'Varies by state', 'New MOA must be printed on stamp paper; varies significantly by state'],
      ['GST core amendment (post name change)', 'Nil', 'Name update on GSTN portal is free but must be done'],
      ['Typical total govt fee', 'Rs. 3,000-8,000', 'Company with paid-up capital up to Rs. 25 lakh'],
    ],
  },

  documents: {
    caption: 'Documents Required - Company Name Change',
    headers: ['Document', 'Required', 'Notes'],
    rows: [
      ['Board resolution recommending name change', 'Yes', 'Passed by Board of Directors'],
      ['EGM notice to shareholders', 'Yes', '21 days notice required unless shorter notice is consented to'],
      ['Special resolution of shareholders', 'Yes', '75%+ majority; minutes of EGM or postal ballot results'],
      ['Amended Memorandum of Association', 'Yes', 'Clause I updated with new name; stamped per state stamp duty'],
      ['RUN approval from MCA', 'Yes', 'Obtained in Step 3 before filing INC-24'],
      ['Certificate of Incorporation (existing)', 'Yes', 'Current CI; surrendered to MCA as part of name change'],
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

  relatedServiceSlugs: ['gst-registration', 'gst-monthly-50l', 'msme-registration'],
  relatedLearnSlugs: ['do-i-need-fssai-license', 'do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'Cloud Kitchen Setup is a bundled service covering all mandatory licences for a delivery-only commercial kitchen: FSSAI Licence (Basic, State, or Central based on turnover), GST Registration, and local trade/health licence from your municipal authority.',
    whyYouNeedIt: 'Swiggy, Zomato, and all major food delivery platforms require a valid FSSAI licence number at onboarding - you cannot list without it. Without GST registration, you cannot issue compliant invoices or claim ITC on kitchen equipment and supplies. Operating without a trade licence risks closure notices.',
    whatHappensWithout: 'Cannot list on food delivery platforms - the primary revenue channel for cloud kitchens. FSSAI penalty for operating without a licence: up to Rs. 5 lakh (Section 63, Food Safety and Standards Act). Food safety officers can seal unlicensed premises and seize stock without a court order.',
  },

  workflow: [
    {
      step: 1,
      title: 'Business details and kitchen address',
      timeframe: 'Day 0',
      description: 'Turnover, kitchen area, menu category, GST status, city. We determine the correct FSSAI licence type and local authority requirements for your specific location.',
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
      description: 'FSSAI Form B filed on the FSSAI portal. GST REG-01 filed simultaneously if not already registered. ARNs shared same day.',
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
      description: 'State and Central FSSAI licences require a physical inspection. We provide a pre-inspection checklist: pest control certificate, water test report, equipment hygiene, food safety plan.',
      milestone: 'Inspection completed',
    },
    {
      step: 6,
      title: 'All licences issued',
      timeframe: 'Day 10-21',
      description: 'FSSAI licence number, GSTIN, and trade licence received. All uploaded to your account.',
      milestone: 'Kitchen ready to list on platforms',
    },
  ],

  included: [
    {
      title: 'FSSAI licence - correct type determined upfront',
      description: 'Basic (below Rs. 12 lakh), State (Rs. 12 lakh to Rs. 20 crore), or Central (above Rs. 20 crore or multi-state). We confirm the type before you pay the government fee.',
      without: 'Apply for wrong licence type, get rejected, restart process',
      withOllvy: 'Correct licence type confirmed upfront based on your turnover and operation',
    },
    {
      title: 'GST registration',
      description: 'Full GST registration including CA assignment, document verification, and ARN tracking. Included in the bundle.',
    },
    {
      title: 'Local trade/health licence',
      description: 'Filed with your municipal authority. Different requirements for Delhi (MCD), Mumbai (BMC), Bangalore (BBMP), and other cities - we handle your specific city.',
    },
    {
      title: 'Pre-inspection checklist',
      description: 'For State and Central FSSAI licences, we provide a checklist of what inspectors check: pest control certificate, water testing, equipment hygiene labels, food safety plan.',
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
      description: 'State and Central licences require physical inspection. Common failure points: no pest control certificate, missing water quality test report, equipment without hygiene labels. Our pre-inspection checklist addresses all standard failure points.',
    },
    {
      title: 'Wrong FSSAI licence type',
      description: 'Basic Registration when you need State Licence gets rejected by platforms. We verify turnover and operation type before filing.',
    },
    {
      title: 'Trade licence requirements vary by city',
      description: 'Each municipal authority has different documents, fees, and timelines. Delhi (MCD), Mumbai (BMC), Bangalore (BBMP) are all different. We apply for the correct licence from the correct authority.',
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
      description: 'New kitchen in a new city. Fresh local licences required for each location. We handle the city-specific requirements.',
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
      a: 'Pest control certificate, water quality test report, equipment hygiene labels (manufacturer, use-by date), food safety plan, storage conditions, kitchen cleanliness, and waste disposal setup. We send you a pre-inspection checklist covering all standard points.',
    },
    {
      category: 'General',
      q: 'Is GST mandatory for a cloud kitchen?',
      a: 'Mandatory once turnover crosses Rs. 20 lakh (services threshold, which applies to restaurants and food businesses). Voluntary registration is possible below this threshold and recommended if you want to claim ITC on kitchen equipment, packaging, and supplies.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - Cloud Kitchen Setup (All Licences)',
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
    caption: 'Documents Required - Cloud Kitchen Setup',
    headers: ['Document', 'FSSAI', 'GST', 'Trade Licence'],
    rows: [
      ['PAN card (owner or entity)', 'Yes', 'Yes', 'Yes'],
      ['Aadhaar card', 'Yes', 'Yes', 'Yes'],
      ['Address proof (owner)', 'Yes', 'Yes', 'Yes'],
      ['Kitchen electricity bill', 'Yes', 'Yes (business address)', 'Yes'],
      ['Rent agreement or ownership proof', 'Yes', 'NOC if rented', 'Yes'],
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

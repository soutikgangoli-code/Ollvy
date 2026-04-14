import type { ServicePageConfig } from '../types'

// ─── 3. GST Registration ──────────────────────────────────────────────────────

export const gstRegistration: ServicePageConfig = {
  slug: 'gst-registration',
  title: 'GST Registration',
  tagline: 'Your GSTIN, applied and obtained. ARN within 24 hours of filing.',
  seoTitle: 'GST Registration Online in India 2025 | Get GSTIN in 7 Days | Ollvy',
  seoDescription: 'GST registration in 7 working days. Ollvy CA assigned same day, ARN in 24 hours. No govt fee. Mandatory above Rs. 20 lakh turnover for services.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-registration',
  lastReviewed: 'April 2026',
  category: 'GST',

  relatedServiceSlugs: ['gst-monthly-50l', 'pvt-ltd-incorporation', 'gst-cancellation'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'GST registration gives you a 15-digit GSTIN under the CGST Act, 2017. It authorises you to collect GST from customers, claim Input Tax Credit on purchases, and file GST returns.',
    whyYouNeedIt: 'Mandatory if your aggregate turnover exceeds Rs. 40 lakh for goods (Rs. 20 lakh for services, Rs. 10 lakh in special category states), for any interstate supply, or if you sell on any e-commerce platform. Even below the threshold, being registered lets B2B clients claim ITC on your invoices.',
    whatHappensWithout: 'Operating without mandatory registration is tax evasion. Penalty is 100% of tax due or Rs. 10,000, whichever is higher. You cannot claim ITC on purchases, cannot generate e-way bills, and platforms like Amazon and Flipkart will not onboard you.',
  },

  workflow: [
    {
      step: 1,
      title: 'Answer 5 questions - we build your checklist',
      timeframe: 'Day 0',
      description: 'Business type, state, turnover estimate, supply type (goods/services/both). Ollvy CA assigned within 4 hours. They generate your specific document checklist - not the standard 20-item government list.',
      milestone: 'Ollvy CA assigned, personalised checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeframe: 'Day 0-1',
      description: 'Ollvy CA reviews every document before filing - blurry Aadhaar, address mismatch, wrong format caught here, not after the officer raises a query.',
      milestone: 'Documents verified by Ollvy CA',
    },
    {
      step: 3,
      title: 'Application filed - ARN in 24 hours',
      timeframe: 'Day 1-2',
      description: 'Ollvy CA files GST REG-01 on the GSTN portal. ARN generated immediately on submission and shared in your app the same day. Verify status yourself at gstn.gov.in.',
      milestone: 'ARN generated and sent to your app',
    },
    {
      step: 4,
      title: 'Officer query handled if applicable',
      timeframe: 'Day 3-5',
      description: 'GST officers request clarifications in approximately 20% of cases, typically for Aadhaar verification or address proof. Ollvy CA responds within 24 hours. Included in scope.',
      milestone: 'Query responded',
    },
    {
      step: 5,
      title: 'GSTIN issued',
      timeframe: 'Day 5-7',
      description: 'Permanent - no renewal, no expiry as long as you file returns. Compliance calendar updated with your first GSTR-1 and GSTR-3B due dates.',
      milestone: 'GSTIN active on GSTN portal',
    },
  ],

  included: [
    {
      title: 'Ollvy CA handles the GSTN portal - all 23 fields',
      description: 'GST REG-01 has 23 fields across 5 tabs. Ollvy CA completes the entire form. You answer 5 questions in the app.',
      without: '23 fields, 5 tabs, 3-4 hours on the government portal',
      withOllvy: '5 questions, approximately 4 minutes in the app',
    },
    {
      title: 'ARN shared same day - track it yourself',
      description: 'ARN is generated on submission and shared immediately. Verify status on gstn.gov.in yourself - you do not have to wait for updates from us.',
    },
    {
      title: 'Officer queries handled - no extra charge',
      description: 'If the GST officer requests clarification, Ollvy CA responds within 24 hours. Part of the service, not a separate charge.',
    },
    {
      title: 'Compliance calendar updated automatically',
      description: 'GSTR-1 (11th of each month) and GSTR-3B (20th of each month) due dates appear in your calendar the moment GSTIN is issued.',
    },
  ],

  risks: [
    {
      title: 'Address proof mismatch',
      description: 'The business address on all documents must match exactly - building name, floor, area, and PIN code. Your Ollvy CA checks every document for consistency before filing.',
    },
    {
      title: 'Aadhaar OTP failure',
      description: 'GST registration requires Aadhaar-based authentication. If the mobile linked to Aadhaar is old or inactive, OTP fails. This must be fixed at an Aadhaar enrolment centre. We verify this upfront.',
    },
    {
      title: 'Already past threshold without registration',
      description: 'If turnover has crossed the mandatory limit and you are not yet registered, you are liable for 100% of unpaid tax plus Rs. 10,000 minimum penalty. Registering now stops the liability from growing.',
    },
  ],

  personas: [
    {
      title: 'First GST registration',
      description: 'Never registered before. We explain what each document is for and why it is needed.',
    },
    {
      title: 'Turnover just crossed threshold',
      description: 'You waited until legally required. We register you quickly to stop penalty exposure.',
    },
    {
      title: 'Voluntary registration',
      description: 'Below threshold but want to issue GST invoices to B2B clients for ITC. Completely legal.',
    },
    {
      title: 'Home as principal place of business',
      description: 'Fully legal. We verify your electricity bill matches your application before filing.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'When is GST registration mandatory?',
      a: 'When aggregate turnover crosses Rs. 40 lakh for goods (Rs. 20 lakh for services, Rs. 10 lakh in special category states like Manipur, Mizoram, Nagaland, Tripura). Also mandatory for any interstate supply regardless of turnover, and for all e-commerce sellers from day one.',
    },
    {
      category: 'General',
      q: 'What is the government fee for GST registration?',
      a: 'Nil. There is no government fee for GST registration. The only cost is the professional fee for filing.',
    },
    {
      category: 'General',
      q: 'Can I register voluntarily if I am below the threshold?',
      a: 'Yes. Voluntary registration lets you issue GST invoices and claim ITC on purchases. Cannot be cancelled for at least one year from the date of registration.',
    },
    {
      category: 'General',
      q: 'I sell on Instagram. Do I need GST?',
      a: 'Direct selling via social media is not e-commerce under GST law - the e-commerce provision applies only to platforms that facilitate the transaction (Amazon, Swiggy). Social selling is treated as direct sale, so the turnover threshold applies normally.',
    },
    {
      category: 'General',
      q: 'I make interstate sales but my turnover is only Rs. 5 lakh. Do I need GST?',
      a: 'Yes. Section 24 of the CGST Act mandates registration for any interstate supply - there is no turnover threshold for this. Even one sale to a customer in another state triggers mandatory registration.',
    },
    {
      category: 'Process',
      q: 'What is an ARN and why does it matter?',
      a: 'Application Reference Number - generated the moment your application is submitted. You can track processing status on the GSTN portal yourself at gstn.gov.in using the ARN without waiting for updates from us.',
    },
    {
      category: 'Process',
      q: 'What if the officer raises a query?',
      a: 'Ollvy CA responds within 24 hours. Included in the service at no extra charge. Most queries are resolved in one reply.',
    },
    {
      category: 'After Completion',
      q: 'What returns must I file after getting GSTIN?',
      a: 'GSTR-1 by 11th of every month (outward supplies), GSTR-3B by 20th (net tax payment and ITC claim). Nil returns required even when there are no transactions. GSTR-9 annual return by December 31. All deadlines in your Ollvy compliance calendar.',
    },
    {
      category: 'After Completion',
      q: 'What is the penalty for not filing GST returns?',
      a: 'Rs. 50 per day per return (Rs. 25 CGST + Rs. 25 SGST) for non-nil returns, capped at Rs. 10,000 per return. Rs. 20 per day for nil returns, capped at Rs. 500. Plus 18% annual interest on any unpaid tax.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - GST Registration',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['GST registration application (REG-01)', 'Nil', 'No government fee for registration'],
      ['Penalty if registering late (turnover above threshold)', 'Rs. 10,000 minimum or 100% of unpaid tax', 'Whichever is higher - stops accruing once registered'],
      ['Late filing fee after registration (non-nil returns)', 'Rs. 50/day per return, capped at Rs. 10,000', 'Rs. 25 CGST + Rs. 25 SGST per day per return'],
      ['Late filing fee (nil returns)', 'Rs. 20/day per return, capped at Rs. 500', 'Rs. 10 CGST + Rs. 10 SGST per day per return'],
    ],
  },

  documents: {
    caption: 'Documents Required - GST Registration',
    headers: ['Document', 'Sole Proprietor / Individual', 'Pvt Ltd / LLP'],
    rows: [
      ['PAN card', 'Owner PAN', 'Company / LLP PAN'],
      ['Aadhaar card', 'Owner Aadhaar (OTP required)', 'Not required at entity level'],
      ['Address proof (business)', 'Electricity bill (not older than 2 months)', 'Electricity bill (not older than 2 months)'],
      ['NOC from property owner', 'If premises is rented', 'If premises is rented'],
      ['Bank account proof', 'Cancelled cheque or 3-month bank statement', 'Cancelled cheque or bank statement'],
      ['Business registration proof', 'Not required (proprietorship)', 'Certificate of Incorporation or LLP agreement'],
      ['Director/partner PAN', 'Not applicable', 'All directors or designated partners'],
      ['Board resolution', 'Not required', 'Authorising a director to apply'],
      ['Passport photo', 'Owner photo', 'Authorised signatory photo'],
    ],
  },
}


// ─── 4. GST Monthly Filing ────────────────────────────────────────────────────

export const gstMonthlyFiling: ServicePageConfig = {
  slug: 'gst-monthly-50l',
  title: 'GST Monthly Filing',
  tagline: 'GSTR-1 by the 11th. GSTR-3B by the 20th. Every month.',
  seoTitle: 'GST Return Filing Service India 2025 | GSTR-1 & GSTR-3B | Ollvy',
  seoDescription: 'Monthly GST filing handled by an Ollvy CA. GSTR-1 by the 11th, GSTR-3B by the 20th, ITC reconciled every cycle. Cancel anytime.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-monthly-50l',
  lastReviewed: 'April 2026',
  category: 'GST',

  relatedServiceSlugs: ['gst-registration', 'gst-cancellation', 'business-itr', 'tds-monthly-compliance'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'Monthly GST compliance means filing GSTR-1 (outward supplies, due 11th) and GSTR-3B (net tax payment, due 20th) every month. GSTR-1 reports every sales invoice. GSTR-3B calculates your tax liability, deducts eligible Input Tax Credit, and records your payment to the government.',
    whyYouNeedIt: 'All regular GST-registered taxpayers must file every month, including nil returns when there are no transactions. Consecutive missed filings trigger e-way bill suspension, then registration suspension, then suo-moto cancellation. Your customers cannot claim ITC on your invoices until you file.',
    whatHappensWithout: 'Late filing fee of Rs. 50 per day per return (Rs. 20 for nil returns). Interest at 18% per annum on unpaid tax. E-way bill generation blocked after two consecutive missed filings. Registration cancelled after 6 months of non-filing.',
  },

  workflow: [
    {
      step: 1,
      title: 'Share your GST credentials',
      timeframe: 'Day 0',
      description: 'Read-only access to your GST portal. Ollvy CA reviews your filing history and is assigned to your account permanently.',
      milestone: 'Ollvy CA assigned to your account',
    },
    {
      step: 2,
      title: 'Upload sales invoices and purchase data',
      timeframe: 'By 8th of each month',
      description: 'Sales invoices and purchase register. Tally, Zoho, or any accounting software export takes 2 minutes.',
      milestone: 'Data received for the month',
    },
    {
      step: 3,
      title: 'GSTR-1 filed by the 11th',
      timeframe: '9th-11th',
      description: 'Ollvy CA files all outward supply invoices. Acknowledgement shared in your app.',
      milestone: 'GSTR-1 filed',
    },
    {
      step: 4,
      title: 'GSTR-3B filed by the 20th',
      timeframe: '18th-20th',
      description: 'Ollvy CA prepares the summary return, verifies ITC claims against GSTR-2B, calculates net tax liability, and files. Challan generated.',
      milestone: 'GSTR-3B filed',
    },
    {
      step: 5,
      title: 'Monthly compliance report',
      timeframe: '21st-25th',
      description: 'What was filed, when, acknowledgement numbers, ITC claimed, tax paid.',
      milestone: 'Report delivered',
    },
  ],

  included: [
    {
      title: 'GSTR-1 - outward supply return',
      description: 'All B2B invoices, B2C sales above Rs. 2.5 lakh, and export invoices reported. Filed by the 11th.',
    },
    {
      title: 'GSTR-3B - net tax payment return',
      description: 'Output tax calculated, eligible ITC deducted, return filed, challan generated.',
    },
    {
      title: 'ITC reconciliation with GSTR-2B',
      description: 'ITC claimed is matched against GSTR-2B before filing. Mismatches flagged.',
      without: 'Claim ITC without verification, receive a demand notice later',
      withOllvy: 'ITC verified against GSTR-2B every cycle before filing',
    },
    {
      title: 'Monthly compliance report',
      description: 'Filed returns, acknowledgement numbers, ITC summary, and tax paid - delivered after every cycle.',
    },
  ],

  risks: [
    {
      title: 'Data must be shared by the 8th',
      description: 'Late fee accumulates from the 12th for GSTR-1 and 21st for GSTR-3B. Rs. 50/day per return on non-nil returns. We file the moment data is ready.',
    },
    {
      title: 'GSTR-1 and GSTR-3B figures must match',
      description: 'Discrepancies between the two returns are flagged automatically by GSTN. We file both from the same data set.',
    },
    {
      title: 'Vendor not filed = ITC blocked',
      description: 'If your vendor has not filed their GSTR-1, their invoices do not appear in your GSTR-2B. We check before claiming - you are not exposed to a mismatch notice.',
    },
  ],

  personas: [
    {
      title: 'Switching from another CA',
      description: 'Seamless takeover. We review your filing history before the first cycle.',
    },
    {
      title: 'Multiple GSTINs',
      description: 'Multiple states, multiple registrations. All handled under one retainer.',
    },
    {
      title: 'Previous CA stopped responding',
      description: 'We work to SLA every month. Acknowledgement numbers delivered same day as filing.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'What does the monthly retainer cover?',
      a: 'GSTR-1 by the 11th, GSTR-3B by the 20th, ITC reconciliation against GSTR-2B every cycle, and a monthly compliance report with filing acknowledgements.',
    },
    {
      category: 'General',
      q: 'Can I cancel anytime?',
      a: 'Yes. No minimum term. Cancel before the 1st of any month and you will not be charged for that cycle.',
    },
    {
      category: 'General',
      q: 'What is GSTR-2B and why does it matter?',
      a: 'GSTR-2B is an auto-drafted statement that shows the ITC available to you based on what your suppliers have filed. Claiming ITC that is not reflected in GSTR-2B invites a demand notice. We reconcile against GSTR-2B before every GSTR-3B filing.',
    },
    {
      category: 'Process',
      q: 'What data do I need to share each month?',
      a: 'Sales invoices and purchase register. If you use Tally, Zoho, or any accounting software, the export takes 2 minutes. We also handle nil returns when there are no transactions.',
    },
    {
      category: 'Process',
      q: 'What if I have no transactions in a month?',
      a: 'Nil GSTR-1 and GSTR-3B must still be filed. We handle nil returns as part of the retainer at no extra charge.',
    },
    {
      category: 'General',
      q: 'What is the penalty for missing GSTR-3B?',
      a: 'Rs. 50 per day (Rs. 25 CGST + Rs. 25 SGST) for non-nil returns, capped at Rs. 10,000. Plus 18% per annum interest on any unpaid tax from the due date. Nil return late fee is Rs. 20/day, capped at Rs. 500.',
    },
  ],

  govtFees: {
    caption: 'Government Late Fees - GST Monthly Filing (per missed return)',
    headers: ['Return', 'Late Fee (Non-Nil)', 'Late Fee (Nil Return)', 'Cap'],
    rows: [
      ['GSTR-1', 'Rs. 50/day (Rs. 25 CGST + Rs. 25 SGST)', 'Rs. 20/day (Rs. 10 + Rs. 10)', 'Rs. 10,000 per return (nil: Rs. 500)'],
      ['GSTR-3B', 'Rs. 50/day (Rs. 25 CGST + Rs. 25 SGST)', 'Rs. 20/day (Rs. 10 + Rs. 10)', 'Rs. 10,000 per return (nil: Rs. 500)'],
      ['Interest on unpaid tax', '18% per annum on outstanding amount', 'Not applicable for nil returns', 'Accrues daily - no cap'],
      ['Both returns missed (1 month)', 'Rs. 100/day combined (both returns)', 'Rs. 40/day combined', 'Rs. 20,000 combined cap (nil: Rs. 1,000)'],
    ],
  },

  documents: {
    caption: 'Data Required Each Month - GST Filing',
    headers: ['Data / Document', 'Required For', 'Format'],
    rows: [
      ['Sales invoices', 'GSTR-1', 'Excel, Tally export, or accounting software export'],
      ['Purchase invoices / purchase register', 'ITC reconciliation (GSTR-2B matching)', 'Excel or accounting software export'],
      ['GST portal credentials (read-only)', 'Filing', 'Shared once at onboarding; not required monthly'],
      ['Bank statement (for high-value B2C)', 'GSTR-1 (B2C consolidated)', 'For verifying B2C sales above Rs. 2.5 lakh'],
    ],
  },
}


// ─── 5. Business ITR Filing ───────────────────────────────────────────────────

export const businessItr: ServicePageConfig = {
  slug: 'business-itr',
  title: 'Business ITR Filing',
  tagline: 'ITR-6 for Pvt Ltd. ITR-5 for LLP. Filed correctly, on time.',
  seoTitle: 'Business ITR Filing India 2025 | Company & LLP Income Tax Return | Ollvy',
  seoDescription: 'Annual income tax return for Pvt Ltd (ITR-6) and LLP (ITR-5). Due October 31. Includes depreciation review, draft approval, and ITR-V same day.',
  canonicalUrl: 'https://www.ollvy.com/services/business-itr',
  lastReviewed: 'April 2026',
  category: 'Tax',

  relatedServiceSlugs: ['mca-annual-filing', 'tds-monthly-compliance', 'gst-monthly-50l'],
  relatedLearnSlugs: ['do-i-need-to-file-itr', 'which-itr-form-should-i-use'],

  explainer: {
    whatItIs: 'Business ITR is the annual income tax return filed by companies (ITR-6) and LLPs or partnerships (ITR-5) under Section 139 of the Income Tax Act, 1961. It reports income, expenses, depreciation, and tax computation for the financial year.',
    whyYouNeedIt: 'Mandatory for every company and LLP regardless of profit or loss. Filing a loss return preserves the right to carry it forward against future profits - missing the deadline loses that benefit permanently. Banks, visa offices, and government tender departments ask for 2-3 years of ITR.',
    whatHappensWithout: 'Interest at 1% per month on unpaid tax from the due date (Section 234A). Loss returns filed late cannot carry forward losses - that benefit is permanently gone. The department can reopen assessments up to 3 years back.',
  },

  workflow: [
    {
      step: 1,
      title: 'Upload your financials',
      timeframe: 'Day 0-1',
      description: 'P&L, Balance Sheet, trial balance, bank statements. Ollvy CA assigned within 4 hours.',
      milestone: 'Documents received, Ollvy CA assigned',
    },
    {
      step: 2,
      title: 'Ollvy CA reviews books and prepares computation',
      timeframe: 'Day 1-4',
      description: 'Ollvy CA reviews P&L, verifies depreciation schedule, checks director remuneration treatment, and prepares income computation.',
      milestone: 'Draft computation ready',
    },
    {
      step: 3,
      title: 'You review and approve the draft',
      timeframe: 'Day 4-7',
      description: 'Complete draft ITR shared in the app - income figures, deductions, tax computation. Nothing is filed without your explicit approval.',
      milestone: 'Draft approved',
    },
    {
      step: 4,
      title: 'Filed and acknowledgement delivered',
      timeframe: 'Day 7-10',
      description: 'Ollvy CA files within 24 hours of your approval. ITR-V acknowledgement generated immediately and shared same day.',
      milestone: 'ITR-V acknowledgement delivered',
    },
  ],

  included: [
    {
      title: 'Depreciation review',
      description: 'Ollvy CA reviews your asset schedule and depreciation rates. Incorrect rates are flagged before filing.',
    },
    {
      title: 'Director remuneration treatment',
      description: 'For Pvt Ltd, how director salary is treated versus dividends has tax implications. Ollvy CA reviews compliance with Companies Act limits.',
    },
    {
      title: 'Full draft review before filing',
      description: 'You see the complete return before it is filed - income, deductions, tax computation. Nothing filed without your explicit approval.',
    },
    {
      title: 'ITR-V stored permanently',
      description: 'Acknowledgement uploaded to your Ollvy account immediately. Available for loan applications, visa, or audits.',
    },
  ],

  risks: [
    {
      title: 'Losses cannot be carried forward if filed late',
      description: 'A company or LLP that made a loss and files after October 31 loses the right to offset that loss against future profits. That tax benefit cannot be recovered.',
    },
    {
      title: 'Belated filing interest',
      description: 'Section 234A: if you file after the due date with outstanding tax, 1% monthly interest accrues from the original deadline.',
    },
    {
      title: 'Audit must be complete first',
      description: 'Audit is mandatory for all Pvt Ltd companies (any turnover) and LLPs above Rs. 40 lakh turnover or Rs. 25 lakh contribution. Audited financials must be ready before ITR can be filed.',
    },
  ],

  personas: [
    {
      title: 'First year after incorporation',
      description: 'First ITR. We walk through every document required.',
    },
    {
      title: 'Company made a loss',
      description: 'Loss return filed to preserve carry-forward rights. Missing the deadline loses the benefit permanently.',
    },
    {
      title: 'Changed CA mid-year',
      description: 'Previous CA\'s books need reconciliation. We clean up and file correctly.',
    },
    {
      title: 'Filing late',
      description: 'We calculate interest liability upfront so there are no surprises, then file immediately to stop it growing.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'When is Business ITR due?',
      a: 'October 31 for all Pvt Ltd companies (statutory audit is mandatory for all companies regardless of turnover, so the extended deadline always applies). For LLPs not requiring tax audit: July 31. For LLPs requiring tax audit (turnover above Rs. 1 crore or contribution above Rs. 25 lakh): October 31.',
    },
    {
      category: 'General',
      q: 'What is the difference between ITR-5 and ITR-6?',
      a: 'ITR-6 is for all companies - Pvt Ltd, Public Ltd, and OPC. ITR-5 is for LLPs, partnership firms, AOPs, and BOIs. The form is determined by your entity type, not by turnover or income.',
    },
    {
      category: 'General',
      q: 'What is the penalty for not filing Business ITR?',
      a: 'Rs. 10,000 late filing fee under Section 234F. Plus 1% per month interest under Section 234A on any unpaid tax from the original due date. And the permanent loss of any loss carry-forward rights.',
    },
    {
      category: 'General',
      q: 'Must I file even if the company made no profit?',
      a: 'Yes. Every company and LLP must file ITR every year regardless of profit, loss, or activity level. Filing a loss return is especially important - it preserves your right to offset that loss against future profits.',
    },
    {
      category: 'Process',
      q: 'What documents do I need?',
      a: 'Audited P&L and Balance Sheet, trial balance, bank statements (full year), Form 26AS, depreciation schedule, and director/partner remuneration details. For LLPs not requiring audit: management accounts are sufficient.',
    },
    {
      category: 'Process',
      q: 'Do I need a statutory audit before filing?',
      a: 'Mandatory for all Pvt Ltd companies regardless of turnover. For LLPs: mandatory above Rs. 40 lakh turnover or Rs. 25 lakh contribution. Tax audit (separate from statutory audit) is mandatory for businesses with turnover above Rs. 1 crore.',
    },
    {
      category: 'General',
      q: 'What if I missed the October 31 deadline?',
      a: 'You can file a belated return by December 31 of the assessment year with the late fee and interest. After December 31, filing requires special circumstances or departmental notice. The longer you wait, the more interest accrues.',
    },
  ],

  govtFees: {
    caption: 'Government Penalties - Late Business ITR Filing',
    headers: ['Penalty Type', 'Amount', 'Provision'],
    rows: [
      ['Late filing fee', 'Rs. 10,000 (companies and audit cases)', 'Section 234F, Income Tax Act 1961'],
      ['Interest on unpaid tax', '1% per month from due date until payment', 'Section 234A'],
      ['Interest on advance tax shortfall', '1% per month on shortfall amount', 'Section 234B (if <90% of liability paid as advance tax)'],
      ['Loss carry-forward forfeited', 'Permanent loss of tax benefit', 'Section 139(3) - loss return not filed by due date'],
    ],
  },

  documents: {
    caption: 'Documents Required - Business ITR Filing',
    headers: ['Document', 'Company (ITR-6)', 'LLP (ITR-5)'],
    rows: [
      ['Audited Balance Sheet', 'Mandatory', 'Mandatory if audit required; management accounts otherwise'],
      ['Audited P&L Statement', 'Mandatory', 'Mandatory if audit required'],
      ['Statutory Auditor Report', 'Mandatory', 'If audit required'],
      ['Tax Audit Report (Form 3CA/3CB + 3CD)', 'If turnover > Rs. 1 crore', 'If turnover > Rs. 1 crore'],
      ['Trial balance', 'Required', 'Required'],
      ['Bank statements (full year)', 'Required', 'Required'],
      ['Form 26AS', 'Required', 'Required'],
      ['Depreciation schedule', 'Required', 'Required'],
      ['Director/partner remuneration details', 'Required', 'Required - Section 40(b) calculation'],
      ['Previous year ITR and computation', 'For reference', 'For reference'],
    ],
  },
}

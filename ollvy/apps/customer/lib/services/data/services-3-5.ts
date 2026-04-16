import type { ServicePageConfig } from '../types'

// ─── 3. GST Registration ──────────────────────────────────────────────────────

export const gstRegistration: ServicePageConfig = {
  slug: 'gst-registration',
  title: 'GST Registration',
  tagline: 'Your GST number, applied and obtained. Reference number within 24 hours of filing.',
  seoTitle: 'GST Registration Online in India 2026 | Get GSTIN in 7 Days | Ollvy',
  seoDescription: 'GST registration in 7 working days. Ollvy CA assigned same day, ARN in 24 hours. No govt fee. Mandatory above Rs. 20 lakh turnover for services.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-registration',
  lastReviewed: 'April 2026',
  category: 'GST',

  relatedServiceSlugs: ['gst-monthly', 'pvt-ltd-incorporation', 'gst-cancellation'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'GST registration gives you a 15-digit GST number. It lets you collect GST from customers, claim tax credits on business purchases, and file GST returns.',
    whyYouNeedIt: 'Required if your total turnover crosses Rs. 40 lakh for goods (Rs. 20 lakh for services, Rs. 10 lakh in certain states), for any sale across state lines, or if you sell on any e-commerce platform. Even below the threshold, being registered lets business clients claim tax credits on your invoices.',
    whatHappensWithout: 'Operating without required registration is treated as tax evasion. Penalty: 100% of tax due or Rs. 10,000, whichever is higher. You cannot claim tax credits on purchases, cannot generate transport documents for goods, and platforms like Amazon and Flipkart will not list you.',
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
      title: 'Application filed - reference number in 24 hours',
      timeframe: 'Day 1-2',
      description: 'Ollvy CA files the application on the government portal. Your reference number is generated immediately and shared in the app the same day. Track status yourself at gstn.gov.in.',
      milestone: 'Reference number generated and sent to your app',
    },
    {
      step: 4,
      title: 'Officer query handled if applicable',
      timeframe: 'Day 3-5',
      description: 'The GST officer asks for clarification in about 1 in 5 cases, usually about identity or address proof. Ollvy CA responds within 24 hours. Included in the price.',
      milestone: 'Query responded',
    },
    {
      step: 5,
      title: 'GST number issued',
      timeframe: 'Day 5-7',
      description: 'Permanent - no renewal, no expiry, as long as you file returns. Your Ollvy compliance calendar is updated with your first monthly filing due dates.',
      milestone: 'GST number active',
    },
  ],

  included: [
    {
      title: 'Ollvy CA handles the government portal - all 23 fields',
      description: 'The GST application has 23 fields across 5 tabs. Ollvy CA fills the whole thing. You answer 5 questions in the app.',
      without: '23 fields, 5 tabs, 3-4 hours on the government portal',
      withOllvy: '5 questions, about 4 minutes in the app',
    },
    {
      title: 'Reference number shared same day - track it yourself',
      description: 'Your reference number is generated on submission and shared right away. Track progress at gstn.gov.in yourself. You don\'t have to wait for updates.',
    },
    {
      title: 'Officer queries handled - no extra charge',
      description: 'If the GST officer requests clarification, Ollvy CA responds within 24 hours. Part of the service, not a separate charge.',
    },
    {
      title: 'Compliance calendar updated automatically',
      description: 'Your monthly filing due dates (11th and 20th of each month) appear in your calendar the moment your GST number is active.',
    },
  ],

  risks: [
    {
      title: 'Address proof mismatch',
      description: 'The business address on all documents must match exactly - building name, floor, area, and PIN code. Your Ollvy CA checks every document for consistency before filing.',
    },
    {
      title: 'Aadhaar OTP failure',
      description: 'GST registration requires Aadhaar-based authentication. If the mobile linked to Aadhaar is old or inactive, OTP fails. This must be fixed at an Aadhaar enrolment centre. Ollvy verifies this upfront.',
    },
    {
      title: 'Already past threshold without registration',
      description: 'If turnover has crossed the mandatory limit and you are not yet registered, you are liable for 100% of unpaid tax plus Rs. 10,000 minimum penalty. Registering now stops the liability from growing.',
    },
  ],

  personas: [
    {
      title: 'First GST registration',
      description: 'Never registered before. Ollvy explains what each document is for and why it is needed.',
    },
    {
      title: 'Turnover just crossed threshold',
      description: 'You waited until legally required. Ollvy registers you quickly to stop the penalty from building up.',
    },
    {
      title: 'Voluntary registration',
      description: 'Below threshold but want to issue GST invoices to business clients so they can claim tax credits. Completely legal.',
    },
    {
      title: 'Home as principal place of business',
      description: 'Fully legal. Ollvy verifies your electricity bill matches your application before filing.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'When is GST registration required?',
      a: 'When total turnover crosses Rs. 40 lakh for goods (Rs. 20 lakh for services, Rs. 10 lakh in certain states). Also required for any sale to another state regardless of turnover, and for all e-commerce sellers from day one.',
    },
    {
      category: 'General',
      q: 'What is the government fee for GST registration?',
      a: 'Zero. There is no government fee for GST registration. The only cost is the professional fee for filing.',
    },
    {
      category: 'General',
      q: 'Can I register voluntarily if I am below the threshold?',
      a: 'Yes. Voluntary registration lets you issue GST invoices and claim tax credits on your purchases. Cannot be cancelled for at least one year from the date of registration.',
    },
    {
      category: 'General',
      q: 'I sell on Instagram. Do I need GST?',
      a: 'Direct selling via social media is not e-commerce under GST law - the e-commerce provision applies only to platforms that facilitate the transaction (Amazon, Swiggy). Social selling is treated as direct sale, so the turnover threshold applies normally.',
    },
    {
      category: 'General',
      q: 'I sell to customers in other states but my turnover is only Rs. 5 lakh. Do I need GST?',
      a: 'Yes. The GST law requires registration for any sale to another state - there is no turnover threshold for this. Even one sale to a customer in another state means you need GST.',
    },
    {
      category: 'Process',
      q: 'What is the application reference number?',
      a: 'Your application reference number is generated the moment your application is submitted. You can track progress at gstn.gov.in yourself, without waiting for updates from Ollvy.',
    },
    {
      category: 'Process',
      q: 'What if the officer raises a query?',
      a: 'Ollvy CA responds within 24 hours. Included in the service at no extra charge. Most queries are resolved in one reply.',
    },
    {
      category: 'After Completion',
      q: 'What returns must I file after getting my GST number?',
      a: 'Sales return (GSTR-1) by the 11th of every month. Tax payment return (GSTR-3B) by the 20th. Returns are required even when there are zero transactions. Annual return (GSTR-9) by December 31. All deadlines in your Ollvy compliance calendar.',
    },
    {
      category: 'After Completion',
      q: 'What is the penalty for not filing GST returns?',
      a: 'Rs. 50 per day per return for returns with transactions, capped at Rs. 10,000. Rs. 20 per day for zero-transaction returns, capped at Rs. 500. Plus 18% annual interest on any unpaid tax.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - GST Registration',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['GST registration application', 'Free', 'No government fee for registration'],
      ['Penalty if registering late (turnover above threshold)', 'Rs. 10,000 minimum or 100% of unpaid tax', 'Whichever is higher - stops accruing once registered'],
      ['Late filing fee after registration (returns with transactions)', 'Rs. 50/day per return, capped at Rs. 10,000', 'Rs. 50/day total per return'],
      ['Late filing fee (zero-transaction returns)', 'Rs. 20/day per return, capped at Rs. 500', 'Rs. 20/day total per return'],
    ],
  },

  documents: {
    caption: 'Documents Required - GST Registration',
    headers: ['Document', 'Sole Proprietor / Individual', 'Pvt Ltd / LLP'],
    rows: [
      ['PAN card', 'Owner PAN', 'Company / LLP PAN'],
      ['Aadhaar card', 'Owner Aadhaar (OTP required)', 'Not required at entity level'],
      ['Address proof (business)', 'Electricity bill (not older than 2 months)', 'Electricity bill (not older than 2 months)'],
      ['No-objection letter from property owner', 'If premises is rented', 'If premises is rented'],
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
  slug: 'gst-monthly',
  title: 'GST Monthly Filing',
  tagline: 'Sales return by the 11th. Tax return by the 20th. Every month.',
  seoTitle: 'GST Return Filing Service India 2026 | GSTR-1 & GSTR-3B | Ollvy',
  seoDescription: 'Monthly GST filing handled by an Ollvy CA. GSTR-1 by the 11th, GSTR-3B by the 20th, ITC reconciled every cycle. Cancel anytime.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-monthly',
  lastReviewed: 'April 2026',
  category: 'GST',

  relatedServiceSlugs: ['gst-registration', 'gst-cancellation', 'business-itr', 'tds-monthly-compliance'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'Monthly GST compliance means filing two returns every month: your sales return (due 11th) and your tax payment return (due 20th). The sales return reports every invoice you issued. The tax return calculates what you owe, deducts eligible purchase credits, and records your payment to the government.',
    whyYouNeedIt: 'Everyone with a GST number must file every month, even when there are zero transactions. Miss filings and the consequences escalate: first your transport documents get blocked, then your registration is suspended, then the government cancels it entirely. Your customers cannot claim tax credits on your invoices until you file.',
    whatHappensWithout: 'Late fee: Rs. 50/day per return (Rs. 20 for zero-transaction returns). Interest: 18% per year on unpaid tax. Transport documents blocked after 2 missed filings. Registration cancelled after 6 months of non-filing.',
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
      title: 'Sales return filed by the 11th',
      timeframe: '9th-11th',
      description: 'Ollvy CA files all your sales invoices. Acknowledgement shared in the app.',
      milestone: 'Sales return filed',
    },
    {
      step: 4,
      title: 'Tax return filed by the 20th',
      timeframe: '18th-20th',
      description: 'Ollvy CA prepares the return, verifies your purchase credits against the government\'s auto-generated statement, calculates what you owe, and files. Payment slip generated.',
      milestone: 'Tax return filed',
    },
    {
      step: 5,
      title: 'Monthly compliance report',
      timeframe: '21st-25th',
      description: 'What was filed, when, acknowledgement numbers, credits claimed, tax paid.',
      milestone: 'Report delivered',
    },
  ],

  included: [
    {
      title: 'Sales return (GSTR-1)',
      description: 'All business invoices, consumer sales above Rs. 2.5 lakh, and export invoices reported. Filed by the 11th.',
    },
    {
      title: 'Tax payment return (GSTR-3B)',
      description: 'Tax calculated, eligible credits deducted, return filed, payment slip generated.',
    },
    {
      title: 'Tax credit verification',
      description: 'The credits you claim are checked against the government\'s auto-generated statement before filing. Mismatches flagged before they become a problem.',
      without: 'Claim credits without checking, get a government demand notice months later',
      withOllvy: 'Credits verified against the government system every month before filing',
    },
    {
      title: 'Monthly compliance report',
      description: 'Filed returns, acknowledgement numbers, credit summary, and tax paid. Delivered after every filing cycle.',
    },
  ],

  risks: [
    {
      title: 'Data must be shared by the 8th',
      description: 'Late fee starts from the 12th for the sales return and 21st for the tax return. Rs. 50/day per return. Ollvy files the moment your data is ready.',
    },
    {
      title: 'Sales return and tax return figures must match',
      description: 'Mismatches between the two returns are flagged automatically by the government system. Ollvy files both from the same data, so they always match.',
    },
    {
      title: 'Vendor hasn\'t filed = your credits are blocked',
      description: 'If your vendor hasn\'t filed their sales return, their invoices don\'t show up in your credit statement. Ollvy checks before claiming anything, so you\'re not exposed to a mismatch notice.',
    },
  ],

  personas: [
    {
      title: 'Switching from another CA',
      description: 'Seamless takeover. Ollvy reviews your filing history before the first cycle.',
    },
    {
      title: 'Multiple GST numbers',
      description: 'Multiple states, multiple registrations. All handled under one retainer.',
    },
    {
      title: 'Previous CA stopped responding',
      description: 'Ollvy works to a guaranteed timeline every month. Acknowledgement numbers delivered the same day as filing.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'What does the monthly retainer cover?',
      a: 'Sales return by the 11th, tax return by the 20th, credit verification every month, and a compliance report with filing acknowledgements.',
    },
    {
      category: 'General',
      q: 'Can I cancel anytime?',
      a: 'Yes. No minimum term. Cancel before the 1st of any month and you will not be charged for that cycle.',
    },
    {
      category: 'General',
      q: 'What is the auto-generated credit statement and why does it matter?',
      a: 'The government auto-generates a credit statement each month showing what tax credits are available to you, based on what your suppliers have filed. If you claim credits that don\'t appear in this statement, you get a demand notice. Ollvy checks against it before every filing.',
    },
    {
      category: 'Process',
      q: 'What data do I need to share each month?',
      a: 'Sales invoices and purchase register. If you use Tally, Zoho, or any accounting software, the export takes 2 minutes. Ollvy also handles zero-transaction returns when there\'s nothing to file.',
    },
    {
      category: 'Process',
      q: 'What if I have no transactions in a month?',
      a: 'Both returns must still be filed even with zero transactions. Ollvy handles these as part of the retainer at no extra charge.',
    },
    {
      category: 'General',
      q: 'What is the penalty for missing a filing?',
      a: 'Rs. 50 per day for returns with transactions, capped at Rs. 10,000. Plus 18% annual interest on any unpaid tax. Zero-transaction return late fee: Rs. 20/day, capped at Rs. 500.',
    },
  ],

  govtFees: {
    caption: 'Government Late Fees - GST Monthly Filing (per missed return)',
    headers: ['Return', 'Late Fee (With Transactions)', 'Late Fee (Zero Transactions)', 'Cap'],
    rows: [
      ['Sales return (GSTR-1)', 'Rs. 50/day', 'Rs. 20/day', 'Rs. 10,000 per return (zero-transaction: Rs. 500)'],
      ['Tax return (GSTR-3B)', 'Rs. 50/day', 'Rs. 20/day', 'Rs. 10,000 per return (zero-transaction: Rs. 500)'],
      ['Interest on unpaid tax', '18% per year on outstanding amount', 'Not applicable for zero-transaction returns', 'Accrues daily - no cap'],
      ['Both returns missed (1 month)', 'Rs. 100/day combined (both returns)', 'Rs. 40/day combined', 'Rs. 20,000 combined cap (zero-transaction: Rs. 1,000)'],
    ],
  },

  documents: {
    caption: 'Data Required Each Month - GST Filing',
    headers: ['Data / Document', 'Required For', 'Format'],
    rows: [
      ['Sales invoices', 'Sales return', 'Excel, Tally export, or accounting software export'],
      ['Purchase invoices / purchase register', 'Credit verification', 'Excel or accounting software export'],
      ['GST portal credentials (read-only)', 'Filing', 'Shared once at onboarding; not required monthly'],
      ['Bank statement (for large consumer sales)', 'Sales return (large consumer sales)', 'For verifying consumer sales above Rs. 2.5 lakh'],
    ],
  },
}


// ─── 5. Business ITR Filing ───────────────────────────────────────────────────

export const businessItr: ServicePageConfig = {
  slug: 'business-itr',
  title: 'Business ITR Filing',
  tagline: 'Your company\'s annual tax return - filed correctly, on time.',
  seoTitle: 'Business ITR Filing India 2026 | Company & LLP Income Tax Return | Ollvy',
  seoDescription: 'Annual income tax return for Pvt Ltd (ITR-6) and LLP (ITR-5). Due October 31. Includes depreciation review, draft approval, and ITR-V same day.',
  canonicalUrl: 'https://www.ollvy.com/services/business-itr',
  lastReviewed: 'April 2026',
  category: 'Tax',

  relatedServiceSlugs: ['mca-annual-filing', 'tds-monthly-compliance', 'gst-monthly'],
  relatedLearnSlugs: ['do-i-need-to-file-itr', 'which-itr-form-should-i-use'],

  explainer: {
    whatItIs: 'Every Pvt Ltd, LLP, and partnership must file an annual income tax return. It covers what the business earned, what it spent, and how much tax is owed for the year. The government uses a different form depending on your entity type - Ollvy picks the right one.',
    whyYouNeedIt: 'Mandatory for every company and LLP - even if you made zero revenue or a loss. If your business lost money this year, filing on time lets you use that loss to reduce tax in future profitable years. Miss the deadline and that benefit is gone forever. Banks, visa offices, and government tender departments ask for 2-3 years of filed returns.',
    whatHappensWithout: 'Late filing means 1% per month interest on any unpaid tax from the deadline. If your business made a loss and you file late, you lose the right to use that loss against future profits - permanently. The tax department can also reopen your books going back 3 years.',
  },

  workflow: [
    {
      step: 1,
      title: 'Upload your financials',
      timeframe: 'Day 0-1',
      description: 'Profit & loss statement, balance sheet, trial balance, and bank statements. Ollvy CA assigned within 4 hours.',
      milestone: 'Documents received, Ollvy CA assigned',
    },
    {
      step: 2,
      title: 'Ollvy CA reviews books and prepares calculation',
      timeframe: 'Day 1-4',
      description: 'Ollvy CA reviews your profit & loss, checks that asset write-offs are calculated correctly, verifies how director pay is treated for tax, and prepares the full tax calculation.',
      milestone: 'Draft tax calculation ready',
    },
    {
      step: 3,
      title: 'You review and approve the draft',
      timeframe: 'Day 4-7',
      description: 'Complete draft return shared in the app - income, deductions, and the final tax number. Nothing is filed without your approval.',
      milestone: 'Draft approved',
    },
    {
      step: 4,
      title: 'Filed and acknowledgement delivered',
      timeframe: 'Day 7-10',
      description: 'Ollvy CA files within 24 hours of your approval. The official acknowledgement is generated immediately and shared the same day.',
      milestone: 'Filing acknowledgement delivered',
    },
  ],

  included: [
    {
      title: 'Asset write-off review',
      description: 'Ollvy CA checks that your assets are written off at the correct rates. Wrong rates get flagged before filing - not after a government notice.',
    },
    {
      title: 'Director pay and tax treatment',
      description: 'For Pvt Ltd companies, how much you pay directors as salary vs dividends changes your tax bill. Ollvy CA makes sure it stays within legal limits.',
    },
    {
      title: 'Full draft review before filing',
      description: 'You see the complete return before it goes in - income, deductions, and the final tax number. Nothing filed without your approval.',
    },
    {
      title: 'Filing acknowledgement stored permanently',
      description: 'Acknowledgement uploaded to your Ollvy account immediately. Available for loan applications, visa, or audits.',
    },
  ],

  risks: [
    {
      title: 'You lose the right to offset losses if you file late',
      description: 'If your business lost money this year and you file after October 31, you can never use that loss to reduce tax in a future profitable year. That benefit is gone permanently.',
    },
    {
      title: 'Late filing interest',
      description: 'If you file after the deadline with tax still owed, you pay 1% interest per month from the original due date. The longer you wait, the more it adds up.',
    },
    {
      title: 'Audit must be complete first',
      description: 'All Pvt Ltd companies must be audited before filing - regardless of size. LLPs need an audit only above Rs. 40 lakh turnover or Rs. 25 lakh partner contribution. Your audited financials must be ready before Ollvy CA can file the return.',
    },
  ],

  personas: [
    {
      title: 'First year after incorporation',
      description: 'First tax return. Ollvy CA walks you through every document needed.',
    },
    {
      title: 'Company made a loss',
      description: 'Loss return filed on time so you can use that loss against future profits. Miss the deadline and that benefit is gone forever.',
    },
    {
      title: 'Changed CA mid-year',
      description: 'Previous CA left messy books. Ollvy CA cleans up and files correctly.',
    },
    {
      title: 'Filing late',
      description: 'Ollvy CA calculates how much late interest you owe upfront - no surprises - then files immediately to stop it growing.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'When is Business ITR due?',
      a: 'October 31 for all Pvt Ltd companies (every company needs an audit, so the extended deadline always applies). For LLPs that don\'t need an audit: July 31. For LLPs that need one (turnover above Rs. 1 crore or partner contribution above Rs. 25 lakh): October 31.',
    },
    {
      category: 'General',
      q: 'What is the difference between ITR-5 and ITR-6?',
      a: 'The government uses different forms for different entities. Companies (Pvt Ltd, Public Ltd, One Person Company) use one form. LLPs and partnerships use another. Ollvy picks the right one based on your entity type.',
    },
    {
      category: 'General',
      q: 'What is the penalty for not filing Business ITR?',
      a: 'Rs. 10,000 late filing fee. Plus 1% per month interest on any unpaid tax from the original deadline. And if your business made a loss, you permanently lose the right to use it against future profits.',
    },
    {
      category: 'General',
      q: 'Must I file even if the company made no profit?',
      a: 'Yes. Every company and LLP must file every year - even with zero activity. If you made a loss, filing is extra important because it lets you use that loss to pay less tax in future profitable years.',
    },
    {
      category: 'Process',
      q: 'What documents do I need?',
      a: 'Audited profit & loss and balance sheet, trial balance, full-year bank statements, tax credit statement (Form 26AS), asset write-off schedule, and director or partner pay details. For LLPs not needing an audit: management accounts are enough.',
    },
    {
      category: 'Process',
      q: 'Do I need an audit before filing?',
      a: 'Every Pvt Ltd company needs an audit - no matter the size. LLPs need one only above Rs. 40 lakh turnover or Rs. 25 lakh contribution. There\'s also a separate tax-specific audit for businesses above Rs. 1 crore turnover.',
    },
    {
      category: 'General',
      q: 'What if I missed the October 31 deadline?',
      a: 'You can still file a late return by December 31 of the same assessment year - you\'ll pay the late fee and interest. After December 31, it gets much harder and usually requires a government notice. The longer you wait, the more interest accrues.',
    },
  ],

  govtFees: {
    caption: 'Government penalties for late filing',
    headers: ['Penalty', 'Amount', 'Legal basis'],
    rows: [
      ['Late filing fee', 'Rs. 10,000 (companies and audit cases)', 'Income Tax Act - late filing fee'],
      ['Interest on unpaid tax', '1% per month from due date until payment', 'Income Tax Act - interest on late payment'],
      ['Interest on advance tax shortfall', '1% per month on shortfall amount', 'Income Tax Act - advance tax shortfall (if less than 90% paid in advance)'],
      ['Loss benefit forfeited', 'Permanent loss of tax benefit', 'Income Tax Act - loss benefit forfeited if filed late'],
    ],
  },

  documents: {
    caption: 'Documents you\'ll need',
    headers: ['Document', 'Company (Pvt Ltd)', 'LLP / Partnership'],
    rows: [
      ['Audited Balance Sheet', 'Mandatory', 'Mandatory if audit required - management accounts are enough otherwise'],
      ['Audited profit & loss', 'Mandatory', 'Mandatory if audit required'],
      ['Statutory Auditor Report', 'Mandatory', 'If audit required'],
      ['Tax audit report', 'If turnover above Rs. 1 crore', 'If turnover above Rs. 1 crore'],
      ['Trial balance', 'Required', 'Required'],
      ['Bank statements (full year)', 'Required', 'Required'],
      ['Form 26AS', 'Required', 'Required'],
      ['Asset write-off schedule', 'Required', 'Required'],
      ['Director or partner pay details', 'Required', 'Required - partner pay limits apply'],
      ['Previous year return and calculation', 'For reference', 'For reference'],
    ],
  },
}

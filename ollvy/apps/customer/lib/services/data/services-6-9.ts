import type { ServicePageConfig } from '../types'

// ─── 6. Trademark Registration ────────────────────────────────────────────────

export const trademarkRegistration: ServicePageConfig = {
  slug: 'trademark-registration',
  title: 'Trademark Registration',
  tagline: '10-year brand protection. Filed in 7 days.',
  seoTitle: 'Trademark Registration in India 2026 | Rs. 4,500 Govt Fee | Ollvy',
  seoDescription: 'Trademark application filed in 7 days. Search, class guidance, filing, and examiner objection response included. Govt fee Rs. 4,500 per class (small entities).',
  canonicalUrl: 'https://www.ollvy.com/services/trademark-registration',
  lastReviewed: 'April 2026',
  category: 'Trademark',

  relatedServiceSlugs: ['pvt-ltd-incorporation', 'gst-registration'],
  relatedLearnSlugs: ['do-i-need-trademark-registration'],

  explainer: {
    whatItIs: 'Trademark registration gives you exclusive rights to use your brand name, logo, or tagline for a specific category of goods or services across India for 10 years (renewable indefinitely). Once registered, you can use the ® symbol and take legal action against anyone copying your brand.',
    whyYouNeedIt: 'Without registration, there\'s very little you can legally do if someone starts using your brand name. In India, trademark rights go to whoever registers first - not whoever used the name first. E-commerce platforms (Amazon Brand Registry, Flipkart) require trademark registration for brand protection.',
    whatHappensWithout: 'Without a registered trademark, the only option is proving in court that you used the name first and have an established reputation - expensive, slow, and uncertain. Anyone can register a similar name in your category. No access to Amazon Brand Registry or Flipkart brand protection features.',
  },

  workflow: [
    {
      step: 1,
      title: 'Tell us your brand name and category',
      timeframe: 'Day 0',
      description: 'Trademark lawyer assigned within 4 hours. You provide the mark, the classes you want to protect, and your business details. Preliminary search started immediately.',
      milestone: 'Lawyer assigned, search started',
    },
    {
      step: 2,
      title: 'Trademark search report delivered',
      timeframe: 'Day 1-2',
      description: 'Ollvy lawyer searches the Trademark Registry for identical and similar marks in your categories. If your mark is clear, Ollvy proceeds to filing. If conflicts exist, Ollvy suggests modifications before you spend the government fee.',
      milestone: 'Search report delivered',
    },
    {
      step: 3,
      title: 'Application filed with Trademark Registry',
      timeframe: 'Day 3-7',
      description: 'Ollvy lawyer drafts the application, selects the correct categories, and files. You receive your application number and filing receipt. Your rights are protected from this filing date - you don\'t have to wait for the certificate.',
      milestone: 'Application filed, receipt received',
    },
    {
      step: 4,
      title: 'Examination and publication',
      timeframe: '6-12 months (government processing)',
      description: 'The Trademark Registry examines your application. If objections are raised, your Ollvy lawyer responds - included in the price. Once cleared, the mark is published in the Trademark Journal for 4 months.',
      milestone: 'Under examination',
    },
    {
      step: 5,
      title: 'Registration certificate issued',
      timeframe: '12-18 months total',
      description: 'Certificate issued. Protection runs 10 years from the filing date, renewable indefinitely. Certificate stored in your Ollvy account.',
      milestone: 'Trademark registered',
    },
  ],

  included: [
    {
      title: 'Trademark search before filing',
      description: 'Ollvy lawyer searches the Registry before spending your government fee. If your exact mark is already taken in your category, Ollvy tells you upfront.',
      without: 'File without searching, wait months, get rejected',
      withOllvy: 'Search first, modify if needed, then file',
    },
    {
      title: 'Category selection guidance',
      description: 'Trademarks are registered per category (45 categories). Ollvy lawyer recommends only the ones you actually need - most businesses need 1-3.',
    },
    {
      title: 'Objection response included',
      description: 'If the government raises objections, your Ollvy lawyer responds. Included in the price - not a separate charge.',
    },
    {
      title: 'Renewal reminder',
      description: 'Trademark expires 10 years from filing date. Ollvy adds a renewal reminder to your calendar 6 months before expiry.',
    },
  ],

  risks: [
    {
      title: 'Similar mark already registered',
      description: 'If a similar mark is registered in your category, the government will object. Ollvy\'s search catches most conflicts, but pending applications not yet published can\'t be seen by anyone. If rejected, Ollvy helps you appeal or modify.',
    },
    {
      title: 'Government processing takes 12-18 months',
      description: 'The 7-day timeline is for filing. Examination, publication, and certificate issuance are government-side. Ollvy tracks every stage and updates you, but can\'t speed up the Registry.',
    },
    {
      title: 'Opposition during publication',
      description: 'After examination, your mark is published for 4 months. Anyone can oppose. Opposition response is a separate service - it occurs in under 5% of cases.',
    },
  ],

  personas: [
    {
      title: 'Selling on Amazon or Flipkart',
      description: 'Both platforms require trademark registration for Brand Registry. Without it, your listings are open to unauthorised sellers and piggybacking.',
    },
    {
      title: 'Raising investor funding',
      description: 'Investor due diligence will flag an unregistered brand. Register before you start your fundraising process.',
    },
    {
      title: 'First trademark, no prior registrations',
      description: 'Never registered before. Ollvy explains categories, search, and the full process.',
    },
    {
      title: 'Logo and word mark both needed',
      description: 'Two separate applications. Ollvy handles both. Broader protection.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'What is the government fee for trademark registration in India?',
      a: 'Rs. 4,500 per category for individuals, startups, and small entities. Rs. 9,000 per category for companies and LLPs. These are one-time fees for a 10-year term, not annual fees.',
    },
    {
      category: 'General',
      q: 'How long does trademark protection last?',
      a: '10 years from the filing date, renewable indefinitely in 10-year increments. Renewal costs Rs. 9,000 per category (small entities) or Rs. 10,000 (others).',
    },
    {
      category: 'General',
      q: 'Can I use the ® symbol after filing?',
      a: 'No. The ® symbol can only be used after registration is granted. Use TM (for goods) or SM (for services) to indicate your claim while the application is pending. Using ® before registration is an offence.',
    },
    {
      category: 'General',
      q: 'What is a trademark category and which one do I need?',
      a: 'Goods and services are divided into 45 categories by the government. You register per category. For example: software and tech services is one category, clothing is another, retail and marketing is another. Picking the wrong one leaves you unprotected in the area you actually operate in. Most businesses need 1-3 categories.',
    },
    {
      category: 'General',
      q: 'What if someone is already using my brand name without registering it?',
      a: 'Prior unregistered use gives you some rights, but proving them in court requires demonstrating an established reputation - expensive and slow. If neither party has registered, filing now gives you legal priority over any future attempt by that person to register it.',
    },
    {
      category: 'Process',
      q: 'Why does full registration take 12-18 months if filing takes 7 days?',
      a: 'The 7-day timeline is for filing the application. Examination by the Trademark Registry takes 6-12 months. Then 4 months where anyone can object. Then certificate issuance. All government-side. Your rights are protected from the filing date - you don\'t have to wait for the certificate.',
    },
    {
      category: 'Documents',
      q: 'What documents do I need for trademark registration?',
      a: 'PAN card, Aadhaar or address proof, and the logo file if registering a logo (JPG, minimum 8cm x 8cm, black on white background). For companies: Certificate of Incorporation and board resolution. For small entity fee: MSME certificate or startup recognition certificate.',
    },
    {
      category: 'General',
      q: 'Can I trademark a common word like "Fresh" or "Quick"?',
      a: 'Descriptive or generic words are difficult to register on their own. A distinctive combination, stylised logo, or word used in an unexpected context (Apple for computers) can be protected. Ollvy lawyer checks whether your name can be registered before you spend the government fee.',
    },
  ],

  govtFees: {
    caption: 'Government fees for trademark registration',
    headers: ['Applicant Type', 'New Application (per category)', 'Renewal (per category)', 'Notes'],
    rows: [
      ['Individual / Startup / Small Entity', 'Rs. 4,500', 'Rs. 9,000', 'Includes startups with DPIIT recognition; 10% discount for online filing'],
      ['Company, LLP, or other entity', 'Rs. 9,000', 'Rs. 10,000', 'Per category; 10% discount for online filing'],
      ['Expedited examination (optional)', 'Rs. 20,000 (small) / Rs. 40,000 (others)', 'N/A', 'Faster review, not faster registration'],
    ],
  },

  documents: {
    caption: 'Documents you\'ll need',
    headers: ['Document', 'Required For', 'Notes'],
    rows: [
      ['PAN card', 'All applicants', 'Identity and address verification'],
      ['Aadhaar or address proof', 'Individual applicants', 'Any government-issued address proof'],
      ['Logo file', 'Logo trademark applications', 'JPG format; minimum 8cm x 8cm; black mark on white background'],
      ['Certificate of Incorporation', 'Company or LLP applicants', 'Proof of entity registration'],
      ['Board resolution or power of attorney', 'Company or LLP applicants', 'Authorises who can sign and file on behalf of the company'],
      ['MSME / Startup certificate', 'For reduced govt fee', 'Udyam certificate or DPIIT recognition certificate'],
      ['Prior use declaration', 'If claiming prior use date', 'Declares when you first started using the brand name in India'],
    ],
  },
}


// ─── 7. MCA Annual Filing ─────────────────────────────────────────────────────

export const mcaAnnualFiling: ServicePageConfig = {
  slug: 'mca-annual-filing',
  title: 'MCA Annual Filing',
  tagline: 'Your company\'s annual return filed with the government. Rs. 100/day penalty stopped the moment Ollvy CS files.',
  seoTitle: 'MCA Annual Filing India 2026 | AOC-4 and MGT-7 for Pvt Ltd | Ollvy',
  seoDescription: 'MCA annual ROC compliance for Private Limited companies. AOC-4 within 30 days of AGM, MGT-7 within 60 days. Rs. 100/day penalty stopped on filing.',
  canonicalUrl: 'https://www.ollvy.com/services/mca-annual-filing',
  lastReviewed: 'April 2026',
  category: 'Compliance',

  relatedServiceSlugs: ['business-itr', 'tds-monthly-compliance', 'pvt-ltd-incorporation'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp'],

  explainer: {
    whatItIs: 'Every Pvt Ltd company must file two forms with the government every year - one for your financials (AOC-4) and one for your company details like shareholders and directors (MGT-7). Both are filed with the Registrar of Companies after your annual general meeting.',
    whyYouNeedIt: 'Mandatory for every Pvt Ltd - even if the company had zero activity. The financials form (AOC-4) is due within 30 days of your annual general meeting. The company details form (MGT-7) within 60 days. Your annual meeting must be held by September 30 if your financial year ends in March. Non-filing shows as a default on MCA records - visible to investors, banks, and anyone checking.',
    whatHappensWithout: 'Rs. 100 per day per form in late fees - no ceiling. Both forms overdue means Rs. 200/day. After three years of not filing, directors can be disqualified from holding any directorship. After 2 consecutive years, the government can remove the company from the register entirely.',
  },

  workflow: [
    {
      step: 1,
      title: 'Share company details',
      timeframe: 'Day 0',
      description: 'Your company registration number, financial year, annual meeting date, and whether your audit is done. Ollvy CS assigned.',
      milestone: 'Ollvy CS assigned',
    },
    {
      step: 2,
      title: 'Upload financial statements and documents',
      timeframe: 'Day 0-2',
      description: 'Audited balance sheet, profit & loss, director report, auditor report, and shareholder list. Ollvy CS reviews everything before drafting the forms.',
      milestone: 'Documents reviewed by Ollvy CS',
    },
    {
      step: 3,
      title: 'Forms drafted and sent for your approval',
      timeframe: 'Day 2-4',
      description: 'Both forms drafted by Ollvy CS. You review and approve in the app before anything is filed.',
      milestone: 'Draft forms approved',
    },
    {
      step: 4,
      title: 'Filed with the government - filing receipt generated',
      timeframe: 'Day 5-7',
      description: 'Both forms filed by Ollvy CS. Filing receipts shared immediately as proof.',
      milestone: 'Both forms filed with the government',
    },
  ],

  included: [
    {
      title: 'Both government forms filed',
      description: 'One form for your financials (AOC-4), one for company details (MGT-7). Both included in the price.',
    },
    {
      title: 'Deadline calculation based on your annual meeting date',
      description: 'Financials form due 30 days after your annual meeting. Company details form due 60 days after. Ollvy CS tracks both deadlines from your meeting date.',
    },
    {
      title: 'Late fee calculation if filing late',
      description: 'If filing after the deadline, Ollvy CS calculates the exact late fee upfront before filing. No surprises.',
    },
    {
      title: 'Filing receipt shared immediately',
      description: 'The filing receipt is your proof. Both receipts shared the day forms are submitted.',
    },
  ],

  risks: [
    {
      title: 'Audit must be complete first',
      description: 'The financials form requires signed, audited financial statements. Ollvy CS cannot file until the audit is done. Plan your audit timeline to allow filing before the deadline.',
    },
    {
      title: 'Late fee accrues daily from the deadline',
      description: 'Late fee of Rs. 100 per day per form from the due date - Rs. 200/day for both forms combined. No ceiling. File as soon as your audited financials are ready.',
    },
    {
      title: 'Annual meeting must be held by September 30',
      description: 'Companies with a March year-end must hold their annual meeting by September 30. If delayed, filing deadlines shift - Ollvy CS calculates new deadlines from your actual meeting date.',
    },
  ],

  personas: [
    {
      title: 'Running past the deadline',
      description: 'Already past the deadline. Ollvy CS calculates the exact late fee and files immediately to stop it growing.',
    },
    {
      title: 'Director changes during the year',
      description: 'Appointments and resignations reflected correctly in the company details form.',
    },
    {
      title: 'Share transfer happened',
      description: 'Updated shareholding captured accurately in the company details form.',
    },
    {
      title: 'First year after incorporation',
      description: 'First annual filing. Ollvy CS explains every field and what it means for your company records.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'When is MCA annual filing due for Pvt Ltd?',
      a: 'Financials form (AOC-4): within 30 days of your annual meeting (typically October 30 if your meeting is September 30). Company details form (MGT-7): within 60 days (typically November 29). Annual meeting must be held by September 30.',
    },
    {
      category: 'General',
      q: 'What is the penalty for not filing AOC-4 and MGT-7?',
      a: 'Rs. 100 per day per form from the due date. Both forms overdue means Rs. 200/day. No ceiling - it keeps growing until filed. After 3 years of not filing, directors can be disqualified from holding any directorship.',
    },
    {
      category: 'General',
      q: 'Is MCA annual filing different from Business ITR?',
      a: 'Yes. MCA annual filing is filed with the company registry (Ministry of Corporate Affairs). Business ITR is filed with the Income Tax department. Both are mandatory, with separate deadlines and separate penalties.',
    },
    {
      category: 'General',
      q: 'What happens if a company does not file for 2 years?',
      a: 'The government can remove the company from the register entirely. Restoring a removed company is possible but involves a lengthy tribunal process. Every director of such a company is also disqualified from holding any directorship for 5 years.',
    },
    {
      category: 'Process',
      q: 'Can I file if the audit is not complete?',
      a: 'No. The financials form requires signed, audited financials. Plan your audit timeline carefully - the auditor must sign off before the filing deadline.',
    },
    {
      category: 'Documents',
      q: 'What documents are needed for MCA annual filing?',
      a: 'Audited balance sheet, profit & loss, notes to accounts, director report, auditor report, annual meeting date, and the updated shareholder list with current holdings.',
    },
    {
      category: 'General',
      q: 'Does an LLP need to file AOC-4 and MGT-7?',
      a: 'No. LLPs have their own separate forms and deadlines. Form 8 (financial summary, due October 30) and Form 11 (annual return, due May 30).',
    },
  ],

  govtFees: {
    caption: 'Government fees for annual filing',
    headers: ['Item', 'Fee', 'Notes'],
    rows: [
      ['Normal AOC-4 filing fee', 'Rs. 200-600', 'Based on company paid-up capital; paid at MCA portal'],
      ['Normal MGT-7 filing fee', 'Rs. 200-600', 'Based on company paid-up capital; paid at MCA portal'],
      ['Additional fee (late filing)', '2x to 12x of normal fee', 'Up to 30 days: 2x | 30-60 days: 4x | 60-90 days: 6x | 90-180 days: 10x | above 180 days: 12x'],
      ['Penalty if government initiates formal action', 'Rs. 10,000 + Rs. 100/day', 'Separate from the daily late fee above'],
    ],
  },

  documents: {
    caption: 'Documents you\'ll need',
    headers: ['Document', 'For AOC-4', 'For MGT-7'],
    rows: [
      ['Audited Balance Sheet', 'Yes - mandatory', 'No'],
      ['Audited profit & loss', 'Yes - mandatory', 'No'],
      ['Directors Report', 'Yes', 'No'],
      ['Auditors Report', 'Yes', 'No'],
      ['Annual meeting date and notice', 'Yes - determines your deadline', 'Yes - determines your deadline'],
      ['Shareholder register (current)', 'No', 'Yes - all shareholders with holdings'],
      ['Director details (ID numbers, appointment dates)', 'No', 'Yes'],
      ['Director changes during year', 'No', 'Yes - appointments and resignations with dates'],
      ['Share transfers during year', 'No', 'Yes - transferor, transferee, date, consideration'],
    ],
  },
}


// ─── 8. TDS Monthly Compliance ────────────────────────────────────────────────

export const tdsMonthlyCompliance: ServicePageConfig = {
  slug: 'tds-monthly-compliance',
  title: 'TDS Monthly Compliance',
  tagline: 'Deduct. Deposit by the 7th. File the return. Every month.',
  seoTitle: 'TDS Filing Service India 2026 | Monthly TDS Compliance | Ollvy',
  seoDescription: 'Monthly TDS calculation, challan preparation, and quarterly return filing. Deposit by the 7th. Covers salary, contractor, rent, professional fees.',
  canonicalUrl: 'https://www.ollvy.com/services/tds-monthly-compliance',
  lastReviewed: 'April 2026',
  category: 'Tax',

  relatedServiceSlugs: ['business-itr', 'gst-monthly', 'mca-annual-filing'],
  relatedLearnSlugs: ['do-i-need-to-file-itr'],

  explainer: {
    whatItIs: 'When you pay employees, contractors, landlords, or professionals, you must deduct a percentage of tax from their payment, deposit that tax with the government by the 7th of the next month, and file quarterly returns.',
    whyYouNeedIt: 'Any business making payments above certain limits for rent, professional fees, contractor payments, or salary must deduct and deposit TDS. If you skip the deduction, the entire expense gets disallowed - meaning you pay income tax on money you already spent.',
    whatHappensWithout: 'Interest at 1.5% per month on late deposit (1% per month if not deducted at all). Rs. 200/day for late quarterly return filing. Any expense where you didn\'t deduct TDS gets disallowed - taxed as if it were profit.',
  },

  workflow: [
    {
      step: 1,
      title: 'Share your payment register',
      timeframe: 'Day 1-5 of month',
      description: 'Salary, vendor, rent, and contractor payments for the month. Ollvy CA reviews applicable TDS rates for each payment type.',
      milestone: 'Data received',
    },
    {
      step: 2,
      title: 'TDS calculated and payment slips prepared',
      timeframe: 'Day 5-6',
      description: 'Ollvy CA calculates TDS for each payment type. Payment slips prepared with all the correct codes - you just pay.',
      milestone: 'Payment slips ready',
    },
    {
      step: 3,
      title: 'You make the payment',
      timeframe: 'Day 6-7',
      description: 'You transfer through net banking. Payment receipt uploaded to your Ollvy account as proof.',
      milestone: 'TDS deposited by 7th',
    },
    {
      step: 4,
      title: 'Quarterly return filed',
      timeframe: 'Quarter end',
      description: 'Ollvy CA files the quarterly returns - one for salary payments, one for everything else. Tax certificates for your employees and vendors are generated after filing.',
      milestone: 'TDS return filed',
    },
  ],

  included: [
    {
      title: 'TDS calculation for all payment types',
      description: 'Salary, contractor payments, professional fees, rent, and interest payments. Ollvy CA applies the correct rate for each type.',
    },
    {
      title: 'Payment slip preparation',
      description: 'The payment slip needs the right codes and year. Errors cause mismatches in your vendors\' tax records. Ollvy CA prepares everything - you just pay.',
      without: 'Wrong codes cause tax record mismatches and government notices',
      withOllvy: 'Correct payment slip prepared every time',
    },
    {
      title: 'Quarterly return filing',
      description: 'One return for salary payments, one for all other deductions. Ollvy CA reconciles everything with your payment slips before filing.',
    },
    {
      title: 'Tax certificates for employees and vendors',
      description: 'Once returns are filed, tax certificates are generated - Form 16 for employees (they need it to file their own taxes) and Form 16A for vendors.',
    },
  ],

  risks: [
    {
      title: 'TDS must be deposited by the 7th',
      description: '1.5% per month interest from the date of deduction if deposited late. For March TDS, the deadline is April 30.',
    },
    {
      title: 'Wrong TDS rate',
      description: 'Deducting too little makes you liable for the shortfall plus interest. Ollvy CA applies the current rates for every payment type.',
    },
    {
      title: 'Missing PAN from vendors or contractors',
      description: 'If a vendor or contractor doesn\'t share their PAN, you must deduct at the higher rate of 20%. Ollvy CA flags missing PANs during data review.',
    },
  ],

  personas: [
    {
      title: 'Paying employees',
      description: 'Salary TDS handled every month. Tax certificates generated for all employees every quarter.',
    },
    {
      title: 'Paying contractors or consultants',
      description: 'Contractor and professional fee payments covered. Most commonly missed TDS obligation for small businesses.',
    },
    {
      title: 'Multiple payment types',
      description: 'Rent, salary, contractors, professional fees - all categories covered under one retainer.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'Who needs to deduct TDS?',
      a: 'Any business paying: salary to employees, rent above Rs. 2.4 lakh/year, contractor payments above Rs. 30,000 per contract or Rs. 1 lakh/year, or professional fees above Rs. 30,000/year.',
    },
    {
      category: 'General',
      q: 'What happens if I do not deduct TDS?',
      a: 'The entire expense gets disallowed - you pay income tax on it as if it were profit. Plus 1% per month interest on the amount that should have been deducted. And Rs. 200/day penalty for late return filing.',
    },
    {
      category: 'General',
      q: 'When must TDS be deposited?',
      a: 'By the 7th of the following month for most payments. For March, the deadline is April 30. Late deposit means 1.5% per month interest from the due date.',
    },
    {
      category: 'General',
      q: 'When are TDS returns due?',
      a: 'Q1 (April-June): July 31. Q2 (July-September): October 31. Q3 (October-December): January 31. Q4 (January-March): May 31.',
    },
    {
      category: 'General',
      q: 'What is Form 16 and who needs it?',
      a: 'Form 16 is the tax certificate you give employees at the end of the year. It shows their salary and how much tax was deducted. They need it to file their own income tax return. Ollvy CA generates Form 16 for all your employees after the last quarterly return is filed.',
    },
    {
      category: 'General',
      q: 'What is Form 16A?',
      a: 'Form 16A is the tax certificate for non-salary payments - contractor fees, professional fees, rent, interest. You issue it to vendors after each quarterly return is filed. Vendors need it to claim the deducted amount as a credit in their own tax return.',
    },
  ],

  govtFees: {
    caption: 'TDS rates and when to deduct',
    headers: ['Payment Type', 'Section', 'Threshold', 'TDS Rate'],
    rows: [
      ['Salary', '192', 'Above basic exemption limit', 'As per income tax slab rate'],
      ['Contractor (individual)', '194C', 'Rs. 30,000/payment or Rs. 1 lakh/year', '1%'],
      ['Contractor (company)', '194C', 'Rs. 30,000/payment or Rs. 1 lakh/year', '2%'],
      ['Professional/technical fees', '194J', 'Rs. 30,000/year', '10%'],
      ['Rent - company paying (land/building)', '194I', 'Rs. 2.4 lakh/year', '10%'],
      ['Rent - individual paying (land/building)', '194IB', 'Rs. 50,000/month', '5%'],
      ['Interest from banks/NBFCs', '194A', 'Rs. 40,000/year (Rs. 50,000 for senior citizens)', '10%'],
      ['Commission or brokerage', '194H', 'Rs. 15,000/year', '5%'],
      ['No PAN provided', '206AA', 'Any payment', '20% or applicable rate, whichever is higher'],
    ],
  },

  documents: {
    caption: 'Data you\'ll share each month',
    headers: ['Data', 'Required For', 'Notes'],
    rows: [
      ['Salary register / payroll', 'Salary TDS return', 'Gross salary, PF deductions, and net pay per employee'],
      ['Contractor invoice list', 'Non-salary TDS return', 'Name, PAN, amount paid, nature of work'],
      ['Professional fee payments', 'Non-salary TDS return', 'Name, PAN, amount paid'],
      ['Rent payments', 'Non-salary TDS return', 'Landlord name, PAN, monthly rent amount'],
      ['Interest payments (if any)', 'Non-salary TDS return', 'Payee name, PAN, interest amount'],
      ['PAN of all vendors and contractors', 'All payment types', 'Missing PAN triggers 20% TDS rate'],
    ],
  },
}


// ─── 9. MSME / Udyam Registration ────────────────────────────────────────────

export const msmeRegistration: ServicePageConfig = {
  slug: 'msme-registration',
  title: 'MSME / Udyam Registration',
  tagline: 'Free government recognition. Priority lending. Payment protection.',
  seoTitle: 'Udyam MSME Registration Online India 2026 | Free Govt Certificate | Ollvy',
  seoDescription: 'Udyam Registration certificate in 2 working days. Unlocks collateral-free loans up to Rs. 10 crore, 45-day payment protection, and GeM tender access.',
  canonicalUrl: 'https://www.ollvy.com/services/msme-registration',
  lastReviewed: 'April 2026',
  category: 'Registration',

  relatedServiceSlugs: ['pvt-ltd-incorporation', 'gst-registration'],
  relatedLearnSlugs: ['is-msme-registration-worth-it', 'should-i-get-dpiit-startup-recognition'],

  explainer: {
    whatItIs: 'Udyam Registration is official government recognition of your business as a Micro, Small, or Medium Enterprise. Done on the Udyam portal, it is linked to your PAN and Aadhaar and is completely free. You receive a registration number that unlocks all MSME benefits.',
    whyYouNeedIt: 'Access to any MSME benefit requires Udyam Registration. Banks must give priority lending to registered MSMEs - better rates and easier approval. Buyers above a certain size must pay you within 45 days - you can enforce this through the government\'s MSME dispute portal. Government procurement portals have MSME-exclusive categories.',
    whatHappensWithout: 'Priority bank lending with lower interest rates is unavailable. Large buyers can delay payment indefinitely without legal consequence. No access to the 25% of government contracts reserved for MSMEs. State subsidies requiring MSME status are unavailable.',
  },

  workflow: [
    {
      step: 1,
      title: 'Share Aadhaar and PAN',
      timeframe: 'Day 0',
      description: 'Owner Aadhaar for OTP verification and business PAN. GST number if you have one. Ollvy confirms your classification based on investment and turnover.',
      milestone: 'Details received',
    },
    {
      step: 2,
      title: 'Application filed on Udyam portal',
      timeframe: 'Day 1',
      description: 'Filed on the official government portal with your investment and turnover details. GST linked automatically.',
      milestone: 'Application submitted',
    },
    {
      step: 3,
      title: 'Udyam certificate issued',
      timeframe: 'Day 1-2',
      description: 'Certificate with your registration number generated. Classification confirmed: Micro, Small, or Medium.',
      milestone: 'MSME registered',
    },
  ],

  included: [
    {
      title: 'Udyam certificate with registration number',
      description: 'Official certificate recognised by all banks, government departments, and government procurement portals.',
    },
    {
      title: 'Classification confirmed',
      description: 'Micro, Small, or Medium status confirmed based on your investment and turnover. Classification determines which schemes and benefits apply.',
    },
    {
      title: 'GST number linked automatically',
      description: 'Your GST registration is linked to your Udyam registration automatically during the application.',
    },
  ],

  risks: [
    {
      title: 'Self-declaration accuracy',
      description: 'Investment and turnover figures are self-declared. Keep supporting records (ITR, asset register) in case of verification.',
    },
    {
      title: 'Update when classification changes',
      description: 'Udyam registration does not expire, but if your turnover or investment moves you to a different category, update the registration on the Udyam portal.',
    },
  ],

  personas: [
    {
      title: 'Applying for a bank loan',
      description: 'Banks require Udyam certificate for priority lending. With it, you can get collateral-free loans up to Rs. 10 crore through the government guarantee scheme.',
    },
    {
      title: 'Selling to the government',
      description: 'Government procurement portals require Udyam registration for MSME seller benefits and exclusive tender categories.',
    },
    {
      title: 'Supplying to large corporates',
      description: 'With Udyam registration, large buyers must pay you within 45 days. If they don\'t, you can file a complaint through the government\'s dispute portal and they owe you interest automatically.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'What are the MSME thresholds as of April 2025?',
      a: 'Micro: investment up to Rs. 2.5 crore AND turnover up to Rs. 10 crore. Small: investment up to Rs. 25 crore AND turnover up to Rs. 100 crore. Medium: investment up to Rs. 125 crore AND turnover up to Rs. 500 crore. Both criteria apply together - crossing either moves you to the next category.',
    },
    {
      category: 'General',
      q: 'Is Udyam registration free?',
      a: 'Registration on the government portal is completely free. The Ollvy fee covers the filing assistance and certificate delivery.',
    },
    {
      category: 'General',
      q: 'What is CGTMSE and how does it help?',
      a: 'It\'s a government scheme that lets registered MSMEs get bank loans without pledging assets as collateral. The guarantee covers loans up to Rs. 10 crore for micro and small enterprises.',
    },
    {
      category: 'General',
      q: 'What is the 45-day payment rule?',
      a: 'Large buyers must pay MSME suppliers within 45 days of accepting goods or services (15 days if there\'s no written agreement). If they take longer, they automatically owe compound interest at 3 times the bank rate. You can file a complaint through the government\'s dispute portal and it must be resolved within 90 days.',
    },
    {
      category: 'General',
      q: 'Does Udyam registration expire?',
      a: 'No expiry. But update it if your investment or turnover changes your classification. The portal syncs with your tax return data annually and may auto-update your classification.',
    },
    {
      category: 'General',
      q: 'Can a Pvt Ltd company register as MSME?',
      a: 'Yes. Any business structure - sole proprietorship, partnership, LLP, or Pvt Ltd company - can register under Udyam as long as it meets the investment and turnover criteria.',
    },
    {
      category: 'General',
      q: 'I have an old Udyog Aadhar. Is it still valid?',
      a: 'No. Udyog Aadhar registrations expired on December 31, 2021. Re-register on the Udyam portal at udyamregistration.gov.in. Old certificates are not accepted for scheme benefits.',
    },
  ],

  govtFees: {
    caption: 'Government fees',
    headers: ['Item', 'Fee', 'Notes'],
    rows: [
      ['Udyam Registration', 'Nil', 'Government portal fee is zero - completely free'],
      ['Update of registration', 'Nil', 'Classification updates are also free'],
    ],
  },

  documents: {
    caption: 'Documents you\'ll need',
    headers: ['Document', 'Required', 'Notes'],
    rows: [
      ['Aadhaar card (owner/director)', 'Mandatory', 'OTP sent to Aadhaar-linked mobile during registration'],
      ['Business PAN', 'Mandatory', 'Company PAN, LLP PAN, or owner PAN for proprietors'],
      ['GSTIN', 'Mandatory if GST-registered', 'Auto-linked during registration'],
      ['Investment in plant and machinery', 'Declare (no upload)', 'Current value as per your latest tax return - not the original purchase price'],
      ['Annual turnover', 'Declare (no upload)', 'As per your latest tax return; self-declared'],
    ],
  },
}

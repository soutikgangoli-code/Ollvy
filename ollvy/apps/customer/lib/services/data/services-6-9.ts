import type { ServicePageConfig } from '../types'

// ─── 6. Trademark Registration ────────────────────────────────────────────────

export const trademarkRegistration: ServicePageConfig = {
  slug: 'trademark-registration',
  title: 'Trademark Registration',
  tagline: '10-year brand protection. Filed in 7 days.',
  seoTitle: 'Trademark Registration in India 2025 | Rs. 4,500 Govt Fee | Ollvy',
  seoDescription: 'Trademark application filed in 7 days. Search, class guidance, filing, and examiner objection response included. Govt fee Rs. 4,500 per class (small entities).',
  canonicalUrl: 'https://www.ollvy.com/services/trademark-registration',
  lastReviewed: 'April 2026',
  category: 'Trademark',

  relatedServiceSlugs: ['pvt-ltd-incorporation', 'gst-registration'],
  relatedLearnSlugs: ['do-i-need-trademark-registration'],

  explainer: {
    whatItIs: 'Trademark registration gives you exclusive rights to use your brand name, logo, or tagline for a specific category of goods or services across India for 10 years (renewable indefinitely). Registered under the Trade Marks Act, 1999, it gives you the right to use ® and take legal action against infringers.',
    whyYouNeedIt: 'Without registration, you have limited legal recourse against anyone using your brand name. In India, trademark rights go to whoever registers first - not whoever used the name first. E-commerce platforms (Amazon Brand Registry, Flipkart) require trademark registration for brand protection.',
    whatHappensWithout: 'Proving "passing off" without a registered trademark requires demonstrating prior reputation in court - expensive and uncertain. Anyone can register a similar name in your category. No access to Amazon Brand Registry or Flipkart brand protection features.',
  },

  workflow: [
    {
      step: 1,
      title: 'Tell us your brand name and category',
      timeframe: 'Day 0',
      description: 'Trademark attorney assigned within 4 hours. You provide the mark, the classes you want to protect, and your business details. Preliminary search started immediately.',
      milestone: 'Attorney assigned, search started',
    },
    {
      step: 2,
      title: 'Trademark search report delivered',
      timeframe: 'Day 1-2',
      description: 'Attorney searches the Trademark Registry for identical and similar marks in your classes. If your mark is clear, we proceed. If conflicts exist, we suggest modifications.',
      milestone: 'Search report delivered',
    },
    {
      step: 3,
      title: 'Application filed with Trademark Registry',
      timeframe: 'Day 3-7',
      description: 'Attorney drafts the application, selects the correct classes, and files. You receive your application number and filing receipt. Your rights are protected from this filing date - not from the certificate date.',
      milestone: 'Application filed, receipt received',
    },
    {
      step: 4,
      title: 'Examination and publication',
      timeframe: '6-12 months (government processing)',
      description: 'The Trademark Registry examines your application. If objections are raised, your attorney responds - included in scope. Once cleared, the mark is published in the Trademark Journal for 4 months.',
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
      description: 'Attorney searches the Registry before spending your government fee. If your exact mark is already registered in your class, we tell you upfront.',
      without: 'File without searching, wait months, get rejected',
      withOllvy: 'Search first, modify if needed, then file',
    },
    {
      title: 'Class selection guidance',
      description: 'Trademarks are registered per class (45 classes). Attorney recommends only the classes you actually need.',
    },
    {
      title: 'Examiner objection response included',
      description: 'If the Trademark Examiner raises objections, your attorney responds. Included in the service - not a separate charge.',
    },
    {
      title: 'Renewal reminder',
      description: 'Trademark expires 10 years from filing date. Renewal reminder added to your compliance calendar 6 months before expiry.',
    },
  ],

  risks: [
    {
      title: 'Similar mark already registered',
      description: 'If a similar mark is registered in your class, the Examiner will object. Our search catches most conflicts, but pending applications not yet published cannot be seen. If rejected, we help you appeal or modify.',
    },
    {
      title: 'Government processing takes 12-18 months',
      description: 'The 7-day timeline is for filing. Examination, publication, and certificate issuance are government-side. We track and update you but cannot speed up the Registry.',
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
      description: 'IP due diligence will flag an unregistered brand. Register before you start your fundraising process.',
    },
    {
      title: 'First trademark, no prior registrations',
      description: 'Never registered before. We explain classes, search, and the full process.',
    },
    {
      title: 'Logo and word mark both needed',
      description: 'Two separate applications. We handle both. Broader protection.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'What is the government fee for trademark registration in India?',
      a: 'Rs. 4,500 per class for individuals, startups, and small entities. Rs. 9,000 per class for companies and LLPs. These are one-time fees for a 10-year term, not annual fees.',
    },
    {
      category: 'General',
      q: 'How long does trademark protection last?',
      a: '10 years from the filing date, renewable indefinitely in 10-year increments. Renewal costs Rs. 9,000 per class (small entities) or Rs. 10,000 (others).',
    },
    {
      category: 'General',
      q: 'Can I use the ® symbol after filing?',
      a: 'No. The ® symbol can only be used after registration is granted. Use TM (for goods) or SM (for services) to indicate your claim while the application is pending. Using ® before registration is an offence.',
    },
    {
      category: 'General',
      q: 'What is a trademark class and which one do I need?',
      a: 'Goods and services are divided into 45 categories called classes under the Nice Classification. You register per class. Class 42 is software and tech services; Class 25 is clothing; Class 35 is retail and marketing. Using the wrong class leaves you unprotected in the category you actually operate in. Most businesses need 1-3 classes.',
    },
    {
      category: 'General',
      q: 'What if someone is already using my brand name without registering it?',
      a: 'Prior unregistered use gives you some rights under "passing off" law, but proving it requires demonstrating established reputation in court - expensive and slow. If neither party has registered, filing now gives you formal priority over any future registration by that person.',
    },
    {
      category: 'Process',
      q: 'Why does full registration take 12-18 months if filing takes 7 days?',
      a: 'The 7-day timeline is for filing the application. Examination by the Trademark Registry takes 6-12 months. Then 4 months of public opposition window. Then certificate issuance. All government-side. Your rights are protected from the filing date - not the certificate date.',
    },
    {
      category: 'Documents',
      q: 'What documents do I need for trademark registration?',
      a: 'PAN card, Aadhaar or address proof, and the logo file if registering a logo (JPG, minimum 8cm x 8cm, black on white background). For companies: Certificate of Incorporation and board resolution. For small entity fee: MSME certificate or startup recognition certificate.',
    },
    {
      category: 'General',
      q: 'Can I trademark a common word like "Fresh" or "Quick"?',
      a: 'Descriptive or generic words are difficult to register on their own. A distinctive combination, stylised logo, or word used in an unexpected context (Apple for computers) can be protected. Our attorney assesses registrability before you spend the government fee.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - Trademark Registration in India (2025)',
    headers: ['Applicant Type', 'New Application (per class)', 'Renewal (per class)', 'Notes'],
    rows: [
      ['Individual / Startup / Small Entity', 'Rs. 4,500', 'Rs. 9,000', 'As defined under Trademark Rules 2017; 10% reduction for e-filing'],
      ['Company, LLP, or other entity', 'Rs. 9,000', 'Rs. 10,000', 'Per class; 10% reduction for e-filing'],
      ['Expedited examination (optional)', 'Rs. 20,000 (small) / Rs. 40,000 (others)', 'N/A', 'Faster review, not faster registration'],
    ],
  },

  documents: {
    caption: 'Documents Required - Trademark Registration',
    headers: ['Document', 'Required For', 'Notes'],
    rows: [
      ['PAN card', 'All applicants', 'Identity and address verification'],
      ['Aadhaar or address proof', 'Individual applicants', 'Any government-issued address proof'],
      ['Logo file', 'Logo trademark applications', 'JPG format; minimum 8cm x 8cm; black mark on white background'],
      ['Certificate of Incorporation', 'Company or LLP applicants', 'Proof of entity registration'],
      ['Board resolution or POA', 'Company or LLP applicants', 'Authorising the filing'],
      ['MSME / Startup certificate', 'For reduced govt fee', 'Udyam certificate or DPIIT recognition certificate'],
      ['User affidavit', 'If claiming prior use date', 'States date of first use in commerce in India'],
    ],
  },
}


// ─── 7. MCA Annual Filing ─────────────────────────────────────────────────────

export const mcaAnnualFiling: ServicePageConfig = {
  slug: 'mca-annual-filing',
  title: 'MCA Annual Filing',
  tagline: 'AOC-4 and MGT-7 filed every year. Penalty stopped the moment we file.',
  seoTitle: 'MCA Annual Filing India 2025 | AOC-4 and MGT-7 for Pvt Ltd | Ollvy',
  seoDescription: 'MCA annual ROC compliance for Private Limited companies. AOC-4 within 30 days of AGM, MGT-7 within 60 days. Rs. 100/day penalty stopped on filing.',
  canonicalUrl: 'https://www.ollvy.com/services/mca-annual-filing',
  lastReviewed: 'April 2026',
  category: 'Compliance',

  relatedServiceSlugs: ['business-itr', 'tds-monthly-compliance', 'pvt-ltd-incorporation'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp'],

  explainer: {
    whatItIs: 'MCA Annual Filing for a Private Limited Company consists of two mandatory ROC forms: AOC-4 (audited financial statements) and MGT-7 (annual return with shareholding and director details). Both are filed with the Registrar of Companies every year.',
    whyYouNeedIt: 'Mandatory for every Pvt Ltd regardless of whether the company was active. AOC-4 is due within 30 days of the AGM. MGT-7 within 60 days. The AGM must be held by September 30 for companies with a March financial year-end. Non-filing shows as Default on MCA - visible to anyone doing due diligence.',
    whatHappensWithout: 'Rs. 100 per day per form in additional MCA fee, with no ceiling. Both forms outstanding means Rs. 200/day. Directors can be disqualified under Section 164(2) after three years of default. Company can be struck off as defunct after 2 consecutive years of non-filing.',
  },

  workflow: [
    {
      step: 1,
      title: 'Share company details',
      timeframe: 'Day 0',
      description: 'Company CIN, financial year, AGM date, and status of audited financials. CS assigned.',
      milestone: 'CS assigned',
    },
    {
      step: 2,
      title: 'Upload financial statements and documents',
      timeframe: 'Day 0-2',
      description: 'Audited Balance Sheet, P&L, director report, auditor report, and shareholder list. CS reviews before drafting forms.',
      milestone: 'Documents reviewed',
    },
    {
      step: 3,
      title: 'Forms drafted and sent for your approval',
      timeframe: 'Day 2-4',
      description: 'AOC-4 and MGT-7 drafted. You review and approve in the app.',
      milestone: 'Draft forms approved',
    },
    {
      step: 4,
      title: 'Filed on MCA21 - SRN generated',
      timeframe: 'Day 5-7',
      description: 'Both forms filed. Service Request Numbers shared immediately as proof of filing.',
      milestone: 'AOC-4 and MGT-7 filed',
    },
  ],

  included: [
    {
      title: 'Both forms filed - AOC-4 and MGT-7',
      description: 'AOC-4 for financial statements, MGT-7 for annual return. Both included in scope.',
    },
    {
      title: 'Deadline calculation based on your AGM date',
      description: 'AOC-4 due 30 days after AGM. MGT-7 due 60 days after AGM. We track both from the AGM date you provide.',
    },
    {
      title: 'Penalty calculation if filing late',
      description: 'If filing after the deadline, we calculate the exact additional MCA fee upfront before filing. No surprises.',
    },
    {
      title: 'SRN shared immediately',
      description: 'Service Request Number is your proof of filing. Both SRNs shared the day forms are submitted.',
    },
  ],

  risks: [
    {
      title: 'Audit must be complete first',
      description: 'AOC-4 requires signed, audited financial statements. We cannot file until the audit is done. Plan your audit timeline to allow filing before the MCA deadline.',
    },
    {
      title: 'Penalty accrues daily from the deadline',
      description: 'Additional MCA fee of Rs. 100 per day per form from the due date - Rs. 200/day for both forms combined. No ceiling. File as soon as audited financials are ready.',
    },
    {
      title: 'AGM must be held by September 30',
      description: 'Companies with a March year-end must hold their AGM by September 30. If delayed, MCA filing deadlines shift - we calculate new deadlines from your actual AGM date.',
    },
  ],

  personas: [
    {
      title: 'Running past the deadline',
      description: 'Already in default. We calculate the exact additional fee and file immediately to stop it growing.',
    },
    {
      title: 'Director changes during the year',
      description: 'Appointments and resignations reflected correctly in MGT-7.',
    },
    {
      title: 'Share transfer happened',
      description: 'Updated shareholding pattern captured accurately in MGT-7.',
    },
    {
      title: 'First year after incorporation',
      description: 'First MCA filing. We explain every field and what it means for your company records.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'When is MCA annual filing due for Pvt Ltd?',
      a: 'AOC-4: within 30 days of AGM (typically October 30 for companies with March year-end and AGM on September 30). MGT-7: within 60 days of AGM (typically November 29). AGM must be held by September 30.',
    },
    {
      category: 'General',
      q: 'What is the penalty for not filing AOC-4 and MGT-7?',
      a: 'Rs. 100 per day per form as additional MCA fee from the due date. Both forms outstanding means Rs. 200/day. This has no ceiling and continues until filed. After 3 years of consistent default, directors can be disqualified under Section 164(2).',
    },
    {
      category: 'General',
      q: 'Is MCA annual filing different from Business ITR?',
      a: 'Yes. MCA annual filing (AOC-4 + MGT-7) is filed with the Ministry of Corporate Affairs (company registry). Business ITR (ITR-6) is filed with the Income Tax department. Both are mandatory with separate deadlines and separate penalties.',
    },
    {
      category: 'General',
      q: 'What happens if a company does not file for 2 years?',
      a: 'The Registrar of Companies can strike off the company as defunct under Section 248 of the Companies Act. Restoring a struck-off company is possible but involves a lengthy NCLT process. Every director on such a company is also disqualified from directorship for 5 years under Section 164(2).',
    },
    {
      category: 'Process',
      q: 'Can I file if the statutory audit is not complete?',
      a: 'No. AOC-4 requires signed, audited financials. Plan your audit timeline carefully - the auditor must sign off before the MCA filing deadline.',
    },
    {
      category: 'Documents',
      q: 'What documents are needed for MCA annual filing?',
      a: 'Audited Balance Sheet, P&L, notes to accounts, directors report, auditor report, AGM date, and the updated shareholder register with current holdings.',
    },
    {
      category: 'General',
      q: 'Does an LLP need to file AOC-4 and MGT-7?',
      a: 'No. LLPs file Form 8 (Statement of Account and Solvency, due Oct 30) and Form 11 (Annual Return, due May 30). These are different forms for LLPs - not AOC-4 and MGT-7.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - MCA Annual Filing (2025)',
    headers: ['Item', 'Fee', 'Notes'],
    rows: [
      ['Normal AOC-4 filing fee', 'Rs. 200-600', 'Based on company paid-up capital; paid at MCA portal'],
      ['Normal MGT-7 filing fee', 'Rs. 200-600', 'Based on company paid-up capital; paid at MCA portal'],
      ['Additional fee (late filing)', '2x to 12x of normal fee', 'Up to 30 days: 2x | 30-60 days: 4x | 60-90 days: 6x | 90-180 days: 10x | above 180 days: 12x'],
      ['Penalty under Section 137(3) - AOC-4', 'Rs. 10,000 + Rs. 100/day', 'If MCA initiates formal action; separate from additional filing fee'],
    ],
  },

  documents: {
    caption: 'Documents Required - MCA Annual Filing',
    headers: ['Document', 'For AOC-4', 'For MGT-7'],
    rows: [
      ['Audited Balance Sheet', 'Yes - mandatory', 'No'],
      ['Audited P&L Statement', 'Yes - mandatory', 'No'],
      ['Directors Report', 'Yes', 'No'],
      ['Auditors Report', 'Yes', 'No'],
      ['AGM date and notice', 'Yes - drives deadline', 'Yes - drives deadline'],
      ['Shareholder register (current)', 'No', 'Yes - all shareholders with holdings'],
      ['Director details (DIN, appointment dates)', 'No', 'Yes'],
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
  seoTitle: 'TDS Filing Service India 2025 | Monthly TDS Compliance | Ollvy',
  seoDescription: 'Monthly TDS calculation, challan preparation, and quarterly return filing. Deposit by the 7th. Covers salary, contractor, rent, professional fees.',
  canonicalUrl: 'https://www.ollvy.com/services/tds-monthly-compliance',
  lastReviewed: 'April 2026',
  category: 'Tax',

  relatedServiceSlugs: ['business-itr', 'gst-monthly-50l', 'mca-annual-filing'],
  relatedLearnSlugs: ['do-i-need-to-file-itr'],

  explainer: {
    whatItIs: 'TDS compliance means withholding tax from payments you make to vendors, contractors, employees, and landlords, depositing it with the government by the 7th of the following month, and filing quarterly returns (Form 24Q for salary, Form 26Q for non-salary).',
    whyYouNeedIt: 'Any business making payments above TDS thresholds for rent, professional fees, contractor payments, or salary must deduct and deposit TDS. Failure to deduct means the entire expense is disallowed under Section 40(a)(ia) - you pay income tax on money you already spent.',
    whatHappensWithout: 'Interest at 1.5% per month on late deposit (1% per month if not deducted at all). Rs. 200/day for late quarterly return filing. The expense on which TDS was not deducted is disallowed under Section 40(a)(ia) - taxed as if it were profit.',
  },

  workflow: [
    {
      step: 1,
      title: 'Share your payment register',
      timeframe: 'Day 1-5 of month',
      description: 'Salary, vendor, rent, and contractor payments for the month. Ollvy CA reviews applicable TDS rates for each payment category.',
      milestone: 'Data received',
    },
    {
      step: 2,
      title: 'TDS calculated and challans prepared',
      timeframe: 'Day 5-6',
      description: 'Ollvy CA calculates TDS for each payment category. Challans prepared with correct BSR codes and assessment year.',
      milestone: 'Challans ready',
    },
    {
      step: 3,
      title: 'You pay the challans',
      timeframe: 'Day 6-7',
      description: 'You transfer through net banking. CIN (Challan Identification Number) uploaded to your account as proof.',
      milestone: 'TDS deposited by 7th',
    },
    {
      step: 4,
      title: 'Quarterly return filed',
      timeframe: 'Quarter end',
      description: 'Ollvy CA files Form 24Q (salary TDS) and Form 26Q (non-salary TDS). Form 16 and 16A generation enabled after filing.',
      milestone: 'TDS return filed',
    },
  ],

  included: [
    {
      title: 'TDS calculation for all payment types',
      description: 'Salary (192), contractor payments (194C), professional fees (194J), rent (194I/194IB), interest (194A). Correct rates applied to each.',
    },
    {
      title: 'Challan preparation with correct codes',
      description: 'Challan requires correct BSR code, assessment year, and minor head. Errors cause mismatches in deductees\' Form 26AS. We prepare - you pay.',
      without: 'Wrong BSR code or assessment year - causes 26AS mismatch and notice',
      withOllvy: 'Correct challan prepared every time',
    },
    {
      title: 'Quarterly return filing - 24Q and 26Q',
      description: 'Form 24Q for salary TDS, Form 26Q for all other deductions. Returns reconciled with challans before filing.',
    },
    {
      title: 'Form 16 and 16A generation',
      description: 'Once returns are filed, Form 16 (salary) and Form 16A (non-salary) can be downloaded from TRACES for your deductees.',
    },
  ],

  risks: [
    {
      title: 'TDS must be deposited by the 7th',
      description: '1.5% per month interest from the date of deduction if deposited late. For March TDS, the deadline is April 30.',
    },
    {
      title: 'Wrong TDS rate',
      description: 'Under-deducting makes you liable for the shortfall plus interest. We apply current applicable rates for each section.',
    },
    {
      title: 'Missing PAN of deductees',
      description: 'TDS at the higher rate of 20% applies if the deductee\'s PAN is not provided. We flag missing PANs during data review.',
    },
  ],

  personas: [
    {
      title: 'Paying employees',
      description: 'Form 24Q salary TDS handled, Form 16 generated every quarter.',
    },
    {
      title: 'Paying contractors or consultants',
      description: 'Form 26Q for 194C and 194J payments. Most commonly missed by small businesses.',
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
      a: 'Any business or individual making payments above prescribed thresholds: salary, rent above Rs. 2.4 lakh/year (194I) or Rs. 50,000/month (194IB for individuals), contractor payments above Rs. 30,000/contract or Rs. 1 lakh/year (194C), professional fees above Rs. 30,000/year (194J).',
    },
    {
      category: 'General',
      q: 'What happens if I do not deduct TDS?',
      a: 'The expense is disallowed under Section 40(a)(ia) - you pay income tax on it as if it were profit. Plus 1% per month interest on the amount that should have been deducted. And Rs. 200/day penalty for late TDS return filing.',
    },
    {
      category: 'General',
      q: 'When must TDS be deposited?',
      a: 'By the 7th of the following month for most payments. For March, the deadline is April 30. Late deposit attracts 1.5% per month interest under Section 201(1A).',
    },
    {
      category: 'General',
      q: 'When are TDS returns due?',
      a: 'Q1 (April-June): July 31. Q2 (July-September): October 31. Q3 (October-December): January 31. Q4 (January-March): May 31.',
    },
    {
      category: 'General',
      q: 'What is Form 16 and who needs it?',
      a: 'Form 16 is the TDS certificate issued by employers to employees after the Q4 TDS return is filed. It shows salary paid and TDS deducted for the year. Employees need it to file their personal ITR. We generate Form 16 for all your employees after the Q4 return is filed.',
    },
    {
      category: 'General',
      q: 'What is Form 16A?',
      a: 'Form 16A is the TDS certificate for non-salary payments - contractor fees, professional fees, rent, interest. Issued by you to your vendors after each quarter\'s TDS return is filed. Your vendors use it to claim TDS credit in their own tax returns.',
    },
  ],

  govtFees: {
    caption: 'TDS Rates and Deadlines Reference (FY 2025-26)',
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
      ['Penalty for no PAN (all sections)', 'Section 206AA', 'Any payment', '20% or applicable rate, whichever is higher'],
    ],
  },

  documents: {
    caption: 'Data Required Each Month - TDS Compliance',
    headers: ['Data', 'Required For', 'Notes'],
    rows: [
      ['Salary register / payroll', 'Form 24Q and Section 192 TDS', 'Gross salary, PF deductions, and net pay per employee'],
      ['Contractor invoice list', 'Form 26Q and Section 194C', 'Name, PAN, amount paid, nature of work'],
      ['Professional fee payments', 'Form 26Q and Section 194J', 'Name, PAN, amount paid'],
      ['Rent payments', 'Form 26Q and Section 194I/194IB', 'Landlord name, PAN, monthly rent amount'],
      ['Interest payments (if any)', 'Form 26Q and Section 194A', 'Payee name, PAN, interest amount'],
      ['PAN of all deductees', 'All sections', 'Missing PAN triggers 20% TDS rate'],
    ],
  },
}


// ─── 9. MSME / Udyam Registration ────────────────────────────────────────────

export const msmeRegistration: ServicePageConfig = {
  slug: 'msme-registration',
  title: 'MSME / Udyam Registration',
  tagline: 'Free government recognition. Priority lending. Payment protection.',
  seoTitle: 'Udyam MSME Registration Online India 2025 | Free Govt Certificate | Ollvy',
  seoDescription: 'Udyam Registration certificate in 2 working days. Unlocks collateral-free loans up to Rs. 10 crore, 45-day payment protection, and GeM tender access.',
  canonicalUrl: 'https://www.ollvy.com/services/msme-registration',
  lastReviewed: 'April 2026',
  category: 'Registration',

  relatedServiceSlugs: ['pvt-ltd-incorporation', 'gst-registration'],
  relatedLearnSlugs: ['is-msme-registration-worth-it', 'should-i-get-dpiit-startup-recognition'],

  explainer: {
    whatItIs: 'Udyam Registration is official government recognition of your business as a Micro, Small, or Medium Enterprise under the MSME Development Act, 2006. Done on the Udyam portal, it is linked to your PAN and Aadhaar and is completely free. You receive a Udyam Registration Number (URN) that unlocks MSME benefits.',
    whyYouNeedIt: 'Access to any MSME benefit requires Udyam Registration. Banks are mandated to give priority sector lending to registered MSMEs. Buyers above a certain size must pay you within 45 days - you can enforce this through MSME Samadhaan. Government procurement on GeM has MSME-exclusive categories.',
    whatHappensWithout: 'Priority sector bank lending with lower interest rates is unavailable. Large buyers can delay payment indefinitely without legal consequence. No access to the 25% government procurement reservation for MSMEs. State subsidies requiring MSME status are unavailable.',
  },

  workflow: [
    {
      step: 1,
      title: 'Share Aadhaar and PAN',
      timeframe: 'Day 0',
      description: 'Owner Aadhaar for OTP verification, business PAN. GSTIN if you have one. Classification confirmed based on your investment and turnover.',
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
      description: 'Certificate with Unique Registration Number generated. Classification confirmed: Micro, Small, or Medium.',
      milestone: 'MSME registered',
    },
  ],

  included: [
    {
      title: 'Udyam certificate with URN',
      description: 'Official certificate recognised by all banks, government departments, and the GeM marketplace.',
    },
    {
      title: 'Classification confirmed',
      description: 'Micro, Small, or Medium status confirmed based on your investment and turnover. Classification determines which schemes and benefits apply.',
    },
    {
      title: 'GSTIN linked automatically',
      description: 'Your GST registration is linked to your Udyam registration during the application.',
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
      description: 'Banks require Udyam certificate for priority sector classification and CGTMSE collateral-free loans.',
    },
    {
      title: 'GeM seller',
      description: 'Government e-marketplace requires Udyam registration for MSME seller benefits and exclusive tender categories.',
    },
    {
      title: 'Supplying to large corporates',
      description: 'Udyam registration lets you invoke the 45-day payment protection under MSME Samadhaan if large buyers delay payment.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'What are the MSME thresholds as of April 2025?',
      a: 'Micro: investment up to Rs. 2.5 crore AND turnover up to Rs. 10 crore. Small: investment up to Rs. 25 crore AND turnover up to Rs. 100 crore. Medium: investment up to Rs. 125 crore AND turnover up to Rs. 500 crore. Both criteria apply together - crossing either moves you to the next category. Source: Ministry of MSME Notification S.O. 1364(E), March 21, 2025.',
    },
    {
      category: 'General',
      q: 'Is Udyam registration free?',
      a: 'Registration on the government portal is completely free. The Ollvy fee covers the filing assistance and certificate delivery.',
    },
    {
      category: 'General',
      q: 'What is CGTMSE and how does it help?',
      a: 'CGTMSE (Credit Guarantee Fund Trust for Micro and Small Enterprises) allows registered MSMEs to get loans without pledging assets as collateral. The credit guarantee cover was increased to Rs. 10 crore for micro and small enterprises in Union Budget 2025.',
    },
    {
      category: 'General',
      q: 'What is the 45-day payment rule?',
      a: 'Under Section 15 of the MSMED Act, buyers must pay MSME suppliers within 45 days of accepting goods or services (15 days if no written agreement). Delay beyond 45 days triggers compound interest at 3x the RBI bank rate automatically. You can file a complaint through the MSME Samadhaan portal - a Facilitation Council must resolve it within 90 days.',
    },
    {
      category: 'General',
      q: 'Does Udyam registration expire?',
      a: 'No expiry. But update it if your investment or turnover changes your classification. The portal syncs with your ITR data annually and may auto-update your classification.',
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
    caption: 'Government Fees - Udyam Registration',
    headers: ['Item', 'Fee', 'Notes'],
    rows: [
      ['Udyam Registration', 'Nil', 'Government portal fee is zero - completely free'],
      ['Update of registration', 'Nil', 'Classification updates are also free'],
    ],
  },

  documents: {
    caption: 'Documents Required - Udyam MSME Registration',
    headers: ['Document', 'Required', 'Notes'],
    rows: [
      ['Aadhaar card (owner/director)', 'Mandatory', 'OTP sent to Aadhaar-linked mobile during registration'],
      ['Business PAN', 'Mandatory', 'Company PAN, LLP PAN, or owner PAN for proprietors'],
      ['GSTIN', 'Mandatory if GST-registered', 'Auto-linked during registration'],
      ['Investment in plant and machinery', 'Declare (no upload)', 'Written-down value as per latest ITR; not original cost'],
      ['Annual turnover', 'Declare (no upload)', 'As per latest ITR; self-declared'],
    ],
  },
}

import type { ServicePageConfig } from './types'

// ─── 1. Private Limited Company Registration ──────────────────────────────────

export const pvtLtdIncorporation: ServicePageConfig = {
  slug: 'pvt-ltd-incorporation',
  title: 'Private Limited Company Registration',
  tagline: 'Separate legal entity. Limited liability. Ready for investment.',
  seoTitle: 'Private Limited Company Registration in India 2025 | Ollvy',
  seoDescription: 'Register your Pvt Ltd company in 15 working days. DSC, DIN, MOA/AOA, PAN, TAN included. CA/CS assigned same day. From Rs. 1,499 + govt fees.',
  canonicalUrl: 'https://www.ollvy.com/services/pvt-ltd-incorporation',
  lastReviewed: 'April 2026',
  category: 'Incorporation',

  relatedServiceSlugs: ['llp-incorporation', 'gst-registration', 'trademark-registration', 'msme-registration'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'do-i-need-gst-registration', 'should-i-get-dpiit-startup-recognition'],

  explainer: {
    whatItIs: 'A Private Limited Company is a business entity registered under the Companies Act, 2013. It is a separate legal person - it can own property, enter contracts, hire employees, and sue or be sued in its own name. Shares are held privately by up to 200 shareholders and cannot be publicly traded.',
    whyYouNeedIt: 'If you plan to raise equity investment, Pvt Ltd is the only structure that works - investors receive shares, and an LLP cannot issue them. It also enables ESOPs, gives you a clean cap table, and provides the credibility enterprise clients and banks require.',
    whatHappensWithout: 'Operating as a proprietorship means unlimited personal liability - creditors can pursue your personal assets. You cannot raise equity, issue ESOPs, or provide the legal continuity that investors and acquirers require.',
  },

  workflow: [
    {
      step: 1,
      title: 'Answer 5 questions - we build your checklist',
      timeframe: 'Day 0',
      description: 'Number of directors, shareholders, proposed company name (3 options recommended), registered office state, and authorised capital. A company secretary is assigned within 4 hours.',
      milestone: 'CS assigned, personalised checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeframe: 'Day 0-2',
      description: 'PAN and Aadhaar for all directors, address proof for the registered office, passport photos. Your CS verifies every document before filing - mismatches caught here, not after MCA raises a query.',
      milestone: 'Documents verified by CS',
    },
    {
      step: 3,
      title: 'DSC and DIN arranged for all directors',
      timeframe: 'Day 2-4',
      description: 'Digital Signature Certificates and Director Identification Numbers are mandatory. We arrange DSC tokens and guide each director through video verification in the app.',
      milestone: 'DSC and DIN ready',
    },
    {
      step: 4,
      title: 'Name approved via RUN',
      timeframe: 'Day 4-7',
      description: 'Your CS files the Reserve Unique Name application with MCA. Approval typically takes 2-3 working days. If a name is rejected, we file alternatives immediately at no extra cost.',
      milestone: 'Company name approved',
    },
    {
      step: 5,
      title: 'SPICe+ filed - MOA, AOA, PAN, TAN in one submission',
      timeframe: 'Day 7-12',
      description: 'SPICe+ is the single MCA form for incorporation, PAN, TAN, and optional GST pre-enrolment. Your CS drafts the MOA and AOA based on your specific business activities.',
      milestone: 'SPICe+ submitted to MCA',
    },
    {
      step: 6,
      title: 'Certificate of Incorporation issued',
      timeframe: 'Day 12-15',
      description: 'MCA issues your CIN. PAN and TAN are generated automatically. All documents are uploaded to your Ollvy account. Your compliance calendar is populated with every annual deadline.',
      milestone: 'Company incorporated',
    },
  ],

  included: [
    {
      title: 'DSC for all directors - video verification guided',
      description: 'Digital Signature Certificates are mandatory for filing. We arrange the tokens and guide each director through video verification - 15 minutes per director.',
      without: 'Navigate DSC portals yourself - 3+ hours per director',
      withOllvy: 'Guided flow in the app - 15 minutes per director',
    },
    {
      title: 'DIN as part of SPICe+ - no separate filing',
      description: 'Director Identification Number is included in SPICe+. No separate DIR-3 application, no extra time.',
      without: 'Separate DIR-3 filing - adds 3-5 days',
      withOllvy: 'DIN filed simultaneously in SPICe+',
    },
    {
      title: 'MOA and AOA drafted for your business',
      description: 'Main objects, ancillary objects, and authorised capital are drafted based on what you actually do - not a generic template that may need amendment later.',
      without: 'Generic template - may require costly amendment later',
      withOllvy: 'Custom drafting based on your business activities',
    },
    {
      title: 'PAN and TAN included',
      description: 'Both are applied for within SPICe+. Issued within 24 hours of CIN with no separate process.',
    },
    {
      title: 'Compliance calendar auto-populated',
      description: 'From day one, your calendar shows every deadline: first board meeting (30 days), auditor appointment ADT-1 (15 days from AGM), DIR-3 KYC (Sep 30 annually), MCA annual filing, and Business ITR.',
    },
    {
      title: 'All documents stored permanently',
      description: 'Certificate of Incorporation, MOA, AOA, PAN, TAN, share certificates - all in your Ollvy account. Your CA will ask for these every year.',
    },
  ],

  risks: [
    {
      title: 'Name rejected by MCA',
      description: 'MCA rejects names similar to existing companies or containing restricted words (Bank, Insurance, Exchange). We search MCA and trademark databases before submitting. If all 3 names are rejected, we suggest alternatives at no extra cost.',
    },
    {
      title: 'Registered address document mismatch',
      description: 'The address on your utility bill must match your application exactly. If using a rented premises, you need a NOC from the landlord. Your CS verifies all address documents before filing.',
    },
    {
      title: 'Director slow on DSC video verification',
      description: 'SPICe+ cannot be filed until all directors complete DSC verification. Ollvy sends daily reminders and tracks completion. The verification takes 10-15 minutes per director.',
    },
  ],

  personas: [
    {
      title: 'First-time founder',
      description: 'Never incorporated before. We explain every document and step before you take it.',
    },
    {
      title: 'Two co-founders in different cities',
      description: 'DSC video verification done remotely. Common setup, handled routinely.',
    },
    {
      title: 'Home address as registered office',
      description: 'Fully legal. We verify address proof requirements for your state before filing.',
    },
    {
      title: 'Raising investment soon',
      description: 'Authorised capital set appropriately. Board composition planned for investor entry.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'How long does Pvt Ltd incorporation take?',
      a: '15 working days end-to-end. DSC takes 2 days, name approval 3 days, SPICe+ filing and MCA approval 10 days. We file the moment documents are ready - MCA processing speed is outside our control.',
    },
    {
      category: 'General',
      q: 'What is the minimum capital required to register a Pvt Ltd?',
      a: 'No legal minimum. Authorised capital can be Rs. 1 lakh - the standard starting point. Stamp duty on incorporation is based on authorised capital and varies by state.',
    },
    {
      category: 'General',
      q: 'Can I register a Pvt Ltd with just one director?',
      a: 'A Pvt Ltd requires a minimum of 2 directors and 2 shareholders. If you are the sole owner, you can use a nominee shareholder (a family member or co-founder holding a single share) to meet the requirement. For a truly single-person structure, consider an OPC (One Person Company).',
    },
    {
      category: 'General',
      q: 'Pvt Ltd or LLP - which is better?',
      a: 'Pvt Ltd if you plan to raise equity, issue ESOPs, or need the structure for enterprise clients and investors. LLP if you are a professional services firm, do not need equity funding, and want lower compliance costs (Rs. 10,000-20,000/year vs Rs. 25,000-50,000/year for Pvt Ltd).',
    },
    {
      category: 'General',
      q: 'Can a foreign national be a director?',
      a: 'Yes. At least one director must be an Indian resident (present in India for 182+ days in the previous financial year), but the other directors can be foreign nationals.',
    },
    {
      category: 'Process',
      q: 'What if my proposed company name is rejected?',
      a: 'We search MCA and trademark databases before filing to minimise rejection risk. If rejected, we refile with your alternative names immediately at no extra cost.',
    },
    {
      category: 'Process',
      q: 'Can I use my home address as the registered office?',
      a: 'Yes. A residential address is fully legal as a registered office. You need an electricity bill in your name or the owner\'s name, and a NOC from the owner if you are a tenant.',
    },
    {
      category: 'Documents',
      q: 'What documents do directors need?',
      a: 'PAN card, Aadhaar card, passport photo, mobile number linked to Aadhaar for OTP, and an address proof (bank statement or utility bill not older than 2 months). Directors must complete video verification for DSC.',
    },
    {
      category: 'After Completion',
      q: 'What are my first compliance obligations after incorporation?',
      a: 'File Form INC-20A (commencement of business) within 180 days - this requires the initial share capital to be deposited in a company bank account, so open a current account immediately. Annual: AOC-4 by 30 days after AGM, MGT-7 by 60 days after AGM, DIR-3 KYC by Sep 30, Business ITR by Oct 31. All added to your Ollvy compliance calendar automatically.',
    },
    {
      category: 'After Completion',
      q: 'Does incorporation include GST registration?',
      a: 'No. GST registration is separate and mandatory once your turnover crosses the threshold (Rs. 20 lakh for services, Rs. 40 lakh for goods). You can book both together - both professionals are assigned the same day.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - Private Limited Company Registration (2025)',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['DSC per director', 'Rs. 1,000-2,000', 'Varies by certifying authority and 1 or 2-year validity'],
      ['SPICe+ filing fee', 'Nil (for authorised capital up to Rs. 15 lakh, ≤7 subscribers)', 'Stamp duty on MOA/AOA is additional and varies by state'],
      ['Stamp duty on MOA/AOA', 'Rs. 200-2,000+', 'State-specific; higher for larger authorised capital'],
      ['PAN application', 'Nil', 'Included in SPICe+ - no separate fee'],
      ['TAN application', 'Nil', 'Included in SPICe+ - no separate fee'],
      ['Typical total govt fee', 'Rs. 2,000-6,000', 'Authorised capital Rs. 1 lakh; 2 directors; Delhi or Maharashtra'],
    ],
  },

  documents: {
    caption: 'Documents Required - Private Limited Company Registration',
    headers: ['Document', 'Required From', 'Notes'],
    rows: [
      ['PAN card', 'All directors and shareholders', 'Clear scan; must match Aadhaar name exactly'],
      ['Aadhaar card', 'All directors', 'Mobile linked to Aadhaar must be active for OTP'],
      ['Passport photo', 'All directors', 'Recent; white background'],
      ['Address proof (director)', 'All directors', 'Bank statement or utility bill - not older than 2 months'],
      ['Registered office proof', 'Company', 'Electricity bill + NOC from owner if rented; sale deed if owned'],
      ['Proposed company names', 'Founder', '3 names in order of preference with business significance'],
      ['Business activity description', 'Founder', 'What the company will do - used to draft MOA main objects'],
    ],
  },
}


// ─── 2. LLP Incorporation ─────────────────────────────────────────────────────

export const llpIncorporation: ServicePageConfig = {
  slug: 'llp-incorporation',
  title: 'LLP Registration',
  tagline: 'Limited liability. Flexible profit-sharing. Lower compliance than Pvt Ltd.',
  seoTitle: 'LLP Registration in India 2025 | Limited Liability Partnership | Ollvy',
  seoDescription: 'Register your LLP in 12 working days. DPIN, DSC, LLP Agreement, PAN included. No mandatory audit below Rs. 40 lakh turnover. CS assigned same day.',
  canonicalUrl: 'https://www.ollvy.com/services/llp-incorporation',
  lastReviewed: 'April 2026',
  category: 'Incorporation',

  relatedServiceSlugs: ['pvt-ltd-incorporation', 'gst-registration', 'msme-registration'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'A Limited Liability Partnership is registered under the LLP Act, 2008. It is a separate legal entity with limited liability - partners are not personally liable for business debts beyond their agreed contribution. There are no shares, no mandatory board meetings, and no mandatory audit below Rs. 40 lakh turnover.',
    whyYouNeedIt: 'LLP is the right structure if you want direct management flexibility, lower annual compliance costs, and profit-sharing that does not follow capital contribution. Professional services firms (CAs, lawyers, architects, consultants) and bootstrapped businesses typically choose LLP over Pvt Ltd.',
    whatHappensWithout: 'An unregistered partnership means unlimited personal liability for all partners - one partner\'s actions can expose every other partner\'s personal assets. The firm cannot own property in its name or enforce contracts in its own right in court.',
  },

  workflow: [
    {
      step: 1,
      title: 'Answer questions - we build your checklist',
      timeframe: 'Day 0',
      description: 'Business type, number of partners, proposed LLP name (3 options), registered state, capital contribution split. CS assigned within 4 hours.',
      milestone: 'CS assigned, checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeframe: 'Day 0-1',
      description: 'PAN and Aadhaar for all partners, registered address proof, capital contribution details. CS verifies every document before filing.',
      milestone: 'Documents verified',
    },
    {
      step: 3,
      title: 'DPIN and DSC arranged',
      timeframe: 'Day 1-3',
      description: 'Designated Partner Identification Number is required for all partners. We file DPIN applications and arrange DSC tokens with guided video verification.',
      milestone: 'DPIN and DSC ready',
    },
    {
      step: 4,
      title: 'FiLLiP filed - LLP Agreement, PAN in one submission',
      timeframe: 'Day 4-9',
      description: 'FiLLiP is the integrated LLP incorporation form. Your CS drafts the LLP Agreement based on your actual partner arrangement and files with MCA.',
      milestone: 'FiLLiP submitted to MCA',
    },
    {
      step: 5,
      title: 'LLPIN issued',
      timeframe: 'Day 10-12',
      description: 'MCA issues the Certificate of Incorporation with your LLP Identification Number. PAN generated automatically. All documents uploaded to your account.',
      milestone: 'Certificate of Incorporation issued',
    },
  ],

  included: [
    {
      title: 'LLP Agreement drafted - not templated',
      description: 'Defines profit-sharing, decision-making, capital contribution, partner exit terms. Drafted based on your actual arrangement.',
      without: 'Generic 50-50 template - partner disputes arise later',
      withOllvy: 'Custom agreement reflecting your exact split, roles, and exit terms',
    },
    {
      title: 'DPIN for all designated partners',
      description: 'Every designated partner needs a DPIN. We file all applications simultaneously - no sequential delays.',
    },
    {
      title: 'DSC arranged - video verification guided',
      description: 'DSC is required for all partners. We arrange tokens and guide video verification in the app - 15 minutes per partner.',
    },
    {
      title: 'Compliance calendar auto-populated',
      description: 'Once LLPIN is issued, your calendar shows Form 11 (annual return, due May 30) and Form 8 (statement of accounts, due Oct 30).',
    },
  ],

  risks: [
    {
      title: 'Name similarity rejection',
      description: 'LLP names must be distinct from existing LLPs and companies. We check both registries before submission.',
    },
    {
      title: 'LLP Agreement must reflect actual terms',
      description: 'Vague profit-sharing or unclear exit clauses are the most common source of partner disputes. We draft explicit percentages, decision rights, and terms.',
    },
    {
      title: 'All partners must complete DSC verification',
      description: 'FiLLiP cannot be filed until every partner completes video verification. We track completion and send daily reminders.',
    },
  ],

  personas: [
    {
      title: 'Professional services firm',
      description: 'CA firms, law firms, architects, consultants - LLP is the natural structure. Lower compliance, flexible remuneration.',
    },
    {
      title: 'Two or three partners with unequal contribution',
      description: 'Different capital, different profit share. Agreement drafted to reflect the exact split.',
    },
    {
      title: 'Converting from unregistered partnership',
      description: 'Existing firm converting to LLP for limited liability. We handle the transition process.',
    },
    {
      title: 'Bootstrapped business - no funding plans',
      description: 'No plans to raise equity. LLP gives limited liability and simpler compliance at Rs. 10,000-20,000/year vs Rs. 25,000-50,000/year for Pvt Ltd.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'LLP vs Pvt Ltd - which is better?',
      a: 'LLP if you are a professional services firm, do not plan to raise equity, and want lower compliance costs. Pvt Ltd if you plan to raise funding from angel investors or VCs, issue ESOPs, or need a shareholder structure. LLPs cannot issue shares - investors cannot take equity stakes.',
    },
    {
      category: 'General',
      q: 'What is the annual compliance cost for an LLP?',
      a: 'Rs. 10,000-20,000 for a small LLP with minimal activity. This covers Form 8 (due Oct 30), Form 11 (due May 30), and ITR-5. No mandatory audit below Rs. 40 lakh turnover and Rs. 25 lakh partner contribution. Pvt Ltd costs Rs. 25,000-50,000 annually due to mandatory statutory audit.',
    },
    {
      category: 'General',
      q: 'How many partners are required for an LLP?',
      a: 'Minimum 2 designated partners, both of whom must be individuals. At least one must be a resident Indian (present in India for 182+ days in the previous financial year). There is no maximum number of partners.',
    },
    {
      category: 'General',
      q: 'Can an LLP be converted to a Pvt Ltd later?',
      a: 'Yes, under Section 366 of the Companies Act, 2013. The process takes 3-6 months, involves multiple MCA filings, stamp duty on asset transfer, and a valuation exercise. If equity funding is even a possibility within 3 years, it is cheaper and simpler to start as a Pvt Ltd.',
    },
    {
      category: 'General',
      q: 'Does an LLP need to hold board meetings?',
      a: 'No. LLPs have no requirement for formal board meetings or general meetings. Partners decide as per the LLP Agreement.',
    },
    {
      category: 'General',
      q: 'Is LLP audit mandatory?',
      a: 'Only if turnover exceeds Rs. 40 lakh OR partner contribution exceeds Rs. 25 lakh in a financial year. Below both these thresholds, no statutory audit is required. Pvt Ltd audit is mandatory every year regardless of turnover.',
    },
    {
      category: 'Process',
      q: 'How long does LLP registration take?',
      a: '12 working days end-to-end. DPIN and DSC take 3 days, FiLLiP filing and MCA approval take 9 days.',
    },
    {
      category: 'Documents',
      q: 'What documents do partners need?',
      a: 'PAN card, Aadhaar card (with active linked mobile for OTP), passport photo, and address proof (bank statement or utility bill not older than 2 months).',
    },
    {
      category: 'After Completion',
      q: 'What are the annual LLP filing obligations?',
      a: 'Form 11 (Annual Return) by May 30 every year. Form 8 (Statement of Accounts and Solvency) by October 30 every year. ITR-5 by July 31 (no audit) or October 31 (audit applicable). Both Form 8 and Form 11 are mandatory regardless of whether the LLP was active.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - LLP Registration (2025)',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['DSC per partner', 'Rs. 1,000-2,000', 'Varies by certifying authority'],
      ['FiLLiP filing fee', 'Rs. 500-5,000', 'Based on capital contribution: Rs. 500 up to Rs. 1 lakh, Rs. 2,000 for Rs. 1-5 lakh, Rs. 5,000 above Rs. 5 lakh'],
      ['Stamp duty on LLP Agreement', 'Rs. 200-2,000+', 'State-specific; agreement must be stamped before filing'],
      ['PAN application', 'Nil', 'Included in FiLLiP'],
      ['Typical total govt fee', 'Rs. 1,500-5,000', 'Capital up to Rs. 1 lakh; 2 partners'],
    ],
  },

  documents: {
    caption: 'Documents Required - LLP Registration',
    headers: ['Document', 'Required From', 'Notes'],
    rows: [
      ['PAN card', 'All designated partners', 'Clear scan; name must match Aadhaar exactly'],
      ['Aadhaar card', 'All designated partners', 'Mobile linked to Aadhaar must be active for OTP'],
      ['Passport photo', 'All partners', 'Recent; white background'],
      ['Address proof (partner)', 'All partners', 'Bank statement or utility bill - not older than 2 months'],
      ['Registered office proof', 'LLP', 'Electricity bill + NOC from owner if rented'],
      ['Capital contribution details', 'All partners', 'Amount in rupees and percentage per partner'],
      ['Proposed LLP name', 'Founder', '3 names in order of preference'],
    ],
  },
}

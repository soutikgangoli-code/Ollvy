import type { ServicePageConfig } from '../types'

// ─── 1. Private Limited Company Registration ──────────────────────────────────

export const pvtLtdIncorporation: ServicePageConfig = {
  slug: 'pvt-ltd-incorporation',
  title: 'Private Limited Company Registration',
  tagline: 'Separate legal entity. Limited liability. Ready for investment.',
  seoTitle: 'Private Limited Company Registration in India 2025 | Ollvy',
  seoDescription: 'Register your Pvt Ltd company in 15 working days. DSC, DIN, MOA/AOA, PAN, TAN included. Ollvy CA/CS assigned same day. From Rs. 1,499 + govt fees.',
  canonicalUrl: 'https://www.ollvy.com/services/pvt-ltd-incorporation',
  lastReviewed: 'April 2026',
  category: 'Incorporation',

  relatedServiceSlugs: ['llp-incorporation', 'gst-registration', 'trademark-registration', 'msme-registration'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'do-i-need-gst-registration', 'should-i-get-dpiit-startup-recognition'],

  explainer: {
    whatItIs: 'A Private Limited Company is registered under the Companies Act. It is its own legal person - it can own property, sign contracts, hire employees, and take legal action in its own name. Shares are held privately by up to 200 shareholders and cannot be publicly traded.',
    whyYouNeedIt: 'If you plan to raise investment, Pvt Ltd is the only structure that works. Investors get shares, and an LLP cannot issue them. It also lets you offer stock options to employees, keeps your ownership structure clean, and gives you the credibility that large clients and banks expect.',
    whatHappensWithout: 'Without a Pvt Ltd, you have unlimited personal liability - creditors can come after your personal assets. You cannot raise investment, offer stock options, or give investors the legal structure they need to put money in.',
  },

  workflow: [
    {
      step: 1,
      title: 'Answer 5 questions - we build your checklist',
      timeframe: 'Day 0',
      description: 'Number of directors, shareholders, 3 company name options, your state, and starting capital. An Ollvy company secretary is assigned within 4 hours.',
      milestone: 'Ollvy CS assigned, personalised checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeframe: 'Day 0-2',
      description: 'PAN and Aadhaar for all directors, address proof for the office, and passport photos. Ollvy verifies every document before filing. Mismatches are caught here, not after the government raises a query.',
      milestone: 'Documents verified by Ollvy',
    },
    {
      step: 3,
      title: 'Digital signatures and Director IDs arranged for all directors',
      timeframe: 'Day 2-4',
      description: 'Digital signatures (DSC) and Director IDs (DIN) are required by the government. Ollvy arranges everything and guides each director through a quick video verification in the app.',
      milestone: 'Digital signatures and Director IDs ready',
    },
    {
      step: 4,
      title: 'Company name approved',
      timeframe: 'Day 4-7',
      description: 'Ollvy files the name reservation with the government. Approval takes 2-3 working days. If a name is rejected, we file your alternatives immediately at no extra cost.',
      milestone: 'Company name approved',
    },
    {
      step: 5,
      title: 'Incorporation filed - PAN, TAN, and founding documents in one submission',
      timeframe: 'Day 7-12',
      description: 'One government form covers incorporation, PAN, TAN, and optional GST pre-registration. Ollvy drafts the founding documents based on what your business actually does.',
      milestone: 'Incorporation application submitted to the government',
    },
    {
      step: 6,
      title: 'Certificate of Incorporation issued',
      timeframe: 'Day 12-15',
      description: 'The government issues your company identification number. PAN and TAN are generated automatically. All documents go to your Ollvy account. Your compliance calendar shows every annual deadline from day one.',
      milestone: 'Company incorporated',
    },
  ],

  included: [
    {
      title: 'Digital signatures for all directors - video verification guided',
      description: 'Digital signatures (DSC) are required for government filing. Ollvy arranges everything and guides each director through verification. 15 minutes per director.',
      without: 'Figure out digital signature portals yourself - 3+ hours per director',
      withOllvy: 'Guided flow in the app - 15 minutes per director',
    },
    {
      title: 'Director ID included in the incorporation filing - no separate application',
      description: 'Every director needs a government ID number (DIN). Ollvy files it as part of the incorporation application. No separate filing, no extra time.',
      without: 'Separate filing - adds 3-5 days',
      withOllvy: 'Director ID filed with everything else - no extra time',
    },
    {
      title: 'Founding documents drafted for your business',
      description: 'Your business purpose and starting capital are drafted based on what you actually do - not a generic template that needs expensive changes later.',
      without: 'Generic template - may need costly changes later',
      withOllvy: 'Custom drafting based on your business activities',
    },
    {
      title: 'PAN and TAN included',
      description: 'Both are applied for within the incorporation filing. Issued within 24 hours of your company number with no separate process.',
    },
    {
      title: 'Compliance calendar auto-populated',
      description: 'From day one, your calendar shows every deadline: first board meeting (30 days), auditor appointment (15 days after your annual meeting), Director KYC (Sep 30 every year), annual company filing, and income tax return.',
    },
    {
      title: 'All documents stored permanently',
      description: 'Certificate of Incorporation, founding documents, PAN, TAN, share certificates - all stored in your Ollvy account.',
    },
  ],

  risks: [
    {
      title: 'Company name rejected',
      description: 'The government rejects names too similar to existing companies or containing restricted words (Bank, Insurance, Exchange). Ollvy searches company and trademark databases before submitting. If all 3 names are rejected, we suggest alternatives at no extra cost.',
    },
    {
      title: 'Registered address document mismatch',
      description: 'The address on your utility bill must match your application exactly. If you rent, you need a no-objection letter from the landlord. Ollvy verifies all address documents before filing.',
    },
    {
      title: 'Director slow on digital signature verification',
      description: 'The incorporation form cannot be filed until all directors complete their digital signature verification. Ollvy sends daily reminders and tracks completion. Takes 10-15 minutes per director.',
    },
  ],

  personas: [
    {
      title: 'First-time founder',
      description: 'Never incorporated before. Ollvy explains every document and step before you take it.',
    },
    {
      title: 'Two co-founders in different cities',
      description: 'Digital signature verification done remotely. Common setup, handled every day.',
    },
    {
      title: 'Home address as registered office',
      description: 'Fully legal. Ollvy verifies address proof requirements for your state before filing.',
    },
    {
      title: 'Raising investment soon',
      description: 'Starting capital set right for fundraising. Board structure planned for when investors come in.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'How long does Pvt Ltd incorporation take?',
      a: '15 working days end-to-end. Digital signatures take 2 days, name approval 3 days, incorporation filing and government approval 10 days. Ollvy files the moment documents are ready. Government processing time is outside anyone\'s control.',
    },
    {
      category: 'General',
      q: 'What is the minimum capital required to register a Pvt Ltd?',
      a: 'No legal minimum. Starting capital can be Rs. 1 lakh, which is the standard starting point. Government stamp duty is based on this amount and varies by state.',
    },
    {
      category: 'General',
      q: 'Can I register a Pvt Ltd with just one director?',
      a: 'A Pvt Ltd requires a minimum of 2 directors and 2 shareholders. If you are the sole owner, you can use a nominee shareholder (a family member or co-founder holding a single share) to meet the requirement. For a truly single-person structure, consider an OPC (One Person Company).',
    },
    {
      category: 'General',
      q: 'Pvt Ltd or LLP - which is better?',
      a: 'Pvt Ltd if you plan to raise investment, offer stock options, or need the structure for large clients and investors. LLP if you run a services business, don\'t plan to raise funding, and want lower compliance costs (Rs. 10,000-20,000/year vs Rs. 25,000-50,000/year for Pvt Ltd).',
    },
    {
      category: 'General',
      q: 'Can a foreign national be a director?',
      a: 'Yes. At least one director must be an Indian resident (present in India for 182+ days in the previous financial year), but the other directors can be foreign nationals.',
    },
    {
      category: 'Process',
      q: 'What if my proposed company name is rejected?',
      a: 'Ollvy searches government and trademark databases before filing to reduce rejection risk. If rejected, we refile with your alternative names immediately at no extra cost.',
    },
    {
      category: 'Process',
      q: 'Can I use my home address as the registered office?',
      a: 'Yes. A home address is fully legal. You need an electricity bill in your name or the owner\'s name, and a no-objection letter from the owner if you rent.',
    },
    {
      category: 'Documents',
      q: 'What documents do directors need?',
      a: 'PAN card, Aadhaar card, passport photo, mobile number linked to Aadhaar (for OTP verification), and address proof (bank statement or utility bill, not older than 2 months). Directors must complete a short video verification for their digital signature.',
    },
    {
      category: 'After Completion',
      q: 'What do I need to do after incorporation?',
      a: 'Start a company bank account and deposit your initial capital within 180 days (this is required before you can officially start doing business). After that, annual deadlines kick in: financial filing within 30 days of your annual meeting, company return within 60 days, Director KYC by Sep 30, and income tax return by Oct 31. All added to your Ollvy compliance calendar automatically.',
    },
    {
      category: 'After Completion',
      q: 'Does incorporation include GST registration?',
      a: 'No. GST registration is separate and required once your turnover crosses Rs. 20 lakh for services or Rs. 40 lakh for goods. You can book both together on Ollvy. Both professionals are assigned the same day.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - Private Limited Company Registration (2025)',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['Digital signature per director', 'Rs. 1,000-2,000', 'Varies by certifying authority and 1 or 2-year validity'],
      ['Incorporation filing fee', 'Free for starting capital up to Rs. 15 lakh and up to 7 shareholders', 'Stamp duty on founding documents is additional and varies by state'],
      ['Stamp duty on founding documents', 'Rs. 200-2,000+', 'State-specific; higher for larger starting capital'],
      ['PAN application', 'Free', 'Included in the incorporation filing - no separate fee'],
      ['TAN application', 'Free', 'Included in the incorporation filing - no separate fee'],
      ['Typical total govt fee', 'Rs. 2,000-6,000', 'Starting capital Rs. 1 lakh; 2 directors; Delhi or Maharashtra'],
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
      ['Registered office proof', 'Company', 'Electricity bill + no-objection letter from owner if rented; sale deed if owned'],
      ['Proposed company names', 'Founder', '3 names in order of preference with business significance'],
      ['Business activity description', 'Founder', 'What the company will do - used to draft the founding documents'],
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
    whatItIs: 'A Limited Liability Partnership is registered under the LLP Act. It is a separate legal entity with limited liability - partners are not personally liable for business debts beyond their agreed contribution. There are no shares, no mandatory board meetings, and no mandatory audit below Rs. 40 lakh turnover.',
    whyYouNeedIt: 'LLP is the right structure if you want flexibility in management, lower annual compliance costs, and profit-sharing that does not have to match how much each partner invested. Service businesses (accountants, lawyers, architects, consultants) and bootstrapped companies typically choose LLP over Pvt Ltd.',
    whatHappensWithout: 'An unregistered partnership means unlimited personal liability for all partners - one partner\'s actions can put every other partner\'s personal assets at risk. The firm cannot own property in its name or enforce contracts in court.',
  },

  workflow: [
    {
      step: 1,
      title: 'Answer questions - we build your checklist',
      timeframe: 'Day 0',
      description: 'Business type, number of partners, 3 LLP name options, your state, and how capital is split between partners. Ollvy company secretary assigned within 4 hours.',
      milestone: 'Ollvy CS assigned, checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeframe: 'Day 0-1',
      description: 'PAN and Aadhaar for all partners, office address proof, and capital split details. Ollvy verifies every document before filing.',
      milestone: 'Documents verified by Ollvy',
    },
    {
      step: 3,
      title: 'Partner IDs and digital signatures arranged',
      timeframe: 'Day 1-3',
      description: 'Each partner needs a government-issued Partner ID (DPIN) and a digital signature (DSC). Ollvy files all applications and guides each partner through a quick video verification.',
      milestone: 'Partner IDs and digital signatures ready',
    },
    {
      step: 4,
      title: 'LLP registration filed - Agreement and PAN in one submission',
      timeframe: 'Day 4-9',
      description: 'One government form covers LLP registration, your LLP Agreement, and PAN application. Ollvy drafts the Agreement based on your actual partner arrangement and files it.',
      milestone: 'Registration submitted to the government',
    },
    {
      step: 5,
      title: 'LLP registration number issued',
      timeframe: 'Day 10-12',
      description: 'The government issues your Certificate of Incorporation with your LLP number. PAN generated automatically. All documents go to your Ollvy account.',
      milestone: 'Certificate of Incorporation issued',
    },
  ],

  included: [
    {
      title: 'LLP Agreement drafted - not templated',
      description: 'Defines profit-sharing, decision-making, capital contribution, and partner exit terms. Drafted based on your actual arrangement.',
      without: 'Generic 50-50 template - partner disputes arise later',
      withOllvy: 'Custom agreement reflecting your exact split, roles, and exit terms',
    },
    {
      title: 'Partner IDs for all partners',
      description: 'Every partner needs a government ID number (DPIN). Ollvy files all applications at once - no waiting in sequence.',
    },
    {
      title: 'Digital signatures arranged - verification guided',
      description: 'Digital signatures (DSC) are required for all partners. Ollvy arranges everything and guides video verification in the app. 15 minutes per partner.',
    },
    {
      title: 'Compliance calendar auto-populated',
      description: 'Once your LLP is registered, your calendar shows annual return (due May 30) and accounts filing (due Oct 30).',
    },
  ],

  risks: [
    {
      title: 'Name similarity rejection',
      description: 'LLP names must be distinct from existing LLPs and companies. Ollvy checks both registries before submission.',
    },
    {
      title: 'LLP Agreement must reflect actual terms',
      description: 'Vague profit-sharing or unclear exit clauses are the most common source of partner disputes. Ollvy drafts explicit percentages, decision rights, and terms.',
    },
    {
      title: 'All partners must complete digital signature verification',
      description: 'The registration form cannot be filed until every partner completes video verification. Ollvy tracks completion and sends daily reminders.',
    },
  ],

  personas: [
    {
      title: 'Professional services firm',
      description: 'Accounting firms, law firms, architects, consultants - LLP is the natural structure. Lower compliance, flexible pay.',
    },
    {
      title: 'Two or three partners with unequal contribution',
      description: 'Different capital, different profit share. Agreement drafted to reflect the exact split.',
    },
    {
      title: 'Converting from unregistered partnership',
      description: 'Existing firm converting to LLP for limited liability. Ollvy handles the transition process.',
    },
    {
      title: 'Bootstrapped business - no funding plans',
      description: 'No plans to raise investment. LLP gives limited liability and simpler compliance at Rs. 10,000-20,000/year vs Rs. 25,000-50,000/year for Pvt Ltd.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'LLP vs Pvt Ltd - which is better?',
      a: 'LLP if you run a services business, don\'t plan to raise investment, and want lower compliance costs. Pvt Ltd if you plan to raise funding from angel investors or VCs, offer stock options, or need a shareholder structure. LLPs cannot issue shares - investors cannot take ownership stakes.',
    },
    {
      category: 'General',
      q: 'What is the annual compliance cost for an LLP?',
      a: 'Rs. 10,000-20,000 for a small LLP with minimal activity. This covers accounts filing (due Oct 30), annual return (due May 30), and income tax return. No mandatory audit below Rs. 40 lakh turnover and Rs. 25 lakh partner contribution. Pvt Ltd costs Rs. 25,000-50,000 annually due to mandatory audit.',
    },
    {
      category: 'General',
      q: 'How many partners are required for an LLP?',
      a: 'Minimum 2 designated partners, both of whom must be individuals. At least one must be a resident Indian (present in India for 182+ days in the previous financial year). There is no maximum number of partners.',
    },
    {
      category: 'General',
      q: 'Can an LLP be converted to a Pvt Ltd later?',
      a: 'Yes, it is possible under the Companies Act. The process takes 3-6 months, involves multiple government filings, stamp duty on asset transfer, and a valuation exercise. If raising investment is even a possibility within 3 years, it is cheaper and simpler to start as a Pvt Ltd.',
    },
    {
      category: 'General',
      q: 'Does an LLP need to hold board meetings?',
      a: 'No. LLPs have no requirement for formal board meetings or general meetings. Partners decide as per the LLP Agreement.',
    },
    {
      category: 'General',
      q: 'Is LLP audit mandatory?',
      a: 'Only if turnover exceeds Rs. 40 lakh OR partner contribution exceeds Rs. 25 lakh in a financial year. Below both these thresholds, no audit is required. Pvt Ltd audit is mandatory every year regardless of turnover.',
    },
    {
      category: 'Process',
      q: 'How long does LLP registration take?',
      a: '12 working days end-to-end. Partner IDs and digital signatures take 3 days, registration filing and government approval take 9 days.',
    },
    {
      category: 'Documents',
      q: 'What documents do partners need?',
      a: 'PAN card, Aadhaar card (with active linked mobile for OTP), passport photo, and address proof (bank statement or utility bill not older than 2 months).',
    },
    {
      category: 'After Completion',
      q: 'What are the annual LLP filing deadlines?',
      a: 'Annual return by May 30 every year. Accounts filing (Statement of Accounts and Solvency) by October 30 every year. Income tax return by July 31 (no audit) or October 31 (if audit applies). Both filings are mandatory regardless of whether the LLP was active.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - LLP Registration (2025)',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['Digital signature per partner', 'Rs. 1,000-2,000', 'Varies by certifying authority'],
      ['Registration filing fee', 'Rs. 500-5,000', 'Based on capital contribution: Rs. 500 up to Rs. 1 lakh, Rs. 2,000 for Rs. 1-5 lakh, Rs. 5,000 above Rs. 5 lakh'],
      ['Stamp duty on LLP Agreement', 'Rs. 200-2,000+', 'State-specific; agreement must be stamped before filing'],
      ['PAN application', 'Free', 'Included in the registration filing'],
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
      ['Registered office proof', 'LLP', 'Electricity bill + no-objection letter from owner if rented'],
      ['Capital contribution details', 'All partners', 'Amount in rupees and percentage per partner'],
      ['Proposed LLP name', 'Founder', '3 names in order of preference'],
    ],
  },
}

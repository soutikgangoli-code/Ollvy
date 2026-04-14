import { ServiceConfig } from '../services'

export const pvtLtdIncorporation: ServiceConfig = {
  slug: 'pvt-ltd-incorporation',
  name: 'Private Limited Incorporation',
  shortName: 'Pvt Ltd',
  category: 'Registrations',
  tagline: 'Your company, incorporated. Separate legal entity, limited liability, ready for investment.',

  ollvyFee: 5999,
  govtFee: 7999,
  mrp: 20000,
  govtFeeLabel: 'MCA stamp duty',
  govtFeeNote:
    'This fee is paid directly to the Ministry of Corporate Affairs. Ollvy collects it on your behalf and remits it in full. It varies slightly by state - ₹15,000 is the standard amount for most states.',

  slaDays: 15,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Founders registering a company in India',
  legalBasis: 'Companies Act 2013, Section 7',
  penaltyForMissing: undefined,
  penaltyColor: 'none',

  seoTitle: 'Private Limited Company Registration Online India | ₹24,999 | Ollvy',
  seoDescription:
    'Register your Private Limited Company in India. Includes name reservation, DSC, DIN, MOA/AOA, and CIN. Fixed price ₹24,999 (₹9,999 Ollvy + ₹15,000 MCA). CA assigned within 4 hours.',
  canonicalUrl: 'https://www.ollvy.com/services/pvt-ltd-incorporation',

  processSteps: [
    {
      step: 1,
      title: 'Answer 5 questions - we build your checklist',
      timeline: 'Day 0',
      body: 'Directors, shareholders, 3 proposed names, office state, authorised capital\nCS assigned within 4 hours',
      visual: 'checklist',
      milestone: 'CS assigned, checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeline: 'Day 0-2',
      body: 'PAN, Aadhaar, passport photos for all directors + office address proof\nCS verifies every document before filing\nMismatches caught here, not after MCA query',
      visual: 'upload',
      milestone: 'Documents verified by CS',
    },
    {
      step: 3,
      title: 'DSC and DIN arranged for all directors',
      timeline: 'Day 2-4',
      body: 'DSC and DIN mandatory for all directors\nDSC tokens arranged, video verification guided in-app',
      visual: 'form',
      milestone: 'DSC and DIN ready',
    },
    {
      step: 4,
      title: 'Name approved via RUN',
      timeline: 'Day 4-7',
      body: 'RUN application filed with MCA\nApproval in 2–3 working days\nRejected name? Alternatives filed immediately, no extra cost',
      visual: 'form',
      milestone: 'Company name approved',
    },
    {
      step: 5,
      title: 'SPICe+ filed - MOA, AOA, PAN, TAN in one submission',
      timeline: 'Day 7-12',
      body: 'SPICe+ = single form for incorporation, PAN, TAN, GST pre-enrollment\nMOA and AOA drafted for your specific business activities\nFiled with Registrar of Companies',
      visual: 'form',
      milestone: 'SPICe+ submitted to MCA',
    },
    {
      step: 6,
      title: 'Certificate of Incorporation issued',
      timeline: 'Day 12-15',
      body: 'CIN issued, PAN and TAN generated automatically\nAll documents stored permanently in your account\nCompliance calendar populated with every annual deadline',
      visual: 'stamp',
      milestone: 'Company incorporated',
      isCompletion: true,
    },
  ],

  whatsIncluded: [
    {
      title: 'DSC for all directors - video verification guided',
      body: 'DSC is mandatory — we arrange the tokens and guide each director through video verification\n15 minutes per director',
      comparisonWithout: 'Navigate DSC portals yourself - 3+ hours',
      comparisonWithOllvy: 'Guided flow in app - 15 minutes per director',
    },
    {
      title: 'DIN as part of SPICe+ - no separate filing',
      body: 'Director Identification Number is included in SPICe+. No separate DIR-3 application, no extra time.',
      comparisonWithout: 'Separate DIR-3 filing - adds 3-5 days',
      comparisonWithOllvy: 'DIN filed simultaneously in SPICe+',
    },
    {
      title: 'MOA and AOA drafted for your business',
      body: 'Drafted based on what your business actually does\nNot a generic template that needs amendment later',
      comparisonWithout: 'Generic template - may need amendment later',
      comparisonWithOllvy: 'Custom drafting based on your business activities',
    },
    {
      title: 'PAN and TAN included',
      body: 'SPICe+ includes both applications. Issued within 24 hours of CIN with no separate process.',
    },
    {
      title: 'Compliance calendar auto-populated',
      body: 'Board meeting (30 days), ADT-1 auditor appointment (15 days from AGM)\nDIR-3 KYC (Sep 30 every year), MCA annual filing, Business ITR\nAll populated the day your company is incorporated',
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'First Board Meeting - Within 30 days',
        row2: 'DIR-3 KYC - Due Sep 30 every year',
        row3: 'MCA Annual Filing - Due after AGM',
        note: 'Added to your calendar automatically',
      },
    },
    {
      title: 'All documents stored permanently',
      body: 'CoI, MOA, AOA, PAN, TAN, share certificates, DSC details — all in your Ollvy account\nYour CA will ask for these repeatedly over the years',
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'Name rejected by MCA',
      body: 'MCA rejects similar names or restricted words (Bank, Insurance, Exchange)',
    },
    {
      icon: 'mismatch',
      title: 'Registered address document mismatch',
      body: 'Utility bill address must match application exactly\nRented address requires landlord NOC',
    },
    {
      icon: 'clock',
      title: 'Director slow on DSC video verification',
      body: 'SPICe+ blocked until all directors complete DSC verification',
    },
  ],

  profilePersonas: [
    {
      label: 'First-time founder',
      detail: 'Never incorporated before. We explain every document and step before you take it.',
    },
    {
      label: 'Solo director',
      detail: 'Single-director company. MOA drafted to reflect full operational authority.',
    },
    {
      label: 'Two co-founders in different cities',
      detail: 'DSC video verification done remotely. Common situation, handled.',
    },
    {
      label: 'Home address as registered office',
      detail: 'Fully legal. We verify address proof requirements before filing.',
    },
    {
      label: 'Raising investment soon',
      detail: 'Authorised capital set appropriately. Board composition planned for investor entry.',
    },
  ],

  reviewKeywordChips: [
    '✓ Done in time',
    '✓ CS was responsive',
    '✓ No surprises on fees',
    '✓ All docs explained',
    '✓ CIN on day 13',
  ],

  relatedSlugs: ['gst-registration', 'director-kyc', 'mca-annual-filing', 'trademark-registration'],

  faqs: [
    {
      category: 'General',
      q: 'How long does incorporation take?',
      a: '15 working days end-to-end. DSC takes 2 days, name approval 3 days, SPICe+ filing and MCA approval 10 days.',
    },
    {
      category: 'General',
      q: 'What is the minimum capital required?',
      a: 'No legal minimum. Authorised capital can be Rs 1 lakh (the standard starting point). Stamp duty on incorporation is based on authorised capital and varies by state.',
    },
    {
      category: 'General',
      q: 'Pvt Ltd or LLP - which should I choose?',
      a: 'Pvt Ltd if you plan to raise equity, issue ESOPs, or need the company structure for credibility with enterprise clients. LLP if you are a professional services firm or want simpler compliance and profit-sharing. See our full comparison guide.',
    },
    {
      category: 'Process',
      q: 'Can I be the only director?',
      a: 'A Pvt Ltd requires a minimum of 2 directors and 2 shareholders. For single-person ownership, consider OPC (One Person Company).',
    },
    {
      category: 'Process',
      q: 'What if my proposed name is rejected?',
      a: 'We search MCA and trademark databases before filing to minimise rejection risk. If rejected, we refile alternatives immediately at no extra cost.',
    },
    {
      category: 'Documents',
      q: 'What documents do directors need?',
      a: 'PAN card, Aadhaar card, passport photo, mobile number linked to Aadhaar for OTP, and address proof. Directors must complete video verification for DSC.',
    },
    {
      category: 'After Completion',
      q: 'What are my compliance obligations after incorporation?',
      a: 'INC-20A (commencement of business) within 180 days — requires share capital deposited in a company bank account, so open a current account immediately. Annual: AOC-4 (30 days after AGM), MGT-7 (60 days after AGM), Director KYC by Sep 30, Business ITR by Oct 31.',
    },
    {
      category: 'After Completion',
      q: 'Does this include GST registration?',
      a: 'No. GST registration is a separate service. Mandatory once your turnover crosses the threshold. You can book both together - both CAs are assigned the same day.',
    },
  ],

  reviewSources: [
    {
      name: 'MCA21 Portal',
      url: 'https://www.mca.gov.in',
      description: 'Ministry of Corporate Affairs - company registry and SPICe+ documentation',
    },
    {
      name: 'Companies Act, 2013',
      url: 'https://www.indiacode.nic.in/bitstream/123456789/2114/1/A2013-18.pdf',
      description: 'Section 7: Incorporation requirements. Section 139: Audit requirements.',
    },
    {
      name: 'SPICe+ Form Guide',
      url: 'https://www.mca.gov.in/content/mca/global/en/mca/spice-plus.html',
      description: 'Official SPICe+ user manual - MCA21',
    },
  ],

  unlocks: [
    {
      name: 'GST Registration',
      explanation: 'Mandatory once turnover crosses ₹40L. Required to issue GST invoices.',
      price: '₹8,999',
      type: 'required',
      slug: 'gst-registration',
    },
    {
      name: 'Director KYC (DIR-3)',
      explanation: 'Annual KYC for every director. Due Sep 30 each year. ₹5,000/day penalty if missed.',
      price: '₹1,499/director',
      type: 'required',
      slug: 'director-kyc',
    },
    {
      name: 'MCA Annual Filing',
      explanation: 'AOC-4 and MGT-7 due every year. Non-compliance: ₹100/day penalty.',
      price: '₹6,999/year',
      type: 'required',
      slug: 'mca-annual-filing',
    },
    {
      name: 'Business ITR',
      explanation: 'ITR-6 due Oct 31 annually. Required regardless of profit or loss.',
      price: '₹11,999',
      type: 'required',
      slug: 'business-itr',
    },
    {
      name: 'Trademark Registration',
      explanation:
        'Protect your brand under your registered company name. Ownership is cleaner after incorporation.',
      price: '₹7,999',
      type: 'beneficial',
      slug: 'trademark-registration',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}

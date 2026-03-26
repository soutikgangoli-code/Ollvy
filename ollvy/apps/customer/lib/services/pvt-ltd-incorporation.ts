import { ServiceConfig } from '../services'

export const pvtLtdIncorporation: ServiceConfig = {
  slug: 'pvt-ltd-incorporation',
  name: 'Private Limited Incorporation',
  shortName: 'Pvt Ltd',
  category: 'Registrations',
  tagline: 'One registration. Every door opens.',

  ollvyFee: 9999,
  govtFee: 15000,
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
      title: 'Answer 5 questions - we build your personalised checklist',
      timeline: 'Day 0',
      body: 'Business type, number of directors, proposed company name (3 options recommended), registered state, and registered address type. A company secretary is assigned within 4 business hours. They review your answers and send you the exact document list - not a generic one.',
      visual: 'checklist',
      milestone: 'Company secretary assigned',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeline: 'Day 0-1',
      body: "PAN and Aadhaar for all directors, registered address proof (utility bill or NOC from owner), and your 3 proposed company names. All uploads stay in your account - nothing over WhatsApp. Your CS verifies each document and flags issues before filing, not after.",
      visual: 'upload',
      milestone: 'Documents verified by CS',
    },
    {
      step: 3,
      title: 'Name reservation and DSC arranged',
      timeline: 'Day 1-4',
      body: 'Your CS checks all 3 names against the MCA21 registry and trademark database simultaneously. Available names are submitted for reservation. DSC tokens are arranged for every director - each director completes a short video verification through the app. DINs are filed as part of SPICe+.',
      visual: 'form',
      milestone: 'Name reservation application submitted to MCA',
    },
    {
      step: 4,
      title: 'SPICe+ filed - MOA, AOA, PAN, TAN in one form',
      timeline: 'Day 5-12',
      body: "SPICe+ is the integrated MCA form that handles incorporation, PAN, TAN, and GSTIN pre-enrollment in a single submission. Your CS drafts the Memorandum and Articles of Association, prepares the subscriber sheet, and files with the Registrar of Companies. MCA typically processes within 5-7 working days.",
      visual: 'form',
      milestone: 'SPICe+ submitted to MCA21',
    },
    {
      step: 5,
      title: 'CIN issued - your company exists',
      timeline: 'Day 12-15',
      body: 'MCA issues the Certificate of Incorporation with your Company Identification Number. Your PAN and TAN are generated simultaneously. All documents are uploaded to your Ollvy account and stored permanently. Your compliance calendar is populated with the first MCA annual filing due dates.',
      visual: 'stamp',
      milestone: 'Certificate of Incorporation issued',
      isCompletion: true,
    },
  ],

  whatsIncluded: [
    {
      title: 'Name reservation - 3 options checked simultaneously',
      body: 'We check all 3 proposed names against the MCA21 registry and trademark database before submitting any of them. Most CAs submit one name at a time and wait for rejection before trying the next - adding days to the timeline. We do all 3 in parallel.',
      comparisonWithout: 'Submit one name, wait for rejection, repeat',
      comparisonWithOllvy: '3 names checked in parallel - faster approval',
      mockVisualType: 'status',
      mockVisualData: {
        row1: 'TECHBRIDGE INDIA PVT LTD - Checking...',
        row2: 'TECHBRIDGE SOLUTIONS PVT LTD - Available ✓',
        row3: 'TECHBRIDGE VENTURES PVT LTD - Checking...',
        note: 'Name 2 reserved - SPICe+ filed same day',
      },
    },
    {
      title: 'DSC arranged for all directors - including video verification',
      body: "Digital Signature Certificates are required for all directors. We arrange the DSC tokens and each director completes the video verification through a guided flow in the app. Most founders find this confusing when doing it themselves - we walk through it step by step.",
      comparisonWithout: 'Navigate DSC portals yourself - typically 3-5 hours',
      comparisonWithOllvy: 'Guided flow in app - 15 minutes per director',
    },
    {
      title: 'MOA and AOA drafted - not templated',
      body: "The Memorandum and Articles of Association define your company's purpose, share structure, and governance rules. Your CS drafts these based on your business type and objectives - not a standard template. If your business has specific operational requirements, they're reflected in the MOA.",
      comparisonWithout: 'Generic MOA - may need amendment later',
      comparisonWithOllvy: 'Drafted for your specific business and share structure',
    },
    {
      title: 'PAN, TAN, and compliance calendar - included',
      body: "PAN and TAN are generated as part of SPICe+ at no extra step. Once the CIN is issued, your Ollvy compliance calendar is automatically populated with every annual obligation: MCA annual return, Director KYC (Sep 30), Business ITR (Oct 31), and audit requirements based on company size.",
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'MCA Annual Return - Due Sep 30 (AOC-4 + MGT-7)',
        row2: 'Director KYC (DIR-3) - Due Sep 30 every year',
        row3: 'Business ITR (ITR-6) - Due Oct 31 every year',
        note: 'Added to your calendar automatically',
      },
    },
    {
      title: 'All documents in your account - permanently',
      body: "Certificate of Incorporation, MOA, AOA, PAN card, TAN letter, share certificates, and DSC details - all stored in your Ollvy account permanently. Not emailed to you and lost. Your CA will ask for these repeatedly over the years. They'll always be here.",
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'Name rejected by MCA',
      body: "The most common reason incorporations take longer than 15 days. MCA rejects names identical or similar to existing companies, or containing restricted words (Bank, Insurance, Exchange, etc.). Submitting 3 distinct names in parallel is the standard workaround - which is what we do. If all 3 are rejected, we suggest 3 alternatives at no extra cost.",
    },
    {
      icon: 'alert',
      title: 'Registered address utility bill mismatch',
      body: "The registered office address must match the utility bill exactly - building name, floor, area, and pin code. Many founders use their home address (legal) with an old utility bill in a family member's name. MCA raises a query. Your CS does a pre-submission check and catches this before filing.",
    },
    {
      icon: 'clock',
      title: 'One director slow on DSC video verification',
      body: "SPICe+ cannot be filed until all directors complete DSC verification. If one director is travelling or unresponsive, it stalls the entire application. Ollvy tracks completion status and sends daily reminders. The video itself takes 10 minutes - it just needs to actually happen.",
    },
  ],

  profilePersonas: [
    {
      label: 'First-time founder',
      detail: 'Never done this before. We explain every step before you take it.',
    },
    {
      label: 'Solo director',
      detail: 'Single-director company. MOA is drafted to reflect full operational authority.',
    },
    {
      label: 'Two co-founders, different cities',
      detail: 'DSC video verification done remotely. Common situation, handled.',
    },
    {
      label: 'Home address as registered office',
      detail: 'Fully legal. We verify the address proof requirements before filing.',
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
      q: 'What is a Private Limited Company?',
      a: "A Pvt Ltd is a separate legal entity from its owners. It can own assets, enter contracts, take on employees, and raise funding. Liability is limited to share capital - your personal assets are protected. It's the default entity type for startups that plan to raise investment.",
    },
    {
      category: 'General',
      q: 'Is Pvt Ltd right for me, or should I do an LLP?',
      a: 'Pvt Ltd if you plan to raise equity funding, hire employees, or need the company name to carry credibility. LLP if the business is a professional services practice (consulting, architecture, etc.) or if the founding team prefers profit-sharing over salary+dividend structure. We can help you decide - WhatsApp us.',
    },
    {
      category: 'General',
      q: 'Can I use my home address as the registered office?',
      a: "Yes. There is no restriction on using a residential address. You'll need a utility bill (electricity or water, within 2 months) in the name of the owner, or an NOC from the property owner if you're a tenant.",
    },
    {
      category: 'Process',
      q: 'What happens if my proposed name is rejected?',
      a: 'Your CS will notify you immediately and suggest 3 alternatives based on your business type. We refile at no extra charge. Name rejections add 3-5 days to the timeline - which is why we recommend submitting 3 distinct names from the start.',
    },
    {
      category: 'Process',
      q: 'How long does it actually take?',
      a: "Most incorporations are done in 12-15 working days. The timeline depends entirely on MCA processing speed (which Ollvy cannot control) and how quickly all directors complete DSC verification. Our SLA is 15 working days. We've never breached it for a well-documented application.",
    },
    {
      category: 'Documents',
      q: "What if a director doesn't have an Aadhaar-linked mobile number?",
      a: "Aadhaar-based OTP verification is required for SPICe+. If a director's mobile is not linked to Aadhaar, it must be linked through UIDAI before we can proceed. This typically takes 2-3 days and must be done by the director in person at any Aadhaar enrollment centre.",
    },
    {
      category: 'After Completion',
      q: 'What are my compliance obligations after incorporation?',
      a: 'Immediately: open a current account within 30 days. Within 2 months: hold the first board meeting. Annual: MCA annual return (AOC-4 + MGT-7), Director KYC by Sep 30, Business ITR by Oct 31. Ollvy adds all of these to your compliance calendar automatically.',
    },
    {
      category: 'After Completion',
      q: 'Does this include GST registration?',
      a: "No. GST registration is a separate service (₹8,999). It's mandatory once your turnover crosses ₹40L (₹20L for service businesses). If you already know you'll need it, you can book both together - no discount, but both CAs are assigned the same day.",
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
      url: 'https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf',
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

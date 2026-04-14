import { ServiceConfig } from '../services'

export const trademarkRegistration: ServiceConfig = {
  slug: 'trademark-registration',
  name: 'Trademark Registration',
  shortName: 'Trademark',
  category: 'Legal',
  tagline: 'Protect your brand name. 10-year protection. Nationwide.',

  ollvyFee: 2999,
  govtFee: 4500,
  mrp: 15000,
  govtFeeLabel: 'Govt filing fee',
  govtFeeNote:
    'This is the government fee for a single class trademark application. Additional classes cost ₹4,500 each. MSME discount (₹4,500 → ₹2,250) applies if you have Udyam registration.',

  slaDays: 7,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Businesses that want to protect their brand name',
  legalBasis: 'Trade Marks Act, 1999',
  penaltyForMissing: undefined,
  penaltyColor: 'none',

  seoTitle: 'Trademark Registration India | ₹12,499 | 10-Year Protection | Ollvy',
  seoDescription:
    'Register your trademark in India. Application filed within 7 days. ₹7,999 Ollvy fee + ₹4,500 govt fee. Trademark search included. 10-year nationwide protection.',
  canonicalUrl: 'https://www.ollvy.com/services/trademark-registration',

  processSteps: [
    {
      step: 1,
      title: 'Tell us your brand name and business category',
      timeline: 'Day 0',
      body: "Attorney assigned within 4 hours\nProvide: brand name (word/logo/both), classes, business details\nPreliminary search conducted for conflicts",
      visual: 'checklist',
      milestone: 'Attorney assigned, preliminary search started',
    },
    {
      step: 2,
      title: 'Trademark search report delivered',
      timeline: 'Day 1-2',
      body: "Registry searched for identical and similar marks in your classes\nSearch report delivered with potential conflicts\nClear mark → proceed. Conflicts → modifications suggested",
      visual: 'form',
      milestone: 'Search report delivered',
    },
    {
      step: 3,
      title: 'Application filed with Trademark Registry',
      timeline: 'Day 3-7',
      body: "Application drafted with correct class(es) and trademark specification\nFiled with Trademark Registry\nApplication number and filing receipt shared",
      visual: 'form',
      milestone: 'Application filed, receipt received',
    },
    {
      step: 4,
      title: 'Examination and publication (handled)',
      timeline: '6-12 months (govt processing)',
      body: "Registry examines application — objections handled by attorney\nMark published in Trademark Journal for 4 months\nNo opposition → registration granted",
      visual: 'calendar',
      milestone: 'Under examination',
    },
    {
      step: 5,
      title: 'Registration certificate issued',
      timeline: '12-18 months total',
      body: "Registration certificate issued\n10-year protection, renewable indefinitely\nCertificate uploaded to your account",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'Trademark registered',
    },
  ],

  whatsIncluded: [
    {
      title: 'Trademark search before filing',
      body: 'Registry searched before your government fee is spent\nIf your exact mark is already registered in your class, you know upfront',
      comparisonWithout: 'File without searching, wait months, get rejected',
      comparisonWithOllvy: 'Search first, modify if needed, then file',
    },
    {
      title: 'Class selection guidance',
      body: '45 classes exist under the Nice Classification\nAttorney recommends only the ones you actually need — no unnecessary filings',
    },
    {
      title: 'Examiner objection response included',
      body: 'Examiner objections are common for descriptive marks — your attorney handles the response\nIncluded in the service, not a separate charge',
      comparisonWithout: 'Objection raised, you pay extra to respond',
      comparisonWithOllvy: 'Objection response included in service',
    },
    {
      title: 'Renewal reminder',
      body: 'Trademark expires 10 years from filing date. Renewal reminder added to your compliance calendar 6 months before expiry.',
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'Trademark Renewal - Due in 10 years',
        row2: 'Reminder: 6 months before expiry',
        row3: 'Status: Scheduled',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'Similar mark already exists',
      body: 'Similar mark in your class = rejection\nSearch catches most conflicts, but unpublished pending apps are invisible',
    },
    {
      icon: 'clock',
      title: 'Government processing takes 12-18 months',
      body: '7-day timeline = filing only\nExamination, publication, certificate are government-side (12-18 months)',
    },
    {
      icon: 'alert',
      title: 'Opposition during publication',
      body: 'Mark published for 4 months, anyone can oppose\nOpposition = formal legal proceeding (separate service)\nRare, under 5% of cases',
    },
  ],

  profilePersonas: [
    {
      label: 'First trademark',
      detail: 'Never registered before. We explain classes, search, and the full process.',
    },
    {
      label: 'Logo and word mark',
      detail: 'You want to protect both. Two separate applications needed. We handle both.',
    },
    {
      label: 'Multiple classes',
      detail: 'Tech, retail, and services. Each class is a separate application and a separate government fee.',
    },
    {
      label: 'Already using the name',
      detail: 'You have been using the brand for years without registration. File now before someone else does.',
    },
  ],

  reviewKeywordChips: [
    '✓ Search before filing',
    '✓ Attorney was clear',
    '✓ Application in 5 days',
    '✓ Objection handled',
    '✓ Certificate received',
  ],

  relatedSlugs: ['pvt-ltd-incorporation', 'msme-registration'],

  faqs: [
    {
      category: 'General',
      q: 'What can I trademark?',
      a: 'Words, logos, slogans, sounds, and in some cases colours. Most businesses file a word mark and a logo mark separately for broader protection.',
    },
    {
      category: 'General',
      q: 'How long does protection last?',
      a: '10 years from the filing date, renewable indefinitely in 10-year increments.',
    },
    {
      category: 'Process',
      q: 'Why does registration take 12-18 months?',
      a: 'The 7-day timeline is for filing. Examination by the Registry takes 6-12 months, then 4 months of public opposition window, then certificate issuance.',
    },
    {
      category: 'Process',
      q: 'Can I use the R symbol after filing?',
      a: 'No. Use R only after registration is granted. Until then, use TM (for goods) or SM (for services) to indicate your claim.',
    },
    {
      category: 'Documents',
      q: 'What documents do I need?',
      a: 'PAN, Aadhaar, address proof, and the logo file if registering a logo. For companies: Certificate of Incorporation and board resolution.',
    },
    {
      category: 'Pricing',
      q: 'What if I need multiple classes?',
      a: 'Each class is a separate application with a separate government fee. Our attorney will recommend only the classes you actually need.',
    },
  ],

  reviewSources: [
    {
      name: 'IP India',
      url: 'https://ipindia.gov.in',
      description: 'Official Trademark Registry and search portal',
    },
    {
      name: 'Trade Marks Act, 1999',
      url: 'https://www.indiacode.nic.in/bitstream/123456789/15427/1/the_trade_marks_act,_1999.pdf',
      description: 'Section 18: Application requirements. Section 25: Duration of registration.',
    },
  ],

  unlocks: [
    // Note: trademark-renewal and copyright-registration services not yet available
    // Unlock items commented out until services are added
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}

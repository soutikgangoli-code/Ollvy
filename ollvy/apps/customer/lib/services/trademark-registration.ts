import { ServiceConfig } from '../services'

export const trademarkRegistration: ServiceConfig = {
  slug: 'trademark-registration',
  name: 'Trademark Registration',
  shortName: 'Trademark',
  category: 'Legal',
  tagline: 'Protect your brand name. 10-year protection. Nationwide.',

  ollvyFee: 14999,
  govtFee: 4500,
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
      body: "A trademark attorney is assigned within 4 hours. You provide the brand name (word mark, logo, or both), the classes of goods/services you want to protect, and your business details. They conduct a preliminary search to check for conflicts.",
      visual: 'checklist',
      milestone: 'Attorney assigned, preliminary search started',
    },
    {
      step: 2,
      title: 'Trademark search report delivered',
      timeline: 'Day 1-2',
      body: "Your attorney searches the Trademark Registry for identical and similar marks in your classes. You receive a search report showing potential conflicts. If your mark is clear, we proceed. If not, we suggest modifications.",
      visual: 'form',
      milestone: 'Search report delivered',
    },
    {
      step: 3,
      title: 'Application filed with Trademark Registry',
      timeline: 'Day 3-7',
      body: "Your attorney drafts the application, selects the appropriate class(es), prepares the trademark specification, and files with the Trademark Registry. You receive the application number and filing receipt.",
      visual: 'form',
      milestone: 'Application filed, receipt received',
    },
    {
      step: 4,
      title: 'Examination and publication (handled)',
      timeline: '6-12 months (govt processing)',
      body: "The Trademark Registry examines your application. If they raise objections, your attorney responds. Once cleared, the mark is published in the Trademark Journal for 4 months. If no opposition, registration is granted.",
      visual: 'calendar',
      milestone: 'Under examination',
    },
    {
      step: 5,
      title: 'Registration certificate issued',
      timeline: '12-18 months total',
      body: "The Trademark Registry issues the registration certificate. Your mark is protected for 10 years, renewable indefinitely. Certificate uploaded to your Ollvy account.",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'Trademark registered',
    },
  ],

  whatsIncluded: [
    {
      title: 'Trademark search before filing',
      body: 'Attorney searches the Registry before we spend your government fee. If your exact mark is already registered in your class, we tell you upfront.',
      comparisonWithout: 'File without searching, wait months, get rejected',
      comparisonWithOllvy: 'Search first, modify if needed, then file',
    },
    {
      title: 'Class selection guidance',
      body: 'Trademarks are registered per class (45 classes under the Nice Classification). Attorney recommends only the classes you actually need - we do not push unnecessary filings.',
    },
    {
      title: 'Examiner objection response included',
      body: 'If the Trademark Examiner raises objections (common for descriptive marks), your attorney responds. Included in the service - not a separate charge.',
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
      body: 'If a similar mark is already registered in your class, the Examiner will reject your application. Our search catches most conflicts, but pending applications that are not yet published cannot be seen. If rejected, we help you appeal or modify.',
    },
    {
      icon: 'clock',
      title: 'Government processing takes 12-18 months',
      body: 'The 7-day timeline is for filing. Examination, publication, and certificate issuance are government-side. We track and update you but cannot speed up the Registry.',
    },
    {
      icon: 'alert',
      title: 'Opposition during publication',
      body: 'After examination, your mark is published for 4 months. Anyone can file an opposition. If opposed, it becomes a formal legal proceeding. Opposition response is a separate service and is rare - happens in under 5% of cases.',
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
      a: 'The 7-day timeline is for filing. Examination by the Registry takes 6-12 months. Then 4 months of public opposition window. Then certificate issuance. All government-side processing.',
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

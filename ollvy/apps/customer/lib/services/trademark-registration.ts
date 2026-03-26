import { ServiceConfig } from '../services'

export const trademarkRegistration: ServiceConfig = {
  slug: 'trademark-registration',
  name: 'Trademark Registration',
  shortName: 'Trademark',
  category: 'Legal',
  tagline: 'Protect your brand name. 10-year validity. Nationwide protection.',

  ollvyFee: 7999,
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
      body: "Before we file, your attorney searches the Trademark Registry for conflicts. If your exact mark is already registered in your class, we tell you upfront. No point paying the govt fee for a certain rejection.",
      comparisonWithout: 'File blindly, wait months, get rejected',
      comparisonWithOllvy: 'Search first, modify if needed, then file',
      mockVisualType: 'status',
      mockVisualData: {
        row1: 'TECHBRIDGE - Class 42',
        row2: 'No identical marks found ✓',
        row3: '2 similar marks reviewed - no conflict',
      },
    },
    {
      title: 'Class selection guidance',
      body: "Trademarks are registered per class (45 classes total). Your attorney recommends which classes you actually need. Most tech companies need Class 42 (software) and Class 35 (business services). We don't upsell unnecessary classes.",
    },
    {
      title: 'Examination objection response included',
      body: "If the Trademark Examiner raises objections (common for descriptive marks), your attorney responds. This is included - not a separate charge. Most objections are resolved in one response.",
      comparisonWithout: 'Objection raised, you pay extra to respond',
      comparisonWithOllvy: 'Objection response included in service',
    },
    {
      title: 'Renewal reminder 10 years out',
      body: "Your trademark expires in 10 years. We add the renewal date to your compliance calendar. You'll get reminders 6 months before expiry. Most people forget - you won't.",
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'Trademark Renewal - Mar 2035',
        row2: 'Reminder: Sep 2034',
        row3: 'Status: Scheduled',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'Similar mark already exists',
      body: "If someone has already registered a similar mark in your class, the Examiner will reject your application. Our search catches most conflicts, but the Registry has marks we can't see (pending applications). If rejected, we help you appeal or modify.",
    },
    {
      icon: 'clock',
      title: 'Govt processing takes 12-18 months',
      body: "Trademark registration in India takes 12-18 months end-to-end. The filing happens in 7 days, but examination and publication are government-side. We track status and update you, but we can't speed up the Registry.",
    },
    {
      icon: 'alert',
      title: 'Opposition during publication',
      body: "After examination, your mark is published for 4 months. Anyone can oppose. If opposed, it becomes a legal proceeding. Opposition response is a separate service (it's rare - happens in <5% of cases).",
    },
  ],

  profilePersonas: [
    {
      label: 'First trademark',
      detail: "Never registered a trademark before. We explain classes, search, and the entire process.",
    },
    {
      label: 'Logo + word mark',
      detail: 'You want to protect both. Two applications are needed. We handle both.',
    },
    {
      label: 'Multiple classes',
      detail: 'Tech + retail + services. Each class is ₹4,500 additional govt fee. We guide you on what you actually need.',
    },
    {
      label: 'Already using the name',
      detail: "You've been using the brand for years without registration. That's common. Register it now before someone else does.",
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
      a: "Words, logos, slogans, sounds, and even colours in some cases. Most businesses trademark their brand name (word mark) and logo separately. This gives broader protection.",
    },
    {
      category: 'General',
      q: 'How long does trademark protection last?',
      a: "10 years from filing date, renewable indefinitely in 10-year increments. Renewal fee is ₹10,000 (govt) per class.",
    },
    {
      category: 'Process',
      q: 'Why does registration take so long?',
      a: "The 7-day timeline is for filing the application. Examination by the Registry takes 6-12 months. Then 4 months of publication. Then certificate issuance. Total: 12-18 months. This is government processing time.",
    },
    {
      category: 'Process',
      q: 'Can I use the ® symbol after filing?',
      a: "No. You can only use ® after registration is granted. Until then, use ™ (for goods) or ℠ (for services) to indicate you claim the mark.",
    },
    {
      category: 'Documents',
      q: 'What documents do I need?',
      a: "PAN, Aadhaar, address proof, and the logo file (if registering a logo). For companies: Certificate of Incorporation and board resolution.",
    },
    {
      category: 'Pricing',
      q: 'What if I need multiple classes?',
      a: "Each class is a separate application with separate govt fee (₹4,500 each). Ollvy fee is ₹7,999 for the first class, ₹3,999 for each additional class filed together.",
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
      url: 'https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_34_1_trade-marks-act-1999.pdf',
      description: 'Section 18: Application requirements. Section 25: Duration of registration.',
    },
  ],

  unlocks: [
    {
      name: 'Trademark Renewal',
      explanation: 'Due every 10 years. File 6 months before expiry.',
      price: '₹4,999 + govt fee',
      type: 'required',
      slug: 'trademark-renewal',
    },
    {
      name: 'Copyright Registration',
      explanation: 'Protect creative works - code, designs, content.',
      price: '₹5,999',
      type: 'beneficial',
      slug: 'copyright-registration',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}

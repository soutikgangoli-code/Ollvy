export type ServiceInPack = {
  id: string
  name: string
  shortName: string
  price: number               // paisa
  timelineDays: string        // display string e.g. "30-45 working days"
  whyRequired: string         // one sentence
  deelectWarning: string      // shown when unchecked
  badge?: string              // optional badge text e.g. "REQUIRED TO HIRE"
  badgeVariant?: 'neutral' | 'amber' | 'success'
  isCore: boolean             // always true for pack services
}

export type PackAddOn = {
  id: string
  name: string
  price: number               // paisa
  priceDisplay: string        // e.g. "₹8,999" or "₹2,999/yr"
  note: string
  badge?: string
}

export type PackReview = {
  rating: number
  date: string
  quote: string
  name: string
  city: string
  businessType: string
}

export type PackPersona = {
  title: string
  detail: string
}

export type PackRisk = {
  title: string
  what: string
  mitigation: string
}

export type PackDocument = {
  name: string
  note: string
  priority: 'required' | 'within7days' | 'ollvyprovides'
  whatIsIt: string
  howToGet: string
  commonIssues: string
  ollvyProvides?: boolean
}

export type PackDocumentGroup = {
  serviceShortName: string
  documents: PackDocument[]
}

export type PackFAQ = {
  q: string
  a: string
}

export type PackUnlock = {
  title: string
  detail: string
  ctaText?: string
  ctaHref?: string
}

export type CloudKitchenPack = {
  slug: string
  name: string
  h1: string
  tagline: string
  guaranteeText: string
  discountPercent: number
  services: ServiceInPack[]
  addOns: PackAddOn[]
  retainerHook: {
    title: string
    body: string
    price: number
    priceLabel: string
    features: string[]
    ctaText: string
    ctaHref: string
  }
  processSteps: Array<{
    day: string
    title: string
    detail: string
    isActive?: boolean
  }>
  whatsIncluded: Array<{
    serviceShortName: string
    inclusions: Array<{ title: string; detail?: string }>
  }>
  comparisonWithout: string[]
  comparisonWith: string[]
  stats: Array<{ value: string; label: string }>
  keywordChips: string[]
  reviews: PackReview[]
  personas: PackPersona[]
  risks: PackRisk[]
  documentGroups: PackDocumentGroup[]
  faqs: PackFAQ[]
  unlocks: PackUnlock[]
  seoTitle: string
  seoDescription: string
  canonicalUrl: string
  metaImageUrl: string
  relatedPackSlugs: string[]
}

export const cloudKitchenPack: CloudKitchenPack = {
  slug: 'cloud-kitchen-setup',
  name: 'Cloud Kitchen Setup',
  h1: 'FSSAI LICENSE\n+ GST FOR\nCLOUD KITCHENS',
  tagline: 'Everything required to list on Swiggy and Zomato. 4 licenses, filed simultaneously, ₹33,599 total.',
  guaranteeText: 'Guaranteed FSSAI application within 24 hours of document submission',
  discountPercent: 18,

  services: [
    {
      id: 'fssai-state-license',
      name: 'FSSAI State License',
      shortName: 'FSSAI',
      price: 1899900,
      timelineDays: '30-45 working days',
      whyRequired: 'Swiggy and Zomato will not onboard your kitchen without a valid FSSAI number.',
      deelectWarning: "Already have an FSSAI number? Check that it covers your current address and all food categories you'll prepare. A missing Kind of Business (KoB) gets flagged during aggregator onboarding.",
      isCore: true,
    },
    {
      id: 'gst-registration',
      name: 'GST Registration',
      shortName: 'GST',
      price: 899900,
      timelineDays: '7 working days',
      whyRequired: 'Swiggy and Zomato deduct 0.5% TCS from every payout. You need a GSTIN to claim it back.',
      deelectWarning: 'Already GST registered? If your GSTIN is for a different business address, you may need an Additional Place of Business amendment before aggregator onboarding.',
      isCore: true,
    },
    {
      id: 'shop-establishment',
      name: 'Shop & Establishment Registration',
      shortName: 'Shop & Estab',
      price: 399900,
      timelineDays: '5-7 working days',
      whyRequired: 'Required under state law before you can legally employ kitchen staff.',
      deelectWarning: 'Only uncheck if this premises is already registered under Shop & Establishment.',
      badge: 'REQUIRED TO HIRE',
      badgeVariant: 'neutral',
      isCore: true,
    },
    {
      id: 'trade-license',
      name: 'Trade License / Eating House License',
      shortName: 'Trade License',
      price: 899900,
      timelineDays: '15-30 working days',
      whyRequired: 'Municipal clearance to operate a food business. Eating House License from police in most states.',
      deelectWarning: 'Delhi: Trade License (MCD) and Eating House License (police) are separate. If you have one but not both, keep this checked - we handle both.',
      badge: 'VARIES BY CITY',
      badgeVariant: 'neutral',
      isCore: true,
    },
  ],

  addOns: [
    {
      id: 'fire-noc',
      name: 'Fire NOC',
      price: 899900,
      priceDisplay: '₹8,999',
      note: 'Mandatory for dine-in establishments above 50 covers. Not required for pure delivery cloud kitchens in most states.',
      badge: 'DINE-IN ONLY',
    },
    {
      id: 'fssai-annual-return',
      name: 'FSSAI Annual Return',
      price: 299900,
      priceDisplay: '₹2,999/yr',
      note: 'FSSAI-licensed businesses must file an annual return every May 31. Penalty: ₹100/day for late filing.',
      badge: 'DUE MAY 31',
    },
    {
      id: 'trademark-word-mark',
      name: 'Trademark - Word Mark',
      price: 1499900,
      priceDisplay: '₹14,999 + ₹4,500 govt fees',
      note: 'Competitors can copy your brand name on Swiggy once you scale. Registration protects the name before someone else files it.',
    },
  ],

  retainerHook: {
    title: 'GST FILING - MONTHLY',
    body: 'Swiggy and Zomato deduct 0.5% TCS from every payout. GSTR-3B must be filed by the 20th of every month to claim it back. One missed month and that TCS is stuck until you file.',
    price: 299900,
    priceLabel: '/ month',
    features: [
      'GSTR-1 + GSTR-3B monthly',
      'TCS reconciliation',
      'Dedicated CA assigned',
    ],
    ctaText: 'Add GST Filing →',
    ctaHref: '/services/gst-monthly-filing',
  },

  processSteps: [
    {
      day: 'TODAY',
      title: 'Documents submitted',
      detail: 'You upload documents. Work starts same day.',
      isActive: true,
    },
    {
      day: 'DAY 1',
      title: 'All 4 applications filed',
      detail: 'FSSAI, GST, Shop & Estab, Trade License - all simultaneously.',
    },
    {
      day: 'DAY 7',
      title: 'GST Registration live',
      detail: 'GSTIN issued. You can start invoicing.',
    },
    {
      day: 'DAY 15-20',
      title: 'FSSAI inspection',
      detail: 'Officer visits your kitchen. Ollvy prepares your premises checklist.',
    },
    {
      day: 'DAY 30-45',
      title: 'FSSAI certificate issued',
      detail: 'Submit to Swiggy and Zomato. Go live within 3-5 days.',
    },
  ],

  whatsIncluded: [
    {
      serviceShortName: 'FSSAI STATE LICENSE',
      inclusions: [
        { title: 'Application on FoSCoS portal' },
        { title: 'Document preparation and review', detail: 'We check for mismatches before submitting - 90% of rejections are document errors' },
        { title: 'Pre-inspection premises checklist', detail: 'Sent to you 7 days before inspection date' },
        { title: 'Response to improvement notices', detail: 'If officer raises objections, we respond within the portal' },
        { title: 'FSSAI certificate (digital)' },
        { title: 'Annual return reminder (May 31 each year)' },
      ],
    },
    {
      serviceShortName: 'GST REGISTRATION',
      inclusions: [
        { title: 'GST application on GST portal' },
        { title: 'HSN / SAC code selection', detail: 'We identify the correct codes for your food categories' },
        { title: 'GSTIN issued within 7 working days' },
        { title: 'Invoice format guidance', detail: 'How to show GSTIN correctly on Swiggy and Zomato invoices' },
        { title: 'First GSTR-3B walkthrough (if self-filing)' },
      ],
    },
    {
      serviceShortName: 'SHOP & ESTABLISHMENT',
      inclusions: [
        { title: 'Application to state labour department' },
        { title: 'Certificate issued within 5-7 working days' },
      ],
    },
    {
      serviceShortName: 'TRADE LICENSE',
      inclusions: [
        { title: 'Application to municipal corporation (Trade License)' },
        { title: 'Application to police (Eating House License - where applicable)' },
        { title: 'Document preparation' },
        { title: 'Follow-up until issued', detail: 'These take 15-30 days - we track and follow up on your behalf' },
      ],
    },
  ],

  comparisonWithout: [
    'Wrong FSSAI license type - Basic when State is needed. Swiggy rejects it on onboarding.',
    'GST registration at wrong address - GSTIN must match your kitchen address.',
    'FSSAI inspection failed - no prep. Dirty kitchen, missing layout, wrong documents.',
    'Missing Eating House License - Delhi requires police clearance separately.',
    '3 months of back and forth. No single point of contact.',
  ],

  comparisonWith: [
    'Correct license type confirmed before filing. Turnover question determines Basic vs State.',
    'GST address cross-checked with FSSAI address. Both applications use the same address.',
    'Premises checklist sent before inspection. 7 days before: layout, cleanliness, document display.',
    'Eating House + Trade License both covered. City-specific requirements mapped.',
    'One professional, one WhatsApp. Direct contact throughout.',
  ],

  stats: [
    { value: '2,400+', label: 'FSSAI applications filed' },
    { value: '98%', label: 'On-time completion' },
    { value: '4.8', label: 'Average rating - 47 reviews' },
  ],

  keywordChips: ['Quick', 'Transparent', 'Professional', 'No surprises', 'Single contact'],

  reviews: [
    {
      rating: 5,
      date: 'January 2026',
      quote: 'Got my FSSAI in 38 days. Ollvy sent me a checklist before the inspection - passed first time.',
      name: 'Priya S.',
      city: 'Delhi',
      businessType: 'Cloud kitchen',
    },
    {
      rating: 5,
      date: 'December 2025',
      quote: 'GST and FSSAI filed the same day I uploaded documents. Was live on Zomato in 41 days.',
      name: 'Rahul M.',
      city: 'Gurugram',
      businessType: 'Dark kitchen',
    },
    {
      rating: 4,
      date: 'November 2025',
      quote: "Price was transparent. No surprises at checkout. Professional was reachable on WhatsApp throughout.",
      name: 'Anjali T.',
      city: 'Noida',
      businessType: 'Home baker going commercial',
    },
  ],

  personas: [
    {
      title: 'Residential kitchen - society NOC issue',
      detail: "Our client's society refused to give an NOC. We drafted a legal notice format for the RWA, explained the FSSAI legal position, and resolved it within a week.",
    },
    {
      title: 'Existing restaurant adding a cloud brand',
      detail: 'They already had FSSAI but it did not cover their new food categories. We filed a KoB modification, not a new license - saved them 30 days.',
    },
    {
      title: 'FSSAI inspection failed first time',
      detail: 'Officer found the kitchen layout did not match the submitted drawing. We revised the layout document and secured re-inspection within 7 days.',
    },
    {
      title: 'GST address different from kitchen address',
      detail: "They'd registered GST for their home earlier. We filed an Additional Place of Business amendment so both addresses were covered under one GSTIN.",
    },
  ],

  risks: [
    {
      title: 'FSSAI inspection failure',
      what: 'Officer visits and finds the kitchen does not match the submitted layout, or hygiene standards are not met. This adds 2-4 weeks while an improvement notice is issued and resolved.',
      mitigation: 'Ollvy sends a pre-inspection checklist 7 days before the visit. We respond to improvement notices through the FoSCoS portal.',
    },
    {
      title: 'GST portal rejection',
      what: 'GST applications are rejected when document names do not match (PAN vs Aadhaar), address is unclear, or bank details are incorrect. Each rejection adds 3-5 days.',
      mitigation: 'Ollvy reviews all documents for consistency before filing. Our rejection rate is under 5%.',
    },
    {
      title: 'Trade License delays in specific cities',
      what: 'Municipal corporations in Delhi, Mumbai, and Bengaluru have different processes and timelines. Some require physical visits. Timeline: 15-30 days - sometimes longer.',
      mitigation: 'Your professional is city-specific. We do not assign a Bengaluru agent to a Delhi application.',
    },
    {
      title: 'FSSAI inspection not scheduled',
      what: 'In some states, inspection officers are backlogged. The application sits pending inspection for weeks with no response.',
      mitigation: 'Ollvy follows up directly with the state FSSAI office. We escalate to the District Officer if no inspection is scheduled within 14 days.',
    },
  ],

  documentGroups: [
    {
      serviceShortName: 'ALL SERVICES',
      documents: [
        {
          name: 'Aadhaar Card',
          note: 'Of the owner / proprietor / director. Active mobile required.',
          priority: 'required',
          whatIsIt: 'Your 12-digit UIDAI identity number. Required for identity verification on FSSAI FoSCoS portal, GST portal, and municipal applications.',
          howToGet: 'Scan front and back sides. Ensure the mobile number linked to your Aadhaar is active - OTPs are sent to it during filing. Check at myaadhaar.uidai.gov.in.',
          commonIssues: 'Inactive linked mobile is the most common blocker. If your mobile is not linked, update it at any Aadhaar enrolment centre - takes 7 days.',
        },
        {
          name: 'PAN Card',
          note: 'Of the owner. Name must match Aadhaar exactly.',
          priority: 'required',
          whatIsIt: 'Your 10-digit Permanent Account Number. Required for GST registration, FSSAI application, and all government filings.',
          howToGet: 'Photograph or scan the physical card. Ensure the name matches Aadhaar character for character - including spaces and initials.',
          commonIssues: "Name mismatch between PAN and Aadhaar is the #1 rejection reason. 'Rajesh K Singh' on PAN but 'Rajesh Kumar Singh' on Aadhaar - GST and FSSAI portals reject this.",
        },
        {
          name: 'Kitchen address proof',
          note: 'Electricity / gas / water bill. Not older than 60 days. Must show kitchen address.',
          priority: 'required',
          whatIsIt: 'Proof that you operate from the address declared in the FSSAI application. Must be a utility bill.',
          howToGet: 'Download the latest bill from your electricity or gas provider app or portal. Must show the complete address including PIN code.',
          commonIssues: 'Bill older than 60 days is rejected. Bill in parent or landlord name is generally accepted - Ollvy confirms based on state requirements.',
        },
        {
          name: 'Kitchen layout sketch',
          note: 'Rough hand-drawn diagram is accepted. Photo of sketch is fine.',
          priority: 'required',
          whatIsIt: 'A simple drawing showing the physical layout of your kitchen - entry point, cooking area, storage area, washing area. Used by FSSAI inspection officer.',
          howToGet: 'Draw it yourself on plain paper. Label: Entry, Cooking Zone, Utensil Storage, Food Storage, Wash Area. Take a clear photo. No professional drawing needed.',
          commonIssues: 'Layout submitted at application must match the actual kitchen seen during inspection. If you reorganise after filing, redraw and inform Ollvy.',
        },
        {
          name: 'Rent agreement',
          note: 'Only if kitchen premises are rented.',
          priority: 'within7days',
          whatIsIt: 'Your lease or leave-and-licence agreement. Proves you have the right to use the address for commercial food activity.',
          howToGet: 'Scan the existing rent agreement. Both registered and unregistered agreements are accepted. Must cover the current date of application.',
          commonIssues: 'Agreement expired? An expired agreement combined with a recent utility bill is sometimes accepted. To be safe, get a fresh letter from the landlord confirming continued occupancy.',
        },
        {
          name: 'Food items list',
          note: "Cuisines and food categories you'll prepare. WhatsApp message to your manager is fine.",
          priority: 'within7days',
          whatIsIt: 'The categories of food you will prepare - needed to select the correct Kinds of Business (KoB) on your FSSAI license. A wrong KoB causes aggregator onboarding issues.',
          howToGet: "Just describe it in a WhatsApp message: 'We'll make biryani, grilled chicken, desserts.' Ollvy maps this to the correct FSSAI KoB.",
          commonIssues: 'Adding a new food category after FSSAI is issued requires a KoB modification (₹1,000 fee). Plan broadly - if you might add desserts later, include it now.',
        },
        {
          name: 'Bank cancelled cheque or statement',
          note: 'For GST registration. Account in owner / business name.',
          priority: 'within7days',
          whatIsIt: 'Proof of your bank account - account number and IFSC. Required for GST registration.',
          howToGet: "Photograph a cancelled cheque (write 'CANCELLED' in ink). Or download a bank statement showing account number and IFSC from net banking.",
          commonIssues: "Account must be in the owner's name or the business name. A family member's account is not accepted for GST registration.",
        },
        {
          name: 'Passport-size photograph',
          note: 'Recent. JPEG format. White background preferred.',
          priority: 'within7days',
          whatIsIt: 'Required for FSSAI application on the FoSCoS portal.',
          howToGet: 'A clear mobile selfie against a white wall. Save as JPEG under 1MB.',
          commonIssues: 'Blurry, dark, or heavy-shadow photos get rejected.',
        },
        {
          name: 'Food Safety Management Plan',
          note: 'Ollvy prepares this.',
          priority: 'ollvyprovides',
          ollvyProvides: true,
          whatIsIt: 'A document describing your food safety procedures - temperature control, hygiene practices, pest control. Required for FSSAI State License.',
          howToGet: 'Ollvy prepares a standard FSMP template for your kitchen type. No action from you.',
          commonIssues: 'Generic templates get flagged. Ollvy templates are premises-specific.',
        },
        {
          name: 'FSSAI application (Form B)',
          note: 'Ollvy files this.',
          priority: 'ollvyprovides',
          ollvyProvides: true,
          whatIsIt: 'The formal application to the Food Safety and Standards Authority of India for a State License.',
          howToGet: 'Ollvy files this on FoSCoS portal after reviewing all your documents.',
          commonIssues: 'N/A - Ollvy handles.',
        },
        {
          name: 'GST application',
          note: 'Ollvy files this.',
          priority: 'ollvyprovides',
          ollvyProvides: true,
          whatIsIt: 'REG-01 form filed on GST portal for GSTIN issuance.',
          howToGet: 'Ollvy files after documents are received.',
          commonIssues: 'N/A - Ollvy handles.',
        },
      ],
    },
  ],

  faqs: [
    {
      q: "My cloud kitchen is in a residential flat. Can I get FSSAI?",
      a: "Yes. FSSAI registration is based on the premises where food is prepared, not the property's zoning. Thousands of cloud kitchens in India operate from residential addresses. You need the flat's utility bill and a NOC from your society or landlord. Ollvy provides the NOC template - the landlord just needs to sign it.",
    },
    {
      q: "Do I need GST if my cloud kitchen earns under ₹40 lakh per year?",
      a: "Yes, if you're listing on Swiggy or Zomato. These platforms are classified as e-commerce operators under GST law and deduct 0.5% TCS from every payout. To claim that TCS credit back, you must file GST returns - and to file returns, you must be GST registered. There is no turnover threshold exemption for aggregator sellers.",
    },
    {
      q: "Can I start taking orders while waiting for FSSAI?",
      a: "No. Operating without FSSAI is an offence under the Food Safety and Standards Act, 2006. Swiggy and Zomato both require a valid FSSAI number before onboarding. You can use the application acknowledgment number as a reference internally, but formal operations and platform listing require the actual certificate.",
    },
    {
      q: "I have 3 brands - do I need 3 FSSAI licenses?",
      a: "No. FSSAI is premises-based. All brands operating from the same kitchen are covered under one license, as long as their food categories are all listed under the license's Kinds of Business (KoB). You list all brand names on the one certificate. If you open a second kitchen at a different address, that address needs its own license.",
    },
    {
      q: "What if the FSSAI inspection officer has issues?",
      a: "Ollvy sends you a pre-inspection checklist 7 days before the visit covering kitchen layout, cleanliness, labelling, and documentation. If the officer issues an improvement notice, we respond through the FoSCoS portal and schedule re-inspection. This is included in the pack - no additional charge.",
    },
  ],

  unlocks: [
    {
      title: 'List on Swiggy and Zomato',
      detail: 'Both platforms require FSSAI number during onboarding. Submit immediately after certificate is issued.',
    },
    {
      title: 'Hire kitchen staff legally',
      detail: 'Shop & Establishment registration is the prerequisite for all employment in most states.',
    },
    {
      title: 'GST monthly filing',
      detail: 'Once GST is registered, monthly returns are due by the 20th. Missing one means TCS deducted by Swiggy stays stuck.',
      ctaText: 'GST Monthly Filing - ₹2,999/month →',
      ctaHref: '/services/gst-monthly-filing',
    },
    {
      title: 'Trademark your brand',
      detail: 'Competitors can register your cloud kitchen brand name on Swiggy once you scale. File early.',
      ctaText: 'Trademark - ₹14,999 →',
      ctaHref: '/services/trademark-word-mark',
    },
  ],

  seoTitle: 'FSSAI License + GST Registration for Cloud Kitchens India | Ollvy',
  seoDescription: 'Get FSSAI, GST, Shop & Establishment, and Trade License filed simultaneously for your cloud kitchen. Guaranteed FSSAI application in 24 hours. List on Swiggy and Zomato in 30-45 days. ₹33,599 total.',
  canonicalUrl: 'https://www.ollvy.com/packs/cloud-kitchen-setup',
  metaImageUrl: 'https://www.ollvy.com/og/cloud-kitchen-setup.jpg',
  relatedPackSlugs: [],
}

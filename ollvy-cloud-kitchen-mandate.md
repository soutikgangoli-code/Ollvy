# CLAUDE CODE MANDATE
## Build: Cloud Kitchen Setup Pack Page
## `/packs/cloud-kitchen-setup`
## Ollvy · March 2026

---

## READ THIS FIRST

This is the complete build mandate for the Cloud Kitchen Setup pack page. Read every section before writing a single line of code. This page is NOT a service detail page — it is a pack page. Do not copy the `UnifiedServicePage` component and modify it. Build fresh components specific to packs.

The existing codebase has:
- `components/service/UnifiedServicePage.tsx` — service page, DO NOT modify
- `components/service/BookingPanel.tsx` — service booking panel, DO NOT use
- `components/service/ProcessStepper.tsx` — REUSE this component
- `components/service/ServiceRisks.tsx` — REUSE this component
- `components/service/ProfilePersonas.tsx` — REUSE this component
- `components/service/RelatedServices.tsx` — REUSE this component
- `components/landing/DocumentChecklist.tsx` — REUSE this component

New files you will create:
```
app/(main)/packs/[slug]/page.tsx
app/(main)/packs/[slug]/not-found.tsx
components/pack/PackPage.tsx                   ← main client component
components/pack/PackBookingPanel.tsx           ← replaces BookingPanel for packs
components/pack/PackBuilder.tsx                ← the 4-service deselect section
components/pack/TurnoverToggle.tsx             ← turnover question
components/pack/PackPriceSummary.tsx           ← live price with deselect
components/pack/PackAddOns.tsx                 ← optional services below CTA
components/pack/PackRetainerHook.tsx           ← GST filing CTA
components/pack/PackProcessStepper.tsx         ← parallel timeline (NOT same as ProcessStepper)
components/pack/PackWhatsIncluded.tsx          ← per-service checklist blocks
components/pack/PackComparison.tsx             ← Without vs With Ollvy
components/pack/PackSocialProof.tsx            ← stats + reviews + personas
components/pack/PackRisks.tsx                  ← wraps ServiceRisks
components/pack/PackDocuments.tsx              ← wraps DocumentChecklist per service
components/pack/PackFAQs.tsx                   ← accordion
components/pack/PackUnlocks.tsx                ← what this enables
components/pack/PackFinalCTA.tsx               ← bottom CTA
lib/data/packs.ts                              ← data layer
lib/data/packs/cloud-kitchen.ts                ← cloud kitchen pack data
```

---

## DESIGN TOKENS — USE EXACTLY THESE

```tsx
// Colors
--background         → #000 dark / #fff light
--foreground         → near-white dark / black light
--muted-foreground   → medium gray
--border             → 14.9% lightness
--ollvy-green        → hsl(142 71% 35%)

// Typography
font-mono + uppercase + tracking-wider  → ALL section labels, headings, badges, prices
Inter (default sans)                     → all body copy

// Cards
"border border-border rounded-2xl p-6 bg-card"
Hover: "hover:border-foreground/20 hover:bg-foreground/[0.03] transition-all duration-300"

// Buttons — primary
"bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-12 font-medium"
Active: "active:scale-[0.98]"
Hover: darker green

// Buttons — outline
"border border-border rounded-lg h-12 text-muted-foreground"

// Badges
"rounded-full text-xs px-2 py-0.5 uppercase tracking-wider"
Success: "bg-green-500/10 text-green-600 border border-green-500/20"
Urgent:  "border border-red-400/30 text-red-500"
Amber:   "bg-amber-500/10 text-amber-600 border border-amber-500/20"
Neutral: "border border-border text-muted-foreground"

// Container
"max-w-[1200px] mx-auto px-6"

// Transitions
"transition-all duration-300"
```

**RULES:**
- Every price, code, number → `font-mono`
- Every section label → `font-mono uppercase tracking-wider text-xs text-muted-foreground`
- No corny copy. No "You're all set", "Great news", "We've got you covered"
- No heavy shadows. No gradient backgrounds. Flat design only.
- Do not hardcode any price. All prices come from `lib/data/packs/cloud-kitchen.ts`

---

## FILE 1: `lib/data/packs/cloud-kitchen.ts`

Create this file first. Everything else reads from it.

```typescript
export type ServiceInPack = {
  id: string
  name: string
  shortName: string
  price: number               // paisa
  timelineDays: string        // display string e.g. "30–45 working days"
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
      timelineDays: '30–45 working days',
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
      timelineDays: '5–7 working days',
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
      timelineDays: '15–30 working days',
      whyRequired: 'Municipal clearance to operate a food business. Eating House License from police in most states.',
      deelectWarning: 'Delhi: Trade License (MCD) and Eating House License (police) are separate. If you have one but not both, keep this checked — we handle both.',
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
      name: 'Trademark — Word Mark',
      price: 1499900,
      priceDisplay: '₹14,999 + ₹4,500 govt fees',
      note: 'Competitors can copy your brand name on Swiggy once you scale. Registration protects the name before someone else files it.',
    },
  ],

  retainerHook: {
    title: 'GST FILING — MONTHLY',
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
      detail: 'FSSAI, GST, Shop & Estab, Trade License — all simultaneously.',
    },
    {
      day: 'DAY 7',
      title: 'GST Registration live',
      detail: 'GSTIN issued. You can start invoicing.',
    },
    {
      day: 'DAY 15–20',
      title: 'FSSAI inspection',
      detail: 'Officer visits your kitchen. Ollvy prepares your premises checklist.',
    },
    {
      day: 'DAY 30–45',
      title: 'FSSAI certificate issued',
      detail: 'Submit to Swiggy and Zomato. Go live within 3–5 days.',
    },
  ],

  whatsIncluded: [
    {
      serviceShortName: 'FSSAI STATE LICENSE',
      inclusions: [
        { title: 'Application on FoSCoS portal' },
        { title: 'Document preparation and review', detail: 'We check for mismatches before submitting — 90% of rejections are document errors' },
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
        { title: 'Certificate issued within 5–7 working days' },
      ],
    },
    {
      serviceShortName: 'TRADE LICENSE',
      inclusions: [
        { title: 'Application to municipal corporation (Trade License)' },
        { title: 'Application to police (Eating House License — where applicable)' },
        { title: 'Document preparation' },
        { title: 'Follow-up until issued', detail: 'These take 15–30 days — we track and follow up on your behalf' },
      ],
    },
  ],

  comparisonWithout: [
    'Wrong FSSAI license type — Basic when State is needed. Swiggy rejects it on onboarding.',
    'GST registration at wrong address — GSTIN must match your kitchen address.',
    'FSSAI inspection failed — no prep. Dirty kitchen, missing layout, wrong documents.',
    'Missing Eating House License — Delhi requires police clearance separately.',
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
    { value: '4.8', label: 'Average rating · 47 reviews' },
  ],

  keywordChips: ['Quick', 'Transparent', 'Professional', 'No surprises', 'Single contact'],

  reviews: [
    {
      rating: 5,
      date: 'January 2026',
      quote: 'Got my FSSAI in 38 days. Ollvy sent me a checklist before the inspection — passed first time.',
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
      title: 'Residential kitchen — society NOC issue',
      detail: "Our client's society refused to give an NOC. We drafted a legal notice format for the RWA, explained the FSSAI legal position, and resolved it within a week.",
    },
    {
      title: 'Existing restaurant adding a cloud brand',
      detail: 'They already had FSSAI but it did not cover their new food categories. We filed a KoB modification, not a new license — saved them 30 days.',
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
      what: 'Officer visits and finds the kitchen does not match the submitted layout, or hygiene standards are not met. This adds 2–4 weeks while an improvement notice is issued and resolved.',
      mitigation: 'Ollvy sends a pre-inspection checklist 7 days before the visit. We respond to improvement notices through the FoSCoS portal.',
    },
    {
      title: 'GST portal rejection',
      what: 'GST applications are rejected when document names do not match (PAN vs Aadhaar), address is unclear, or bank details are incorrect. Each rejection adds 3–5 days.',
      mitigation: 'Ollvy reviews all documents for consistency before filing. Our rejection rate is under 5%.',
    },
    {
      title: 'Trade License delays in specific cities',
      what: 'Municipal corporations in Delhi, Mumbai, and Bengaluru have different processes and timelines. Some require physical visits. Timeline: 15–30 days — sometimes longer.',
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
          howToGet: 'Scan front and back sides. Ensure the mobile number linked to your Aadhaar is active — OTPs are sent to it during filing. Check at myaadhaar.uidai.gov.in.',
          commonIssues: 'Inactive linked mobile is the most common blocker. If your mobile is not linked, update it at any Aadhaar enrolment centre — takes 7 days.',
        },
        {
          name: 'PAN Card',
          note: 'Of the owner. Name must match Aadhaar exactly.',
          priority: 'required',
          whatIsIt: 'Your 10-digit Permanent Account Number. Required for GST registration, FSSAI application, and all government filings.',
          howToGet: 'Photograph or scan the physical card. Ensure the name matches Aadhaar character for character — including spaces and initials.',
          commonIssues: "Name mismatch between PAN and Aadhaar is the #1 rejection reason. 'Rajesh K Singh' on PAN but 'Rajesh Kumar Singh' on Aadhaar — GST and FSSAI portals reject this.",
        },
        {
          name: 'Kitchen address proof',
          note: 'Electricity / gas / water bill. Not older than 60 days. Must show kitchen address.',
          priority: 'required',
          whatIsIt: 'Proof that you operate from the address declared in the FSSAI application. Must be a utility bill.',
          howToGet: 'Download the latest bill from your electricity or gas provider app or portal. Must show the complete address including PIN code.',
          commonIssues: 'Bill older than 60 days is rejected. Bill in parent or landlord name is generally accepted — Ollvy confirms based on state requirements.',
        },
        {
          name: 'Kitchen layout sketch',
          note: 'Rough hand-drawn diagram is accepted. Photo of sketch is fine.',
          priority: 'required',
          whatIsIt: 'A simple drawing showing the physical layout of your kitchen — entry point, cooking area, storage area, washing area. Used by FSSAI inspection officer.',
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
          whatIsIt: 'The categories of food you will prepare — needed to select the correct Kinds of Business (KoB) on your FSSAI license. A wrong KoB causes aggregator onboarding issues.',
          howToGet: "Just describe it in a WhatsApp message: 'We'll make biryani, grilled chicken, desserts.' Ollvy maps this to the correct FSSAI KoB.",
          commonIssues: 'Adding a new food category after FSSAI is issued requires a KoB modification (₹1,000 fee). Plan broadly — if you might add desserts later, include it now.',
        },
        {
          name: 'Bank cancelled cheque or statement',
          note: 'For GST registration. Account in owner / business name.',
          priority: 'within7days',
          whatIsIt: 'Proof of your bank account — account number and IFSC. Required for GST registration.',
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
          whatIsIt: 'A document describing your food safety procedures — temperature control, hygiene practices, pest control. Required for FSSAI State License.',
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
          commonIssues: 'N/A — Ollvy handles.',
        },
        {
          name: 'GST application',
          note: 'Ollvy files this.',
          priority: 'ollvyprovides',
          ollvyProvides: true,
          whatIsIt: 'REG-01 form filed on GST portal for GSTIN issuance.',
          howToGet: 'Ollvy files after documents are received.',
          commonIssues: 'N/A — Ollvy handles.',
        },
      ],
    },
  ],

  faqs: [
    {
      q: "My cloud kitchen is in a residential flat. Can I get FSSAI?",
      a: "Yes. FSSAI registration is based on the premises where food is prepared, not the property's zoning. Thousands of cloud kitchens in India operate from residential addresses. You need the flat's utility bill and a NOC from your society or landlord. Ollvy provides the NOC template — the landlord just needs to sign it.",
    },
    {
      q: "Do I need GST if my cloud kitchen earns under ₹40 lakh per year?",
      a: "Yes, if you're listing on Swiggy or Zomato. These platforms are classified as e-commerce operators under GST law and deduct 0.5% TCS from every payout. To claim that TCS credit back, you must file GST returns — and to file returns, you must be GST registered. There is no turnover threshold exemption for aggregator sellers.",
    },
    {
      q: "Can I start taking orders while waiting for FSSAI?",
      a: "No. Operating without FSSAI is an offence under the Food Safety and Standards Act, 2006. Swiggy and Zomato both require a valid FSSAI number before onboarding. You can use the application acknowledgment number as a reference internally, but formal operations and platform listing require the actual certificate.",
    },
    {
      q: "I have 3 brands — do I need 3 FSSAI licenses?",
      a: "No. FSSAI is premises-based. All brands operating from the same kitchen are covered under one license, as long as their food categories are all listed under the license's Kinds of Business (KoB). You list all brand names on the one certificate. If you open a second kitchen at a different address, that address needs its own license.",
    },
    {
      q: "What if the FSSAI inspection officer has issues?",
      a: "Ollvy sends you a pre-inspection checklist 7 days before the visit covering kitchen layout, cleanliness, labelling, and documentation. If the officer issues an improvement notice, we respond through the FoSCoS portal and schedule re-inspection. This is included in the pack — no additional charge.",
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
      ctaText: 'GST Monthly Filing — ₹2,999/month →',
      ctaHref: '/services/gst-monthly-filing',
    },
    {
      title: 'Trademark your brand',
      detail: 'Competitors can register your cloud kitchen brand name on Swiggy once you scale. File early.',
      ctaText: 'Trademark — ₹14,999 →',
      ctaHref: '/services/trademark-word-mark',
    },
  ],

  seoTitle: 'FSSAI License + GST Registration for Cloud Kitchens India | Ollvy',
  seoDescription: 'Get FSSAI, GST, Shop & Establishment, and Trade License filed simultaneously for your cloud kitchen. Guaranteed FSSAI application in 24 hours. List on Swiggy and Zomato in 30–45 days. ₹33,599 total.',
  canonicalUrl: 'https://ollvy.com/packs/cloud-kitchen-setup',
  metaImageUrl: 'https://ollvy.com/og/cloud-kitchen-setup.jpg',
  relatedPackSlugs: [],
}
```

---

## FILE 2: `lib/data/packs.ts`

```typescript
import { cloudKitchenPack, CloudKitchenPack } from './packs/cloud-kitchen'

export type { CloudKitchenPack }
export { cloudKitchenPack }

export async function getPackBySlug(slug: string): Promise<CloudKitchenPack | null> {
  const packs: Record<string, CloudKitchenPack> = {
    'cloud-kitchen-setup': cloudKitchenPack,
  }
  return packs[slug] ?? null
}

export async function getAllPackSlugs(): Promise<string[]> {
  return ['cloud-kitchen-setup']
}

// Price helpers — all prices in paisa, never floats
export function formatPaisa(paisa: number): string {
  return `₹${(paisa / 100).toLocaleString('en-IN')}`
}

export function calculatePackTotal(
  services: Array<{ price: number }>,
  selectedIds: string[],
  discountPercent: number,
  serviceIds: string[]
): {
  subtotal: number
  discountAmount: number
  total: number
  savings: number
  applyDiscount: boolean
} {
  const selected = services.filter((_, i) => selectedIds.includes(serviceIds[i]))
  const subtotal = selected.reduce((sum, s) => sum + s.price, 0)
  const applyDiscount = selectedIds.length >= 2
  const discountAmount = applyDiscount ? Math.round(subtotal * (discountPercent / 100)) : 0
  const total = subtotal - discountAmount
  return { subtotal, discountAmount, total, savings: discountAmount, applyDiscount }
}
```

---

## FILE 3: `app/(main)/packs/[slug]/page.tsx`

```tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPackBySlug, getAllPackSlugs } from '@/lib/data/packs'
import { PackPage } from '@/components/pack/PackPage'
import Script from 'next/script'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPackSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const pack = await getPackBySlug(slug)
  if (!pack) return { title: 'Not Found | Ollvy' }
  return {
    title: pack.seoTitle,
    description: pack.seoDescription,
    alternates: { canonical: pack.canonicalUrl },
    openGraph: {
      title: pack.seoTitle,
      description: pack.seoDescription,
      url: pack.canonicalUrl,
      siteName: 'Ollvy',
      type: 'website',
      images: [{ url: pack.metaImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pack.seoTitle,
      description: pack.seoDescription,
      images: [pack.metaImageUrl],
    },
  }
}

export default async function PackDetailPage({ params }: PageProps) {
  const { slug } = await params
  const pack = await getPackBySlug(slug)
  if (!pack) notFound()

  // JSON-LD — three schemas
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pack.name,
    description: pack.seoDescription,
    provider: { '@type': 'Organization', name: 'Ollvy', url: 'https://ollvy.com' },
    areaServed: 'IN',
    offers: {
      '@type': 'Offer',
      price: '33599',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '47',
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pack.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ollvy.com' },
      { '@type': 'ListItem', position: 2, name: 'Packs', item: 'https://ollvy.com/packs' },
      { '@type': 'ListItem', position: 3, name: pack.name, item: pack.canonicalUrl },
    ],
  }

  return (
    <>
      <Script id="pack-service-jsonld" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <Script id="pack-faq-jsonld" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="pack-breadcrumb-jsonld" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PackPage pack={pack} />
    </>
  )
}
```

---

## FILE 4: `components/pack/PackPage.tsx`

This is the main client component. It owns all state.

```tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CloudKitchenPack, formatPaisa, calculatePackTotal } from '@/lib/data/packs'
import { PackStickyTopBar } from './PackStickyTopBar'
import { PackHero } from './PackHero'
import { TurnoverToggle } from './TurnoverToggle'
import { PackBuilder } from './PackBuilder'
import { PackPriceSummary } from './PackPriceSummary'
import { PackAddOns } from './PackAddOns'
import { PackRetainerHook } from './PackRetainerHook'
import { PackProcessStepper } from './PackProcessStepper'
import { PackWhatsIncluded } from './PackWhatsIncluded'
import { PackComparison } from './PackComparison'
import { PackSocialProof } from './PackSocialProof'
import { PackDocuments } from './PackDocuments'
import { PackRisks } from './PackRisks'
import { PackFAQs } from './PackFAQs'
import { PackUnlocks } from './PackUnlocks'
import { PackFinalCTA } from './PackFinalCTA'
import { PackBookingPanel } from './PackBookingPanel'
import { MobileBookingBar } from './MobileBookingBar'

// STATE: selectedServiceIds controls live price. All 4 selected by default.
// fssaiVariant: 'basic' | 'state' — from TurnoverToggle

export function PackPage({ pack }: { pack: CloudKitchenPack }) {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    pack.services.map((s) => s.id)
  )
  const [fssaiVariant, setFssaiVariant] = useState<'basic' | 'state'>('state')
  const [heroVisible, setHeroVisible] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)

  // Compute live prices
  const services = pack.services.map((s) => ({
    ...s,
    // If FSSAI and basic selected, override price to basic (₹8,999 = 899900 paisa)
    price: s.id === 'fssai-state-license' && fssaiVariant === 'basic' ? 899900 : s.price,
  }))

  const priceCalc = calculatePackTotal(
    services,
    selectedServiceIds,
    pack.discountPercent,
    services.map((s) => s.id)
  )

  const toggleService = useCallback((id: string) => {
    setSelectedServiceIds((prev) => {
      const isSelected = prev.includes(id)
      if (isSelected && prev.length <= 2) return prev // enforce minimum 2
      return isSelected ? prev.filter((x) => x !== id) : [...prev, id]
    })
  }, [])

  // Sticky bar: hide when hero CTA is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  const checkoutHref = `/checkout/pack/${pack.slug}?services=${selectedServiceIds.join(',')}&fssai=${fssaiVariant}`

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">

      {/* STICKY TOP BAR — hidden until hero scrolls out */}
      <PackStickyTopBar
        visible={!heroVisible}
        packName={pack.name}
        total={priceCalc.total}
        checkoutHref={checkoutHref}
      />

      {/* HERO */}
      <div ref={heroRef}>
        <PackHero
          pack={pack}
          total={priceCalc.total}
          checkoutHref={checkoutHref}
        />
      </div>

      {/* MAIN CONTENT + SIDEBAR */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">

          {/* LEFT COLUMN */}
          <div className="min-w-0 space-y-24">

            {/* Turnover toggle */}
            <TurnoverToggle
              value={fssaiVariant}
              onChange={setFssaiVariant}
            />

            {/* Pack builder */}
            <section id="pack-builder">
              <PackBuilder
                services={services}
                selectedIds={selectedServiceIds}
                onToggle={toggleService}
              />
            </section>

            {/* Price summary + CTA */}
            <PackPriceSummary
              services={services}
              selectedIds={selectedServiceIds}
              priceCalc={priceCalc}
              discountPercent={pack.discountPercent}
              checkoutHref={checkoutHref}
            />

            {/* Add-ons */}
            <section id="add-ons">
              <PackAddOns addOns={pack.addOns} />
            </section>

            {/* GST Retainer Hook */}
            <PackRetainerHook hook={pack.retainerHook} />

            {/* Process stepper */}
            <section id="timeline">
              <PackProcessStepper steps={pack.processSteps} />
            </section>

            {/* What's included */}
            <section id="included">
              <PackWhatsIncluded groups={pack.whatsIncluded} />
            </section>

            {/* Comparison */}
            <section id="why-ollvy">
              <PackComparison
                without={pack.comparisonWithout}
                with_={pack.comparisonWith}
              />
            </section>

            {/* Social proof */}
            <section id="reviews">
              <PackSocialProof
                stats={pack.stats}
                keywordChips={pack.keywordChips}
                reviews={pack.reviews}
                personas={pack.personas}
              />
            </section>

            {/* Documents */}
            <section id="documents">
              <PackDocuments groups={pack.documentGroups} />
            </section>

            {/* Risks */}
            <section id="risks">
              <PackRisks risks={pack.risks} />
            </section>

            {/* FAQs */}
            <section id="faqs">
              <PackFAQs faqs={pack.faqs} />
            </section>

            {/* Unlocks */}
            <PackUnlocks unlocks={pack.unlocks} />

            {/* Final CTA */}
            <PackFinalCTA
              total={priceCalc.total}
              checkoutHref={checkoutHref}
              guaranteeText={pack.guaranteeText}
            />

          </div>

          {/* RIGHT SIDEBAR — desktop only, sticky */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <PackBookingPanel
                services={services}
                selectedIds={selectedServiceIds}
                priceCalc={priceCalc}
                discountPercent={pack.discountPercent}
                guaranteeText={pack.guaranteeText}
                checkoutHref={checkoutHref}
              />
            </div>
          </aside>

        </div>
      </div>

      {/* MOBILE BOTTOM BAR — hidden on desktop */}
      <MobileBookingBar
        total={priceCalc.total}
        checkoutHref={checkoutHref}
        discountPercent={pack.discountPercent}
        originalTotal={priceCalc.subtotal}
      />

    </div>
  )
}
```

---

## FILE 5: `components/pack/PackStickyTopBar.tsx`

```tsx
'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatPaisa } from '@/lib/data/packs'

export function PackStickyTopBar({
  visible, packName, total, checkoutHref
}: {
  visible: boolean
  packName: string
  total: number
  checkoutHref: string
}) {
  return (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border',
      'transition-all duration-300',
      visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
    )}>
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between gap-6">

        {/* Left */}
        <div className="flex items-center gap-4">
          <Link href="/" className="font-mono text-sm font-bold text-foreground tracking-tight">
            Ollvy
          </Link>
          <span className="text-border">|</span>
          <span className="font-mono uppercase tracking-wider text-sm text-foreground">
            {packName}
          </span>
        </div>

        {/* Center tabs — hidden mobile */}
        <nav className="hidden md:flex items-center gap-6">
          {['pack-builder', 'timeline', 'included', 'documents', 'faqs'].map((id) => (
            <button
              key={id}
              onClick={() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors capitalize"
            >
              {id.replace('-', ' ')}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-semibold text-foreground hidden sm:block">
            {formatPaisa(total)}
          </span>
          <a
            href={checkoutHref}
            className="bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-9 px-4 text-xs font-medium flex items-center active:scale-[0.98] transition-all"
          >
            Book Now
          </a>
        </div>

      </div>
    </div>
  )
}
```

---

## FILE 6: `components/pack/PackHero.tsx`

```tsx
import { CheckCircle, Shield, Clock, Users, Tag, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { formatPaisa, CloudKitchenPack } from '@/lib/data/packs'

export function PackHero({
  pack, total, checkoutHref
}: {
  pack: CloudKitchenPack
  total: number
  checkoutHref: string
}) {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pt-16 pb-0">
      <div className="grid lg:grid-cols-[1fr_auto] gap-20 items-start">

        {/* LEFT */}
        <div className="pb-16">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/packs" className="hover:text-foreground transition-colors">Packs</Link>
            <ChevronRight size={12} />
            <span className="text-foreground">{pack.name}</span>
          </div>

          {/* H1 */}
          <h1 className="font-mono uppercase tracking-wider text-4xl md:text-5xl lg:text-[3.5rem] text-foreground leading-none whitespace-pre-line">
            {pack.h1}
          </h1>

          {/* Tagline */}
          <p className="text-base text-muted-foreground mt-6 max-w-xl leading-relaxed">
            {pack.tagline}
          </p>

          {/* Guarantee badge */}
          <div className="mt-6 inline-flex items-center gap-2 border border-green-500/30 bg-green-500/5 rounded-full px-4 py-2">
            <CheckCircle size={14} className="text-green-600 shrink-0" />
            <span className="text-xs text-green-600">{pack.guaranteeText}</span>
          </div>

          {/* Metadata pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              'Cloud kitchens · home bakers · dark kitchens',
              '4 services · filed simultaneously',
              'Live on Swiggy in 30–45 days',
            ].map((text) => (
              <span key={text} className="border border-border rounded-full px-4 py-2 text-xs text-muted-foreground">
                {text}
              </span>
            ))}
            <span className="border border-border rounded-full px-4 py-2 text-xs text-muted-foreground flex items-center gap-1.5">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              4.8 · 47 reviews
            </span>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-8 pt-6 border-t border-border">
            {[
              { icon: Shield, text: 'Verified CAs and agents' },
              { icon: Clock, text: 'SLA-guaranteed timelines' },
              { icon: Users, text: '2,400+ FSSAI filings' },
              { icon: Tag, text: 'Fixed pricing — no hidden fees' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Icon size={12} />
                {text}
              </span>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 lg:hidden">
            <a
              href={checkoutHref}
              className="bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-12 w-full font-medium text-sm flex items-center justify-center active:scale-[0.98] transition-all"
            >
              Book Cloud Kitchen Setup — {formatPaisa(total)} →
            </a>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Cancel within 2 hours for full refund
            </p>
          </div>

        </div>

        {/* RIGHT — booking panel placeholder (filled by PackBookingPanel via parent) */}
        {/* Note: PackBookingPanel is rendered in PackPage.tsx as part of the sidebar grid */}

      </div>
    </section>
  )
}
```

---

## FILE 7: `components/pack/TurnoverToggle.tsx`

```tsx
'use client'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TurnoverToggle({
  value,
  onChange,
}: {
  value: 'basic' | 'state'
  onChange: (v: 'basic' | 'state') => void
}) {
  return (
    <div className="border border-amber-500/20 bg-amber-500/5 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-mono uppercase tracking-wider text-xs text-amber-600">
            ONE QUESTION BEFORE YOU BOOK
          </p>
          <p className="text-sm font-medium text-foreground mt-2">
            What is your expected annual revenue from the cloud kitchen?
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            This determines whether you need FSSAI Basic Registration or FSSAI State License. Both include the same Ollvy service.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {([
              {
                v: 'basic' as const,
                label: 'UNDER ₹12 LAKH / YEAR',
                sub: 'FSSAI Basic Registration',
                govtFee: 'Govt fee: ₹100/yr',
              },
              {
                v: 'state' as const,
                label: '₹12 LAKH – ₹20 CRORE / YEAR',
                sub: 'FSSAI State License',
                govtFee: 'Govt fee: ₹2,000/yr',
              },
            ] as const).map(({ v, label, sub, govtFee }) => (
              <button
                key={v}
                onClick={() => onChange(v)}
                className={cn(
                  'border rounded-2xl p-4 text-left transition-all duration-200',
                  value === v
                    ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
                    : 'border-border bg-transparent hover:border-foreground/20'
                )}
              >
                <p className={cn(
                  'font-mono uppercase tracking-wider text-xs',
                  value === v ? 'text-[hsl(var(--ollvy-green))]' : 'text-muted-foreground'
                )}>
                  {label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                <p className="text-xs font-mono text-foreground mt-2">{govtFee}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## FILE 8: `components/pack/PackBuilder.tsx`

```tsx
'use client'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPaisa } from '@/lib/data/packs'
import type { ServiceInPack } from '@/lib/data/packs/cloud-kitchen'

// Priority dot colors per status
const PRIORITY_DOT = 'w-2 h-2 rounded-full shrink-0 mt-1'

export function PackBuilder({
  services,
  selectedIds,
  onToggle,
}: {
  services: ServiceInPack[]
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div>
      <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
        WHAT'S IN YOUR PACK
      </p>
      <h2 className="font-mono uppercase tracking-wider text-2xl text-foreground">
        4 LICENSES · ALL REQUIRED
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        Uncheck anything you've already done. Price updates.
      </p>

      <div className="space-y-4 mt-8">
        {services.map((service) => {
          const isSelected = selectedIds.includes(service.id)
          const isLastSelected = selectedIds.length === 2 && isSelected

          return (
            <div
              key={service.id}
              className={cn(
                'border rounded-2xl p-6 transition-all duration-300',
                isSelected
                  ? 'border-border hover:border-foreground/20 hover:bg-foreground/[0.03]'
                  : 'border-border opacity-60'
              )}
            >
              {/* Row 1: checkbox + name + price */}
              <div className="flex items-start gap-4">
                <button
                  onClick={() => !isLastSelected && onToggle(service.id)}
                  disabled={isLastSelected}
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200',
                    isSelected
                      ? 'bg-[hsl(var(--ollvy-green))] border-[hsl(var(--ollvy-green))]'
                      : 'bg-transparent border-border',
                    isLastSelected && 'cursor-not-allowed opacity-60'
                  )}
                  aria-label={isSelected ? `Deselect ${service.name}` : `Select ${service.name}`}
                >
                  {isSelected && <Check size={12} className="text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-base font-medium text-foreground">
                      {service.name}
                    </span>
                    {service.badge && (
                      <span className="rounded-full text-xs px-2 py-0.5 uppercase tracking-wider border border-border text-muted-foreground">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Why required + timeline */}
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {service.whyRequired}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-full px-3 py-1 mt-2">
                    {service.timelineDays}
                  </span>
                </div>

                <span className="font-mono text-base font-semibold text-foreground shrink-0">
                  {formatPaisa(service.price)}
                </span>
              </div>

              {/* Deselect warning — only when unchecked */}
              {!isSelected && (
                <div className="mt-3 ml-9 border border-amber-500/20 bg-amber-500/5 rounded-xl px-4 py-3">
                  <p className="text-xs text-amber-600 leading-relaxed">
                    {service.deelectWarning}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Min services warning */}
      {selectedIds.length < 2 && (
        <div className="mt-4 border border-amber-500/20 bg-amber-500/5 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-600">
            Pack discount applies when 2 or more services are selected. Book individual services from the services page.
          </p>
        </div>
      )}
    </div>
  )
}
```

---

## FILE 9: `components/pack/PackPriceSummary.tsx`

```tsx
'use client'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPaisa } from '@/lib/data/packs'
import type { ServiceInPack } from '@/lib/data/packs/cloud-kitchen'

export function PackPriceSummary({
  services,
  selectedIds,
  priceCalc,
  discountPercent,
  checkoutHref,
}: {
  services: ServiceInPack[]
  selectedIds: string[]
  priceCalc: { subtotal: number; discountAmount: number; total: number; applyDiscount: boolean }
  discountPercent: number
  checkoutHref: string
}) {
  const selectedServices = services.filter((s) => selectedIds.includes(s.id))

  return (
    <div className="border border-border rounded-2xl p-6">

      {/* Line items */}
      <div className="space-y-3">
        {selectedServices.map((s) => (
          <div key={s.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Check size={14} className="text-green-600 shrink-0" />
              <span className="text-foreground">{s.name}</span>
            </div>
            <span className="font-mono text-foreground">{formatPaisa(s.price)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border my-4" />

      {/* Discount row */}
      {priceCalc.applyDiscount && (
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full text-xs px-2 py-0.5 uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-500/20">
              {discountPercent}% OFF
            </span>
            <span className="text-muted-foreground">Pack discount</span>
          </div>
          <span className="font-mono text-green-600">-{formatPaisa(priceCalc.discountAmount)}</span>
        </div>
      )}

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-foreground">Total (incl. GST)</span>
        <span className="font-mono text-2xl font-bold text-foreground">
          {formatPaisa(priceCalc.total)}
        </span>
      </div>

      {/* CTA */}
      <a
        href={checkoutHref}
        className="mt-6 w-full bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-12 font-medium text-sm flex items-center justify-center active:scale-[0.98] transition-all"
      >
        Book Cloud Kitchen Setup →
      </a>

      {/* Sub-notes */}
      <div className="flex items-center justify-center gap-6 flex-wrap mt-3">
        {[
          'Cancel within 2 hours · full refund',
          'GST invoice issued',
          'Work starts same day',
        ].map((text) => (
          <span key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Check size={12} className="text-green-600 shrink-0" />
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
```

---

## FILE 10: `components/pack/PackBookingPanel.tsx`

Sidebar version. Mirrors price summary but as a sticky panel with WhatsApp/Call.

```tsx
'use client'
import { Check, CheckCircle, MessageCircle, Phone } from 'lucide-react'
import { formatPaisa } from '@/lib/data/packs'
import type { ServiceInPack } from '@/lib/data/packs/cloud-kitchen'
import { addDays, format } from 'date-fns'

// Guaranteed date: today + 1 working day
function getGuaranteeDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return format(d, 'd MMM yyyy')
}

export function PackBookingPanel({
  services, selectedIds, priceCalc, discountPercent, guaranteeText, checkoutHref
}: {
  services: ServiceInPack[]
  selectedIds: string[]
  priceCalc: { subtotal: number; discountAmount: number; total: number; applyDiscount: boolean }
  discountPercent: number
  guaranteeText: string
  checkoutHref: string
}) {
  const selectedServices = services.filter((s) => selectedIds.includes(s.id))

  return (
    <div className="border border-border rounded-2xl overflow-hidden">

      {/* Guarantee header */}
      <div className="bg-foreground/[0.03] border-b border-border px-6 py-4 flex items-center justify-between">
        <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground">
          GUARANTEED BY
        </p>
        <div className="flex items-center gap-2">
          <CheckCircle size={14} className="text-green-600 shrink-0" />
          <span className="font-mono text-sm font-semibold text-foreground">
            {getGuaranteeDate()}
          </span>
        </div>
      </div>

      {/* Price block */}
      <div className="px-6 py-5">
        <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-3">
          TOTAL PRICE
        </p>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-3xl font-bold text-foreground">
            {formatPaisa(priceCalc.total)}
          </span>
          {priceCalc.applyDiscount && (
            <span className="rounded-full text-xs px-2 py-0.5 uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-500/20">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Fee breakdown */}
        <div className="mt-4 space-y-2">
          {selectedServices.map((s) => (
            <div key={s.id} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{s.shortName}</span>
              <span className="font-mono text-foreground">{formatPaisa(s.price)}</span>
            </div>
          ))}
          {priceCalc.applyDiscount && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Pack discount ({discountPercent}%)</span>
              <span className="font-mono text-green-600">-{formatPaisa(priceCalc.discountAmount)}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Subtotal (excl. GST)</span>
            <span className="font-mono font-semibold text-foreground">
              {formatPaisa(priceCalc.total)}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2">GST-compliant invoice issued after payment</p>
      </div>

      {/* CTA */}
      <div className="px-6 pb-4">
        <a
          href={checkoutHref}
          className="w-full bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-12 font-medium text-sm flex items-center justify-center active:scale-[0.98] transition-all"
        >
          Book Now →
        </a>
        <div className="flex gap-3 mt-3">
          <a
            href="https://wa.me/919999999999?text=Hi, I have a question about the Cloud Kitchen Setup pack"
            target="_blank"
            className="flex-1 border border-border rounded-lg h-10 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:border-foreground/20 transition-all"
          >
            <MessageCircle size={14} className="text-green-600" />
            WhatsApp
          </a>
          <a
            href="tel:+919999999999"
            className="flex-1 border border-border rounded-lg h-10 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:border-foreground/20 transition-all"
          >
            <Phone size={14} />
            Call us
          </a>
        </div>
      </div>

      {/* Trust bullets */}
      <div className="px-6 pb-6 pt-4 border-t border-border space-y-2">
        {[
          'GST-compliant invoice issued after payment',
          'Engagement letter before work starts',
          'Cancel within 2 hours for full refund',
          'One professional assigned, direct WhatsApp access',
        ].map((line) => (
          <p key={line} className="flex items-start gap-2 text-xs text-muted-foreground">
            <Check size={12} className="text-green-600 shrink-0 mt-0.5" />
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}
```

---

## FILE 11: `components/pack/PackProcessStepper.tsx`

This is NOT the same as ProcessStepper.tsx (which is interactive/animated). This is a static parallel timeline.

```tsx
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'

type Step = {
  day: string
  title: string
  detail: string
  isActive?: boolean
}

export function PackProcessStepper({ steps }: { steps: Step[] }) {
  return (
    <div>
      <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
        HOW IT WORKS
      </p>
      <h2 className="font-mono uppercase tracking-wider text-2xl text-foreground">
        ALL 4 SERVICES FILED SIMULTANEOUSLY
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        You are not waiting for one to finish before the next starts.
      </p>

      {/* Timeline */}
      <div className="mt-12">

        {/* Desktop: horizontal */}
        <div className="hidden md:flex items-start gap-0">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-center text-center relative">
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="absolute top-4 left-1/2 right-0 h-px bg-border" />
              )}
              {/* Node */}
              <div className={cn(
                'w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 bg-background',
                step.isActive
                  ? 'border-[hsl(var(--ollvy-green))] ring-4 ring-[hsl(var(--ollvy-green))]/20'
                  : 'border-border'
              )}>
                <span className={cn(
                  'font-mono text-xs',
                  step.isActive ? 'text-[hsl(var(--ollvy-green))]' : 'text-muted-foreground'
                )}>
                  {i + 1}
                </span>
              </div>
              {/* Content */}
              <div className="mt-4 px-2">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  {step.day}
                </p>
                <p className="text-sm font-medium text-foreground mt-1">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-[140px] mx-auto">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4 relative pb-8 last:pb-0">
              {/* Vertical line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
              )}
              {/* Node */}
              <div className={cn(
                'w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 bg-background z-10',
                step.isActive
                  ? 'border-[hsl(var(--ollvy-green))]'
                  : 'border-border'
              )}>
                <span className={cn(
                  'font-mono text-xs',
                  step.isActive ? 'text-[hsl(var(--ollvy-green))]' : 'text-muted-foreground'
                )}>
                  {i + 1}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1 pb-2">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  {step.day}
                </p>
                <p className="text-sm font-medium text-foreground mt-0.5">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="mt-8 border border-border rounded-2xl px-6 py-4 flex items-start gap-3">
        <Info size={16} className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          FSSAI State License is the longest process (30–45 days) because it requires a physical inspection. The other 3 services complete within the first 7–30 days. Your Swiggy listing date is determined by FSSAI — everything else is ready before that.
        </p>
      </div>
    </div>
  )
}
```

---

## REMAINING COMPONENTS — Spec Only (Build to Spec)

For these components, the structure is clear from the data shape and design system. Build them clean.

### `components/pack/PackAddOns.tsx`
- Section header: "OPTIONAL SERVICES" / "ADD TO YOUR PACK"
- 3 cards in `grid md:grid-cols-3 gap-5`
- Each card: `border border-border rounded-2xl p-6 flex flex-col`
- Service name, optional badge (neutral), 1-line note (text-muted-foreground), price (font-mono), "Add →" outline button
- No pre-selection. No price update logic. Each Add button routes to individual service checkout.

### `components/pack/PackRetainerHook.tsx`
- Full-width section, NOT a card grid
- `border border-border rounded-2xl p-6 md:p-8 grid md:grid-cols-[1fr_auto] gap-8 items-center`
- Left: label "AFTER YOUR SETUP", H2 "GST FILING — MONTHLY", body text, 3 feature bullets with green check icons
- Right: price `₹2,999 / month`, CTA button (green), note "LUT renewal included" (not relevant for cloud kitchen — omit)

### `components/pack/PackWhatsIncluded.tsx`
- Section header: "WHAT YOU GET" / "EVERYTHING. NO HIDDEN WORK."
- 4 service blocks in `grid md:grid-cols-2 gap-5`
- Each block: service name as label, inclusion rows with green check icon + title + optional detail sub-text

### `components/pack/PackComparison.tsx`
- Section header: "WHY OLLVY" / "WE FILE CORRECTLY. NOT JUST ON TIME."
- 2-column grid
- Without Ollvy: `border border-border rounded-2xl p-6 opacity-60` — each item `X` icon text-red-500
- With Ollvy: `border border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 rounded-2xl p-6` — each item check icon text-green-600
- Both columns render their string arrays from `pack.comparisonWithout` and `pack.comparisonWith`

### `components/pack/PackSocialProof.tsx`
- Stats: `grid grid-cols-3 gap-5` — each `border border-border rounded-2xl p-6 text-center` — `font-mono text-3xl font-bold` value, `text-xs text-muted-foreground uppercase tracking-wider` label
- Keyword chips: `flex flex-wrap gap-2` — each `border border-border rounded-full px-4 py-2 text-xs text-muted-foreground`
- Review cards: `grid md:grid-cols-3 gap-5` — star row (yellow-400), quote text, reviewer name + city + "VERIFIED" badge (green)
- Personas: `grid md:grid-cols-2 gap-5` — each card: initial avatar circle (bg-muted, font-mono), title + detail

### `components/pack/PackDocuments.tsx`
- Section header: "DOCUMENTS" / "WHAT YOU NEED TO PROVIDE"
- Sub: "8 documents from you. The rest Ollvy prepares."
- Accordion list using Shadcn `Accordion, AccordionItem, AccordionTrigger, AccordionContent`
- Collapsed: priority dot + document name + note + optional "OLLVY PROVIDES" badge (green)
- Expanded: 3-column grid `grid md:grid-cols-3 gap-6` with labels "WHAT IS IT" / "HOW TO GET IT" / "COMMON ISSUES"
- Priority dot colors: required → `bg-red-500`, within7days → `bg-amber-500`, ollvyprovides → `bg-green-500`

### `components/pack/PackRisks.tsx`
- Thin wrapper around data — render using same layout as `ServiceRisks.tsx`
- Section header: "RISKS" / "WHAT CAN GO WRONG"
- Sub: "Honest disclosure. These are the real reasons FSSAI applications get delayed."
- Each risk: amber icon, title, `what` text in text-muted-foreground, `mitigation` text in text-[hsl(var(--ollvy-green))]

### `components/pack/PackFAQs.tsx`
- Section header: "FAQS" / "COMMON QUESTIONS"
- Shadcn `Accordion type="multiple"` — `space-y-0 max-w-3xl`
- Each item: `border-b border-border last:border-0`
- Question: `text-sm font-medium text-foreground text-left py-4`
- Answer: `text-sm text-muted-foreground leading-relaxed pb-5`

### `components/pack/PackUnlocks.tsx`
- Section header: "WHAT THIS UNLOCKS" / "AFTER YOUR SETUP"
- `grid md:grid-cols-2 gap-5`
- Each card: `border border-border rounded-2xl p-6 flex items-start gap-4`
- Arrow icon (green), title + detail, optional CTA link in text-[hsl(var(--ollvy-green))]

### `components/pack/PackFinalCTA.tsx`
- Full-width bottom section, `bg-card border-t border-border py-24`
- Centered: section label "GET STARTED", pack name, price in `font-mono text-3xl font-bold`
- Guarantee display: `inline-flex items-center gap-3 border border-green-500/30 bg-green-500/5 rounded-2xl px-8 py-4`
- Two buttons: Book Now (green) + Ask a question (WhatsApp link, outline)
- Trust micro-row: 4 items with green check icons

### `components/pack/MobileBookingBar.tsx`
- `fixed bottom-0 left-0 right-0 z-50 lg:hidden`
- `border-t border-border bg-background/95 backdrop-blur-sm px-6 py-4`
- Left: price (font-mono bold) + savings badge (green) + "vs ₹X separately" (muted)
- Right: Book Now CTA (green, h-11)

---

## CHECKOUT ROUTE NOTE

The pack checkout links to `/checkout/pack/[slug]?services=[ids]&fssai=[basic|state]`.

This route does NOT exist yet. Do not build it in this task. The "Book Now" button should link to the URL. If the route 404s during development, that is expected.

---

## COPY RULES — ENFORCED

**NEVER USE:**
- "You're all set"
- "Great news"
- "We've got you covered"
- "Hassle-free"
- "Seamless"
- "Streamlined"
- "Peace of mind"
- "Don't worry"
- "Easy as 1-2-3"
- Any sentence ending in "!"

**ALWAYS USE:**
- Functional, direct statements
- Specific numbers and dates
- Exact form names (GSTR-3B, FoSCoS, Form B)
- Consequences of not acting ("TCS stays stuck", "DIN gets deactivated")

---

## TESTING CHECKLIST

Before marking complete:

```
□ Pack page loads at /packs/cloud-kitchen-setup
□ All 4 services are pre-selected on load
□ Unchecking a service updates price in PackPriceSummary AND PackBookingPanel simultaneously
□ Minimum 2 services enforced — cannot deselect below 2
□ Deselect warning banner appears for each unchecked service
□ TurnoverToggle changes FSSAI price: Basic = ₹8,999, State = ₹18,999
□ TurnoverToggle change updates price in summary AND sidebar
□ Sticky top bar hidden on load, visible after scrolling past hero
□ Mobile bottom bar hidden on lg: screens
□ BookingPanel visible only on lg: screens
□ All prices render in font-mono
□ All section labels render in font-mono uppercase tracking-wider
□ FAQ accordion opens and closes correctly
□ Document accordion opens and closes correctly, shows 3-column expanded content
□ No console errors
□ No hydration mismatch warnings
□ /packs/cloud-kitchen-setup has correct meta title and description
□ 3 JSON-LD scripts in <head>: Service, FAQPage, BreadcrumbList
□ Canonical tag points to https://ollvy.com/packs/cloud-kitchen-setup
□ "Book Now" links contain correct checkoutHref with services and fssai params
```

---

*End of Mandate*
*Ollvy · Cloud Kitchen Setup Pack · ollvy.com/packs/cloud-kitchen-setup*

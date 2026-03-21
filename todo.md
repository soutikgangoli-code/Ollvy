# OLLVY — DATA SEEDING PROMPT: 5 NEW SERVICES

This is a DATA-ONLY prompt. Seed content into existing tables using the exact same patterns already in the codebase. Create TypeScript static config files for 4 missing services. One migration file for DB. Zero UI changes beyond the one line specified.

---

## RULES

1. Use `CROSS JOIN (VALUES ...) AS t(...)` pattern for bulk document inserts
2. Use `ON CONFLICT (service_package_id, document_key) DO NOTHING` on all work document inserts
3. All prices in paisa (multiply ₹ by 100)
4. `is_active = false` for all 5 services in DB
5. Run `SELECT MAX(display_order) FROM service_packages` first — use MAX+1 through MAX+5 for the 5 services in order listed
6. Do not touch any existing records
7. Single migration file: `20260321200001_seed_five_new_services.sql`
8. TypeScript files go in `/apps/customer/lib/services/` — follow the exact same pattern as `gst-registration.ts` and `pvt-ltd-incorporation.ts`

---

## PART A — TYPESCRIPT STATIC CONFIG FILES

Create these 4 files. Add all 4 (plus `tds-monthly-compliance` which already exists) to the `SERVICES` array in `/apps/customer/lib/services.ts`.

---

### FILE 1: `/apps/customer/lib/services/gst-cancellation.ts`

```typescript
import { ServiceConfig } from '../services'

export const gstCancellation: ServiceConfig = {
  slug: 'gst-cancellation',
  name: 'GST Cancellation',
  shortName: 'GST Cancel',
  category: 'Tax Registration',
  tagline: 'Close your GST registration cleanly. Pending returns filed. Certificate surrendered.',

  ollvyFee: 1999,
  govtFee: undefined,

  slaDays: 15,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Businesses closing down, falling below threshold, or restructuring',
  legalBasis: 'CGST Act 2017, Section 29',
  penaltyForMissing: 'Continued filing obligations even after stopping business',
  penaltyColor: 'amber',

  seoTitle: 'GST Cancellation Online India | Surrender GSTIN | ₹1,999 | Ollvy',
  seoDescription:
    'Cancel your GST registration online. All pending returns filed. GSTIN surrendered cleanly. Fixed price ₹1,999. CA assigned same day.',
  canonicalUrl: 'https://ollvy.com/services/gst-cancellation',

  processSteps: [
    {
      step: 1,
      title: 'Answer 4 questions - CA identifies every pending return',
      timeline: 'Day 0',
      body: 'Reason for cancellation, effective date, last filed return period, and stock held at time of cancellation. A CA is assigned within 4 hours. They pull your complete filing history from the GST portal and identify every unfiled period before doing anything else. You cannot cancel GST registration with unfiled returns — we find them all upfront.',
      visual: 'checklist',
      milestone: 'CA assigned, pending returns identified',
    },
    {
      step: 2,
      title: 'Pending returns filed — all of them',
      timeline: 'Day 1-7',
      body: 'Your CA files every unfiled GSTR-1, GSTR-3B, or annual return before submitting the cancellation application. The GST portal will reject REG-16 if any period is outstanding — there is no shortcut. If you have multiple pending periods, your CA works through them in sequence. This is within scope — not an extra charge.',
      visual: 'form',
      milestone: 'All pending GST returns filed',
    },
    {
      step: 3,
      title: 'Cancellation application filed (REG-16)',
      timeline: 'Day 7-10',
      body: 'With all returns clear, your CA files Form GST REG-16 on the portal. An ARN is generated immediately. The GST officer has 30 days by law to process it — most cases are cleared within 15 working days. We track it daily.',
      visual: 'form',
      milestone: 'REG-16 submitted, ARN generated',
    },
    {
      step: 4,
      title: 'Officer query handled if raised',
      timeline: 'Day 10-15 (if applicable)',
      body: 'GST officers sometimes request clarification on the reason for cancellation or ask for additional documents. Your CA responds within 24 hours. Common queries: ITC reversal calculation, stock valuation, address proof. All handled within scope.',
      visual: 'form',
    },
    {
      step: 5,
      title: 'Cancellation order issued + GSTR-10 filed',
      timeline: 'Day 15',
      body: 'The officer issues Form GST REG-19 confirming your GSTIN is cancelled from the effective date. Your CA also files GSTR-10 — the mandatory final return that must be filed within 3 months of cancellation. Missing GSTR-10 attracts ₹200/day penalty. We file it before we close the order.',
      visual: 'stamp',
      isCompletion: true,
      milestone: 'GSTIN cancelled, REG-19 and GSTR-10 delivered',
    },
  ],

  whatsIncluded: [
    {
      title: 'Pending returns identified and filed — within scope',
      body: 'Before filing cancellation, your CA checks every period going back to your registration date. Unfiled returns are filed in sequence. This is included — not a separate charge. The number of pending periods affects the timeline but not the price.',
      comparisonWithout: 'File REG-16 without clearing returns → portal rejects it → back to square one',
      comparisonWithOllvy: 'CA clears all pending returns first → REG-16 accepted first time',
    },
    {
      title: 'GSTR-10 final return filed',
      body: 'Every cancelled GST registrant must file GSTR-10 within 3 months of cancellation. Missing it attracts ₹200/day penalty. Your CA files GSTR-10 as part of this service — you do not have to track another deadline.',
    },
    {
      title: 'ITC reversal calculated and handled',
      body: 'If you hold stock at the time of cancellation, you must reverse the Input Tax Credit claimed on it. Your CA calculates the exact reversal amount, includes it in the final return, and advises on payment. This is a tax liability you cannot avoid — but it must be calculated correctly.',
    },
    {
      title: 'REG-19 cancellation order delivered to your account',
      body: 'The official cancellation order is uploaded to your Ollvy account permanently. Keep it. Banks, vendors, and future registrations will ask for proof that your GSTIN was properly surrendered.',
    },
  ],

  serviceRisks: [
    {
      icon: 'alert',
      title: 'Pending returns will block your cancellation',
      body: 'The single most common reason cancellations fail or get delayed. The GST portal checks filing history automatically when you submit REG-16. One unfiled month = rejection. Your CA clears everything first.',
    },
    {
      icon: 'clock',
      title: 'GSTR-10 attracts ₹200/day if missed',
      body: 'After cancellation, most businesses forget about GSTR-10. It is due within 3 months of the cancellation order. Late filing: ₹200/day. Your CA files it before closing the order.',
    },
    {
      icon: 'document',
      title: 'ITC on stock must be reversed',
      body: 'Any Input Tax Credit on goods held on the cancellation date must be paid back. No exception. Your CA calculates the exact amount from your questionnaire answers and handles the reversal in the final return.',
    },
  ],

  profilePersonas: [
    {
      label: 'Business is closing',
      detail: 'Shutting down completely. We cancel GST, file all pending returns, and deliver clean closure documents.',
    },
    {
      label: 'Turnover fell below threshold',
      detail: 'No longer required to be registered. We close the registration cleanly with no loose ends.',
    },
    {
      label: 'Restructuring to a new entity',
      detail: 'Closing old GST registration before opening a fresh one under the new structure.',
    },
    {
      label: 'Voluntary registration no longer needed',
      detail: 'Registered voluntarily but the business no longer needs to issue GST invoices.',
    },
  ],

  reviewKeywordChips: [
    '✓ Clean cancellation',
    '✓ Pending returns handled',
    '✓ Fast closure',
    '✓ No hidden charges',
    '✓ GSTR-10 filed',
  ],

  relatedSlugs: ['gst-registration', 'gst-revocation', 'business-itr'],

  faqs: [
    {
      category: 'General',
      q: 'Can I cancel GST registration myself?',
      a: "Yes — but you must clear all pending returns first, and GSTR-10 must be filed within 3 months of cancellation. Missing either step creates penalties that exceed the cost of this service. We handle both.",
    },
    {
      category: 'General',
      q: 'How long does GST cancellation take?',
      a: 'The officer has 30 days by law to process REG-16. In practice, most cases are cleared in 10-15 working days. Pending returns add time at the front of the process — the more periods outstanding, the longer it takes.',
    },
    {
      category: 'Process',
      q: 'What is GSTR-10 and why is it mandatory?',
      a: 'GSTR-10 is the final return that every GST registrant must file within 3 months of the cancellation order. It declares your final stock, ITC reversal, and outstanding tax. Late filing attracts ₹200/day. Your CA files it as part of this service.',
    },
    {
      category: 'Process',
      q: 'What if I have 12+ months of pending returns?',
      a: 'Your CA files them all — it is within scope. The timeline will be longer (potentially 3-4 weeks), but the price does not change. We tell you upfront how many periods are outstanding after the initial assessment.',
    },
    {
      category: 'Process',
      q: 'Can I cancel if I have outstanding tax liability?',
      a: 'You must clear all outstanding tax before cancellation can be processed. If you have liability, your CA will calculate it and advise on payment before proceeding.',
    },
    {
      category: 'Documents',
      q: 'What documents do I need?',
      a: 'Your GST certificate (REG-06), PAN card, and a list of stock held on the cancellation date (if any). Your CA downloads the rest from the GST portal directly.',
    },
  ],

  reviewSources: [
    {
      name: 'GST Portal',
      url: 'https://www.gst.gov.in',
      description: 'Form REG-16 filing and cancellation tracking',
    },
    {
      name: 'CGST Act, 2017',
      url: 'https://cbic-gst.gov.in/cgst-act.html',
      description: 'Section 29: Cancellation of registration. Section 45: Final return.',
    },
  ],

  unlocks: [],

  showCompletionStats: false,
  showApprovalRate: false,
}
```

---

### FILE 2: `/apps/customer/lib/services/gst-revocation.ts`

```typescript
import { ServiceConfig } from '../services'

export const gstRevocation: ServiceConfig = {
  slug: 'gst-revocation',
  name: 'GST Revocation',
  shortName: 'GST Revoke',
  category: 'Tax Registration',
  tagline: 'GST cancelled by officer? We file all pending returns and reverse the cancellation.',

  ollvyFee: 2999,
  govtFee: undefined,

  slaDays: 30,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Businesses whose GST was cancelled by a GST officer (suo motu cancellation)',
  legalBasis: 'CGST Act 2017, Section 30',
  penaltyForMissing: 'Cannot issue GST invoices, collect ITC, or operate formally without active GSTIN',
  penaltyColor: 'red',

  seoTitle: 'GST Revocation Online India | Restore Cancelled GSTIN | ₹2,999 | Ollvy',
  seoDescription:
    'GST cancelled by officer? File all pending returns and restore your GSTIN. Fixed price ₹2,999. CA assigned same day. 90-day window — act fast.',
  canonicalUrl: 'https://ollvy.com/services/gst-revocation',

  processSteps: [
    {
      step: 1,
      title: 'Answer 4 questions — CA starts on pending returns immediately',
      timeline: 'Day 0',
      body: "Your GSTIN, cancellation order date, number of unfiled periods, and reason for non-filing. A CA is assigned within 4 hours. Time is critical — you have 90 days from the cancellation order to file for revocation. After 90 days, the right expires and you need a fresh registration. Your CA starts identifying and filing pending returns the same day.",
      visual: 'checklist',
      milestone: 'CA assigned, cancellation order reviewed, pending returns identified',
    },
    {
      step: 2,
      title: 'All pending returns filed — urgently',
      timeline: 'Day 1-15',
      body: "Revocation is impossible without filing every single outstanding return first. Your CA identifies all unfiled periods from the date of registration to the cancellation date and files them in sequence. This is within scope — not an extra charge. The more periods outstanding, the longer this step takes. Most cases have 3-12 months of pending returns.",
      visual: 'form',
      milestone: 'All pending GST returns filed and cleared',
    },
    {
      step: 3,
      title: 'Revocation application filed (REG-21)',
      timeline: 'Day 15-20',
      body: "With all returns clear, your CA files Form GST REG-21 requesting revocation. The application includes a detailed explanation of why returns were not filed — drafted by your CA based on your answers. The officer has 30 days to decide. A strong application matters: officers can reject revocation if not satisfied with the explanation.",
      visual: 'form',
      milestone: 'REG-21 filed, ARN generated',
    },
    {
      step: 4,
      title: 'Officer query handled',
      timeline: 'Day 20-28',
      body: "Officer queries are almost guaranteed on revocation applications — they want to know why returns were not filed and why the business deserves the GSTIN back. Your CA responds with a detailed explanation and supporting documents within 24 hours. This is within scope.",
      visual: 'form',
      milestone: 'Officer query responded with supporting documentation',
    },
    {
      step: 5,
      title: 'GSTIN restored',
      timeline: 'Day 28-30',
      body: "The officer issues Form GST REG-22 — the revocation order. Your GSTIN is active again from the date of the original cancellation order. All ITC entitlements are restored. The registration is treated as if it was never cancelled.",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'GSTIN restored and active',
    },
  ],

  whatsIncluded: [
    {
      title: '90-day window — we move immediately',
      body: "The right to file for revocation expires 90 days after the cancellation order. Many businesses waste 2-3 weeks trying to sort it themselves before calling a CA. By then, the clock has run down significantly. Your CA is assigned within 4 hours and starts on pending returns the same day.",
      comparisonWithout: 'Delay by 3 weeks → 69 days left → pressure on timeline',
      comparisonWithOllvy: 'CA starts Day 0 → maximum time to clear all pending returns',
    },
    {
      title: 'All pending returns filed — within scope',
      body: "You cannot revoke without clearing every unfiled return. The number of outstanding periods does not affect the price. Your CA works through every period — GSTR-1 and GSTR-3B for each month or quarter — before filing REG-21.",
    },
    {
      title: 'Strong revocation application drafted by CA',
      body: "The explanation in REG-21 matters. Officers reject weak applications. Your CA drafts a detailed, specific explanation based on your actual circumstances — cash flow issues, business inactivity, previous accountant failure — with supporting documents. Generic applications get rejected.",
      comparisonWithout: 'Generic reason → officer raises query or rejects outright',
      comparisonWithOllvy: 'CA drafts specific, documented explanation → stronger application',
    },
    {
      title: 'GSTIN restored from original cancellation date',
      body: "Once revocation is granted, your registration is treated as continuously active from the day it was originally issued. There is no gap. ITC claims during the cancelled period are restored. You can issue backdated invoices for the period if needed.",
    },
  ],

  serviceRisks: [
    {
      icon: 'clock',
      title: '90-day window — no extension possible',
      body: "If 90 days pass from the cancellation order date, the right to revoke expires permanently. You must apply for a fresh GST registration. If you are reading this after day 85, contact us before ordering — we need to assess whether there is enough time.",
    },
    {
      icon: 'alert',
      title: 'Every pending return must be filed before revocation',
      body: "The GST portal verifies filing status before accepting REG-21. One unfiled period = rejection. Your CA clears everything first, but this takes time. The more periods outstanding, the longer step 2 takes — and the more it eats into the 90-day window.",
    },
    {
      icon: 'document',
      title: 'Officer can reject revocation',
      body: "If the officer is not satisfied with the explanation in REG-21 or finds the reason insufficient, revocation can be rejected. Your CA prepares the strongest possible application, but there is no guarantee. Rejection is uncommon but possible.",
    },
  ],

  profilePersonas: [
    {
      label: 'GSTIN cancelled — cannot issue invoices',
      detail: "Cannot issue GST invoices or claim ITC. Every day without a valid GSTIN costs real money. CA starts on pending returns the same day.",
    },
    {
      label: 'Missed filings due to cash flow problems',
      detail: 'Most common reason. Could not pay the tax liability so stopped filing. CA handles all pending returns and prepares a strong application.',
    },
    {
      label: 'Business was temporarily shut',
      detail: 'Activity stopped for a period and filings were missed. Business is restarting. We restore the GSTIN and get you compliant.',
    },
    {
      label: 'Found out about cancellation by accident',
      detail: "Tried to file a return and found the portal blocked. CA moves fast — every day counts against the 90-day window.",
    },
  ],

  reviewKeywordChips: [
    '✓ GSTIN restored',
    '✓ Pending returns handled',
    '✓ Fast response',
    '✓ Officer query handled',
    '✓ Moved fast on deadline',
  ],

  relatedSlugs: ['gst-registration', 'gst-cancellation', 'gst-monthly-50l'],

  faqs: [
    {
      category: 'General',
      q: 'What is GST revocation?',
      a: "When a GST officer cancels your registration for non-filing (called suo motu cancellation), you can apply to reverse it. This is revocation. It must be filed within 90 days of the cancellation order date. After 90 days, the right expires.",
    },
    {
      category: 'General',
      q: 'Can I revoke a voluntary cancellation?',
      a: "No. Revocation only applies to officer-initiated (suo motu) cancellations. If you voluntarily cancelled your registration using REG-16, you need a fresh GST registration.",
    },
    {
      category: 'Process',
      q: 'What if 90 days have already passed?',
      a: "Revocation is no longer possible. You need a fresh GST registration. Contact us before ordering — if you are past the 90-day window, we'll move you to GST Registration instead.",
    },
    {
      category: 'Process',
      q: 'Will my ITC from the cancelled period be restored?',
      a: "Yes. Once the revocation order is issued, your registration is treated as continuously active. ITC claims during the cancelled period are restored. You can reconcile them in your next GSTR-3B.",
    },
    {
      category: 'Process',
      q: 'What if the officer rejects the revocation?',
      a: "If the first application is rejected, you can appeal or reapply with stronger documentation within the 90-day window. Your CA advises on next steps. Rejection is uncommon but possible — typically when the explanation is weak or the officer requires documentation you cannot provide.",
    },
    {
      category: 'Documents',
      q: 'What documents do I need?',
      a: "The cancellation order (REG-19) — download it from the GST portal under Notices and Orders. PAN card. Proof that the business is still operating (bank statement, electricity bill, rent agreement). Your CA handles everything else.",
    },
  ],

  reviewSources: [
    {
      name: 'GST Portal',
      url: 'https://www.gst.gov.in',
      description: 'Form REG-21 revocation filing and status tracking',
    },
    {
      name: 'CGST Act, 2017',
      url: 'https://cbic-gst.gov.in/cgst-act.html',
      description: 'Section 30: Revocation of cancellation of registration',
    },
  ],

  unlocks: [
    {
      name: 'GST Monthly Filing',
      explanation: 'Once GSTIN is restored, monthly returns are mandatory again.',
      price: 'From ₹2,999/month',
      type: 'required',
      slug: 'gst-monthly-50l',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}
```

---

### FILE 3: `/apps/customer/lib/services/company-name-change.ts`

```typescript
import { ServiceConfig } from '../services'

export const companyNameChange: ServiceConfig = {
  slug: 'company-name-change',
  name: 'Company Name Change',
  shortName: 'Name Change',
  category: 'Company Changes',
  tagline: 'Change your company name on MCA. New certificate in 20 working days.',

  ollvyFee: 3999,
  govtFee: 1000,
  govtFeeLabel: 'MCA filing fee',
  govtFeeNote: 'Government fee for RUN application and INC-24 filing. Paid directly to MCA.',

  slaDays: 20,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Private Limited Companies and One Person Companies seeking a name change',
  legalBasis: 'Companies Act 2013, Section 13 — Alteration of Memorandum',
  penaltyForMissing: undefined,
  penaltyColor: 'none',

  seoTitle: 'Company Name Change MCA India | Pvt Ltd Name Change | ₹4,999 | Ollvy',
  seoDescription:
    'Change your company name on MCA in 20 working days. Board resolution, RUN application, INC-24 filing, new Certificate of Incorporation. Fixed price ₹4,999.',
  canonicalUrl: 'https://ollvy.com/services/company-name-change',

  processSteps: [
    {
      step: 1,
      title: 'Answer 5 questions — CS checks name availability immediately',
      timeline: 'Day 0',
      body: "Current company name, CIN, 3 preferred new names in order of preference, reason for change, and number of directors. A company secretary is assigned within 4 hours. They run all 3 proposed names against the MCA21 registry and trademark database simultaneously — not one at a time. Unavailable names are flagged before any application is filed.",
      visual: 'checklist',
      milestone: 'CS assigned, all 3 name options checked against MCA registry',
    },
    {
      step: 2,
      title: 'Board resolution drafted and signed by all directors',
      timeline: 'Day 1-3',
      body: "Your CS drafts the board resolution approving the name change. This is not a template — it is prepared for your specific company, CIN, and proposed name. Directors download it from the app, sign on company letterhead, and upload back. All directors must sign before the RUN application can be filed.",
      visual: 'form',
      milestone: 'Board resolution signed by all directors and received',
    },
    {
      step: 3,
      title: 'RUN application filed — name reserved within 2 days',
      timeline: 'Day 3-5',
      body: "Your CS files the Reserve Unique Name application on MCA21. MCA processes RUN applications within 1-2 working days. If the first choice is approved, it is reserved for 20 days — SPICe+ RUN or INC-24 must be filed within that window. If the first choice is rejected, your CS files the second preference immediately.",
      visual: 'form',
      milestone: 'New name approved and reserved by MCA',
    },
    {
      step: 4,
      title: 'INC-24 filed with special resolution',
      timeline: 'Day 5-15',
      body: "Your CS files Form INC-24 — the main name change application — with MCA. A special resolution of shareholders is required. Your CS drafts the special resolution, shareholders sign and return, and it is attached to the INC-24 filing. MCA processes INC-24 within 7-10 working days.",
      visual: 'form',
      milestone: 'INC-24 submitted to MCA Registrar of Companies',
    },
    {
      step: 5,
      title: 'New Certificate of Incorporation issued',
      timeline: 'Day 15-20',
      body: "MCA issues a new Certificate of Incorporation with your updated company name and CIN. Your company's MOA is updated automatically. The new CoI is uploaded to your Ollvy account. Use it to update your bank accounts, GST registration, trademark, and other documents — these are separate processes not included in this service.",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'New CoI issued with updated company name',
    },
  ],

  whatsIncluded: [
    {
      title: '3 name preferences checked simultaneously',
      body: "We check all 3 proposed names against the MCA21 registry and trademark database before filing any of them. Most CAs submit one name and wait for rejection before trying the next — adding 3-5 days per rejection. We do all 3 in parallel so the RUN application goes in with the best available option.",
      comparisonWithout: 'Submit first name, wait 2 days for rejection, repeat',
      comparisonWithOllvy: '3 names checked simultaneously — faster to first approval',
    },
    {
      title: 'Board and special resolutions drafted by CS — not templated',
      body: "Two separate resolutions are required: board resolution (directors approving the name change) and special resolution (shareholders approving). Your CS drafts both for your specific company. Directors and shareholders download from the app, sign, and return. No legal drafting on your part.",
    },
    {
      title: 'RUN + INC-24 + MGT-14 — all forms handled',
      body: "Three separate MCA filings are required for a name change: RUN (name reservation), INC-24 (name change application), and MGT-14 (registration of special resolution). Your CS handles all three in the correct sequence.",
      comparisonWithout: 'Navigate MCA21 portal for 3 different forms in sequence',
      comparisonWithOllvy: 'CS handles all 3 — you just sign the resolutions',
    },
    {
      title: 'New Certificate of Incorporation delivered',
      body: "The new CoI is uploaded to your Ollvy account permanently. It carries your updated company name with the same CIN. Note: the name change on MCA does not automatically update your GST registration, bank accounts, or trademark. Each of these requires a separate amendment.",
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'MCA may reject all 3 name preferences',
      body: "MCA rejects names too similar to existing companies, containing restricted words (Bank, Finance, National, Exchange, etc.), or misleading about the business activity. If all 3 preferences are rejected, your CS will suggest 3 alternatives based on the rejection reasons. One additional round of filing is within scope.",
    },
    {
      icon: 'alert',
      title: 'Name change does not update downstream registrations',
      body: "After MCA issues the new CoI, your GST registration, bank accounts, trademark, IEC, and all contracts still reflect the old name. Each requires a separate amendment process. These are not part of this service — but we can advise on sequencing.",
    },
    {
      icon: 'clock',
      title: 'All directors must sign — delays if one is unavailable',
      body: "INC-24 cannot be filed until all directors have signed the board resolution. If a director is travelling or slow to respond, it stalls the entire application. Your CS tracks completion and follows up daily.",
    },
  ],

  profilePersonas: [
    {
      label: 'Rebranding the business',
      detail: 'Old name no longer reflects what the company does. MCA filing handled — downstream updates are separate.',
    },
    {
      label: 'Placeholder name at incorporation',
      detail: 'Used a temporary name when incorporating and now want to formalise. Common situation — clean process.',
    },
    {
      label: 'Post-acquisition or merger',
      detail: 'Company is being absorbed into a new brand. Name change as part of the corporate restructuring.',
    },
    {
      label: 'Name causing market confusion',
      detail: 'Too similar to a competitor. We file 3 distinct alternatives to maximise first-attempt approval.',
    },
  ],

  reviewKeywordChips: [
    '✓ Name approved first attempt',
    '✓ CS handled everything',
    '✓ New CoI on day 18',
    '✓ Clear on what is not included',
    '✓ No surprises',
  ],

  relatedSlugs: ['pvt-ltd-incorporation', 'mca-annual-filing', 'director-kyc'],

  faqs: [
    {
      category: 'General',
      q: 'Can any Pvt Ltd or OPC change its name?',
      a: "Yes, any Pvt Ltd or OPC can change its name under Section 13 of the Companies Act. The new name must be approved by MCA, cannot be identical or deceptively similar to an existing registered company, and cannot contain restricted words without prior approval.",
    },
    {
      category: 'General',
      q: 'What happens to my CIN after the name change?',
      a: "Your CIN stays the same. Only the name in the CIN changes — the number is unchanged. Your company's history, contracts, and tax records are all continuous. There is no break in the entity.",
    },
    {
      category: 'Process',
      q: 'What if MCA rejects my preferred names?',
      a: "Your CS will notify you immediately with the rejection reason and suggest 3 alternatives. We refile at no extra charge. One additional round of filing is within scope. Rejections add 3-5 days per round.",
    },
    {
      category: 'Process',
      q: 'How long does the name change take?',
      a: "20 working days end to end — 2 days for RUN approval, 7-10 days for INC-24 processing, 2-3 days for new CoI issuance. The timeline depends on MCA processing speed (which Ollvy cannot control) and how quickly directors sign the resolutions.",
    },
    {
      category: 'Process',
      q: 'Do I need to update my GST registration after the name change?',
      a: "Yes. Your GST registration will still show the old company name until you file a GST amendment. This is a separate process. Banks, vendors, and clients may flag the mismatch until it is updated.",
    },
    {
      category: 'Documents',
      q: 'What do I need to provide?',
      a: "Your Certificate of Incorporation, company PAN, and MOA. Your CS handles all the resolutions, MCA filings, and follow-up.",
    },
  ],

  reviewSources: [
    {
      name: 'MCA21 Portal',
      url: 'https://www.mca.gov.in',
      description: 'RUN application, INC-24, and MGT-14 filing',
    },
    {
      name: 'Companies Act, 2013',
      url: 'https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf',
      description: 'Section 13: Alteration of Memorandum of Association',
    },
  ],

  unlocks: [],

  showCompletionStats: false,
  showApprovalRate: false,
}
```

---

### FILE 4: `/apps/customer/lib/services/din-reactivation.ts`

```typescript
import { ServiceConfig } from '../services'

export const dinReactivation: ServiceConfig = {
  slug: 'din-reactivation',
  name: 'DIN Reactivation',
  shortName: 'DIN Reactivation',
  category: 'Company Changes',
  tagline: 'DIN deactivated? File DIR-3 KYC and restore it within 3 working days.',

  ollvyFee: 1499,
  govtFee: 500,
  govtFeeLabel: 'MCA late filing fee',
  govtFeeNote: 'The ₹500 late fee is charged by MCA for filing DIR-3 KYC after Sep 30. This is the government fee — passed through at cost, no markup.',

  slaDays: 3,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Directors whose DIN has been deactivated due to non-filing of DIR-3 KYC',
  legalBasis: 'Companies (Appointment and Qualification of Directors) Rules, 2014 — Rule 12A',
  penaltyForMissing: '₹5,000/day continues until filed. All company filings blocked.',
  penaltyColor: 'red',

  seoTitle: 'DIN Reactivation India | DIR-3 KYC Late Filing | ₹1,999 | Ollvy',
  seoDescription:
    'DIN deactivated? File DIR-3 KYC with late fee and reactivate your DIN in 3 working days. Fixed price ₹1,999. CS assigned within 2 hours.',
  canonicalUrl: 'https://ollvy.com/services/din-reactivation',

  processSteps: [
    {
      step: 1,
      title: 'Share your DIN and documents — CS checks status immediately',
      timeline: 'Day 0',
      body: "Your DIN number, PAN card, Aadhaar card, and mobile number linked to Aadhaar. A company secretary is assigned within 2 hours. They verify your DIN status on MCA21 and confirm the deactivation date. The ₹5,000/day penalty stops the moment DIR-3 KYC is filed — every hour you wait adds to the accumulated liability.",
      visual: 'upload',
      milestone: 'CS assigned, DIN status and penalty calculated',
    },
    {
      step: 2,
      title: 'DIR-3 KYC filed with late fee — OTP in real time',
      timeline: 'Day 1',
      body: "Your CS fills DIR-3 KYC on MCA21 and triggers OTP verification. OTP is sent to the mobile number linked to your Aadhaar. You share it with your CS. Form is submitted. The ₹500 late fee is paid to MCA as part of the filing. This step takes about 10 minutes of your time. The penalty clock stops the moment the form is submitted.",
      visual: 'form',
      milestone: 'DIR-3 KYC submitted to MCA, penalty clock stopped',
    },
    {
      step: 3,
      title: 'DIN reactivated',
      timeline: 'Day 1-3',
      body: "MCA processes DIR-3 KYC within 24-72 hours. DIN status changes to Active on MCA21. If you hold directorships in multiple companies, all are restored by one filing. The DIR-3 KYC acknowledgement is uploaded to your Ollvy account. Your compliance calendar is updated with next year's Sep 30 deadline.",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'DIN active on MCA21, all directorships restored',
    },
  ],

  whatsIncluded: [
    {
      title: 'Penalty clock stops on Day 1',
      body: "The ₹5,000/day penalty stops accumulating the moment DIR-3 KYC is submitted — not when MCA processes it, not when the DIN is confirmed active. Submitted = stopped. Your CS files on Day 1.",
      mockVisualType: 'status',
      mockVisualData: {
        row1: 'DIN: 08765432',
        row2: 'Status: Deactivated',
        row3: 'Penalty accrued: ₹4,35,000 (87 days)',
        note: 'Filing today stops the clock immediately',
      },
    },
    {
      title: 'OTP verification coordinated live',
      body: "DIR-3 KYC requires Aadhaar OTP. Your CS coordinates the verification in real time — they file, OTP arrives on your phone, you share it, they submit. Takes 10 minutes. You need to be available for this step.",
    },
    {
      title: 'All directorships restored — one filing',
      body: "DIR-3 KYC is tied to your DIN, not to any specific company. Filing once restores your DIN across every company where you are a director. All blocked MCA filings for all those companies are unblocked simultaneously.",
    },
    {
      title: 'Compliance calendar updated — Sep 30 reminder set',
      body: "The moment we file, next year's Sep 30 deadline is added to your compliance calendar with automated reminders. You will not miss it again.",
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'DIR-3 KYC - Due Sep 30, 2026',
        row2: 'Reminder: Aug 31, 2026',
        row3: 'Status: Scheduled',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'clock',
      title: '₹5,000/day penalty is accumulating right now',
      body: "Every day of delay adds ₹5,000 to your accumulated liability. By day 90, that is ₹4,50,000. The accumulated penalty does not disappear when you file — it is a liability that may need to be paid separately. Filing today stops it from growing further.",
    },
    {
      icon: 'building',
      title: 'Every company you direct is affected',
      body: "A deactivated DIN blocks all MCA filings for every company where you hold a directorship. Annual returns, share transfers, director changes, address changes — everything is frozen until your DIN is restored.",
    },
    {
      icon: 'alert',
      title: 'This is for DIR-3 KYC deactivation only',
      body: "This service reactivates DINs deactivated for non-filing of annual DIR-3 KYC. If your DIN was deactivated under Section 164 (director disqualification), that is a different process requiring legal intervention. Contact us before ordering if you are unsure which applies.",
    },
  ],

  profilePersonas: [
    {
      label: 'Missed the Sep 30 deadline',
      detail: "DIN deactivated on Oct 1. ₹5,000/day running. CS files the same day — penalty stops today.",
    },
    {
      label: 'Penalty has been accumulating for months',
      detail: "DIN inactive for a long time. We file immediately to stop further accumulation. The accumulated amount is a separate liability.",
    },
    {
      label: 'Multiple directorships blocked',
      detail: "Director in 3+ companies. All their MCA filings are frozen. One DIR-3 KYC filing restores all.",
    },
    {
      label: "Did not know the DIN was deactivated",
      detail: "Found out when trying to sign an annual return. We verify DIN status first and file the same day.",
    },
  ],

  reviewKeywordChips: [
    '✓ DIN reactivated same day',
    '✓ Penalty stopped immediately',
    '✓ OTP handled smoothly',
    '✓ All companies unblocked',
    '✓ CS was available instantly',
  ],

  relatedSlugs: ['director-kyc', 'mca-annual-filing', 'pvt-ltd-incorporation'],

  faqs: [
    {
      category: 'General',
      q: 'Why was my DIN deactivated?',
      a: "MCA deactivates DINs on Oct 1 every year for every director who did not file DIR-3 KYC by Sep 30. It is an automatic process — not a targeted action against you.",
    },
    {
      category: 'General',
      q: 'What is the late fee?',
      a: "MCA charges ₹500 as the late filing fee for DIR-3 KYC filed after Sep 30. This is separate from the ₹5,000/day penalty that was accumulating. The late fee is the government's charge for processing the late filing — we pass it through at cost.",
    },
    {
      category: 'Process',
      q: 'How long does reactivation take after filing?',
      a: "MCA confirms reactivation within 24-72 hours of submission. Most cases are confirmed within 1 working day. The DIN is not immediately active the moment we file — MCA must process it.",
    },
    {
      category: 'Process',
      q: 'Does filing stop the ₹5,000/day penalty immediately?',
      a: "Yes — the penalty stops accruing from the date of DIR-3 KYC submission, not from the date MCA confirms processing. We share the submission acknowledgement immediately so you have proof of the stop date.",
    },
    {
      category: 'Process',
      q: 'Does this cover Section 164 disqualification?',
      a: "No. Section 164 disqualification (for not filing annual returns for 3 consecutive years) is a legal matter that requires an application to the NCLT. This service only covers DIN deactivation from non-filing of DIR-3 KYC. Contact us before ordering if you are unsure which applies to you.",
    },
    {
      category: 'Documents',
      q: 'What do I need?',
      a: "PAN card, Aadhaar card, and the mobile number linked to your Aadhaar. You must be available for OTP verification during the filing session — it takes 10 minutes.",
    },
  ],

  reviewSources: [
    {
      name: 'MCA21 Portal',
      url: 'https://www.mca.gov.in',
      description: 'DIR-3 KYC filing and DIN status verification',
    },
    {
      name: 'Companies (Appointment and Qualification of Directors) Rules, 2014',
      url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html',
      description: 'Rule 12A: Annual KYC requirement and reactivation process',
    },
  ],

  unlocks: [],

  showCompletionStats: false,
  showApprovalRate: false,
}
```

---

### UPDATE: `/apps/customer/lib/services.ts` — Add to SERVICES array

Find the SERVICES array and add the 4 new imports and exports:

```typescript
// Add these imports at the top with the existing imports
import { gstCancellation } from './services/gst-cancellation'
import { gstRevocation } from './services/gst-revocation'
import { companyNameChange } from './services/company-name-change'
import { dinReactivation } from './services/din-reactivation'

// Add to SERVICES array — after existing entries
export const SERVICES: ServiceConfig[] = [
  // ... existing entries unchanged ...
  gstCancellation,
  gstRevocation,
  companyNameChange,
  dinReactivation,
]
```

Note: `tds-monthly-compliance` already exists in the SERVICES array. Do not add it again.

---

## PART B — UPDATE FALLBACK SLUGS

File: `/apps/customer/lib/data/services.ts`

Find `FALLBACK_SERVICE_SLUGS` array and add the 5 new slugs:

```typescript
const FALLBACK_SERVICE_SLUGS = [
  'pvt-ltd-incorporation',
  'llp-registration',
  'opc-registration',
  'gst-registration',
  'msme-registration',
  'trademark-registration',
  'fssai-registration',
  'iec-registration',
  'cloud-kitchen-setup',
  // New services
  'gst-cancellation',
  'gst-revocation',
  'company-name-change',
  'din-reactivation',
  'tds-monthly-compliance',
]
```

---

## PART C — DATABASE MIGRATION

File: `20260321200001_seed_five_new_services.sql`

First run this to get the current max display_order:
```sql
SELECT MAX(display_order) FROM service_packages;
```

Replace [MAX+1] through [MAX+5] below with the actual computed values before running.

The JSONB content in the migration must match the TypeScript config files created in Part A exactly — same processSteps body text, same whatsIncluded items, same faqs, same risks, same personas. Do not abbreviate or shorten the content in the JSONB.

---

### SERVICE 1 — GST CANCELLATION

```sql
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  workflow_stages, whats_included, service_risks, profile_personas, faqs,
  review_sources, unlocks, review_keyword_chips, related_slugs,
  has_govt_processing, completion_min_days, completion_max_days, completion_range_text
) VALUES (
  'gst-cancellation',
  'GST Cancellation',
  'GST Cancel',
  'Tax Registration',
  'Close your GST registration cleanly. Pending returns filed. Certificate surrendered.',
  'Voluntary GST cancellation — all pending returns filed and registration closed',
  'one_time', 'one_time', 199900, 0, 18,
  15, 70, ARRAY['closing_business', 'below_threshold', 'restructuring'], false, [MAX+1],
  'One-time',
  'Businesses closing down, falling below threshold, or restructuring',
  'CGST Act 2017, Section 29',
  'Continued filing obligations even after stopping business',
  'amber',
  'GST Cancellation Online India | Surrender GSTIN | ₹1,999 | Ollvy',
  'Cancel your GST registration online. All pending returns filed. GSTIN surrendered cleanly. Fixed price ₹1,999.',
  'https://ollvy.com/services/gst-cancellation',
  '[
    {"step": 1, "title": "Answer 4 questions - CA identifies every pending return", "timeline": "Day 0", "body": "Reason for cancellation, effective date, last filed return period, and stock held at time of cancellation. A CA is assigned within 4 hours. They pull your complete filing history from the GST portal and identify every unfiled period before doing anything else. You cannot cancel GST registration with unfiled returns — we find them all upfront.", "visual": "checklist", "milestone": "CA assigned, pending returns identified", "stage_key": null},
    {"step": 2, "title": "Pending returns filed — all of them", "timeline": "Day 1-7", "body": "Your CA files every unfiled GSTR-1, GSTR-3B, or annual return before submitting the cancellation application. The GST portal will reject REG-16 if any period is outstanding — there is no shortcut. If you have multiple pending periods, your CA works through them in sequence. This is within scope — not an extra charge.", "visual": "form", "milestone": "All pending GST returns filed", "stage_key": "returns_filed"},
    {"step": 3, "title": "Cancellation application filed (REG-16)", "timeline": "Day 7-10", "body": "With all returns clear, your CA files Form GST REG-16 on the portal. An ARN is generated immediately. The GST officer has 30 days by law to process it — most cases are cleared within 15 working days. We track it daily.", "visual": "form", "milestone": "REG-16 submitted, ARN generated", "stage_key": "cancellation_filed"},
    {"step": 4, "title": "Officer query handled if raised", "timeline": "Day 10-15", "body": "GST officers sometimes request clarification on the reason for cancellation or ask for additional documents. Your CA responds within 24 hours. Common queries: ITC reversal calculation, stock valuation, address proof. All handled within scope.", "visual": "form", "stage_key": "officer_query"},
    {"step": 5, "title": "Cancellation order issued + GSTR-10 filed", "timeline": "Day 15", "body": "The officer issues Form GST REG-19 confirming your GSTIN is cancelled from the effective date. Your CA also files GSTR-10 — the mandatory final return that must be filed within 3 months of cancellation. Missing GSTR-10 attracts ₹200/day penalty. We file it before we close the order.", "visual": "stamp", "isCompletion": true, "milestone": "GSTIN cancelled, REG-19 and GSTR-10 delivered", "stage_key": "cancellation_complete"}
  ]'::jsonb,
  '[
    {"title": "Pending returns identified and filed — within scope", "body": "Before filing cancellation, your CA checks every period going back to your registration date. Unfiled returns are filed in sequence. This is included — not a separate charge. The number of pending periods affects the timeline but not the price.", "comparisonWithout": "File REG-16 without clearing returns → portal rejects it → back to square one", "comparisonWithOllvy": "CA clears all pending returns first → REG-16 accepted first time"},
    {"title": "GSTR-10 final return filed", "body": "Every cancelled GST registrant must file GSTR-10 within 3 months of cancellation. Missing it attracts ₹200/day penalty. Your CA files GSTR-10 as part of this service — you do not have to track another deadline."},
    {"title": "ITC reversal calculated and handled", "body": "If you hold stock at the time of cancellation, you must reverse the Input Tax Credit claimed on it. Your CA calculates the exact reversal amount, includes it in the final return, and advises on payment. This is a tax liability you cannot avoid — but it must be calculated correctly."},
    {"title": "REG-19 cancellation order delivered to your account", "body": "The official cancellation order is uploaded to your Ollvy account permanently. Keep it. Banks, vendors, and future registrations will ask for proof that your GSTIN was properly surrendered."}
  ]'::jsonb,
  '[
    {"icon": "alert", "title": "Pending returns will block your cancellation", "body": "The single most common reason cancellations fail or get delayed. The GST portal checks filing history automatically when you submit REG-16. One unfiled month = rejection. Your CA clears everything first."},
    {"icon": "clock", "title": "GSTR-10 attracts ₹200/day if missed", "body": "After cancellation, most businesses forget about GSTR-10. It is due within 3 months of the cancellation order. Late filing: ₹200/day. Your CA files it before closing the order."},
    {"icon": "document", "title": "ITC on stock must be reversed", "body": "Any Input Tax Credit on goods held on the cancellation date must be paid back. No exception. Your CA calculates the exact amount from your questionnaire answers and handles the reversal in the final return."}
  ]'::jsonb,
  '[
    {"label": "Business is closing", "detail": "Shutting down completely. We cancel GST, file all pending returns, and deliver clean closure documents."},
    {"label": "Turnover fell below threshold", "detail": "No longer required to be registered. We close the registration cleanly with no loose ends."},
    {"label": "Restructuring to a new entity", "detail": "Closing old GST registration before opening a fresh one under the new structure."},
    {"label": "Voluntary registration no longer needed", "detail": "Registered voluntarily but the business no longer needs to issue GST invoices."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "Can I cancel GST registration myself?", "a": "Yes — but you must clear all pending returns first, and GSTR-10 must be filed within 3 months of cancellation. Missing either step creates penalties that exceed the cost of this service. We handle both."},
    {"category": "General", "q": "How long does GST cancellation take?", "a": "The officer has 30 days by law to process REG-16. In practice, most cases are cleared in 10-15 working days. Pending returns add time at the front of the process — the more periods outstanding, the longer it takes."},
    {"category": "Process", "q": "What is GSTR-10 and why is it mandatory?", "a": "GSTR-10 is the final return that every GST registrant must file within 3 months of the cancellation order. It declares your final stock, ITC reversal, and outstanding tax. Late filing attracts ₹200/day. Your CA files it as part of this service."},
    {"category": "Process", "q": "What if I have 12+ months of pending returns?", "a": "Your CA files them all — it is within scope. The timeline will be longer (potentially 3-4 weeks), but the price does not change. We tell you upfront how many periods are outstanding after the initial assessment."},
    {"category": "Process", "q": "Can I cancel if I have outstanding tax liability?", "a": "You must clear all outstanding tax before cancellation can be processed. If you have liability, your CA will calculate it and advise on payment before proceeding."},
    {"category": "Documents", "q": "What documents do I need?", "a": "Your GST certificate (REG-06), PAN card, and a list of stock held on the cancellation date (if any). Your CA downloads the rest from the GST portal directly."}
  ]'::jsonb,
  '[
    {"name": "GST Portal", "url": "https://www.gst.gov.in", "description": "Form REG-16 filing and cancellation tracking"},
    {"name": "CGST Act, 2017", "url": "https://cbic-gst.gov.in/cgst-act.html", "description": "Section 29: Cancellation of registration. Section 45: Final return."}
  ]'::jsonb,
  '[]'::jsonb,
  ARRAY['✓ Clean cancellation', '✓ Pending returns handled', '✓ Fast closure', '✓ No hidden charges', '✓ GSTR-10 filed'],
  ARRAY['gst-registration', 'gst-revocation', 'business-itr'],
  true, 10, 15, '10-15 working days'
);
```

### Questionnaires — gst-cancellation

```sql
INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
SELECT sp.id, q.question_key, q.question_label, q.question_type, q.options::jsonb, q.validation::jsonb, q.placeholder, q.help_text, q.step_number, q.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('business_name', 'Registered business name', 'text', NULL, '{"required": true}', 'As per GST certificate', 'Your business name as registered on the GST portal', 1, 1),
  ('gstin', 'Your GSTIN', 'text', NULL, '{"required": true, "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"}', '22AAAAA0000A1Z5', 'Your 15-digit GST Identification Number', 1, 2),
  ('cancellation_reason', 'Reason for cancellation', 'select', '[{"value": "ceased_business", "label": "Business has ceased operations"}, {"value": "below_threshold", "label": "Turnover fell below GST threshold"}, {"value": "transfer", "label": "Business transferred or sold"}, {"value": "amalgamation", "label": "Amalgamation or merger"}, {"value": "voluntary_no_longer_needed", "label": "Voluntary registration no longer needed"}, {"value": "other", "label": "Other"}]', '{"required": true}', NULL, 'Select the reason that best applies', 1, 3),
  ('effective_date', 'Effective date of cancellation', 'date', NULL, '{"required": true}', NULL, 'The date from which you want GST registration cancelled', 1, 4),
  ('last_filed_period', 'Last GST return period filed', 'select', '[{"value": "current", "label": "All returns are up to date"}, {"value": "1_pending", "label": "1 month or quarter pending"}, {"value": "2_pending", "label": "2 months or quarters pending"}, {"value": "3_plus_pending", "label": "3 or more periods pending"}]', '{"required": true}', NULL, 'Our CA checks your full filing history — this helps estimate the timeline', 2, 1),
  ('has_stock', 'Do you have any stock or inventory at the time of cancellation?', 'radio', '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}]', '{"required": true}', NULL, 'Stock held at cancellation date requires ITC reversal — your CA calculates the exact amount', 2, 2),
  ('stock_value', 'Approximate value of stock held (₹)', 'number', NULL, '{"required": true, "min": 0}', '0', 'Approximate is fine — your CA calculates the exact ITC reversal', 2, 3),
  ('has_itc_balance', 'Do you have any unutilised Input Tax Credit balance in your electronic credit ledger?', 'radio', '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}, {"value": "unsure", "label": "Not sure"}]', '{"required": true}', NULL, 'ITC balance must be reversed or paid back at cancellation — your CA will advise', 2, 4)
) AS q(question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
WHERE sp.slug = 'gst-cancellation';
```

### Initial documents — gst-cancellation

```sql
INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT sp.id, dt.document_key, dt.document_label, dt.description, dt.stage_key, dt.is_required, dt.display_order, dt.tips, dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('gst_certificate', 'GST Registration Certificate (REG-06)', 'Your current GST certificate showing your GSTIN and registration details', 'doc_collection', true, 1, ARRAY['Download from GST portal under My Profile → View/Download Certificates'], NULL),
  ('pan_card', 'PAN Card', 'PAN card of the business or proprietor', 'doc_collection', true, 2, ARRAY['Same PAN used for GST registration', 'Business PAN for companies and LLPs, personal PAN for proprietorship'], NULL),
  ('stock_list', 'Stock or Inventory List', 'List of goods held at time of cancellation with approximate values — required if you answered Yes to holding stock', 'doc_collection', false, 3, ARRAY['Excel or PDF format accepted', 'Include item name, quantity, and approximate value', 'Only required if you have stock on the cancellation date'], NULL),
  ('last_return_copy', 'Last Filed GST Return (GSTR-3B)', 'Copy of your most recently filed GSTR-3B', 'doc_collection', false, 4, ARRAY['Download from GST portal under Returns → Returns History', 'If all returns are pending, leave blank — your CA will access them directly'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'gst-cancellation';
```

### Work documents — gst-cancellation

```sql
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT sp.id, t.stage_key, t.direction::work_document_direction, t.document_key, t.document_label, t.description, t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('returns_filed', 'to_customer', 'pending_returns_summary', 'Pending Returns Summary', 'Summary of all GST return periods identified as unfiled and confirmation that each has been filed. Includes the filing date and acknowledgement number for each period.', 1),
  ('cancellation_filed', 'to_customer', 'reg16_draft', 'GST Cancellation Application Draft (REG-16)', 'Your complete cancellation application before submission. Review and confirm before your CA files it on the portal.', 2),
  ('cancellation_filed', 'to_customer', 'arn_confirmation', 'Application Reference Number (ARN)', 'Confirmation that REG-16 has been filed with the ARN for tracking on the GST portal. You can verify status at gst.gov.in using this number.', 3),
  ('officer_query', 'from_customer', 'additional_docs_query', 'Additional Documents (if officer raises query)', 'If the GST officer requests additional documentation to process the cancellation application — upload them here.', 4),
  ('cancellation_complete', 'to_customer', 'reg19_order', 'GST Cancellation Order (REG-19)', 'The official order issued by the GST officer confirming your GSTIN is cancelled from the effective date. Keep this permanently.', 5),
  ('cancellation_complete', 'to_customer', 'gstr10_acknowledgement', 'GSTR-10 Final Return Acknowledgement', 'Confirmation that the mandatory final return has been filed after cancellation, including the acknowledgement number.', 6)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'gst-cancellation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
```

---

### SERVICE 2 — GST REVOCATION

```sql
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  workflow_stages, whats_included, service_risks, profile_personas, faqs,
  review_sources, unlocks, review_keyword_chips, related_slugs,
  has_govt_processing, completion_min_days, completion_max_days, completion_range_text
) VALUES (
  'gst-revocation',
  'GST Revocation',
  'GST Revoke',
  'Tax Registration',
  'GST cancelled by officer? We file all pending returns and reverse the cancellation.',
  'Revocation of officer-initiated GST cancellation — pending returns filed, GSTIN restored',
  'one_time', 'one_time', 299900, 0, 18,
  30, 95, ARRAY['gst_cancelled_by_officer', 'resume_business', 'compliance_recovery'], false, [MAX+2],
  'One-time',
  'Businesses whose GST was cancelled by a GST officer for non-filing',
  'CGST Act 2017, Section 30',
  'Cannot issue GST invoices, collect ITC, or operate formally without active GSTIN',
  'red',
  'GST Revocation Online India | Restore Cancelled GSTIN | ₹2,999 | Ollvy',
  'GST cancelled by officer? File all pending returns and restore your GSTIN. Fixed price ₹2,999. CA assigned same day. 90-day window.',
  'https://ollvy.com/services/gst-revocation',
  '[
    {"step": 1, "title": "Answer 4 questions — CA starts on pending returns immediately", "timeline": "Day 0", "body": "Your GSTIN, cancellation order date, number of unfiled periods, and reason for non-filing. A CA is assigned within 4 hours. Time is critical — you have 90 days from the cancellation order to file for revocation. After 90 days, the right expires and you need a fresh registration. Your CA starts identifying and filing pending returns the same day.", "visual": "checklist", "milestone": "CA assigned, cancellation order reviewed, pending returns identified", "stage_key": null},
    {"step": 2, "title": "All pending returns filed — urgently", "timeline": "Day 1-15", "body": "Revocation is impossible without filing every single outstanding return first. Your CA identifies all unfiled periods from the date of registration to the cancellation date and files them in sequence. This is within scope — not an extra charge. The more periods outstanding, the longer this step takes. Most cases have 3-12 months of pending returns.", "visual": "form", "milestone": "All pending GST returns filed and cleared", "stage_key": "returns_filed"},
    {"step": 3, "title": "Revocation application filed (REG-21)", "timeline": "Day 15-20", "body": "With all returns clear, your CA files Form GST REG-21 requesting revocation. The application includes a detailed explanation of why returns were not filed — drafted by your CA based on your answers. The officer has 30 days to decide. A strong application matters: officers can reject revocation if not satisfied with the explanation.", "visual": "form", "milestone": "REG-21 filed, ARN generated", "stage_key": "revocation_filed"},
    {"step": 4, "title": "Officer query handled", "timeline": "Day 20-28", "body": "Officer queries are almost guaranteed on revocation applications — they want to know why returns were not filed and why the business deserves the GSTIN back. Your CA responds with a detailed explanation and supporting documents within 24 hours. This is within scope.", "visual": "form", "milestone": "Officer query responded with supporting documentation", "stage_key": "officer_query"},
    {"step": 5, "title": "GSTIN restored", "timeline": "Day 28-30", "body": "The officer issues Form GST REG-22 — the revocation order. Your GSTIN is active again from the date of the original cancellation order. All ITC entitlements are restored. The registration is treated as if it was never cancelled.", "visual": "stamp", "isCompletion": true, "milestone": "GSTIN restored and active", "stage_key": "revocation_complete"}
  ]'::jsonb,
  '[
    {"title": "90-day window — we move immediately", "body": "The right to file for revocation expires 90 days after the cancellation order. Many businesses waste 2-3 weeks trying to sort it themselves before calling a CA. By then, the clock has run down significantly. Your CA is assigned within 4 hours and starts on pending returns the same day.", "comparisonWithout": "Delay by 3 weeks → 69 days left → pressure on timeline", "comparisonWithOllvy": "CA starts Day 0 → maximum time to clear all pending returns"},
    {"title": "All pending returns filed — within scope", "body": "You cannot revoke without clearing every unfiled return. The number of outstanding periods does not affect the price. Your CA works through every period — GSTR-1 and GSTR-3B for each month or quarter — before filing REG-21."},
    {"title": "Strong revocation application drafted by CA", "body": "The explanation in REG-21 matters. Officers reject weak applications. Your CA drafts a detailed, specific explanation based on your actual circumstances — cash flow issues, business inactivity, previous accountant failure — with supporting documents.", "comparisonWithout": "Generic reason → officer raises query or rejects outright", "comparisonWithOllvy": "CA drafts specific, documented explanation → stronger application"},
    {"title": "GSTIN restored from original cancellation date", "body": "Once revocation is granted, your registration is treated as continuously active from the day it was originally issued. There is no gap. ITC claims during the cancelled period are restored."}
  ]'::jsonb,
  '[
    {"icon": "clock", "title": "90-day window — no extension possible", "body": "If 90 days pass from the cancellation order date, the right to revoke expires permanently. You must apply for a fresh GST registration. If you are reading this after day 85, contact us before ordering — we need to assess whether there is enough time."},
    {"icon": "alert", "title": "Every pending return must be filed before revocation", "body": "The GST portal verifies filing status before accepting REG-21. One unfiled period = rejection. Your CA clears everything first, but this takes time. The more periods outstanding, the more it eats into the 90-day window."},
    {"icon": "document", "title": "Officer can reject revocation", "body": "If the officer is not satisfied with the explanation in REG-21 or finds the reason insufficient, revocation can be rejected. Your CA prepares the strongest possible application, but there is no guarantee."}
  ]'::jsonb,
  '[
    {"label": "GSTIN cancelled — cannot issue invoices", "detail": "Cannot issue GST invoices or claim ITC. Every day without a valid GSTIN costs real money. CA starts on pending returns the same day."},
    {"label": "Missed filings due to cash flow problems", "detail": "Most common reason. Could not pay the tax liability so stopped filing. CA handles all pending returns and prepares a strong application."},
    {"label": "Business was temporarily shut", "detail": "Activity stopped for a period and filings were missed. Business is restarting. We restore the GSTIN and get you compliant."},
    {"label": "Found out about cancellation by accident", "detail": "Tried to file a return and found the portal blocked. CA moves fast — every day counts against the 90-day window."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "What is GST revocation?", "a": "When a GST officer cancels your registration for non-filing (called suo motu cancellation), you can apply to reverse it. This is revocation. It must be filed within 90 days of the cancellation order date. After 90 days, the right expires."},
    {"category": "General", "q": "Can I revoke a voluntary cancellation?", "a": "No. Revocation only applies to officer-initiated (suo motu) cancellations. If you voluntarily cancelled your registration using REG-16, you need a fresh GST registration."},
    {"category": "Process", "q": "What if 90 days have already passed?", "a": "Revocation is no longer possible. You need a fresh GST registration. Contact us before ordering — if you are past the 90-day window, we will move you to GST Registration instead."},
    {"category": "Process", "q": "Will my ITC from the cancelled period be restored?", "a": "Yes. Once the revocation order is issued, your registration is treated as continuously active. ITC claims during the cancelled period are restored. You can reconcile them in your next GSTR-3B."},
    {"category": "Process", "q": "What if the officer rejects the revocation?", "a": "If the first application is rejected, you can appeal or reapply with stronger documentation within the 90-day window. Your CA advises on next steps. Rejection is uncommon but possible — typically when the explanation is weak or the officer requires documentation you cannot provide."},
    {"category": "Documents", "q": "What documents do I need?", "a": "The cancellation order (REG-19) — download it from the GST portal under Notices and Orders. PAN card. Proof that the business is still operating (bank statement, electricity bill, rent agreement). Your CA handles everything else."}
  ]'::jsonb,
  '[
    {"name": "GST Portal", "url": "https://www.gst.gov.in", "description": "Form REG-21 revocation filing and status tracking"},
    {"name": "CGST Act, 2017", "url": "https://cbic-gst.gov.in/cgst-act.html", "description": "Section 30: Revocation of cancellation of registration"}
  ]'::jsonb,
  '[
    {"name": "GST Monthly Filing", "explanation": "Once GSTIN is restored, monthly returns are mandatory again.", "price": "From ₹2,999/month", "type": "required", "slug": "gst-monthly-50l"}
  ]'::jsonb,
  ARRAY['✓ GSTIN restored', '✓ Pending returns handled', '✓ Moved fast on deadline', '✓ Officer query handled', '✓ Strong application drafted'],
  ARRAY['gst-registration', 'gst-cancellation', 'gst-monthly-50l'],
  true, 20, 30, '20-30 working days'
);
```

### Questionnaires — gst-revocation

```sql
INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
SELECT sp.id, q.question_key, q.question_label, q.question_type, q.options::jsonb, q.validation::jsonb, q.placeholder, q.help_text, q.step_number, q.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('gstin', 'Your GSTIN', 'text', NULL, '{"required": true, "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"}', '22AAAAA0000A1Z5', 'The GSTIN that was cancelled by the officer', 1, 1),
  ('business_name', 'Registered business name', 'text', NULL, '{"required": true}', 'As per GST certificate', 'Your business name as registered on the GST portal', 1, 2),
  ('cancellation_order_date', 'Date of the cancellation order (REG-19)', 'date', NULL, '{"required": true}', NULL, 'The date printed on the cancellation order you received. This determines your 90-day revocation deadline.', 1, 3),
  ('pending_periods', 'How many return periods are unfiled?', 'select', '[{"value": "1_to_3", "label": "1 to 3 months or quarters"}, {"value": "4_to_6", "label": "4 to 6 months or quarters"}, {"value": "7_to_12", "label": "7 to 12 months or quarters"}, {"value": "more_than_12", "label": "More than 12 months or quarters"}, {"value": "unsure", "label": "Not sure — CA will check on the portal"}]', '{"required": true}', NULL, 'Your CA checks the full filing history directly from the GST portal — this helps estimate how long step 2 will take', 1, 4),
  ('reason_for_non_filing', 'Why were returns not filed?', 'select', '[{"value": "cash_flow", "label": "Cash flow issues — could not pay the tax liability"}, {"value": "business_inactive", "label": "Business was temporarily inactive"}, {"value": "forgot", "label": "Missed deadlines — oversight"}, {"value": "accountant_issue", "label": "Previous accountant did not file"}, {"value": "other", "label": "Other"}]', '{"required": true}', NULL, 'Used in the revocation application. The more accurate this is, the stronger the application.', 2, 1),
  ('reason_details', 'Provide details about the reason', 'textarea', NULL, '{"required": true, "minLength": 50, "maxLength": 500}', 'Explain your specific circumstances in detail...', 'Your CA will refine this into the formal explanation for the officer. More detail = stronger application.', 2, 2),
  ('has_cancellation_order', 'Do you have a copy of the cancellation order (REG-19)?', 'radio', '[{"value": "yes", "label": "Yes, I have it"}, {"value": "no", "label": "No — I need to download it from the GST portal"}]', '{"required": true}', NULL, 'Download from the GST portal under Services → Notices and Orders if you do not have it', 2, 3)
) AS q(question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
WHERE sp.slug = 'gst-revocation';
```

### Initial documents — gst-revocation

```sql
INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT sp.id, dt.document_key, dt.document_label, dt.description, dt.stage_key, dt.is_required, dt.display_order, dt.tips, dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('cancellation_order', 'GST Cancellation Order (REG-19)', 'The cancellation order issued by the GST officer confirming your GSTIN was cancelled', 'doc_collection', true, 1, ARRAY['Download from GST portal under Services → Notices and Orders', 'If you cannot find it, your CA will help locate it on the portal'], NULL),
  ('pan_card', 'PAN Card', 'PAN card of the business or proprietor', 'doc_collection', true, 2, ARRAY['Same PAN used for GST registration'], NULL),
  ('business_proof', 'Proof of Business Continuity', 'Document showing the business is still operating — bank statement, electricity bill, or rent agreement dated after the cancellation order', 'doc_collection', true, 3, ARRAY['Must be dated after the cancellation order date', 'Bank statement showing recent transactions is ideal', 'Electricity bill or rent agreement also accepted'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'gst-revocation';
```

### Work documents — gst-revocation

```sql
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT sp.id, t.stage_key, t.direction::work_document_direction, t.document_key, t.document_label, t.description, t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('returns_filed', 'to_customer', 'returns_filing_summary', 'Pending Returns Filing Summary', 'Summary of all GST return periods filed to clear the outstanding history before the revocation application. Includes acknowledgement numbers for each period filed.', 1),
  ('revocation_filed', 'to_customer', 'reg21_draft', 'Revocation Application Draft (REG-21)', 'Your complete revocation application including the explanation drafted by your CA. Review and confirm before submission.', 2),
  ('revocation_filed', 'to_customer', 'revocation_arn', 'Revocation ARN Confirmation', 'Confirmation that REG-21 has been submitted with the ARN for tracking. You can verify status on the GST portal.', 3),
  ('officer_query', 'from_customer', 'additional_evidence', 'Additional Evidence (if officer requests)', 'If the officer requests additional documents to support the revocation claim — upload them here.', 4),
  ('officer_query', 'to_customer', 'query_response_draft', 'Officer Query Response', 'Your CA drafts the response to the officer query with supporting documentation. Review and confirm before your CA submits it.', 5),
  ('revocation_complete', 'to_customer', 'reg22_order', 'GST Revocation Order (REG-22)', 'The official revocation order confirming your GSTIN is restored from the original cancellation date. Keep this permanently.', 6)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'gst-revocation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
```

---

### SERVICE 3 — COMPANY NAME CHANGE

```sql
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  govt_fee_label, govt_fee_note,
  workflow_stages, whats_included, service_risks, profile_personas, faqs,
  review_sources, unlocks, review_keyword_chips, related_slugs,
  has_govt_processing, completion_min_days, completion_max_days, completion_range_text
) VALUES (
  'company-name-change',
  'Company Name Change',
  'Name Change',
  'Company Changes',
  'Change your company name on MCA. New certificate in 20 working days.',
  'Change the name of your Pvt Ltd or OPC — board resolution, RUN application, INC-24 filing, new Certificate of Incorporation',
  'one_time', 'one_time', 399900, 100000, 18,
  20, 60, ARRAY['rebranding', 'have_company', 'compliance_change'], false, [MAX+3],
  'One-time',
  'Private Limited Companies and One Person Companies seeking a name change',
  'Companies Act 2013, Section 13 — Alteration of Memorandum',
  NULL,
  'none',
  'Company Name Change MCA India | Pvt Ltd Name Change | ₹4,999 | Ollvy',
  'Change your company name on MCA in 20 working days. Board resolution, RUN application, INC-24 filing, new Certificate of Incorporation. Fixed price ₹4,999.',
  'https://ollvy.com/services/company-name-change',
  'MCA filing fee',
  'Government fee for RUN application and INC-24 filing. Paid directly to MCA.',
  '[
    {"step": 1, "title": "Answer 5 questions — CS checks name availability immediately", "timeline": "Day 0", "body": "Current company name, CIN, 3 preferred new names in order of preference, reason for change, and number of directors. A company secretary is assigned within 4 hours. They run all 3 proposed names against the MCA21 registry and trademark database simultaneously — not one at a time. Unavailable names are flagged before any application is filed.", "visual": "checklist", "milestone": "CS assigned, all 3 name options checked against MCA registry", "stage_key": null},
    {"step": 2, "title": "Board resolution drafted and signed by all directors", "timeline": "Day 1-3", "body": "Your CS drafts the board resolution approving the name change. This is not a template — it is prepared for your specific company, CIN, and proposed name. Directors download it from the app, sign on company letterhead, and upload back. All directors must sign before the RUN application can be filed.", "visual": "form", "milestone": "Board resolution signed by all directors and received", "stage_key": "board_resolution"},
    {"step": 3, "title": "RUN application filed — name reserved within 2 days", "timeline": "Day 3-5", "body": "Your CS files the Reserve Unique Name application on MCA21. MCA processes RUN applications within 1-2 working days. If the first choice is approved, it is reserved for 20 days — INC-24 must be filed within that window. If the first choice is rejected, your CS files the second preference immediately.", "visual": "form", "milestone": "New name approved and reserved by MCA", "stage_key": "run_filed"},
    {"step": 4, "title": "INC-24 filed with special resolution", "timeline": "Day 5-15", "body": "Your CS files Form INC-24 — the main name change application — with MCA. A special resolution of shareholders is required. Your CS drafts the special resolution, shareholders sign and return, and it is attached to the INC-24 filing. MCA processes INC-24 within 7-10 working days.", "visual": "form", "milestone": "INC-24 submitted to MCA Registrar of Companies", "stage_key": "inc24_filed"},
    {"step": 5, "title": "New Certificate of Incorporation issued", "timeline": "Day 15-20", "body": "MCA issues a new Certificate of Incorporation with your updated company name. Your company MOA is updated automatically. The new CoI is uploaded to your Ollvy account. Note: the name change does not automatically update your GST registration, bank accounts, or trademark — each requires a separate amendment.", "visual": "stamp", "isCompletion": true, "milestone": "New CoI issued with updated company name", "stage_key": "name_change_complete"}
  ]'::jsonb,
  '[
    {"title": "3 name preferences checked simultaneously", "body": "We check all 3 proposed names against the MCA21 registry and trademark database before filing any of them. Most CAs submit one name and wait for rejection before trying the next — adding 3-5 days per rejection. We do all 3 in parallel so the RUN application goes in with the best available option.", "comparisonWithout": "Submit first name, wait 2 days for rejection, repeat", "comparisonWithOllvy": "3 names checked simultaneously — faster to first approval"},
    {"title": "Board and special resolutions drafted by CS — not templated", "body": "Two separate resolutions are required: board resolution (directors approving the name change) and special resolution (shareholders approving). Your CS drafts both for your specific company. Directors and shareholders download from the app, sign, and return."},
    {"title": "RUN + INC-24 + MGT-14 — all MCA forms handled", "body": "Three separate MCA filings are required for a name change: RUN (name reservation), INC-24 (name change application), and MGT-14 (registration of special resolution). Your CS handles all three in the correct sequence.", "comparisonWithout": "Navigate MCA21 portal for 3 different forms in sequence", "comparisonWithOllvy": "CS handles all 3 — you just sign the resolutions"},
    {"title": "New Certificate of Incorporation delivered", "body": "The new CoI is uploaded to your Ollvy account permanently. It carries your updated company name with the same CIN. Note: the name change on MCA does not automatically update your GST registration, bank accounts, or trademark. Each of these requires a separate amendment."}
  ]'::jsonb,
  '[
    {"icon": "document", "title": "MCA may reject all 3 name preferences", "body": "MCA rejects names too similar to existing companies, containing restricted words (Bank, Finance, National, Exchange, etc.), or misleading about the business activity. If all 3 preferences are rejected, your CS suggests 3 alternatives. One additional round of filing is within scope."},
    {"icon": "alert", "title": "Name change does not update downstream registrations", "body": "After MCA issues the new CoI, your GST registration, bank accounts, trademark, IEC, and all contracts still reflect the old name. Each requires a separate amendment process. These are not part of this service."},
    {"icon": "clock", "title": "All directors must sign — delays if one is unavailable", "body": "INC-24 cannot be filed until all directors have signed the board resolution. If a director is travelling or slow to respond, it stalls the entire application. Your CS tracks completion and follows up daily."}
  ]'::jsonb,
  '[
    {"label": "Rebranding the business", "detail": "Old name no longer reflects what the company does. MCA filing handled — downstream updates are separate."},
    {"label": "Placeholder name at incorporation", "detail": "Used a temporary name when incorporating and now want to formalise. Common situation — clean process."},
    {"label": "Post-acquisition or merger", "detail": "Company being absorbed into a new brand. Name change as part of the corporate restructuring."},
    {"label": "Name causing market confusion", "detail": "Too similar to a competitor. We file 3 distinct alternatives to maximise first-attempt approval."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "Can any Pvt Ltd or OPC change its name?", "a": "Yes, any Pvt Ltd or OPC can change its name under Section 13 of the Companies Act. The new name must be approved by MCA, cannot be identical or deceptively similar to an existing registered company, and cannot contain restricted words without prior approval."},
    {"category": "General", "q": "What happens to my CIN after the name change?", "a": "Your CIN stays the same. Only the name in the CIN changes — the number is unchanged. Your company history, contracts, and tax records are all continuous. There is no break in the entity."},
    {"category": "Process", "q": "What if MCA rejects my preferred names?", "a": "Your CS will notify you immediately with the rejection reason and suggest 3 alternatives. We refile at no extra charge. One additional round of filing is within scope. Rejections add 3-5 days per round."},
    {"category": "Process", "q": "How long does the name change take?", "a": "20 working days end to end — 2 days for RUN approval, 7-10 days for INC-24 processing, 2-3 days for new CoI issuance. The timeline depends on MCA processing speed and how quickly directors sign the resolutions."},
    {"category": "Process", "q": "Do I need to update my GST registration after the name change?", "a": "Yes. Your GST registration will still show the old company name until you file a GST amendment. This is a separate process. Banks, vendors, and clients may flag the mismatch until it is updated."},
    {"category": "Documents", "q": "What do I need to provide?", "a": "Your Certificate of Incorporation, company PAN, and MOA. Your CS handles all the resolutions, MCA filings, and follow-up."}
  ]'::jsonb,
  '[
    {"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "RUN application, INC-24, and MGT-14 filing"},
    {"name": "Companies Act, 2013", "url": "https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf", "description": "Section 13: Alteration of Memorandum of Association"}
  ]'::jsonb,
  '[]'::jsonb,
  ARRAY['✓ Name approved first attempt', '✓ CS handled everything', '✓ New CoI on day 18', '✓ Clear on what is not included', '✓ No surprises'],
  ARRAY['pvt-ltd-incorporation', 'mca-annual-filing', 'director-kyc'],
  true, 15, 20, '15-20 working days'
);
```

### Questionnaires — company-name-change

```sql
INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
SELECT sp.id, q.question_key, q.question_label, q.question_type, q.options::jsonb, q.validation::jsonb, q.placeholder, q.help_text, q.step_number, q.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('current_company_name', 'Current registered company name', 'text', NULL, '{"required": true}', 'As per Certificate of Incorporation', 'Exact name as on your MCA records — including Private Limited or OPC at the end', 1, 1),
  ('cin', 'Company Identification Number (CIN)', 'text', NULL, '{"required": true, "pattern": "^[UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$"}', 'U74999DL2020PTC123456', 'Your 21-character CIN from the Certificate of Incorporation', 1, 2),
  ('proposed_name_1', 'Preferred new name (1st choice)', 'text', NULL, '{"required": true, "maxLength": 100}', 'e.g., Acme Technologies Private Limited', 'Include Private Limited or OPC at the end. CS checks availability before filing.', 1, 3),
  ('proposed_name_2', 'Alternative new name (2nd choice)', 'text', NULL, '{"required": true, "maxLength": 100}', 'e.g., Acme Solutions Private Limited', 'Must also end with Private Limited or OPC', 1, 4),
  ('proposed_name_3', 'Alternative new name (3rd choice)', 'text', NULL, '{"required": true, "maxLength": 100}', 'e.g., Acme Ventures Private Limited', 'All 3 are checked simultaneously — filing 3 distinct options maximises speed', 1, 5),
  ('reason_for_change', 'Reason for name change', 'select', '[{"value": "rebranding", "label": "Rebranding or new brand identity"}, {"value": "business_pivot", "label": "Business has pivoted to a different sector"}, {"value": "merger", "label": "Merger or acquisition"}, {"value": "placeholder_name", "label": "Original name was a placeholder"}, {"value": "confusion", "label": "Name causing confusion in the market"}, {"value": "other", "label": "Other"}]', '{"required": true}', NULL, 'Used in the board resolution and INC-24 application. Select the most accurate reason.', 2, 1),
  ('director_count', 'Number of directors in the company', 'number', NULL, '{"required": true, "min": 1, "max": 15}', '2', 'All directors must sign the board resolution before filing can proceed', 2, 2),
  ('state', 'State of incorporation', 'select', '[{"value": "DL", "label": "Delhi"}, {"value": "MH", "label": "Maharashtra"}, {"value": "KA", "label": "Karnataka"}, {"value": "TN", "label": "Tamil Nadu"}, {"value": "GJ", "label": "Gujarat"}, {"value": "HR", "label": "Haryana"}, {"value": "UP", "label": "Uttar Pradesh"}, {"value": "TS", "label": "Telangana"}, {"value": "WB", "label": "West Bengal"}, {"value": "RJ", "label": "Rajasthan"}, {"value": "other", "label": "Other state"}]', '{"required": true}', NULL, 'State where the company is registered on MCA', 2, 3)
) AS q(question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
WHERE sp.slug = 'company-name-change';
```

### Initial documents — company-name-change

```sql
INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT sp.id, dt.document_key, dt.document_label, dt.description, dt.stage_key, dt.is_required, dt.display_order, dt.tips, dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('certificate_of_incorporation', 'Certificate of Incorporation', 'Current CoI with your company name and CIN', 'doc_collection', true, 1, ARRAY['Download from MCA portal under MCA Services → View Public Documents if you have lost the original'], NULL),
  ('pan_card', 'Company PAN Card', 'PAN card issued in the company name', 'doc_collection', true, 2, ARRAY['Must match the name on MCA records exactly'], NULL),
  ('moa', 'Memorandum of Association (MOA)', 'Current MOA of the company', 'doc_collection', true, 3, ARRAY['Required for INC-24 filing', 'Download from MCA portal under MCA Services → View Public Documents if needed'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'company-name-change';
```

### Work documents — company-name-change

```sql
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT sp.id, t.stage_key, t.direction::work_document_direction, t.document_key, t.document_label, t.description, t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('board_resolution', 'to_customer', 'board_resolution_draft', 'Board Resolution — Prepared by CS', 'CS has drafted the board resolution approving the name change for your specific company. Download, have all directors sign on company letterhead, and upload the signed copy back.', 1),
  ('board_resolution', 'from_customer', 'board_resolution_signed', 'Signed Board Resolution', 'Upload the board resolution signed by all directors on company letterhead. All directors must sign before the RUN application is filed.', 2),
  ('run_filed', 'to_customer', 'run_approval', 'MCA Name Approval Letter (RUN)', 'MCA approval confirming your new company name is available and reserved. The name is reserved for 20 days — INC-24 will be filed within this window.', 3),
  ('inc24_filed', 'to_customer', 'special_resolution_draft', 'Special Resolution — Prepared by CS', 'CS has drafted the special resolution for shareholders to approve the name change. Download, have all shareholders sign, and upload the signed copy back.', 4),
  ('inc24_filed', 'from_customer', 'special_resolution_signed', 'Signed Special Resolution', 'Upload the special resolution signed by all shareholders. Required for MGT-14 registration.', 5),
  ('inc24_filed', 'to_customer', 'inc24_acknowledgement', 'INC-24 Filing Acknowledgement', 'Confirmation that INC-24 has been submitted to the Registrar of Companies with the SRN for tracking.', 6),
  ('name_change_complete', 'to_customer', 'new_coi', 'New Certificate of Incorporation', 'New CoI issued by MCA with your updated company name and the same CIN. Use this for all downstream updates — bank accounts, GST, trademark, and contracts.', 7)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'company-name-change'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
```

---

### SERVICE 4 — DIN REACTIVATION

```sql
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  govt_fee_label, govt_fee_note,
  workflow_stages, whats_included, service_risks, profile_personas, faqs,
  review_sources, unlocks, review_keyword_chips, related_slugs,
  has_govt_processing, completion_min_days, completion_max_days, completion_range_text
) VALUES (
  'din-reactivation',
  'DIN Reactivation',
  'DIN Reactivation',
  'Company Changes',
  'DIN deactivated? File DIR-3 KYC and restore it within 3 working days.',
  'Reactivation of deactivated Director Identification Number via DIR-3 KYC late filing',
  'one_time', 'one_time', 149900, 50000, 18,
  3, 95, ARRAY['have_company', 'din_deactivated', 'compliance_recovery'], false, [MAX+4],
  'One-time',
  'Directors whose DIN has been deactivated due to non-filing of DIR-3 KYC by Sep 30',
  'Companies (Appointment and Qualification of Directors) Rules, 2014 — Rule 12A',
  '₹5,000/day until filed. All company MCA filings blocked.',
  'red',
  'DIN Reactivation India | DIR-3 KYC Late Filing | ₹1,999 | Ollvy',
  'DIN deactivated? File DIR-3 KYC with late fee and reactivate your DIN in 3 working days. Fixed price ₹1,999. CS assigned within 2 hours.',
  'https://ollvy.com/services/din-reactivation',
  'MCA late filing fee',
  'The ₹500 late fee is charged by MCA for filing DIR-3 KYC after Sep 30. This is the government fee — passed through at cost, no markup.',
  '[
    {"step": 1, "title": "Share your DIN and documents — CS checks status immediately", "timeline": "Day 0", "body": "Your DIN number, PAN card, Aadhaar card, and mobile number linked to Aadhaar. A company secretary is assigned within 2 hours. They verify your DIN status on MCA21 and confirm the deactivation date. The ₹5,000/day penalty stops the moment DIR-3 KYC is filed — every hour you wait adds to the accumulated liability.", "visual": "upload", "milestone": "CS assigned, DIN status and penalty calculated", "stage_key": null},
    {"step": 2, "title": "DIR-3 KYC filed with late fee — OTP in real time", "timeline": "Day 1", "body": "Your CS fills DIR-3 KYC on MCA21 and triggers OTP verification. OTP is sent to the mobile number linked to your Aadhaar. You share it with your CS. Form is submitted. The ₹500 late fee is paid to MCA as part of the filing. This step takes about 10 minutes of your time. The penalty clock stops the moment the form is submitted.", "visual": "form", "milestone": "DIR-3 KYC submitted to MCA, penalty clock stopped", "stage_key": "kyc_filed"},
    {"step": 3, "title": "DIN reactivated", "timeline": "Day 1-3", "body": "MCA processes DIR-3 KYC within 24-72 hours. DIN status changes to Active on MCA21. If you hold directorships in multiple companies, all are restored by one filing. The DIR-3 KYC acknowledgement is uploaded to your Ollvy account. Your compliance calendar is updated with next year Sep 30 deadline.", "visual": "stamp", "isCompletion": true, "milestone": "DIN active on MCA21, all directorships restored", "stage_key": "din_reactivated"}
  ]'::jsonb,
  '[
    {"title": "Penalty clock stops on Day 1", "body": "The ₹5,000/day penalty stops accumulating the moment DIR-3 KYC is submitted — not when MCA processes it, not when the DIN is confirmed active. Submitted = stopped. Your CS files on Day 1.", "mockVisualType": "status", "mockVisualData": {"row1": "DIN: 08765432", "row2": "Status: Deactivated", "row3": "Penalty accrued: ₹4,35,000 (87 days)", "note": "Filing today stops the clock immediately"}},
    {"title": "OTP verification coordinated live", "body": "DIR-3 KYC requires Aadhaar OTP. Your CS coordinates the verification in real time — they file, OTP arrives on your phone, you share it, they submit. Takes 10 minutes. You need to be available for this step."},
    {"title": "All directorships restored — one filing", "body": "DIR-3 KYC is tied to your DIN, not to any specific company. Filing once restores your DIN across every company where you are a director. All blocked MCA filings for all those companies are unblocked simultaneously."},
    {"title": "Compliance calendar updated — Sep 30 reminder set", "body": "The moment we file, next year Sep 30 deadline is added to your compliance calendar with automated reminders. You will not miss it again.", "mockVisualType": "calendar", "mockVisualData": {"row1": "DIR-3 KYC - Due Sep 30, 2026", "row2": "Reminder: Aug 31, 2026", "row3": "Status: Scheduled"}}
  ]'::jsonb,
  '[
    {"icon": "clock", "title": "₹5,000/day penalty is accumulating right now", "body": "Every day of delay adds ₹5,000 to your accumulated liability. By day 90, that is ₹4,50,000. The accumulated penalty does not disappear when you file — it is a liability that may need to be paid separately. Filing today stops it from growing further."},
    {"icon": "building", "title": "Every company you direct is affected", "body": "A deactivated DIN blocks all MCA filings for every company where you hold a directorship. Annual returns, share transfers, director changes, address changes — everything is frozen until your DIN is restored."},
    {"icon": "alert", "title": "This is for DIR-3 KYC deactivation only", "body": "This service reactivates DINs deactivated for non-filing of annual DIR-3 KYC. If your DIN was deactivated under Section 164 (director disqualification), that is a different process requiring legal intervention. Contact us before ordering if you are unsure which applies."}
  ]'::jsonb,
  '[
    {"label": "Missed the Sep 30 deadline", "detail": "DIN deactivated on Oct 1. ₹5,000/day running. CS files the same day — penalty stops today."},
    {"label": "Penalty has been accumulating for months", "detail": "DIN inactive for a long time. We file immediately to stop further accumulation. The accumulated amount is a separate liability."},
    {"label": "Multiple directorships blocked", "detail": "Director in 3+ companies. All their MCA filings are frozen. One DIR-3 KYC filing restores all."},
    {"label": "Did not know the DIN was deactivated", "detail": "Found out when trying to sign an annual return. We verify DIN status first and file the same day."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "Why was my DIN deactivated?", "a": "MCA deactivates DINs on Oct 1 every year for every director who did not file DIR-3 KYC by Sep 30. It is an automatic process — not a targeted action against you."},
    {"category": "General", "q": "What is the late fee?", "a": "MCA charges ₹500 as the late filing fee for DIR-3 KYC filed after Sep 30. This is separate from the ₹5,000/day penalty that was accumulating. The late fee is the government charge for processing the late filing — we pass it through at cost."},
    {"category": "Process", "q": "How long does reactivation take after filing?", "a": "MCA confirms reactivation within 24-72 hours of submission. Most cases are confirmed within 1 working day. The DIN is not immediately active the moment we file — MCA must process it."},
    {"category": "Process", "q": "Does filing stop the ₹5,000/day penalty immediately?", "a": "Yes — the penalty stops accruing from the date of DIR-3 KYC submission, not from the date MCA confirms processing. We share the submission acknowledgement immediately so you have proof of the stop date."},
    {"category": "Process", "q": "Does this cover Section 164 disqualification?", "a": "No. Section 164 disqualification requires an application to the NCLT. This service only covers DIN deactivation from non-filing of DIR-3 KYC. Contact us before ordering if you are unsure which applies to you."},
    {"category": "Documents", "q": "What do I need?", "a": "PAN card, Aadhaar card, and the mobile number linked to your Aadhaar. You must be available for OTP verification during the filing session — it takes 10 minutes."}
  ]'::jsonb,
  '[
    {"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "DIR-3 KYC filing and DIN status verification"},
    {"name": "Companies (Appointment and Qualification of Directors) Rules, 2014", "url": "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html", "description": "Rule 12A: Annual KYC requirement and reactivation process"}
  ]'::jsonb,
  '[]'::jsonb,
  ARRAY['✓ DIN reactivated same day', '✓ Penalty stopped immediately', '✓ OTP handled smoothly', '✓ All companies unblocked', '✓ CS was available instantly'],
  ARRAY['director-kyc', 'mca-annual-filing', 'pvt-ltd-incorporation'],
  true, 1, 3, '1-3 working days'
);
```

### Questionnaires — din-reactivation

```sql
INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
SELECT sp.id, q.question_key, q.question_label, q.question_type, q.options::jsonb, q.validation::jsonb, q.placeholder, q.help_text, q.step_number, q.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('din_number', 'Director Identification Number (DIN)', 'text', NULL, '{"required": true, "pattern": "^[0-9]{8}$"}', '08765432', 'Your 8-digit DIN — find it on your director appointment letter or MCA portal under MCA Services → Find Director', 1, 1),
  ('director_name', 'Full name of director (as per PAN)', 'text', NULL, '{"required": true}', 'As per PAN card', 'Must match exactly with PAN records', 1, 2),
  ('aadhaar_mobile', 'Mobile number linked to Aadhaar', 'text', NULL, '{"required": true, "pattern": "^[6-9][0-9]{9}$"}', '9876543210', 'OTP will be sent to this number during DIR-3 KYC filing. Must be the number currently linked to your Aadhaar — not just your primary mobile.', 1, 3),
  ('deactivation_year', 'Year in which DIN was deactivated', 'select', '[{"value": "2024", "label": "October 2024 (missed Sep 30, 2024 deadline)"}, {"value": "2023", "label": "October 2023 (missed Sep 30, 2023 deadline)"}, {"value": "2022", "label": "October 2022 or earlier"}, {"value": "unsure", "label": "Not sure — CS will verify on MCA21"}]', '{"required": true}', NULL, 'This helps your CS calculate the accumulated penalty and confirm the correct late fee', 1, 4),
  ('has_multiple_dins', 'Do you hold directorships in multiple companies?', 'radio', '[{"value": "yes", "label": "Yes — I am a director in more than one company"}, {"value": "no", "label": "No — only one company"}]', '{"required": true}', NULL, 'DIR-3 KYC reactivation covers all companies where you are a director — one filing restores all', 1, 5)
) AS q(question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
WHERE sp.slug = 'din-reactivation';
```

### Initial documents — din-reactivation

```sql
INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT sp.id, dt.document_key, dt.document_label, dt.description, dt.stage_key, dt.is_required, dt.display_order, dt.tips, dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('pan_card', 'PAN Card', 'PAN card of the director', 'doc_collection', true, 1, ARRAY['Name must match MCA records exactly', 'Director PAN — not company PAN'], NULL),
  ('aadhaar_card', 'Aadhaar Card', 'Aadhaar card of the director', 'doc_collection', true, 2, ARRAY['The mobile number linked to this Aadhaar will receive the OTP during filing', 'Ensure the linked mobile is active and accessible during the filing session'], NULL),
  ('photograph', 'Passport Photograph', 'Recent passport-size photograph of the director', 'doc_collection', true, 3, ARRAY['White or light background', 'JPEG format preferred', 'Clear, recent — not more than 6 months old'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'din-reactivation';
```

### Work documents — din-reactivation

```sql
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT sp.id, t.stage_key, t.direction::work_document_direction, t.document_key, t.document_label, t.description, t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('kyc_filed', 'to_customer', 'dir3_acknowledgement', 'DIR-3 KYC Filing Acknowledgement', 'Confirmation from MCA that DIR-3 KYC has been submitted successfully, including the acknowledgement number and late fee payment receipt. The penalty clock stopped on this date.', 1),
  ('din_reactivated', 'to_customer', 'din_status_confirmation', 'DIN Reactivation Confirmation', 'Confirmation that your DIN status is Active on MCA21. Download and save — you may be asked for this by your company or auditors.', 2)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'din-reactivation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
```

---

### SERVICE 5 — TDS MONTHLY COMPLIANCE

```sql
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  govt_fee_label, retainer_cycle_label,
  workflow_stages, whats_included, service_risks, profile_personas, faqs,
  review_sources, unlocks, review_keyword_chips, related_slugs,
  has_govt_processing, completion_min_days, completion_max_days, completion_range_text
) VALUES (
  'tds-monthly-compliance',
  'TDS Monthly Compliance',
  'TDS Filing',
  'Tax Compliance',
  'TDS deducted, deposited, and returns filed. Every month. Nothing missed.',
  'Monthly TDS compliance — challan deposit by 7th, quarterly 24Q and 26Q return filing, annual Form 16',
  'one_time', 'monthly', 299900, 0, 18,
  7, 85, ARRAY['have_company', 'have_employees', 'monthly_compliance'], false, [MAX+5],
  'Monthly retainer',
  'Companies and businesses that deduct TDS on salaries (24Q) or payments to vendors and contractors (26Q)',
  'Income Tax Act 1961, Section 192 (salary TDS), Section 194 (vendor TDS)',
  '₹200/day late return filing fee (Section 234E) + 1-1.5%/month interest on late deposit',
  'red',
  'TDS Monthly Compliance India | 24Q 26Q Filing | ₹2,999/month | Ollvy',
  'Monthly TDS compliance — challan deposit by 7th, 24Q and 26Q filing every quarter, Form 16 annually. Fixed ₹2,999/month.',
  'https://ollvy.com/services/tds-monthly-compliance',
  'No government fee',
  'per month',
  '[
    {"step": 1, "title": "Share TAN and deduction profile — CA onboards in 24 hours", "timeline": "Month 1, Day 0", "body": "Your TAN, nature of TDS deductions (salary, contractor payments, rent, professional fees), approximate monthly deduction amounts, and whether you use payroll software. CA assigned within 4 hours. They review your TAN registration, check for any pending returns or defaults from the previous CA, and set up the monthly coordination template before Month 1 Day 7.", "visual": "checklist", "milestone": "CA assigned, TAN verified, deduction profile set up", "stage_key": null},
    {"step": 2, "title": "Every month: TDS deposited by the 7th", "timeline": "Every month by the 7th", "body": "TDS deducted in Month N must be deposited by the 7th of Month N+1. Your CA sends you a data request template 3 days before the deadline. You fill in the deduction amounts. CA calculates the challan, you approve, CA deposits. Late deposit attracts 1.5% per month interest — not waivable.", "visual": "form", "milestone": "TDS challan deposited for the month", "stage_key": "challan_deposited"},
    {"step": 3, "title": "Every quarter: 24Q and 26Q returns filed", "timeline": "July 31, Oct 31, Jan 31, May 31", "body": "TDS returns are filed quarterly. Your CA collects deductee details (PAN, name, amount for each employee and vendor), reconciles against the challans deposited during the quarter, and files 24Q (salary) and 26Q (non-salary) before the due date. Late filing: ₹200/day under Section 234E — starts the day after the due date.", "visual": "form", "milestone": "Quarterly TDS return filed on time", "stage_key": "return_filed"},
    {"step": 4, "title": "Every June: Form 16 and 16A generated and delivered", "timeline": "June every year", "body": "After the March quarter return is filed, your CA generates Form 16 for every salaried employee (TDS certificate for salary) and Form 16A for every vendor or contractor with TDS deducted during the year. Both are delivered to your Ollvy account for distribution.", "visual": "stamp", "isCompletion": true, "milestone": "Form 16 and 16A delivered for distribution", "stage_key": "form16_issued"}
  ]'::jsonb,
  '[
    {"title": "TDS deposited by the 7th — every month, no exceptions", "body": "TDS deducted in a month must reach the government by the 7th of the following month. Your CA sends a data request 3 days before. You fill the template. CA deposits on time. Late deposit attracts 1.5% per month interest — this is not waivable and compounds.", "comparisonWithout": "Track the 7th yourself, calculate challan, navigate TIN NSDL portal", "comparisonWithOllvy": "CA sends template → you fill deductions → CA handles the rest"},
    {"title": "24Q and 26Q returns filed on time — every quarter", "body": "Quarterly TDS returns are due four times a year: July 31, October 31, January 31, and May 31. Your CA reconciles all challans deposited during the quarter against deductee details and files on time. Late filing attracts ₹200/day under Section 234E — not waivable."},
    {"title": "Section 234E penalties never triggered", "body": "₹200/day from the due date until the return is filed. Over a missed quarter, that is ₹18,200 minimum. Over a full year, ₹73,000+. Your CA files before the due date every quarter.", "comparisonWithout": "Miss one quarterly deadline → ₹200/day accrues", "comparisonWithOllvy": "Filed before every due date — zero Section 234E liability"},
    {"title": "Form 16 and 16A generated annually — ready for distribution", "body": "After the March quarter return is filed, your CA generates Form 16 for all employees and Form 16A for all vendors and contractors who had TDS deducted during the year. Both are delivered to your Ollvy account. Employees need Form 16 to file their personal ITR — failure to provide it on time creates friction."}
  ]'::jsonb,
  '[
    {"icon": "clock", "title": "₹200/day for late TDS return filing (Section 234E)", "body": "Starts the day after the quarterly due date. There is no grace period. Over a missed Q1 return (July 31 to September 30), that is ₹12,400. No waiver is possible under current rules."},
    {"icon": "alert", "title": "1.5% per month interest on late TDS deposit", "body": "TDS deducted but not deposited by the 7th attracts 1.5% per month interest. This is a liability of the company — not the employee. It cannot be waived and must be paid before the return is accepted."},
    {"icon": "document", "title": "Employees cannot claim TDS credit without your return", "body": "If you do not file the quarterly return, the TDS deducted from employee salaries does not appear in their Form 26AS. They cannot claim credit for it in their personal ITR. This creates employee relations friction and potential legal exposure."}
  ]'::jsonb,
  '[
    {"label": "Company with salaried employees", "detail": "24Q every quarter. Form 16 every June. CA handles everything — you send salary data monthly."},
    {"label": "Company paying contractors or vendors", "detail": "26Q every quarter. TDS on professional fees, rent, contractor payments tracked and filed."},
    {"label": "Both salary and vendor TDS", "detail": "Most growing companies have both 24Q and 26Q obligations. Both are covered under one monthly retainer."},
    {"label": "Previous CA was missing deadlines", "detail": "Switching to Ollvy. We do a TDS health check first — identify any pending returns or defaults before taking over the account."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "What exactly is included in ₹2,999/month?", "a": "Monthly TDS challan deposit by the 7th, quarterly 24Q and 26Q return filing (4 times a year), and annual Form 16 and 16A generation. All within the monthly retainer. No per-return or per-employee charges."},
    {"category": "General", "q": "What is not included?", "a": "Retrospective filing of past unfiled returns, TDS default assessment response, demand notice resolution, and TDS payment liability. If you have pending returns from before Ollvy, contact us — we can quote separately."},
    {"category": "Process", "q": "When exactly are TDS returns due?", "a": "Q1 (April-June): July 31. Q2 (July-September): October 31. Q3 (October-December): January 31. Q4 (January-March): May 31. Your CA files before each of these dates every year."},
    {"category": "Process", "q": "What information do I send each month?", "a": "Your CA sends a standard template 3 days before the 7th. For 24Q: salary register or payroll summary with gross salary, TDS deducted, and net salary per employee. For 26Q: vendor name, PAN, payment amount, and TDS deducted. Takes 15-30 minutes to fill."},
    {"category": "Process", "q": "What if I have unfiled returns from previous quarters?", "a": "We do a TDS health check during onboarding. Retrospective filing involves additional charges based on the number of periods outstanding. We quote separately before proceeding."},
    {"category": "General", "q": "Can I cancel the retainer?", "a": "Yes, with 30 days notice before the end of a quarter. We ensure all filings for the current period are complete and hand over all acknowledgements and credentials before the last day."}
  ]'::jsonb,
  '[
    {"name": "TRACES Portal", "url": "https://www.tdscpc.gov.in", "description": "TDS return filing, Form 16 download, and default check"},
    {"name": "Income Tax Act, 1961", "url": "https://incometaxindia.gov.in", "description": "Section 192-194: TDS provisions. Section 234E: Late filing fee."}
  ]'::jsonb,
  '[
    {"name": "Business ITR Filing", "explanation": "Annual income tax return for the company. Due Oct 31.", "price": "₹11,999", "type": "required", "slug": "business-itr"},
    {"name": "MCA Annual Filing", "explanation": "AOC-4 and MGT-7 due annually. Non-compliance: ₹100/day.", "price": "₹6,999/year", "type": "required", "slug": "mca-annual-filing"}
  ]'::jsonb,
  ARRAY['✓ Filed on time every month', '✓ No 234E penalties', '✓ Form 16 delivered', '✓ CA responds fast', '✓ No surprises'],
  ARRAY['business-itr', 'mca-annual-filing', 'gst-monthly-50l'],
  false, 5, 7, '5-7 working days per cycle'
);
```

### Questionnaires — tds-monthly-compliance

```sql
INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
SELECT sp.id, q.question_key, q.question_label, q.question_type, q.options::jsonb, q.validation::jsonb, q.placeholder, q.help_text, q.step_number, q.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('tan_number', 'Tax Deduction Account Number (TAN)', 'text', NULL, '{"required": true, "pattern": "^[A-Z]{4}[0-9]{5}[A-Z]{1}$"}', 'DELA12345B', 'Your 10-character TAN — find it on previous TDS challans, TRACES portal, or your TAN allotment letter', 1, 1),
  ('business_name', 'Registered business name', 'text', NULL, '{"required": true}', 'As per TAN registration', 'Business name as registered on the TAN', 1, 2),
  ('tds_types', 'What types of TDS do you deduct?', 'multiselect', '[{"value": "24q_salary", "label": "24Q — Salary TDS (employees)"}, {"value": "26q_contractors", "label": "26Q — Contractor or professional fee TDS"}, {"value": "26q_rent", "label": "26Q — Rent TDS"}, {"value": "26q_interest", "label": "26Q — Interest TDS"}, {"value": "unsure", "label": "Not sure — CA will assess during onboarding"}]', '{"required": true, "minItems": 1}', NULL, 'Select all that apply. Your CA confirms the exact sections during onboarding.', 1, 3),
  ('employee_count', 'Approximate number of employees (for 24Q filing)', 'select', '[{"value": "0", "label": "0 — No salaried employees (26Q only)"}, {"value": "1_to_10", "label": "1 to 10 employees"}, {"value": "11_to_50", "label": "11 to 50 employees"}, {"value": "51_to_100", "label": "51 to 100 employees"}, {"value": "above_100", "label": "More than 100 employees"}]', '{"required": true}', NULL, 'Used to understand 24Q filing complexity — price does not change with employee count', 1, 4),
  ('approx_monthly_tds', 'Approximate total TDS deducted per month (₹)', 'select', '[{"value": "below_10000", "label": "Below ₹10,000"}, {"value": "10000_to_50000", "label": "₹10,000 to ₹50,000"}, {"value": "50000_to_200000", "label": "₹50,000 to ₹2,00,000"}, {"value": "above_200000", "label": "Above ₹2,00,000"}]', '{"required": true}', NULL, 'Approximate is fine. Helps your CA understand the challan volumes.', 1, 5),
  ('has_pending_returns', 'Are there any unfiled TDS returns from previous quarters?', 'radio', '[{"value": "yes", "label": "Yes — some quarters are unfiled"}, {"value": "no", "label": "No — all returns are up to date"}, {"value": "unsure", "label": "Not sure — previous CA handled it"}]', '{"required": true}', NULL, 'If yes or unsure, we do a TDS health check during onboarding. Retrospective filing may involve additional charges.', 2, 1),
  ('payroll_software', 'Do you use payroll software?', 'select', '[{"value": "none", "label": "No software — manual calculation or Excel"}, {"value": "zoho", "label": "Zoho Payroll"}, {"value": "razorpay", "label": "Razorpay Payroll"}, {"value": "greythr", "label": "greytHR"}, {"value": "keka", "label": "Keka"}, {"value": "other", "label": "Other payroll software"}]', '{"required": true}', NULL, 'Helps your CA set up the monthly data template in the format that works for your payroll', 2, 2)
) AS q(question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
WHERE sp.slug = 'tds-monthly-compliance';
```

### Initial documents — tds-monthly-compliance

```sql
INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT sp.id, dt.document_key, dt.document_label, dt.description, dt.stage_key, dt.is_required, dt.display_order, dt.tips, dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('tan_certificate', 'TAN Allotment Certificate', 'TAN certificate or allotment letter from the Income Tax Department', 'doc_collection', true, 1, ARRAY['Download from TRACES portal under Profile if you have lost the original', 'Or from the Income Tax e-filing portal under My Account → TAN details'], NULL),
  ('last_tds_return', 'Last Filed TDS Return (if any)', 'Copy of your most recently filed 24Q or 26Q acknowledgement from TRACES', 'doc_collection', false, 2, ARRAY['Download from TRACES portal under Statement / Payment → Request for Conso File', 'If no returns have been filed previously, leave blank'], NULL),
  ('pan_card', 'Company PAN Card', 'PAN card of the company or proprietor', 'doc_collection', true, 3, ARRAY['Must match the TAN registration records'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'tds-monthly-compliance';
```

### Work documents — tds-monthly-compliance

```sql
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT sp.id, t.stage_key, t.direction::work_document_direction, t.document_key, t.document_label, t.description, t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('challan_deposited', 'from_customer', 'monthly_tds_data', 'Monthly TDS Data (salary and vendor deductions)', 'Your CA sends a standard template 3 days before the 7th. Fill in salary deductions per employee (24Q) and vendor payment deductions (26Q) for the month and upload here.', 1),
  ('challan_deposited', 'to_customer', 'challan_receipt', 'TDS Challan Deposit Receipt', 'Confirmation that TDS for the month has been deposited to the government. Includes the BSR code, challan serial number, and deposit date. Keep for quarterly return reconciliation.', 2),
  ('return_filed', 'from_customer', 'deductee_details', 'Deductee Details for the Quarter', 'PAN, name, and TDS amount for each employee (24Q) and each vendor or contractor (26Q) for the quarter. Your CA sends a template — fill and upload before the quarterly due date.', 3),
  ('return_filed', 'to_customer', 'return_acknowledgement', 'Quarterly TDS Return Acknowledgement', 'Confirmation from TRACES that 24Q and/or 26Q has been filed for the quarter, with the token number. Keep for your records and any future audit.', 4),
  ('form16_issued', 'to_customer', 'form16_form16a', 'Form 16 and Form 16A', 'Form 16 (TDS certificate) for all salaried employees and Form 16A (TDS certificate) for all vendors and contractors with TDS deducted during the financial year. Distribute to each person — employees need Form 16 to file their personal ITR.', 5)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'tds-monthly-compliance'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
```

---

## VERIFICATION REPORT — REQUIRED AFTER COMPLETION

Paste the full results of these queries exactly. Do not summarise.

**Query 1 — Service packages created:**
```sql
SELECT slug, name, is_active, price_base_paisa, price_govt_fees_paisa, billing_cycle, display_order
FROM service_packages
WHERE slug IN ('gst-cancellation', 'gst-revocation', 'company-name-change', 'din-reactivation', 'tds-monthly-compliance')
ORDER BY display_order;
```

**Query 2 — Question counts:**
```sql
SELECT sp.slug, COUNT(sq.id) as question_count
FROM service_packages sp
LEFT JOIN service_questionnaires sq ON sq.service_package_id = sp.id
WHERE sp.slug IN ('gst-cancellation', 'gst-revocation', 'company-name-change', 'din-reactivation', 'tds-monthly-compliance')
GROUP BY sp.slug
ORDER BY sp.slug;
```

**Query 3 — Initial documents:**
```sql
SELECT sp.slug, sdt.document_key, sdt.is_required, sdt.display_order
FROM service_document_templates sdt
JOIN service_packages sp ON sdt.service_package_id = sp.id
WHERE sp.slug IN ('gst-cancellation', 'gst-revocation', 'company-name-change', 'din-reactivation', 'tds-monthly-compliance')
ORDER BY sp.slug, sdt.display_order;
```

**Query 4 — Work documents:**
```sql
SELECT sp.slug, swdt.document_key, swdt.direction, swdt.stage_key, swdt.display_order
FROM service_work_document_templates swdt
JOIN service_packages sp ON swdt.service_package_id = sp.id
WHERE sp.slug IN ('gst-cancellation', 'gst-revocation', 'company-name-change', 'din-reactivation', 'tds-monthly-compliance')
ORDER BY sp.slug, swdt.stage_key, swdt.display_order;
```

**Query 5 — Workflow stage counts:**
```sql
SELECT slug, jsonb_array_length(workflow_stages) as stage_count
FROM service_packages
WHERE slug IN ('gst-cancellation', 'gst-revocation', 'company-name-change', 'din-reactivation', 'tds-monthly-compliance');
```

**Also confirm:**
- All 5 services have `is_active = false` — yes/no
- 4 new TypeScript files created in `/apps/customer/lib/services/` — yes/no (list the files)
- All 4 imported and added to SERVICES array in `lib/services.ts` — yes/no
- `FALLBACK_SERVICE_SLUGS` updated in `lib/data/services.ts` — yes/no
- Migration file name and full path
- `display_order` values used for each service (list them)
- No existing service records modified — yes/no

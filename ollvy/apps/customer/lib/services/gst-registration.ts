import { ServiceConfig } from '../services'

export const gstRegistration: ServiceConfig = {
  slug: 'gst-registration',
  name: 'GST Registration',
  shortName: 'GST Reg',
  category: 'Registrations',
  tagline: 'Your GSTIN, applied for and obtained. We handle every step.',

  ollvyFee: 8999,
  govtFee: undefined,

  slaDays: 7,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Businesses above ₹40L turnover (₹20L for services)',
  legalBasis: 'CGST Act 2017, Section 22',
  penaltyForMissing: '100% of tax due + ₹10,000 minimum',
  penaltyColor: 'red',

  seoTitle: 'GST Registration Online India — GSTIN in 7 Days | ₹8,999 | Ollvy',
  seoDescription:
    'Get your GSTIN in 7 working days. No government fee. Fixed price ₹8,999. CA assigned same day. ARN shared within 24 hours of filing.',
  canonicalUrl: 'https://ollvy.com/services/gst-registration',

  processSteps: [
    {
      step: 1,
      title: 'Answer 5 questions — we build your personalised checklist',
      timeline: 'Day 0',
      body: "Business type, state, annual turnover estimate, supply type (goods / services / both), and whether you need voluntary registration. A CA is assigned within 4 hours. They review your answers and generate a specific document checklist — not the standard 20-item government list. If you're a sole proprietor with domestic sales only, you get 4 documents. Not 20.",
      visual: 'checklist',
      milestone: 'CA assigned, personalised checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeline: 'Day 0–1',
      body: 'Your CA sends the list in the app. You upload directly — photos from your phone are fine for most documents. Your CA reviews every upload before filing. Blurry Aadhaar, mismatched address, wrong file format — caught here, not after the officer raises a query.',
      visual: 'upload',
      milestone: 'Documents verified by CA',
    },
    {
      step: 3,
      title: 'Application filed — ARN in 24 hours',
      timeline: 'Day 1–2',
      body: "Your CA files GST REG-01 on the GSTN portal. An Application Reference Number is generated immediately on submission. We share the ARN in the app the same day. You can verify the status yourself at gstn.gov.in → Search Taxpayer → Search by ARN. We encourage this — you shouldn't have to trust us blindly.",
      visual: 'form',
      milestone: 'ARN generated — sent to your app',
    },
    {
      step: 4,
      title: 'If an officer query arrives, your CA handles it',
      timeline: 'Day 3–5 (if applicable)',
      body: "GST officers sometimes request document clarifications within 7 days of filing. If this happens, your CA responds within 24 hours. This is within scope — it's not an extra charge. The most common queries are Aadhaar verification issues and address proof mismatches. Both are resolvable.",
      visual: 'form',
    },
    {
      step: 5,
      title: 'GSTIN issued',
      timeline: 'Day 5–7',
      body: "GSTN issues your GSTIN. It's permanent — no renewal, no expiry. Delivered to your app immediately. Your Ollvy compliance calendar is updated automatically with your first GSTR-1 due date (11th of next month) and GSTR-3B due date (20th of next month). You don't set them manually.",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'GSTIN active on GSTN portal',
    },
  ],

  whatsIncluded: [
    {
      title: 'CA handles the GSTN portal — all 23 fields',
      body: "The GST REG-01 form on the government portal has 23 fields across 5 tabs, requires documents in specific formats, and times out after inactivity. Your CA fills the entire form. You answer 5 questions in the app.",
      comparisonWithout: '23 fields · 5 tabs · 3–4 hours on GSTN portal',
      comparisonWithOllvy: '5 questions in app · ~4 minutes',
      mockVisualType: 'status',
      mockVisualData: {
        label: 'GST REG-01 Application',
        row1: 'Business details — complete ✓',
        row2: 'Promoter/Partner info — complete ✓',
        row3: 'Place of business — complete ✓',
        note: 'All 23 fields handled by your CA',
      },
    },
    {
      title: 'ARN shared same day — you can track it yourself',
      body: "The ARN (Application Reference Number) is generated the moment your CA submits. We share it in the app immediately. You can go to gstn.gov.in → Search Taxpayer → Search by ARN and verify status yourself. We don't ask you to trust us blindly.",
      mockVisualType: 'arn',
      mockVisualData: {
        arn: 'AA270325014782R',
        status: 'Application Processing',
        date: '25 Mar 2025',
      },
    },
    {
      title: 'Officer queries handled — no extra charge',
      body: "If the GST officer requests clarification (happens in ~20% of cases), your CA responds within 24 hours. This is part of the service — not a separate charge. Common queries: Aadhaar verification, address proof, bank account details. We've handled all of them before.",
    },
    {
      title: 'Compliance calendar updated automatically',
      body: "The moment your GSTIN is issued, your Ollvy compliance calendar shows your first GSTR-1 due date (11th of next month) and GSTR-3B due date (20th of next month). You don't have to calculate anything. The deadlines appear.",
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'GSTR-1 — Due 11 Apr (outward supplies)',
        row2: 'GSTR-3B — Due 20 Apr (net tax payment)',
        row3: 'GSTR-9 — Due 31 Dec (annual return)',
        note: 'Added to your calendar automatically',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'Address proof mismatch',
      body: "The business address on your documents must match exactly. If your utility bill says 'Flat 201, Tower B, Prestige Lakeside' but your bank statement says '201, Prestige Lakeside Habitat', the officer flags it. Your CA reviews all documents for consistency before filing.",
    },
    {
      icon: 'clock',
      title: 'Aadhaar OTP fails',
      body: "GST registration requires Aadhaar-based authentication. If the mobile number linked to your Aadhaar is old or inactive, OTP verification fails. This must be fixed at an Aadhaar centre — there's no workaround. We check this upfront.",
    },
    {
      icon: 'alert',
      title: 'Operating without registration',
      body: "If your turnover has already crossed ₹40L (₹20L for services) and you're not registered, you're liable for 100% of unpaid tax plus ₹10,000 minimum penalty. Registration doesn't make this go away — but it stops the liability from growing.",
    },
  ],

  profilePersonas: [
    {
      label: 'First GST registration',
      detail: "Never done this before. We explain what each document is for and why it's needed.",
    },
    {
      label: 'Turnover just crossed threshold',
      detail: 'You waited until you were legally required. Smart. Now we register you quickly.',
    },
    {
      label: 'Voluntary registration',
      detail: 'Below threshold but want to issue GST invoices. Completely legal. We handle it.',
    },
    {
      label: 'Home as principal place of business',
      detail: "Fully legal. We verify the address proof matches your home's electricity bill.",
    },
  ],

  reviewKeywordChips: [
    '✓ GSTIN in 5 days',
    '✓ CA was responsive',
    '✓ ARN shared same day',
    '✓ No extra charges',
    '✓ Officer query handled',
  ],

  relatedSlugs: ['gst-monthly-filing', 'pvt-ltd-incorporation', 'business-itr'],

  faqs: [
    {
      category: 'General',
      q: 'When is GST registration mandatory?',
      a: "GST registration is mandatory when your aggregate turnover crosses ₹40L in a financial year (₹20L for service providers, ₹10L for special category states). It's also mandatory for inter-state supply regardless of turnover, and for e-commerce sellers.",
    },
    {
      category: 'General',
      q: 'Can I register voluntarily below the threshold?',
      a: "Yes. If you want to issue GST invoices to clients or claim input tax credit on your purchases, you can register voluntarily. This is common for B2B service providers who want to look established, or businesses that want to claim ITC on capital purchases.",
    },
    {
      category: 'Process',
      q: "What's an ARN and why does it matter?",
      a: "ARN is Application Reference Number — it's generated the moment your application is submitted to GSTN. You can use it to track status on the government portal yourself. We share it the same day we file, so you don't have to wait wondering if we actually submitted.",
    },
    {
      category: 'Process',
      q: 'What if the officer raises a query?',
      a: "Officers raise queries in about 20% of applications — usually for address proof clarification or Aadhaar verification issues. Your CA responds within 24 hours. This is included in the service. Most queries are resolved in one reply.",
    },
    {
      category: 'Documents',
      q: 'What documents do I need?',
      a: "It depends on your business type. Sole proprietor: PAN, Aadhaar, address proof, bank statement. Pvt Ltd: Same, plus Certificate of Incorporation, board resolution, and PAN of all directors. We send you a personalised checklist — not the full 20-item government list.",
    },
    {
      category: 'After Completion',
      q: 'What are my obligations after getting GSTIN?',
      a: "GSTR-1 by 11th of every month (outward supplies), GSTR-3B by 20th (net tax payment). Even if you have zero sales, you must file nil returns. GSTR-9 annual return by Dec 31. We add all of these to your compliance calendar automatically.",
    },
  ],

  reviewSources: [
    {
      name: 'GST Portal',
      url: 'https://www.gst.gov.in',
      description: 'Official GSTN portal — registration, filing, and taxpayer search',
    },
    {
      name: 'CGST Act, 2017',
      url: 'https://www.cbic.gov.in/htdocs-cbec/gst/cgst-act.pdf',
      description: 'Section 22: Registration thresholds. Section 25: Registration procedure.',
    },
  ],

  unlocks: [
    {
      name: 'GST Monthly Filing',
      explanation: 'GSTR-1 by 11th, GSTR-3B by 20th. Every month. Mandatory.',
      price: 'From ₹2,999/month',
      type: 'required',
      slug: 'gst-monthly-filing',
    },
    {
      name: 'GSTR-9 Annual Return',
      explanation: 'Annual reconciliation. Due Dec 31 every year.',
      price: '₹4,999',
      type: 'required',
      slug: 'gstr-9',
    },
    {
      name: 'E-invoicing Setup',
      explanation: 'Mandatory above ₹5Cr turnover. Ollvy sets it up.',
      price: '₹3,999',
      type: 'beneficial',
      slug: 'e-invoicing',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}

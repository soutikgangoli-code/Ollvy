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

  seoTitle: 'GST Registration Online India - GSTIN in 7 Days | ₹8,999 | Ollvy',
  seoDescription:
    'Get your GSTIN in 7 working days. No government fee. Fixed price ₹8,999. CA assigned same day. ARN shared within 24 hours of filing.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-registration',

  processSteps: [
    {
      step: 1,
      title: 'Answer 5 questions - we build your personalised checklist',
      timeline: 'Day 0',
      body: "Business type, state, turnover, supply type, voluntary registration\nCA assigned within 4 hours\nPersonalised checklist generated — not the standard 20-item govt list\nSole proprietor with domestic sales? 4 documents, not 20",
      visual: 'checklist',
      milestone: 'CA assigned, personalised checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeline: 'Day 0-1',
      body: 'Upload directly in the app — phone photos accepted\nCA reviews every document before filing\nBlurry Aadhaar, mismatched address, wrong format — caught here, not after officer query',
      visual: 'upload',
      milestone: 'Documents verified by CA',
    },
    {
      step: 3,
      title: 'Application filed - ARN in 24 hours',
      timeline: 'Day 1-2',
      body: "GST REG-01 filed on GSTN portal\nARN generated immediately, shared in app same day\nVerify status yourself: gstn.gov.in → Search Taxpayer → Search by ARN",
      visual: 'form',
      milestone: 'ARN generated - sent to your app',
    },
    {
      step: 4,
      title: 'If an officer query arrives, your CA handles it',
      timeline: 'Day 3-5 (if applicable)',
      body: "Officers may request clarifications within 7 days\nCA responds within 24 hours — included, no extra charge\nCommon queries: Aadhaar verification, address proof mismatch — both resolvable",
      visual: 'form',
    },
    {
      step: 5,
      title: 'GSTIN issued',
      timeline: 'Day 5-7',
      body: "GSTIN issued — permanent, no renewal, no expiry\nDelivered to app immediately\nCompliance calendar auto-updated: GSTR-1 (11th) and GSTR-3B (20th) due dates added",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'GSTIN active on GSTN portal',
    },
  ],

  whatsIncluded: [
    {
      title: 'CA handles the GSTN portal - all 23 fields',
      body: "The GST REG-01 form on the government portal has 23 fields across 5 tabs, requires documents in specific formats, and times out after inactivity. Your CA fills the entire form. You answer 5 questions in the app.",
      comparisonWithout: '23 fields · 5 tabs · 3-4 hours on GSTN portal',
      comparisonWithOllvy: '5 questions in app · ~4 minutes',
      mockVisualType: 'status',
      mockVisualData: {
        label: 'GST REG-01 Application',
        row1: 'Business details - complete ✓',
        row2: 'Promoter/Partner info - complete ✓',
        row3: 'Place of business - complete ✓',
        note: 'All 23 fields handled by your CA',
      },
    },
    {
      title: 'ARN shared same day - you can track it yourself',
      body: "The ARN (Application Reference Number) is generated the moment your CA submits. We share it in the app immediately. You can go to gstn.gov.in → Search Taxpayer → Search by ARN and verify status yourself. We don't ask you to trust us blindly.",
      mockVisualType: 'arn',
      mockVisualData: {
        arn: 'AA270325014782R',
        status: 'Application Processing',
        date: '25 Mar 2025',
      },
    },
    {
      title: 'Officer queries handled - no extra charge',
      body: "If the GST officer requests clarification (happens in ~20% of cases), your CA responds within 24 hours. This is part of the service - not a separate charge. Common queries: Aadhaar verification, address proof, bank account details. We've handled all of them before.",
    },
    {
      title: 'Compliance calendar updated automatically',
      body: "The moment your GSTIN is issued, your Ollvy compliance calendar shows your first GSTR-1 due date (11th of next month) and GSTR-3B due date (20th of next month). You don't have to calculate anything. The deadlines appear.",
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'GSTR-1 - Due 11 Apr (outward supplies)',
        row2: 'GSTR-3B - Due 20 Apr (net tax payment)',
        row3: 'GSTR-9 - Due 31 Dec (annual return)',
        note: 'Added to your calendar automatically',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'Address proof mismatch',
      body: "Address on all documents must match exactly\nOfficer flags even minor variations (flat number, society name)\nCA reviews for consistency before filing",
    },
    {
      icon: 'clock',
      title: 'Aadhaar OTP fails',
      body: "Aadhaar OTP required — old or inactive mobile number causes failure\nMust be fixed at an Aadhaar centre, no workaround\nChecked upfront before filing",
    },
    {
      icon: 'alert',
      title: 'Operating without registration',
      body: "Above ₹40L turnover (₹20L for services) without registration = 100% tax due + ₹10,000 penalty\nRegistration stops the liability from growing",
    },
  ],

  profilePersonas: [
    {
      label: 'First GST registration',
      detail: 'Never done this before. We explain what each document is for and why it is needed.',
    },
    {
      label: 'Turnover just crossed threshold',
      detail: 'You waited until legally required. Now we register you quickly.',
    },
    {
      label: 'Voluntary registration',
      detail: 'Below threshold but want to issue GST invoices to B2B clients. Completely legal.',
    },
    {
      label: 'Home as principal place of business',
      detail: 'Fully legal. We verify your electricity bill matches before filing.',
    },
  ],

  reviewKeywordChips: [
    '✓ GSTIN in 5 days',
    '✓ CA was responsive',
    '✓ ARN shared same day',
    '✓ No extra charges',
    '✓ Officer query handled',
  ],

  relatedSlugs: ['gst-monthly', 'pvt-ltd-incorporation', 'business-itr'],

  faqs: [
    {
      category: 'General',
      q: 'When is GST registration mandatory?',
      a: 'When aggregate turnover crosses Rs 40 lakh (Rs 20 lakh for service providers, Rs 10 lakh for special category states). Also mandatory for any inter-state supply regardless of turnover, and for all e-commerce sellers from day one.',
    },
    {
      category: 'General',
      q: 'Can I register voluntarily if I am below the threshold?',
      a: 'Yes. Voluntary registration lets you issue GST invoices and claim ITC on purchases. Cannot be cancelled for at least one year from date of registration.',
    },
    {
      category: 'Process',
      q: 'What is an ARN and why does it matter?',
      a: 'Application Reference Number - generated the moment your application is submitted. You can track status on the government portal yourself without waiting for updates from us.',
    },
    {
      category: 'Process',
      q: 'What if the officer raises a query?',
      a: 'Your CA responds within 24 hours. Included in the service. Most queries are resolved in one reply.',
    },
    {
      category: 'Documents',
      q: 'What documents do I need?',
      a: 'Depends on your business type. Sole proprietor: PAN, Aadhaar, address proof, bank statement. Pvt Ltd: same, plus Certificate of Incorporation, board resolution, and director PANs. We send a personalised checklist.',
    },
    {
      category: 'After Completion',
      q: 'What are my obligations after getting GSTIN?',
      a: 'GSTR-1 by 11th of every month (outward supplies), GSTR-3B by 20th (net tax payment). Nil returns required even if there are no transactions. GSTR-9 annual return by December 31. All deadlines added to your compliance calendar automatically.',
    },
  ],

  reviewSources: [
    {
      name: 'GST Portal',
      url: 'https://cbic-gst.gov.in',
      description: 'Official CBIC GST portal - acts, rules, and notifications',
    },
    {
      name: 'CGST Act, 2017',
      url: 'https://cbic-gst.gov.in/gst-acts.html',
      description: 'Section 22: Registration thresholds. Section 25: Registration procedure.',
    },
  ],

  unlocks: [
    {
      name: 'GST Monthly Filing',
      explanation: 'GSTR-1 by 11th, GSTR-3B by 20th. Every month. Mandatory.',
      price: 'From ₹2,999/month',
      type: 'required',
      slug: 'gst-monthly',
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

import { ServiceConfig } from '../services'

export const gstRevocation: ServiceConfig = {
  slug: 'gst-revocation',
  name: 'GST Revocation',
  shortName: 'GST Revoke',
  category: 'Tax Filings',
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
    'GST cancelled by officer? File all pending returns and restore your GSTIN. Fixed price ₹2,999. CA assigned same day. 90-day window - act fast.',
  canonicalUrl: 'https://ollvy.com/services/gst-revocation',

  processSteps: [
    {
      step: 1,
      title: 'Answer 4 questions - CA starts on pending returns immediately',
      timeline: 'Day 0',
      body: "Your GSTIN, cancellation order date, number of unfiled periods, and reason for non-filing. A CA is assigned within 4 hours. Time is critical - you have 90 days from the cancellation order to file for revocation. After 90 days, the right expires and you need a fresh registration. Your CA starts identifying and filing pending returns the same day.",
      visual: 'checklist',
      milestone: 'CA assigned, cancellation order reviewed, pending returns identified',
    },
    {
      step: 2,
      title: 'All pending returns filed - urgently',
      timeline: 'Day 1-15',
      body: "Revocation is impossible without filing every single outstanding return first. Your CA identifies all unfiled periods from the date of registration to the cancellation date and files them in sequence. This is within scope - not an extra charge. The more periods outstanding, the longer this step takes. Most cases have 3-12 months of pending returns.",
      visual: 'form',
      milestone: 'All pending GST returns filed and cleared',
    },
    {
      step: 3,
      title: 'Revocation application filed (REG-21)',
      timeline: 'Day 15-20',
      body: "With all returns clear, your CA files Form GST REG-21 requesting revocation. The application includes a detailed explanation of why returns were not filed - drafted by your CA based on your answers. The officer has 30 days to decide. A strong application matters: officers can reject revocation if not satisfied with the explanation.",
      visual: 'form',
      milestone: 'REG-21 filed, ARN generated',
    },
    {
      step: 4,
      title: 'Officer query handled',
      timeline: 'Day 20-28',
      body: "Officer queries are almost guaranteed on revocation applications - they want to know why returns were not filed and why the business deserves the GSTIN back. Your CA responds with a detailed explanation and supporting documents within 24 hours. This is within scope.",
      visual: 'form',
      milestone: 'Officer query responded with supporting documentation',
    },
    {
      step: 5,
      title: 'GSTIN restored',
      timeline: 'Day 28-30',
      body: "The officer issues Form GST REG-22 - the revocation order. Your GSTIN is active again from the date of the original cancellation order. All ITC entitlements are restored. The registration is treated as if it was never cancelled.",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'GSTIN restored and active',
    },
  ],

  whatsIncluded: [
    {
      title: '90-day window - we move immediately',
      body: "The right to file for revocation expires 90 days after the cancellation order. Many businesses waste 2-3 weeks trying to sort it themselves before calling a CA. By then, the clock has run down significantly. Your CA is assigned within 4 hours and starts on pending returns the same day.",
      comparisonWithout: 'Delay by 3 weeks - 69 days left - pressure on timeline',
      comparisonWithOllvy: 'CA starts Day 0 - maximum time to clear all pending returns',
    },
    {
      title: 'All pending returns filed - within scope',
      body: "You cannot revoke without clearing every unfiled return. The number of outstanding periods does not affect the price. Your CA works through every period - GSTR-1 and GSTR-3B for each month or quarter - before filing REG-21.",
    },
    {
      title: 'Strong revocation application drafted by CA',
      body: "The explanation in REG-21 matters. Officers reject weak applications. Your CA drafts a detailed, specific explanation based on your actual circumstances - cash flow issues, business inactivity, previous accountant failure - with supporting documents. Generic applications get rejected.",
      comparisonWithout: 'Generic reason - officer raises query or rejects outright',
      comparisonWithOllvy: 'CA drafts specific, documented explanation - stronger application',
    },
    {
      title: 'GSTIN restored from original cancellation date',
      body: "Once revocation is granted, your registration is treated as continuously active from the day it was originally issued. There is no gap. ITC claims during the cancelled period are restored. You can issue backdated invoices for the period if needed.",
    },
  ],

  serviceRisks: [
    {
      icon: 'clock',
      title: '90-day window - no extension possible',
      body: "If 90 days pass from the cancellation order date, the right to revoke expires permanently. You must apply for a fresh GST registration. If you are reading this after day 85, contact us before ordering - we need to assess whether there is enough time.",
    },
    {
      icon: 'alert',
      title: 'Every pending return must be filed before revocation',
      body: "The GST portal verifies filing status before accepting REG-21. One unfiled period = rejection. Your CA clears everything first, but this takes time. The more periods outstanding, the longer step 2 takes - and the more it eats into the 90-day window.",
    },
    {
      icon: 'document',
      title: 'Officer can reject revocation',
      body: "If the officer is not satisfied with the explanation in REG-21 or finds the reason insufficient, revocation can be rejected. Your CA prepares the strongest possible application, but there is no guarantee. Rejection is uncommon but possible.",
    },
  ],

  profilePersonas: [
    {
      label: 'GSTIN cancelled - cannot issue invoices',
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
      detail: "Tried to file a return and found the portal blocked. CA moves fast - every day counts against the 90-day window.",
    },
  ],

  reviewKeywordChips: [
    '✓ GSTIN restored',
    '✓ Pending returns handled',
    '✓ Fast response',
    '✓ Officer query handled',
    '✓ Moved fast on deadline',
  ],

  relatedSlugs: ['gst-registration', 'gst-cancellation', 'gst-monthly-filing'],

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
      a: "Revocation is no longer possible. You need a fresh GST registration. Contact us before ordering - if you are past the 90-day window, we'll move you to GST Registration instead.",
    },
    {
      category: 'Process',
      q: 'Will my ITC from the cancelled period be restored?',
      a: "Yes. Once the revocation order is issued, your registration is treated as continuously active. ITC claims during the cancelled period are restored. You can reconcile them in your next GSTR-3B.",
    },
    {
      category: 'Process',
      q: 'What if the officer rejects the revocation?',
      a: "If the first application is rejected, you can appeal or reapply with stronger documentation within the 90-day window. Your CA advises on next steps. Rejection is uncommon but possible - typically when the explanation is weak or the officer requires documentation you cannot provide.",
    },
    {
      category: 'Documents',
      q: 'What documents do I need?',
      a: "The cancellation order (REG-19) - download it from the GST portal under Notices and Orders. PAN card. Proof that the business is still operating (bank statement, electricity bill, rent agreement). Your CA handles everything else.",
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
      slug: 'gst-monthly-filing',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}

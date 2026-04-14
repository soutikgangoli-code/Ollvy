import { ServiceConfig } from '../services'
import { format, addMonths } from 'date-fns'

// Dynamic due date for GST monthly filing
function getNextGstrDueDate(): string {
  const now = new Date()
  const day = now.getDate()
  // GSTR-3B due 20th of following month
  const dueMonth = day <= 15 ? now.getMonth() + 1 : now.getMonth() + 2
  const dueDate = new Date(now.getFullYear(), dueMonth, 20)
  return format(dueDate, 'd MMM')
}

export const gstMonthlyFiling: ServiceConfig = {
  slug: 'gst-monthly',
  name: 'GST Monthly Filing',
  shortName: 'GST Filing',
  category: 'Monthly Compliance',
  tagline: 'GSTR-1 by the 11th. GSTR-3B by the 20th. Every month. Handled.',

  ollvyFee: 2999,
  govtFee: undefined,
  mrp: 4999,
  retainerCycleLabel: 'per month',

  slaDays: 0, // retainer - uses nextDueDate instead
  isRetainer: true,
  nextDueDate: getNextGstrDueDate,
  serviceType: 'Monthly retainer',
  mandatoryFor: 'All GST-registered businesses',
  legalBasis: 'CGST Act 2017, Section 37 & 39',
  penaltyForMissing: '₹50/day (min ₹20,000) + 18% interest',
  penaltyColor: 'red',

  seoTitle: 'GST Monthly Filing Service | GSTR-1 & GSTR-3B | From ₹2,999/month | Ollvy',
  seoDescription:
    'Monthly GST filing handled by verified CA. GSTR-1 by 11th, GSTR-3B by 20th. Fixed price from ₹2,999/month. Monthly report included. Cancel anytime.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-monthly',

  processSteps: [
    {
      step: 1,
      title: 'Share your GST portal credentials',
      timeline: 'Day 0',
      body: "Share read-only GST portal access\nCA reviews filing history and business pattern\nDedicated CA assigned for all monthly filings",
      visual: 'checklist',
      milestone: 'CA assigned to your account',
    },
    {
      step: 2,
      title: 'Upload sales invoices and purchase data',
      timeline: 'By 8th of month',
      body: "Upload sales invoices and purchase register in app\nTally/Zoho exports accepted directly\nCA reconciles data and prepares GSTR-1",
      visual: 'upload',
      milestone: 'Data received for the month',
    },
    {
      step: 3,
      title: 'GSTR-1 filed by the 11th',
      timeline: '9th-11th',
      body: "GSTR-1 (outward supplies) filed before the 11th\nAcknowledgement shared in app\nDiscrepancies flagged before filing",
      visual: 'form',
      milestone: 'GSTR-1 filed and acknowledged',
    },
    {
      step: 4,
      title: 'GSTR-3B filed by the 20th',
      timeline: '18th-20th',
      body: "GSTR-3B prepared from GSTR-1 and purchase data\nNet tax liability calculated, ITC verified against GSTR-2B\nChallan generated — you pay, done",
      visual: 'form',
      milestone: 'GSTR-3B filed and acknowledged',
    },
    {
      step: 5,
      title: 'Monthly compliance report delivered',
      timeline: '21st-25th',
      body: "Monthly report delivered: filings, dates, acknowledgements\nITC claimed, tax paid, notices received — all documented",
      visual: 'checklist',
      isCompletion: true,
      milestone: 'Monthly report delivered',
    },
  ],

  whatsIncluded: [
    {
      title: 'GSTR-1 - outward supply return',
      body: "B2B invoices, B2C sales above ₹2.5L, and export invoices captured\nPrepared from your sales data and filed by the 11th",
      mockVisualType: 'status',
      mockVisualData: {
        row1: 'GSTR-1 · March 2025',
        row2: 'Filed: 10 Mar 2025',
        row3: 'ARN: AA1234567890123',
      },
    },
    {
      title: 'GSTR-3B - net tax payment',
      body: "Output tax minus eligible ITC = your net GST liability\nChallan generated — you pay through your bank",
    },
    {
      title: 'ITC reconciliation with GSTR-2B',
      body: "ITC you're claiming is matched against GSTR-2B (your vendors' filed data)\nMismatches flagged before you claim ineligible ITC",
      comparisonWithout: 'Claim ITC blindly, get notice later',
      comparisonWithOllvy: 'ITC verified against GSTR-2B before claiming',
    },
    {
      title: 'Monthly compliance report',
      body: "What was filed, when, acknowledgement numbers, ITC claimed, tax paid — all in one report",
      mockVisualType: 'receipt',
      mockVisualData: {
        label: 'March 2025 Compliance Report',
        row1: 'GSTR-1: Filed 10 Mar ✓',
        row2: 'GSTR-3B: Filed 18 Mar ✓',
        row3: 'Tax Paid: ₹45,230',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'clock',
      title: 'Late fee accumulates quickly',
      body: '₹50/day per return, ₹100/day for both combined\n18% interest on unpaid tax',
    },
    {
      icon: 'mismatch',
      title: 'GSTR-1 and GSTR-3B figures must match',
      body: 'GSTN auto-flags discrepancies between GSTR-1 and GSTR-3B',
    },
    {
      icon: 'alert',
      title: 'Vendor not filed = ITC blocked',
      body: "Vendor hasn't filed GSTR-1 = their invoices missing from your GSTR-2B\nClaiming that ITC invites a mismatch notice",
    },
  ],

  profilePersonas: [
    {
      label: 'Switching from another CA',
      detail: 'Seamless takeover. We review your filing history before the first cycle.',
    },
    {
      label: 'Multiple GSTINs',
      detail: 'Multiple states, multiple registrations. All handled under one retainer.',
    },
    {
      label: 'High transaction volume',
      detail: '500+ invoices a month. Priced by turnover, not invoice count.',
    },
    {
      label: 'Previous CA stopped responding',
      detail: 'We work to SLA every month. You get acknowledgement numbers, not silence.',
    },
  ],

  reviewKeywordChips: [
    '✓ Filed on time every month',
    '✓ CA is responsive',
    '✓ Monthly report received',
    '✓ ITC reconciled',
    '✓ No surprises',
  ],

  relatedSlugs: ['gst-registration', 'business-itr', 'tds-monthly-compliance'],

  faqs: [
    {
      category: 'General',
      q: 'What does the monthly retainer cover?',
      a: 'GSTR-1 by 11th, GSTR-3B by 20th, ITC reconciliation against GSTR-2B, and monthly compliance report.',
    },
    {
      category: 'General',
      q: 'Can I cancel anytime?',
      a: 'Yes. No minimum term. Cancel before the 1st of any month and you will not be charged for that cycle.',
    },
    {
      category: 'Process',
      q: 'What data do I need to share each month?',
      a: 'Sales invoices and purchase register. If you use accounting software, the export takes 2 minutes.',
    },
    {
      category: 'Process',
      q: 'What if I have no transactions in a month?',
      a: 'Nil GSTR-1 and GSTR-3B must still be filed. We handle nil returns as part of the retainer.',
    },
  ],

  reviewSources: [
    {
      name: 'GST Portal',
      url: 'https://cbic-gst.gov.in',
      description: 'Official GSTN portal for filing GSTR-1, GSTR-3B, and checking GSTR-2B',
    },
    {
      name: 'CGST Act, 2017',
      url: 'https://cbic-gst.gov.in/gst-acts.html',
      description: 'Section 37: GSTR-1 requirements. Section 39: GSTR-3B requirements.',
    },
  ],

  unlocks: [
    // Note: gst-annual-return and gst-notice-response services not yet available
    // Unlock items commented out until services are added
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}

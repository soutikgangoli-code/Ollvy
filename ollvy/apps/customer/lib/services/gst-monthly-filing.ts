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
  slug: 'gst-monthly-filing',
  name: 'GST Monthly Filing',
  shortName: 'GST Filing',
  category: 'Monthly Compliance',
  tagline: 'GSTR-1 by the 11th. GSTR-3B by the 20th. Every month. Handled.',

  ollvyFee: 2999,
  govtFee: undefined,
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
  canonicalUrl: 'https://www.ollvy.com/services/gst-monthly-filing',

  processSteps: [
    {
      step: 1,
      title: 'Share your GST portal credentials',
      timeline: 'Day 0',
      body: "You share read-only access to your GST portal. Your assigned CA logs in, reviews your filing history, and understands your business pattern. They're now your dedicated CA for all monthly filings.",
      visual: 'checklist',
      milestone: 'CA assigned to your account',
    },
    {
      step: 2,
      title: 'Upload sales invoices and purchase data',
      timeline: 'By 8th of month',
      body: "You upload your sales invoices and purchase register through the app. If you use Tally or Zoho, you can export and upload directly. Your CA reconciles with your portal data and prepares GSTR-1.",
      visual: 'upload',
      milestone: 'Data received for the month',
    },
    {
      step: 3,
      title: 'GSTR-1 filed by the 11th',
      timeline: '9th-11th',
      body: "Your CA files GSTR-1 (outward supplies) before the 11th. You receive the acknowledgement in the app. If there are any discrepancies between your invoices and the data, they flag it before filing.",
      visual: 'form',
      milestone: 'GSTR-1 filed and acknowledged',
    },
    {
      step: 4,
      title: 'GSTR-3B filed by the 20th',
      timeline: '18th-20th',
      body: "Your CA prepares GSTR-3B based on GSTR-1 and your purchase data. They calculate your net tax liability, verify ITC claims against GSTR-2B, and file. Challan is generated, you pay, done.",
      visual: 'form',
      milestone: 'GSTR-3B filed and acknowledged',
    },
    {
      step: 5,
      title: 'Monthly compliance report delivered',
      timeline: '21st-25th',
      body: "After filing, you receive a monthly compliance report: what was filed, when, acknowledgement numbers, ITC claimed, tax paid, and any notices received. This is your proof-of-work.",
      visual: 'checklist',
      isCompletion: true,
      milestone: 'Monthly report delivered',
    },
  ],

  whatsIncluded: [
    {
      title: 'GSTR-1 - outward supply return',
      body: "All B2B invoices, B2C sales above ₹2.5L, and export invoices are captured in GSTR-1. Your CA prepares this from your sales data and files by the 11th.",
      mockVisualType: 'status',
      mockVisualData: {
        row1: 'GSTR-1 · March 2025',
        row2: 'Filed: 10 Mar 2025',
        row3: 'ARN: AA1234567890123',
      },
    },
    {
      title: 'GSTR-3B - net tax payment',
      body: "GSTR-3B is where you pay your net GST liability. Your CA calculates output tax, deducts eligible ITC, and files. The challan is generated - you pay through your bank.",
    },
    {
      title: 'ITC reconciliation with GSTR-2B',
      body: "Your CA matches the ITC you're claiming against what's available in GSTR-2B (auto-populated from your vendors' GSTR-1). If there's a mismatch, they flag it before you claim ineligible ITC.",
      comparisonWithout: 'Claim ITC blindly, get notice later',
      comparisonWithOllvy: 'ITC verified against GSTR-2B before claiming',
    },
    {
      title: 'Monthly compliance report',
      body: "After every filing cycle, you get a report: what was filed, when, acknowledgement numbers, ITC claimed, tax paid. This is your answer to 'what am I paying for?'",
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
      title: 'Late filing: ₹50/day, minimum ₹20,000',
      body: "GSTR-3B late fee is ₹50/day (₹25 CGST + ₹25 SGST) with a minimum of ₹20,000 per return. Plus 18% annual interest on unpaid tax. Miss one month and it compounds.",
    },
    {
      icon: 'mismatch',
      title: 'GSTR-1 and GSTR-3B mismatch',
      body: "If your GSTR-1 figures don't match GSTR-3B, GSTN flags it automatically under Section 61. You get a notice. Responding requires a CA - which is not included in most retainers. With Ollvy, it's the same CA who filed, so they can respond.",
    },
    {
      icon: 'alert',
      title: 'ITC claimed but vendor hasn\'t filed',
      body: "You paid the vendor, have the invoice, claimed ITC. But if they haven't filed their GSTR-1, your ITC gets blocked and you get a notice. We catch this by checking GSTR-2B before claiming.",
    },
  ],

  profilePersonas: [
    {
      label: 'First time outsourcing GST',
      detail: "Your accountant was handling it. Now you want a professional. We take over seamlessly.",
    },
    {
      label: 'Multiple GSTINs',
      detail: 'Multiple states, multiple registrations. We handle all of them under one retainer.',
    },
    {
      label: 'High transaction volume',
      detail: "500+ invoices/month. We can handle it - pricing is based on turnover, not invoice count.",
    },
    {
      label: 'Previous CA went quiet',
      detail: "Your last CA stopped responding before a deadline. We don't do that. SLA is enforced.",
    },
  ],

  reviewKeywordChips: [
    '✓ Filed on time every month',
    '✓ CA is responsive',
    '✓ Monthly report received',
    '✓ ITC reconciled',
    '✓ No surprises',
  ],

  relatedSlugs: ['gst-registration', 'gst-annual-return', 'business-itr'],

  faqs: [
    {
      category: 'General',
      q: 'What does the monthly retainer cover?',
      a: "GSTR-1 filing by 11th, GSTR-3B filing by 20th, ITC reconciliation against GSTR-2B, late fee computation, and monthly compliance report. Does not include audit response, demand notices, or amendment returns.",
    },
    {
      category: 'General',
      q: 'Can I cancel anytime?',
      a: "Yes. No minimum term. Cancel before the 1st of any month and you won't be billed for that month. We recommend giving notice by the 25th to ensure smooth handoff.",
    },
    {
      category: 'Process',
      q: 'What data do I need to provide each month?',
      a: "Sales invoices (or export from Tally/Zoho), purchase register, and any updates to your vendor list. If you use accounting software, the export takes 2 minutes.",
    },
    {
      category: 'Process',
      q: 'Do I need to give you my GST login?',
      a: "Yes, but only for filing. You can create a sub-user with restricted access if you prefer. We never make changes to your profile or registration details without explicit approval.",
    },
    {
      category: 'Pricing',
      q: 'Why do prices vary by turnover?',
      a: "Higher turnover = more invoices = more reconciliation work. The base price (₹2,999/month) covers up to ₹50L annual turnover. Above that, pricing scales with complexity.",
    },
  ],

  reviewSources: [
    {
      name: 'GST Portal',
      url: 'https://www.gst.gov.in',
      description: 'Official GSTN portal for filing GSTR-1, GSTR-3B, and checking GSTR-2B',
    },
    {
      name: 'CGST Act, 2017',
      url: 'https://www.cbic.gov.in/htdocs-cbec/gst/cgst-act.pdf',
      description: 'Section 37: GSTR-1 requirements. Section 39: GSTR-3B requirements.',
    },
  ],

  unlocks: [
    {
      name: 'GSTR-9 Annual Return',
      explanation: 'Annual reconciliation. Due Dec 31 every year. Separate service.',
      price: '₹4,999',
      type: 'required',
      slug: 'gst-annual-return',
    },
    {
      name: 'GST Notice Response',
      explanation: 'If you receive a demand notice or Section 61 mismatch, we respond.',
      price: 'From ₹2,999/notice',
      type: 'beneficial',
      slug: 'gst-notice-response',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}

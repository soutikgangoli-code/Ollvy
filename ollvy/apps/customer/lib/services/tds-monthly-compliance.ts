import { ServiceConfig } from '../services'
import { getNextGstrDueDate } from '../dates'

export const tdsMonthlyCompliance: ServiceConfig = {
  slug: 'tds-monthly-compliance',
  name: 'TDS Monthly Compliance',
  shortName: 'TDS Filing',
  category: 'Monthly Compliance',
  tagline: 'Deduct TDS. Deposit the challan. File the return. Every month, on time.',

  ollvyFee: 999,
  mrp: 2999,
  retainerCycleLabel: 'per month',
  govtFee: undefined,

  slaDays: 3,
  isRetainer: true,
  serviceType: 'Monthly retainer',
  mandatoryFor: 'All businesses making TDS-applicable payments',
  legalBasis: 'Income Tax Act, 1961 - Sections 192-206',
  penaltyForMissing: '1% per month interest + ₹200/day late fee',
  penaltyColor: 'amber',

  seoTitle: 'TDS Filing Monthly Service | TDS Return & Challan | ₹1,999/mo | Ollvy',
  seoDescription:
    'Monthly TDS compliance service. TDS calculation, challan deposit, and quarterly return filing. Fixed ₹1,999/month. CA assigned permanently.',
  canonicalUrl: 'https://www.ollvy.com/services/tds-monthly-compliance',

  processSteps: [
    {
      step: 1,
      title: 'Share your payment register for the month',
      timeline: 'Day 1-5 of month',
      body: 'Upload: salary, vendor, rent, and professional fee payments\nCA determines applicable TDS rates per payment\nExemptions and lower deduction certificates applied',
      visual: 'upload',
      milestone: 'Payment data received',
    },
    {
      step: 2,
      title: 'TDS calculated and challans prepared',
      timeline: 'Day 5-6',
      body: 'TDS calculated per category: salary (24Q), non-salary (26Q), TCS (27Q)\nChallans prepared with correct assessment year and codes\nYou approve amounts before payment',
      visual: 'form',
      milestone: 'Challans ready for payment',
    },
    {
      step: 3,
      title: 'Challans paid - deposit confirmed',
      timeline: 'Day 6-7',
      body: 'Pay challans via net banking\nReceipt with CIN uploaded to your account\nDeposit deadline: 7th of following month',
      visual: 'stamp',
      milestone: 'TDS deposited on time',
    },
    {
      step: 4,
      title: 'Quarterly return filed (at quarter end)',
      timeline: 'Quarter end',
      body: 'Quarterly returns filed: Form 24Q (salary), Form 26Q (non-salary)\nAll monthly deposits consolidated\nAcknowledgement shared, Form 16/16A generation enabled',
      visual: 'form',
      milestone: 'TDS return filed',
      isCompletion: true,
    },
  ],

  whatsIncluded: [
    {
      title: 'TDS calculation for all payment types',
      body: 'Salary (192), contractors (194C), professional fees (194J), rent (194I), interest (194A)\nEach has different rates and thresholds — correct rate applied automatically',
      comparisonWithout: 'Guess the rate - risk under-deduction notice',
      comparisonWithOllvy: 'Correct TDS rate applied for every payment',
    },
    {
      title: 'Monthly challan preparation',
      body: 'Challan needs the right BSR code, assessment year, and tax type\nWrong entries cause mismatched credits for your deductees\nWe prepare the challan — you just pay',
      mockVisualType: 'receipt',
      mockVisualData: {
        row1: 'Form 26Q - Q4 FY 2024-25',
        row2: 'BSR Code: 0510219 · CIN: 0510219XXXXXX',
        row3: 'Amount: ₹84,500',
        note: 'Challan prepared - pay by 7th',
      },
    },
    {
      title: 'Quarterly return filing',
      body: 'Form 24Q (salary) and Form 26Q (non-salary) filed quarterly\nReconciled against your challan deposits before filing',
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'Q1 (Apr-Jun) return due: July 31',
        row2: 'Q2 (Jul-Sep) return due: Oct 31',
        row3: 'Q3 (Oct-Dec) return due: Jan 31',
        row4: 'Q4 (Jan-Mar) return due: May 31',
      },
    },
    {
      title: 'Form 16/16A generation enabled',
      body: 'Form 16 (salary) and Form 16A (non-salary) downloadable from TRACES after filing\nYour employees and vendors need these for their own ITR',
    },
  ],

  serviceRisks: [
    {
      icon: 'clock',
      title: 'Deposit due by 7th - not the 31st',
      body: 'Deposit due by 7th of following month (March: April 30)\nLate = 1.5%/month interest from date of deduction',
    },
    {
      icon: 'document',
      title: 'Wrong TDS rate',
      body: 'Under-deduction = liable for shortfall + interest',
    },
    {
      icon: 'alert',
      title: 'Missing PAN of deductees',
      body: 'No PAN = TDS at 20% (higher rate)',
    },
  ],

  profilePersonas: [
    {
      label: 'First time deducting TDS',
      detail: 'New to TDS obligations. We explain each section and threshold.',
    },
    {
      label: 'Paying employees',
      detail: 'Form 24Q salary TDS handled, Form 16 generated quarterly.',
    },
    {
      label: 'Paying contractors or consultants',
      detail: 'Form 26Q for 194C and 194J payments.',
    },
    {
      label: 'Multiple payment types',
      detail: 'Rent, salary, contractors, professional fees - all categories covered under one retainer.',
    },
  ],

  reviewKeywordChips: [
    '✓ Never missed 7th deadline',
    '✓ Form 16 ready on time',
    '✓ CA explained rates',
    '✓ Fixed monthly fee',
    '✓ No surprises',
  ],

  relatedSlugs: ['gst-monthly', 'payroll-management', 'business-itr'],

  faqs: [
    {
      category: 'General',
      q: 'Who needs to deduct TDS?',
      a: 'Any business making payments above prescribed threshold limits - salary, rent above Rs 2.4 lakh per year, contractor payments above Rs 30,000 per contract or Rs 1 lakh per year, professional fees above Rs 30,000 per year.',
    },
    {
      category: 'General',
      q: 'What happens if I do not deduct TDS?',
      a: 'The expense is disallowed under Section 40(a)(ia) - you pay tax on it as if it were profit. Plus interest at 1.5% per month on the amount that should have been deducted.',
    },
    {
      category: 'Process',
      q: 'When must TDS be deposited?',
      a: 'By the 7th of the following month for most payments. For March, the deadline is April 30.',
    },
    {
      category: 'Process',
      q: 'When are TDS returns due?',
      a: 'Quarterly. Q1 (April-June): July 31. Q2 (July-Sep): October 31. Q3 (Oct-Dec): January 31. Q4 (Jan-Mar): May 31.',
    },
  ],

  reviewSources: [
    {
      name: 'TRACES',
      url: 'https://www.tdscpc.gov.in',
      description: 'TDS Reconciliation Analysis and Correction Enabling System',
    },
    {
      name: 'Income Tax Act, 1961 - TDS Sections',
      url: 'https://www.incometaxindia.gov.in',
      description: 'Sections 192-206 covering TDS provisions',
    },
  ],

  unlocks: [
    {
      name: 'Payroll Management',
      explanation: 'Full payroll processing including salary TDS.',
      price: '₹2,999/month',
      type: 'beneficial',
      slug: 'payroll-management',
    },
    {
      name: 'Business ITR',
      explanation: 'Annual ITR filing. TDS credits must match.',
      price: '₹11,999',
      type: 'required',
      slug: 'business-itr',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}

import { ServiceConfig } from '../services'
import { getNextGstrDueDate } from '../dates'

export const tdsMonthlyCompliance: ServiceConfig = {
  slug: 'tds-monthly-compliance',
  name: 'TDS Monthly Compliance',
  shortName: 'TDS Filing',
  category: 'Monthly Compliance',
  tagline: 'Deduct TDS. Deposit the challan. File the return. Every month, on time.',

  ollvyFee: 3999,
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
      body: 'Upload your salary payments, vendor payments, rent payments, and professional fees for the previous month. Your CA reviews each payment to determine applicable TDS rates. Exemptions and lower deduction certificates are applied.',
      visual: 'upload',
      milestone: 'Payment data received',
    },
    {
      step: 2,
      title: 'TDS calculated and challans prepared',
      timeline: 'Day 5-6',
      body: 'Your CA calculates TDS for each category: salary (24Q), non-salary (26Q), TCS if applicable (27Q). Challans are prepared with correct assessment year and payment codes. You approve the challan amounts before payment.',
      visual: 'form',
      milestone: 'Challans ready for payment',
    },
    {
      step: 3,
      title: 'Challans paid - deposit confirmed',
      timeline: 'Day 6-7',
      body: 'You pay the TDS challans through net banking. Challan receipt with CIN (Challan Identification Number) is uploaded to your account. TDS must be deposited by 7th of the following month.',
      visual: 'stamp',
      milestone: 'TDS deposited on time',
    },
    {
      step: 4,
      title: 'Quarterly return filed (at quarter end)',
      timeline: 'Quarter end',
      body: 'At the end of each quarter, your CA files TDS returns - Form 24Q (salary), Form 26Q (non-salary). Returns consolidate all monthly deposits. Acknowledgement shared. Form 16/16A generation enabled.',
      visual: 'form',
      milestone: 'TDS return filed',
      isCompletion: true,
    },
  ],

  whatsIncluded: [
    {
      title: 'TDS calculation for all payment types',
      body: 'Salary TDS (Section 192), contractor payments (194C), professional fees (194J), rent (194I), interest (194A). Each has different rates and thresholds. We apply the correct rate automatically.',
      comparisonWithout: 'Guess the rate - risk under-deduction notice',
      comparisonWithOllvy: 'Correct TDS rate applied for every payment',
    },
    {
      title: 'Monthly challan preparation',
      body: 'TDS challan requires correct BSR code, assessment year, and tax type (TDS/TCS). Wrong entries cause mismatched credits for deductees. We prepare the challan - you just pay.',
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
      body: 'TDS returns are filed quarterly: Form 24Q (salary), Form 26Q (non-salary). Returns must match the challans deposited. Your CA reconciles deposits with return before filing.',
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
      body: 'Once quarterly returns are filed, Form 16 (salary TDS certificate) and Form 16A (non-salary TDS certificate) can be downloaded from TRACES. Your employees and vendors need these for their ITR.',
    },
  ],

  serviceRisks: [
    {
      icon: 'clock',
      title: 'Deposit due by 7th - not the 31st',
      body: 'TDS must be deposited by the 7th of the following month (March TDS by April 30). Late deposit incurs 1.5% per month interest from the date of deduction.',
    },
    {
      icon: 'document',
      title: 'Wrong TDS rate',
      body: 'Under-deducting makes you liable for the shortfall plus interest. We apply current applicable rates for each section.',
    },
    {
      icon: 'alert',
      title: 'Missing PAN of deductees',
      body: 'TDS at the higher rate of 20% applies if the deductee\'s PAN is not furnished. We flag missing PANs during data review.',
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

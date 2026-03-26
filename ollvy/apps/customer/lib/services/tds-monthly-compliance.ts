import { ServiceConfig } from '../services'
import { getNextGstrDueDate } from '../dates'

export const tdsMonthlyCompliance: ServiceConfig = {
  slug: 'tds-monthly-compliance',
  name: 'TDS Monthly Compliance',
  shortName: 'TDS Filing',
  category: 'Monthly Compliance',
  tagline: 'Deduct TDS. Deposit challan. File return. Every month, on time.',

  ollvyFee: 1999,
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
      title: 'Late deposit - interest accrues daily',
      body: 'TDS must be deposited by 7th of the following month. Late deposit: 1% per month interest from deduction date to deposit date. At ₹50,000 TDS, 2 months late = ₹1,000 interest.',
    },
    {
      icon: 'document',
      title: 'Wrong TDS rate applied',
      body: "Under-deducting TDS: you're liable for the shortfall plus interest. Over-deducting: the deductee complains. Professional fees (194J) is 10%, but contractors (194C) is 1%/2%. We apply the correct rate.",
    },
    {
      icon: 'alert',
      title: 'Return not filed - Form 16 blocked',
      body: "If quarterly return is not filed, Form 16/16A cannot be generated on TRACES. Your employees cannot claim TDS credit in their ITR. They'll call you in July asking for Form 16.",
    },
  ],

  profilePersonas: [
    {
      label: 'First time deducting TDS',
      detail: 'New to TDS compliance. We explain every section and threshold.',
    },
    {
      label: 'Have employees on salary',
      detail: '24Q filing for salary TDS. Form 16 generation enabled.',
    },
    {
      label: 'Paying contractors and professionals',
      detail: '26Q filing for contractor (194C) and professional (194J) payments.',
    },
    {
      label: 'Already have TDS backlog',
      detail: 'Missed filings. We calculate interest, file returns, regularize status.',
    },
  ],

  reviewKeywordChips: [
    '✓ Never missed 7th deadline',
    '✓ Form 16 ready on time',
    '✓ CA explained rates',
    '✓ Fixed monthly fee',
    '✓ No surprises',
  ],

  relatedSlugs: ['gst-monthly-filing', 'payroll-management', 'business-itr'],

  faqs: [
    {
      category: 'General',
      q: 'Who needs to deduct TDS?',
      a: "Any business making payments above threshold limits - salary to employees, rent above ₹2.4L/year, professional fees above ₹30,000, contractor payments above ₹30,000. If you're making these payments, you must deduct TDS.",
    },
    {
      category: 'General',
      q: 'What is the due date for TDS deposit?',
      a: '7th of the following month. March TDS is due April 7th. Salary TDS is due 7th. For March (last month of FY), government deductors have till April 30th.',
    },
    {
      category: 'Process',
      q: 'What is the difference between challan and return?',
      a: 'Challan is the monthly deposit of TDS amount to the government. Return is the quarterly declaration of all deductions and deposits. Both are mandatory. Challan is monthly, return is quarterly.',
    },
    {
      category: 'Process',
      q: 'Do I need a TAN?',
      a: "Yes. Tax Deduction Account Number (TAN) is mandatory for deducting TDS. If you don't have one, we can help you apply (separate service, ₹999). TAN application takes 3-5 days.",
    },
    {
      category: 'Documents',
      q: 'What data do I need to provide monthly?',
      a: 'Salary register with employee PAN, vendor payment list with PAN and payment amounts, rent payment details. We provide a simple template to fill. Takes 15 minutes per month.',
    },
    {
      category: 'After Completion',
      q: 'When do I get Form 16 for employees?',
      a: 'Form 16 is generated on TRACES after Q4 return (24Q) is filed. Due date is June 15 every year. We file Q4 by May 31 - Form 16 available by June 1.',
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

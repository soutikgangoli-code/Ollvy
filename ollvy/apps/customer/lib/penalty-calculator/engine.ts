/**
 * Penalty Calculator Engine
 * Core calculation logic for compliance risk assessment
 */

import {
  type CalculatorInputs,
  type CalculationResult,
  type PenaltyBreakdown,
  type RiskLevel,
  type ComplianceOption,
} from './types'
import {
  GST_LATE_FEE_PER_DAY,
  GST_INTEREST_RATE,
  MCA_LATE_FEE_PER_DAY,
  DIRECTOR_KYC_FLAT_PENALTY,
  ITR_LOW_PENALTY,
  ITR_HIGH_PENALTY,
  ITR_HIGH_PENALTY_THRESHOLD,
  ITR_INTEREST_RATE,
  TDS_LATE_FEE_PER_DAY,
  TDS_INTEREST_RATE,
  PF_INTEREST_RATE,
  PF_DEFAULT_PENALTY,
  PF_THRESHOLD_EMPLOYEES,
  ESIC_INTEREST_RATE,
  ESIC_DEFAULT_PENALTY,
  ESIC_THRESHOLD_EMPLOYEES,
  SERVICE_SLUGS,
  RISK_LEVEL_LOW_MAX,
  RISK_LEVEL_MEDIUM_MAX,
  RISK_LEVEL_HIGH_MAX,
} from './constants'

/**
 * Get the current Indian financial year (April to March)
 * Returns the calendar year in which the financial year starts
 * e.g., FY 2025-26 returns 2025
 */
function getCurrentFinancialYear(): number {
  const now = new Date()
  const currentMonth = now.getMonth() // 0-11
  const currentYear = now.getFullYear()

  // Financial year starts in April (month 3)
  // If we're in Jan-Mar, we're still in the previous FY
  return currentMonth < 3 ? currentYear - 1 : currentYear
}

/**
 * Get due dates for the current financial year
 * Dynamically calculates dates based on FY instead of hardcoding
 */
function getDueDates(): Record<string, string> {
  const fy = getCurrentFinancialYear()
  const nextYear = fy + 1

  return {
    // Annual compliances - due in the same calendar year as FY start
    'business-itr': `${fy}-10-31`, // October 31 of FY start year
    'gst-annual-return': `${fy}-12-31`, // December 31 of FY start year
    'director-kyc': `${fy}-09-30`, // September 30 of FY start year
    'mca-annual-filing': `${fy}-10-30`, // 30 days after AGM (assumed Sep 30)

    // Monthly compliances - use next month's date relative to current date
    // These are rolling dates, shown as example for the first month of FY
    'tds-monthly-compliance': getNextMonthlyDueDate(7), // 7th of following month
    'gst-monthly': getNextMonthlyDueDate(20), // 20th of following month
    'pf-compliance': getNextMonthlyDueDate(15), // 15th of following month
    'esic-compliance': getNextMonthlyDueDate(15), // 15th of following month
  }
}

/**
 * Get the next monthly due date for a compliance with a specific day
 */
function getNextMonthlyDueDate(dayOfMonth: number): string {
  const now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() + 1 // Next month

  // If we're past the due date this month, use next month
  if (now.getDate() >= dayOfMonth) {
    month++
  }

  // Handle year rollover
  if (month > 12) {
    month = 1
    year++
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`
}

// Get due dates dynamically
const DUE_DATES = getDueDates()

/**
 * Available compliance options based on business profile
 */
export const COMPLIANCE_OPTIONS: ComplianceOption[] = [
  {
    slug: 'gst',
    label: 'GST Filing (GSTR-3B / GSTR-1)',
    description: 'Monthly GST returns',
    condition: (inputs) => inputs.gstRegistered,
  },
  {
    slug: 'mca',
    label: 'MCA Annual Filing (AOC-4 + MGT-7)',
    description: 'Company annual returns',
    condition: (inputs) => ['pvt_ltd', 'llp'].includes(inputs.businessType),
  },
  {
    slug: 'director-kyc',
    label: 'Director KYC (DIR-3 KYC)',
    description: 'Annual director verification',
    condition: (inputs) => ['pvt_ltd', 'llp'].includes(inputs.businessType),
  },
  {
    slug: 'itr',
    label: 'Business ITR',
    description: 'Annual income tax return',
    condition: (inputs) => inputs.businessType !== 'not_registered',
  },
  {
    slug: 'tds',
    label: 'TDS Compliance',
    description: 'Monthly TDS deposits and quarterly returns',
    condition: (inputs) =>
      inputs.hasEmployees || ['pvt_ltd', 'llp', 'partnership'].includes(inputs.businessType),
  },
  {
    slug: 'pf',
    label: 'PF Compliance',
    description: 'Monthly PF contributions',
    condition: (inputs) => inputs.hasEmployees && inputs.employeeCount >= PF_THRESHOLD_EMPLOYEES,
  },
  {
    slug: 'esic',
    label: 'ESIC Compliance',
    description: 'Monthly ESIC contributions',
    condition: (inputs) => inputs.hasEmployees && inputs.employeeCount >= ESIC_THRESHOLD_EMPLOYEES,
  },
]

/**
 * Get applicable compliances based on business profile
 */
export function getApplicableCompliances(inputs: CalculatorInputs): ComplianceOption[] {
  return COMPLIANCE_OPTIONS.filter((option) => option.condition(inputs))
}

/**
 * Calculate GST filing penalty
 */
function calculateGstPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!inputs.gstRegistered) return null
  if (!inputs.selectedCompliances.includes('gst')) return null

  const penaltyAmount = GST_LATE_FEE_PER_DAY * inputs.daysLate
  // Interest on outstanding tax (18% annual, prorated)
  const interestAmount = Math.round(
    inputs.outstandingTax * GST_INTEREST_RATE * (inputs.daysLate / 365)
  )

  return {
    slug: 'gst',
    serviceName: 'GST Monthly Filing',
    dueDate: DUE_DATES['gst-monthly'],
    daysLate: inputs.daysLate,
    penaltyAmount,
    interestAmount,
    totalAmount: penaltyAmount + interestAmount,
    statute: 'CGST Act 2017, Section 47',
    explanation: `Late fee of ₹100/day per return (CGST+SGST combined). ${inputs.outstandingTax > 0 ? `Plus 18% annual interest on ₹${inputs.outstandingTax.toLocaleString('en-IN')} outstanding tax.` : ''}`,
    serviceSlug: SERVICE_SLUGS.gst,
  }
}

/**
 * Calculate MCA annual filing penalty
 */
function calculateMcaPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!['pvt_ltd', 'llp'].includes(inputs.businessType)) return null
  if (!inputs.selectedCompliances.includes('mca')) return null

  const penaltyAmount = MCA_LATE_FEE_PER_DAY * inputs.daysLate

  return {
    slug: 'mca',
    serviceName: 'MCA Annual Filing',
    dueDate: DUE_DATES['mca-annual-filing'],
    daysLate: inputs.daysLate,
    penaltyAmount,
    interestAmount: 0,
    totalAmount: penaltyAmount,
    statute: 'Companies Act 2013, Sections 92 and 137',
    explanation: 'AOC-4 due within 30 days of AGM, MGT-7 within 60 days. Both attract ₹100/day penalty (combined ₹200/day).',
    serviceSlug: SERVICE_SLUGS.mca,
  }
}

/**
 * Calculate Director KYC penalty
 */
function calculateDirectorKycPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!['pvt_ltd', 'llp'].includes(inputs.businessType)) return null
  if (!inputs.selectedCompliances.includes('director-kyc')) return null

  return {
    slug: 'director-kyc',
    serviceName: 'Director KYC (DIR-3 KYC)',
    dueDate: DUE_DATES['director-kyc'],
    daysLate: inputs.daysLate,
    penaltyAmount: DIRECTOR_KYC_FLAT_PENALTY,
    interestAmount: 0,
    totalAmount: DIRECTOR_KYC_FLAT_PENALTY,
    statute: 'Companies Act 2013, Section 155',
    explanation: 'Flat ₹5,000 penalty for late filing. DIN gets deactivated, blocking all MCA filings until DIR-3 KYC is filed.',
    serviceSlug: SERVICE_SLUGS.directorKyc,
  }
}

/**
 * Calculate Business ITR penalty
 */
function calculateItrPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (inputs.businessType === 'not_registered') return null
  if (!inputs.selectedCompliances.includes('itr')) return null

  // Penalty based on turnover
  const penaltyAmount = inputs.annualTurnover >= ITR_HIGH_PENALTY_THRESHOLD
    ? ITR_HIGH_PENALTY
    : ITR_LOW_PENALTY

  // Interest: 1% per month on outstanding tax
  const monthsLate = Math.ceil(inputs.daysLate / 30)
  const interestAmount = Math.round(inputs.outstandingTax * ITR_INTEREST_RATE * monthsLate)

  return {
    slug: 'itr',
    serviceName: 'Business ITR',
    dueDate: DUE_DATES['business-itr'],
    daysLate: inputs.daysLate,
    penaltyAmount,
    interestAmount,
    totalAmount: penaltyAmount + interestAmount,
    statute: 'Income Tax Act 1961, Section 234F',
    explanation: `Flat penalty of ₹${penaltyAmount.toLocaleString('en-IN')} for late filing${inputs.annualTurnover >= ITR_HIGH_PENALTY_THRESHOLD ? ' (turnover ≥ ₹5Cr)' : ' (turnover < ₹5Cr)'}. ${inputs.outstandingTax > 0 ? `Plus 1%/month interest on ₹${inputs.outstandingTax.toLocaleString('en-IN')} unpaid tax.` : ''}`,
    serviceSlug: SERVICE_SLUGS.itr,
  }
}

/**
 * Calculate TDS penalty
 */
function calculateTdsPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  const applicable = inputs.hasEmployees || ['pvt_ltd', 'llp', 'partnership'].includes(inputs.businessType)
  if (!applicable) return null
  if (!inputs.selectedCompliances.includes('tds')) return null

  const penaltyAmount = TDS_LATE_FEE_PER_DAY * inputs.daysLate
  // 1.5% per month on outstanding TDS
  const monthsLate = Math.ceil(inputs.daysLate / 30)
  const interestAmount = Math.round(inputs.outstandingTax * TDS_INTEREST_RATE * monthsLate)

  return {
    slug: 'tds',
    serviceName: 'TDS Compliance',
    dueDate: DUE_DATES['tds-monthly-compliance'],
    daysLate: inputs.daysLate,
    penaltyAmount,
    interestAmount,
    totalAmount: penaltyAmount + interestAmount,
    statute: 'Income Tax Act 1961, Section 234E',
    explanation: `₹200/day late fee for delayed 24Q/26Q return. ${inputs.outstandingTax > 0 ? `Plus 1.5%/month interest on ₹${inputs.outstandingTax.toLocaleString('en-IN')} late TDS deposit.` : ''} 40% expense disallowance possible.`,
    serviceSlug: SERVICE_SLUGS.tds,
  }
}

/**
 * Calculate PF penalty
 */
function calculatePfPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!inputs.hasEmployees || inputs.employeeCount < PF_THRESHOLD_EMPLOYEES) return null
  if (!inputs.selectedCompliances.includes('pf')) return null

  // Estimate monthly PF contribution (basic salary ≈ ₹15,000/employee × 12% × employees)
  const estimatedMonthlyPf = Math.round(15000 * 0.12 * inputs.employeeCount)
  const interestAmount = Math.round(estimatedMonthlyPf * PF_INTEREST_RATE * (inputs.daysLate / 365))

  return {
    slug: 'pf',
    serviceName: 'PF Compliance',
    dueDate: DUE_DATES['pf-compliance'],
    daysLate: inputs.daysLate,
    penaltyAmount: PF_DEFAULT_PENALTY,
    interestAmount,
    totalAmount: PF_DEFAULT_PENALTY + interestAmount,
    statute: 'EPF Act 1952, Section 14B',
    explanation: `₹5,000 flat penalty per default event. Plus 12% annual interest on delayed PF contributions (~₹${estimatedMonthlyPf.toLocaleString('en-IN')}/month estimated).`,
    serviceSlug: SERVICE_SLUGS.pf,
  }
}

/**
 * Calculate ESIC penalty
 */
function calculateEsicPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!inputs.hasEmployees || inputs.employeeCount < ESIC_THRESHOLD_EMPLOYEES) return null
  if (!inputs.selectedCompliances.includes('esic')) return null

  // Estimate monthly ESIC contribution (gross salary ≈ ₹18,000/employee × 4% × employees)
  const estimatedMonthlyEsic = Math.round(18000 * 0.04 * inputs.employeeCount)
  const interestAmount = Math.round(estimatedMonthlyEsic * ESIC_INTEREST_RATE * (inputs.daysLate / 365))

  return {
    slug: 'esic',
    serviceName: 'ESIC Compliance',
    dueDate: DUE_DATES['esic-compliance'],
    daysLate: inputs.daysLate,
    penaltyAmount: ESIC_DEFAULT_PENALTY,
    interestAmount,
    totalAmount: ESIC_DEFAULT_PENALTY + interestAmount,
    statute: 'ESI Act 1948, Section 85',
    explanation: `₹5,000 flat penalty per default. Plus 12% annual interest on delayed ESIC contributions (~₹${estimatedMonthlyEsic.toLocaleString('en-IN')}/month estimated).`,
    serviceSlug: SERVICE_SLUGS.esic,
  }
}

/**
 * Determine risk level based on total exposure
 */
function getRiskLevel(totalExposure: number): RiskLevel {
  if (totalExposure <= RISK_LEVEL_LOW_MAX) return 'low'
  if (totalExposure <= RISK_LEVEL_MEDIUM_MAX) return 'medium'
  if (totalExposure <= RISK_LEVEL_HIGH_MAX) return 'high'
  return 'critical'
}

/**
 * Main calculation function
 */
export function calculatePenalties(inputs: CalculatorInputs): CalculationResult {
  const penalties: PenaltyBreakdown[] = []

  // Calculate each applicable penalty
  const gstPenalty = calculateGstPenalty(inputs)
  if (gstPenalty) penalties.push(gstPenalty)

  const mcaPenalty = calculateMcaPenalty(inputs)
  if (mcaPenalty) penalties.push(mcaPenalty)

  const directorKycPenalty = calculateDirectorKycPenalty(inputs)
  if (directorKycPenalty) penalties.push(directorKycPenalty)

  const itrPenalty = calculateItrPenalty(inputs)
  if (itrPenalty) penalties.push(itrPenalty)

  const tdsPenalty = calculateTdsPenalty(inputs)
  if (tdsPenalty) penalties.push(tdsPenalty)

  const pfPenalty = calculatePfPenalty(inputs)
  if (pfPenalty) penalties.push(pfPenalty)

  const esicPenalty = calculateEsicPenalty(inputs)
  if (esicPenalty) penalties.push(esicPenalty)

  // Sum up totals
  const totalPenalty = penalties.reduce((sum, p) => sum + p.penaltyAmount, 0)
  const totalInterest = penalties.reduce((sum, p) => sum + p.interestAmount, 0)
  const totalExposure = totalPenalty + totalInterest

  return {
    totalPenalty,
    totalInterest,
    totalExposure,
    riskLevel: getRiskLevel(totalExposure),
    penalties,
  }
}

/**
 * Format currency in Indian style
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

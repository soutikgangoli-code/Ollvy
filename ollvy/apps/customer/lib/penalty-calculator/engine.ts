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
 */
function getCurrentFinancialYear(): number {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  return currentMonth < 3 ? currentYear - 1 : currentYear
}

/**
 * Get due dates dynamically based on current financial year
 */
function getDueDates(): Record<string, string> {
  const fy = getCurrentFinancialYear()

  return {
    'business-itr': `${fy}-10-31`,
    'gst-annual-return': `${fy}-12-31`,
    'director-kyc': `${fy}-09-30`,
    'mca-annual-filing': `${fy}-10-30`,
    'tds-monthly-compliance': getNextMonthlyDueDate(7),
    'gst-monthly': getNextMonthlyDueDate(20),
    'pf-compliance': getNextMonthlyDueDate(15),
    'esic-compliance': getNextMonthlyDueDate(15),
  }
}

function getNextMonthlyDueDate(dayOfMonth: number): string {
  const now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() + 1

  if (now.getDate() >= dayOfMonth) {
    month++
  }

  if (month > 12) {
    month = 1
    year++
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`
}

const DUE_DATES = getDueDates()

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

export function getApplicableCompliances(inputs: CalculatorInputs): ComplianceOption[] {
  return COMPLIANCE_OPTIONS.filter((option) => option.condition(inputs))
}

function calculateGstPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!inputs.gstRegistered) return null
  if (!inputs.selectedCompliances.includes('gst')) return null

  // Rs. 50/day combined per CBIC Notification 19/2021 (non-nil returns)
  const penaltyAmount = GST_LATE_FEE_PER_DAY * inputs.daysLate
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
    statute: 'Section 47, CGST Act 2017 (late fee) + Section 50 (interest on unpaid tax)',
    explanation: `Rs. 50/day late fee (Rs. 25 CGST + Rs. 25 SGST) per CBIC Notification 19/2021.${inputs.outstandingTax > 0 ? ` Plus 18% annual interest on Rs. ${inputs.outstandingTax.toLocaleString('en-IN')} unpaid tax (Section 50).` : ''}`,
    serviceSlug: SERVICE_SLUGS.gst,
  }
}

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
    statute: 'Companies Act 2013, Section 92 (MGT-7) and Section 137 (AOC-4)',
    explanation: 'AOC-4 due 30 days after AGM (Section 137), MGT-7 due 60 days after AGM (Section 92). Rs. 100/day per form - Rs. 200/day if both are overdue.',
    serviceSlug: SERVICE_SLUGS.mca,
  }
}

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
    statute: 'Companies Act 2013, Rule 12A',
    explanation: 'Rs. 5,000 reactivation fee per director. DIN deactivates automatically if triennial KYC is not filed by the due date (currently June 30, 2028), blocking all MCA filings for the company.',
    serviceSlug: SERVICE_SLUGS.directorKyc,
  }
}

function calculateItrPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (inputs.businessType === 'not_registered') return null
  if (!inputs.selectedCompliances.includes('itr')) return null

  const penaltyAmount = inputs.annualTurnover >= ITR_HIGH_PENALTY_THRESHOLD
    ? ITR_HIGH_PENALTY
    : ITR_LOW_PENALTY

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
    statute: 'Income Tax Act 1961, Section 234F (late fee) + Section 234A (interest)',
    explanation: `Rs. ${penaltyAmount.toLocaleString('en-IN')} late filing fee under Section 234F${inputs.annualTurnover >= ITR_HIGH_PENALTY_THRESHOLD ? ' (turnover above Rs. 5 crore)' : ''}.${inputs.outstandingTax > 0 ? ` Plus 1% per month interest on Rs. ${inputs.outstandingTax.toLocaleString('en-IN')} unpaid tax under Section 234A.` : ''}`,
    serviceSlug: SERVICE_SLUGS.itr,
  }
}

function calculateTdsPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  const applicable = inputs.hasEmployees || ['pvt_ltd', 'llp', 'partnership'].includes(inputs.businessType)
  if (!applicable) return null
  if (!inputs.selectedCompliances.includes('tds')) return null

  const penaltyAmount = TDS_LATE_FEE_PER_DAY * inputs.daysLate
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
    statute: 'Income Tax Act 1961, Section 234E (late return) + Section 201(1A) (late deposit)',
    explanation: `Rs. 200/day under Section 234E for late TDS return filing.${inputs.outstandingTax > 0 ? ` Plus 1.5% per month interest on Rs. ${inputs.outstandingTax.toLocaleString('en-IN')} in late TDS deposit (Section 201(1A)).` : ''} If TDS was not deducted at all: 30% of that payment is disallowed as a business expense under Section 40(a)(ia).`,
    serviceSlug: SERVICE_SLUGS.tds,
  }
}

function calculatePfPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!inputs.hasEmployees || inputs.employeeCount < PF_THRESHOLD_EMPLOYEES) return null
  if (!inputs.selectedCompliances.includes('pf')) return null

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
    explanation: `PF damages under Section 14B (EPF Act). Rate depends on default period: under 2 months = 5% p.a., 2-4 months = 10% p.a., 4-6 months = 15% p.a., above 6 months = 25% p.a. Estimated monthly PF: Rs. ${estimatedMonthlyPf.toLocaleString('en-IN')}.`,
    serviceSlug: SERVICE_SLUGS.pf,
  }
}

function calculateEsicPenalty(inputs: CalculatorInputs): PenaltyBreakdown | null {
  if (!inputs.hasEmployees || inputs.employeeCount < ESIC_THRESHOLD_EMPLOYEES) return null
  if (!inputs.selectedCompliances.includes('esic')) return null

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
    statute: 'ESI Act 1948, Section 85B',
    explanation: `12% annual interest on delayed ESIC contributions under Section 85B (ESI Act). Estimated monthly ESIC: Rs. ${estimatedMonthlyEsic.toLocaleString('en-IN')}.`,
    serviceSlug: SERVICE_SLUGS.esic,
  }
}

function getRiskLevel(totalExposure: number): RiskLevel {
  if (totalExposure <= RISK_LEVEL_LOW_MAX) return 'low'
  if (totalExposure <= RISK_LEVEL_MEDIUM_MAX) return 'medium'
  if (totalExposure <= RISK_LEVEL_HIGH_MAX) return 'high'
  return 'critical'
}

export function calculatePenalties(inputs: CalculatorInputs): CalculationResult {
  const penalties: PenaltyBreakdown[] = []

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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

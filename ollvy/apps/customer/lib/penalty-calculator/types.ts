/**
 * Penalty Calculator Types
 * TypeScript interfaces for the compliance risk calculator
 */

export type BusinessType = 'pvt_ltd' | 'llp' | 'partnership' | 'sole_proprietor' | 'not_registered'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface CalculatorInputs {
  businessType: BusinessType
  gstRegistered: boolean
  annualTurnover: number // in lakhs
  hasEmployees: boolean
  employeeCount: number
  daysLate: number
  outstandingTax: number // in rupees
  selectedCompliances: string[] // slugs of selected compliances
}

export interface PenaltyBreakdown {
  slug: string
  serviceName: string
  dueDate: string | null
  daysLate: number
  penaltyAmount: number
  interestAmount: number
  totalAmount: number
  statute: string
  explanation: string
  serviceSlug: string // for the "Fix This" button link
}

export interface CalculationResult {
  totalPenalty: number
  totalInterest: number
  totalExposure: number
  riskLevel: RiskLevel
  penalties: PenaltyBreakdown[]
}

export interface ComplianceOption {
  slug: string
  label: string
  description: string
  condition: (inputs: CalculatorInputs) => boolean
}

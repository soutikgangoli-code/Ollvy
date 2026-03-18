/**
 * Service Configuration Library
 *
 * Per spec §18 - Service Detail Pages
 * Each service has a comprehensive config that powers the service detail page.
 */

import { ReactNode } from 'react'

export type ServiceCategory =
  | 'Registrations'
  | 'Licensing'
  | 'Monthly Compliance'
  | 'Tax Filings'
  | 'Payroll'
  | 'Legal'

export interface ProcessStep {
  step: number
  title: string
  timeline: string // "Day 1-2"
  body: string
  milestone?: string // "ARN generated and shared with you"
  isCompletion?: boolean // true on final step
  visual?: 'checklist' | 'upload' | 'form' | 'calendar' | 'stamp' // icon type for stepper
}

export interface WhatsIncludedItem {
  title: string
  body: string
  comparisonWithout?: string // "CA asks for docs over WhatsApp, no tracking"
  comparisonWithOllvy?: string // "Documents collected in app, all stored permanently"
  mockVisualType?: 'receipt' | 'status' | 'checklist' | 'calendar' | 'arn' // for mini mock UIs
  mockVisualData?: Record<string, string> // data to populate the mock
}

export interface ServiceRisk {
  icon: 'clock' | 'mismatch' | 'document' | 'building' | 'alert'
  title: string
  body: string
}

export interface ProfilePersona {
  label: string // "Missed last year's ITR"
  detail: string // "We handle penalty calculation and belated filing"
}

export interface ServiceFaq {
  category: string // "General" | "Process" | "Documents" | "After Completion"
  q: string
  a: string
}

export interface ReviewSource {
  name: string
  url: string
  description: string
}

export interface UnlockItem {
  name: string
  explanation: string
  price: string
  type: 'required' | 'beneficial'
  slug: string // link to service page
}

export interface ServiceConfig {
  // Core identity
  slug: string
  name: string // "Private Limited Incorporation"
  shortName: string // "Pvt Ltd" - used in sticky bar, chips
  category: ServiceCategory
  tagline: string // "One registration. Every door opens."

  // Pricing - ALL collected upfront. Separate line items for transparency.
  ollvyFee: number // 9999
  govtFee?: number // 15000 - if applicable
  govtFeeLabel?: string // "MCA stamp duty (approx)"
  govtFeeNote?: string // "This fee goes directly to the government..."

  // SLA
  slaDays: number // 15 - working days
  isRetainer: boolean
  retainerCycleLabel?: string // "per month" - shown on price
  nextDueDate?: () => string // for retainers - dynamic due date

  // Service metadata (shown in hero metadata row)
  mandatoryFor: string // "All Pvt Ltd companies"
  serviceType: 'One-time' | 'Annual' | 'Monthly retainer'
  legalBasis?: string // "Companies Act 2013, Section 7"
  penaltyForMissing?: string // "₹100/day, max ₹1,00,000"
  penaltyColor: 'amber' | 'red' | 'none'

  // SEO
  seoTitle: string
  seoDescription: string
  canonicalUrl: string

  // Content - all defined per service
  processSteps: ProcessStep[]
  whatsIncluded: WhatsIncludedItem[]
  serviceRisks: ServiceRisk[] // 2-3 items
  profilePersonas: ProfilePersona[] // "We handle messy situations too"
  faqs: ServiceFaq[]
  reviewKeywordChips: string[]
  relatedSlugs: string[]
  reviewSources: ReviewSource[]
  unlocks?: UnlockItem[] // "What this service unlocks"

  // Feature flags
  showCompletionStats: boolean // false until 10+ orders
  showApprovalRate: boolean // false until 20+ orders
}

// Import all service configs
import { pvtLtdIncorporation } from './services/pvt-ltd-incorporation'
import { gstRegistration } from './services/gst-registration'
import { businessItr } from './services/business-itr'
import { directorKyc } from './services/director-kyc'
import { gstMonthlyFiling } from './services/gst-monthly-filing'
import { trademarkRegistration } from './services/trademark-registration'
import { llpIncorporation } from './services/llp-incorporation'
import { fssaiLicense } from './services/fssai-license'
import { iecCode } from './services/iec-code'
import { mcaAnnualFiling } from './services/mca-annual-filing'
import { tdsMonthlyCompliance } from './services/tds-monthly-compliance'
import { payrollManagement } from './services/payroll-management'

// Export all services
export const SERVICES: ServiceConfig[] = [
  // Registrations
  pvtLtdIncorporation,
  llpIncorporation,
  gstRegistration,
  directorKyc,
  trademarkRegistration,
  // Licensing
  fssaiLicense,
  iecCode,
  // Tax Filings
  businessItr,
  mcaAnnualFiling,
  // Monthly Compliance
  gstMonthlyFiling,
  tdsMonthlyCompliance,
  // Payroll
  payrollManagement,
]

// Alias for backwards compatibility (existing code uses SERVICE_CONFIGS)
export const SERVICE_CONFIGS = SERVICES

// Helper to get service by slug
export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return SERVICES.find((s) => s.slug === slug)
}

// Helper to get services by category
export function getServicesByCategory(category: ServiceCategory): ServiceConfig[] {
  return SERVICES.filter((s) => s.category === category)
}

// Helper to get related services
export function getRelatedServices(service: ServiceConfig): ServiceConfig[] {
  return service.relatedSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is ServiceConfig => s !== undefined)
}

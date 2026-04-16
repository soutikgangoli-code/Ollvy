# Unified Service Pages — Complete Content Dump

> Generated for redesign spec. Contains: TypeScript schemas, all active service data from Supabase, JSX templates, and shared subcomponents.

---

## 1. TypeScript Schemas / Interfaces

### 1A. `lib/services.ts` — Legacy ServiceConfig Interface

```typescript
/**
 * Service Configuration Library (LEGACY - Static Configs)
 *
 * Per spec §18 - Service Detail Pages
 *
 * ⚠️  IMPORTANT: This file contains STATIC service configs for backwards compatibility.
 * The PRIMARY source of truth for services is the DATABASE (service_packages table).
 *
 * To check what services exist:
 * - Database slugs: See FALLBACK_SERVICE_SLUGS in lib/data/services.ts
 * - Database fetch: Use getServiceBySlugFromDB() from lib/data/services.ts
 *
 * Common slug mistakes to avoid:
 * - 'startup-india-dpiit' -> correct: 'startup-india'
 * - 'msme-udyam' -> correct: 'msme-registration'
 * - 'gst-monthly-filing' or 'gst-monthly-50l' -> correct: 'gst-monthly'
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
import { gstCancellation } from './services/gst-cancellation'
import { gstRevocation } from './services/gst-revocation'
import { companyNameChange } from './services/company-name-change'
import { dinReactivation } from './services/din-reactivation'

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
  // New services
  gstCancellation,
  gstRevocation,
  companyNameChange,
  dinReactivation,
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
```

### 1B. `lib/services/types.ts` — ServicePageConfig Interface (Static Page Configs)

```typescript
// lib/services/types.ts

export type ServiceCategory =
  | 'Incorporation'
  | 'GST'
  | 'Tax'
  | 'Compliance'
  | 'Trademark'
  | 'Registration'
  | 'Payroll'
  | 'Licensing'

export interface ServiceTable {
  caption: string
  headers: string[]
  rows: string[][]
}

export interface WorkflowStep {
  step: number
  title: string
  timeframe: string           // e.g. "Day 0-2"
  description: string
  milestone: string           // what gets delivered at this step
}

export interface IncludedItem {
  title: string
  description: string
  without?: string            // what you face without Ollvy
  withOllvy?: string          // what Ollvy delivers instead
}

export interface ServiceRisk {
  title: string
  description: string
}

export interface ServicePersona {
  title: string
  description: string
}

export interface ServiceFaq {
  category: string            // "General" | "Process" | "Documents" | "After Completion" | "Pricing"
  q: string
  a: string
}

export interface ServicePageConfig {
  slug: string
  title: string               // H1
  tagline: string             // one line under H1
  seoTitle: string            // <title> tag - keyword + year + brand
  seoDescription: string      // meta description - 150-160 chars, answer-first
  canonicalUrl: string
  lastReviewed: string
  category: ServiceCategory

  explainer: {
    whatItIs: string
    whyYouNeedIt: string
    whatHappensWithout: string
  }

  workflow: WorkflowStep[]
  included: IncludedItem[]
  risks: ServiceRisk[]
  personas: ServicePersona[]  // "Who this is for"
  faqs: ServiceFaq[]

  // SEO tables - rendered as structured HTML tables on the page
  govtFees: ServiceTable      // government fees only - Ollvy fee from backend
  documents: ServiceTable     // documents required

  // Internal linking
  relatedServiceSlugs?: string[]
  relatedLearnSlugs?: string[]
}
```

### 1C. `lib/types.ts` — ServicePackage, ServiceVariant, ServiceAddon, Order Types

```typescript
// Service types

// WorkflowStage for order tracking (used in OrderTimeline)
export interface WorkflowStage {
  stage_key: string
  stage_name: string
  sla_working_days: number
  wait_for_govt?: boolean
}

// WorkflowDisplayStage for checkout timeline display (from service_packages.workflow_stages)
export interface WorkflowDisplayStage {
  step: number
  title: string
  timeline: string
  body: string
  visual?: string
  milestone?: string
  isCompletion?: boolean
  stage_key?: string // Added by Step 1d migration for work documents filtering
}

export interface ServiceAddon {
  id: string
  name: string
  description: string
  pricePaisa: number
  govtFeePaisa: number
  required: boolean
  defaultSelected: boolean
}

export interface ServicePackage {
  id: string
  slug: string
  name: string
  short_description: string
  long_description?: string
  filter_category_id?: string
  filter_category?: {
    name: string
    icon_name?: string
  }
  tier_group_id?: string
  tier_label?: string
  order_type: 'one_time' | 'recurring'
  billing_cycle: 'one_time' | 'monthly' | 'quarterly' | 'yearly'
  price_base_paisa: number
  price_govt_fees_paisa: number
  price_gst_rate: number
  price_display_note?: string
  price_varies_by_state: boolean
  sla_working_days: number
  situation_tags: string[]
  workflow_stages: WorkflowDisplayStage[]
  urgency_score: number
  avg_rating?: number
  rating_count: number
  display_order: number
  is_active: boolean
  is_bundle?: boolean
  variants?: ServiceVariant[]
  addons?: ServiceAddon[]
  scope_included: string[]
  scope_excluded: string[]
  image_url?: string
  icon_name?: string
  created_at: string
  updated_at: string
  // Completion estimate fields for accurate timeline display
  has_govt_processing?: boolean
  completion_min_days?: number | null
  completion_max_days?: number | null
  completion_range_text?: string | null
}

export interface FilterCategory {
  id: string
  name: string
  slug: string
  icon_name?: string
  display_order: number
  is_active: boolean
}

// Order types
export type OrderStatus =
  | 'pending_payment'
  | 'pending_assignment'
  | 'waitlisted'
  | 'in_progress'
  | 'completed'
  | 'disputed'
  | 'cancelled'

export interface OrderStageHistory {
  id: string
  order_id: string
  stage_key: string
  stage_name: string
  completed_at?: string
  due_at?: string
  sla_breached: boolean
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  professional_id?: string
  service_package_id: string
  chat_conversation_id?: string
  order_type: 'one_time' | 'recurring'
  status: OrderStatus
  city: string
  price_base_paisa_snapshot: number
  price_govt_fees_paisa_snapshot: number
  price_gst_paisa_snapshot: number
  pro_discount_paisa_snapshot: number
  promo_discount_paisa_snapshot: number
  total_paisa_snapshot: number
  payment_paused: boolean
  force_assigned: boolean
  govt_fees_paid_paisa: number
  govt_fee_receipt_path?: string
  govt_fee_reimbursement_status?: string
  promo_code_used?: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  feedback_given: boolean
  feedback_skipped: boolean
  engagement_agreed_at?: string
  variant_id?: string
  questionnaire_completed_at?: string
  questionnaire_step?: number
  completed_at?: string
  created_at: string
  updated_at: string
  // Joined data
  service_package?: ServicePackage
  order_addons?: OrderAddon[]
  order_documents?: OrderDocument[]
  professional?: Professional
  stage_history?: OrderStageHistory[]
}

export interface Professional {
  id: string
  full_name: string
  phone: string
  email: string
  professional_type: string
  bio?: string
  experience_years?: number
  avatar_url?: string
  avg_rating?: number
}

// Quote types
export type QuoteStatus = 'pending' | 'quoted' | 'accepted' | 'expired' | 'cancelled'

export interface QuoteRequest {
  id: string
  user_id: string
  service_package_id: string
  submitted_details: {
    state: string
    city: string
    requirements?: string
    business_name?: string
    gst_registered?: boolean
  }
  status: QuoteStatus
  confirmed_price_paisa?: number
  confirmed_govt_fees_paisa?: number
  quoted_at?: string
  expires_at?: string
  created_at: string
  service_package?: ServicePackage
}

// Chat types
export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string | null
  sender_type: 'user' | 'professional' | 'system'
  content: string
  message_type: 'text' | 'file' | 'system'
  file_path?: string
  file_name?: string
  file_size?: number
  file_url?: string
  read_at?: string
  created_at: string
}

// Retainer types
export type RetainerStatus = 'active' | 'paused' | 'cancelled' | 'onboarding' | 'payment_failed'

export interface RetainerSubscription {
  id: string
  user_id: string
  professional_id?: string
  tier_group_id: string
  tier_id: string
  status: RetainerStatus
  hours_per_month: number
  price_per_month_paisa: number
  current_cycle_start: string
  current_cycle_end: string
  hours_used_this_cycle: number
  razorpay_subscription_id?: string
  cancelled_at?: string
  paused_at?: string
  created_at: string
  service_package?: ServicePackage
  professional?: Professional
}

// Service variant types
export interface ServiceVariant {
  id: string
  label: string
  sublabel: string
  priceAdjustment?: number
  govtFeeAdjustment?: number
}

// Order document types
export interface OrderDocument {
  id: string
  order_id: string
  document_key: string
  document_label: string
  stage_key?: string
  is_required: boolean
  uploaded_at?: string
  file_url?: string
  file_name?: string
  verified_at?: string
  verified_by?: string
  rejection_reason?: string
  created_at: string
}

// Order addon types
export interface OrderAddon {
  id: string
  order_id: string
  addon_id: string
  addon_name: string
  price_paisa_snapshot: number
  govt_fee_paisa_snapshot: number
  created_at: string
}

// Work document types (documents exchanged during work process)
export type WorkDocumentDirection = 'to_customer' | 'from_customer'
export type WorkDocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected'

export interface OrderWorkDocument {
  id: string
  order_id: string
  professional_id?: string
  direction: WorkDocumentDirection
  document_key?: string
  document_label: string
  description?: string
  stage_key?: string
  status: WorkDocumentStatus
  file_url?: string
  file_name?: string
  due_date?: string
  uploaded_at?: string
  uploaded_by_type?: 'professional' | 'customer' | 'admin'
  verified_at?: string
  verified_by?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
  // Admin rounds fields
  round_id?: string
  tag?: 'for_signing' | 'government_processing' | 'final_output' | 'informational'
  linked_request_id?: string
  skipped_at?: string
  skip_reason?: string
}

// User types
export interface User {
  id: string
  auth_user_id: string
  phone: string
  business_name?: string
  business_type?: string
  gstin?: string
  state?: string
  city?: string
  address?: string
  subscription_tier: 'free' | 'pro'
  compliance_health_score: number
  profile_completeness_score: number
  is_returning: boolean
  avatar_url?: string
  referral_code: string
  referral_credit_paisa: number
  referral_credit_balance_paisa: number
  preferred_professional_id?: string
  created_at: string
}

// Admin rounds types
export type OrderRoundStatus = 'pending' | 'awaiting_user' | 'active' | 'completed'

export interface OrderRound {
  id: string
  order_id: string
  created_by_admin_id?: string
  round_number: number
  title: string
  status: OrderRoundStatus
  is_visible_to_user: boolean
  created_at: string
  completed_at?: string
  // Nested data from joins
  round_question_requests?: RoundQuestionRequest[]
  order_work_documents?: OrderWorkDocument[]
}

export interface RoundQuestionRequest {
  id: string
  round_id: string
  question_text: string
  answer_text?: string
  answered_at?: string
  position: number
  created_at: string
}

export interface RoundNotification {
  id: string
  order_id: string
  round_id?: string
  message: string
  is_dismissed: boolean
  dismissed_at?: string
  created_at: string
}

export interface OrderAdminNote {
  id: string
  order_id: string
  admin_id?: string
  content: string
  created_at: string
  // Joined data
  admin_users?: { name: string }
}

export interface OrderActivityLog {
  id: string
  order_id: string
  action_type: string
  actor_type: 'admin' | 'system' | 'user'
  actor_id?: string
  actor_name: string
  description: string
  metadata?: Record<string, any>
  created_at: string
}

export interface OrderAdminAssignmentHistory {
  id: string
  order_id: string
  assigned_to_admin_id?: string
  assigned_by_admin_id?: string
  assigned_to_name: string
  assigned_by_name: string
  assigned_at: string
  unassigned_at?: string
}

export interface OrderProfessionalAssignmentHistory {
  id: string
  order_id: string
  professional_id?: string
  assigned_by_admin_id?: string
  professional_name: string
  assigned_by_name: string
  assigned_at: string
  unassigned_at?: string
}
```

### 1D. `lib/data/services.ts` — DBServiceConfig Interface + Data Fetching Layer

```typescript
/**
 * Service Data Fetching Layer
 * Per §23 - Backend Bridge: Landing Site ↔ Supabase
 *
 * Connection Point 1 (Service Grid) and Connection Point 2 (Service Detail Page)
 *
 * ALL service data is now stored in the database and editable.
 */

import { supabaseServer } from '../supabase-server'

// Frontend service card data
export interface ServiceCardData {
  id: string
  slug: string
  name: string
  category: string
  description: string
  ollvyFee: number
  govtFee: number
  slaDays: number
  isRetainer: boolean
  avgRating: number | null
  totalRatings: number
  isBundle?: boolean
}

// Pricing overlay for static config (legacy)
export interface ServicePricingData {
  id: string
  ollvyFee: number
  govtFee: number
  slaDays: number
  isRetainer: boolean
  avgRating: number | null
  totalRatings: number
  scopeIncluded: string[]
  scopeExcluded: string[]
  priceVariesByState: boolean
}

// Review data
export interface ServiceReview {
  rating: number
  comment: string | null
  created_at: string
}

// Process step from DB
export interface DBProcessStep {
  step: number
  title: string
  timeline: string
  body: string
  milestone?: string
  isCompletion?: boolean
  visual?: 'checklist' | 'upload' | 'form' | 'calendar' | 'stamp'
}

// What's included item from DB
export interface DBWhatsIncludedItem {
  title: string
  body: string
  comparisonWithout?: string
  comparisonWithOllvy?: string
  mockVisualType?: 'receipt' | 'status' | 'checklist' | 'calendar' | 'arn'
  mockVisualData?: Record<string, string>
}

// Service risk from DB
export interface DBServiceRisk {
  icon: 'clock' | 'mismatch' | 'document' | 'building' | 'alert'
  title: string
  body: string
}

// Profile persona from DB
export interface DBProfilePersona {
  label: string
  detail: string
}

// FAQ from DB
export interface DBServiceFaq {
  category: string
  q: string
  a: string
}

// Review source from DB
export interface DBReviewSource {
  name: string
  url: string
  description: string
}

// Unlock item from DB
export interface DBUnlockItem {
  name: string
  explanation: string
  price: string
  type: 'required' | 'beneficial'
  slug: string
}

// Service explainer step from DB
export interface DBServiceExplainerStep {
  step: number
  title: string      // "What it is", "Why it exists", etc.
  body: string       // Detailed explanation
  visual?: 'info' | 'scale' | 'sparkles' | 'shield' | 'alert'  // Icon type
}

// Service explainer from DB
export interface DBServiceExplainer {
  steps: DBServiceExplainerStep[]
}

// Service variant for pricing options (e.g., FSSAI Basic vs State)
export interface DBServiceVariant {
  id: string              // 'fssai-basic' | 'fssai-state'
  label: string           // 'Under ₹12L/year' | '₹12L - ₹20Cr/year'
  sublabel: string        // 'FSSAI Basic Registration' | 'FSSAI State License'
  priceAdjustment: number // Price adjustment in paisa (negative for cheaper, 0 for base)
  govtFeeAdjustment: number // Govt fee adjustment in paisa
}

// Service addon for bundle customization (selectable sub-services)
export interface DBServiceAddon {
  id: string              // 'gst-registration' | 'shop-establishment' | 'trade-license'
  name: string            // 'GST Registration'
  description: string     // Short description of the addon
  pricePaisa: number      // Ollvy fee in paisa
  govtFeePaisa: number    // Government fee in paisa (0 if none)
  required: boolean       // If true, cannot be deselected
  defaultSelected: boolean // Initial selection state
}

// Complete service config from database (no static config needed)
export interface DBServiceConfig {
  // Core identity
  id: string
  slug: string
  name: string
  shortName: string
  category: string
  tagline: string

  // Pricing
  ollvyFee: number
  govtFee?: number
  govtFeeLabel?: string
  govtFeeNote?: string

  // SLA
  slaDays: number
  isRetainer: boolean
  retainerCycleLabel?: string
  nextDueDateValue?: string // Pre-computed for retainers

  // Service metadata
  mandatoryFor: string
  serviceType: 'One-time' | 'Annual' | 'Monthly retainer'
  legalBasis?: string
  penaltyForMissing?: string
  penaltyColor: 'amber' | 'red' | 'none'

  // SEO
  seoTitle: string
  seoDescription: string
  canonicalUrl: string

  // Rating
  avgRating: number | null
  totalRatings: number
  priceVariesByState: boolean

  // Content arrays (from JSONB)
  processSteps: DBProcessStep[]
  whatsIncluded: DBWhatsIncludedItem[]
  serviceRisks: DBServiceRisk[]
  profilePersonas: DBProfilePersona[]
  faqs: DBServiceFaq[]
  reviewSources: DBReviewSource[]
  unlocks: DBUnlockItem[]
  reviewKeywordChips: string[]
  relatedSlugs: string[]

  // Feature flags
  showCompletionStats: boolean
  showApprovalRate: boolean

  // Service variants (optional, for services with pricing options)
  variants?: DBServiceVariant[]
  defaultVariantId?: string

  // Service-specific comparison (optional, for Why Ollvy section)
  comparisonWithout?: string[]
  comparisonWith?: string[]

  // Service addons (optional, for bundle customization)
  addons?: DBServiceAddon[]

  // Bundle flag
  isBundle?: boolean

  // Service explainer (optional, for "What is [Service]?" section)
  serviceExplainer?: DBServiceExplainer

  // Completion estimate fields (for govt processing services)
  hasGovtProcessing?: boolean
  completionMinDays?: number | null
  completionMaxDays?: number | null
  completionRangeText?: string | null
}

/**
 * Fetch all active services for homepage (§5 Service Grid)
 * Per §23 Connection Point 1: ISR - revalidate: 3600
 */
export async function getActiveServices(): Promise<ServiceCardData[]> {
  if (!supabaseServer) {
    console.warn('[services] Supabase service role not configured, using static fallback')
    return []
  }

  const { data, error } = await supabaseServer
    .from('service_packages')
    .select(`
      id,
      slug,
      name,
      short_description,
      price_base_paisa,
      price_govt_fees_paisa,
      sla_working_days,
      billing_cycle,
      urgency_score,
      avg_rating,
      rating_count,
      is_bundle,
      filter_category:service_filter_categories (
        name
      )
    `)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return data.map(pkg => ({
    id: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    // Get category from join, fallback to 'Services'
    category: (pkg.filter_category as any)?.name ?? 'Services',
    description: pkg.short_description ?? '',
    ollvyFee: pkg.price_base_paisa / 100,
    govtFee: pkg.price_govt_fees_paisa / 100,
    slaDays: pkg.sla_working_days,
    isRetainer: pkg.billing_cycle === 'monthly' || pkg.billing_cycle === 'quarterly' || pkg.billing_cycle === 'yearly',
    // Use DB rating if >= 10 reviews, otherwise null (per §23 spec)
    avgRating: (pkg.rating_count ?? 0) >= 10 ? pkg.avg_rating : null,
    totalRatings: pkg.rating_count ?? 0,
    isBundle: pkg.is_bundle ?? false,
  }))
}

/**
 * Fetch single service by slug for Service Detail Page (§18)
 * ALL content is fetched from the database - no static configs needed.
 * Returns null gracefully on any error to not break static generation
 */
export async function getServiceBySlugFromDB(slug: string): Promise<{
  service: DBServiceConfig | null
  pricing: ServicePricingData | null
}> {
  if (!supabaseServer) {
    console.warn('[services] Supabase service role not configured')
    return { service: null, pricing: null }
  }

  try {
    const { data: pkg, error } = await supabaseServer
    .from('service_packages')
    .select(`
      id,
      slug,
      name,
      short_name,
      short_description,
      tagline,
      full_description,
      category,
      service_type,
      mandatory_for,
      legal_basis,
      penalty_for_missing,
      penalty_color,
      price_base_paisa,
      price_govt_fees_paisa,
      govt_fee_label,
      govt_fee_note,
      sla_working_days,
      billing_cycle,
      retainer_cycle_label,
      price_varies_by_state,
      deliverables,
      scope_included,
      scope_excluded,
      avg_rating,
      rating_count,
      seo_title,
      seo_description,
      canonical_url,
      workflow_stages,
      whats_included,
      service_risks,
      profile_personas,
      faqs,
      review_sources,
      unlocks,
      review_keyword_chips,
      related_slugs,
      show_completion_stats,
      show_approval_rate,
      variants,
      default_variant_id,
      comparison_without,
      comparison_with,
      addons,
      is_bundle,
      service_explainer,
      has_govt_processing,
      completion_min_days,
      completion_max_days,
      completion_range_text
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching service:', error)
    return { service: null, pricing: null }
  }

  const isRetainer = pkg.billing_cycle === 'monthly' || pkg.billing_cycle === 'quarterly' || pkg.billing_cycle === 'yearly'
  const avgRating = (pkg.rating_count ?? 0) >= 10 ? pkg.avg_rating : null

  // Calculate next due date for retainers
  let nextDueDateValue: string | undefined
  if (isRetainer) {
    const now = new Date()
    const dueDay = pkg.billing_cycle === 'monthly' ? 20 : 15
    const dueDate = new Date(now.getFullYear(), now.getMonth(), dueDay)
    if (dueDate < now) {
      dueDate.setMonth(dueDate.getMonth() + 1)
    }
    nextDueDateValue = dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const service: DBServiceConfig = {
    id: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    shortName: pkg.short_name ?? pkg.name?.split(' ').slice(0, 2).join(' ') ?? '',
    category: pkg.category ?? 'Services',
    tagline: pkg.tagline ?? pkg.short_description ?? '',

    // Pricing
    ollvyFee: pkg.price_base_paisa / 100,
    govtFee: pkg.price_govt_fees_paisa > 0 ? pkg.price_govt_fees_paisa / 100 : undefined,
    govtFeeLabel: pkg.govt_fee_label ?? undefined,
    govtFeeNote: pkg.govt_fee_note ?? undefined,

    // SLA
    slaDays: pkg.sla_working_days,
    isRetainer,
    retainerCycleLabel: pkg.retainer_cycle_label ?? undefined,
    nextDueDateValue,

    // Metadata
    mandatoryFor: pkg.mandatory_for ?? 'All businesses',
    serviceType: pkg.service_type ?? (isRetainer ? 'Monthly retainer' : 'One-time'),
    legalBasis: pkg.legal_basis ?? undefined,
    penaltyForMissing: pkg.penalty_for_missing ?? undefined,
    penaltyColor: pkg.penalty_color ?? 'none',

    // SEO
    seoTitle: pkg.seo_title ?? `${pkg.name} | Ollvy`,
    seoDescription: pkg.seo_description ?? pkg.short_description ?? '',
    canonicalUrl: pkg.canonical_url ?? `https://www.ollvy.com/services/${pkg.slug}`,

    // Rating
    avgRating,
    totalRatings: pkg.rating_count ?? 0,
    priceVariesByState: pkg.price_varies_by_state ?? false,

    // Content arrays (JSONB fields default to empty arrays if null)
    processSteps: pkg.workflow_stages ?? [],
    whatsIncluded: pkg.whats_included ?? [],
    serviceRisks: pkg.service_risks ?? [],
    profilePersonas: pkg.profile_personas ?? [],
    faqs: pkg.faqs ?? [],
    reviewSources: pkg.review_sources ?? [],
    unlocks: pkg.unlocks ?? [],
    reviewKeywordChips: pkg.review_keyword_chips ?? [],
    relatedSlugs: pkg.related_slugs ?? [],

    // Feature flags
    showCompletionStats: pkg.show_completion_stats ?? false,
    showApprovalRate: pkg.show_approval_rate ?? false,

    // Service variants (optional)
    variants: pkg.variants ?? undefined,
    defaultVariantId: pkg.default_variant_id ?? undefined,

    // Service-specific comparison (optional)
    comparisonWithout: pkg.comparison_without ?? undefined,
    comparisonWith: pkg.comparison_with ?? undefined,

    // Service addons (optional)
    addons: pkg.addons ?? undefined,

    // Bundle flag
    isBundle: pkg.is_bundle ?? false,

    // Service explainer (optional)
    serviceExplainer: pkg.service_explainer ?? undefined,

    // Completion estimate fields
    hasGovtProcessing: pkg.has_govt_processing ?? false,
    completionMinDays: pkg.completion_min_days ?? null,
    completionMaxDays: pkg.completion_max_days ?? null,
    completionRangeText: pkg.completion_range_text ?? null,
  }

  // Also return legacy pricing structure for backwards compatibility
  const pricing: ServicePricingData = {
    id: pkg.id,
    ollvyFee: service.ollvyFee,
    govtFee: service.govtFee ?? 0,
    slaDays: service.slaDays,
    isRetainer: service.isRetainer,
    avgRating: service.avgRating,
    totalRatings: service.totalRatings,
    scopeIncluded: pkg.scope_included ?? pkg.deliverables ?? [],
    scopeExcluded: pkg.scope_excluded ?? [],
    priceVariesByState: service.priceVariesByState,
  }

  return { service, pricing }
  } catch (err) {
    console.error('Failed to fetch service by slug:', err)
    return { service: null, pricing: null }
  }
}

// Popular service data for homepage
export interface PopularServiceData {
  slug: string
  name: string
  description: string
  ollvyFee: number
  govtFee: number
  slaDays: number
  isRetainer: boolean
}

/**
 * Fetch popular services for homepage
 * Returns first 6 active services ordered by display_order from database
 */
export async function getPopularServices(): Promise<PopularServiceData[]> {
  if (!supabaseServer) {
    console.warn('[services] Supabase not configured for popular services')
    return []
  }

  try {
    const { data, error } = await supabaseServer
      .from('service_packages')
      .select(`
        slug,
        name,
        short_description,
        price_base_paisa,
        price_govt_fees_paisa,
        sla_working_days,
        billing_cycle
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(6)

    if (error) {
      console.error('Error fetching popular services:', error)
      return []
    }

    if (!data || data.length === 0) {
      console.warn('[services] No services returned from database')
      return []
    }

    return data.map(pkg => ({
      slug: pkg.slug,
      name: pkg.name,
      description: pkg.short_description ?? '',
      ollvyFee: pkg.price_base_paisa / 100,
      govtFee: pkg.price_govt_fees_paisa / 100,
      slaDays: pkg.sla_working_days,
      isRetainer: pkg.billing_cycle === 'monthly' || pkg.billing_cycle === 'quarterly' || pkg.billing_cycle === 'yearly',
    }))
  } catch (err) {
    console.error('Failed to fetch popular services:', err)
    return []
  }
}

// Fallback slugs for static generation when Supabase is unavailable
// IMPORTANT: These must match the actual slugs in the database to avoid 404s
/**
 * Fallback service slugs for static generation when Supabase is unavailable.
 * These MUST match the actual 'slug' column values in the service_packages table.
 *
 * SLUG NAMING CONVENTIONS (common name -> database slug):
 * ┌─────────────────────────────┬─────────────────────────┐
 * │ Common/Alternative Name     │ Actual Database Slug    │
 * ├─────────────────────────────┼─────────────────────────┤
 * │ DPIIT, Startup India DPIIT  │ startup-india           │
 * │ MSME, Udyam, MSME Udyam     │ msme-registration       │
 * │ GST Monthly Filing          │ gst-monthly             │
 * │ Director KYC                │ director-kyc            │
 * │ FSSAI License               │ fssai-license           │
 * │ IEC Code                    │ iec-code                │
 * └─────────────────────────────┴─────────────────────────┘
 *
 * When referencing services in code, ALWAYS use the database slug from this list.
 * Do NOT invent slugs like 'startup-india-dpiit' or 'msme-udyam'.
 */
const FALLBACK_SERVICE_SLUGS = [
  // Registrations
  'pvt-ltd-incorporation',
  'llp-incorporation',
  'business-pan',
  'gst-registration',
  'msme-registration',        // NOT 'msme-udyam'
  'trademark-registration',
  // Licensing / Bundles
  'cloud-kitchen-setup',
  // Annual Compliance
  'mca-annual-filing',
  // Tax Filings
  'business-itr',
  // Monthly Compliance
  'gst-monthly',              // NOT 'gst-monthly-filing' or 'gst-monthly-50l'
  'tds-monthly-compliance',
  // GST Services
  'gst-cancellation',
  'gst-revocation',
  // Other Services
  'company-name-change',
  'din-reactivation',
]

/**
 * Get all service slugs for generateStaticParams
 * Uses fallback slugs if Supabase is unavailable to ensure build succeeds
 */
export async function getAllServiceSlugs(): Promise<string[]> {
  if (!supabaseServer) {
    console.warn('[services] Using fallback slugs - Supabase not configured')
    return FALLBACK_SERVICE_SLUGS
  }

  try {
    const { data, error } = await supabaseServer
      .from('service_packages')
      .select('slug')
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching service slugs:', error)
      return FALLBACK_SERVICE_SLUGS
    }

    return data?.map(s => s.slug) ?? FALLBACK_SERVICE_SLUGS
  } catch (err) {
    console.error('Failed to fetch service slugs, using fallback:', err)
    return FALLBACK_SERVICE_SLUGS
  }
}

// Related service card for display
export interface RelatedServiceCard {
  slug: string
  shortName: string
  tagline: string
  ollvyFee: number
  govtFee: number
  slaDays: number
  isRetainer: boolean
}

/**
 * Fetch related services by their slugs
 * Returns empty array gracefully on any error to not break static generation
 */
export async function getRelatedServicesBySlugs(slugs: string[]): Promise<RelatedServiceCard[]> {
  if (!supabaseServer || slugs.length === 0) return []

  try {
    const { data, error } = await supabaseServer
      .from('service_packages')
      .select(`
        slug,
        short_name,
        name,
        tagline,
        short_description,
        price_base_paisa,
        price_govt_fees_paisa,
        sla_working_days,
        billing_cycle
      `)
      .in('slug', slugs)
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching related services:', error)
      return []
    }

    return data.map(pkg => ({
      slug: pkg.slug,
      shortName: pkg.short_name ?? pkg.name?.split(' ').slice(0, 2).join(' ') ?? '',
      tagline: pkg.tagline ?? pkg.short_description ?? '',
      ollvyFee: pkg.price_base_paisa / 100,
      govtFee: pkg.price_govt_fees_paisa / 100,
      slaDays: pkg.sla_working_days,
      isRetainer: pkg.billing_cycle === 'monthly' || pkg.billing_cycle === 'quarterly' || pkg.billing_cycle === 'yearly',
    }))
  } catch (err) {
    console.error('Failed to fetch related services:', err)
    return []
  }
}

/**
 * Fetch reviews for a service
 * Per §23 Connection Point 4: Reviews from feedback table via orders
 */
export async function getServiceReviews(servicePackageId: string, limit = 20): Promise<ServiceReview[]> {
  if (!supabaseServer) {
    return []
  }

  // Feedback is linked to orders, and orders have service_package_id
  const { data, error } = await supabaseServer
    .from('orders')
    .select(`
      feedback (
        rating,
        comment,
        created_at
      )
    `)
    .eq('service_package_id', servicePackageId)
    .not('feedback', 'is', null)
    .limit(limit)

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  // Flatten and filter out nulls
  const reviews: ServiceReview[] = []
  for (const order of data ?? []) {
    const feedback = order.feedback as any
    if (feedback && feedback.rating) {
      reviews.push({
        rating: feedback.rating,
        comment: feedback.comment,
        created_at: feedback.created_at,
      })
    }
  }

  // Sort by most recent first
  reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return reviews.slice(0, limit)
}

/**
 * Fetch state-specific pricing override
 * Per §23 Connection Point 8: Geo Pages Pricing
 */
export async function getStatePricing(
  servicePackageId: string,
  state: string
): Promise<{ price_base_paisa: number; price_govt_fees_paisa: number } | null> {
  if (!supabaseServer) return null

  const { data, error } = await supabaseServer
    .from('service_state_pricing')
    .select('price_base_paisa, price_govt_fees_paisa')
    .eq('service_package_id', servicePackageId)
    .eq('state', state)
    .maybeSingle()

  if (error) {
    console.error('Error fetching state pricing:', error)
    return null
  }

  return data
}

/**
 * Fetch user's compliance obligations
 * Per §23 Connection Point 7: Compliance Calendar
 */
export async function getUserComplianceObligations(userId: string) {
  if (!supabaseServer) return []

  const { data, error } = await supabaseServer
    .from('compliance_obligations')
    .select(`
      id,
      label,
      due_date,
      status,
      obligation_type,
      compliance_obligation_rules (
        code,
        linked_service_package_id
      )
    `)
    .eq('user_id', userId)
    .order('due_date', { ascending: true })

  if (error) {
    console.error('Error fetching compliance obligations:', error)
    return []
  }

  return data ?? []
}

/**
 * Minimal service data for Navbar search
 * Pre-fetched on the server to avoid client-side Supabase SDK
 */
export interface NavbarServiceData {
  slug: string
  name: string
  short_description: string | null
  order_type: 'one_time' | 'recurring'
}

/**
 * Fetch services for Navbar search (server-side)
 * Lightweight query - only fields needed for search
 */
export async function getNavbarServices(): Promise<NavbarServiceData[]> {
  if (!supabaseServer) {
    console.warn('[services] Supabase service role not configured')
    return []
  }

  const { data, error } = await supabaseServer
    .from('service_packages')
    .select('slug, name, short_description, billing_cycle')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching navbar services:', error)
    return []
  }

  return (data || []).map(pkg => ({
    slug: pkg.slug,
    name: pkg.name,
    short_description: pkg.short_description,
    order_type: pkg.billing_cycle === 'one_time' ? 'one_time' : 'recurring' as const,
  }))
}

/**
 * FAQ service prices for homepage FAQ schema
 * Used to inject live prices into FAQ structured data
 */
export interface FAQServicePrices {
  llp: string
  pvtLtd: string
  gst: string
  trademark: string
  fssaiBasic: string
  fssaiState: string
  fssaiCentral: string
  opc: string
  directorKyc: string
}

// Fallback prices if database is unavailable
const FALLBACK_FAQ_PRICES: FAQServicePrices = {
  llp: 'Rs 7,999',
  pvtLtd: 'Rs 9,999',
  gst: 'Rs 2,999',
  trademark: 'Rs 6,999',
  fssaiBasic: 'Rs 3,999',
  fssaiState: 'Rs 5,999',
  fssaiCentral: 'Rs 8,999',
  opc: 'Rs 8,499',
  directorKyc: 'Rs 999',
}

// Map of service slugs to FAQ price keys
const FAQ_SLUG_MAP: Record<string, keyof FAQServicePrices> = {
  'llp-incorporation': 'llp',
  'pvt-ltd-incorporation': 'pvtLtd',
  'gst-registration': 'gst',
  'trademark-registration': 'trademark',
  'fssai-basic': 'fssaiBasic',
  'fssai-state': 'fssaiState',
  'fssai-central': 'fssaiCentral',
  'fssai-license': 'fssaiState', // Fallback for generic FSSAI slug
  'opc-incorporation': 'opc',
  'director-kyc': 'directorKyc',
}

/**
 * Format price in Indian Rupees format (Rs X,XXX)
 */
function formatPriceINR(pricePaisa: number): string {
  const rupees = pricePaisa / 100
  return `Rs ${rupees.toLocaleString('en-IN')}`
}

/**
 * Fetch service prices for FAQ schema
 * Returns formatted prices for services mentioned in homepage FAQs
 */
export async function getFAQServicePrices(): Promise<FAQServicePrices> {
  if (!supabaseServer) {
    console.warn('[services] Supabase not configured, using fallback FAQ prices')
    return FALLBACK_FAQ_PRICES
  }

  try {
    const slugs = Object.keys(FAQ_SLUG_MAP)
    const { data, error } = await supabaseServer
      .from('service_packages')
      .select('slug, price_base_paisa')
      .in('slug', slugs)
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching FAQ service prices:', error)
      return FALLBACK_FAQ_PRICES
    }

    // Start with fallback prices
    const prices = { ...FALLBACK_FAQ_PRICES }

    // Override with live prices from database
    for (const pkg of data || []) {
      const priceKey = FAQ_SLUG_MAP[pkg.slug]
      if (priceKey) {
        prices[priceKey] = formatPriceINR(pkg.price_base_paisa)
      }
    }

    return prices
  } catch (err) {
    console.error('Failed to fetch FAQ service prices:', err)
    return FALLBACK_FAQ_PRICES
  }
}
```

### 1E. `lib/types/database.ts` — Database-matched Types

```typescript
/**
 * Database Types - matches actual Supabase schema
 */

export interface ServiceCardData {
  id: string
  slug: string
  name: string
  category: string
  description: string
  ollvyFee: number
  govtFee: number
  slaDays: number
  isRetainer: boolean
  avgRating: number | null
  totalRatings: number
  isBundle?: boolean
}

export interface ServicePricingData {
  id: string
  ollvyFee: number
  govtFee: number
  slaDays: number
  isRetainer: boolean
  avgRating: number | null
  totalRatings: number
  scopeIncluded: string[]
  scopeExcluded: string[]
  priceVariesByState: boolean
}
```

---

## 2. Full Content for All Active Services (from Supabase `service_packages` table)

15 active services. All fields included: slug, name, tagline, pricing, SLA, FAQs, process steps, whats_included, service_risks, profile_personas, variants, addons, explainer, comparison, unlocks, review sources, SEO fields, completion estimates, everything.

```json
[
  {
    "slug": "gst-registration",
    "name": "GST Registration",
    "short_name": "GST Reg",
    "tagline": "Your GSTIN, applied for and obtained. We handle every step.",
    "short_description": "Get your GSTIN within 7 working days. CA assigned same day, ARN shared within 24 hours of filing.",
    "full_description": null,
    "category": "Tax Registration",
    "service_type": "One-time",
    "mandatory_for": "Businesses above ₹40L turnover (₹20L for services)",
    "legal_basis": "CGST Act 2017, Section 22",
    "penalty_for_missing": "100% of tax due + ₹10,000 minimum",
    "penalty_color": "red",
    "price_base_paisa": 149900,
    "price_govt_fees_paisa": 0,
    "govt_fee_label": null,
    "govt_fee_note": null,
    "sla_working_days": 7,
    "billing_cycle": "one_time",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [
      "GST application preparation on GST portal",
      "Document verification and compilation",
      "Application submission",
      "ARN generation and tracking",
      "Response to clarifications from GST officer (first round)",
      "GSTIN certificate upon approval",
      "GST portal login setup assistance",
      "Basic orientation on GST compliance"
    ],
    "scope_excluded": [
      "Monthly GST return filing",
      "GSTR-9 annual return",
      "E-way bill registration",
      "ITC reconciliation"
    ],
    "seo_title": "GST Registration Online India - GSTIN in 7 Days | ₹1,499 | Ollvy",
    "seo_description": "Get your GSTIN in 7 working days. No government fee. Fixed price ₹1,499. CA assigned same day.",
    "canonical_url": "https://www.ollvy.com/services/gst-registration",
    "workflow_stages": [
      {
        "body": "Business type, state, turnover estimate, supply type (goods/services/both), and whether you need voluntary registration. CA assigned within 4 hours. They generate a specific document checklist - not the standard 20-item government list.",
        "step": 1,
        "title": "Answer 5 questions - we build your checklist",
        "visual": "checklist",
        "timeline": "Day 0",
        "milestone": "CA assigned, personalised checklist sent"
      },
      {
        "body": "Upload directly from your phone. CA reviews every document before filing - blurry Aadhaar, address mismatch, wrong format - caught here, not after the officer raises a query.",
        "step": 2,
        "title": "Upload documents through the app",
        "visual": "upload",
        "timeline": "Day 0-1",
        "milestone": "Documents verified by CA"
      },
      {
        "body": "CA files GST REG-01 on the GSTN portal. Application Reference Number generated immediately on submission and shared in your app the same day. You can verify status yourself at gstn.gov.in.",
        "step": 3,
        "title": "Application filed - ARN in 24 hours",
        "visual": "form",
        "timeline": "Day 1-2",
        "milestone": "ARN generated and sent to your app"
      },
      {
        "body": "GST officers request clarifications in approximately 20% of cases, typically for Aadhaar verification or address proof. Your CA responds within 24 hours. Included in scope - no extra charge.",
        "step": 4,
        "title": "Officer query handled (if applicable)",
        "visual": "form",
        "timeline": "Day 3-5",
        "milestone": "Query responded"
      },
      {
        "body": "Permanent - no renewal, no expiry as long as you file returns. Compliance calendar updated automatically with your first GSTR-1 (11th of next month) and GSTR-3B (20th of next month) due dates.",
        "step": 5,
        "title": "GSTIN issued",
        "visual": "stamp",
        "timeline": "Day 5-7",
        "milestone": "GSTIN active on GSTN portal",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "title": "CA files REG-01 on the GSTN portal",
        "description": "All 23 fields across 5 tabs. You answer 5 questions in the app."
      },
      {
        "title": "ARN shared same day",
        "description": "Track it yourself on gstn.gov.in."
      },
      {
        "title": "Officer queries responded to within 24 hours",
        "description": "No extra charge."
      },
      {
        "title": "GSTR-1 and GSTR-3B due dates added to your compliance calendar",
        "description": "From the moment GSTIN is issued."
      }
    ],
    "service_risks": [
      {
        "body": "The business address on all documents must match exactly - building name, floor, area, and PIN code. Your CA checks every document for consistency before filing.",
        "icon": "mismatch",
        "title": "Address proof mismatch"
      },
      {
        "body": "GST registration requires Aadhaar-based authentication. If the mobile linked to Aadhaar is old or inactive, OTP fails. This must be fixed at an Aadhaar enrolment centre. We verify this upfront.",
        "icon": "alert",
        "title": "Aadhaar OTP fails"
      },
      {
        "body": "If your turnover has crossed the mandatory limit and you are not yet registered, you are liable for 100% of unpaid tax plus Rs 10,000 minimum penalty. Registering now stops the liability from growing.",
        "icon": "clock",
        "title": "Already past threshold"
      }
    ],
    "profile_personas": [
      {
        "label": "First GST registration",
        "detail": "Never done this before. We explain what each document is for and why it is needed."
      },
      {
        "label": "Turnover just crossed threshold",
        "detail": "You waited until legally required. Now we register you quickly."
      },
      {
        "label": "Voluntary registration",
        "detail": "Below threshold but want to issue GST invoices to B2B clients. Completely legal."
      },
      {
        "label": "Home as principal place of business",
        "detail": "Fully legal. We verify your electricity bill matches before filing."
      }
    ],
    "faqs": [
      {
        "a": "When aggregate turnover crosses Rs 40 lakh (Rs 20 lakh for service providers, Rs 10 lakh for special category states). Also mandatory for any inter-state supply regardless of turnover, and for all e-commerce sellers from day one.",
        "q": "When is GST registration mandatory?",
        "category": "General"
      },
      {
        "a": "Yes. Voluntary registration lets you issue GST invoices and claim ITC on purchases. Cannot be cancelled for at least one year from date of registration.",
        "q": "Can I register voluntarily if I am below the threshold?",
        "category": "General"
      },
      {
        "a": "Application Reference Number - generated the moment your application is submitted. You can track status on the government portal yourself without waiting for updates from us.",
        "q": "What is an ARN and why does it matter?",
        "category": "Process"
      },
      {
        "a": "Your CA responds within 24 hours. Included in the service. Most queries are resolved in one reply.",
        "q": "What if the officer raises a query?",
        "category": "Process"
      },
      {
        "a": "Depends on your business type. Sole proprietor: PAN, Aadhaar, address proof, bank statement. Pvt Ltd: same, plus Certificate of Incorporation, board resolution, and director PANs. We send a personalised checklist.",
        "q": "What documents do I need?",
        "category": "Documents"
      },
      {
        "a": "GSTR-1 by 11th of every month (outward supplies), GSTR-3B by 20th (net tax payment). Nil returns required even if there are no transactions. GSTR-9 annual return by December 31. All deadlines added to your compliance calendar automatically.",
        "q": "What are my obligations after getting GSTIN?",
        "category": "After Completion"
      }
    ],
    "review_sources": [
      {
        "url": "https://www.gst.gov.in",
        "name": "GST Portal",
        "description": "Official GSTN portal — registration and filing"
      },
      {
        "url": "https://cbic-gst.gov.in/gst-acts.html",
        "name": "CGST Act, 2017",
        "description": "Section 22: Registration thresholds. Section 25: Registration procedure."
      }
    ],
    "unlocks": [
      {
        "name": "GST Monthly Filing",
        "slug": "gst-monthly-50l",
        "type": "required",
        "price": "₹1,499/month",
        "explanation": "GSTR-1 by 11th, GSTR-3B by 20th. Every month. Mandatory."
      },
      {
        "name": "GSTR-9 Annual Return",
        "slug": "gst-annual-return",
        "type": "required",
        "price": "₹2,999",
        "explanation": "Annual reconciliation. Due Dec 31 every year."
      }
    ],
    "review_keyword_chips": [
      "✓ GSTIN in 5 days",
      "✓ CA was responsive",
      "✓ ARN shared same day",
      "✓ No extra charges"
    ],
    "related_slugs": [
      "gst-monthly",
      "pvt-ltd-incorporation",
      "business-itr"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "GST registration gives you a 15-digit GSTIN under the CGST Act, 2017. It authorises you to collect GST from customers, claim Input Tax Credit on purchases, and file GST returns.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "Mandatory if your turnover exceeds Rs 40 lakh (Rs 20 lakh for services, Rs 10 lakh in special category states), for any inter-state supply, or if you sell on any e-commerce platform. Even below the threshold, being registered lets your B2B clients claim ITC on your invoices - without it, you are harder to work with than a registered competitor.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "Operating without mandatory registration is tax evasion. Penalty is 100% of tax due plus Rs 10,000 minimum. You cannot claim ITC on your own purchases, cannot generate e-way bills, and platforms like Amazon and Flipkart will not onboard you.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 1,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "pvt-ltd-incorporation",
    "name": "Private Limited Company Registration",
    "short_name": "Pvt Ltd",
    "tagline": "Your company, incorporated. Separate legal entity, limited liability, ready for investment.",
    "short_description": "Incorporate your Private Limited Company with full MCA compliance - DSC, DIN, MOA/AOA, PAN, TAN included.",
    "full_description": null,
    "category": "Company Registration",
    "service_type": "One-time",
    "mandatory_for": "Startups raising investment, businesses with multiple founders",
    "legal_basis": "Companies Act, 2013",
    "penalty_for_missing": null,
    "penalty_color": "none",
    "price_base_paisa": 599900,
    "price_govt_fees_paisa": 799900,
    "govt_fee_label": "MCA filing fees",
    "govt_fee_note": "Paid to Ministry of Corporate Affairs. Includes stamp duty, filing fees, and name reservation.",
    "sla_working_days": 15,
    "billing_cycle": "one_time",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [
      "Name availability search and reservation with MCA",
      "Digital Signature Certificate (DSC) for up to 2 directors",
      "Director Identification Number (DIN) for up to 2 directors",
      "Drafting of Memorandum of Association (MOA)",
      "Drafting of Articles of Association (AOA)",
      "SPICe+ form preparation and filing with MCA",
      "PAN application for the company",
      "TAN application for the company",
      "Certificate of Incorporation with CIN",
      "Unlimited revisions until MCA approval",
      "Post-incorporation compliance checklist"
    ],
    "scope_excluded": [
      "GST registration",
      "Trademark registration",
      "Professional tax registration",
      "Virtual office or registered address",
      "Bank account opening",
      "Additional directors beyond 2 (charged separately)"
    ],
    "seo_title": "Private Limited Company Registration Online | ₹13,998 | Ollvy",
    "seo_description": "Register your Pvt Ltd company in 15 working days. Includes DSC, DIN, name approval, MOA/AOA, PAN, TAN. Fixed price ₹13,998. MCA-compliant.",
    "canonical_url": "https://www.ollvy.com/services/pvt-ltd-incorporation",
    "workflow_stages": [
      {
        "body": "Number of directors, shareholders, proposed company name (3 options recommended), registered office state, and authorised capital. A company secretary is assigned within 4 hours.",
        "step": 1,
        "title": "Answer 5 questions - we build your checklist",
        "visual": "checklist",
        "timeline": "Day 0",
        "milestone": "CS assigned, checklist sent"
      },
      {
        "body": "PAN and Aadhaar for all directors, address proof for the registered office, passport photos. Your CS verifies every document before filing - mismatches caught here, not after MCA raises a query.",
        "step": 2,
        "title": "Upload documents through the app",
        "visual": "upload",
        "timeline": "Day 0-2",
        "milestone": "Documents verified by CS"
      },
      {
        "body": "Digital Signature Certificates and Director Identification Numbers are mandatory. We arrange DSC tokens and guide each director through video verification in the app.",
        "step": 3,
        "title": "DSC and DIN arranged for all directors",
        "visual": "form",
        "timeline": "Day 2-4",
        "milestone": "DSC and DIN ready"
      },
      {
        "body": "Your CS files the Reserve Unique Name application with MCA. Approval typically takes 2-3 working days. If a name is rejected, we file alternatives immediately at no extra cost.",
        "step": 4,
        "title": "Name approved via RUN",
        "visual": "form",
        "timeline": "Day 4-7",
        "milestone": "Company name approved"
      },
      {
        "body": "SPICe+ is the single integrated MCA form for incorporation, PAN, TAN, and optional GST pre-enrollment. Your CS drafts the MOA and AOA based on your specific business activities and files with the Registrar of Companies.",
        "step": 5,
        "title": "SPICe+ filed - MOA, AOA, PAN, TAN in one submission",
        "visual": "form",
        "timeline": "Day 7-12",
        "milestone": "SPICe+ submitted to MCA"
      },
      {
        "body": "MCA issues your CIN. PAN and TAN are generated automatically. All documents are uploaded to your Ollvy account permanently. Your compliance calendar is populated with every annual deadline.",
        "step": 6,
        "title": "Certificate of Incorporation issued",
        "visual": "stamp",
        "timeline": "Day 12-15",
        "milestone": "Company incorporated",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "title": "DSC for all directors",
        "description": "Video verification guided in the app. 15 minutes per director."
      },
      {
        "title": "DIN included in SPICe+",
        "description": "No separate application needed."
      },
      {
        "title": "MOA and AOA drafted for your actual business",
        "description": "Not a generic template."
      },
      {
        "title": "PAN and TAN issued automatically",
        "description": "With incorporation via SPICe+."
      },
      {
        "title": "Annual compliance deadlines in your calendar",
        "description": "From day one."
      }
    ],
    "service_risks": [
      {
        "body": "MCA rejects names similar to existing companies or those containing restricted words (Bank, Insurance, Exchange, etc.). We search MCA and trademark databases before submitting. If all 3 names are rejected, we suggest alternatives at no extra cost.",
        "icon": "document",
        "title": "Name rejected by MCA"
      },
      {
        "body": "The address on your utility bill must match your application exactly. If using a rented address, you need NOC from the landlord. Your CS verifies all address documents before filing.",
        "icon": "mismatch",
        "title": "Registered address document mismatch"
      },
      {
        "body": "SPICe+ cannot be filed until all directors complete DSC verification. Ollvy sends daily reminders and tracks completion status. The verification itself takes 10-15 minutes per director.",
        "icon": "clock",
        "title": "Director slow on DSC video verification"
      }
    ],
    "profile_personas": [
      {
        "label": "First-time founder",
        "detail": "Never incorporated before. We explain every document and step before you take it."
      },
      {
        "label": "Solo director",
        "detail": "Single-director company. MOA drafted to reflect full operational authority."
      },
      {
        "label": "Two co-founders in different cities",
        "detail": "DSC video verification done remotely. Common situation, handled."
      },
      {
        "label": "Home address as registered office",
        "detail": "Fully legal. We verify address proof requirements before filing."
      },
      {
        "label": "Raising investment soon",
        "detail": "Authorised capital set appropriately. Board composition planned for investor entry."
      }
    ],
    "faqs": [
      {
        "a": "15 working days end-to-end. DSC takes 2 days, name approval 3 days, SPICe+ filing and MCA approval 10 days. MCA processing speed is outside our control, but we file the moment documents are ready.",
        "q": "How long does incorporation take?",
        "category": "General"
      },
      {
        "a": "No legal minimum. Authorised capital can be Rs 1 lakh (the standard starting point). Stamp duty on incorporation is based on authorised capital and varies by state.",
        "q": "What is the minimum capital required?",
        "category": "General"
      },
      {
        "a": "Pvt Ltd if you plan to raise equity, issue ESOPs, or need the company structure for credibility with enterprise clients. LLP if you are a professional services firm or want simpler compliance and profit-sharing. See our full comparison guide.",
        "q": "Pvt Ltd or LLP - which should I choose?",
        "category": "General"
      },
      {
        "a": "A Pvt Ltd requires a minimum of 2 directors and 2 shareholders. For single-person ownership, consider OPC (One Person Company).",
        "q": "Can I be the only director?",
        "category": "Process"
      },
      {
        "a": "We search MCA and trademark databases before filing to minimise rejection risk. If rejected, we refile alternatives immediately at no extra cost.",
        "q": "What if my proposed name is rejected?",
        "category": "Process"
      },
      {
        "a": "PAN card, Aadhaar card, passport photo, mobile number linked to Aadhaar for OTP, and address proof. Directors must complete video verification for DSC.",
        "q": "What documents do directors need?",
        "category": "Documents"
      },
      {
        "a": "File Form INC-20A (commencement of business declaration) within 180 days - this requires the initial share capital to be deposited in a company bank account, so open a current account immediately. Annual obligations: MCA annual return (AOC-4 due 30 days after AGM, MGT-7 due 60 days after AGM), Director KYC by Sep 30, Business ITR by Oct 31. All added to your compliance calendar automatically.",
        "q": "What are my compliance obligations after incorporation?",
        "category": "After Completion"
      },
      {
        "a": "No. GST registration is a separate service. Mandatory once your turnover crosses the threshold. You can book both together - both CAs are assigned the same day.",
        "q": "Does this include GST registration?",
        "category": "After Completion"
      }
    ],
    "review_sources": [
      {
        "url": "https://www.mca.gov.in",
        "name": "MCA21 Portal",
        "description": "Ministry of Corporate Affairs — company registration and filings"
      },
      {
        "url": "https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf",
        "name": "Companies Act, 2013",
        "description": "Section 7: Incorporation. Section 12: Registered office. Section 149: Directors."
      }
    ],
    "unlocks": [
      {
        "name": "GST Registration",
        "slug": "gst-registration",
        "type": "required",
        "price": "₹1,499",
        "explanation": "Required once you start billing. Mandatory above ₹40L turnover."
      },
      {
        "name": "Trademark Registration",
        "slug": "trademark-registration",
        "type": "beneficial",
        "price": "₹7,499",
        "explanation": "Protect your company name and brand."
      },
      {
        "name": "Startup India Registration",
        "slug": "startup-india",
        "type": "beneficial",
        "price": "₹1,999",
        "explanation": "Tax benefits for eligible startups."
      }
    ],
    "review_keyword_chips": [
      "✓ Incorporated in 12 days",
      "✓ CS was responsive",
      "✓ Documents verified properly",
      "✓ No hidden charges",
      "✓ Calendar setup included"
    ],
    "related_slugs": [
      "llp-incorporation",
      "gst-registration",
      "trademark-registration"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "A Private Limited Company is a business entity registered under the Companies Act, 2013. It is a separate legal person - it can own property, enter contracts, hire employees, and sue or be sued in its own name. Shares are held by up to 200 shareholders and cannot be publicly traded.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "If you plan to raise equity investment, Pvt Ltd is the only structure that works - investors receive shares, and an LLP cannot issue them. It also enables ESOPs for employees, gives you a clean cap table, and provides the credibility that enterprise clients and banks look for.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "Without incorporation, you operate as a proprietorship with unlimited personal liability - creditors can go after your personal assets. You cannot raise equity, issue ESOPs, or provide the legal continuity that investors and acquirers require.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": true,
    "completion_min_days": 10,
    "completion_max_days": 15,
    "completion_range_text": "10-15 working days",
    "display_order": 2,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "llp-incorporation",
    "name": "LLP Incorporation",
    "short_name": "LLP",
    "tagline": "Limited liability. Flexible profit-sharing. Lower compliance than Pvt Ltd.",
    "short_description": "Register your Limited Liability Partnership with MCA. DPIN, DSC, LLP Agreement, and PAN included.",
    "full_description": null,
    "category": "Company Registration",
    "service_type": "One-time",
    "mandatory_for": "Professionals, consultants, and service firms",
    "legal_basis": "Limited Liability Partnership Act, 2008",
    "penalty_for_missing": null,
    "penalty_color": "none",
    "price_base_paisa": 499900,
    "price_govt_fees_paisa": 500000,
    "govt_fee_label": "MCA filing fees",
    "govt_fee_note": "Paid to Ministry of Corporate Affairs. Standard for up to ₹1L contribution.",
    "sla_working_days": 12,
    "billing_cycle": "one_time",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [
      "Name availability search and reservation with MCA",
      "Digital Signature Certificate (DSC) for up to 2 designated partners",
      "Designated Partner Identification Number (DPIN) for up to 2 partners",
      "Drafting of LLP Agreement",
      "FiLLiP form preparation and filing",
      "LLP PAN application",
      "LLP TAN application",
      "Certificate of Incorporation",
      "Filing of LLP Agreement with MCA",
      "Post-incorporation compliance checklist"
    ],
    "scope_excluded": [
      "GST registration",
      "Trademark registration",
      "Professional tax registration",
      "Additional partners beyond 2 (charged separately)",
      "Amendments to LLP Agreement after incorporation",
      "Bank account opening"
    ],
    "seo_title": "LLP Registration Online India | ₹9,999 | Ollvy",
    "seo_description": "Register your Limited Liability Partnership in India. Includes DPIN, DSC, name reservation, and LLP Agreement. Fixed price ₹9,999.",
    "canonical_url": "https://www.ollvy.com/services/llp-incorporation",
    "workflow_stages": [
      {
        "body": "Business type, number of partners, proposed LLP name (3 options), registered state, capital contribution split. A company secretary is assigned within 4 hours.",
        "step": 1,
        "title": "Answer questions - we build your checklist",
        "visual": "checklist",
        "timeline": "Day 0",
        "milestone": "CS assigned, checklist sent"
      },
      {
        "body": "PAN and Aadhaar for all partners, registered address proof, capital contribution details. CS verifies every document before filing.",
        "step": 2,
        "title": "Upload documents through the app",
        "visual": "upload",
        "timeline": "Day 0-1",
        "milestone": "Documents verified by CS"
      },
      {
        "body": "Designated Partner Identification Number is required for all partners. We file applications and arrange DSC tokens with guided video verification.",
        "step": 3,
        "title": "DPIN and DSC arranged",
        "visual": "form",
        "timeline": "Day 1-3",
        "milestone": "DPIN and DSC ready"
      },
      {
        "body": "FiLLiP is the integrated LLP incorporation form. Your CS drafts the LLP Agreement based on your actual partner arrangement and files with MCA.",
        "step": 4,
        "title": "FiLLiP filed - LLP Agreement, PAN in one submission",
        "visual": "form",
        "timeline": "Day 4-9",
        "milestone": "FiLLiP submitted to MCA"
      },
      {
        "body": "MCA issues the Certificate of Incorporation with your LLP Identification Number. PAN is generated automatically. All documents uploaded to your account.",
        "step": 5,
        "title": "LLPIN issued",
        "visual": "stamp",
        "timeline": "Day 10-12",
        "milestone": "Certificate of Incorporation issued",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "title": "LLP Agreement drafted for your actual arrangement",
        "description": "Profit split, roles, and exit terms - not a standard 50/50 template."
      },
      {
        "title": "DPIN for all designated partners",
        "description": "Included in FiLLiP - no separate application."
      },
      {
        "title": "DSC arranged",
        "description": "Video verification guided in the app."
      },
      {
        "title": "Annual filing deadlines in your calendar",
        "description": "Form 8 and Form 11 due dates from day one."
      }
    ],
    "service_risks": [
      {
        "body": "LLP names must be distinct from existing LLPs and companies. We check both registries before submission.",
        "icon": "document",
        "title": "Name similarity rejection"
      },
      {
        "body": "Vague profit-sharing or unclear exit clauses are the most common source of partner disputes. We draft explicit percentages and terms.",
        "icon": "alert",
        "title": "LLP Agreement must reflect actual terms"
      },
      {
        "body": "FiLLiP cannot be filed until every partner completes video verification. We send daily reminders.",
        "icon": "clock",
        "title": "All partners must complete DSC verification"
      }
    ],
    "profile_personas": [
      {
        "label": "Professional services firm",
        "detail": "CA firms, law firms, architects, consultants - LLP is the natural fit."
      },
      {
        "label": "Two equal partners",
        "detail": "50-50 split. Agreement drafted to handle deadlock scenarios."
      },
      {
        "label": "Three partners, unequal contribution",
        "detail": "Different capital, different profit share. We draft it exactly."
      },
      {
        "label": "Converting from partnership",
        "detail": "Existing firm converting to LLP. We handle the transition."
      }
    ],
    "faqs": [
      {
        "a": "LLP if you are a professional services firm, do not plan to raise equity investment, and want lower compliance costs. Pvt Ltd if you plan to raise funding, issue ESOPs, or need share-based ownership structure. See our full comparison guide.",
        "q": "LLP vs Pvt Ltd - which should I choose?",
        "category": "General"
      },
      {
        "a": "Yes, under Section 366 of the Companies Act, 2013. It involves multiple MCA filings, stamp duty, and a valuation exercise - typically 3-6 months. If funding is even a possibility in the next 3 years, start as Pvt Ltd.",
        "q": "Can I convert an LLP to Pvt Ltd later?",
        "category": "General"
      },
      {
        "a": "Minimum 2 designated partners. No maximum. At least 2 must be Indian residents.",
        "q": "How many partners are required?",
        "category": "Process"
      },
      {
        "a": "No. LLPs have no requirement for formal board or general meetings. Partners decide as agreed in the LLP Agreement.",
        "q": "Does an LLP need to hold board meetings?",
        "category": "Process"
      },
      {
        "a": "PAN card, Aadhaar card, address proof. For the LLP: registered office address proof.",
        "q": "What documents do partners need?",
        "category": "Documents"
      },
      {
        "a": "Form 11 (Annual Return) by May 30 every year. Form 8 (Statement of Accounts and Solvency) by October 30 every year. ITR-5 by July 31 if no tax audit is required, or October 31 if tax audit applies (turnover above Rs 1 crore). No mandatory statutory audit below Rs 40 lakh turnover and Rs 25 lakh contribution.",
        "q": "What are the annual compliance requirements?",
        "category": "After Completion"
      }
    ],
    "review_sources": [
      {
        "url": "https://www.mca.gov.in/content/mca/global/en/mca/llp-e-filling.html",
        "name": "MCA — LLP Portal",
        "description": "Ministry of Corporate Affairs — LLP registration and filings"
      },
      {
        "url": "https://www.mca.gov.in/Ministry/actsbills/pdf/LLP_Act_2008_15jan2009.pdf",
        "name": "LLP Act, 2008",
        "description": "Full text of the Limited Liability Partnership Act"
      }
    ],
    "unlocks": [
      {
        "name": "GST Registration",
        "slug": "gst-registration",
        "type": "required",
        "price": "₹1,499",
        "explanation": "Required once turnover crosses ₹20L for services."
      },
      {
        "name": "Business ITR (ITR-5)",
        "slug": "business-itr",
        "type": "required",
        "price": "₹4,999",
        "explanation": "LLPs file ITR-5 by October 31 every year."
      }
    ],
    "review_keyword_chips": [
      "✓ Agreement was custom",
      "✓ LLPIN in 11 days",
      "✓ CS explained profit split",
      "✓ No hidden fees"
    ],
    "related_slugs": [
      "gst-registration",
      "business-itr",
      "trademark-registration"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "A Limited Liability Partnership is registered under the LLP Act, 2008. It combines partnership flexibility with limited liability - partners are not personally liable for business debts beyond their agreed contribution. Unlike a Pvt Ltd, there are no shares, no board meetings, and no mandatory audit below the turnover threshold.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "LLP is the right structure if you are a professional services firm, want direct management involvement without board formalities, or need flexible profit-sharing that does not follow capital contribution. Annual compliance costs are significantly lower than a Pvt Ltd.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "Operating as an unregistered partnership means unlimited personal liability for all partners. One partner's actions can put other partners' personal assets at risk. The firm cannot own property in its name or enforce contracts in court.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 3,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "msme-registration",
    "name": "MSME/Udyam Registration",
    "short_name": "MSME",
    "tagline": "Government recognition. Priority lending. Payment protection.",
    "short_description": "Udyam registration certificate in 2 working days. Unlocks priority sector lending, 45-day payment protection, and government procurement preference.",
    "full_description": null,
    "category": "Licensing",
    "service_type": "One-time",
    "mandatory_for": "Micro, Small, and Medium Enterprises",
    "legal_basis": "MSME Development Act, 2006",
    "penalty_for_missing": null,
    "penalty_color": "none",
    "price_base_paisa": 29900,
    "price_govt_fees_paisa": 0,
    "govt_fee_label": null,
    "govt_fee_note": null,
    "sla_working_days": 2,
    "billing_cycle": "one_time",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [
      "Udyam registration application preparation",
      "Business activity classification (NIC code identification)",
      "Document compilation",
      "Application filing on Udyam portal",
      "Udyam Registration Certificate",
      "Udyam Registration Number (URN)"
    ],
    "scope_excluded": [
      "GST registration",
      "Bank loan applications",
      "Government tender registrations",
      "NSIC registration"
    ],
    "seo_title": "MSME Udyam Registration | ₹299 | Ollvy",
    "seo_description": "Get Udyam certificate in 2 days. Unlock govt schemes. Fixed price ₹299.",
    "canonical_url": "https://www.ollvy.com/services/msme-registration",
    "workflow_stages": [
      {
        "body": "Owner Aadhaar for OTP verification, business PAN. That is all that is needed.",
        "step": 1,
        "title": "Share Aadhaar and PAN",
        "visual": "checklist",
        "timeline": "Day 0",
        "milestone": "Details received"
      },
      {
        "body": "Filed on the official government portal with your investment and turnover details.",
        "step": 2,
        "title": "Application filed on Udyam portal",
        "visual": "form",
        "timeline": "Day 1",
        "milestone": "Application submitted"
      },
      {
        "body": "Certificate with Unique Registration Number generated. GST linked automatically.",
        "step": 3,
        "title": "Udyam certificate issued",
        "visual": "stamp",
        "timeline": "Day 1-2",
        "milestone": "MSME registered",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "title": "Udyam certificate with URN",
        "description": "Filed on the government portal. Accepted by all banks and GeM."
      },
      {
        "title": "GSTIN linked automatically",
        "description": "During the registration process."
      },
      {
        "title": "Classification confirmed",
        "description": "Micro, Small, or Medium - based on your investment and turnover."
      }
    ],
    "service_risks": [
      {
        "body": "Investment and turnover figures are self-declared. Keep supporting records in case of verification.",
        "icon": "document",
        "title": "Self-declaration based"
      },
      {
        "body": "Udyam registration does not expire, but if your turnover or investment changes your classification, the registration should be updated.",
        "icon": "alert",
        "title": "Renewal not required but update needed"
      }
    ],
    "profile_personas": [
      {
        "label": "Small business under Rs 5Cr investment",
        "detail": "Manufacturing or services. Micro or Small classification."
      },
      {
        "label": "IT or consulting firm",
        "detail": "Service enterprise. Investment threshold based on equipment, not premises."
      },
      {
        "label": "Applying for a bank loan",
        "detail": "Bank requires Udyam certificate for priority sector loan classification."
      },
      {
        "label": "GeM seller",
        "detail": "Government e-marketplace requires Udyam registration for MSME seller benefits."
      }
    ],
    "faqs": [
      {
        "a": "Priority sector bank lending (lower interest rates), 45-day payment protection from large buyers, 25% reservation in central government procurement, state subsidies, and patent/ISO certification reimbursements.",
        "q": "What are the main benefits of MSME registration?",
        "category": "General"
      },
      {
        "a": "Registration on the government portal is free. Our fee covers the filing assistance.",
        "q": "Is Udyam registration free?",
        "category": "General"
      },
      {
        "a": "Udyam registration does not expire. Update it if your investment or turnover changes your classification.",
        "q": "How long is the certificate valid?",
        "category": "Process"
      },
      {
        "a": "As of April 1, 2025 (revised in Union Budget 2025): Micro - investment up to Rs 2.5 crore and turnover up to Rs 10 crore. Small - investment up to Rs 25 crore and turnover up to Rs 100 crore. Medium - investment up to Rs 125 crore and turnover up to Rs 500 crore. A composite criterion applies - crossing either the investment or turnover limit for your current category moves you to the next category.",
        "q": "Who qualifies as MSME?",
        "category": "Process"
      }
    ],
    "review_sources": [
      {
        "url": "https://udyamregistration.gov.in",
        "name": "Udyam Portal",
        "description": "Official MSME registration portal"
      },
      {
        "url": "https://msme.gov.in",
        "name": "MSME Development Act, 2006",
        "description": "MSME classification and benefits"
      }
    ],
    "unlocks": [
      {
        "name": "GST Registration",
        "slug": "gst-registration",
        "type": "required",
        "price": "₹8,999",
        "explanation": "Required for billing."
      },
      {
        "name": "Startup India",
        "slug": "startup-india",
        "type": "beneficial",
        "price": "₹7,999",
        "explanation": "Additional benefits if innovation-based."
      },
      {
        "name": "Trademark Registration",
        "slug": "trademark-registration",
        "type": "beneficial",
        "price": "₹12,499",
        "explanation": "MSME discount on govt fees."
      }
    ],
    "review_keyword_chips": [
      "✓ Certificate same day",
      "✓ Very quick",
      "✓ Benefits explained",
      "✓ No documents hassle",
      "✓ Free govt portal used"
    ],
    "related_slugs": [
      "gst-registration",
      "startup-india"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "Udyam Registration is free online registration with the Ministry of MSME. Based on your investment in plant and machinery, and annual turnover, you are classified as Micro, Small, or Medium Enterprise. You receive a Udyam Registration Number that identifies your MSME status for all government schemes.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "To access any MSME benefit - priority sector bank loans, government procurement preference, or state subsidies - Udyam Registration is mandatory. Buyers above a certain size are legally required to pay MSME vendors within 45 days (the MSME Facilitation Council enforces this).",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "You miss priority sector lending with lower interest rates. Large buyers can delay payment indefinitely without legal consequence. No access to government procurement reservations (25% of central government procurement is reserved for MSMEs). State incentives that require MSME status are unavailable.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 5,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "trademark-registration",
    "name": "Trademark Registration",
    "short_name": "Trademark",
    "tagline": "Protect your brand name. 10-year protection. Nationwide.",
    "short_description": "Trademark application filed within 7 days. Includes search, class guidance, and examiner objection response.",
    "full_description": null,
    "category": "IP Protection",
    "service_type": "One-time",
    "mandatory_for": "Businesses wanting brand protection",
    "legal_basis": "Trade Marks Act, 1999",
    "penalty_for_missing": null,
    "penalty_color": "none",
    "price_base_paisa": 299900,
    "price_govt_fees_paisa": 450000,
    "govt_fee_label": "Govt filing fee",
    "govt_fee_note": "Government fee for single class. MSME discount (₹4,500 → ₹2,250) if you have Udyam registration.",
    "sla_working_days": 7,
    "billing_cycle": "one_time",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [
      "Comprehensive trademark search report",
      "Trademark class identification and recommendation",
      "Application drafting with proper specifications",
      "Filing with Controller General of Patents, Designs & Trademarks",
      "TM symbol authorization letter (use immediately after filing)",
      "Response to examination report (first objection)",
      "Status tracking until registration",
      "Registration certificate upon approval"
    ],
    "scope_excluded": [
      "Trademark renewal (due every 10 years)",
      "Opposition proceedings if third party objects",
      "Second or subsequent examination reports",
      "Additional trademark classes (charged separately)",
      "International trademark registration"
    ],
    "seo_title": "Trademark Registration India | ₹7,499 | 10-Year Protection | Ollvy",
    "seo_description": "Register your trademark. Application filed within 7 days. ₹2,999 + ₹4,500 govt fee. Trademark search included.",
    "canonical_url": "https://www.ollvy.com/services/trademark-registration",
    "workflow_stages": [
      {
        "body": "Trademark attorney assigned within 4 hours. You provide the mark (word, logo, or both), the classes you want to protect, and your business details. Preliminary search started immediately.",
        "step": 1,
        "title": "Tell us your brand name and category",
        "visual": "checklist",
        "timeline": "Day 0",
        "milestone": "Attorney assigned, search started"
      },
      {
        "body": "Attorney searches the Trademark Registry for identical and similar marks in your classes. Search report shows potential conflicts. If your mark is clear, we proceed. If not, we suggest modifications.",
        "step": 2,
        "title": "Trademark search report delivered",
        "visual": "form",
        "timeline": "Day 1-2",
        "milestone": "Search report delivered"
      },
      {
        "body": "Attorney drafts the application, selects the correct class(es), prepares the trademark specification, and files. You receive your application number and filing receipt.",
        "step": 3,
        "title": "Application filed with Trademark Registry",
        "visual": "form",
        "timeline": "Day 3-7",
        "milestone": "Application filed, receipt received"
      },
      {
        "body": "The Trademark Registry examines your application. If objections are raised, your attorney responds - included in scope. Once cleared, the mark is published in the Trademark Journal for 4 months.",
        "step": 4,
        "title": "Examination and publication",
        "visual": "calendar",
        "timeline": "6-12 months (government processing)",
        "milestone": "Under examination"
      },
      {
        "body": "Certificate issued. Your mark is protected for 10 years from the filing date, renewable indefinitely. Certificate stored in your Ollvy account.",
        "step": 5,
        "title": "Registration certificate issued",
        "visual": "stamp",
        "timeline": "12-18 months total",
        "milestone": "Trademark registered",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "title": "Trademark search before filing",
        "description": "Conflicts flagged before you spend the government fee."
      },
      {
        "title": "Correct class selection",
        "description": "Attorney recommends only the classes you actually need."
      },
      {
        "title": "First examination objection response",
        "description": "Included in the price - no extra charge."
      }
    ],
    "service_risks": [
      {
        "body": "If a similar mark is already registered in your class, the Examiner will reject your application. Our search catches most conflicts, but pending applications that are not yet published cannot be seen. If rejected, we help you appeal or modify.",
        "icon": "document",
        "title": "Similar mark already exists"
      },
      {
        "body": "The 7-day timeline is for filing. Examination, publication, and certificate issuance are government-side. We track and update you but cannot speed up the Registry.",
        "icon": "clock",
        "title": "Government processing takes 12-18 months"
      },
      {
        "body": "After examination, your mark is published for 4 months. Anyone can file an opposition. If opposed, it becomes a formal legal proceeding. Opposition response is a separate service and is rare - happens in under 5% of cases.",
        "icon": "alert",
        "title": "Opposition during publication"
      }
    ],
    "profile_personas": [
      {
        "label": "First trademark",
        "detail": "Never registered before. We explain classes, search, and the full process."
      },
      {
        "label": "Logo and word mark",
        "detail": "You want to protect both. Two separate applications needed. We handle both."
      },
      {
        "label": "Multiple classes",
        "detail": "Tech, retail, and services. Each class is a separate application and a separate government fee."
      },
      {
        "label": "Already using the name",
        "detail": "You have been using the brand for years without registration. File now before someone else does."
      }
    ],
    "faqs": [
      {
        "a": "Words, logos, slogans, sounds, and in some cases colours. Most businesses file a word mark and a logo mark separately for broader protection.",
        "q": "What can I trademark?",
        "category": "General"
      },
      {
        "a": "10 years from the filing date, renewable indefinitely in 10-year increments.",
        "q": "How long does protection last?",
        "category": "General"
      },
      {
        "a": "The 7-day timeline is for filing. Examination by the Registry takes 6-12 months. Then 4 months of public opposition window. Then certificate issuance. All government-side processing.",
        "q": "Why does registration take 12-18 months?",
        "category": "Process"
      },
      {
        "a": "No. Use R only after registration is granted. Until then, use TM (for goods) or SM (for services) to indicate your claim.",
        "q": "Can I use the R symbol after filing?",
        "category": "Process"
      },
      {
        "a": "PAN, Aadhaar, address proof, and the logo file if registering a logo. For companies: Certificate of Incorporation and board resolution.",
        "q": "What documents do I need?",
        "category": "Documents"
      },
      {
        "a": "Each class is a separate application with a separate government fee. Our attorney will recommend only the classes you actually need.",
        "q": "What if I need multiple classes?",
        "category": "Pricing"
      }
    ],
    "review_sources": [
      {
        "url": "https://ipindia.gov.in",
        "name": "IP India",
        "description": "Official Trademark Registry and search portal"
      },
      {
        "url": "https://www.indiacode.nic.in/bitstream/123456789/15427/1/the_trade_marks_act,_1999.pdf",
        "name": "Trade Marks Act, 1999",
        "description": "Section 18: Application. Section 25: Duration."
      }
    ],
    "unlocks": [
      {
        "name": "Trademark Renewal",
        "slug": "trademark-renewal",
        "type": "required",
        "price": "₹4,999 + govt fee",
        "explanation": "Due every 10 years."
      },
      {
        "name": "Copyright Registration",
        "slug": "copyright-registration",
        "type": "beneficial",
        "price": "₹3,499",
        "explanation": "Protect creative works - code, designs, content."
      }
    ],
    "review_keyword_chips": [
      "✓ Search before filing",
      "✓ Attorney was clear",
      "✓ Application in 5 days",
      "✓ Certificate received"
    ],
    "related_slugs": [
      "pvt-ltd-incorporation",
      "copyright-registration"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "Trademark registration gives you exclusive rights to use your brand name, logo, or tagline for a specific category of goods or services across India for 10 years (renewable indefinitely). Registered under the Trade Marks Act, 1999, it lets you use the R symbol and take legal action against infringers.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "Without registration, you have limited legal recourse against anyone using your brand name. Someone else can register it before you and force you to rebrand. E-commerce platforms require trademark registration for brand protection features. Investors and acquirers treat registered IP as a tangible asset.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "Proving passing off without a registered trademark is expensive and uncertain. You have no access to Amazon Brand Registry or similar platform protections. Anyone can legally use a similar name in your category.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": true,
    "completion_min_days": 360,
    "completion_max_days": 540,
    "completion_range_text": "12-18 months",
    "display_order": 6,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "gst-monthly",
    "name": "GST Monthly Filing - Up to ₹50L",
    "short_name": "GST Filing",
    "tagline": "GSTR-1 by the 11th. GSTR-3B by the 20th. Every month. Handled.",
    "short_description": "Monthly GST return filing - GSTR-1 and GSTR-3B filed on time, with ITC reconciliation each cycle.",
    "full_description": null,
    "category": "Monthly Compliance",
    "service_type": "Monthly retainer",
    "mandatory_for": "All GST-registered businesses",
    "legal_basis": "CGST Act 2017, Section 37 & 39",
    "penalty_for_missing": "₹50/day (min ₹20,000) + 18% interest",
    "penalty_color": "red",
    "price_base_paisa": 299900,
    "price_govt_fees_paisa": 0,
    "govt_fee_label": null,
    "govt_fee_note": null,
    "sla_working_days": 3,
    "billing_cycle": "monthly",
    "retainer_cycle_label": "per month",
    "price_varies_by_state": false,
    "scope_included": [],
    "scope_excluded": [],
    "seo_title": "GST Monthly Filing Service | GSTR-1 & GSTR-3B | From ₹2,999/month | Ollvy",
    "seo_description": "Monthly GST filing handled by verified CA. GSTR-1 by 11th, GSTR-3B by 20th. Fixed price from ₹2,999/month.",
    "canonical_url": "https://www.ollvy.com/services/gst-monthly",
    "workflow_stages": [
      {
        "body": "Read-only access to your GST portal. CA reviews your filing history and is assigned to your account permanently.",
        "step": 1,
        "title": "Share your GST credentials",
        "visual": "checklist",
        "timeline": "Day 0",
        "milestone": "CA assigned to your account"
      },
      {
        "body": "Sales invoices and purchase register. If you use Tally, Zoho, or any accounting software, an export takes 2 minutes.",
        "step": 2,
        "title": "Upload sales invoices and purchase data",
        "visual": "upload",
        "timeline": "By 8th of each month",
        "milestone": "Data received for the month"
      },
      {
        "body": "CA files all outward supply invoices. Acknowledgement shared in your app.",
        "step": 3,
        "title": "GSTR-1 filed by the 11th",
        "visual": "form",
        "timeline": "9th-11th",
        "milestone": "GSTR-1 filed"
      },
      {
        "body": "CA prepares the summary return, verifies ITC claims against GSTR-2B, calculates net tax liability, and files. Challan generated.",
        "step": 4,
        "title": "GSTR-3B filed by the 20th",
        "visual": "form",
        "timeline": "18th-20th",
        "milestone": "GSTR-3B filed"
      },
      {
        "body": "What was filed, when, acknowledgement numbers, ITC claimed, tax paid.",
        "step": 5,
        "title": "Monthly compliance report",
        "visual": "checklist",
        "timeline": "21st-25th",
        "milestone": "Report delivered",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "body": "All B2B invoices, B2C sales above Rs 2.5 lakh, and export invoices reported. Filed by the 11th.",
        "title": "GSTR-1 - outward supply return"
      },
      {
        "body": "Output tax calculated, eligible ITC deducted, return filed, challan generated.",
        "title": "GSTR-3B - net tax payment"
      },
      {
        "body": "ITC claimed is matched against GSTR-2B before filing. Mismatches flagged - you are not exposed to a notice for claiming ITC your vendor has not filed.",
        "title": "ITC reconciliation with GSTR-2B",
        "comparisonWithout": "Claim ITC without verification, receive a demand notice later",
        "comparisonWithOllvy": "ITC verified against GSTR-2B every cycle before filing"
      },
      {
        "body": "Filed returns, acknowledgement numbers, ITC summary, and tax paid - delivered after every cycle.",
        "title": "Monthly compliance report"
      }
    ],
    "service_risks": [
      {
        "body": "Rs 50 per day per return, Rs 100 per day for both returns combined. Plus 18% interest on any unpaid tax. Penalties are avoidable - data must be shared by the 8th.",
        "icon": "clock",
        "title": "Late fee accumulates quickly"
      },
      {
        "body": "Discrepancies between the two returns are flagged automatically by GSTN. We file both from the same data set to ensure consistency.",
        "icon": "mismatch",
        "title": "GSTR-1 and GSTR-3B figures must match"
      },
      {
        "body": "If your vendor has not filed their GSTR-1, their invoices do not appear in your GSTR-2B. Claiming ITC on those invoices invites a mismatch notice. We check before claiming.",
        "icon": "alert",
        "title": "Vendor not filed = ITC blocked"
      }
    ],
    "profile_personas": [
      {
        "label": "Switching from another CA",
        "detail": "Seamless takeover. We review your filing history before the first cycle."
      },
      {
        "label": "Multiple GSTINs",
        "detail": "Multiple states, multiple registrations. All handled under one retainer."
      },
      {
        "label": "High transaction volume",
        "detail": "500+ invoices a month. Priced by turnover, not invoice count."
      },
      {
        "label": "Previous CA stopped responding",
        "detail": "We work to SLA every month. You get acknowledgement numbers, not silence."
      }
    ],
    "faqs": [
      {
        "a": "GSTR-1 by 11th, GSTR-3B by 20th, ITC reconciliation against GSTR-2B, and monthly compliance report.",
        "q": "What does the monthly retainer cover?",
        "category": "General"
      },
      {
        "a": "Yes. No minimum term. Cancel before the 1st of any month and you will not be charged for that cycle.",
        "q": "Can I cancel anytime?",
        "category": "General"
      },
      {
        "a": "Sales invoices and purchase register. If you use accounting software, the export takes 2 minutes.",
        "q": "What data do I need to share each month?",
        "category": "Process"
      },
      {
        "a": "Nil GSTR-1 and GSTR-3B must still be filed. We handle nil returns as part of the retainer.",
        "q": "What if I have no transactions in a month?",
        "category": "Process"
      }
    ],
    "review_sources": [
      {
        "url": "https://www.gst.gov.in",
        "name": "GST Portal",
        "description": "Official GSTN portal for filing GSTR-1, GSTR-3B"
      },
      {
        "url": "https://cbic-gst.gov.in/gst-acts.html",
        "name": "CGST Act, 2017",
        "description": "Section 37: GSTR-1. Section 39: GSTR-3B."
      }
    ],
    "unlocks": [
      {
        "name": "GSTR-9 Annual Return",
        "slug": "gst-annual-return",
        "type": "required",
        "price": "₹8,999",
        "explanation": "Annual reconciliation. Due Dec 31 every year."
      }
    ],
    "review_keyword_chips": [
      "✓ Filed on time every month",
      "✓ CA is responsive",
      "✓ Monthly report received",
      "✓ ITC reconciled"
    ],
    "related_slugs": [
      "gst-registration",
      "gst-annual-return",
      "business-itr"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "Monthly GST compliance means filing GSTR-1 (outward supplies, due 11th) and GSTR-3B (net tax payment, due 20th) every month. GSTR-1 reports every sales invoice. GSTR-3B calculates your tax liability, deducts eligible Input Tax Credit, and records your payment to the government.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "All regular GST-registered taxpayers must file monthly - including nil returns when there are no transactions. Consecutive missed filings trigger e-way bill suspension, then registration suspension, then suo-moto cancellation. Your customers also cannot claim ITC on your invoices until you file.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "Late filing fee of Rs 50 per day per return (Rs 20 for nil returns), capped at Rs 10,000 per return. Interest at 18% per annum on unpaid tax. E-way bill generation blocked after two consecutive missed filings. Registration cancelled after 6 months of non-filing.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 7,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "business-itr",
    "name": "Business ITR Filing",
    "short_name": "Business ITR",
    "tagline": "ITR-6 for Pvt Ltd. ITR-5 for LLP. Filed correctly, on time.",
    "short_description": "Annual income tax return filing for companies and LLPs. Includes depreciation review, computation, and draft approval before filing.",
    "full_description": null,
    "category": "Tax Filing",
    "service_type": "Annual",
    "mandatory_for": "All Pvt Ltd, LLP, and Partnership firms",
    "legal_basis": "Income Tax Act 1961, Section 139",
    "penalty_for_missing": "1% per month interest on tax due",
    "penalty_color": "amber",
    "price_base_paisa": 499900,
    "price_govt_fees_paisa": 0,
    "govt_fee_label": null,
    "govt_fee_note": null,
    "sla_working_days": 10,
    "billing_cycle": "annual",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [
      "Financial statements review and analysis",
      "Profit & Loss account verification",
      "Balance sheet verification",
      "Tax computation with all applicable deductions",
      "ITR form identification (ITR-3/ITR-5/ITR-6 as applicable)",
      "Tax planning suggestions for next year",
      "E-filing on Income Tax portal",
      "ITR-V acknowledgment",
      "Response to intimation under Section 143(1)"
    ],
    "scope_excluded": [
      "Statutory audit",
      "Tax audit under Section 44AB",
      "Transfer pricing documentation",
      "International taxation",
      "Response to scrutiny notices"
    ],
    "seo_title": "Business ITR Filing 2025 | ITR-6, ITR-5 | ₹4,999 | Ollvy",
    "seo_description": "File your company ITR before Oct 31. Fixed price ₹4,999. Verified CA assigned within 24 hours.",
    "canonical_url": "https://www.ollvy.com/services/business-itr",
    "workflow_stages": [
      {
        "body": "P&L, Balance Sheet, trial balance, bank statements. CA assigned within 4 hours.",
        "step": 1,
        "title": "Upload your financials",
        "visual": "upload",
        "timeline": "Day 0-1",
        "milestone": "Documents received, CA assigned"
      },
      {
        "body": "CA reviews P&L, verifies depreciation schedule, checks director remuneration treatment, and prepares income computation.",
        "step": 2,
        "title": "CA reviews books and prepares computation",
        "visual": "form",
        "timeline": "Day 1-4",
        "milestone": "Draft computation ready"
      },
      {
        "body": "Complete draft ITR shared in the app - income figures, deductions, tax computation. You review and approve before anything is filed.",
        "step": 3,
        "title": "You review and approve the draft",
        "visual": "checklist",
        "timeline": "Day 4-7",
        "milestone": "Draft approved"
      },
      {
        "body": "CA files within 24 hours of approval. ITR-V acknowledgement generated immediately and shared in the app same day.",
        "step": 4,
        "title": "Filed and acknowledgement delivered",
        "visual": "stamp",
        "timeline": "Day 7-10",
        "milestone": "ITR-V acknowledgement delivered",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "title": "Depreciation schedule reviewed",
        "description": "Rates verified before filing - not just data entry."
      },
      {
        "title": "Director or partner remuneration treatment checked",
        "description": "Against statutory limits."
      },
      {
        "title": "Full draft shared before submission",
        "description": "Nothing filed without your approval."
      },
      {
        "title": "ITR-V acknowledgement stored",
        "description": "In your Ollvy account permanently."
      }
    ],
    "service_risks": [
      {
        "body": "Section 234A: if you file after the due date with tax outstanding, 1% monthly interest accrues from the original deadline.",
        "icon": "clock",
        "title": "Belated filing interest"
      },
      {
        "body": "A company that made a loss and files after October 31 loses the right to offset that loss against future profits. That tax benefit cannot be recovered.",
        "icon": "document",
        "title": "Losses cannot be carried forward if filed late"
      },
      {
        "body": "Audit is mandatory if turnover exceeds Rs 1 crore (Rs 10 crore if cash transactions are under 5% of total). Audited financials must be ready before ITR can be filed.",
        "icon": "alert",
        "title": "Audit requirement"
      }
    ],
    "profile_personas": [
      {
        "label": "First year after incorporation",
        "detail": "First ITR. We walk through every document required."
      },
      {
        "label": "Changed CA mid-year",
        "detail": "Previous CA's books need reconciliation. We clean up and file correctly."
      },
      {
        "label": "Company made a loss",
        "detail": "Loss return filed to preserve carry-forward rights."
      },
      {
        "label": "Filing late",
        "detail": "We calculate interest liability upfront so there are no surprises, then file immediately."
      }
    ],
    "faqs": [
      {
        "a": "For Pvt Ltd companies: October 31 - statutory audit is mandatory for all companies regardless of turnover, so the extended deadline always applies. For LLPs not requiring tax audit: July 31. For LLPs requiring tax audit (turnover above Rs 1 crore): October 31.",
        "q": "When is Business ITR due?",
        "category": "General"
      },
      {
        "a": "ITR-6 for companies (Pvt Ltd, Public Ltd, OPC). ITR-5 for LLPs and partnership firms.",
        "q": "What is the difference between ITR-5 and ITR-6?",
        "category": "General"
      },
      {
        "a": "Audited financials (P&L, Balance Sheet), trial balance, bank statements, Form 26AS, and depreciation schedule.",
        "q": "What documents do I need?",
        "category": "Process"
      },
      {
        "a": "Mandatory for all Pvt Ltd companies regardless of turnover. For LLPs: mandatory above Rs 40 lakh turnover or Rs 25 lakh contribution.",
        "q": "Do I need a statutory audit?",
        "category": "Process"
      }
    ],
    "review_sources": [
      {
        "url": "https://www.incometax.gov.in",
        "name": "Income Tax India",
        "description": "Official Income Tax e-filing portal"
      },
      {
        "url": "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
        "name": "Income Tax Act, 1961",
        "description": "Section 139: Due dates. Section 234: Interest provisions."
      }
    ],
    "unlocks": [
      {
        "name": "Statutory Audit",
        "slug": "statutory-audit",
        "type": "required",
        "price": "₹17,999",
        "explanation": "Required above ₹1Cr turnover. Must be done before ITR."
      }
    ],
    "review_keyword_chips": [
      "✓ Filed before deadline",
      "✓ CA reviewed depreciation",
      "✓ Draft shared before filing",
      "✓ Acknowledgement same day"
    ],
    "related_slugs": [
      "director-kyc",
      "mca-annual-filing",
      "gst-annual-return"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "Business ITR is the annual income tax return filed by companies (ITR-6) and LLPs or partnerships (ITR-5) under Section 139 of the Income Tax Act, 1961. It reports income, expenses, depreciation, and tax computation for the financial year and is due October 31 for tax audit cases.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "Mandatory for every company and LLP regardless of whether the business made a profit or loss. Filing a loss return preserves your right to carry it forward against future profits. Banks, visa offices, and government tender departments ask for 2-3 years of ITR as standard.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "Interest at 1% per month on unpaid tax from the due date. Loss returns filed late cannot carry forward losses - that tax benefit is permanently gone. The department can reopen assessments up to 3 years back for unexplained discrepancies.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 8,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "mca-annual-filing",
    "name": "MCA Annual Filing",
    "short_name": "MCA Annual",
    "tagline": "AOC-4 and MGT-7. The annual return every Pvt Ltd must file.",
    "short_description": "Annual ROC compliance for Pvt Ltd - AOC-4 (financial statements) and MGT-7 (annual return) filed together.",
    "full_description": null,
    "category": "Annual Compliance",
    "service_type": "Annual",
    "mandatory_for": "All Pvt Ltd and OPC companies",
    "legal_basis": "Companies Act 2013, Section 92 & 137",
    "penalty_for_missing": "₹100/day per form — no ceiling",
    "penalty_color": "red",
    "price_base_paisa": 299900,
    "price_govt_fees_paisa": 60000,
    "govt_fee_label": "MCA filing fees",
    "govt_fee_note": "Paid to Ministry of Corporate Affairs. ₹300 per form.",
    "sla_working_days": 7,
    "billing_cycle": "annual",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [
      "AOC-4 (Financial Statements) preparation and filing",
      "MGT-7/MGT-7A (Annual Return) preparation and filing",
      "Board resolution drafting for approvals",
      "DIR-3 KYC reminder coordination",
      "Filing fee payment to MCA",
      "Acknowledgment receipts for all filings",
      "Next year compliance calendar"
    ],
    "scope_excluded": [
      "Statutory audit of financial statements",
      "DIR-3 KYC for directors (charged separately)",
      "Director appointments or resignations",
      "Increase in authorised capital",
      "Change in registered office"
    ],
    "seo_title": "MCA Annual Filing AOC-4 MGT-7 | ₹3,599 | Ollvy",
    "seo_description": "File AOC-4 and MGT-7 before due date. Fixed price ₹3,599 including govt fees.",
    "canonical_url": "https://www.ollvy.com/services/mca-annual-filing",
    "workflow_stages": [
      {
        "body": "Company CIN, financial year, AGM date, and status of audited financials. CS assigned.",
        "step": 1,
        "title": "Share company details",
        "visual": "checklist",
        "timeline": "Day 0",
        "milestone": "CS assigned"
      },
      {
        "body": "Audited Balance Sheet, P&L, director report, auditor report, and shareholder list. CS reviews before drafting forms.",
        "step": 2,
        "title": "Upload financial statements and documents",
        "visual": "upload",
        "timeline": "Day 0-2",
        "milestone": "Documents reviewed"
      },
      {
        "body": "AOC-4 and MGT-7 drafted. You review and approve in the app.",
        "step": 3,
        "title": "Forms drafted and sent for approval",
        "visual": "form",
        "timeline": "Day 2-4",
        "milestone": "Draft forms approved"
      },
      {
        "body": "Both forms filed. Service Request Numbers shared immediately as proof of filing.",
        "step": 4,
        "title": "Filed on MCA21 - SRN generated",
        "visual": "stamp",
        "timeline": "Day 5-7",
        "milestone": "AOC-4 and MGT-7 filed",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "title": "AOC-4 and MGT-7 both filed",
        "description": "Financial statements and annual return submitted to MCA."
      },
      {
        "title": "Late additional fee calculated upfront",
        "description": "Exact penalty told before you commit - not after."
      },
      {
        "title": "SRN shared immediately on submission",
        "description": "Proof of filing in your app the same day."
      }
    ],
    "service_risks": [
      {
        "body": "AOC-4 requires signed, audited financial statements. We cannot file until the audit is done. Plan your audit timeline to allow filing before the deadline.",
        "icon": "document",
        "title": "Audit must be complete first"
      },
      {
        "body": "If your AGM is delayed past September 30, MCA filing deadlines shift. We calculate new deadlines from your actual AGM date.",
        "icon": "clock",
        "title": "AGM not held on time"
      },
      {
        "body": "Rs 100 per day per form from the deadline. For both forms, Rs 200 per day. No ceiling on the penalty. File as soon as documents are ready.",
        "icon": "alert",
        "title": "Penalty accrues daily"
      }
    ],
    "profile_personas": [
      {
        "label": "First year after incorporation",
        "detail": "First MCA filing. We explain every field and what it means."
      },
      {
        "label": "Running past the deadline",
        "detail": "Already in default. We calculate penalty and file immediately to stop it."
      },
      {
        "label": "Director changes during the year",
        "detail": "Appointments and resignations reflected correctly in MGT-7."
      },
      {
        "label": "Share transfer happened",
        "detail": "Updated shareholding pattern captured accurately."
      }
    ],
    "faqs": [
      {
        "a": "AOC-4: within 30 days of AGM. MGT-7: within 60 days of AGM. AGM must be held by September 30 for companies with a March financial year end.",
        "q": "When is MCA annual filing due?",
        "category": "General"
      },
      {
        "a": "Yes. MCA annual filing is for the Ministry of Corporate Affairs (company registry). Business ITR is filed with the Income Tax department. Both are mandatory and have separate deadlines.",
        "q": "Is this different from Business ITR?",
        "category": "General"
      },
      {
        "a": "No. AOC-4 requires signed, audited financials.",
        "q": "Can I file if the audit is not complete?",
        "category": "Process"
      },
      {
        "a": "Penalty is Rs 100 per day per form from the due date. We calculate the exact amount and file immediately to stop further accumulation.",
        "q": "What if I missed the deadline?",
        "category": "Process"
      },
      {
        "a": "Audited Balance Sheet, P&L, notes to accounts, director report, auditor report, and updated shareholder list.",
        "q": "What documents do I need?",
        "category": "Documents"
      }
    ],
    "review_sources": [
      {
        "url": "https://www.mca.gov.in",
        "name": "MCA21 Portal",
        "description": "Ministry of Corporate Affairs — company filings"
      },
      {
        "url": "https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf",
        "name": "Companies Act 2013",
        "description": "Section 92 & 137: Annual return requirements"
      }
    ],
    "unlocks": [
      {
        "name": "Director KYC",
        "slug": "director-kyc",
        "type": "required",
        "price": "₹499",
        "explanation": "Due Sep 30 every year. ₹5,000/day penalty."
      },
      {
        "name": "Business ITR",
        "slug": "business-itr",
        "type": "required",
        "price": "₹4,999",
        "explanation": "ITR-6 due Oct 31 every year."
      }
    ],
    "review_keyword_chips": [
      "✓ Both forms filed",
      "✓ Penalty was clear upfront",
      "✓ CS reviewed financials",
      "✓ SRN same day"
    ],
    "related_slugs": [
      "director-kyc",
      "business-itr",
      "pvt-ltd-incorporation"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "MCA Annual Filing for a Private Limited Company consists of two mandatory ROC forms: AOC-4 (audited financial statements) and MGT-7 (annual return reporting shareholding, directors, and meeting details). Both are filed with the Registrar of Companies every year.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "Mandatory for every Pvt Ltd regardless of whether the company was active. AOC-4 is due within 30 days of the AGM. MGT-7 is due within 60 days of the AGM. The AGM must be held within 6 months of the financial year end (by September 30 for companies with March year-end). Non-filing results in company status being marked as Default on MCA - visible to anyone doing due diligence.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "Penalty of Rs 100 per day per form with no ceiling. Both forms outstanding means Rs 200 per day. Directors can be disqualified under Section 164(2) if filing defaults persist. Banks may flag accounts on seeing Default status. Company can be struck off as defunct after 2 years of non-filing.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 9,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "cloud-kitchen-setup",
    "name": "Cloud Kitchen Setup",
    "short_name": "Cloud Kitchen",
    "tagline": "Every licence a cloud kitchen needs. One package. Done right.",
    "short_description": "Complete licensing for delivery-only food operations - FSSAI State License, GST Registration, and local trade/health licence coordinated together.",
    "full_description": null,
    "category": "Licensing",
    "service_type": "One-time",
    "mandatory_for": "Cloud kitchens, dark kitchens, home bakers going commercial",
    "legal_basis": "Food Safety and Standards Act, 2006; CGST Act 2017; Shops and Establishments Act",
    "penalty_for_missing": "₹10,000 + ₹100/day FSSAI penalty + platform rejection",
    "penalty_color": "red",
    "price_base_paisa": 1999900,
    "price_govt_fees_paisa": 210000,
    "govt_fee_label": "FSSAI license fee",
    "govt_fee_note": "Paid to FSSAI. Fee varies by license type and validity.",
    "sla_working_days": 45,
    "billing_cycle": "one_time",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [
      "FSSAI License (State License for turnover ₹12L-20Cr)",
      "GST Registration",
      "Shop & Establishment Registration",
      "Trade License application (municipal corporation)",
      "All four licenses filed simultaneously",
      "Single point of contact for everything",
      "Consolidated document checklist",
      "Combined compliance calendar after setup",
      "Priority processing for faster go-live"
    ],
    "scope_excluded": [
      "Fire NOC",
      "Pollution NOC",
      "FSSAI Central Licence (above Rs. 20 crore turnover)",
      "Swiggy or Zomato onboarding",
      "Premises search or rental",
      "Kitchen equipment procurement"
    ],
    "seo_title": "Cloud Kitchen Setup Bundle | ₹22,099 | Ollvy",
    "seo_description": "FSSAI, GST, Shop Act, Trade License - filed simultaneously for your cloud kitchen. Fixed price ₹22,099 including govt fees.",
    "canonical_url": "https://www.ollvy.com/services/cloud-kitchen-setup",
    "workflow_stages": [
      {
        "body": "Turnover, kitchen area, menu category, GST status. We determine the correct FSSAI licence type and local authority requirements for your location.",
        "step": 1,
        "title": "Business details and kitchen address",
        "visual": "checklist",
        "timeline": "Day 0",
        "milestone": "Compliance expert assigned, licence types confirmed"
      },
      {
        "body": "Business registration proof, kitchen layout plan, food safety plan, equipment list, address proof, and owner ID.",
        "step": 2,
        "title": "Upload documents through the app",
        "visual": "upload",
        "timeline": "Day 0-2",
        "milestone": "Documents verified"
      },
      {
        "body": "Form B filed on the FSSAI portal. ARN generated and shared.",
        "step": 3,
        "title": "FSSAI application filed",
        "visual": "form",
        "timeline": "Day 2-5",
        "milestone": "FSSAI application submitted"
      },
      {
        "body": "GST REG-01 filed in parallel. ARN shared same day.",
        "step": 4,
        "title": "GST registration filed (if not already registered)",
        "visual": "form",
        "timeline": "Day 2-5",
        "milestone": "GST application submitted"
      },
      {
        "body": "Application filed with your municipal authority. Requirements vary by city.",
        "step": 5,
        "title": "Local trade/health licence application",
        "visual": "form",
        "timeline": "Day 3-7",
        "milestone": "Trade licence application filed"
      },
      {
        "body": "State and Central FSSAI licences require a physical inspection. We provide a pre-inspection checklist: hygiene standards, pest control certificate, water test report, equipment labels.",
        "step": 6,
        "title": "Inspection coordinated (FSSAI State/Central)",
        "visual": "calendar",
        "timeline": "Day 7-14",
        "milestone": "Inspection completed"
      },
      {
        "body": "FSSAI licence number, GSTIN, and trade licence received. All uploaded to your account.",
        "step": 7,
        "title": "All licences issued",
        "visual": "stamp",
        "timeline": "Day 10-21",
        "milestone": "Kitchen ready to list on platforms",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "body": "Basic Registration (up to Rs 12 lakh turnover), State License (Rs 12 lakh to Rs 20 crore), or Central License (above Rs 20 crore or multi-state). We confirm the right type before you pay the government fee.",
        "title": "FSSAI licence - correct type determined upfront"
      },
      {
        "body": "Full GST registration process including CA assignment, document verification, and ARN tracking. Included in the bundle.",
        "title": "GST registration"
      },
      {
        "body": "Filed with your municipal authority. Requirements differ by city - Delhi, Mumbai, Bangalore each have different processes. We handle your specific city.",
        "title": "Local trade/health licence"
      },
      {
        "body": "For State and Central FSSAI licences, we provide a checklist of what inspectors check: pest control certificate, water testing, equipment hygiene, food safety plan. Reduces the risk of inspection failure.",
        "title": "Pre-inspection checklist"
      },
      {
        "body": "FSSAI licence is valid for 1-5 years (you choose at application). Renewal reminder added to your compliance calendar.",
        "title": "Renewal tracking"
      }
    ],
    "service_risks": [
      {
        "body": "State and Central licences require physical inspection. Common failure points: no pest control certificate, missing water quality test, equipment without hygiene labels. Our pre-inspection checklist addresses all of these.",
        "icon": "alert",
        "title": "FSSAI inspection failure"
      },
      {
        "body": "Applying for Basic Registration when you need a State Licence gets rejected. We verify your turnover and operation type before filing.",
        "icon": "document",
        "title": "Wrong FSSAI licence type"
      },
      {
        "body": "GST registration requires Aadhaar-based authentication. If your linked mobile is inactive, OTP fails. We verify this before filing.",
        "icon": "mismatch",
        "title": "GST Aadhaar OTP failure"
      }
    ],
    "profile_personas": [
      {
        "label": "New cloud kitchen, no existing licences",
        "detail": "Starting from scratch. All three licences handled together."
      },
      {
        "label": "Home baker scaling to commercial",
        "detail": "Moving from home to a commercial kitchen. State Licence now required."
      },
      {
        "label": "Already have GST, need FSSAI",
        "detail": "Partial bundle - FSSAI and trade licence only."
      },
      {
        "label": "Multi-city expansion",
        "detail": "New kitchen location in a new city. Fresh local licences required for each location."
      }
    ],
    "faqs": [
      {
        "a": "Yes. All food businesses need FSSAI. Below Rs 12 lakh turnover: Basic Registration. Above: State or Central License. No exemptions for cloud kitchens.",
        "q": "Do I need FSSAI even for a small kitchen?",
        "category": "General"
      },
      {
        "a": "No. Both platforms require FSSAI licence number at onboarding. You cannot list without it.",
        "q": "Can I list on Swiggy or Zomato before getting licences?",
        "category": "General"
      },
      {
        "a": "Basic Registration: turnover below Rs 12 lakh, no inspection. State License: Rs 12 lakh to Rs 20 crore, inspection required. Central License: above Rs 20 crore or operating across multiple states.",
        "q": "What is the difference between FSSAI Registration and State License?",
        "category": "General"
      },
      {
        "a": "1 to 5 years - you choose at the time of application. Renewal must be applied for before expiry.",
        "q": "How long is the FSSAI licence valid?",
        "category": "Process"
      },
      {
        "a": "No. Multiple brands (virtual restaurants) can operate from one kitchen under one FSSAI licence at one address.",
        "q": "Does a cloud kitchen need a separate address for each brand?",
        "category": "Process"
      },
      {
        "a": "Business registration, owner ID and address proof, kitchen layout plan, food safety plan, equipment list, and pest control certificate for State/Central applications.",
        "q": "What documents are needed?",
        "category": "Documents"
      }
    ],
    "review_sources": [
      {
        "url": "https://foscos.fssai.gov.in",
        "name": "FSSAI FoSCoS Portal",
        "description": "Food licensing and registration portal"
      },
      {
        "url": "https://www.gst.gov.in",
        "name": "GST Portal",
        "description": "Official GST registration and filing"
      },
      {
        "url": "https://www.fssai.gov.in/cms/food-safety-and-standards-act-2006.php",
        "name": "Food Safety and Standards Act, 2006",
        "description": "FSSAI licensing requirements"
      }
    ],
    "unlocks": [
      {
        "name": "List on Swiggy and Zomato",
        "slug": "",
        "type": "required",
        "price": "Free",
        "explanation": "Both platforms require FSSAI number during onboarding. Submit immediately after certificate is issued."
      },
      {
        "name": "GST Monthly Filing",
        "slug": "gst-monthly-filing",
        "type": "required",
        "price": "₹2,999/month",
        "explanation": "Once GST is registered, monthly returns are due by the 20th. Missing one means TCS deducted by Swiggy stays stuck."
      },
      {
        "name": "Trademark Registration",
        "slug": "trademark-word-mark",
        "type": "beneficial",
        "price": "₹14,999",
        "explanation": "Competitors can register your cloud kitchen brand name on Swiggy once you scale. File early."
      },
      {
        "name": "FSSAI Annual Return",
        "slug": "fssai-annual-return",
        "type": "required",
        "price": "₹2,999/yr",
        "explanation": "FSSAI-licensed businesses must file an annual return every May 31. Penalty: ₹100/day for late filing."
      }
    ],
    "review_keyword_chips": [
      "Quick",
      "Transparent",
      "Professional",
      "No surprises",
      "Single contact"
    ],
    "related_slugs": [
      "fssai-license",
      "gst-registration",
      "trademark-word-mark"
    ],
    "show_completion_stats": false,
    "show_approval_rate": true,
    "variants": [
      {
        "id": "fssai-basic",
        "label": "Under ₹12L/year",
        "sublabel": "FSSAI Basic Registration",
        "priceAdjustment": -1000000,
        "govtFeeAdjustment": -110000
      },
      {
        "id": "fssai-state",
        "label": "₹12L - ₹20Cr/year",
        "sublabel": "FSSAI State License",
        "priceAdjustment": 0,
        "govtFeeAdjustment": 0
      }
    ],
    "default_variant_id": "fssai-state",
    "comparison_without": [
      "Wrong FSSAI license type - Basic when State is needed. Swiggy rejects it on onboarding.",
      "GST registration at wrong address - GSTIN must match your kitchen address.",
      "FSSAI inspection failed - no prep. Dirty kitchen, missing layout, wrong documents.",
      "Missing Eating House License - Delhi requires police clearance separately.",
      "3 months of back and forth. No single point of contact."
    ],
    "comparison_with": [
      "Correct license type confirmed before filing. Turnover question determines Basic vs State.",
      "GST address cross-checked with FSSAI address. Both applications use the same address.",
      "Premises checklist sent before inspection. 7 days before: layout, cleanliness, document display.",
      "Eating House + Trade License both covered. City-specific requirements mapped.",
      "One professional, one WhatsApp. Direct contact throughout."
    ],
    "addons": [
      {
        "id": "gst-registration",
        "name": "GST Registration",
        "required": false,
        "pricePaisa": 899900,
        "description": "GSTIN in 7 working days. Required for Swiggy/Zomato.",
        "govtFeePaisa": 0,
        "defaultSelected": true
      },
      {
        "id": "shop-establishment",
        "name": "Shop & Establishment",
        "required": false,
        "pricePaisa": 519900,
        "description": "Labour department registration. 5-7 working days.",
        "govtFeePaisa": 0,
        "defaultSelected": true
      },
      {
        "id": "trade-license",
        "name": "Trade License / Eating House",
        "required": false,
        "pricePaisa": 999900,
        "description": "Municipal corporation license. 15-30 working days.",
        "govtFeePaisa": 0,
        "defaultSelected": true
      }
    ],
    "is_bundle": true,
    "service_explainer": {
      "steps": [
        {
          "body": "Cloud Kitchen Setup is a bundled service that handles all mandatory licences for a delivery-only commercial kitchen: FSSAI State License (or Central License based on turnover), GST Registration, and local trade/health licence from your municipal authority. Unlike a restaurant, you do not need a seating permit, but food safety and tax registrations apply in full.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "Food delivery platforms (Swiggy, Zomato, and others) will not onboard you without a valid FSSAI licence number. Without GST registration, you cannot issue compliant invoices to platforms or claim ITC on kitchen equipment and raw materials. Operating without a trade licence exposes you to closure notices from local authorities.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "You cannot list on food delivery platforms - the primary revenue channel for cloud kitchens. Food safety officers can seal unlicensed premises. Penalty under FSSAI Act is up to Rs 5 lakh. Products can be seized. Insurance claims are rejected if you are operating without proper authorisation.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 11,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "tds-monthly-compliance",
    "name": "TDS Monthly Compliance",
    "short_name": "TDS Filing",
    "tagline": "Deduct TDS. Deposit the challan. File the return. Every month, on time.",
    "short_description": "Monthly TDS calculation, challan preparation, and quarterly return filing for all payment types.",
    "full_description": null,
    "category": "Monthly Compliance",
    "service_type": "Monthly retainer",
    "mandatory_for": "All businesses making TDS-applicable payments",
    "legal_basis": "Income Tax Act, 1961 — Sections 192–206",
    "penalty_for_missing": "1% per month interest + ₹200/day late fee",
    "penalty_color": "amber",
    "price_base_paisa": 99900,
    "price_govt_fees_paisa": 0,
    "govt_fee_label": null,
    "govt_fee_note": null,
    "sla_working_days": 3,
    "billing_cycle": "monthly",
    "retainer_cycle_label": "per month",
    "price_varies_by_state": false,
    "scope_included": [],
    "scope_excluded": [
      "TAN registration",
      "Payroll processing or salary structure design",
      "Response to demand notices",
      "TDS on property purchase (Section 194IA)",
      "Lower deduction certificate applications"
    ],
    "seo_title": "TDS Filing Monthly Service | ₹999/mo | Ollvy",
    "seo_description": "Monthly TDS compliance. Fixed ₹999/month.",
    "canonical_url": "https://www.ollvy.com/services/tds-monthly-compliance",
    "workflow_stages": [
      {
        "body": "Salary, vendor, rent, and contractor payments for the month. CA reviews applicable TDS rates for each category.",
        "step": 1,
        "title": "Share your payment register",
        "visual": "upload",
        "timeline": "Day 1-5 of month",
        "milestone": "Data received"
      },
      {
        "body": "CA calculates TDS for each payment category. Challans prepared with correct BSR codes and assessment year.",
        "step": 2,
        "title": "TDS calculated and challans prepared",
        "visual": "form",
        "timeline": "Day 5-6",
        "milestone": "Challans ready"
      },
      {
        "body": "You transfer through net banking. CIN (Challan Identification Number) uploaded to your account as proof.",
        "step": 3,
        "title": "You pay the challans",
        "visual": "stamp",
        "timeline": "Day 6-7",
        "milestone": "TDS deposited by 7th"
      },
      {
        "body": "CA files Form 24Q (salary TDS) and Form 26Q (non-salary TDS). Form 16 and 16A generation enabled after filing.",
        "step": 4,
        "title": "Quarterly return filed",
        "visual": "form",
        "timeline": "Quarter end",
        "milestone": "TDS return filed",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "title": "TDS calculated for all payment types",
        "description": "Salary, contractor, rent, professional fees - correct rates applied to each."
      },
      {
        "title": "Challans prepared before the 7th",
        "description": "You transfer the amount, they file."
      },
      {
        "title": "Quarterly returns filed",
        "description": "Form 24Q for salary, Form 26Q for all other payments."
      },
      {
        "title": "Form 16 and 16A generated",
        "description": "After each quarter is filed."
      }
    ],
    "service_risks": [
      {
        "body": "TDS must be deposited by the 7th of the following month (March TDS by April 30). Late deposit incurs 1.5% per month interest from the date of deduction.",
        "icon": "clock",
        "title": "Deposit due by 7th - not the 31st"
      },
      {
        "body": "Under-deducting makes you liable for the shortfall plus interest. We apply current applicable rates for each section.",
        "icon": "document",
        "title": "Wrong TDS rate"
      },
      {
        "body": "TDS at the higher rate of 20% applies if the deductee's PAN is not furnished. We flag missing PANs during data review.",
        "icon": "alert",
        "title": "Missing PAN of deductees"
      }
    ],
    "profile_personas": [
      {
        "label": "First time deducting TDS",
        "detail": "New to TDS obligations. We explain each section and threshold."
      },
      {
        "label": "Paying employees",
        "detail": "Form 24Q salary TDS handled, Form 16 generated quarterly."
      },
      {
        "label": "Paying contractors or consultants",
        "detail": "Form 26Q for 194C and 194J payments."
      },
      {
        "label": "Multiple payment types",
        "detail": "Rent, salary, contractors, professional fees - all categories covered under one retainer."
      }
    ],
    "faqs": [
      {
        "a": "Any business making payments above prescribed threshold limits - salary, rent above Rs 2.4 lakh per year, contractor payments above Rs 30,000 per contract or Rs 1 lakh per year, professional fees above Rs 30,000 per year.",
        "q": "Who needs to deduct TDS?",
        "category": "General"
      },
      {
        "a": "The expense is disallowed under Section 40(a)(ia) - you pay tax on it as if it were profit. Plus interest at 1.5% per month on the amount that should have been deducted.",
        "q": "What happens if I do not deduct TDS?",
        "category": "General"
      },
      {
        "a": "By the 7th of the following month for most payments. For March, the deadline is April 30.",
        "q": "When must TDS be deposited?",
        "category": "Process"
      },
      {
        "a": "Quarterly. Q1 (April-June): July 31. Q2 (July-Sep): October 31. Q3 (Oct-Dec): January 31. Q4 (Jan-Mar): May 31.",
        "q": "When are TDS returns due?",
        "category": "Process"
      }
    ],
    "review_sources": [
      {
        "url": "https://www.tdscpc.gov.in",
        "name": "TRACES",
        "description": "TDS Reconciliation System"
      }
    ],
    "unlocks": [
      {
        "name": "Payroll Management",
        "slug": "payroll-management",
        "type": "beneficial",
        "price": "₹1,499/month",
        "explanation": "Full payroll including salary TDS."
      }
    ],
    "review_keyword_chips": [
      "✓ Never missed deadline",
      "✓ Form 16 ready",
      "✓ CA explained rates"
    ],
    "related_slugs": [
      "payroll-management",
      "business-itr"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "TDS compliance means withholding tax from payments you make to vendors, contractors, employees, and landlords, depositing it with the government by the 7th of the following month, and filing quarterly returns (Form 24Q for salary, Form 26Q for non-salary). It is a separate obligation from your own tax liability.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "Any business making payments above TDS thresholds for rent, professional fees, contractor payments, salary, or interest must deduct and deposit TDS. Failure to deduct means the entire expense can be disallowed - you effectively get taxed twice on it.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "Interest at 1.5% per month on late deposit. Penalty up to Rs 200 per day for late filing of returns. If TDS is not deducted, the expense is disallowed under Section 40(a)(ia) - you pay tax on income you never actually kept. Vendors and employees cannot claim TDS credit in their own returns.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 12,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "business-pan",
    "name": "Business PAN Registration",
    "short_name": "Business PAN",
    "tagline": "Company PAN in 7 working days. Required before bank account, GST, or ITR.",
    "short_description": "Get your company or LLP PAN registered in 7 working days. Required for bank account opening, GST registration, and income tax filing. CA-handled, documents collected online.",
    "full_description": null,
    "category": "Compliance",
    "service_type": "One-time",
    "mandatory_for": "All companies, LLPs, partnership firms, trusts, and societies",
    "legal_basis": "Section 139A, Income Tax Act 1961",
    "penalty_for_missing": "Cannot open bank account, register for GST, or file income tax without PAN",
    "penalty_color": "red",
    "price_base_paisa": 99900,
    "price_govt_fees_paisa": 10700,
    "govt_fee_label": "NSDL processing fee",
    "govt_fee_note": "Paid to NSDL. Rs. 107 for domestic delivery, Rs. 1,017 for international.",
    "sla_working_days": 7,
    "billing_cycle": "one_time",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [],
    "scope_excluded": [
      "GST registration (available separately)",
      "TAN registration (available separately)",
      "PAN corrections or changes after allotment",
      "Duplicate PAN for lost physical card",
      "Individual director PAN (each director needs a separate individual PAN)"
    ],
    "seo_title": "Business PAN Registration for Company, LLP and Firm (2025) | Ollvy",
    "seo_description": "Get your company or LLP PAN registered in 7 working days. Required for bank account opening, GST registration, and income tax filing. CA-handled, documents collected online.",
    "canonical_url": "https://www.ollvy.com/services/business-pan",
    "workflow_stages": [
      {
        "body": "Answer questions about your entity type, incorporation date, and signatory details. Upload Certificate of Incorporation, address proof, and signatory documents. CA reviews within 4 hours.",
        "step": 1,
        "title": "Upload documents - CA reviews same day",
        "visual": "upload",
        "timeline": "Day 0",
        "milestone": "Documents verified by CA"
      },
      {
        "body": "CA prepares Form 49A with your entity details, registered office address, and authorised signatory information. All fields completed correctly for your entity type.",
        "step": 2,
        "title": "Form 49A prepared",
        "visual": "form",
        "timeline": "Day 1",
        "milestone": "Form 49A ready for submission"
      },
      {
        "body": "Form 49A submitted on NSDL portal with supporting documents. Acknowledgement number generated immediately and shared in your app.",
        "step": 3,
        "title": "Application submitted to NSDL",
        "visual": "form",
        "timeline": "Day 1-2",
        "milestone": "NSDL acknowledgement number shared"
      },
      {
        "body": "Income Tax Department processes your application. This stage is governed by government timelines. You can track status on the NSDL portal using your acknowledgement number.",
        "step": 4,
        "title": "NSDL processing",
        "visual": "calendar",
        "timeline": "Day 2-5",
        "milestone": "Application under processing"
      },
      {
        "body": "e-PAN delivered to your registered email. Physical card dispatched by NSDL to your registered office address. PAN added to your Ollvy compliance calendar for ITR deadlines.",
        "step": 5,
        "title": "PAN delivered",
        "visual": "stamp",
        "timeline": "Day 5-7",
        "milestone": "e-PAN delivered, compliance calendar updated",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "body": "All fields completed correctly for your entity type. NSDL portal submission handled end to end.",
        "title": "CA prepares and files Form 49A",
        "comparisonWithout": "Navigate NSDL portal yourself - 2+ hours, risk of rejection for incorrect fields",
        "comparisonWithOllvy": "CA handles everything - you upload documents, we file"
      },
      {
        "body": "NSDL acknowledgement number shared immediately on submission so you can track status yourself. Banks accept the acknowledgement letter while PAN is processing.",
        "title": "Acknowledgement number shared same day"
      },
      {
        "body": "e-PAN sent the moment NSDL allots the number. Physical card delivered in 10 to 15 days to your registered office.",
        "title": "e-PAN delivered to your email"
      },
      {
        "body": "Linked to your Ollvy account for ITR and other filing deadlines from day one. Never miss a deadline.",
        "title": "PAN added to your compliance calendar"
      }
    ],
    "service_risks": [
      {
        "body": "The entity name on Form 49A must match the Certificate of Incorporation exactly. Even small differences like Pvt vs Private cause rejection. CA verifies all documents for consistency before submission.",
        "icon": "document",
        "title": "Name mismatch on documents"
      },
      {
        "body": "Address proof must be less than 2 months old. Old utility bills are the most common rejection reason. CA checks document dates before filing.",
        "icon": "mismatch",
        "title": "Outdated address proof"
      },
      {
        "body": "Companies and LLPs must provide a board resolution authorising the signatory. We provide the template after payment and verify it is properly signed before submission.",
        "icon": "alert",
        "title": "Missing board resolution"
      }
    ],
    "profile_personas": [
      {
        "label": "Just incorporated - need PAN for bank account",
        "detail": "Most common case. Company registered, bank requires PAN to open current account. We file immediately after incorporation."
      },
      {
        "label": "LLP needing PAN for GST registration",
        "detail": "GST portal requires PAN. We handle PAN first, then GST registration can proceed."
      },
      {
        "label": "Partnership firm registering for the first time",
        "detail": "Partnership deed and partner details required. Lower fee applies."
      },
      {
        "label": "Existing company - PAN never applied for",
        "detail": "Old company that operated without PAN. Now needed for compliance. We handle the application with current documents."
      }
    ],
    "faqs": [
      {
        "a": "Apply within the first week. You cannot open a bank account without PAN, and you cannot receive or make business payments without a bank account. Most founders apply for PAN and bank account simultaneously, using the PAN acknowledgement letter for the bank while the actual PAN is being processed.",
        "q": "My company was just incorporated. How urgently do I need PAN?",
        "category": "General"
      },
      {
        "a": "Yes. The company is a separate legal entity and needs its own PAN. Each director also needs their own individual PAN. These are different numbers for different purposes - company PAN for company tax filings, director PAN for personal filings.",
        "q": "Is the company PAN different from the director's PAN?",
        "category": "General"
      },
      {
        "a": "NSDL processes applications within 5 to 7 working days. e-PAN arrives by email within 48 hours of allotment. Physical card takes an additional 10 to 15 days.",
        "q": "How long does PAN registration take?",
        "category": "Process"
      },
      {
        "a": "Yes. Banks and the GST portal accept the NSDL acknowledgement number. We share the acknowledgement number the same day we submit your application.",
        "q": "Can I use the acknowledgement number while waiting?",
        "category": "Process"
      },
      {
        "a": "Not always. A sole proprietorship is not a separate legal entity, so the proprietor's individual PAN can be used. But if the business name differs from the personal name, a business PAN avoids confusion.",
        "q": "Does a proprietorship need a separate business PAN?",
        "category": "General"
      },
      {
        "a": "Yes. The GST portal links GSTIN to company PAN. Apply for PAN first, then GST. Ollvy handles both.",
        "q": "Is company PAN required for GST registration?",
        "category": "General"
      }
    ],
    "review_sources": [
      {
        "url": "https://www.incometax.gov.in/iec/foportal/help/how-to-apply-for-pan",
        "name": "Income Tax Department - PAN Application Guide",
        "description": "Official IT department guide for PAN application process"
      },
      {
        "url": "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
        "name": "NSDL e-Gov PAN Portal",
        "description": "NSDL portal where Form 49A applications are submitted"
      },
      {
        "url": "https://www.incometax.gov.in",
        "name": "Income Tax Act, 1961 (Section 139A)",
        "description": "Statutory requirement for PAN for companies and LLPs"
      }
    ],
    "unlocks": [
      {
        "name": "Open Company Bank Account",
        "slug": "",
        "type": "required",
        "price": "Free",
        "explanation": "Banks require PAN to open a current account. Use acknowledgement letter while PAN processes."
      },
      {
        "name": "GST Registration",
        "slug": "gst-registration",
        "type": "required",
        "price": "₹999",
        "explanation": "GST portal requires company PAN. Apply for GST once PAN is received."
      },
      {
        "name": "Business ITR Filing",
        "slug": "business-itr",
        "type": "required",
        "price": "₹4,999",
        "explanation": "Company must file ITR every year using company PAN. First ITR due by October 31."
      },
      {
        "name": "TDS Monthly Compliance",
        "slug": "tds-monthly-compliance",
        "type": "beneficial",
        "price": "₹2,999/month",
        "explanation": "TDS deductions are linked to company PAN. Required once you start paying salaries or vendor invoices."
      }
    ],
    "review_keyword_chips": [
      "e-PAN in 5 days",
      "Acknowledgement same day",
      "CA handled documents",
      "Bank-accepted letter"
    ],
    "related_slugs": [
      "gst-registration",
      "pvt-ltd-incorporation",
      "llp-incorporation",
      "tds-monthly-compliance",
      "business-itr"
    ],
    "show_completion_stats": true,
    "show_approval_rate": true,
    "variants": [
      {
        "id": "pvt-ltd-llp-opc",
        "label": "Pvt Ltd / LLP / OPC",
        "tooltip": "Companies and LLPs registered with the Ministry of Corporate Affairs. You will have a CIN or LLPIN.",
        "sublabel": "Incorporated with MCA",
        "priceAdjustment": 0
      },
      {
        "id": "partnership-proprietorship",
        "label": "Partnership / Proprietorship",
        "tooltip": "Partnership firms registered with the Registrar of Firms, or sole proprietorships registered under Shop and Establishment or GST.",
        "sublabel": "Registered firm or sole proprietorship",
        "priceAdjustment": -20000
      }
    ],
    "default_variant_id": "pvt-ltd-llp-opc",
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "A Business PAN (Permanent Account Number) is a 10-character alphanumeric identifier issued by the Income Tax Department. Every company, LLP, partnership firm, trust, and society must have its own PAN - separate from the directors' or partners' individual PANs.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "PAN is the foundational compliance document for any business. Without it, you cannot open a current bank account, register for GST, file income tax returns, or deduct TDS. It is typically the first compliance step after incorporation.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "No bank account, no GST registration, no ITR filing, no TDS compliance. Every financial transaction your company makes requires PAN. Operating without it is not possible for any registered business entity.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 15,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "gst-cancellation",
    "name": "GST Cancellation",
    "short_name": "GST Cancel",
    "tagline": "Close your GST registration properly. Final return filed.",
    "short_description": "GST registration cancellation with GSTR-10 (final return) and ITC reversal handled.",
    "full_description": null,
    "category": "Tax Filing",
    "service_type": "One-time",
    "mandatory_for": "Businesses closing or below threshold",
    "legal_basis": null,
    "penalty_for_missing": null,
    "penalty_color": "none",
    "price_base_paisa": 99900,
    "price_govt_fees_paisa": 0,
    "govt_fee_label": null,
    "govt_fee_note": null,
    "sla_working_days": 15,
    "billing_cycle": "one_time",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [],
    "scope_excluded": [
      "Pending returns older than 12 months (quoted separately)",
      "ITC refund claims after cancellation",
      "Re-registration after cancellation",
      "Response to post-cancellation notices"
    ],
    "seo_title": "GST Cancellation | ₹999 | Ollvy",
    "seo_description": "Cancel GST registration. Final return included. Fixed price ₹999.",
    "canonical_url": "https://www.ollvy.com/services/gst-cancellation",
    "workflow_stages": [
      {
        "body": "Remaining ITC balance and pending tax liabilities reviewed. ITC on closing stock must be reversed.",
        "step": 1,
        "title": "ITC and liability review",
        "visual": "checklist",
        "timeline": "Day 0-2",
        "milestone": "Liability position confirmed"
      },
      {
        "body": "Final return prepared with closing stock details and ITC reversal calculation.",
        "step": 2,
        "title": "GSTR-10 prepared",
        "visual": "form",
        "timeline": "Day 2-5",
        "milestone": "Final return ready"
      },
      {
        "body": "Cancellation application and final return filed simultaneously.",
        "step": 3,
        "title": "REG-16 and GSTR-10 filed",
        "visual": "form",
        "timeline": "Day 5-10",
        "milestone": "Cancellation filed"
      },
      {
        "body": "GST officer reviews and issues the cancellation order.",
        "step": 4,
        "title": "Cancellation order received",
        "visual": "stamp",
        "timeline": "Day 10-15",
        "milestone": "GST registration cancelled",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "title": "What you owe calculated before we start",
        "description": "No surprise liability after filing."
      },
      {
        "title": "All pending returns filed first",
        "description": "Before the cancellation application is submitted."
      },
      {
        "title": "GSTR-10 final return filed",
        "description": "Closing stock and final position declared."
      },
      {
        "title": "REG-16 cancellation application",
        "description": "Submitted to the GST portal."
      }
    ],
    "service_risks": [
      {
        "body": "Any ITC taken on goods still in stock at the time of cancellation must be reversed or paid back. This is calculated before filing.",
        "icon": "alert",
        "title": "ITC reversal is mandatory"
      },
      {
        "body": "All outstanding GSTR-1 and GSTR-3B returns must be filed before a cancellation application can be processed.",
        "icon": "document",
        "title": "Pending returns must be cleared first"
      }
    ],
    "profile_personas": [
      {
        "label": "Closing business",
        "detail": "Winding down operations. Full clean-up handled."
      },
      {
        "label": "Below threshold",
        "detail": "Turnover dropped below Rs 40 lakh and you no longer need to be registered."
      },
      {
        "label": "Switching to composition scheme",
        "detail": "Cancelling regular registration before registering as composition dealer."
      }
    ],
    "faqs": [
      {
        "a": "ITC on closing stock must be reversed and paid back to the government. We calculate this before filing.",
        "q": "What happens to my remaining ITC balance?",
        "category": "General"
      },
      {
        "a": "Yes. A fresh registration application can be filed if your turnover crosses the threshold again.",
        "q": "Can I re-register for GST later?",
        "category": "General"
      },
      {
        "a": "15 working days from application to cancellation order, assuming no pending returns or outstanding liabilities.",
        "q": "How long does cancellation take?",
        "category": "Process"
      },
      {
        "a": "All pending GSTR-1 and GSTR-3B must be filed before we can file the cancellation application. We file those first.",
        "q": "What if I have pending returns?",
        "category": "Process"
      }
    ],
    "review_sources": [
      {
        "url": "https://www.gst.gov.in",
        "name": "GST Portal",
        "description": "Official GST cancellation process"
      },
      {
        "url": "https://cbic-gst.gov.in",
        "name": "CGST Act, Section 29",
        "description": "Cancellation of registration provisions"
      }
    ],
    "unlocks": [
      {
        "name": "Company Closure",
        "slug": "company-closure",
        "type": "beneficial",
        "price": "₹14,999",
        "explanation": "If closing entire business."
      }
    ],
    "review_keyword_chips": [
      "✓ ITC calculated properly",
      "✓ Returns filed first",
      "✓ Clean cancellation",
      "✓ Documentation complete",
      "✓ CA was thorough"
    ],
    "related_slugs": [
      "company-closure"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "GST cancellation is the formal process of surrendering your GSTIN when you close your business or your turnover drops below the mandatory threshold. It involves filing REG-16 (cancellation application) and GSTR-10 (final return declaring closing stock and reversing ITC).",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "If you stop business or fall below the threshold, continuing to hold a GSTIN means continuing to file monthly returns - even nil ones. Missed returns on an inactive registration trigger penalties and eventually suo-moto cancellation, which is harder to resolve than a clean voluntary cancellation.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "Monthly returns continue to be mandatory. Each missed return is Rs 50 per day per return. After 6 months of non-filing, the department cancels your registration suo-moto - at which point you owe all pending returns, interest, and penalties before you can do anything.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 22,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "gst-revocation",
    "name": "GST Revocation",
    "short_name": "GST Revoke",
    "tagline": "GST cancelled by the department? We restore it.",
    "short_description": "Revoke a suo-moto GST cancellation - pending returns filed, REG-21 submitted, registration restored.",
    "full_description": null,
    "category": "Tax Filing",
    "service_type": "One-time",
    "mandatory_for": "Businesses with cancelled GST",
    "legal_basis": null,
    "penalty_for_missing": "Loss of GST registration",
    "penalty_color": "red",
    "price_base_paisa": 249900,
    "price_govt_fees_paisa": 0,
    "govt_fee_label": null,
    "govt_fee_note": null,
    "sla_working_days": 10,
    "billing_cycle": "one_time",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [],
    "scope_excluded": [
      "Appeal to Appellate Authority if 30-day window has passed",
      "Fresh GST registration if revocation window is closed",
      "Response to notices after revocation"
    ],
    "seo_title": "GST Revocation | ₹2,499 | Ollvy",
    "seo_description": "Restore cancelled GST registration. Urgent filing. Fixed price ₹2,499.",
    "canonical_url": "https://www.ollvy.com/services/gst-revocation",
    "workflow_stages": [
      {
        "body": "Reason and date of suo-moto cancellation confirmed. Outstanding returns identified.",
        "step": 1,
        "title": "Review cancellation order",
        "visual": "checklist",
        "timeline": "Day 0-1",
        "milestone": "Cancellation order reviewed"
      },
      {
        "body": "All outstanding GSTR-1 and GSTR-3B filed with interest on late payment.",
        "step": 2,
        "title": "File all pending returns",
        "visual": "form",
        "timeline": "Day 1-5",
        "milestone": "Pending returns cleared"
      },
      {
        "body": "Revocation application submitted with explanation.",
        "step": 3,
        "title": "REG-21 filed",
        "visual": "form",
        "timeline": "Day 5-7",
        "milestone": "Revocation application filed"
      },
      {
        "body": "Officer reviews and restores registration.",
        "step": 4,
        "title": "GST registration restored",
        "visual": "stamp",
        "timeline": "Day 7-10",
        "milestone": "GSTIN active",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "title": "Total cost told upfront",
        "description": "Late fees included - before you commit."
      },
      {
        "title": "All pending returns filed",
        "description": "Within the 30-day revocation window."
      },
      {
        "title": "REG-21 revocation application submitted",
        "description": "To restore your GSTIN."
      }
    ],
    "service_risks": [
      {
        "body": "Revocation must be applied for within 30 days of the cancellation order date. Extensions are possible but require a separate application. Act immediately on receiving a cancellation order.",
        "icon": "clock",
        "title": "30-day deadline"
      },
      {
        "body": "The department will not process REG-21 unless all outstanding returns are filed and taxes paid with interest.",
        "icon": "alert",
        "title": "All pending returns must be filed first"
      }
    ],
    "profile_personas": [
      {
        "label": "Missed filings for several months",
        "detail": "GST cancelled for non-filing. All returns cleared and registration restored."
      },
      {
        "label": "Need to continue invoicing clients",
        "detail": "GSTIN required for ongoing business. We treat this as urgent."
      }
    ],
    "faqs": [
      {
        "a": "Suo-moto cancellation is typically triggered after 6 or more consecutive months of non-filing.",
        "q": "Why was my GST cancelled?",
        "category": "General"
      },
      {
        "a": "30 days from the date of the cancellation order. Apply immediately - do not wait.",
        "q": "What is the time limit for applying for revocation?",
        "category": "General"
      },
      {
        "a": "If the revocation window is missed, you must file an appeal with the Appellate Authority. This is a more involved process. Acting within 30 days avoids this.",
        "q": "Can I re-register if revocation fails?",
        "category": "Process"
      }
    ],
    "review_sources": [
      {
        "url": "https://www.gst.gov.in",
        "name": "GST Portal",
        "description": "Revocation application process"
      },
      {
        "url": "https://cbic-gst.gov.in",
        "name": "CGST Rules, Rule 23",
        "description": "Revocation of cancellation procedure"
      }
    ],
    "unlocks": [
      {
        "name": "GST Monthly Filing",
        "slug": "gst-monthly",
        "type": "required",
        "price": "From ₹2,999/mo",
        "explanation": "Never miss returns again."
      }
    ],
    "review_keyword_chips": [
      "✓ Deadline met",
      "✓ Returns filed quickly",
      "✓ GSTIN restored",
      "✓ Total cost clear upfront",
      "✓ CA was responsive"
    ],
    "related_slugs": [
      "gst-monthly"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "GST revocation is the process of restoring a GSTIN that was cancelled suo-moto by the GST department - typically for non-filing of returns for 6 or more consecutive months. It involves filing all pending returns, paying interest, and submitting REG-21 (revocation application) within 30 days of the cancellation order.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "A cancelled GSTIN means you cannot issue GST invoices, claim ITC, or generate e-way bills. If you want to continue business, revocation is the only path - you cannot simply re-register if cancelled for non-compliance.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "Business operations requiring GST invoicing are blocked. Clients cannot claim ITC on any invoices raised after cancellation. The 30-day window to apply for revocation closes. After that, reinstatement requires an appeal to the appellate authority, which is more complex.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 23,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "din-reactivation",
    "name": "DIN Reactivation",
    "short_name": "DIN Reactivate",
    "tagline": "DIN deactivated? We restore it.",
    "short_description": "Reactivate a deactivated Director Identification Number - pending KYC filed, DIR-3C application submitted, DIN restored.",
    "full_description": null,
    "category": "Company Registration",
    "service_type": "One-time",
    "mandatory_for": "Directors with deactivated DIN",
    "legal_basis": null,
    "penalty_for_missing": "Cannot act as director",
    "penalty_color": "red",
    "price_base_paisa": 199900,
    "price_govt_fees_paisa": 500000,
    "govt_fee_label": null,
    "govt_fee_note": null,
    "sla_working_days": 10,
    "billing_cycle": "one_time",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [],
    "scope_excluded": [
      "Government late fee of Rs. 5,000 per year (payable directly to MCA)",
      "MCA annual filing for companies where you are a director",
      "Multiple DINs (each is a separate service)",
      "DSC procurement"
    ],
    "seo_title": "DIN Reactivation | ₹6,999 | Ollvy",
    "seo_description": "Reactivate your DIN. Resume directorship. Fixed price ₹6,999 including govt fees.",
    "canonical_url": "https://www.ollvy.com/services/din-reactivation",
    "workflow_stages": [
      {
        "body": "DIN status verified on MCA21. Years of outstanding KYC identified.",
        "step": 1,
        "title": "Check reason for deactivation",
        "visual": "checklist",
        "timeline": "Day 0-1",
        "milestone": "Deactivation reason confirmed"
      },
      {
        "body": "DIR-3 KYC filed for all outstanding years with OTP verification. Rs 5,000 late fee applies per missed year.",
        "step": 2,
        "title": "File all pending DIR-3 KYC",
        "visual": "form",
        "timeline": "Day 1-5",
        "milestone": "All KYC filings cleared"
      },
      {
        "body": "Reactivation form filed with explanation and payment.",
        "step": 3,
        "title": "DIR-3C reactivation application",
        "visual": "form",
        "timeline": "Day 5-7",
        "milestone": "Reactivation application submitted"
      },
      {
        "body": "DIN status changed to Active on MCA21.",
        "step": 4,
        "title": "DIN reactivated",
        "visual": "stamp",
        "timeline": "Day 7-10",
        "milestone": "DIN active, all directorships restored",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "title": "Exact government fee calculated upfront",
        "description": "Rs. 5,000 per missed year - told before you start."
      },
      {
        "title": "All outstanding DIR-3 KYC years filed",
        "description": "Each year filed with Aadhaar OTP verification."
      },
      {
        "title": "DIR-3C reactivation application submitted",
        "description": "DIN restored across all your directorships."
      }
    ],
    "service_risks": [
      {
        "body": "The government late fee is Rs 5,000 per year of missed DIR-3 KYC. Multiple missed years means multiple fees - these are mandatory and non-negotiable.",
        "icon": "clock",
        "title": "Rs 5,000 per missed year"
      },
      {
        "body": "Every company where you are a director cannot file any MCA form while your DIN is deactivated. The impact is not limited to one company.",
        "icon": "building",
        "title": "All companies blocked until DIN is active"
      }
    ],
    "profile_personas": [
      {
        "label": "Missed DIR-3 KYC",
        "detail": "DIN deactivated for one or more years of missed KYC. Act before the company's filing deadlines pass."
      },
      {
        "label": "Multiple directorships",
        "detail": "One DIN reactivation covers all companies. We verify all directorships are unblocked."
      }
    ],
    "faqs": [
      {
        "a": "Deactivated when DIR-3 KYC is not filed by September 30 each year. Automated by MCA from October 1.",
        "q": "Why was my DIN deactivated?",
        "category": "General"
      },
      {
        "a": "Rs 5,000 per year of missed DIR-3 KYC. This is a government fee and is fixed.",
        "q": "What is the late fee?",
        "category": "General"
      },
      {
        "a": "10 working days from when we receive your documents.",
        "q": "How long does reactivation take?",
        "category": "Process"
      },
      {
        "a": "Yes. Your DIN is a single identifier. Reactivating it restores your status across all directorships.",
        "q": "Does reactivation fix the issue for all companies where I am a director?",
        "category": "Process"
      }
    ],
    "review_sources": [
      {
        "url": "https://www.mca.gov.in",
        "name": "MCA21 Portal",
        "description": "DIN status and KYC filing"
      },
      {
        "url": "https://www.mca.gov.in",
        "name": "Companies Rules, 2014",
        "description": "Rule 12A: KYC requirements"
      }
    ],
    "unlocks": [
      {
        "name": "Director KYC",
        "slug": "director-kyc",
        "type": "required",
        "price": "₹1,499",
        "explanation": "Annual filing to prevent future issues."
      }
    ],
    "review_keyword_chips": [
      "✓ DIN restored quickly",
      "✓ All years filed",
      "✓ Penalty explained",
      "✓ No more issues",
      "✓ CS was helpful"
    ],
    "related_slugs": [
      "director-kyc"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "DIN Reactivation is the process of restoring a Director Identification Number that has been deactivated - most commonly for non-filing of the annual DIR-3 KYC by September 30. It involves filing all outstanding DIR-3 KYC forms, paying the late fee, and submitting a DIR-3C reactivation application.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "A deactivated DIN means you cannot sign any company filings, resolutions, or official documents. Every company where you are a director is blocked from filing any MCA form until your DIN is restored. The penalty for each missed DIR-3 KYC is Rs 5,000.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "All companies where you hold a directorship cannot file their annual returns, director changes, or any other MCA form. If this persists, those companies accumulate penalties and can be marked as Default on MCA.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 29,
    "avg_rating": null,
    "rating_count": 0
  },
  {
    "slug": "company-name-change",
    "name": "Company Name Change",
    "short_name": "Name Change",
    "tagline": "New name. Same company. All MCA formalities handled.",
    "short_description": "Company name change with MCA - name availability search, special resolution, RUN filing, INC-24, and new Certificate of Incorporation.",
    "full_description": null,
    "category": "Company Registration",
    "service_type": "One-time",
    "mandatory_for": "Companies changing name",
    "legal_basis": null,
    "penalty_for_missing": null,
    "penalty_color": "none",
    "price_base_paisa": 499900,
    "price_govt_fees_paisa": 300000,
    "govt_fee_label": null,
    "govt_fee_note": null,
    "sla_working_days": 20,
    "billing_cycle": "one_time",
    "retainer_cycle_label": null,
    "price_varies_by_state": false,
    "scope_included": [],
    "scope_excluded": [
      "GST name update on GSTN portal",
      "Bank account name update",
      "Trademark filing in new name",
      "Stamp duty on amended MOA (payable per your state schedule)"
    ],
    "seo_title": "Company Name Change | ₹7,999 | Ollvy",
    "seo_description": "Change your company name with MCA. New certificate issued. Fixed price ₹7,999 including govt fees.",
    "canonical_url": "https://www.ollvy.com/services/company-name-change",
    "workflow_stages": [
      {
        "body": "New name searched against MCA company registry and trademark database. Conflicts identified before any filing.",
        "step": 1,
        "title": "Name availability check",
        "visual": "checklist",
        "timeline": "Day 0-2",
        "milestone": "Name confirmed available"
      },
      {
        "body": "Special resolution of shareholders required for name change. Board resolution and EGM notice drafted.",
        "step": 2,
        "title": "Board and shareholder resolution",
        "visual": "form",
        "timeline": "Day 2-7",
        "milestone": "Special resolution passed"
      },
      {
        "body": "Reserve Unique Name application submitted to MCA.",
        "step": 3,
        "title": "RUN filed",
        "visual": "form",
        "timeline": "Day 7-12",
        "milestone": "New name reserved"
      },
      {
        "body": "Name change application filed along with amended Memorandum of Association.",
        "step": 4,
        "title": "INC-24 filed with MOA amendment",
        "visual": "form",
        "timeline": "Day 12-18",
        "milestone": "INC-24 submitted"
      },
      {
        "body": "Fresh Certificate with new company name. CIN remains the same.",
        "step": 5,
        "title": "New Certificate of Incorporation issued",
        "visual": "stamp",
        "timeline": "Day 18-20",
        "milestone": "Name change complete",
        "isCompletion": true
      }
    ],
    "whats_included": [
      {
        "title": "Name checked against MCA and trademark registry",
        "description": "Before filing - conflicts identified upfront."
      },
      {
        "title": "Special resolution and board resolution drafted",
        "description": "Per Companies Act requirements."
      },
      {
        "title": "MOA amendment and INC-24 filed",
        "description": "With MCA."
      },
      {
        "title": "New Certificate of Incorporation",
        "description": "With updated company name."
      }
    ],
    "service_risks": [
      {
        "body": "After the name change, you must update GST (core amendment), bank accounts, trademark if registered, import-export code, FSSAI if applicable, and all contracts. The MCA name change does not cascade automatically to other registrations.",
        "icon": "alert",
        "title": "Update all downstream registrations"
      },
      {
        "body": "If someone has registered a similar trademark, MCA may reject the name or you may receive a legal notice after the change. Our trademark search reduces this risk.",
        "icon": "document",
        "title": "Trademark conflict"
      }
    ],
    "profile_personas": [
      {
        "label": "Rebranding",
        "detail": "New brand identity. MCA name aligned with new brand."
      },
      {
        "label": "Business pivot",
        "detail": "Core business changed. Name no longer reflects the company."
      },
      {
        "label": "Name conflict",
        "detail": "Another company has a similar name causing confusion. Changing to a distinct name."
      }
    ],
    "faqs": [
      {
        "a": "PAN and TAN remain the same. GST requires a core amendment (name change update) - separate process but straightforward.",
        "q": "Does my PAN or GST change when I change my company name?",
        "category": "Process"
      },
      {
        "a": "Subject to MCA availability and not containing restricted words. Name must be distinct from existing companies and trademarks.",
        "q": "Can I change the name to anything?",
        "category": "Process"
      },
      {
        "a": "20 working days from start to new Certificate of Incorporation.",
        "q": "How long does the process take?",
        "category": "Process"
      },
      {
        "a": "Yes. A name change requires a special resolution (75% majority of shareholders voting in favour).",
        "q": "Do I need a special resolution?",
        "category": "Process"
      }
    ],
    "review_sources": [
      {
        "url": "https://www.mca.gov.in",
        "name": "MCA21 Portal",
        "description": "Name change application"
      },
      {
        "url": "https://www.mca.gov.in",
        "name": "Companies Act, Section 13",
        "description": "Name change provisions"
      }
    ],
    "unlocks": [
      {
        "name": "Trademark Registration",
        "slug": "trademark-registration",
        "type": "beneficial",
        "price": "₹12,499",
        "explanation": "Protect new company name."
      }
    ],
    "review_keyword_chips": [
      "✓ Name reserved",
      "✓ SR properly done",
      "✓ New CoI received",
      "✓ Update guidance",
      "✓ Smooth process"
    ],
    "related_slugs": [
      "trademark-registration"
    ],
    "show_completion_stats": false,
    "show_approval_rate": false,
    "variants": null,
    "default_variant_id": null,
    "comparison_without": null,
    "comparison_with": null,
    "addons": null,
    "is_bundle": false,
    "service_explainer": {
      "steps": [
        {
          "body": "A company name change under Section 13 of the Companies Act, 2013 involves passing a special resolution of shareholders, reserving the new name via RUN, amending the Memorandum of Association, and filing INC-24 with MCA. MCA issues a new Certificate of Incorporation with the updated name.",
          "step": 1,
          "title": "What it is",
          "visual": "info"
        },
        {
          "body": "If you are rebranding, pivoting your business model, or resolving a conflict with another company's name, the legal name change must be completed through MCA. Using a new trading name without changing the registered name creates legal and commercial inconsistencies.",
          "step": 2,
          "title": "Why you need it",
          "visual": "sparkles"
        },
        {
          "body": "Operating under a name different from your MCA-registered name creates confusion in contracts, invoices, and bank records. Counterparties doing due diligence will find the mismatch. Bank accounts, GST, and other registrations remain in the old name until formally updated.",
          "step": 3,
          "title": "What happens without it",
          "visual": "alert"
        }
      ]
    },
    "has_govt_processing": false,
    "completion_min_days": null,
    "completion_max_days": null,
    "completion_range_text": null,
    "display_order": 30,
    "avg_rating": null,
    "rating_count": 0
  }
]
```

---

## 3. Unified Service Page Template

### 3A. `app/(main)/services/[slug]/page.tsx` — Server Component (Route Handler)

```tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { getServiceBySlugFromDB, getAllServiceSlugs, getServiceReviews, getRelatedServicesBySlugs } from '@/lib/data/services'
import { UnifiedServicePage } from '@/components/service/UnifiedServicePage'
import { ServiceStructuredData } from '@/components/seo/ServiceStructuredData'
import { getFallbackReviews } from '@/lib/data/fallback-reviews'

/**
 * Service Detail Page - Server Component
 *
 * ALL content is now fetched from the database (no static configs).
 * This makes every service detail page editable from the admin dashboard.
 *
 * ISR - revalidate: 3600 (rebuilds hourly)
 */

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const getCachedService = unstable_cache(() => getServiceBySlugFromDB(slug), [`service-${slug}`], { revalidate: 3600 })
  const { service } = await getCachedService()

  if (!service) {
    return {
      title: 'Service Not Found | Ollvy',
      description: 'The requested service could not be found.',
    }
  }

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: {
      canonical: service.canonicalUrl,
    },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url: service.canonicalUrl,
      siteName: 'Ollvy',
      type: 'website',
      images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.seoTitle,
      description: service.seoDescription,
      images: ['https://www.ollvy.com/logo.png'],
    },
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params

  // Fetch complete service data from database (cached)
  const getCachedService = unstable_cache(() => getServiceBySlugFromDB(slug), [`service-${slug}`], { revalidate: 3600 })
  const { service, pricing } = await getCachedService()

  if (!service) {
    notFound()
  }

  // Fetch reviews and related services in parallel (cached)
  const getCachedReviews = unstable_cache(() => getServiceReviews(service.id), [`service-reviews-${slug}`], { revalidate: 3600 })
  const getCachedRelated = unstable_cache(() => getRelatedServicesBySlugs(service.relatedSlugs), [`service-related-${slug}`], { revalidate: 3600 })
  const [reviews, relatedServices] = await Promise.all([
    getCachedReviews(),
    getCachedRelated(),
  ])

  // Get price in rupees
  const basePrice = pricing?.ollvyFee || service.ollvyFee || 0

  return (
    <>
      <ServiceStructuredData
        serviceName={service.name}
        serviceSlug={slug}
        description={service.seoDescription || service.tagline}
        price={basePrice}
        govtFee={service.govtFee}
        category={service.category}
        avgRating={service.avgRating}
        totalRatings={service.totalRatings}
        faqs={service.faqs}
        reviews={reviews}
        fallbackReviews={getFallbackReviews(slug)}
        processSteps={service.processSteps}
        whatsIncluded={service.whatsIncluded}
        slaDays={service.slaDays}
      />
      <UnifiedServicePage
        service={service}
        pricing={pricing}
        reviews={reviews}
        relatedServices={relatedServices}
      />
    </>
  )
}
```

### 3B. `components/service/UnifiedServicePage.tsx` — Main Client Component

```tsx
'use client'

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import Link from 'next/link'
import { DBServiceConfig, ServicePricingData, ServiceReview, RelatedServiceCard } from '@/lib/data/services'
import { servicesBySlug } from '@/lib/services/data'
import { fallbackReviews, defaultFallbackReviews } from '@/lib/data/fallback-reviews'
import { BookingPanel } from './BookingPanel'
import { ProcessStepper } from './ProcessStepper'
import { ExplainerStepper } from './ExplainerStepper'
import { ServiceRisks } from './ServiceRisks'
import { ProfilePersonas } from './ProfilePersonas'
// Import directly for SEO crawlability - dynamic imports hide content from Google
import { RelatedServices } from './RelatedServices'
import { HowWeReviewed } from './HowWeReviewed'
import { LearnSectionTable } from '@/components/guides/LearnSectionTable'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getCompletionEstimate } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { useGTM } from '@/lib/hooks/useGTM'
import {
  CheckCircle,
  Star,
  ArrowRight,
  Check,
  Shield,
  Clock,
  Users,
  Award,
  X,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'

interface GeoContext {
  city: string
  state: string
}

// Mapping from service slug to document checklist page path
const documentChecklistPaths: Record<string, string> = {
  'pvt-ltd-incorporation': '/tools/documents/private-limited-company',
  'llp-incorporation': '/tools/documents/llp',
  'gst-registration': '/tools/documents/gst-registration',
  'trademark-registration': '/tools/documents/trademark',
  'business-itr': '/tools/documents/business-itr',
  'cloud-kitchen-setup': '/tools/documents/fssai',
}

interface UnifiedServicePageProps {
  service: DBServiceConfig
  pricing: ServicePricingData | null
  reviews?: ServiceReview[]
  relatedServices?: RelatedServiceCard[]
  geoContext?: GeoContext
}

// Section definitions for navigation
const SECTIONS = [
  { id: 'process', label: 'Process' },
  { id: 'included', label: "What's Included" },
  { id: 'why-ollvy', label: 'Why Ollvy' },
  { id: 'risks', label: 'Risks' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faqs', label: 'FAQs' },
] as const

type SectionId = typeof SECTIONS[number]['id']

// Helper to wrap numbers and currency in font-mono spans
function formatWithMonoNumbers(text: string | undefined | null): React.ReactNode {
  if (!text) return null
  // Match numbers (with optional commas, decimals) and currency symbols
  const parts = text.split(/(₹[\d,]+(?:\.\d+)?|\d+(?:,\d+)*(?:\.\d+)?%?)/g)
  return parts.map((part, i) => {
    // Check if this part is a number or currency
    if (/^₹?[\d,]+(?:\.\d+)?%?$/.test(part)) {
      return <span key={i} className="font-mono">{part}</span>
    }
    return part
  })
}

// Helper to generate contextually appropriate "How it works" heading
function getProcessHeading(serviceName: string, shortName: string): string {
  const nameLower = serviceName.toLowerCase()
  const shortLower = shortName.toLowerCase()

  // Company/entity formation
  if (
    nameLower.includes('company') ||
    nameLower.includes('incorporation') ||
    shortLower === 'private limited' ||
    shortLower === 'llp' ||
    shortLower === 'opc' ||
    shortLower === 'one person company' ||
    shortLower === 'partnership'
  ) {
    return `How Ollvy incorporates a ${shortName}`
  }

  // Registration services
  if (nameLower.includes('registration')) {
    // e.g., "GST Registration" -> "How Ollvy registers your GST"
    const subject = shortName.replace(/\s*registration\s*/i, '').trim()
    return `How Ollvy registers your ${subject}`
  }

  // Filing/Return services
  if (nameLower.includes('return') || nameLower.includes('filing')) {
    return `How Ollvy files your ${shortName}`
  }

  // ITR services
  if (nameLower.includes('itr') || nameLower.includes('income tax')) {
    return `How Ollvy files your ${shortName}`
  }

  // KYC services
  if (nameLower.includes('kyc')) {
    return `How Ollvy completes your ${shortName}`
  }

  // Compliance services
  if (nameLower.includes('compliance') || nameLower.includes('annual')) {
    return `How Ollvy handles your ${shortName}`
  }

  // Default fallback
  return `How Ollvy handles your ${serviceName}`
}

// Mini mock visual components for What's Included section
function MockVisual({
  type,
  data,
}: {
  type?: 'receipt' | 'status' | 'checklist' | 'calendar' | 'arn'
  data?: Record<string, string>
}) {
  if (!type || !data) return null

  return (
    <div className="rounded-xl bg-background border border-border p-4 font-mono text-xs">
      {type === 'status' && (
        <div className="space-y-2">
          {data.label && (
            <p className="text-muted-foreground mb-3 font-sans text-xs uppercase tracking-widest">
              {data.label}
            </p>
          )}
          {Object.entries(data)
            .filter(([k]) => k.startsWith('row'))
            .map(([k, v]) => (
              <div
                key={k}
                className={cn(
                  'flex items-center gap-2',
                  v.includes('✓')
                    ? 'text-[hsl(var(--ollvy-green-fg))]'
                    : 'text-muted-foreground'
                )}
              >
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full shrink-0',
                    v.includes('✓')
                      ? 'bg-[hsl(var(--ollvy-green))]'
                      : 'bg-muted'
                  )}
                />
                {v}
              </div>
            ))}
          {data.note && (
            <p className="text-muted-foreground/60 text-[10px] border-t border-border pt-2 mt-2 font-sans">
              {data.note}
            </p>
          )}
        </div>
      )}
      {type === 'arn' && (
        <div className="space-y-2">
          {data.label && (
            <p className="text-muted-foreground font-sans text-xs uppercase tracking-widest mb-2">
              {data.label}
            </p>
          )}
          <p className="text-foreground text-base font-bold tracking-wider">
            {data.value}
          </p>
          <p className="text-[hsl(var(--ollvy-green-fg))]">{data.status}</p>
          <p className="text-muted-foreground text-[10px]">{data.filed}</p>
          {data.verify && (
            <p className="text-muted-foreground/60 text-[10px] border-t border-border pt-2 mt-2 font-sans">
              {data.verify}
            </p>
          )}
        </div>
      )}
      {type === 'calendar' && (
        <div className="space-y-2">
          {data.label && (
            <p className="text-muted-foreground font-sans text-xs uppercase tracking-widest mb-2">
              {data.label}
            </p>
          )}
          {Object.entries(data)
            .filter(([k]) => k.startsWith('row'))
            .map(([k, v]) => {
              const [name, ...rest] = v?.split(' - ') ?? []
              return (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-foreground">{name}</span>
                  <span className="text-[hsl(var(--ollvy-amber))] text-[10px]">
                    {rest.join(' - ')}
                  </span>
                </div>
              )
            })}
          {data.note && (
            <p className="text-muted-foreground/60 text-[10px] border-t border-border pt-2 mt-1 font-sans">
              {data.note}
            </p>
          )}
        </div>
      )}
      {type === 'receipt' && (
        <div className="space-y-1.5">
          {data.label && (
            <p className="text-foreground font-semibold mb-2 font-sans text-xs">
              {data.label}
            </p>
          )}
          {Object.entries(data)
            .filter(([k]) => k.startsWith('row'))
            .map(([k, v]) => (
              <p key={k} className="text-muted-foreground">
                {v}
              </p>
            ))}
        </div>
      )}
    </div>
  )
}

function formatReviewDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function UnifiedServicePage({
  service,
  pricing,
  reviews = [],
  relatedServices = [],
  geoContext,
}: UnifiedServicePageProps) {
  // Look up static config for govtFees and documents tables
  const staticConfig = servicesBySlug[service.slug]

  const [heroVisible, setHeroVisible] = useState(true)
  const [activeSection, setActiveSection] = useState<SectionId>('process')
  const heroRef = useRef<HTMLDivElement>(null)

  // Variant selection state (shared with BookingPanel via callback)
  const [selectedVariant, setSelectedVariant] = useState<string>(
    service.defaultVariantId ?? service.variants?.[0]?.id ?? ''
  )

  // Explainer stepper open state
  const [explainerOpen, setExplainerOpen] = useState(false)

  // GTM tracking
  const { trackViewService } = useGTM()
  const [hasTrackedView, setHasTrackedView] = useState(false)

  // Track view_item in GTM when service page loads
  useEffect(() => {
    if (service && !hasTrackedView) {
      const priceInPaisa = (pricing?.ollvyFee ?? service.ollvyFee ?? 0) * 100 +
                          (pricing?.govtFee ?? service.govtFee ?? 0) * 100
      trackViewService({
        id: service.id,
        name: service.name,
        slug: service.slug,
        category: service.category,
        price: priceInPaisa,
      })
      setHasTrackedView(true)
    }
  }, [service, pricing, hasTrackedView, trackViewService])

  // Refs for smooth underline indicator
  const heroNavRef = useRef<HTMLDivElement>(null)
  const stickyNavRef = useRef<HTMLElement>(null)
  const mobileTabsRef = useRef<HTMLDivElement>(null)
  const [heroIndicator, setHeroIndicator] = useState({ left: 0, width: 0 })
  const [stickyIndicator, setStickyIndicator] = useState({ left: 0, width: 0 })

  // Section refs for scroll tracking
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    process: null,
    included: null,
    'why-ollvy': null,
    risks: null,
    reviews: null,
    faqs: null,
  })

  // For retainers, use pre-computed nextDueDateValue
  // Otherwise, calculate the guaranteed date based on SLA days with govt processing awareness
  const completionEstimate = service.isRetainer
    ? null
    : getCompletionEstimate(
        service.slaDays,
        service.hasGovtProcessing ?? false,
        service.completionMaxDays,
        service.completionRangeText
      )

  const guaranteedDate = service.isRetainer
    ? service.nextDueDateValue
    : completionEstimate?.guaranteedDate ?? null

  // Show rating if DB rating exists and has sufficient reviews (>=10)
  const showRating =
    service.avgRating !== null &&
    service.avgRating !== undefined &&
    service.totalRatings >= 10

  // Calculate price with variant adjustment
  const selectedVariantData = service.variants?.find(v => v.id === selectedVariant)
  const priceAdjustment = selectedVariantData?.priceAdjustment ?? 0
  const govtFeeAdjustment = selectedVariantData?.govtFeeAdjustment ?? 0
  const adjustedOllvyFee = service.ollvyFee + (priceAdjustment / 100)
  const adjustedGovtFee = (service.govtFee ?? 0) + (govtFeeAdjustment / 100)

  // Calculate default addon total (for display in "Everything included")
  const defaultAddonTotal = service.addons
    ?.filter(addon => addon.defaultSelected)
    .reduce((sum, addon) => sum + addon.pricePaisa, 0) ?? 0
  const displayTotalOllvyFee = adjustedOllvyFee + (defaultAddonTotal / 100)

  const totalFee = adjustedOllvyFee + adjustedGovtFee

  // Services where govt fees vary based on questionnaire answers
  // These show "Starting from" prefix and use eligibility flow
  const priceVariesByQuestionnaire = [
    'trademark-registration',
    'pvt-ltd-incorporation',
    'llp-incorporation',
  ].includes(service.slug)

  // Determine CTA label and URL for this service
  const ctaLabel = service.priceVariesByState
    ? 'Get Quote'
    : priceVariesByQuestionnaire
    ? 'Check Eligibility & Price'
    : 'Start Application'

  // Build base checkout/eligibility URL
  // Only services with pre-qualifying questions go through eligibility
  // Others go directly to checkout - no intermediate loading screen
  const getCtaUrl = (includeVariant = false) => {
    const serviceId = service.id || service.slug
    const baseUrl = service.priceVariesByState
      ? `/quote/request/${serviceId}`
      : priceVariesByQuestionnaire
      ? `/checkout/${serviceId}/eligibility`
      : `/checkout/${serviceId}`
    if (includeVariant && service.variants && selectedVariant) {
      return `${baseUrl}?variant=${selectedVariant}`
    }
    return baseUrl
  }

  // Scroll to section
  const scrollToSection = useCallback((sectionId: SectionId) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      const offset = 100 // Account for sticky header
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150 // Offset for header

      // Find the current section
      for (const section of [...SECTIONS].reverse()) {
        const element = sectionRefs.current[section.id]
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update indicator position when active section changes
  useEffect(() => {
    const updateIndicators = () => {
      // Hero nav indicator
      if (heroNavRef.current) {
        const activeButton = heroNavRef.current.querySelector(`[data-section="${activeSection}"]`) as HTMLElement
        if (activeButton) {
          setHeroIndicator({
            left: activeButton.offsetLeft,
            width: activeButton.offsetWidth,
          })
        }
      }

      // Sticky nav indicator
      if (stickyNavRef.current) {
        const activeButton = stickyNavRef.current.querySelector(`[data-section="${activeSection}"]`) as HTMLElement
        if (activeButton) {
          setStickyIndicator({
            left: activeButton.offsetLeft,
            width: activeButton.offsetWidth,
          })
        }
      }

      // Mobile tabs: scroll active tab into center of container
      if (mobileTabsRef.current) {
        const activeButton = mobileTabsRef.current.querySelector(`[data-section="${activeSection}"]`) as HTMLElement
        if (activeButton) {
          const container = mobileTabsRef.current
          const scrollLeft = activeButton.offsetLeft - (container.offsetWidth / 2) + (activeButton.offsetWidth / 2)
          container.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: 'smooth'
          })
        }
      }
    }

    updateIndicators()
    // Also update on resize
    window.addEventListener('resize', updateIndicators)
    return () => window.removeEventListener('resize', updateIndicators)
  }, [activeSection])

  // Sticky bar: show when hero scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  // Hide global header when service sticky header is active
  useEffect(() => {
    if (heroVisible) {
      document.body.classList.remove('service-header-active')
    } else {
      document.body.classList.add('service-header-active')
    }
    return () => {
      document.body.classList.remove('service-header-active')
    }
  }, [heroVisible])

  return (
    <>
      {/* Sticky top bar - replaces navbar when hero scrolls out */}
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-[60] bg-background border-b border-border transition-all duration-300',
          heroVisible
            ? '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        )}
      >
        {/* Desktop: Full bar with logo, centered tabs */}
        <div className="hidden md:block max-w-[1200px] mx-auto px-6 overflow-hidden">
          <div className="relative flex items-center justify-center h-16">
            {/* Logo + Service name - absolute left */}
            <div className="absolute left-0 flex items-center gap-4 bg-background pr-4 z-10">
              <Link href="/" className="font-mono text-xl font-bold text-foreground tracking-tight">
                Ollvy
              </Link>
              <span className="text-muted-foreground">|</span>
              <span className="font-semibold text-foreground">
                {service.shortName}
              </span>
            </div>

            {/* Section tabs - centered, matching hero styling exactly */}
            <nav ref={stickyNavRef} className="flex gap-0 relative" role="tablist">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  data-section={section.id}
                  role="tab"
                  aria-selected={activeSection === section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    'shrink-0 px-3 md:px-5 py-3 text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                    activeSection === section.id
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {section.label}
                </button>
              ))}
              {/* Sliding underline indicator */}
              <div
                className="absolute bottom-0 h-0.5 bg-foreground transition-all duration-300 ease-out"
                style={{
                  left: stickyIndicator.left,
                  width: stickyIndicator.width,
                }}
              />
            </nav>
          </div>
        </div>

        {/* Mobile: Only section tabs */}
        <div ref={mobileTabsRef} className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-0 min-w-max px-4">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                data-section={section.id}
                role="tab"
                aria-selected={activeSection === section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  'shrink-0 px-3 py-3 text-xs font-medium transition-colors whitespace-nowrap border-b-2',
                  activeSection === section.id
                    ? 'text-foreground border-foreground'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                )}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-background">
        <main>
          {/* === HERO SECTION === */}
          <section
            ref={heroRef}
            className="relative min-h-[65vh] flex flex-col items-center justify-center bg-background overflow-hidden pb-10"
          >
            <div className="relative z-10 text-center w-full max-w-[800px] px-4 md:px-6">
              {/* Service name - large and bold */}
              <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight md:leading-[1.1] font-mono break-words">
                {service.name}
                {geoContext && (
                  <span className="text-muted-foreground"> in {geoContext.city}</span>
                )}
              </h1>

              {/* Tagline */}
              <p className="text-sm md:text-base text-muted-foreground mt-3 md:mt-4 px-2">
                {service.tagline}
              </p>

              {/* CTA row */}
              <div className="mt-5 md:mt-6 flex flex-col items-center gap-2">
                {/* Guarantee badge */}
                {guaranteedDate && (
                  <div className="text-center mb-1">
                    <p className="text-sm md:text-lg font-mono text-foreground">
                      <CheckCircle size={14} className="inline mr-1 text-[hsl(var(--ollvy-green))]" />
                      {service.isRetainer
                        ? `Current cycle due: ${guaranteedDate}`
                        : `Guaranteed by ${guaranteedDate}`}
                    </p>
                  </div>
                )}

                <Button size="lg" className="h-11 md:h-12 px-8 md:px-10" asChild>
                  <Link href={getCtaUrl()} prefetch={true}>
                    {ctaLabel}
                  </Link>
                </Button>
              </div>

              {/* Metadata pills */}
              <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 mt-4 md:mt-8">
                <div className="px-2.5 md:px-4 py-1 md:py-2 rounded-full bg-muted/50 border border-border/50 font-mono">
                  <span className="text-[10px] md:text-xs text-muted-foreground">For </span>
                  <span className="text-[10px] md:text-xs font-medium text-foreground">{service.mandatoryFor}</span>
                </div>
                <div className="px-2.5 md:px-4 py-1 md:py-2 rounded-full bg-muted/50 border border-border/50 font-mono">
                  <span className="text-[10px] md:text-xs text-muted-foreground">Type </span>
                  <span className="text-[10px] md:text-xs font-medium text-foreground">{service.serviceType}</span>
                </div>
                <div className="px-2.5 md:px-4 py-1 md:py-2 rounded-full bg-muted/50 border border-border/50 font-mono">
                  <span className="text-[10px] md:text-xs text-muted-foreground">Turnaround </span>
                  <span className="text-[10px] md:text-xs font-medium text-foreground">
                    {service.isRetainer ? 'Ongoing' : `${service.slaDays} days`}
                  </span>
                </div>
                {showRating && service.avgRating && (
                  <div className="px-2.5 md:px-4 py-1 md:py-2 rounded-full bg-muted/50 border border-border/50 flex items-center gap-1 font-mono">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] md:text-xs font-medium text-foreground">
                      {service.avgRating.toFixed(1)}
                    </span>
                    <span className="text-[10px] md:text-xs text-muted-foreground">
                      ({service.totalRatings})
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Section navigation tabs - flush to bottom of hero */}
            <nav
              className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-sm"
              role="tablist"
            >
              <div className="max-w-[1200px] mx-auto px-4 md:px-6 overflow-x-auto scrollbar-hide">
                <div ref={heroNavRef} className="flex gap-0 -mb-px relative min-w-max md:min-w-0 md:justify-center">
                  {SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      data-section={section.id}
                      role="tab"
                      aria-selected={activeSection === section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        'shrink-0 px-3 md:px-5 py-3 text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                        activeSection === section.id
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {section.label}
                    </button>
                  ))}
                  {/* Sliding underline indicator */}
                  <div
                    className="absolute bottom-0 h-0.5 bg-foreground transition-all duration-300 ease-out"
                    style={{
                      left: heroIndicator.left,
                      width: heroIndicator.width,
                    }}
                  />
                </div>
              </div>
            </nav>
          </section>

          {/* === MAIN CONTENT WITH STICKY SIDEBAR === */}
          <div className="max-w-[1200px] mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
              {/* Left: All content sections flowing */}
              <div className="min-w-0 space-y-0">

                {/* Section: How it works (Process Steps) */}
                <section
                  id="process"
                  ref={(el) => { sectionRefs.current.process = el }}
                  className={cn(
                    "pb-16 border-b border-border scroll-mt-28",
                    "pt-0"
                  )}
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                    THE PROCESS
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
                    {getProcessHeading(service.name, service.shortName)}
                  </h2>
                  <ProcessStepper steps={service.processSteps} serviceId={service.id || service.slug} serviceSlug={service.slug} priceVariesByState={service.priceVariesByState} />

                  {/* What is [Service Type]? - Trigger */}
                  {service.serviceExplainer && service.serviceExplainer.steps.length > 0 && (
                    <div className="mt-8">
                      <div className="flex justify-center">
                        <button
                          onClick={() => setExplainerOpen(!explainerOpen)}
                          className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
                        >
                          What is {service.name}?
                          <ChevronDown
                            size={14}
                            className={cn(
                              'transition-transform duration-200',
                              explainerOpen && 'rotate-180'
                            )}
                          />
                        </button>
                      </div>

                      {/* Always render for SEO, hide visually when collapsed */}
                      <div
                        aria-hidden={!explainerOpen}
                        className={cn(
                          'transition-all duration-300 overflow-hidden',
                          explainerOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        )}
                      >
                        <ExplainerStepper
                          serviceName={service.name}
                          steps={service.serviceExplainer.steps}
                        />
                      </div>
                    </div>
                  )}
                </section>

                {/* Section: What's Included */}
                <section
                  id="included"
                  ref={(el) => { sectionRefs.current.included = el }}
                  className="py-16 border-b border-border scroll-mt-28"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                    WHAT YOU GET
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                    Everything included
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6 sm:mb-10">
                    What your CA handles on your behalf. Nothing hidden.
                  </p>

                  <div className="divide-y divide-border">
                    {service.whatsIncluded.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          'grid gap-3 sm:gap-6 items-center py-3 sm:py-5',
                          item.mockVisualType
                            ? 'grid-cols-1 md:grid-cols-2'
                            : 'grid-cols-1'
                        )}
                      >
                        {/* Visual - alternating left/right */}
                        {item.mockVisualType && (
                          <div
                            className={cn(
                              'order-2',
                              index % 2 === 1 ? 'md:order-first' : 'md:order-last'
                            )}
                          >
                            <div className="max-w-[320px] mx-auto">
                              <MockVisual
                                type={item.mockVisualType}
                                data={item.mockVisualData}
                              />
                            </div>
                          </div>
                        )}

                        {/* Text */}
                        <div className={cn(item.mockVisualType ? 'order-1' : '')}>
                          <div className="flex items-start gap-2.5 sm:gap-3">
                            <div className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))]/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={11} className="text-[hsl(var(--ollvy-green))]" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">
                                {formatWithMonoNumbers(item.title)}
                              </h3>
                              {item.body && (
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                  {formatWithMonoNumbers(item.body)}
                                </p>
                              )}

                              {/* Comparison */}
                              {(item.comparisonWithout || item.comparisonWithOllvy) && (
                                <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
                                  <div className="bg-muted/40 rounded-lg p-2.5 border border-border">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-mono">
                                      Without Ollvy
                                    </p>
                                    <p className="text-xs sm:text-sm font-medium text-foreground">
                                      {item.comparisonWithout && formatWithMonoNumbers(item.comparisonWithout)}
                                    </p>
                                  </div>
                                  <div className="bg-[hsl(var(--ollvy-green))]/5 rounded-lg p-2.5 border border-[hsl(var(--ollvy-green))]/20">
                                    <p className="text-[10px] text-[hsl(var(--ollvy-green-fg))] uppercase tracking-widest mb-1 font-mono">
                                      With Ollvy
                                    </p>
                                    <p className="text-xs sm:text-sm font-medium text-foreground">
                                      {item.comparisonWithOllvy && formatWithMonoNumbers(item.comparisonWithOllvy)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section: Government Fees (from static config) */}
                {staticConfig?.govtFees && (
                  <section className="py-16 border-b border-border">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                      GOVERNMENT FEES
                    </p>
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                      Official fees paid to the government
                    </h2>
                    <p className="text-sm text-muted-foreground mb-8">
                      These fees are collected by Ollvy and remitted in full to the relevant government authority.
                    </p>
                    <LearnSectionTable table={staticConfig.govtFees} />
                  </section>
                )}

                {/* Section: Documents Required Table (from static config) */}
                {staticConfig?.documents && (
                  <section className="py-16 border-b border-border">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                      DOCUMENTS REQUIRED
                    </p>
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                      Documents you will need to provide
                    </h2>
                    <p className="text-sm text-muted-foreground mb-8">
                      Prepare these documents before starting the process.
                    </p>
                    <LearnSectionTable table={staticConfig.documents} />
                    {documentChecklistPaths[service.slug] && (
                      <div className="mt-6">
                        <Link
                          href={documentChecklistPaths[service.slug]}
                          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          See full document checklist
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                  </section>
                )}

                {/* Section: Why Ollvy */}
                <section
                  id="why-ollvy"
                  ref={(el) => { sectionRefs.current['why-ollvy'] = el }}
                  className="py-16 border-b border-border scroll-mt-28"
                >
                  <div className="inline-flex items-center gap-2 bg-[hsl(var(--ollvy-green))]/10 border border-[hsl(var(--ollvy-green))]/20 rounded-full px-3 py-1 mb-5">
                    <span className="text-xs font-medium text-[hsl(var(--ollvy-green-fg))]">
                      Ollvy Guided
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug mb-4">
                    We file correctly.
                    <br />
                    Not just on time.
                  </h2>
                  <p className="text-sm text-muted-foreground mb-8 max-w-[520px] leading-relaxed">
                    Most CAs submit what you give them and hope for the best. Ollvy
                    reviews your documents before filing - not after a notice arrives.
                  </p>

                  {/* Others vs Ollvy comparison */}
                  {service.comparisonWithout && service.comparisonWith ? (
                    // Service-specific comparison with bullet points
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-[720px]">
                      <Card className="border border-red-500/30 bg-red-500/5 p-5">
                        <p className="text-xs uppercase tracking-widest text-red-600 dark:text-red-400 mb-4 font-mono">
                          Without Ollvy
                        </p>
                        <ul className="space-y-3">
                          {service.comparisonWithout.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                      <Card className="border border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 p-5">
                        <p className="text-xs uppercase tracking-widest text-[hsl(var(--ollvy-green-fg))] mb-4 font-mono">
                          With Ollvy
                        </p>
                        <ul className="space-y-3">
                          {service.comparisonWith.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                              <Check className="w-4 h-4 text-[hsl(var(--ollvy-green))] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  ) : (
                    // Generic comparison for services without specific data
                    <div className="grid grid-cols-2 gap-4 mb-10 max-w-[560px]">
                      <Card className="border border-border bg-muted/30 p-5">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                          Others
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Take your documents as-is. Submit the application. If there's a
                          query or rejection, it's your problem.
                        </p>
                      </Card>
                      <Card className="border border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 p-5">
                        <p className="text-xs uppercase tracking-widest text-[hsl(var(--ollvy-green-fg))] mb-3 font-mono">
                          Ollvy
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          Review every document before filing. Catch mismatches, expired
                          items, and format issues. Then file.
                        </p>
                      </Card>
                    </div>
                  )}

                  {/* 4-step flow */}
                  <Card className="border border-border bg-card p-8">
                    <h3 className="text-base font-semibold text-foreground mb-6">
                      We catch compliance gaps before regulators do.
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        {
                          step: 'we review',
                          label: 'your documents',
                          description: 'Every upload checked before anything is filed',
                        },
                        {
                          step: 'we flag',
                          label: 'the risks',
                          description:
                            'Issues identified - expiry dates, mismatches, format errors',
                        },
                        {
                          step: 'we fix',
                          label: 'if possible',
                          description: 'Fixable issues resolved before filing, not after',
                        },
                        {
                          step: 'we file',
                          label: 'correctly',
                          description: 'Clean submission - lower chance of officer query',
                        },
                      ].map((item, i) => (
                        <div key={i} className="text-center">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                            <span className="text-xs font-mono font-bold text-foreground">
                              {i + 1}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-foreground">
                            {item.step}
                          </p>
                          <p className="text-xs text-[hsl(var(--ollvy-green-fg))] mt-0.5">
                            {item.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 leading-snug">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </section>

                {/* Section: Profile Personas (We handle messy situations) */}
                <section className="py-16 border-b border-border">
                  <ProfilePersonas
                    personas={service.profilePersonas}
                    serviceName={service.shortName}
                  />
                </section>

                {/* Section: Service Risks */}
                <section
                  id="risks"
                  ref={(el) => { sectionRefs.current.risks = el }}
                  className="py-16 border-b border-border scroll-mt-28"
                >
                  <ServiceRisks
                    risks={service.serviceRisks}
                    serviceShortName={service.shortName}
                  />
                </section>

                {/* Section: Unlocks (what this service unlocks) */}
                {service.unlocks && service.unlocks.length > 0 && (
                  <section className="py-16 border-b border-border">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                      NEXT STEPS
                    </p>
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                      What {service.shortName} unlocks
                    </h2>
                    <p className="text-sm text-muted-foreground mb-8">
                      Services that become available or mandatory after completion.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.unlocks.map((item, i) => (
                        <Card
                          key={i}
                          className={cn(
                            'border p-5',
                            item.type === 'required'
                              ? 'border-[hsl(var(--ollvy-amber))]/30 bg-[hsl(var(--ollvy-amber))]/5'
                              : 'border-border bg-card'
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground">
                                  {item.name}
                                </h4>
                                {item.type === 'required' && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] border-[hsl(var(--ollvy-amber))]/50 text-[hsl(var(--ollvy-amber))]"
                                  >
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {item.explanation}
                              </p>
                            </div>
                            <span className="text-sm font-mono font-semibold text-foreground shrink-0">
                              {item.price}
                            </span>
                          </div>
                          <Link
                            href={`/services/${item.slug}`}
                            className="inline-flex items-center gap-1 text-xs text-[hsl(var(--ollvy-green-fg))] mt-3 hover:underline"
                          >
                            Learn more
                            <ArrowRight size={10} />
                          </Link>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* Section: Reviews */}
                <section
                  id="reviews"
                  ref={(el) => { sectionRefs.current.reviews = el }}
                  className="py-16 border-b border-border scroll-mt-28"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                    CUSTOMER REVIEWS
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                    What customers say about {service.shortName}
                  </h2>

                  {/* Keyword chips from config */}
                  {service.reviewKeywordChips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 mb-8">
                      {service.reviewKeywordChips.map((chip) => (
                        <span
                          key={chip}
                          className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-foreground"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Rating summary */}
                  {showRating && service.avgRating && (
                    <div className="flex items-center gap-4 mb-8 p-4 bg-card border border-border rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <Star size={20} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold text-foreground">
                          {service.avgRating.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Based on {service.totalRatings} verified reviews
                      </div>
                    </div>
                  )}

                  {/* Reviews */}
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review, index) => (
                        <Card
                          key={`${review.created_at}-${index}`}
                          className="border border-border bg-card p-5"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatReviewDate(review.created_at)}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-foreground leading-relaxed">
                              "{review.comment}"
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-3">
                            - Verified customer
                          </p>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(fallbackReviews[service.slug] ?? defaultFallbackReviews).map((review, index) => (
                        <Card key={index} className="border border-border bg-card p-5">
                          <div className="flex items-center gap-2 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">
                              {review.date}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            "{review.comment}"
                          </p>
                          <p className="text-xs text-muted-foreground mt-3">
                            - {review.name}
                          </p>
                        </Card>
                      ))}
                    </div>
                  )}
                </section>

                {/* Section: FAQs */}
                <section
                  id="faqs"
                  ref={(el) => { sectionRefs.current.faqs = el }}
                  className="py-16 border-b border-border scroll-mt-28"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                    COMMON QUESTIONS
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
                    Frequently asked questions
                  </h2>

                  <Accordion type="single" collapsible className="space-y-0 max-w-[720px]">
                    {service.faqs.map((faq, i) => (
                      <AccordionItem
                        key={i}
                        value={`faq-${i}`}
                        className="border-b border-border last:border-0"
                      >
                        <AccordionTrigger className="text-sm font-medium text-foreground text-left py-4 hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent forceMount className="text-sm text-muted-foreground leading-relaxed pb-5">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>

                {/* Section: Related Services */}
                <section className="py-16 border-b border-border">
                  <RelatedServices services={relatedServices} />
                </section>

                {/* Section: How We Reviewed */}
                <HowWeReviewed service={service} />
              </div>

              {/* Right: Booking panel - sticky sidebar */}
              <aside className="hidden lg:block sticky top-20 self-start">
                <BookingPanel
                  service={service}
                  serviceId={service.id || service.slug}
                  priceVariesByState={service.priceVariesByState}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />
              </aside>
            </div>
          </div>

          {/* Final CTA Section */}
          <section className="bg-card py-24">
            <div className="container text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                Get {service.shortName} done now
              </h2>
              <p className="text-base text-muted-foreground mt-4 whitespace-nowrap">
                Fixed price. Verified CA. Done within {service.slaDays} working days.
              </p>
              <Button size="lg" className="mt-8" asChild>
                <Link href={getCtaUrl()} prefetch={true}>
                  {ctaLabel}
                </Link>
              </Button>
            </div>
          </section>
        </main>
      </div>

      {/* Mobile booking bar - fixed bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 flex items-center justify-between lg:hidden"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <div>
          <p className="text-xs text-muted-foreground">
            {priceVariesByQuestionnaire ? 'Starting from' : 'Total'}
          </p>
          <p className="font-mono font-bold text-foreground">
            ₹{totalFee.toLocaleString('en-IN')}
          </p>
        </div>
        <Button size="lg" className="flex-1 ml-4" asChild>
          <Link href={getCtaUrl(true)} prefetch={true}>
            {ctaLabel}
          </Link>
        </Button>
      </div>
    </>
  )
}
```

---

## 4. Shared Subcomponents

### 4A. `components/service/BookingPanel.tsx` — Sticky Sidebar Pricing Panel

```tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Phone, MessageCircle, Square, CheckSquare, Info } from 'lucide-react'
import { getCompletionEstimate } from '@/lib/dates'
import { DBServiceConfig } from '@/lib/data/services'
import { cn } from '@/lib/utils'
import { getWhatsAppLink, getPhoneLink } from '@/lib/constants'

interface BookingPanelProps {
  service: DBServiceConfig
  serviceId?: string // DB ID for checkout
  priceVariesByState?: boolean
  // Optional controlled variant state (for syncing with parent)
  selectedVariant?: string
  onVariantChange?: (variantId: string) => void
  // Optional controlled addons state (for syncing with parent)
  selectedAddons?: string[]
  onAddonsChange?: (addonIds: string[]) => void
}

export function BookingPanel({
  service,
  serviceId,
  priceVariesByState,
  selectedVariant: controlledVariant,
  onVariantChange,
  selectedAddons: controlledAddons,
  onAddonsChange,
}: BookingPanelProps) {
  // Internal state for uncontrolled mode
  const [internalVariant, setInternalVariant] = useState<string>(
    service.defaultVariantId ?? service.variants?.[0]?.id ?? ''
  )
  const [expandedTooltip, setExpandedTooltip] = useState<string | null>(null)

  // Initialize addon selection based on defaultSelected
  const defaultAddonIds = useMemo(() => {
    return service.addons
      ?.filter(addon => addon.defaultSelected || addon.required)
      .map(addon => addon.id) ?? []
  }, [service.addons])

  const [internalAddons, setInternalAddons] = useState<string[]>(defaultAddonIds)

  // Use controlled variant if provided, otherwise use internal state
  const selectedVariant = controlledVariant ?? internalVariant
  const setSelectedVariant = (variantId: string) => {
    if (onVariantChange) {
      onVariantChange(variantId)
    } else {
      setInternalVariant(variantId)
    }
  }

  // Use controlled addons if provided, otherwise use internal state
  const selectedAddonIds = controlledAddons ?? internalAddons
  const toggleAddon = (addonId: string) => {
    const addon = service.addons?.find(a => a.id === addonId)
    if (addon?.required) return // Can't toggle required addons

    const newAddons = selectedAddonIds.includes(addonId)
      ? selectedAddonIds.filter(id => id !== addonId)
      : [...selectedAddonIds, addonId]

    if (onAddonsChange) {
      onAddonsChange(newAddons)
    } else {
      setInternalAddons(newAddons)
    }
  }

  // Calculate completion estimate with govt processing awareness
  const completionEstimate = service.isRetainer
    ? null
    : getCompletionEstimate(
        service.slaDays,
        service.hasGovtProcessing ?? false,
        service.completionMaxDays,
        service.completionRangeText
      )

  const guaranteedDate = service.isRetainer
    ? service.nextDueDateValue
    : completionEstimate?.guaranteedDate ?? null

  // Calculate price with variant adjustment
  const selectedVariantData = service.variants?.find(v => v.id === selectedVariant)
  const priceAdjustment = selectedVariantData?.priceAdjustment ?? 0
  const govtFeeAdjustment = selectedVariantData?.govtFeeAdjustment ?? 0

  // Combine Ollvy fee + govt fee into single "service fee"
  const baseServiceFee = service.ollvyFee + (service.govtFee ?? 0) + (priceAdjustment / 100) + (govtFeeAdjustment / 100)

  // Calculate addon totals (combine Ollvy fees + govt fees into single price)
  const addonTotals = useMemo(() => {
    if (!service.addons) return 0
    const selectedAddons = service.addons.filter(addon => selectedAddonIds.includes(addon.id))
    return selectedAddons.reduce((sum, addon) => sum + addon.pricePaisa + (addon.govtFeePaisa ?? 0), 0) / 100
  }, [service.addons, selectedAddonIds])

  const totalFee = baseServiceFee + addonTotals

  // Services where govt fees vary based on questionnaire answers
  // These show "Starting from" prefix since final price depends on user input
  const priceVariesByQuestionnaire = [
    'trademark-registration',
    'pvt-ltd-incorporation',
    'llp-incorporation',
  ].includes(service.slug)

  // Use DB ID for checkout if available, otherwise fall back to slug
  const checkoutId = serviceId ?? service.slug

  // Determine CTA label and URL based on service type
  const ctaLabel = priceVariesByState
    ? 'Get Quote'
    : priceVariesByQuestionnaire
    ? 'Check Eligibility & Price'
    : 'Start Application'

  // Build checkout URL with optional variant and addon params
  // Services with questionnaire-based pricing go to eligibility page first
  const baseCheckoutUrl = priceVariesByState
    ? `/quote/request/${checkoutId}`
    : priceVariesByQuestionnaire
    ? `/checkout/${checkoutId}/eligibility`
    : `/checkout/${checkoutId}`
  const urlParams = new URLSearchParams()
  if (service.variants && selectedVariant) {
    urlParams.set('variant', selectedVariant)
  }
  if (service.addons && selectedAddonIds.length > 0) {
    urlParams.set('addons', selectedAddonIds.join(','))
  }
  const ctaUrl = urlParams.toString() ? `${baseCheckoutUrl}?${urlParams.toString()}` : baseCheckoutUrl

  return (
    <Card className="border border-border bg-card p-6 w-full">
      {/* Guaranteed date at top */}
      {guaranteedDate && (
        <div className="pb-5 border-b border-border mb-5">
          <div className="flex items-center gap-2">
            <CheckCircle
              size={14}
              className="text-[hsl(var(--ollvy-green))] shrink-0"
            />
            <p className="text-sm font-semibold text-foreground font-mono">
              {service.isRetainer
                ? `Current cycle due: ${guaranteedDate}`
                : `Guaranteed by ${guaranteedDate}`}
            </p>
          </div>
        </div>
      )}

      {/* Variant selector - for services with pricing options */}
      {service.variants && service.variants.length > 0 && (
        <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-4 mb-5">
          <p className="font-mono uppercase tracking-wider text-xs text-amber-600 dark:text-amber-400 mb-3">
            {service.variants.some((v: any) => v.tooltip)
              ? 'YOUR BUSINESS ENTITY TYPE'
              : 'YOUR EXPECTED ANNUAL TURNOVER'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {service.variants.map((variant: any) => (
              <div key={variant.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setSelectedVariant(variant.id)}
                  className={cn(
                    'border rounded-xl p-3 text-left transition-all',
                    selectedVariant === variant.id
                      ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
                      : 'border-border hover:border-border/80'
                  )}
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-xs font-medium text-foreground">{variant.label}</p>
                    {variant.tooltip && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedTooltip(expandedTooltip === variant.id ? null : variant.id)
                        }}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`More info about ${variant.label}`}
                      >
                        <Info size={12} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{variant.sublabel}</p>
                </button>
                {variant.tooltip && expandedTooltip === variant.id && (
                  <p className="text-[11px] text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mt-1">
                    {variant.tooltip}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Addon services - selectable checkboxes */}
      {service.addons && service.addons.length > 0 && (
        <div className="border border-border rounded-xl p-4 mb-5">
          <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-3">
            INCLUDED SERVICES
          </p>
          <div className="space-y-2">
            {service.addons.map((addon) => {
              const isSelected = selectedAddonIds.includes(addon.id)
              const isRequired = addon.required
              // Combine addon price + govt fee into single displayed price
              const addonTotalPrice = (addon.pricePaisa + (addon.govtFeePaisa ?? 0)) / 100

              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(addon.id)}
                  disabled={isRequired}
                  className={cn(
                    'w-full border rounded-lg p-3 text-left transition-all flex items-start gap-3',
                    isSelected
                      ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
                      : 'border-border hover:border-border/80 bg-muted/30',
                    isRequired && 'cursor-not-allowed opacity-70'
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-[hsl(var(--ollvy-green))]" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{addon.name}</p>
                      <span className="font-mono text-xs text-foreground shrink-0">
                        ₹{addonTotalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {addon.description}
                    </p>
                    {isRequired && (
                      <span className="inline-block mt-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        Required
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Total amount - prominent */}
      <div className="mb-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
          {priceVariesByQuestionnaire ? 'Starting from' : 'Total to pay now'}
        </p>
        <p className="font-mono text-4xl font-bold text-foreground mt-1">
          ₹{totalFee.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Fee breakdown */}
      <div className="mt-5 space-y-3">
        {/* Base service fee */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center mt-0.5 shrink-0">
              <CheckCircle
                size={11}
                className="text-[hsl(var(--ollvy-green))]"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {selectedVariantData?.sublabel ?? service.shortName ?? service.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Service fee
              </p>
            </div>
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">
            ₹{baseServiceFee.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Selected addon fees */}
        {service.addons?.filter(addon => selectedAddonIds.includes(addon.id)).map(addon => {
          const addonTotalPrice = (addon.pricePaisa + (addon.govtFeePaisa ?? 0)) / 100
          return (
            <div key={addon.id} className="flex justify-between items-start">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center mt-0.5 shrink-0">
                  <CheckCircle
                    size={11}
                    className="text-[hsl(var(--ollvy-green))]"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{addon.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Service fee</p>
                </div>
              </div>
              <span className="font-mono text-sm text-foreground">
                ₹{addonTotalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          )
        })}

        {/* Total line */}
        <div className="flex justify-between items-center pt-3 border-t border-border">
          <span className="text-sm font-semibold text-foreground">
            Total Amount
          </span>
          <span className="font-mono text-lg font-bold text-foreground">
            ₹{totalFee.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* CTA button */}
      <Button className="w-full mt-5" size="lg" asChild>
        <Link href={ctaUrl} prefetch={true}>
          {ctaLabel}
        </Link>
      </Button>

      {/* GST invoice note */}
      <p className="text-xs text-muted-foreground text-center mt-2">
        GST-compliant invoice generated at checkout
      </p>

      {/* Have queries */}
      <div className="mt-5 pt-5 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">
          Questions about documents, process, or price?
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
            <a
              href={getWhatsAppLink(`Hi, I have a question about ${service.name}`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
            <a href={getPhoneLink()}>
              <Phone size={13} />
              Call
            </a>
          </Button>
        </div>
      </div>

    </Card>
  )
}
```

### 4B. `components/service/ProcessStepper.tsx` — How It Works Stepper

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload,
  ClipboardList,
  Calendar,
} from 'lucide-react'
import { DBProcessStep } from '@/lib/data/services'
import { Button } from '@/components/ui/button'

const STEP_ICONS = {
  checklist: ClipboardList,
  upload: Upload,
  form: FileText,
  calendar: Calendar,
  stamp: CheckCircle,
}

interface ProcessStepperProps {
  steps: DBProcessStep[]
  serviceId?: string
  serviceSlug?: string
  priceVariesByState?: boolean
}

// Services where govt fees vary based on questionnaire answers
const QUESTIONNAIRE_BASED_SERVICES = [
  'trademark-registration',
  'pvt-ltd-incorporation',
  'llp-incorporation',
]

export function ProcessStepper({ steps, serviceId, serviceSlug, priceVariesByState }: ProcessStepperProps) {
  const [active, setActive] = useState(0)

  const step = steps[active]
  const Icon = STEP_ICONS[step.visual ?? 'form']

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {/* Progress track */}
      <div className="relative h-12 bg-background border-b border-border flex items-center px-6">
        {/* Track line */}
        <div className="absolute left-6 right-6 h-px bg-border top-1/2 -translate-y-1/2" />
        {/* Step dots */}
        <div className="relative flex justify-between w-full">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'w-3 h-3 rounded-full border-2 transition-all duration-200',
                i < active
                  ? 'bg-[hsl(var(--ollvy-green))] border-[hsl(var(--ollvy-green))]'
                  : i === active
                    ? 'bg-background border-foreground scale-125'
                    : 'bg-background border-border hover:border-foreground/40'
              )}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div
        key={active}
        className="p-4 sm:p-8 min-h-[220px] sm:min-h-[280px] flex flex-col"
      >
        {/* Step icon */}
        <div
          className={cn(
            'w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 sm:mb-5',
            step.isCompletion
              ? 'bg-[hsl(var(--ollvy-green))]/15 text-[hsl(var(--ollvy-green))]'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <Icon size={18} />
        </div>

        {/* Title + timeline */}
        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug">
            {step.title}
          </h3>
          <span className="shrink-0 text-xs text-muted-foreground border border-border rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono">
            {step.timeline}
          </span>
        </div>

        {/* Body */}
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {step.body}
        </p>

        {/* Milestone */}
        {step.milestone && (
          <div className="mt-3 sm:mt-4 flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full shrink-0',
                step.isCompletion
                  ? 'bg-[hsl(var(--ollvy-green))]'
                  : 'bg-muted-foreground'
              )}
            />
            <p className="text-xs text-muted-foreground">
              {step.isCompletion ? '✓ ' : ''}
              {step.milestone}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between px-4 pb-4 sm:px-8 sm:pb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActive((prev) => Math.max(0, prev - 1))}
          disabled={active === 0}
          className="gap-1.5"
        >
          <ChevronLeft size={14} />
          Previous Step
        </Button>
        {active < steps.length - 1 ? (
          <Button
            size="sm"
            onClick={() =>
              setActive((prev) => Math.min(steps.length - 1, prev + 1))
            }
            className="gap-1.5"
          >
            Next Step
            <ChevronRight size={14} />
          </Button>
        ) : (
          <Button size="sm" asChild>
            <Link href={(() => {
              if (!serviceId) return '/services'
              if (priceVariesByState) return `/quote/request/${serviceId}`
              // Always go through eligibility first - it handles redirect if no questions
              return `/checkout/${serviceId}/eligibility`
            })()} prefetch={true}>
              {serviceSlug && QUESTIONNAIRE_BASED_SERVICES.includes(serviceSlug)
                ? 'Check Eligibility & Price →'
                : 'Start Application →'}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
```

### 4C. `components/service/ExplainerStepper.tsx` — "What is [Service]?" Section

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DBServiceExplainerStep } from '@/lib/data/services'
import { Button } from '@/components/ui/button'

interface ExplainerStepperProps {
  serviceName: string
  steps: DBServiceExplainerStep[]
}

export function ExplainerStepper({ serviceName, steps }: ExplainerStepperProps) {
  const [active, setActive] = useState(0)
  const navRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  // Update indicator position when active step changes
  useEffect(() => {
    if (navRef.current) {
      const activeButton = navRef.current.querySelector(`[data-step="${active}"]`) as HTMLElement
      if (activeButton) {
        setIndicator({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
        })
      }
    }
  }, [active])

  // Initialize indicator position on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (navRef.current) {
        const activeButton = navRef.current.querySelector(`[data-step="${active}"]`) as HTMLElement
        if (activeButton) {
          setIndicator({
            left: activeButton.offsetLeft,
            width: activeButton.offsetWidth,
          })
        }
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (!steps || steps.length === 0) return null

  const step = steps[active]

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden mt-6">
      {/* Header with tab navigation and smooth underline */}
      <div className="border-b border-border">
        <div
          ref={navRef}
          className="flex items-center gap-6 px-6 relative overflow-x-auto scrollbar-hide"
        >
          {steps.map((s, i) => (
            <button
              key={i}
              data-step={i}
              onClick={() => setActive(i)}
              className={cn(
                'shrink-0 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                active === i
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {s.title}
            </button>
          ))}
          {/* Sliding underline indicator */}
          <div
            className="absolute bottom-0 h-0.5 bg-foreground transition-all duration-300 ease-out"
            style={{
              left: indicator.left,
              width: indicator.width,
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <div
        key={active}
        className="p-6 min-h-[120px] flex flex-col"
      >
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {step.body}
        </p>
      </div>

      {/* Navigation - hide on last step */}
      {active < steps.length - 1 && (
        <div className="flex justify-end px-6 pb-5">
          <Button
            size="sm"
            onClick={() =>
              setActive((prev) => Math.min(steps.length - 1, prev + 1))
            }
            className="gap-1.5"
          >
            Next Step
            <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </div>
  )
}
```

### 4D. `components/service/ServiceRisks.tsx` — Risk Information Section

```tsx
'use client'

import { DBServiceRisk } from '@/lib/data/services'
import { Clock, AlertTriangle, FileText, Building, AlertCircle } from 'lucide-react'

const RISK_ICONS = {
  clock: Clock,
  mismatch: AlertTriangle,
  document: FileText,
  building: Building,
  alert: AlertCircle,
}

export function ServiceRisks({
  risks,
  serviceShortName,
}: {
  risks: DBServiceRisk[]
  serviceShortName: string
}) {
  if (risks.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        What could go wrong with {serviceShortName}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        These are the risks. We handle most of them, but you should know what
        they are.
      </p>

      <div className="space-y-4">
        {risks.map((risk, i) => {
          const Icon = RISK_ICONS[risk.icon]
          return (
            <div
              key={i}
              className="flex items-start gap-4 border border-border rounded-xl p-5 bg-card"
            >
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--ollvy-amber))]/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-[hsl(var(--ollvy-amber))]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {risk.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {risk.body}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

### 4E. `components/service/ProfilePersonas.tsx` — "We Handle Messy Situations" Section

```tsx
'use client'

import { DBProfilePersona } from '@/lib/data/services'

export function ProfilePersonas({
  personas,
  serviceName,
}: {
  personas: DBProfilePersona[]
  serviceName: string
}) {
  if (personas.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        We handle the messy situations too.
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        The situations most CAs decline or overcharge for.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {personas.map((persona, i) => (
          <div
            key={i}
            className="flex items-start gap-3 border border-border rounded-xl p-4 bg-card"
          >
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 font-mono text-xs font-bold text-muted-foreground">
              {persona.label[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {persona.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {persona.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 4F. `components/service/RelatedServices.tsx` — Cross-sell Related Services

```tsx
'use client'

import Link from 'next/link'
import { RelatedServiceCard } from '@/lib/data/services'
import { Card } from '@/components/ui/card'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { getGuaranteedDate } from '@/lib/dates'

export function RelatedServices({ services }: { services: RelatedServiceCard[] }) {
  if (services.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Services you'll need next
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        These services often go with what you're booking.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.slice(0, 4).map((service) => {
          const totalFee = service.ollvyFee + (service.govtFee ?? 0)
          const guaranteedDate = service.isRetainer
            ? undefined
            : getGuaranteedDate(service.slaDays)

          return (
            <Link key={service.slug} href={`/services/${service.slug}`} prefetch={true}>
              <Card className="border border-border bg-card p-5 h-full hover:border-foreground/30 transition-colors group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
                      {service.shortName}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {service.tagline}
                    </p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-0.5"
                  />
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="font-mono text-sm font-semibold text-foreground">
                    ₹{totalFee.toLocaleString('en-IN')}
                  </span>
                  {guaranteedDate && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle
                        size={10}
                        className="text-[hsl(var(--ollvy-green))]"
                      />
                      By {guaranteedDate}
                    </span>
                  )}
                  {service.isRetainer && (
                    <span className="text-xs text-muted-foreground">
                      Monthly
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

### 4G. `components/service/HowWeReviewed.tsx` — Source Attribution

```tsx
'use client'

import { useState } from 'react'
import { DBServiceConfig } from '@/lib/data/services'
import { FileText, History, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LAST_REVIEWED } from '@/constants/accuracy'

export function HowWeReviewed({ service }: { service: DBServiceConfig }) {
  const [activeTab, setActiveTab] = useState<'sources' | 'history'>('sources')

  return (
    <div className="mt-16 pt-10 border-t border-border">
      <h3 className="text-sm font-semibold text-foreground mb-1">
        How we reviewed this page
      </h3>
      <p className="text-xs text-muted-foreground mb-5 leading-relaxed max-w-[560px]">
        The penalty amounts, deadlines, and regulatory requirements on this page
        are sourced directly from official government portals. We do not use
        secondary sources. When regulations change, we update the page.
      </p>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border mb-5">
        {(['sources', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-colors capitalize',
              activeTab === tab
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground'
            )}
          >
            {tab === 'sources' ? <FileText size={11} /> : <History size={11} />}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'sources' && (
        <ul className="space-y-3">
          {service.reviewSources.map((source) => (
            <li key={source.name} className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
              <div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-foreground hover:underline inline-flex items-center gap-1"
                >
                  {source.name}
                  <ExternalLink size={9} className="opacity-50" />
                </a>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {source.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeTab === 'history' && (
        <div>
          <p className="text-xs text-muted-foreground">
            Last reviewed:{' '}
            <span className="text-foreground font-medium">
              {LAST_REVIEWED[service.slug] ?? 'March 2025'}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Penalty amounts and deadlines are manually verified against source
            portals when any regulatory update is announced.
          </p>
        </div>
      )}
    </div>
  )
}
```

### 4H. `components/service/CompletionStats.tsx` — Completion Statistics

```tsx
'use client'

import { DBServiceConfig } from '@/lib/data/services'
import { Card } from '@/components/ui/card'

export function CompletionStats({ service }: { service: DBServiceConfig }) {
  // TODO: Fetch real stats from API when available
  // For now, this component is only rendered when showCompletionStats is true
  // which requires 10+ orders

  return (
    <Card className="border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            47 orders completed this month
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Average completion time: {service.slaDays - 2} days
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold font-mono text-[hsl(var(--ollvy-green))]">
            98%
          </span>
          <p className="text-xs text-muted-foreground">on-time rate</p>
        </div>
      </div>

      {/* Distribution bars placeholder */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-20">1-5 days</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--ollvy-green))] rounded-full"
              style={{ width: '35%' }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">35%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-20">6-10 days</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--ollvy-green))] rounded-full"
              style={{ width: '52%' }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">52%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-20">11-15 days</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--ollvy-amber))] rounded-full"
              style={{ width: '13%' }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">13%</span>
        </div>
      </div>
    </Card>
  )
}
```

### 4I. `components/guides/LearnSectionTable.tsx` — Structured HTML Tables

```tsx
'use client'

import type { LearnSectionTable as TableType } from '@/lib/guides/types/learn-section-table'

interface Props {
  table: TableType
}

/**
 * Wraps numbers (including currency, percentages, and numeric values) in font-mono spans
 */
function formatWithMonoNumbers(text: string): React.ReactNode {
  // Match: ₹ amounts, percentages, plain numbers with optional commas/decimals, and ranges like "7-10"
  const parts = text.split(/(₹[\d,]+(?:\.\d+)?(?:\s*(?:Cr|L|K|crore|lakh))?|\d+(?:,\d+)*(?:\.\d+)?%?(?:\s*(?:Cr|L|K|crore|lakh|days?|years?|months?))?|\d+-\d+)/gi)

  return parts.map((part, i) => {
    // Check if this part contains numbers
    if (/^₹?[\d,.-]+(?:\.\d+)?%?(?:\s*(?:Cr|L|K|crore|lakh|days?|years?|months?))?$/i.test(part) || /^\d+-\d+$/.test(part)) {
      return <span key={i} className="font-mono">{part}</span>
    }
    return part
  })
}

/**
 * Renders a comparison/reference table inside a LearnSection.
 *
 * Used for:
 * - GST threshold tables
 * - Pvt Ltd vs LLP comparison
 * - ITR form selection
 * - FSSAI licence tiers
 * - etc.
 */
export function LearnSectionTable({ table }: Props) {
  const { caption, headers, rows } = table

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      {caption && (
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground">
            {caption}
          </p>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/20">
            {headers.map((header, i) => (
              <th
                key={i}
                className="text-left py-3 px-4 font-semibold text-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border last:border-0"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cellIndex === 0
                    ? 'py-3 px-4 text-foreground font-medium'
                    : 'py-3 px-4 text-muted-foreground'
                  }
                >
                  {formatWithMonoNumbers(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### 4J. `components/seo/ServiceStructuredData.tsx` — JSON-LD Structured Data

```tsx
// Structured Data for individual service pages
// Includes BreadcrumbList, Service, AggregateRating, and FAQPage schemas

interface ReviewData {
  rating: number
  comment: string | null
  created_at: string
}

interface FallbackReview {
  rating: number
  comment: string
  date: string
  name: string
}

interface ProcessStep {
  step: number
  title: string
  timeline: string
  body: string
}

interface WhatsIncludedItem {
  title: string
  body: string
}

interface ServiceStructuredDataProps {
  serviceName: string
  serviceSlug: string
  description: string
  price: number // Ollvy fee in rupees
  govtFee?: number // Government fee in rupees
  category?: string
  avgRating?: number | null
  totalRatings?: number
  faqs?: { q: string; a: string }[]
  reviews?: ReviewData[]
  fallbackReviews?: FallbackReview[]
  // New props for additional rich results
  processSteps?: ProcessStep[]
  whatsIncluded?: WhatsIncludedItem[]
  slaDays?: number
}

export function ServiceStructuredData({
  serviceName,
  serviceSlug,
  description,
  price,
  govtFee,
  category = 'Professional Service',
  avgRating,
  totalRatings,
  faqs,
  reviews = [],
  fallbackReviews = [],
  processSteps = [],
  whatsIncluded = [],
  slaDays,
}: ServiceStructuredDataProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.ollvy.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.ollvy.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: serviceName,
        item: `https://www.ollvy.com/services/${serviceSlug}`,
      },
    ],
  }

  // Build offers with price specification if govt fee exists
  const offersSchema = govtFee
    ? {
        '@type': 'Offer',
        price: price + govtFee,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        priceSpecification: [
          {
            '@type': 'UnitPriceSpecification',
            price: price,
            priceCurrency: 'INR',
            name: 'Professional Fee',
          },
          {
            '@type': 'UnitPriceSpecification',
            price: govtFee,
            priceCurrency: 'INR',
            name: 'Government Fee',
          },
        ],
      }
    : {
        '@type': 'Offer',
        price: price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      }

  // Build review array for schema (real reviews or fallback)
  const reviewsForSchema = reviews.length > 0
    ? reviews.slice(0, 5).map(review => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Verified Customer' },
        datePublished: review.created_at.split('T')[0],
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating.toString(),
          bestRating: '5',
        },
        reviewBody: review.comment || '',
      }))
    : fallbackReviews.slice(0, 5).map(review => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: review.name },
        datePublished: review.date.includes('2026') ? '2026-03-01' : '2026-02-01',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating.toString(),
          bestRating: '5',
        },
        reviewBody: review.comment,
      }))

  // Build HowTo schema from process steps (for "how to" rich results)
  const howToSchema = processSteps.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to get ${serviceName} in India`,
    description: `Step-by-step process to complete ${serviceName} with Ollvy`,
    totalTime: slaDays ? `P${slaDays}D` : undefined, // ISO 8601 duration
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: govtFee ? price + govtFee : price,
    },
    step: processSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.body,
      ...(step.timeline ? { duration: step.timeline } : {}),
    })),
  } : null

  // Build hasOfferCatalog from whatsIncluded (shows what's included in the service)
  const offerCatalog = whatsIncluded.length > 0 ? {
    '@type': 'OfferCatalog',
    name: `What's included in ${serviceName}`,
    itemListElement: whatsIncluded.map((item, index) => ({
      '@type': 'Offer',
      position: index + 1,
      itemOffered: {
        '@type': 'Service',
        name: item.title,
        description: item.body,
      },
    })),
  } : null

  // Build service schema with optional aggregate rating
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    url: `https://www.ollvy.com/services/${serviceSlug}`,
    provider: {
      '@type': 'Organization',
      name: 'Ollvy',
      url: 'https://www.ollvy.com',
      logo: 'https://www.ollvy.com/logo.png',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    serviceType: category,
    offers: offersSchema,
    // Estimated duration in ISO 8601 format (P = period, D = days)
    ...(slaDays ? { estimatedDuration: `P${slaDays}D` } : {}),
    // Include what's included as offer catalog
    ...(offerCatalog ? { hasOfferCatalog: offerCatalog } : {}),
    // Include aggregate rating if we have enough reviews (10+)
    ...(avgRating && totalRatings && totalRatings >= 10
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avgRating,
            ratingCount: totalRatings,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    // Include individual reviews for rich results
    ...(reviewsForSchema.length > 0 ? { review: reviewsForSchema } : {}),
  }

  // Build FAQPage schema if FAQs exist
  const faqPageSchema =
    faqs && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
    </>
  )
}
```

---

## 5. Static Service Page Configs (govtFees tables, documents tables, explainers)

These static configs provide structured HTML tables for government fees and required documents that are rendered on service pages via `LearnSectionTable`. The database (Section 2) is the primary source of truth for pricing/content, but these tables supplement the page.

### 5A. `lib/services/data/services-1-2.ts` — Pvt Ltd + LLP

```typescript
import type { ServicePageConfig } from '../types'

// ─── 1. Private Limited Company Registration ──────────────────────────────────

export const pvtLtdIncorporation: ServicePageConfig = {
  slug: 'pvt-ltd-incorporation',
  title: 'Private Limited Company Registration',
  tagline: 'Separate legal entity. Limited liability. Ready for investment.',
  seoTitle: 'Private Limited Company Registration in India 2025 | Ollvy',
  seoDescription: 'Register your Pvt Ltd company in 15 working days. DSC, DIN, MOA/AOA, PAN, TAN included. CA/CS assigned same day. From Rs. 1,499 + govt fees.',
  canonicalUrl: 'https://www.ollvy.com/services/pvt-ltd-incorporation',
  lastReviewed: 'April 2026',
  category: 'Incorporation',

  relatedServiceSlugs: ['llp-incorporation', 'gst-registration', 'trademark-registration', 'msme-registration'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'do-i-need-gst-registration', 'should-i-get-dpiit-startup-recognition'],

  explainer: {
    whatItIs: 'A Private Limited Company is a business entity registered under the Companies Act, 2013. It is a separate legal person - it can own property, enter contracts, hire employees, and sue or be sued in its own name. Shares are held privately by up to 200 shareholders and cannot be publicly traded.',
    whyYouNeedIt: 'If you plan to raise equity investment, Pvt Ltd is the only structure that works - investors receive shares, and an LLP cannot issue them. It also enables ESOPs, gives you a clean cap table, and provides the credibility enterprise clients and banks require.',
    whatHappensWithout: 'Operating as a proprietorship means unlimited personal liability - creditors can pursue your personal assets. You cannot raise equity, issue ESOPs, or provide the legal continuity that investors and acquirers require.',
  },

  workflow: [
    {
      step: 1,
      title: 'Answer 5 questions - we build your checklist',
      timeframe: 'Day 0',
      description: 'Number of directors, shareholders, proposed company name (3 options recommended), registered office state, and authorised capital. A company secretary is assigned within 4 hours.',
      milestone: 'CS assigned, personalised checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeframe: 'Day 0-2',
      description: 'PAN and Aadhaar for all directors, address proof for the registered office, passport photos. Your CS verifies every document before filing - mismatches caught here, not after MCA raises a query.',
      milestone: 'Documents verified by CS',
    },
    {
      step: 3,
      title: 'DSC and DIN arranged for all directors',
      timeframe: 'Day 2-4',
      description: 'Digital Signature Certificates and Director Identification Numbers are mandatory. We arrange DSC tokens and guide each director through video verification in the app.',
      milestone: 'DSC and DIN ready',
    },
    {
      step: 4,
      title: 'Name approved via RUN',
      timeframe: 'Day 4-7',
      description: 'Your CS files the Reserve Unique Name application with MCA. Approval typically takes 2-3 working days. If a name is rejected, we file alternatives immediately at no extra cost.',
      milestone: 'Company name approved',
    },
    {
      step: 5,
      title: 'SPICe+ filed - MOA, AOA, PAN, TAN in one submission',
      timeframe: 'Day 7-12',
      description: 'SPICe+ is the single MCA form for incorporation, PAN, TAN, and optional GST pre-enrolment. Your CS drafts the MOA and AOA based on your specific business activities.',
      milestone: 'SPICe+ submitted to MCA',
    },
    {
      step: 6,
      title: 'Certificate of Incorporation issued',
      timeframe: 'Day 12-15',
      description: 'MCA issues your CIN. PAN and TAN are generated automatically. All documents are uploaded to your Ollvy account. Your compliance calendar is populated with every annual deadline.',
      milestone: 'Company incorporated',
    },
  ],

  included: [
    {
      title: 'DSC for all directors - video verification guided',
      description: 'Digital Signature Certificates are mandatory for filing. We arrange the tokens and guide each director through video verification - 15 minutes per director.',
      without: 'Navigate DSC portals yourself - 3+ hours per director',
      withOllvy: 'Guided flow in the app - 15 minutes per director',
    },
    {
      title: 'DIN as part of SPICe+ - no separate filing',
      description: 'Director Identification Number is included in SPICe+. No separate DIR-3 application, no extra time.',
      without: 'Separate DIR-3 filing - adds 3-5 days',
      withOllvy: 'DIN filed simultaneously in SPICe+',
    },
    {
      title: 'MOA and AOA drafted for your business',
      description: 'Main objects, ancillary objects, and authorised capital are drafted based on what you actually do - not a generic template that may need amendment later.',
      without: 'Generic template - may require costly amendment later',
      withOllvy: 'Custom drafting based on your business activities',
    },
    {
      title: 'PAN and TAN included',
      description: 'Both are applied for within SPICe+. Issued within 24 hours of CIN with no separate process.',
    },
    {
      title: 'Compliance calendar auto-populated',
      description: 'From day one, your calendar shows every deadline: first board meeting (30 days), auditor appointment ADT-1 (15 days from AGM), DIR-3 KYC (Sep 30 annually), MCA annual filing, and Business ITR.',
    },
    {
      title: 'All documents stored permanently',
      description: 'Certificate of Incorporation, MOA, AOA, PAN, TAN, share certificates - all in your Ollvy account. Your CA will ask for these every year.',
    },
  ],

  risks: [
    {
      title: 'Name rejected by MCA',
      description: 'MCA rejects names similar to existing companies or containing restricted words (Bank, Insurance, Exchange). We search MCA and trademark databases before submitting. If all 3 names are rejected, we suggest alternatives at no extra cost.',
    },
    {
      title: 'Registered address document mismatch',
      description: 'The address on your utility bill must match your application exactly. If using a rented premises, you need a NOC from the landlord. Your CS verifies all address documents before filing.',
    },
    {
      title: 'Director slow on DSC video verification',
      description: 'SPICe+ cannot be filed until all directors complete DSC verification. Ollvy sends daily reminders and tracks completion. The verification takes 10-15 minutes per director.',
    },
  ],

  personas: [
    {
      title: 'First-time founder',
      description: 'Never incorporated before. We explain every document and step before you take it.',
    },
    {
      title: 'Two co-founders in different cities',
      description: 'DSC video verification done remotely. Common setup, handled routinely.',
    },
    {
      title: 'Home address as registered office',
      description: 'Fully legal. We verify address proof requirements for your state before filing.',
    },
    {
      title: 'Raising investment soon',
      description: 'Authorised capital set appropriately. Board composition planned for investor entry.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'How long does Pvt Ltd incorporation take?',
      a: '15 working days end-to-end. DSC takes 2 days, name approval 3 days, SPICe+ filing and MCA approval 10 days. We file the moment documents are ready - MCA processing speed is outside our control.',
    },
    {
      category: 'General',
      q: 'What is the minimum capital required to register a Pvt Ltd?',
      a: 'No legal minimum. Authorised capital can be Rs. 1 lakh - the standard starting point. Stamp duty on incorporation is based on authorised capital and varies by state.',
    },
    {
      category: 'General',
      q: 'Can I register a Pvt Ltd with just one director?',
      a: 'A Pvt Ltd requires a minimum of 2 directors and 2 shareholders. If you are the sole owner, you can use a nominee shareholder (a family member or co-founder holding a single share) to meet the requirement. For a truly single-person structure, consider an OPC (One Person Company).',
    },
    {
      category: 'General',
      q: 'Pvt Ltd or LLP - which is better?',
      a: 'Pvt Ltd if you plan to raise equity, issue ESOPs, or need the structure for enterprise clients and investors. LLP if you are a professional services firm, do not need equity funding, and want lower compliance costs (Rs. 10,000-20,000/year vs Rs. 25,000-50,000/year for Pvt Ltd).',
    },
    {
      category: 'General',
      q: 'Can a foreign national be a director?',
      a: 'Yes. At least one director must be an Indian resident (present in India for 182+ days in the previous financial year), but the other directors can be foreign nationals.',
    },
    {
      category: 'Process',
      q: 'What if my proposed company name is rejected?',
      a: 'We search MCA and trademark databases before filing to minimise rejection risk. If rejected, we refile with your alternative names immediately at no extra cost.',
    },
    {
      category: 'Process',
      q: 'Can I use my home address as the registered office?',
      a: 'Yes. A residential address is fully legal as a registered office. You need an electricity bill in your name or the owner\'s name, and a NOC from the owner if you are a tenant.',
    },
    {
      category: 'Documents',
      q: 'What documents do directors need?',
      a: 'PAN card, Aadhaar card, passport photo, mobile number linked to Aadhaar for OTP, and an address proof (bank statement or utility bill not older than 2 months). Directors must complete video verification for DSC.',
    },
    {
      category: 'After Completion',
      q: 'What are my first compliance obligations after incorporation?',
      a: 'File Form INC-20A (commencement of business) within 180 days - this requires the initial share capital to be deposited in a company bank account, so open a current account immediately. Annual: AOC-4 by 30 days after AGM, MGT-7 by 60 days after AGM, DIR-3 KYC by Sep 30, Business ITR by Oct 31. All added to your Ollvy compliance calendar automatically.',
    },
    {
      category: 'After Completion',
      q: 'Does incorporation include GST registration?',
      a: 'No. GST registration is separate and mandatory once your turnover crosses the threshold (Rs. 20 lakh for services, Rs. 40 lakh for goods). You can book both together - both professionals are assigned the same day.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - Private Limited Company Registration (2025)',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['DSC per director', 'Rs. 1,000-2,000', 'Varies by certifying authority and 1 or 2-year validity'],
      ['SPICe+ filing fee', 'Nil (for authorised capital up to Rs. 15 lakh, ≤7 subscribers)', 'Stamp duty on MOA/AOA is additional and varies by state'],
      ['Stamp duty on MOA/AOA', 'Rs. 200-2,000+', 'State-specific; higher for larger authorised capital'],
      ['PAN application', 'Nil', 'Included in SPICe+ - no separate fee'],
      ['TAN application', 'Nil', 'Included in SPICe+ - no separate fee'],
      ['Typical total govt fee', 'Rs. 2,000-6,000', 'Authorised capital Rs. 1 lakh; 2 directors; Delhi or Maharashtra'],
    ],
  },

  documents: {
    caption: 'Documents Required - Private Limited Company Registration',
    headers: ['Document', 'Required From', 'Notes'],
    rows: [
      ['PAN card', 'All directors and shareholders', 'Clear scan; must match Aadhaar name exactly'],
      ['Aadhaar card', 'All directors', 'Mobile linked to Aadhaar must be active for OTP'],
      ['Passport photo', 'All directors', 'Recent; white background'],
      ['Address proof (director)', 'All directors', 'Bank statement or utility bill - not older than 2 months'],
      ['Registered office proof', 'Company', 'Electricity bill + NOC from owner if rented; sale deed if owned'],
      ['Proposed company names', 'Founder', '3 names in order of preference with business significance'],
      ['Business activity description', 'Founder', 'What the company will do - used to draft MOA main objects'],
    ],
  },
}


// ─── 2. LLP Incorporation ─────────────────────────────────────────────────────

export const llpIncorporation: ServicePageConfig = {
  slug: 'llp-incorporation',
  title: 'LLP Registration',
  tagline: 'Limited liability. Flexible profit-sharing. Lower compliance than Pvt Ltd.',
  seoTitle: 'LLP Registration in India 2025 | Limited Liability Partnership | Ollvy',
  seoDescription: 'Register your LLP in 12 working days. DPIN, DSC, LLP Agreement, PAN included. No mandatory audit below Rs. 40 lakh turnover. CS assigned same day.',
  canonicalUrl: 'https://www.ollvy.com/services/llp-incorporation',
  lastReviewed: 'April 2026',
  category: 'Incorporation',

  relatedServiceSlugs: ['pvt-ltd-incorporation', 'gst-registration', 'msme-registration'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'A Limited Liability Partnership is registered under the LLP Act, 2008. It is a separate legal entity with limited liability - partners are not personally liable for business debts beyond their agreed contribution. There are no shares, no mandatory board meetings, and no mandatory audit below Rs. 40 lakh turnover.',
    whyYouNeedIt: 'LLP is the right structure if you want direct management flexibility, lower annual compliance costs, and profit-sharing that does not follow capital contribution. Professional services firms (CAs, lawyers, architects, consultants) and bootstrapped businesses typically choose LLP over Pvt Ltd.',
    whatHappensWithout: 'An unregistered partnership means unlimited personal liability for all partners - one partner\'s actions can expose every other partner\'s personal assets. The firm cannot own property in its name or enforce contracts in its own right in court.',
  },

  workflow: [
    {
      step: 1,
      title: 'Answer questions - we build your checklist',
      timeframe: 'Day 0',
      description: 'Business type, number of partners, proposed LLP name (3 options), registered state, capital contribution split. CS assigned within 4 hours.',
      milestone: 'CS assigned, checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeframe: 'Day 0-1',
      description: 'PAN and Aadhaar for all partners, registered address proof, capital contribution details. CS verifies every document before filing.',
      milestone: 'Documents verified',
    },
    {
      step: 3,
      title: 'DPIN and DSC arranged',
      timeframe: 'Day 1-3',
      description: 'Designated Partner Identification Number is required for all partners. We file DPIN applications and arrange DSC tokens with guided video verification.',
      milestone: 'DPIN and DSC ready',
    },
    {
      step: 4,
      title: 'FiLLiP filed - LLP Agreement, PAN in one submission',
      timeframe: 'Day 4-9',
      description: 'FiLLiP is the integrated LLP incorporation form. Your CS drafts the LLP Agreement based on your actual partner arrangement and files with MCA.',
      milestone: 'FiLLiP submitted to MCA',
    },
    {
      step: 5,
      title: 'LLPIN issued',
      timeframe: 'Day 10-12',
      description: 'MCA issues the Certificate of Incorporation with your LLP Identification Number. PAN generated automatically. All documents uploaded to your account.',
      milestone: 'Certificate of Incorporation issued',
    },
  ],

  included: [
    {
      title: 'LLP Agreement drafted - not templated',
      description: 'Defines profit-sharing, decision-making, capital contribution, partner exit terms. Drafted based on your actual arrangement.',
      without: 'Generic 50-50 template - partner disputes arise later',
      withOllvy: 'Custom agreement reflecting your exact split, roles, and exit terms',
    },
    {
      title: 'DPIN for all designated partners',
      description: 'Every designated partner needs a DPIN. We file all applications simultaneously - no sequential delays.',
    },
    {
      title: 'DSC arranged - video verification guided',
      description: 'DSC is required for all partners. We arrange tokens and guide video verification in the app - 15 minutes per partner.',
    },
    {
      title: 'Compliance calendar auto-populated',
      description: 'Once LLPIN is issued, your calendar shows Form 11 (annual return, due May 30) and Form 8 (statement of accounts, due Oct 30).',
    },
  ],

  risks: [
    {
      title: 'Name similarity rejection',
      description: 'LLP names must be distinct from existing LLPs and companies. We check both registries before submission.',
    },
    {
      title: 'LLP Agreement must reflect actual terms',
      description: 'Vague profit-sharing or unclear exit clauses are the most common source of partner disputes. We draft explicit percentages, decision rights, and terms.',
    },
    {
      title: 'All partners must complete DSC verification',
      description: 'FiLLiP cannot be filed until every partner completes video verification. We track completion and send daily reminders.',
    },
  ],

  personas: [
    {
      title: 'Professional services firm',
      description: 'CA firms, law firms, architects, consultants - LLP is the natural structure. Lower compliance, flexible remuneration.',
    },
    {
      title: 'Two or three partners with unequal contribution',
      description: 'Different capital, different profit share. Agreement drafted to reflect the exact split.',
    },
    {
      title: 'Converting from unregistered partnership',
      description: 'Existing firm converting to LLP for limited liability. We handle the transition process.',
    },
    {
      title: 'Bootstrapped business - no funding plans',
      description: 'No plans to raise equity. LLP gives limited liability and simpler compliance at Rs. 10,000-20,000/year vs Rs. 25,000-50,000/year for Pvt Ltd.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'LLP vs Pvt Ltd - which is better?',
      a: 'LLP if you are a professional services firm, do not plan to raise equity, and want lower compliance costs. Pvt Ltd if you plan to raise funding from angel investors or VCs, issue ESOPs, or need a shareholder structure. LLPs cannot issue shares - investors cannot take equity stakes.',
    },
    {
      category: 'General',
      q: 'What is the annual compliance cost for an LLP?',
      a: 'Rs. 10,000-20,000 for a small LLP with minimal activity. This covers Form 8 (due Oct 30), Form 11 (due May 30), and ITR-5. No mandatory audit below Rs. 40 lakh turnover and Rs. 25 lakh partner contribution. Pvt Ltd costs Rs. 25,000-50,000 annually due to mandatory statutory audit.',
    },
    {
      category: 'General',
      q: 'How many partners are required for an LLP?',
      a: 'Minimum 2 designated partners, both of whom must be individuals. At least one must be a resident Indian (present in India for 182+ days in the previous financial year). There is no maximum number of partners.',
    },
    {
      category: 'General',
      q: 'Can an LLP be converted to a Pvt Ltd later?',
      a: 'Yes, under Section 366 of the Companies Act, 2013. The process takes 3-6 months, involves multiple MCA filings, stamp duty on asset transfer, and a valuation exercise. If equity funding is even a possibility within 3 years, it is cheaper and simpler to start as a Pvt Ltd.',
    },
    {
      category: 'General',
      q: 'Does an LLP need to hold board meetings?',
      a: 'No. LLPs have no requirement for formal board meetings or general meetings. Partners decide as per the LLP Agreement.',
    },
    {
      category: 'General',
      q: 'Is LLP audit mandatory?',
      a: 'Only if turnover exceeds Rs. 40 lakh OR partner contribution exceeds Rs. 25 lakh in a financial year. Below both these thresholds, no statutory audit is required. Pvt Ltd audit is mandatory every year regardless of turnover.',
    },
    {
      category: 'Process',
      q: 'How long does LLP registration take?',
      a: '12 working days end-to-end. DPIN and DSC take 3 days, FiLLiP filing and MCA approval take 9 days.',
    },
    {
      category: 'Documents',
      q: 'What documents do partners need?',
      a: 'PAN card, Aadhaar card (with active linked mobile for OTP), passport photo, and address proof (bank statement or utility bill not older than 2 months).',
    },
    {
      category: 'After Completion',
      q: 'What are the annual LLP filing obligations?',
      a: 'Form 11 (Annual Return) by May 30 every year. Form 8 (Statement of Accounts and Solvency) by October 30 every year. ITR-5 by July 31 (no audit) or October 31 (audit applicable). Both Form 8 and Form 11 are mandatory regardless of whether the LLP was active.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - LLP Registration (2025)',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['DSC per partner', 'Rs. 1,000-2,000', 'Varies by certifying authority'],
      ['FiLLiP filing fee', 'Rs. 500-5,000', 'Based on capital contribution: Rs. 500 up to Rs. 1 lakh, Rs. 2,000 for Rs. 1-5 lakh, Rs. 5,000 above Rs. 5 lakh'],
      ['Stamp duty on LLP Agreement', 'Rs. 200-2,000+', 'State-specific; agreement must be stamped before filing'],
      ['PAN application', 'Nil', 'Included in FiLLiP'],
      ['Typical total govt fee', 'Rs. 1,500-5,000', 'Capital up to Rs. 1 lakh; 2 partners'],
    ],
  },

  documents: {
    caption: 'Documents Required - LLP Registration',
    headers: ['Document', 'Required From', 'Notes'],
    rows: [
      ['PAN card', 'All designated partners', 'Clear scan; name must match Aadhaar exactly'],
      ['Aadhaar card', 'All designated partners', 'Mobile linked to Aadhaar must be active for OTP'],
      ['Passport photo', 'All partners', 'Recent; white background'],
      ['Address proof (partner)', 'All partners', 'Bank statement or utility bill - not older than 2 months'],
      ['Registered office proof', 'LLP', 'Electricity bill + NOC from owner if rented'],
      ['Capital contribution details', 'All partners', 'Amount in rupees and percentage per partner'],
      ['Proposed LLP name', 'Founder', '3 names in order of preference'],
    ],
  },
}
```

### 5B. `lib/services/data/services-3-5.ts` — GST Registration, GST Monthly, Business ITR

```typescript
import type { ServicePageConfig } from '../types'

// ─── 3. GST Registration ──────────────────────────────────────────────────────

export const gstRegistration: ServicePageConfig = {
  slug: 'gst-registration',
  title: 'GST Registration',
  tagline: 'Your GSTIN, applied and obtained. ARN within 24 hours of filing.',
  seoTitle: 'GST Registration Online in India 2025 | Get GSTIN in 7 Days | Ollvy',
  seoDescription: 'GST registration in 7 working days. CA assigned same day, ARN in 24 hours. No govt fee. Mandatory above Rs. 20 lakh turnover for services.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-registration',
  lastReviewed: 'April 2026',
  category: 'GST',

  relatedServiceSlugs: ['gst-monthly-50l', 'pvt-ltd-incorporation', 'gst-cancellation'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'GST registration gives you a 15-digit GSTIN under the CGST Act, 2017. It authorises you to collect GST from customers, claim Input Tax Credit on purchases, and file GST returns.',
    whyYouNeedIt: 'Mandatory if your aggregate turnover exceeds Rs. 40 lakh for goods (Rs. 20 lakh for services, Rs. 10 lakh in special category states), for any interstate supply, or if you sell on any e-commerce platform. Even below the threshold, being registered lets B2B clients claim ITC on your invoices.',
    whatHappensWithout: 'Operating without mandatory registration is tax evasion. Penalty is 100% of tax due or Rs. 10,000, whichever is higher. You cannot claim ITC on purchases, cannot generate e-way bills, and platforms like Amazon and Flipkart will not onboard you.',
  },

  workflow: [
    {
      step: 1,
      title: 'Answer 5 questions - we build your checklist',
      timeframe: 'Day 0',
      description: 'Business type, state, turnover estimate, supply type (goods/services/both). CA assigned within 4 hours. They generate your specific document checklist - not the standard 20-item government list.',
      milestone: 'CA assigned, personalised checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeframe: 'Day 0-1',
      description: 'CA reviews every document before filing - blurry Aadhaar, address mismatch, wrong format caught here, not after the officer raises a query.',
      milestone: 'Documents verified by CA',
    },
    {
      step: 3,
      title: 'Application filed - ARN in 24 hours',
      timeframe: 'Day 1-2',
      description: 'CA files GST REG-01 on the GSTN portal. ARN generated immediately on submission and shared in your app the same day. Verify status yourself at gstn.gov.in.',
      milestone: 'ARN generated and sent to your app',
    },
    {
      step: 4,
      title: 'Officer query handled if applicable',
      timeframe: 'Day 3-5',
      description: 'GST officers request clarifications in approximately 20% of cases, typically for Aadhaar verification or address proof. Your CA responds within 24 hours. Included in scope.',
      milestone: 'Query responded',
    },
    {
      step: 5,
      title: 'GSTIN issued',
      timeframe: 'Day 5-7',
      description: 'Permanent - no renewal, no expiry as long as you file returns. Compliance calendar updated with your first GSTR-1 and GSTR-3B due dates.',
      milestone: 'GSTIN active on GSTN portal',
    },
  ],

  included: [
    {
      title: 'CA handles the GSTN portal - all 23 fields',
      description: 'GST REG-01 has 23 fields across 5 tabs. Your CA completes the entire form. You answer 5 questions in the app.',
      without: '23 fields, 5 tabs, 3-4 hours on the government portal',
      withOllvy: '5 questions, approximately 4 minutes in the app',
    },
    {
      title: 'ARN shared same day - track it yourself',
      description: 'ARN is generated on submission and shared immediately. Verify status on gstn.gov.in yourself - you do not have to wait for updates from us.',
    },
    {
      title: 'Officer queries handled - no extra charge',
      description: 'If the GST officer requests clarification, your CA responds within 24 hours. Part of the service, not a separate charge.',
    },
    {
      title: 'Compliance calendar updated automatically',
      description: 'GSTR-1 (11th of each month) and GSTR-3B (20th of each month) due dates appear in your calendar the moment GSTIN is issued.',
    },
  ],

  risks: [
    {
      title: 'Address proof mismatch',
      description: 'The business address on all documents must match exactly - building name, floor, area, and PIN code. Your CA checks every document for consistency before filing.',
    },
    {
      title: 'Aadhaar OTP failure',
      description: 'GST registration requires Aadhaar-based authentication. If the mobile linked to Aadhaar is old or inactive, OTP fails. This must be fixed at an Aadhaar enrolment centre. We verify this upfront.',
    },
    {
      title: 'Already past threshold without registration',
      description: 'If turnover has crossed the mandatory limit and you are not yet registered, you are liable for 100% of unpaid tax plus Rs. 10,000 minimum penalty. Registering now stops the liability from growing.',
    },
  ],

  personas: [
    {
      title: 'First GST registration',
      description: 'Never registered before. We explain what each document is for and why it is needed.',
    },
    {
      title: 'Turnover just crossed threshold',
      description: 'You waited until legally required. We register you quickly to stop penalty exposure.',
    },
    {
      title: 'Voluntary registration',
      description: 'Below threshold but want to issue GST invoices to B2B clients for ITC. Completely legal.',
    },
    {
      title: 'Home as principal place of business',
      description: 'Fully legal. We verify your electricity bill matches your application before filing.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'When is GST registration mandatory?',
      a: 'When aggregate turnover crosses Rs. 40 lakh for goods (Rs. 20 lakh for services, Rs. 10 lakh in special category states like Manipur, Mizoram, Nagaland, Tripura). Also mandatory for any interstate supply regardless of turnover, and for all e-commerce sellers from day one.',
    },
    {
      category: 'General',
      q: 'What is the government fee for GST registration?',
      a: 'Nil. There is no government fee for GST registration. The only cost is the professional fee for filing.',
    },
    {
      category: 'General',
      q: 'Can I register voluntarily if I am below the threshold?',
      a: 'Yes. Voluntary registration lets you issue GST invoices and claim ITC on purchases. Cannot be cancelled for at least one year from the date of registration.',
    },
    {
      category: 'General',
      q: 'I sell on Instagram. Do I need GST?',
      a: 'Direct selling via social media is not e-commerce under GST law - the e-commerce provision applies only to platforms that facilitate the transaction (Amazon, Swiggy). Social selling is treated as direct sale, so the turnover threshold applies normally.',
    },
    {
      category: 'General',
      q: 'I make interstate sales but my turnover is only Rs. 5 lakh. Do I need GST?',
      a: 'Yes. Section 24 of the CGST Act mandates registration for any interstate supply - there is no turnover threshold for this. Even one sale to a customer in another state triggers mandatory registration.',
    },
    {
      category: 'Process',
      q: 'What is an ARN and why does it matter?',
      a: 'Application Reference Number - generated the moment your application is submitted. You can track processing status on the GSTN portal yourself at gstn.gov.in using the ARN without waiting for updates from us.',
    },
    {
      category: 'Process',
      q: 'What if the officer raises a query?',
      a: 'Your CA responds within 24 hours. Included in the service at no extra charge. Most queries are resolved in one reply.',
    },
    {
      category: 'After Completion',
      q: 'What returns must I file after getting GSTIN?',
      a: 'GSTR-1 by 11th of every month (outward supplies), GSTR-3B by 20th (net tax payment and ITC claim). Nil returns required even when there are no transactions. GSTR-9 annual return by December 31. All deadlines in your Ollvy compliance calendar.',
    },
    {
      category: 'After Completion',
      q: 'What is the penalty for not filing GST returns?',
      a: 'Rs. 50 per day per return (Rs. 25 CGST + Rs. 25 SGST) for non-nil returns, capped at Rs. 10,000 per return. Rs. 20 per day for nil returns, capped at Rs. 500. Plus 18% annual interest on any unpaid tax.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - GST Registration',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['GST registration application (REG-01)', 'Nil', 'No government fee for registration'],
      ['Penalty if registering late (turnover above threshold)', 'Rs. 10,000 minimum or 100% of unpaid tax', 'Whichever is higher - stops accruing once registered'],
      ['Late filing fee after registration (non-nil returns)', 'Rs. 50/day per return, capped at Rs. 10,000', 'Rs. 25 CGST + Rs. 25 SGST per day per return'],
      ['Late filing fee (nil returns)', 'Rs. 20/day per return, capped at Rs. 500', 'Rs. 10 CGST + Rs. 10 SGST per day per return'],
    ],
  },

  documents: {
    caption: 'Documents Required - GST Registration',
    headers: ['Document', 'Sole Proprietor / Individual', 'Pvt Ltd / LLP'],
    rows: [
      ['PAN card', 'Owner PAN', 'Company / LLP PAN'],
      ['Aadhaar card', 'Owner Aadhaar (OTP required)', 'Not required at entity level'],
      ['Address proof (business)', 'Electricity bill (not older than 2 months)', 'Electricity bill (not older than 2 months)'],
      ['NOC from property owner', 'If premises is rented', 'If premises is rented'],
      ['Bank account proof', 'Cancelled cheque or 3-month bank statement', 'Cancelled cheque or bank statement'],
      ['Business registration proof', 'Not required (proprietorship)', 'Certificate of Incorporation or LLP agreement'],
      ['Director/partner PAN', 'Not applicable', 'All directors or designated partners'],
      ['Board resolution', 'Not required', 'Authorising a director to apply'],
      ['Passport photo', 'Owner photo', 'Authorised signatory photo'],
    ],
  },
}


// ─── 4. GST Monthly Filing ────────────────────────────────────────────────────

export const gstMonthlyFiling: ServicePageConfig = {
  slug: 'gst-monthly-50l',
  title: 'GST Monthly Filing',
  tagline: 'GSTR-1 by the 11th. GSTR-3B by the 20th. Every month.',
  seoTitle: 'GST Return Filing Service India 2025 | GSTR-1 & GSTR-3B | Ollvy',
  seoDescription: 'Monthly GST filing handled by a CA. GSTR-1 by the 11th, GSTR-3B by the 20th, ITC reconciled every cycle. Cancel anytime.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-monthly-50l',
  lastReviewed: 'April 2026',
  category: 'GST',

  relatedServiceSlugs: ['gst-registration', 'gst-cancellation', 'business-itr', 'tds-monthly-compliance'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'Monthly GST compliance means filing GSTR-1 (outward supplies, due 11th) and GSTR-3B (net tax payment, due 20th) every month. GSTR-1 reports every sales invoice. GSTR-3B calculates your tax liability, deducts eligible Input Tax Credit, and records your payment to the government.',
    whyYouNeedIt: 'All regular GST-registered taxpayers must file every month, including nil returns when there are no transactions. Consecutive missed filings trigger e-way bill suspension, then registration suspension, then suo-moto cancellation. Your customers cannot claim ITC on your invoices until you file.',
    whatHappensWithout: 'Late filing fee of Rs. 50 per day per return (Rs. 20 for nil returns). Interest at 18% per annum on unpaid tax. E-way bill generation blocked after two consecutive missed filings. Registration cancelled after 6 months of non-filing.',
  },

  workflow: [
    {
      step: 1,
      title: 'Share your GST credentials',
      timeframe: 'Day 0',
      description: 'Read-only access to your GST portal. CA reviews your filing history and is assigned to your account permanently.',
      milestone: 'CA assigned to your account',
    },
    {
      step: 2,
      title: 'Upload sales invoices and purchase data',
      timeframe: 'By 8th of each month',
      description: 'Sales invoices and purchase register. Tally, Zoho, or any accounting software export takes 2 minutes.',
      milestone: 'Data received for the month',
    },
    {
      step: 3,
      title: 'GSTR-1 filed by the 11th',
      timeframe: '9th-11th',
      description: 'CA files all outward supply invoices. Acknowledgement shared in your app.',
      milestone: 'GSTR-1 filed',
    },
    {
      step: 4,
      title: 'GSTR-3B filed by the 20th',
      timeframe: '18th-20th',
      description: 'CA prepares the summary return, verifies ITC claims against GSTR-2B, calculates net tax liability, and files. Challan generated.',
      milestone: 'GSTR-3B filed',
    },
    {
      step: 5,
      title: 'Monthly compliance report',
      timeframe: '21st-25th',
      description: 'What was filed, when, acknowledgement numbers, ITC claimed, tax paid.',
      milestone: 'Report delivered',
    },
  ],

  included: [
    {
      title: 'GSTR-1 - outward supply return',
      description: 'All B2B invoices, B2C sales above Rs. 2.5 lakh, and export invoices reported. Filed by the 11th.',
    },
    {
      title: 'GSTR-3B - net tax payment return',
      description: 'Output tax calculated, eligible ITC deducted, return filed, challan generated.',
    },
    {
      title: 'ITC reconciliation with GSTR-2B',
      description: 'ITC claimed is matched against GSTR-2B before filing. Mismatches flagged.',
      without: 'Claim ITC without verification, receive a demand notice later',
      withOllvy: 'ITC verified against GSTR-2B every cycle before filing',
    },
    {
      title: 'Monthly compliance report',
      description: 'Filed returns, acknowledgement numbers, ITC summary, and tax paid - delivered after every cycle.',
    },
  ],

  risks: [
    {
      title: 'Data must be shared by the 8th',
      description: 'Late fee accumulates from the 12th for GSTR-1 and 21st for GSTR-3B. Rs. 50/day per return on non-nil returns. We file the moment data is ready.',
    },
    {
      title: 'GSTR-1 and GSTR-3B figures must match',
      description: 'Discrepancies between the two returns are flagged automatically by GSTN. We file both from the same data set.',
    },
    {
      title: 'Vendor not filed = ITC blocked',
      description: 'If your vendor has not filed their GSTR-1, their invoices do not appear in your GSTR-2B. We check before claiming - you are not exposed to a mismatch notice.',
    },
  ],

  personas: [
    {
      title: 'Switching from another CA',
      description: 'Seamless takeover. We review your filing history before the first cycle.',
    },
    {
      title: 'Multiple GSTINs',
      description: 'Multiple states, multiple registrations. All handled under one retainer.',
    },
    {
      title: 'Previous CA stopped responding',
      description: 'We work to SLA every month. Acknowledgement numbers delivered same day as filing.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'What does the monthly retainer cover?',
      a: 'GSTR-1 by the 11th, GSTR-3B by the 20th, ITC reconciliation against GSTR-2B every cycle, and a monthly compliance report with filing acknowledgements.',
    },
    {
      category: 'General',
      q: 'Can I cancel anytime?',
      a: 'Yes. No minimum term. Cancel before the 1st of any month and you will not be charged for that cycle.',
    },
    {
      category: 'General',
      q: 'What is GSTR-2B and why does it matter?',
      a: 'GSTR-2B is an auto-drafted statement that shows the ITC available to you based on what your suppliers have filed. Claiming ITC that is not reflected in GSTR-2B invites a demand notice. We reconcile against GSTR-2B before every GSTR-3B filing.',
    },
    {
      category: 'Process',
      q: 'What data do I need to share each month?',
      a: 'Sales invoices and purchase register. If you use Tally, Zoho, or any accounting software, the export takes 2 minutes. We also handle nil returns when there are no transactions.',
    },
    {
      category: 'Process',
      q: 'What if I have no transactions in a month?',
      a: 'Nil GSTR-1 and GSTR-3B must still be filed. We handle nil returns as part of the retainer at no extra charge.',
    },
    {
      category: 'General',
      q: 'What is the penalty for missing GSTR-3B?',
      a: 'Rs. 50 per day (Rs. 25 CGST + Rs. 25 SGST) for non-nil returns, capped at Rs. 10,000. Plus 18% per annum interest on any unpaid tax from the due date. Nil return late fee is Rs. 20/day, capped at Rs. 500.',
    },
  ],

  govtFees: {
    caption: 'Government Late Fees - GST Monthly Filing (per missed return)',
    headers: ['Return', 'Late Fee (Non-Nil)', 'Late Fee (Nil Return)', 'Cap'],
    rows: [
      ['GSTR-1', 'Rs. 50/day (Rs. 25 CGST + Rs. 25 SGST)', 'Rs. 20/day (Rs. 10 + Rs. 10)', 'Rs. 10,000 per return (nil: Rs. 500)'],
      ['GSTR-3B', 'Rs. 50/day (Rs. 25 CGST + Rs. 25 SGST)', 'Rs. 20/day (Rs. 10 + Rs. 10)', 'Rs. 10,000 per return (nil: Rs. 500)'],
      ['Interest on unpaid tax', '18% per annum on outstanding amount', 'Not applicable for nil returns', 'Accrues daily - no cap'],
      ['Both returns missed (1 month)', 'Rs. 100/day combined (both returns)', 'Rs. 40/day combined', 'Rs. 20,000 combined cap (nil: Rs. 1,000)'],
    ],
  },

  documents: {
    caption: 'Data Required Each Month - GST Filing',
    headers: ['Data / Document', 'Required For', 'Format'],
    rows: [
      ['Sales invoices', 'GSTR-1', 'Excel, Tally export, or accounting software export'],
      ['Purchase invoices / purchase register', 'ITC reconciliation (GSTR-2B matching)', 'Excel or accounting software export'],
      ['GST portal credentials (read-only)', 'Filing', 'Shared once at onboarding; not required monthly'],
      ['Bank statement (for high-value B2C)', 'GSTR-1 (B2C consolidated)', 'For verifying B2C sales above Rs. 2.5 lakh'],
    ],
  },
}


// ─── 5. Business ITR Filing ───────────────────────────────────────────────────

export const businessItr: ServicePageConfig = {
  slug: 'business-itr',
  title: 'Business ITR Filing',
  tagline: 'ITR-6 for Pvt Ltd. ITR-5 for LLP. Filed correctly, on time.',
  seoTitle: 'Business ITR Filing India 2025 | Company & LLP Income Tax Return | Ollvy',
  seoDescription: 'Annual income tax return for Pvt Ltd (ITR-6) and LLP (ITR-5). Due October 31. Includes depreciation review, draft approval, and ITR-V same day.',
  canonicalUrl: 'https://www.ollvy.com/services/business-itr',
  lastReviewed: 'April 2026',
  category: 'Tax',

  relatedServiceSlugs: ['mca-annual-filing', 'tds-monthly-compliance', 'gst-monthly-50l'],
  relatedLearnSlugs: ['do-i-need-to-file-itr', 'which-itr-form-should-i-use'],

  explainer: {
    whatItIs: 'Business ITR is the annual income tax return filed by companies (ITR-6) and LLPs or partnerships (ITR-5) under Section 139 of the Income Tax Act, 1961. It reports income, expenses, depreciation, and tax computation for the financial year.',
    whyYouNeedIt: 'Mandatory for every company and LLP regardless of profit or loss. Filing a loss return preserves the right to carry it forward against future profits - missing the deadline loses that benefit permanently. Banks, visa offices, and government tender departments ask for 2-3 years of ITR.',
    whatHappensWithout: 'Interest at 1% per month on unpaid tax from the due date (Section 234A). Loss returns filed late cannot carry forward losses - that benefit is permanently gone. The department can reopen assessments up to 3 years back.',
  },

  workflow: [
    {
      step: 1,
      title: 'Upload your financials',
      timeframe: 'Day 0-1',
      description: 'P&L, Balance Sheet, trial balance, bank statements. CA assigned within 4 hours.',
      milestone: 'Documents received, CA assigned',
    },
    {
      step: 2,
      title: 'CA reviews books and prepares computation',
      timeframe: 'Day 1-4',
      description: 'CA reviews P&L, verifies depreciation schedule, checks director remuneration treatment, and prepares income computation.',
      milestone: 'Draft computation ready',
    },
    {
      step: 3,
      title: 'You review and approve the draft',
      timeframe: 'Day 4-7',
      description: 'Complete draft ITR shared in the app - income figures, deductions, tax computation. Nothing is filed without your explicit approval.',
      milestone: 'Draft approved',
    },
    {
      step: 4,
      title: 'Filed and acknowledgement delivered',
      timeframe: 'Day 7-10',
      description: 'CA files within 24 hours of your approval. ITR-V acknowledgement generated immediately and shared same day.',
      milestone: 'ITR-V acknowledgement delivered',
    },
  ],

  included: [
    {
      title: 'Depreciation review',
      description: 'CA reviews your asset schedule and depreciation rates. Incorrect rates are flagged before filing.',
    },
    {
      title: 'Director remuneration treatment',
      description: 'For Pvt Ltd, how director salary is treated versus dividends has tax implications. CA reviews compliance with Companies Act limits.',
    },
    {
      title: 'Full draft review before filing',
      description: 'You see the complete return before it is filed - income, deductions, tax computation. Nothing filed without your explicit approval.',
    },
    {
      title: 'ITR-V stored permanently',
      description: 'Acknowledgement uploaded to your Ollvy account immediately. Available for loan applications, visa, or audits.',
    },
  ],

  risks: [
    {
      title: 'Losses cannot be carried forward if filed late',
      description: 'A company or LLP that made a loss and files after October 31 loses the right to offset that loss against future profits. That tax benefit cannot be recovered.',
    },
    {
      title: 'Belated filing interest',
      description: 'Section 234A: if you file after the due date with outstanding tax, 1% monthly interest accrues from the original deadline.',
    },
    {
      title: 'Audit must be complete first',
      description: 'Audit is mandatory for all Pvt Ltd companies (any turnover) and LLPs above Rs. 40 lakh turnover or Rs. 25 lakh contribution. Audited financials must be ready before ITR can be filed.',
    },
  ],

  personas: [
    {
      title: 'First year after incorporation',
      description: 'First ITR. We walk through every document required.',
    },
    {
      title: 'Company made a loss',
      description: 'Loss return filed to preserve carry-forward rights. Missing the deadline loses the benefit permanently.',
    },
    {
      title: 'Changed CA mid-year',
      description: 'Previous CA\'s books need reconciliation. We clean up and file correctly.',
    },
    {
      title: 'Filing late',
      description: 'We calculate interest liability upfront so there are no surprises, then file immediately to stop it growing.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'When is Business ITR due?',
      a: 'October 31 for all Pvt Ltd companies (statutory audit is mandatory for all companies regardless of turnover, so the extended deadline always applies). For LLPs not requiring tax audit: July 31. For LLPs requiring tax audit (turnover above Rs. 1 crore or contribution above Rs. 25 lakh): October 31.',
    },
    {
      category: 'General',
      q: 'What is the difference between ITR-5 and ITR-6?',
      a: 'ITR-6 is for all companies - Pvt Ltd, Public Ltd, and OPC. ITR-5 is for LLPs, partnership firms, AOPs, and BOIs. The form is determined by your entity type, not by turnover or income.',
    },
    {
      category: 'General',
      q: 'What is the penalty for not filing Business ITR?',
      a: 'Rs. 10,000 late filing fee under Section 234F. Plus 1% per month interest under Section 234A on any unpaid tax from the original due date. And the permanent loss of any loss carry-forward rights.',
    },
    {
      category: 'General',
      q: 'Must I file even if the company made no profit?',
      a: 'Yes. Every company and LLP must file ITR every year regardless of profit, loss, or activity level. Filing a loss return is especially important - it preserves your right to offset that loss against future profits.',
    },
    {
      category: 'Process',
      q: 'What documents do I need?',
      a: 'Audited P&L and Balance Sheet, trial balance, bank statements (full year), Form 26AS, depreciation schedule, and director/partner remuneration details. For LLPs not requiring audit: management accounts are sufficient.',
    },
    {
      category: 'Process',
      q: 'Do I need a statutory audit before filing?',
      a: 'Mandatory for all Pvt Ltd companies regardless of turnover. For LLPs: mandatory above Rs. 40 lakh turnover or Rs. 25 lakh contribution. Tax audit (separate from statutory audit) is mandatory for businesses with turnover above Rs. 1 crore.',
    },
    {
      category: 'General',
      q: 'What if I missed the October 31 deadline?',
      a: 'You can file a belated return by December 31 of the assessment year with the late fee and interest. After December 31, filing requires special circumstances or departmental notice. The longer you wait, the more interest accrues.',
    },
  ],

  govtFees: {
    caption: 'Government Penalties - Late Business ITR Filing',
    headers: ['Penalty Type', 'Amount', 'Provision'],
    rows: [
      ['Late filing fee', 'Rs. 10,000 (companies and audit cases)', 'Section 234F, Income Tax Act 1961'],
      ['Interest on unpaid tax', '1% per month from due date until payment', 'Section 234A'],
      ['Interest on advance tax shortfall', '1% per month on shortfall amount', 'Section 234B (if <90% of liability paid as advance tax)'],
      ['Loss carry-forward forfeited', 'Permanent loss of tax benefit', 'Section 139(3) - loss return not filed by due date'],
    ],
  },

  documents: {
    caption: 'Documents Required - Business ITR Filing',
    headers: ['Document', 'Company (ITR-6)', 'LLP (ITR-5)'],
    rows: [
      ['Audited Balance Sheet', 'Mandatory', 'Mandatory if audit required; management accounts otherwise'],
      ['Audited P&L Statement', 'Mandatory', 'Mandatory if audit required'],
      ['Statutory Auditor Report', 'Mandatory', 'If audit required'],
      ['Tax Audit Report (Form 3CA/3CB + 3CD)', 'If turnover > Rs. 1 crore', 'If turnover > Rs. 1 crore'],
      ['Trial balance', 'Required', 'Required'],
      ['Bank statements (full year)', 'Required', 'Required'],
      ['Form 26AS', 'Required', 'Required'],
      ['Depreciation schedule', 'Required', 'Required'],
      ['Director/partner remuneration details', 'Required', 'Required - Section 40(b) calculation'],
      ['Previous year ITR and computation', 'For reference', 'For reference'],
    ],
  },
}
```

### 5C. `lib/services/data/services-6-9.ts` — Trademark, MCA Annual, TDS, MSME

```typescript
import type { ServicePageConfig } from '../types'

// ─── 6. Trademark Registration ────────────────────────────────────────────────

export const trademarkRegistration: ServicePageConfig = {
  slug: 'trademark-registration',
  title: 'Trademark Registration',
  tagline: '10-year brand protection. Filed in 7 days.',
  seoTitle: 'Trademark Registration in India 2025 | Rs. 4,500 Govt Fee | Ollvy',
  seoDescription: 'Trademark application filed in 7 days. Search, class guidance, filing, and examiner objection response included. Govt fee Rs. 4,500 per class (small entities).',
  canonicalUrl: 'https://www.ollvy.com/services/trademark-registration',
  lastReviewed: 'April 2026',
  category: 'Trademark',

  relatedServiceSlugs: ['pvt-ltd-incorporation', 'gst-registration'],
  relatedLearnSlugs: ['do-i-need-trademark-registration'],

  explainer: {
    whatItIs: 'Trademark registration gives you exclusive rights to use your brand name, logo, or tagline for a specific category of goods or services across India for 10 years (renewable indefinitely). Registered under the Trade Marks Act, 1999, it gives you the right to use ® and take legal action against infringers.',
    whyYouNeedIt: 'Without registration, you have limited legal recourse against anyone using your brand name. In India, trademark rights go to whoever registers first - not whoever used the name first. E-commerce platforms (Amazon Brand Registry, Flipkart) require trademark registration for brand protection.',
    whatHappensWithout: 'Proving "passing off" without a registered trademark requires demonstrating prior reputation in court - expensive and uncertain. Anyone can register a similar name in your category. No access to Amazon Brand Registry or Flipkart brand protection features.',
  },

  workflow: [
    {
      step: 1,
      title: 'Tell us your brand name and category',
      timeframe: 'Day 0',
      description: 'Trademark attorney assigned within 4 hours. You provide the mark, the classes you want to protect, and your business details. Preliminary search started immediately.',
      milestone: 'Attorney assigned, search started',
    },
    {
      step: 2,
      title: 'Trademark search report delivered',
      timeframe: 'Day 1-2',
      description: 'Attorney searches the Trademark Registry for identical and similar marks in your classes. If your mark is clear, we proceed. If conflicts exist, we suggest modifications.',
      milestone: 'Search report delivered',
    },
    {
      step: 3,
      title: 'Application filed with Trademark Registry',
      timeframe: 'Day 3-7',
      description: 'Attorney drafts the application, selects the correct classes, and files. You receive your application number and filing receipt. Your rights are protected from this filing date - not from the certificate date.',
      milestone: 'Application filed, receipt received',
    },
    {
      step: 4,
      title: 'Examination and publication',
      timeframe: '6-12 months (government processing)',
      description: 'The Trademark Registry examines your application. If objections are raised, your attorney responds - included in scope. Once cleared, the mark is published in the Trademark Journal for 4 months.',
      milestone: 'Under examination',
    },
    {
      step: 5,
      title: 'Registration certificate issued',
      timeframe: '12-18 months total',
      description: 'Certificate issued. Protection runs 10 years from the filing date, renewable indefinitely. Certificate stored in your Ollvy account.',
      milestone: 'Trademark registered',
    },
  ],

  included: [
    {
      title: 'Trademark search before filing',
      description: 'Attorney searches the Registry before spending your government fee. If your exact mark is already registered in your class, we tell you upfront.',
      without: 'File without searching, wait months, get rejected',
      withOllvy: 'Search first, modify if needed, then file',
    },
    {
      title: 'Class selection guidance',
      description: 'Trademarks are registered per class (45 classes). Attorney recommends only the classes you actually need.',
    },
    {
      title: 'Examiner objection response included',
      description: 'If the Trademark Examiner raises objections, your attorney responds. Included in the service - not a separate charge.',
    },
    {
      title: 'Renewal reminder',
      description: 'Trademark expires 10 years from filing date. Renewal reminder added to your compliance calendar 6 months before expiry.',
    },
  ],

  risks: [
    {
      title: 'Similar mark already registered',
      description: 'If a similar mark is registered in your class, the Examiner will object. Our search catches most conflicts, but pending applications not yet published cannot be seen. If rejected, we help you appeal or modify.',
    },
    {
      title: 'Government processing takes 12-18 months',
      description: 'The 7-day timeline is for filing. Examination, publication, and certificate issuance are government-side. We track and update you but cannot speed up the Registry.',
    },
    {
      title: 'Opposition during publication',
      description: 'After examination, your mark is published for 4 months. Anyone can oppose. Opposition response is a separate service - it occurs in under 5% of cases.',
    },
  ],

  personas: [
    {
      title: 'Selling on Amazon or Flipkart',
      description: 'Both platforms require trademark registration for Brand Registry. Without it, your listings are open to unauthorised sellers and piggybacking.',
    },
    {
      title: 'Raising investor funding',
      description: 'IP due diligence will flag an unregistered brand. Register before you start your fundraising process.',
    },
    {
      title: 'First trademark, no prior registrations',
      description: 'Never registered before. We explain classes, search, and the full process.',
    },
    {
      title: 'Logo and word mark both needed',
      description: 'Two separate applications. We handle both. Broader protection.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'What is the government fee for trademark registration in India?',
      a: 'Rs. 4,500 per class for individuals, startups, and small entities. Rs. 9,000 per class for companies and LLPs. These are one-time fees for a 10-year term, not annual fees.',
    },
    {
      category: 'General',
      q: 'How long does trademark protection last?',
      a: '10 years from the filing date, renewable indefinitely in 10-year increments. Renewal costs Rs. 9,000 per class (small entities) or Rs. 10,000 (others).',
    },
    {
      category: 'General',
      q: 'Can I use the ® symbol after filing?',
      a: 'No. The ® symbol can only be used after registration is granted. Use TM (for goods) or SM (for services) to indicate your claim while the application is pending. Using ® before registration is an offence.',
    },
    {
      category: 'General',
      q: 'What is a trademark class and which one do I need?',
      a: 'Goods and services are divided into 45 categories called classes under the Nice Classification. You register per class. Class 42 is software and tech services; Class 25 is clothing; Class 35 is retail and marketing. Using the wrong class leaves you unprotected in the category you actually operate in. Most businesses need 1-3 classes.',
    },
    {
      category: 'General',
      q: 'What if someone is already using my brand name without registering it?',
      a: 'Prior unregistered use gives you some rights under "passing off" law, but proving it requires demonstrating established reputation in court - expensive and slow. If neither party has registered, filing now gives you formal priority over any future registration by that person.',
    },
    {
      category: 'Process',
      q: 'Why does full registration take 12-18 months if filing takes 7 days?',
      a: 'The 7-day timeline is for filing the application. Examination by the Trademark Registry takes 6-12 months. Then 4 months of public opposition window. Then certificate issuance. All government-side. Your rights are protected from the filing date - not the certificate date.',
    },
    {
      category: 'Documents',
      q: 'What documents do I need for trademark registration?',
      a: 'PAN card, Aadhaar or address proof, and the logo file if registering a logo (JPG, minimum 8cm x 8cm, black on white background). For companies: Certificate of Incorporation and board resolution. For small entity fee: MSME certificate or startup recognition certificate.',
    },
    {
      category: 'General',
      q: 'Can I trademark a common word like "Fresh" or "Quick"?',
      a: 'Descriptive or generic words are difficult to register on their own. A distinctive combination, stylised logo, or word used in an unexpected context (Apple for computers) can be protected. Our attorney assesses registrability before you spend the government fee.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - Trademark Registration in India (2025)',
    headers: ['Applicant Type', 'New Application (per class)', 'Renewal (per class)', 'Notes'],
    rows: [
      ['Individual / Startup / Small Entity', 'Rs. 4,500', 'Rs. 9,000', 'As defined under Trademark Rules 2017; 10% reduction for e-filing'],
      ['Company, LLP, or other entity', 'Rs. 9,000', 'Rs. 10,000', 'Per class; 10% reduction for e-filing'],
      ['Expedited examination (optional)', 'Rs. 20,000 (small) / Rs. 40,000 (others)', 'N/A', 'Faster review, not faster registration'],
    ],
  },

  documents: {
    caption: 'Documents Required - Trademark Registration',
    headers: ['Document', 'Required For', 'Notes'],
    rows: [
      ['PAN card', 'All applicants', 'Identity and address verification'],
      ['Aadhaar or address proof', 'Individual applicants', 'Any government-issued address proof'],
      ['Logo file', 'Logo trademark applications', 'JPG format; minimum 8cm x 8cm; black mark on white background'],
      ['Certificate of Incorporation', 'Company or LLP applicants', 'Proof of entity registration'],
      ['Board resolution or POA', 'Company or LLP applicants', 'Authorising the filing'],
      ['MSME / Startup certificate', 'For reduced govt fee', 'Udyam certificate or DPIIT recognition certificate'],
      ['User affidavit', 'If claiming prior use date', 'States date of first use in commerce in India'],
    ],
  },
}


// ─── 7. MCA Annual Filing ─────────────────────────────────────────────────────

export const mcaAnnualFiling: ServicePageConfig = {
  slug: 'mca-annual-filing',
  title: 'MCA Annual Filing',
  tagline: 'AOC-4 and MGT-7 filed every year. Penalty stopped the moment we file.',
  seoTitle: 'MCA Annual Filing India 2025 | AOC-4 and MGT-7 for Pvt Ltd | Ollvy',
  seoDescription: 'MCA annual ROC compliance for Private Limited companies. AOC-4 within 30 days of AGM, MGT-7 within 60 days. Rs. 100/day penalty stopped on filing.',
  canonicalUrl: 'https://www.ollvy.com/services/mca-annual-filing',
  lastReviewed: 'April 2026',
  category: 'Compliance',

  relatedServiceSlugs: ['business-itr', 'tds-monthly-compliance', 'pvt-ltd-incorporation'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp'],

  explainer: {
    whatItIs: 'MCA Annual Filing for a Private Limited Company consists of two mandatory ROC forms: AOC-4 (audited financial statements) and MGT-7 (annual return with shareholding and director details). Both are filed with the Registrar of Companies every year.',
    whyYouNeedIt: 'Mandatory for every Pvt Ltd regardless of whether the company was active. AOC-4 is due within 30 days of the AGM. MGT-7 within 60 days. The AGM must be held by September 30 for companies with a March financial year-end. Non-filing shows as Default on MCA - visible to anyone doing due diligence.',
    whatHappensWithout: 'Rs. 100 per day per form in additional MCA fee, with no ceiling. Both forms outstanding means Rs. 200/day. Directors can be disqualified under Section 164(2) after three years of default. Company can be struck off as defunct after 2 consecutive years of non-filing.',
  },

  workflow: [
    {
      step: 1,
      title: 'Share company details',
      timeframe: 'Day 0',
      description: 'Company CIN, financial year, AGM date, and status of audited financials. CS assigned.',
      milestone: 'CS assigned',
    },
    {
      step: 2,
      title: 'Upload financial statements and documents',
      timeframe: 'Day 0-2',
      description: 'Audited Balance Sheet, P&L, director report, auditor report, and shareholder list. CS reviews before drafting forms.',
      milestone: 'Documents reviewed',
    },
    {
      step: 3,
      title: 'Forms drafted and sent for your approval',
      timeframe: 'Day 2-4',
      description: 'AOC-4 and MGT-7 drafted. You review and approve in the app.',
      milestone: 'Draft forms approved',
    },
    {
      step: 4,
      title: 'Filed on MCA21 - SRN generated',
      timeframe: 'Day 5-7',
      description: 'Both forms filed. Service Request Numbers shared immediately as proof of filing.',
      milestone: 'AOC-4 and MGT-7 filed',
    },
  ],

  included: [
    {
      title: 'Both forms filed - AOC-4 and MGT-7',
      description: 'AOC-4 for financial statements, MGT-7 for annual return. Both included in scope.',
    },
    {
      title: 'Deadline calculation based on your AGM date',
      description: 'AOC-4 due 30 days after AGM. MGT-7 due 60 days after AGM. We track both from the AGM date you provide.',
    },
    {
      title: 'Penalty calculation if filing late',
      description: 'If filing after the deadline, we calculate the exact additional MCA fee upfront before filing. No surprises.',
    },
    {
      title: 'SRN shared immediately',
      description: 'Service Request Number is your proof of filing. Both SRNs shared the day forms are submitted.',
    },
  ],

  risks: [
    {
      title: 'Audit must be complete first',
      description: 'AOC-4 requires signed, audited financial statements. We cannot file until the audit is done. Plan your audit timeline to allow filing before the MCA deadline.',
    },
    {
      title: 'Penalty accrues daily from the deadline',
      description: 'Additional MCA fee of Rs. 100 per day per form from the due date - Rs. 200/day for both forms combined. No ceiling. File as soon as audited financials are ready.',
    },
    {
      title: 'AGM must be held by September 30',
      description: 'Companies with a March year-end must hold their AGM by September 30. If delayed, MCA filing deadlines shift - we calculate new deadlines from your actual AGM date.',
    },
  ],

  personas: [
    {
      title: 'Running past the deadline',
      description: 'Already in default. We calculate the exact additional fee and file immediately to stop it growing.',
    },
    {
      title: 'Director changes during the year',
      description: 'Appointments and resignations reflected correctly in MGT-7.',
    },
    {
      title: 'Share transfer happened',
      description: 'Updated shareholding pattern captured accurately in MGT-7.',
    },
    {
      title: 'First year after incorporation',
      description: 'First MCA filing. We explain every field and what it means for your company records.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'When is MCA annual filing due for Pvt Ltd?',
      a: 'AOC-4: within 30 days of AGM (typically October 30 for companies with March year-end and AGM on September 30). MGT-7: within 60 days of AGM (typically November 29). AGM must be held by September 30.',
    },
    {
      category: 'General',
      q: 'What is the penalty for not filing AOC-4 and MGT-7?',
      a: 'Rs. 100 per day per form as additional MCA fee from the due date. Both forms outstanding means Rs. 200/day. This has no ceiling and continues until filed. After 3 years of consistent default, directors can be disqualified under Section 164(2).',
    },
    {
      category: 'General',
      q: 'Is MCA annual filing different from Business ITR?',
      a: 'Yes. MCA annual filing (AOC-4 + MGT-7) is filed with the Ministry of Corporate Affairs (company registry). Business ITR (ITR-6) is filed with the Income Tax department. Both are mandatory with separate deadlines and separate penalties.',
    },
    {
      category: 'General',
      q: 'What happens if a company does not file for 2 years?',
      a: 'The Registrar of Companies can strike off the company as defunct under Section 248 of the Companies Act. Restoring a struck-off company is possible but involves a lengthy NCLT process. Every director on such a company is also disqualified from directorship for 5 years under Section 164(2).',
    },
    {
      category: 'Process',
      q: 'Can I file if the statutory audit is not complete?',
      a: 'No. AOC-4 requires signed, audited financials. Plan your audit timeline carefully - the auditor must sign off before the MCA filing deadline.',
    },
    {
      category: 'Documents',
      q: 'What documents are needed for MCA annual filing?',
      a: 'Audited Balance Sheet, P&L, notes to accounts, directors report, auditor report, AGM date, and the updated shareholder register with current holdings.',
    },
    {
      category: 'General',
      q: 'Does an LLP need to file AOC-4 and MGT-7?',
      a: 'No. LLPs file Form 8 (Statement of Account and Solvency, due Oct 30) and Form 11 (Annual Return, due May 30). These are different forms for LLPs - not AOC-4 and MGT-7.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - MCA Annual Filing (2025)',
    headers: ['Item', 'Fee', 'Notes'],
    rows: [
      ['Normal AOC-4 filing fee', 'Rs. 200-600', 'Based on company paid-up capital; paid at MCA portal'],
      ['Normal MGT-7 filing fee', 'Rs. 200-600', 'Based on company paid-up capital; paid at MCA portal'],
      ['Additional fee (late filing)', '2x to 12x of normal fee', 'Up to 30 days: 2x | 30-60 days: 4x | 60-90 days: 6x | 90-180 days: 10x | above 180 days: 12x'],
      ['Penalty under Section 137(3) - AOC-4', 'Rs. 10,000 + Rs. 100/day', 'If MCA initiates formal action; separate from additional filing fee'],
    ],
  },

  documents: {
    caption: 'Documents Required - MCA Annual Filing',
    headers: ['Document', 'For AOC-4', 'For MGT-7'],
    rows: [
      ['Audited Balance Sheet', 'Yes - mandatory', 'No'],
      ['Audited P&L Statement', 'Yes - mandatory', 'No'],
      ['Directors Report', 'Yes', 'No'],
      ['Auditors Report', 'Yes', 'No'],
      ['AGM date and notice', 'Yes - drives deadline', 'Yes - drives deadline'],
      ['Shareholder register (current)', 'No', 'Yes - all shareholders with holdings'],
      ['Director details (DIN, appointment dates)', 'No', 'Yes'],
      ['Director changes during year', 'No', 'Yes - appointments and resignations with dates'],
      ['Share transfers during year', 'No', 'Yes - transferor, transferee, date, consideration'],
    ],
  },
}


// ─── 8. TDS Monthly Compliance ────────────────────────────────────────────────

export const tdsMonthlyCompliance: ServicePageConfig = {
  slug: 'tds-monthly-compliance',
  title: 'TDS Monthly Compliance',
  tagline: 'Deduct. Deposit by the 7th. File the return. Every month.',
  seoTitle: 'TDS Filing Service India 2025 | Monthly TDS Compliance | Ollvy',
  seoDescription: 'Monthly TDS calculation, challan preparation, and quarterly return filing. Deposit by the 7th. Covers salary, contractor, rent, professional fees.',
  canonicalUrl: 'https://www.ollvy.com/services/tds-monthly-compliance',
  lastReviewed: 'April 2026',
  category: 'Tax',

  relatedServiceSlugs: ['business-itr', 'gst-monthly-50l', 'mca-annual-filing'],
  relatedLearnSlugs: ['do-i-need-to-file-itr'],

  explainer: {
    whatItIs: 'TDS compliance means withholding tax from payments you make to vendors, contractors, employees, and landlords, depositing it with the government by the 7th of the following month, and filing quarterly returns (Form 24Q for salary, Form 26Q for non-salary).',
    whyYouNeedIt: 'Any business making payments above TDS thresholds for rent, professional fees, contractor payments, or salary must deduct and deposit TDS. Failure to deduct means the entire expense is disallowed under Section 40(a)(ia) - you pay income tax on money you already spent.',
    whatHappensWithout: 'Interest at 1.5% per month on late deposit (1% per month if not deducted at all). Rs. 200/day for late quarterly return filing. The expense on which TDS was not deducted is disallowed under Section 40(a)(ia) - taxed as if it were profit.',
  },

  workflow: [
    {
      step: 1,
      title: 'Share your payment register',
      timeframe: 'Day 1-5 of month',
      description: 'Salary, vendor, rent, and contractor payments for the month. CA reviews applicable TDS rates for each payment category.',
      milestone: 'Data received',
    },
    {
      step: 2,
      title: 'TDS calculated and challans prepared',
      timeframe: 'Day 5-6',
      description: 'CA calculates TDS for each payment category. Challans prepared with correct BSR codes and assessment year.',
      milestone: 'Challans ready',
    },
    {
      step: 3,
      title: 'You pay the challans',
      timeframe: 'Day 6-7',
      description: 'You transfer through net banking. CIN (Challan Identification Number) uploaded to your account as proof.',
      milestone: 'TDS deposited by 7th',
    },
    {
      step: 4,
      title: 'Quarterly return filed',
      timeframe: 'Quarter end',
      description: 'CA files Form 24Q (salary TDS) and Form 26Q (non-salary TDS). Form 16 and 16A generation enabled after filing.',
      milestone: 'TDS return filed',
    },
  ],

  included: [
    {
      title: 'TDS calculation for all payment types',
      description: 'Salary (192), contractor payments (194C), professional fees (194J), rent (194I/194IB), interest (194A). Correct rates applied to each.',
    },
    {
      title: 'Challan preparation with correct codes',
      description: 'Challan requires correct BSR code, assessment year, and minor head. Errors cause mismatches in deductees\' Form 26AS. We prepare - you pay.',
      without: 'Wrong BSR code or assessment year - causes 26AS mismatch and notice',
      withOllvy: 'Correct challan prepared every time',
    },
    {
      title: 'Quarterly return filing - 24Q and 26Q',
      description: 'Form 24Q for salary TDS, Form 26Q for all other deductions. Returns reconciled with challans before filing.',
    },
    {
      title: 'Form 16 and 16A generation',
      description: 'Once returns are filed, Form 16 (salary) and Form 16A (non-salary) can be downloaded from TRACES for your deductees.',
    },
  ],

  risks: [
    {
      title: 'TDS must be deposited by the 7th',
      description: '1.5% per month interest from the date of deduction if deposited late. For March TDS, the deadline is April 30.',
    },
    {
      title: 'Wrong TDS rate',
      description: 'Under-deducting makes you liable for the shortfall plus interest. We apply current applicable rates for each section.',
    },
    {
      title: 'Missing PAN of deductees',
      description: 'TDS at the higher rate of 20% applies if the deductee\'s PAN is not provided. We flag missing PANs during data review.',
    },
  ],

  personas: [
    {
      title: 'Paying employees',
      description: 'Form 24Q salary TDS handled, Form 16 generated every quarter.',
    },
    {
      title: 'Paying contractors or consultants',
      description: 'Form 26Q for 194C and 194J payments. Most commonly missed by small businesses.',
    },
    {
      title: 'Multiple payment types',
      description: 'Rent, salary, contractors, professional fees - all categories covered under one retainer.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'Who needs to deduct TDS?',
      a: 'Any business or individual making payments above prescribed thresholds: salary, rent above Rs. 2.4 lakh/year (194I) or Rs. 50,000/month (194IB for individuals), contractor payments above Rs. 30,000/contract or Rs. 1 lakh/year (194C), professional fees above Rs. 30,000/year (194J).',
    },
    {
      category: 'General',
      q: 'What happens if I do not deduct TDS?',
      a: 'The expense is disallowed under Section 40(a)(ia) - you pay income tax on it as if it were profit. Plus 1% per month interest on the amount that should have been deducted. And Rs. 200/day penalty for late TDS return filing.',
    },
    {
      category: 'General',
      q: 'When must TDS be deposited?',
      a: 'By the 7th of the following month for most payments. For March, the deadline is April 30. Late deposit attracts 1.5% per month interest under Section 201(1A).',
    },
    {
      category: 'General',
      q: 'When are TDS returns due?',
      a: 'Q1 (April-June): July 31. Q2 (July-September): October 31. Q3 (October-December): January 31. Q4 (January-March): May 31.',
    },
    {
      category: 'General',
      q: 'What is Form 16 and who needs it?',
      a: 'Form 16 is the TDS certificate issued by employers to employees after the Q4 TDS return is filed. It shows salary paid and TDS deducted for the year. Employees need it to file their personal ITR. We generate Form 16 for all your employees after the Q4 return is filed.',
    },
    {
      category: 'General',
      q: 'What is Form 16A?',
      a: 'Form 16A is the TDS certificate for non-salary payments - contractor fees, professional fees, rent, interest. Issued by you to your vendors after each quarter\'s TDS return is filed. Your vendors use it to claim TDS credit in their own tax returns.',
    },
  ],

  govtFees: {
    caption: 'TDS Rates and Deadlines Reference (FY 2025-26)',
    headers: ['Payment Type', 'Section', 'Threshold', 'TDS Rate'],
    rows: [
      ['Salary', '192', 'Above basic exemption limit', 'As per income tax slab rate'],
      ['Contractor (individual)', '194C', 'Rs. 30,000/payment or Rs. 1 lakh/year', '1%'],
      ['Contractor (company)', '194C', 'Rs. 30,000/payment or Rs. 1 lakh/year', '2%'],
      ['Professional/technical fees', '194J', 'Rs. 30,000/year', '10%'],
      ['Rent - company paying (land/building)', '194I', 'Rs. 2.4 lakh/year', '10%'],
      ['Rent - individual paying (land/building)', '194IB', 'Rs. 50,000/month', '5%'],
      ['Interest from banks/NBFCs', '194A', 'Rs. 40,000/year (Rs. 50,000 for senior citizens)', '10%'],
      ['Commission or brokerage', '194H', 'Rs. 15,000/year', '5%'],
      ['Penalty for no PAN (all sections)', 'Section 206AA', 'Any payment', '20% or applicable rate, whichever is higher'],
    ],
  },

  documents: {
    caption: 'Data Required Each Month - TDS Compliance',
    headers: ['Data', 'Required For', 'Notes'],
    rows: [
      ['Salary register / payroll', 'Form 24Q and Section 192 TDS', 'Gross salary, PF deductions, and net pay per employee'],
      ['Contractor invoice list', 'Form 26Q and Section 194C', 'Name, PAN, amount paid, nature of work'],
      ['Professional fee payments', 'Form 26Q and Section 194J', 'Name, PAN, amount paid'],
      ['Rent payments', 'Form 26Q and Section 194I/194IB', 'Landlord name, PAN, monthly rent amount'],
      ['Interest payments (if any)', 'Form 26Q and Section 194A', 'Payee name, PAN, interest amount'],
      ['PAN of all deductees', 'All sections', 'Missing PAN triggers 20% TDS rate'],
    ],
  },
}


// ─── 9. MSME / Udyam Registration ────────────────────────────────────────────

export const msmeRegistration: ServicePageConfig = {
  slug: 'msme-registration',
  title: 'MSME / Udyam Registration',
  tagline: 'Free government recognition. Priority lending. Payment protection.',
  seoTitle: 'Udyam MSME Registration Online India 2025 | Free Govt Certificate | Ollvy',
  seoDescription: 'Udyam Registration certificate in 2 working days. Unlocks collateral-free loans up to Rs. 10 crore, 45-day payment protection, and GeM tender access.',
  canonicalUrl: 'https://www.ollvy.com/services/msme-registration',
  lastReviewed: 'April 2026',
  category: 'Registration',

  relatedServiceSlugs: ['pvt-ltd-incorporation', 'gst-registration'],
  relatedLearnSlugs: ['is-msme-registration-worth-it', 'should-i-get-dpiit-startup-recognition'],

  explainer: {
    whatItIs: 'Udyam Registration is official government recognition of your business as a Micro, Small, or Medium Enterprise under the MSME Development Act, 2006. Done on the Udyam portal, it is linked to your PAN and Aadhaar and is completely free. You receive a Udyam Registration Number (URN) that unlocks MSME benefits.',
    whyYouNeedIt: 'Access to any MSME benefit requires Udyam Registration. Banks are mandated to give priority sector lending to registered MSMEs. Buyers above a certain size must pay you within 45 days - you can enforce this through MSME Samadhaan. Government procurement on GeM has MSME-exclusive categories.',
    whatHappensWithout: 'Priority sector bank lending with lower interest rates is unavailable. Large buyers can delay payment indefinitely without legal consequence. No access to the 25% government procurement reservation for MSMEs. State subsidies requiring MSME status are unavailable.',
  },

  workflow: [
    {
      step: 1,
      title: 'Share Aadhaar and PAN',
      timeframe: 'Day 0',
      description: 'Owner Aadhaar for OTP verification, business PAN. GSTIN if you have one. Classification confirmed based on your investment and turnover.',
      milestone: 'Details received',
    },
    {
      step: 2,
      title: 'Application filed on Udyam portal',
      timeframe: 'Day 1',
      description: 'Filed on the official government portal with your investment and turnover details. GST linked automatically.',
      milestone: 'Application submitted',
    },
    {
      step: 3,
      title: 'Udyam certificate issued',
      timeframe: 'Day 1-2',
      description: 'Certificate with Unique Registration Number generated. Classification confirmed: Micro, Small, or Medium.',
      milestone: 'MSME registered',
    },
  ],

  included: [
    {
      title: 'Udyam certificate with URN',
      description: 'Official certificate recognised by all banks, government departments, and the GeM marketplace.',
    },
    {
      title: 'Classification confirmed',
      description: 'Micro, Small, or Medium status confirmed based on your investment and turnover. Classification determines which schemes and benefits apply.',
    },
    {
      title: 'GSTIN linked automatically',
      description: 'Your GST registration is linked to your Udyam registration during the application.',
    },
  ],

  risks: [
    {
      title: 'Self-declaration accuracy',
      description: 'Investment and turnover figures are self-declared. Keep supporting records (ITR, asset register) in case of verification.',
    },
    {
      title: 'Update when classification changes',
      description: 'Udyam registration does not expire, but if your turnover or investment moves you to a different category, update the registration on the Udyam portal.',
    },
  ],

  personas: [
    {
      title: 'Applying for a bank loan',
      description: 'Banks require Udyam certificate for priority sector classification and CGTMSE collateral-free loans.',
    },
    {
      title: 'GeM seller',
      description: 'Government e-marketplace requires Udyam registration for MSME seller benefits and exclusive tender categories.',
    },
    {
      title: 'Supplying to large corporates',
      description: 'Udyam registration lets you invoke the 45-day payment protection under MSME Samadhaan if large buyers delay payment.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'What are the MSME thresholds as of April 2025?',
      a: 'Micro: investment up to Rs. 2.5 crore AND turnover up to Rs. 10 crore. Small: investment up to Rs. 25 crore AND turnover up to Rs. 100 crore. Medium: investment up to Rs. 125 crore AND turnover up to Rs. 500 crore. Both criteria apply together - crossing either moves you to the next category. Source: Ministry of MSME Notification S.O. 1364(E), March 21, 2025.',
    },
    {
      category: 'General',
      q: 'Is Udyam registration free?',
      a: 'Registration on the government portal is completely free. The Ollvy fee covers the filing assistance and certificate delivery.',
    },
    {
      category: 'General',
      q: 'What is CGTMSE and how does it help?',
      a: 'CGTMSE (Credit Guarantee Fund Trust for Micro and Small Enterprises) allows registered MSMEs to get loans without pledging assets as collateral. The credit guarantee cover was increased to Rs. 10 crore for micro and small enterprises in Union Budget 2025.',
    },
    {
      category: 'General',
      q: 'What is the 45-day payment rule?',
      a: 'Under Section 15 of the MSMED Act, buyers must pay MSME suppliers within 45 days of accepting goods or services (15 days if no written agreement). Delay beyond 45 days triggers compound interest at 3x the RBI bank rate automatically. You can file a complaint through the MSME Samadhaan portal - a Facilitation Council must resolve it within 90 days.',
    },
    {
      category: 'General',
      q: 'Does Udyam registration expire?',
      a: 'No expiry. But update it if your investment or turnover changes your classification. The portal syncs with your ITR data annually and may auto-update your classification.',
    },
    {
      category: 'General',
      q: 'Can a Pvt Ltd company register as MSME?',
      a: 'Yes. Any business structure - sole proprietorship, partnership, LLP, or Pvt Ltd company - can register under Udyam as long as it meets the investment and turnover criteria.',
    },
    {
      category: 'General',
      q: 'I have an old Udyog Aadhar. Is it still valid?',
      a: 'No. Udyog Aadhar registrations expired on December 31, 2021. Re-register on the Udyam portal at udyamregistration.gov.in. Old certificates are not accepted for scheme benefits.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - Udyam Registration',
    headers: ['Item', 'Fee', 'Notes'],
    rows: [
      ['Udyam Registration', 'Nil', 'Government portal fee is zero - completely free'],
      ['Update of registration', 'Nil', 'Classification updates are also free'],
    ],
  },

  documents: {
    caption: 'Documents Required - Udyam MSME Registration',
    headers: ['Document', 'Required', 'Notes'],
    rows: [
      ['Aadhaar card (owner/director)', 'Mandatory', 'OTP sent to Aadhaar-linked mobile during registration'],
      ['Business PAN', 'Mandatory', 'Company PAN, LLP PAN, or owner PAN for proprietors'],
      ['GSTIN', 'Mandatory if GST-registered', 'Auto-linked during registration'],
      ['Investment in plant and machinery', 'Declare (no upload)', 'Written-down value as per latest ITR; not original cost'],
      ['Annual turnover', 'Declare (no upload)', 'As per latest ITR; self-declared'],
    ],
  },
}
```

### 5D. `lib/services/data/services-10-14.ts` — GST Cancellation, GST Revocation, DIN Reactivation, Company Name Change, Cloud Kitchen

```typescript
import type { ServicePageConfig } from '../types'

// ─── 10. GST Cancellation ─────────────────────────────────────────────────────

export const gstCancellation: ServicePageConfig = {
  slug: 'gst-cancellation',
  title: 'GST Cancellation',
  tagline: 'Close your GST registration properly. Final return filed, ITC reversed.',
  seoTitle: 'GST Registration Cancellation India 2025 | GSTR-10 and REG-16 | Ollvy',
  seoDescription: 'Voluntary GST cancellation with GSTR-10 final return and ITC reversal. Clean closure in 15 working days. No pending liabilities left behind.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-cancellation',
  lastReviewed: 'April 2026',
  category: 'GST',

  relatedServiceSlugs: ['gst-registration', 'gst-revocation', 'gst-monthly-50l'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'GST cancellation is the formal surrender of your GSTIN. It involves filing REG-16 (cancellation application) and GSTR-10 (final return declaring closing stock and reversing Input Tax Credit). The GST officer reviews and issues a cancellation order.',
    whyYouNeedIt: 'If you close your business or drop below the mandatory threshold, continuing to hold a GSTIN means continuing to file monthly returns - even nil ones. Missed returns on an inactive registration trigger penalties and eventually suo-moto cancellation by the department, which is harder to resolve.',
    whatHappensWithout: 'Monthly GSTR-1 and GSTR-3B remain mandatory. Each missed return: Rs. 50/day late fee for non-nil returns (Rs. 20/day for nil). After 6 months of non-filing, the department cancels suo-moto - at which point you owe all pending returns, interest, and penalties before anything can be done.',
  },

  workflow: [
    {
      step: 1,
      title: 'ITC and liability review',
      timeframe: 'Day 0-2',
      description: 'Remaining ITC balance and pending tax liabilities reviewed. ITC on closing stock must be reversed - we calculate the exact amount.',
      milestone: 'Liability position confirmed',
    },
    {
      step: 2,
      title: 'GSTR-10 prepared',
      timeframe: 'Day 2-5',
      description: 'Final return prepared with closing stock details and ITC reversal calculation.',
      milestone: 'Final return ready',
    },
    {
      step: 3,
      title: 'REG-16 and GSTR-10 filed',
      timeframe: 'Day 5-10',
      description: 'Cancellation application and final return filed simultaneously.',
      milestone: 'Cancellation filed',
    },
    {
      step: 4,
      title: 'Cancellation order received',
      timeframe: 'Day 10-15',
      description: 'GST officer reviews and issues the cancellation order.',
      milestone: 'GST registration cancelled',
    },
  ],

  included: [
    {
      title: 'GSTR-10 final return',
      description: 'Closing stock details, ITC reversal calculation, and final return prepared and filed.',
    },
    {
      title: 'REG-16 filing',
      description: 'Cancellation application with reason and supporting details.',
    },
    {
      title: 'ITC reversal calculated',
      description: 'Any ITC taken on goods still in stock at cancellation must be reversed. We calculate the exact amount before filing so there are no surprise demands after.',
    },
  ],

  risks: [
    {
      title: 'All pending returns must be cleared first',
      description: 'Every outstanding GSTR-1 and GSTR-3B must be filed before the cancellation application can be processed. We file those first if they are pending.',
    },
    {
      title: 'ITC reversal is mandatory',
      description: 'Any ITC claimed on goods still in stock at cancellation must be reversed or paid back. This cannot be skipped - the department checks GSTR-10 against your credit ledger.',
    },
  ],

  personas: [
    {
      title: 'Closing business',
      description: 'Winding down operations. Full clean closure handled - all returns filed, ITC reversed, cancellation obtained.',
    },
    {
      title: 'Turnover dropped below threshold',
      description: 'No longer legally required to be registered. Voluntary cancellation prevents unnecessary return filing obligations.',
    },
    {
      title: 'Switching to composition scheme',
      description: 'Cancelling regular registration before registering as a composition dealer.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'What happens to my remaining ITC balance when I cancel GST?',
      a: 'ITC on closing stock (goods still held at the time of cancellation) must be reversed and paid back to the government. We calculate this in GSTR-10 before filing. If your electronic cash ledger has a balance, it can be claimed as a refund.',
    },
    {
      category: 'General',
      q: 'Can I re-register for GST after cancelling?',
      a: 'Yes. A fresh GST registration can be applied for if your turnover crosses the threshold again. Voluntary cancellation and subsequent re-registration is allowed.',
    },
    {
      category: 'General',
      q: 'How long does GST cancellation take?',
      a: '15 working days from application to cancellation order, assuming no pending returns or outstanding liabilities.',
    },
    {
      category: 'General',
      q: 'What if I have pending GST returns?',
      a: 'All pending GSTR-1 and GSTR-3B must be filed before we can submit the cancellation application. We file those first - it adds to the total timeline but is mandatory.',
    },
    {
      category: 'General',
      q: 'What is the difference between voluntary cancellation and suo-moto cancellation?',
      a: 'Voluntary cancellation (REG-16): you apply to close your GSTIN cleanly. Suo-moto cancellation: the department cancels your GSTIN for non-filing of returns for 6+ consecutive months. Suo-moto cancellation leaves you with penalties, arrears, and a more complex restoration process.',
    },
  ],

  govtFees: {
    caption: 'Costs Involved - GST Cancellation',
    headers: ['Item', 'Amount', 'Notes'],
    rows: [
      ['REG-16 cancellation application', 'Nil', 'No government fee for voluntary cancellation'],
      ['GSTR-10 final return filing', 'Nil', 'No fee to file, but ITC reversal amount must be paid'],
      ['ITC reversal on closing stock', 'ITC amount + 18% interest (if paid late)', 'Mandatory - all ITC on goods in stock must be returned'],
      ['Pending return late fees (if any)', 'Rs. 50/day per return (nil: Rs. 20/day)', 'Must clear all pending returns before cancellation is accepted'],
    ],
  },

  documents: {
    caption: 'Documents Required - GST Cancellation',
    headers: ['Document', 'Required For', 'Notes'],
    rows: [
      ['Reason for cancellation', 'REG-16', 'Cessation of business, below threshold, switching to composition, etc.'],
      ['Closing stock details', 'GSTR-10', 'Stock as on cancellation date - item-wise quantity and value'],
      ['ITC balance in credit ledger', 'GSTR-10', 'Balance as on date of cancellation'],
      ['Last filed GSTR-3B', 'Reference', 'Confirm all dues are cleared before filing'],
      ['Bank account details', 'Refund if applicable', 'If ITC results in a cash refund after reversal'],
    ],
  },
}


// ─── 11. GST Revocation ───────────────────────────────────────────────────────

export const gstRevocation: ServicePageConfig = {
  slug: 'gst-revocation',
  title: 'GST Revocation',
  tagline: 'GST cancelled by the department? We restore it.',
  seoTitle: 'GST Registration Revocation India 2025 | Suo-Moto Cancellation Reversal | Ollvy',
  seoDescription: 'Restore a suo-moto GST cancellation. Pending returns filed, REG-21 submitted, GSTIN restored. Act within 30 days of cancellation order.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-revocation',
  lastReviewed: 'April 2026',
  category: 'GST',

  relatedServiceSlugs: ['gst-registration', 'gst-monthly-50l', 'gst-cancellation'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'GST revocation restores a GSTIN that was cancelled suo-moto by the GST department - typically for non-filing of returns for 6 or more consecutive months. It involves filing all pending returns, paying interest, and submitting REG-21 (revocation application) within 30 days of the cancellation order.',
    whyYouNeedIt: 'A cancelled GSTIN means you cannot issue GST invoices, claim ITC, or generate e-way bills. If you want to continue business, revocation is the only path - you cannot simply re-register if cancelled for non-compliance.',
    whatHappensWithout: 'Business operations requiring GST invoicing are blocked. Clients cannot claim ITC on any invoices raised after cancellation. If the 30-day revocation window closes, reinstatement requires an appeal to the Appellate Authority - a more complex and time-consuming process.',
  },

  workflow: [
    {
      step: 1,
      title: 'Review cancellation order',
      timeframe: 'Day 0-1',
      description: 'Reason and date of suo-moto cancellation confirmed. 30-day window calculated. Outstanding returns identified.',
      milestone: 'Cancellation order reviewed',
    },
    {
      step: 2,
      title: 'File all pending returns',
      timeframe: 'Day 1-5',
      description: 'All outstanding GSTR-1 and GSTR-3B filed with interest on late payment calculated and paid.',
      milestone: 'Pending returns cleared',
    },
    {
      step: 3,
      title: 'REG-21 filed',
      timeframe: 'Day 5-7',
      description: 'Revocation application submitted with explanation of default and confirmation that all returns are now current.',
      milestone: 'Revocation application filed',
    },
    {
      step: 4,
      title: 'GST registration restored',
      timeframe: 'Day 7-10',
      description: 'Officer reviews and restores the registration.',
      milestone: 'GSTIN active',
    },
  ],

  included: [
    {
      title: 'All pending returns filed',
      description: 'Every outstanding GSTR-1 and GSTR-3B cleared. Interest on late payment calculated and paid before revocation application.',
    },
    {
      title: 'REG-21 revocation application',
      description: 'Revocation request with explanation of the default and confirmation that returns are now current.',
    },
    {
      title: 'Interest calculation upfront',
      description: 'Exact interest liability on late-deposited tax calculated before filing so you know the total amount.',
    },
  ],

  risks: [
    {
      title: '30-day window from cancellation date',
      description: 'Revocation must be applied for within 30 days of the cancellation order. After that, you must file an appeal with the Appellate Authority - longer and more complex. Act immediately.',
    },
    {
      title: 'All pending returns must be filed first',
      description: 'The department will not process REG-21 unless all outstanding returns are filed and tax with interest paid.',
    },
  ],

  personas: [
    {
      title: 'GST cancelled for non-filing',
      description: 'Missed returns for 6+ months, registration cancelled suo-moto. All returns cleared and registration restored.',
    },
    {
      title: 'Need to continue invoicing clients urgently',
      description: 'GSTIN required for ongoing business operations. We treat this as urgent from day one.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'Why was my GST registration cancelled?',
      a: 'Suo-moto cancellation is triggered after 6 or more consecutive months of non-filing of GSTR-3B. The department issues a notice, then a show-cause notice, and finally a cancellation order.',
    },
    {
      category: 'General',
      q: 'What is the time limit for revocation?',
      a: '30 days from the date of the cancellation order. This is the standard window. Extensions of up to 30 more days can be granted by the Commissioner for sufficient cause - but do not rely on this. Apply immediately.',
    },
    {
      category: 'General',
      q: 'Can I raise GST invoices while revocation is pending?',
      a: 'No. Your GSTIN is invalid until restored. Any invoices raised during this period cannot be used by your clients to claim ITC, and you face legal exposure for issuing invoices on a cancelled registration.',
    },
    {
      category: 'General',
      q: 'What if I missed the 30-day window?',
      a: 'You must file an appeal with the Appellate Authority under GST. This is a formal legal process that takes longer and requires specific grounds for delay. Our team handles this but it is more involved than a standard revocation.',
    },
    {
      category: 'General',
      q: 'How much will I owe in late fees and interest?',
      a: 'Rs. 50/day per return for non-nil returns (Rs. 20 for nil), capped at Rs. 10,000 per return. Plus 18% per annum interest on any unpaid tax from the original due date. We calculate the exact amount before you commit.',
    },
  ],

  govtFees: {
    caption: 'Costs Involved - GST Revocation',
    headers: ['Item', 'Amount', 'Notes'],
    rows: [
      ['REG-21 revocation application', 'Nil', 'No government fee'],
      ['Pending GSTR-1 late fee (non-nil)', 'Rs. 50/day per return, capped at Rs. 10,000', 'Must be paid before REG-21 is accepted'],
      ['Pending GSTR-3B late fee (non-nil)', 'Rs. 50/day per return, capped at Rs. 10,000', 'Must be paid before REG-21 is accepted'],
      ['Interest on unpaid tax', '18% per annum from original due date', 'Accrues daily - calculated before filing'],
    ],
  },

  documents: {
    caption: 'Documents Required - GST Revocation',
    headers: ['Document', 'Required', 'Notes'],
    rows: [
      ['GST cancellation order', 'Yes', 'Date of cancellation determines the 30-day window'],
      ['Reason for non-compliance', 'Yes (REG-21)', 'Explanation of why returns were missed'],
      ['Proof of pending returns filed', 'Yes', 'ARN for all cleared GSTR-1 and GSTR-3B'],
      ['Proof of tax and interest paid', 'Yes', 'Challans showing all outstanding amounts cleared'],
      ['GST portal credentials', 'Yes', 'For filing pending returns and REG-21'],
    ],
  },
}


// ─── 12. DIN Reactivation ─────────────────────────────────────────────────────

export const dinReactivation: ServicePageConfig = {
  slug: 'din-reactivation',
  title: 'DIN Reactivation',
  tagline: 'Director Identification Number deactivated? Active in 10 working days.',
  seoTitle: 'DIN Reactivation India 2025 | DIR-3 KYC Late Filing | Rs. 5,000 Fee | Ollvy',
  seoDescription: 'Reactivate a deactivated DIN in 10 working days. All pending DIR-3 KYC filed, Rs. 5,000 late fee per year, DIR-3C submitted. All directorships unblocked.',
  canonicalUrl: 'https://www.ollvy.com/services/din-reactivation',
  lastReviewed: 'April 2026',
  category: 'Compliance',

  relatedServiceSlugs: ['mca-annual-filing', 'pvt-ltd-incorporation'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp'],

  explainer: {
    whatItIs: 'DIN Reactivation restores a Director Identification Number deactivated for non-filing of DIR-3 KYC by September 30. It involves filing all outstanding DIR-3 KYC forms, paying the Rs. 5,000 late fee per missed year, and submitting a DIR-3C reactivation application.',
    whyYouNeedIt: 'A deactivated DIN means you cannot sign any company filing, resolution, or official document. Every company where you hold a directorship is blocked from filing any MCA form - AOC-4, MGT-7, or any other - until your DIN is restored.',
    whatHappensWithout: 'All companies where you are a director cannot file their annual returns or any MCA form. Penalty of Rs. 100/day per form continues to accrue on missed MCA filings. Those companies can be marked as Default on MCA - visible to anyone doing due diligence.',
  },

  workflow: [
    {
      step: 1,
      title: 'Check deactivation reason and years outstanding',
      timeframe: 'Day 0-1',
      description: 'DIN status verified on MCA21. Years of outstanding DIR-3 KYC identified.',
      milestone: 'Outstanding years confirmed',
    },
    {
      step: 2,
      title: 'File all pending DIR-3 KYC',
      timeframe: 'Day 1-5',
      description: 'DIR-3 KYC filed for each outstanding year. Aadhaar OTP verification required for each filing. Rs. 5,000 late fee applies per year.',
      milestone: 'All KYC filings cleared',
    },
    {
      step: 3,
      title: 'DIR-3C reactivation application',
      timeframe: 'Day 5-7',
      description: 'Reactivation form filed with MCA.',
      milestone: 'Reactivation application submitted',
    },
    {
      step: 4,
      title: 'DIN reactivated',
      timeframe: 'Day 7-10',
      description: 'DIN status changed to Active on MCA21. All directorial rights and MCA filing access restored across all companies.',
      milestone: 'DIN active',
    },
  ],

  included: [
    {
      title: 'All outstanding DIR-3 KYC filed',
      description: 'Every year of missed KYC cleared. Aadhaar OTP verification coordinated in real time.',
    },
    {
      title: 'DIR-3C reactivation application',
      description: 'Reactivation form submitted to MCA.',
    },
    {
      title: 'All directorships unblocked',
      description: 'One DIN reactivation unblocks every company where you are a director. We verify all directorships are restored.',
    },
  ],

  risks: [
    {
      title: 'Rs. 5,000 per year of missed KYC',
      description: 'Government late fee of Rs. 5,000 per year is fixed and non-negotiable. 3 years of missed KYC = Rs. 15,000 in late fees, payable to MCA.',
    },
    {
      title: 'Aadhaar-linked mobile must be active',
      description: 'DIR-3 KYC requires Aadhaar OTP for each year\'s filing. If the mobile linked to Aadhaar is inactive, it must be updated at an Aadhaar enrolment centre before filing.',
    },
    {
      title: 'All directorships blocked until DIN is active',
      description: 'The impact is not limited to one company. Every company where you are a director is blocked from MCA filing until your DIN is restored.',
    },
  ],

  personas: [
    {
      title: 'Missed DIR-3 KYC for one or more years',
      description: 'DIN deactivated on October 1 after missing the September 30 deadline. Act before your companies miss their MCA filing deadlines.',
    },
    {
      title: 'Director in multiple companies',
      description: 'One DIN reactivation restores all directorships. We verify the MCA status of all companies is unblocked.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'Why was my DIN deactivated?',
      a: 'DINs deactivate automatically on October 1 every year when DIR-3 KYC is not filed by September 30. This is an automated MCA process - no individual notice is sent.',
    },
    {
      category: 'General',
      q: 'What is the late fee for DIR-3 KYC?',
      a: 'Rs. 5,000 per financial year of missed KYC. This is a fixed government fee - it cannot be reduced or waived. 2 years missed = Rs. 10,000; 3 years = Rs. 15,000.',
    },
    {
      category: 'General',
      q: 'How long does DIN reactivation take?',
      a: '10 working days from when we receive your documents and complete the Aadhaar OTP verifications.',
    },
    {
      category: 'General',
      q: 'Does reactivation fix the issue for all companies where I am a director?',
      a: 'Yes. Your DIN is a single identifier across all directorships. Reactivating it restores your signing authority and MCA filing access across every company where you hold a position.',
    },
    {
      category: 'General',
      q: 'What if I have active DIR-3 KYC (with verified mobile and email on MCA)?',
      a: 'If your mobile and email are already verified on MCA from a previous filing, you may be eligible for DIR-3 KYC-Web (the online version) which has no fee and takes 2 minutes. We check your MCA status before recommending the approach.',
    },
    {
      category: 'General',
      q: 'Can I prevent DIN deactivation in future?',
      a: 'Yes. File DIR-3 KYC every year by September 30. It takes 15 minutes. If your mobile and email are verified on MCA, you use DIR-3 KYC-Web - a 2-minute web form with no late fee. Your Ollvy compliance calendar shows this deadline.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - DIN Reactivation',
    headers: ['Item', 'Fee', 'Notes'],
    rows: [
      ['DIR-3 KYC late fee (per year)', 'Rs. 5,000', 'Fixed government fee; paid per financial year of missed KYC'],
      ['DIR-3C reactivation form', 'Included in KYC late fee', 'No separate filing fee for the reactivation form'],
      ['Example: 1 year missed', 'Rs. 5,000 total', ''],
      ['Example: 2 years missed', 'Rs. 10,000 total', ''],
      ['Example: 3 years missed', 'Rs. 15,000 total', ''],
    ],
  },

  documents: {
    caption: 'Documents Required - DIN Reactivation',
    headers: ['Document', 'Required', 'Notes'],
    rows: [
      ['Director PAN card', 'Yes', 'For identity in DIR-3 KYC'],
      ['Director Aadhaar card', 'Yes', 'OTP sent to Aadhaar-linked mobile - must be active'],
      ['Mobile linked to Aadhaar', 'Yes - must be active', 'OTP required for each year\'s KYC filing'],
      ['Email address', 'Yes', 'For DIR-3 KYC email OTP verification'],
      ['Passport photo', 'Yes', 'Current photo for KYC filing'],
      ['DIN number', 'Yes', 'The deactivated DIN to be restored'],
    ],
  },
}


// ─── 13. Company Name Change ──────────────────────────────────────────────────

export const companyNameChange: ServicePageConfig = {
  slug: 'company-name-change',
  title: 'Company Name Change',
  tagline: 'New name. Same company. Same CIN, PAN, and TAN.',
  seoTitle: 'Company Name Change MCA India 2025 | INC-24 and RUN Filing | Ollvy',
  seoDescription: 'Change your Pvt Ltd company name with MCA in 20 working days. Special resolution, RUN filing, INC-24, MOA amendment, new Certificate of Incorporation.',
  canonicalUrl: 'https://www.ollvy.com/services/company-name-change',
  lastReviewed: 'April 2026',
  category: 'Compliance',

  relatedServiceSlugs: ['pvt-ltd-incorporation', 'mca-annual-filing', 'trademark-registration'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp'],

  explainer: {
    whatItIs: 'A company name change under Section 13 of the Companies Act, 2013 involves a special resolution of shareholders, reserving the new name via RUN, amending the Memorandum of Association, and filing INC-24 with MCA. MCA issues a new Certificate of Incorporation with the updated name.',
    whyYouNeedIt: 'If you are rebranding, pivoting, or resolving a name conflict, the legal name must be changed through MCA. Using a trading name different from your registered name creates inconsistencies in contracts, invoices, and bank records - and raises red flags in due diligence.',
    whatHappensWithout: 'Operating under a name different from your MCA-registered name creates legal and commercial inconsistencies. Bank accounts, GST, trademark, and other registrations remain in the old name. Counterparties doing due diligence will find the mismatch.',
  },

  workflow: [
    {
      step: 1,
      title: 'Name availability check',
      timeframe: 'Day 0-2',
      description: 'New name searched against MCA company registry and trademark database. Conflicts identified before any filing.',
      milestone: 'Name confirmed available',
    },
    {
      step: 2,
      title: 'Board and shareholder resolution',
      timeframe: 'Day 2-7',
      description: 'Special resolution of shareholders required (75% majority). Board resolution and EGM notice drafted.',
      milestone: 'Special resolution passed',
    },
    {
      step: 3,
      title: 'RUN filed',
      timeframe: 'Day 7-12',
      description: 'Reserve Unique Name application submitted to MCA.',
      milestone: 'New name reserved',
    },
    {
      step: 4,
      title: 'INC-24 filed with MOA amendment',
      timeframe: 'Day 12-18',
      description: 'Name change application filed with amended Memorandum of Association.',
      milestone: 'INC-24 submitted',
    },
    {
      step: 5,
      title: 'New Certificate of Incorporation issued',
      timeframe: 'Day 18-20',
      description: 'Fresh Certificate with new company name issued by MCA. CIN, PAN, and TAN remain unchanged.',
      milestone: 'Name change complete',
    },
  ],

  included: [
    {
      title: 'Name availability search',
      description: 'MCA registry and trademark database checked before filing to minimise rejection risk.',
    },
    {
      title: 'Special resolution drafting',
      description: 'Shareholder special resolution, board resolution, and EGM notice drafted per Companies Act requirements.',
    },
    {
      title: 'MOA amendment',
      description: 'Clause I (name clause) of the Memorandum of Association updated with the new name.',
    },
    {
      title: 'New Certificate of Incorporation',
      description: 'Fresh certificate issued by MCA. CIN, PAN, TAN remain unchanged.',
    },
  ],

  risks: [
    {
      title: 'Downstream registrations must be updated separately',
      description: 'The MCA name change does not cascade to GST (core amendment needed), bank accounts, trademark, import-export code, or FSSAI. Each requires a separate update process.',
    },
    {
      title: 'Trademark conflict',
      description: 'If someone has registered a similar trademark, MCA may reject the name or you may receive a legal notice post-change. Our trademark search reduces this risk.',
    },
  ],

  personas: [
    {
      title: 'Rebranding',
      description: 'New brand identity. Legal name aligned with the new brand across all MCA records.',
    },
    {
      title: 'Business pivot',
      description: 'Core business changed. Existing name no longer reflects what the company does.',
    },
    {
      title: 'Name conflict with another company',
      description: 'Another company has a similar name causing confusion. Changing to a clearly distinct name.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'How long does a company name change take?',
      a: '20 working days from start to new Certificate of Incorporation - subject to MCA processing time.',
    },
    {
      category: 'General',
      q: 'Does PAN or GST change when I change the company name?',
      a: 'PAN and TAN remain the same. GST requires a core amendment (name update) on the GSTN portal - a separate process but straightforward. Bank accounts, trademark, and other registrations must also be updated separately.',
    },
    {
      category: 'General',
      q: 'Do I need a special resolution for a name change?',
      a: 'Yes. A special resolution requires 75% of shareholders voting in favour. It can be passed at an Extraordinary General Meeting (EGM) or through postal ballot.',
    },
    {
      category: 'General',
      q: 'Can I change the name to anything?',
      a: 'Subject to MCA availability: the name must be distinct from all existing company and LLP names, not contain restricted words (Bank, Insurance, Exchange, etc.), and ideally not conflict with registered trademarks.',
    },
    {
      category: 'General',
      q: 'What happens to existing contracts when the company name changes?',
      a: 'Existing contracts remain valid - the CIN (Company Identification Number) does not change, only the name. However, going forward you should use the new name in all agreements and notify key counterparties of the change.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - Company Name Change (2025)',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['RUN (Reserve Unique Name)', 'Rs. 1,000', 'Name reservation valid for 60 days from approval'],
      ['INC-24 filing fee', 'Rs. 1,200-56,000', 'Based on paid-up capital per MCA fee schedule; Rs. 1,200 for up to Rs. 1 lakh capital'],
      ['Stamp duty on amended MOA', 'Varies by state', 'New MOA must be printed on stamp paper; varies significantly by state'],
      ['GST core amendment (post name change)', 'Nil', 'Name update on GSTN portal is free but must be done'],
      ['Typical total govt fee', 'Rs. 3,000-8,000', 'Company with paid-up capital up to Rs. 25 lakh'],
    ],
  },

  documents: {
    caption: 'Documents Required - Company Name Change',
    headers: ['Document', 'Required', 'Notes'],
    rows: [
      ['Board resolution recommending name change', 'Yes', 'Passed by Board of Directors'],
      ['EGM notice to shareholders', 'Yes', '21 days notice required unless shorter notice is consented to'],
      ['Special resolution of shareholders', 'Yes', '75%+ majority; minutes of EGM or postal ballot results'],
      ['Amended Memorandum of Association', 'Yes', 'Clause I updated with new name; stamped per state stamp duty'],
      ['RUN approval from MCA', 'Yes', 'Obtained in Step 3 before filing INC-24'],
      ['Certificate of Incorporation (existing)', 'Yes', 'Current CI; surrendered to MCA as part of name change'],
      ['Trademark search report', 'Recommended', 'To verify new name does not conflict with registered trademarks'],
    ],
  },
}


// ─── 14. Cloud Kitchen Setup ──────────────────────────────────────────────────

export const cloudKitchenSetup: ServicePageConfig = {
  slug: 'cloud-kitchen-setup',
  title: 'Cloud Kitchen Setup',
  tagline: 'Every licence a delivery kitchen needs. FSSAI, GST, and trade licence together.',
  seoTitle: 'Cloud Kitchen Licence India 2025 | FSSAI + GST Setup | Ollvy',
  seoDescription: 'Complete cloud kitchen licensing - FSSAI State Licence, GST registration, and local trade licence. Swiggy and Zomato require FSSAI before onboarding.',
  canonicalUrl: 'https://www.ollvy.com/services/cloud-kitchen-setup',
  lastReviewed: 'April 2026',
  category: 'Licensing',

  relatedServiceSlugs: ['gst-registration', 'gst-monthly-50l', 'msme-registration'],
  relatedLearnSlugs: ['do-i-need-fssai-license', 'do-i-need-gst-registration'],

  explainer: {
    whatItIs: 'Cloud Kitchen Setup is a bundled service covering all mandatory licences for a delivery-only commercial kitchen: FSSAI Licence (Basic, State, or Central based on turnover), GST Registration, and local trade/health licence from your municipal authority.',
    whyYouNeedIt: 'Swiggy, Zomato, and all major food delivery platforms require a valid FSSAI licence number at onboarding - you cannot list without it. Without GST registration, you cannot issue compliant invoices or claim ITC on kitchen equipment and supplies. Operating without a trade licence risks closure notices.',
    whatHappensWithout: 'Cannot list on food delivery platforms - the primary revenue channel for cloud kitchens. FSSAI penalty for operating without a licence: up to Rs. 5 lakh (Section 63, Food Safety and Standards Act). Food safety officers can seal unlicensed premises and seize stock without a court order.',
  },

  workflow: [
    {
      step: 1,
      title: 'Business details and kitchen address',
      timeframe: 'Day 0',
      description: 'Turnover, kitchen area, menu category, GST status, city. We determine the correct FSSAI licence type and local authority requirements for your specific location.',
      milestone: 'Licence types confirmed, expert assigned',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeframe: 'Day 0-2',
      description: 'Business registration proof, kitchen layout plan, food safety plan, equipment list, address proof, and owner ID.',
      milestone: 'Documents verified',
    },
    {
      step: 3,
      title: 'FSSAI and GST applications filed in parallel',
      timeframe: 'Day 2-5',
      description: 'FSSAI Form B filed on the FSSAI portal. GST REG-01 filed simultaneously if not already registered. ARNs shared same day.',
      milestone: 'Applications submitted',
    },
    {
      step: 4,
      title: 'Local trade/health licence application',
      timeframe: 'Day 3-7',
      description: 'Application filed with your municipal authority. Requirements vary by city - Delhi, Mumbai, and Bangalore each have different processes.',
      milestone: 'Trade licence application filed',
    },
    {
      step: 5,
      title: 'FSSAI inspection coordinated',
      timeframe: 'Day 7-14',
      description: 'State and Central FSSAI licences require a physical inspection. We provide a pre-inspection checklist: pest control certificate, water test report, equipment hygiene, food safety plan.',
      milestone: 'Inspection completed',
    },
    {
      step: 6,
      title: 'All licences issued',
      timeframe: 'Day 10-21',
      description: 'FSSAI licence number, GSTIN, and trade licence received. All uploaded to your account.',
      milestone: 'Kitchen ready to list on platforms',
    },
  ],

  included: [
    {
      title: 'FSSAI licence - correct type determined upfront',
      description: 'Basic (below Rs. 12 lakh), State (Rs. 12 lakh to Rs. 20 crore), or Central (above Rs. 20 crore or multi-state). We confirm the type before you pay the government fee.',
      without: 'Apply for wrong licence type, get rejected, restart process',
      withOllvy: 'Correct licence type confirmed upfront based on your turnover and operation',
    },
    {
      title: 'GST registration',
      description: 'Full GST registration including CA assignment, document verification, and ARN tracking. Included in the bundle.',
    },
    {
      title: 'Local trade/health licence',
      description: 'Filed with your municipal authority. Different requirements for Delhi (MCD), Mumbai (BMC), Bangalore (BBMP), and other cities - we handle your specific city.',
    },
    {
      title: 'Pre-inspection checklist',
      description: 'For State and Central FSSAI licences, we provide a checklist of what inspectors check: pest control certificate, water testing, equipment hygiene labels, food safety plan.',
      without: 'Inspection failure - entire process restarts',
      withOllvy: 'Pre-inspection checklist reduces failure risk',
    },
    {
      title: 'FSSAI renewal reminder',
      description: 'FSSAI licence valid for 1-5 years (chosen at application). Renewal reminder in your compliance calendar before expiry.',
    },
  ],

  risks: [
    {
      title: 'FSSAI inspection failure',
      description: 'State and Central licences require physical inspection. Common failure points: no pest control certificate, missing water quality test report, equipment without hygiene labels. Our pre-inspection checklist addresses all standard failure points.',
    },
    {
      title: 'Wrong FSSAI licence type',
      description: 'Basic Registration when you need State Licence gets rejected by platforms. We verify turnover and operation type before filing.',
    },
    {
      title: 'Trade licence requirements vary by city',
      description: 'Each municipal authority has different documents, fees, and timelines. Delhi (MCD), Mumbai (BMC), Bangalore (BBMP) are all different. We apply for the correct licence from the correct authority.',
    },
  ],

  personas: [
    {
      title: 'New cloud kitchen, starting from scratch',
      description: 'No existing licences. All three handled together - FSSAI, GST, and trade licence.',
    },
    {
      title: 'Home baker scaling to commercial kitchen',
      description: 'Moving from home to a commercial kitchen. State Licence now required (was Basic before).',
    },
    {
      title: 'Already have GST, need FSSAI',
      description: 'Partial bundle. FSSAI and trade licence only.',
    },
    {
      title: 'Multi-city expansion',
      description: 'New kitchen in a new city. Fresh local licences required for each location. We handle the city-specific requirements.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'Do I need FSSAI even for a small home-based food business?',
      a: 'Yes. All food businesses at any scale require FSSAI. Below Rs. 12 lakh annual turnover: Basic Registration (no inspection, Rs. 100/year). Above Rs. 12 lakh: State Licence (inspection required). There is no exemption for home-based or small operations.',
    },
    {
      category: 'General',
      q: 'Can I list on Swiggy or Zomato before getting FSSAI?',
      a: 'No. Both platforms require a valid FSSAI licence number at onboarding. You cannot list without it. They also periodically verify it against the FSSAI database and can suspend accounts with expired or invalid licences.',
    },
    {
      category: 'General',
      q: 'What is the difference between FSSAI Basic Registration and State Licence?',
      a: 'Basic Registration (Form A): turnover below Rs. 12 lakh, issued by local Food Safety Officer, no inspection, Rs. 100/year. State Licence (Form B): Rs. 12 lakh to Rs. 20 crore, issued by State Food Safety Authority, inspection required, Rs. 2,000-7,500/year.',
    },
    {
      category: 'General',
      q: 'How long is the FSSAI licence valid?',
      a: '1 to 5 years - you choose at the time of application. Renewal must be applied for before expiry. Operating with an expired FSSAI is treated the same as operating without one.',
    },
    {
      category: 'General',
      q: 'Can multiple brands operate from one cloud kitchen under one FSSAI licence?',
      a: 'Yes. Multiple virtual restaurants or brands can operate from one kitchen at one address under a single FSSAI licence.',
    },
    {
      category: 'General',
      q: 'What does the FSSAI inspection check?',
      a: 'Pest control certificate, water quality test report, equipment hygiene labels (manufacturer, use-by date), food safety plan, storage conditions, kitchen cleanliness, and waste disposal setup. We send you a pre-inspection checklist covering all standard points.',
    },
    {
      category: 'General',
      q: 'Is GST mandatory for a cloud kitchen?',
      a: 'Mandatory once turnover crosses Rs. 20 lakh (services threshold, which applies to restaurants and food businesses). Voluntary registration is possible below this threshold and recommended if you want to claim ITC on kitchen equipment, packaging, and supplies.',
    },
  ],

  govtFees: {
    caption: 'Government Fees - Cloud Kitchen Setup (All Licences)',
    headers: ['Licence', 'Government Fee', 'Validity', 'Notes'],
    rows: [
      ['FSSAI Basic Registration', 'Rs. 100/year', '1-5 years', 'Below Rs. 12 lakh annual turnover; no inspection'],
      ['FSSAI State Licence', 'Rs. 2,000-7,500/year by category', '1-5 years', 'Rs. 12 lakh to Rs. 20 crore; inspection required'],
      ['FSSAI Central Licence', 'Rs. 7,500/year', '1-5 years', 'Above Rs. 20 crore or multi-state or importer/exporter'],
      ['GST Registration', 'Nil', 'Permanent', 'Monthly filing obligations begin after registration'],
      ['Trade Licence - Delhi (MCD)', 'Rs. 500-5,000 depending on area', 'Annual', 'Municipal Corporation of Delhi'],
      ['Trade Licence - Mumbai (BMC)', 'Rs. 1,000-10,000 by category', 'Annual', 'Brihanmumbai Municipal Corporation'],
      ['Trade Licence - Bangalore (BBMP)', 'Rs. 500-5,000', 'Annual', 'Bruhat Bengaluru Mahanagara Palike'],
    ],
  },

  documents: {
    caption: 'Documents Required - Cloud Kitchen Setup',
    headers: ['Document', 'FSSAI', 'GST', 'Trade Licence'],
    rows: [
      ['PAN card (owner or entity)', 'Yes', 'Yes', 'Yes'],
      ['Aadhaar card', 'Yes', 'Yes', 'Yes'],
      ['Address proof (owner)', 'Yes', 'Yes', 'Yes'],
      ['Kitchen electricity bill', 'Yes', 'Yes (business address)', 'Yes'],
      ['Rent agreement or ownership proof', 'Yes', 'NOC if rented', 'Yes'],
      ['Business registration proof', 'If company/LLP', 'If company/LLP', 'Yes'],
      ['Kitchen layout plan (to scale)', 'State/Central only', 'No', 'Sometimes'],
      ['Food safety plan', 'State/Central only', 'No', 'No'],
      ['Equipment list with make/model', 'State/Central only', 'No', 'No'],
      ['Pest control certificate', 'State/Central only', 'No', 'Sometimes'],
      ['Water test report', 'State/Central only', 'No', 'No'],
      ['Passport photo of proprietor/director', 'Yes', 'Yes', 'Yes'],
    ],
  },
}
```

---

*End of content dump. All 15 active services, all schemas, all components, all Supabase data included.*

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
      service_explainer
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
    shortName: pkg.short_name ?? pkg.name.split(' ').slice(0, 2).join(' '),
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
    canonicalUrl: pkg.canonical_url ?? `https://ollvy.com/services/${pkg.slug}`,

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

// Fallback slugs for static generation when Supabase is unavailable
const FALLBACK_SERVICE_SLUGS = [
  'pvt-ltd-incorporation',
  'llp-registration',
  'opc-registration',
  'gst-registration',
  'msme-registration',
  'trademark-registration',
  'fssai-registration',
  'iec-registration',
  'cloud-kitchen-setup',
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
 * Get Pro plan IDs from app_settings
 * Per §23 Connection Point 6: Ollvy Pro Upgrade
 */
export async function getProPlanIds(): Promise<{
  annualPlanId: string | null
  monthlyPlanId: string | null
}> {
  if (!supabaseServer) {
    return { annualPlanId: null, monthlyPlanId: null }
  }

  const { data, error } = await supabaseServer
    .from('app_settings')
    .select('key, value')
    .in('key', ['ollvy_pro_annual_plan_id', 'ollvy_pro_monthly_plan_id'])

  if (error) {
    console.error('Error fetching pro plan IDs:', error)
    return { annualPlanId: null, monthlyPlanId: null }
  }

  const settings = Object.fromEntries(data?.map(s => [s.key, s.value]) ?? [])
  return {
    annualPlanId: settings['ollvy_pro_annual_plan_id'] ?? null,
    monthlyPlanId: settings['ollvy_pro_monthly_plan_id'] ?? null,
  }
}

/**
 * Pro Plan Pricing Data
 */
export interface ProPlanPricing {
  annualPricePaisa: number
  monthlyPricePaisa: number
  annualPlanId: string | null
  monthlyPlanId: string | null
}

/**
 * Get Pro plan pricing from database
 * Per §23 Connection Point 6: Ollvy Pro Upgrade
 * Fetches both plan IDs and actual pricing from service_packages
 */
export async function getProPlanPricing(): Promise<ProPlanPricing> {
  // Default fallback pricing (in paisa)
  const defaults: ProPlanPricing = {
    annualPricePaisa: 999000, // ₹9,990
    monthlyPricePaisa: 99900, // ₹999
    annualPlanId: null,
    monthlyPlanId: null,
  }

  if (!supabaseServer) {
    return defaults
  }

  try {
    // Get plan IDs from app_settings
    const planIds = await getProPlanIds()

    // If we have annual plan ID, fetch its price
    if (planIds.annualPlanId) {
      const { data: annualPlan } = await supabaseServer
        .from('service_packages')
        .select('price_base_paisa')
        .eq('id', planIds.annualPlanId)
        .single()

      if (annualPlan) {
        defaults.annualPricePaisa = annualPlan.price_base_paisa
      }
    }

    // If we have monthly plan ID, fetch its price
    if (planIds.monthlyPlanId) {
      const { data: monthlyPlan } = await supabaseServer
        .from('service_packages')
        .select('price_base_paisa')
        .eq('id', planIds.monthlyPlanId)
        .single()

      if (monthlyPlan) {
        defaults.monthlyPricePaisa = monthlyPlan.price_base_paisa
      }
    }

    return {
      ...defaults,
      annualPlanId: planIds.annualPlanId,
      monthlyPlanId: planIds.monthlyPlanId,
    }
  } catch (error) {
    console.error('Error fetching pro plan pricing:', error)
    return defaults
  }
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

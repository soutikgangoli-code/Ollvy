/**
 * Service Data Fetching Layer
 * Per §23 - Backend Bridge: Landing Site ↔ Supabase
 *
 * Connection Point 1 (Service Grid) and Connection Point 2 (Service Detail Page)
 *
 * ALL service data is now stored in the database and editable.
 */

import { supabaseServer } from '../supabase-server'
import { withTimeout, DB_TIMEOUT_MS } from '../with-timeout'

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
  mrp?: number

  // SLA
  slaDays: number
  isRetainer: boolean
  nextDueDateValue?: string // Pre-computed for retainers

  // Service metadata
  mandatoryFor: string
  serviceType: 'One-time' | 'Annual' | 'Monthly retainer'

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

  // Service variants (optional, for services with pricing options)
  variants?: DBServiceVariant[]
  defaultVariantId?: string

  // Service-specific comparison (optional, for Why Ollvy section)
  comparisonWithout?: string[]
  comparisonWith?: string[]

  // Service addons (optional, for bundle customization)
  addons?: DBServiceAddon[]

  // Service explainer (optional, for "What is [Service]?" section)
  serviceExplainer?: DBServiceExplainer

  // Completion estimate fields (for govt processing services)
  hasGovtProcessing?: boolean
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

  try {
    const { data, error } = await withTimeout(
      supabaseServer
        .from('service_packages')
        .select(`
          id,
          slug,
          name,
          short_description,
          price_base_paisa,
          price_govt_fees_paisa,
          price_mrp_paisa,
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
        .order('display_order', { ascending: true }),
      DB_TIMEOUT_MS,
      'getActiveServices',
    )

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
      mrp: (pkg as any).price_mrp_paisa ? (pkg as any).price_mrp_paisa / 100 : undefined,
      slaDays: pkg.sla_working_days,
      isRetainer: pkg.billing_cycle === 'monthly' || pkg.billing_cycle === 'quarterly' || pkg.billing_cycle === 'yearly',
      // Use DB rating if >= 10 reviews, otherwise null (per §23 spec)
      avgRating: (pkg.rating_count ?? 0) >= 5 ? pkg.avg_rating : null,
      totalRatings: pkg.rating_count ?? 0,
      isBundle: pkg.is_bundle ?? false,
    }))
  } catch (err) {
    // Service grid degrades to empty rather than 500 on a transient blip.
    console.error('Failed to fetch active services:', err)
    return []
  }
}

/**
 * Fetch multiple services by slug in a single query.
 * Used by /startup (live pricing for the bundle stack) and /checkout/bundle.
 * Returned in the same order as `slugs`; missing slugs are silently skipped.
 */
export interface BundleServiceData {
  id: string
  slug: string
  name: string
  shortDescription: string
  ollvyFeePaisa: number
  govtFeePaisa: number
  mrpPaisa: number
  slaDays: number
  isRetainer: boolean
  isActive: boolean
}

export async function getServicesBySlugs(slugs: string[]): Promise<BundleServiceData[]> {
  if (!supabaseServer || slugs.length === 0) return []

  try {
    const { data, error } = await withTimeout(
      supabaseServer
        .from('service_packages')
        .select(`
          id,
          slug,
          name,
          short_description,
          price_base_paisa,
          price_govt_fees_paisa,
          price_mrp_paisa,
          sla_working_days,
          billing_cycle,
          is_active
        `)
        .in('slug', slugs)
        .eq('is_active', true),
      DB_TIMEOUT_MS,
      'getServicesBySlugs',
    )

    if (error) {
      console.error('[services] getServicesBySlugs:', error.message)
      return []
    }

    const bySlug = new Map<string, BundleServiceData>()
    for (const pkg of data ?? []) {
      bySlug.set(pkg.slug, {
        id: pkg.id,
        slug: pkg.slug,
        name: pkg.name,
        shortDescription: pkg.short_description ?? '',
        ollvyFeePaisa: pkg.price_base_paisa ?? 0,
        govtFeePaisa: pkg.price_govt_fees_paisa ?? 0,
        mrpPaisa: pkg.price_mrp_paisa ?? 0,
        slaDays: pkg.sla_working_days ?? 0,
        isRetainer:
          pkg.billing_cycle === 'monthly' ||
          pkg.billing_cycle === 'quarterly' ||
          pkg.billing_cycle === 'yearly',
        isActive: pkg.is_active ?? false,
      })
    }

    // Preserve caller-supplied order; drop slugs not found in DB.
    return slugs.map((s) => bySlug.get(s)).filter((s): s is BundleServiceData => Boolean(s))
  } catch (err) {
    // /startup is documented to never hard-fail; degrade to empty on a blip.
    console.error('[services] getServicesBySlugs failed:', err)
    return []
  }
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
    // Narrowed column list — only fields read by UnifiedServicePage + BookingPanel
    // + HowWeReviewed + ServiceStructuredData + the pricing struct. Dropped 12
    // columns that were selected but never consumed on any caller (admin pages
    // hit service_packages via their own queries, not through this function).
    // If you add a feature that reads a new field, add the column here.
    const { data: pkg, error } = await withTimeout(
      supabaseServer
    .from('service_packages')
    .select(`
      id,
      slug,
      name,
      short_name,
      short_description,
      tagline,
      category,
      service_type,
      mandatory_for,
      price_base_paisa,
      price_govt_fees_paisa,
      price_mrp_paisa,
      sla_working_days,
      billing_cycle,
      price_varies_by_state,
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
      variants,
      default_variant_id,
      comparison_without,
      comparison_with,
      addons,
      service_explainer,
      has_govt_processing,
      completion_max_days,
      completion_range_text
    `)
    .eq('slug', slug)
    .single(),
      DB_TIMEOUT_MS,
      `getServiceBySlugFromDB(${slug})`,
    )

  if (error) {
    // PGRST116 = zero rows → service genuinely does not exist → real 404 (cacheable).
    if (error.code === 'PGRST116') return { service: null, pricing: null }
    // Any other error = transient (network/5xx/timeout) → THROW so unstable_cache
    // does NOT cache a false 404. Page falls to error.tsx (retryable).
    throw new Error(`getServiceBySlugFromDB query failed: ${error.message}`)
  }

  const isRetainer = pkg.billing_cycle === 'monthly' || pkg.billing_cycle === 'quarterly' || pkg.billing_cycle === 'yearly'
  const avgRating = (pkg.rating_count ?? 0) >= 5 ? pkg.avg_rating : null

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
    mrp: pkg.price_mrp_paisa > 0 ? pkg.price_mrp_paisa / 100 : undefined,

    // SLA
    slaDays: pkg.sla_working_days,
    isRetainer,
    nextDueDateValue,

    // Metadata
    mandatoryFor: pkg.mandatory_for ?? 'All businesses',
    serviceType: pkg.service_type ?? (isRetainer ? 'Monthly retainer' : 'One-time'),

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

    // Service variants (optional)
    variants: pkg.variants ?? undefined,
    defaultVariantId: pkg.default_variant_id ?? undefined,

    // Service-specific comparison (optional)
    comparisonWithout: pkg.comparison_without ?? undefined,
    comparisonWith: pkg.comparison_with ?? undefined,

    // Service addons (optional)
    addons: pkg.addons ?? undefined,

    // Service explainer (optional)
    serviceExplainer: pkg.service_explainer ?? undefined,

    // Completion estimate fields
    hasGovtProcessing: pkg.has_govt_processing ?? false,
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
    priceVariesByState: service.priceVariesByState,
  }

  return { service, pricing }
  } catch (err) {
    console.error('Failed to fetch service by slug:', err)
    throw err   // never return null on failure → never poison the cache
  }
}

// Popular service data for homepage
export interface PopularServiceData {
  slug: string
  name: string
  description: string
  ollvyFee: number
  govtFee: number
  mrp?: number
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
    const { data, error } = await withTimeout(
      supabaseServer
      .from('service_packages')
      .select(`
        slug,
        name,
        short_description,
        price_base_paisa,
        price_govt_fees_paisa,
        price_mrp_paisa,
        sla_working_days,
        billing_cycle
      `)
      .eq('is_active', true)
      .neq('slug', 'test')
      .order('display_order', { ascending: true })
      .limit(6),
      DB_TIMEOUT_MS,
      'getPopularServices',
    )

    if (error) {
      // Degrade to empty rather than error the homepage. revalidate:3600 +
      // tag-purge refresh it; the page always loads.
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
      mrp: (pkg as any).price_mrp_paisa > 0 ? (pkg as any).price_mrp_paisa / 100 : undefined,
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
  // Consulting
  'iepf-consultation',
  'esop-structuring',
]

/**
 * Get all service slugs for sitemap.xml and generateStaticParams.
 *
 * sitemap.xml MUST be a static file (Google fetches a single URL), so the
 * slug list has to be available at build time. The existing fallback to
 * FALLBACK_SERVICE_SLUGS already covered the "Supabase unreachable" case —
 * but only when the fetch *threw*. When Supabase returns Cloudflare 522
 * with an HTML body, the supabase-js call has been observed to hang on the
 * response stream instead of throwing, so the catch never fired and Next's
 * 60s per-route build budget tripped instead.
 *
 * Wrap the call in a 5s Promise.race so a hung fetch falls into the
 * existing fallback path. This affects URL listing only — not prices, not
 * any rendered DB content. Pages themselves still fetch live data per
 * request.
 */
const SLUGS_FETCH_TIMEOUT_MS = 5000

export async function getAllServiceSlugs(): Promise<string[]> {
  if (!supabaseServer) {
    console.warn('[services] Using fallback slugs - Supabase not configured')
    return FALLBACK_SERVICE_SLUGS
  }

  try {
    const { data, error } = await withTimeout(
      supabaseServer.from('service_packages').select('slug').eq('is_active', true),
      SLUGS_FETCH_TIMEOUT_MS,
      'getAllServiceSlugs',
    )
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
    const { data, error } = await withTimeout(
      supabaseServer
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
        .eq('is_active', true),
      DB_TIMEOUT_MS,
      'getRelatedServicesBySlugs',
    )

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
 * Fetch aggregate rating across all services for Organization schema
 * Returns weighted average rating and total review count from all active services
 */
export async function getAggregateRating(): Promise<{ ratingValue: number; reviewCount: number } | null> {
  if (!supabaseServer) return null

  try {
    const { data, error } = await withTimeout(
      supabaseServer
        .from('service_packages')
        .select('avg_rating, rating_count')
        .eq('is_active', true)
        .gt('rating_count', 0),
      DB_TIMEOUT_MS,
      'getAggregateRating',
    )

    if (error || !data || data.length === 0) return null

    let totalWeightedRating = 0
    let totalReviews = 0

    for (const pkg of data) {
      if (pkg.avg_rating && pkg.rating_count) {
        totalWeightedRating += pkg.avg_rating * pkg.rating_count
        totalReviews += pkg.rating_count
      }
    }

    if (totalReviews < 10) return null

    return {
      ratingValue: Math.round((totalWeightedRating / totalReviews) * 10) / 10,
      reviewCount: totalReviews,
    }
  } catch (err) {
    console.error('Failed to fetch aggregate rating:', err)
    return null
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

  try {
    // Feedback is linked to orders, and orders have service_package_id
    const { data, error } = await withTimeout(
      supabaseServer
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
        .limit(limit),
      DB_TIMEOUT_MS,
      'getServiceReviews',
    )

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
  } catch (err) {
    // Reviews are non-critical — never let a blip 500 the whole service page.
    console.error('Failed to fetch reviews:', err)
    return []
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

  try {
    const { data, error } = await withTimeout(
      supabaseServer
        .from('service_packages')
        .select('slug, name, short_description, billing_cycle')
        .eq('is_active', true)
        .order('display_order', { ascending: true }),
      DB_TIMEOUT_MS,
      'getNavbarServices',
    )

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
  } catch (err) {
    // Navbar renders on every page — degrade to an empty nav rather than take
    // the whole page down. Timeout still prevents the hang.
    console.error('Failed to fetch navbar services (degrading to empty nav):', err)
    return []
  }
}

/**
 * FAQ service prices for homepage FAQ schema
 * Used to inject live prices into FAQ structured data
 */
export interface FAQServicePrices {
  llp: string
  llpTotal: string
  pvtLtd: string
  pvtLtdTotal: string
  gst: string
  gstTotal: string
  trademark: string
  trademarkTotal: string
  fssaiBasic: string
  fssaiState: string
  fssaiCentral: string
  opc: string
  opcTotal: string
  directorKyc: string
}

// Fallback prices if database is unavailable
const FALLBACK_FAQ_PRICES: FAQServicePrices = {
  llp: 'Rs 7,999',
  llpTotal: 'Rs 9,999',
  pvtLtd: 'Rs 9,999',
  pvtLtdTotal: 'Rs 13,998',
  gst: 'Rs 2,999',
  gstTotal: 'Rs 2,999',
  trademark: 'Rs 6,999',
  trademarkTotal: 'Rs 12,499',
  fssaiBasic: 'Rs 3,999',
  fssaiState: 'Rs 5,999',
  fssaiCentral: 'Rs 8,999',
  opc: 'Rs 8,499',
  opcTotal: 'Rs 11,499',
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
    const { data, error } = await withTimeout(
      supabaseServer
        .from('service_packages')
        .select('slug, price_base_paisa, price_govt_fees_paisa')
        .in('slug', slugs)
        .eq('is_active', true),
      DB_TIMEOUT_MS,
      'getFAQServicePrices',
    )

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
        // Compute total (Ollvy fee + govt fee) for services that have a total key
        const totalKey = `${priceKey}Total` as keyof FAQServicePrices
        if (totalKey in prices) {
          const total = pkg.price_base_paisa + (pkg.price_govt_fees_paisa || 0)
          prices[totalKey] = formatPriceINR(total)
        }
      }
    }

    return prices
  } catch (err) {
    console.error('Failed to fetch FAQ service prices:', err)
    return FALLBACK_FAQ_PRICES
  }
}

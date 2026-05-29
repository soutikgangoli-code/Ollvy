import type { LearnSection, LearnFaq, LearnCategory } from './guides/pages'
import { aoc42026 } from './deadlines/aoc-4-2026'
import { llpForm112026 } from './deadlines/llp-form-11-2026'
import { taxAudit2026 } from './deadlines/tax-audit-2026'

export interface Testimonial {
  quote: string
  name: string
  role: string
  // The exemplar deadline schema does not include business/city; keep optional
  // so existing entries that supply them still type-check.
  business?: string
  city?: string
}

export interface DeadlineConfig {
  slug: string
  serviceSlug: string // Maps to the service page for DB price lookup
  // Override the booking CTA href when no /services/[serviceSlug] page exists
  // (e.g. GSTR-9 and TDS quarterly returns route to the closest real service).
  bookingHref?: string
  serviceName: string
  eventLabel: string
  dueDate: string
  postDeadlineMessage: string
  heroTagline: string
  purposeLabel: string
  eligibilityLabel: string
  urgencyLine: string
  penaltyLine: string
  filingCount?: number
  ollvyFee: number
  govtFee?: number
  slaDays: number
  seoTitle: string
  seoDescription: string
  canonicalUrl: string
  documentTab: string // Which tab to pre-select in DocumentChecklist
  documentHeading: string // Section heading for documents
  risks: { title: string; body: string }[]
  testimonials: Testimonial[]
  faqs?: LearnFaq[]
  lastReviewed: string
  sources: { name: string; url: string; description: string }[]

  // Unified educational content layer (mirrors LearnPageConfig).
  category?: LearnCategory
  relatedServiceSlugs?: string[]
  relatedLearnSlugs?: string[]
  ctaSecondarySlug?: string
  sections?: LearnSection[]
}

export const DEADLINES: DeadlineConfig[] = [
  // FY 2026 deadlines that remain on /<slug> with the deadline schema.
  // The other 20 (May 2026 migration) moved to /guides/[slug] - see
  // lib/guides/pages.ts and the 301 redirects in next.config.js.
  taxAudit2026,
  aoc42026,
  llpForm112026,
]

export function getDeadlineBySlug(slug: string): DeadlineConfig | undefined {
  return DEADLINES.find((d) => d.slug === slug)
}

export function generateDeadlineFAQSchema(deadline: DeadlineConfig) {
  if (!deadline.faqs || deadline.faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: deadline.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

/**
 * Fetch live price from DB for a deadline's linked service.
 * Returns the deadline config with ollvyFee overridden by DB price.
 */
export async function getDeadlineWithLivePrice(slug: string): Promise<DeadlineConfig | undefined> {
  const deadline = getDeadlineBySlug(slug)
  if (!deadline) return undefined

  const { getServiceBySlugFromDB } = await import('./data/services')
  const { pricing } = await getServiceBySlugFromDB(deadline.serviceSlug)
  if (pricing) {
    return {
      ...deadline,
      ollvyFee: pricing.ollvyFee || deadline.ollvyFee,
      govtFee: pricing.govtFee ?? deadline.govtFee,
    }
  }

  return deadline
}

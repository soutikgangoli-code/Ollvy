import { MetadataRoute } from 'next'
import { getAllServiceSlugs } from '@/lib/data/services'
import { LEARN_PAGES, PENALTY_CALCULATOR_METADATA, DOCUMENT_CHECKLIST_METADATA } from '@/lib/guides/pages'
import { DEADLINES } from '@/lib/deadlines'

/**
 * Sitemap for Ollvy - per SEO mandate
 * Includes all public routes:
 * - Homepage
 * - Services listing and detail pages
 * - Tools index and all tool pages
 * - Learn index and all learn pages
 * - Legal pages (privacy, terms)
 *
 * Excludes: /admin, /pro, /api/*, /order/*, /profile, /dashboard
 */

const BASE_URL = 'https://www.ollvy.com'

// Document checklist and penalty calculator slugs imported from lib/guides/pages.ts
// to prevent drift — any new tool added there automatically appears in the sitemap.

// Deadline campaign page slugs derived from DEADLINES config

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch service slugs from database
  const serviceSlugs = await getAllServiceSlugs()

  // Differentiated lastmod dates so Google can prioritize recrawling.
  // Each content type gets its own date to avoid the "all URLs have same lastmod" problem.
  const buildDate = new Date()                     // DB-backed content: regenerated each build
  const legalDate = new Date('2026-02-01')         // Legal pages rarely change

  // Helper to parse lastReviewed date strings like "March 2025"
  const parseReviewDate = (dateStr: string): Date => {
    const parts = dateStr.split(' ')
    if (parts.length !== 2) return buildDate
    const [month, year] = parts
    const monthIndex = new Date(`${month} 1, 2000`).getMonth()
    return new Date(parseInt(year), monthIndex, 1)
  }

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: buildDate },
    { url: `${BASE_URL}/about`, lastModified: legalDate },
    { url: `${BASE_URL}/services`, lastModified: buildDate },
    { url: `${BASE_URL}/tools`, lastModified: buildDate },
    { url: `${BASE_URL}/guides`, lastModified: buildDate },
    { url: `${BASE_URL}/tools/documents`, lastModified: buildDate },
    { url: `${BASE_URL}/tools/penalty-calculator`, lastModified: buildDate },
    { url: `${BASE_URL}/privacy`, lastModified: legalDate },
    { url: `${BASE_URL}/terms`, lastModified: legalDate },
    // /cancellation and /refunds are noindexed (legal pages, kept off SERP). Excluded
    // from sitemap so Google doesn't re-discover them as primary content.
    { url: `${BASE_URL}/startup`, lastModified: legalDate },
    { url: `${BASE_URL}/join`, lastModified: legalDate },
  ]

  // Service detail pages - DB-backed, use build date
  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: buildDate,
  }))

  // Document checklist pages - use each page's lastReviewed date
  const documentRoutes: MetadataRoute.Sitemap = DOCUMENT_CHECKLIST_METADATA.map((tool) => ({
    url: `${BASE_URL}/tools/documents/${tool.slug}`,
    lastModified: tool.lastReviewed ? parseReviewDate(tool.lastReviewed) : buildDate,
  }))

  // Penalty calculator pages - use each page's lastReviewed date
  const penaltyRoutes: MetadataRoute.Sitemap = PENALTY_CALCULATOR_METADATA.map((tool) => ({
    url: `${BASE_URL}/tools/penalty-calculator/${tool.slug}`,
    lastModified: tool.lastReviewed ? parseReviewDate(tool.lastReviewed) : buildDate,
  }))

  // Guide pages - use actual lastReviewed dates from config
  const learnRoutes: MetadataRoute.Sitemap = LEARN_PAGES.map((page) => ({
    url: `${BASE_URL}/guides/${page.slug}`,
    lastModified: parseReviewDate(page.lastReviewed),
  }))

  // Deadline campaign pages - use each page's lastReviewed date
  const deadlineRoutes: MetadataRoute.Sitemap = DEADLINES.map((d) => ({
    url: `${BASE_URL}/${d.slug}`,
    lastModified: parseReviewDate(d.lastReviewed),
  }))

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...documentRoutes,
    ...penaltyRoutes,
    ...learnRoutes,
    ...deadlineRoutes,
  ]
}

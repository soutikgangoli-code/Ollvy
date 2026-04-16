import { MetadataRoute } from 'next'
import { getAllServiceSlugs } from '@/lib/data/services'
import { LEARN_PAGES, PENALTY_CALCULATOR_METADATA, DOCUMENT_CHECKLIST_METADATA } from '@/lib/guides/pages'
import { GEO_ENABLED_SERVICES, CITIES } from '@/lib/geo'

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

// Deadline campaign pages
const DEADLINE_SLUGS = [
  // 2026 deadlines
  'director-kyc-2026',
  'itr-2026',
  'gst-annual-2026',
  // 2027 deadlines
  'tds-return-q1-2027',
  'itr-2027',
  'gst-annual-2027',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch service slugs from database
  const serviceSlugs = await getAllServiceSlugs()

  // Static last modified date for unchanging content (updated when content changes)
  const staticDate = new Date('2026-04-03')

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: staticDate },
    { url: `${BASE_URL}/about`, lastModified: staticDate },
    { url: `${BASE_URL}/services`, lastModified: staticDate },
    { url: `${BASE_URL}/tools`, lastModified: staticDate },
    { url: `${BASE_URL}/guides`, lastModified: staticDate },
    { url: `${BASE_URL}/tools/documents`, lastModified: staticDate },
    { url: `${BASE_URL}/tools/penalty-calculator`, lastModified: staticDate },
    { url: `${BASE_URL}/privacy`, lastModified: staticDate },
    { url: `${BASE_URL}/terms`, lastModified: staticDate },
    { url: `${BASE_URL}/cancellation`, lastModified: staticDate },
    { url: `${BASE_URL}/refunds`, lastModified: staticDate },
    { url: `${BASE_URL}/startup`, lastModified: staticDate },
    { url: `${BASE_URL}/join`, lastModified: staticDate },
  ]

  // Service detail pages
  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: staticDate,
  }))

  // Document checklist pages
  const documentRoutes: MetadataRoute.Sitemap = DOCUMENT_CHECKLIST_METADATA.map((tool) => ({
    url: `${BASE_URL}/tools/documents/${tool.slug}`,
    lastModified: staticDate,
  }))

  // Penalty calculator pages
  const penaltyRoutes: MetadataRoute.Sitemap = PENALTY_CALCULATOR_METADATA.map((tool) => ({
    url: `${BASE_URL}/tools/penalty-calculator/${tool.slug}`,
    lastModified: staticDate,
  }))

  // Helper to parse lastReviewed date strings like "March 2025"
  const parseReviewDate = (dateStr: string): Date => {
    const [month, year] = dateStr.split(' ')
    const monthIndex = new Date(`${month} 1, 2000`).getMonth()
    return new Date(parseInt(year), monthIndex, 1)
  }

  // Guide pages - use actual lastReviewed dates from config
  const learnRoutes: MetadataRoute.Sitemap = LEARN_PAGES.map((page) => ({
    url: `${BASE_URL}/guides/${page.slug}`,
    lastModified: parseReviewDate(page.lastReviewed),
  }))

  // Geo pages - all service/city combinations
  const geoRoutes: MetadataRoute.Sitemap = GEO_ENABLED_SERVICES.flatMap((service) =>
    CITIES.map((city) => ({
      url: `${BASE_URL}/${service}/${city.slug}`,
      lastModified: staticDate,
    }))
  )

  // Deadline campaign pages
  const deadlineRoutes: MetadataRoute.Sitemap = DEADLINE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: staticDate,
  }))

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...documentRoutes,
    ...penaltyRoutes,
    ...learnRoutes,
    ...deadlineRoutes,
    ...geoRoutes,
  ]
}

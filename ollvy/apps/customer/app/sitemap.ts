import { MetadataRoute } from 'next'
import { getAllServiceSlugs } from '@/lib/data/services'
import { LEARN_PAGES } from '@/lib/guides/pages'
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

// Document checklist slugs (static routes)
const DOCUMENT_CHECKLIST_SLUGS = [
  'private-limited-company',
  'llp',
  'partnership',
  'sole-proprietor',
  'gst-registration',
  'individual-itr',
  'business-itr',
  'trademark',
]

// Penalty calculator slugs (static routes)
const PENALTY_CALCULATOR_SLUGS = [
  'gst-late-filing',
  'itr-late-filing',
  'tds-late-filing',
  'mca-annual-filing',
  'pf-esic-penalty',
  'director-kyc',
  'gst-demand-notice',
  'professional-tax-penalty',
  'shops-establishment-penalty',
  'startup-dpiit-compliance',
]

// Geo pages are now dynamically generated from GEO_ENABLED_SERVICES and CITIES

// Deadline campaign pages
const DEADLINE_SLUGS = [
  'director-kyc-2025',
  'itr-2025',
  'gst-annual-2025',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch service slugs from database
  const serviceSlugs = await getAllServiceSlugs()

  // Get learn page slugs from config
  const learnSlugs = LEARN_PAGES.map(p => p.slug)

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/services`, lastModified: new Date() },
    { url: `${BASE_URL}/tools`, lastModified: new Date() },
    { url: `${BASE_URL}/guides`, lastModified: new Date() },
    { url: `${BASE_URL}/tools/documents`, lastModified: new Date() },
    { url: `${BASE_URL}/tools/penalty-calculator`, lastModified: new Date() },
    { url: `${BASE_URL}/privacy`, lastModified: new Date() },
    { url: `${BASE_URL}/terms`, lastModified: new Date() },
    { url: `${BASE_URL}/cancellation`, lastModified: new Date() },
    { url: `${BASE_URL}/refunds`, lastModified: new Date() },
    { url: `${BASE_URL}/startup`, lastModified: new Date() },
    { url: `${BASE_URL}/join`, lastModified: new Date() },
  ]

  // Service detail pages
  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: new Date(),
  }))

  // Document checklist pages
  const documentRoutes: MetadataRoute.Sitemap = DOCUMENT_CHECKLIST_SLUGS.map((slug) => ({
    url: `${BASE_URL}/tools/documents/${slug}`,
    lastModified: new Date(),
  }))

  // Penalty calculator pages
  const penaltyRoutes: MetadataRoute.Sitemap = PENALTY_CALCULATOR_SLUGS.map((slug) => ({
    url: `${BASE_URL}/tools/penalty-calculator/${slug}`,
    lastModified: new Date(),
  }))

  // Guide pages
  const learnRoutes: MetadataRoute.Sitemap = learnSlugs.map((slug) => ({
    url: `${BASE_URL}/guides/${slug}`,
    lastModified: new Date(),
  }))

  // Geo pages - all service/city combinations
  const geoRoutes: MetadataRoute.Sitemap = GEO_ENABLED_SERVICES.flatMap((service) =>
    CITIES.map((city) => ({
      url: `${BASE_URL}/${service}/${city.slug}`,
      lastModified: new Date(),
    }))
  )

  // Deadline campaign pages
  const deadlineRoutes: MetadataRoute.Sitemap = DEADLINE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
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

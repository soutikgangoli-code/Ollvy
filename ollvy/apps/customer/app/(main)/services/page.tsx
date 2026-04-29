import { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { ServicesClient } from './services-client'
import { supabaseServer } from '@/lib/supabase-server'
import { SERVICES } from '@/lib/services'
import type { ServicePackage } from '@/lib/types'

// ISR: revalidate every hour to keep content fresh
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'All Services - Business Compliance & Registration | Ollvy',
  description:
    'Browse all compliance services: GST registration, Pvt Ltd incorporation, ITR filing, trademark registration, and more. Fixed pricing, fast delivery, expert support.',
  alternates: {
    canonical: 'https://www.ollvy.com/services',
    languages: {
      'en-IN': 'https://www.ollvy.com/services',
      'x-default': 'https://www.ollvy.com/services',
    },
  },
  openGraph: {
    title: 'All Services - Business Compliance & Registration | Ollvy',
    description:
      'Browse all compliance services: GST registration, Pvt Ltd incorporation, ITR filing, trademark registration, and more.',
    url: 'https://www.ollvy.com/services',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Services - Business Compliance | Ollvy',
    description: 'Browse all compliance services: GST, company registration, ITR filing, and more.',
    images: ['https://www.ollvy.com/logo.png'],
  },
}

// Convert static services to ServicePackage format for fallback
function getStaticServices(): ServicePackage[] {
  return SERVICES.map((s, index) => ({
    id: s.slug,
    slug: s.slug,
    name: s.name,
    short_description: s.tagline,
    long_description: s.tagline,
    order_type: s.isRetainer ? 'recurring' : 'one_time',
    billing_cycle: s.isRetainer ? 'monthly' : 'one_time',
    price_base_paisa: s.ollvyFee * 100,
    price_govt_fees_paisa: (s.govtFee ?? 0) * 100,
    price_mrp_paisa: (s.mrp ?? 0) * 100,
    price_gst_rate: 18,
    price_varies_by_state: false,
    sla_working_days: s.slaDays,
    situation_tags: [],
    workflow_stages: [],
    urgency_score: 50,
    avg_rating: 4.7,
    rating_count: 50,
    display_order: index,
    is_active: true,
    scope_included: s.whatsIncluded.map((w) => w.title),
    scope_excluded: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))
}

// Fetch services from database (server-side)
async function fetchServices(): Promise<ServicePackage[]> {
  // If no server client available (build time without service role key), use static data
  if (!supabaseServer) {
    return getStaticServices()
  }

  try {
    const { data, error } = await supabaseServer
      .from('service_packages')
      .select(`
        *,
        filter_category:service_filter_categories (
          name,
          icon_name
        )
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching services:', error)
      return getStaticServices()
    }

    return data || getStaticServices()
  } catch (err) {
    console.error('Failed to fetch services:', err)
    return getStaticServices()
  }
}

// Generate JSON-LD schema for search engines
function generateServicesSchema(services: ServicePackage[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Business Compliance Services',
    description: 'Fixed-price compliance packages for Indian SMEs',
    url: 'https://www.ollvy.com/services',
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        // Product (not Service) so per-item aggregateRating validates as a Review Snippet —
        // matches the @type used on the individual /services/[slug] page schema.
        '@type': 'Product',
        name: service.name,
        description: service.short_description,
        url: `https://www.ollvy.com/services/${service.slug}`,
        brand: {
          '@type': 'Brand',
          name: 'Ollvy',
        },
        offers: {
          '@type': 'Offer',
          price: Math.round((service.price_base_paisa + (service.price_govt_fees_paisa ?? 0)) / 100).toString(),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          eligibleRegion: { '@type': 'Country', name: 'IN' },
          ...(service.price_govt_fees_paisa > 0 && {
            priceSpecification: [
              {
                '@type': 'UnitPriceSpecification',
                price: Math.round(service.price_base_paisa / 100).toString(),
                priceCurrency: 'INR',
                name: 'Professional Fee',
              },
              {
                '@type': 'UnitPriceSpecification',
                price: Math.round(service.price_govt_fees_paisa / 100).toString(),
                priceCurrency: 'INR',
                name: 'Government Fee',
              },
            ],
          }),
        },
        ...(service.avg_rating && service.rating_count >= 5 ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: service.avg_rating.toFixed(1),
            reviewCount: service.rating_count,
          },
        } : {}),
      },
    })),
  }
}

// Breadcrumb schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.ollvy.com/services' },
  ],
}

// Search index entry — lightweight text blob per service for client-side deep search
export interface ServiceSearchEntry {
  slug: string
  texts: { source: string; text: string }[]
}

function buildSearchIndex(services: ServicePackage[]): ServiceSearchEntry[] {
  return services.map(s => {
    const raw = s as unknown as Record<string, unknown>
    const texts: { source: string; text: string }[] = []

    // Tagline
    if (typeof raw.tagline === 'string' && raw.tagline) {
      texts.push({ source: 'Tagline', text: raw.tagline })
    }

    // What's included
    const included = raw.whats_included as { title?: string; body?: string }[] | undefined
    if (Array.isArray(included)) {
      for (const item of included) {
        if (item.title) texts.push({ source: 'What you get', text: item.title + (item.body ? '. ' + item.body : '') })
      }
    }

    // Process steps
    const stages = raw.workflow_stages as { title?: string; body?: string }[] | undefined
    if (Array.isArray(stages)) {
      for (const step of stages) {
        if (step.title) texts.push({ source: 'Process', text: step.title + (step.body ? '. ' + step.body : '') })
      }
    }

    // FAQs
    const faqs = raw.faqs as { q?: string; a?: string }[] | undefined
    if (Array.isArray(faqs)) {
      for (const faq of faqs) {
        if (faq.q) texts.push({ source: 'FAQ', text: faq.q + (faq.a ? ' ' + faq.a : '') })
      }
    }

    // Risks
    const risks = raw.service_risks as { title?: string; body?: string }[] | undefined
    if (Array.isArray(risks)) {
      for (const risk of risks) {
        if (risk.title) texts.push({ source: 'Risks', text: risk.title + (risk.body ? '. ' + risk.body : '') })
      }
    }

    return { slug: s.slug, texts }
  })
}

interface PageProps {
  searchParams: Promise<{ q?: string; filter?: string }>
}

export default async function ServicesPage({ searchParams }: PageProps) {
  // Fetch services server-side for SEO
  const getCachedServices = unstable_cache(fetchServices, ['all-services'], { tags: ['service-packages'] })
  const services = await getCachedServices()
  const servicesSchema = generateServicesSchema(services)

  // Read initial query + filters from URL on the server — avoids the client-side
  // useSearchParams Suspense boundary that caused a ~400px skeleton-to-grid shift.
  const { q, filter } = await searchParams
  const initialQuery = q ?? ''
  const initialFilters = filter?.split(',').filter(Boolean) ?? []

  return (
    <>
      {/* JSON-LD Schemas - consolidated @graph for crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [breadcrumbSchema, servicesSchema].map(({ '@context': _, ...rest }) => rest),
        }) }}
      />
      {/* H1 — SEO crawlable */}
      <div className="container pt-12 pb-6">
        <h1 className="text-3xl font-semibold text-foreground">All Services</h1>
        <p className="text-muted-foreground mt-2">
          Fixed-price compliance packages with transparent pricing.
        </p>
      </div>

      {/* SSR service grid — sr-only for crawlers, users interact with client grid below */}
      <div className="sr-only">
        {services.map((s) => (
          <a key={s.slug} href={`/services/${s.slug}`}>
            <h2>{s.name}</h2>
            <p>{s.short_description}</p>
            <p>From Rs {Math.round(s.price_base_paisa / 100).toLocaleString('en-IN')}</p>
          </a>
        ))}
      </div>

      {/* Client grid — renders real content on first paint (no Suspense fallback). */}
      <ServicesClient
        initialServices={services}
        searchIndex={buildSearchIndex(services)}
        initialQuery={initialQuery}
        initialFilters={initialFilters}
      />
    </>
  )
}

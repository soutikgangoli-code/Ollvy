import { Metadata } from 'next'
import { Suspense } from 'react'
import { ServicesClient } from './services-client'
import { supabaseServer } from '@/lib/supabase-server'
import { SERVICES } from '@/lib/services'
import type { ServicePackage } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

// ISR: revalidate every hour to keep content fresh
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'All Services - Business Compliance & Registration | Ollvy',
  description:
    'Browse all compliance services: GST registration, Pvt Ltd incorporation, ITR filing, trademark registration, and more. Fixed pricing, fast delivery, expert support.',
  keywords: [
    'business registration services India',
    'GST registration service',
    'company incorporation India',
    'ITR filing service',
    'trademark registration India',
    'compliance services for startups',
  ],
  alternates: {
    canonical: 'https://www.ollvy.com/services',
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
      name: service.name,
      url: `https://www.ollvy.com/services/${service.slug}`,
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

function ServicesLoadingSkeleton() {
  return (
    <div className="container pb-12">
      <div className="space-y-6 mb-10">
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export default async function ServicesPage() {
  // Fetch services server-side for SEO
  const services = await fetchServices()
  const servicesSchema = generateServicesSchema(services)

  return (
    <>
      {/* JSON-LD Schemas - rendered server-side for crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      {/* H1 outside Suspense for SEO crawlers */}
      <div className="container pt-12 pb-6">
        <h1 className="text-3xl font-semibold text-foreground">All Services</h1>
        <p className="text-muted-foreground mt-2">
          Fixed-price compliance packages with transparent pricing.
        </p>
      </div>

      {/* Client component for interactive search/filter with initial services */}
      <Suspense fallback={<ServicesLoadingSkeleton />}>
        <ServicesClient initialServices={services} />
      </Suspense>
    </>
  )
}

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug, CITIES, GEO_ENABLED_SERVICES } from '@/lib/geo'
import { getServiceBySlugFromDB, getStatePricing, getServiceReviews, getRelatedServicesBySlugs } from '@/lib/data/services'
import { UnifiedServicePage } from '@/components/service/UnifiedServicePage'

/**
 * Geo Page - Service + City specific landing page
 *
 * Per §23 Connection Point 8: Geo Pages Pricing
 * - Fetches state-specific pricing from service_state_pricing table
 * - Falls back to base pricing if no state override exists
 *
 * ISR - revalidate: 3600 (rebuilds hourly)
 */

export const revalidate = 3600

interface PageProps {
  params: Promise<{ service: string; city: string }>
}

export async function generateStaticParams() {
  const params: { service: string; city: string }[] = []

  for (const serviceSlug of GEO_ENABLED_SERVICES) {
    for (const city of CITIES) {
      params.push({
        service: serviceSlug,
        city: city.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: serviceSlug, city: citySlug } = await params
  const { service } = await getServiceBySlugFromDB(serviceSlug)
  const city = getCityBySlug(citySlug)

  if (!service || !city) {
    return {
      title: 'Service | Ollvy',
      description: 'Professional compliance services by verified CAs',
    }
  }

  const title = `${service.name} in ${city.name} | Ollvy`
  const description = `Get ${service.name.toLowerCase()} in ${city.name}, ${city.state}. ${service.slaDays} working days. Verified CAs. Starting at ₹${service.ollvyFee.toLocaleString('en-IN')}.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.ollvy.com/${serviceSlug}/${citySlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.ollvy.com/${serviceSlug}/${citySlug}`,
      siteName: 'Ollvy',
      type: 'website',
      images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.ollvy.com/logo.png'],
    },
  }
}

export default async function GeoPage({ params }: PageProps) {
  const { service: serviceSlug, city: citySlug } = await params

  // Validate city
  const city = getCityBySlug(citySlug)
  if (!city) {
    notFound()
  }

  // Fetch complete service data from database
  const { service, pricing: basePricing } = await getServiceBySlugFromDB(serviceSlug)

  if (!service) {
    notFound()
  }

  // Fetch state-specific pricing override
  let adjustedService = { ...service }
  if (basePricing?.id) {
    const statePricing = await getStatePricing(basePricing.id, city.state)

    if (statePricing) {
      // Override with state-specific pricing
      adjustedService = {
        ...service,
        ollvyFee: statePricing.price_base_paisa / 100,
        govtFee: statePricing.price_govt_fees_paisa / 100,
      }
    }
  }

  // Fetch reviews and related services in parallel
  const [reviews, relatedServices] = await Promise.all([
    getServiceReviews(service.id),
    getRelatedServicesBySlugs(service.relatedSlugs),
  ])

  // Build BreadcrumbList schema for navigation hierarchy
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ollvy.com' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.ollvy.com/services' },
      { '@type': 'ListItem', position: 3, name: service.name, item: `https://www.ollvy.com/services/${serviceSlug}` },
      { '@type': 'ListItem', position: 4, name: `${service.name} in ${city.name}`, item: `https://www.ollvy.com/${serviceSlug}/${citySlug}` },
    ],
  }

  // Build LocalBusiness schema for local SEO
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://www.ollvy.com/${serviceSlug}/${citySlug}#localbusiness`,
    name: `Ollvy - ${service.name} in ${city.name}`,
    description: `Professional ${service.name.toLowerCase()} services in ${city.name}, ${city.state}. Verified CAs. Fixed prices. ${service.slaDays} working days delivery.`,
    url: `https://www.ollvy.com/${serviceSlug}/${citySlug}`,
    telephone: '+91-9217065577',
    priceRange: `₹${adjustedService.ollvyFee.toLocaleString('en-IN')}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.state,
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.name} Services`,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.tagline,
          },
          price: adjustedService.ollvyFee.toString(),
          priceCurrency: 'INR',
        },
      ],
    },
  }

  // Service schema for detailed service info
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.name} in ${city.name}`,
    provider: {
      '@type': 'Organization',
      name: 'Ollvy Technologies Private Limited',
      url: 'https://www.ollvy.com',
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'State',
        name: city.state,
      },
    },
    offers: {
      '@type': 'Offer',
      price: adjustedService.ollvyFee.toString(),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    description: service.tagline,
  }

  return (
    <>
      {/* BreadcrumbList Schema for navigation hierarchy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {/* LocalBusiness Schema for local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      {/* Service Schema for service details */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <UnifiedServicePage
        service={adjustedService}
        pricing={basePricing}
        reviews={reviews}
        relatedServices={relatedServices}
        geoContext={{ city: city.name, state: city.state }}
      />
    </>
  )
}

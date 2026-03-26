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
      canonical: `https://ollvy.in/${serviceSlug}/${citySlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ollvy.in/${serviceSlug}/${citySlug}`,
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

  return (
    <>
      {/* JSON-LD Structured Data per §17 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `${service.name} in ${city.name}`,
            provider: {
              '@type': 'Organization',
              name: 'Ollvy Technologies Private Limited',
              url: 'https://ollvy.in',
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
          }),
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

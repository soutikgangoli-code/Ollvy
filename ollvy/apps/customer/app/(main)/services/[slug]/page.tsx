import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceBySlugFromDB, getAllServiceSlugs, getServiceReviews, getRelatedServicesBySlugs } from '@/lib/data/services'
import { UnifiedServicePage } from '@/components/service/UnifiedServicePage'

/**
 * Service Detail Page — Server Component
 *
 * ALL content is now fetched from the database (no static configs).
 * This makes every service detail page editable from the admin dashboard.
 *
 * ISR — revalidate: 3600 (rebuilds hourly)
 */

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { service } = await getServiceBySlugFromDB(slug)

  if (!service) {
    return {
      title: 'Service Not Found | Ollvy',
      description: 'The requested service could not be found.',
    }
  }

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: {
      canonical: service.canonicalUrl,
    },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url: service.canonicalUrl,
      siteName: 'Ollvy',
      type: 'website',
    },
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params

  // Fetch complete service data from database
  const { service, pricing } = await getServiceBySlugFromDB(slug)

  if (!service) {
    notFound()
  }

  // Fetch reviews and related services in parallel
  const [reviews, relatedServices] = await Promise.all([
    getServiceReviews(service.id),
    getRelatedServicesBySlugs(service.relatedSlugs),
  ])

  return (
    <UnifiedServicePage
      service={service}
      pricing={pricing}
      reviews={reviews}
      relatedServices={relatedServices}
    />
  )
}

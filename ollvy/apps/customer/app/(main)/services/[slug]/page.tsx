import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { getServiceBySlugFromDB, getAllServiceSlugs, getServiceReviews, getRelatedServicesBySlugs } from '@/lib/data/services'
import { UnifiedServicePage } from '@/components/service/UnifiedServicePage'
import { ServiceStructuredData } from '@/components/seo/ServiceStructuredData'
import { DATA as DIYvsOllvyData } from '@/components/service/DIYvsOllvy'
import { getFallbackReviews } from '@/lib/data/fallback-reviews'

/**
 * Service Detail Page - Server Component
 *
 * ALL content is now fetched from the database (no static configs).
 * This makes every service detail page editable from the admin dashboard.
 *
 * ISR - revalidate: 3600 (rebuilds hourly)
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
  const getCachedService = unstable_cache(() => getServiceBySlugFromDB(slug), [`service-${slug}`], { revalidate: 3600 })
  const { service } = await getCachedService()

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
      images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.seoTitle,
      description: service.seoDescription,
      images: ['https://www.ollvy.com/logo.png'],
    },
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params

  // Fetch complete service data from database (cached)
  const getCachedService = unstable_cache(() => getServiceBySlugFromDB(slug), [`service-${slug}`], { revalidate: 3600 })
  const { service, pricing } = await getCachedService()

  if (!service) {
    notFound()
  }

  // Fetch reviews and related services in parallel (cached)
  const getCachedReviews = unstable_cache(() => getServiceReviews(service.id), [`service-reviews-${slug}`], { revalidate: 3600 })
  const getCachedRelated = unstable_cache(() => getRelatedServicesBySlugs(service.relatedSlugs), [`service-related-${slug}`], { revalidate: 3600 })
  const [reviews, relatedServices] = await Promise.all([
    getCachedReviews(),
    getCachedRelated(),
  ])

  // Get price in rupees
  const basePrice = pricing?.ollvyFee || service.ollvyFee || 0

  return (
    <>
      <ServiceStructuredData
        serviceName={service.name}
        serviceSlug={slug}
        description={service.seoDescription || service.tagline}
        price={basePrice}
        govtFee={service.govtFee}
        category={service.category}
        avgRating={service.avgRating}
        totalRatings={service.totalRatings}
        faqs={service.faqs}
        reviews={reviews}
        fallbackReviews={getFallbackReviews(slug)}
        processSteps={service.processSteps}
        whatsIncluded={service.whatsIncluded}
        slaDays={service.slaDays}
      />
      {DIYvsOllvyData[slug] && (
        <div className="max-w-[1200px] mx-auto px-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium text-foreground">What needs doing</th>
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">On your own</th>
                <th className="text-left py-2 font-medium text-[hsl(var(--ollvy-green-fg))]">With Ollvy</th>
              </tr>
            </thead>
            <tbody>
              {DIYvsOllvyData[slug].rows.map((row, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 pr-4 font-medium text-foreground align-top">{row.task}</td>
                  <td className="py-3 pr-4 text-muted-foreground align-top">{row.own}</td>
                  <td className="py-3 text-foreground align-top">{row.ollvy_head} {row.ollvy_badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <UnifiedServicePage
        service={service}
        pricing={pricing}
        reviews={reviews}
        relatedServices={relatedServices}
      />
    </>
  )
}

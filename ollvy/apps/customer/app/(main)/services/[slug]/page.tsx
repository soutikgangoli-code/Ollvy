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
export const dynamicParams = true

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const getCachedService = unstable_cache(() => getServiceBySlugFromDB(slug), [`service-${slug}`], { tags: ['service-packages'] })
  const { service } = await getCachedService()

  if (!service) {
    return {
      title: 'Service Not Found | Ollvy',
      description: 'The requested service could not be found.',
    }
  }

  // Interpolate {PRICE} placeholder in seoTitle/seoDescription with live total (Ollvy + govt fee)
  // so SEO meta always reflects current DB pricing — zero drift via ISR (revalidate: 3600).
  const totalPrice = service.ollvyFee + (service.govtFee ?? 0)
  const priceStr = `₹${totalPrice.toLocaleString('en-IN')}`
  const interpolate = (s: string | null | undefined): string =>
    (s ?? '').replaceAll('{PRICE}', priceStr)
  const title = interpolate(service.seoTitle)
  const description = interpolate(service.seoDescription)

  return {
    title,
    description,
    alternates: {
      canonical: service.canonicalUrl,
      languages: {
        'en-IN': service.canonicalUrl,
        'x-default': service.canonicalUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: service.canonicalUrl,
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

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params

  // Fetch complete service data from database (cached)
  const getCachedService = unstable_cache(() => getServiceBySlugFromDB(slug), [`service-${slug}`], { tags: ['service-packages'] })
  const { service, pricing } = await getCachedService()

  if (!service) {
    notFound()
  }

  // Fetch reviews and related services in parallel (cached)
  const getCachedReviews = unstable_cache(() => getServiceReviews(service.id), [`service-reviews-${slug}`], { tags: ['service-packages'] })
  const getCachedRelated = unstable_cache(() => getRelatedServicesBySlugs(service.relatedSlugs), [`service-related-${slug}`], { tags: ['service-packages'] })
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
      {/* Server-rendered SEO content — all key data as semantic HTML for Google */}
      <div className="sr-only">
        {/* DIY comparison table */}
        {DIYvsOllvyData[slug] && (
          <table>
            <caption>DIY vs Ollvy comparison for {service.name}</caption>
            <thead>
              <tr>
                <th>Step</th>
                <th>On your own</th>
                <th>With Ollvy</th>
              </tr>
            </thead>
            <tbody>
              {DIYvsOllvyData[slug].rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.task}</td>
                  <td>{row.own}</td>
                  <td>{row.ollvy_head} — {row.ollvy_badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Process steps */}
        {service.processSteps.length > 0 && (
          <div>
            <h2>How {service.name} works</h2>
            <ol>
              {service.processSteps.map((step, i) => (
                <li key={i}>
                  <h3>Step {step.step}: {step.title}</h3>
                  <p><strong>Timeline:</strong> {step.timeline}</p>
                  {(step.body || '').includes('\n') ? (
                    <ul>{step.body.split('\n').filter(Boolean).map((line, j) => <li key={j}>{line}</li>)}</ul>
                  ) : (
                    <p>{step.body}</p>
                  )}
                  {step.milestone && <p><strong>Milestone:</strong> {step.milestone}</p>}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* What's included */}
        {service.whatsIncluded.length > 0 && (
          <div>
            <h2>Everything included in {service.name}</h2>
            {service.whatsIncluded.map((item, i) => (
              <div key={i}>
                <h3>{item.title}</h3>
                {(item.body || '').includes('\n') ? (
                  <ul>{item.body.split('\n').filter(Boolean).map((line, j) => <li key={j}>{line}</li>)}</ul>
                ) : (
                  <p>{item.body}</p>
                )}
                {item.comparisonWithout && <p><strong>Without Ollvy:</strong> {item.comparisonWithout}</p>}
                {item.comparisonWithOllvy && <p><strong>With Ollvy:</strong> {item.comparisonWithOllvy}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Risks */}
        {service.serviceRisks.length > 0 && (
          <div>
            <h2>What could go wrong with {service.shortName}</h2>
            {service.serviceRisks.map((risk, i) => (
              <div key={i}>
                <h3>{risk.title}</h3>
                {(risk.body || '').includes('\n') ? (
                  <ul>{risk.body.split('\n').filter(Boolean).map((line, j) => <li key={j}>{line}</li>)}</ul>
                ) : (
                  <p>{risk.body}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* FAQs */}
        {service.faqs.length > 0 && (
          <div>
            <h2>Frequently asked questions about {service.name}</h2>
            {service.faqs.map((faq, i) => (
              <div key={i}>
                <h3>{faq.q}</h3>
                {(faq.a || '').includes('\n') ? (
                  faq.a.split('\n').filter(Boolean).map((line, j) => <p key={j}>{line}</p>)
                ) : (
                  <p>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <UnifiedServicePage
        service={service}
        pricing={pricing}
        reviews={reviews}
        relatedServices={relatedServices}
      />
    </>
  )
}

// Structured Data for individual service pages
// Includes BreadcrumbList, Service, AggregateRating, and FAQPage schemas

interface ReviewData {
  rating: number
  comment: string | null
  created_at: string
}

interface FallbackReview {
  rating: number
  comment: string
  date: string
  name: string
}

interface ProcessStep {
  step: number
  title: string
  timeline: string
  body: string
}

interface WhatsIncludedItem {
  title: string
  body: string
}

interface ServiceStructuredDataProps {
  serviceName: string
  serviceSlug: string
  description: string
  price: number // Ollvy fee in rupees
  govtFee?: number // Government fee in rupees
  category?: string
  avgRating?: number | null
  totalRatings?: number
  faqs?: { q: string; a: string }[]
  reviews?: ReviewData[]
  fallbackReviews?: FallbackReview[]
  // New props for additional rich results
  processSteps?: ProcessStep[]
  whatsIncluded?: WhatsIncludedItem[]
  slaDays?: number
}

export function ServiceStructuredData({
  serviceName,
  serviceSlug,
  description,
  price,
  govtFee,
  category = 'Professional Service',
  avgRating,
  totalRatings,
  faqs,
  reviews = [],
  fallbackReviews = [],
  processSteps = [],
  whatsIncluded = [],
  slaDays,
}: ServiceStructuredDataProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.ollvy.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.ollvy.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: serviceName,
        item: `https://www.ollvy.com/services/${serviceSlug}`,
      },
    ],
  }

  // Build offers with price specification if govt fee exists
  const offersSchema = govtFee
    ? {
        '@type': 'Offer',
        price: price + govtFee,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        priceSpecification: [
          {
            '@type': 'UnitPriceSpecification',
            price: price,
            priceCurrency: 'INR',
            name: 'Professional Fee',
          },
          {
            '@type': 'UnitPriceSpecification',
            price: govtFee,
            priceCurrency: 'INR',
            name: 'Government Fee',
          },
        ],
      }
    : {
        '@type': 'Offer',
        price: price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      }

  // Build review array for schema (real reviews or fallback)
  const reviewsForSchema = reviews.length > 0
    ? reviews.slice(0, 5).map(review => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Verified Customer' },
        datePublished: review.created_at.split('T')[0],
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating.toString(),
          bestRating: '5',
        },
        reviewBody: review.comment || '',
      }))
    : fallbackReviews.slice(0, 5).map(review => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: review.name },
        datePublished: review.date.includes('2026') ? '2026-03-01' : '2026-02-01',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating.toString(),
          bestRating: '5',
        },
        reviewBody: review.comment,
      }))

  // Build HowTo schema from process steps (for "how to" rich results)
  const howToSchema = processSteps.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to get ${serviceName} in India`,
    description: `Step-by-step process to complete ${serviceName} with Ollvy`,
    totalTime: slaDays ? `P${slaDays}D` : undefined, // ISO 8601 duration
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: govtFee ? price + govtFee : price,
    },
    step: processSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.body,
      ...(step.timeline ? { duration: step.timeline } : {}),
    })),
  } : null

  // Build hasOfferCatalog from whatsIncluded (shows what's included in the service)
  const offerCatalog = whatsIncluded.length > 0 ? {
    '@type': 'OfferCatalog',
    name: `What's included in ${serviceName}`,
    itemListElement: whatsIncluded.map((item, index) => ({
      '@type': 'Offer',
      position: index + 1,
      itemOffered: {
        '@type': 'Service',
        name: item.title,
        description: item.body,
      },
    })),
  } : null

  // Build service schema with optional aggregate rating
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    url: `https://www.ollvy.com/services/${serviceSlug}`,
    provider: {
      '@type': 'Organization',
      name: 'Ollvy',
      url: 'https://www.ollvy.com',
      logo: 'https://www.ollvy.com/logo.png',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    serviceType: category,
    offers: offersSchema,
    // Estimated duration in ISO 8601 format (P = period, D = days)
    ...(slaDays ? { estimatedDuration: `P${slaDays}D` } : {}),
    // Include what's included as offer catalog
    ...(offerCatalog ? { hasOfferCatalog: offerCatalog } : {}),
    // Include aggregate rating if we have enough reviews (10+)
    ...(avgRating && totalRatings && totalRatings >= 10
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avgRating,
            ratingCount: totalRatings,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    // Include individual reviews for rich results
    ...(reviewsForSchema.length > 0 ? { review: reviewsForSchema } : {}),
  }

  // Build FAQPage schema if FAQs exist
  const faqPageSchema =
    faqs && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
    </>
  )
}

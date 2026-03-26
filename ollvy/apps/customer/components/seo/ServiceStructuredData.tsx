// Structured Data for individual service pages
// Includes BreadcrumbList, Service, AggregateRating, and FAQPage schemas

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
    </>
  )
}

// Structured Data for individual service pages
// Includes BreadcrumbList and Service schema

interface ServiceStructuredDataProps {
  serviceName: string
  serviceSlug: string
  description: string
  price: number // in rupees
  category?: string
}

export function ServiceStructuredData({
  serviceName,
  serviceSlug,
  description,
  price,
  category = 'Professional Service',
}: ServiceStructuredDataProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ollvy.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://ollvy.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: serviceName,
        item: `https://ollvy.com/services/${serviceSlug}`,
      },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    url: `https://ollvy.com/services/${serviceSlug}`,
    provider: {
      '@type': 'Organization',
      name: 'Ollvy',
      url: 'https://ollvy.com',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    serviceType: category,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  }

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
    </>
  )
}

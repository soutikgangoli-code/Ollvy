import { Metadata } from 'next'
import { DeadlinePage } from '@/components/deadline/DeadlinePage'
import { getDeadlineBySlug, generateDeadlineFAQSchema } from '@/lib/deadlines'
import { notFound } from 'next/navigation'

const deadline = getDeadlineBySlug('itr-2026')

export const metadata: Metadata = deadline
  ? {
      title: deadline.seoTitle,
      description: deadline.seoDescription,
      alternates: {
        canonical: deadline.canonicalUrl,
      },
      openGraph: {
        title: deadline.seoTitle,
        description: deadline.seoDescription,
        url: deadline.canonicalUrl,
        siteName: 'Ollvy',
        images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: deadline.seoTitle,
        description: deadline.seoDescription,
        images: ['https://www.ollvy.com/logo.png'],
      },
    }
  : {}

export default function ITR2026Page() {
  if (!deadline) {
    notFound()
  }

  // JSON-LD structured data for SEO - server-rendered for Google crawlability
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: deadline.serviceName,
    description: deadline.seoDescription,
    provider: {
      '@type': 'Organization',
      name: 'Ollvy Technologies Private Limited',
      url: 'https://www.ollvy.com',
    },
    offers: {
      '@type': 'Offer',
      price: deadline.ollvyFee.toString(),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validThrough: deadline.dueDate,
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  }

  // BreadcrumbList schema for navigation
  const breadcrumbJsonLd = {
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
        name: 'Business ITR Filing 2026',
        item: 'https://www.ollvy.com/itr-2026',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {generateDeadlineFAQSchema(deadline) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateDeadlineFAQSchema(deadline)) }}
        />
      )}
      <DeadlinePage deadline={deadline} />
    </>
  )
}

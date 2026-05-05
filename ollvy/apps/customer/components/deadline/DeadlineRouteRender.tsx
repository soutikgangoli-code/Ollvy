import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DeadlinePage } from '@/components/deadline/DeadlinePage'
import {
  getDeadlineBySlug,
  getDeadlineWithLivePrice,
  generateDeadlineFAQSchema,
} from '@/lib/deadlines'

export function buildDeadlineMetadata(slug: string): Metadata {
  const d = getDeadlineBySlug(slug)
  if (!d) return {}
  return {
    title: d.seoTitle,
    description: d.seoDescription,
    alternates: { canonical: d.canonicalUrl },
    openGraph: {
      title: d.seoTitle,
      description: d.seoDescription,
      url: d.canonicalUrl,
      siteName: 'Ollvy',
      images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: d.seoTitle,
      description: d.seoDescription,
      images: ['https://www.ollvy.com/logo.png'],
    },
  }
}

export async function DeadlineRouteRender({ slug }: { slug: string }) {
  const deadline = await getDeadlineWithLivePrice(slug)
  if (!deadline) notFound()

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: deadline.serviceName,
    description: deadline.seoDescription,
    provider: {
      '@type': 'Organization',
      name: 'Ollvy Collective Private Limited',
      url: 'https://www.ollvy.com',
    },
    offers: {
      '@type': 'Offer',
      price: deadline.ollvyFee.toString(),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validThrough: deadline.dueDate,
    },
    areaServed: { '@type': 'Country', name: 'India' },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ollvy.com' },
      { '@type': 'ListItem', position: 2, name: deadline.serviceName, item: deadline.canonicalUrl },
    ],
  }

  const faqJsonLd = generateDeadlineFAQSchema(deadline)

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
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <DeadlinePage deadline={deadline} />
    </>
  )
}

import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getPackBySlug, getAllPackSlugs } from '@/lib/data/packs'
import { PackPage } from '@/components/pack/PackPage'
import Script from 'next/script'

export const revalidate = 3600

// Packs that have been converted to service pages - permanent redirects
const PACK_TO_SERVICE_REDIRECTS: Record<string, string> = {
  'cloud-kitchen-setup': '/services/cloud-kitchen-setup',
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPackSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  // Check for redirect first
  if (PACK_TO_SERVICE_REDIRECTS[slug]) {
    return {
      title: 'Redirecting... | Ollvy',
      robots: { index: false, follow: false },
    }
  }

  const pack = await getPackBySlug(slug)
  if (!pack) return { title: 'Not Found | Ollvy' }
  return {
    title: pack.seoTitle,
    description: pack.seoDescription,
    alternates: { canonical: pack.canonicalUrl },
    openGraph: {
      title: pack.seoTitle,
      description: pack.seoDescription,
      url: pack.canonicalUrl,
      siteName: 'Ollvy',
      type: 'website',
      images: [{ url: pack.metaImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pack.seoTitle,
      description: pack.seoDescription,
      images: [pack.metaImageUrl],
    },
  }
}

export default async function PackDetailPage({ params }: PageProps) {
  const { slug } = await params

  // Handle redirects for packs converted to service pages
  const redirectUrl = PACK_TO_SERVICE_REDIRECTS[slug]
  if (redirectUrl) {
    redirect(redirectUrl)
  }

  const pack = await getPackBySlug(slug)
  if (!pack) notFound()

  // JSON-LD - three schemas
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pack.name,
    description: pack.seoDescription,
    provider: { '@type': 'Organization', name: 'Ollvy', url: 'https://www.ollvy.com' },
    areaServed: 'IN',
    offers: {
      '@type': 'Offer',
      price: '33599',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '47',
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pack.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ollvy.com' },
      { '@type': 'ListItem', position: 2, name: 'Packs', item: 'https://www.ollvy.com/packs' },
      { '@type': 'ListItem', position: 3, name: pack.name, item: pack.canonicalUrl },
    ],
  }

  return (
    <>
      <Script id="pack-service-jsonld" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <Script id="pack-faq-jsonld" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="pack-breadcrumb-jsonld" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PackPage pack={pack} />
    </>
  )
}

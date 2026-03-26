import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LEARN_PAGES, LearnPageConfig } from '@/lib/learn/pages';
import { LearnPage } from '@/components/learn/LearnPage';
import { SERVICE_CONFIGS, ServiceConfig } from '@/lib/services';

interface Props {
  params: Promise<{ slug: string }>;
}

// Strip functions from objects for client component serialization
function stripFunctions<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function generateStaticParams() {
  return LEARN_PAGES.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = LEARN_PAGES.find(p => p.slug === slug);
  if (!page) return {};
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: page.canonicalUrl },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url: page.canonicalUrl,
      type: 'article',
      images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seoTitle,
      description: page.seoDescription,
      images: ['https://www.ollvy.com/logo.png'],
    },
  };
}

export default async function LearnPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = LEARN_PAGES.find(p => p.slug === slug);
  if (!page) notFound();

  const ctaService = SERVICE_CONFIGS.find(s => s.slug === page.ctaServiceSlug);
  if (!ctaService) notFound();

  const secondaryService = page.ctaSecondarySlug
    ? SERVICE_CONFIGS.find(s => s.slug === page.ctaSecondarySlug)
    : undefined;

  // Parse lastReviewed date (e.g., "March 2025") to ISO format
  const parseReviewDate = (dateStr: string): string => {
    const [month, year] = dateStr.split(' ');
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    return new Date(parseInt(year), monthIndex, 1).toISOString();
  };

  const reviewDateISO = parseReviewDate(page.lastReviewed);

  // Extract FAQs for separate FAQPage schema
  // First check page-level FAQs (new format), then fall back to sections (old format)
  const faqs = (page.faqs ?? page.sections
    .filter(s => s.componentSlot === 'faq-list')
    .flatMap(s => (s.componentProps?.faqs as Array<{q:string,a:string}> ?? []))
  ).slice(0, 10);

  // JSON-LD: Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.seoDescription,
    image: 'https://www.ollvy.com/logo.png',
    datePublished: reviewDateISO,
    dateModified: reviewDateISO,
    author: {
      '@type': 'Organization',
      name: 'Ollvy',
      url: 'https://www.ollvy.com',
      logo: 'https://www.ollvy.com/android-chrome-512x512.png',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ollvy Technologies Private Limited',
      url: 'https://www.ollvy.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.ollvy.com/android-chrome-512x512.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': page.canonicalUrl,
    },
  };

  // JSON-LD: BreadcrumbList schema (separate for cleaner structure)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.ollvy.com/learn' },
      { '@type': 'ListItem', position: 3, name: page.title, item: page.canonicalUrl },
    ],
  };

  // JSON-LD: FAQPage schema (only if FAQs exist)
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <LearnPage
        page={stripFunctions(page)}
        ctaService={stripFunctions(ctaService)}
        secondaryService={secondaryService ? stripFunctions(secondaryService) : undefined}
      />
    </>
  );
}

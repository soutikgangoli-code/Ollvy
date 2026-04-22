import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { LEARN_PAGES, LearnCategory } from '@/lib/guides/pages';
import { GuidesSearch, type GuideSearchEntry } from './guides-search';

/**
 * Build a minimal search index on the server so the full LEARN_PAGES config
 * (~480KB of sections, bullets, table schemas, componentProps etc.) never ships
 * to the client. We serialize only plain text + display metadata.
 */
function buildSearchIndex(): GuideSearchEntry[] {
  return LEARN_PAGES.map((p) => {
    const searchBlocks: { source: string; text: string }[] = [];

    for (const section of p.sections) {
      searchBlocks.push({ source: section.heading, text: section.body });
      const bullets = section.bullets || section.list || [];
      if (bullets.length > 0) {
        searchBlocks.push({ source: section.heading, text: bullets.join(' \n ') });
      }
    }

    if (p.faqs) {
      for (const faq of p.faqs) {
        searchBlocks.push({ source: 'FAQ', text: faq.q + ' ' + faq.a });
      }
    }

    return {
      slug: p.slug,
      title: p.title,
      seoDescription: p.seoDescription,
      category: p.category,
      lastReviewed: p.lastReviewed,
      toolType: p.tool?.type,
      searchBlocks,
    };
  });
}

export const metadata: Metadata = {
  title: 'Business Compliance Guides | Ollvy',
  description: 'Free guides to Indian business compliance. GST registration, Pvt Ltd vs LLP, DPIIT recognition, FSSAI licensing, and more. With interactive tools and calculators.',
  alternates: { canonical: 'https://www.ollvy.com/guides' },
  openGraph: {
    title: 'Business Compliance Guides | Ollvy',
    description: 'Free guides to Indian business compliance. GST, incorporation, licensing, and startup registration explained.',
    url: 'https://www.ollvy.com/guides',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Compliance Guides | Ollvy',
    description: 'Free guides to Indian business compliance. GST, incorporation, licensing, and startup registration explained.',
    images: ['https://www.ollvy.com/logo.png'],
  },
};

const CATEGORY_ORDER: LearnCategory[] = [
  'GST', 'Incorporation', 'Startup', 'Licensing', 'Tax', 'Compliance', 'Payroll', 'Registration',
  'TDS Filing', 'Income Tax Filing', 'ROC Filing', 'GST Filing',
  'GST Notice', 'Income Tax Notice', 'TDS Notice', 'ROC Notice',
];

const CATEGORY_LABELS: Record<LearnCategory, string> = {
  GST: 'GST',
  Incorporation: 'Company Registration',
  Startup: 'Startups',
  Licensing: 'Licensing',
  Tax: 'Tax',
  Compliance: 'Compliance',
  Payroll: 'Payroll',
  Registration: 'Registration',
  'TDS Filing': 'TDS Filing Deadlines',
  'Income Tax Filing': 'Income Tax Filing Deadlines',
  'ROC Filing': 'ROC Filing Deadlines',
  'GST Filing': 'GST Filing Deadlines',
  'GST Notice': 'GST Notices',
  'Income Tax Notice': 'Income Tax Notices',
  'TDS Notice': 'TDS Notices',
  'ROC Notice': 'ROC Notices',
};

export default function LearnIndexPage() {
  // Group pages by category
  const pagesByCategory = CATEGORY_ORDER.reduce((acc, category) => {
    const pages = LEARN_PAGES.filter(p => p.category === category);
    if (pages.length > 0) {
      acc[category] = pages;
    }
    return acc;
  }, {} as Record<LearnCategory, typeof LEARN_PAGES>);

  // JSON-LD: CollectionPage schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Business Compliance Guides',
    description: 'Free guides to Indian business compliance. GST registration, Pvt Ltd vs LLP, DPIIT recognition, FSSAI licensing, and more.',
    url: 'https://www.ollvy.com/guides',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: LEARN_PAGES.map((page, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: page.title,
        url: page.canonicalUrl,
        description: page.seoDescription,
      })),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ollvy',
      url: 'https://www.ollvy.com',
    },
  };

  // JSON-LD: BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.ollvy.com/guides' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="py-16 md:py-24">
        <div className="container max-w-5xl">

          {/* Header — centered, matches ToolPageWrapper */}
          <header className="mb-12 text-center">
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Guides
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6 tracking-tight">
              Business Compliance Guides
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Free, detailed guides with interactive tools, exact costs, and step-by-step processes. Sourced from official government portals.
            </p>
          </header>

          {/* SSR guide list for crawlers */}
          <div className="sr-only">
            {LEARN_PAGES.map(page => (
              <a key={page.slug} href={`/guides/${page.slug}`}>
                <h2>{page.title}</h2>
                <p>{page.seoDescription}</p>
              </a>
            ))}
          </div>

          {/* Client-side filterable guide list. Index built server-side to keep
              the full LEARN_PAGES configs out of the client bundle. */}
          <GuidesSearch entries={buildSearchIndex()} />
        </div>
      </div>
    </>
  );
}

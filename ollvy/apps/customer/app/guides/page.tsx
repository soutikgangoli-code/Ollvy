import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { LEARN_PAGES, LearnCategory } from '@/lib/guides/pages';

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
      <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-[900px] mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Business Compliance Guides
          </h1>

          <p className="text-base text-muted-foreground mt-4 max-w-[600px] leading-relaxed">
            Free, detailed guides to Indian business compliance. Each guide includes
            interactive tools, exact costs, and step-by-step processes. No filler.
            Sourced from official government portals.
          </p>
        </div>
      </section>

      {/* Guides by category */}
      <section className="max-w-[900px] mx-auto px-6 py-12">
        {Object.entries(pagesByCategory).map(([category, pages]) => (
          <div key={category} className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              {CATEGORY_LABELS[category as LearnCategory]}
            </h2>

            <div className="space-y-3">
              {pages.map(page => (
                <Link
                  key={page.slug}
                  href={`/guides/${page.slug}`}
                  className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-foreground/30 hover:bg-muted/10 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-foreground/90">
                      {page.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {page.seoDescription}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last reviewed: {page.lastReviewed}
                      {page.tool && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-xs">
                          Includes {page.tool.type === 'eligibility' ? 'eligibility checker' :
                            page.tool.type === 'penalty' ? 'penalty calculator' :
                            page.tool.type === 'comparison' ? 'decision tool' : 'deadline tracker'}
                        </span>
                      )}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground group-hover:text-foreground ml-4 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border">
        <div className="max-w-[900px] mx-auto px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Need help with a specific compliance issue?{' '}
            <Link href="/services" className="text-foreground underline hover:no-underline">
              Browse all services →
            </Link>
          </p>
        </div>
      </section>
      </div>
    </>
  );
}

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

  // JSON-LD: Article + FAQPage schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Ollvy',
      url: 'https://ollvy.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ollvy Technologies Private Limited',
      url: 'https://ollvy.com',
    },
    // FAQ schema — Google shows these as rich results
    mainEntity: page.sections
      .filter(s => s.componentSlot === 'faq-list')
      .flatMap(s => (s.componentProps?.faqs as Array<{q:string,a:string}> ?? []))
      .slice(0, 8)
      .map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://ollvy.com' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://ollvy.com/learn' },
        { '@type': 'ListItem', position: 3, name: page.title, item: page.canonicalUrl },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LearnPage
        page={stripFunctions(page)}
        ctaService={stripFunctions(ctaService)}
        secondaryService={secondaryService ? stripFunctions(secondaryService) : undefined}
      />
    </>
  );
}

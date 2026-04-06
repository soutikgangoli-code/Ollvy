// lib/tools/types.ts

export interface ToolFaq {
  q: string
  a: string
}

export interface ToolPageConfig {
  slug: string
  title: string               // H1
  seoTitle: string            // <title> tag
  seoDescription: string      // meta description - 150-160 chars
  canonicalUrl: string
  lastReviewed: string

  // Text rendered ABOVE the tool - Google reads this, not the JS widget
  // Must be 150+ words. Explains what the tool does, who it is for, what the numbers mean.
  intro: string

  // Text rendered BELOW the tool
  // How to interpret results, what to do next, caveats
  howToUse: string

  faqs: ToolFaq[]

  // Internal linking
  relatedServiceSlug: string          // primary CTA
  relatedServiceLabel: string         // e.g. "File GST Returns"
  relatedCalculatorSlugs?: string[]   // other calculators to link to
  relatedLearnSlug?: string           // guide page to link to

  // Breadcrumb: Tools > [category] > [title]
  category: string
}

/**
 * Generate FAQ JSON-LD schema from a ToolPageConfig
 */
export function generateToolFAQSchema(config: ToolPageConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

/**
 * Generate breadcrumb JSON-LD schema for tool pages
 */
export function generateToolBreadcrumbSchema(
  category: string,
  title: string,
  canonicalUrl: string
) {
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-')
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
      { '@type': 'ListItem', position: 3, name: category, item: `https://www.ollvy.com/tools/${categorySlug}` },
      { '@type': 'ListItem', position: 4, name: title, item: canonicalUrl },
    ],
  }
}

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

// lib/tools/types.ts

export interface ToolFaq {
  q: string
  a: string
}

export interface ReviewSource {
  name: string
  url: string
  description: string
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

  // Review sources - official government portals
  reviewSources?: ReviewSource[]

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
 * For penalty calculators: Tools > Penalty Calculators > [Name]
 */
export function generateToolBreadcrumbSchema(
  category: string,
  title: string,
  canonicalUrl: string
) {
  // Penalty calculators use /tools/penalty-calculator path
  const isPenaltyCalculator = canonicalUrl.includes('/penalty-calculator/')
  const categoryName = isPenaltyCalculator ? 'Penalty Calculators' : category
  const categoryPath = isPenaltyCalculator ? 'penalty-calculator' : category.toLowerCase().replace(/\s+/g, '-')

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Tools', item: 'https://www.ollvy.com/tools' },
      { '@type': 'ListItem', position: 2, name: categoryName, item: `https://www.ollvy.com/tools/${categoryPath}` },
      { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl },
    ],
  }
}

/**
 * Generate SoftwareApplication JSON-LD schema for calculator tools
 * Google shows this as a "Software" card in search results
 */
export function generateSoftwareApplicationSchema(config: ToolPageConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.title,
    description: config.seoDescription,
    url: config.canonicalUrl,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    provider: {
      '@type': 'Organization',
      name: 'Ollvy',
      url: 'https://www.ollvy.com',
    },
  }
}

/**
 * Generate HowTo JSON-LD schema from howToUse text
 * Parses the howToUse content to extract steps
 */
export function generateToolHowToSchema(config: ToolPageConfig) {
  // Parse howToUse text to extract steps
  // Look for lines starting with ** (bold headers) as step titles
  const lines = config.howToUse.split('\n').filter(Boolean)
  const steps: { name: string; text: string }[] = []

  let currentStep: { name: string; text: string } | null = null

  for (const line of lines) {
    // Check for bold header like **Step Title:**
    const headerMatch = line.match(/^\*\*(.+?):\*\*\s*(.*)/)
    if (headerMatch) {
      // Save previous step if exists
      if (currentStep) {
        steps.push(currentStep)
      }
      currentStep = {
        name: headerMatch[1].trim(),
        text: headerMatch[2]?.trim() || '',
      }
    } else if (currentStep) {
      // Append to current step text
      const cleanLine = line.startsWith('- ') ? line.slice(2) : line
      currentStep.text += (currentStep.text ? ' ' : '') + cleanLine.trim()
    }
  }

  // Don't forget the last step
  if (currentStep) {
    steps.push(currentStep)
  }

  // If no structured steps found, return null
  if (steps.length === 0) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use the ${config.title}`,
    description: `Step-by-step guide to using the ${config.title} on Ollvy`,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

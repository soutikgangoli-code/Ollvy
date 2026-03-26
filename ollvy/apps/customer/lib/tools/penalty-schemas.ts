// lib/tools/penalty-schemas.ts
// JSON-LD Schema generators for penalty calculator pages

import { PenaltyPageContent } from './penalty-content'

export function generateFAQSchema(content: PenaltyPageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.additionalFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateHowToSchema(content: PenaltyPageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: content.howToCalculate.title,
    step: content.howToCalculate.steps.map(s => ({
      '@type': 'HowToStep',
      name: s.title,
      text: s.description,
    })),
  }
}

export function generateBreadcrumbSchema(slug: string, title: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ollvy.com' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
      { '@type': 'ListItem', position: 3, name: 'Penalty Calculator', item: 'https://www.ollvy.com/tools/penalty-calculator' },
      { '@type': 'ListItem', position: 4, name: title, item: `https://www.ollvy.com/tools/penalty-calculator/${slug}` },
    ],
  }
}

import type { DocumentPageContent } from '@/lib/tools/document-content'

interface DocumentFAQSectionProps {
  content: DocumentPageContent
}

export function DocumentFAQSection({ content }: DocumentFAQSectionProps) {
  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {content.faqs.map((faq) => (
          <div key={faq.question} className="border-b border-border pb-6 last:border-0 last:pb-0">
            <h3 className="font-medium text-foreground mb-2">{faq.question}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Generate FAQPage JSON-LD schema
export function generateFAQSchema(content: DocumentPageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

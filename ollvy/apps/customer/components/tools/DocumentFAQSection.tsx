import type { DocumentPageContent } from '@/lib/tools/document-content'

interface DocumentFAQSectionProps {
  content: DocumentPageContent
  sectionNumber?: string
}

export function DocumentFAQSection({ content, sectionNumber }: DocumentFAQSectionProps) {
  return (
    <div className="mt-12">
      <div className="flex items-baseline gap-3 mb-6">
        {sectionNumber && (
          <span className="font-mono text-[10px] text-muted-foreground">{sectionNumber}</span>
        )}
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Frequently Asked Questions
        </h2>
      </div>
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

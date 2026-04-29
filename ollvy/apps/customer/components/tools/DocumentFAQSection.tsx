import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { DocumentPageContent } from '@/lib/tools/document-content'
import type { ToolPageConfig } from '@/lib/tools/types'

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
      <Accordion type="single" collapsible className="space-y-0">
        {content.faqs.map((faq, i) => (
          <AccordionItem
            key={faq.question}
            value={`faq-${i}`}
            className="border-b border-border last:border-0"
          >
            <AccordionTrigger className="text-sm font-medium text-foreground text-left py-4 hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

// Generate FAQPage JSON-LD schema (single content source — kept for any callers that
// only render the editorial FAQ list).
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

// Document checklist pages render two visible FAQ blocks (editorial DocumentFAQSection +
// "More Questions" ToolFAQSection). Google's rich-result rules allow only one FAQPage per
// page; emit a single merged schema covering both sets to avoid the "Duplicate field
// 'FAQPage'" validation error.
export function generateMergedDocFAQSchema(
  content: DocumentPageContent,
  config: ToolPageConfig,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      ...content.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
      ...config.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    ],
  }
}

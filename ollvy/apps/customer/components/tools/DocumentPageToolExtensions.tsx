import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { ToolPageConfig } from '@/lib/tools/types'

/**
 * Renders the intro section from ToolPageConfig for document checklist pages
 * Placed at the very top of the page, above the existing content
 */
export function ToolIntroSection({ text }: { text: string }) {
  const paragraphs = text.split('\n\n').filter(Boolean)

  return (
    <section className="mb-10">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-mono text-[10px] text-muted-foreground">00</span>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Overview
        </h2>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}

/**
 * CTA link displayed after the intro section
 */
export function ToolIntroCTA({ config }: { config: ToolPageConfig }) {
  return (
    <div className="mb-12 flex items-center gap-2">
      <Link
        href={`/services/${config.relatedServiceSlug}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {config.relatedServiceLabel}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

/**
 * FAQ section from ToolPageConfig, placed at the very bottom of document pages
 */
export function ToolFAQSection({ faqs, sectionNumber }: { faqs: ToolPageConfig['faqs']; sectionNumber?: string }) {
  return (
    <section className="mt-16 max-w-3xl">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-mono text-[10px] text-muted-foreground">{sectionNumber || '07'}</span>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          More Questions
        </h2>
      </div>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-border/50 pb-6 last:border-0">
            <h3 className="font-medium text-foreground mb-2">{faq.q}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

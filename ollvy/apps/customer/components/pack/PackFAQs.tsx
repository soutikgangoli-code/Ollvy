'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { PackFAQ } from '@/lib/data/packs/cloud-kitchen'

export function PackFAQs({ faqs }: { faqs: PackFAQ[] }) {
  return (
    <div>
      <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
        FAQS
      </p>
      <h2 className="font-mono uppercase tracking-wider text-2xl text-foreground">
        COMMON QUESTIONS
      </h2>

      <Accordion type="multiple" className="mt-8 space-y-0 max-w-3xl">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border-b border-border last:border-0"
          >
            <AccordionTrigger className="text-sm font-medium text-foreground text-left py-4 hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

'use client'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { PackDocumentGroup } from '@/lib/data/packs/cloud-kitchen'

const PRIORITY_COLORS: Record<string, string> = {
  required: 'bg-red-500',
  within7days: 'bg-amber-500',
  ollvyprovides: 'bg-green-500',
}

export function PackDocuments({ groups }: { groups: PackDocumentGroup[] }) {
  // Flatten all documents for display
  const allDocuments = groups.flatMap((g) => g.documents)

  return (
    <div>
      <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
        DOCUMENTS
      </p>
      <h2 className="font-mono uppercase tracking-wider text-2xl text-foreground">
        WHAT YOU NEED TO PROVIDE
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        8 documents from you. The rest Ollvy prepares.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs text-muted-foreground">Required at booking</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-xs text-muted-foreground">Within 7 days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">Ollvy provides</span>
        </div>
      </div>

      {/* Accordion */}
      <Accordion type="multiple" className="mt-8 space-y-0">
        {allDocuments.map((doc, i) => (
          <AccordionItem
            key={i}
            value={`doc-${i}`}
            className="border-b border-border last:border-0"
          >
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                {/* Priority dot */}
                <div
                  className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    PRIORITY_COLORS[doc.priority]
                  )}
                />

                {/* Name + note */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">
                      {doc.name}
                    </span>
                    {doc.ollvyProvides && (
                      <span className="rounded-full text-xs px-2 py-0.5 uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20">
                        OLLVY PROVIDES
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {doc.note}
                  </p>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-6">
              <div className="grid md:grid-cols-3 gap-6 pt-2">
                {/* What is it */}
                <div>
                  <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
                    WHAT IS IT
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {doc.whatIsIt}
                  </p>
                </div>

                {/* How to get it */}
                <div>
                  <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
                    HOW TO GET IT
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {doc.howToGet}
                  </p>
                </div>

                {/* Common issues */}
                <div>
                  <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
                    COMMON ISSUES
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {doc.commonIssues}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

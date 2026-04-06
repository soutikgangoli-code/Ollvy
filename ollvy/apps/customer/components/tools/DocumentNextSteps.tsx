import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { DocumentPageContent } from '@/lib/tools/document-content'

interface DocumentNextStepsProps {
  content: DocumentPageContent
  sectionNumber?: string
}

export function DocumentNextSteps({ content, sectionNumber }: DocumentNextStepsProps) {
  if (!content.nextSteps || content.nextSteps.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <div className="flex items-baseline gap-3 mb-4">
        {sectionNumber && (
          <span className="font-mono text-[10px] text-muted-foreground">{sectionNumber}</span>
        )}
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Related services</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {content.nextSteps.map((step, index) => (
          <Link
            key={index}
            href={step.href}
            className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-emerald-500/50 hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {step.title}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}

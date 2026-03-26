import type { DocumentPageContent } from '@/lib/tools/document-content'

interface DocumentStepsProps {
  content: DocumentPageContent
}

export function DocumentSteps({ content }: DocumentStepsProps) {
  return (
    <div className="mb-12">
      {/* Section header */}
      <div className="mb-4">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] text-muted-foreground">02</span>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Step-by-step process
          </h2>
        </div>
      </div>

      {/* Steps list */}
      <div className="space-y-2">
        {content.steps.map((step, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border border-border/50 bg-card hover:border-border hover:bg-muted/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted border border-border/50 flex items-center justify-center shrink-0">
                <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import type { DocumentPageContent } from '@/lib/tools/document-content'

interface DocumentStepsProps {
  content: DocumentPageContent
}

export function DocumentSteps({ content }: DocumentStepsProps) {
  return (
    <div className="mb-12">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Step-by-step process
      </h2>
      <div className="space-y-4">
        {content.steps.map((step, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 rounded-xl border border-border bg-card"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {index + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

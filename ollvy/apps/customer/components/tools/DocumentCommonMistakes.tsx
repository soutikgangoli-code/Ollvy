import { AlertTriangle } from 'lucide-react'
import type { DocumentPageContent } from '@/lib/tools/document-content'

interface DocumentCommonMistakesProps {
  content: DocumentPageContent
}

export function DocumentCommonMistakes({ content }: DocumentCommonMistakesProps) {
  if (!content.commonMistakes || content.commonMistakes.length === 0) {
    return null
  }

  return (
    <div className="mt-12 p-6 rounded-xl border border-amber-500/30 dark:border-amber-500/20 bg-amber-500/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Common mistakes to avoid</h2>
      </div>
      <ul className="space-y-3">
        {content.commonMistakes.map((mistake, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="font-mono text-xs text-amber-600 dark:text-amber-500 mt-0.5">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-sm text-muted-foreground">{mistake}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { Clock, IndianRupee, CheckCircle2 } from 'lucide-react'
import type { DocumentPageContent } from '@/lib/tools/document-content'

interface DocumentPageIntroProps {
  content: DocumentPageContent
}

export function DocumentPageIntro({ content }: DocumentPageIntroProps) {
  return (
    <div className="mb-12 space-y-8">
      {/* Main description */}
      <div className="prose prose-sm max-w-none text-muted-foreground">
        {content.intro.description.split('\n\n').map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Info cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Timeline */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Timeline
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground">{content.intro.timeline}</p>
        </div>

        {/* Cost */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <IndianRupee className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Cost
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground">{content.intro.cost}</p>
        </div>
      </div>

      {/* Who needs this */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Who needs {content.slug.includes('itr') ? 'to file' : 'this'}?
        </h2>
        <ul className="space-y-3">
          {content.intro.whoNeeds.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

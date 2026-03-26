import { Clock, IndianRupee, CheckCircle2 } from 'lucide-react'
import type { DocumentPageContent } from '@/lib/tools/document-content'

interface DocumentPageIntroProps {
  content: DocumentPageContent
}

export function DocumentPageIntro({ content }: DocumentPageIntroProps) {
  return (
    <div className="mb-12 space-y-10">
      {/* Main description */}
      <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
        {content.intro.description.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {/* Stats - Timeline & Cost */}
      <div className="flex items-stretch gap-8">
        <div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Timeline
          </p>
          <p className="font-mono text-lg font-semibold text-foreground">{content.intro.timeline}</p>
        </div>
        <div className="w-px bg-border/50" />
        <div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
            <IndianRupee className="h-3 w-3" />
            Cost
          </p>
          <div className="space-y-0.5">
            {content.intro.cost.split('|').map((part, index) => (
              <p key={index} className="font-mono text-sm text-foreground">
                {part.trim()}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Who needs this */}
      <div>
        <div className="mb-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] text-muted-foreground">01</span>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Who needs {content.slug.includes('itr') ? 'to file' : 'this'}?
            </h2>
          </div>
        </div>

        <div className="space-y-2">
          {content.intro.whoNeeds.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-border/50 bg-card hover:border-border hover:bg-muted/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted border border-border/50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0 pt-2.5">
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

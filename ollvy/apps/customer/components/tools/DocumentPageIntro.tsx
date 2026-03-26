import { Clock, IndianRupee, CheckCircle2 } from 'lucide-react'
import type { DocumentPageContent } from '@/lib/tools/document-content'

interface DocumentPageIntroProps {
  content: DocumentPageContent
}

// Parse timeline string like "7-15 working days" or "18-36 months for full registration | TM symbol..."
function parseTimeline(timeline: string) {
  // Split by pipe first for multiple parts
  const parts = timeline.split('|').map(p => p.trim())
  const mainPart = parts[0]

  // Extract number/range and unit from main part
  // Matches patterns like "7-15 working days", "1-3 days", "18-36 months"
  const match = mainPart.match(/^([\d-]+)\s*(.+)$/)

  if (match) {
    return {
      number: match[1],
      unit: match[2],
      note: parts.length > 1 ? parts.slice(1).join(' | ') : null
    }
  }

  return { number: null, unit: mainPart, note: parts.length > 1 ? parts.slice(1).join(' | ') : null }
}

export function DocumentPageIntro({ content }: DocumentPageIntroProps) {
  const timeline = parseTimeline(content.intro.timeline)

  return (
    <div className="mb-12 space-y-10">
      {/* Main description */}
      <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
        {content.intro.description.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {/* Stats - Timeline & Cost */}
      <div className="grid grid-cols-4 border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-r border-border">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Timeline
          </p>
          <div>
            {timeline.number ? (
              <>
                <p className="font-mono text-3xl font-semibold text-foreground">{timeline.number}</p>
                <p className="font-mono text-sm text-muted-foreground mt-1">{timeline.unit}</p>
              </>
            ) : (
              <p className="font-mono text-sm text-foreground">{timeline.unit}</p>
            )}
            {timeline.note && (
              <p className="font-mono text-xs text-muted-foreground mt-2">{timeline.note}</p>
            )}
          </div>
        </div>
        <div className="col-span-3 p-6">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
            <IndianRupee className="h-3 w-3" />
            Cost
          </p>
          <div className="space-y-1">
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

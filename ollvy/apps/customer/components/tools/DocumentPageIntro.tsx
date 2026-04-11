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

/**
 * Timeline and Government Fee bar - shown at top of document pages
 */
export function DocumentTimelineCost({ content }: DocumentPageIntroProps) {
  const timeline = parseTimeline(content.intro.timeline)

  return (
    <div className="mb-10">
      <div className="grid grid-cols-[35%_1px_1fr] gap-6">
        <div>
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
        <div className="bg-border" />
        <div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
            <IndianRupee className="h-3 w-3" />
            Government Fee
          </p>
          <div className="space-y-1">
            {content.intro.cost.split('|')
              .filter(part => part.toLowerCase().includes('government'))
              .map((part, index) => (
                <p key={index} className="font-mono text-sm text-foreground">
                  {part.trim().replace(/^Government fee:\s*/i, '')}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Editorial intro text - describes the service/process
 * Styled to match penalty calculator SEO sections
 */
export function DocumentEditorialIntro({ content }: DocumentPageIntroProps) {
  const paragraphs = content.intro.description.split('\n\n')

  return (
    <div className="mb-10 p-6 rounded-xl border border-border bg-muted/30">
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  )
}

/**
 * "Who needs this" section
 */
export function DocumentWhoNeedsThis({ content, sectionNumber = '01' }: DocumentPageIntroProps & { sectionNumber?: string }) {
  return (
    <div className="mb-10">
      <div className="mb-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] text-muted-foreground">{sectionNumber}</span>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Who needs {content.slug.includes('itr') ? 'to file' : 'this'}?
          </h2>
        </div>
      </div>

      <div className="space-y-1.5">
        {content.intro.whoNeeds.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-xl border border-border/50 bg-card hover:border-border hover:bg-muted/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted border border-border/50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0 pt-1.5">
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Combined component for backward compatibility - includes all sections
 * @deprecated Use individual components (DocumentTimelineCost, DocumentEditorialIntro, DocumentWhoNeedsThis) instead
 */
export function DocumentPageIntro({ content }: DocumentPageIntroProps) {
  return (
    <div className="mb-12 space-y-10">
      <DocumentEditorialIntro content={content} />
      <DocumentTimelineCost content={content} />
      <DocumentWhoNeedsThis content={content} />
    </div>
  )
}

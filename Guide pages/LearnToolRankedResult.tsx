'use client'

import { cn } from '@/lib/utils'
import { CheckCircle2, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react'
import type { ToolRanking, RelevanceLevel, UrgencyLevel } from '@/lib/guides/types/tool-ranking'

// ─── Shared utilities ─────────────────────────────────────────────────────────

const RELEVANCE_COLORS: Record<RelevanceLevel, string> = {
  high:   'text-emerald-600 dark:text-emerald-400',
  medium: 'text-amber-600 dark:text-amber-400',
  low:    'text-muted-foreground',
}

const URGENCY_BG: Record<UrgencyLevel, string> = {
  critical: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
  high:     'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
  medium:   'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  low:      'bg-muted border-border',
}

const URGENCY_BAR: Record<UrgencyLevel, string> = {
  critical: 'bg-red-500',
  high:     'bg-amber-500',
  medium:   'bg-blue-500',
  low:      'bg-muted-foreground',
}

const RELEVANCE_DOTS: Record<RelevanceLevel, number> = {
  high: 3, medium: 2, low: 1,
}

// ─── Comparison (Pvt Ltd vs LLP) ─────────────────────────────────────────────

function ComparisonRanking({ options }: { options: NonNullable<ToolRanking['comparison']> }) {
  const sorted = [...options].sort((a, b) => b.score - a.score)

  return (
    <div className="mt-4 space-y-4">
      {sorted.map((option) => (
        <div
          key={option.label}
          className={cn(
            'rounded-lg border p-4',
            option.isWinner
              ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30'
              : 'border-border bg-card'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {option.isWinner && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
              <span className="font-semibold text-sm text-foreground">{option.label}</span>
            </div>
            <span className={cn('text-sm font-mono font-semibold', option.isWinner ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')}>
              {option.score}/100
            </span>
          </div>

          {/* Score bar */}
          <div className="h-1.5 w-full rounded-full bg-muted mb-3">
            <div
              className={cn('h-1.5 rounded-full transition-all', option.isWinner ? 'bg-emerald-500' : 'bg-muted-foreground/40')}
              style={{ width: `${option.score}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground mb-3 italic">{option.verdict}</p>

          <div className="space-y-1.5">
            {option.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={cn(
                  'mt-0.5 h-1.5 w-1.5 rounded-full flex-shrink-0',
                  r.impact === 'high' ? 'bg-emerald-500' :
                  r.impact === 'medium' ? 'bg-amber-500' : 'bg-muted-foreground'
                )} />
                <span className="text-muted-foreground">{r.text}</span>
              </div>
            ))}
            {option.warnings?.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Urgency Score (Trademark) ────────────────────────────────────────────────

function UrgencyRanking({ urgency }: { urgency: NonNullable<ToolRanking['urgency']> }) {
  return (
    <div className={cn('mt-4 rounded-lg border p-4', URGENCY_BG[urgency.level])}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-sm text-foreground">Urgency Score</span>
        <span className="font-mono font-semibold text-sm">{urgency.score}/100</span>
      </div>

      <div className="h-2 w-full rounded-full bg-muted/50 mb-1">
        <div
          className={cn('h-2 rounded-full transition-all', URGENCY_BAR[urgency.level])}
          style={{ width: `${urgency.score}%` }}
        />
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide mb-3 mt-2 text-foreground">
        {urgency.label}
      </p>

      <div className="space-y-1.5">
        {urgency.factors
          .sort((a, b) => b.points - a.points)
          .map((f, i) => (
            <div key={i} className="flex items-start justify-between gap-3 text-xs">
              <span className="text-muted-foreground">{f.text}</span>
              <span className="font-mono text-foreground flex-shrink-0">+{f.points}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

// ─── Benefits Ranking (MSME, DPIIT) ──────────────────────────────────────────

function BenefitsRanking({ benefits }: { benefits: NonNullable<ToolRanking['benefits']> }) {
  const sorted = [...benefits].sort((a, b) => {
    const order: Record<string, number> = { high: 0, medium: 1, low: 2 }
    return order[a.relevance] - order[b.relevance]
  })

  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Benefits ranked for your situation</p>
      {sorted.map((benefit, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
          <div className="flex gap-0.5 mt-0.5 flex-shrink-0">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  dot <= RELEVANCE_DOTS[benefit.relevance]
                    ? benefit.relevance === 'high' ? 'bg-emerald-500'
                      : benefit.relevance === 'medium' ? 'bg-amber-500' : 'bg-muted-foreground'
                    : 'bg-muted'
                )}
              />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-medium text-foreground">{benefit.label}</span>
              <span className={cn('text-[10px] font-semibold uppercase tracking-wide', RELEVANCE_COLORS[benefit.relevance])}>
                {benefit.relevance}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{benefit.description}</p>
            <p className="text-xs text-muted-foreground/70 mt-0.5 italic">{benefit.reason}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Form Assignment (ITR) ────────────────────────────────────────────────────

function FormAssignmentRanking({ assignment }: { assignment: NonNullable<ToolRanking['assignment']> }) {
  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-3 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <div>
          <p className="font-semibold text-foreground">Use {assignment.form}</p>
          <p className="text-sm text-muted-foreground">{assignment.reason}</p>
        </div>
      </div>

      {assignment.eliminated.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Why not the other forms</p>
          {assignment.eliminated.map((e, i) => (
            <div key={i} className="flex items-start gap-2 text-xs p-2.5 rounded border border-border bg-card">
              <span className="font-mono font-semibold text-muted-foreground flex-shrink-0 w-12">{e.form}</span>
              <span className="text-muted-foreground">{e.why}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface LearnToolRankedResultProps {
  headline: string
  body: string
  ranking: ToolRanking
  ctaLabel?: string
  ctaHref?: string
}

export function LearnToolRankedResult({ headline, body, ranking, ctaLabel, ctaHref }: LearnToolRankedResultProps) {
  return (
    <div>
      <div className="mb-3">
        <p className="font-semibold text-foreground">{headline}</p>
        {body && <p className="text-sm text-muted-foreground mt-1">{body}</p>}
      </div>

      {ranking.type === 'comparison' && ranking.comparison && (
        <ComparisonRanking options={ranking.comparison} />
      )}
      {ranking.type === 'urgency' && ranking.urgency && (
        <UrgencyRanking urgency={ranking.urgency} />
      )}
      {ranking.type === 'benefits' && ranking.benefits && (
        <BenefitsRanking benefits={ranking.benefits} />
      )}
      {ranking.type === 'form-assignment' && ranking.assignment && (
        <FormAssignmentRanking assignment={ranking.assignment} />
      )}

      {ctaLabel && ctaHref && (
        <a
          href={ctaHref}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  )
}

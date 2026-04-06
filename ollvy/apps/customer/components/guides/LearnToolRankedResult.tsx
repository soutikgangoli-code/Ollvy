'use client'

import type {
  ToolRanking,
  ComparisonRanking,
  UrgencyRanking,
  BenefitsRanking,
  FormAssignmentRanking,
} from '@/lib/guides/types/tool-ranking'
import { cn } from '@/lib/utils'

interface Props {
  ranking: ToolRanking
}

/**
 * Renders rich ranking/scoring results from the EligibilityTool.
 *
 * Supports:
 * - Comparison (Pvt Ltd vs LLP with scores and reasons)
 * - Urgency (trademark registration with score bar)
 * - Benefits (MSME/DPIIT benefits ranked by relevance)
 * - Form assignment (ITR form with eliminated alternatives)
 */
export function LearnToolRankedResult({ ranking }: Props) {
  switch (ranking.type) {
    case 'comparison':
      return <ComparisonResult ranking={ranking} />
    case 'urgency':
      return <UrgencyResult ranking={ranking} />
    case 'benefits':
      return <BenefitsResult ranking={ranking} />
    case 'form-assignment':
      return <FormAssignmentResult ranking={ranking} />
    default:
      return null
  }
}


// ─── COMPARISON RESULT ─────────────────────────────────────────────────────────

function ComparisonResult({ ranking }: { ranking: ComparisonRanking }) {
  return (
    <div className="mt-4 space-y-4">
      {ranking.comparison.map((option, i) => (
        <div
          key={i}
          className={cn(
            'rounded-lg border p-4',
            option.isWinner
              ? 'border-primary bg-primary/5'
              : 'border-border bg-muted/30'
          )}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">{option.label}</h4>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-lg font-bold',
                  option.isWinner ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {option.score}/100
              </span>
              {option.isWinner && (
                <span className="rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  Best fit
                </span>
              )}
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{option.verdict}</p>

          {option.reasons.length > 0 && (
            <ul className="mt-3 space-y-1">
              {option.reasons.map((reason, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <span
                    className={cn(
                      'mt-1 h-1.5 w-1.5 shrink-0 rounded-full',
                      reason.impact === 'high'
                        ? 'bg-primary'
                        : reason.impact === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-muted-foreground'
                    )}
                  />
                  <span className="text-muted-foreground">{reason.text}</span>
                </li>
              ))}
            </ul>
          )}

          {option.warnings && option.warnings.length > 0 && (
            <div className="mt-3 rounded bg-destructive/10 px-3 py-2">
              {option.warnings.map((warning, j) => (
                <p key={j} className="text-sm text-destructive">
                  {warning}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


// ─── URGENCY RESULT ────────────────────────────────────────────────────────────

function UrgencyResult({ ranking }: { ranking: UrgencyRanking }) {
  const { urgency } = ranking
  const percentage = Math.round((urgency.score / urgency.maxScore) * 100)

  const levelColors: Record<string, string> = {
    critical: 'bg-destructive',
    high: 'bg-amber-500',
    moderate: 'bg-amber-400',
    low: 'bg-muted-foreground',
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Score bar */}
      <div>
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Urgency Score</span>
          <span className="font-bold text-foreground">
            {urgency.score}/{urgency.maxScore}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn('h-full transition-all', levelColors[urgency.level])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Factors */}
      {urgency.factors.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-foreground">
            Contributing factors
          </h4>
          <ul className="space-y-1">
            {urgency.factors.map((factor, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{factor.text}</span>
                <span className="font-medium text-foreground">
                  +{factor.points}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


// ─── BENEFITS RESULT ───────────────────────────────────────────────────────────

function BenefitsResult({ ranking }: { ranking: BenefitsRanking }) {
  const { benefits } = ranking

  // Sort by relevance: high > medium > low
  const sorted = [...benefits].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.relevance] - order[b.relevance]
  })

  const relevanceStyles: Record<string, { badge: string; border: string }> = {
    high: {
      badge: 'bg-primary text-primary-foreground',
      border: 'border-primary/30',
    },
    medium: {
      badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
      border: 'border-amber-500/30',
    },
    low: {
      badge: 'bg-muted text-muted-foreground',
      border: 'border-border',
    },
  }

  return (
    <div className="mt-4 space-y-3">
      {sorted.map((benefit, i) => (
        <div
          key={i}
          className={cn(
            'rounded-lg border p-3',
            relevanceStyles[benefit.relevance].border
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-foreground">{benefit.label}</h4>
            <span
              className={cn(
                'shrink-0 rounded px-2 py-0.5 text-xs font-medium',
                relevanceStyles[benefit.relevance].badge
              )}
            >
              {benefit.relevance === 'high'
                ? 'High relevance'
                : benefit.relevance === 'medium'
                  ? 'Medium'
                  : 'Lower relevance'}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {benefit.description}
          </p>
          <p className="mt-2 text-sm italic text-muted-foreground">
            {benefit.reason}
          </p>
        </div>
      ))}
    </div>
  )
}


// ─── FORM ASSIGNMENT RESULT ────────────────────────────────────────────────────

function FormAssignmentResult({ ranking }: { ranking: FormAssignmentRanking }) {
  const { assignment } = ranking

  return (
    <div className="mt-4 space-y-4">
      {/* Assigned form */}
      <div className="rounded-lg border border-primary bg-primary/5 p-4">
        <div className="flex items-center gap-2">
          <span className="rounded bg-primary px-2 py-1 text-sm font-bold text-primary-foreground">
            {assignment.form}
          </span>
          <span className="text-sm font-medium text-foreground">
            is the correct form for you
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{assignment.reason}</p>
      </div>

      {/* Eliminated forms */}
      {assignment.eliminated.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-foreground">
            Why not other forms?
          </h4>
          <ul className="space-y-2">
            {assignment.eliminated.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="shrink-0 font-medium text-muted-foreground line-through">
                  {item.form}
                </span>
                <span className="text-muted-foreground">{item.why}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

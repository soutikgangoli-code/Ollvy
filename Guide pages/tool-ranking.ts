// lib/guides/types/tool-ranking.ts
// Extended result types for guide tools that rank/score rather than binary yes/no

export type RelevanceLevel = 'high' | 'medium' | 'low'
export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low'

export interface ComparisonOption {
  label: string
  score: number         // 0-100 normalised
  isWinner: boolean
  verdict: string       // one line - "Best fit for your situation" / "Viable but not ideal"
  reasons: {
    text: string
    impact: 'high' | 'medium' | 'low'
  }[]
  warnings?: string[]   // reasons this option is problematic for their situation
}

export interface UrgencyScore {
  score: number         // 0-100
  level: UrgencyLevel
  label: string         // "Register Now" / "Register Within 30 Days" / "Set a Timeline" / "Not Urgent"
  factors: {
    text: string
    points: number
  }[]
}

export interface RankedBenefit {
  label: string
  relevance: RelevanceLevel
  reason: string        // why this is high/medium/low relevance FOR THIS USER specifically
  description: string   // one line of what the benefit actually does
}

export interface ToolRanking {
  type: 'comparison' | 'urgency' | 'benefits' | 'form-assignment'

  // for comparison type (Guide 2: Pvt Ltd vs LLP)
  comparison?: ComparisonOption[]

  // for urgency type (Guide 4: Trademark)
  urgency?: UrgencyScore

  // for benefits type (Guides 9, 10: MSME, DPIIT)
  benefits?: RankedBenefit[]

  // for form-assignment type (Guide 12: ITR Form)
  assignment?: {
    form: string                          // "ITR-3"
    reason: string                        // Why this form, one line
    eliminated: { form: string; why: string }[]  // Why other forms don't apply
  }
}

// Extend the base EligibilityResult to optionally include ranking data
// This extends whatever EligibilityResult interface exists in your codebase
export interface RankedEligibilityResult {
  type: string
  headline: string
  body: string
  ctaLabel?: string
  ctaHref?: string
  ranking?: ToolRanking
}

// Urgency level boundaries for trademark and similar tools
export const URGENCY_LEVELS: Record<UrgencyLevel, { min: number; label: string; description: string }> = {
  critical: { min: 80, label: 'Register Now', description: 'Your brand is at real risk without registration.' },
  high:     { min: 60, label: 'Register Within 30 Days', description: 'Growing exposure without protection.' },
  medium:   { min: 35, label: 'Register Within 3 Months', description: 'Set a concrete timeline.' },
  low:      { min: 0,  label: 'Not Urgent Right Now', description: 'Register before you start marketing.' },
}

export function getUrgencyLevel(score: number): UrgencyLevel {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 35) return 'medium'
  return 'low'
}

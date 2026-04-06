/**
 * Types for ranked/scored tool results
 *
 * These types enable the EligibilityTool to return richer results:
 * - Comparison results (Pvt Ltd vs LLP with scores)
 * - Urgency scores (trademark registration urgency)
 * - Benefit rankings (MSME, DPIIT benefits)
 * - Form assignment (ITR form selection with eliminated alternatives)
 */

// ─── URGENCY LEVELS ────────────────────────────────────────────────────────────

export type UrgencyLevel = 'critical' | 'high' | 'moderate' | 'low'

export const URGENCY_LEVELS: Record<UrgencyLevel, { label: string; description: string }> = {
  critical: {
    label: 'Register immediately.',
    description: 'Your brand is at serious risk. Every day without registration is a day someone can file before you.',
  },
  high: {
    label: 'Register this month.',
    description: 'You have real brand exposure. The cost is Rs. 4,500 for small entities - the protection is worth far more.',
  },
  moderate: {
    label: 'Register within 3-6 months.',
    description: 'Not urgent today, but set a firm timeline. Register before your next big marketing push.',
  },
  low: {
    label: 'Not urgent right now.',
    description: 'Your brand exposure is minimal. Revisit when you start investing in marketing.',
  },
}

export function getUrgencyLevel(score: number): UrgencyLevel {
  if (score >= 75) return 'critical'
  if (score >= 50) return 'high'
  if (score >= 30) return 'moderate'
  return 'low'
}


// ─── RANKING RESULT TYPES ──────────────────────────────────────────────────────

/** Comparison ranking - e.g. Pvt Ltd vs LLP with scores */
export interface ComparisonRanking {
  type: 'comparison'
  comparison: Array<{
    label: string
    score: number
    isWinner: boolean
    verdict: string
    reasons: Array<{ text: string; impact: 'high' | 'medium' | 'low' }>
    warnings?: string[]
  }>
}

/** Urgency ranking - e.g. trademark registration urgency score */
export interface UrgencyRanking {
  type: 'urgency'
  urgency: {
    score: number
    maxScore: number
    level: UrgencyLevel
    label: string
    factors: Array<{ text: string; points: number }>
  }
}

/** Benefits ranking - e.g. MSME or DPIIT benefits ranked by relevance */
export interface BenefitsRanking {
  type: 'benefits'
  benefits: Array<{
    label: string
    description: string
    relevance: 'high' | 'medium' | 'low'
    reason: string
  }>
}

/** Form assignment - e.g. ITR form selection with eliminated alternatives */
export interface FormAssignmentRanking {
  type: 'form-assignment'
  assignment: {
    form: string
    reason: string
    eliminated: Array<{ form: string; why: string }>
  }
}

/** Union of all ranking types */
export type ToolRanking =
  | ComparisonRanking
  | UrgencyRanking
  | BenefitsRanking
  | FormAssignmentRanking

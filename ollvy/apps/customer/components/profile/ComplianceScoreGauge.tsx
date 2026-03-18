'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ComplianceScoreGaugeProps {
  score: number
  upcomingDeadlines: number
  overdueCount?: number
}

export function ComplianceScoreGauge({
  score,
  upcomingDeadlines,
  overdueCount = 0,
}: ComplianceScoreGaugeProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-[hsl(var(--ollvy-green))]'
    if (s >= 60) return 'text-amber-500'
    return 'text-destructive'
  }

  const getScoreBgColor = (s: number) => {
    if (s >= 80) return 'bg-[hsl(var(--ollvy-green))]/20'
    if (s >= 60) return 'bg-amber-500/20'
    return 'bg-destructive/20'
  }

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Excellent'
    if (s >= 60) return 'Good'
    if (s >= 40) return 'At Risk'
    return 'Needs Attention'
  }

  // SVG gauge parameters
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Compliance Score</h3>

        {/* Circular Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={cn('transition-all duration-500', getScoreColor(score))}
              />
            </svg>
            {/* Score in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('font-mono text-2xl font-bold', getScoreColor(score))}>
                {score}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>

          <div className="flex-1">
            <p className={cn('font-medium', getScoreColor(score))}>
              {getScoreLabel(score)}
            </p>
            <div className="mt-2 space-y-1.5">
              {upcomingDeadlines > 0 && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  {upcomingDeadlines} deadline{upcomingDeadlines > 1 ? 's' : ''} this month
                </p>
              )}
              {overdueCount > 0 && (
                <p className="text-sm text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {overdueCount} overdue
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Link to compliance page */}
        <Link href="/compliance">
          <Button variant="ghost" size="sm" className="w-full mt-4 gap-2 text-muted-foreground">
            View Compliance Calendar
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, Calendar, FileUp, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardOrderCardProps {
  orderId: string
  orderNumber: string
  serviceName: string
  status: string
  currentStage?: string
  progress: number
  dueDate?: string
  documentsNeeded?: number
  questionnaireCompleted?: boolean
  isRetainer?: boolean
  nextCycleDate?: string
}

export function DashboardOrderCard({
  orderId,
  orderNumber,
  serviceName,
  status,
  currentStage,
  progress,
  dueDate,
  documentsNeeded,
  questionnaireCompleted,
  isRetainer,
  nextCycleDate,
}: DashboardOrderCardProps) {
  // Determine the actual status label based on questionnaire and documents
  const getStatusLabel = () => {
    const hasDocsPending = documentsNeeded && documentsNeeded > 0
    const hasQuestionsPending = questionnaireCompleted === false

    if (hasQuestionsPending && hasDocsPending) {
      return 'Questions & Documents Pending'
    }
    if (hasDocsPending) {
      return 'Documents Pending'
    }
    if (hasQuestionsPending) {
      return 'Questions Pending'
    }

    // Default status labels
    const labels: Record<string, string> = {
      pending_assignment: 'Pending Assignment',
      in_progress: 'In Progress',
      completed: 'Completed',
      waitlisted: 'Waitlisted',
    }
    return labels[status] || status
  }

  // Determine display stage
  const getDisplayStage = () => {
    const hasDocsPending = documentsNeeded && documentsNeeded > 0
    const hasQuestionsPending = questionnaireCompleted === false

    if (hasQuestionsPending && hasDocsPending) {
      return 'Questions and Documents Pending'
    }
    if (hasDocsPending) {
      return 'Documents Pending'
    }
    if (hasQuestionsPending) {
      return 'Questions Pending'
    }
    return currentStage || 'Processing'
  }

  const statusColors: Record<string, string> = {
    pending_assignment: 'text-amber-600 dark:text-amber-400',
    in_progress: 'text-blue-600 dark:text-blue-400',
    completed: 'text-[hsl(var(--ollvy-green))]',
    waitlisted: 'text-muted-foreground',
  }

  // Use amber color if there's pending work from user
  const hasUserPendingWork = (documentsNeeded && documentsNeeded > 0) || questionnaireCompleted === false
  const statusColor = hasUserPendingWork ? 'text-amber-600 dark:text-amber-400' : statusColors[status]

  return (
    <Card className="border-border hover:border-muted-foreground/50 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground truncate">{serviceName}</h3>
            <p className="text-sm text-muted-foreground font-mono">{orderNumber}</p>
          </div>
          <span className={cn('text-xs font-medium', statusColor)}>
            {getStatusLabel()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground font-mono text-xs">
              {getDisplayStage()}
            </span>
            <span className="font-mono text-xs text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          {documentsNeeded && documentsNeeded > 0 && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <FileUp className="h-3.5 w-3.5" />
              {documentsNeeded} docs needed
            </span>
          )}
          {dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Due: {dueDate}
            </span>
          )}
          {isRetainer && nextCycleDate && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Next: {nextCycleDate}
            </span>
          )}
        </div>

        {/* Action */}
        <Link href={`/orders/${orderId}`}>
          <Button variant="outline" size="sm" className="w-full gap-2">
            View Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

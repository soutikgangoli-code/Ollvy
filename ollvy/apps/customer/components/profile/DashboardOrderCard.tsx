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
  workDocsPending?: number
  workDocsRejected?: number
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
  workDocsPending,
  workDocsRejected,
  isRetainer,
  nextCycleDate,
}: DashboardOrderCardProps) {
  // Check for pending work from user
  const hasQuestionsPending = questionnaireCompleted === false
  const hasInitialDocsPending = documentsNeeded !== undefined && documentsNeeded > 0
  const hasWorkDocsPending = workDocsPending !== undefined && workDocsPending > 0
  const hasWorkDocsRejected = workDocsRejected !== undefined && workDocsRejected > 0

  // Determine the actual status label based on current state
  const getStatusLabel = () => {
    // Priority: Rejected > Pending work docs > Initial docs > Questionnaire
    if (hasWorkDocsRejected) {
      return 'Documents Rejected'
    }
    if (hasWorkDocsPending) {
      return 'Work Documents Pending'
    }
    if (hasQuestionsPending && hasInitialDocsPending) {
      return 'Questions & Documents Pending'
    }
    if (hasInitialDocsPending) {
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
    if (hasWorkDocsRejected) {
      return `${workDocsRejected} Document${workDocsRejected > 1 ? 's' : ''} Rejected`
    }
    if (hasWorkDocsPending) {
      return `${workDocsPending} Work Doc${workDocsPending > 1 ? 's' : ''} Pending`
    }
    if (hasQuestionsPending && hasInitialDocsPending) {
      return 'Questions and Documents Pending'
    }
    if (hasInitialDocsPending) {
      return `${documentsNeeded} Document${documentsNeeded! > 1 ? 's' : ''} Pending`
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

  // Determine status color based on urgency
  const getStatusColor = () => {
    if (hasWorkDocsRejected) return 'text-red-600 dark:text-red-400'
    if (hasWorkDocsPending || hasInitialDocsPending || hasQuestionsPending) return 'text-amber-600 dark:text-amber-400'
    return statusColors[status] || 'text-muted-foreground'
  }

  const statusColor = getStatusColor()

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
        <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground mb-4">
          {hasWorkDocsRejected && (
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <FileUp className="h-3.5 w-3.5" />
              {workDocsRejected} rejected
            </span>
          )}
          {hasWorkDocsPending && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <FileUp className="h-3.5 w-3.5" />
              {workDocsPending} work docs needed
            </span>
          )}
          {hasInitialDocsPending && (
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

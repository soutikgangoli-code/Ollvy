'use client'

import { differenceInDays, isPast, format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { getGuaranteedDate } from '@/lib/dates'

interface DeadlineCountdownProps {
  dueDate: string
  postDeadlineMessage: string
  urgencyLine: string
  penaltyLine: string
  variant: 'hero' | 'footer'
}

interface GuaranteedBadgeProps {
  slaDays: number
}

function getUrgencyStyle(daysLeft: number, isPastDeadline: boolean) {
  if (isPastDeadline) return 'text-red-400'
  if (daysLeft <= 7) return 'text-ollvy-amber'
  return 'text-muted-foreground'
}

function getUrgencyText(daysLeft: number, isPastDeadline: boolean, postDeadlineMessage: string, urgencyLine: string) {
  if (isPastDeadline) return postDeadlineMessage
  if (daysLeft === 0) return 'Due today - file now'
  if (daysLeft <= 7) return `${daysLeft} days left - Urgency is real`
  if (daysLeft <= 30) return `${daysLeft} days left - File now, CAs are filling up fast this season`
  return `${daysLeft} days left - ${urgencyLine}`
}

export function DeadlineCountdown({ dueDate, postDeadlineMessage, urgencyLine, penaltyLine, variant }: DeadlineCountdownProps) {
  const dueDateObj = new Date(dueDate)
  const isPastDeadline = isPast(dueDateObj)
  const daysLeft = differenceInDays(dueDateObj, new Date())

  if (variant === 'footer') {
    return (
      <p className={`text-sm mt-3 ${getUrgencyStyle(daysLeft, isPastDeadline)}`}>
        {isPastDeadline ? penaltyLine : `Due ${format(dueDateObj, 'MMMM d, yyyy')}`}
      </p>
    )
  }

  return (
    <p className={`text-sm mt-3 ${getUrgencyStyle(daysLeft, isPastDeadline)}`}>
      {getUrgencyText(daysLeft, isPastDeadline, postDeadlineMessage, urgencyLine)}
    </p>
  )
}

export function GuaranteedBadge({ slaDays }: GuaranteedBadgeProps) {
  const guaranteedDate = getGuaranteedDate(slaDays)

  if (!guaranteedDate) return null

  return (
    <Badge
      className="bg-ollvy-green/10 text-ollvy-green border border-ollvy-green/20"
      aria-label={`Guaranteed by ${guaranteedDate}`}
    >
      Guaranteed by {guaranteedDate}
    </Badge>
  )
}

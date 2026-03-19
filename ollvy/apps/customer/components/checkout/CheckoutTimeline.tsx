'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Check, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { addBusinessDays, format } from 'date-fns'

interface CheckoutTimelineProps {
  slaDays: number
  serviceName?: string
  className?: string
}

interface TimelineStep {
  label: string
  description: string
  dateRange: string
  isGovtWait?: boolean
  isCompletion?: boolean
}

export function CheckoutTimeline({ slaDays, serviceName, className }: CheckoutTimelineProps) {
  const timeline = useMemo(() => {
    if (!slaDays || slaDays <= 0) return []

    const today = new Date()
    const bufferDays = 7 // Safety buffer
    const totalDays = slaDays + bufferDays

    // Calculate key milestone dates
    const assignmentDate = addBusinessDays(today, 1)
    const reviewDate = addBusinessDays(today, Math.min(3, Math.floor(totalDays * 0.2)))
    const filingDate = addBusinessDays(today, Math.min(5, Math.floor(totalDays * 0.4)))
    const completionDate = addBusinessDays(today, totalDays)

    const steps: TimelineStep[] = [
      {
        label: 'CA Assigned',
        description: 'Your documents reviewed by a verified professional',
        dateRange: format(assignmentDate, 'MMMM do'),
      },
      {
        label: 'Documents Verified',
        description: 'Any mismatches or issues flagged before filing',
        dateRange: format(reviewDate, 'MMMM do'),
      },
      {
        label: 'Application Filed',
        description: 'Submitted to government portal for processing',
        dateRange: format(filingDate, 'MMMM do'),
        isGovtWait: true,
      },
      {
        label: 'Registration Complete',
        description: 'Certificate or GSTIN issued to you',
        dateRange: format(completionDate, 'MMMM do'),
        isCompletion: true,
      },
    ]

    return steps
  }, [slaDays])

  if (timeline.length === 0) {
    return null
  }

  return (
    <Card className={cn('border-border', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-base">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          Your Timeline
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Projected dates from when you submit documents
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          {timeline.map((step, index) => (
            <div key={index} className="relative pb-6 last:pb-0">
              {/* Vertical connecting line */}
              {index < timeline.length - 1 && (
                <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-border" />
              )}

              <div className="flex gap-4">
                {/* Timeline dot */}
                <div className="relative flex-shrink-0">
                  {step.isCompletion ? (
                    <div className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))] flex items-center justify-center">
                      <Check className="h-3 w-3 text-[hsl(var(--ollvy-green-fg))]" />
                    </div>
                  ) : step.isGovtWait ? (
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <Clock className="h-3 w-3 text-amber-950" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 bg-background" />
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-medium text-foreground">
                      {step.dateRange}
                    </span>
                    {step.isGovtWait && (
                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">
                        Govt processing
                      </Badge>
                    )}
                    {step.isCompletion && (
                      <Badge variant="secondary" className="bg-[hsl(var(--ollvy-green))]/10 text-[hsl(var(--ollvy-green))] border-[hsl(var(--ollvy-green))]/20 text-xs">
                        Completion
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {step.label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

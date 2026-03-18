import { Check, Clock, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrderStageHistory, WorkflowStage } from '@/lib/types'

interface OrderTimelineProps {
  stages: WorkflowStage[]
  stageHistory: OrderStageHistory[]
}

export function OrderTimeline({ stages, stageHistory }: OrderTimelineProps) {
  const completedStages = new Map(
    stageHistory.map((h) => [h.stage_key, h])
  )

  const currentStageIndex = stages.findIndex(
    (stage) => !completedStages.has(stage.stage_key)
  )

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const history = completedStages.get(stage.stage_key)
        const isCompleted = !!history?.completed_at
        const isCurrent = index === currentStageIndex
        const isUpcoming = index > currentStageIndex && currentStageIndex !== -1

        return (
          <div key={stage.stage_key} className="flex gap-4">
            {/* Icon */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                  isCompleted
                    ? 'bg-foreground/20 text-foreground'
                    : isCurrent
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              {index < stages.length - 1 && (
                <div
                  className={cn(
                    'w-px flex-1 mt-2 min-h-[24px]',
                    isCompleted ? 'bg-foreground/20' : 'bg-border'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <h4
                className={cn(
                  'font-medium',
                  isCompleted
                    ? 'text-foreground/80'
                    : isCurrent
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {stage.stage_name}
              </h4>

              <p className="text-sm text-muted-foreground mt-1">
                {isCompleted && history?.completed_at
                  ? `Completed on ${new Date(history.completed_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}`
                  : isCurrent && history?.due_at
                  ? `Due by ${new Date(history.due_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}`
                  : `${stage.sla_working_days} working days`}
              </p>

              {history?.sla_breached && (
                <p className="text-xs text-muted-foreground mt-1 bg-muted inline-block px-2 py-0.5 rounded">
                  SLA breached
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

import { Check, Clock, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrderStageHistory, WorkflowDisplayStage } from '@/lib/types'

interface OrderTimelineProps {
  stages: WorkflowDisplayStage[]
  stageHistory: OrderStageHistory[]
}

export function OrderTimeline({ stages, stageHistory }: OrderTimelineProps) {
  // Map stage history by step number (using index + 1)
  const completedByStep = new Map(
    stageHistory.map((h, idx) => [idx + 1, h])
  )

  // Also try to match by stage_key to step mapping
  const stageKeyToStep = new Map(
    stages.map((s, idx) => [s.title.toLowerCase().replace(/\s+/g, '_'), idx + 1])
  )

  const completedStages = new Map<number, OrderStageHistory>()
  stageHistory.forEach((h) => {
    const stepFromKey = stageKeyToStep.get(h.stage_key)
    if (stepFromKey) {
      completedStages.set(stepFromKey, h)
    }
  })

  // Find current stage - first stage without completion
  const currentStageIndex = stages.findIndex(
    (stage) => !completedStages.has(stage.step)
  )

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const history = completedStages.get(stage.step)
        const isCompleted = !!history?.completed_at
        const isCurrent = index === currentStageIndex
        const isUpcoming = index > currentStageIndex && currentStageIndex !== -1

        return (
          <div key={stage.step} className="flex gap-4">
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
                {stage.title}
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
                  : stage.timeline}
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

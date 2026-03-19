'use client'

import { Progress } from '@/components/ui/progress'

interface QuestionnaireProgressProps {
  currentStep: number
  totalSteps: number
  stepTitle?: string
}

export function QuestionnaireProgress({
  currentStep,
  totalSteps,
  stepTitle,
}: QuestionnaireProgressProps) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0

  return (
    <div className="w-full space-y-3">
      {/* Step Info */}
      <div className="flex items-center justify-between">
        <div>
          {stepTitle && (
            <p className="text-sm font-medium text-foreground">{stepTitle}</p>
          )}
          <p className="text-xs text-muted-foreground font-mono">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
        <span className="text-2xl font-semibold text-foreground font-mono">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-1.5" />
    </div>
  )
}

'use client'

import { cn } from '@/lib/utils'

interface CheckoutStepperProps {
  currentStep: number
  className?: string
}

const steps = [
  { number: '01', label: 'Review & Pay' },
  { number: '02', label: 'Upload Documents' },
  { number: '03', label: 'Track Progress' },
]

export function CheckoutStepper({ currentStep = 1, className }: CheckoutStepperProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step circle and label */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                  index + 1 <= currentStep
                    ? 'bg-[hsl(var(--ollvy-green))] border-[hsl(var(--ollvy-green))] text-white'
                    : 'bg-transparent border-border text-muted-foreground'
                )}
              >
                {step.number}
              </div>
              <span
                className={cn(
                  'text-sm font-medium hidden sm:block',
                  index + 1 <= currentStep ? 'text-[hsl(var(--ollvy-green-fg))]' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={cn(
                    'h-0.5 w-full',
                    index + 1 < currentStep ? 'bg-[hsl(var(--ollvy-green))]' : 'bg-border'
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Helper text */}
      <p className="text-sm text-muted-foreground">
        You'll upload documents in Step 2, after payment. No documents needed to proceed.
      </p>
    </div>
  )
}

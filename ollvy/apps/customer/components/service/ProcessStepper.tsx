'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload,
  ClipboardList,
  Calendar,
} from 'lucide-react'
import { DBProcessStep } from '@/lib/data/services'
import { Button } from '@/components/ui/button'

const STEP_ICONS = {
  checklist: ClipboardList,
  upload: Upload,
  form: FileText,
  calendar: Calendar,
  stamp: CheckCircle,
}

interface ProcessStepperProps {
  steps: DBProcessStep[]
  serviceId?: string
  serviceSlug?: string
  priceVariesByState?: boolean
}

// Services where govt fees vary based on questionnaire answers
const QUESTIONNAIRE_BASED_SERVICES = [
  'trademark-registration',
  'pvt-ltd-incorporation',
  'llp-incorporation',
]

export function ProcessStepper({ steps, serviceId, serviceSlug, priceVariesByState }: ProcessStepperProps) {
  const [active, setActive] = useState(0)

  const step = steps[active]
  const Icon = STEP_ICONS[step.visual ?? 'form']

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {/* Progress track */}
      <div className="relative h-12 bg-background border-b border-border flex items-center px-6">
        {/* Track line */}
        <div className="absolute left-6 right-6 h-px bg-border top-1/2 -translate-y-1/2" />
        {/* Step dots */}
        <div className="relative flex justify-between w-full">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'w-3 h-3 rounded-full border-2 transition-all duration-200',
                i < active
                  ? 'bg-[hsl(var(--ollvy-green))] border-[hsl(var(--ollvy-green))]'
                  : i === active
                    ? 'bg-background border-foreground scale-125'
                    : 'bg-background border-border hover:border-foreground/40'
              )}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div
        key={active}
        className="p-4 sm:p-8 min-h-[220px] sm:min-h-[280px] flex flex-col"
      >
        {/* Step icon */}
        <div
          className={cn(
            'w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 sm:mb-5',
            step.isCompletion
              ? 'bg-[hsl(var(--ollvy-green))]/15 text-[hsl(var(--ollvy-green))]'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <Icon size={18} />
        </div>

        {/* Title + timeline */}
        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug">
            {step.title}
          </h3>
          <span className="shrink-0 text-xs text-muted-foreground border border-border rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono">
            {step.timeline}
          </span>
        </div>

        {/* Body */}
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {step.body}
        </p>

        {/* Milestone */}
        {step.milestone && (
          <div className="mt-3 sm:mt-4 flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full shrink-0',
                step.isCompletion
                  ? 'bg-[hsl(var(--ollvy-green))]'
                  : 'bg-muted-foreground'
              )}
            />
            <p className="text-xs text-muted-foreground">
              {step.isCompletion ? '✓ ' : ''}
              {step.milestone}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between px-4 pb-4 sm:px-8 sm:pb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActive((prev) => Math.max(0, prev - 1))}
          disabled={active === 0}
          className="gap-1.5"
        >
          <ChevronLeft size={14} />
          Previous Step
        </Button>
        {active < steps.length - 1 ? (
          <Button
            size="sm"
            onClick={() =>
              setActive((prev) => Math.min(steps.length - 1, prev + 1))
            }
            className="gap-1.5"
          >
            Next Step
            <ChevronRight size={14} />
          </Button>
        ) : (
          <Button size="sm" asChild>
            <Link href={(() => {
              if (!serviceId) return '/services'
              if (priceVariesByState) return `/quote/request/${serviceId}`
              // Always go through eligibility first - it handles redirect if no questions
              return `/checkout/${serviceId}/eligibility`
            })()} prefetch={true}>
              Start Application →
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

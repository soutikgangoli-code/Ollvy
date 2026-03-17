'use client'

import { useState } from 'react'
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
import { motion, AnimatePresence } from 'framer-motion'

const STEP_ICONS = {
  checklist: ClipboardList,
  upload: Upload,
  form: FileText,
  calendar: Calendar,
  stamp: CheckCircle,
}

export function ProcessStepper({ steps }: { steps: DBProcessStep[] }) {
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
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="p-8 min-h-[280px] flex flex-col"
        >
          {/* Step icon */}
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center mb-5',
              step.isCompletion
                ? 'bg-[hsl(var(--ollvy-green))]/15 text-[hsl(var(--ollvy-green))]'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Icon size={18} />
          </div>

          {/* Title + timeline */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-lg font-semibold text-foreground leading-snug">
              {step.title}
            </h3>
            <span className="shrink-0 text-xs text-muted-foreground border border-border rounded-full px-2.5 py-1 font-mono">
              {step.timeline}
            </span>
          </div>

          {/* Body */}
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {step.body}
          </p>

          {/* Milestone */}
          {step.milestone && (
            <div className="mt-4 flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2.5">
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
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between px-8 pb-6">
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
            <a href="#book">Book this service →</a>
          </Button>
        )}
      </div>
    </div>
  )
}

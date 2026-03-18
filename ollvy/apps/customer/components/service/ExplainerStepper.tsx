'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Scale,
  Sparkles,
  Shield,
  AlertTriangle,
} from 'lucide-react'
import { DBServiceExplainerStep } from '@/lib/data/services'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

// Step icon mapping
const EXPLAINER_ICONS = {
  info: Info,
  scale: Scale,
  sparkles: Sparkles,
  shield: Shield,
  alert: AlertTriangle,
} as const

interface ExplainerStepperProps {
  serviceName: string
  steps: DBServiceExplainerStep[]
}

export function ExplainerStepper({ serviceName, steps }: ExplainerStepperProps) {
  const [active, setActive] = useState(0)

  if (!steps || steps.length === 0) return null

  const step = steps[active]
  const Icon = EXPLAINER_ICONS[step.visual ?? 'info']

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden mt-6">
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
          className="p-8 min-h-[240px] flex flex-col"
        >
          {/* Step icon */}
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center mb-5',
              step.visual === 'alert'
                ? 'bg-[hsl(var(--ollvy-amber))]/15 text-[hsl(var(--ollvy-amber))]'
                : step.visual === 'sparkles' || step.visual === 'shield'
                  ? 'bg-[hsl(var(--ollvy-green))]/15 text-[hsl(var(--ollvy-green))]'
                  : 'bg-muted text-muted-foreground'
            )}
          >
            <Icon size={18} />
          </div>

          {/* Title + step badge */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-lg font-semibold text-foreground leading-snug">
              {step.title}
            </h3>
            <span className="shrink-0 text-xs text-muted-foreground border border-border rounded-full px-2.5 py-1 font-mono">
              Step {step.step} of {steps.length}
            </span>
          </div>

          {/* Body */}
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {step.body}
          </p>
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
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() =>
            setActive((prev) => Math.min(steps.length - 1, prev + 1))
          }
          disabled={active === steps.length - 1}
          className="gap-1.5"
        >
          Next
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}

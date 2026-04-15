'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getClient } from '@/lib/supabase'
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

  // Prefetch checkout service data on CTA hover
  const prefetchedRef = useRef(false)
  const prefetchCheckout = useCallback(() => {
    if (prefetchedRef.current || !serviceSlug) return
    prefetchedRef.current = true
    const supabase = getClient()
    supabase.from('service_packages').select('*').eq('slug', serviceSlug).single()
  }, [serviceSlug])

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {/* Step numbers track */}
      <div className="flex items-center gap-0 border-b border-border bg-muted/30">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'flex-1 py-3 text-center text-xs font-mono font-medium transition-all duration-200 relative',
              i === active
                ? 'text-foreground bg-background shadow-sm z-10'
                : i < active
                  ? 'text-[hsl(var(--ollvy-green-fg))]'
                  : 'text-muted-foreground/50 hover:text-muted-foreground'
            )}
            aria-label={`Step ${i + 1}`}
          >
            <span className={cn(
              'inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold transition-all',
              i === active
                ? 'bg-[hsl(var(--ollvy-green))]/15 text-[hsl(var(--ollvy-green-fg))]'
                : i < active
                  ? 'bg-[hsl(var(--ollvy-green))]/10 text-[hsl(var(--ollvy-green-fg))]'
                  : 'bg-muted text-muted-foreground'
            )}>
              {i < active ? '✓' : i + 1}
            </span>
            {/* Active indicator bar */}
            {i === active && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--ollvy-green))]/40" />
            )}
          </button>
        ))}
      </div>

      {/* All step content for SEO — sr-only, always in DOM */}
      <div className="sr-only">
        {steps.map((s, i) => (
          <div key={`seo-${i}`}>
            <h3>Step {s.step}: {s.title}</h3>
            <p>{s.body}</p>
            {s.milestone && <p>Milestone: {s.milestone}</p>}
          </div>
        ))}
      </div>

      {/* Step content — only active one visible */}
      {steps.map((s, i) => {
        const StepIcon = STEP_ICONS[s.visual ?? 'form']
        return (
          <div
            key={i}
            className={cn(
              'p-5 sm:p-8 min-h-[220px] sm:min-h-[280px] flex flex-col',
              i !== active && 'hidden'
            )}
          >
            {/* Step icon + timeline badge row */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div
                className={cn(
                  'w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center',
                  s.isCompletion
                    ? 'bg-[hsl(var(--ollvy-green))]/15 text-[hsl(var(--ollvy-green))]'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <StepIcon size={18} />
              </div>
              <span className={cn(
                'text-xs border rounded-full px-3 py-1 font-mono',
                s.isCompletion
                  ? 'border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 text-[hsl(var(--ollvy-green-fg))]'
                  : 'border-border text-muted-foreground'
              )}>
                {s.timeline}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-xl font-semibold text-foreground leading-snug mb-2 sm:mb-3">
              {s.title}
            </h3>

            {/* Body */}
            {s.body.includes('\n') ? (
              <ul className="text-sm text-muted-foreground leading-relaxed flex-1 list-disc list-inside space-y-1">
                {s.body.split('\n').filter(Boolean).map((line, li) => (
                  <li key={li}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {s.body}
              </p>
            )}

            {/* Milestone */}
            {s.milestone && (
              <div className={cn(
                'mt-3 sm:mt-5 flex items-center gap-2 sm:gap-2.5 rounded-lg px-3 sm:px-3.5 py-2 sm:py-2.5 border',
                s.isCompletion
                  ? 'bg-[hsl(var(--ollvy-green))]/5 border-[hsl(var(--ollvy-green))]/20'
                  : 'bg-muted/30 border-border'
              )}>
                <div
                  className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    s.isCompletion
                      ? 'bg-[hsl(var(--ollvy-green))]'
                      : 'bg-muted-foreground/40'
                  )}
                />
                <p className={cn(
                  'text-xs',
                  s.isCompletion ? 'text-[hsl(var(--ollvy-green-fg))] font-medium' : 'text-muted-foreground'
                )}>
                  {s.isCompletion ? '✓ ' : ''}
                  {s.milestone}
                </p>
              </div>
            )}
          </div>
        )
      })}

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
          <Button size="sm" asChild onMouseEnter={prefetchCheckout} onTouchStart={prefetchCheckout}>
            <Link href={(() => {
              if (!serviceId) return '/services'
              if (priceVariesByState) return `/quote/request/${serviceId}`
              if (serviceSlug && QUESTIONNAIRE_BASED_SERVICES.includes(serviceSlug)) return `/checkout/${serviceId}/eligibility`
              return `/checkout/${serviceId}`
            })()} prefetch={true}>
              {serviceSlug && QUESTIONNAIRE_BASED_SERVICES.includes(serviceSlug)
                ? 'Check Eligibility & Price →'
                : 'Start Application →'}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

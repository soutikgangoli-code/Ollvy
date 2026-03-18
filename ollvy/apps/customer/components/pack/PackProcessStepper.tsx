import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'

type Step = {
  day: string
  title: string
  detail: string
  isActive?: boolean
}

export function PackProcessStepper({ steps }: { steps: Step[] }) {
  return (
    <div>
      <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
        HOW IT WORKS
      </p>
      <h2 className="font-mono uppercase tracking-wider text-2xl text-foreground">
        ALL 4 SERVICES FILED SIMULTANEOUSLY
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        You are not waiting for one to finish before the next starts.
      </p>

      {/* Timeline */}
      <div className="mt-12">

        {/* Desktop: horizontal */}
        <div className="hidden md:flex items-start gap-0">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-center text-center relative">
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="absolute top-4 left-1/2 right-0 h-px bg-border" />
              )}
              {/* Node */}
              <div className={cn(
                'w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 bg-background',
                step.isActive
                  ? 'border-[hsl(var(--ollvy-green))] ring-4 ring-[hsl(var(--ollvy-green))]/20'
                  : 'border-border'
              )}>
                <span className={cn(
                  'font-mono text-xs',
                  step.isActive ? 'text-[hsl(var(--ollvy-green))]' : 'text-muted-foreground'
                )}>
                  {i + 1}
                </span>
              </div>
              {/* Content */}
              <div className="mt-4 px-2">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  {step.day}
                </p>
                <p className="text-sm font-medium text-foreground mt-1">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-[140px] mx-auto">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4 relative pb-8 last:pb-0">
              {/* Vertical line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
              )}
              {/* Node */}
              <div className={cn(
                'w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 bg-background z-10',
                step.isActive
                  ? 'border-[hsl(var(--ollvy-green))]'
                  : 'border-border'
              )}>
                <span className={cn(
                  'font-mono text-xs',
                  step.isActive ? 'text-[hsl(var(--ollvy-green))]' : 'text-muted-foreground'
                )}>
                  {i + 1}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1 pb-2">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  {step.day}
                </p>
                <p className="text-sm font-medium text-foreground mt-0.5">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="mt-8 border border-border rounded-2xl px-6 py-4 flex items-start gap-3">
        <Info size={16} className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          FSSAI State License is the longest process (30-45 days) because it requires a physical inspection. The other 3 services complete within the first 7-30 days. Your Swiggy listing date is determined by FSSAI - everything else is ready before that.
        </p>
      </div>
    </div>
  )
}

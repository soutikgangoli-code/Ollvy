'use client'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPaisa } from '@/lib/data/packs'
import type { ServiceInPack } from '@/lib/data/packs/cloud-kitchen'

export function PackBuilder({
  services,
  selectedIds,
  onToggle,
}: {
  services: ServiceInPack[]
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div>
      <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
        WHAT'S IN YOUR PACK
      </p>
      <h2 className="font-mono uppercase tracking-wider text-2xl text-foreground">
        4 LICENSES - ALL REQUIRED
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        Uncheck anything you've already done. Price updates.
      </p>

      <div className="space-y-4 mt-8">
        {services.map((service) => {
          const isSelected = selectedIds.includes(service.id)
          const isLastSelected = selectedIds.length === 2 && isSelected

          return (
            <div
              key={service.id}
              className={cn(
                'border rounded-2xl p-6 transition-all duration-300',
                isSelected
                  ? 'border-border hover:border-foreground/20 hover:bg-foreground/[0.03]'
                  : 'border-border opacity-60'
              )}
            >
              {/* Row 1: checkbox + name + price */}
              <div className="flex items-start gap-4">
                <button
                  onClick={() => !isLastSelected && onToggle(service.id)}
                  disabled={isLastSelected}
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200',
                    isSelected
                      ? 'bg-[hsl(var(--ollvy-green))] border-[hsl(var(--ollvy-green))]'
                      : 'bg-transparent border-border',
                    isLastSelected && 'cursor-not-allowed opacity-60'
                  )}
                  aria-label={isSelected ? `Deselect ${service.name}` : `Select ${service.name}`}
                >
                  {isSelected && <Check size={12} className="text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-base font-medium text-foreground">
                      {service.name}
                    </span>
                    {service.badge && (
                      <span className="rounded-full text-xs px-2 py-0.5 uppercase tracking-wider border border-border text-muted-foreground">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Why required + timeline */}
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {service.whyRequired}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-full px-3 py-1 mt-2">
                    {service.timelineDays}
                  </span>
                </div>

                <span className="font-mono text-base font-semibold text-foreground shrink-0">
                  {formatPaisa(service.price)}
                </span>
              </div>

              {/* Deselect warning - only when unchecked */}
              {!isSelected && (
                <div className="mt-3 ml-9 border border-amber-500/20 bg-amber-500/5 rounded-xl px-4 py-3">
                  <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
                    {service.deelectWarning}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Min services warning */}
      {selectedIds.length < 2 && (
        <div className="mt-4 border border-amber-500/20 bg-amber-500/5 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-600 dark:text-amber-500">
            Pack discount applies when 2 or more services are selected. Book individual services from the services page.
          </p>
        </div>
      )}
    </div>
  )
}

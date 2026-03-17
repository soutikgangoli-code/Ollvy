'use client'

import { DBServiceConfig } from '@/lib/data/services'
import { Card } from '@/components/ui/card'

export function CompletionStats({ service }: { service: DBServiceConfig }) {
  // TODO: Fetch real stats from API when available
  // For now, this component is only rendered when showCompletionStats is true
  // which requires 10+ orders

  return (
    <Card className="border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            47 orders completed this month
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Average completion time: {service.slaDays - 2} days
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold font-mono text-[hsl(var(--ollvy-green))]">
            98%
          </span>
          <p className="text-xs text-muted-foreground">on-time rate</p>
        </div>
      </div>

      {/* Distribution bars placeholder */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-20">1-5 days</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--ollvy-green))] rounded-full"
              style={{ width: '35%' }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">35%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-20">6-10 days</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--ollvy-green))] rounded-full"
              style={{ width: '52%' }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">52%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-20">11-15 days</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--ollvy-amber))] rounded-full"
              style={{ width: '13%' }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">13%</span>
        </div>
      </div>
    </Card>
  )
}

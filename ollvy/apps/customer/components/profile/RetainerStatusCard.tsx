'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar, Clock, ArrowRight, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RetainerStatusCardProps {
  retainerId: string
  serviceName: string
  status: 'active' | 'paused' | 'cancelled' | 'payment_failed'
  currentCycleEnd: string
  nextBillingDate: string
  monthlyPrice: number
  daysRemaining?: number
  filingsDueThisMonth?: number
}

export function RetainerStatusCard({
  retainerId,
  serviceName,
  status,
  currentCycleEnd,
  nextBillingDate,
  monthlyPrice,
  daysRemaining = 0,
  filingsDueThisMonth = 0,
}: RetainerStatusCardProps) {
  const statusConfig = {
    active: {
      label: 'Active',
      color: 'text-[hsl(var(--ollvy-green))]',
      bgColor: 'bg-[hsl(var(--ollvy-green))]/10',
    },
    paused: {
      label: 'Paused',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    cancelled: {
      label: 'Cancelled',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
    payment_failed: {
      label: 'Payment Failed',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  }

  const config = statusConfig[status]

  // Calculate cycle progress (assuming 30-day month)
  const cycleProgress = Math.max(0, Math.min(100, ((30 - daysRemaining) / 30) * 100))

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-foreground truncate">{serviceName}</h3>
            </div>
            <p className="text-sm text-muted-foreground">Monthly Retainer</p>
          </div>
          <span className={cn('text-xs font-medium px-2 py-1 rounded', config.color, config.bgColor)}>
            {config.label}
          </span>
        </div>

        {/* Cycle Progress */}
        {status === 'active' && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Current Cycle</span>
              <span className="text-foreground font-mono">
                {daysRemaining} days left
              </span>
            </div>
            <Progress value={cycleProgress} className="h-1.5" />
          </div>
        )}

        {/* Info */}
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          {filingsDueThisMonth > 0 && status === 'active' && (
            <p className="flex items-center gap-2 text-foreground">
              <Calendar className="h-4 w-4 text-amber-500" />
              {filingsDueThisMonth} filing{filingsDueThisMonth > 1 ? 's' : ''} due this month
            </p>
          )}
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Next billing: {nextBillingDate}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-mono text-foreground">
              {'\u20B9'}{(monthlyPrice / 100).toLocaleString('en-IN')}/mo
            </span>
          </p>
        </div>

        {/* Action */}
        <Link href={`/retainers/${retainerId}`}>
          <Button variant="outline" size="sm" className="w-full gap-2">
            Manage Retainer
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

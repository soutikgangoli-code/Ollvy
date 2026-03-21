'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { calculateServicePrice, formatPrice, type ServicePriceConfig } from '@/lib/pricing/calculate-price'
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react'

interface LivePricePreviewProps {
  service: ServicePriceConfig
  answers: Record<string, unknown>
  className?: string
  showBreakdown?: boolean
}

export function LivePricePreview({
  service,
  answers,
  className,
  showBreakdown = false,
}: LivePricePreviewProps) {
  // Calculate price based on current answers
  const priceBreakdown = useMemo(() => {
    return calculateServicePrice(service, answers)
  }, [service, answers])

  // Calculate base price (with no answers) for comparison
  const basePrice = useMemo(() => {
    return calculateServicePrice(service, {})
  }, [service])

  const priceDifference = priceBreakdown.total - basePrice.total
  const hasChange = priceDifference !== 0

  // Check if user has started answering (any non-empty answer)
  const hasAnyAnswer = Object.values(answers).some(v => v !== undefined && v !== null && v !== '')

  return (
    <div className={cn(
      "rounded-xl border border-border bg-card p-5",
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[hsl(var(--ollvy-green))]/10 flex items-center justify-center">
          <IndianRupee className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
        </div>
        <p className="text-sm font-medium text-foreground">Estimated Total</p>
      </div>

      {/* Price display */}
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-3xl font-bold tracking-tight text-foreground">
          {formatPrice(priceBreakdown.total)}
        </span>
        {hasChange && hasAnyAnswer && (
          <span className={cn(
            "flex items-center gap-1 text-sm font-mono font-medium",
            priceDifference > 0 ? "text-amber-600 dark:text-amber-400" : "text-[hsl(var(--ollvy-green))]"
          )}>
            {priceDifference > 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {priceDifference > 0 ? '+' : ''}{formatPrice(Math.abs(priceDifference))}
          </span>
        )}
      </div>

      {/* Price breakdown */}
      {showBreakdown && (
        <div className="mt-5 pt-4 border-t border-border space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Service Fee</span>
            <span className="font-mono text-sm font-medium text-foreground">
              {formatPrice(priceBreakdown.serviceFee)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Government Fees</span>
            <span className="font-mono text-sm font-medium text-foreground">
              {formatPrice(priceBreakdown.govtFees)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">GST ({priceBreakdown.gstRate}%)</span>
            <span className="font-mono text-sm font-medium text-foreground">
              {formatPrice(priceBreakdown.gst)}
            </span>
          </div>
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-muted-foreground mt-4">
        {hasAnyAnswer ? 'Price updates as you answer questions' : 'Starting price - updates as you answer'}
      </p>
    </div>
  )
}

/**
 * Compact version for mobile sticky footer
 */
export function LivePricePreviewCompact({
  service,
  answers,
  className,
}: Omit<LivePricePreviewProps, 'showBreakdown'>) {
  const priceBreakdown = useMemo(() => {
    return calculateServicePrice(service, answers)
  }, [service, answers])

  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-3 bg-card border-t border-border",
      className
    )}>
      <div>
        <p className="text-xs text-muted-foreground">Estimated Total</p>
        <p className="font-mono text-lg font-bold tracking-tight text-foreground">
          {formatPrice(priceBreakdown.total)}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        incl. GST & govt fees
      </p>
    </div>
  )
}

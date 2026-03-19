'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileBottomBarProps {
  total: number
  isProcessing: boolean
  canSubmit: boolean
  onSubmit: () => void
  orderSummaryContent: React.ReactNode
  className?: string
}

function formatPrice(paisa: number): string {
  return '\u20B9' + (paisa / 100).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function MobileBottomBar({
  total,
  isProcessing,
  canSubmit,
  onSubmit,
  orderSummaryContent,
  className,
}: MobileBottomBarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <>
      {/* Bottom bar - only visible on mobile */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 lg:hidden z-40',
          className
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-mono text-lg font-bold text-foreground">{formatPrice(total)}</p>
          </div>
          <Button
            onClick={() => {
              if (canSubmit) {
                onSubmit()
              } else {
                setIsSheetOpen(true)
              }
            }}
            disabled={isProcessing}
            className={cn(
              'h-11 px-6 text-base font-medium rounded-md',
              canSubmit
                ? 'bg-[hsl(var(--ollvy-green))] hover:bg-[hsl(var(--ollvy-green))]/90 text-white'
                : 'bg-[hsl(var(--ollvy-green))]/50 text-white'
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Bottom sheet overlay */}
      {isSheetOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsSheetOpen(false)}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 lg:hidden transition-transform duration-300 max-h-[85vh] overflow-y-auto',
          isSheetOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* Sheet header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Order Summary</h3>
          <button
            onClick={() => setIsSheetOpen(false)}
            className="p-1 hover:bg-muted rounded"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Sheet content */}
        <div className="p-4">
          {orderSummaryContent}
        </div>
      </div>

      {/* Spacer for fixed bottom bar on mobile */}
      <div className="h-20 lg:hidden" />
    </>
  )
}

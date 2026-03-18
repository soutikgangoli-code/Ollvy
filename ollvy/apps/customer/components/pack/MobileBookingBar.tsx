'use client'
import { formatPaisa } from '@/lib/data/packs'

export function MobileBookingBar({
  total,
  checkoutHref,
  discountPercent,
  originalTotal,
}: {
  total: number
  checkoutHref: string
  discountPercent: number
  originalTotal: number
}) {
  const showDiscount = originalTotal > total

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border bg-background/95 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: price */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-foreground">
              {formatPaisa(total)}
            </span>
            {showDiscount && (
              <span className="rounded-full text-xs px-2 py-0.5 uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          {showDiscount && (
            <p className="text-xs text-muted-foreground">
              vs {formatPaisa(originalTotal)} separately
            </p>
          )}
        </div>

        {/* Right: CTA */}
        <a
          href={checkoutHref}
          className="bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-11 px-6 text-sm font-medium flex items-center justify-center active:scale-[0.98] transition-all shrink-0"
        >
          Book Now
        </a>
      </div>
    </div>
  )
}

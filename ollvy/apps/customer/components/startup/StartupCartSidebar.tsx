'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BundleServiceData } from '@/lib/data/services'
import { calculateBundlePrice, formatPaisa } from '@/lib/startup/bundle-pricing'

interface StartupCartSidebarProps {
  allServices: BundleServiceData[]   // all DB-fetched, indexed by slug
  selectedSlugs: string[]            // slugs currently in cart
  onRemove: (slug: string) => void
  className?: string
}

/**
 * Sticky sidebar showing services added to the bundle, MRP savings,
 * tiered bundle discount, and a Continue-to-checkout CTA.
 */
export function StartupCartSidebar({
  allServices,
  selectedSlugs,
  onRemove,
  className,
}: StartupCartSidebarProps) {
  const items = useMemo(
    () =>
      selectedSlugs
        .map((slug) => allServices.find((s) => s.slug === slug))
        .filter((s): s is BundleServiceData => Boolean(s)),
    [allServices, selectedSlugs]
  )

  const breakdown = calculateBundlePrice(items)
  const isEmpty = items.length === 0
  const checkoutHref = `/checkout/bundle?slugs=${encodeURIComponent(selectedSlugs.join(','))}`

  return (
    <aside
      className={cn(
        'rounded-2xl border border-border bg-card p-5 shadow-sm sticky top-24',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Your bundle
        </h3>
        <span className="text-xs font-mono text-muted-foreground">
          {breakdown.itemCount} {breakdown.itemCount === 1 ? 'service' : 'services'}
        </span>
      </div>

      {isEmpty ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          Add services with the toggle to build your stack.
        </p>
      ) : (
        <>
          <ul className="space-y-2 mb-5 max-h-[40vh] overflow-y-auto pr-1">
            {items.map((item) => {
              const totalPaisa = item.ollvyFeePaisa + item.govtFeePaisa
              const showMrp = item.mrpPaisa > item.ollvyFeePaisa
              return (
                <li
                  key={item.slug}
                  className="flex items-start justify-between gap-3 py-2 border-b border-border/50 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {item.name}
                    </p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-mono text-xs text-foreground">
                        {formatPaisa(totalPaisa)}
                      </span>
                      {showMrp && (
                        <span className="font-mono text-xs text-muted-foreground line-through">
                          {formatPaisa(item.mrpPaisa + item.govtFeePaisa)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.slug)}
                    aria-label={`Remove ${item.name}`}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <X size={14} />
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="space-y-1.5 text-sm border-t border-border pt-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Ollvy fees</span>
              <span className="font-mono">{formatPaisa(breakdown.ollvyFeesPaisa)}</span>
            </div>
            {breakdown.govtFeesPaisa > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Govt fees</span>
                <span className="font-mono">{formatPaisa(breakdown.govtFeesPaisa)}</span>
              </div>
            )}
            {breakdown.mrpSavingsPaisa > 0 && (
              <div className="flex justify-between text-[hsl(var(--ollvy-green))]">
                <span>You save (vs MRP)</span>
                <span className="font-mono">−{formatPaisa(breakdown.mrpSavingsPaisa)}</span>
              </div>
            )}
            {breakdown.bundleDiscountPaisa > 0 && (
              <div className="flex justify-between text-[hsl(var(--ollvy-green))] font-medium">
                <span className="inline-flex items-center gap-1">
                  <Sparkles size={11} />
                  Bundle discount ({Math.round(breakdown.bundleDiscountRate * 100)}%)
                </span>
                <span className="font-mono">−{formatPaisa(breakdown.bundleDiscountPaisa)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-border mt-2">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-mono text-lg font-bold text-foreground">
                {formatPaisa(breakdown.totalPaisa)}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              + GST applied at checkout
            </p>
          </div>

          {/* Hint about next discount tier */}
          {breakdown.itemCount === 2 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Add 1 more service to unlock 5% bundle discount.
            </p>
          )}
          {breakdown.itemCount >= 3 && breakdown.itemCount < 5 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Add {5 - breakdown.itemCount} more to unlock 10% bundle discount.
            </p>
          )}

          <Button asChild className="w-full mt-5 h-11 gap-1.5">
            <Link href={checkoutHref}>
              Continue to checkout
              <ArrowRight size={14} />
            </Link>
          </Button>
        </>
      )}
    </aside>
  )
}

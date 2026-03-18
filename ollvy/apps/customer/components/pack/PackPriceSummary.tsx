'use client'
import { Check } from 'lucide-react'
import { formatPaisa } from '@/lib/data/packs'
import type { ServiceInPack } from '@/lib/data/packs/cloud-kitchen'

export function PackPriceSummary({
  services,
  selectedIds,
  priceCalc,
  discountPercent,
  checkoutHref,
}: {
  services: ServiceInPack[]
  selectedIds: string[]
  priceCalc: { subtotal: number; discountAmount: number; total: number; applyDiscount: boolean }
  discountPercent: number
  checkoutHref: string
}) {
  const selectedServices = services.filter((s) => selectedIds.includes(s.id))

  return (
    <div className="border border-border rounded-2xl p-6">

      {/* Line items */}
      <div className="space-y-3">
        {selectedServices.map((s) => (
          <div key={s.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Check size={14} className="text-green-600 dark:text-green-500 shrink-0" />
              <span className="text-foreground">{s.name}</span>
            </div>
            <span className="font-mono text-foreground">{formatPaisa(s.price)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border my-4" />

      {/* Discount row */}
      {priceCalc.applyDiscount && (
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full text-xs px-2 py-0.5 uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20">
              {discountPercent}% OFF
            </span>
            <span className="text-muted-foreground">Pack discount</span>
          </div>
          <span className="font-mono text-green-600 dark:text-green-500">-{formatPaisa(priceCalc.discountAmount)}</span>
        </div>
      )}

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-foreground">Total (incl. GST)</span>
        <span className="font-mono text-2xl font-bold text-foreground">
          {formatPaisa(priceCalc.total)}
        </span>
      </div>

      {/* CTA */}
      <a
        href={checkoutHref}
        className="mt-6 w-full bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-12 font-medium text-sm flex items-center justify-center active:scale-[0.98] transition-all"
      >
        Book Cloud Kitchen Setup →
      </a>

      {/* Sub-notes */}
      <div className="flex items-center justify-center gap-6 flex-wrap mt-3">
        {[
          'Cancel within 2 hours - full refund',
          'GST invoice issued',
          'Work starts same day',
        ].map((text) => (
          <span key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Check size={12} className="text-green-600 dark:text-green-500 shrink-0" />
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

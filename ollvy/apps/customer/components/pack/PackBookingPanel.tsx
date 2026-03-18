'use client'
import { useState, useEffect } from 'react'
import { Check, CheckCircle, MessageCircle, Phone } from 'lucide-react'
import { formatPaisa } from '@/lib/data/packs'
import type { ServiceInPack } from '@/lib/data/packs/cloud-kitchen'
import { format } from 'date-fns'

export function PackBookingPanel({
  services, selectedIds, priceCalc, discountPercent, guaranteeText, checkoutHref
}: {
  services: ServiceInPack[]
  selectedIds: string[]
  priceCalc: { subtotal: number; discountAmount: number; total: number; applyDiscount: boolean }
  discountPercent: number
  guaranteeText: string
  checkoutHref: string
}) {
  const selectedServices = services.filter((s) => selectedIds.includes(s.id))

  // Compute date only on client to avoid hydration mismatch
  const [guaranteeDate, setGuaranteeDate] = useState<string | null>(null)
  useEffect(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    setGuaranteeDate(format(d, 'd MMM yyyy'))
  }, [])

  return (
    <div className="border border-border rounded-2xl overflow-hidden">

      {/* Guarantee header */}
      <div className="bg-foreground/[0.03] border-b border-border px-6 py-4 flex items-center justify-between">
        <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground">
          GUARANTEED BY
        </p>
        <div className="flex items-center gap-2">
          <CheckCircle size={14} className="text-green-600 dark:text-green-500 shrink-0" />
          <span className="font-mono text-sm font-semibold text-foreground">
            {guaranteeDate ?? '...'}
          </span>
        </div>
      </div>

      {/* Price block */}
      <div className="px-6 py-5">
        <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-3">
          TOTAL PRICE
        </p>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-3xl font-bold text-foreground">
            {formatPaisa(priceCalc.total)}
          </span>
          {priceCalc.applyDiscount && (
            <span className="rounded-full text-xs px-2 py-0.5 uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Fee breakdown */}
        <div className="mt-4 space-y-2">
          {selectedServices.map((s) => (
            <div key={s.id} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{s.shortName}</span>
              <span className="font-mono text-foreground">{formatPaisa(s.price)}</span>
            </div>
          ))}
          {priceCalc.applyDiscount && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Pack discount ({discountPercent}%)</span>
              <span className="font-mono text-green-600 dark:text-green-500">-{formatPaisa(priceCalc.discountAmount)}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Subtotal (excl. GST)</span>
            <span className="font-mono font-semibold text-foreground">
              {formatPaisa(priceCalc.total)}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2">GST-compliant invoice issued after payment</p>
      </div>

      {/* CTA */}
      <div className="px-6 pb-4">
        <a
          href={checkoutHref}
          className="w-full bg-[hsl(var(--ollvy-green))] text-white rounded-lg h-12 font-medium text-sm flex items-center justify-center active:scale-[0.98] transition-all"
        >
          Book Now →
        </a>
        <div className="flex gap-3 mt-3">
          <a
            href="https://wa.me/919999999999?text=Hi, I have a question about the Cloud Kitchen Setup pack"
            target="_blank"
            className="flex-1 border border-border rounded-lg h-10 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:border-foreground/20 transition-all"
          >
            <MessageCircle size={14} className="text-green-600 dark:text-green-500" />
            WhatsApp
          </a>
          <a
            href="tel:+919999999999"
            className="flex-1 border border-border rounded-lg h-10 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:border-foreground/20 transition-all"
          >
            <Phone size={14} />
            Call us
          </a>
        </div>
      </div>

      {/* Trust bullets */}
      <div className="px-6 pb-6 pt-4 border-t border-border space-y-2">
        {[
          'GST-compliant invoice issued after payment',
          'Engagement letter before work starts',
          'Cancel within 2 hours for full refund',
          'One professional assigned, direct WhatsApp access',
        ].map((line) => (
          <p key={line} className="flex items-start gap-2 text-xs text-muted-foreground">
            <Check size={12} className="text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}

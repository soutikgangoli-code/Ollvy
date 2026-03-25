'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getWhatsAppLink } from '@/lib/constants'

interface LineItem {
  label: string
  amount: number
  isMuted?: boolean
}

interface CheckoutOrderSummaryProps {
  serviceName: string
  serviceFee: number
  govtFees: number
  addons: Array<{ name: string; price: number }>
  gstRate: number
  promoDiscount?: number
  promoCode?: string
  isProcessing: boolean
  canSubmit: boolean
  onSubmit: () => void
  // Promo code
  promoInput: string
  onPromoChange: (value: string) => void
  onApplyPromo: () => void
  onRemovePromo: () => void
  promoLoading: boolean
  promoError: string | null
  promoApplied: { code: string; discount: number } | null
  className?: string
}

function formatPrice(paisa: number): string {
  return '\u20B9' + (paisa / 100).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function CheckoutOrderSummary({
  serviceName,
  serviceFee,
  govtFees,
  addons,
  gstRate,
  promoDiscount = 0,
  isProcessing,
  canSubmit,
  onSubmit,
  promoInput,
  onPromoChange,
  onApplyPromo,
  onRemovePromo,
  promoLoading,
  promoError,
  promoApplied,
  className,
}: CheckoutOrderSummaryProps) {
  // Calculate totals
  const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0)
  const taxableAmount = serviceFee + addonsTotal // GST only on service fee, not govt fees
  const gstAmount = Math.round(taxableAmount * (gstRate / 100))
  const subtotal = serviceFee + govtFees + addonsTotal
  const total = subtotal + gstAmount - promoDiscount

  return (
    <div className={cn('bg-background border border-border rounded-xl', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Order Summary</h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Service name */}
        <p className="font-medium text-foreground">{serviceName}</p>

        {/* Line items */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service Fee</span>
            <span className="font-mono text-foreground text-right">{formatPrice(serviceFee)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Government Fees (MCA)</span>
            <span className="font-mono text-foreground text-right">{formatPrice(govtFees)}</span>
          </div>

          {/* Govt fee note */}
          <p className="text-xs text-muted-foreground italic pl-0">
            Goes directly to MCA as mandatory filing fees. Not Ollvy's charge.
          </p>

          {/* Add-ons */}
          {addons.map((addon, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-muted-foreground">{addon.name}</span>
              <span className="font-mono text-foreground text-right">{formatPrice(addon.price)}</span>
            </div>
          ))}

          {/* Divider */}
          <div className="border-t border-border my-2" />

          {/* Subtotal */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-mono text-foreground text-right">{formatPrice(subtotal)}</span>
          </div>

          {/* GST */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST ({gstRate}% on service fee only)</span>
            <span className="font-mono text-foreground text-right">{formatPrice(gstAmount)}</span>
          </div>

          {/* Promo discount */}
          {promoApplied && promoApplied.discount > 0 && (
            <div className="flex justify-between text-[hsl(var(--ollvy-green-fg))]">
              <span>{promoApplied.code} applied</span>
              <span className="font-mono text-right">-{formatPrice(promoApplied.discount)}</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-border my-2" />

          {/* Total */}
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-mono text-xl font-bold text-foreground">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Promo code */}
        <div className="pt-2">
          {promoApplied ? (
            <div className="flex items-center justify-between bg-[hsl(var(--ollvy-green))]/5 rounded-lg px-3 py-2">
              <span className="text-sm text-[hsl(var(--ollvy-green-fg))] font-medium">
                {promoApplied.code} - {formatPrice(promoApplied.discount)} off
              </span>
              <button
                onClick={onRemovePromo}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Promo code"
                value={promoInput}
                onChange={(e) => onPromoChange(e.target.value.toUpperCase())}
                className="h-9 text-sm border-border"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={onApplyPromo}
                disabled={!promoInput.trim() || promoLoading}
                className="h-9 px-3 border-border"
              >
                {promoLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Apply'}
              </Button>
            </div>
          )}
          {promoError && (
            <p className="text-xs text-destructive mt-1">{promoError}</p>
          )}
        </div>

        {/* Pay button */}
        <Button
          onClick={onSubmit}
          disabled={!canSubmit || isProcessing}
          className={cn(
            'w-full h-12 text-base font-medium rounded-md',
            canSubmit
              ? 'bg-[hsl(var(--ollvy-green))] hover:bg-[hsl(var(--ollvy-green))]/90 text-white'
              : 'bg-[hsl(var(--ollvy-green))]/50 text-white cursor-not-allowed'
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay {formatPrice(total)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {/* Payment methods */}
        <p className="text-xs text-center text-muted-foreground">
          UPI - Cards - Net Banking - Wallets
          <br />
          Secured by Razorpay
        </p>

        {/* WhatsApp escape hatch */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">Have questions before paying?</p>
          <a
            href={getWhatsAppLink('Hi, I have a question about checkout')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#25D366]"
          >
            Chat with us on WhatsApp
            <span className="text-[#25D366]">&rarr;</span>
          </a>
        </div>
      </div>

      {/* Guarantees */}
      <div className="mx-4 mb-4 p-4 bg-muted rounded-xl">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground">✓</span>
            <span>2-hour cancellation - full refund, no questions</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground">✓</span>
            <span>CA assigned within 24 hours of payment</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground">✓</span>
            <span>Government fees passed at cost - no markup</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground">✓</span>
            <span>GST-compliant invoice within 24 hours</span>
          </div>
        </div>
      </div>

      {/* Track record */}
      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-semibold text-foreground">98%</span>
          <span className="text-xs text-muted-foreground">on-time completion rate</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-semibold text-foreground">500+</span>
          <span className="text-xs text-muted-foreground">orders this month</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-semibold text-foreground">4.8</span>
          <span className="text-xs text-muted-foreground">from 127 verified reviews</span>
        </div>
      </div>
    </div>
  )
}

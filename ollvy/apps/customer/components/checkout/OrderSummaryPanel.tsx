'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Loader2, CheckCircle, Check, Tag, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getCompletionEstimate } from '@/lib/dates'

interface PriceBreakdown {
  base: number
  govtFees: number
  gst: number
  gstRate: number
  proDiscount: number
  promoDiscount: number
  addonTotal: number
  total: number
}

interface Addon {
  id: string
  name: string
  pricePaisa: number
  govtFeePaisa?: number
}

interface OrderSummaryPanelProps {
  serviceName: string
  priceBreakdown: PriceBreakdown
  selectedAddons?: Addon[]
  slaDays?: number
  promoCode?: string
  isProUser?: boolean
  isProcessing: boolean
  canSubmit: boolean
  onSubmit: () => void
  // Promo code integration
  promoInput?: string
  onPromoChange?: (value: string) => void
  onApplyPromo?: () => void
  onRemovePromo?: () => void
  promoLoading?: boolean
  promoError?: string | null
  promoApplied?: { code: string; discount: number } | null
  // Completion estimate fields for govt processing awareness
  hasGovtProcessing?: boolean
  completionMaxDays?: number | null
  completionRangeText?: string | null
}

function formatPaisa(paisa: number): string {
  return '\u20B9' + (paisa / 100).toLocaleString('en-IN')
}

export function OrderSummaryPanel({
  serviceName,
  priceBreakdown,
  selectedAddons = [],
  slaDays,
  promoCode,
  isProUser = false,
  isProcessing,
  canSubmit,
  onSubmit,
  // Promo code props
  promoInput = '',
  onPromoChange,
  onApplyPromo,
  onRemovePromo,
  promoLoading = false,
  promoError,
  promoApplied,
  // Completion estimate props
  hasGovtProcessing = false,
  completionMaxDays,
  completionRangeText,
}: OrderSummaryPanelProps) {
  // Calculate completion estimate with govt processing awareness
  const completionEstimate = slaDays ? getCompletionEstimate(
    slaDays,
    hasGovtProcessing,
    completionMaxDays,
    completionRangeText
  ) : null
  const completionDate = completionEstimate?.guaranteedDate ?? null

  return (
    <Card className="border-border">
      {/* Guaranteed Date Header */}
      {completionDate && (
        <div className="bg-[hsl(var(--ollvy-green))]/10 border-b border-[hsl(var(--ollvy-green))]/20 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))] flex items-center justify-center">
              <Check className="h-3 w-3 text-[hsl(var(--ollvy-green-fg))]" />
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--ollvy-green))] font-medium uppercase tracking-wider">
                Guaranteed by
              </p>
              <p className="font-mono text-lg font-semibold text-[hsl(var(--ollvy-green))]">
                {completionDate}
              </p>
              {completionEstimate?.govtDisclaimer && (
                <p className="text-xs text-[hsl(var(--ollvy-green))]/80 mt-0.5">
                  ({completionEstimate.govtDisclaimer})
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Service Name */}
        <div className="pb-4 border-b border-border">
          <p className="font-medium text-foreground">{serviceName}</p>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 text-sm">
          {/* Base Service Fee */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service Fee</span>
            <span className="text-foreground font-mono">{formatPaisa(priceBreakdown.base)}</span>
          </div>

          {/* Government Fees */}
          {priceBreakdown.govtFees > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Government Fees</span>
              <span className="text-foreground font-mono">{formatPaisa(priceBreakdown.govtFees)}</span>
            </div>
          )}

          {/* Selected Addons */}
          {selectedAddons.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              {selectedAddons.map((addon) => {
                const addonTotal = addon.pricePaisa + (addon.govtFeePaisa ?? 0)
                return (
                  <div key={addon.id} className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <CheckCircle className="h-3 w-3 text-[hsl(var(--ollvy-green))]" />
                      {addon.name}
                    </span>
                    <span className="text-foreground font-mono">{formatPaisa(addonTotal)}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* GST */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST (<span className="font-mono">{priceBreakdown.gstRate}%</span>)</span>
            <span className="text-foreground font-mono">{formatPaisa(priceBreakdown.gst)}</span>
          </div>

          {/* Pro Discount */}
          {priceBreakdown.proDiscount > 0 && (
            <div className="flex justify-between text-[hsl(var(--ollvy-green))]">
              <span className="flex items-center gap-1.5">
                Pro Discount (<span className="font-mono">5%</span>)
              </span>
              <span className="font-mono">-{formatPaisa(priceBreakdown.proDiscount)}</span>
            </div>
          )}

          {/* Promo Discount */}
          {priceBreakdown.promoDiscount > 0 && (
            <div className="flex justify-between text-[hsl(var(--ollvy-green))]">
              <span className="flex items-center gap-1.5">
                Promo ({promoCode || promoApplied?.code})
              </span>
              <span className="font-mono">-{formatPaisa(priceBreakdown.promoDiscount)}</span>
            </div>
          )}
        </div>

        {/* Promo Code Input (integrated) */}
        {onPromoChange && onApplyPromo && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              <Tag className="h-3 w-3" />
              Promo Code
            </p>
            {promoApplied ? (
              <div className="flex items-center justify-between bg-[hsl(var(--ollvy-green))]/5 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-[hsl(var(--ollvy-green))]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{promoApplied.code}</p>
                    <p className="text-xs text-muted-foreground">
                      -{formatPaisa(promoApplied.discount)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemovePromo}
                  className="text-xs text-muted-foreground h-7"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={promoInput}
                  onChange={(e) => onPromoChange(e.target.value.toUpperCase())}
                  className="h-9 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onApplyPromo}
                  disabled={!promoInput.trim() || promoLoading}
                  className="h-9 px-3"
                >
                  {promoLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Apply'}
                </Button>
              </div>
            )}
            {promoError && (
              <p className="text-xs text-destructive mt-1.5">{promoError}</p>
            )}
          </div>
        )}

        {/* Total */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-mono text-2xl font-bold text-foreground">
              {formatPaisa(priceBreakdown.total)}
            </span>
          </div>
        </div>

        {/* Pay Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={onSubmit}
          disabled={!canSubmit || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay {formatPaisa(priceBreakdown.total)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {/* Trust Signals Mini */}
        <div className="space-y-2 pt-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3 text-[hsl(var(--ollvy-green))]" />
            Secure payment via Razorpay
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3 text-[hsl(var(--ollvy-green))]" />
            GST-compliant invoice included
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3 text-[hsl(var(--ollvy-green))]" />
            2-hour refund guarantee
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

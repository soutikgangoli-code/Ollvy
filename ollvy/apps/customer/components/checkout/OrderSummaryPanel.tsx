'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  promoCode?: string
  isProUser?: boolean
  isProcessing: boolean
  canSubmit: boolean
  onSubmit: () => void
}

function formatPaisa(paisa: number): string {
  return '\u20B9' + (paisa / 100).toLocaleString('en-IN')
}

export function OrderSummaryPanel({
  serviceName,
  priceBreakdown,
  selectedAddons = [],
  promoCode,
  isProUser = false,
  isProcessing,
  canSubmit,
  onSubmit,
}: OrderSummaryPanelProps) {
  return (
    <Card className="sticky top-20 border-border">
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
            <span className="text-foreground">{formatPaisa(priceBreakdown.base)}</span>
          </div>

          {/* Government Fees */}
          {priceBreakdown.govtFees > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Government Fees</span>
              <span className="text-foreground">{formatPaisa(priceBreakdown.govtFees)}</span>
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
                    <span className="text-foreground">{formatPaisa(addonTotal)}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* GST */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST ({priceBreakdown.gstRate}%)</span>
            <span className="text-foreground">{formatPaisa(priceBreakdown.gst)}</span>
          </div>

          {/* Pro Discount */}
          {priceBreakdown.proDiscount > 0 && (
            <div className="flex justify-between text-[hsl(var(--ollvy-green))]">
              <span className="flex items-center gap-1.5">
                Pro Discount (5%)
              </span>
              <span>-{formatPaisa(priceBreakdown.proDiscount)}</span>
            </div>
          )}

          {/* Promo Discount */}
          {priceBreakdown.promoDiscount > 0 && (
            <div className="flex justify-between text-[hsl(var(--ollvy-green))]">
              <span className="flex items-center gap-1.5">
                Promo ({promoCode})
              </span>
              <span>-{formatPaisa(priceBreakdown.promoDiscount)}</span>
            </div>
          )}
        </div>

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
        </div>
      </CardContent>
    </Card>
  )
}

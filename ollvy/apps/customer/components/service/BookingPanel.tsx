'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Phone, MessageCircle } from 'lucide-react'
import { getGuaranteedDate } from '@/lib/dates'
import { DBServiceConfig } from '@/lib/data/services'

interface BookingPanelProps {
  service: DBServiceConfig
  serviceId?: string // DB ID for checkout
  priceVariesByState?: boolean
}

export function BookingPanel({ service, serviceId, priceVariesByState }: BookingPanelProps) {
  const guaranteedDate = service.isRetainer
    ? service.nextDueDateValue
    : getGuaranteedDate(service.slaDays)

  const totalFee = service.ollvyFee + (service.govtFee ?? 0)

  // Use DB ID for checkout if available, otherwise fall back to slug
  const checkoutId = serviceId ?? service.slug
  const ctaLabel = priceVariesByState ? 'Get Quote' : 'Book Now'
  const ctaUrl = priceVariesByState
    ? `/quote/request/${checkoutId}?utm_source=service_page&utm_medium=booking_panel&utm_content=${service.slug}`
    : `/checkout/${checkoutId}?utm_source=service_page&utm_medium=booking_panel&utm_content=${service.slug}`

  return (
    <Card className="border border-border bg-card p-6 w-full">
      {/* Guaranteed date at top */}
      {guaranteedDate && (
        <div className="flex items-center gap-2 pb-5 border-b border-border mb-5">
          <CheckCircle
            size={14}
            className="text-[hsl(var(--ollvy-green))] shrink-0"
          />
          <p className="text-sm font-semibold text-foreground">
            {service.isRetainer
              ? `Current cycle due: ${guaranteedDate}`
              : `Guaranteed by ${guaranteedDate}`}
          </p>
        </div>
      )}

      {/* Total amount — prominent */}
      <div className="mb-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Total to pay now
        </p>
        <p className="font-mono text-4xl font-bold text-foreground mt-1">
          ₹{totalFee.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Fee breakdown */}
      <div className="mt-5 space-y-3">
        {/* Ollvy fee */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center mt-0.5 shrink-0">
              <CheckCircle
                size={11}
                className="text-[hsl(var(--ollvy-green))]"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Ollvy fee</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Includes CA, tracking, and support
              </p>
            </div>
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">
            ₹{service.ollvyFee.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Govt fee — only if applicable */}
        {service.govtFee && service.govtFee > 0 && (
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5 shrink-0">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted-foreground"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {service.govtFeeLabel ?? 'Government fee'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {service.govtFeeNote ??
                    'Paid to the government. Not retained by Ollvy.'}
                </p>
              </div>
            </div>
            <span className="font-mono text-sm text-muted-foreground">
              ₹{service.govtFee.toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Total line */}
        <div className="flex justify-between items-center pt-3 border-t border-border">
          <span className="text-sm font-semibold text-foreground">
            Total Amount
          </span>
          <span className="font-mono text-lg font-bold text-foreground">
            ₹{totalFee.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* CTA button */}
      <Button className="w-full mt-5" size="lg" asChild>
        <a href={ctaUrl}>
          {ctaLabel}
        </a>
      </Button>

      {/* GST invoice note */}
      <p className="text-xs text-muted-foreground text-center mt-2">
        GST-compliant invoice generated at checkout
      </p>

      {/* Have queries */}
      <div className="mt-5 pt-5 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">
          Questions about documents, process, or price?
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
            <a
              href={`https://wa.me/919876543210?text=Hi, I have a question about ${encodeURIComponent(service.name)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
            <a href="tel:+919876543210">
              <Phone size={13} />
              Call
            </a>
          </Button>
        </div>
      </div>

      {/* Trust micro-signals */}
      <div className="mt-4 space-y-1.5">
        {[
          'GST-compliant invoice included',
          'Engagement letter before you pay',
          'Cancel within 2 hours for full refund',
        ].map((line) => (
          <p
            key={line}
            className="text-xs text-muted-foreground flex items-center gap-1.5"
          >
            <CheckCircle
              size={10}
              className="text-[hsl(var(--ollvy-green))] shrink-0"
            />
            {line}
          </p>
        ))}
      </div>
    </Card>
  )
}

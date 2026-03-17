'use client'

import Link from 'next/link'
import { RelatedServiceCard } from '@/lib/data/services'
import { Card } from '@/components/ui/card'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { getGuaranteedDate } from '@/lib/dates'

export function RelatedServices({ services }: { services: RelatedServiceCard[] }) {
  if (services.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Services you'll need next
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        These services often go with what you're booking.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.slice(0, 4).map((service) => {
          const totalFee = service.ollvyFee + (service.govtFee ?? 0)
          const guaranteedDate = service.isRetainer
            ? undefined
            : getGuaranteedDate(service.slaDays)

          return (
            <Link key={service.slug} href={`/services/${service.slug}`}>
              <Card className="border border-border bg-card p-5 h-full hover:border-foreground/30 transition-colors group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
                      {service.shortName}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {service.tagline}
                    </p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-0.5"
                  />
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="font-mono text-sm font-semibold text-foreground">
                    ₹{totalFee.toLocaleString('en-IN')}
                  </span>
                  {guaranteedDate && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle
                        size={10}
                        className="text-[hsl(var(--ollvy-green))]"
                      />
                      By {guaranteedDate}
                    </span>
                  )}
                  {service.isRetainer && (
                    <span className="text-xs text-muted-foreground">
                      Monthly
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

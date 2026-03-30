import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { PopularServiceData } from '@/lib/data/services'

// Calculate guaranteed date based on SLA days (working days)
function getGuaranteedDate(slaDays: number): string {
  const date = new Date()
  let daysAdded = 0
  while (daysAdded < slaDays) {
    date.setDate(date.getDate() + 1)
    const dayOfWeek = date.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++
    }
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// Service tag configuration
function getServiceTag(slug: string, isRetainer: boolean): string | null {
  if (isRetainer) return 'Monthly'
  if (slug === 'pvt-ltd-incorporation' || slug === 'gst-registration') return 'Popular'
  if (slug === 'director-kyc' || slug === 'mca-annual-filing') return 'Annual'
  return null
}

interface ServicesSimplifiedProps {
  services: PopularServiceData[]
}

export function ServicesSimplified({ services }: ServicesSimplifiedProps) {
  return (
    <section className="py-28 bg-muted/30 border-y border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Popular services
            </h2>
            <p className="text-lg text-muted-foreground mt-3">Fixed prices. Clear timelines. No surprises.</p>
          </div>
          <Button variant="outline" className="rounded-xl h-11 px-6" asChild>
            <Link href="/services?utm_source=homepage&utm_medium=landing&utm_content=services_simplified" prefetch={true}>
              View all 20+ services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const totalPrice = service.ollvyFee + service.govtFee
            const guaranteedDate = service.slaDays > 0 ? getGuaranteedDate(service.slaDays) : null
            const tag = getServiceTag(service.slug, service.isRetainer)

            return (
              <Link
                key={i}
                href={`/services/${service.slug}?utm_source=homepage&utm_medium=landing&utm_content=services_simplified`}
                prefetch={true}
                className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:bg-muted/30 transition-colors duration-200 group flex flex-col"
              >
                {/* Row 1: Name + Tag */}
                <div className="flex items-start justify-between gap-3 mb-2 min-h-[28px]">
                  <h3 className="font-semibold text-lg text-foreground leading-tight">{service.name}</h3>
                  {tag && (
                    <span className="text-xs px-2 py-1 rounded-md bg-foreground/5 text-muted-foreground font-medium shrink-0 backdrop-blur-sm">
                      {tag}
                    </span>
                  )}
                </div>

                {/* Row 2: Description */}
                <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{service.description}</p>

                {/* Row 3: Price */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-2xl font-bold text-foreground">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {service.isRetainer ? '/month' : 'all-in'}
                  </span>
                </div>

                {/* Row 4: Guaranteed date */}
                <div className="min-h-[20px]">
                  {guaranteedDate && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      Guaranteed by {guaranteedDate}
                    </p>
                  )}
                  {service.isRetainer && (
                    <p className="text-sm text-muted-foreground">Filed before every deadline</p>
                  )}
                </div>

                {/* Arrow */}
                <ArrowRight className="mt-auto pt-4 h-4 w-4 text-muted-foreground" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

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
    <section className="py-16 md:py-28 bg-background">
      <div className="container">
        <div className="mb-8 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Popular services
          </h2>
          <p className="text-lg text-muted-foreground mt-3">Fixed prices. Clear timelines. No surprises.</p>
        </div>

        {/* Service cards - show first 4 on mobile, all on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const totalPrice = service.ollvyFee + service.govtFee
            const guaranteedDate = service.slaDays > 0 ? getGuaranteedDate(service.slaDays) : null
            const tag = getServiceTag(service.slug, service.isRetainer)

            return (
              <Link
                key={i}
                href={`/services/${service.slug}`}
                prefetch={true}
                className={`p-6 rounded-2xl border border-border bg-card shadow-sm hover:bg-muted/30 transition-colors duration-200 group flex flex-col ${i >= 4 ? 'hidden md:flex' : ''}`}
              >
                {/* Row 1: Name + Tag - fixed height for 2 lines */}
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-semibold text-lg text-foreground leading-tight line-clamp-2 min-h-[3.5rem]">{service.name}</h3>
                  {tag && (
                    <span className="text-xs px-2 py-1 rounded-md bg-foreground/5 text-muted-foreground font-medium shrink-0 backdrop-blur-sm">
                      {tag}
                    </span>
                  )}
                </div>

                {/* Row 2: Description - fixed height */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">{service.description}</p>

                {/* Row 3: Price - always at same position */}
                <div className="flex items-baseline gap-2 mb-1 mt-auto">
                  <span className="font-mono text-2xl font-bold text-foreground">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                  {service.mrp && service.mrp > totalPrice && (
                    <span className="font-mono text-sm text-muted-foreground line-through">
                      ₹{service.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {service.isRetainer ? '/month' : 'all-in'}
                  </span>
                </div>

                {/* Row 4: Guaranteed date - fixed height */}
                <div className="h-5">
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
                <ArrowRight className="pt-4 h-4 w-4 text-muted-foreground" />
              </Link>
            )
          })}
        </div>

        {/* View all button at the bottom */}
        <div className="text-center mt-8">
          <Button variant="outline" className="rounded-xl h-11 px-6" asChild>
            <Link href="/services" prefetch={true}>
              View all services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

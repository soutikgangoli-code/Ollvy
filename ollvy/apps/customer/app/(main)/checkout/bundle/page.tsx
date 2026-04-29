import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, ArrowLeft, Sparkles, Info } from 'lucide-react'
import { getServicesBySlugs } from '@/lib/data/services'
import { calculateBundlePrice, formatPaisa } from '@/lib/startup/bundle-pricing'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Bundle Checkout | Ollvy',
  description: 'Review your selected compliance services before booking.',
  robots: { index: false, follow: true },
}

interface PageProps {
  searchParams: Promise<{ slugs?: string }>
}

export default async function BundleCheckoutPage({ searchParams }: PageProps) {
  const { slugs } = await searchParams
  const slugList = (slugs ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (slugList.length === 0) {
    redirect('/startup')
  }

  const services = await getServicesBySlugs(slugList)
  if (services.length === 0) {
    redirect('/startup')
  }

  const breakdown = calculateBundlePrice(services)
  const firstSlug = services[0].slug

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/startup"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={12} /> Back to startup stack
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">Your bundle</h1>
        <p className="text-sm text-muted-foreground mb-8">
          {breakdown.itemCount} {breakdown.itemCount === 1 ? 'service' : 'services'} ready
          to book. Live pricing pulled from the catalog.
        </p>

        {/* Service list */}
        <Card className="border border-border bg-card p-6 mb-6">
          <ul className="divide-y divide-border">
            {services.map((s) => {
              const total = s.ollvyFeePaisa + s.govtFeePaisa
              const showMrp = s.mrpPaisa > s.ollvyFeePaisa
              return (
                <li key={s.slug} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {s.shortDescription}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-baseline gap-2 justify-end">
                        <span className="font-mono text-sm font-bold text-foreground">
                          {formatPaisa(total)}
                        </span>
                        {showMrp && (
                          <span className="font-mono text-xs text-muted-foreground line-through">
                            {formatPaisa(s.mrpPaisa + s.govtFeePaisa)}
                          </span>
                        )}
                      </div>
                      {s.govtFeePaisa > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {formatPaisa(s.ollvyFeePaisa)} +{' '}
                          {formatPaisa(s.govtFeePaisa)} govt
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>

        {/* Breakdown */}
        <Card className="border border-border bg-card p-6 mb-6">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
            Pricing
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Ollvy fees ({breakdown.itemCount} services)</dt>
              <dd className="font-mono text-foreground">
                {formatPaisa(breakdown.ollvyFeesPaisa)}
              </dd>
            </div>
            {breakdown.govtFeesPaisa > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Government fees</dt>
                <dd className="font-mono text-foreground">
                  {formatPaisa(breakdown.govtFeesPaisa)}
                </dd>
              </div>
            )}
            {breakdown.mrpSavingsPaisa > 0 && (
              <div className="flex justify-between text-[hsl(var(--ollvy-green))]">
                <dt>You save vs MRP</dt>
                <dd className="font-mono">−{formatPaisa(breakdown.mrpSavingsPaisa)}</dd>
              </div>
            )}
            {breakdown.bundleDiscountPaisa > 0 && (
              <div className="flex justify-between text-[hsl(var(--ollvy-green))] font-medium">
                <dt className="inline-flex items-center gap-1">
                  <Sparkles size={11} /> Bundle discount (
                  {Math.round(breakdown.bundleDiscountRate * 100)}% off Ollvy fees)
                </dt>
                <dd className="font-mono">
                  −{formatPaisa(breakdown.bundleDiscountPaisa)}
                </dd>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-3 mt-3">
              <dt className="font-semibold text-foreground">Total before GST</dt>
              <dd className="font-mono text-lg font-bold text-foreground">
                {formatPaisa(breakdown.totalPaisa)}
              </dd>
            </div>
            <p className="text-xs text-muted-foreground">
              GST applied at each service&apos;s checkout per the standard pricing rules.
            </p>
          </dl>
        </Card>

        {/* v1 flow notice */}
        <Card className="border border-amber-500/30 bg-amber-500/5 p-4 mb-6">
          <div className="flex gap-3">
            <Info size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">
                Bundle payment is being rolled out
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Right now each service is checked out individually using the existing
                payment flow. The bundle discount of{' '}
                <span className="font-mono">
                  {formatPaisa(breakdown.bundleDiscountPaisa)}
                </span>{' '}
                will be applied as account credit after all bookings complete. A single
                combined payment is in the next release.
              </p>
            </div>
          </div>
        </Card>

        {/* Primary CTA — kick off the first service's checkout */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="flex-1 gap-1.5">
            <Link href={`/checkout/${firstSlug}`}>
              Start with {services[0].name}
              <ArrowRight size={14} />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/startup">Edit bundle</Link>
          </Button>
        </div>

        {/* Per-service quick links so users can checkout in any order */}
        {services.length > 1 && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Or jump to a specific checkout
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/checkout/${s.slug}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3 hover:bg-muted/40 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground line-clamp-1">
                    {s.name}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground shrink-0">
                    {formatPaisa(s.ollvyFeePaisa + s.govtFeePaisa)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

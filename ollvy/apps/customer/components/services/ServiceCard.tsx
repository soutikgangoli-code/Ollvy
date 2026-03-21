import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, Star, Check } from 'lucide-react'
import { formatPaisa } from '@/lib/utils'
import { getCompletionEstimate } from '@/lib/dates'
import type { ServicePackage } from '@/lib/types'

// Map service slugs to category labels
const getCategoryLabel = (slug: string): string => {
  // GST related
  if (slug.includes('gst')) return 'GST'
  // Company incorporation
  if (slug.includes('pvt-ltd') || slug.includes('llp') || slug.includes('opc') || slug.includes('incorporation')) return 'Incorporation'
  // Trademark & IP
  if (slug.includes('trademark') || slug.includes('copyright') || slug.includes('patent')) return 'Trademark & IP'
  // Tax filings
  if (slug.includes('itr') || slug.includes('tds') || slug.includes('tax')) return 'Tax Filing'
  // Compliance
  if (slug.includes('annual') || slug.includes('aoc') || slug.includes('mgt') || slug.includes('compliance') || slug.includes('kyc') || slug.includes('dir-3')) return 'Compliance'
  // Licensing
  if (slug.includes('fssai') || slug.includes('license') || slug.includes('iec') || slug.includes('shop') || slug.includes('msme') || slug.includes('udyam')) return 'Licensing'
  // Payroll
  if (slug.includes('payroll') || slug.includes('pf') || slug.includes('esi') || slug.includes('pt')) return 'Payroll'
  // Import/Export
  if (slug.includes('import') || slug.includes('export')) return 'Import/Export'
  // Changes/Modifications
  if (slug.includes('change') || slug.includes('amendment') || slug.includes('modification')) return 'Amendment'
  // Closure
  if (slug.includes('closure') || slug.includes('cancellation') || slug.includes('strike-off')) return 'Closure'
  // Director related
  if (slug.includes('director') || slug.includes('din')) return 'Director'
  // Default based on common patterns
  return 'Registration'
}

interface ServiceCardProps {
  service: ServicePackage
}

export function ServiceCard({ service }: ServiceCardProps) {
  const priceDisplay = service.price_varies_by_state
    ? 'Get Quote'
    : `${formatPaisa(service.price_base_paisa)}`

  const billingLabel = service.billing_cycle === 'monthly'
    ? '/mo'
    : service.billing_cycle === 'yearly'
    ? '/yr'
    : ''

  const isUrgent = service.urgency_score >= 80
  const isRetainer = service.billing_cycle === 'monthly' || service.billing_cycle === 'yearly'

  // Calculate completion estimate with govt processing awareness
  const completionEstimate = service.sla_working_days > 0
    ? getCompletionEstimate(
        service.sla_working_days,
        service.has_govt_processing ?? false,
        service.completion_max_days,
        service.completion_range_text
      )
    : null
  const guaranteedDate = completionEstimate?.guaranteedDate ?? null

  // Get category label from slug
  const categoryLabel = getCategoryLabel(service.slug)

  // Format govt fee if present
  const govtFee = service.price_govt_fees_paisa ? service.price_govt_fees_paisa / 100 : 0
  const baseOllvyFee = service.price_base_paisa / 100

  // For bundles, show just the base price as "Starting at" (minimum price)
  // User can add more services on the detail page
  const nonBundleTotal = baseOllvyFee + govtFee

  // Services where govt fees vary based on questionnaire answers
  // These show "Starting from" prefix since final price depends on user input
  const priceVariesByQuestionnaire = [
    'trademark-registration',
    'pvt-ltd-incorporation',
    'llp-incorporation',
  ].includes(service.slug)

  return (
    <Link href={`/services/${service.slug}`} className="group">
      <Card className="h-full hover:border-foreground/20 hover:bg-foreground/[0.03] transition-all duration-300 overflow-hidden flex flex-col min-h-[320px]">
        {/* Image or Icon/Bundle Header */}
        {service.image_url ? (
          <div className="relative h-24 w-full bg-muted flex-shrink-0">
            <Image
              src={service.image_url}
              alt={service.name}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        ) : service.is_bundle ? (
          <div className="h-16 w-full bg-muted/50 flex items-center justify-center border-b border-border flex-shrink-0">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              bundled
            </span>
          </div>
        ) : (
          <div className="h-16 w-full bg-muted/50 flex items-center justify-center border-b border-border flex-shrink-0">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {categoryLabel}
            </span>
          </div>
        )}

        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-medium text-foreground group-hover:text-foreground/90 transition-colors line-clamp-1">
                {service.name}
              </CardTitle>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors flex-shrink-0 mt-1" />
          </div>
          <CardDescription className="line-clamp-2 mt-2 text-muted-foreground min-h-[40px]">
            {service.short_description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col">
          {/* Bundle: show included services */}
          {service.is_bundle && service.addons && service.addons.length > 0 && (
            <div className="mb-3 pb-3 border-b border-border">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">
                INCLUDES
              </p>
              <div className="flex flex-wrap gap-1">
                {service.addons.slice(0, 4).map((addon) => (
                  <span
                    key={addon.id}
                    className="text-[10px] px-2 py-0.5 rounded bg-muted/50 text-muted-foreground border border-border"
                  >
                    {addon.name}
                  </span>
                ))}
                {service.addons.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted/50 text-muted-foreground border border-border">
                    +{service.addons.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price breakdown */}
          <div className="space-y-1 flex-1">
            {service.is_bundle ? (
              // Bundle: show base price as "Starting at" (minimum price)
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-medium text-foreground">Starting at</span>
                <span className="font-mono text-base font-bold text-foreground">
                  {service.price_varies_by_state ? 'Get Quote' : `₹${baseOllvyFee.toLocaleString('en-IN')}`}
                </span>
              </div>
            ) : (
              // Non-bundle: show fee breakdown
              <>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground">Ollvy fee</span>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {service.price_varies_by_state ? 'Quote' : `₹${baseOllvyFee.toLocaleString('en-IN')}`}
                    {!service.price_varies_by_state && billingLabel && (
                      <span className="text-muted-foreground font-normal">{billingLabel}</span>
                    )}
                  </span>
                </div>
                {govtFee > 0 && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Govt fee</span>
                    <span className="font-mono text-sm text-muted-foreground">
                      ₹{govtFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline border-t border-border pt-1 mt-1">
                  <span className="text-xs font-medium text-foreground">
                    {priceVariesByQuestionnaire ? 'Starting from' : 'Total'}
                  </span>
                  <span className="font-mono text-base font-bold text-foreground">
                    {service.price_varies_by_state ? 'Get Quote' : `₹${nonBundleTotal.toLocaleString('en-IN')}`}
                    {!service.price_varies_by_state && billingLabel && (
                      <span className="text-muted-foreground font-normal">{billingLabel}</span>
                    )}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer: consistent positioning across all cards */}
          <div className="mt-auto pt-3 space-y-2">
            {/* Disclaimer or SLA text (if no guaranteed date) */}
            {isRetainer ? (
              <p className="text-[10px] text-muted-foreground">
                Recurring {service.billing_cycle} service
              </p>
            ) : !guaranteedDate && service.sla_working_days > 0 ? (
              <p className="text-[10px] text-muted-foreground">
                {service.sla_working_days} working days
              </p>
            ) : completionEstimate?.govtDisclaimer ? (
              <p className="text-[10px] text-muted-foreground">
                {completionEstimate.govtDisclaimer}
              </p>
            ) : null}

            {/* Bottom row: Guaranteed + Rating on left, Urgent + Tier on right */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {guaranteedDate && !isRetainer && (
                  <span className="inline-flex items-center rounded px-2 py-1 text-[10px] font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30">
                    <Check className="h-3 w-3 mr-1" />
                    Guaranteed by {guaranteedDate}
                  </span>
                )}
                {service.avg_rating && service.rating_count > 0 && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {service.avg_rating.toFixed(1)}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {isUrgent && (
                  <span className="inline-flex items-center rounded px-2 py-1 text-[10px] font-medium uppercase tracking-wider bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/30">
                    Urgent
                  </span>
                )}
                {service.tier_label && (
                  <span className="inline-flex items-center rounded px-2 py-1 text-[10px] font-medium bg-muted/50 text-muted-foreground border border-border">
                    {service.tier_label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

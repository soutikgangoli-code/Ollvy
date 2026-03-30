import Link from 'next/link'
import { ArrowUpRight, Star, CheckCircle2 } from 'lucide-react'
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
    <Link href={`/services/${service.slug}`} prefetch={true} className="block h-full">
      <div className="h-full rounded-xl border border-border/60 bg-card hover:bg-muted/30 transition-colors duration-150 overflow-hidden flex flex-col">
        {/* Category Header */}
        <div className="px-5 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {service.is_bundle ? 'Bundle' : categoryLabel}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="px-5 pt-3 pb-4 flex-shrink-0">
          <h3 className="text-base font-semibold text-foreground leading-tight line-clamp-2 min-h-[2.5rem]">
            {service.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 min-h-[2.5rem] leading-relaxed">
            {service.short_description}
          </p>
        </div>

        {/* Bundle: show included services */}
        {service.is_bundle && service.addons && service.addons.length > 0 && (
          <div className="mx-5 mb-4 pb-4 border-b border-border/50">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
              Includes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {service.addons.slice(0, 4).map((addon) => (
                <span
                  key={addon.id}
                  className="font-mono text-[10px] px-2 py-1 rounded-md bg-muted/60 text-muted-foreground border border-border/50"
                >
                  {addon.name}
                </span>
              ))}
              {service.addons.length > 4 && (
                <span className="font-mono text-[10px] px-2 py-1 rounded-md bg-muted/60 text-muted-foreground border border-border/50">
                  +{service.addons.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price Section */}
        <div className="px-5 flex-1 flex flex-col">
          <div className="py-4 border-t border-border/40 space-y-2">
            {service.is_bundle ? (
              // Bundle: show base price as "Starting at" (minimum price)
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Starting at</span>
                <span className="font-mono text-xl font-semibold text-foreground tracking-tight">
                  {service.price_varies_by_state ? 'Get Quote' : `₹${baseOllvyFee.toLocaleString('en-IN')}`}
                </span>
              </div>
            ) : (
              // Non-bundle: show fee breakdown
              <>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">Ollvy fee</span>
                  <span className="font-mono text-base font-medium text-foreground">
                    {service.price_varies_by_state ? 'Quote' : `₹${baseOllvyFee.toLocaleString('en-IN')}`}
                    {!service.price_varies_by_state && billingLabel && (
                      <span className="text-muted-foreground font-normal text-sm">{billingLabel}</span>
                    )}
                  </span>
                </div>
                {govtFee > 0 && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">Govt fee</span>
                    <span className="font-mono text-base text-muted-foreground">
                      ₹{govtFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-border/40">
                  <span className="text-sm font-medium text-foreground">
                    {priceVariesByQuestionnaire ? 'Starting from' : 'Total'}
                  </span>
                  <span className="font-mono text-xl font-semibold text-foreground tracking-tight">
                    {service.price_varies_by_state ? 'Get Quote' : `₹${nonBundleTotal.toLocaleString('en-IN')}`}
                    {!service.price_varies_by_state && billingLabel && (
                      <span className="text-muted-foreground font-normal text-sm">{billingLabel}</span>
                    )}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-muted/20 border-t border-border/40 mt-auto">
          {/* Disclaimer or SLA text */}
          {isRetainer ? (
            <p className="font-mono text-[10px] text-muted-foreground mb-3">
              Recurring {service.billing_cycle} service
            </p>
          ) : completionEstimate?.govtDisclaimer ? (
            <p className="font-mono text-[10px] text-muted-foreground mb-3 leading-relaxed">
              {completionEstimate.govtDisclaimer}
            </p>
          ) : null}

          {/* Bottom row: Badges */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {guaranteedDate && !isRetainer && (
                <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" />
                  Guaranteed by {guaranteedDate}
                </span>
              )}
              {service.avg_rating && service.rating_count > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {service.avg_rating.toFixed(1)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {isUrgent && (
                <span className="font-mono text-[9px] px-2 py-1 rounded-md uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  Urgent
                </span>
              )}
              {service.tier_label && (
                <span className="font-mono text-[9px] px-2 py-1 rounded-md bg-muted/60 text-muted-foreground border border-border/50">
                  {service.tier_label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

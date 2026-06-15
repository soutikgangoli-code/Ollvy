'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Phone, MessageCircle, Square, CheckSquare, Info } from 'lucide-react'
import { getCompletionEstimate } from '@/lib/dates'
import { prefetchServiceCheckout } from '@/lib/prefetch-service-checkout'
import { DBServiceConfig } from '@/lib/data/services'
import { cn } from '@/lib/utils'
import { getWhatsAppLink, getPhoneLink } from '@/lib/constants'
import { usePostHogEvents } from '@/lib/hooks/usePostHogEvents'
import { useAuthStore } from '@/lib/stores/auth-store'
import { firePreCreateOrder } from '@/lib/checkout-warmup'
import { getFullAttributionData } from '@/lib/utm'
import { GovtFeeRow } from '@/components/pricing/GovtFeeRow'
import { govtFeeIncludes } from '@/lib/pricing/govt-fee-includes'

interface BookingPanelProps {
  service: DBServiceConfig
  serviceId?: string // DB ID for checkout
  priceVariesByState?: boolean
  // Optional controlled variant state (for syncing with parent)
  selectedVariant?: string
  onVariantChange?: (variantId: string) => void
  // Optional controlled addons state (for syncing with parent)
  selectedAddons?: string[]
  onAddonsChange?: (addonIds: string[]) => void
}

export function BookingPanel({
  service,
  serviceId,
  priceVariesByState,
  selectedVariant: controlledVariant,
  onVariantChange,
  selectedAddons: controlledAddons,
  onAddonsChange,
}: BookingPanelProps) {
  // Internal state for uncontrolled mode
  const [internalVariant, setInternalVariant] = useState<string>(
    service.defaultVariantId ?? service.variants?.[0]?.id ?? ''
  )
  const [expandedTooltip, setExpandedTooltip] = useState<string | null>(null)

  // Initialize addon selection based on defaultSelected
  const defaultAddonIds = useMemo(() => {
    return service.addons
      ?.filter(addon => addon.defaultSelected || addon.required)
      .map(addon => addon.id) ?? []
  }, [service.addons])

  const [internalAddons, setInternalAddons] = useState<string[]>(defaultAddonIds)

  // Use controlled variant if provided, otherwise use internal state
  const selectedVariant = controlledVariant ?? internalVariant
  const setSelectedVariant = (variantId: string) => {
    if (onVariantChange) {
      onVariantChange(variantId)
    } else {
      setInternalVariant(variantId)
    }
  }

  // Use controlled addons if provided, otherwise use internal state
  const selectedAddonIds = controlledAddons ?? internalAddons
  const toggleAddon = (addonId: string) => {
    const addon = service.addons?.find(a => a.id === addonId)
    if (addon?.required) return // Can't toggle required addons

    const newAddons = selectedAddonIds.includes(addonId)
      ? selectedAddonIds.filter(id => id !== addonId)
      : [...selectedAddonIds, addonId]

    if (onAddonsChange) {
      onAddonsChange(newAddons)
    } else {
      setInternalAddons(newAddons)
    }
  }

  // Calculate completion estimate with govt processing awareness
  const completionEstimate = service.isRetainer
    ? null
    : getCompletionEstimate(
        service.slaDays,
        service.hasGovtProcessing ?? false,
        service.completionMaxDays,
        service.completionRangeText
      )

  const guaranteedDate = service.isRetainer
    ? service.nextDueDateValue
    : completionEstimate?.guaranteedDate ?? null

  // Calculate price with variant adjustment
  const selectedVariantData = service.variants?.find(v => v.id === selectedVariant)
  const priceAdjustment = selectedVariantData?.priceAdjustment ?? 0
  const govtFeeAdjustment = selectedVariantData?.govtFeeAdjustment ?? 0

  // Combine Ollvy fee + govt fee into single "service fee"
  const baseServiceFee = service.ollvyFee + (service.govtFee ?? 0) + (priceAdjustment / 100) + (govtFeeAdjustment / 100)
  // Split out for the expandable breakdown: Ollvy's flat fee vs the govt pass-through.
  const ollvyServiceFee = service.ollvyFee + (priceAdjustment / 100)
  const govtFeeAmount = (service.govtFee ?? 0) + (govtFeeAdjustment / 100)

  // Calculate addon totals (combine Ollvy fees + govt fees into single price)
  const addonTotals = useMemo(() => {
    if (!service.addons) return 0
    const selectedAddons = service.addons.filter(addon => selectedAddonIds.includes(addon.id))
    return selectedAddons.reduce((sum, addon) => sum + addon.pricePaisa + (addon.govtFeePaisa ?? 0), 0) / 100
  }, [service.addons, selectedAddonIds])

  const totalFee = baseServiceFee + addonTotals

  // Services where govt fees vary based on questionnaire answers
  // These show "Starting from" prefix since final price depends on user input
  const priceVariesByQuestionnaire = [
    'trademark-registration',
    'pvt-ltd-incorporation',
    'llp-incorporation',
  ].includes(service.slug)

  // Services with pre-payment questions that don't affect pricing
  // These route through eligibility for context collection but keep fixed pricing labels
  const hasPrePaymentQuestions = [
    'iepf-consultation',
  ].includes(service.slug)

  // Use DB ID for checkout if available, otherwise fall back to slug
  const checkoutId = serviceId ?? service.slug

  // Determine CTA label and URL based on service type
  const ctaLabel = priceVariesByState
    ? 'Get Quote'
    : priceVariesByQuestionnaire
    ? 'Check Eligibility & Price'
    : 'Start Application'

  // Build checkout URL with optional variant and addon params
  // Services with pre-payment questions (pricing or context) go to eligibility page first
  const baseCheckoutUrl = priceVariesByState
    ? `/quote/request/${checkoutId}`
    : (priceVariesByQuestionnaire || hasPrePaymentQuestions)
    ? `/checkout/${checkoutId}/eligibility`
    : `/checkout/${checkoutId}`
  const urlParams = new URLSearchParams()
  if (service.variants && selectedVariant) {
    urlParams.set('variant', selectedVariant)
  }
  if (service.addons && selectedAddonIds.length > 0) {
    urlParams.set('addons', selectedAddonIds.join(','))
  }
  const ctaUrl = urlParams.toString() ? `${baseCheckoutUrl}?${urlParams.toString()}` : baseCheckoutUrl

  const { trackCheckoutCTAClick } = usePostHogEvents()
  const { session, user } = useAuthStore()

  // For direct-checkout flows (GST, ITR, MCA filing, etc — services with no
  // /eligibility step), fire the pre-create on CTA click. Mirror of what
  // /eligibility/page.tsx does in handleComplete: kick off
  // create-razorpay-order in the background so by the time CheckoutClient
  // mounts and the user clicks Pay, the order is already in Razorpay's
  // system. Without this, the GST/ITR/etc. checkout pays the full cold
  // create-order roundtrip on first Pay click (~2-3s).
  //
  // Eligibility-routed services (pvt-ltd, llp, trademark, iepf) intentionally
  // skip this — they fire their own pre-create at the END of /eligibility
  // (with pre-cursor answers included), so firing here would be redundant
  // and create an orphaned Razorpay order.
  const fireDirectCheckoutPreCreate = useCallback(() => {
    if (priceVariesByState || priceVariesByQuestionnaire || hasPrePaymentQuestions) return
    if (!serviceId) return
    const accessToken = session?.access_token
    const userId = user?.id
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!accessToken || !userId || !url) return

    // Fingerprint format MUST mirror CheckoutClient.tsx orderFingerprint
    const fingerprint = [
      serviceId,
      selectedVariant ?? '',
      [...selectedAddonIds].sort().join(','),
      '', // no promo applied yet
      JSON.stringify({}), // no pre-cursor answers on direct flow
    ].join('|')

    firePreCreateOrder(
      {
        supabaseUrl: url,
        accessToken,
        servicePackageId: serviceId,
        userId,
        variantId: selectedVariant || null,
        addonIds: selectedAddonIds,
        preCursorAnswers: {},
        attribution: getFullAttributionData(),
      },
      fingerprint,
    ).catch((err) => {
      console.error('[BookingPanel] pre-create unexpected rejection:', err)
    })
  }, [
    priceVariesByState,
    priceVariesByQuestionnaire,
    hasPrePaymentQuestions,
    serviceId,
    session?.access_token,
    user?.id,
    selectedVariant,
    selectedAddonIds,
  ])

  // Prefetch checkout service data on CTA hover. Also kicks off the Razorpay
  // pre-create for direct-checkout flows: hover-to-click latency is typically
  // 300-1500ms, which is "free" head-start time the pre-create can use. The
  // module-level cache in firePreCreateOrder dedupes against the click-time
  // fire, so calling both is safe.
  // Guard the whole hover action with a ref: fireDirectCheckoutPreCreate must
  // run AT MOST ONCE per mount. firePreCreateOrder only dedupes against its
  // *completed* cache (not in-flight calls), so a second fire during the
  // create-order window would spawn a duplicate Razorpay order. The shared
  // prefetch helper has its own cross-component dedupe for the warmup query.
  const prefetchedRef = useRef(false)
  const prefetchCheckout = useCallback(() => {
    if (prefetchedRef.current) return
    prefetchedRef.current = true
    prefetchServiceCheckout(service.slug, priceVariesByQuestionnaire || hasPrePaymentQuestions)
    // Fire the actual Razorpay order pre-create at hover time for
    // direct-checkout services. No-ops for eligibility / quote flows and
    // when the user isn't logged in (which is also when there's no token).
    fireDirectCheckoutPreCreate()
  }, [service.slug, priceVariesByQuestionnaire, hasPrePaymentQuestions, fireDirectCheckoutPreCreate])

  return (
    <Card className="border border-border bg-card p-6 w-full rounded-xl shadow-sm">
      {/* Guaranteed date at top */}
      {guaranteedDate && (
        <div className="pb-5 border-b border-border mb-5">
          <div className="flex items-center gap-2">
            <CheckCircle
              size={14}
              className="text-[hsl(var(--ollvy-green))] shrink-0"
            />
            <p className="text-[16px] font-semibold text-foreground font-mono">
              {service.isRetainer
                ? `Current cycle due: ${guaranteedDate}`
                : `Delivery by ${guaranteedDate}`}
            </p>
          </div>
        </div>
      )}

      {/* Variant selector - for services with pricing options */}
      {service.variants && service.variants.length > 0 && (
        <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-4 mb-5">
          <p className="font-mono uppercase tracking-wider text-xs text-amber-600 dark:text-amber-400 mb-3">
            {service.variants.some((v: any) => v.tooltip)
              ? 'YOUR BUSINESS ENTITY TYPE'
              : 'YOUR EXPECTED ANNUAL TURNOVER'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {service.variants.map((variant: any) => (
              <div key={variant.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setSelectedVariant(variant.id)}
                  className={cn(
                    'border rounded-xl p-3 text-left transition-all',
                    selectedVariant === variant.id
                      ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
                      : 'border-border hover:border-border/80'
                  )}
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-xs font-medium text-foreground">{variant.label}</p>
                    {variant.tooltip && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedTooltip(expandedTooltip === variant.id ? null : variant.id)
                        }}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`More info about ${variant.label}`}
                      >
                        <Info size={12} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{variant.sublabel}</p>
                </button>
                {variant.tooltip && expandedTooltip === variant.id && (
                  <p className="text-[11px] text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mt-1">
                    {variant.tooltip.includes('\n')
                      ? variant.tooltip.split('\n').filter(Boolean).map((line: string, j: number) => (
                          <span key={j}>{j > 0 && <br />}{line}</span>
                        ))
                      : variant.tooltip}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Addon services - selectable checkboxes */}
      {service.addons && service.addons.length > 0 && (
        <div className="border border-border rounded-xl p-4 mb-5">
          <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-3">
            INCLUDED SERVICES
          </p>
          <div className="space-y-2">
            {service.addons.map((addon) => {
              const isSelected = selectedAddonIds.includes(addon.id)
              const isRequired = addon.required
              // Combine addon price + govt fee into single displayed price
              const addonTotalPrice = (addon.pricePaisa + (addon.govtFeePaisa ?? 0)) / 100

              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(addon.id)}
                  disabled={isRequired}
                  className={cn(
                    'w-full border rounded-lg p-3 text-left transition-all flex items-start gap-3',
                    isSelected
                      ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
                      : 'border-border hover:border-border/80 bg-muted/30',
                    isRequired && 'cursor-not-allowed opacity-70'
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-[hsl(var(--ollvy-green))]" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{addon.name}</p>
                      <span className="font-mono text-xs text-foreground shrink-0">
                        ₹{addonTotalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {addon.description?.includes('\n')
                        ? addon.description.split('\n').filter(Boolean).map((line: string, j: number) => (
                            <span key={j}>{j > 0 && <br />}{line}</span>
                          ))
                        : addon.description}
                    </p>
                    {isRequired && (
                      <span className="inline-block mt-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        Required
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Total amount - prominent */}
      <div className="mb-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
          {priceVariesByQuestionnaire ? 'Starting from' : 'Total to pay now'}
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="font-mono text-4xl font-bold text-foreground">
            ₹{totalFee.toLocaleString('en-IN')}
          </p>
          {service.mrp && service.mrp > totalFee && (
            <p className="font-mono text-lg text-muted-foreground line-through">
              ₹{service.mrp.toLocaleString('en-IN')}
            </p>
          )}
        </div>
      </div>

      {/* Fee breakdown */}
      <div className="mt-5 space-y-3">
        {/* Base service fee */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {selectedVariantData?.sublabel ?? service.shortName ?? service.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Service fee
              </p>
            </div>
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">
            ₹{ollvyServiceFee.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Government fees — expand the chevron to see what they cover */}
        {govtFeeAmount > 0 && (
          <GovtFeeRow
            amountLabel={`₹${govtFeeAmount.toLocaleString('en-IN')}`}
            includes={govtFeeIncludes(service.slug)}
            rowClassName="pl-3.5"
            labelClassName="text-sm text-muted-foreground"
            valueClassName="font-mono text-sm text-foreground"
          />
        )}

        {/* Selected addon fees */}
        {service.addons?.filter(addon => selectedAddonIds.includes(addon.id)).map(addon => {
          const addonTotalPrice = (addon.pricePaisa + (addon.govtFeePaisa ?? 0)) / 100
          return (
            <div key={addon.id} className="flex justify-between items-start">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{addon.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Service fee</p>
                </div>
              </div>
              <span className="font-mono text-sm text-foreground">
                ₹{addonTotalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          )
        })}

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
      <Button className="w-full mt-5" size="lg" asChild onMouseEnter={prefetchCheckout} onTouchStart={prefetchCheckout} onPointerDown={prefetchCheckout}>
        <Link
          href={ctaUrl}
          prefetch={true}
          onClick={() => {
            // For direct-checkout services (GST and friends) this fires
            // create-razorpay-order in the background so /checkout opens
            // with the order already created. No-op for eligibility-routed
            // and quote-routed flows.
            fireDirectCheckoutPreCreate()
            trackCheckoutCTAClick(service.slug, {
              cta_label: ctaLabel,
              variant_id: selectedVariant || undefined,
              addon_ids: selectedAddonIds,
              total_paisa: Math.round(totalFee * 100),
              flow: priceVariesByState
                ? 'quote'
                : priceVariesByQuestionnaire || hasPrePaymentQuestions
                ? 'eligibility'
                : 'direct_checkout',
            })
          }}
        >
          {ctaLabel}
        </Link>
      </Button>

      {/* Have queries */}
      <div className="mt-5 pt-5 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">
          Questions about documents, process, or price?
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={getWhatsAppLink(`Hi, I have a question about ${service.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-10 rounded-lg border border-border bg-muted/30 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
          >
            <MessageCircle className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
            WhatsApp
          </a>
          <a
            href={getPhoneLink()}
            className="flex items-center justify-center gap-2 h-10 rounded-lg border border-border bg-muted/30 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
          >
            <Phone className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
            Call
          </a>
        </div>
      </div>

    </Card>
  )
}

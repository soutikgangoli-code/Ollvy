'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CloudKitchenPack, formatPaisa, calculatePackTotal } from '@/lib/data/packs'
import { PackStickyTopBar } from './PackStickyTopBar'
import { PackHero } from './PackHero'
import { TurnoverToggle } from './TurnoverToggle'
import { PackBuilder } from './PackBuilder'
import { PackPriceSummary } from './PackPriceSummary'
import { PackAddOns } from './PackAddOns'
import { PackRetainerHook } from './PackRetainerHook'
import { PackProcessStepper } from './PackProcessStepper'
import { PackWhatsIncluded } from './PackWhatsIncluded'
import { PackComparison } from './PackComparison'
import { PackSocialProof } from './PackSocialProof'
import { PackDocuments } from './PackDocuments'
import { PackRisks } from './PackRisks'
import { PackFAQs } from './PackFAQs'
import { PackUnlocks } from './PackUnlocks'
import { PackFinalCTA } from './PackFinalCTA'
import { PackBookingPanel } from './PackBookingPanel'
import { MobileBookingBar } from './MobileBookingBar'

// STATE: selectedServiceIds controls live price. All 4 selected by default.
// fssaiVariant: 'basic' | 'state' - from TurnoverToggle

export function PackPage({ pack }: { pack: CloudKitchenPack }) {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    pack.services.map((s) => s.id)
  )
  const [fssaiVariant, setFssaiVariant] = useState<'basic' | 'state'>('state')
  const [heroVisible, setHeroVisible] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)

  // Compute live prices
  const services = pack.services.map((s) => ({
    ...s,
    // If FSSAI and basic selected, override price to basic (₹8,999 = 899900 paisa)
    price: s.id === 'fssai-state-license' && fssaiVariant === 'basic' ? 899900 : s.price,
  }))

  const priceCalc = calculatePackTotal(
    services,
    selectedServiceIds,
    pack.discountPercent,
    services.map((s) => s.id)
  )

  const toggleService = useCallback((id: string) => {
    setSelectedServiceIds((prev) => {
      const isSelected = prev.includes(id)
      if (isSelected && prev.length <= 2) return prev // enforce minimum 2
      return isSelected ? prev.filter((x) => x !== id) : [...prev, id]
    })
  }, [])

  // Sticky bar: hide when hero CTA is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  const checkoutHref = `/checkout/pack/${pack.slug}?services=${selectedServiceIds.join(',')}&fssai=${fssaiVariant}`

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">

      {/* STICKY TOP BAR - hidden until hero scrolls out */}
      <PackStickyTopBar
        visible={!heroVisible}
        packName={pack.name}
        total={priceCalc.total}
        checkoutHref={checkoutHref}
      />

      {/* HERO */}
      <div ref={heroRef}>
        <PackHero
          pack={pack}
          total={priceCalc.total}
          checkoutHref={checkoutHref}
        />
      </div>

      {/* MAIN CONTENT + SIDEBAR */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">

          {/* LEFT COLUMN */}
          <div className="min-w-0 space-y-24">

            {/* Turnover toggle */}
            <TurnoverToggle
              value={fssaiVariant}
              onChange={setFssaiVariant}
            />

            {/* Pack builder */}
            <section id="pack-builder">
              <PackBuilder
                services={services}
                selectedIds={selectedServiceIds}
                onToggle={toggleService}
              />
            </section>

            {/* Price summary + CTA */}
            <PackPriceSummary
              services={services}
              selectedIds={selectedServiceIds}
              priceCalc={priceCalc}
              discountPercent={pack.discountPercent}
              checkoutHref={checkoutHref}
            />

            {/* Add-ons */}
            <section id="add-ons">
              <PackAddOns addOns={pack.addOns} />
            </section>

            {/* GST Retainer Hook */}
            <PackRetainerHook hook={pack.retainerHook} />

            {/* Process stepper */}
            <section id="timeline">
              <PackProcessStepper steps={pack.processSteps} />
            </section>

            {/* What's included */}
            <section id="included">
              <PackWhatsIncluded groups={pack.whatsIncluded} />
            </section>

            {/* Comparison */}
            <section id="why-ollvy">
              <PackComparison
                without={pack.comparisonWithout}
                with_={pack.comparisonWith}
              />
            </section>

            {/* Social proof */}
            <section id="reviews">
              <PackSocialProof
                stats={pack.stats}
                keywordChips={pack.keywordChips}
                reviews={pack.reviews}
                personas={pack.personas}
              />
            </section>

            {/* Documents */}
            <section id="documents">
              <PackDocuments groups={pack.documentGroups} />
            </section>

            {/* Risks */}
            <section id="risks">
              <PackRisks risks={pack.risks} />
            </section>

            {/* FAQs */}
            <section id="faqs">
              <PackFAQs faqs={pack.faqs} />
            </section>

            {/* Unlocks */}
            <PackUnlocks unlocks={pack.unlocks} />

            {/* Final CTA */}
            <PackFinalCTA
              total={priceCalc.total}
              checkoutHref={checkoutHref}
              guaranteeText={pack.guaranteeText}
            />

          </div>

          {/* RIGHT SIDEBAR - desktop only, sticky */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <PackBookingPanel
                services={services}
                selectedIds={selectedServiceIds}
                priceCalc={priceCalc}
                discountPercent={pack.discountPercent}
                guaranteeText={pack.guaranteeText}
                checkoutHref={checkoutHref}
              />
            </div>
          </aside>

        </div>
      </div>

      {/* MOBILE BOTTOM BAR - hidden on desktop */}
      <MobileBookingBar
        total={priceCalc.total}
        checkoutHref={checkoutHref}
        discountPercent={pack.discountPercent}
        originalTotal={priceCalc.subtotal}
      />

    </div>
  )
}

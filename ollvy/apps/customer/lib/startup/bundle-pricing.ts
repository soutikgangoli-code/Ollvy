// Bundle pricing for the /startup compliance stack.
// Discounts apply to Ollvy fees only — govt fees pass through unchanged.

import type { BundleServiceData } from '@/lib/data/services'

export interface BundlePriceBreakdown {
  itemCount: number
  ollvyFeesPaisa: number       // sum of price_base_paisa
  govtFeesPaisa: number        // sum of price_govt_fees_paisa
  mrpSavingsPaisa: number      // sum of (mrp - base) per item where mrp > base
  bundleDiscountRate: number   // 0, 0.05, or 0.10
  bundleDiscountPaisa: number  // bundleDiscountRate × ollvyFeesPaisa
  totalBeforeBundleDiscountPaisa: number
  totalPaisa: number           // final amount due before GST (GST is added in the edge function)
}

/**
 * Bundle discount tiers — apply on Ollvy fees only.
 *  3–4 services → 5%
 *  5+ services  → 10%
 */
export function getBundleDiscountRate(itemCount: number): number {
  if (itemCount >= 5) return 0.10
  if (itemCount >= 3) return 0.05
  return 0
}

export function calculateBundlePrice(items: BundleServiceData[]): BundlePriceBreakdown {
  const itemCount = items.length

  let ollvyFeesPaisa = 0
  let govtFeesPaisa = 0
  let mrpSavingsPaisa = 0

  for (const item of items) {
    ollvyFeesPaisa += item.ollvyFeePaisa
    govtFeesPaisa += item.govtFeePaisa
    if (item.mrpPaisa > item.ollvyFeePaisa) {
      mrpSavingsPaisa += item.mrpPaisa - item.ollvyFeePaisa
    }
  }

  const bundleDiscountRate = getBundleDiscountRate(itemCount)
  const bundleDiscountPaisa = Math.round(ollvyFeesPaisa * bundleDiscountRate)
  const totalBeforeBundleDiscountPaisa = ollvyFeesPaisa + govtFeesPaisa
  const totalPaisa = totalBeforeBundleDiscountPaisa - bundleDiscountPaisa

  return {
    itemCount,
    ollvyFeesPaisa,
    govtFeesPaisa,
    mrpSavingsPaisa,
    bundleDiscountRate,
    bundleDiscountPaisa,
    totalBeforeBundleDiscountPaisa,
    totalPaisa,
  }
}

export function formatPaisa(paisa: number): string {
  return `₹${(paisa / 100).toLocaleString('en-IN')}`
}

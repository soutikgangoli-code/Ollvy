/**
 * Price calculation utility for services based on pre-cursor answers.
 * SINGLE SOURCE OF TRUTH for dynamic pricing — the eligibility page (live price
 * preview) and the checkout page must both compute the govt fee through
 * resolveGovtFeePaisa() so the number can never diverge between the two screens.
 */

export interface PriceBreakdown {
  serviceFee: number       // Ollvy's service fee in paisa
  govtFees: number         // Government fees in paisa
  addonsTotal: number      // Selected add-ons total in paisa
  gst: number              // GST amount in paisa
  gstRate: number          // GST rate (e.g., 18)
  total: number            // Total amount in paisa
}

export interface ServicePriceConfig {
  slug: string
  priceBasePaisa: number
  priceGovtFeesPaisa: number
  priceGstRate: number
}

/**
 * Resolve the government fee (in paisa) for a service given its pre-cursor answers.
 * For the 3 services with answer-driven govt fees (trademark, pvt-ltd, llp) this
 * computes the exact fee; for every other service it returns the passed-in default.
 *
 * `defaultGovtFeePaisa` is the service's base govt fee (price_govt_fees_paisa,
 * plus any variant adjustment the caller has already folded in).
 */
export function resolveGovtFeePaisa(
  slug: string,
  defaultGovtFeePaisa: number,
  preCursorAnswers: Record<string, unknown> = {}
): number {
  // --- TRADEMARK --- govt fee = rate per class x number of classes.
  // Rate depends on applicant type: Individual/Proprietor/MSME/Startup = Rs 4,500,
  // others = Rs 9,000. No type selected yet -> discounted rate (matches the floor).
  if (slug === 'trademark-registration') {
    const applicantType = String(preCursorAnswers.applicant_type || '')
    const classCount = Number(preCursorAnswers.trademark_class_count) || 1
    const isDiscountEligible = ['individual', 'sole_proprietor', 'msme', 'startup'].includes(applicantType)
    const ratePerClass = applicantType ? (isDiscountEligible ? 450000 : 900000) : 450000
    return ratePerClass * classCount
  }

  // --- PRIVATE LIMITED COMPANY --- floor (Rs 1L) holds the fixed statutory cost;
  // above it the only real increase is Delhi stamp duty (0.15% of authorized capital).
  // MCA registration fee is waived up to Rs 15L. +Rs 1,200 DSC per director beyond 2.
  if (slug === 'pvt-ltd-incorporation' && preCursorAnswers.authorized_capital) {
    const capital = String(preCursorAnswers.authorized_capital)
    const directors = Number(preCursorAnswers.number_of_directors) || 2
    const additionalDSCCost = Math.max(0, directors - 2) * 120000
    const capitalSlabs: Record<string, number> = {
      '100000':   799900,   // Rs 1L   -> Rs 7,999 (incl ~Rs 150 stamp at 0.15%)
      '500000':   859900,   // Rs 5L   -> +Rs 600 stamp duty
      '1000000':  934900,   // Rs 10L  -> +Rs 1,350 stamp duty
      '2500000':  1159900,  // Rs 25L  -> +Rs 3,600 stamp duty
      '5000000':  1534900,  // Rs 50L  -> +Rs 7,350 stamp duty
      '10000000': 2284900,  // Rs 1Cr  -> +Rs 14,850 stamp duty
    }
    return (capitalSlabs[capital] ?? 799900) + additionalDSCCost
  }

  // --- LLP --- FiLLiP govt fee by contribution tier (central, uniform across states).
  // +Rs 1,200 DSC per partner beyond 2.
  if (slug === 'llp-incorporation' && preCursorAnswers.total_contribution) {
    const contribution = String(preCursorAnswers.total_contribution)
    const partners = Number(preCursorAnswers.number_of_partners) || 2
    const additionalDSCCost = Math.max(0, partners - 2) * 120000
    const contributionSlabs: Record<string, number> = {
      '10000':   50000,   // Rs 10,000 -> up to Rs 1L -> Rs 500
      '50000':   50000,   // Rs 50,000 -> up to Rs 1L -> Rs 500
      '100000':  50000,   // Rs 1L     -> up to Rs 1L -> Rs 500
      '500000':  200000,  // Rs 5L     -> Rs 1L-5L    -> Rs 2,000
      '1000000': 400000,  // Rs 10L    -> Rs 5L-10L   -> Rs 4,000
    }
    // Unknown / "other" (specify later, typically above Rs 10L) -> Rs 5,000.
    return (contributionSlabs[contribution] ?? 500000) + additionalDSCCost
  }

  return defaultGovtFeePaisa
}

/**
 * Calculate price breakdown based on service and pre-cursor answers.
 */
export function calculateServicePrice(
  service: ServicePriceConfig,
  preCursorAnswers: Record<string, unknown> = {},
  selectedAddonsPaisa: number = 0
): PriceBreakdown {
  const serviceFee = service.priceBasePaisa
  const govtFeePaisa = resolveGovtFeePaisa(service.slug, service.priceGovtFeesPaisa || 0, preCursorAnswers)

  const gstRate = service.priceGstRate || 18

  // GST only on service fee + addons, not govt fees
  const taxableAmount = serviceFee + selectedAddonsPaisa
  const gst = Math.round(taxableAmount * (gstRate / 100))

  const total = serviceFee + govtFeePaisa + selectedAddonsPaisa + gst

  return {
    serviceFee,
    govtFees: govtFeePaisa,
    addonsTotal: selectedAddonsPaisa,
    gst,
    gstRate,
    total: Math.max(0, total),
  }
}

/**
 * Format price in paisa to INR display string
 */
export function formatPrice(paisa: number): string {
  return '₹' + Math.ceil(paisa / 100).toLocaleString('en-IN')
}

/**
 * Price calculation utility for services based on pre-cursor answers
 * This is the single source of truth for dynamic pricing
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
 * Calculate price breakdown based on service and pre-cursor answers
 */
export function calculateServicePrice(
  service: ServicePriceConfig,
  preCursorAnswers: Record<string, unknown> = {},
  selectedAddonsPaisa: number = 0
): PriceBreakdown {
  const serviceFee = service.priceBasePaisa

  // Start with base govt fees
  let govtFeePaisa = service.priceGovtFeesPaisa || 0

  // --- TRADEMARK ---
  // Govt fee = rate per class x number of classes
  // Rate depends on applicant type: Individual/MSME/Startup = Rs 4,500, Others = Rs 9,000
  if (service.slug === 'trademark-registration') {
    const applicantType = String(preCursorAnswers.applicant_type || '')
    const classCount = Number(preCursorAnswers.trademark_class_count) || 1 // Default to 1 class
    const isDiscountEligible = ['individual', 'sole_proprietor', 'msme', 'startup'].includes(applicantType)
    // Individual/Proprietor/MSME/Startup: Rs 4,500/class (450000 paisa)
    // Company/LLP/Partnership/Others: Rs 9,000/class (900000 paisa)
    // If no applicant type is selected yet, default to the discounted rate so the
    // live price matches the advertised "starting from" floor (never above it).
    const ratePerClass = applicantType ? (isDiscountEligible ? 450000 : 900000) : 450000
    govtFeePaisa = ratePerClass * classCount
  }

  // --- PRIVATE LIMITED COMPANY ---
  // Govt fee = MCA ROC filing fee + Delhi stamp duty on authorized capital
  if (service.slug === 'pvt-ltd-incorporation' && preCursorAnswers.authorized_capital) {
    const capital = String(preCursorAnswers.authorized_capital)
    const directors = Number(preCursorAnswers.number_of_directors) || 2
    const additionalDSCCost = Math.max(0, directors - 2) * 120000 // Rs 1,200 per director beyond 2

    // Floor (Rs 1L) holds the fixed statutory cost (DSC, name reservation, forms,
    // PAN/TAN, base stamp). Above the floor the ONLY real increase is Delhi stamp
    // duty on the Articles = 0.15% of authorized capital. MCA's registration fee is
    // waived up to Rs 15L, so we do not inflate beyond actual stamp duty. (Any small
    // ROC fee above Rs 15L is finalised at filing.)
    const capitalSlabs: Record<string, number> = {
      '100000':   799900,   // Rs 1L   -> Rs 7,999 (incl ~Rs 150 stamp at 0.15%)
      '500000':   859900,   // Rs 5L   -> +Rs 600 stamp duty
      '1000000':  934900,   // Rs 10L  -> +Rs 1,350 stamp duty
      '2500000':  1159900,  // Rs 25L  -> +Rs 3,600 stamp duty
      '5000000':  1534900,  // Rs 50L  -> +Rs 7,350 stamp duty
      '10000000': 2284900,  // Rs 1Cr  -> +Rs 14,850 stamp duty
    }

    govtFeePaisa = (capitalSlabs[capital] ?? 799900) + additionalDSCCost
  }

  // --- LLP ---
  // Govt fee = FiLLiP stamp duty on total capital contribution
  if (service.slug === 'llp-incorporation' && preCursorAnswers.total_contribution) {
    const contribution = String(preCursorAnswers.total_contribution)
    const partners = Number(preCursorAnswers.number_of_partners) || 2
    const additionalDSCCost = Math.max(0, partners - 2) * 120000 // Rs 1,200 per partner beyond 2

    // FiLLiP govt fee slabs (central government - uniform across states), keyed by
    // the actual rupee contribution values the questionnaire stores. MCA tiers:
    //   up to Rs 1L -> Rs 500, Rs 1L-5L -> Rs 2,000, Rs 5L-10L -> Rs 4,000, above -> Rs 5,000
    const contributionSlabs: Record<string, number> = {
      '10000':   50000,   // Rs 10,000 -> up to Rs 1L -> Rs 500
      '50000':   50000,   // Rs 50,000 -> up to Rs 1L -> Rs 500
      '100000':  50000,   // Rs 1L     -> up to Rs 1L -> Rs 500
      '500000':  200000,  // Rs 5L     -> Rs 1L-5L    -> Rs 2,000
      '1000000': 400000,  // Rs 10L    -> Rs 5L-10L   -> Rs 4,000
    }

    // Unknown / "other" (specify later, typically above Rs 10L) -> Rs 5,000.
    govtFeePaisa = (contributionSlabs[contribution] ?? 500000) + additionalDSCCost
  }

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
  return '\u20B9' + Math.ceil(paisa / 100).toLocaleString('en-IN')
}

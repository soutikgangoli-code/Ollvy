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
    const isDiscountEligible = ['individual', 'proprietorship', 'msme', 'startup'].includes(applicantType)
    // Individual/Proprietor/MSME/Startup: Rs 4,500/class (450000 paisa)
    // Company/LLP/Partnership/Others: Rs 9,000/class (900000 paisa)
    // If no applicant type selected yet, use full rate as default
    const ratePerClass = applicantType ? (isDiscountEligible ? 450000 : 900000) : 900000
    govtFeePaisa = ratePerClass * classCount
  }

  // --- PRIVATE LIMITED COMPANY ---
  // Govt fee = MCA ROC filing fee + Delhi stamp duty on authorized capital
  if (service.slug === 'pvt-ltd-incorporation' && preCursorAnswers.authorized_capital) {
    const capital = String(preCursorAnswers.authorized_capital)
    const directors = Number(preCursorAnswers.number_of_directors) || 2
    const additionalDSCCost = Math.max(0, directors - 2) * 120000 // Rs 1,200 per director beyond 2

    // Delhi-based stamp duty + MCA ROC fee slabs (approximate)
    const capitalSlabs: Record<string, number> = {
      '100000':   799900,   // Rs 1L   -> Rs 7,999 govt fee
      '500000':   1000000,  // Rs 5L   -> Rs 10,000 govt fee
      '1000000':  1500000,  // Rs 10L  -> Rs 15,000 govt fee
      '2500000':  2500000,  // Rs 25L  -> Rs 25,000 govt fee
      '5000000':  3500000,  // Rs 50L  -> Rs 35,000 govt fee
    }

    govtFeePaisa = (capitalSlabs[capital] ?? 799900) + additionalDSCCost
  }

  // --- LLP ---
  // Govt fee = FiLLiP stamp duty on total capital contribution
  if (service.slug === 'llp-incorporation' && preCursorAnswers.total_contribution) {
    const contribution = String(preCursorAnswers.total_contribution)
    const partners = Number(preCursorAnswers.number_of_partners) || 2
    const additionalDSCCost = Math.max(0, partners - 2) * 120000 // Rs 1,200 per partner beyond 2

    // FiLLiP govt fee slabs (central government - uniform across states)
    const contributionSlabs: Record<string, number> = {
      'upto_1l':    50000,   // Up to Rs 1L   -> Rs 500 govt fee
      '1l_to_5l':   200000,  // Rs 1L-Rs 5L   -> Rs 2,000 govt fee
      '5l_to_10l':  400000,  // Rs 5L-Rs 10L  -> Rs 4,000 govt fee
      'above_10l':  500000,  // Above Rs 10L  -> Rs 5,000 govt fee
    }

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

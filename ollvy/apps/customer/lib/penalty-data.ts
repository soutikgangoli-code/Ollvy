/**
 * Penalty Table - Client-side constant
 * Per §23 Connection Point 5: "Penalty Table - seeded, client-side constant - not in DB"
 *
 * Same data used in app UI (master doc Section 24)
 */

export interface PenaltyData {
  service: string
  slug: string
  penaltyPerDay?: number
  penaltyFlat?: number
  interestRate: number
  statute: string
  gracePeriod: number
  isFlatPenalty?: boolean
}

export const PENALTY_TABLE: readonly PenaltyData[] = [
  {
    service: 'GST Monthly Filing',
    slug: 'gst-monthly',
    penaltyPerDay: 100, // ₹100/day per return (CGST+SGST combined = ₹200/day)
    interestRate: 0.18, // 18% annual on outstanding tax
    statute: 'CGST Act 2017, Section 47',
    gracePeriod: 0,
  },
  {
    service: 'Director KYC',
    slug: 'director-kyc',
    penaltyFlat: 5000, // ₹5,000 flat (not per day) for late filing
    interestRate: 0,
    statute: 'Companies Act 2013, Section 155',
    gracePeriod: 0,
    isFlatPenalty: true,
  },
  {
    service: 'MCA Annual Filing',
    slug: 'mca-annual-filing',
    penaltyPerDay: 200, // ₹100/day AOC-4 + ₹100/day MGT-7 = ₹200/day combined
    interestRate: 0,
    statute: 'Companies Act 2013, Sections 92 and 137',
    gracePeriod: 0,
  },
  {
    service: 'Business ITR',
    slug: 'business-itr',
    penaltyPerDay: 0,
    penaltyFlat: 10000, // ₹10,000 flat (₹1,000 if turnover < ₹5Cr)
    interestRate: 0.01, // 1% per month on unpaid tax under 234A
    statute: 'Income Tax Act 1961, Section 234F',
    gracePeriod: 0,
    isFlatPenalty: true,
  },
  {
    service: 'TDS Monthly Compliance',
    slug: 'tds-monthly-compliance',
    penaltyPerDay: 200, // ₹200/day for late 24Q/26Q return
    interestRate: 0.015, // 1.5% per month on late TDS deposit
    statute: 'Income Tax Act 1961, Section 234E',
    gracePeriod: 0,
  },
  {
    service: 'FSSAI License',
    slug: 'fssai-license',
    penaltyFlat: 500000, // ₹5 lakh
    interestRate: 0,
    statute: 'FSS Act 2006, Section 63',
    gracePeriod: 0,
    isFlatPenalty: true,
  },
  {
    service: 'PF Monthly Compliance',
    slug: 'pf-compliance',
    penaltyFlat: 5000, // ₹5,000 per default event
    interestRate: 0.12, // 12% annual on delayed contributions
    statute: 'EPF Act 1952, Section 14B',
    gracePeriod: 0,
    isFlatPenalty: true,
  },
  {
    service: 'ESIC Monthly Compliance',
    slug: 'esic-compliance',
    penaltyFlat: 5000, // ₹5,000 per default
    interestRate: 0.12, // 12% annual on delayed contributions
    statute: 'ESI Act 1948, Section 85',
    gracePeriod: 0,
    isFlatPenalty: true,
  },
] as const

/**
 * Calculate penalty for a given service and days late
 */
export function calculatePenalty(
  penaltyData: PenaltyData,
  daysLate: number,
  outstandingTax = 0
): {
  penaltyAmount: number
  interestAmount: number
  totalAmount: number
} {
  let penaltyAmount = 0

  if (penaltyData.isFlatPenalty) {
    penaltyAmount = penaltyData.penaltyFlat ?? 0
  } else if (penaltyData.penaltyPerDay) {
    penaltyAmount = penaltyData.penaltyPerDay * daysLate
  }

  // Interest calculation (annual rate, prorated for days)
  const interestAmount =
    penaltyData.interestRate > 0
      ? Math.round(outstandingTax * penaltyData.interestRate * (daysLate / 365))
      : 0

  return {
    penaltyAmount,
    interestAmount,
    totalAmount: penaltyAmount + interestAmount,
  }
}

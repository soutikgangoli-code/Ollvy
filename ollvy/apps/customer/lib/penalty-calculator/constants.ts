/**
 * Penalty Calculator Constants
 * Regulatory thresholds and penalty rates - updated April 2026
 */

// GST registration thresholds (in lakhs)
export const GST_THRESHOLD_GOODS = 40       // Rs. 40 lakh for goods (Section 22, CGST Act)
export const GST_THRESHOLD_SERVICES = 20    // Rs. 20 lakh for services

// Employee thresholds
export const PF_THRESHOLD_EMPLOYEES = 20   // EPF mandatory above 20 employees (EPF Act 1952)
export const ESIC_THRESHOLD_EMPLOYEES = 10 // ESIC mandatory above 10 employees (ESI Act 1948)

// Turnover thresholds (in lakhs)
export const ITR_HIGH_PENALTY_THRESHOLD = 500 // Rs. 5 crore - above this, ITR late fee is Rs. 10,000
export const GSTR9_MANDATORY_THRESHOLD = 200  // Rs. 2 crore - GSTR-9 mandatory above this

// Risk level thresholds (in rupees)
export const RISK_LEVEL_LOW_MAX = 10000    // Up to Rs. 10,000
export const RISK_LEVEL_MEDIUM_MAX = 50000 // Rs. 10,001 to Rs. 50,000
export const RISK_LEVEL_HIGH_MAX = 200000  // Rs. 50,001 to Rs. 2,00,000
// Above Rs. 2 lakh = critical

// GST LATE FEE RATES
// Per CBIC Notification 19/2021 and 20/2021 (effective 1 June 2021)
// Non-nil returns (GSTR-1, GSTR-3B): Rs. 50/day combined (Rs. 25 CGST + Rs. 25 SGST)
// Nil returns: Rs. 20/day combined (Rs. 10 CGST + Rs. 10 SGST)
// Nil return cap: Rs. 500 per return (Rs. 250 CGST + Rs. 250 SGST)
// Non-nil cap by AATO: Rs. 2,000 (<=1.5 Cr) / Rs. 5,000 (1.5-5 Cr) / Rs. 10,000 (>5 Cr)
// Source: Section 47, CGST Act 2017; CBIC Notifications 19/2021, 20/2021
export const GST_LATE_FEE_PER_DAY = 50          // Rs. 50/day combined (non-nil)
export const GST_NIL_LATE_FEE_PER_DAY = 20      // Rs. 20/day combined (nil returns)
export const GST_NIL_RETURN_CAP = 500            // Rs. 500 cap for nil returns
export const GST_INTEREST_RATE = 0.18            // 18% per annum on outstanding tax (Section 50)

// GSTR-9 (Annual Return)
// Statutory rate: Rs. 200/day (Rs. 100 CGST + Rs. 100 SGST) - Section 47(2)
// Cap: 0.25% of turnover per Act = 0.50% combined (Section 47(2), CGST Act)
// Note: CBIC Notification 07/2023 reduced fees for FY 2022-23 onwards based on AATO slabs
// This calculator uses the Section 47(2) statutory rate as the base
export const GSTR9_LATE_FEE_PER_DAY = 200       // Rs. 200/day statutory rate
export const GSTR9_CAP_RATE = 0.005             // 0.50% of turnover (0.25% per Act x 2 Acts)

// MCA filing
// AOC-4 (Section 137): Rs. 100/day, max Rs. 10 lakh
// MGT-7 (Section 92): Rs. 100/day, max Rs. 5 lakh
// Combined when both are overdue: Rs. 200/day
export const MCA_LATE_FEE_PER_DAY = 200         // Rs. 100 AOC-4 + Rs. 100 MGT-7

// Director KYC
export const DIRECTOR_KYC_FLAT_PENALTY = 5000   // Rs. 5,000 reactivation fee per director

// ITR late filing fee (Section 234F)
export const ITR_LOW_PENALTY = 1000             // Income <= Rs. 5 lakh
export const ITR_HIGH_PENALTY = 10000           // Income > Rs. 5 lakh (post Dec 31 of AY)
export const ITR_INTEREST_RATE = 0.01           // 1% per month (Section 234A)

// TDS
// Section 234E: Rs. 200/day for late return, capped at TDS amount
// Section 201(1A): 1.5%/month if deducted but deposited late; 1%/month if not deducted at all
export const TDS_LATE_FEE_PER_DAY = 200
export const TDS_INTEREST_RATE = 0.015          // 1.5%/month - late deposit (Section 201(1A)(ii))
export const TDS_NON_DEDUCTION_INTEREST_RATE = 0.01 // 1%/month - not deducted (Section 201(1A)(i))

// PF damages under Section 14B, EPF Act 1952 (tiered by default period)
// < 2 months: 5% p.a. | 2-4 months: 10% p.a. | 4-6 months: 15% p.a. | > 6 months: 25% p.a.
export const PF_INTEREST_RATE = 0.12            // Used in simplified engine calculation
export const PF_DEFAULT_PENALTY = 5000

// ESIC: 12% p.a. interest on delayed contributions (Section 85B, ESI Act 1948)
export const ESIC_INTEREST_RATE = 0.12
export const ESIC_DEFAULT_PENALTY = 5000

// Service slugs for CTA links
export const SERVICE_SLUGS = {
  gst: 'gst-monthly',
  mca: 'mca-annual-filing',
  directorKyc: 'director-kyc',
  itr: 'business-itr',
  tds: 'tds-monthly-compliance',
  pf: 'pf-registration',
  esic: 'esi-registration',
} as const

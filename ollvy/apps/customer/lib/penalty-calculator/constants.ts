/**
 * Penalty Calculator Constants
 * Thresholds and regulatory limits for compliance calculations
 */

// GST registration thresholds (in lakhs)
export const GST_THRESHOLD_GOODS = 40 // ₹40 lakhs for goods
export const GST_THRESHOLD_SERVICES = 20 // ₹20 lakhs for services

// Employee thresholds
export const PF_THRESHOLD_EMPLOYEES = 20 // PF mandatory above 20 employees
export const ESIC_THRESHOLD_EMPLOYEES = 10 // ESIC mandatory above 10 employees

// Turnover thresholds (in lakhs)
export const ITR_HIGH_PENALTY_THRESHOLD = 500 // ₹5 Cr - above this, ITR penalty is ₹10,000
export const GSTR9_MANDATORY_THRESHOLD = 200 // ₹2 Cr - GSTR-9 mandatory

// Risk level thresholds (in rupees)
export const RISK_LEVEL_LOW_MAX = 10000 // Up to ₹10,000
export const RISK_LEVEL_MEDIUM_MAX = 50000 // ₹10,001 - ₹50,000
export const RISK_LEVEL_HIGH_MAX = 200000 // ₹50,001 - ₹2,00,000
// Above ₹2L is critical

// Penalty rates
export const GST_LATE_FEE_PER_DAY = 100 // ₹100/day (CGST+SGST combined = ₹200/day, but we use per return)
export const GST_INTEREST_RATE = 0.18 // 18% annual on outstanding tax
export const MCA_LATE_FEE_PER_DAY = 200 // ₹100 AOC-4 + ₹100 MGT-7 = ₹200/day combined
export const DIRECTOR_KYC_FLAT_PENALTY = 5000 // ₹5,000 flat
export const ITR_LOW_PENALTY = 1000 // ₹1,000 if turnover < ₹5Cr
export const ITR_HIGH_PENALTY = 10000 // ₹10,000 if turnover >= ₹5Cr
export const ITR_INTEREST_RATE = 0.01 // 1% per month
export const TDS_LATE_FEE_PER_DAY = 200 // ₹200/day for late return
export const TDS_INTEREST_RATE = 0.015 // 1.5% per month on late deposits
export const PF_INTEREST_RATE = 0.12 // 12% annual
export const PF_DEFAULT_PENALTY = 5000 // ₹5,000 per default event
export const ESIC_INTEREST_RATE = 0.12 // 12% annual (same as PF)
export const ESIC_DEFAULT_PENALTY = 5000 // ₹5,000 per default

// Service slugs (for linking to service pages)
export const SERVICE_SLUGS = {
  gst: 'gst-monthly-filing',
  mca: 'mca-annual-filing',
  directorKyc: 'director-kyc',
  itr: 'business-itr',
  tds: 'tds-monthly-compliance',
  pf: 'pf-esic-compliance',
  esic: 'pf-esic-compliance',
} as const

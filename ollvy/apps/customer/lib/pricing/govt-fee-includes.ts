// What the "Government Fees" total covers, per service. This is an honest list of
// the statutory / government-process items bundled into the govt-fee figure — it
// does NOT assign a rupee amount to each line (per product decision: show WHAT is
// included plus the single total, not a per-item price breakdown).
//
// Keyed by service slug. A service with 0 or 1 entry shows no expander (there is
// nothing to reveal beyond the single total). Services absent here, or with a
// ₹0 govt fee, simply show no breakdown.

export const GOVT_FEE_INCLUDES: Record<string, string[]> = {
  'pvt-ltd-incorporation': [
    'MCA incorporation filing',
    'Stamp duty on MOA & AOA (state)',
    'Digital signature (DSC) for directors',
    'Name reservation',
    'PAN & TAN application',
  ],
  'llp-incorporation': [
    'FiLLiP incorporation filing fee',
    'Digital signature (DSC) for partners',
    'Stamp duty on LLP agreement (state, at actuals)',
    'PAN & TAN application',
  ],
  'company-name-change': [
    'RUN name reservation',
    'MGT-14 special resolution filing',
    'INC-24 central government approval',
    'Fresh certificate of incorporation',
  ],
  'cloud-kitchen-setup': [
    'FSSAI registration / license',
    'GST registration',
    'Trade / shop & establishment license (state)',
  ],
  'mca-annual-filing': [
    'AOC-4 filing fee',
    'MGT-7 / MGT-7A filing fee',
  ],
  // Single-line govt fees (no expander, listed for completeness):
  'trademark-registration': ['Trademark office filing fee (per class)'],
  'din-reactivation': ['DIR-3 KYC reactivation fee (MCA)'],
  'business-pan': ['PAN application fee (Protean / NSDL)'],
}

export function govtFeeIncludes(slug: string): string[] {
  return GOVT_FEE_INCLUDES[slug] ?? []
}

// For services whose govt fee CHANGES with the answers, a short note on what
// actually drives the change, shown in brackets under the Government Fees row.
// Services not listed here have a fixed govt fee — no note (just "Government Fees").
export const GOVT_FEE_DRIVER: Record<string, string> = {
  'pvt-ltd-incorporation': 'stamp duty',
  'llp-incorporation': 'filing fee',
  'trademark-registration': 'per class',
}

export function govtFeeDriver(slug: string): string | null {
  return GOVT_FEE_DRIVER[slug] ?? null
}

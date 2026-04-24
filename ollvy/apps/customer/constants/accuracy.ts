/**
 * Last reviewed dates for service pages
 * Update this constant after each manual review of regulatory data
 */
export const LAST_REVIEWED: Record<string, string> = {
  'pvt-ltd-incorporation': 'April 2026',
  'gst-registration': 'April 2026',
  'business-itr': 'April 2026',
  'gst-monthly': 'April 2026',
  'trademark-registration': 'April 2026',
  'llp-incorporation': 'April 2026',
  'msme-registration': 'April 2026',
  'mca-annual-filing': 'April 2026',
  'cloud-kitchen-setup': 'April 2026',
  'tds-monthly-compliance': 'April 2026',
  'business-pan': 'April 2026',
  'esop-structuring': 'April 2026',
  'gst-cancellation': 'April 2026',
  'gst-revocation': 'April 2026',
  'din-reactivation': 'April 2026',
  'company-name-change': 'April 2026',
  'iepf-consultation': 'April 2026',
}

/**
 * Named reviewers (CAs on the Ollvy team).
 * Assigned deterministically per service slug via a simple hash so attribution
 * is stable across renders, SSR, and ISR rebuilds — same service always shows
 * the same reviewer.
 */
export const REVIEWERS = [
  'Soutik Ganguly',
  'Alok Singhal',
  'Prasenjit Chaterjee',
] as const

export function getReviewerForSlug(slug: string): string {
  // FNV-1a 32-bit hash — good uniform distribution on short strings
  let h = 0x811c9dc5
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return REVIEWERS[Math.abs(h) % REVIEWERS.length]
}

/**
 * Parse "April 2026" style lastReviewed string to ISO date (first of month)
 * for use in JSON-LD `dateModified` field.
 */
export function parseReviewedToISO(reviewedStr: string | undefined): string | undefined {
  if (!reviewedStr) return undefined
  const parts = reviewedStr.split(' ')
  if (parts.length !== 2) return undefined
  const [month, year] = parts
  const monthIdx = new Date(`${month} 1, 2000`).getMonth()
  if (isNaN(monthIdx)) return undefined
  const d = new Date(parseInt(year, 10), monthIdx, 1)
  return d.toISOString().split('T')[0]
}

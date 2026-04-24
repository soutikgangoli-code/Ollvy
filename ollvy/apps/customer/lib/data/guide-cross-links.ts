/**
 * Static mapping from service slug → array of guide slugs to show in the
 * "Related Guides" section on service pages.
 *
 * Source of truth for guide slugs: the `slug` field of each config in
 * lib/guides/pages/*.ts (which sometimes differs from the filename).
 * A broken guide slug silently renders as no-op at lookup time.
 *
 * Why code, not DB: guides live in code. Keeping the cross-link map in
 * code avoids an integrity problem across two systems (DB service_packages
 * → code guide registry).
 *
 * A service with an empty entry renders no "Related Guides" section.
 */
export const SERVICE_TO_GUIDES: Record<string, string[]> = {
  // Tier A — competitive keywords need the most topical support
  'gst-registration': [
    'do-i-need-gst-registration',
    'gst-drc-01-notice',
    'gst-asmt-10-notice',
    'gst-gstr2b-itc-mismatch',
  ],
  'pvt-ltd-incorporation': [
    'pvt-ltd-vs-llp',
    'what-is-business-pan',
    'dir-3-kyc-din-deactivation',
    'roc-annual-filing-default-notice',
  ],
  'trademark-registration': ['do-i-need-trademark-registration'],
  'llp-incorporation': ['pvt-ltd-vs-llp', 'roc-annual-filing-default-notice'],
  'business-itr': [
    'business-itr-fy2025-26',
    'which-itr-form-should-i-use',
    'do-i-need-to-file-itr',
    'income-tax-143-1-intimation',
    'income-tax-148-148a-reopening',
    'income-tax-139-9-defective-return',
  ],

  // Tier B
  'gst-monthly': [
    'do-i-need-gst-registration',
    'gst-gstr2b-itc-mismatch',
    'gstr-9-fy2025-26',
  ],
  'mca-annual-filing': [
    'roc-annual-filing-default-notice',
    'dir-3-kyc-din-deactivation',
  ],
  'msme-registration': ['is-msme-registration-worth-it'],
  'tds-monthly-compliance': [
    'tds-194c-194j-demand',
    'tds-26q-27q-mismatch',
    'tds-short-deduction-notice',
    'tds-return-q1-fy2026-27',
  ],
  'business-pan': ['what-is-business-pan'],

  // Tier C
  'gst-cancellation': [
    'gst-reg-17-cancellation-notice',
    'gst-reg-31-suspension',
  ],
  'gst-revocation': ['gst-reg-17-cancellation-notice'],
  'din-reactivation': ['dir-3-kyc-din-deactivation'],
  'cloud-kitchen-setup': ['do-i-need-fssai-license'],
  'company-name-change': ['roc-annual-filing-default-notice'],

  // No matching guides yet — section will not render
  'esop-structuring': [],
  'iepf-consultation': [],
}

export function getGuideSlugsForService(serviceSlug: string): string[] {
  return SERVICE_TO_GUIDES[serviceSlug] ?? []
}

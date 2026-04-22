/**
 * Single source of truth for services that collect pre-payment user input.
 *
 * ELIGIBILITY_FLOW_SLUGS — services that route through
 *   /checkout/[slug]/eligibility, write answers to sessionStorage, and need
 *   the PreCursorSummaryCard min-h reservation on checkout.
 *
 * PRICE_VARIES_BY_QUESTIONNAIRE_SLUGS — strict subset where the answers
 *   actually change the final price. These show CTA "Check Eligibility & Price"
 *   instead of "Start Application" on the service page.
 *
 * Adding a new eligibility-flow service: add the slug here. All call sites
 * (CheckoutClient.tsx, UnifiedServicePage.tsx) import from this file.
 */

export const ELIGIBILITY_FLOW_SLUGS = [
  'trademark-registration',
  'pvt-ltd-incorporation',
  'llp-incorporation',
  'iepf-consultation',
] as const

export const PRICE_VARIES_BY_QUESTIONNAIRE_SLUGS = [
  'trademark-registration',
  'pvt-ltd-incorporation',
  'llp-incorporation',
] as const

export function isEligibilityFlow(slug: string): boolean {
  return (ELIGIBILITY_FLOW_SLUGS as readonly string[]).includes(slug)
}

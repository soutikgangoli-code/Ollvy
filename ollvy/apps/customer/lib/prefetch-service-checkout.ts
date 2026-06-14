import { getClient } from '@/lib/supabase'

// Slugs already warmed this session. Deduped at the MODULE level (not per
// component) so a service-detail page with several CTAs — BookingPanel,
// ProcessStepper, UnifiedServicePage — warms each slug exactly once no matter
// how many of those CTAs the user hovers.
const warmedSlugs = new Set<string>()

/**
 * Warm the checkout/eligibility data for a service on CTA hover so the imminent
 * navigation is fast. Fire-and-forget; safe to call from every CTA.
 *
 * @param slug service slug to warm
 * @param withQuestionnaireCount also warm the pre-payment question count for
 *        services that route through the eligibility flow
 */
export function prefetchServiceCheckout(
  slug: string | undefined | null,
  withQuestionnaireCount: boolean = false,
) {
  if (!slug || warmedSlugs.has(slug)) return
  warmedSlugs.add(slug)

  const supabase = getClient()
  supabase
    .from('service_packages')
    .select('*')
    .eq('slug', slug)
    .single()
    .then(({ data }) => {
      if (!data || !withQuestionnaireCount) return
      supabase
        .from('service_questionnaires')
        .select('*', { count: 'exact', head: true })
        .eq('service_package_id', data.id)
        .eq('is_active', true)
        .eq('is_pre_payment', true)
    })
}

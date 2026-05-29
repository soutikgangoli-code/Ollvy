import type { Metadata } from 'next'
import {
  buildDeadlineMetadata,
  DeadlineRouteRender,
} from '@/components/deadline/DeadlineRouteRender'

export const metadata: Metadata = buildDeadlineMetadata('llp-form-11-2026')

// ISR: revalidate hourly so live DB price changes propagate without a redeploy.
// Matches the /services/[slug] pattern. If a build ever falls back to static
// price (Supabase slow at build time), the next revalidation self-corrects.
export const revalidate = 3600

export default async function Page() {
  return <DeadlineRouteRender slug="llp-form-11-2026" />
}

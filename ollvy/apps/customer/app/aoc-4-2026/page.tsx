import type { Metadata } from 'next'
import {
  buildDeadlineMetadata,
  DeadlineRouteRender,
} from '@/components/deadline/DeadlineRouteRender'

export const metadata: Metadata = buildDeadlineMetadata('aoc-4-2026')

// ISR hourly, same as /services/[slug]. getDeadlineWithLivePrice falls back to
// the static price if Supabase is unreachable, so revalidation can never hard-fail.
export const revalidate = 3600

export default async function Page() {
  return <DeadlineRouteRender slug="aoc-4-2026" />
}

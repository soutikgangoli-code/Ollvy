import type { Metadata } from 'next'
import {
  buildDeadlineMetadata,
  DeadlineRouteRender,
} from '@/components/deadline/DeadlineRouteRender'

export const metadata: Metadata = buildDeadlineMetadata('llp-form-11-2026')

// Render per request. Price comes from DB on every load — no static caching,
// no stale prices, no build-time Supabase coupling that would block deploys
// when the project is rate-limited or returning Cloudflare 522s.
export const dynamic = 'force-dynamic'

export default async function Page() {
  return <DeadlineRouteRender slug="llp-form-11-2026" />
}

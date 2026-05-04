import type { Metadata } from 'next'
import {
  buildDeadlineMetadata,
  DeadlineRouteRender,
} from '@/components/deadline/DeadlineRouteRender'

export const metadata: Metadata = buildDeadlineMetadata('llp-form-11-2026')

export default async function Page() {
  return <DeadlineRouteRender slug="llp-form-11-2026" />
}

import type { Metadata } from 'next'
import {
  buildDeadlineMetadata,
  DeadlineRouteRender,
} from '@/components/deadline/DeadlineRouteRender'

export const metadata: Metadata = buildDeadlineMetadata('tax-audit-2026')

export default async function Page() {
  return <DeadlineRouteRender slug="tax-audit-2026" />
}

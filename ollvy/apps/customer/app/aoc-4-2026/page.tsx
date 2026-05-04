import type { Metadata } from 'next'
import {
  buildDeadlineMetadata,
  DeadlineRouteRender,
} from '@/components/deadline/DeadlineRouteRender'

export const metadata: Metadata = buildDeadlineMetadata('aoc-4-2026')

export default async function Page() {
  return <DeadlineRouteRender slug="aoc-4-2026" />
}

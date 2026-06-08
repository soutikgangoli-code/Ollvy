import { notFound, redirect } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { supabaseServer } from '@/lib/supabase-server'
import { withTimeout, DB_TIMEOUT_MS } from '@/lib/with-timeout'
import type { ServicePackage } from '@/lib/types'
import CheckoutClient from './CheckoutClient'

interface PageProps {
  params: Promise<{ serviceId: string }>
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// PostgREST returns this code when .single() finds zero rows. That's a
// legitimate "service doesn't exist" → 404, NOT a DB error. Anything else
// (network, 5xx, RLS misconfig, etc.) MUST throw so unstable_cache doesn't
// poison itself by storing a transient null.
const POSTGREST_NO_ROWS = 'PGRST116'

async function fetchService(serviceId: string): Promise<ServicePackage | null> {
  if (!supabaseServer) {
    // Server client missing is an infrastructure problem, not a not-found.
    // Throw so the cache doesn't capture this as a permanent null.
    throw new Error('fetchService: supabaseServer is not configured')
  }

  const isUUID = UUID_RE.test(serviceId)

  if (isUUID) {
    const { data, error } = await withTimeout(
      supabaseServer
        .from('service_packages')
        .select('*')
        .eq('id', serviceId)
        .single(),
      DB_TIMEOUT_MS,
      `fetchService.byId(${serviceId})`,
    )
    if (error && error.code !== POSTGREST_NO_ROWS) {
      // Transient DB / network / RLS error — throw so this result is NEVER
      // cached. Previously we discarded `error` and returned null here,
      // which caused unstable_cache to poison the entry permanently on a
      // single Supabase 5xx blip, 404-ing the route forever after.
      throw new Error(`fetchService(${serviceId}) DB error: ${error.message}`)
    }
    if (data) return data as ServicePackage
  }

  const { data, error } = await withTimeout(
    supabaseServer
      .from('service_packages')
      .select('*')
      .eq('slug', serviceId)
      .single(),
    DB_TIMEOUT_MS,
    `fetchService.bySlug(${serviceId})`,
  )

  if (error && error.code !== POSTGREST_NO_ROWS) {
    throw new Error(`fetchService(${serviceId}) DB error: ${error.message}`)
  }

  return (data as ServicePackage) || null
}

export default async function CheckoutPage({ params }: PageProps) {
  const { serviceId } = await params

  // Tag-based cache — admin mutations on `service_packages` must call
  // revalidateTag('service-packages') so price edits propagate instantly.
  // Cache key version bumped to v2 to flush poisoned `null` entries from
  // the previous version, which stored null for routes that hit a Supabase
  // 5xx during their first server-side fetch. The 1h revalidate is a
  // belt-and-braces safety net so a future poisoning could only stick for
  // an hour even if the throw-on-error fix above regresses.
  const getCached = unstable_cache(
    () => fetchService(serviceId),
    [`checkout-service-v2-${serviceId}`],
    { tags: ['service-packages'], revalidate: 3600 }
  )
  const service = await getCached()

  if (!service) notFound()

  // State-variable pricing needs a quote, not a fixed checkout.
  if (service.price_varies_by_state) {
    redirect(`/quote/request/${service.id}`)
  }

  return <CheckoutClient initialService={service} serviceId={serviceId} />
}

import { notFound, redirect } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { supabaseServer } from '@/lib/supabase-server'
import { withTimeout, DB_TIMEOUT_MS } from '@/lib/with-timeout'
import type { ServicePackage } from '@/lib/types'
import type { ServiceQuestion } from '@/lib/questionnaire/types'
import EligibilityClient from './EligibilityClient'

interface PageProps {
  params: Promise<{ serviceId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// PostgREST returns this when .single() finds zero rows — a legitimate
// "not found", NOT a DB error. Anything else MUST throw so unstable_cache
// doesn't poison itself by caching a transient failure.
const POSTGREST_NO_ROWS = 'PGRST116'

interface EligibilityData {
  service: ServicePackage | null
  questions: ServiceQuestion[]
}

// Fetch the service AND its pre-payment questions in one server-side, cached
// pass. This replaces the two client-side Supabase round-trips that used to
// gate the eligibility page on hydration (service+count, then service+rows).
async function fetchEligibilityData(serviceId: string): Promise<EligibilityData> {
  if (!supabaseServer) {
    // Infrastructure problem, not a not-found — throw so it's never cached.
    throw new Error('fetchEligibilityData: supabaseServer is not configured')
  }

  const isUUID = UUID_RE.test(serviceId)

  // Resolve the service row (by id first when it looks like a UUID, else slug).
  let service: ServicePackage | null = null
  if (isUUID) {
    const { data, error } = await withTimeout(
      supabaseServer.from('service_packages').select('*').eq('id', serviceId).eq('is_active', true).single(),
      DB_TIMEOUT_MS,
      `eligibility.byId(${serviceId})`,
    )
    if (error && error.code !== POSTGREST_NO_ROWS) {
      throw new Error(`fetchEligibilityData(${serviceId}) DB error: ${error.message}`)
    }
    service = (data as ServicePackage) || null
  }
  if (!service) {
    const { data, error } = await withTimeout(
      supabaseServer.from('service_packages').select('*').eq('slug', serviceId).eq('is_active', true).single(),
      DB_TIMEOUT_MS,
      `eligibility.bySlug(${serviceId})`,
    )
    if (error && error.code !== POSTGREST_NO_ROWS) {
      throw new Error(`fetchEligibilityData(${serviceId}) DB error: ${error.message}`)
    }
    service = (data as ServicePackage) || null
  }

  if (!service) return { service: null, questions: [] }

  // Pre-payment questions, keyed off the resolved service id.
  const { data: qData, error: qError } = await withTimeout(
    supabaseServer
      .from('service_questionnaires')
      .select('*')
      .eq('service_package_id', service.id)
      .eq('is_active', true)
      .eq('is_pre_payment', true)
      .order('step_number', { ascending: true })
      .order('display_order', { ascending: true }),
    DB_TIMEOUT_MS,
    `eligibility.questions(${service.id})`,
  )
  if (qError) {
    throw new Error(`fetchEligibilityData(${serviceId}) questions error: ${qError.message}`)
  }

  return { service, questions: (qData as ServiceQuestion[]) || [] }
}

export default async function EligibilityPage({ params, searchParams }: PageProps) {
  const { serviceId } = await params
  const sp = await searchParams

  // Tag-based cache so admin edits to packages/questionnaires can invalidate it
  // (revalidateTag). 1h revalidate is the belt-and-braces safety net.
  const getCached = unstable_cache(
    () => fetchEligibilityData(serviceId),
    [`eligibility-v1-${serviceId}`],
    { tags: ['service-packages', 'service-questionnaires'], revalidate: 3600 },
  )
  const { service, questions } = await getCached()

  if (!service) notFound()

  // No pre-payment questions → there's nothing to ask before checkout. Redirect
  // straight through, preserving the query string. Doing this server-side kills
  // the old client-side redirect flash (skeleton → redirect → checkout).
  if (questions.length === 0) {
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(sp)) {
      if (typeof v === 'string') qs.set(k, v)
      else if (Array.isArray(v)) v.forEach((vv) => qs.append(k, vv))
    }
    const query = qs.toString()
    redirect(`/checkout/${serviceId}${query ? `?${query}` : ''}`)
  }

  return (
    <EligibilityClient
      initialService={service}
      initialQuestions={questions}
      serviceId={serviceId}
    />
  )
}

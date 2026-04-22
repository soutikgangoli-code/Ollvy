import 'server-only'
import { revalidateTag } from 'next/cache'
import { supabaseServer } from '@/lib/supabase-server'

/**
 * Sanctioned writers for the `service_packages` table.
 *
 * Every cached read in the app is tagged with 'service-packages'. These helpers
 * call `revalidateTag('service-packages')` on any successful mutation so the
 * live pages never serve stale data after a price or content edit.
 *
 * **Use these helpers for every write — ad-hoc `supabaseServer.from('service_packages').update(...)`
 * calls bypass the invalidation and will silently serve cached data for hours.**
 *
 * If you need to write from somewhere that can't call `revalidateTag` (an edge
 * function, a standalone script, a Postgres trigger), have that writer POST to
 * `/api/revalidate-services` with the REVALIDATE_SECRET bearer token instead.
 */

type ServicePackageRow = Record<string, unknown>

interface WriterResult<T = null> {
  data: T
  error: null
}

interface WriterError {
  data: null
  error: { message: string }
}

function assertServerClient() {
  if (!supabaseServer) {
    throw new Error(
      '[service-packages-writer] supabaseServer is null — SUPABASE_SERVICE_ROLE_KEY is not configured.'
    )
  }
  return supabaseServer
}

async function revalidateOnSuccess() {
  revalidateTag('service-packages')
}

/**
 * Update a service_packages row by id. Revalidates the `service-packages` tag
 * on success so every cached read (homepage, /services, /services/[slug],
 * /checkout, navbar, geo pages) refreshes on the next request.
 */
export async function updateServicePackage(
  id: string,
  fields: ServicePackageRow
): Promise<WriterResult | WriterError> {
  const client = assertServerClient()
  const { error } = await client.from('service_packages').update(fields).eq('id', id)
  if (error) return { data: null, error: { message: error.message } }
  await revalidateOnSuccess()
  return { data: null, error: null }
}

/**
 * Update a service_packages row by slug. Same revalidation semantics as
 * updateServicePackage.
 */
export async function updateServicePackageBySlug(
  slug: string,
  fields: ServicePackageRow
): Promise<WriterResult | WriterError> {
  const client = assertServerClient()
  const { error } = await client.from('service_packages').update(fields).eq('slug', slug)
  if (error) return { data: null, error: { message: error.message } }
  await revalidateOnSuccess()
  return { data: null, error: null }
}

/**
 * Insert a new service_packages row. Returns the inserted row's id on success
 * so callers can chain follow-up inserts (questionnaires, document templates).
 */
export async function insertServicePackage(
  fields: ServicePackageRow
): Promise<WriterResult<{ id: string }> | WriterError> {
  const client = assertServerClient()
  const { data, error } = await client
    .from('service_packages')
    .insert(fields)
    .select('id')
    .single()
  if (error || !data) return { data: null, error: { message: error?.message ?? 'insert failed' } }
  await revalidateOnSuccess()
  return { data: { id: data.id as string }, error: null }
}

/**
 * Upsert (insert-or-update) by slug. Handy for idempotent content sync where
 * the caller doesn't want to branch on existence.
 */
export async function upsertServicePackage(
  fields: ServicePackageRow & { slug: string }
): Promise<WriterResult | WriterError> {
  const client = assertServerClient()
  const { error } = await client
    .from('service_packages')
    .upsert(fields, { onConflict: 'slug' })
  if (error) return { data: null, error: { message: error.message } }
  await revalidateOnSuccess()
  return { data: null, error: null }
}

/**
 * Delete a service_packages row by id. Prefer soft-delete via `is_active: false`
 * in updateServicePackage unless you really need the row gone.
 */
export async function deleteServicePackage(
  id: string
): Promise<WriterResult | WriterError> {
  const client = assertServerClient()
  const { error } = await client.from('service_packages').delete().eq('id', id)
  if (error) return { data: null, error: { message: error.message } }
  await revalidateOnSuccess()
  return { data: null, error: null }
}

/**
 * Escape hatch: call this directly when you've performed a write that bypasses
 * these helpers (e.g. a raw SQL migration run via the CLI). Prefer the helpers.
 */
export async function revalidateServicePackagesCache() {
  await revalidateOnSuccess()
}

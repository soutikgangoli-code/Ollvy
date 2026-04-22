import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { timingSafeEqual } from 'node:crypto'

/**
 * POST /api/revalidate-services
 *
 * Invalidates every cached read tagged with 'service-packages'. Call this from
 * any code path that writes to the `service_packages` table — admin mutations,
 * the sync-content-to-db script, or a Postgres trigger webhook.
 *
 * Auth: bearer secret in the Authorization header only. (Query-string auth is
 * rejected so secrets cannot leak into proxy/CDN access logs.)
 */
export const runtime = 'nodejs'

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8')
  const bb = Buffer.from(b, 'utf8')
  // timingSafeEqual throws on length mismatch — do a constant-time length guard too.
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET
  const authHeader = request.headers.get('authorization') ?? ''
  const match = authHeader.match(/^Bearer (.+)$/)
  const provided = match?.[1] ?? ''

  // Single failure path with a constant-time comparison — same 401 whether
  // the env var is missing, the header is absent, or the token is wrong.
  // Nothing about the secret or the submitted token is logged.
  if (!expected || !provided || !safeEqual(provided, expected)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  revalidateTag('service-packages')
  return NextResponse.json({ revalidated: true, tag: 'service-packages' })
}

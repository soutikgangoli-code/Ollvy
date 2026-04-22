# Deployment Notes

Operational config that lives outside the repo. Pre-flight checks before any production deploy.

## Vercel dashboard

### Domain redirects

**`ollvy.com` → `www.ollvy.com` must be configured in the Vercel dashboard → Domains, not in `middleware.ts`.**

Moving this out of middleware saves ~300ms for users hitting the bare domain: the Vercel edge issues the 308 before any serverless function is invoked. When the redirect was in `middleware.ts` every `ollvy.com` request woke a function just to return a 308.

To configure:
1. Vercel dashboard → the customer project → Settings → Domains.
2. Confirm both `ollvy.com` and `www.ollvy.com` are attached.
3. Set `ollvy.com` to redirect to `www.ollvy.com` (permanent / 308).

If this is ever removed from the dashboard, the middleware has no fallback — bare-domain visits will 404 or land on the apex without a canonical host. Re-add the dashboard redirect before pushing any middleware change that could alter this.

### Region

`apps/customer/vercel.json` pins serverless functions to `bom1` (Mumbai) for Indian traffic. If that file ever drops the `regions` field, functions revert to `iad1` (Washington DC), adding ~200-300ms TTFB for every Indian visitor. Confirm `bom1` is listed in the Functions section of the latest deployment.

## Environment variables

### Required server-side

- `SUPABASE_SERVICE_ROLE_KEY` — unrestricted DB access for ISR/SSG fetches. Missing = app falls back to static data.
- `REVALIDATE_SECRET` — bearer token for `POST /api/revalidate-services`. Missing = endpoint always returns 401 (tag revalidation dead).

### Required for sync scripts

- `REVALIDATE_URL` — e.g. `https://www.ollvy.com`. `scripts/sync-content-to-db.ts` posts to `${REVALIDATE_URL}/api/revalidate-services` after writes to flush the `service-packages` cache tag.
- `REVALIDATE_SECRET` — must match the production value.

Without both, the sync script still writes to the DB but cached reads won't refresh until the next deploy.

## Cache invalidation

Any code path that writes to `service_packages` must go through `lib/data/service-packages-writer.ts`, which calls `revalidateTag('service-packages')` on success. Ad-hoc `supabaseServer.from('service_packages').update(...)` calls bypass invalidation and will silently serve stale data.

For writes that can't call `revalidateTag` directly (edge functions, standalone scripts, Postgres triggers), POST to `/api/revalidate-services` with the `REVALIDATE_SECRET` bearer token.

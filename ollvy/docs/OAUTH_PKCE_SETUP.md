# OAuth PKCE Setup (Supabase + Google + Vercel)

This project uses a PKCE-only Google OAuth flow with callback path:

- `/auth/callback`

The app constructs `redirectTo` from:

1. `NEXT_PUBLIC_APP_URL` when set
2. `window.location.origin` as a fallback

Set `NEXT_PUBLIC_APP_URL` for every deployed environment to avoid origin drift.

## Required Application Environment Variables

In `apps/customer`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (canonical public URL, no trailing slash)

Examples:

- Production: `NEXT_PUBLIC_APP_URL=https://www.ollvy.com`
- Staging: `NEXT_PUBLIC_APP_URL=https://staging.ollvy.com`

## Supabase Auth Configuration

In Supabase Auth settings:

- Set `SITE_URL` to your canonical production URL (for example `https://www.ollvy.com`)
- Add **exact** additional redirect URLs for every environment callback:
  - `https://www.ollvy.com/auth/callback`
  - `https://ollvy.com/auth/callback` (if apex domain is reachable)
  - `https://staging.ollvy.com/auth/callback` (if staging exists)
  - Local dev callback URL(s), such as `http://127.0.0.1:3000/auth/callback`

If any callback URL is missing from Supabase allowlist, Google OAuth redirects will fail.

## Google OAuth Client Configuration

In Google Cloud Console for the OAuth client used by Supabase:

- Authorized redirect URI must be Supabase's callback endpoint for your project
  - Format: `https://<project-ref>.supabase.co/auth/v1/callback`
- Do not use app callback paths in Google redirect URI list.

## Vercel Domain Notes

- Keep domain strategy consistent (`www` and/or apex).
- If both domains are used, add both callback URLs in Supabase allowlist.
- Preview deployments use dynamic URLs; if OAuth is required on previews, add a supported strategy for those preview callback URLs in Supabase.

## Verification Checklist

1. Start login from each environment (`local`, `staging`, `production`).
2. Confirm return to `/auth/callback` with `?code=...`.
3. Confirm session is created and protected pages load.
4. Confirm post-login redirect (`next`) stays on relative paths only.
5. Confirm failure path goes to `/auth/error` with message.

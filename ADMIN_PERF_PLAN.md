# Admin Performance Plan

Tracking file so the plan survives context compaction. Update status inline as phases complete.

## Constraints
- **Customer flow (`ollvy.com` non-admin pages) must not break.** No edits under `app/(main)`, `app/(auth)`, `app/services`, `app/tools`, `app/guides`, `components/landing`, `components/service`, `components/checkout`, root `app/layout.tsx`, sitemap.
- **Chat must keep working.** `AdminChatWindow` (mounted at `OrderViewClient.tsx:920`), the `chatConversationId` state, the polling `useEffect` (lines 191-228), and the right-panel JSX (lines 912-936) stay byte-identical.
- **Admin (`/admin/*`) is fair game.** Full approval to refactor.
- **No Redis.** In-memory only.
- **Same Next.js app.** No separate admin app/subdomain.

## Already done in this session (uncommitted)
- [x] `adminGetSignedUrls` now handles storage-path format (was the root cause of "can't view/download documents")
- [x] Download button added next to View on each Initial Document
- [x] `DocumentViewButton` now surfaces errors via toast instead of silently swallowing
- [x] `getAdminUser` uses fast `x-auth-user-id` header path (skip 200-500ms `auth.getUser()`)
- [x] `/admin/login` excluded from `PROTECTED_ROUTES` (no more phone-OTP modal hijack)
- [x] Queue `count: 'exact'` → `'estimated'` (skip full COUNT(*))

## Phase 1A — In-memory cache for getAdminUser [PENDING]

**File:** `apps/customer/lib/admin/get-admin-user.ts` (replace existing)

Replace the current file with module-level `Map<auth_user_id, {user, expiresAt}>` cache, TTL 60s. Same fast-path header logic, same fallback to `auth.getUser()`, same redirect behavior. Export `invalidateAdminCache(authUserId?)` for forced invalidation.

**Trade-off:** if an admin is deactivated, up to 60s stale access. Acceptable for ~10 admins.

**Verify:** `tsc --noEmit` exits 0; `git diff` shows only `get-admin-user.ts`.

## Phase 1B — DB indexes migration [PENDING]

**File (new):** `apps/customer/supabase/migrations/20260530120000_admin_perf_indexes.sql`

Indexes:
- `idx_orders_status_paid_at` on `orders(status, paid_at DESC)`
- `idx_orders_assigned_admin_id` on `orders(assigned_admin_id) WHERE assigned_admin_id IS NOT NULL`
- `idx_order_documents_order_stage` on `order_documents(order_id, stage_key)`
- `idx_order_work_documents_order_id` on `order_work_documents(order_id)`
- `idx_order_activity_log_order_created` on `order_activity_log(order_id, created_at DESC)`
- `idx_order_questionnaire_order_qkey` on `order_questionnaire_responses(order_id, question_key)`
- `idx_admin_users_auth_user_id` on `admin_users(auth_user_id)`
- `idx_order_admin_notes_order_created` on `order_admin_notes(order_id, created_at DESC)`

All `CREATE INDEX IF NOT EXISTS` (no CONCURRENTLY — Supabase migrations run in txn). User applies via `supabase db push --linked`.

**Verify:** SQL file lints; idempotent re-run safe.

## Phase 1C — Prefetch on queue row hover [PENDING]

**Files:**
- `apps/customer/components/admin/QueueClient.tsx`
- `apps/customer/components/admin/OrdersListClient.tsx`

For each `<Link href={`/admin/orders/${id}`}>` queue row, add `onMouseEnter={() => router.prefetch('/admin/orders/' + id)}` and `onFocus` for keyboard nav.

**Verify:** `tsc` clean; no other props altered.

## Phase 2 — Code-split OrderViewClient [PENDING]

**New directory:** `apps/customer/components/admin/order-view/`

Extract from `OrderViewClient.tsx`:

| Source lines | New file | Loading |
|---|---|---|
| 100-152 | `DocumentViewButton.tsx` | normal import |
| 1276-1453 | `InitialDocumentCard.tsx` | normal import |
| 1455-1705 | `WorkDocumentCard.tsx` | normal import |
| 1708-2050 | `AdminLinkedDocumentCard.tsx` | normal import |
| 1084-1273 | `RoundCard.tsx` | `dynamic()` with skeleton |
| 2053-2356 | `AddRoundDialog.tsx` | `dynamic({ ssr: false })` |
| 2358-2592 | `QuickUploadDialog.tsx` | `dynamic({ ssr: false })` |

**Chat preservation procedure (run for each extraction):**
1. Diff confirms zero edits to lines 49, 189-228, 912-936 of `OrderViewClient.tsx`.
2. Grep `AdminChatWindow` and `chatConversationId` before/after — confirm only `OrderViewClient.tsx` keeps these.
3. Imports for `AdminChatWindow` and `OrderActivityLog` stay in `OrderViewClient.tsx`.

**Verify:** `tsc` clean; existing JSX call sites identical (only function definitions move).

## Phase 3 — Single Postgres RPC for order detail [PENDING]

**Files:**
- New: `apps/customer/supabase/migrations/20260530120100_get_admin_order_view.sql`
- Edit: `apps/customer/app/(admin)/admin/orders/[orderId]/page.tsx`

RPC `get_admin_order_view(p_order_id UUID) RETURNS jsonb` aggregates 9 queries into 1. Page calls `.rpc('get_admin_order_view', {p_order_id}).single<...>()` instead of the 3-step waterfall.

**Verify:** RPC JSON shape matches `OrderViewClient` props 1:1; `tsc` clean; test load before commit.

## Rollback strategy
- One commit per phase. Each phase is independently revertable via `git revert <sha>`.
- Indexes can stay if Phase 1B reverts (functionally inert).
- RPC function can stay in DB if Phase 3 reverts (unused).

## Status log
- 2026-05-29: Plan saved. Phase 1A queued.
- 2026-05-29: Phase 1A done (`lib/admin/get-admin-user.ts` cache added, tsc clean).
- 2026-05-29: Phase 1B done (`supabase/migrations/20260529120000_admin_perf_indexes.sql` created; needs `supabase db push --linked`).
- 2026-05-29: Phase 1C done (`QueueClient.tsx`, `OrdersListClient.tsx` prefetch on hover/focus; tsc clean).
- 2026-05-29: Phase 2 done. OrderViewClient.tsx: 2,592 → 1,046 lines (-60%). Extracted 7 components into `components/admin/order-view/`. Dialogs lazy with ssr:false, RoundCard lazy with skeleton, DocumentViewButton + InitialDocumentCard eager. Chat byte-identical (lines 49, 153-194, 876-900). tsc clean.
- 2026-05-29: Phase 3 done. `supabase/migrations/20260529120100_get_admin_order_view.sql` created; `app/(admin)/admin/orders/[orderId]/page.tsx` rewritten to call single RPC. 9 queries → 1. tsc clean. Migration needs `supabase db push --linked`.
- ALL PHASES COMPLETE. User actions: 1) `supabase db push --linked` to apply both migrations. 2) Reload admin and verify chat, document view/download, verify/reject dialogs, add round, quick upload still work.

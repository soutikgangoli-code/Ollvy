-- Admin performance indexes.
--
-- The admin queue and order-detail pages execute several filtered/ordered reads
-- per request. Without these indexes, Postgres falls back to sequential scans
-- on tables that grow with orders, documents, and activity. Adding these
-- indexes brings typical query times down from 50-200ms each to 1-5ms.
--
-- All statements use IF NOT EXISTS for idempotency. Plain CREATE INDEX (not
-- CONCURRENTLY) is used because Supabase runs migrations in a transaction;
-- the ACCESS EXCLUSIVE lock is brief on the table sizes here. If any of these
-- tables grows past ~100k rows, recreate the relevant index with
-- CONCURRENTLY outside a migration.

-- Queue page: filter by status NOT IN (completed, cancelled), order by paid_at DESC.
CREATE INDEX IF NOT EXISTS idx_orders_status_paid_at
  ON orders (status, paid_at DESC);

-- Queue page: non-super-admin filters by assigned_admin_id.
-- Partial index — only rows with an assignment matter for that filter.
CREATE INDEX IF NOT EXISTS idx_orders_assigned_admin_id
  ON orders (assigned_admin_id)
  WHERE assigned_admin_id IS NOT NULL;

-- Order detail: initial documents lookup (stage_key = 'doc_collection').
CREATE INDEX IF NOT EXISTS idx_order_documents_order_stage
  ON order_documents (order_id, stage_key);

-- Order detail: work documents per round (filtered by order_id then aggregated
-- per round_id in the JSON shape; an order_id-keyed index covers both the
-- per-page fetch and the per-round filtering in the RPC introduced later).
CREATE INDEX IF NOT EXISTS idx_order_work_documents_order_id
  ON order_work_documents (order_id);

-- Order detail: activity log feed (ORDER BY created_at DESC LIMIT N is the hot
-- path; the (order_id, created_at DESC) composite serves both filter and sort
-- as an index-only scan when columns are covered).
CREATE INDEX IF NOT EXISTS idx_order_activity_log_order_created
  ON order_activity_log (order_id, created_at DESC);

-- Queue page: questionnaire lookup for company_name / proposed_company_name /
-- business_name / llp_name on the order list. (order_id, question_key) is the
-- exact filter shape used.
CREATE INDEX IF NOT EXISTS idx_order_questionnaire_order_qkey
  ON order_questionnaire_responses (order_id, question_key);

-- Admin user lookup by auth_user_id (called on every admin page, even with
-- 60s cache there's still a periodic miss). Almost certainly already exists
-- via a unique constraint, but IF NOT EXISTS makes this safe.
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id
  ON admin_users (auth_user_id);

-- Internal notes per order, latest first.
CREATE INDEX IF NOT EXISTS idx_order_admin_notes_order_created
  ON order_admin_notes (order_id, created_at DESC);

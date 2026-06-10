-- =============================================================================
-- Migration: incomplete-order reminder idempotency tracking
-- =============================================================================
-- Adds the bookkeeping the process-order-followups cron uses to send the
-- "your paid order is still incomplete" reminder at most 3 times (at 3, 6 and
-- 9 days after payment) without ever double-sending.
--
--   incomplete_reminders_sent   : how many of the 3 reminders have gone out.
--   last_incomplete_reminder_at  : when the most recent one was sent.
--
-- The cron sends reminder N (N in 1..3) only when
--   floor(days_since_paid_at) >= [3,6,9][N-1]  AND  incomplete_reminders_sent = N-1
-- and then increments incomplete_reminders_sent with a guarded UPDATE
--   ... WHERE incomplete_reminders_sent = N-1
-- so a concurrent run cannot push the counter past N.
--
-- Additive and idempotent: safe to re-run.
-- =============================================================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS incomplete_reminders_sent INT NOT NULL DEFAULT 0;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS last_incomplete_reminder_at TIMESTAMPTZ;

COMMENT ON COLUMN orders.incomplete_reminders_sent IS
  'Count of incomplete-order reminder emails sent (max 3). Managed by process-order-followups cron.';
COMMENT ON COLUMN orders.last_incomplete_reminder_at IS
  'Timestamp of the most recent incomplete-order reminder email. Managed by process-order-followups cron.';

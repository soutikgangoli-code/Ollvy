-- =============================================================================
-- Migration: customer_notifications_queue
-- =============================================================================
-- Debounce queue for the "admin update on order" customer email. Admin
-- actions enqueue rows; the drain-customer-notifications-queue cron coalesces
-- bursts per order and sends one email after a quiet window.
-- =============================================================================

CREATE TABLE IF NOT EXISTS customer_notifications_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'admin_document_uploaded',
    'round_created',
    'question_added',
    'round_completed'
  )),
  actor_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  send_attempt_count INT NOT NULL DEFAULT 0,
  last_error TEXT
);

-- Used by the drain query: pending rows ordered by age.
CREATE INDEX IF NOT EXISTS idx_customer_notifications_queue_pending
  ON customer_notifications_queue (sent_at, created_at);

ALTER TABLE customer_notifications_queue ENABLE ROW LEVEL SECURITY;

-- No policies: only service_role accesses this table (admin actions write,
-- drain cron reads/updates). RLS on with no policies = nothing else gets in.

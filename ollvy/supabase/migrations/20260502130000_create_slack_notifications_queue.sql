-- =============================================================================
-- Migration: slack_notifications_queue
-- =============================================================================
-- Async queue for Slack pings that originate from places where a synchronous
-- HTTP call isn't safe (today: new-signup pings written from inside the
-- ensure_user_exists Postgres RPC). Mirrors customer_notifications_queue in
-- shape and operational pattern; drained by drain-slack-notifications-queue.
-- =============================================================================

CREATE TABLE IF NOT EXISTS slack_notifications_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL CHECK (channel IN (
    'payments', 'ops', 'errors', 'leads', 'daily_summary'
  )),
  event_type TEXT NOT NULL CHECK (event_type IN ('new_signup')),
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  send_attempt_count INT NOT NULL DEFAULT 0,
  last_error TEXT
);

-- Drain query filter: pending rows ordered by age.
CREATE INDEX IF NOT EXISTS idx_slack_notifications_queue_pending
  ON slack_notifications_queue (sent_at, created_at);

ALTER TABLE slack_notifications_queue ENABLE ROW LEVEL SECURITY;

-- No policies: only service_role accesses (RPC SECURITY DEFINER writes,
-- drain cron reads/updates). RLS on with no policies = nothing else gets in.

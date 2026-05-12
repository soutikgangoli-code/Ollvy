-- Idempotency store for Razorpay webhook events.
--
-- This table was defined in the initial schema migration
-- (20260310120000_initial_schema.sql:944) but evidently never made it into
-- production: the razorpay-webhook function references it for its idempotency
-- check, but production has no such relation. The Supabase JS client doesn't
-- throw on missing tables, so the check silently no-ops, the insert silently
-- no-ops, and there's no record of which webhook events have been seen.
--
-- This migration creates the table to match the original schema definition.
-- No webhook handler code changes — the existing logic in
-- supabase/functions/razorpay-webhook/index.ts starts working as written
-- once this table exists.
--
-- Safe to re-run: all statements use IF NOT EXISTS / idempotent equivalents.

CREATE TABLE IF NOT EXISTS processed_webhook_events (
  razorpay_event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT now()
);

-- Redundant with the implicit PK index, but mirrors the original
-- initial-schema migration verbatim so the production schema ends up
-- structurally identical to what was originally intended.
CREATE UNIQUE INDEX IF NOT EXISTS idx_processed_webhook_events_razorpay_event_id
  ON processed_webhook_events (razorpay_event_id);

-- Service-role only. The razorpay-webhook function runs with the service-role
-- key (it's a server-to-server call from Razorpay's webhook delivery system),
-- which bypasses RLS. No public policies needed.
ALTER TABLE processed_webhook_events ENABLE ROW LEVEL SECURITY;

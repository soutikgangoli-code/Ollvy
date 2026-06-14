-- Indexes the admin queries rely on but were missing.

-- get_admin_order_view aggregates round_question_requests per round (correlated
-- subquery WHERE round_id = r.id ORDER BY position). Without this it's a seq
-- scan per round.
CREATE INDEX IF NOT EXISTS idx_round_question_requests_round_position
  ON round_question_requests (round_id, position);

-- The queue "pending_admin" filter and bucket logic test order_rounds by
-- (order_id, status); also speeds the per-order rounds lookups.
CREATE INDEX IF NOT EXISTS idx_order_rounds_order_status
  ON order_rounds (order_id, status);

-- Trigram indexes so the admin search RPC's ILIKE '%term%' on these columns is
-- an index scan instead of a full table scan as the tables grow.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_orders_order_number_trgm
  ON orders USING gin (order_number gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_business_name_trgm
  ON users USING gin (business_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_phone_trgm
  ON users USING gin (phone gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_service_packages_name_trgm
  ON service_packages USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_professionals_full_name_trgm
  ON professionals USING gin (full_name gin_trgm_ops);

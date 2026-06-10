-- Order-level "setup approved" lock.
--
-- When the admin/CA approves the customer's setup, setup_locked_at is stamped.
-- From that point the customer can no longer edit their questionnaire answers or
-- replace their uploaded documents — both are locked by this single approval.
--
-- The admin can still request changes afterwards via round questions
-- (round_question_requests), and can clear the lock (setup_locked_at = null) to
-- reopen editing if needed.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS setup_locked_at timestamptz;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS setup_locked_by uuid;

COMMENT ON COLUMN orders.setup_locked_at IS 'When set, the customer setup (answers + documents) is approved and locked from customer edits.';
COMMENT ON COLUMN orders.setup_locked_by IS 'Admin user id who approved/locked the setup.';

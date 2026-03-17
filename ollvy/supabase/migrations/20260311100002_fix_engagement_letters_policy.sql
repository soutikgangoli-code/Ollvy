-- Fix engagement_letters RLS policy
-- orders.user_id references users.id (not auth.uid() directly)
-- Use inline subquery to match through users.auth_user_id

DROP POLICY IF EXISTS "user_read_own_engagement_letter" ON engagement_letters;

CREATE POLICY engagement_letters_user_select ON engagement_letters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE o.id = engagement_letters.order_id
      AND u.auth_user_id = auth.uid()
    )
  );

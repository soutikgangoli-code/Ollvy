-- Migration: Fix chat messages RLS policy (403 error)
-- The existing policy JOINs through orders table which causes RLS evaluation issues
-- This migration adds user_id directly to chat_conversations for simpler RLS checks

-- =============================================================================
-- 1. Add user_id column to chat_conversations (if it doesn't exist)
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_conversations' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE chat_conversations ADD COLUMN user_id UUID REFERENCES users(id);
  END IF;
END $$;

-- =============================================================================
-- 2. Backfill user_id from orders for existing conversations
-- =============================================================================
UPDATE chat_conversations cc
SET user_id = o.user_id
FROM orders o
WHERE cc.order_id = o.id
  AND cc.user_id IS NULL;

-- Also backfill from retainer_subscriptions
UPDATE chat_conversations cc
SET user_id = rs.user_id
FROM retainer_subscriptions rs
WHERE cc.retainer_subscription_id = rs.id
  AND cc.user_id IS NULL;

-- =============================================================================
-- 3. Drop existing chat_messages insert policies
-- =============================================================================
DROP POLICY IF EXISTS chat_messages_user_insert ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert_user" ON chat_messages;

-- =============================================================================
-- 4. Create simpler RLS policy that checks chat_conversations.user_id directly
-- This avoids the JOIN through orders table which causes RLS evaluation to fail
-- =============================================================================
CREATE POLICY chat_messages_user_insert ON chat_messages
  FOR INSERT WITH CHECK (
    sender_type = 'user'
    AND sender_id = get_user_id()
    AND EXISTS (
      SELECT 1 FROM chat_conversations cc
      WHERE cc.id = conversation_id
      AND cc.user_id = get_user_id()
    )
  );

-- =============================================================================
-- 5. Also update the SELECT policy to use simpler check
-- =============================================================================
DROP POLICY IF EXISTS chat_messages_user_select ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_select_user" ON chat_messages;

CREATE POLICY chat_messages_user_select ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_conversations cc
      WHERE cc.id = conversation_id
      AND cc.user_id = get_user_id()
    )
  );

-- =============================================================================
-- 6. Create index for performance
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);

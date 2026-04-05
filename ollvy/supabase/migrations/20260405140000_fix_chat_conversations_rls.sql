-- Migration: Fix chat_conversations RLS policies
-- The policies check user_id = auth.uid(), but user_id is actually users.id (not auth_user_id)
-- Need to use get_user_id() instead which returns the correct users.id

-- =============================================================================
-- 1. Drop existing user policies on chat_conversations
-- =============================================================================
DROP POLICY IF EXISTS "Users can view own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON chat_conversations;

-- =============================================================================
-- 2. Create fixed policies using get_user_id() instead of auth.uid()
-- =============================================================================
CREATE POLICY "Users can view own conversations" ON chat_conversations
  FOR SELECT USING (user_id = get_user_id());

CREATE POLICY "Users can update own conversations" ON chat_conversations
  FOR UPDATE USING (user_id = get_user_id());

-- =============================================================================
-- 3. Also fix the chat_messages policies that use auth.uid() on chat_conversations
-- =============================================================================
DROP POLICY IF EXISTS "Users can send messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view conversation messages" ON chat_messages;

-- Recreate with get_user_id() - these may already exist from previous migration
-- but we need to ensure they use the correct function
CREATE POLICY "Users can view conversation messages" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_conversations cc
      WHERE cc.id = conversation_id
      AND cc.user_id = get_user_id()
    )
  );

CREATE POLICY "Users can send messages" ON chat_messages
  FOR INSERT WITH CHECK (
    sender_type = 'user'
    AND sender_id = get_user_id()
    AND EXISTS (
      SELECT 1 FROM chat_conversations cc
      WHERE cc.id = conversation_id
      AND cc.user_id = get_user_id()
    )
  );

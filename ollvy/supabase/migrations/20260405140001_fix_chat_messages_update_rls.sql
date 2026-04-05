-- Migration: Fix chat_messages UPDATE policy
-- The "Users can update messages read status" policy still uses auth.uid()
-- but chat_conversations.user_id is users.id, not auth_user_id

DROP POLICY IF EXISTS "Users can update messages read status" ON chat_messages;

CREATE POLICY "Users can update messages read status" ON chat_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_conversations cc
      WHERE cc.id = conversation_id
      AND (
        cc.user_id = get_user_id()
        OR cc.professional_id = auth.uid()  -- Professionals use auth.uid() directly
      )
    )
  );

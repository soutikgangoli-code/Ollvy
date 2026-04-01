-- Admin Chat RLS Policy
-- Allow admin users to send chat messages as 'professional' type
-- This fixes the issue where admins could not send messages because
-- get_professional_id() returns NULL for admin users

-- Add policy for admin users to SELECT chat_messages
-- (for viewing messages in any order's chat)
CREATE POLICY chat_messages_admin_select ON chat_messages
  FOR SELECT USING (is_admin());

-- Add policy for admin users to INSERT chat_messages
-- Admin can send messages as 'professional' type for any valid conversation
CREATE POLICY chat_messages_admin_insert ON chat_messages
  FOR INSERT WITH CHECK (
    is_admin()
    AND sender_type = 'professional'
    AND EXISTS (
      SELECT 1 FROM chat_conversations cc
      JOIN orders o ON cc.order_id = o.id
      WHERE cc.id = conversation_id
    )
  );

-- Add policy for admin users to SELECT chat_conversations
CREATE POLICY chat_conversations_admin_select ON chat_conversations
  FOR SELECT USING (is_admin());

-- Enable realtime for chat_messages table
-- This allows real-time subscriptions to work for chat functionality

-- Add chat_messages to the supabase_realtime publication
-- Note: Using DO block to handle case where table might already be in publication
DO $$
BEGIN
  -- Try to add the table to the publication
  ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
EXCEPTION
  WHEN duplicate_object THEN
    -- Table is already in the publication, ignore
    RAISE NOTICE 'chat_messages is already in supabase_realtime publication';
END $$;

-- Also add chat_conversations for real-time conversation updates
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE chat_conversations;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'chat_conversations is already in supabase_realtime publication';
END $$;

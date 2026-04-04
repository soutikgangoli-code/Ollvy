-- Enable realtime for orders table
-- This allows the order page to receive updates when chat_conversation_id is set by the webhook

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE orders;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'orders is already in supabase_realtime publication';
END $$;

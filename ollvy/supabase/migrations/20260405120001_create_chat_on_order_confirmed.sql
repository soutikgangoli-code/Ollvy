-- Migration: Create chat conversation when order is confirmed (paid)
-- This ensures chat is available immediately after payment, even before professional assignment

-- Create function to auto-create chat conversation
CREATE OR REPLACE FUNCTION create_chat_on_order_confirmed()
RETURNS TRIGGER AS $$
DECLARE
  new_chat_id UUID;
BEGIN
  -- Create chat when order moves out of pending_payment and doesn't have chat yet
  IF NEW.status != 'pending_payment'
     AND NEW.chat_conversation_id IS NULL THEN

    INSERT INTO chat_conversations (order_id, user_id)
    VALUES (NEW.id, NEW.user_id)
    RETURNING id INTO new_chat_id;

    NEW.chat_conversation_id := new_chat_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on INSERT (for orders created with confirmed status - e.g., test orders)
DROP TRIGGER IF EXISTS order_insert_create_chat ON orders;
CREATE TRIGGER order_insert_create_chat
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_chat_on_order_confirmed();

-- Trigger on UPDATE (for orders that get confirmed via payment)
DROP TRIGGER IF EXISTS order_update_create_chat ON orders;
CREATE TRIGGER order_update_create_chat
  BEFORE UPDATE ON orders
  FOR EACH ROW
  WHEN (OLD.status = 'pending_payment' AND NEW.status != 'pending_payment')
  EXECUTE FUNCTION create_chat_on_order_confirmed();

-- Backfill: Create chat for existing orders without chat
-- First, insert chat conversations for orders that don't have them
INSERT INTO chat_conversations (order_id, user_id)
SELECT o.id, o.user_id FROM orders o
WHERE o.status != 'pending_payment'
  AND o.chat_conversation_id IS NULL
  AND o.user_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Update orders with their new chat_conversation_id
UPDATE orders o
SET chat_conversation_id = cc.id
FROM chat_conversations cc
WHERE cc.order_id = o.id
  AND o.chat_conversation_id IS NULL;

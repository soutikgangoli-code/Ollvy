-- Fix: Change chat creation triggers from BEFORE to AFTER
-- Root cause: BEFORE INSERT trigger tried to insert into chat_conversations
-- with order_id referencing an order that didn't exist yet (FK constraint violation)

-- Update the function to use UPDATE instead of modifying NEW
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

    -- For AFTER triggers, we need to UPDATE the order (can't modify NEW)
    UPDATE orders SET chat_conversation_id = new_chat_id WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate INSERT trigger as AFTER INSERT
DROP TRIGGER IF EXISTS order_insert_create_chat ON orders;
CREATE TRIGGER order_insert_create_chat
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_chat_on_order_confirmed();

-- Recreate UPDATE trigger as AFTER UPDATE
DROP TRIGGER IF EXISTS order_update_create_chat ON orders;
CREATE TRIGGER order_update_create_chat
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (OLD.status = 'pending_payment' AND NEW.status != 'pending_payment')
  EXECUTE FUNCTION create_chat_on_order_confirmed();

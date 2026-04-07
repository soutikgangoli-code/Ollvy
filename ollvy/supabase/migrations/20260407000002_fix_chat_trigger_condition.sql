-- Fix: Chat trigger condition mismatch
-- Orders are created with status 'pending_assignment', not 'pending_payment'
-- The UPDATE trigger was checking OLD.status = 'pending_payment' which never fires
-- This fix changes the condition to match the actual order creation status

-- Drop the existing UPDATE trigger
DROP TRIGGER IF EXISTS order_update_create_chat ON orders;

-- Recreate with correct condition:
-- Fire when status changes from pending_assignment to in_progress
-- Also check that chat doesn't already exist (belt and suspenders)
CREATE TRIGGER order_update_create_chat
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (
    OLD.status = 'pending_assignment'
    AND NEW.status = 'in_progress'
    AND NEW.chat_conversation_id IS NULL
  )
  EXECUTE FUNCTION create_chat_on_order_confirmed();

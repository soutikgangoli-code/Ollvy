-- Migration: Add performance indexes for admin pages
-- This migration adds indexes to optimize common admin queries

-- Queue page: filter by assigned admin
CREATE INDEX IF NOT EXISTS idx_orders_assigned_admin_id
ON orders(assigned_admin_id)
WHERE assigned_admin_id IS NOT NULL;

-- Queue page: filter by status for active orders
CREATE INDEX IF NOT EXISTS idx_orders_status_paid_at
ON orders(status, paid_at DESC)
WHERE status NOT IN ('completed', 'cancelled');

-- Chats page: join on chat_conversation_id
CREATE INDEX IF NOT EXISTS idx_orders_chat_conversation_id
ON orders(chat_conversation_id)
WHERE chat_conversation_id IS NOT NULL;

-- Reports/Analytics: filter by paid_at and status
CREATE INDEX IF NOT EXISTS idx_orders_paid_at_status
ON orders(paid_at DESC, status)
WHERE paid_at IS NOT NULL;

-- Work documents lookup by order
CREATE INDEX IF NOT EXISTS idx_order_work_documents_order_id
ON order_work_documents(order_id);

-- Questionnaire responses lookup by order
CREATE INDEX IF NOT EXISTS idx_order_questionnaire_responses_order_id
ON order_questionnaire_responses(order_id);

-- Order documents lookup
CREATE INDEX IF NOT EXISTS idx_order_documents_order_id
ON order_documents(order_id);

-- Chat messages with conversation and timestamp for efficient aggregation
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_created
ON chat_messages(conversation_id, created_at DESC);

-- Order rounds by order_id for bucket calculation
CREATE INDEX IF NOT EXISTS idx_order_rounds_order_id
ON order_rounds(order_id);

-- Users by created_at for admin users page
CREATE INDEX IF NOT EXISTS idx_users_created_at
ON users(created_at DESC);

-- Orders by user_id for user order count
CREATE INDEX IF NOT EXISTS idx_orders_user_id
ON orders(user_id);

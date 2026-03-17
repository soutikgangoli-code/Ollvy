-- Migration: SLA Enforcement, Strikes, Appeals, and Disputes
-- Per spec §21 and §22

-- =============================================================================
-- ENUMS
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'strike_appeal_status') THEN
    CREATE TYPE strike_appeal_status AS ENUM (
      'pending',
      'voided',
      'upheld'
    );
  END IF;
END $$;

-- =============================================================================
-- 0. Ensure admin_users table exists
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role') THEN
    CREATE TYPE admin_role AS ENUM (
      'super_admin',
      'ops_admin',
      'finance_admin'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role admin_role NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 0a. Ensure professionals has auth_user_id
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professionals' AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE professionals ADD COLUMN auth_user_id UUID UNIQUE;
  END IF;
END $$;

-- =============================================================================
-- 0b. Ensure sla_alerts table exists (from initial schema)
-- =============================================================================

CREATE TABLE IF NOT EXISTS sla_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  stage_key TEXT NOT NULL,
  due_date DATE NOT NULL,
  alerted_at TIMESTAMPTZ DEFAULT now(),
  alert_count INT DEFAULT 1,
  professional_strike_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sla_alerts_order_id ON sla_alerts (order_id, professional_strike_applied);

-- =============================================================================
-- 0c. Ensure admin_notifications table exists
-- =============================================================================

CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  related_id UUID,
  related_type TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 0d. Ensure admin_audit_log table exists
-- =============================================================================

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  notes TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 0e. Ensure chat_sender_type enum exists
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chat_sender_type') THEN
    CREATE TYPE chat_sender_type AS ENUM (
      'user',
      'professional',
      'system'
    );
  END IF;
END $$;

-- =============================================================================
-- 0f. Add retainer_subscription_id to chat_conversations if missing
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_conversations' AND column_name = 'retainer_subscription_id'
  ) THEN
    ALTER TABLE chat_conversations ADD COLUMN retainer_subscription_id UUID;
  END IF;
END $$;

-- =============================================================================
-- 0g. Add sent_at to chat_messages if missing
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_messages' AND column_name = 'sent_at'
  ) THEN
    ALTER TABLE chat_messages ADD COLUMN sent_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- =============================================================================
-- 1. strike_appeals - Professional appeals for SLA strikes
-- =============================================================================

CREATE TABLE IF NOT EXISTS strike_appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sla_alert_id UUID NOT NULL REFERENCES sla_alerts(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  status strike_appeal_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure one appeal per sla_alert
CREATE UNIQUE INDEX IF NOT EXISTS idx_strike_appeals_sla_alert_id ON strike_appeals (sla_alert_id);
CREATE INDEX IF NOT EXISTS idx_strike_appeals_professional_id ON strike_appeals (professional_id);
CREATE INDEX IF NOT EXISTS idx_strike_appeals_status ON strike_appeals (status);

-- =============================================================================
-- 2. Add fraud_flag to users if not exists
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'fraud_flag'
  ) THEN
    ALTER TABLE users ADD COLUMN fraud_flag BOOLEAN DEFAULT false;
  END IF;
END $$;

-- =============================================================================
-- 3. Add rapid_completion_flag to orders if not exists
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'rapid_completion_flag'
  ) THEN
    ALTER TABLE orders ADD COLUMN rapid_completion_flag BOOLEAN DEFAULT false;
  END IF;
END $$;

-- =============================================================================
-- 4. Add assigned_at to orders if not exists (for 24h dispute rule)
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'assigned_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN assigned_at TIMESTAMPTZ;
  END IF;
END $$;

-- =============================================================================
-- 5. Ensure chat_messages has proper indexes for Realtime
-- =============================================================================

DO $$
BEGIN
  -- Check if sent_at column exists before creating index
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_messages' AND column_name = 'sent_at'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_chat_messages_sent_at ON chat_messages (sent_at DESC)';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_chat_conversations_order_id ON chat_conversations (order_id);

DO $$
BEGIN
  -- Check if retainer_subscription_id column exists before creating index
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_conversations' AND column_name = 'retainer_subscription_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_chat_conversations_retainer_id ON chat_conversations (retainer_subscription_id)';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_messages' AND column_name = 'sent_at'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages (conversation_id, sent_at DESC)';
  ELSE
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages (conversation_id)';
  END IF;
END $$;

-- =============================================================================
-- 6. Add file_url column to chat_messages for attachments
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_messages' AND column_name = 'file_url'
  ) THEN
    ALTER TABLE chat_messages ADD COLUMN file_url TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_messages' AND column_name = 'file_name'
  ) THEN
    ALTER TABLE chat_messages ADD COLUMN file_name TEXT;
  END IF;
END $$;

-- =============================================================================
-- 7. Add message_type to chat_messages
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_messages' AND column_name = 'message_type'
  ) THEN
    ALTER TABLE chat_messages ADD COLUMN message_type TEXT DEFAULT 'text';
  END IF;
END $$;

-- =============================================================================
-- 8. Insert default app_settings for dispute_auto_refund_days if not exists
-- =============================================================================

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

INSERT INTO app_settings (key, value)
VALUES ('dispute_auto_refund_days', '7')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- 9. Enable Realtime on chat_messages
-- This is done via Supabase dashboard, but we add a comment for documentation
-- =============================================================================

-- NOTE: Enable Realtime on chat_messages table via Supabase Dashboard:
-- Database → Replication → Add table → chat_messages

-- =============================================================================
-- 10. RLS Policies for strike_appeals
-- =============================================================================

ALTER TABLE strike_appeals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Professionals can view own appeals" ON strike_appeals;
DROP POLICY IF EXISTS "Professionals can insert own appeals" ON strike_appeals;
DROP POLICY IF EXISTS "Admins can view all appeals" ON strike_appeals;
DROP POLICY IF EXISTS "Admins can update appeals" ON strike_appeals;
DROP POLICY IF EXISTS "strike_appeals_select_professional" ON strike_appeals;
DROP POLICY IF EXISTS "strike_appeals_insert_professional" ON strike_appeals;
DROP POLICY IF EXISTS "strike_appeals_select_admin" ON strike_appeals;
DROP POLICY IF EXISTS "strike_appeals_update_admin" ON strike_appeals;

-- Professionals can view their own appeals (simplified - join via order for now)
CREATE POLICY "strike_appeals_select_professional"
  ON strike_appeals FOR SELECT
  USING (
    professional_id IN (
      SELECT p.id FROM professionals p
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Professionals can insert their own appeals
CREATE POLICY "strike_appeals_insert_professional"
  ON strike_appeals FOR INSERT
  WITH CHECK (
    professional_id IN (
      SELECT p.id FROM professionals p
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Admins can view all appeals
CREATE POLICY "strike_appeals_select_admin"
  ON strike_appeals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

-- Admins can update appeals (for review)
CREATE POLICY "strike_appeals_update_admin"
  ON strike_appeals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

-- =============================================================================
-- 11. RLS Policies for chat_messages (Realtime support)
-- =============================================================================

-- Enable RLS if not already
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own conversation messages" ON chat_messages;
DROP POLICY IF EXISTS "Professionals can view own conversation messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert own conversation messages" ON chat_messages;
DROP POLICY IF EXISTS "Professionals can insert own conversation messages" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_select_user" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_select_professional" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert_user" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert_professional" ON chat_messages;

-- Users can view messages in their conversations
CREATE POLICY "chat_messages_select_user"
  ON chat_messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT cc.id FROM chat_conversations cc
      JOIN orders o ON cc.order_id = o.id
      WHERE o.user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Professionals can view messages in their conversations
CREATE POLICY "chat_messages_select_professional"
  ON chat_messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT cc.id FROM chat_conversations cc
      JOIN orders o ON cc.order_id = o.id
      WHERE o.professional_id IN (SELECT id FROM professionals WHERE auth_user_id = auth.uid())
    )
  );

-- Users can insert messages in their conversations
CREATE POLICY "chat_messages_insert_user"
  ON chat_messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT cc.id FROM chat_conversations cc
      JOIN orders o ON cc.order_id = o.id
      WHERE o.user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Professionals can insert messages in their conversations
CREATE POLICY "chat_messages_insert_professional"
  ON chat_messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT cc.id FROM chat_conversations cc
      JOIN orders o ON cc.order_id = o.id
      WHERE o.professional_id IN (SELECT id FROM professionals WHERE auth_user_id = auth.uid())
    )
  );

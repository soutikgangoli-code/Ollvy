-- Migration: Retainer Billing Schema
-- Adds retainer_billing_events table and missing columns for retainer engine
-- All operations are defensive and check for table existence

-- =============================================================================
-- Create retainer_subscriptions table if it doesn't exist
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'retainer_subscriptions') THEN
    CREATE TABLE retainer_subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
      service_package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE SET NULL,
      assigned_professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
      razorpay_subscription_id TEXT,
      billing_cycle TEXT NOT NULL DEFAULT 'monthly',
      monthly_price_paisa INT NOT NULL DEFAULT 0,
      first_billing_date DATE,
      next_billing_date DATE,
      status TEXT NOT NULL DEFAULT 'onboarding',
      is_trial_active BOOLEAN DEFAULT false,
      pause_count INT DEFAULT 0,
      pause_start_date TIMESTAMPTZ,
      started_at TIMESTAMPTZ DEFAULT now(),
      onboarding_completed_at TIMESTAMPTZ,
      cancelled_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE INDEX idx_retainer_subscriptions_user_id ON retainer_subscriptions (user_id);
    CREATE INDEX idx_retainer_subscriptions_status ON retainer_subscriptions (status);
  END IF;
END$$;

-- =============================================================================
-- Create retainer_billing_events table
-- =============================================================================

CREATE TABLE IF NOT EXISTS retainer_billing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retainer_subscription_id UUID NOT NULL REFERENCES retainer_subscriptions(id) ON DELETE CASCADE,
  razorpay_payment_id TEXT,
  event_type TEXT NOT NULL,
  billing_period TEXT,
  amount_paisa INT,
  status TEXT NOT NULL DEFAULT 'pending',
  child_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  processed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_retainer_billing_events_subscription
  ON retainer_billing_events (retainer_subscription_id, billing_period);
CREATE INDEX IF NOT EXISTS idx_retainer_billing_events_status
  ON retainer_billing_events (status);

-- =============================================================================
-- Add missing columns to retainer_subscriptions
-- =============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'retainer_subscriptions') THEN
    EXECUTE 'ALTER TABLE retainer_subscriptions ADD COLUMN IF NOT EXISTS chat_conversation_id UUID';
    EXECUTE 'ALTER TABLE retainer_subscriptions ADD COLUMN IF NOT EXISTS cancelled_effective_date DATE';
    EXECUTE 'ALTER TABLE retainer_subscriptions ADD COLUMN IF NOT EXISTS previous_tier_id UUID';
  END IF;
END$$;

-- =============================================================================
-- Add billing_period to orders for retainer child orders
-- =============================================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_period TEXT;

-- Add FK from orders to retainer_subscriptions if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_orders_retainer_subscription'
    AND table_name = 'orders'
  ) THEN
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS retainer_subscription_id UUID;
    ALTER TABLE orders ADD CONSTRAINT fk_orders_retainer_subscription
      FOREIGN KEY (retainer_subscription_id)
      REFERENCES retainer_subscriptions(id) ON DELETE SET NULL;
  END IF;
EXCEPTION WHEN duplicate_column THEN
  NULL;
WHEN duplicate_object THEN
  NULL;
END$$;

-- =============================================================================
-- Create RPC functions for retainer operations
-- =============================================================================

CREATE OR REPLACE FUNCTION user_has_retainers(uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM retainer_subscriptions
    WHERE user_id = uid AND status != 'cancelled'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_retainer_pause_count_this_year(retainer_id UUID)
RETURNS INT AS $$
DECLARE
  count INT;
BEGIN
  SELECT pause_count INTO count
  FROM retainer_subscriptions
  WHERE id = retainer_id;
  RETURN COALESCE(count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- RLS Policies for retainer_billing_events
-- =============================================================================

ALTER TABLE retainer_billing_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'retainer_billing_events' AND policyname = 'Users can view own billing events') THEN
    CREATE POLICY "Users can view own billing events"
      ON retainer_billing_events FOR SELECT
      USING (
        retainer_subscription_id IN (
          SELECT id FROM retainer_subscriptions WHERE user_id = auth.uid()
        )
      );
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'retainer_billing_events' AND policyname = 'Service role full access') THEN
    CREATE POLICY "Service role full access"
      ON retainer_billing_events FOR ALL
      USING (auth.role() = 'service_role');
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END$$;

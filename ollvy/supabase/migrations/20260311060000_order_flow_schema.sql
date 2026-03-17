-- Migration: Order Flow Schema Updates
-- Adds missing columns and engagement_letters table
-- All operations are idempotent

-- =============================================================================
-- Add missing columns to orders table
-- =============================================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS referral_credit_used_paisa INT DEFAULT 0;

-- =============================================================================
-- Add missing columns to invoices table (if table exists)
-- =============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices') THEN
    EXECUTE 'ALTER TABLE invoices ADD COLUMN IF NOT EXISTS gst_type TEXT';
    EXECUTE 'ALTER TABLE invoices ADD COLUMN IF NOT EXISTS cgst_paisa INT DEFAULT 0';
    EXECUTE 'ALTER TABLE invoices ADD COLUMN IF NOT EXISTS sgst_paisa INT DEFAULT 0';
    EXECUTE 'ALTER TABLE invoices ADD COLUMN IF NOT EXISTS igst_paisa INT DEFAULT 0';
  END IF;
END$$;

-- =============================================================================
-- Add display_name to professionals table (if table and column exist)
-- =============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'professionals') THEN
    EXECUTE 'ALTER TABLE professionals ADD COLUMN IF NOT EXISTS display_name TEXT';
    -- Only update from name column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'professionals' AND column_name = 'name') THEN
      EXECUTE 'UPDATE professionals SET display_name = name WHERE display_name IS NULL';
    END IF;
  END IF;
END$$;

-- =============================================================================
-- Create engagement_letters table
-- =============================================================================

CREATE TABLE IF NOT EXISTS engagement_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  service_name TEXT,
  content JSONB,
  pdf_url TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_engagement_letters_order_id ON engagement_letters (order_id);
CREATE INDEX IF NOT EXISTS idx_engagement_letters_user_id ON engagement_letters (user_id);

-- =============================================================================
-- Add type column to payouts table (if table exists)
-- =============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payouts') THEN
    EXECUTE 'ALTER TABLE payouts ADD COLUMN IF NOT EXISTS type TEXT DEFAULT ''order''';
  END IF;
END$$;

-- =============================================================================
-- Create RPC function for decrementing active orders
-- =============================================================================

CREATE OR REPLACE FUNCTION decrement_active_orders(pro_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE professional_availability
  SET current_active_orders = GREATEST(0, current_active_orders - 1)
  WHERE professional_id = pro_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

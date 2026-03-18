-- =============================================================================
-- Migration: Payment & Document Flow Schema
-- Adds tables for order documents, document templates, and order addons
-- =============================================================================

-- =============================================================================
-- 1. order_documents - Track documents per order with upload status
-- =============================================================================

CREATE TABLE IF NOT EXISTS order_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  document_key TEXT NOT NULL,           -- 'pan_card', 'aadhaar', etc.
  document_label TEXT NOT NULL,         -- 'PAN Card'
  stage_key TEXT,                       -- Which workflow stage needs this
  is_required BOOLEAN DEFAULT true,
  uploaded_at TIMESTAMPTZ,
  file_url TEXT,
  file_name TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES professionals(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(order_id, document_key)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_order_documents_order_id ON order_documents(order_id);
CREATE INDEX IF NOT EXISTS idx_order_documents_stage_key ON order_documents(stage_key);

-- =============================================================================
-- 2. service_document_templates - Define required documents per service
-- =============================================================================

CREATE TABLE IF NOT EXISTS service_document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE CASCADE,
  document_key TEXT NOT NULL,
  document_label TEXT NOT NULL,
  description TEXT,
  stage_key TEXT DEFAULT 'doc_collection',
  is_required BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  tips TEXT[] DEFAULT '{}',
  template_url TEXT,                    -- If Ollvy provides template
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(service_package_id, document_key)
);

-- Index for efficient service lookup
CREATE INDEX IF NOT EXISTS idx_service_document_templates_service ON service_document_templates(service_package_id);

-- =============================================================================
-- 3. order_addons - Track selected addons per order
-- =============================================================================

CREATE TABLE IF NOT EXISTS order_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  addon_id TEXT NOT NULL,
  addon_name TEXT NOT NULL,
  price_paisa_snapshot INT NOT NULL,
  govt_fee_paisa_snapshot INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(order_id, addon_id)
);

-- Index for order lookup
CREATE INDEX IF NOT EXISTS idx_order_addons_order_id ON order_addons(order_id);

-- =============================================================================
-- 4. Add engagement_agreed_at to orders table
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'engagement_agreed_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN engagement_agreed_at TIMESTAMPTZ;
    COMMENT ON COLUMN orders.engagement_agreed_at IS 'Timestamp when user agreed to engagement letter';
  END IF;
END $$;

-- =============================================================================
-- 5. Add variant_id to orders table for tracking selected variant
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'variant_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN variant_id TEXT;
    COMMENT ON COLUMN orders.variant_id IS 'Selected variant ID for services with multiple pricing tiers';
  END IF;
END $$;

-- =============================================================================
-- RLS Policies
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE order_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_addons ENABLE ROW LEVEL SECURITY;

-- order_documents: Users can view/insert their own order documents
CREATE POLICY "Users can view own order documents"
  ON order_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_documents.order_id
      AND o.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert own order documents"
  ON order_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_documents.order_id
      AND o.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can update own order documents"
  ON order_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_documents.order_id
      AND o.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Professionals can view documents for orders assigned to them
CREATE POLICY "Professionals can view assigned order documents"
  ON order_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_documents.order_id
      AND o.professional_id = (SELECT id FROM professionals WHERE auth_user_id = auth.uid())
    )
  );

-- Professionals can update documents (verify/reject)
CREATE POLICY "Professionals can update assigned order documents"
  ON order_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_documents.order_id
      AND o.professional_id = (SELECT id FROM professionals WHERE auth_user_id = auth.uid())
    )
  );

-- service_document_templates: Anyone can read (public)
CREATE POLICY "Anyone can view document templates"
  ON service_document_templates FOR SELECT
  USING (true);

-- order_addons: Users can view addons for their orders
CREATE POLICY "Users can view own order addons"
  ON order_addons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_addons.order_id
      AND o.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- =============================================================================
-- Function to populate order_documents from templates when order is created
-- =============================================================================

CREATE OR REPLACE FUNCTION populate_order_documents()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert document requirements from templates for this service
  INSERT INTO order_documents (order_id, document_key, document_label, stage_key, is_required)
  SELECT
    NEW.id,
    sdt.document_key,
    sdt.document_label,
    sdt.stage_key,
    sdt.is_required
  FROM service_document_templates sdt
  WHERE sdt.service_package_id = NEW.service_package_id
  ON CONFLICT (order_id, document_key) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-populate documents when order is created
DROP TRIGGER IF EXISTS trigger_populate_order_documents ON orders;
CREATE TRIGGER trigger_populate_order_documents
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION populate_order_documents();

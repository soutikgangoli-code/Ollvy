-- =============================================================================
-- Migration: Ensure service_packages table has required columns
-- =============================================================================

-- Add missing columns (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'base_price_paisa') THEN
    ALTER TABLE service_packages ADD COLUMN base_price_paisa INT DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'urgency_score') THEN
    ALTER TABLE service_packages ADD COLUMN urgency_score INT DEFAULT 5;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'situation_tags') THEN
    ALTER TABLE service_packages ADD COLUMN situation_tags TEXT[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'is_active') THEN
    ALTER TABLE service_packages ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'short_description') THEN
    ALTER TABLE service_packages ADD COLUMN short_description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'name') THEN
    ALTER TABLE service_packages ADD COLUMN name TEXT;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active services
DROP POLICY IF EXISTS service_packages_public_read ON service_packages;
CREATE POLICY service_packages_public_read ON service_packages
  FOR SELECT USING (is_active = true);

-- Insert seed services if table is empty
INSERT INTO service_packages (name, short_description, base_price_paisa, urgency_score, situation_tags, is_active)
SELECT * FROM (VALUES
  ('GST Registration', 'Register your business for GST compliance', 99900, 9, ARRAY['Just starting out', 'Taking payments online', 'Selling food or products'], true),
  ('Private Limited Company Registration', 'Incorporate your business as a Pvt Ltd', 799900, 8, ARRAY['Just starting out', 'Need to hire staff'], true),
  ('Trademark Registration', 'Protect your brand name and logo', 599900, 7, ARRAY['Need to protect brand', 'Just starting out'], true),
  ('FSSAI License', 'Food safety license for food businesses', 299900, 8, ARRAY['Selling food or products'], true),
  ('Import Export Code (IEC)', 'License for international trade', 199900, 7, ARRAY['Have foreign income'], true),
  ('GST Monthly Filing', 'Monthly GST return filing service', 49900, 6, ARRAY['Taking payments online', 'Selling food or products'], true),
  ('Payroll Management', 'Complete payroll and compliance', 299900, 7, ARRAY['Need to hire staff'], true),
  ('PF & ESI Registration', 'Register for employee benefits', 149900, 8, ARRAY['Need to hire staff'], true)
) AS v(name, short_description, base_price_paisa, urgency_score, situation_tags, is_active)
WHERE NOT EXISTS (SELECT 1 FROM service_packages WHERE name IS NOT NULL LIMIT 1);

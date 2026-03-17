-- =============================================================================
-- Migration: Seed service packages
-- =============================================================================

-- Delete existing test data
DELETE FROM service_packages WHERE slug IN (
  'gst-registration',
  'pvt-ltd-registration',
  'trademark-registration',
  'fssai-license',
  'iec-license',
  'gst-monthly-filing',
  'payroll-management',
  'pf-esi-registration'
);

-- Insert services with all required NOT NULL columns
INSERT INTO service_packages (
  slug, name, short_description,
  price_base_paisa,
  price_gst_rate,
  sla_working_days, urgency_score,
  situation_tags, is_active
)
VALUES
  ('gst-registration', 'GST Registration', 'Register your business for GST compliance', 99900, 18, 7, 9, ARRAY['Just starting out', 'Taking payments online', 'Selling food or products'], true),
  ('pvt-ltd-registration', 'Private Limited Company Registration', 'Incorporate your business as a Pvt Ltd', 799900, 18, 15, 8, ARRAY['Just starting out', 'Need to hire staff'], true),
  ('trademark-registration', 'Trademark Registration', 'Protect your brand name and logo', 599900, 18, 30, 7, ARRAY['Need to protect brand', 'Just starting out'], true),
  ('fssai-license', 'FSSAI License', 'Food safety license for food businesses', 299900, 18, 14, 8, ARRAY['Selling food or products'], true),
  ('iec-license', 'Import Export Code (IEC)', 'License for international trade', 199900, 18, 7, 7, ARRAY['Have foreign income'], true),
  ('gst-monthly-filing', 'GST Monthly Filing', 'Monthly GST return filing service', 49900, 18, 3, 6, ARRAY['Taking payments online', 'Selling food or products'], true),
  ('payroll-management', 'Payroll Management', 'Complete payroll and compliance', 299900, 18, 5, 7, ARRAY['Need to hire staff'], true),
  ('pf-esi-registration', 'PF & ESI Registration', 'Register for employee benefits', 149900, 18, 10, 8, ARRAY['Need to hire staff'], true);

-- Ollvy Seed Data
-- 003_seed.sql
-- 32 service packages, 25 compliance_obligation_rules, 3 app_settings

-- =============================================================================
-- SERVICE FILTER CATEGORIES (6 categories)
-- =============================================================================

INSERT INTO service_filter_categories (id, name, slug, icon_name, display_order, is_active) VALUES
  (gen_random_uuid(), 'Registrations', 'registrations', 'file-text', 1, true),
  (gen_random_uuid(), 'Licensing', 'licensing', 'badge', 2, true),
  (gen_random_uuid(), 'Monthly Compliance', 'monthly-compliance', 'calendar', 3, true),
  (gen_random_uuid(), 'Tax Filings', 'tax-filings', 'calculator', 4, true),
  (gen_random_uuid(), 'Payroll', 'payroll', 'users', 5, true),
  (gen_random_uuid(), 'Legal', 'legal', 'shield', 6, true);

-- =============================================================================
-- SERVICE TIER GROUPS (2 tier groups)
-- =============================================================================

INSERT INTO service_tier_groups (id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'GST Monthly Filing', 'Tiers based on annual turnover'),
  ('22222222-2222-2222-2222-222222222222', 'Payroll Management', 'Tiers based on employee count');

-- =============================================================================
-- SERVICE PACKAGES (32 services - all prices in paisa)
-- =============================================================================

-- Helper variables for category lookups
-- We'll use subqueries to get category IDs

-- 1. Private Limited Incorporation (ACTIVE)
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Private Limited Incorporation',
  'pvt-ltd-registration',
  'Register your Private Limited Company with complete documentation',
  (SELECT id FROM service_filter_categories WHERE slug = 'registrations'),
  'one_time', 'one_time',
  2499900, 0, 18, false,
  14, ARRAY['just_starting_out', 'have_investors'], 80, true,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "MCA Filing", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Government Approval", "sla_working_days": 5, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "Certificate Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 2. LLP Registration
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'LLP Registration',
  'llp-registration',
  'Register your Limited Liability Partnership',
  (SELECT id FROM service_filter_categories WHERE slug = 'registrations'),
  'one_time', 'one_time',
  1999900, 0, 18, false,
  14, ARRAY['just_starting_out', 'have_investors'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "MCA Filing", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Government Approval", "sla_working_days": 5, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "Certificate Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 3. Partnership Deed Drafting
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Partnership Deed Drafting',
  'partnership-deed',
  'Draft and register your Partnership Deed',
  (SELECT id FROM service_filter_categories WHERE slug = 'registrations'),
  'one_time', 'one_time',
  699900, 0, 18, false,
  7, ARRAY['just_starting_out'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "drafting", "stage_name": "Deed Drafting", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Delivery", "sla_working_days": 2, "wait_for_govt": false}]'::jsonb
);

-- 4. Sole Proprietorship Setup
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Sole Proprietorship Setup',
  'sole-proprietorship',
  'Complete setup for your Sole Proprietorship',
  (SELECT id FROM service_filter_categories WHERE slug = 'registrations'),
  'one_time', 'one_time',
  499900, 0, 18, false,
  5, ARRAY['just_starting_out'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Processing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 5. OPC (One Person Company)
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'OPC (One Person Company)',
  'opc-registration',
  'Register your One Person Company',
  (SELECT id FROM service_filter_categories WHERE slug = 'registrations'),
  'one_time', 'one_time',
  2199900, 0, 18, false,
  14, ARRAY['just_starting_out', 'have_investors'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "MCA Filing", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Government Approval", "sla_working_days": 5, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "Certificate Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 6. Startup India Registration
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Startup India Registration',
  'startup-india',
  'Register under Startup India scheme for benefits',
  (SELECT id FROM service_filter_categories WHERE slug = 'registrations'),
  'one_time', 'one_time',
  799900, 0, 18, false,
  10, ARRAY['just_starting_out', 'have_investors'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Portal Filing", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "DPIIT Approval", "sla_working_days": 4, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "Certificate Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 7. MSME / Udyam Registration
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'MSME / Udyam Registration',
  'msme-registration',
  'Get your Udyam Registration Certificate',
  (SELECT id FROM service_filter_categories WHERE slug = 'registrations'),
  'one_time', 'one_time',
  299900, 0, 18, false,
  3, ARRAY['just_starting_out', 'need_bank_loan'], 55, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 1, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Portal Filing", "sla_working_days": 1, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Certificate Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 8. GST Registration (ACTIVE)
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'GST Registration',
  'gst-registration',
  'Register for GST and get your GSTIN',
  (SELECT id FROM service_filter_categories WHERE slug = 'registrations'),
  'one_time', 'one_time',
  899900, 0, 18, false,
  7, ARRAY['taking_payments', 'just_starting_out', 'importing_exporting'], 95, true,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "GST Portal Filing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "GST Approval", "sla_working_days": 2, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "GSTIN Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 9. FSSAI Basic Registration
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'FSSAI Basic Registration',
  'fssai-basic',
  'Basic FSSAI Registration for small food businesses',
  (SELECT id FROM service_filter_categories WHERE slug = 'licensing'),
  'one_time', 'one_time',
  799900, 0, 18, false,
  7, ARRAY['selling_food_beverages', 'just_starting_out'], 90, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "FSSAI Filing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "FSSAI Approval", "sla_working_days": 2, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "License Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 10. IEC (Import Export Code)
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'IEC (Import Export Code)',
  'iec-code',
  'Get your Import Export Code for international trade',
  (SELECT id FROM service_filter_categories WHERE slug = 'registrations'),
  'one_time', 'one_time',
  699900, 0, 18, false,
  5, ARRAY['importing_exporting'], 60, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "DGFT Filing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "IEC Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 11. Professional Tax Registration
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Professional Tax Registration',
  'professional-tax-registration',
  'Register for Professional Tax in your state',
  (SELECT id FROM service_filter_categories WHERE slug = 'registrations'),
  'one_time', 'one_time',
  399900, 0, 18, false,
  5, ARRAY['need_to_hire'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Portal Filing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Registration Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 12. Trademark - Word Mark
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Trademark - Word Mark',
  'trademark-word',
  'Register your brand name as a trademark',
  (SELECT id FROM service_filter_categories WHERE slug = 'legal'),
  'one_time', 'one_time',
  1499900, 450000, 18, false,
  21, ARRAY['want_to_protect_brand'], 65, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "search", "stage_name": "TM Search Report", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "IP India Filing", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Examination", "sla_working_days": 10, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "Certificate Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 13. Trademark - Logo
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Trademark - Logo',
  'trademark-logo',
  'Register your logo as a trademark',
  (SELECT id FROM service_filter_categories WHERE slug = 'legal'),
  'one_time', 'one_time',
  1699900, 450000, 18, false,
  21, ARRAY['want_to_protect_brand'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "search", "stage_name": "TM Search Report", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "IP India Filing", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Examination", "sla_working_days": 10, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "Certificate Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 14. Copyright Registration
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Copyright Registration',
  'copyright-registration',
  'Register copyright for your creative work',
  (SELECT id FROM service_filter_categories WHERE slug = 'legal'),
  'one_time', 'one_time',
  899900, 0, 18, false,
  14, ARRAY['want_to_protect_brand'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Copyright Filing", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Registration", "sla_working_days": 5, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "Certificate Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 15. Patent Filing (Provisional)
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Patent Filing (Provisional)',
  'patent-provisional',
  'File a provisional patent application',
  (SELECT id FROM service_filter_categories WHERE slug = 'legal'),
  'one_time', 'one_time',
  3499900, 0, 18, true,
  21, ARRAY['want_to_protect_brand', 'have_investors'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "drafting", "stage_name": "Patent Drafting", "sla_working_days": 10, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "IP India Filing", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Filing Receipt", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 16. Design Registration
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Design Registration',
  'design-registration',
  'Register your product design',
  (SELECT id FROM service_filter_categories WHERE slug = 'legal'),
  'one_time', 'one_time',
  899900, 0, 18, false,
  14, ARRAY['want_to_protect_brand'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Design Filing", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Registration", "sla_working_days": 5, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "Certificate Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 17. FSSAI State License
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'FSSAI State License',
  'fssai-state',
  'State FSSAI License for medium food businesses',
  (SELECT id FROM service_filter_categories WHERE slug = 'licensing'),
  'one_time', 'one_time',
  1899900, 0, 18, true,
  14, ARRAY['selling_food_beverages', 'scaling_up'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "FSSAI Filing", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "State FSSAI Approval", "sla_working_days": 5, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "License Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 18. FSSAI Central License
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'FSSAI Central License',
  'fssai-central',
  'Central FSSAI License for large food businesses',
  (SELECT id FROM service_filter_categories WHERE slug = 'licensing'),
  'one_time', 'one_time',
  3499900, 0, 18, false,
  21, ARRAY['selling_food_beverages', 'scaling_up'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "FSSAI Filing", "sla_working_days": 7, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Central FSSAI Approval", "sla_working_days": 7, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "License Delivery", "sla_working_days": 2, "wait_for_govt": false}]'::jsonb
);

-- 19. Alcohol License
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Alcohol License',
  'alcohol-license',
  'Obtain license for selling alcohol',
  (SELECT id FROM service_filter_categories WHERE slug = 'licensing'),
  'one_time', 'one_time',
  4999900, 0, 18, true,
  30, ARRAY['selling_food_beverages', 'regulated_industry'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Excise Filing", "sla_working_days": 10, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Excise Approval", "sla_working_days": 14, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "License Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 20. Eating House License
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Eating House License',
  'eating-house-license',
  'License for restaurants and food establishments',
  (SELECT id FROM service_filter_categories WHERE slug = 'licensing'),
  'one_time', 'one_time',
  899900, 0, 18, true,
  14, ARRAY['selling_food_beverages', 'just_starting_out'], 70, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Municipal Filing", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Municipal Approval", "sla_working_days": 5, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "License Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 21. Fire NOC
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Fire NOC',
  'fire-noc',
  'Obtain Fire Safety No Objection Certificate',
  (SELECT id FROM service_filter_categories WHERE slug = 'licensing'),
  'one_time', 'one_time',
  899900, 0, 18, true,
  14, ARRAY['just_starting_out', 'regulated_industry'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Fire Dept Filing", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Fire Dept Approval", "sla_working_days": 5, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "NOC Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 22. Shop & Establishment Registration
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Shop & Establishment Registration',
  'shop-establishment',
  'Register your shop under Shop & Establishment Act',
  (SELECT id FROM service_filter_categories WHERE slug = 'registrations'),
  'one_time', 'one_time',
  399900, 0, 18, true,
  7, ARRAY['just_starting_out'], 70, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Portal Filing", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Certificate Delivery", "sla_working_days": 2, "wait_for_govt": false}]'::jsonb
);

-- 23. Drug License (Retail)
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Drug License (Retail)',
  'drug-license-retail',
  'Retail Drug License for pharmacies',
  (SELECT id FROM service_filter_categories WHERE slug = 'licensing'),
  'one_time', 'one_time',
  2499900, 0, 18, true,
  21, ARRAY['regulated_industry'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Drug Controller Filing", "sla_working_days": 7, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Drug License Approval", "sla_working_days": 7, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "License Delivery", "sla_working_days": 2, "wait_for_govt": false}]'::jsonb
);

-- 24. PCB Consent to Operate
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'PCB Consent to Operate',
  'pcb-consent',
  'Pollution Control Board Consent for manufacturing',
  (SELECT id FROM service_filter_categories WHERE slug = 'licensing'),
  'one_time', 'one_time',
  2999900, 0, 18, true,
  30, ARRAY['regulated_industry'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "PCB Filing", "sla_working_days": 10, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "PCB Approval", "sla_working_days": 14, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "Consent Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 25. PESO License
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'PESO License',
  'peso-license',
  'Petroleum & Explosives Safety Organisation License',
  (SELECT id FROM service_filter_categories WHERE slug = 'licensing'),
  'one_time', 'one_time',
  3499900, 0, 18, false,
  30, ARRAY['regulated_industry'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "PESO Filing", "sla_working_days": 10, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "PESO Approval", "sla_working_days": 14, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "License Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 26. Trade License
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Trade License',
  'trade-license',
  'Municipal Trade License for your business',
  (SELECT id FROM service_filter_categories WHERE slug = 'licensing'),
  'one_time', 'one_time',
  499900, 0, 18, true,
  10, ARRAY['just_starting_out', 'regulated_industry'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Municipal Filing", "sla_working_days": 4, "wait_for_govt": false}, {"stage_key": "govt_approval", "stage_name": "Municipal Approval", "sla_working_days": 3, "wait_for_govt": true}, {"stage_key": "delivery", "stage_name": "License Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 27. GST Monthly Filing - Up to ₹50L/year (ACTIVE)
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, tier_group_id, tier_label,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  price_varies_by_state, sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'GST Monthly Filing - Up to ₹50L/year',
  'gst-monthly-50l',
  'Monthly GST return filing for businesses up to ₹50L turnover',
  (SELECT id FROM service_filter_categories WHERE slug = 'monthly-compliance'),
  '11111111-1111-1111-1111-111111111111', 'Up to ₹50L/year',
  'recurring', 'monthly',
  299900, 0, 18, false,
  5, ARRAY['taking_payments', 'filing_taxes'], 88, true,
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "filing", "stage_name": "GST Filing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Confirmation", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 28. GST Monthly Filing - ₹50L-5Cr/year
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, tier_group_id, tier_label,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  price_varies_by_state, sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'GST Monthly Filing - ₹50L-5Cr/year',
  'gst-monthly-5cr',
  'Monthly GST return filing for businesses ₹50L-5Cr turnover',
  (SELECT id FROM service_filter_categories WHERE slug = 'monthly-compliance'),
  '11111111-1111-1111-1111-111111111111', '₹50L - 5Cr/year',
  'recurring', 'monthly',
  499900, 0, 18, false,
  5, ARRAY['taking_payments', 'filing_taxes'], 50, false,
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "filing", "stage_name": "GST Filing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Confirmation", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 29. GST Monthly Filing - ₹5Cr+/year
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, tier_group_id, tier_label,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  price_varies_by_state, sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'GST Monthly Filing - ₹5Cr+/year',
  'gst-monthly-5cr-plus',
  'Monthly GST return filing for businesses above ₹5Cr turnover',
  (SELECT id FROM service_filter_categories WHERE slug = 'monthly-compliance'),
  '11111111-1111-1111-1111-111111111111', '₹5Cr+/year',
  'recurring', 'monthly',
  799900, 0, 18, false,
  5, ARRAY['taking_payments', 'filing_taxes'], 50, false,
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "filing", "stage_name": "GST Filing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Confirmation", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 30. TDS Monthly Compliance
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'TDS Monthly Compliance',
  'tds-monthly',
  'Monthly TDS computation, payment and filing',
  (SELECT id FROM service_filter_categories WHERE slug = 'monthly-compliance'),
  'recurring', 'monthly',
  399900, 0, 18, false,
  5, ARRAY['need_to_hire', 'filing_taxes'], 78, false,
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "filing", "stage_name": "TDS Filing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Confirmation", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 31. Payroll Mgmt - up to 10 employees
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, tier_group_id, tier_label,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  price_varies_by_state, sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Payroll Management - Up to 10 Employees',
  'payroll-10',
  'Complete payroll processing for up to 10 employees',
  (SELECT id FROM service_filter_categories WHERE slug = 'payroll'),
  '22222222-2222-2222-2222-222222222222', 'Up to 10 employees',
  'recurring', 'monthly',
  599900, 0, 18, false,
  5, ARRAY['need_to_hire'], 68, false,
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Payroll Processing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Payslips Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 32. Payroll Mgmt - 11-25 employees
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, tier_group_id, tier_label,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  price_varies_by_state, sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Payroll Management - 11-25 Employees',
  'payroll-25',
  'Complete payroll processing for 11-25 employees',
  (SELECT id FROM service_filter_categories WHERE slug = 'payroll'),
  '22222222-2222-2222-2222-222222222222', '11-25 employees',
  'recurring', 'monthly',
  999900, 0, 18, false,
  5, ARRAY['need_to_hire'], 50, false,
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Payroll Processing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Payslips Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 33. Payroll Mgmt - 26-50 employees
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, tier_group_id, tier_label,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  price_varies_by_state, sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Payroll Management - 26-50 Employees',
  'payroll-50',
  'Complete payroll processing for 26-50 employees',
  (SELECT id FROM service_filter_categories WHERE slug = 'payroll'),
  '22222222-2222-2222-2222-222222222222', '26-50 employees',
  'recurring', 'monthly',
  1399900, 0, 18, false,
  5, ARRAY['need_to_hire'], 50, false,
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "processing", "stage_name": "Payroll Processing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Payslips Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 34. PF/ESIC Monthly Filing
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'PF/ESIC Monthly Filing',
  'pf-esic-monthly',
  'Monthly PF and ESIC compliance filing',
  (SELECT id FROM service_filter_categories WHERE slug = 'monthly-compliance'),
  'recurring', 'monthly',
  399900, 0, 18, false,
  5, ARRAY['need_to_hire'], 50, false,
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "filing", "stage_name": "PF/ESIC Filing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Confirmation", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 35. Business ITR Filing (ACTIVE)
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Business ITR Filing',
  'business-itr',
  'Annual Income Tax Return filing for your business',
  (SELECT id FROM service_filter_categories WHERE slug = 'tax-filings'),
  'one_time', 'one_time',
  1199900, 0, 18, false,
  10, ARRAY['filing_taxes'], 75, true,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "computation", "stage_name": "Tax Computation", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "filing", "stage_name": "ITR Filing", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Acknowledgement Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 36. GST Annual Return (GSTR-9)
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'GST Annual Return (GSTR-9)',
  'gst-annual-return',
  'Annual GST return filing (GSTR-9)',
  (SELECT id FROM service_filter_categories WHERE slug = 'tax-filings'),
  'one_time', 'one_time',
  899900, 0, 18, false,
  10, ARRAY['filing_taxes'], 50, false,
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "reconciliation", "stage_name": "Reconciliation", "sla_working_days": 4, "wait_for_govt": false}, {"stage_key": "filing", "stage_name": "GSTR-9 Filing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Confirmation", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 37. TDS Quarterly Return
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'TDS Quarterly Return',
  'tds-quarterly',
  'Quarterly TDS return filing',
  (SELECT id FROM service_filter_categories WHERE slug = 'tax-filings'),
  'one_time', 'one_time',
  499900, 0, 18, false,
  7, ARRAY['filing_taxes'], 50, false,
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "filing", "stage_name": "TDS Return Filing", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Confirmation", "sla_working_days": 2, "wait_for_govt": false}]'::jsonb
);

-- 38. MCA Annual Filing Bundle
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'MCA Annual Filing Bundle',
  'mca-annual-bundle',
  'Complete annual MCA compliance (AOC-4, MGT-7)',
  (SELECT id FROM service_filter_categories WHERE slug = 'tax-filings'),
  'one_time', 'one_time',
  1499900, 0, 18, false,
  14, ARRAY['have_investors', 'scaling_up'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false}, {"stage_key": "preparation", "stage_name": "Form Preparation", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "filing", "stage_name": "MCA Filing", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Confirmation", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 39. Director KYC (DIR-3 KYC)
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Director KYC (DIR-3 KYC)',
  'dir3-kyc',
  'Annual Director KYC filing',
  (SELECT id FROM service_filter_categories WHERE slug = 'tax-filings'),
  'one_time', 'one_time',
  399900, 0, 18, false,
  5, ARRAY['have_investors', 'scaling_up'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "filing", "stage_name": "DIR-3 Filing", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Confirmation", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 40. Advance Tax Computation
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Advance Tax Computation',
  'advance-tax',
  'Quarterly advance tax computation and payment assistance',
  (SELECT id FROM service_filter_categories WHERE slug = 'tax-filings'),
  'one_time', 'one_time',
  399900, 0, 18, false,
  5, ARRAY['filing_taxes'], 50, false,
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "computation", "stage_name": "Tax Computation", "sla_working_days": 2, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Payment Guidance", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb
);

-- 41. ROC Compliance Bundle
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'ROC Compliance Bundle',
  'roc-compliance',
  'Complete ROC compliance for the year',
  (SELECT id FROM service_filter_categories WHERE slug = 'tax-filings'),
  'one_time', 'one_time',
  2999900, 0, 18, false,
  21, ARRAY['have_investors', 'scaling_up'], 50, false,
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "preparation", "stage_name": "Form Preparation", "sla_working_days": 7, "wait_for_govt": false}, {"stage_key": "filing", "stage_name": "ROC Filing", "sla_working_days": 7, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Confirmation", "sla_working_days": 2, "wait_for_govt": false}]'::jsonb
);

-- 42. Statutory Audit
INSERT INTO service_packages (
  name, slug, short_description, filter_category_id, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_varies_by_state,
  sla_working_days, situation_tags, urgency_score, is_active,
  workflow_stages
) VALUES (
  'Statutory Audit',
  'statutory-audit',
  'Annual statutory audit for companies',
  (SELECT id FROM service_filter_categories WHERE slug = 'tax-filings'),
  'one_time', 'one_time',
  3499900, 0, 18, false,
  30, ARRAY['have_investors', 'scaling_up'], 50, false,
  '[{"stage_key": "planning", "stage_name": "Audit Planning", "sla_working_days": 5, "wait_for_govt": false}, {"stage_key": "fieldwork", "stage_name": "Audit Fieldwork", "sla_working_days": 15, "wait_for_govt": false}, {"stage_key": "reporting", "stage_name": "Report Preparation", "sla_working_days": 7, "wait_for_govt": false}, {"stage_key": "delivery", "stage_name": "Report Delivery", "sla_working_days": 3, "wait_for_govt": false}]'::jsonb
);

-- =============================================================================
-- COMPLIANCE OBLIGATION RULES (25 rules from §18a)
-- =============================================================================

-- GST-01: GSTR-3B (Monthly)
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'GST-01', 'GSTR-3B (Monthly)',
  NULL, NULL, 'gst_filing', 'monthly',
  '20th of following month', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'gst-monthly-50l'), true
);

-- GST-02: GSTR-1 (Monthly)
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'GST-02', 'GSTR-1 (Monthly)',
  NULL, NULL, 'gst_filing', 'monthly',
  '11th of following month', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'gst-monthly-50l'), true
);

-- GST-03: GSTR-1 (Quarterly - QRMP)
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'GST-03', 'GSTR-1 (Quarterly - QRMP)',
  NULL, NULL, 'gst_filing', 'quarterly',
  '13th of month after quarter-end (Apr/Jul/Oct/Jan)', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'gst-monthly-50l'), true
);

-- GST-04: GSTR-9 - Annual Return
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'GST-04', 'GSTR-9 - Annual Return',
  NULL, NULL, 'gst_filing', 'annual',
  '31 December each year', ARRAY[60, 30, 7],
  (SELECT id FROM service_packages WHERE slug = 'gst-annual-return'), true
);

-- GST-05: GSTR-9C - Reconciliation
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'GST-05', 'GSTR-9C - Reconciliation',
  NULL, NULL, 'gst_filing', 'annual',
  '31 December each year', ARRAY[60, 30, 7],
  (SELECT id FROM service_packages WHERE slug = 'gst-annual-return'), true
);

-- ITR-01: ITR Filing - Proprietorship/Individual
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'ITR-01', 'ITR Filing - Proprietorship/Individual',
  ARRAY['sole_proprietorship']::business_type[], NULL, 'itr_filing', 'annual',
  '31 July (non-audit); 31 October (audit)', ARRAY[60, 30, 7],
  (SELECT id FROM service_packages WHERE slug = 'business-itr'), true
);

-- ITR-02: ITR Filing - Partnership / LLP
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'ITR-02', 'ITR Filing - Partnership / LLP',
  ARRAY['partnership', 'llp']::business_type[], NULL, 'itr_filing', 'annual',
  '31 July (non-audit); 31 October (audit)', ARRAY[60, 30, 7],
  (SELECT id FROM service_packages WHERE slug = 'business-itr'), true
);

-- ITR-03: ITR Filing - Private Limited Co.
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'ITR-03', 'ITR Filing - Private Limited Co.',
  ARRAY['pvt_ltd', 'opc']::business_type[], NULL, 'itr_filing', 'annual',
  '31 October each year', ARRAY[60, 30, 7],
  (SELECT id FROM service_packages WHERE slug = 'business-itr'), true
);

-- ITR-04: Tax Audit
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'ITR-04', 'Tax Audit (Form 3CA/3CB + 3CD)',
  NULL, NULL, 'tax_audit', 'annual',
  '30 September each year', ARRAY[60, 30, 7],
  (SELECT id FROM service_packages WHERE slug = 'statutory-audit'), true
);

-- TDS-01: TDS Quarterly Return
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'TDS-01', 'TDS Quarterly Return (24Q/26Q)',
  NULL, NULL, 'tds_filing', 'quarterly',
  '31 Jul / 31 Oct / 31 Jan / 31 May', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'tds-quarterly'), true
);

-- TDS-02: TDS Monthly Deposit
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'TDS-02', 'TDS Monthly Deposit (Challan 281)',
  NULL, NULL, 'tds_payment', 'monthly',
  '7th of following month (March: 30 April)', ARRAY[7, 1],
  (SELECT id FROM service_packages WHERE slug = 'tds-monthly'), true
);

-- MCA-01: MCA Annual Return
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'MCA-01', 'MCA Annual Return (MGT-7/7A)',
  ARRAY['pvt_ltd', 'opc']::business_type[], NULL, 'mca_filing', 'annual',
  '60 days after AGM (AGM by 30 Sept = 29 Nov deadline)', ARRAY[60, 30, 7],
  (SELECT id FROM service_packages WHERE slug = 'mca-annual-bundle'), true
);

-- MCA-02: Financial Statements
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'MCA-02', 'Financial Statements (AOC-4)',
  ARRAY['pvt_ltd', 'opc']::business_type[], NULL, 'mca_filing', 'annual',
  '30 days after AGM (AGM by 30 Sept = 30 Oct deadline)', ARRAY[60, 30, 7],
  (SELECT id FROM service_packages WHERE slug = 'mca-annual-bundle'), true
);

-- MCA-03: DIR-3 KYC
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'MCA-03', 'DIR-3 KYC - Director KYC',
  ARRAY['pvt_ltd', 'opc']::business_type[], NULL, 'mca_filing', 'annual',
  '30 September each year', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'dir3-kyc'), true
);

-- MCA-04: Form INC-20A
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'MCA-04', 'Form INC-20A - Commencement of Business',
  ARRAY['pvt_ltd']::business_type[], NULL, 'mca_filing', 'one_time',
  'Within 180 days of incorporation', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-registration'), true
);

-- MCA-05: DPT-3
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'MCA-05', 'DPT-3 - Return of Deposits',
  ARRAY['pvt_ltd', 'opc']::business_type[], NULL, 'mca_filing', 'annual',
  '30 June each year', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'roc-compliance'), true
);

-- MCA-06: MSME Form I
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'MCA-06', 'MSME Form I - Half-Yearly Return',
  ARRAY['pvt_ltd', 'opc']::business_type[], NULL, 'mca_filing', 'half_yearly',
  '31 October (Apr-Sep period); 30 April (Oct-Mar period)', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'roc-compliance'), true
);

-- PF-01: EPF Monthly Contribution
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'PF-01', 'EPF Monthly Contribution (ECR)',
  NULL, NULL, 'pf_esic', 'monthly',
  '15th of following month', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'pf-esic-monthly'), true
);

-- ESIC-01: ESIC Monthly Contribution
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'ESIC-01', 'ESIC Monthly Contribution',
  NULL, NULL, 'pf_esic', 'monthly',
  '21st of following month', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'pf-esic-monthly'), true
);

-- PT-01: Professional Tax Payment
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'PT-01', 'Professional Tax Payment',
  NULL, ARRAY['MH', 'KA', 'WB', 'GJ', 'AP', 'TG', 'MP', 'OR', 'TN', 'KL', 'AS', 'JH', 'BR'],
  'professional_tax', 'monthly',
  'Last day of the month (varies by state)', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'professional-tax-registration'), true
);

-- PT-02: Professional Tax Return
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'PT-02', 'Professional Tax Return',
  NULL, ARRAY['MH', 'KA', 'WB', 'GJ', 'AP', 'TG', 'MP', 'OR', 'TN', 'KL', 'AS', 'JH', 'BR'],
  'professional_tax', 'annual',
  '30 April each year (varies by state)', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'professional-tax-registration'), true
);

-- LWF-01: Labour Welfare Fund
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'LWF-01', 'Labour Welfare Fund Contribution',
  NULL, ARRAY['MH', 'KA', 'GJ', 'TN', 'KL', 'WB', 'MP', 'DL', 'HR', 'PB', 'RJ', 'CG', 'GA', 'JK', 'CH'],
  'labour_welfare', 'half_yearly',
  'Varies by state (typically Dec 31 for annual)', ARRAY[30, 7, 1],
  NULL, true
);

-- SE-01: Shops & Establishments Renewal
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'SE-01', 'Shops & Establishments Registration Renewal',
  NULL, NULL, 'shop_establishment', 'annual',
  'Varies by state (typically Dec 31 or anniversary)', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'shop-establishment'), true
);

-- FSSAI-01: FSSAI Licence Renewal
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'FSSAI-01', 'FSSAI Licence Renewal',
  NULL, NULL, 'fssai', 'annual',
  '30 days before licence expiry', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'fssai-basic'), true
);

-- TM-01: Trademark Renewal
INSERT INTO compliance_obligation_rules (
  code, label, business_types, states, obligation_type, recurrence,
  due_date_formula, advance_reminder_days, linked_service_package_id, is_active
) VALUES (
  'TM-01', 'Trademark Renewal',
  NULL, NULL, 'trademark', 'every_10_years',
  'Before expiry date of trademark registration', ARRAY[30, 7, 1],
  (SELECT id FROM service_packages WHERE slug = 'trademark-word'), true
);

-- =============================================================================
-- APP SETTINGS (3 initial rows)
-- =============================================================================

INSERT INTO app_settings (key, value, updated_at) VALUES
  ('platform_fee_percent', '20', now()),
  ('dispute_auto_refund_days', '7', now()),
  ('admin_email_recipients', '["admin@ollvy.com"]', now());

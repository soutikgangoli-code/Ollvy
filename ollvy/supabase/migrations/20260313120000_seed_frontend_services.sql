-- Seed frontend service configs into database
-- This ensures the DB has the services defined in the frontend's static configs

-- Category UUIDs (from service_filter_categories table)
-- Registrations: abd1c33a-cdb7-45e1-89e6-bf7bf14bb70a
-- Licensing: 9d9921ea-141d-4044-a96b-57cbfc432637
-- Monthly Compliance: 9a399eff-9292-4033-8b25-fdc1e17768bc
-- Tax Filings: 401af149-dd3b-4fc0-9501-7b313afb3c06
-- Payroll: 55c56533-9a06-4e8e-ae81-2146b80434fd
-- Legal: e8eae3bc-6d5c-467f-b504-147b4f80d9a3

-- Upsert Private Limited Incorporation
INSERT INTO service_packages (
  slug, name, short_description, filter_category_id,
  price_base_paisa, price_govt_fees_paisa, sla_working_days,
  billing_cycle, is_active, display_order, urgency_score,
  scope_included, scope_excluded, deliverables
) VALUES (
  'pvt-ltd-incorporation',
  'Private Limited Incorporation',
  'Name reservation, DSC, DIN, MOA/AOA, and Certificate of Incorporation. You get the CIN. Govt stamp duty is ₹15,000 on top — shown upfront, not at checkout.',
  (SELECT id FROM service_filter_categories WHERE slug = 'registration' LIMIT 1),
  999900, -- ₹9,999
  1500000, -- ₹15,000
  15,
  'one_time',
  true,
  1,
  90,
  ARRAY['Name reservation with MCA', 'DSC for all directors', 'DIN for all directors', 'MOA & AOA drafting', 'SPICe+ filing', 'Certificate of Incorporation'],
  ARRAY['Trademark registration', 'GST registration', 'Professional tax registration'],
  '["Certificate of Incorporation", "MOA & AOA", "PAN & TAN"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  filter_category_id = EXCLUDED.filter_category_id,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  updated_at = now();

-- Upsert LLP Incorporation
INSERT INTO service_packages (
  slug, name, short_description, filter_category_id,
  price_base_paisa, price_govt_fees_paisa, sla_working_days,
  billing_cycle, is_active, display_order, urgency_score,
  scope_included, scope_excluded, deliverables
) VALUES (
  'llp-incorporation',
  'LLP Incorporation',
  'Register your Limited Liability Partnership with MCA. DPIN, name approval, and incorporation certificate.',
  (SELECT id FROM service_filter_categories WHERE slug = 'registration' LIMIT 1),
  899900, -- ₹8,999
  500000, -- ₹5,000
  12,
  'one_time',
  true,
  2,
  85,
  ARRAY['DPIN for all partners', 'Name reservation', 'LLP Agreement drafting', 'Filing with MCA', 'Certificate of Incorporation'],
  ARRAY['GST registration', 'Professional tax', 'Trademark'],
  '["LLP Certificate of Incorporation", "LLP Agreement", "PAN & TAN"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  filter_category_id = EXCLUDED.filter_category_id,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  updated_at = now();

-- Upsert GST Registration
INSERT INTO service_packages (
  slug, name, short_description, filter_category_id,
  price_base_paisa, price_govt_fees_paisa, sla_working_days,
  billing_cycle, is_active, display_order, urgency_score,
  scope_included, scope_excluded, deliverables
) VALUES (
  'gst-registration',
  'GST Registration',
  'Your GSTIN, applied for and obtained. Mandatory once turnover crosses ₹40L (₹20L for service businesses). No govt fee on top.',
  (SELECT id FROM service_filter_categories WHERE slug = 'registration' LIMIT 1),
  899900, -- ₹8,999
  0,
  7,
  'one_time',
  true,
  3,
  95,
  ARRAY['GST application filing', 'ARN generation', 'GSTIN certificate', 'Document preparation assistance'],
  ARRAY['GST return filing', 'E-way bill setup'],
  '["GSTIN Certificate", "Login credentials"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  filter_category_id = EXCLUDED.filter_category_id,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  updated_at = now();

-- Upsert Director KYC
INSERT INTO service_packages (
  slug, name, short_description, filter_category_id,
  price_base_paisa, price_govt_fees_paisa, sla_working_days,
  billing_cycle, is_active, display_order, urgency_score,
  scope_included, scope_excluded, deliverables
) VALUES (
  'director-kyc',
  'Director KYC (DIR-3 KYC)',
  'Annual KYC update for company directors. Due every year by September 30. Penalty of ₹5,000 if missed.',
  (SELECT id FROM service_filter_categories WHERE slug = 'registration' LIMIT 1),
  149900, -- ₹1,499
  0,
  3,
  'one_time',
  true,
  4,
  100,
  ARRAY['DIR-3 KYC form preparation', 'Document verification', 'E-filing with MCA', 'Acknowledgment receipt'],
  ARRAY['Company annual filing', 'Other director compliances'],
  '["DIR-3 KYC Acknowledgment"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  filter_category_id = EXCLUDED.filter_category_id,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  updated_at = now();

-- Upsert Trademark Registration
INSERT INTO service_packages (
  slug, name, short_description, filter_category_id,
  price_base_paisa, price_govt_fees_paisa, sla_working_days,
  billing_cycle, is_active, display_order, urgency_score,
  scope_included, scope_excluded, deliverables
) VALUES (
  'trademark-registration',
  'Trademark Registration',
  'Protect your brand name and logo with trademark registration. Class search, application filing, and TM symbol ready.',
  (SELECT id FROM service_filter_categories WHERE slug = 'trademark' LIMIT 1),
  799900, -- ₹7,999
  450000, -- ₹4,500
  5,
  'one_time',
  true,
  5,
  75,
  ARRAY['Trademark search', 'Class identification', 'Application drafting', 'Filing with IP India', 'TM symbol authorization'],
  ARRAY['Trademark renewal', 'Opposition handling', 'Additional classes'],
  '["TM Application Receipt", "TM Number"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  filter_category_id = EXCLUDED.filter_category_id,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  updated_at = now();

-- Upsert FSSAI License
INSERT INTO service_packages (
  slug, name, short_description, filter_category_id,
  price_base_paisa, price_govt_fees_paisa, sla_working_days,
  billing_cycle, is_active, display_order, urgency_score,
  scope_included, scope_excluded, deliverables
) VALUES (
  'fssai-license',
  'FSSAI License',
  'Food safety license for food businesses. Basic, State, or Central license based on your turnover.',
  (SELECT id FROM service_filter_categories WHERE slug = 'licenses' LIMIT 1),
  599900, -- ₹5,999
  200000, -- ₹2,000
  10,
  'one_time',
  true,
  6,
  80,
  ARRAY['License type assessment', 'Application preparation', 'Document compilation', 'Filing with FSSAI', 'License certificate'],
  ARRAY['Annual return filing', 'License renewal', 'Food testing'],
  '["FSSAI License Certificate", "14-digit FSSAI number"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  filter_category_id = EXCLUDED.filter_category_id,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  updated_at = now();

-- Upsert IEC Code
INSERT INTO service_packages (
  slug, name, short_description, filter_category_id,
  price_base_paisa, price_govt_fees_paisa, sla_working_days,
  billing_cycle, is_active, display_order, urgency_score,
  scope_included, scope_excluded, deliverables
) VALUES (
  'iec-code',
  'IEC (Import Export Code)',
  'Mandatory license for importing or exporting goods. Single registration valid for lifetime.',
  (SELECT id FROM service_filter_categories WHERE slug = 'licenses' LIMIT 1),
  499900, -- ₹4,999
  50000, -- ₹500
  5,
  'one_time',
  true,
  7,
  70,
  ARRAY['IEC application preparation', 'Document verification', 'DGFT portal filing', 'IEC certificate'],
  ARRAY['RCMC registration', 'Export incentive claims'],
  '["IEC Certificate", "10-digit IEC number"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  filter_category_id = EXCLUDED.filter_category_id,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  updated_at = now();

-- Upsert Business ITR
INSERT INTO service_packages (
  slug, name, short_description, filter_category_id,
  price_base_paisa, price_govt_fees_paisa, sla_working_days,
  billing_cycle, is_active, display_order, urgency_score,
  scope_included, scope_excluded, deliverables
) VALUES (
  'business-itr',
  'Business ITR Filing',
  'ITR-6 for Pvt Ltd companies, ITR-5 for LLPs and partnerships. Includes P&L review, depreciation, and director remuneration treatment.',
  (SELECT id FROM service_filter_categories WHERE slug = 'tax' LIMIT 1),
  1199900, -- ₹11,999
  0,
  10,
  'one_time',
  true,
  8,
  95,
  ARRAY['Financial statement review', 'Tax computation', 'ITR form preparation', 'E-filing with acknowledgment', 'Tax planning suggestions'],
  ARRAY['Statutory audit', 'Transfer pricing', 'International taxation'],
  '["ITR Acknowledgment", "Computation sheet"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  filter_category_id = EXCLUDED.filter_category_id,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  updated_at = now();

-- Upsert MCA Annual Filing
INSERT INTO service_packages (
  slug, name, short_description, filter_category_id,
  price_base_paisa, price_govt_fees_paisa, sla_working_days,
  billing_cycle, is_active, display_order, urgency_score,
  scope_included, scope_excluded, deliverables
) VALUES (
  'mca-annual-filing',
  'MCA Annual Filing Bundle',
  'Complete annual compliance for companies. AOC-4, MGT-7, and board resolution drafting.',
  (SELECT id FROM service_filter_categories WHERE slug = 'tax' LIMIT 1),
  899900, -- ₹8,999
  120000, -- ₹1,200
  15,
  'one_time',
  true,
  9,
  90,
  ARRAY['AOC-4 preparation and filing', 'MGT-7 preparation and filing', 'Board resolution drafting', 'Annual return compilation'],
  ARRAY['Statutory audit', 'Director KYC', 'Change in directors'],
  '["AOC-4 Acknowledgment", "MGT-7 Acknowledgment"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  filter_category_id = EXCLUDED.filter_category_id,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  updated_at = now();

-- Upsert GST Monthly Filing (Retainer)
INSERT INTO service_packages (
  slug, name, short_description, filter_category_id,
  price_base_paisa, price_govt_fees_paisa, sla_working_days,
  billing_cycle, is_active, display_order, urgency_score,
  scope_included, scope_excluded, deliverables
) VALUES (
  'gst-monthly-filing',
  'GST Monthly Filing',
  'GSTR-1 filed by the 11th. GSTR-3B filed by the 20th. Every month. Acknowledgements saved. Monthly report sent.',
  (SELECT id FROM service_filter_categories WHERE slug = 'ongoing' LIMIT 1),
  299900, -- ₹2,999/month
  0,
  0, -- Retainer - no SLA days
  'monthly',
  true,
  10,
  100,
  ARRAY['GSTR-1 filing by 11th', 'GSTR-3B filing by 20th', 'Input tax credit reconciliation', 'Monthly compliance report'],
  ARRAY['GST annual return', 'E-way bill management', 'GST audit'],
  '["GSTR-1 Acknowledgment", "GSTR-3B Acknowledgment", "Monthly report"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  filter_category_id = EXCLUDED.filter_category_id,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  updated_at = now();

-- Upsert TDS Monthly Compliance (Retainer)
INSERT INTO service_packages (
  slug, name, short_description, filter_category_id,
  price_base_paisa, price_govt_fees_paisa, sla_working_days,
  billing_cycle, is_active, display_order, urgency_score,
  scope_included, scope_excluded, deliverables
) VALUES (
  'tds-monthly-compliance',
  'TDS Monthly Compliance',
  'TDS deduction, challan payment, and return filing. Every month. Never miss a due date.',
  (SELECT id FROM service_filter_categories WHERE slug = 'ongoing' LIMIT 1),
  199900, -- ₹1,999/month
  0,
  0,
  'monthly',
  true,
  11,
  95,
  ARRAY['TDS computation', 'Challan preparation', 'Return filing', 'Form 16/16A generation'],
  ARRAY['TDS assessment', 'Revised returns', 'TDS refund claims'],
  '["TDS Return Acknowledgment", "Challan copies"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  filter_category_id = EXCLUDED.filter_category_id,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  updated_at = now();

-- Upsert Payroll Management (Retainer)
INSERT INTO service_packages (
  slug, name, short_description, filter_category_id,
  price_base_paisa, price_govt_fees_paisa, sla_working_days,
  billing_cycle, is_active, display_order, urgency_score,
  scope_included, scope_excluded, deliverables
) VALUES (
  'payroll-management',
  'Payroll Management',
  'Complete payroll processing. Salary computation, payslips, PF/ESI compliance, and Form 16.',
  (SELECT id FROM service_filter_categories WHERE slug = 'ongoing' LIMIT 1),
  399900, -- ₹3,999/month
  0,
  0,
  'monthly',
  true,
  12,
  85,
  ARRAY['Salary computation', 'Payslip generation', 'PF/ESI calculations', 'Bank transfer file', 'Form 16 at year end'],
  ARRAY['HR policies', 'Leave management', 'Performance management'],
  '["Monthly payslips", "Statutory reports", "Form 16"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  filter_category_id = EXCLUDED.filter_category_id,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  updated_at = now();

-- Add Pro subscription plans to app_settings if they don't exist
INSERT INTO app_settings (key, value)
VALUES
  ('ollvy_pro_annual_plan_id', 'not_configured'),
  ('ollvy_pro_monthly_plan_id', 'not_configured'),
  ('ollvy_pro_annual_price_paisa', '999000'),
  ('ollvy_pro_monthly_price_paisa', '99900')
ON CONFLICT (key) DO NOTHING;

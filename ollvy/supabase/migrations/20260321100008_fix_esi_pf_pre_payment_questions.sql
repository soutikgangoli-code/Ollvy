-- =============================================================================
-- Migration: Fix ESI and PF Pre-Payment Questions
-- Add missing employee_count pre-payment questions and fix step numbers
-- =============================================================================

-- =============================================================================
-- ESI Registration
-- Step 1: Employee Count (new), Step 2: Voluntary Registration (conditional)
-- =============================================================================

-- Insert employee_count pre-payment question for ESI
INSERT INTO service_questionnaires (
  service_package_id,
  question_key,
  question_label,
  question_type,
  step_number,
  display_order,
  is_pre_payment,
  is_active,
  options,
  help_text
)
SELECT
  id,
  'employee_count',
  'How many employees does your establishment have?',
  'select',
  1,
  1,
  true,
  true,
  '[
    {"value": "below_10", "label": "Less than 10 employees"},
    {"value": "10_to_20", "label": "10 to 20 employees"},
    {"value": "above_20", "label": "More than 20 employees"}
  ]'::jsonb,
  'ESI registration is mandatory for establishments with 10 or more employees. Voluntary registration is available for smaller establishments.'
FROM service_packages
WHERE slug = 'esi-registration'
ON CONFLICT (service_package_id, question_key) DO UPDATE SET
  step_number = 1,
  display_order = 1,
  is_pre_payment = true,
  is_active = true;

-- Update voluntary_registration to step 2 and add depends_on condition
UPDATE service_questionnaires
SET
  step_number = 2,
  display_order = 1,
  depends_on = '{"question_key": "employee_count", "value": "below_10"}'::jsonb
WHERE question_key = 'voluntary_registration'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'esi-registration');


-- =============================================================================
-- PF Registration
-- Step 1: Employee Count (new), Step 2: Voluntary Registration (conditional)
-- =============================================================================

-- Insert employee_count pre-payment question for PF
INSERT INTO service_questionnaires (
  service_package_id,
  question_key,
  question_label,
  question_type,
  step_number,
  display_order,
  is_pre_payment,
  is_active,
  options,
  help_text
)
SELECT
  id,
  'employee_count',
  'How many employees does your establishment have?',
  'select',
  1,
  1,
  true,
  true,
  '[
    {"value": "below_20", "label": "Less than 20 employees"},
    {"value": "20_or_more", "label": "20 or more employees"}
  ]'::jsonb,
  'PF registration is mandatory for establishments with 20 or more employees. Voluntary registration is available for smaller establishments.'
FROM service_packages
WHERE slug = 'pf-registration'
ON CONFLICT (service_package_id, question_key) DO UPDATE SET
  step_number = 1,
  display_order = 1,
  is_pre_payment = true,
  is_active = true;

-- Update voluntary_registration to step 2 and add depends_on condition
UPDATE service_questionnaires
SET
  step_number = 2,
  display_order = 1,
  depends_on = '{"question_key": "employee_count", "value": "below_20"}'::jsonb
WHERE question_key = 'voluntary_registration'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration');

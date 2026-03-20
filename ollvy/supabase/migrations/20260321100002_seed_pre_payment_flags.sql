-- =============================================================================
-- Migration: Step 7 - Seed Pre-Payment Flags
-- Mark specific questions as is_pre_payment = true and add missing questions
-- =============================================================================

-- =============================================================================
-- Professional Tax
-- Pre-payment questions: state, registration_type
-- =============================================================================

UPDATE service_questionnaires
SET is_pre_payment = true
WHERE question_key IN ('state', 'registration_type')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'professional-tax');


-- =============================================================================
-- Trademark Registration
-- Pre-payment questions: applicant_type, trademark_type, trademark_class_count (new)
-- =============================================================================

UPDATE service_questionnaires
SET is_pre_payment = true
WHERE question_key IN ('applicant_type', 'trademark_type')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

-- Add trademark_class_count question if not exists
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, help_text,
   validation, is_pre_payment, is_active, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'trademark-registration'),
  'trademark_class_count',
  'How many trademark classes do you need?',
  'number',
  'Each class covers a different category of goods or services. Most businesses need 1-2 classes. Not sure? Choose 1 - our CA will advise before filing.',
  '{"required": true, "min": 1, "max": 45}'::jsonb,
  true,
  true,
  0,
  2
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'trademark_class_count'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration')
);


-- =============================================================================
-- Private Limited Company
-- Pre-payment questions: number_of_directors, authorized_capital
-- =============================================================================

UPDATE service_questionnaires
SET is_pre_payment = true
WHERE question_key IN ('number_of_directors', 'authorized_capital')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation');


-- =============================================================================
-- LLP Incorporation
-- Pre-payment questions: number_of_partners, total_contribution
-- =============================================================================

UPDATE service_questionnaires
SET is_pre_payment = true
WHERE question_key IN ('number_of_partners', 'total_contribution')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation');


-- =============================================================================
-- ESI Registration
-- Pre-payment questions: employee_count, voluntary_registration (new)
-- =============================================================================

UPDATE service_questionnaires
SET is_pre_payment = true
WHERE question_key = 'employee_count'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'esi-registration');

-- Add voluntary_registration question for ESI
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, options,
   depends_on, is_pre_payment, is_active, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'esi-registration'),
  'voluntary_registration',
  'You have fewer than 10 employees. ESI is not yet mandatory. Would you like to register voluntarily?',
  'radio',
  '[{"value": "yes", "label": "Yes, register voluntarily"}, {"value": "no", "label": "No, I will register when required"}]'::jsonb,
  '{"question_key": "employee_count", "operator": "less_than", "value": 10}'::jsonb,
  true,
  true,
  0,
  2
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'voluntary_registration'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'esi-registration')
);


-- =============================================================================
-- PF Registration
-- Pre-payment questions: employee_count, voluntary_registration (new)
-- =============================================================================

UPDATE service_questionnaires
SET is_pre_payment = true
WHERE question_key = 'employee_count'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration');

-- Add voluntary_registration question for PF
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, options,
   depends_on, is_pre_payment, is_active, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'pf-registration'),
  'voluntary_registration',
  'You have fewer than 20 employees. PF is not yet mandatory. Would you like to register voluntarily?',
  'radio',
  '[{"value": "yes", "label": "Yes, register voluntarily"}, {"value": "no", "label": "No, I will register when required"}]'::jsonb,
  '{"question_key": "employee_count", "operator": "less_than", "value": 20}'::jsonb,
  true,
  true,
  0,
  2
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'voluntary_registration'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration')
);


-- =============================================================================
-- Copyright Registration
-- Pre-payment question: work_category
-- =============================================================================

UPDATE service_questionnaires
SET is_pre_payment = true
WHERE question_key = 'work_category'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'copyright-registration');

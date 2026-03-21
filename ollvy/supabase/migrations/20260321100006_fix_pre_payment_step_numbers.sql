-- =============================================================================
-- Migration: Fix Pre-Payment Question Step Numbers
-- Consolidate all pre-payment questions to use consistent step numbers
-- so the questionnaire wizard shows them in the correct order
-- =============================================================================

-- =============================================================================
-- Trademark Registration
-- Put all pre-payment questions on step 1 with proper display order
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'applicant_type'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

UPDATE service_questionnaires
SET step_number = 1, display_order = 2
WHERE question_key = 'trademark_type'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

UPDATE service_questionnaires
SET step_number = 1, display_order = 3
WHERE question_key = 'trademark_class_count'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');


-- =============================================================================
-- Private Limited Company
-- Put all pre-payment questions on step 1 with proper display order
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'number_of_directors'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation');

UPDATE service_questionnaires
SET step_number = 1, display_order = 2
WHERE question_key = 'authorized_capital'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation');


-- =============================================================================
-- LLP Incorporation
-- Put all pre-payment questions on step 1 with proper display order
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'number_of_partners'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation');

UPDATE service_questionnaires
SET step_number = 1, display_order = 2
WHERE question_key = 'total_contribution'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation');


-- =============================================================================
-- Professional Tax
-- Put all pre-payment questions on step 1 with proper display order
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'state'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'professional-tax');

UPDATE service_questionnaires
SET step_number = 1, display_order = 2
WHERE question_key = 'registration_type'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'professional-tax');


-- =============================================================================
-- ESI Registration
-- Put all pre-payment questions on step 1 with proper display order
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'employee_count'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'esi-registration');

UPDATE service_questionnaires
SET step_number = 1, display_order = 2
WHERE question_key = 'voluntary_registration'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'esi-registration');


-- =============================================================================
-- PF Registration
-- Put all pre-payment questions on step 1 with proper display order
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'employee_count'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration');

UPDATE service_questionnaires
SET step_number = 1, display_order = 2
WHERE question_key = 'voluntary_registration'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration');


-- =============================================================================
-- Copyright Registration
-- Put all pre-payment questions on step 1 with proper display order
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'work_category'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'copyright-registration');

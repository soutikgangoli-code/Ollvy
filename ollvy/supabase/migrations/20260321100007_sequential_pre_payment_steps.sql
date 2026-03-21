-- =============================================================================
-- Migration: Sequential Pre-Payment Steps
-- Each pre-payment question gets its own step for a guided flow
-- =============================================================================

-- =============================================================================
-- Trademark Registration
-- Step 1: Applicant Type, Step 2: Trademark Type, Step 3: Class Count
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'applicant_type'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

UPDATE service_questionnaires
SET step_number = 2, display_order = 1
WHERE question_key = 'trademark_type'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

UPDATE service_questionnaires
SET step_number = 3, display_order = 1
WHERE question_key = 'trademark_class_count'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');


-- =============================================================================
-- Private Limited Company
-- Step 1: Number of Directors, Step 2: Authorized Capital
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'number_of_directors'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation');

UPDATE service_questionnaires
SET step_number = 2, display_order = 1
WHERE question_key = 'authorized_capital'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation');


-- =============================================================================
-- LLP Incorporation
-- Step 1: Number of Partners, Step 2: Total Contribution
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'number_of_partners'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation');

UPDATE service_questionnaires
SET step_number = 2, display_order = 1
WHERE question_key = 'total_contribution'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation');


-- =============================================================================
-- Professional Tax
-- Step 1: State, Step 2: Registration Type
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'state'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'professional-tax');

UPDATE service_questionnaires
SET step_number = 2, display_order = 1
WHERE question_key = 'registration_type'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'professional-tax');


-- =============================================================================
-- ESI Registration
-- Step 1: Employee Count, Step 2: Voluntary Registration (conditional)
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'employee_count'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'esi-registration');

UPDATE service_questionnaires
SET step_number = 2, display_order = 1
WHERE question_key = 'voluntary_registration'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'esi-registration');


-- =============================================================================
-- PF Registration
-- Step 1: Employee Count, Step 2: Voluntary Registration (conditional)
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'employee_count'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration');

UPDATE service_questionnaires
SET step_number = 2, display_order = 1
WHERE question_key = 'voluntary_registration'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration');


-- =============================================================================
-- Copyright Registration
-- Step 1: Work Category (single question)
-- =============================================================================

UPDATE service_questionnaires
SET step_number = 1, display_order = 1
WHERE question_key = 'work_category'
AND is_pre_payment = true
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'copyright-registration');

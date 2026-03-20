-- =============================================================================
-- Migration: Add Conditional Logic (depends_on) to Questionnaires
-- Makes questions show/hide based on previous answers
-- =============================================================================

-- =============================================================================
-- 1. GST Registration Conditionals
-- =============================================================================

-- trade_name depends on has_trade_name = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "has_trade_name", "value": "yes"}'::jsonb
WHERE question_key = 'trade_name'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'gst-registration');

-- add_premises_state depends on has_additional_premises = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "has_additional_premises", "value": "yes"}'::jsonb
WHERE question_key = 'add_premises_state'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'gst-registration');

-- add_premises_address depends on has_additional_premises = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "has_additional_premises", "value": "yes"}'::jsonb
WHERE question_key = 'add_premises_address'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'gst-registration');

-- hsn_sac_code depends on knows_hsn = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "knows_hsn", "value": "yes"}'::jsonb
WHERE question_key = 'hsn_sac_code'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'gst-registration');

-- voluntary_registration depends on turnover_threshold = "no" or "not_sure"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "turnover_threshold", "values": ["no", "not_sure"]}'::jsonb
WHERE question_key = 'voluntary_registration'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'gst-registration');

-- =============================================================================
-- 2. MSME Registration Conditionals
-- =============================================================================

-- previous_reg_number depends on has_previous_registration = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "has_previous_registration", "value": "yes"}'::jsonb
WHERE question_key = 'previous_reg_number'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'msme-registration');

-- gstin depends on has_gst = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "has_gst", "value": "yes"}'::jsonb
WHERE question_key = 'gstin'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'msme-registration');

-- =============================================================================
-- 3. Professional Tax Conditionals
-- =============================================================================

-- employee_count depends on registration_type containing "ptrc"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "registration_type", "contains": "ptrc"}'::jsonb
WHERE question_key = 'employee_count'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'professional-tax');

-- =============================================================================
-- 4. Trademark Registration Conditionals
-- =============================================================================

-- trademark_text shows for word marks and composite marks
UPDATE service_questionnaires
SET depends_on = '{"question_key": "trademark_type", "values": ["word", "composite"]}'::jsonb
WHERE question_key = 'trademark_text'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

-- claimed_colours depends on claims_colour = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "claims_colour", "value": "yes"}'::jsonb
WHERE question_key = 'claimed_colours'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

-- first_use_date depends on mark_in_use = "already_in_use"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "mark_in_use", "value": "already_in_use"}'::jsonb
WHERE question_key = 'first_use_date'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

-- has_use_evidence depends on mark_in_use = "already_in_use"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "mark_in_use", "value": "already_in_use"}'::jsonb
WHERE question_key = 'has_use_evidence'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

-- use_evidence_type depends on has_use_evidence = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "has_use_evidence", "value": "yes"}'::jsonb
WHERE question_key = 'use_evidence_type'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

-- convention_country depends on is_convention = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "is_convention", "value": "yes"}'::jsonb
WHERE question_key = 'convention_country'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

-- convention_date depends on is_convention = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "is_convention", "value": "yes"}'::jsonb
WHERE question_key = 'convention_date'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

-- =============================================================================
-- 5. Copyright Registration Conditionals
-- =============================================================================

-- ownership_basis depends on applicant_is_author = "no"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "applicant_is_author", "value": "no"}'::jsonb
WHERE question_key = 'ownership_basis'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'copyright-registration');

-- publication_year depends on publication_status = "published"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "publication_status", "value": "published"}'::jsonb
WHERE question_key = 'publication_year'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'copyright-registration');

-- publication_country depends on publication_status = "published"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "publication_status", "value": "published"}'::jsonb
WHERE question_key = 'publication_country'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'copyright-registration');

-- creation_year depends on publication_status = "unpublished"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "publication_status", "value": "unpublished"}'::jsonb
WHERE question_key = 'creation_year'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'copyright-registration');

-- =============================================================================
-- 6. Partnership Registration Conditionals
-- =============================================================================

-- fixed_duration_years depends on duration = "fixed"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "duration", "value": "fixed"}'::jsonb
WHERE question_key = 'fixed_duration_years'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'partnership-registration');

-- existing_business_name depends on has_existing_business = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "has_existing_business", "value": "yes"}'::jsonb
WHERE question_key = 'existing_business_name'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'partnership-registration');

-- =============================================================================
-- 7. MCA Annual Filing Conditionals
-- =============================================================================

-- AGM fields depend on entity_type not being LLP (companies only)
UPDATE service_questionnaires
SET depends_on = '{"question_key": "entity_type", "values": ["pvt_ltd", "opc", "public_ltd", "section_8"]}'::jsonb
WHERE question_key IN ('agm_date', 'agm_timely', 'board_meetings_count', 'board_meeting_dates', 'paidup_capital')
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'mca-annual-filing');

-- Auditor fields depend on is_audit_required = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "is_audit_required", "value": "yes"}'::jsonb
WHERE question_key IN ('auditor_name', 'auditor_membership', 'auditor_appointment_date', 'auditor_changed')
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'mca-annual-filing');

-- director_change_type depends on director_changes = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "director_changes", "value": "yes"}'::jsonb
WHERE question_key = 'director_change_type'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'mca-annual-filing');

-- csr_amount depends on csr_applicable = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "csr_applicable", "value": "yes"}'::jsonb
WHERE question_key = 'csr_amount'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'mca-annual-filing');

-- =============================================================================
-- 8. ROC Changes Conditionals (combined director-change + registered-office-change)
-- =============================================================================

-- Director change fields depend on change_category = "director_change" or "both"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "change_category", "values": ["director_change", "both"]}'::jsonb
WHERE question_key IN (
  'director_change_type', 'new_director_name', 'new_director_father', 'new_director_dob',
  'new_director_nationality', 'new_director_pan', 'new_director_aadhaar', 'new_director_mobile',
  'new_director_email', 'new_director_address', 'has_din', 'new_director_din',
  'appointment_board_date', 'appointment_effective_date', 'director_category',
  'resigning_director_name', 'resigning_director_din', 'resignation_date',
  'has_resignation_letter', 'board_accepted', 'acceptance_board_date', 'min_directors_remaining',
  'change_director_din', 'detail_change_type', 'new_detail_values'
)
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'roc-changes');

-- Address change fields depend on change_category = "address_change" or "both"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "change_category", "values": ["address_change", "both"]}'::jsonb
WHERE question_key IN (
  'current_address', 'current_state', 'change_scope', 'new_address', 'new_state',
  'new_premises_type', 'change_reason', 'board_resolution_date', 'special_resolution_required',
  'gm_date', 'mgt14_required', 'current_roc', 'new_roc', 'pending_proceedings',
  'pending_dues', 'pending_details'
)
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'roc-changes');

-- new_director_din depends on has_din = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "has_din", "value": "yes"}'::jsonb
WHERE question_key = 'new_director_din'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'roc-changes');

-- acceptance_board_date depends on board_accepted = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "board_accepted", "value": "yes"}'::jsonb
WHERE question_key = 'acceptance_board_date'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'roc-changes');

-- new_state depends on change_scope = "inter_state" (in addition to address change category)
UPDATE service_questionnaires
SET depends_on = '{"question_key": "change_scope", "value": "inter_state"}'::jsonb
WHERE question_key = 'new_state'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'roc-changes');

-- Regional Director fields depend on change_scope = "inter_state"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "change_scope", "value": "inter_state"}'::jsonb
WHERE question_key IN ('current_roc', 'new_roc', 'pending_proceedings', 'pending_dues', 'pending_details')
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'roc-changes');

-- gm_date depends on special_resolution_required = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "special_resolution_required", "value": "yes"}'::jsonb
WHERE question_key = 'gm_date'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'roc-changes');

-- pending_details depends on pending_proceedings = "yes" OR pending_dues = "yes"
UPDATE service_questionnaires
SET depends_on = '{"question_key": "pending_proceedings", "value": "yes"}'::jsonb
WHERE question_key = 'pending_details'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'roc-changes');


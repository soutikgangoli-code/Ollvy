-- =============================================================================
-- Migration: Seed Questionnaires for Compliance Services
-- Adds questionnaires for: mca-annual-filing (ref: roc-annual-filing),
-- roc-changes (ref: director-change + registered-office-change combined)
-- NOTE: director-kyc is a separate service, not covered here
-- =============================================================================

-- =============================================================================
-- 1. MCA Annual Filing Questionnaire (ref: roc-annual-filing)
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'mca-annual-filing' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Company / LLP Details (6 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'entity_type',
      'Entity type',
      'select',
      '[
        {"value": "pvt_ltd", "label": "Private Limited Company"},
        {"value": "opc", "label": "One Person Company"},
        {"value": "public_ltd", "label": "Public Limited Company"},
        {"value": "section_8", "label": "Section 8 Company"},
        {"value": "llp", "label": "LLP"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Determines applicable forms for filing.',
      1,
      1
    ),
    (
      service_id,
      'cin',
      'CIN / LLPIN',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'e.g., U74999DL2020PTC123456',
      'Alphanumeric CIN or LLPIN of your entity.',
      1,
      2
    ),
    (
      service_id,
      'company_name',
      'Registered name of company / LLP',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'Auto-fetchable from MCA using CIN',
      'Legal name as registered with MCA.',
      1,
      3
    ),
    (
      service_id,
      'financial_year',
      'Financial year for which filing is to be done',
      'select',
      '[
        {"value": "2021-22", "label": "FY 2021-22"},
        {"value": "2022-23", "label": "FY 2022-23"},
        {"value": "2023-24", "label": "FY 2023-24"},
        {"value": "2024-25", "label": "FY 2024-25"},
        {"value": "2025-26", "label": "FY 2025-26"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select the financial year for annual filing.',
      1,
      4
    ),
    (
      service_id,
      'agm_date',
      'Date of Annual General Meeting (AGM)',
      'date',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'LLPs do not have AGM. Must be within 6 months of financial year end for companies.',
      1,
      5
    ),
    (
      service_id,
      'agm_timely',
      'Was AGM held within the due date?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"},
        {"value": "na", "label": "Not Applicable (LLP)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'AGM should be held within 6 months of FY end.',
      1,
      6
    );

    -- Step 2: Financial Particulars (10 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'total_turnover',
      'Total turnover / revenue for the year (Rs.)',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'e.g., 5000000',
      'Total revenue in rupees.',
      2,
      1
    ),
    (
      service_id,
      'net_profit_loss',
      'Net profit / (loss) after tax (Rs.)',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'Enter negative for loss',
      'Net profit or loss for the year.',
      2,
      2
    ),
    (
      service_id,
      'paidup_capital',
      'Paid-up share capital as on 31st March (Rs.)',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'For companies only',
      'Total paid-up capital.',
      2,
      3
    ),
    (
      service_id,
      'total_assets',
      'Total assets as on 31st March (Rs.)',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'Total assets on balance sheet.',
      2,
      4
    ),
    (
      service_id,
      'total_liabilities',
      'Total liabilities as on 31st March (Rs.)',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'Total liabilities on balance sheet.',
      2,
      5
    ),
    (
      service_id,
      'is_audit_required',
      'Is the company required to get accounts audited?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Mandatory for all companies. LLPs with turnover > Rs. 40L or contribution > Rs. 25L.',
      2,
      6
    ),
    (
      service_id,
      'auditor_name',
      'Name of auditor / CA firm',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'If audit is required',
      'Name of the auditing CA firm.',
      2,
      7
    ),
    (
      service_id,
      'auditor_membership',
      'ICAI Membership Number of signing CA',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      '6-digit membership number',
      'Membership number of the signing auditor.',
      2,
      8
    ),
    (
      service_id,
      'auditor_appointment_date',
      'Date of auditor appointment',
      'date',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'When the current auditor was appointed.',
      2,
      9
    ),
    (
      service_id,
      'auditor_changed',
      'Has the company changed its auditor this year?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Auditor change requires additional filings.',
      2,
      10
    );

    -- Step 3: Director / Partner Details (5 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'director_count',
      'Number of directors / designated partners as on 31st March',
      'text',
      NULL,
      '{"required": true, "pattern": "^[0-9]+$"}'::jsonb,
      'e.g., 2',
      'Total number of directors or partners.',
      3,
      1
    ),
    (
      service_id,
      'director_changes',
      'Were there any director / partner changes during the year?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Appointments, resignations, or changes in details.',
      3,
      2
    ),
    (
      service_id,
      'director_change_type',
      'Type of change',
      'multiselect',
      '[
        {"value": "appointment", "label": "Appointment"},
        {"value": "resignation", "label": "Resignation"},
        {"value": "details_change", "label": "Change in details"},
        {"value": "din_kyc", "label": "Change in DIN KYC"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Select all applicable changes.',
      3,
      3
    ),
    (
      service_id,
      'board_meetings_count',
      'Number of board meetings held during the year',
      'text',
      NULL,
      '{"required": false, "pattern": "^[0-9]+$"}'::jsonb,
      'Min 4 required; gap not > 120 days',
      'For companies only.',
      3,
      4
    ),
    (
      service_id,
      'board_meeting_dates',
      'Dates of board meetings',
      'textarea',
      NULL,
      '{"required": false}'::jsonb,
      'One date per line',
      'List all board meeting dates.',
      3,
      5
    );

    -- Step 4: Additional Disclosures (7 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'is_small_company',
      'Is the company a Small Company?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"},
        {"value": "na", "label": "Not Applicable"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Paid-up capital <= Rs. 4Cr AND turnover <= Rs. 40Cr.',
      4,
      1
    ),
    (
      service_id,
      'has_subsidiaries',
      'Does the company have any subsidiaries?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Subsidiary companies need consolidated filing.',
      4,
      2
    ),
    (
      service_id,
      'has_associates',
      'Does the company have any associate companies?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Associate company relationships.',
      4,
      3
    ),
    (
      service_id,
      'has_related_party_loans',
      'Were any loans given to / taken from directors or related parties?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Related party transactions need disclosure.',
      4,
      4
    ),
    (
      service_id,
      'csr_applicable',
      'Was any CSR applicable this year?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'CSR mandatory if net profit > Rs. 5Cr, turnover > Rs. 1000Cr, or net worth > Rs. 500Cr.',
      4,
      5
    ),
    (
      service_id,
      'csr_amount',
      'CSR amount spent (Rs.)',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'If CSR applicable',
      'Amount spent on CSR activities.',
      4,
      6
    ),
    (
      service_id,
      'has_public_deposits',
      'Were any deposits accepted from public?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Public deposits require additional compliance.',
      4,
      7
    );

  END IF;
END $$;

-- =============================================================================
-- 2. ROC Changes Questionnaire (combines director-change + registered-office-change)
-- This service handles both Director Changes and Registered Office Changes
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'roc-changes' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Company Details & Type of Change (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'cin',
      'CIN of the company',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'e.g., U74999DL2020PTC123456',
      'Valid CIN format.',
      1,
      1
    ),
    (
      service_id,
      'company_name',
      'Registered name of company',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'Auto-fetchable from MCA',
      'Legal name as registered with MCA.',
      1,
      2
    ),
    (
      service_id,
      'change_category',
      'What type of change do you need?',
      'select',
      '[
        {"value": "director_change", "label": "Director Change (Appointment / Resignation / Detail Change)"},
        {"value": "address_change", "label": "Registered Office Address Change"},
        {"value": "both", "label": "Both Director and Address Change"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select the type of ROC change required.',
      1,
      3
    );

    -- Step 2: Director Change Details (ref: director-change) - shown when change_category includes director
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'director_change_type',
      'Type of director change required',
      'multiselect',
      '[
        {"value": "appointment", "label": "Appointment of New Director"},
        {"value": "resignation", "label": "Resignation of Existing Director"},
        {"value": "details_change", "label": "Change in Director''s Personal Details (address / name)"},
        {"value": "kyc_update", "label": "Director KYC Update (DIR-3 KYC)"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Select all applicable director changes.',
      2,
      1
    ),
    -- For new director appointment
    (
      service_id,
      'new_director_name',
      'Full legal name of new director',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'As per PAN',
      'For new director appointment.',
      2,
      2
    ),
    (
      service_id,
      'new_director_father',
      'Father''s name',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Father''s name of new director.',
      2,
      3
    ),
    (
      service_id,
      'new_director_dob',
      'Date of birth',
      'date',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Must be 18+.',
      2,
      4
    ),
    (
      service_id,
      'new_director_nationality',
      'Nationality',
      'select',
      '[
        {"value": "indian", "label": "Indian"},
        {"value": "foreign", "label": "Foreign"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Nationality of new director.',
      2,
      5
    ),
    (
      service_id,
      'new_director_pan',
      'PAN',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'PAN of new director (required for Indian nationals).',
      2,
      6
    ),
    (
      service_id,
      'new_director_aadhaar',
      'Aadhaar',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      '12 digits',
      'Aadhaar number (required for Indian nationals).',
      2,
      7
    ),
    (
      service_id,
      'new_director_mobile',
      'Mobile (Aadhaar-linked)',
      'text',
      NULL,
      '{"required": false, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '10 digits',
      'Mobile number linked to Aadhaar.',
      2,
      8
    ),
    (
      service_id,
      'new_director_email',
      'Email',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Email address of new director.',
      2,
      9
    ),
    (
      service_id,
      'new_director_address',
      'Residential address',
      'textarea',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Current residential address.',
      2,
      10
    ),
    (
      service_id,
      'has_din',
      'Has existing DIN?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Director Identification Number.',
      2,
      11
    ),
    (
      service_id,
      'new_director_din',
      'Existing DIN',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      '8 digits',
      'If director already has a DIN.',
      2,
      12
    ),
    (
      service_id,
      'appointment_board_date',
      'Date of board resolution appointing the director',
      'date',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Board meeting date for appointment resolution.',
      2,
      13
    ),
    (
      service_id,
      'appointment_effective_date',
      'Date from which director is to be appointed',
      'date',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'On or after board resolution date.',
      2,
      14
    ),
    (
      service_id,
      'director_category',
      'Category of director',
      'select',
      '[
        {"value": "executive", "label": "Executive"},
        {"value": "non_executive", "label": "Non-Executive"},
        {"value": "independent", "label": "Independent"},
        {"value": "nominee", "label": "Nominee"},
        {"value": "additional", "label": "Additional"},
        {"value": "alternate", "label": "Alternate"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Type of director being appointed.',
      2,
      15
    );

    -- Step 3: Director Resignation Details
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'resigning_director_name',
      'Name of resigning director',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'For director resignation.',
      3,
      1
    ),
    (
      service_id,
      'resigning_director_din',
      'DIN of resigning director',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      '8 digits',
      'Director Identification Number.',
      3,
      2
    ),
    (
      service_id,
      'resignation_date',
      'Date of resignation',
      'date',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Date director resigned.',
      3,
      3
    ),
    (
      service_id,
      'has_resignation_letter',
      'Has the director submitted a resignation letter?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'DIR-12 filing requires resignation letter.',
      3,
      4
    ),
    (
      service_id,
      'board_accepted',
      'Was the resignation accepted by the board?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Board must accept resignation.',
      3,
      5
    ),
    (
      service_id,
      'acceptance_board_date',
      'Date of board resolution accepting resignation',
      'date',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Required if board accepted resignation.',
      3,
      6
    ),
    (
      service_id,
      'min_directors_remaining',
      'Is there at least 1 director remaining after this resignation?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Company must have minimum 2 directors (Pvt Ltd). If No, new director must be appointed simultaneously.',
      3,
      7
    );

    -- Step 4: Change in Director Details
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'change_director_din',
      'DIN of director whose details are changing',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      '8 digits',
      'For director detail changes.',
      4,
      1
    ),
    (
      service_id,
      'detail_change_type',
      'Type of detail changing',
      'multiselect',
      '[
        {"value": "name", "label": "Name"},
        {"value": "father_name", "label": "Father''s Name"},
        {"value": "nationality", "label": "Nationality"},
        {"value": "address", "label": "Residential Address"},
        {"value": "dob", "label": "Date of Birth"},
        {"value": "email", "label": "Email"},
        {"value": "mobile", "label": "Mobile"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Select all details being changed.',
      4,
      2
    ),
    (
      service_id,
      'new_detail_values',
      'New values for changed fields',
      'textarea',
      NULL,
      '{"required": false}'::jsonb,
      'Specify each change clearly',
      'Provide new values for each field being changed.',
      4,
      3
    );

    -- Step 5: Registered Office Address Change (ref: registered-office-change)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'current_address',
      'Current registered address',
      'textarea',
      NULL,
      '{"required": false}'::jsonb,
      'Full current address as on MCA',
      'Complete current registered office address.',
      5,
      1
    ),
    (
      service_id,
      'current_state',
      'Current state',
      'select',
      '[
        {"value": "AN", "label": "Andaman and Nicobar Islands"},
        {"value": "AP", "label": "Andhra Pradesh"},
        {"value": "AR", "label": "Arunachal Pradesh"},
        {"value": "AS", "label": "Assam"},
        {"value": "BR", "label": "Bihar"},
        {"value": "CH", "label": "Chandigarh"},
        {"value": "CT", "label": "Chhattisgarh"},
        {"value": "DN", "label": "Dadra and Nagar Haveli and Daman and Diu"},
        {"value": "DL", "label": "Delhi"},
        {"value": "GA", "label": "Goa"},
        {"value": "GJ", "label": "Gujarat"},
        {"value": "HR", "label": "Haryana"},
        {"value": "HP", "label": "Himachal Pradesh"},
        {"value": "JK", "label": "Jammu and Kashmir"},
        {"value": "JH", "label": "Jharkhand"},
        {"value": "KA", "label": "Karnataka"},
        {"value": "KL", "label": "Kerala"},
        {"value": "LA", "label": "Ladakh"},
        {"value": "LD", "label": "Lakshadweep"},
        {"value": "MP", "label": "Madhya Pradesh"},
        {"value": "MH", "label": "Maharashtra"},
        {"value": "MN", "label": "Manipur"},
        {"value": "ML", "label": "Meghalaya"},
        {"value": "MZ", "label": "Mizoram"},
        {"value": "NL", "label": "Nagaland"},
        {"value": "OD", "label": "Odisha"},
        {"value": "PY", "label": "Puducherry"},
        {"value": "PB", "label": "Punjab"},
        {"value": "RJ", "label": "Rajasthan"},
        {"value": "SK", "label": "Sikkim"},
        {"value": "TN", "label": "Tamil Nadu"},
        {"value": "TG", "label": "Telangana"},
        {"value": "TR", "label": "Tripura"},
        {"value": "UP", "label": "Uttar Pradesh"},
        {"value": "UK", "label": "Uttarakhand"},
        {"value": "WB", "label": "West Bengal"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'State of current registered office.',
      5,
      2
    ),
    (
      service_id,
      'change_scope',
      'Type of address change',
      'select',
      '[
        {"value": "same_city", "label": "Within the same city / town / village"},
        {"value": "same_state", "label": "Within the same state but different city (same RoC jurisdiction)"},
        {"value": "inter_state", "label": "From one state to another state (different RoC jurisdiction)"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Determines forms required and approvals needed.',
      5,
      3
    ),
    (
      service_id,
      'new_address',
      'New registered address',
      'textarea',
      NULL,
      '{"required": false}'::jsonb,
      'Full new address',
      'Complete new registered office address.',
      5,
      4
    ),
    (
      service_id,
      'new_state',
      'New state',
      'select',
      '[
        {"value": "AN", "label": "Andaman and Nicobar Islands"},
        {"value": "AP", "label": "Andhra Pradesh"},
        {"value": "AR", "label": "Arunachal Pradesh"},
        {"value": "AS", "label": "Assam"},
        {"value": "BR", "label": "Bihar"},
        {"value": "CH", "label": "Chandigarh"},
        {"value": "CT", "label": "Chhattisgarh"},
        {"value": "DN", "label": "Dadra and Nagar Haveli and Daman and Diu"},
        {"value": "DL", "label": "Delhi"},
        {"value": "GA", "label": "Goa"},
        {"value": "GJ", "label": "Gujarat"},
        {"value": "HR", "label": "Haryana"},
        {"value": "HP", "label": "Himachal Pradesh"},
        {"value": "JK", "label": "Jammu and Kashmir"},
        {"value": "JH", "label": "Jharkhand"},
        {"value": "KA", "label": "Karnataka"},
        {"value": "KL", "label": "Kerala"},
        {"value": "LA", "label": "Ladakh"},
        {"value": "LD", "label": "Lakshadweep"},
        {"value": "MP", "label": "Madhya Pradesh"},
        {"value": "MH", "label": "Maharashtra"},
        {"value": "MN", "label": "Manipur"},
        {"value": "ML", "label": "Meghalaya"},
        {"value": "MZ", "label": "Mizoram"},
        {"value": "NL", "label": "Nagaland"},
        {"value": "OD", "label": "Odisha"},
        {"value": "PY", "label": "Puducherry"},
        {"value": "PB", "label": "Punjab"},
        {"value": "RJ", "label": "Rajasthan"},
        {"value": "SK", "label": "Sikkim"},
        {"value": "TN", "label": "Tamil Nadu"},
        {"value": "TG", "label": "Telangana"},
        {"value": "TR", "label": "Tripura"},
        {"value": "UP", "label": "Uttar Pradesh"},
        {"value": "UK", "label": "Uttarakhand"},
        {"value": "WB", "label": "West Bengal"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Required for inter-state change.',
      5,
      5
    ),
    (
      service_id,
      'new_premises_type',
      'Nature of new premises',
      'select',
      '[
        {"value": "owned_company", "label": "Owned by company"},
        {"value": "owned_director", "label": "Owned by director / promoter"},
        {"value": "rented", "label": "Rented"},
        {"value": "leased", "label": "Leased"},
        {"value": "consent", "label": "Consent basis"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Ownership status of new premises.',
      5,
      6
    );

    -- Step 6: Basis for Address Change
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'change_reason',
      'Reason for change of address',
      'select',
      '[
        {"value": "business_expansion", "label": "Business expansion"},
        {"value": "cost_optimization", "label": "Cost optimization"},
        {"value": "operational", "label": "Operational convenience"},
        {"value": "relocation", "label": "Office relocation"},
        {"value": "regulatory", "label": "Regulatory / compliance reason"},
        {"value": "other", "label": "Others"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Primary reason for the address change.',
      6,
      1
    ),
    (
      service_id,
      'board_resolution_date',
      'Date of board resolution approving change',
      'date',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Must be before filing.',
      6,
      2
    ),
    (
      service_id,
      'special_resolution_required',
      'Was a special resolution required?',
      'select',
      '[
        {"value": "yes", "label": "Yes (inter-state change requires special resolution)"},
        {"value": "no", "label": "No (intra-state change requires ordinary resolution)"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Inter-state changes require special resolution via EGM.',
      6,
      3
    ),
    (
      service_id,
      'gm_date',
      'Date of General Meeting / Resolution',
      'date',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Required if special resolution was needed.',
      6,
      4
    ),
    (
      service_id,
      'mgt14_required',
      'MGT-14 filing required?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Required for special resolutions.',
      6,
      5
    );

    -- Step 7: Inter-State Change - Regional Director Approval
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'current_roc',
      'Current RoC jurisdiction',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'Auto-populated based on current state',
      'Registrar of Companies jurisdiction.',
      7,
      1
    ),
    (
      service_id,
      'new_roc',
      'New RoC jurisdiction',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'Auto-populated based on new state',
      'New Registrar of Companies jurisdiction.',
      7,
      2
    ),
    (
      service_id,
      'pending_proceedings',
      'Does the company have any pending legal proceedings?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Required disclosure in INC-23 for inter-state change.',
      7,
      3
    ),
    (
      service_id,
      'pending_dues',
      'Does the company owe any unpaid taxes or dues?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Required disclosure for inter-state change.',
      7,
      4
    ),
    (
      service_id,
      'pending_details',
      'Details of pending proceedings / dues',
      'textarea',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Provide details if any proceedings or dues exist.',
      7,
      5
    );

  END IF;
END $$;

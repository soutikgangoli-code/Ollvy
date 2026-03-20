-- =============================================================================
-- Migration: Seed Group 6 Service Questionnaires
-- Adds questionnaires for: director-kyc, business-itr, startup-india,
-- esi-registration, pf-registration
-- =============================================================================

-- =============================================================================
-- 1. Director KYC Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'director-kyc' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Director Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'din_number',
      'Director Identification Number (DIN)',
      'text',
      NULL,
      '{"required": true, "pattern": "^[0-9]{8}$"}'::jsonb,
      'e.g., 12345678',
      'Your 8-digit DIN as shown on MCA portal. Enter numbers only.',
      1,
      1
    ),
    (
      service_id,
      'director_name',
      'Director Full Name',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'As per PAN card',
      'Full name exactly as it appears on PAN card and as registered with MCA.',
      1,
      2
    ),
    (
      service_id,
      'director_email',
      'Email Address',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'name@example.com',
      'Email registered with MCA for this DIN. OTP will be sent here.',
      1,
      3
    );

    -- Step 2: Verification Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'director_mobile',
      'Mobile Number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '9876543210',
      'Mobile number linked to Aadhaar for OTP verification during DIR-3 KYC filing.',
      2,
      1
    ),
    (
      service_id,
      'kyc_year',
      'KYC Year',
      'select',
      '[
        {"value": "current", "label": "Current Financial Year"},
        {"value": "previous", "label": "Previous Year (Pending KYC)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select the year for which KYC is being filed. DIR-3 KYC is due by September 30 every year.',
      2,
      2
    ),
    (
      service_id,
      'has_dsc',
      'Do you have a valid DSC?',
      'select',
      '[
        {"value": "yes", "label": "Yes, I have a valid Class 3 DSC"},
        {"value": "no", "label": "No, I need a new DSC"},
        {"value": "expired", "label": "My DSC has expired"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'DIR-3 KYC requires a valid Digital Signature Certificate. If expired or not available, we can help obtain one.',
      2,
      3
    );

  END IF;
END $$;

-- =============================================================================
-- 2. Business ITR Filing Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'business-itr' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Entity Details (4 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'entity_type',
      'What type of entity are you filing ITR for?',
      'select',
      '[
        {"value": "pvt_ltd", "label": "Private Limited Company (ITR-6)"},
        {"value": "opc", "label": "One Person Company (ITR-6)"},
        {"value": "llp", "label": "LLP (ITR-5)"},
        {"value": "partnership", "label": "Partnership Firm (ITR-5)"},
        {"value": "proprietorship", "label": "Sole Proprietorship (ITR-3/4)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'The ITR form depends on your business structure. Companies file ITR-6, LLPs and partnerships file ITR-5.',
      1,
      1
    ),
    (
      service_id,
      'financial_year',
      'Which financial year is this ITR for?',
      'select',
      '[
        {"value": "2025-26", "label": "FY 2025-26 (AY 2026-27)"},
        {"value": "2024-25", "label": "FY 2024-25 (AY 2025-26)"},
        {"value": "2023-24", "label": "FY 2023-24 (AY 2024-25) - Belated"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select the financial year for which you are filing. Belated returns have additional penalties.',
      1,
      2
    ),
    (
      service_id,
      'annual_turnover',
      'What is your approximate annual turnover?',
      'select',
      '[
        {"value": "below_50l", "label": "Below Rs. 50 Lakhs"},
        {"value": "50l_1cr", "label": "Rs. 50 Lakhs - 1 Crore"},
        {"value": "1cr_5cr", "label": "Rs. 1 Crore - 5 Crores"},
        {"value": "5cr_10cr", "label": "Rs. 5 Crores - 10 Crores"},
        {"value": "above_10cr", "label": "Above Rs. 10 Crores"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Turnover determines audit requirements. Above Rs. 1 Cr (for business) or Rs. 50 L (for profession) requires tax audit.',
      1,
      3
    ),
    (
      service_id,
      'books_of_accounts',
      'Do you maintain regular books of accounts?',
      'select',
      '[
        {"value": "yes_audited", "label": "Yes, and they are already audited"},
        {"value": "yes_unaudited", "label": "Yes, but not audited yet"},
        {"value": "partial", "label": "Partial records only"},
        {"value": "no", "label": "No formal books maintained"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Proper books are required for ITR-5 and ITR-6. If not maintained, we may need to reconstruct from bank statements.',
      1,
      4
    );

    -- Step 2: Tax Compliance Status (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'advance_tax_paid',
      'Have you paid advance tax for this year?',
      'select',
      '[
        {"value": "yes_full", "label": "Yes, fully paid as per due dates"},
        {"value": "yes_partial", "label": "Yes, but some installments missed"},
        {"value": "no", "label": "No advance tax paid"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'If tax liability exceeds Rs. 10,000, advance tax is required in quarterly installments. Interest applies for non-payment.',
      2,
      1
    ),
    (
      service_id,
      'tds_deducted',
      'Has TDS been deducted on your receipts?',
      'select',
      '[
        {"value": "yes", "label": "Yes, I have Form 16A/TDS certificates"},
        {"value": "some", "label": "Yes, but I do not have all certificates"},
        {"value": "no", "label": "No TDS was deducted"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'TDS reflected in Form 26AS can be claimed as credit while filing ITR.',
      2,
      2
    ),
    (
      service_id,
      'gst_registered',
      'Is your business GST registered?',
      'select',
      '[
        {"value": "yes", "label": "Yes, we file GST returns"},
        {"value": "no", "label": "No, not required / below threshold"},
        {"value": "cancelled", "label": "GST was cancelled during the year"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'GST data helps in reconciling sales with ITR. Turnover in GST should match ITR.',
      2,
      3
    );

    -- Step 3: Business Activity Details (2 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'business_nature',
      'Nature of Business',
      'select',
      '[
        {"value": "trading", "label": "Trading / Retail / Wholesale"},
        {"value": "manufacturing", "label": "Manufacturing"},
        {"value": "services", "label": "Services / Consulting"},
        {"value": "it_software", "label": "IT / Software Services"},
        {"value": "professional", "label": "Professional Services (CA/CS/Lawyer)"},
        {"value": "contractor", "label": "Contractor / Construction"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'This helps us select the correct business code and verify expense ratios.',
      3,
      1
    ),
    (
      service_id,
      'foreign_transactions',
      'Any foreign transactions during the year?',
      'select',
      '[
        {"value": "yes_export", "label": "Yes - Export of goods/services"},
        {"value": "yes_import", "label": "Yes - Import of goods/services"},
        {"value": "yes_both", "label": "Yes - Both import and export"},
        {"value": "no", "label": "No foreign transactions"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Foreign transactions require additional schedules in ITR and may have transfer pricing implications.',
      3,
      2
    );

  END IF;
END $$;

-- =============================================================================
-- 3. Startup India Registration Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'startup-india' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Entity Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'entity_type',
      'What is your entity type?',
      'select',
      '[
        {"value": "pvt_ltd", "label": "Private Limited Company"},
        {"value": "llp", "label": "Limited Liability Partnership (LLP)"},
        {"value": "partnership", "label": "Partnership Firm"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Only Private Limited, LLP, or Partnership Firms registered in India are eligible for Startup India recognition.',
      1,
      1
    ),
    (
      service_id,
      'incorporation_date',
      'When was your entity incorporated/registered?',
      'date',
      NULL,
      '{"required": true}'::jsonb,
      'DD/MM/YYYY',
      'Entity must be less than 10 years old from date of incorporation to be eligible.',
      1,
      2
    ),
    (
      service_id,
      'annual_turnover',
      'What is your annual turnover?',
      'select',
      '[
        {"value": "below_25cr", "label": "Below Rs. 25 Crores"},
        {"value": "25cr_50cr", "label": "Rs. 25 - 50 Crores"},
        {"value": "50cr_100cr", "label": "Rs. 50 - 100 Crores"},
        {"value": "above_100cr", "label": "Above Rs. 100 Crores (Not Eligible)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Annual turnover should not exceed Rs. 100 Crores in any financial year to remain eligible.',
      1,
      3
    );

    -- Step 2: Innovation Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'innovation_type',
      'What makes your startup innovative?',
      'select',
      '[
        {"value": "new_product", "label": "Developing a new product"},
        {"value": "new_service", "label": "Developing a new service"},
        {"value": "new_process", "label": "Developing a new process"},
        {"value": "improvement", "label": "Significant improvement to existing product/service"},
        {"value": "tech_enabled", "label": "Technology-enabled business model"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'DPIIT recognizes startups working on innovation, improvement of products/services, or scalable business models.',
      2,
      1
    ),
    (
      service_id,
      'innovation_description',
      'Describe your innovation in detail',
      'textarea',
      NULL,
      '{"required": true, "minLength": 100, "maxLength": 2000}'::jsonb,
      'Explain what problem you are solving and how your approach is innovative or different from existing solutions...',
      'This will be used in the DPIIT application. Be specific about the innovation, scalability potential, and employment generation.',
      2,
      2
    ),
    (
      service_id,
      'scalability_potential',
      'Does your business have scalability potential?',
      'select',
      '[
        {"value": "high", "label": "High - Can scale nationally/globally"},
        {"value": "medium", "label": "Medium - Can scale regionally"},
        {"value": "low", "label": "Low - Local market focus"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Startups should be working towards innovation, development, or improvement of products/processes with high growth potential.',
      2,
      3
    );

    -- Step 3: Current Status (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'funding_status',
      'Have you received any external funding?',
      'select',
      '[
        {"value": "no", "label": "No external funding yet"},
        {"value": "angel", "label": "Angel investment"},
        {"value": "seed", "label": "Seed funding"},
        {"value": "series_a_plus", "label": "Series A or above"},
        {"value": "govt_grant", "label": "Government grant"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Funding status helps in understanding stage and documentation available.',
      3,
      1
    ),
    (
      service_id,
      'employee_count',
      'Current number of employees',
      'select',
      '[
        {"value": "1_5", "label": "1 - 5"},
        {"value": "6_20", "label": "6 - 20"},
        {"value": "21_50", "label": "21 - 50"},
        {"value": "above_50", "label": "Above 50"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Employment generation is a factor considered for Startup India recognition.',
      3,
      2
    ),
    (
      service_id,
      'has_pitch_deck',
      'Do you have a pitch deck or business plan?',
      'select',
      '[
        {"value": "yes", "label": "Yes, ready to share"},
        {"value": "draft", "label": "Have a draft version"},
        {"value": "no", "label": "No, need help creating one"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'A pitch deck or brief about your startup is required for the DPIIT application.',
      3,
      3
    );

  END IF;
END $$;

-- =============================================================================
-- 4. ESI Registration Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'esi-registration' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Establishment Details (4 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'entity_type',
      'What type of entity is this?',
      'select',
      '[
        {"value": "pvt_ltd", "label": "Private Limited Company"},
        {"value": "opc", "label": "One Person Company"},
        {"value": "llp", "label": "LLP"},
        {"value": "partnership", "label": "Partnership Firm"},
        {"value": "proprietorship", "label": "Sole Proprietorship"},
        {"value": "trust", "label": "Trust / Society / NGO"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'ESI registration is mandatory for establishments with 10 or more employees (in some states, 20 employees).',
      1,
      1
    ),
    (
      service_id,
      'establishment_name',
      'Establishment Name',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 200}'::jsonb,
      'As registered with ROC / Registrar',
      'Legal name of the establishment as per registration certificate.',
      1,
      2
    ),
    (
      service_id,
      'date_of_registration',
      'Date of Entity Registration/Incorporation',
      'date',
      NULL,
      '{"required": true}'::jsonb,
      'DD/MM/YYYY',
      'Date when the entity was registered with ROC or Registrar.',
      1,
      3
    ),
    (
      service_id,
      'nature_of_business',
      'Nature of Business Activity',
      'select',
      '[
        {"value": "manufacturing", "label": "Manufacturing"},
        {"value": "trading", "label": "Trading / Retail"},
        {"value": "services", "label": "Services"},
        {"value": "it_software", "label": "IT / Software"},
        {"value": "construction", "label": "Construction"},
        {"value": "hospitality", "label": "Hotel / Restaurant"},
        {"value": "healthcare", "label": "Healthcare / Hospital"},
        {"value": "education", "label": "Education"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'This determines the ESI code classification for your establishment.',
      1,
      4
    );

    -- Step 2: Employee Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'total_employees',
      'Total number of employees',
      'select',
      '[
        {"value": "10_20", "label": "10 - 20"},
        {"value": "21_50", "label": "21 - 50"},
        {"value": "51_100", "label": "51 - 100"},
        {"value": "above_100", "label": "Above 100"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'ESI is mandatory when employee count reaches 10 (or 20 in some states).',
      2,
      1
    ),
    (
      service_id,
      'employees_below_21k',
      'How many employees earn below Rs. 21,000/month?',
      'select',
      '[
        {"value": "all", "label": "All employees"},
        {"value": "most", "label": "Most employees (75%+)"},
        {"value": "some", "label": "Some employees (25-75%)"},
        {"value": "few", "label": "Few employees (<25%)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Only employees with monthly wages up to Rs. 21,000 are covered under ESI scheme.',
      2,
      2
    ),
    (
      service_id,
      'date_of_threshold',
      'When did you reach the employee threshold?',
      'date',
      NULL,
      '{"required": true}'::jsonb,
      'DD/MM/YYYY',
      'Date when establishment first reached 10 (or 20) employees. Registration should be done within 15 days.',
      2,
      3
    );

    -- Step 3: Establishment Address (2 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'establishment_address',
      'Establishment Address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20, "maxLength": 500}'::jsonb,
      'Building name, street, area, city...',
      'Full address of the establishment where employees work.',
      3,
      1
    ),
    (
      service_id,
      'state',
      'State',
      'select',
      '[
        {"value": "MH", "label": "Maharashtra"},
        {"value": "DL", "label": "Delhi"},
        {"value": "KA", "label": "Karnataka"},
        {"value": "TN", "label": "Tamil Nadu"},
        {"value": "GJ", "label": "Gujarat"},
        {"value": "UP", "label": "Uttar Pradesh"},
        {"value": "WB", "label": "West Bengal"},
        {"value": "TG", "label": "Telangana"},
        {"value": "RJ", "label": "Rajasthan"},
        {"value": "MP", "label": "Madhya Pradesh"},
        {"value": "HR", "label": "Haryana"},
        {"value": "PB", "label": "Punjab"},
        {"value": "KL", "label": "Kerala"},
        {"value": "OTHER", "label": "Other State"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'State where the establishment is located. ESI rates and dispensary allocation depend on state.',
      3,
      2
    );

  END IF;
END $$;

-- =============================================================================
-- 5. PF Registration Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'pf-registration' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Establishment Details (4 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'entity_type',
      'What type of entity is this?',
      'select',
      '[
        {"value": "pvt_ltd", "label": "Private Limited Company"},
        {"value": "opc", "label": "One Person Company"},
        {"value": "llp", "label": "LLP"},
        {"value": "partnership", "label": "Partnership Firm"},
        {"value": "proprietorship", "label": "Sole Proprietorship"},
        {"value": "trust", "label": "Trust / Society / NGO"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'PF registration is mandatory for establishments with 20 or more employees.',
      1,
      1
    ),
    (
      service_id,
      'establishment_name',
      'Establishment Name',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 200}'::jsonb,
      'As registered with ROC / Registrar',
      'Legal name of the establishment as per registration certificate.',
      1,
      2
    ),
    (
      service_id,
      'date_of_registration',
      'Date of Entity Registration/Incorporation',
      'date',
      NULL,
      '{"required": true}'::jsonb,
      'DD/MM/YYYY',
      'Date when the entity was registered with ROC or Registrar.',
      1,
      3
    ),
    (
      service_id,
      'nature_of_business',
      'Nature of Business Activity',
      'select',
      '[
        {"value": "manufacturing", "label": "Manufacturing"},
        {"value": "trading", "label": "Trading / Retail"},
        {"value": "services", "label": "Services"},
        {"value": "it_software", "label": "IT / Software"},
        {"value": "construction", "label": "Construction"},
        {"value": "hospitality", "label": "Hotel / Restaurant"},
        {"value": "healthcare", "label": "Healthcare / Hospital"},
        {"value": "education", "label": "Education"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'This determines the EPF industry classification for your establishment.',
      1,
      4
    );

    -- Step 2: Employee Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'total_employees',
      'Total number of employees',
      'select',
      '[
        {"value": "20_50", "label": "20 - 50"},
        {"value": "51_100", "label": "51 - 100"},
        {"value": "101_500", "label": "101 - 500"},
        {"value": "above_500", "label": "Above 500"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'PF is mandatory when employee count reaches 20.',
      2,
      1
    ),
    (
      service_id,
      'employees_below_15k',
      'How many employees earn below Rs. 15,000/month?',
      'select',
      '[
        {"value": "all", "label": "All employees"},
        {"value": "most", "label": "Most employees (75%+)"},
        {"value": "some", "label": "Some employees (25-75%)"},
        {"value": "few", "label": "Few employees (<25%)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'PF contribution is mandatory for employees earning up to Rs. 15,000/month. Higher earners can opt in.',
      2,
      2
    ),
    (
      service_id,
      'date_of_threshold',
      'When did you reach 20 employees?',
      'date',
      NULL,
      '{"required": true}'::jsonb,
      'DD/MM/YYYY',
      'Date when establishment first reached 20 employees. Registration should be done within one month.',
      2,
      3
    );

    -- Step 3: Authorized Signatory Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'signatory_name',
      'Authorized Signatory Name',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'Full name as per PAN card',
      'Person authorized to sign PF documents and operate the EPFO portal.',
      3,
      1
    ),
    (
      service_id,
      'signatory_designation',
      'Signatory Designation',
      'select',
      '[
        {"value": "director", "label": "Director"},
        {"value": "partner", "label": "Partner"},
        {"value": "proprietor", "label": "Proprietor"},
        {"value": "manager", "label": "Manager / HR Head"},
        {"value": "authorized_person", "label": "Authorized Person"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'The signatory must have authority to operate on behalf of the establishment.',
      3,
      2
    ),
    (
      service_id,
      'has_dsc',
      'Does the signatory have a valid DSC?',
      'select',
      '[
        {"value": "yes", "label": "Yes, valid Class 3 DSC available"},
        {"value": "no", "label": "No, need to obtain DSC"},
        {"value": "expired", "label": "DSC has expired"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'A Class 3 DSC is required for EPFO registration and ongoing compliance.',
      3,
      3
    );

  END IF;
END $$;

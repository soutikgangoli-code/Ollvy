-- =============================================================================
-- Migration: Seed Questionnaires for Company Incorporation Services
-- Adds questionnaires for pvt-ltd-incorporation, llp-incorporation, opc-incorporation
-- =============================================================================

-- =============================================================================
-- 1. Private Limited Company Incorporation Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'pvt-ltd-incorporation' LIMIT 1;

  IF service_id IS NOT NULL THEN
    -- Delete existing questions for this service (for re-run safety)
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Company Details (4 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'number_of_directors',
      'How many directors will the company have?',
      'select',
      '[
        {"value": "2", "label": "2 Directors"},
        {"value": "3", "label": "3 Directors"},
        {"value": "4", "label": "4 Directors"},
        {"value": "5", "label": "5 Directors"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Minimum 2 directors required for a Private Limited Company. More directors means more document requirements.',
      1,
      1
    ),
    (
      service_id,
      'company_name_preference_1',
      'Company Name Preference 1',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'e.g., Acme Solutions Private Limited',
      'Your first choice for company name. Must end with "Private Limited".',
      1,
      2
    ),
    (
      service_id,
      'company_name_preference_2',
      'Company Name Preference 2',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'e.g., Acme Technologies Private Limited',
      'Backup name in case first choice is unavailable. Must end with "Private Limited".',
      1,
      3
    ),
    (
      service_id,
      'authorized_capital',
      'What authorized capital do you want?',
      'select',
      '[
        {"value": "100000", "label": "Rs. 1 Lakh (Minimum)"},
        {"value": "500000", "label": "Rs. 5 Lakhs"},
        {"value": "1000000", "label": "Rs. 10 Lakhs"},
        {"value": "2500000", "label": "Rs. 25 Lakhs"},
        {"value": "5000000", "label": "Rs. 50 Lakhs"},
        {"value": "10000000", "label": "Rs. 1 Crore"},
        {"value": "other", "label": "Other (specify later)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Authorized capital is the maximum capital the company can issue. Government fees depend on this amount.',
      1,
      4
    );

    -- Step 2: Director 1 Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'director_1_name',
      'Director 1 Full Name',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'As per PAN card',
      'Full name exactly as it appears on PAN card. This person will be the first director.',
      2,
      1
    ),
    (
      service_id,
      'director_1_email',
      'Director 1 Email Address',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'name@example.com',
      'Personal email address for DSC and DIN registration. MCA notifications will be sent here.',
      2,
      2
    ),
    (
      service_id,
      'director_1_mobile',
      'Director 1 Mobile Number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '9876543210',
      'Mobile number linked to Aadhaar for OTP verification during DSC and DIN processes.',
      2,
      3
    );

    -- Step 3: Director 2 Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'director_2_name',
      'Director 2 Full Name',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'As per PAN card',
      'Full name exactly as it appears on PAN card. This person will be the second director.',
      3,
      1
    ),
    (
      service_id,
      'director_2_email',
      'Director 2 Email Address',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'name@example.com',
      'Personal email address for DSC and DIN registration.',
      3,
      2
    ),
    (
      service_id,
      'director_2_mobile',
      'Director 2 Mobile Number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '9876543210',
      'Mobile number linked to Aadhaar for OTP verification.',
      3,
      3
    );

    -- Step 4: Registered Office Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'registered_office_address',
      'Registered Office Address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20, "maxLength": 500}'::jsonb,
      'Building name, street, area, city...',
      'Complete address where the company will be registered. Utility bill of this address will be required.',
      4,
      1
    ),
    (
      service_id,
      'state',
      'State',
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
      '{"required": true}'::jsonb,
      NULL,
      'State where the company will be registered. ROC jurisdiction depends on this.',
      4,
      2
    ),
    (
      service_id,
      'pincode',
      'PIN Code',
      'text',
      NULL,
      '{"required": true, "pattern": "^[1-9][0-9]{5}$"}'::jsonb,
      '110001',
      'Enter 6-digit PIN code of registered office.',
      4,
      3
    );

    -- Step 5: Business Activity (2 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'business_activity',
      'Describe your main business activity',
      'textarea',
      NULL,
      '{"required": true, "minLength": 50, "maxLength": 1000}'::jsonb,
      'e.g., We will provide software development services to clients in India and abroad, including web development, mobile app development, and IT consulting...',
      'This will be used to draft the Main Objects clause in the Memorandum of Association (MOA). Be specific about what the company will do.',
      5,
      1
    ),
    (
      service_id,
      'business_category',
      'Primary Business Category',
      'select',
      '[
        {"value": "it_software", "label": "IT / Software Services"},
        {"value": "consulting", "label": "Consulting / Professional Services"},
        {"value": "trading", "label": "Trading / E-commerce"},
        {"value": "manufacturing", "label": "Manufacturing"},
        {"value": "fintech", "label": "Fintech / Financial Services"},
        {"value": "healthcare", "label": "Healthcare / Pharma"},
        {"value": "education", "label": "Education / EdTech"},
        {"value": "real_estate", "label": "Real Estate / Construction"},
        {"value": "food_hospitality", "label": "Food / Hospitality"},
        {"value": "media_entertainment", "label": "Media / Entertainment"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'This helps us select the correct NIC code for your company.',
      5,
      2
    );

  END IF;
END $$;

-- =============================================================================
-- 2. LLP Incorporation Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'llp-incorporation' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: LLP Details (4 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'number_of_partners',
      'How many partners will the LLP have?',
      'select',
      '[
        {"value": "2", "label": "2 Partners (Minimum)"},
        {"value": "3", "label": "3 Partners"},
        {"value": "4", "label": "4 Partners"},
        {"value": "5", "label": "5 Partners"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Minimum 2 designated partners required for an LLP. At least 2 must be individuals.',
      1,
      1
    ),
    (
      service_id,
      'llp_name_preference_1',
      'LLP Name Preference 1',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'e.g., Acme Consultants LLP',
      'Your first choice for LLP name. Must end with "LLP" or "Limited Liability Partnership".',
      1,
      2
    ),
    (
      service_id,
      'llp_name_preference_2',
      'LLP Name Preference 2',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'e.g., Acme Partners LLP',
      'Backup name in case first choice is unavailable.',
      1,
      3
    ),
    (
      service_id,
      'total_contribution',
      'Total Capital Contribution',
      'select',
      '[
        {"value": "10000", "label": "Rs. 10,000"},
        {"value": "50000", "label": "Rs. 50,000"},
        {"value": "100000", "label": "Rs. 1 Lakh"},
        {"value": "500000", "label": "Rs. 5 Lakhs"},
        {"value": "1000000", "label": "Rs. 10 Lakhs"},
        {"value": "other", "label": "Other (specify later)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Total capital contribution by all partners. There is no minimum requirement for LLP.',
      1,
      4
    );

    -- Step 2: Partner 1 Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'partner_1_name',
      'Designated Partner 1 Full Name',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'As per PAN card',
      'Full name exactly as it appears on PAN card. This person will be a designated partner.',
      2,
      1
    ),
    (
      service_id,
      'partner_1_email',
      'Partner 1 Email Address',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'name@example.com',
      'Personal email address for DSC and DPIN registration. MCA notifications will be sent here.',
      2,
      2
    ),
    (
      service_id,
      'partner_1_mobile',
      'Partner 1 Mobile Number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '9876543210',
      'Mobile number linked to Aadhaar for OTP verification.',
      2,
      3
    );

    -- Step 3: Partner 2 Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'partner_2_name',
      'Designated Partner 2 Full Name',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'As per PAN card',
      'Full name exactly as it appears on PAN card. This person will be a designated partner.',
      3,
      1
    ),
    (
      service_id,
      'partner_2_email',
      'Partner 2 Email Address',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'name@example.com',
      'Personal email address for DSC and DPIN registration.',
      3,
      2
    ),
    (
      service_id,
      'partner_2_mobile',
      'Partner 2 Mobile Number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '9876543210',
      'Mobile number linked to Aadhaar for OTP verification.',
      3,
      3
    );

    -- Step 4: Registered Office Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'registered_office_address',
      'Registered Office Address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20, "maxLength": 500}'::jsonb,
      'Building name, street, area, city...',
      'Complete address where the LLP will be registered. Utility bill of this address will be required.',
      4,
      1
    ),
    (
      service_id,
      'state',
      'State',
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
      '{"required": true}'::jsonb,
      NULL,
      'State where the LLP will be registered. ROC jurisdiction depends on this.',
      4,
      2
    ),
    (
      service_id,
      'pincode',
      'PIN Code',
      'text',
      NULL,
      '{"required": true, "pattern": "^[1-9][0-9]{5}$"}'::jsonb,
      '110001',
      'Enter 6-digit PIN code of registered office.',
      4,
      3
    );

    -- Step 5: Business Activity (2 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'business_activity',
      'Describe your main business activity',
      'textarea',
      NULL,
      '{"required": true, "minLength": 50, "maxLength": 1000}'::jsonb,
      'e.g., We will provide consulting services in the areas of management, finance, and strategy to clients across India...',
      'This will be used to draft the LLP Agreement. Be specific about what the LLP will do.',
      5,
      1
    ),
    (
      service_id,
      'business_category',
      'Primary Business Category',
      'select',
      '[
        {"value": "it_software", "label": "IT / Software Services"},
        {"value": "consulting", "label": "Consulting / Professional Services"},
        {"value": "trading", "label": "Trading / E-commerce"},
        {"value": "manufacturing", "label": "Manufacturing"},
        {"value": "fintech", "label": "Fintech / Financial Services"},
        {"value": "healthcare", "label": "Healthcare / Pharma"},
        {"value": "education", "label": "Education / EdTech"},
        {"value": "real_estate", "label": "Real Estate / Construction"},
        {"value": "food_hospitality", "label": "Food / Hospitality"},
        {"value": "media_entertainment", "label": "Media / Entertainment"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'This helps us select the correct NIC code for your LLP.',
      5,
      2
    );

  END IF;
END $$;

-- =============================================================================
-- 3. One Person Company (OPC) Incorporation Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'opc-incorporation' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Company Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'company_name_preference_1',
      'Company Name Preference 1',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'e.g., Acme Solutions (OPC) Private Limited',
      'Your first choice for company name. Must include "(OPC) Private Limited" as suffix.',
      1,
      1
    ),
    (
      service_id,
      'company_name_preference_2',
      'Company Name Preference 2',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'e.g., Acme Technologies (OPC) Private Limited',
      'Backup name in case first choice is unavailable.',
      1,
      2
    ),
    (
      service_id,
      'authorized_capital',
      'What authorized capital do you want?',
      'select',
      '[
        {"value": "100000", "label": "Rs. 1 Lakh (Minimum)"},
        {"value": "500000", "label": "Rs. 5 Lakhs"},
        {"value": "1000000", "label": "Rs. 10 Lakhs"},
        {"value": "2500000", "label": "Rs. 25 Lakhs"},
        {"value": "5000000", "label": "Rs. 50 Lakhs"},
        {"value": "other", "label": "Other (specify later)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Authorized capital is the maximum capital the company can issue. For OPC, keep it practical - you can increase later.',
      1,
      3
    );

    -- Step 2: Director (Sole Member) Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'director_name',
      'Director (Sole Member) Full Name',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'As per PAN card',
      'Full name exactly as it appears on PAN card. You will be the sole director and member.',
      2,
      1
    ),
    (
      service_id,
      'director_email',
      'Director Email Address',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'name@example.com',
      'Personal email address for DSC and DIN registration. MCA notifications will be sent here.',
      2,
      2
    ),
    (
      service_id,
      'director_mobile',
      'Director Mobile Number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '9876543210',
      'Mobile number linked to Aadhaar for OTP verification during DSC and DIN processes.',
      2,
      3
    );

    -- Step 3: Nominee Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'nominee_name',
      'Nominee Full Name',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'As per PAN card',
      'This person will become the member/director if you are unable to act (death/incapacity). Must be an Indian resident.',
      3,
      1
    ),
    (
      service_id,
      'nominee_relationship',
      'Relationship with Nominee',
      'select',
      '[
        {"value": "spouse", "label": "Spouse"},
        {"value": "parent", "label": "Parent"},
        {"value": "child", "label": "Son / Daughter"},
        {"value": "sibling", "label": "Brother / Sister"},
        {"value": "relative", "label": "Other Relative"},
        {"value": "friend", "label": "Friend / Associate"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Your relationship with the nominee. Nominee must consent to act in this role.',
      3,
      2
    ),
    (
      service_id,
      'nominee_email',
      'Nominee Email Address',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'name@example.com',
      'Nominee email for INC-3 consent communication.',
      3,
      3
    );

    -- Step 4: Registered Office Details (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'registered_office_address',
      'Registered Office Address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20, "maxLength": 500}'::jsonb,
      'Building name, street, area, city...',
      'Complete address where the company will be registered. Can be your residential address.',
      4,
      1
    ),
    (
      service_id,
      'state',
      'State',
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
      '{"required": true}'::jsonb,
      NULL,
      'State where the company will be registered.',
      4,
      2
    ),
    (
      service_id,
      'pincode',
      'PIN Code',
      'text',
      NULL,
      '{"required": true, "pattern": "^[1-9][0-9]{5}$"}'::jsonb,
      '110001',
      'Enter 6-digit PIN code of registered office.',
      4,
      3
    );

    -- Step 5: Business Activity (2 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'business_activity',
      'Describe your main business activity',
      'textarea',
      NULL,
      '{"required": true, "minLength": 50, "maxLength": 1000}'::jsonb,
      'e.g., I will provide freelance software development services, including web development, mobile apps, and technical consulting...',
      'This will be used to draft the Main Objects clause in the MOA. Be specific about what the company will do.',
      5,
      1
    ),
    (
      service_id,
      'business_category',
      'Primary Business Category',
      'select',
      '[
        {"value": "it_software", "label": "IT / Software Services"},
        {"value": "consulting", "label": "Consulting / Professional Services"},
        {"value": "trading", "label": "Trading / E-commerce"},
        {"value": "manufacturing", "label": "Manufacturing"},
        {"value": "fintech", "label": "Fintech / Financial Services"},
        {"value": "healthcare", "label": "Healthcare / Pharma"},
        {"value": "education", "label": "Education / EdTech"},
        {"value": "real_estate", "label": "Real Estate / Construction"},
        {"value": "food_hospitality", "label": "Food / Hospitality"},
        {"value": "media_entertainment", "label": "Media / Entertainment"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'This helps us select the correct NIC code for your company.',
      5,
      2
    );

  END IF;
END $$;

-- =============================================================================
-- Migration: Seed Questionnaires for Registration Services
-- Adds questionnaires for: gst-registration, msme-registration, iec-code,
-- professional-tax, shop-establishment
-- NOTE: esi-registration, pf-registration, startup-india removed - no reference spec
-- =============================================================================

-- =============================================================================
-- 1. GST Registration Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'gst-registration' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Business Entity (8 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'entity_type',
      'What type of business entity are you registering?',
      'select',
      '[
        {"value": "sole_proprietorship", "label": "Sole Proprietorship"},
        {"value": "partnership", "label": "Partnership Firm"},
        {"value": "pvt_ltd", "label": "Private Limited Company"},
        {"value": "opc", "label": "One Person Company"},
        {"value": "llp", "label": "LLP"},
        {"value": "huf", "label": "Hindu Undivided Family (HUF)"},
        {"value": "trust", "label": "Trust / Society / Club"},
        {"value": "government", "label": "Government Entity"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select the legal structure of your business.',
      1,
      1
    ),
    (
      service_id,
      'legal_name',
      'What is the legal name of the business?',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 200}'::jsonb,
      'As per PAN card',
      'Must match PAN card exactly.',
      1,
      2
    ),
    (
      service_id,
      'has_trade_name',
      'Do you have a trade name different from the legal name?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Trade name is the name under which you conduct business (e.g., brand name).',
      1,
      3
    ),
    (
      service_id,
      'trade_name',
      'Trade name (if different)',
      'text',
      NULL,
      '{"required": false, "minLength": 2, "maxLength": 200}'::jsonb,
      'e.g., Sharma Electronics',
      'Enter your trade name if different from legal name.',
      1,
      4
    ),
    (
      service_id,
      'pan_number',
      'PAN of the business / proprietor',
      'text',
      NULL,
      '{"required": true, "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"}'::jsonb,
      'e.g., ABCDE1234F',
      'For proprietorship, use personal PAN. For company/LLP, use business PAN.',
      1,
      5
    ),
    (
      service_id,
      'turnover_threshold',
      'Is your annual turnover likely to exceed Rs. 40 lakhs (goods) or Rs. 20 lakhs (services)?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"},
        {"value": "not_sure", "label": "Not Sure"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'GST registration is mandatory above these thresholds.',
      1,
      6
    ),
    (
      service_id,
      'voluntary_registration',
      'Are you registering voluntarily (below threshold)?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Voluntary registration allows you to collect GST and claim input tax credit.',
      1,
      7
    ),
    (
      service_id,
      'interstate_supply',
      'Is this registration required for inter-state supply?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'GST registration is mandatory for inter-state supply regardless of turnover.',
      1,
      8
    );

    -- Step 2: Business Address (8 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
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
      'State where your principal place of business is located.',
      2,
      1
    ),
    (
      service_id,
      'district',
      'District',
      'text',
      NULL,
      '{"required": true, "minLength": 2, "maxLength": 100}'::jsonb,
      'e.g., North Delhi',
      'District of your business address.',
      2,
      2
    ),
    (
      service_id,
      'pincode',
      'Pincode',
      'text',
      NULL,
      '{"required": true, "pattern": "^[1-9][0-9]{5}$"}'::jsonb,
      'e.g., 110001',
      'Enter 6-digit PIN code.',
      2,
      3
    ),
    (
      service_id,
      'address_line',
      'Full address (Building / Street / Area)',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20, "maxLength": 500}'::jsonb,
      'Flat No., Building Name, Street, Area',
      'Complete address of your principal place of business.',
      2,
      4
    ),
    (
      service_id,
      'premises_type',
      'Nature of premises',
      'select',
      '[
        {"value": "own", "label": "Own"},
        {"value": "rented", "label": "Rented"},
        {"value": "leased", "label": "Leased"},
        {"value": "consent", "label": "Shared / Consent"},
        {"value": "sez", "label": "SEZ"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select the ownership status of your business premises.',
      2,
      5
    ),
    (
      service_id,
      'has_additional_premises',
      'Do you have any additional places of business in India?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Additional premises like branches, warehouses, godowns.',
      2,
      6
    ),
    (
      service_id,
      'add_premises_state',
      'Additional place of business - State',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'Select state',
      'State of your additional place of business.',
      2,
      7
    ),
    (
      service_id,
      'add_premises_address',
      'Additional place of business - Address',
      'textarea',
      NULL,
      '{"required": false, "minLength": 20, "maxLength": 500}'::jsonb,
      'Full address',
      'Complete address of additional place of business.',
      2,
      8
    );

    -- Step 3: Business Activity (6 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'nature_of_business',
      'Nature of business (select all that apply)',
      'multiselect',
      '[
        {"value": "manufacturer", "label": "Manufacturer"},
        {"value": "trader", "label": "Trader / Reseller"},
        {"value": "service_provider", "label": "Service Provider"},
        {"value": "works_contractor", "label": "Works Contractor"},
        {"value": "ecommerce_operator", "label": "E-Commerce Operator"},
        {"value": "ecommerce_seller", "label": "E-Commerce Seller"},
        {"value": "importer", "label": "Importer"},
        {"value": "exporter", "label": "Exporter"},
        {"value": "leasing", "label": "Leasing / Rental"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select all applicable business activities.',
      3,
      1
    ),
    (
      service_id,
      'business_description',
      'Describe your main business activity in detail',
      'textarea',
      NULL,
      '{"required": true, "minLength": 50, "maxLength": 1000}'::jsonb,
      'e.g., Retail sale of readymade garments',
      'Detailed description helps in HSN/SAC code selection.',
      3,
      2
    ),
    (
      service_id,
      'primary_goods_services',
      'Primary goods/services you deal in',
      'text',
      NULL,
      '{"required": true, "minLength": 5, "maxLength": 500}'::jsonb,
      'e.g., Mens clothing, accounting software',
      'List the main products or services you provide.',
      3,
      3
    ),
    (
      service_id,
      'knows_hsn',
      'Do you know your HSN/SAC code?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'HSN code for goods, SAC code for services.',
      3,
      4
    ),
    (
      service_id,
      'hsn_sac_code',
      'HSN / SAC Code (if known)',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'e.g., 6203, 998311',
      'Enter your HSN/SAC code if you know it.',
      3,
      5
    ),
    (
      service_id,
      'expected_turnover',
      'Expected annual turnover (approx.)',
      'select',
      '[
        {"value": "below_20l", "label": "Below Rs. 20 lakhs"},
        {"value": "20l_40l", "label": "Rs. 20L - Rs. 40L"},
        {"value": "40l_1.5cr", "label": "Rs. 40L - Rs. 1.5Cr"},
        {"value": "1.5cr_5cr", "label": "Rs. 1.5Cr - Rs. 5Cr"},
        {"value": "above_5cr", "label": "Above Rs. 5Cr"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Estimated annual turnover helps determine filing frequency.',
      3,
      6
    );

    -- Step 4: Authorized Signatory (6 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'signatory_name',
      'Name of authorized signatory',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'Full name as per PAN',
      'Person who will sign the GST application.',
      4,
      1
    ),
    (
      service_id,
      'signatory_designation',
      'Designation / Title',
      'text',
      NULL,
      '{"required": true, "minLength": 2, "maxLength": 100}'::jsonb,
      'e.g., Proprietor, Director, Partner',
      'Your role in the business.',
      4,
      2
    ),
    (
      service_id,
      'signatory_pan',
      'PAN of authorized signatory',
      'text',
      NULL,
      '{"required": true, "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"}'::jsonb,
      'e.g., ABCDE1234F',
      'For Sole Proprietorship, this must match business PAN.',
      4,
      3
    ),
    (
      service_id,
      'signatory_aadhaar',
      'Aadhaar number of authorized signatory',
      'text',
      NULL,
      '{"required": true, "pattern": "^[0-9]{12}$"}'::jsonb,
      '12-digit Aadhaar number',
      'Required for Aadhaar-based e-KYC on GST portal.',
      4,
      4
    ),
    (
      service_id,
      'signatory_mobile',
      'Mobile number of authorized signatory',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      'Linked to Aadhaar',
      'Must be linked to Aadhaar for OTP verification.',
      4,
      5
    ),
    (
      service_id,
      'signatory_email',
      'Email of authorized signatory',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'name@example.com',
      'GST portal communications will be sent here.',
      4,
      6
    );

    -- Step 5: Bank Account Details (5 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'bank_account_name',
      'Account holder name',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'As per bank records',
      'Name as it appears in bank records.',
      5,
      1
    ),
    (
      service_id,
      'bank_name',
      'Bank name',
      'text',
      NULL,
      '{"required": true, "minLength": 2, "maxLength": 100}'::jsonb,
      'e.g., HDFC Bank',
      'Name of your bank.',
      5,
      2
    ),
    (
      service_id,
      'bank_account_number',
      'Account number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[0-9]{9,18}$"}'::jsonb,
      '9-18 digits',
      'Your bank account number.',
      5,
      3
    ),
    (
      service_id,
      'ifsc_code',
      'IFSC code',
      'text',
      NULL,
      '{"required": true, "pattern": "^[A-Z]{4}0[A-Z0-9]{6}$"}'::jsonb,
      'e.g., HDFC0001234',
      '11-character alphanumeric IFSC code.',
      5,
      4
    ),
    (
      service_id,
      'bank_account_type',
      'Account type',
      'select',
      '[
        {"value": "current", "label": "Current"},
        {"value": "savings", "label": "Savings"},
        {"value": "cash_credit", "label": "Cash Credit"},
        {"value": "overdraft", "label": "Overdraft"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Type of bank account.',
      5,
      5
    );

  END IF;
END $$;

-- =============================================================================
-- 2. MSME / Udyam Registration Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'msme-registration' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Entity & Owner Details (9 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'entity_type',
      'Type of enterprise / entity',
      'select',
      '[
        {"value": "proprietorship", "label": "Proprietorship"},
        {"value": "partnership", "label": "Partnership Firm"},
        {"value": "huf", "label": "Hindu Undivided Family"},
        {"value": "company", "label": "Company (Pvt/Public/OPC)"},
        {"value": "cooperative", "label": "Co-operative Society"},
        {"value": "llp", "label": "LLP"},
        {"value": "trust", "label": "Trust"},
        {"value": "society", "label": "Society"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select the legal structure of your enterprise.',
      1,
      1
    ),
    (
      service_id,
      'enterprise_name',
      'Name of enterprise',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 200}'::jsonb,
      'As per registration / PAN',
      'Legal name of your business.',
      1,
      2
    ),
    (
      service_id,
      'owner_name',
      'Name of owner / promoter (Aadhaar holder)',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 100}'::jsonb,
      'Full name as per Aadhaar',
      'Must match Aadhaar exactly for OTP verification.',
      1,
      3
    ),
    (
      service_id,
      'owner_aadhaar',
      'Aadhaar number of owner / promoter',
      'text',
      NULL,
      '{"required": true, "pattern": "^[0-9]{12}$"}'::jsonb,
      '12-digit Aadhaar',
      'Required for e-KYC on Udyam portal.',
      1,
      4
    ),
    (
      service_id,
      'aadhaar_mobile',
      'Mobile number linked to Aadhaar',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      'Aadhaar-linked number',
      'OTP will be sent to this number.',
      1,
      5
    ),
    (
      service_id,
      'entity_pan',
      'PAN of the enterprise',
      'text',
      NULL,
      '{"required": true, "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"}'::jsonb,
      'e.g., ABCDE1234F',
      'PAN of the business entity.',
      1,
      6
    ),
    (
      service_id,
      'owner_gender',
      'Gender of owner',
      'select',
      '[
        {"value": "male", "label": "Male"},
        {"value": "female", "label": "Female"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Gender of the primary owner.',
      1,
      7
    ),
    (
      service_id,
      'owner_category',
      'Social category of owner',
      'select',
      '[
        {"value": "general", "label": "General"},
        {"value": "sc", "label": "SC"},
        {"value": "st", "label": "ST"},
        {"value": "obc", "label": "OBC"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Social category for statistical purposes.',
      1,
      8
    ),
    (
      service_id,
      'is_pwd',
      'Specially abled (PwD)?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Person with Disability status.',
      1,
      9
    );

    -- Step 2: Business Details (10 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'commencement_date',
      'Date of commencement of business',
      'date',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'Date when your business started operations.',
      2,
      1
    ),
    (
      service_id,
      'has_previous_registration',
      'Is the enterprise already registered under any previous MSME / EM-II / UAM scheme?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'If you have an old MSME registration, it needs to be migrated to Udyam.',
      2,
      2
    ),
    (
      service_id,
      'previous_reg_number',
      'Previous registration number (EM-II / UAM)',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'e.g., DL01E0012345',
      'Enter your old registration number if applicable.',
      2,
      3
    ),
    (
      service_id,
      'nic_activity',
      'Primary activity',
      'select',
      '[
        {"value": "manufacturing", "label": "Manufacturing"},
        {"value": "service", "label": "Service"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select your primary business activity.',
      2,
      4
    ),
    (
      service_id,
      'nic_code',
      'Detailed NIC 5-digit code / business activity',
      'text',
      NULL,
      '{"required": true, "minLength": 5}'::jsonb,
      'e.g., 10101 - Rice milling',
      'NIC code describing your business activity.',
      2,
      5
    ),
    (
      service_id,
      'employee_count',
      'Number of persons employed (current)',
      'text',
      NULL,
      '{"required": true, "pattern": "^[0-9]+$"}'::jsonb,
      'e.g., 12',
      'Total number of employees.',
      2,
      6
    ),
    (
      service_id,
      'plant_investment',
      'Investment in plant and machinery / equipment (Rs. lakhs)',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'e.g., 50',
      'Total investment in Rs. lakhs.',
      2,
      7
    ),
    (
      service_id,
      'annual_turnover',
      'Turnover for previous financial year (Rs. lakhs)',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'e.g., 250',
      'Total turnover in Rs. lakhs.',
      2,
      8
    ),
    (
      service_id,
      'has_gst',
      'Does the enterprise have GST registration?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'GST data is auto-fetched from GSTIN.',
      2,
      9
    ),
    (
      service_id,
      'gstin',
      'GSTIN',
      'text',
      NULL,
      '{"required": false, "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"}'::jsonb,
      'e.g., 07ABCDE1234F1Z5',
      '15-character GSTIN if registered.',
      2,
      10
    );

    -- Step 3: Business Address (6 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
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
      'State where your enterprise is located.',
      3,
      1
    ),
    (
      service_id,
      'district',
      'District',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'District of your business.',
      3,
      2
    ),
    (
      service_id,
      'pincode',
      'Pincode',
      'text',
      NULL,
      '{"required": true, "pattern": "^[1-9][0-9]{5}$"}'::jsonb,
      '6-digit PIN',
      'PIN code of your business address.',
      3,
      3
    ),
    (
      service_id,
      'address',
      'Full address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Building, Street, Locality',
      'Complete business address.',
      3,
      4
    ),
    (
      service_id,
      'enterprise_email',
      'Official email of enterprise',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'business@example.com',
      'Official business email address.',
      3,
      5
    ),
    (
      service_id,
      'enterprise_mobile',
      'Official mobile of enterprise',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '10-digit mobile',
      'Official business mobile number.',
      3,
      6
    );

  END IF;
END $$;

-- =============================================================================
-- 3. IEC (Import Export Code) Registration Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'iec-code' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Applicant / Entity Details (6 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'entity_type',
      'Type of entity applying for IEC',
      'select',
      '[
        {"value": "individual", "label": "Individual / Proprietorship"},
        {"value": "partnership", "label": "Partnership Firm"},
        {"value": "llp", "label": "LLP"},
        {"value": "pvt_ltd", "label": "Private Limited Company"},
        {"value": "public_ltd", "label": "Public Limited Company"},
        {"value": "opc", "label": "One Person Company"},
        {"value": "huf", "label": "HUF"},
        {"value": "trust", "label": "Trust / Society"},
        {"value": "government", "label": "Government Undertaking"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select your business entity type.',
      1,
      1
    ),
    (
      service_id,
      'legal_name',
      'Legal name of entity / individual',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 200}'::jsonb,
      'As per PAN',
      'Must match PAN exactly.',
      1,
      2
    ),
    (
      service_id,
      'pan_number',
      'PAN of entity',
      'text',
      NULL,
      '{"required": true, "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"}'::jsonb,
      'e.g., ABCDE1234F',
      'PAN of the entity applying for IEC.',
      1,
      3
    ),
    (
      service_id,
      'incorporation_date',
      'Date of incorporation / commencement',
      'date',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'Date when your business was established.',
      1,
      4
    ),
    (
      service_id,
      'trade_nature',
      'Nature of export / import activity',
      'select',
      '[
        {"value": "merchant_exporter", "label": "Merchant Exporter"},
        {"value": "manufacturer_exporter", "label": "Manufacturer Exporter"},
        {"value": "service_exporter", "label": "Service Exporter"},
        {"value": "trader_importer", "label": "Trader / Importer"},
        {"value": "both", "label": "Both Import and Export"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select your primary trade activity.',
      1,
      5
    ),
    (
      service_id,
      'goods_description',
      'Type of goods / services to be traded',
      'textarea',
      NULL,
      '{"required": true, "minLength": 30}'::jsonb,
      'Describe the main products or services',
      'Detailed description of goods/services you plan to import/export.',
      1,
      6
    );

    -- Step 2: Registered Office Address (7 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
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
      'State of your registered office.',
      2,
      1
    ),
    (
      service_id,
      'district',
      'District',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'District of your registered office.',
      2,
      2
    ),
    (
      service_id,
      'pincode',
      'Pincode',
      'text',
      NULL,
      '{"required": true, "pattern": "^[1-9][0-9]{5}$"}'::jsonb,
      '6-digit PIN',
      'PIN code of registered office.',
      2,
      3
    ),
    (
      service_id,
      'address',
      'Full address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Complete registered office address',
      'Full address of your registered office.',
      2,
      4
    ),
    (
      service_id,
      'office_phone',
      'Office phone number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[0-9]{10,12}$"}'::jsonb,
      '10-digit or STD code',
      'Office contact number.',
      2,
      5
    ),
    (
      service_id,
      'official_email',
      'Official email',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'business@example.com',
      'Official business email.',
      2,
      6
    ),
    (
      service_id,
      'fax_number',
      'Fax number (if any)',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Fax number if available.',
      2,
      7
    );

    -- Step 3: Proprietor / Director / Partner Details (7 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'applicant_name',
      'Name of applicant (Proprietor / MD / Designated Partner)',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'Full name as per PAN',
      'Name of person applying for IEC.',
      3,
      1
    ),
    (
      service_id,
      'applicant_designation',
      'Designation',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'e.g., Proprietor, Managing Director',
      'Your designation in the company.',
      3,
      2
    ),
    (
      service_id,
      'applicant_dob',
      'Date of birth',
      'date',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'Must be 18 years or older.',
      3,
      3
    ),
    (
      service_id,
      'applicant_gender',
      'Gender',
      'select',
      '[
        {"value": "male", "label": "Male"},
        {"value": "female", "label": "Female"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select your gender.',
      3,
      4
    ),
    (
      service_id,
      'applicant_address',
      'Residential address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Complete residential address',
      'Your current residential address.',
      3,
      5
    ),
    (
      service_id,
      'applicant_id_type',
      'Type of ID provided',
      'select',
      '[
        {"value": "aadhaar", "label": "Aadhaar"},
        {"value": "passport", "label": "Passport"},
        {"value": "voter_id", "label": "Voter ID"},
        {"value": "driving_license", "label": "Driving License"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select your ID proof type.',
      3,
      6
    ),
    (
      service_id,
      'applicant_id_number',
      'ID number',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'Any one valid ID',
      'Enter your ID number.',
      3,
      7
    );

    -- Step 4: Bank Account Details (6 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'bank_name',
      'Bank name',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'e.g., ICICI Bank',
      'Name of your bank.',
      4,
      1
    ),
    (
      service_id,
      'branch_name',
      'Branch name',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'e.g., Connaught Place',
      'Branch of your bank.',
      4,
      2
    ),
    (
      service_id,
      'account_number',
      'Account number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[0-9]{9,18}$"}'::jsonb,
      '9-18 digits',
      'Your bank account number.',
      4,
      3
    ),
    (
      service_id,
      'ifsc_code',
      'IFSC code',
      'text',
      NULL,
      '{"required": true, "pattern": "^[A-Z]{4}0[A-Z0-9]{6}$"}'::jsonb,
      'e.g., ICIC0001234',
      '11-character IFSC code.',
      4,
      4
    ),
    (
      service_id,
      'account_type',
      'Account type',
      'select',
      '[
        {"value": "current", "label": "Current"},
        {"value": "savings", "label": "Savings"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Type of bank account.',
      4,
      5
    ),
    (
      service_id,
      'account_holder',
      'Account holder name (as in bank)',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'Must match entity PAN name',
      'Name as it appears in bank records.',
      4,
      6
    );

  END IF;
END $$;

-- =============================================================================
-- 4. Professional Tax Registration Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'professional-tax' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: State & Registration Type (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'state',
      'State',
      'select',
      '[
        {"value": "MH", "label": "Maharashtra"},
        {"value": "KA", "label": "Karnataka"},
        {"value": "WB", "label": "West Bengal"},
        {"value": "TG", "label": "Telangana"},
        {"value": "AP", "label": "Andhra Pradesh"},
        {"value": "TN", "label": "Tamil Nadu"},
        {"value": "GJ", "label": "Gujarat"},
        {"value": "MP", "label": "Madhya Pradesh"},
        {"value": "OD", "label": "Odisha"},
        {"value": "KL", "label": "Kerala"},
        {"value": "AS", "label": "Assam"},
        {"value": "ML", "label": "Meghalaya"},
        {"value": "BR", "label": "Bihar"},
        {"value": "JH", "label": "Jharkhand"},
        {"value": "SK", "label": "Sikkim"},
        {"value": "TR", "label": "Tripura"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Professional Tax is a state-level tax. Select the state where your business operates.',
      1,
      1
    ),
    (
      service_id,
      'registration_type',
      'Type of registration required',
      'multiselect',
      '[
        {"value": "ptec", "label": "PTEC (Professional Tax Enrollment Certificate - for self/entity)"},
        {"value": "ptrc", "label": "PTRC (Professional Tax Registration Certificate - for employer deducting from employees)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'PTEC for your own PT liability. PTRC if you have employees.',
      1,
      2
    ),
    (
      service_id,
      'entity_type',
      'Type of entity',
      'select',
      '[
        {"value": "sole_proprietorship", "label": "Sole Proprietorship"},
        {"value": "partnership", "label": "Partnership Firm"},
        {"value": "pvt_ltd", "label": "Private Limited Company"},
        {"value": "llp", "label": "LLP"},
        {"value": "opc", "label": "One Person Company"},
        {"value": "huf", "label": "HUF"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select your business entity type.',
      1,
      3
    );

    -- Step 2: Business Details (6 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'business_name',
      'Name of business / firm / company',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'As per PAN / incorporation',
      'Legal name of your business.',
      2,
      1
    ),
    (
      service_id,
      'pan_number',
      'PAN of entity',
      'text',
      NULL,
      '{"required": true, "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"}'::jsonb,
      'e.g., ABCDE1234F',
      'PAN of the business entity.',
      2,
      2
    ),
    (
      service_id,
      'gstin',
      'GSTIN (if registered)',
      'text',
      NULL,
      '{"required": false, "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"}'::jsonb,
      'e.g., 27ABCDE1234F1Z5',
      '15-character GSTIN if GST registered.',
      2,
      3
    ),
    (
      service_id,
      'business_nature',
      'Nature of business / profession',
      'select',
      '[
        {"value": "trading", "label": "Trading"},
        {"value": "manufacturing", "label": "Manufacturing"},
        {"value": "it_software", "label": "IT / Software"},
        {"value": "consulting", "label": "Consulting / Professional Services"},
        {"value": "financial", "label": "Financial Services"},
        {"value": "healthcare", "label": "Healthcare"},
        {"value": "education", "label": "Education"},
        {"value": "hospitality", "label": "Hospitality"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select your primary business activity.',
      2,
      4
    ),
    (
      service_id,
      'commencement_date',
      'Date of commencement of business',
      'date',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'Date when your business started.',
      2,
      5
    ),
    (
      service_id,
      'employee_count',
      'Number of employees currently on payroll',
      'text',
      NULL,
      '{"required": false, "pattern": "^[0-9]+$"}'::jsonb,
      'e.g., 25',
      'Required if applying for PTRC.',
      2,
      6
    );

    -- Step 3: Business Address (6 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'address',
      'Full registered address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Complete business address',
      'Address where your business operates.',
      3,
      1
    ),
    (
      service_id,
      'pincode',
      'Pincode',
      'text',
      NULL,
      '{"required": true, "pattern": "^[1-9][0-9]{5}$"}'::jsonb,
      '6 digits',
      'PIN code of your business address.',
      3,
      2
    ),
    (
      service_id,
      'district',
      'District',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'District of your business.',
      3,
      3
    ),
    (
      service_id,
      'contact_name',
      'Contact person name',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'Full name',
      'Name of person to contact.',
      3,
      4
    ),
    (
      service_id,
      'contact_mobile',
      'Contact mobile',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '10 digits',
      'Mobile number for contact.',
      3,
      5
    ),
    (
      service_id,
      'contact_email',
      'Contact email',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'email@example.com',
      'Email for communication.',
      3,
      6
    );

    -- Step 4: Proprietor / Partner / Director Details (5 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'owner_name',
      'Name of proprietor / director / managing partner',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'Full name',
      'Name of the primary owner/director.',
      4,
      1
    ),
    (
      service_id,
      'owner_pan',
      'PAN of proprietor / director',
      'text',
      NULL,
      '{"required": true, "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"}'::jsonb,
      'e.g., ABCDE1234F',
      'Personal PAN of owner/director.',
      4,
      2
    ),
    (
      service_id,
      'owner_aadhaar',
      'Aadhaar number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[0-9]{12}$"}'::jsonb,
      '12 digits',
      'Aadhaar of owner/director.',
      4,
      3
    ),
    (
      service_id,
      'owner_address',
      'Residential address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Complete residential address',
      'Current residential address.',
      4,
      4
    ),
    (
      service_id,
      'owner_mobile',
      'Mobile number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '10 digits',
      'Mobile number of owner/director.',
      4,
      5
    );

  END IF;
END $$;

-- =============================================================================
-- 5. Shop & Establishment Registration Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'shop-establishment' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: State & Establishment Type (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'state',
      'State in which establishment is located',
      'select',
      '[
        {"value": "MH", "label": "Maharashtra"},
        {"value": "DL", "label": "Delhi"},
        {"value": "KA", "label": "Karnataka"},
        {"value": "UP", "label": "Uttar Pradesh"},
        {"value": "TN", "label": "Tamil Nadu"},
        {"value": "GJ", "label": "Gujarat"},
        {"value": "RJ", "label": "Rajasthan"},
        {"value": "TG", "label": "Telangana"},
        {"value": "AP", "label": "Andhra Pradesh"},
        {"value": "WB", "label": "West Bengal"},
        {"value": "KL", "label": "Kerala"},
        {"value": "PB", "label": "Punjab"},
        {"value": "HR", "label": "Haryana"},
        {"value": "MP", "label": "Madhya Pradesh"},
        {"value": "other", "label": "Others"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Shop Act is state-specific. Select your state.',
      1,
      1
    ),
    (
      service_id,
      'establishment_type',
      'Type of establishment',
      'select',
      '[
        {"value": "shop", "label": "Shop / Retail Store"},
        {"value": "office", "label": "Commercial Establishment / Office"},
        {"value": "restaurant", "label": "Restaurant / Food Outlet"},
        {"value": "hotel", "label": "Hotel / Hospitality"},
        {"value": "bakery", "label": "Bakery / Confectionery"},
        {"value": "warehouse", "label": "Warehouse / Godown"},
        {"value": "it_company", "label": "IT Company / BPO"},
        {"value": "education", "label": "Educational Institute (Private)"},
        {"value": "entertainment", "label": "Cinema / Theatre / Place of Entertainment"},
        {"value": "other", "label": "Others"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select the type of your establishment.',
      1,
      2
    ),
    (
      service_id,
      'is_home_based',
      'Is this a home-based business?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select if you operate from your residence.',
      1,
      3
    );

    -- Step 2: Establishment Details (9 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'establishment_name',
      'Name of establishment',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'Name displayed on premises',
      'Trade name of your establishment.',
      2,
      1
    ),
    (
      service_id,
      'employer_name',
      'Name of employer / owner',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'Full legal name',
      'Name of the owner/employer.',
      2,
      2
    ),
    (
      service_id,
      'employer_pan',
      'PAN of employer',
      'text',
      NULL,
      '{"required": true, "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"}'::jsonb,
      'e.g., ABCDE1234F',
      'PAN of the employer/owner.',
      2,
      3
    ),
    (
      service_id,
      'commencement_date',
      'Date of commencement of business',
      'date',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'Date when business started.',
      2,
      4
    ),
    (
      service_id,
      'employee_count',
      'Number of employees currently working',
      'text',
      NULL,
      '{"required": true, "pattern": "^[0-9]+$"}'::jsonb,
      'Include full-time and part-time',
      'Total number of employees.',
      2,
      5
    ),
    (
      service_id,
      'employee_category',
      'Category of establishment by employee count',
      'select',
      '[
        {"value": "0", "label": "No employees (proprietor only)"},
        {"value": "1_9", "label": "1-9 employees"},
        {"value": "10_19", "label": "10-19 employees"},
        {"value": "20_49", "label": "20-49 employees"},
        {"value": "50_plus", "label": "50+ employees"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select based on employee count.',
      2,
      6
    ),
    (
      service_id,
      'working_hours',
      'Normal working hours per day',
      'select',
      '[
        {"value": "8", "label": "8 hours"},
        {"value": "9", "label": "9 hours"},
        {"value": "10", "label": "10 hours"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Daily working hours.',
      2,
      7
    ),
    (
      service_id,
      'weekly_holiday',
      'Weekly holiday',
      'select',
      '[
        {"value": "sunday", "label": "Sunday"},
        {"value": "monday", "label": "Monday"},
        {"value": "none", "label": "No fixed holiday"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Weekly off day.',
      2,
      8
    ),
    (
      service_id,
      'business_nature',
      'Nature of business conducted',
      'text',
      NULL,
      '{"required": true, "minLength": 10}'::jsonb,
      'e.g., Retail garments, Software consulting',
      'Brief description of business activity.',
      2,
      9
    );

    -- Step 3: Premises Address (7 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'address',
      'Full address of establishment',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Building name, floor, street, area',
      'Complete address of the establishment.',
      3,
      1
    ),
    (
      service_id,
      'pincode',
      'Pincode',
      'text',
      NULL,
      '{"required": true, "pattern": "^[1-9][0-9]{5}$"}'::jsonb,
      '6 digits',
      'PIN code.',
      3,
      2
    ),
    (
      service_id,
      'city',
      'City / Town / Village',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'City or town name.',
      3,
      3
    ),
    (
      service_id,
      'ward',
      'Ward / Zone (for municipal reference)',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'If known',
      'Municipal ward or zone.',
      3,
      4
    ),
    (
      service_id,
      'premises_nature',
      'Nature of premises',
      'select',
      '[
        {"value": "owned", "label": "Owned"},
        {"value": "rented", "label": "Rented"},
        {"value": "leased", "label": "Leased"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Ownership status of premises.',
      3,
      5
    ),
    (
      service_id,
      'contact_phone',
      'Contact number of establishment',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '10 digits',
      'Contact phone number.',
      3,
      6
    ),
    (
      service_id,
      'contact_email',
      'Email address',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'email@example.com',
      'Contact email.',
      3,
      7
    );

  END IF;
END $$;


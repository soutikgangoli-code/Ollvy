-- =============================================================================
-- Migration: Seed Post-Payment Questionnaire for Business PAN Registration
-- All questions are post-payment (direct to checkout, no pre-payment flow)
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'business-pan' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'entity_type',
      'What type of business entity are you registering PAN for?',
      'select',
      '[
        {"value": "pvt_ltd", "label": "Private Limited Company"},
        {"value": "llp", "label": "Limited Liability Partnership (LLP)"},
        {"value": "opc", "label": "One Person Company (OPC)"},
        {"value": "partnership", "label": "Partnership Firm"},
        {"value": "proprietorship", "label": "Sole Proprietorship"},
        {"value": "trust", "label": "Trust"},
        {"value": "society", "label": "Society or Association"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'This determines which form and supporting documents are required.',
      1,
      1
    ),
    (
      service_id,
      'entity_name',
      'Full name of the business entity as registered',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 300}'::jsonb,
      'Exactly as it appears on your Certificate of Incorporation or registration document',
      'This must match your incorporation certificate exactly, including punctuation.',
      1,
      2
    ),
    (
      service_id,
      'date_of_incorporation',
      'Date of incorporation or registration',
      'date',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'For companies and LLPs, this is the date on your Certificate of Incorporation from MCA.',
      1,
      3
    ),
    (
      service_id,
      'registered_office_address',
      'Registered office address (full)',
      'textarea',
      NULL,
      '{"required": true, "minLength": 10, "maxLength": 500}'::jsonb,
      'Flat/Shop No, Building Name, Street, Area, City, State, PIN',
      'This must match the address proof you will upload. Include PIN code.',
      1,
      4
    ),
    (
      service_id,
      'state_of_registration',
      'State where the business is registered',
      'select',
      '[
        {"value": "AN", "label": "Andaman and Nicobar Islands"},
        {"value": "AP", "label": "Andhra Pradesh"},
        {"value": "AR", "label": "Arunachal Pradesh"},
        {"value": "AS", "label": "Assam"},
        {"value": "BR", "label": "Bihar"},
        {"value": "CH", "label": "Chandigarh"},
        {"value": "CG", "label": "Chhattisgarh"},
        {"value": "DD", "label": "Daman and Diu"},
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
        {"value": "TS", "label": "Telangana"},
        {"value": "TR", "label": "Tripura"},
        {"value": "UP", "label": "Uttar Pradesh"},
        {"value": "UK", "label": "Uttarakhand"},
        {"value": "WB", "label": "West Bengal"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      NULL,
      1,
      5
    ),
    (
      service_id,
      'nature_of_business',
      'Nature of business (brief description)',
      'text',
      NULL,
      '{"required": true, "minLength": 5, "maxLength": 200}'::jsonb,
      'e.g. Software development and IT services, Trading in electronic goods',
      'A short description of what the business does. This appears on the PAN application.',
      2,
      1
    ),
    (
      service_id,
      'authorised_signatory_name',
      'Name of authorised signatory (director, partner, or proprietor)',
      'text',
      NULL,
      '{"required": true, "minLength": 3, "maxLength": 150}'::jsonb,
      'Full name as on Aadhaar or PAN',
      'The person who will sign the PAN application form. Must be a director, designated partner, or proprietor.',
      2,
      2
    ),
    (
      service_id,
      'authorised_signatory_pan',
      'PAN of the authorised signatory',
      'text',
      NULL,
      '{"required": true, "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"}'::jsonb,
      'e.g. ABCDE1234F',
      'The individual PAN of the person signing the application. Required by NSDL for verification.',
      2,
      3
    ),
    (
      service_id,
      'cin_llpin',
      'CIN (for companies) or LLPIN (for LLPs)',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'e.g. U72900DL2024PTC123456 or AAC-1234',
      'Not required for partnerships or proprietorships. Leave blank if not applicable.',
      2,
      4
    ),
    (
      service_id,
      'email_for_epan',
      'Email address where e-PAN should be delivered',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'company email preferred',
      'NSDL sends the e-PAN PDF to this address. Use the company email, not a personal one.',
      2,
      5
    ),
    (
      service_id,
      'mobile_for_otp',
      'Mobile number for OTP verification',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '10-digit mobile number',
      'NSDL requires OTP verification during application. Must be accessible during the filing process.',
      2,
      6
    );
  END IF;
END $$;

-- Add conditional display for cin_llpin (only show for companies and LLPs)
UPDATE service_questionnaires
SET depends_on = '{"question_key": "entity_type", "values": ["pvt_ltd", "llp", "opc"]}'::jsonb
WHERE question_key = 'cin_llpin'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'business-pan');

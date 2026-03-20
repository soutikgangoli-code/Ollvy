-- =============================================================================
-- Migration: Seed Questionnaires for License & IP Services
-- Adds questionnaires for: trademark-registration, copyright-registration,
-- partnership-registration
-- Note: FSSAI skipped - requires 3 separate services (Basic, State, Central)
-- =============================================================================

-- =============================================================================
-- 1. Trademark Registration Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'trademark-registration' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Applicant Details (7 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'applicant_type',
      'Type of applicant',
      'select',
      '[
        {"value": "individual", "label": "Individual"},
        {"value": "sole_proprietor", "label": "Sole Proprietor"},
        {"value": "partnership", "label": "Partnership Firm"},
        {"value": "pvt_ltd", "label": "Private Limited Company"},
        {"value": "llp", "label": "LLP"},
        {"value": "opc", "label": "One Person Company"},
        {"value": "trust", "label": "Trust / Society"},
        {"value": "startup", "label": "DPIIT Recognized Startup"},
        {"value": "msme", "label": "MSME / Udyam Registered"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Startups and MSMEs get 50% fee discount.',
      1,
      1
    ),
    (
      service_id,
      'applicant_name',
      'Name of applicant',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'Full legal name',
      'Name as per PAN/incorporation certificate.',
      1,
      2
    ),
    (
      service_id,
      'trading_as',
      'Trading as / doing business as (if different)',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'Trade name if different',
      'Your trade name if different from legal name.',
      1,
      3
    ),
    (
      service_id,
      'address',
      'Applicant address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Complete address',
      'Registered address of applicant.',
      1,
      4
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
      'State of applicant.',
      1,
      5
    ),
    (
      service_id,
      'contact_mobile',
      'Mobile number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '10 digits',
      'Contact mobile.',
      1,
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
      1,
      7
    );

    -- Step 2: Trademark Details (9 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'trademark_type',
      'Type of trademark',
      'select',
      '[
        {"value": "word", "label": "Word Mark (text only, no logo)"},
        {"value": "logo", "label": "Device Mark (logo only, no text)"},
        {"value": "composite", "label": "Composite (logo + text together)"},
        {"value": "sound", "label": "Sound Mark"},
        {"value": "shape", "label": "3D / Shape Mark"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select the type of mark you want to register.',
      2,
      1
    ),
    (
      service_id,
      'trademark_text',
      'Trademark text / word',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'Enter the word mark',
      'Text of your trademark (for word or composite marks).',
      2,
      2
    ),
    (
      service_id,
      'trademark_language',
      'Language of the trademark',
      'select',
      '[
        {"value": "english", "label": "English"},
        {"value": "hindi", "label": "Hindi"},
        {"value": "sanskrit", "label": "Sanskrit"},
        {"value": "tamil", "label": "Tamil"},
        {"value": "telugu", "label": "Telugu"},
        {"value": "kannada", "label": "Kannada"},
        {"value": "malayalam", "label": "Malayalam"},
        {"value": "bengali", "label": "Bengali"},
        {"value": "marathi", "label": "Marathi"},
        {"value": "gujarati", "label": "Gujarati"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Language in which the mark is written.',
      2,
      3
    ),
    (
      service_id,
      'trademark_translation',
      'Translation / transliteration (if non-English)',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'English meaning or transliteration',
      'Provide English meaning if trademark is in another language.',
      2,
      4
    ),
    (
      service_id,
      'trademark_description',
      'Description of the trademark',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Describe the mark',
      'E.g., "The mark consists of the word XYZ in stylized blue font with a red circle device."',
      2,
      5
    ),
    (
      service_id,
      'claims_colour',
      'Does the mark claim any specific colour(s)?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'If you claim colours, protection is limited to those colours.',
      2,
      6
    ),
    (
      service_id,
      'claimed_colours',
      'Colours claimed',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'e.g., Red, White, Blue',
      'Specify the colours if you claim any.',
      2,
      7
    ),
    (
      service_id,
      'has_logo_file',
      'Do you have a logo file ready to upload?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'High resolution logo required for device/composite marks.',
      2,
      8
    ),
    (
      service_id,
      'trademark_meaning',
      'Does the trademark have any special meaning?',
      'textarea',
      NULL,
      '{"required": false}'::jsonb,
      'Any significance of the mark',
      'E.g., invented word, combination of founder names, etc.',
      2,
      9
    );

    -- Step 3: Nice Classification (4 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'trademark_classes',
      'Select the class(es) for trademark registration',
      'multiselect',
      '[
        {"value": "1", "label": "Class 1: Chemicals"},
        {"value": "2", "label": "Class 2: Paints / Coatings"},
        {"value": "3", "label": "Class 3: Cosmetics / Cleaning products"},
        {"value": "4", "label": "Class 4: Lubricants / Fuels"},
        {"value": "5", "label": "Class 5: Pharmaceuticals"},
        {"value": "6", "label": "Class 6: Metal goods"},
        {"value": "7", "label": "Class 7: Machinery"},
        {"value": "8", "label": "Class 8: Hand tools"},
        {"value": "9", "label": "Class 9: Scientific / Electronics / Software"},
        {"value": "10", "label": "Class 10: Medical devices"},
        {"value": "11", "label": "Class 11: Lighting / HVAC"},
        {"value": "12", "label": "Class 12: Vehicles"},
        {"value": "14", "label": "Class 14: Jewellery / Precious metals"},
        {"value": "16", "label": "Class 16: Paper / Stationery"},
        {"value": "18", "label": "Class 18: Leather / Luggage"},
        {"value": "20", "label": "Class 20: Furniture"},
        {"value": "21", "label": "Class 21: Household utensils"},
        {"value": "24", "label": "Class 24: Textiles"},
        {"value": "25", "label": "Class 25: Clothing / Footwear / Headgear"},
        {"value": "28", "label": "Class 28: Games / Sporting goods"},
        {"value": "29", "label": "Class 29: Meat / Fish / Dairy / Processed foods"},
        {"value": "30", "label": "Class 30: Coffee / Tea / Flour / Baked goods"},
        {"value": "31", "label": "Class 31: Fresh fruits / Vegetables / Agricultural products"},
        {"value": "32", "label": "Class 32: Beer / Non-alcoholic beverages"},
        {"value": "33", "label": "Class 33: Alcoholic beverages (except beer)"},
        {"value": "35", "label": "Class 35: Advertising / Business services"},
        {"value": "36", "label": "Class 36: Insurance / Financial services"},
        {"value": "37", "label": "Class 37: Construction / Repair services"},
        {"value": "38", "label": "Class 38: Telecommunication services"},
        {"value": "39", "label": "Class 39: Transport / Travel"},
        {"value": "41", "label": "Class 41: Education / Entertainment"},
        {"value": "42", "label": "Class 42: IT / Scientific / Research services"},
        {"value": "43", "label": "Class 43: Food and drink services (restaurants/hotels)"},
        {"value": "44", "label": "Class 44: Medical / Veterinary / Beauty services"},
        {"value": "45", "label": "Class 45: Legal / Security / Personal services"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select all classes applicable to your goods/services. Each class costs additional govt fee.',
      3,
      1
    ),
    (
      service_id,
      'goods_services_description',
      'Specify the exact goods/services within each class',
      'textarea',
      NULL,
      '{"required": true, "minLength": 30}'::jsonb,
      'e.g., Class 25: T-shirts, jeans, kurtas, footwear',
      'List specific goods/services under each class selected.',
      3,
      2
    ),
    (
      service_id,
      'class_count',
      'Number of classes selected',
      'text',
      NULL,
      '{"required": true, "pattern": "^[0-9]+$"}'::jsonb,
      'e.g., 2',
      'Fee: Rs. 4,500/class (startups/MSMEs), Rs. 9,000/class (others).',
      3,
      3
    ),
    (
      service_id,
      'not_sure_classes',
      'Not sure about class selection?',
      'select',
      '[
        {"value": "yes", "label": "Yes, I need help"},
        {"value": "no", "label": "No, I have selected correctly"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Our team will help you identify the right classes.',
      3,
      4
    );

    -- Step 4: Use of Mark (7 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'mark_in_use',
      'Is the mark currently in use?',
      'select',
      '[
        {"value": "proposed", "label": "Proposed to be Used"},
        {"value": "already_in_use", "label": "Already in Use"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select if you are already using this mark commercially.',
      4,
      1
    ),
    (
      service_id,
      'first_use_date',
      'Date of first use of the mark',
      'date',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Required if mark is already in use.',
      4,
      2
    ),
    (
      service_id,
      'has_use_evidence',
      'Do you have evidence of prior use?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Invoices, packaging, advertisements showing the mark.',
      4,
      3
    ),
    (
      service_id,
      'use_evidence_type',
      'Type of evidence available',
      'multiselect',
      '[
        {"value": "invoices", "label": "Invoices / bills"},
        {"value": "packaging", "label": "Packaging with mark"},
        {"value": "advertisements", "label": "Advertisements"},
        {"value": "website", "label": "Website screenshots"},
        {"value": "print_media", "label": "Newspaper / magazine ads"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Evidence strengthens your application.',
      4,
      4
    ),
    (
      service_id,
      'is_convention',
      'Is this a convention application (claiming priority from foreign application)?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'If you have filed in another country within last 6 months.',
      4,
      5
    ),
    (
      service_id,
      'convention_country',
      'Country of convention application',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'e.g., United States',
      'Country where you first filed.',
      4,
      6
    ),
    (
      service_id,
      'convention_date',
      'Convention application date',
      'date',
      NULL,
      '{"required": false}'::jsonb,
      NULL,
      'Must be within 6 months of filing in India.',
      4,
      7
    );

  END IF;
END $$;

-- =============================================================================
-- 3. Copyright Registration Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'copyright-registration' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Type of Work (5 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'work_category',
      'Category of creative work',
      'select',
      '[
        {"value": "literary", "label": "Literary Work (books, articles, stories, databases)"},
        {"value": "dramatic", "label": "Dramatic Work (scripts, screenplays)"},
        {"value": "musical", "label": "Musical Work (compositions without lyrics)"},
        {"value": "sound_recording", "label": "Sound Recording (recorded music, podcasts)"},
        {"value": "artistic", "label": "Artistic Work (paintings, drawings, sculptures, photographs, logos)"},
        {"value": "cinematograph", "label": "Cinematograph Film (movies, short films, animations)"},
        {"value": "software", "label": "Computer Programme / Software"},
        {"value": "architecture", "label": "Architecture"},
        {"value": "advertisement", "label": "Advertisement (artistic element)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select the category that best describes your work.',
      1,
      1
    ),
    (
      service_id,
      'work_title',
      'Title of the work',
      'text',
      NULL,
      '{"required": true, "minLength": 2}'::jsonb,
      'e.g., "The Art of Coding"',
      'Official title of your work.',
      1,
      2
    ),
    (
      service_id,
      'work_language',
      'Language of the work',
      'select',
      '[
        {"value": "english", "label": "English"},
        {"value": "hindi", "label": "Hindi"},
        {"value": "tamil", "label": "Tamil"},
        {"value": "telugu", "label": "Telugu"},
        {"value": "kannada", "label": "Kannada"},
        {"value": "malayalam", "label": "Malayalam"},
        {"value": "bengali", "label": "Bengali"},
        {"value": "marathi", "label": "Marathi"},
        {"value": "gujarati", "label": "Gujarati"},
        {"value": "punjabi", "label": "Punjabi"},
        {"value": "other", "label": "Other"},
        {"value": "na", "label": "Not Applicable (e.g., music, art)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Language in which the work is created.',
      1,
      3
    ),
    (
      service_id,
      'work_description',
      'Brief description of the work',
      'textarea',
      NULL,
      '{"required": true, "minLength": 50}'::jsonb,
      'Describe the content and subject matter',
      'Brief summary describing your work.',
      1,
      4
    ),
    (
      service_id,
      'is_derivative',
      'Is this an adaptation or derivative of another work?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'If based on or adapted from another work.',
      1,
      5
    );

    -- Step 2: Authorship & Ownership (6 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'authorship_type',
      'Nature of authorship',
      'select',
      '[
        {"value": "single", "label": "Single author"},
        {"value": "joint", "label": "Multiple authors (joint work)"},
        {"value": "work_for_hire", "label": "Work created for hire / by employee"},
        {"value": "anonymous", "label": "Anonymous"},
        {"value": "pseudonymous", "label": "Pseudonymous"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select who created the work.',
      2,
      1
    ),
    (
      service_id,
      'applicant_is_author',
      'Is the applicant the same as the author?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Are you the creator of this work?',
      2,
      2
    ),
    (
      service_id,
      'ownership_basis',
      'If not, relationship of applicant to work',
      'select',
      '[
        {"value": "employer", "label": "Employer (work made for hire)"},
        {"value": "assignee", "label": "Assignee (assignment from author)"},
        {"value": "licensee", "label": "Licensee"},
        {"value": "publisher", "label": "Publisher"},
        {"value": "producer", "label": "Producer"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'How did you acquire rights to this work?',
      2,
      3
    ),
    (
      service_id,
      'author_name',
      'Author''s full name',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'Full name of the creator',
      'Name of the person who created the work.',
      2,
      4
    ),
    (
      service_id,
      'author_nationality',
      'Author''s nationality',
      'select',
      '[
        {"value": "indian", "label": "Indian"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Nationality of the author.',
      2,
      5
    ),
    (
      service_id,
      'author_address',
      'Author''s address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Complete address',
      'Residential address of the author.',
      2,
      6
    );

    -- Step 3: Publication Details (5 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'publication_status',
      'Is the work published or unpublished?',
      'select',
      '[
        {"value": "published", "label": "Published"},
        {"value": "unpublished", "label": "Unpublished"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Has the work been made available to the public?',
      3,
      1
    ),
    (
      service_id,
      'publication_year',
      'Year of publication',
      'text',
      NULL,
      '{"required": false, "pattern": "^[12][0-9]{3}$"}'::jsonb,
      'e.g., 2023',
      'Required if published.',
      3,
      2
    ),
    (
      service_id,
      'publication_country',
      'Country of first publication',
      'select',
      '[
        {"value": "india", "label": "India"},
        {"value": "usa", "label": "United States"},
        {"value": "uk", "label": "United Kingdom"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": false}'::jsonb,
      NULL,
      'Required if published.',
      3,
      3
    ),
    (
      service_id,
      'creation_year',
      'Year of creation (if unpublished)',
      'text',
      NULL,
      '{"required": false, "pattern": "^[12][0-9]{3}$"}'::jsonb,
      'e.g., 2022',
      'Year when work was completed.',
      3,
      4
    ),
    (
      service_id,
      'foreign_registration',
      'Is the work registered in any foreign country?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'If registered outside India.',
      3,
      5
    );

    -- Step 4: Applicant Details (6 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'applicant_name',
      'Name of applicant',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'Full name',
      'Name of person/entity applying.',
      4,
      1
    ),
    (
      service_id,
      'applicant_type',
      'Type of applicant',
      'select',
      '[
        {"value": "individual", "label": "Individual"},
        {"value": "company", "label": "Company"},
        {"value": "partnership", "label": "Partnership"},
        {"value": "llp", "label": "LLP"},
        {"value": "trust", "label": "Trust / Society"},
        {"value": "government", "label": "Government"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Type of applicant.',
      4,
      2
    ),
    (
      service_id,
      'applicant_address',
      'Applicant address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Complete address',
      'Address of applicant.',
      4,
      3
    ),
    (
      service_id,
      'applicant_nationality',
      'Nationality',
      'select',
      '[
        {"value": "indian", "label": "Indian"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Nationality of applicant.',
      4,
      4
    ),
    (
      service_id,
      'applicant_mobile',
      'Mobile number',
      'text',
      NULL,
      '{"required": true, "pattern": "^[6-9][0-9]{9}$"}'::jsonb,
      '10 digits',
      'Contact mobile.',
      4,
      5
    ),
    (
      service_id,
      'applicant_email',
      'Email address',
      'text',
      NULL,
      '{"required": true, "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}'::jsonb,
      'email@example.com',
      'Contact email.',
      4,
      6
    );

  END IF;
END $$;

-- =============================================================================
-- 4. Partnership Registration Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'partnership-registration' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Partner Details (8 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'number_of_partners',
      'Number of partners',
      'select',
      '[
        {"value": "2", "label": "2"},
        {"value": "3", "label": "3"},
        {"value": "4", "label": "4"},
        {"value": "5", "label": "5"},
        {"value": "more", "label": "More than 5"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Minimum 2 partners required. Maximum 20 for non-banking business.',
      1,
      1
    ),
    (
      service_id,
      'partner1_name',
      'Name of Partner 1',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'Full name as per PAN',
      'First partner''s full name.',
      1,
      2
    ),
    (
      service_id,
      'partner1_pan',
      'PAN of Partner 1',
      'text',
      NULL,
      '{"required": true, "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"}'::jsonb,
      'e.g., ABCDE1234F',
      'PAN of first partner.',
      1,
      3
    ),
    (
      service_id,
      'partner1_address',
      'Address of Partner 1',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Complete residential address',
      'Address of first partner.',
      1,
      4
    ),
    (
      service_id,
      'partner2_name',
      'Name of Partner 2',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'Full name as per PAN',
      'Second partner''s full name.',
      1,
      5
    ),
    (
      service_id,
      'partner2_pan',
      'PAN of Partner 2',
      'text',
      NULL,
      '{"required": true, "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"}'::jsonb,
      'e.g., ABCDE1234F',
      'PAN of second partner.',
      1,
      6
    ),
    (
      service_id,
      'partner2_address',
      'Address of Partner 2',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Complete residential address',
      'Address of second partner.',
      1,
      7
    ),
    (
      service_id,
      'has_more_partners',
      'Do you have additional partners?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'You can add more partner details later.',
      1,
      8
    );

    -- Step 2: Business Details (8 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'firm_name',
      'Proposed name of the partnership firm',
      'text',
      NULL,
      '{"required": true, "minLength": 3}'::jsonb,
      'e.g., Sharma & Associates',
      'This will be the registered name of your firm.',
      2,
      1
    ),
    (
      service_id,
      'nature_of_business',
      'Nature of business',
      'select',
      '[
        {"value": "trading", "label": "Trading"},
        {"value": "manufacturing", "label": "Manufacturing"},
        {"value": "services", "label": "Services"},
        {"value": "professional", "label": "Professional Services"},
        {"value": "retail", "label": "Retail"},
        {"value": "construction", "label": "Construction"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Primary business activity.',
      2,
      2
    ),
    (
      service_id,
      'business_description',
      'Detailed description of business activities',
      'textarea',
      NULL,
      '{"required": true, "minLength": 30}'::jsonb,
      'Describe what your firm will do',
      'This will appear in your partnership deed.',
      2,
      3
    ),
    (
      service_id,
      'commencement_date',
      'Proposed date of commencement',
      'date',
      NULL,
      '{"required": true}'::jsonb,
      NULL,
      'Date from which partnership begins.',
      2,
      4
    ),
    (
      service_id,
      'duration',
      'Duration of partnership',
      'select',
      '[
        {"value": "at_will", "label": "At Will (no fixed term)"},
        {"value": "fixed", "label": "Fixed Term"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Partnership at will can be dissolved anytime.',
      2,
      5
    ),
    (
      service_id,
      'fixed_duration_years',
      'Duration in years (if fixed)',
      'text',
      NULL,
      '{"required": false, "pattern": "^[0-9]+$"}'::jsonb,
      'e.g., 10',
      'Number of years if fixed term.',
      2,
      6
    ),
    (
      service_id,
      'has_existing_business',
      'Is this partnership taking over an existing business?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'If converting from proprietorship or buying a business.',
      2,
      7
    ),
    (
      service_id,
      'existing_business_name',
      'Name of existing business (if applicable)',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'Current business name',
      'Name of business being taken over.',
      2,
      8
    );

    -- Step 3: Capital & Profit Sharing (6 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      service_id,
      'total_capital',
      'Total initial capital of the firm (Rs.)',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'e.g., 500000',
      'Total capital contributed by all partners.',
      3,
      1
    ),
    (
      service_id,
      'partner1_capital',
      'Capital contribution by Partner 1 (Rs.)',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'e.g., 250000',
      'Amount invested by first partner.',
      3,
      2
    ),
    (
      service_id,
      'partner2_capital',
      'Capital contribution by Partner 2 (Rs.)',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'e.g., 250000',
      'Amount invested by second partner.',
      3,
      3
    ),
    (
      service_id,
      'profit_sharing_ratio',
      'Profit/loss sharing ratio',
      'text',
      NULL,
      '{"required": true}'::jsonb,
      'e.g., 50:50 or 60:40',
      'How profits and losses will be divided.',
      3,
      4
    ),
    (
      service_id,
      'interest_on_capital',
      'Interest on capital (if any)',
      'text',
      NULL,
      '{"required": false}'::jsonb,
      'e.g., 12% p.a.',
      'Interest paid to partners on their capital.',
      3,
      5
    ),
    (
      service_id,
      'partner_salary',
      'Will partners draw salary?',
      'select',
      '[
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Partners can draw salary before profit division.',
      3,
      6
    );

    -- Step 4: Registered Office Address (6 questions)
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
      'State where the firm will be registered.',
      4,
      1
    ),
    (
      service_id,
      'address',
      'Full address of principal place of business',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20}'::jsonb,
      'Complete business address',
      'This will be the registered address.',
      4,
      2
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
      4,
      3
    ),
    (
      service_id,
      'premises_type',
      'Nature of premises',
      'select',
      '[
        {"value": "owned", "label": "Owned by a partner"},
        {"value": "rented", "label": "Rented"},
        {"value": "consent", "label": "On consent basis"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Ownership status of business premises.',
      4,
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
      'Primary contact number.',
      4,
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
      'Primary email address.',
      4,
      6
    );

  END IF;
END $$;

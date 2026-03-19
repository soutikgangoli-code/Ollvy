-- =============================================================================
-- Migration: Post-Payment Questionnaire Schema
-- Adds tables for service-specific questionnaires and order responses
-- =============================================================================

-- =============================================================================
-- 1. service_questionnaires - Define questions per service package
-- =============================================================================

CREATE TABLE IF NOT EXISTS service_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,                    -- Unique key like 'business_type', 'trade_name'
  question_label TEXT NOT NULL,                  -- Display label
  question_type TEXT NOT NULL,                   -- text, number, select, multiselect, radio, textarea, date, file
  options JSONB,                                 -- For select/multiselect/radio: [{value, label}]
  validation JSONB,                              -- {required, min, max, minLength, maxLength, pattern}
  placeholder TEXT,
  help_text TEXT,
  depends_on JSONB,                              -- Conditional logic: {question_key, value} or {question_key, values: []}
  step_number INT DEFAULT 1,                     -- Which step this question belongs to
  display_order INT DEFAULT 0,                   -- Order within the step
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(service_package_id, question_key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_questionnaires_service ON service_questionnaires(service_package_id);
CREATE INDEX IF NOT EXISTS idx_service_questionnaires_step ON service_questionnaires(service_package_id, step_number);

-- =============================================================================
-- 2. order_questionnaire_responses - Store user answers per order
-- =============================================================================

CREATE TABLE IF NOT EXISTS order_questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  response_value JSONB NOT NULL,                 -- Can be string, number, array, object
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(order_id, question_key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_questionnaire_responses_order ON order_questionnaire_responses(order_id);

-- =============================================================================
-- 3. Add questionnaire columns to orders table
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'questionnaire_completed_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN questionnaire_completed_at TIMESTAMPTZ;
    COMMENT ON COLUMN orders.questionnaire_completed_at IS 'Timestamp when user completed the questionnaire';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'questionnaire_step'
  ) THEN
    ALTER TABLE orders ADD COLUMN questionnaire_step INT DEFAULT 0;
    COMMENT ON COLUMN orders.questionnaire_step IS 'Current step in questionnaire wizard (0 = not started)';
  END IF;
END $$;

-- =============================================================================
-- 4. RLS Policies
-- =============================================================================

-- Enable RLS
ALTER TABLE service_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- service_questionnaires: Anyone can read (public)
CREATE POLICY "Anyone can view service questionnaires"
  ON service_questionnaires FOR SELECT
  USING (true);

-- order_questionnaire_responses: Users can view their own
CREATE POLICY "Users can view own questionnaire responses"
  ON order_questionnaire_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_questionnaire_responses.order_id
      AND o.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- order_questionnaire_responses: Users can insert their own
CREATE POLICY "Users can insert own questionnaire responses"
  ON order_questionnaire_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_questionnaire_responses.order_id
      AND o.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- order_questionnaire_responses: Users can update their own
CREATE POLICY "Users can update own questionnaire responses"
  ON order_questionnaire_responses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_questionnaire_responses.order_id
      AND o.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Professionals can view questionnaire responses for their orders
CREATE POLICY "Professionals can view assigned order questionnaire responses"
  ON order_questionnaire_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_questionnaire_responses.order_id
      AND o.professional_id = (SELECT id FROM professionals WHERE auth_user_id = auth.uid())
    )
  );

-- =============================================================================
-- 5. Seed GST Registration Questions
-- =============================================================================

-- First, get the GST Registration service package ID and insert questions
DO $$
DECLARE
  gst_service_id UUID;
BEGIN
  -- Get the GST Registration service package ID
  SELECT id INTO gst_service_id FROM service_packages WHERE slug = 'gst-registration' LIMIT 1;

  IF gst_service_id IS NOT NULL THEN
    -- Delete existing questions for this service (if re-running)
    DELETE FROM service_questionnaires WHERE service_package_id = gst_service_id;

    -- Step 1: Business Type (2 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      gst_service_id,
      'business_type',
      'What type of business entity is this?',
      'select',
      '[
        {"value": "proprietorship", "label": "Proprietorship"},
        {"value": "partnership", "label": "Partnership Firm"},
        {"value": "llp", "label": "Limited Liability Partnership (LLP)"},
        {"value": "pvt_ltd", "label": "Private Limited Company"},
        {"value": "opc", "label": "One Person Company (OPC)"},
        {"value": "huf", "label": "Hindu Undivided Family (HUF)"}
      ]'::jsonb,
      '{"required": true}'::jsonb,
      NULL,
      'Select the legal structure of your business',
      1,
      1
    ),
    (
      gst_service_id,
      'trade_name',
      'Trade Name (Optional)',
      'text',
      NULL,
      '{"required": false, "maxLength": 100}'::jsonb,
      'e.g., Sharma Electronics',
      'The name under which you do business (if different from legal name)',
      1,
      2
    );

    -- Step 2: Business Address (3 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      gst_service_id,
      'principal_address',
      'Principal Place of Business Address',
      'textarea',
      NULL,
      '{"required": true, "minLength": 20, "maxLength": 500}'::jsonb,
      'Enter complete address with building name, street, area...',
      'This will be your primary GST registered address',
      2,
      1
    ),
    (
      gst_service_id,
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
      'Your GSTIN will be issued for this state',
      2,
      2
    ),
    (
      gst_service_id,
      'pincode',
      'PIN Code',
      'text',
      NULL,
      '{"required": true, "pattern": "^[1-9][0-9]{5}$"}'::jsonb,
      '110001',
      'Enter 6-digit PIN code',
      2,
      3
    );

    -- Step 3: Business Activity (2 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (
      gst_service_id,
      'nature_of_business',
      'Nature of Business',
      'multiselect',
      '[
        {"value": "manufacturer", "label": "Manufacturer"},
        {"value": "trader", "label": "Trader / Wholesaler / Retailer"},
        {"value": "service_provider", "label": "Service Provider"},
        {"value": "works_contractor", "label": "Works Contractor"},
        {"value": "restaurant", "label": "Restaurant / Food Service"},
        {"value": "ecommerce", "label": "E-commerce Operator"},
        {"value": "exporter", "label": "Exporter"},
        {"value": "other", "label": "Other"}
      ]'::jsonb,
      '{"required": true, "minItems": 1}'::jsonb,
      NULL,
      'Select all that apply to your business',
      3,
      1
    ),
    (
      gst_service_id,
      'business_activity_description',
      'Describe your main business activity',
      'textarea',
      NULL,
      '{"required": true, "minLength": 50, "maxLength": 500}'::jsonb,
      'e.g., We manufacture and sell electrical components to retailers across Maharashtra...',
      'Provide a brief description of what your business does',
      3,
      2
    );

  END IF;
END $$;

-- =============================================================================
-- 6. Function to mark questionnaire complete
-- =============================================================================

CREATE OR REPLACE FUNCTION complete_order_questionnaire(p_order_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE orders
  SET questionnaire_completed_at = now()
  WHERE id = p_order_id
  AND user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

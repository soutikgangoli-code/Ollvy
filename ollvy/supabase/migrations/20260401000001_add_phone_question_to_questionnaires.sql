-- Add "Your Phone Number" as the first question (step 0) for post-payment questionnaires
-- This runs for all services with post-payment questions

-- Create a function to add phone question to all active services
-- Phone question is added as step_number = 0, display_order = 1 (before all other questions)
-- It only shows if the user doesn't already have a phone number

INSERT INTO service_questionnaires (
  id,
  service_package_id,
  question_key,
  question_label,
  question_type,
  placeholder,
  help_text,
  validation,
  step_number,
  display_order,
  is_active,
  is_pre_payment
)
SELECT
  gen_random_uuid(),
  sp.id,
  'user_phone_number',
  'Your Phone Number',
  'text',
  '9876543210',
  'We''ll use this to send you important updates about your order via WhatsApp and SMS.',
  '{"required": true, "pattern": "^[6-9]\\d{9}$", "minLength": 10, "maxLength": 10}'::jsonb,
  0, -- Step 0 (before all other steps)
  1, -- First in display order
  true,
  false -- Post-payment question
FROM service_packages sp
WHERE sp.is_active = true
  AND NOT EXISTS (
    -- Don't add if phone question already exists for this service
    SELECT 1 FROM service_questionnaires sq
    WHERE sq.service_package_id = sp.id
      AND sq.question_key = 'user_phone_number'
  );

-- Add step title configuration for step 0 (phone collection)
-- This will be handled in the frontend STEP_TITLES constant

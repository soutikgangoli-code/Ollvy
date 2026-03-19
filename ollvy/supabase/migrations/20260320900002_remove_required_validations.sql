-- Remove all required validations for testing

-- 1. Update questionnaire questions - remove required from validation
UPDATE service_questionnaires
SET validation = jsonb_set(
  COALESCE(validation, '{}'::jsonb),
  '{required}',
  'false'::jsonb
);

-- 2. Update document templates - set is_required to false
UPDATE service_document_templates
SET is_required = false;

-- 3. Update existing order_documents - set is_required to false
UPDATE order_documents
SET is_required = false;

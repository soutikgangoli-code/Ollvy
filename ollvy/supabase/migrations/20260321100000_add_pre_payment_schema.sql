-- =============================================================================
-- Migration: Step 1a-c - Pre-Payment Schema Changes
-- 1a. Add is_pre_payment to service_questionnaires
-- 1b. Add condition to service_document_templates
-- 1c. Add pending_payment order status
-- =============================================================================

-- =============================================================================
-- Step 1a: Add is_pre_payment column to service_questionnaires
-- =============================================================================

ALTER TABLE service_questionnaires
ADD COLUMN IF NOT EXISTS is_pre_payment BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN service_questionnaires.is_pre_payment IS
'If true, this question is asked before payment (eligibility/pricing page).
If false, asked in post-payment questionnaire flow.';


-- =============================================================================
-- Step 1b: Add condition column to service_document_templates
-- =============================================================================

ALTER TABLE service_document_templates
ADD COLUMN IF NOT EXISTS condition JSONB DEFAULT NULL;

COMMENT ON COLUMN service_document_templates.condition IS
'Conditional display logic based on questionnaire answers.
Format: {"question_key": "...", "operator": "...", "value": "..."}.
Operators: equals, not_equals, includes, not_includes, includes_any, less_than, exists.
If null, document always shows. If condition evaluates to false, document is hidden.';


-- =============================================================================
-- Step 1c: Add pending_payment to order status constraint
-- =============================================================================

-- First drop the existing constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add the new constraint with pending_payment included
ALTER TABLE orders ADD CONSTRAINT orders_status_check
CHECK (status::text = ANY (ARRAY[
  'pending_payment'::character varying,
  'pending_assignment'::character varying,
  'waitlisted'::character varying,
  'assigned'::character varying,
  'in_progress'::character varying,
  'completed'::character varying,
  'disputed'::character varying,
  'cancelled'::character varying
]::text[]));

-- Also add 'placed' if it was in original data (seen as default)
-- Update: On further inspection, 'placed' is the default but not in the check.
-- Let's include it to avoid issues with existing data.
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders ADD CONSTRAINT orders_status_check
CHECK (status::text = ANY (ARRAY[
  'placed'::character varying,
  'pending_payment'::character varying,
  'pending_assignment'::character varying,
  'waitlisted'::character varying,
  'assigned'::character varying,
  'in_progress'::character varying,
  'completed'::character varying,
  'disputed'::character varying,
  'cancelled'::character varying
]::text[]));

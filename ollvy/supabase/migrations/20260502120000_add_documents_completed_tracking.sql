-- =============================================================================
-- Migration: Documents-completed tracking on orders + auto-set trigger
-- =============================================================================
-- Adds two columns to orders:
--   documents_completed_at         - first time all required docs were uploaded
--   submission_complete_email_sent_at - idempotency guard for the
--                                       "submission complete" customer email
--
-- A trigger on order_documents auto-populates documents_completed_at the
-- first time the last required document gets an uploaded_at value.
-- =============================================================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS documents_completed_at TIMESTAMPTZ;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS submission_complete_email_sent_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION set_documents_completed_at_if_all_required_done(
  p_order_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pending_count INT;
  v_already_set TIMESTAMPTZ;
BEGIN
  SELECT documents_completed_at INTO v_already_set
  FROM orders
  WHERE id = p_order_id;

  IF v_already_set IS NOT NULL THEN
    RETURN;
  END IF;

  SELECT COUNT(*) INTO v_pending_count
  FROM order_documents
  WHERE order_id = p_order_id
    AND is_required = true
    AND uploaded_at IS NULL;

  -- If there are required docs and none are pending, mark complete.
  IF v_pending_count = 0 AND EXISTS (
    SELECT 1 FROM order_documents
    WHERE order_id = p_order_id AND is_required = true
  ) THEN
    UPDATE orders
    SET documents_completed_at = now()
    WHERE id = p_order_id
      AND documents_completed_at IS NULL;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION trg_order_documents_after_upload()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only act on the NULL -> non-NULL transition for required documents.
  IF NEW.is_required = true
     AND OLD.uploaded_at IS NULL
     AND NEW.uploaded_at IS NOT NULL THEN
    PERFORM set_documents_completed_at_if_all_required_done(NEW.order_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS order_documents_after_upload ON order_documents;

CREATE TRIGGER order_documents_after_upload
  AFTER UPDATE ON order_documents
  FOR EACH ROW
  EXECUTE FUNCTION trg_order_documents_after_upload();

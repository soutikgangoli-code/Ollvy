-- =============================================================================
-- RPC Functions for Document Management
-- Bypasses RLS chain issues by using SECURITY DEFINER
-- =============================================================================

-- =============================================================================
-- 1. Get documents for an order (with template info)
-- =============================================================================

CREATE OR REPLACE FUNCTION get_order_documents(p_order_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_service_package_id UUID;
  v_documents JSON;
BEGIN
  -- Get the user ID for the current auth user
  SELECT id INTO v_user_id
  FROM users
  WHERE auth_user_id = auth.uid();

  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Verify user owns this order and get service_package_id
  SELECT service_package_id INTO v_service_package_id
  FROM orders
  WHERE id = p_order_id AND user_id = v_user_id;

  IF v_service_package_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Fetch documents with template info
  SELECT json_agg(doc_row ORDER BY doc_row.display_order)
  INTO v_documents
  FROM (
    SELECT
      od.id,
      od.document_key,
      od.document_label,
      od.stage_key,
      od.is_required,
      od.uploaded_at,
      od.file_url,
      od.file_name,
      od.verified_at,
      od.rejection_reason,
      sdt.description,
      sdt.tips,
      sdt.template_url,
      COALESCE(sdt.display_order, 0) as display_order
    FROM order_documents od
    LEFT JOIN service_document_templates sdt
      ON sdt.service_package_id = v_service_package_id
      AND sdt.document_key = od.document_key
    WHERE od.order_id = p_order_id
  ) doc_row;

  RETURN COALESCE(v_documents, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 2. Initialize order documents from templates (if not already created)
-- =============================================================================

CREATE OR REPLACE FUNCTION initialize_order_documents(p_order_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_service_package_id UUID;
  v_doc_count INT;
BEGIN
  -- Get the user ID for the current auth user
  SELECT id INTO v_user_id
  FROM users
  WHERE auth_user_id = auth.uid();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Verify user owns this order and get service_package_id
  SELECT service_package_id INTO v_service_package_id
  FROM orders
  WHERE id = p_order_id AND user_id = v_user_id;

  IF v_service_package_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Order not found');
  END IF;

  -- Check if documents already exist
  SELECT COUNT(*) INTO v_doc_count
  FROM order_documents
  WHERE order_id = p_order_id;

  -- If no documents exist, create from templates
  IF v_doc_count = 0 THEN
    INSERT INTO order_documents (order_id, document_key, document_label, stage_key, is_required)
    SELECT
      p_order_id,
      sdt.document_key,
      sdt.document_label,
      sdt.stage_key,
      sdt.is_required
    FROM service_document_templates sdt
    WHERE sdt.service_package_id = v_service_package_id
    ON CONFLICT (order_id, document_key) DO NOTHING;
  END IF;

  -- Return the documents
  RETURN get_order_documents(p_order_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 3. Update document upload info
-- =============================================================================

CREATE OR REPLACE FUNCTION update_order_document(
  p_order_id UUID,
  p_document_key TEXT,
  p_file_url TEXT,
  p_file_name TEXT
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_order_exists BOOLEAN;
BEGIN
  -- Get the user ID for the current auth user
  SELECT id INTO v_user_id
  FROM users
  WHERE auth_user_id = auth.uid();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Verify user owns this order
  SELECT EXISTS(
    SELECT 1 FROM orders
    WHERE id = p_order_id AND user_id = v_user_id
  ) INTO v_order_exists;

  IF NOT v_order_exists THEN
    RETURN json_build_object('success', false, 'error', 'Order not found');
  END IF;

  -- Update the document
  UPDATE order_documents
  SET
    file_url = p_file_url,
    file_name = p_file_name,
    uploaded_at = now(),
    rejection_reason = NULL  -- Clear any previous rejection
  WHERE order_id = p_order_id AND document_key = p_document_key;

  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

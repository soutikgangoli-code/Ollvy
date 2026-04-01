-- Create consolidated RPC function to fetch all order details in one call
-- This eliminates the client-side waterfall of multiple queries
-- Returns: order, service_package, professional, stage_history, documents,
--          work_documents, questionnaire_responses, invoice_id, round_notification

CREATE OR REPLACE FUNCTION get_order_full_details(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_order JSONB;
  v_service_package_id UUID;
  v_result JSONB;
BEGIN
  -- Get the user ID for the current auth user
  SELECT id INTO v_user_id
  FROM users
  WHERE auth_user_id = auth.uid();

  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Fetch the order with embedded service_package and professional (verify ownership)
  SELECT jsonb_build_object(
    'id', o.id,
    'order_number', o.order_number,
    'user_id', o.user_id,
    'service_package_id', o.service_package_id,
    'professional_id', o.professional_id,
    'variant_id', o.variant_id,
    'status', o.status,
    'order_type', o.order_type,
    'quote_id', o.quote_id,
    'retainer_subscription_id', o.retainer_subscription_id,
    'price_base_paisa_snapshot', o.price_base_paisa_snapshot,
    'price_govt_fees_paisa_snapshot', o.price_govt_fees_paisa_snapshot,
    'price_gst_paisa_snapshot', o.price_gst_paisa_snapshot,
    'pro_discount_paisa_snapshot', o.pro_discount_paisa_snapshot,
    'promo_discount_paisa_snapshot', o.promo_discount_paisa_snapshot,
    'total_paisa_snapshot', o.total_paisa_snapshot,
    'promo_code_used', o.promo_code_used,
    'razorpay_order_id', o.razorpay_order_id,
    'razorpay_payment_id', o.razorpay_payment_id,
    'questionnaire_completed_at', o.questionnaire_completed_at,
    'questionnaire_step', o.questionnaire_step,
    'chat_conversation_id', o.chat_conversation_id,
    'created_at', o.created_at,
    'updated_at', o.updated_at,
    'service_package', (
      SELECT jsonb_build_object(
        'id', sp.id,
        'name', sp.name,
        'slug', sp.slug,
        'category_slug', sp.category_slug,
        'short_description', sp.short_description,
        'sla_working_days', sp.sla_working_days,
        'workflow_stages', sp.workflow_stages,
        'scope_items', sp.scope_items,
        'price_base_paisa', sp.price_base_paisa,
        'price_govt_fees_paisa', sp.price_govt_fees_paisa,
        'price_gst_rate', sp.price_gst_rate,
        'documents_required', sp.documents_required,
        'addons', sp.addons,
        'variants', sp.variants
      )
      FROM service_packages sp
      WHERE sp.id = o.service_package_id
    ),
    'professional', CASE
      WHEN o.professional_id IS NOT NULL THEN (
        SELECT jsonb_build_object(
          'id', p.id,
          'full_name', p.full_name,
          'display_name', p.display_name,
          'phone', p.phone,
          'email', p.email,
          'professional_type', p.professional_type,
          'profession_type', p.profession_type,
          'experience_years', p.experience_years,
          'avatar_url', p.avatar_url,
          'bio', p.bio
        )
        FROM professionals p
        WHERE p.id = o.professional_id
      )
      ELSE NULL
    END
  ),
  o.service_package_id
  INTO v_order, v_service_package_id
  FROM orders o
  WHERE o.id = p_order_id AND o.user_id = v_user_id;

  IF v_order IS NULL THEN
    RETURN NULL;
  END IF;

  -- Build comprehensive result with all related data
  SELECT jsonb_build_object(
    'order', v_order,
    'stage_history', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', h.id,
          'order_id', h.order_id,
          'stage_key', h.stage_key,
          'started_at', h.started_at,
          'completed_at', h.completed_at,
          'created_at', h.created_at
        )
        ORDER BY h.created_at ASC
      )
      FROM order_stage_history h
      WHERE h.order_id = p_order_id),
      '[]'::jsonb
    ),
    'documents', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', d.id,
          'order_id', d.order_id,
          'document_key', d.document_key,
          'document_label', d.document_label,
          'stage_key', d.stage_key,
          'is_required', d.is_required,
          'uploaded_at', d.uploaded_at,
          'file_url', d.file_url,
          'file_name', d.file_name,
          'verified_at', d.verified_at,
          'verified_by', d.verified_by,
          'rejection_reason', d.rejection_reason,
          'created_at', d.created_at
        )
        ORDER BY d.created_at ASC
      )
      FROM order_documents d
      WHERE d.order_id = p_order_id),
      '[]'::jsonb
    ),
    'work_documents', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', w.id,
          'order_id', w.order_id,
          'round_id', w.round_id,
          'document_key', w.document_key,
          'document_label', w.document_label,
          'stage_key', w.stage_key,
          'direction', w.direction,
          'status', w.status,
          'tag', w.tag,
          'file_url', w.file_url,
          'file_name', w.file_name,
          'notes', w.notes,
          'created_at', w.created_at,
          'updated_at', w.updated_at
        )
        ORDER BY w.created_at DESC
      )
      FROM order_work_documents w
      WHERE w.order_id = p_order_id AND w.round_id IS NULL),
      '[]'::jsonb
    ),
    'questionnaire_responses', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'question_key', r.question_key,
          'response_value', r.response_value
        )
      )
      FROM order_questionnaire_responses r
      WHERE r.order_id = p_order_id),
      '[]'::jsonb
    ),
    'question_labels', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'question_key', q.question_key,
          'question_label', q.question_label
        )
      )
      FROM service_questionnaires q
      WHERE q.service_package_id = v_service_package_id
        AND q.is_active = true),
      '[]'::jsonb
    ),
    'invoice_id', (
      SELECT i.id
      FROM invoices i
      WHERE i.order_id = p_order_id
      LIMIT 1
    ),
    'round_notification', (
      SELECT jsonb_build_object(
        'id', n.id,
        'order_id', n.order_id,
        'round_id', n.round_id,
        'round_title', n.round_title,
        'message', n.message,
        'is_dismissed', n.is_dismissed,
        'created_at', n.created_at
      )
      FROM round_notifications n
      WHERE n.order_id = p_order_id
        AND n.is_dismissed = false
      ORDER BY n.created_at DESC
      LIMIT 1
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$

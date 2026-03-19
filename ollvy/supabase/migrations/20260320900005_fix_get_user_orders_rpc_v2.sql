-- Fix get_user_orders RPC function - use only existing columns

CREATE OR REPLACE FUNCTION get_user_orders(
  p_statuses TEXT[] DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_orders JSON;
BEGIN
  -- Get the user ID for the current auth user
  SELECT id INTO v_user_id
  FROM users
  WHERE auth_user_id = auth.uid();

  IF v_user_id IS NULL THEN
    RETURN '[]'::JSON;
  END IF;

  -- Fetch all orders with related data
  SELECT COALESCE(json_agg(order_data ORDER BY created_at DESC), '[]'::JSON) INTO v_orders
  FROM (
    SELECT json_build_object(
      'id', o.id,
      'order_number', o.order_number,
      'user_id', o.user_id,
      'service_package_id', o.service_package_id,
      'professional_id', o.professional_id,
      'status', o.status,
      'order_type', o.order_type,
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
        SELECT json_build_object(
          'id', sp.id,
          'name', sp.name,
          'slug', sp.slug,
          'short_description', sp.short_description,
          'sla_working_days', sp.sla_working_days,
          'workflow_stages', sp.workflow_stages,
          'price_base_paisa', sp.price_base_paisa,
          'price_govt_fees_paisa', sp.price_govt_fees_paisa,
          'price_gst_rate', sp.price_gst_rate
        )
        FROM service_packages sp
        WHERE sp.id = o.service_package_id
      ),
      'professional', CASE
        WHEN o.professional_id IS NOT NULL THEN (
          SELECT json_build_object(
            'id', p.id,
            'full_name', p.full_name,
            'phone', p.phone,
            'email', p.email,
            'professional_type', p.professional_type,
            'avatar_url', p.avatar_url
          )
          FROM professionals p
          WHERE p.id = o.professional_id
        )
        ELSE NULL
      END
    ) as order_data,
    o.created_at
    FROM orders o
    WHERE o.user_id = v_user_id
      AND (p_statuses IS NULL OR o.status = ANY(p_statuses))
  ) subquery;

  RETURN v_orders;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

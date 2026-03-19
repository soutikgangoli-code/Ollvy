-- Create RPC function to fetch a user's order with full details
-- This is more reliable than RLS chains for complex queries

CREATE OR REPLACE FUNCTION get_user_order(p_order_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_order JSON;
BEGIN
  -- Get the user ID for the current auth user
  SELECT id INTO v_user_id
  FROM users
  WHERE auth_user_id = auth.uid();

  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Fetch the order with related data
  SELECT json_build_object(
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
    'chat_conversation_id', o.chat_conversation_id,
    'created_at', o.created_at,
    'updated_at', o.updated_at,
    'service_package', (
      SELECT json_build_object(
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
        SELECT json_build_object(
          'id', p.id,
          'full_name', p.full_name,
          'phone', p.phone,
          'email', p.email,
          'professional_type', p.professional_type,
          'avatar_url', p.avatar_url,
          'bio', p.bio
        )
        FROM professionals p
        WHERE p.id = o.professional_id
      )
      ELSE NULL
    END
  ) INTO v_order
  FROM orders o
  WHERE o.id = p_order_id
    AND o.user_id = v_user_id;

  RETURN v_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_order(UUID) TO authenticated;

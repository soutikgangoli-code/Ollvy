-- get_admin_order_view: single-call data fetch for the admin order detail page.
--
-- Replaces the 3-step waterfall in app/(admin)/admin/orders/[orderId]/page.tsx:
--   Step 1: serial order fetch with joins
--   Step 2: 8 parallel queries (rounds, docs, questionnaire, etc.)
--   Step 3: conditional admin_names lookup
-- with one round-trip returning all of them as a single JSONB payload.
--
-- SECURITY DEFINER: the page calls this via the service-role client, but adding
-- DEFINER (with a tightly-scoped search_path) lets us also expose it to
-- authenticated callers later without re-architecting. RLS is bypassed; the
-- caller (admin page) authenticates before invoking.

CREATE OR REPLACE FUNCTION get_admin_order_view(p_order_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_service_package_id UUID;
BEGIN
  -- Cache the order's service_package_id so we can look up its questionnaire.
  SELECT service_package_id INTO v_service_package_id FROM orders WHERE id = p_order_id;

  SELECT jsonb_build_object(
    'order', (
      SELECT to_jsonb(o.*) ||
        jsonb_build_object(
          'service_packages', (SELECT to_jsonb(sp.*) FROM service_packages sp WHERE sp.id = o.service_package_id),
          'users', (SELECT to_jsonb(u.*) FROM users u WHERE u.id = o.user_id),
          'professionals', (SELECT to_jsonb(p.*) FROM professionals p WHERE p.id = o.professional_id)
        )
      FROM orders o WHERE o.id = p_order_id
    ),
    'assigned_admin', (
      SELECT jsonb_build_object('id', a.id, 'name', a.name, 'email', a.email)
      FROM admin_users a
      JOIN orders o ON o.assigned_admin_id = a.id
      WHERE o.id = p_order_id
    ),
    'rounds', COALESCE((
      SELECT jsonb_agg(
        to_jsonb(r.*) ||
        jsonb_build_object(
          'round_question_requests', COALESCE((
            SELECT jsonb_agg(to_jsonb(rqr.*) ORDER BY rqr.position)
            FROM round_question_requests rqr WHERE rqr.round_id = r.id
          ), '[]'::jsonb),
          'order_work_documents', COALESCE((
            SELECT jsonb_agg(to_jsonb(owd.*))
            FROM order_work_documents owd WHERE owd.round_id = r.id
          ), '[]'::jsonb)
        )
        ORDER BY r.round_number
      )
      FROM order_rounds r WHERE r.order_id = p_order_id
    ), '[]'::jsonb),
    'initial_docs', COALESCE((
      SELECT jsonb_agg(to_jsonb(d.*))
      FROM order_documents d
      WHERE d.order_id = p_order_id AND d.stage_key = 'doc_collection'
    ), '[]'::jsonb),
    'questionnaire_answers', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('question_key', q.question_key, 'response_value', q.response_value))
      FROM order_questionnaire_responses q
      WHERE q.order_id = p_order_id
    ), '[]'::jsonb),
    'questionnaire_questions', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'question_key', sq.question_key,
          'question_label', sq.question_label,
          'question_type', sq.question_type,
          'options', sq.options,
          'display_order', sq.display_order
        )
        ORDER BY sq.display_order
      )
      FROM service_questionnaires sq
      WHERE sq.service_package_id = v_service_package_id
    ), '[]'::jsonb),
    'admin_notes', COALESCE((
      SELECT jsonb_agg(
        to_jsonb(n.*) ||
        jsonb_build_object(
          'admin_users', (SELECT jsonb_build_object('name', au.name) FROM admin_users au WHERE au.id = n.admin_id)
        )
        ORDER BY n.created_at DESC
      )
      FROM order_admin_notes n WHERE n.order_id = p_order_id
    ), '[]'::jsonb),
    'professionals_available', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'full_name', p.full_name,
          'display_name', p.display_name,
          'email', p.email,
          'professional_type', p.professional_type
        )
        ORDER BY p.full_name
      )
      FROM professionals p WHERE p.status = 'approved'
    ), '[]'::jsonb),
    'activity_log', COALESCE((
      SELECT jsonb_agg(to_jsonb(al.*) ORDER BY al.created_at DESC)
      FROM order_activity_log al WHERE al.order_id = p_order_id
    ), '[]'::jsonb),
    'admin_names_map', COALESCE((
      SELECT jsonb_object_agg(au.id::text, au.name)
      FROM admin_users au
      WHERE au.id IN (
        SELECT DISTINCT created_by_admin_id
        FROM order_rounds
        WHERE order_id = p_order_id AND created_by_admin_id IS NOT NULL
      )
    ), '{}'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_admin_order_view(UUID) TO authenticated, service_role;

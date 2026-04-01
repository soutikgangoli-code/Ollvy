-- Create consolidated RPC function to fetch all dashboard/profile data in one call
-- This eliminates the client-side waterfall of multiple queries on the profile page
-- Returns: active_orders, completed_orders, retainers, compliance_obligations,
--          document_counts, stage_histories, work_doc_counts

CREATE OR REPLACE FUNCTION get_user_dashboard()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_active_orders JSONB;
  v_completed_orders JSONB;
  v_retainers JSONB;
  v_compliance JSONB;
  v_doc_counts JSONB;
  v_stage_histories JSONB;
  v_work_doc_counts JSONB;
  v_document_groups JSONB;
BEGIN
  -- Get the user ID for the current auth user
  SELECT id INTO v_user_id
  FROM users
  WHERE auth_user_id = auth.uid();

  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Fetch active orders with service_package
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', o.id,
      'order_number', o.order_number,
      'status', o.status,
      'total_paisa_snapshot', o.total_paisa_snapshot,
      'created_at', o.created_at,
      'questionnaire_completed_at', o.questionnaire_completed_at,
      'service_package', (
        SELECT jsonb_build_object(
          'id', sp.id,
          'name', sp.name,
          'slug', sp.slug,
          'sla_working_days', sp.sla_working_days,
          'workflow_stages', sp.workflow_stages
        )
        FROM service_packages sp
        WHERE sp.id = o.service_package_id
      )
    )
    ORDER BY o.created_at DESC
  ), '[]'::jsonb)
  INTO v_active_orders
  FROM orders o
  WHERE o.user_id = v_user_id
    AND o.status IN ('pending_assignment', 'in_progress', 'waitlisted')
  LIMIT 5;

  -- Fetch completed orders
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', o.id,
      'order_number', o.order_number,
      'status', o.status,
      'total_paisa_snapshot', o.total_paisa_snapshot,
      'created_at', o.created_at,
      'service_package', (
        SELECT jsonb_build_object(
          'id', sp.id,
          'name', sp.name,
          'slug', sp.slug
        )
        FROM service_packages sp
        WHERE sp.id = o.service_package_id
      )
    )
    ORDER BY o.created_at DESC
  ), '[]'::jsonb)
  INTO v_completed_orders
  FROM orders o
  WHERE o.user_id = v_user_id
    AND o.status = 'completed'
  LIMIT 10;

  -- Fetch retainers
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', r.id,
      'status', r.status,
      'monthly_price_paisa', r.monthly_price_paisa,
      'next_billing_date', r.next_billing_date,
      'current_cycle_end', r.current_cycle_end,
      'service_package', (
        SELECT jsonb_build_object(
          'name', sp.name
        )
        FROM service_packages sp
        WHERE sp.id = r.service_package_id
      )
    )
  ), '[]'::jsonb)
  INTO v_retainers
  FROM retainer_subscriptions r
  WHERE r.user_id = v_user_id
    AND r.status != 'cancelled';

  -- Fetch compliance obligations
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', c.id,
      'status', c.status,
      'due_date', c.due_date
    )
  ), '[]'::jsonb)
  INTO v_compliance
  FROM compliance_obligations c
  WHERE c.user_id = v_user_id;

  -- Get all order IDs for document aggregations
  WITH all_order_ids AS (
    SELECT id FROM orders WHERE user_id = v_user_id
  ),
  active_order_ids AS (
    SELECT id FROM orders
    WHERE user_id = v_user_id
      AND status IN ('pending_assignment', 'in_progress', 'waitlisted')
  )
  SELECT
    -- Document counts by order (for progress calculation)
    COALESCE((
      SELECT jsonb_object_agg(
        order_id::text,
        jsonb_build_object('total', total_count, 'uploaded', uploaded_count)
      )
      FROM (
        SELECT
          d.order_id,
          COUNT(*) as total_count,
          COUNT(d.uploaded_at) as uploaded_count
        FROM order_documents d
        WHERE d.order_id IN (SELECT id FROM active_order_ids)
          AND d.is_required = true
        GROUP BY d.order_id
      ) counts
    ), '{}'::jsonb),
    -- Stage histories by order
    COALESCE((
      SELECT jsonb_object_agg(
        order_id::text,
        completed_count
      )
      FROM (
        SELECT
          h.order_id,
          COUNT(h.completed_at) as completed_count
        FROM order_stage_history h
        WHERE h.order_id IN (SELECT id FROM active_order_ids)
        GROUP BY h.order_id
      ) histories
    ), '{}'::jsonb),
    -- Work document counts by order
    COALESCE((
      SELECT jsonb_object_agg(
        order_id::text,
        jsonb_build_object('pending', pending_count, 'rejected', rejected_count)
      )
      FROM (
        SELECT
          w.order_id,
          COUNT(*) FILTER (WHERE w.status = 'pending') as pending_count,
          COUNT(*) FILTER (WHERE w.status = 'rejected') as rejected_count
        FROM order_work_documents w
        WHERE w.order_id IN (SELECT id FROM active_order_ids)
          AND w.direction = 'from_customer'
        GROUP BY w.order_id
      ) work_docs
    ), '{}'::jsonb),
    -- Document groups for vault (all orders with uploaded docs)
    COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'order_id', vault_data.order_id,
          'order_number', vault_data.order_number,
          'service_name', vault_data.service_name,
          'documents', vault_data.documents
        )
      )
      FROM (
        SELECT
          o.id as order_id,
          o.order_number,
          (SELECT sp.name FROM service_packages sp WHERE sp.id = o.service_package_id) as service_name,
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'id', d.id,
                'name', COALESCE(d.document_label, d.file_name, 'Document'),
                'type', CASE WHEN d.verified_at IS NOT NULL THEN 'deliverable' ELSE 'input' END,
                'url', d.file_url,
                'uploaded_at', d.uploaded_at
              )
              ORDER BY d.uploaded_at DESC
            )
            FROM order_documents d
            WHERE d.order_id = o.id AND d.file_url IS NOT NULL
          ) as documents
        FROM orders o
        WHERE o.user_id = v_user_id
          AND EXISTS (
            SELECT 1 FROM order_documents d
            WHERE d.order_id = o.id AND d.file_url IS NOT NULL
          )
        ORDER BY o.created_at DESC
      ) vault_data
    ), '[]'::jsonb)
  INTO v_doc_counts, v_stage_histories, v_work_doc_counts, v_document_groups;

  -- Build and return comprehensive result
  RETURN jsonb_build_object(
    'active_orders', v_active_orders,
    'completed_orders', v_completed_orders,
    'retainers', v_retainers,
    'compliance', v_compliance,
    'doc_counts', v_doc_counts,
    'stage_histories', v_stage_histories,
    'work_doc_counts', v_work_doc_counts,
    'document_groups', v_document_groups
  );
END;
$$

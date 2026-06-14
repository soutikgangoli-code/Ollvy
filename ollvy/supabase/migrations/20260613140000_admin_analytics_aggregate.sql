-- Analytics dashboard summed revenue and grouped top-services in JS after
-- fetching every matching order row. Do it in SQL instead.

CREATE OR REPLACE FUNCTION get_admin_analytics(
  p_today timestamptz,
  p_thirty timestamptz
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'revTodayPaisa', COALESCE((
      SELECT SUM(total_paisa_snapshot) FROM orders
      WHERE paid_at >= p_today AND status <> 'cancelled'
    ), 0),
    'revAllPaisa', COALESCE((
      SELECT SUM(total_paisa_snapshot) FROM orders
      WHERE paid_at IS NOT NULL AND status <> 'cancelled'
    ), 0),
    'topServices', COALESCE((
      SELECT jsonb_agg(s ORDER BY s_count DESC)
      FROM (
        SELECT
          jsonb_build_object(
            'name', COALESCE(sp.name, o.service_package_id::text),
            'count', COUNT(*),
            'revenue', COALESCE(SUM(o.total_paisa_snapshot), 0)
          ) AS s,
          COUNT(*) AS s_count
        FROM orders o
        LEFT JOIN service_packages sp ON sp.id = o.service_package_id
        WHERE o.paid_at >= p_thirty AND o.status <> 'cancelled'
        GROUP BY o.service_package_id, sp.name
        ORDER BY COUNT(*) DESC
        LIMIT 10
      ) t
    ), '[]'::jsonb)
  );
$$;

GRANT EXECUTE ON FUNCTION get_admin_analytics(timestamptz, timestamptz) TO service_role;

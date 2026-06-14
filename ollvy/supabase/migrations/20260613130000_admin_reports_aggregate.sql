-- Admin reports were computed in JS over a 1000-row-capped fetch, so revenue
-- totals silently undercounted once a 90-day window exceeded 1000 paid orders.
-- Compute the summaries + per-user revenue in SQL over ALL matching rows.

CREATE OR REPLACE FUNCTION get_admin_reports(
  p_since timestamptz,
  p_today timestamptz,
  p_week timestamptz,
  p_month timestamptz
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH paid AS (
    SELECT
      o.total_paisa_snapshot AS total,
      COALESCE(o.price_govt_fees_paisa_snapshot, 0) AS govt,
      o.total_paisa_snapshot - COALESCE(o.price_govt_fees_paisa_snapshot, 0) AS ollvy,
      o.paid_at,
      o.user_id
    FROM orders o
    WHERE o.paid_at IS NOT NULL
      AND o.status <> 'cancelled'
      AND o.paid_at >= p_since
  ),
  summ AS (
    SELECT
      jsonb_build_object(
        'totalRevenue', COALESCE(SUM(total), 0),
        'platformRevenue', COALESCE(SUM(ollvy), 0),
        'govtFees', COALESCE(SUM(govt), 0),
        'orderCount', COUNT(*)
      ) AS all_s,
      jsonb_build_object(
        'totalRevenue', COALESCE(SUM(total) FILTER (WHERE paid_at >= p_today), 0),
        'platformRevenue', COALESCE(SUM(ollvy) FILTER (WHERE paid_at >= p_today), 0),
        'govtFees', COALESCE(SUM(govt) FILTER (WHERE paid_at >= p_today), 0),
        'orderCount', COUNT(*) FILTER (WHERE paid_at >= p_today)
      ) AS today_s,
      jsonb_build_object(
        'totalRevenue', COALESCE(SUM(total) FILTER (WHERE paid_at >= p_week), 0),
        'platformRevenue', COALESCE(SUM(ollvy) FILTER (WHERE paid_at >= p_week), 0),
        'govtFees', COALESCE(SUM(govt) FILTER (WHERE paid_at >= p_week), 0),
        'orderCount', COUNT(*) FILTER (WHERE paid_at >= p_week)
      ) AS week_s,
      jsonb_build_object(
        'totalRevenue', COALESCE(SUM(total) FILTER (WHERE paid_at >= p_month), 0),
        'platformRevenue', COALESCE(SUM(ollvy) FILTER (WHERE paid_at >= p_month), 0),
        'govtFees', COALESCE(SUM(govt) FILTER (WHERE paid_at >= p_month), 0),
        'orderCount', COUNT(*) FILTER (WHERE paid_at >= p_month)
      ) AS month_s
    FROM paid
  ),
  by_user AS (
    SELECT COALESCE(jsonb_agg(r ORDER BY r_total DESC), '[]'::jsonb) AS rows
    FROM (
      SELECT
        jsonb_build_object(
          'userId', p.user_id,
          'name', COALESCE(us.business_name, 'Unknown'),
          'orderCount', COUNT(*),
          'totalSpent', SUM(p.total),
          'ollvyFees', SUM(p.ollvy),
          'govtFees', SUM(p.govt)
        ) AS r,
        SUM(p.total) AS r_total
      FROM paid p
      LEFT JOIN users us ON us.id = p.user_id
      WHERE p.user_id IS NOT NULL
      GROUP BY p.user_id, us.business_name
      ORDER BY SUM(p.total) DESC
      LIMIT 500
    ) ranked
  )
  SELECT jsonb_build_object(
    'summaryAll', summ.all_s,
    'summaryToday', summ.today_s,
    'summaryWeek', summ.week_s,
    'summaryMonth', summ.month_s,
    'revenueByUser', by_user.rows
  )
  FROM summ, by_user;
$$;

GRANT EXECUTE ON FUNCTION get_admin_reports(timestamptz, timestamptz, timestamptz, timestamptz) TO service_role;

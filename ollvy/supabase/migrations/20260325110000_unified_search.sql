-- Unified admin search - searches orders and users
create or replace function search_admin_unified(
  search_query text,
  assigned_admin_id_filter uuid default null
)
returns table (
  result_type text,
  id uuid,
  primary_text text,
  secondary_text text,
  tertiary_text text,
  status text,
  amount_paisa int,
  created_at timestamptz
)
language sql stable as $$
  -- Search orders
  select
    'order'::text as result_type,
    o.id,
    o.order_number as primary_text,
    sp.name as secondary_text,
    u.business_name as tertiary_text,
    o.status::text,
    o.total_paisa_snapshot as amount_paisa,
    o.paid_at as created_at
  from orders o
  join service_packages sp on sp.id = o.service_package_id
  join users u on u.id = o.user_id
  where o.paid_at is not null
  and (
    search_query = '' or
    o.order_number ilike '%' || search_query || '%'
    or u.business_name ilike '%' || search_query || '%'
    or u.phone ilike '%' || search_query || '%'
    or sp.name ilike '%' || search_query || '%'
  )
  and (assigned_admin_id_filter is null or o.assigned_admin_id = assigned_admin_id_filter)

  union all

  -- Search users
  select
    'user'::text as result_type,
    u.id,
    coalesce(u.business_name, 'Unnamed User') as primary_text,
    u.email as secondary_text,
    u.phone as tertiary_text,
    null::text as status,
    null::int as amount_paisa,
    u.created_at
  from users u
  where (
    search_query = '' or
    u.business_name ilike '%' || search_query || '%'
    or u.email ilike '%' || search_query || '%'
    or u.phone ilike '%' || search_query || '%'
  )

  order by created_at desc nulls last
  limit 50;
$$;

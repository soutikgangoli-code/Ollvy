-- Admin Enhancements Migration
-- Document: ollvy_admin_enhancements.md

-- Migration 1: New columns on orders
alter table orders
  add column if not exists assigned_admin_id uuid references admin_users(id) on delete set null,
  add column if not exists expected_completion_date date,
  add column if not exists cancellation_reason text,
  add column if not exists cancellation_reason_detail text;

-- Migration 2: New columns on order_rounds
alter table order_rounds
  add column if not exists user_response_deadline timestamptz,
  add column if not exists deadline_extended_count integer not null default 0,
  add column if not exists deadline_manually_overridden boolean not null default false;

-- Migration 3: New columns on order_documents
alter table order_documents
  add column if not exists internal_note text,
  add column if not exists internal_note_by uuid references admin_users(id) on delete set null,
  add column if not exists internal_note_at timestamptz;

-- Migration 4: New columns on order_work_documents
alter table order_work_documents
  add column if not exists internal_note text,
  add column if not exists internal_note_by uuid references admin_users(id) on delete set null,
  add column if not exists internal_note_at timestamptz;

-- Migration 5: SKIPPED - sla_working_days already exists on service_packages

-- Migration 6: order_activity_log
create table if not exists order_activity_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  action_type text not null,
  actor_type text not null default 'admin',
  -- actor_type: 'admin' | 'system' | 'user'
  actor_id uuid,
  -- references admin_users.id for admin actions, null for system actions
  actor_name text not null,
  -- denormalized: store name at time of action so history is preserved even if admin is deleted
  description text not null,
  metadata jsonb,
  -- store extra context: old_value, new_value, document_label, reason, etc.
  created_at timestamptz not null default now()
);

-- No user-facing RLS needed. Admin reads via service role key.
-- Enable RLS but add no user policies.
alter table order_activity_log enable row level security;

-- Migration 7: order_admin_assignment_history
create table if not exists order_admin_assignment_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  assigned_to_admin_id uuid references admin_users(id) on delete set null,
  assigned_by_admin_id uuid references admin_users(id) on delete set null,
  assigned_to_name text not null,
  assigned_by_name text not null,
  assigned_at timestamptz not null default now(),
  unassigned_at timestamptz
);

alter table order_admin_assignment_history enable row level security;

-- Migration 8: order_professional_assignment_history
create table if not exists order_professional_assignment_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  professional_id uuid references professionals(id) on delete set null,
  assigned_by_admin_id uuid references admin_users(id) on delete set null,
  professional_name text not null,
  assigned_by_name text not null,
  assigned_at timestamptz not null default now(),
  unassigned_at timestamptz
);

alter table order_professional_assignment_history enable row level security;

-- Migration 9: Enable realtime on activity log
alter publication supabase_realtime add table order_activity_log;

-- Migration 10: SLA trigger - set expected_completion_date when order is paid
create or replace function set_order_sla()
returns trigger language plpgsql as $$
declare
  v_sla_days integer;
begin
  if NEW.paid_at is not null and OLD.paid_at is null then
    -- Column is sla_working_days (confirmed exists on service_packages)
    -- All 33 service_packages confirmed to have sla_working_days set (range: 2-90 days)
    -- coalesce fallback to 7 is a safety net only and will not trigger in practice
    select coalesce(sla_working_days, 7)
    into v_sla_days
    from service_packages
    where id = NEW.service_package_id;

    NEW.expected_completion_date := (NEW.paid_at::date + v_sla_days * interval '1 day')::date;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trigger_set_order_sla on orders;
create trigger trigger_set_order_sla
  before update of paid_at on orders
  for each row
  when (OLD.paid_at is null and NEW.paid_at is not null)
  execute function set_order_sla();

-- Migration 11: Search orders RPC function
create or replace function search_orders(
  search_query text,
  status_filter text default null,
  pending_filter text default null,
  assigned_admin_id_filter uuid default null
)
returns table (
  id uuid, order_number text, status text, total_paisa_snapshot int,
  paid_at timestamptz, service_name text, user_name text, user_phone text,
  professional_name text, assigned_admin_id uuid
)
language sql stable as $$
  select
    o.id, o.order_number, o.status::text, o.total_paisa_snapshot,
    o.paid_at, sp.name, u.business_name, u.phone,
    p.full_name, o.assigned_admin_id
  from orders o
  join service_packages sp on sp.id = o.service_package_id
  join users u on u.id = o.user_id
  left join professionals p on p.id = o.professional_id
  where o.paid_at is not null
  and (
    search_query = '' or
    o.order_number ilike '%' || search_query || '%'
    or u.business_name ilike '%' || search_query || '%'
    or u.phone ilike '%' || search_query || '%'
    or sp.name ilike '%' || search_query || '%'
    or p.full_name ilike '%' || search_query || '%'
  )
  and (status_filter is null or o.status::text = status_filter)
  and (assigned_admin_id_filter is null or o.assigned_admin_id = assigned_admin_id_filter)
  and (
    pending_filter is null
    or (
      pending_filter = 'pending_admin'
      and o.status = 'in_progress'
      and not exists (
        select 1 from order_rounds r
        where r.order_id = o.id and r.status = 'awaiting_user'
      )
    )
    or (
      pending_filter = 'pending_user'
      and exists (
        select 1 from order_rounds r
        where r.order_id = o.id and r.status = 'awaiting_user'
        and (r.user_response_deadline is null or r.user_response_deadline < now())
      )
    )
  )
  order by o.paid_at desc
  limit 50;
$$;

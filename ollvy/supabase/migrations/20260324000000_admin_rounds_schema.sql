-- Migration 1: order_rounds (create first - other tables reference it)
create table if not exists order_rounds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  created_by_admin_id uuid references admin_users(id) on delete set null,
  round_number integer not null,
  title text not null,
  status text not null default 'pending',
  -- pending | awaiting_user | active | completed
  is_visible_to_user boolean not null default true,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint order_rounds_unique_number unique (order_id, round_number)
);

alter table order_rounds enable row level security;

-- RLS: users can select their own order's rounds
create policy "users_select_own_rounds" on order_rounds for select
using (
  exists (
    select 1 from orders o
    where o.id = order_rounds.order_id
    and o.user_id = (select id from users where auth_user_id = auth.uid())
  )
);

-- RLS: professionals can select assigned order's rounds
create policy "professionals_select_assigned_rounds" on order_rounds for select
using (
  exists (
    select 1 from orders o
    where o.id = order_rounds.order_id
    and o.professional_id = (select id from professionals where auth_user_id = auth.uid())
  )
);

-- Migration 2: round_question_requests
create table if not exists round_question_requests (
  id uuid primary key default gen_random_uuid(),
  round_id uuid references order_rounds(id) on delete cascade not null,
  question_text text not null,
  answer_text text,
  answered_at timestamptz,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table round_question_requests enable row level security;

create policy "users_select_own_round_questions" on round_question_requests for select
using (
  exists (
    select 1 from order_rounds r
    join orders o on o.id = r.order_id
    where r.id = round_question_requests.round_id
    and o.user_id = (select id from users where auth_user_id = auth.uid())
  )
);

create policy "users_update_own_round_questions" on round_question_requests for update
using (
  exists (
    select 1 from order_rounds r
    join orders o on o.id = r.order_id
    where r.id = round_question_requests.round_id
    and o.user_id = (select id from users where auth_user_id = auth.uid())
  )
)
with check (true);

-- Migration 3: round_notifications
create table if not exists round_notifications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  round_id uuid references order_rounds(id) on delete cascade,
  message text not null,
  is_dismissed boolean not null default false,
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table round_notifications enable row level security;

create policy "users_select_own_notifications" on round_notifications for select
using (
  exists (
    select 1 from orders o
    where o.id = round_notifications.order_id
    and o.user_id = (select id from users where auth_user_id = auth.uid())
  )
);

create policy "users_update_own_notifications" on round_notifications for update
using (
  exists (
    select 1 from orders o
    where o.id = round_notifications.order_id
    and o.user_id = (select id from users where auth_user_id = auth.uid())
  )
)
with check (true);

-- Migration 4: order_admin_notes
create table if not exists order_admin_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  admin_id uuid references admin_users(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now()
);
-- NO RLS policies for user or professional role
-- Admin accesses via service role key only
-- Enable row level security but add NO user-facing policies
alter table order_admin_notes enable row level security;

-- Migration 5: alter order_work_documents
alter table order_work_documents
  add column if not exists round_id uuid references order_rounds(id) on delete set null,
  add column if not exists tag text,
  -- tag values (to_customer only): for_signing | government_processing | final_output | informational
  add column if not exists linked_request_id uuid references order_work_documents(id) on delete set null,
  add column if not exists skipped_at timestamptz,
  add column if not exists skip_reason text;

-- Migration 6: alter orders
alter table orders
  add column if not exists dispute_outcome text;
  -- values: refund | continue | closed

-- Migration 7: Round 0 auto-creation trigger
-- Confirmed: razorpay-webhook sets paid_at via UPDATE (not INSERT). The UPDATE trigger is sufficient.
create or replace function create_round_zero()
returns trigger language plpgsql as $$
begin
  if NEW.paid_at is not null and (OLD.paid_at is null) then
    insert into order_rounds (order_id, round_number, title, status, is_visible_to_user)
    values (NEW.id, 0, 'Initial Submission', 'completed', true)
    on conflict (order_id, round_number) do nothing;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trigger_create_round_zero on orders;
create trigger trigger_create_round_zero
  after update of paid_at on orders
  for each row execute function create_round_zero();

-- Backfill for existing paid orders
insert into order_rounds (order_id, round_number, title, status, is_visible_to_user)
select id, 0, 'Initial Submission', 'completed', true
from orders where paid_at is not null
on conflict (order_id, round_number) do nothing;

-- Migration 8: Enable realtime
alter publication supabase_realtime add table order_rounds;
alter publication supabase_realtime add table round_notifications;
alter publication supabase_realtime add table order_admin_notes;
-- chat_messages already has realtime via ChatWindow

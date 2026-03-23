# Ollvy Admin Enhancements - Full Build Instructions

## BEFORE YOU START: Prerequisites

This is Document 3 of 3. Before building anything in this file:
1. All migrations from `ollvy_admin_build.md` (Document 1) must already be run.
2. The entire admin panel from Document 1 must already be built and working.
3. `lib/admin/get-admin-user.ts` must exist (built in Document 1).
4. `lib/admin/log-activity.ts` is created in THIS file (Feature 2). Until it is built,
   other features that call `logActivity` should stub it out as a no-op.
5. Run migrations in this file AFTER Document 1 migrations -- they add columns
   to tables created in Document 1.

Build all items below. Do not change any customer-facing UI except where explicitly
stated (cancellation banner only). Do not use em dashes anywhere in code or copy.
All formatting uses `formatPaisa`, `formatDate`, `formatDateTime` from `@/lib/utils`.
Do not add a second `<Toaster />` -- already in root layout.
Do not import `auth-store` or `questionnaire-store` in admin components.

## CRITICAL ARCHITECTURE: Server Actions for All Mutations

`supabaseServer` (service role) cannot be called from client components. It only
works in server components and Next.js server actions.

Every mutation in this file that shows `supabaseServer.from(...).insert/update/delete`
inside a button handler, click handler, or form submission must be implemented as a
server action:

```ts
// Pattern: create actions.ts files alongside page files
// apps/customer/app/(admin)/admin/queue/actions.ts
'use server'
import { supabaseServer } from '@/lib/supabase-server'
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function bulkAssignOrders(orderIds: string[], adminId: string, adminName: string) {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')
  if (!supabaseServer) throw new Error('Service client unavailable')
  // ... mutation logic here using supabaseServer
}
```

Page-specific server actions go in `actions.ts` alongside the page file.
Shared admin actions go in `apps/customer/lib/admin/actions.ts`.

All `logActivity` calls also go inside server actions since they use `supabaseServer`.

Read fetches (SELECT queries) in server components: use `supabaseServer` directly.
Mutations from client components: always via server actions.
Client-side reads (realtime, user-triggered lookups): use `getClient()` only.

Every server action that needs to know who the current admin is must call:

```ts
import { getAdminUser } from '@/lib/admin/get-admin-user'
// Built in ollvy_admin_build.md -- Admin Context Pattern section
```

This gives `adminUser.id`, `adminUser.name`, `adminUser.role`, `adminUser.auth_user_id`.
Do NOT pass adminUser as a prop into server actions -- re-fetch it from the session each time.
This ensures auth is always re-verified on every mutation.

---

## Step 0: Check Before Building

Before writing any code, verify:

```sql
-- 1. Does orders have assigned_admin_id already?
select column_name from information_schema.columns
where table_name = 'orders' and column_name = 'assigned_admin_id';

-- 2. Confirm sla_working_days exists (it does -- skip migration 5)
select column_name, data_type from information_schema.columns
where table_name = 'service_packages' and column_name = 'sla_working_days';

-- 3. Check what trigger_create_work_documents_on_professional_assignment does
-- (important before building professional assignment)
select prosrc from pg_proc
where proname = 'create_work_documents_on_professional_assignment';
```

---

## Migrations (run in this order)

### Migration 1: New columns on orders
```sql
alter table orders
  add column if not exists assigned_admin_id uuid references admin_users(id) on delete set null,
  add column if not exists expected_completion_date date,
  add column if not exists cancellation_reason text,
  add column if not exists cancellation_reason_detail text;
```

### Migration 2: New columns on order_rounds
```sql
alter table order_rounds
  add column if not exists user_response_deadline timestamptz,
  add column if not exists deadline_extended_count integer not null default 0,
  add column if not exists deadline_manually_overridden boolean not null default false;
```

### Migration 3: New columns on order_documents
```sql
alter table order_documents
  add column if not exists internal_note text,
  add column if not exists internal_note_by uuid references admin_users(id) on delete set null,
  add column if not exists internal_note_at timestamptz;
```

### Migration 4: New columns on order_work_documents
```sql
alter table order_work_documents
  add column if not exists internal_note text,
  add column if not exists internal_note_by uuid references admin_users(id) on delete set null,
  add column if not exists internal_note_at timestamptz;
```

### Migration 5: sla_working_days on service_packages

SKIP THIS MIGRATION. The column `sla_working_days` already exists on `service_packages`
as confirmed by schema inspection. Do not add it again.

### Migration 6: order_activity_log
```sql
create table order_activity_log (
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
```

### Migration 7: order_admin_assignment_history
```sql
create table order_admin_assignment_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  assigned_to_admin_id uuid references admin_users(id) on delete set null,
  assigned_by_admin_id uuid references admin_users(id) on delete set null,
  assigned_to_name text not null,
  assigned_by_name text not null,
  assigned_at timestamptz not null default now(),
  unassigned_at timestamptz
);
```

### Migration 8: order_professional_assignment_history
```sql
create table order_professional_assignment_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  professional_id uuid references professionals(id) on delete set null,
  assigned_by_admin_id uuid references admin_users(id) on delete set null,
  professional_name text not null,
  assigned_by_name text not null,
  assigned_at timestamptz not null default now(),
  unassigned_at timestamptz
);
```

### Migration 9: Enable realtime on activity log
```sql
alter publication supabase_realtime add table order_activity_log;
```

---

## TypeScript Types to Add (`lib/types.ts`)

```ts
export interface OrderActivityLog {
  id: string
  order_id: string
  action_type: string
  actor_type: 'admin' | 'system' | 'user'
  actor_id?: string
  actor_name: string
  description: string
  metadata?: Record<string, any>
  created_at: string
}

export interface OrderAdminAssignmentHistory {
  id: string
  order_id: string
  assigned_to_admin_id?: string
  assigned_by_admin_id?: string
  assigned_to_name: string
  assigned_by_name: string
  assigned_at: string
  unassigned_at?: string
}
```

---

## Activity Log Helper (`lib/admin/log-activity.ts`)

Create this helper and import it from every admin action that should be logged.
Never log from client components -- always server-side.

Import in every `actions.ts` server action file:
```ts
import { logActivity, LOG_ACTIONS } from '@/lib/admin/log-activity'
```

```ts
import { supabaseServer } from '@/lib/supabase-server'

interface LogActivityParams {
  orderId: string
  actionType: string
  actorType: 'admin' | 'system' | 'user'
  actorId?: string
  actorName: string
  description: string
  metadata?: Record<string, any>
}

export async function logActivity(params: LogActivityParams) {
  if (!supabaseServer) return
  await supabaseServer.from('order_activity_log').insert({
    order_id: params.orderId,
    action_type: params.actionType,
    actor_type: params.actorType,
    actor_id: params.actorId ?? null,
    actor_name: params.actorName,
    description: params.description,
    metadata: params.metadata ?? null,
    created_at: new Date().toISOString(),
  })
}
```

**Every action below must call `logActivity` after the DB change. This is not optional.**

Action type constants (use these strings consistently):
```ts
export const LOG_ACTIONS = {
  ORDER_PAID: 'order_paid',
  STATUS_CHANGED: 'status_changed',
  ADMIN_ASSIGNED: 'admin_assigned',
  ADMIN_REASSIGNED: 'admin_reassigned',
  PROFESSIONAL_ASSIGNED: 'professional_assigned',
  PROFESSIONAL_REASSIGNED: 'professional_reassigned',
  ROUND_CREATED: 'round_created',
  ROUND_COMPLETED: 'round_completed',
  DOCUMENT_UPLOADED: 'document_uploaded',
  DOCUMENT_VERIFIED: 'document_verified',
  DOCUMENT_REJECTED: 'document_rejected',
  DOCUMENT_SKIPPED: 'document_skipped',
  ADMIN_UPLOAD_ADDED: 'admin_upload_added',
  QUESTION_ADDED: 'question_added',
  QUESTION_ANSWERED: 'question_answered',
  NOTE_ADDED: 'note_added',
  DISPUTE_OPENED: 'dispute_opened',
  DISPUTE_RESOLVED: 'dispute_resolved',
  ORDER_COMPLETED: 'order_completed',
  ORDER_CANCELLED: 'order_cancelled',
  SLA_AUTO_EXTENDED: 'sla_auto_extended',
  SLA_MANUALLY_OVERRIDDEN: 'sla_manually_overridden',
  CANCELLATION_NOTIFIED: 'cancellation_notified',
}
```

---

## Feature 1: Global Search

### New page: `app/(admin)/admin/search/page.tsx`

Server component. Accepts `?q=` and `?status=` and `?pending=` query params.

```ts
// At the top of the page server component:
import { getAdminUser } from '@/lib/admin/get-admin-user'

export default async function AdminSearchPage({ searchParams }) {
  const adminUser = await getAdminUser()
  const q = searchParams?.q ?? ''
  const statusFilter = searchParams?.status ?? null
  const pendingFilter = searchParams?.pending ?? null

  // Non-super_admin can only search their own assigned orders
  // Add assigned_admin_id filter if not super_admin:
  const assignedFilter = adminUser.role !== 'super_admin' ? adminUser.id : null
  // Pass assignedFilter to the RPC or query below
```

```ts
// Query
const results = await supabaseServer
  .from('orders')
  .select(`
    id, order_number, status, total_paisa_snapshot, paid_at,
    assigned_admin_id,
    service_packages (name),
    users (business_name, phone),
    professionals (full_name)
  `)
  .or(`order_number.ilike.%${q}%`)
  // Also search via users join -- for name/phone search, use a separate query
  // or create a Supabase RPC get_order_search_results(query TEXT, status_filter TEXT)
  .order('paid_at', { ascending: false })
  .limit(50)
```

If a single `ilike` on order_number is not sufficient to search user name and phone,
create a Supabase RPC:

```sql
create or replace function search_orders(
  search_query text,
  status_filter text default null,
  pending_filter text default null
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
  where (
    o.order_number ilike '%' || search_query || '%'
    or u.business_name ilike '%' || search_query || '%'
    or u.phone ilike '%' || search_query || '%'
    or sp.name ilike '%' || search_query || '%'
    or p.full_name ilike '%' || search_query || '%'
  )
  and (status_filter is null or o.status::text = status_filter)
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

-- Add an assigned_admin_id parameter to the RPC for non-super_admin filtering:
-- When called by non-super_admin: pass assigned_admin_id = adminUser.id
-- When called by super_admin: pass assigned_admin_id = null (no filter)
-- Add to the WHERE clause:
-- and (assigned_admin_id_filter is null or o.assigned_admin_id = assigned_admin_id_filter)
```

### Search bar in AdminNav

Add a search input directly inside the existing `AdminNav` client component
(from `ollvy_admin_build.md`). No separate component needed.

```tsx
// Inside AdminNav, add to the right side of the nav (between links and logout button):
const [searchQuery, setSearchQuery] = useState('')
const router = useRouter()

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault()
  if (searchQuery.trim()) {
    router.push(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }
}

// In the JSX, add between the nav links and the admin name:
<form onSubmit={handleSearch} className="flex items-center gap-2">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search orders, users..."
    className="h-8 w-48 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
  />
</form>
```

### Search results page UI

Filter bar at top:
- Status tabs: All / Active / Completed / Cancelled
- Pending filter: All / Pending on us / Pending on user
- Results count: "42 results for 'rahul'"

Results list: same row format as the queue (order number, service, user name, amount,
status badge, paid date). Each row links to the order view. Sort: newest paid first,
always.

---

## Feature 2: Activity Log on Order View

### Display component: `components/admin/OrderActivityLog.tsx`

Client component with realtime subscription.

```tsx
'use client'
import { useEffect, useState } from 'react'
import { getClient } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'

export function OrderActivityLog({ orderId }: { orderId: string }) {
  const [entries, setEntries] = useState([])
  const [expanded, setExpanded] = useState(false)
  const supabase = getClient()

  useEffect(() => {
    supabase
      .from('order_activity_log')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setEntries(data || []))

    const channel = supabase
      .channel(`activity-${orderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'order_activity_log',
        filter: `order_id=eq.${orderId}`,
      }, (payload) => {
        setEntries(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [orderId])

  const preview = entries.slice(0, 5)
  const rest = entries.slice(5)

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
        Activity Log
        <span className="text-xs text-muted-foreground font-normal">
          ({entries.length} entries)
        </span>
      </h3>

      <div className="space-y-3">
        {preview.map(entry => (
          <ActivityEntry key={entry.id} entry={entry} />
        ))}
      </div>

      {rest.length > 0 && (
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="mt-2 text-xs">
              {expanded ? 'Show less' : `View ${rest.length} more entries`}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-3 mt-3">
              {rest.map(entry => (
                <ActivityEntry key={entry.id} entry={entry} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

function ActivityEntry({ entry }: { entry: any }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-foreground leading-snug">{entry.description}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDateTime(entry.created_at)}
        </p>
      </div>
    </div>
  )
}
```

Add `<OrderActivityLog orderId={orderId} />` at the bottom of the left panel in the
order view, below internal notes.

### Wire logActivity into every existing admin action

Go through every server action and server component in `app/(admin)/` and add
`logActivity` calls after each DB mutation. Examples:

```ts
// After status change:
await logActivity({
  orderId,
  actionType: LOG_ACTIONS.STATUS_CHANGED,
  actorType: 'admin',
  actorId: adminUser.id,
  actorName: adminUser.name,
  description: `Status changed from ${oldStatus} to ${newStatus}`,
  metadata: { from: oldStatus, to: newStatus },
})

// After document verified:
await logActivity({
  orderId,
  actionType: LOG_ACTIONS.DOCUMENT_VERIFIED,
  actorType: 'admin',
  actorId: adminUser.id,
  actorName: adminUser.name,
  description: `Document verified: ${documentLabel}`,
  metadata: { document_label: documentLabel, document_id: documentId },
})

// After document rejected:
await logActivity({
  orderId,
  actionType: LOG_ACTIONS.DOCUMENT_REJECTED,
  actorType: 'admin',
  actorId: adminUser.id,
  actorName: adminUser.name,
  description: `Document rejected: ${documentLabel} -- ${getRejectionLabel(rejectionReason)}`,
  metadata: { document_label: documentLabel, rejection_reason: rejectionReason },
})

// After round created:
await logActivity({
  orderId,
  actionType: LOG_ACTIONS.ROUND_CREATED,
  actorType: 'admin',
  actorId: adminUser.id,
  actorName: adminUser.name,
  description: `Round ${roundNumber} created: ${roundTitle}`,
  metadata: { round_number: roundNumber, round_title: roundTitle },
})

// After admin note added:
await logActivity({
  orderId,
  actionType: LOG_ACTIONS.NOTE_ADDED,
  actorType: 'admin',
  actorId: adminUser.id,
  actorName: adminUser.name,
  description: `Internal note added by ${adminUser.name}`,
})
```

---

## Feature 3: Bulk Assignment

### Changes to the Queue page (`app/(admin)/admin/queue/page.tsx`)

The queue is currently a server component. The bulk assignment interaction requires
client state. Extract the order list into a client component:
`components/admin/QueueOrderList.tsx`.

**Bulk assign flow:**

A "Bulk assign" button sits above the order list (always visible to super_admin).
Clicking it opens a `Popover` with a searchable list of active admin_users and their
current assigned order counts.

```tsx
// Fetch admin users with their current load
const { data: adminUsers } = await supabaseServer
  .from('admin_users')
  .select('id, name, email, is_active')
  .eq('is_active', true)
  .neq('id', currentAdminUser.id) // can exclude self if desired, but optional
  .order('name')

// For each admin user, count their active orders
const adminWithCounts = await Promise.all(
  adminUsers.map(async (admin) => {
    const { count } = await supabaseServer
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('assigned_admin_id', admin.id)
      .not('status', 'in', '(completed,cancelled)')  // PostgREST syntax: no quotes around values
    return { ...admin, activeOrderCount: count ?? 0 }
  })
)
```

Display each admin in the dropdown as:
```
Anjali Sharma       3 active orders
Rahul Ops           7 active orders
Priya CA            1 active order
```

**After selecting a person from the dropdown, checkboxes appear on order rows.**

State:
```ts
const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null)
const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set())
```

When `selectedAdmin` is not null: render a checkbox at the start of each order row.
When `selectedAdmin` is null: no checkboxes visible.

"Select all" checkbox in the list header when checkboxes are visible.

Floating confirmation bar at bottom of screen when `selectedOrderIds.size > 0`:
```tsx
<div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between shadow-lg z-50">
  <span className="text-sm font-medium">
    {selectedOrderIds.size} order{selectedOrderIds.size !== 1 ? 's' : ''} selected
    to assign to {selectedAdmin.name}
  </span>
  <div className="flex gap-3">
    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
    <Button onClick={handleBulkAssign}>
      Assign {selectedOrderIds.size} order{selectedOrderIds.size !== 1 ? 's' : ''}
    </Button>
  </div>
</div>
```

On confirm (this entire block is a server action -- `actions.ts` in the queue folder):

```ts
export async function bulkAssignOrders(
  orderIds: string[],
  assignToAdminId: string,
  assignToAdminName: string
) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')
  const now = new Date().toISOString()

  // Step 1: Batch update all selected orders in one query
  await supabaseServer
    .from('orders')
    .update({ assigned_admin_id: assignToAdminId })
    .in('id', orderIds)

  // Step 2: Batch close all open assignment history rows in one query
  await supabaseServer
    .from('order_admin_assignment_history')
    .update({ unassigned_at: now })
    .in('order_id', orderIds)
    .is('unassigned_at', null)

  // Step 3: Batch insert new history rows in one query
  await supabaseServer
    .from('order_admin_assignment_history')
    .insert(
      orderIds.map(orderId => ({
        order_id: orderId,
        assigned_to_admin_id: assignToAdminId,
        assigned_by_admin_id: adminUser.id,
        assigned_to_name: assignToAdminName,
        assigned_by_name: adminUser.name,
        assigned_at: now,
      }))
    )

  // Step 4: Batch insert activity log rows in one query
  await supabaseServer
    .from('order_activity_log')
    .insert(
      orderIds.map(orderId => ({
        order_id: orderId,
        action_type: LOG_ACTIONS.ADMIN_ASSIGNED,
        actor_type: 'admin',
        actor_id: adminUser.id,
        actor_name: adminUser.name,
        description: `Order assigned to ${assignToAdminName} by ${adminUser.name}`,
        metadata: { assigned_to: assignToAdminName, assigned_to_id: assignToAdminId },
        created_at: now,
      }))
    )
}
```

Call from the floating confirm bar: `await bulkAssignOrders(Array.from(selectedOrderIds), selectedAdmin.id, selectedAdmin.name)`

toast({ title: `${selectedOrderIds.size} orders assigned to ${selectedAdmin.name}` })
setSelectedAdmin(null)
setSelectedOrderIds(new Set())
```

### Individual assignment in order header strip

Add "Assigned to" field in the header strip:

```tsx
<div className="flex items-center gap-2">
  <span className="text-xs text-muted-foreground">Assigned to:</span>
  {order.assigned_admin_id ? (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{assignedAdmin.name}</span>
      <Button variant="ghost" size="xs" onClick={() => setReassignOpen(true)}>
        Reassign
      </Button>
    </div>
  ) : (
    <Button variant="outline" size="sm" onClick={() => setReassignOpen(true)}>
      Assign to team member
    </Button>
  )}
</div>
```

Reassign Dialog uses the same admin user dropdown with load counts.
On reassign: close old history row, insert new row, log activity.

**The assigned admin filter on the queue:**
Non-super_admin logins see only `orders.assigned_admin_id = their id` in the queue.
Super_admin sees all orders.
Implement this in the queue data fetch:

```ts
const isSuper = adminUser.role === 'super_admin'
let query = supabaseServer.from('orders').select(...)
if (!isSuper) {
  query = query.eq('assigned_admin_id', adminUser.id)
}
```

---

## Feature 4: SLA Due Dates

### On order creation (when paid_at is set via trigger)

Add to the `create_round_zero` trigger function (or create a separate trigger):

```sql
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

create trigger trigger_set_order_sla
  before update of paid_at on orders
  for each row
  when (OLD.paid_at is null and NEW.paid_at is not null)
  execute function set_order_sla();
```

Note on trigger ordering: this is a BEFORE trigger on `paid_at`. The existing
`trigger_create_round_zero` from `ollvy_admin_build.md` is an AFTER trigger on the
same column. PostgreSQL fires BEFORE triggers first, then the row is written, then
AFTER triggers fire. There is no conflict -- both triggers fire correctly in sequence.
Do NOT merge these triggers into one function.

### On round creation (when awaiting_user)

When inserting a new `order_rounds` row with `status = 'awaiting_user'`, also set:
```ts
user_response_deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
// 6 hours from now
```

### SLA auto-extend edge function

Create `supabase/functions/sla-auto-extend/index.ts`:

```ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Find all rounds that are awaiting_user and whose deadline has passed
  const { data: overdueRounds } = await supabase
    .from('order_rounds')
    .select('id, order_id, user_response_deadline, deadline_extended_count')
    .eq('status', 'awaiting_user')
    .eq('deadline_manually_overridden', false)
    .lt('user_response_deadline', new Date().toISOString())

  if (!overdueRounds?.length) {
    return new Response(JSON.stringify({ extended: 0 }))
  }

  for (const round of overdueRounds) {
    const newDeadline = new Date(
      new Date(round.user_response_deadline).getTime() + 24 * 60 * 60 * 1000
    ).toISOString()

    // Extend round deadline by 24 hours
    await supabase
      .from('order_rounds')
      .update({
        user_response_deadline: newDeadline,
        deadline_extended_count: round.deadline_extended_count + 1,
      })
      .eq('id', round.id)

    // Extend order completion date by 1 day
    const { data: order } = await supabase
      .from('orders')
      .select('expected_completion_date')
      .eq('id', round.order_id)
      .single()

    if (order?.expected_completion_date) {
      const newCompletion = new Date(
        new Date(order.expected_completion_date).getTime() + 24 * 60 * 60 * 1000
      ).toISOString().split('T')[0]

      await supabase
        .from('orders')
        .update({ expected_completion_date: newCompletion })
        .eq('id', round.order_id)
    }

    // Log it
    await supabase.from('order_activity_log').insert({
      order_id: round.order_id,
      action_type: 'sla_auto_extended',
      actor_type: 'system',
      actor_name: 'System',
      description: `SLA deadline automatically extended by 24 hours (user has not responded). Extension #${round.deadline_extended_count + 1}.`,
      metadata: { round_id: round.id, new_deadline: newDeadline },
      created_at: new Date().toISOString(),
    })
  }

  return new Response(JSON.stringify({ extended: overdueRounds.length }))
})
```

Schedule this via Supabase cron: every 30 minutes.

### Displaying SLA in the UI

**Order header strip:** Add `expected_completion_date` display:
```tsx
<div className="text-xs text-muted-foreground">
  Due: {' '}
  <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
    {formatDate(order.expected_completion_date)}
  </span>
  <button onClick={() => setEditSlaOpen(true)} className="ml-1 underline text-xs">
    Edit
  </button>
</div>
```

Clicking Edit opens a date picker in a small Popover. On save:
- Update `orders.expected_completion_date`
- Log: "SLA deadline manually set to {date} by {admin name}"

**Round cards:** Show `user_response_deadline` on any awaiting_user round:
```tsx
{round.status === 'awaiting_user' && round.user_response_deadline && (
  <div className="text-xs text-muted-foreground mt-1">
    User response deadline: {' '}
    <span className={isDeadlinePast ? 'text-red-500 font-medium' : 'text-amber-600'}>
      {formatDateTime(round.user_response_deadline)}
    </span>
    {round.deadline_extended_count > 0 && (
      <span className="ml-1 text-muted-foreground">
        (extended {round.deadline_extended_count}x automatically)
      </span>
    )}
  </div>
)}
```

Admin can click on the deadline to override it manually. On manual override:
- Update `order_rounds.user_response_deadline` and set `deadline_manually_overridden = true`
- Log: "User response deadline manually set to {datetime} by {admin name}"

**Queue rows:** Add `expected_completion_date` as a small date next to days-active.
Red if past due.

---

## Feature 5: Document Internal Notes

### On document verify and reject actions

When admin clicks Verify or opens the Reject form on any document
(both `order_documents` and `order_work_documents`), show an optional text field:

```tsx
<div className="mt-3">
  <Label className="text-xs text-muted-foreground">
    Internal note (optional -- only you and your team can see this)
  </Label>
  <Textarea
    value={internalNote}
    onChange={(e) => setInternalNote(e.target.value)}
    placeholder="Add context about this document for your team..."
    rows={2}
    className="mt-1 text-sm resize-none"
  />
</div>
```

On verify: save `internal_note`, `internal_note_by = adminUser.id`, `internal_note_at = now()`.
On reject: same.

The field is optional. If left blank, no note is saved.

### Displaying notes on document cards

If `internal_note` is set on a document, show it below the status:

```tsx
{doc.internal_note && (
  <div className="mt-2 bg-muted rounded px-2 py-1.5 text-xs text-muted-foreground">
    <span className="font-medium">Note:</span> {doc.internal_note}
    <span className="ml-2 opacity-60">-- {doc.internal_note_by_name}, {formatDateTime(doc.internal_note_at)}</span>
  </div>
)}
```

To get the admin name for display, join `admin_users` on `internal_note_by` in the query,
or look up from the loaded admin users list.

Notes are read-only once saved. No editing or deleting.

---

## Feature 6: Reassigning a Professional

### In the order header strip

When `professional_id` is set, show professional name with a "Reassign" button.
This Reassign button opens the same professional assignment Dialog used for initial
assignment (with availability filter).

On reassign:

```ts
// Close old professional assignment history row
await supabaseServer
  .from('order_professional_assignment_history')
  .update({ unassigned_at: new Date().toISOString() })
  .eq('order_id', orderId)
  .is('unassigned_at', null)

// Insert new row
await supabaseServer
  .from('order_professional_assignment_history')
  .insert({
    order_id: orderId,
    professional_id: newProfessional.id,
    assigned_by_admin_id: adminUser.id,
    professional_name: newProfessional.full_name,
    assigned_by_name: adminUser.name,
    assigned_at: new Date().toISOString(),
  })

// Update order
await supabaseServer
  .from('orders')
  .update({ professional_id: newProfessional.id })
  .eq('id', orderId)

// Post system chat message (user sees this)
await supabaseServer.from('chat_messages').insert({
  conversation_id: order.chat_conversation_id,
  sender_type: 'system',
  content: 'Your assigned expert has been updated.',
  message_type: 'system',
  sent_at: new Date().toISOString(),
})

// Log activity
await logActivity({
  orderId,
  actionType: LOG_ACTIONS.PROFESSIONAL_REASSIGNED,
  actorType: 'admin',
  actorId: adminUser.id,
  actorName: adminUser.name,
  description: `Professional reassigned from ${oldProfessional.full_name} to ${newProfessional.full_name}`,
  metadata: {
    from_professional: oldProfessional.full_name,
    to_professional: newProfessional.full_name,
  },
})
```

Also insert into `order_professional_assignment_history` on first assignment (not just
reassignment). Check if a row exists for this order before deciding whether to call it
PROFESSIONAL_ASSIGNED or PROFESSIONAL_REASSIGNED.

---

## Feature 7: Workload Indicator on Assignment Dropdowns

### Professional assignment dropdown

`professional_availability` has no unique index on `professional_id` and is currently
empty. Handle both cases:

```ts
// Fetch all approved professionals
const { data: allPros } = await supabaseServer
  .from('professionals')
  .select('id, full_name, display_name, email, profession_type')
  .eq('status', 'approved')
  .order('full_name')

// Fetch availability data -- may be empty, may have multiple rows per professional
const { data: availabilityRows } = await supabaseServer
  .from('professional_availability')
  .select('professional_id, current_active_orders, max_concurrent_orders, is_available')

// Build a map: professional_id -> best availability row
// "best" = highest max_concurrent_orders if multiple cities
const availMap = new Map()
availabilityRows?.forEach(row => {
  const existing = availMap.get(row.professional_id)
  if (!existing || row.max_concurrent_orders > existing.max_concurrent_orders) {
    availMap.set(row.professional_id, row)
  }
})

// Merge
const professionals = allPros?.map(pro => ({
  ...pro,
  availability: availMap.get(pro.id) ?? null,
})) ?? []
```

Display each professional:
```tsx
<div className="flex items-center justify-between w-full">
  <div>
    <p className="text-sm font-medium">{pro.full_name}</p>
    <p className="text-xs text-muted-foreground">{pro.profession_type}</p>
  </div>
  {pro.availability ? (
    <Badge
      variant={isAtCapacity(pro.availability) ? 'destructive' : 'secondary'}
      className="text-xs"
    >
      {pro.availability.current_active_orders}/{pro.availability.max_concurrent_orders}
    </Badge>
  ) : (
    <Badge variant="outline" className="text-xs">No availability data</Badge>
  )}
</div>
```

Where `isAtCapacity = (a) => a.current_active_orders >= a.max_concurrent_orders`.
At-capacity professionals go to the bottom of the list. They can still be selected.

### Admin assignment dropdown

For each admin_user in the dropdown, show their current assigned order count:

```ts
// Count active orders per admin -- run in parallel
const adminUsers = await Promise.all(
  baseAdminUsers.map(async (admin) => {
    const { count } = await supabaseServer
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('assigned_admin_id', admin.id)
      .not('status', 'in', '(completed,cancelled)')  // PostgREST syntax: no quotes around values
    return { ...admin, activeOrderCount: count ?? 0 }
  })
)
// Sort by activeOrderCount ascending (lightest workload first)
adminUsers.sort((a, b) => a.activeOrderCount - b.activeOrderCount)
```

Display:
```tsx
<span>{admin.name}</span>
<Badge variant="secondary" className="text-xs ml-auto">
  {admin.activeOrderCount} active
</Badge>
```

---

## Feature 8: Download All Documents (Order Level)

Add a "Download all docs" button to the order header strip.

```tsx
'use client'
import JSZip from 'jszip' // lazily imported

async function handleDownloadAll() {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  // Fetch all order_documents (initial)
  const { data: initialDocs } = await supabase
    .from('order_documents')
    .select('document_label, file_url, file_name')
    .eq('order_id', orderId)
    .not('file_url', 'is', null)

  // Fetch all order_work_documents with round info
  const { data: workDocs } = await supabase
    .from('order_work_documents')
    .select(`
      document_label, file_url, file_name, direction, uploaded_by_type,
      order_rounds (round_number, title)
    `)
    .eq('order_id', orderId)
    .not('file_url', 'is', null)

  // Organise into folders with proper naming: label first, then original filename
  // Sanitize filenames: remove characters that break ZIP paths
  const sanitize = (str: string) =>
    str.replace(/[/\\:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim().slice(0, 100)

  const initialFolder = zip.folder('Initial Documents')
  for (const doc of initialDocs || []) {
    try {
      const response = await fetch(doc.file_url)
      const blob = await response.blob()
      // Name: "PAN Card - original_scan.pdf" (label first so purpose is clear)
      const ext = doc.file_name?.split('.').pop() || 'pdf'
      const fileName = `${sanitize(doc.document_label)} - ${sanitize(doc.file_name || 'document')}`
      initialFolder.file(fileName, blob)
    } catch (e) {
      console.warn('Failed to fetch', doc.file_url, e)
    }
  }

  for (const doc of workDocs || []) {
    const roundTitle = doc.order_rounds
      ? sanitize(`Round ${doc.order_rounds.round_number} - ${doc.order_rounds.title}`)
      : 'Other Documents'
    const prefix = doc.uploaded_by_type === 'admin' ? 'Admin' : 'User'
    const folder = zip.folder(roundTitle)
    try {
      const response = await fetch(doc.file_url)
      const blob = await response.blob()
      // Name: "Admin - GST Application Draft - draft_v2.pdf"
      // or   "User - PAN Card - pan_scan.jpg"
      const fileName = `${prefix} - ${sanitize(doc.document_label)} - ${sanitize(doc.file_name || 'document')}`
      folder.file(fileName, blob)
    } catch (e) {
      console.warn('Failed to fetch', doc.file_url, e)
    }
  }

  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = `${order.order_number}-documents.zip`
  a.click()
  URL.revokeObjectURL(url)
}
```

Button in the header strip: "Download all docs" with a download icon. Show a loading
spinner while the ZIP is being generated.

---

## Feature 9: Cancellation Reason + User Banner

### On status change to 'cancelled' (from status dropdown) and on dispute resolution

Any time admin sets `orders.status = 'cancelled'`, intercept with a Dialog before
committing:

```tsx
<Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Cancel this order</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      <div>
        <Label>Reason for cancellation</Label>
        <Select value={cancelReason} onValueChange={setCancelReason}>
          <SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="user_requested">User requested cancellation</SelectItem>
            <SelectItem value="user_unresponsive">User unresponsive for 7+ days</SelectItem>
            <SelectItem value="duplicate_order">Duplicate order</SelectItem>
            <SelectItem value="service_unavailable">Service not available in region</SelectItem>
            <SelectItem value="payment_issue">Payment issue</SelectItem>
            <SelectItem value="internal_error">Internal error</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {cancelReason === 'other' && (
        <div>
          <Label>Please specify</Label>
          <Input value={cancelDetail} onChange={(e) => setCancelDetail(e.target.value)} />
        </div>
      )}

      <div>
        <Label>Message to user (shown as a banner on their order page)</Label>
        <Textarea
          value={cancelMessage}
          onChange={(e) => setCancelMessage(e.target.value)}
          placeholder="e.g. Your order has been cancelled as requested. Please contact us if you have any questions."
          rows={3}
        />
      </div>
    </div>

    <div className="flex gap-2 justify-end mt-4">
      <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Back</Button>
      <Button
        variant="destructive"
        disabled={!cancelReason || !cancelMessage.trim()}
        onClick={handleConfirmCancel}
      >
        Cancel order
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

On confirm:

```ts
// Define this constant at the top of the file or in a shared constants file
const CANCELLATION_REASON_LABELS: Record<string, string> = {
  user_requested: 'User requested cancellation',
  user_unresponsive: 'User unresponsive for 7+ days',
  duplicate_order: 'Duplicate order',
  service_unavailable: 'Service not available in region',
  payment_issue: 'Payment issue',
  internal_error: 'Internal error',
  other: 'Other',
}

// Update order
await supabaseServer
  .from('orders')
  .update({
    status: 'cancelled',
    cancellation_reason: cancelReason,
    cancellation_reason_detail: cancelDetail || null,
  })
  .eq('id', orderId)

// Insert banner notification for user
await supabaseServer
  .from('round_notifications')
  .insert({
    order_id: orderId,
    message: cancelMessage,
    is_dismissed: false,
    created_at: new Date().toISOString(),
  })

// Log activity
await logActivity({
  orderId,
  actionType: LOG_ACTIONS.ORDER_CANCELLED,
  actorType: 'admin',
  actorId: adminUser.id,
  actorName: adminUser.name,
  description: `Order cancelled. Reason: ${CANCELLATION_REASON_LABELS[cancelReason]}${cancelDetail ? ` -- ${cancelDetail}` : ''}`,
  metadata: { reason: cancelReason, detail: cancelDetail, message_to_user: cancelMessage },
})
```

The user sees the `cancelMessage` as a blue banner at the top of their order page via
the existing `RoundNotificationBanner` component already built. No changes to the
customer app needed for this.

Same Dialog (with slightly different reason options) applies for dispute resolution
Refund and Close outcomes. The reason field in that case is pre-filled from the
dispute resolution context.

---

## Feature 10: Revenue Breakdown on Order View

In the order header strip, make the total amount a clickable element that opens a
`Popover` with the full breakdown:

```tsx
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

<Popover>
  <PopoverTrigger asChild>
    <button className="text-sm font-semibold hover:underline cursor-pointer">
      {formatPaisa(order.total_paisa_snapshot)}
    </button>
  </PopoverTrigger>
  <PopoverContent className="w-64" align="start">
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Base price</span>
        <span>{formatPaisa(order.price_base_paisa_snapshot)}</span>
      </div>
      {order.price_govt_fees_paisa_snapshot > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Govt fees</span>
          <span>{formatPaisa(order.price_govt_fees_paisa_snapshot)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">GST</span>
        <span>{formatPaisa(order.price_gst_paisa_snapshot)}</span>
      </div>
      {order.pro_discount_paisa_snapshot > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Professional discount</span>
          <span className="text-green-600">-{formatPaisa(order.pro_discount_paisa_snapshot)}</span>
        </div>
      )}
      {order.promo_discount_paisa_snapshot > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Promo discount</span>
          <span className="text-green-600">-{formatPaisa(order.promo_discount_paisa_snapshot)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold border-t pt-2 mt-2">
        <span>Total paid</span>
        <span>{formatPaisa(order.total_paisa_snapshot)}</span>
      </div>
    </div>
  </PopoverContent>
</Popover>
```

No DB changes needed.

---

## Feature 11: Team Management Page (`/admin/team`)

### New page: `app/(admin)/admin/team/page.tsx`

Only visible and accessible to `super_admin`. Non-super_admin attempting to access this
route gets redirected to `/admin/queue`.

```ts
// In page server component
if (adminUser.role !== 'super_admin') redirect('/admin/queue')
```

Add "Team" to the AdminNav links, visible only when `adminUser.role === 'super_admin'`.

### Team page UI

```tsx
// Fetch all admin users
const { data: teamMembers } = await supabaseServer
  .from('admin_users')
  .select('*')
  .order('created_at', { ascending: true })

// For each member, get their active order count
```

Table columns:
- Name
- Email
- Role badge (super_admin = purple, ops_admin = blue)
- Active orders count
- Status toggle (active/inactive) -- toggle calls update `is_active`
- Date added (`formatDate(created_at)`)
- "View orders" link (navigates to queue filtered by that admin)

"Add team member" button at top.

### Add team member Dialog

```tsx
<Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add team member</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <div>
        <Label>Full name</Label>
        <Input value={name} onChange={...} />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" value={email} onChange={...} />
      </div>
      <div>
        <Label>Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectItem value="ops_admin">Ops Admin</SelectItem>
          -- super_admin cannot be created from this UI
        </Select>
      </div>
      <div>
        <Label>Temporary password</Label>
        <Input type="password" value={password} onChange={...} />
        <p className="text-xs text-muted-foreground mt-1">
          Share this with the team member. They should change it after first login.
        </p>
      </div>
    </div>
    <div className="flex gap-2 justify-end mt-4">
      <Button variant="outline" onClick={() => setAddMemberOpen(false)}>Cancel</Button>
      <Button onClick={handleAddMember} disabled={creating}>
        {creating ? 'Creating...' : 'Add member'}
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

### Create admin user edge function: `supabase/functions/create-admin-user/index.ts`

This must be an edge function because creating a Supabase Auth user requires the
service role key and cannot be done safely from the client.

```ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyAdmin } from '../_shared/auth.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const authResult = await verifyAdmin(req)
  if (!authResult.success || authResult.role !== 'super_admin') {
    return new Response(JSON.stringify({ error: 'Only super_admin can create team members' }), { status: 403 })
  }

  const { name, email, password, role } = await req.json()

  if (!name || !email || !password || role !== 'ops_admin') {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Create Supabase Auth user
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    return new Response(JSON.stringify({ error: authError.message }), { status: 400 })
  }

  // Insert admin_users row
  const { error: insertError } = await supabase.from('admin_users').insert({
    auth_user_id: authUser.user.id,
    name,
    email,
    role,
    is_active: true,
  })

  if (insertError) {
    // Rollback: delete the auth user
    await supabase.auth.admin.deleteUser(authUser.user.id)
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
```

Call this from the "Add team member" Dialog submit handler:

```ts
const res = await fetch(getEdgeFunctionUrl('create-admin-user'), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token}`,
    // session comes from: const { data: { session } } = await getClient().auth.getSession()
  },
  body: JSON.stringify({ name, email, password, role }),
})
```

---

## Verification Checklist

### Migrations
- [ ] All 9 migrations ran without errors
- [ ] `order_activity_log` table exists and has realtime enabled
- [ ] `order_admin_assignment_history` and `order_professional_assignment_history` tables exist
- [ ] `orders` has `assigned_admin_id`, `expected_completion_date`, `cancellation_reason`, `cancellation_reason_detail`
- [ ] `order_rounds` has `user_response_deadline`, `deadline_extended_count`, `deadline_manually_overridden`
- [ ] `order_documents` and `order_work_documents` have `internal_note`, `internal_note_by`, `internal_note_at`

### Feature 1: Global Search
- [ ] Search bar visible in AdminNav
- [ ] Searches across order number, user name, phone, service name, professional name
- [ ] Status filter works: Active / Completed / Cancelled
- [ ] Pending filter works: Pending on us / Pending on user
- [ ] Results sorted newest first
- [ ] Clicking result opens order view

### Feature 2: Activity Log
- [ ] Every admin action logs to `order_activity_log` with exact timestamp (date, hour, minute)
- [ ] Log visible at bottom of order view left panel
- [ ] Shows last 5 entries collapsed, "View full history" expands all
- [ ] New entries appear in realtime without refresh
- [ ] System SLA extension events appear in log

### Feature 3: Bulk Assignment
- [ ] Checkboxes do NOT appear on queue rows by default
- [ ] Checkboxes appear only AFTER selecting a person from the "Bulk assign" dropdown
- [ ] Floating confirm bar appears when orders are selected
- [ ] On confirm: all selected orders updated, history rows inserted, activity logged
- [ ] Non-super_admin queue shows only their assigned orders
- [ ] Individual reassign works from order header strip

### Feature 4: SLA Due Dates
- [ ] `expected_completion_date` set automatically when order is paid
- [ ] `user_response_deadline` set to 6 hours from now when round is created as awaiting_user
- [ ] `sla-auto-extend` edge function deployed and scheduled every 30 minutes
- [ ] Overdue rounds get deadline extended by 24h, order completion date extended by 1 day, activity logged
- [ ] Due dates visible on queue rows (red if overdue)
- [ ] Due date visible and editable in order header strip
- [ ] Round deadline visible on awaiting_user round cards with extension count

### Feature 5: Document Internal Notes
- [ ] Optional note field appears on Verify and Reject actions
- [ ] Note saved to `internal_note`, `internal_note_by`, `internal_note_at`
- [ ] Note displayed on document card in admin view with author name and timestamp
- [ ] Notes never appear in customer-facing views

### Feature 6: Professional Reassignment
- [ ] "Reassign" button appears next to professional name when one is assigned
- [ ] Reassign posts system chat message to order chat (user sees it)
- [ ] Old history row gets `unassigned_at`, new row inserted
- [ ] Activity log entry with old and new professional names

### Feature 7: Workload Indicators
- [ ] Professional dropdown shows `current_active/max_concurrent` badge
- [ ] At-capacity professionals shown at bottom with warning
- [ ] Admin dropdown shows active order count, sorted lightest load first

### Feature 8: Download All Documents
- [ ] "Download all docs" button in order header strip
- [ ] ZIP includes all `order_documents` and `order_work_documents` with file_url
- [ ] Organised into folders by round
- [ ] Files prefixed with "Admin" or "User" based on `uploaded_by_type`
- [ ] ZIP filename uses `order_number`

### Feature 9: Cancellation + User Banner
- [ ] Cancellation Dialog appears before status is set to cancelled
- [ ] Reason dropdown required before confirming
- [ ] Custom message to user required before confirming
- [ ] `round_notifications` row inserted with admin's message
- [ ] User sees banner on their order page (existing `RoundNotificationBanner` renders it)
- [ ] Cancellation reason saved to `orders.cancellation_reason`
- [ ] Activity logged with reason and message

### Feature 10: Revenue Breakdown
- [ ] Total amount in order header is clickable
- [ ] Popover shows all price components
- [ ] Zero-value components hidden (govt fees, discounts)
- [ ] Discounts shown in green with minus sign

### Feature 11: Team Management
- [ ] `/admin/team` accessible only to super_admin
- [ ] "Team" link in AdminNav visible only to super_admin
- [ ] Team table shows all admin_users with active order counts
- [ ] is_active toggle works
- [ ] Add team member Dialog creates Supabase Auth user + admin_users row
- [ ] `create-admin-user` edge function handles rollback if DB insert fails
- [ ] Only ops_admin role can be created from this UI (not super_admin)
- [ ] New team member can log in at `/admin/login`
- [ ] New team member's queue shows only orders assigned to them

### Architecture
- [ ] All supabaseServer mutations in enhancements use server actions, never client event handlers
- [ ] CANCELLATION_REASON_LABELS constant defined in the same file or imported before use
- [ ] ZIP filenames sanitized with sanitize() function -- no slashes, colons, or special chars
- [ ] ZIP button shows loading spinner during generation
- [ ] `role` field is fetched in admin layout query and passed to AdminNav for super_admin checks

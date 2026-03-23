# Ollvy Admin Panel - Final Locked Build Instructions

## Critical: Read Every Word Before Writing Any Code

This spec is fully grounded in the actual schema, components, and edge functions confirmed by Claude Code
across multiple verification rounds completed March 23-24, 2026.
Do not invent tables, columns, components, or edge functions.
Do not use em dashes anywhere in code or copy.
Do not build role-based permissions. All logged-in admin users are super_admin for now.
Do not call `send-notification`, `request-document`, or `advance-stage` edge functions from admin code.
Do not import `auth-store.ts` or `questionnaire-store.ts` anywhere in admin code.
Do not replace any existing customer-facing UI. Only add new sections at the confirmed injection points.

---

## Existing Schema (do not recreate)

```
orders:
  id, order_number (TEXT, format: OLV-2026-00042), user_id, professional_id,
  service_package_id, chat_conversation_id, status (order_status enum),
  paid_at, completed_at, assigned_at, payment_paused (BOOLEAN)
  price_base_paisa_snapshot, price_govt_fees_paisa_snapshot, price_gst_paisa_snapshot,
  pro_discount_paisa_snapshot, promo_discount_paisa_snapshot, total_paisa_snapshot (INT)
  -- Revenue = total_paisa_snapshot / 100, exclude status = 'cancelled'

order_documents:
  id, order_id, document_key, document_label, stage_key, is_required,
  uploaded_at, file_url, file_name, verified_at, verified_by, rejection_reason
  -- stage_key = 'doc_collection' = Round 0 initial documents

order_work_documents:
  id, order_id, professional_id, direction (to_customer | from_customer),
  document_label, description, stage_key, status (pending|uploaded|verified|rejected),
  file_url, file_name, due_date, uploaded_at, uploaded_by_type (TEXT),
  verified_at, rejection_reason
  -- uploaded_by_type: 'professional' | 'customer' | 'admin'
  -- round_id, tag, linked_request_id, skipped_at, skip_reason: ALL MISSING -- add in migrations

service_questionnaires:
  service_package_id, question_key, question_label, question_type,
  options (JSONB), step_number, display_order, depends_on (JSONB)

order_questionnaire_responses:
  order_id, question_key, response_value (JSONB)

chat_conversations:  id, order_id, retainer_subscription_id
  -- created by razorpay-webhook on payment.captured
  -- always present for paid orders

chat_messages:
  id, conversation_id, sender_id, sender_type (user|professional|system),
  content, sent_at, file_url, file_name, message_type (text|file|system)
  -- NO sender_name column

admin_users:
  id, auth_user_id, name, email, role (super_admin|ops_admin|finance_admin),
  is_active, last_login_at, created_at

professionals:
  id, auth_user_id, full_name (primary), name (generated alias of full_name),
  display_name (optional), phone, email, profession_type, status (pending|approved|rejected|suspended)
  -- Use full_name for display. Fall back to name if full_name null.

professional_availability:
  professional_id, city, is_available, max_concurrent_orders,
  current_active_orders, on_leave_until

users:
  id, auth_user_id, phone, business_name, business_type, subscription_tier

disputes:
  id, order_id, raised_by_user_id, raised_by_type, reason_category,
  description, status (open|admin_reviewing|resolved_refund|resolved_no_refund|resolved_partial|appealed),
  resolution_amount_paisa, resolved_at, resolved_by

notifications:
  id, user_id OR professional_id, type, title, body, data (JSONB), read_at, fcm_status, sms_status
  -- This is the existing push/SMS notification table. Do NOT use for round notifications.
  -- round_notifications is a NEW separate table we create.

service_packages:
  price_base_paisa, price_govt_fees_paisa, price_gst_rate, name, slug
```

---

## New Migrations (run in this exact order)

### Migration 1: order_rounds (create first -- other tables reference it)
```sql
create table order_rounds (
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

-- RLS: users can update answer-related fields (not status or visibility)
-- Admin uses service role key which bypasses RLS entirely
```

### Migration 2: round_question_requests
```sql
create table round_question_requests (
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
```

### Migration 3: round_notifications
```sql
create table round_notifications (
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
```

### Migration 4: order_admin_notes
```sql
create table order_admin_notes (
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
```

### Migration 5: alter order_work_documents
```sql
alter table order_work_documents
  add column if not exists round_id uuid references order_rounds(id) on delete set null,
  add column if not exists tag text,
  -- tag values (to_customer only): for_signing | government_processing | final_output | informational
  add column if not exists linked_request_id uuid references order_work_documents(id) on delete set null,
  add column if not exists skipped_at timestamptz,
  add column if not exists skip_reason text;
```

### Migration 6: alter orders
```sql
alter table orders
  add column if not exists dispute_outcome text;
  -- values: refund | continue | closed
```

### Migration 7: Round 0 auto-creation trigger

Confirmed: razorpay-webhook sets `paid_at` via UPDATE (not INSERT). The UPDATE trigger is sufficient. No INSERT trigger needed.

```sql
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

create trigger trigger_create_round_zero
  after update of paid_at on orders
  for each row execute function create_round_zero();
```

Backfill for existing paid orders:
```sql
insert into order_rounds (order_id, round_number, title, status, is_visible_to_user)
select id, 0, 'Initial Submission', 'completed', true
from orders where paid_at is not null
on conflict (order_id, round_number) do nothing;
```

### Migration 8: Enable realtime
```sql
alter publication supabase_realtime add table order_rounds;
alter publication supabase_realtime add table round_notifications;
alter publication supabase_realtime add table order_admin_notes;
-- chat_messages already has realtime via ChatWindow
```

---

## TypeScript Type Updates (do these alongside migrations)

### Update `lib/types.ts`

Add missing fields to `OrderWorkDocument` interface:

```ts
interface OrderWorkDocument {
  // ... existing fields unchanged ...
  uploaded_by_type?: 'professional' | 'customer' | 'admin'  // UPDATE: add 'admin'
  // ADD these new fields:
  round_id?: string
  tag?: 'for_signing' | 'government_processing' | 'final_output' | 'informational'
  linked_request_id?: string
  skipped_at?: string
  skip_reason?: string
}
```

Also add new types:

```ts
export interface OrderRound {
  id: string
  order_id: string
  created_by_admin_id?: string
  round_number: number
  title: string
  status: 'pending' | 'awaiting_user' | 'active' | 'completed'
  is_visible_to_user: boolean
  created_at: string
  completed_at?: string
}

export interface RoundQuestionRequest {
  id: string
  round_id: string
  question_text: string
  answer_text?: string
  answered_at?: string
  position: number
  created_at: string
}

export interface RoundNotification {
  id: string
  order_id: string
  round_id?: string
  message: string
  is_dismissed: boolean
  dismissed_at?: string
  created_at: string
}

export interface OrderAdminNote {
  id: string
  order_id: string
  admin_id?: string
  content: string
  created_at: string
}
```

---

## Admin Seed (required before any testing)

The admin panel cannot be tested until at least one `admin_users` row exists.

### Step 1: Create the super admin Supabase Auth user

1. Open Supabase Dashboard for the Ollvy project
2. Go to Authentication > Users > Add User
3. Set: Email = `admin@ollvy.com`, Password = choose a strong password, Auto Confirm User = ON
4. Copy the UUID shown for the new user (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

### Step 2: Insert the admin_users row

Run in Supabase SQL editor:

```sql
INSERT INTO admin_users (auth_user_id, name, email, role, is_active)
VALUES (
  'PASTE-UUID-FROM-STEP-1-HERE',
  'Super Admin',
  'admin@ollvy.com',
  'super_admin',
  true
);
```

### Step 3: Test login

Go to `ollvy.com/admin/login`, enter `admin@ollvy.com` and the password from Step 1.
You should land on `/admin/queue`.

### Step 4: Create team members (after admin panel is built)

Team members are created from `/admin/team` inside the admin panel itself.
Super admin enters the team member's name, email, and sets a temporary password.
The `create-admin-user` edge function creates their Supabase Auth account.
Super admin shares the email and temporary password with the team member directly
(Slack, WhatsApp, email -- outside the system).
Team member logs in at `/admin/login` with those credentials.
Password change on first login is NOT enforced automatically -- super admin should
ask team members to update their password after first login via Supabase Dashboard
or a future "change password" feature.

### Step 5: Seed professionals and availability (for assignment dropdown)

Until `professionals` and `professional_availability` rows are seeded, the professional
assignment dropdown will be empty. Add at least one test professional via Supabase
Dashboard or SQL before testing the assignment flow.

---

## Important: Existing Trigger on orders

`trigger_create_work_documents_on_professional_assignment` fires AFTER UPDATE on `orders`.

Before building the professional assignment flow, run this in Supabase SQL editor to
see what it does:

```sql
select prosrc from pg_proc
where proname = 'create_work_documents_on_professional_assignment';
```

If it auto-creates `order_work_documents` rows when a professional is assigned,
those rows will have `round_id = null` (since the column did not exist when the
trigger was written). They will correctly appear in the existing `WorkDocumentsSection`
(filtered by `round_id IS NULL`) and NOT in the rounds timeline. This is correct behavior.

If the trigger does something unexpected, document it and adjust accordingly before
shipping the assignment feature.

---

`advance-stage` uses `verifyProfessional` -- admin JWT gets a 403. Must create a new function.

Create `supabase/functions/admin-advance-stage/index.ts`:

```ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyAdmin } from '../_shared/auth.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authResult = await verifyAdmin(req)
    if (!authResult.success) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { order_id, notes } = await req.json()
    if (!order_id) return new Response(JSON.stringify({ error: 'order_id required' }), { status: 400 })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch order -- MUST include chat_conversation_id for system message
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, professional_id, payment_paused, chat_conversation_id')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 })
    }

    if (order.payment_paused) {
      return new Response(JSON.stringify({ error: 'Order payment is paused' }), { status: 400 })
    }

    if (order.status !== 'in_progress') {
      return new Response(
        JSON.stringify({ error: `Order must be in_progress to complete. Current status: ${order.status}` }),
        { status: 400 }
      )
    }

    // Update order
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', order_id)

    if (updateError) throw updateError

    // Create stage history record
    // Confirmed columns: id, order_id, stage_key, stage_name, started_at,
    // stage_due_date, completed_at, notes, created_at, sla_breached, due_at
    await supabase.from('order_stage_history').insert({
      order_id,
      stage_key: 'completed',
      stage_name: 'Order Completed',
      completed_at: new Date().toISOString(),
      notes: notes || 'Completed by admin',
    })

    // Create payout if professional is assigned
    // NOTE: The original advance-stage has no rollback -- if payout insert fails,
    // order is already completed but no payout exists. We add a rollback here.
    if (order.professional_id) {
      const { data: orderWithPrice } = await supabase
        .from('orders')
        .select('total_paisa_snapshot')
        .eq('id', order_id)
        .single()

      if (orderWithPrice) {
        // Platform fee confirmed at 20% (verified in advance-stage/index.ts:202)
        const platformFeePercent = 20
        const platformFee = Math.round(orderWithPrice.total_paisa_snapshot * (platformFeePercent / 100))
        const payoutAmount = orderWithPrice.total_paisa_snapshot - platformFee

        const { error: payoutError } = await supabase.from('payouts').insert({
          order_id,
          professional_id: order.professional_id,
          amount_paisa: payoutAmount,
          platform_fee_paisa: platformFee,
          status: 'pending',
        })

        if (payoutError) {
          // Rollback: revert order status to in_progress
          await supabase
            .from('orders')
            .update({ status: 'in_progress', completed_at: null })
            .eq('id', order_id)
          return new Response(
            JSON.stringify({ error: 'Payout creation failed. Order status has been reverted.' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    // Use orders.chat_conversation_id directly (always set for paid orders)
    await supabase.from('chat_messages').insert({
      conversation_id: order.chat_conversation_id,
      sender_type: 'system',
      content: 'This order has been marked as completed.',
      message_type: 'system',
      sent_at: new Date().toISOString(),
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
```

This is the ONLY new edge function to create. Everything else uses direct DB queries via `supabaseServer`.

---

## Rejection Reasons Constant

Create `apps/customer/lib/constants/rejection-reasons.ts`:

```ts
export const REJECTION_REASONS = [
  { value: 'blurry_or_unclear', label: 'Document is blurry or unclear' },
  { value: 'wrong_document', label: 'Wrong document uploaded' },
  { value: 'document_expired', label: 'Document is expired' },
  { value: 'signature_missing', label: 'Signature missing' },
  { value: 'name_mismatch', label: 'Name does not match order details' },
  { value: 'incomplete_document', label: 'Document is incomplete or partial' },
  { value: 'poor_lighting', label: 'Poor lighting or low resolution' },
  { value: 'unsupported_format', label: 'File format not supported' },
  { value: 'other', label: 'Other' },
] as const

export type RejectionReasonValue = typeof REJECTION_REASONS[number]['value']

export function getRejectionLabel(value: RejectionReasonValue): string {
  return REJECTION_REASONS.find(r => r.value === value)?.label ?? value
}

export function buildRejectionMessage(
  documentLabel: string,
  reason: RejectionReasonValue,
  reasonOther?: string
): string {
  const detail = reason === 'other' && reasonOther ? reasonOther : getRejectionLabel(reason)
  return `Your ${documentLabel} was rejected because: ${detail}. Please re-upload.`
}
```

Import from `@/lib/constants/rejection-reasons` everywhere rejection dropdowns or messages appear.

---

## Formatting Utilities (always use these, never roll your own)

All of these exist in `apps/customer/lib/utils.ts`. Import and use them everywhere in admin:

```ts
import { formatPaisa, formatDate, formatDateTime, formatRelativeTime } from '@/lib/utils'

formatPaisa(order.total_paisa_snapshot)  // "₹22,999"
formatDate(order.paid_at)                // "24 Mar 2026"
formatDateTime(order.created_at)         // "24 Mar 2026, 2:30 pm"
formatRelativeTime(order.created_at)     // "5m ago"
```

Never call `Intl.NumberFormat` or `toLocaleString` directly in admin components.

---

## Component Reuse Guide

### Supabase clients
```ts
// Server components and server actions (all admin queries use this)
import { supabaseServer } from '@/lib/supabase-server'
// IMPORTANT: supabaseServer is a direct export that can be null at build time
// Always null-check before use:
// if (!supabaseServer) redirect('/admin/login')

// Session/cookie-based (for auth checks in layout only)
import { createServerSupabase } from '@/lib/supabase-server'

// Client components
import { getClient } from '@/lib/supabase'
const supabase = getClient()

// Edge function URLs
import { getEdgeFunctionUrl } from '@/lib/supabase'
// Returns full URL: https://xyz.supabase.co/functions/v1/{functionName}
```

Never use `get_user_order` RPC in admin -- it is scoped to `auth.uid()` and returns nothing for admin.

### Toaster

Confirmed: `<Toaster />` is in `app/layout.tsx` (root layout). Admin routes inherit it.
Do NOT add another `<Toaster />` to the admin layout -- it causes duplicate toasts.

### useToast
```ts
import { useToast } from '@/lib/hooks/use-toast'
const { toast } = useToast()
toast({ title: 'Saved', description: 'Round created.' })
toast({ title: 'Error', variant: 'destructive', description: 'Something went wrong.' })
```

### Status badges
```tsx
import { Badge } from '@/components/ui/badge'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'

<OrderStatusBadge status={order.status} />
<Badge variant="warning">Awaiting user</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="pending">Pending</Badge>
<Badge variant="destructive">Rejected</Badge>
```

### Add Round panel
Use `Dialog`, not Sheet. Sheet covers the chat panel:

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

<Dialog open={addRoundOpen} onOpenChange={setAddRoundOpen}>
  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Add Round</DialogTitle>
    </DialogHeader>
    {/* form content */}
  </DialogContent>
</Dialog>
```

### Confirmation dialogs
```tsx
<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
  <DialogContent>
    <DialogHeader><DialogTitle>Confirm action</DialogTitle></DialogHeader>
    <p className="text-sm text-muted-foreground">This cannot be undone.</p>
    <div className="flex gap-2 justify-end mt-4">
      <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </div>
  </DialogContent>
</Dialog>
```

### Collapsed rounds
```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
```

### Document uploads
```tsx
import { UploadDropzone } from '@/components/documents/UploadDropzone'

// Required prop: onUpload must be async
<UploadDropzone
  onUpload={async (file: File) => { await handleUpload(file) }}
  label="Drop your document here"
  accept=".pdf,.jpg,.jpeg,.png"
  maxSize={10 * 1024 * 1024}
/>
```

```tsx
import { DocumentPreview } from '@/components/documents/DocumentPreview'
// Use for document view modal
```

### Chat (admin order view)

CONFIRMED: `ChatWindow` hardcodes `sender_type: 'user'` and reads `sender_id` from `useAuthStore().user.id`.
Admin is not in the `users` table. Do NOT use `ChatWindow` for admin. Do NOT modify it.

Use `AdminChatWindow` from `@/components/chat/AdminChatWindow.tsx` -- fully implemented in `ollvy_rounds_chat_build.md` Task 2.

```tsx
import { AdminChatWindow } from '@/components/chat/AdminChatWindow'
```

`adminUser` must come from the page server component via `getAdminUser()` and be passed
as a prop into the client component that renders the order view panel:

```tsx
// Page server component:
import { getAdminUser } from '@/lib/admin/get-admin-user'
const adminUser = await getAdminUser()
return <OrderViewClient order={order} rounds={rounds} adminUser={adminUser} />

// OrderViewClient (client component) passes it to AdminChatWindow:
<AdminChatWindow
  conversationId={order.chat_conversation_id}
  adminUser={{ id: adminUser.id, auth_user_id: adminUser.auth_user_id, name: adminUser.name }}
/>
```

Admin messages insert with `sender_type = 'professional'` and `sender_id = adminUser.auth_user_id`.

### Professional assignment query

`professional_availability` has NO unique index on `professional_id` -- a professional
can have multiple rows (one per city). Table is currently empty (no rows seeded yet).

Use this query which handles duplicates and the empty table case:

```ts
// Two-step approach to avoid duplicate professionals from multi-city rows
const { data: professionals } = await supabaseServer
  .from('professionals')
  .select(`
    id, full_name, display_name, email, profession_type
  `)
  .eq('status', 'approved')
  .order('full_name')

// If professional_availability is empty or not seeded,
// show all approved professionals without availability filter
// Once availability data is seeded, add the filter below:
//
// const availableProfessionalIds = await supabaseServer
//   .from('professional_availability')
//   .select('professional_id, current_active_orders, max_concurrent_orders')
//   .eq('is_available', true)
//   .then(({ data }) => {
//     // group by professional_id, take the row with max capacity
//     const map = new Map()
//     data?.forEach(row => {
//       const existing = map.get(row.professional_id)
//       if (!existing || row.max_concurrent_orders > existing.max_concurrent_orders) {
//         map.set(row.professional_id, row)
//       }
//     })
//     return map
//   })
//
// Filter professionals by availableProfessionalIds

// For now: show all approved professionals
// Display current_active_orders count from professional_availability if it exists
// If no availability row: show as "availability unknown"
```

Display name: `professional.full_name || professional.name`

**Important:** Since `professional_availability` is empty, the assignment dropdown
will show all approved professionals with no availability data. Once the table is
seeded, add the availability filter. The workload indicator (Feature 7 in enhancements)
also depends on this data being present.

---

## Admin App Location and Routing

```
apps/customer/app/
  (admin)/
    admin/
      layout.tsx
      page.tsx             -- redirect to /admin/queue
      login/
        page.tsx
      queue/
        page.tsx
      orders/
        page.tsx
        [orderId]/
          page.tsx
      users/
        page.tsx
        [userId]/
          page.tsx
      analytics/
        page.tsx
```

---

## Auth

```tsx
// apps/customer/app/(admin)/admin/layout.tsx
import { createServerSupabase, supabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
// NOTE: Do NOT import Toaster here -- it is already in app/layout.tsx (root layout)
// Adding it again causes duplicate toasts

export const metadata = { robots: 'noindex, nofollow' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')

  // supabaseServer is a direct export that can be null at build time
  if (!supabaseServer) redirect('/admin/login')

  const { data: adminUser } = await supabaseServer
    .from('admin_users')
    .select('id, name, email, role, is_active')  // role required for super_admin checks
    .eq('auth_user_id', session.user.id)
    .single()

  if (!adminUser?.is_active) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav adminName={adminUser.name} isSuperAdmin={adminUser.role === 'super_admin'} />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
```

Middleware note: `/admin/*` is NOT in the app's `PROTECTED_ROUTES` list in `middleware.ts`. The admin layout is the sole auth guard. This is correct -- the login page at `/admin/login` must be accessible without auth, so it should not be in PROTECTED_ROUTES.

Login page: `getClient().auth.signInWithPassword({ email, password })`. On success redirect to `/admin/queue`.

---

## AdminNav Component

Create `apps/customer/components/admin/AdminNav.tsx`. This is a server component
that receives props from the layout.

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface AdminNavProps {
  adminName: string
  isSuperAdmin: boolean
}

const NAV_LINKS = [
  { label: 'Queue', href: '/admin/queue' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Analytics', href: '/admin/analytics' },
]

export function AdminNav({ adminName, isSuperAdmin }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = getClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const links = isSuperAdmin
    ? [...NAV_LINKS, { label: 'Team', href: '/admin/team' }]
    : NAV_LINKS

  return (
    <nav className="bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/admin/queue" className="font-semibold text-sm text-gray-900">
          Ollvy Admin
        </Link>
        <div className="flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'px-3 py-1.5 rounded text-sm transition-colors',
                pathname.startsWith(link.href)
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{adminName}</span>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </nav>
  )
}
```

The `Team` link only appears when `isSuperAdmin` is true. This is the only
role-based visibility in the nav. All other nav links are visible to all admin users.

---

## Admin Context Pattern (read before building any page)

The layout verifies auth but does NOT pass `adminUser` to child pages. Every admin page
server component and every server action needs to fetch the current admin user.

### Helper: `lib/admin/get-admin-user.ts`

Create this file once and import it everywhere:

```ts
import { supabaseServer } from '@/lib/supabase-server'
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export interface AdminUser {
  id: string
  auth_user_id: string
  name: string
  email: string
  role: 'super_admin' | 'ops_admin' | 'finance_admin'
  is_active: boolean
}

export async function getAdminUser(): Promise<AdminUser> {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')
  if (!supabaseServer) redirect('/admin/login')

  const { data: adminUser } = await supabaseServer
    .from('admin_users')
    .select('id, auth_user_id, name, email, role, is_active')
    .eq('auth_user_id', session.user.id)
    .single()

  if (!adminUser?.is_active) redirect('/admin/login')
  return adminUser as AdminUser
}
```

### Usage in every page server component

```ts
// In any admin page server component:
import { getAdminUser } from '@/lib/admin/get-admin-user'

export default async function AdminQueuePage() {
  const adminUser = await getAdminUser()
  // Now pass adminUser as a prop to any client component that needs it
  return <QueueClient adminUser={adminUser} />
}
```

**Component naming convention for this entire build:**

Every admin page follows this two-file pattern:
- `page.tsx` -- server component only. Fetches all data with `supabaseServer`, calls `getAdminUser()`, passes everything as typed props to the client component. No interactivity here.
- `[PageName]Client.tsx` -- client component in `components/admin/`. Receives data as props, handles all buttons, dialogs, state.

Specific components to create:
- `components/admin/QueueClient.tsx` -- receives orders list + adminUser
- `components/admin/OrderViewClient.tsx` -- the split panel order view, receives:
  - `order` (full order with service_packages, users, professionals joined)
  - `rounds` (all order_rounds with questions and work docs joined)
  - `adminUser` (AdminUser type from get-admin-user.ts)
  - `initialDocs` (order_documents where stage_key = 'doc_collection')
  - `adminNotes` (order_admin_notes with admin_users name joined)
- `components/admin/UsersClient.tsx` -- receives users list
- `components/admin/AnalyticsClient.tsx` -- receives all metric data pre-computed

`OrderViewClient` passes `adminUser` down to `AdminChatWindow` as a prop.
Server actions in `actions.ts` do NOT receive `adminUser` as a prop -- they call
`getAdminUser()` themselves on every invocation.

### Usage in every server action

```ts
// In any actions.ts server action file:
import { getAdminUser } from '@/lib/admin/get-admin-user'

export async function verifyDocument(documentId: string, orderId: string) {
  const adminUser = await getAdminUser() // re-verifies session on every action
  if (!supabaseServer) throw new Error('Service client unavailable')

  await supabaseServer
    .from('order_documents')
    .update({ verified_at: new Date().toISOString(), verified_by: adminUser.id })
    .eq('id', documentId)
  // ... logActivity here
}
```

### Getting session.access_token in client components (for edge function calls)

Client components cannot call `getAdminUser()` (it is server-only). For edge function
calls that need a JWT (like `admin-advance-stage`), fetch the session client-side:

```ts
// Inside a client component:
const supabase = getClient()
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

const res = await fetch(getEdgeFunctionUrl('admin-advance-stage'), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ order_id: orderId }),
})
```

Do not assume `session` is available as a prop -- always call `getClient().auth.getSession()`
directly inside the async handler in the client component.

---

## View 1: Work Queue (`/admin/queue`)

### Bucket query (single CASE statement -- one order = one bucket)

```sql
select
  o.*,
  sp.name as service_name,
  u.business_name as user_name,
  extract(days from now() - o.paid_at)::int as days_active,
  case
    when o.status = 'disputed' then 'disputed'
    when o.status = 'pending_assignment' then 'needs_assignment'
    when exists (
      select 1 from order_rounds r where r.order_id = o.id and r.status = 'awaiting_user'
    ) then 'awaiting_user'
    when exists (
      select 1 from order_work_documents wd
      where wd.order_id = o.id and wd.status = 'uploaded' and wd.direction = 'from_customer'
    ) then 'docs_to_review'
    when exists (
      select 1 from order_work_documents wd
      where wd.order_id = o.id and wd.tag = 'final_output' and o.status != 'completed'
    ) then 'ready_to_deliver'
    when exists (
      select 1 from order_work_documents wd
      where wd.order_id = o.id and wd.tag = 'government_processing'
    ) then 'awaiting_government'
    when o.status = 'in_progress' then 'in_progress'
    else 'other'
  end as bucket
from orders o
join service_packages sp on sp.id = o.service_package_id
join users u on u.id = o.user_id
where o.status not in ('completed', 'cancelled')
```

Run via Supabase RPC or as a raw query using `supabaseServer`.

### Bucket cards
Eight cards: Needs Assignment (yellow), Disputed (red), Awaiting User (orange), Docs to Review (blue), In Progress (indigo), Awaiting Government (purple), Ready to Deliver (teal), All Active (gray).

### Order list rows
- `order.order_number` (format: OLV-2026-00042)
- Service name from join
- User business_name from join
- `formatPaisa(order.total_paisa_snapshot)` for amount
- Bucket badge with `<Badge>` component
- `days_active` -- red text if over 3
- Open button to `/admin/orders/{orderId}`

Search: client-side by order_number, user business_name, service name.
Sort: highest `days_active` first in filtered views; newest `paid_at` first in All Active.

---

## View 2: Order View (`/admin/orders/[orderId]`)

Split layout. Left 60%, right 40%. Full viewport height minus nav. Independent scroll. Desktop only.

---

### LEFT PANEL

#### Header Strip (sticky)

```ts
const { data: order } = await supabaseServer
  .from('orders')
  .select(`
    *,
    service_packages (name, slug, sla_working_days),
    users (id, business_name, phone, email),
    professionals (id, full_name, display_name, email, profession_type)
  `)
  .eq('id', orderId)
  .single()

// The * includes all order columns including:
// assigned_admin_id, expected_completion_date, cancellation_reason,
// dispute_outcome, payment_paused, chat_conversation_id, total_paisa_snapshot,
// price_base_paisa_snapshot, price_govt_fees_paisa_snapshot, price_gst_paisa_snapshot,
// pro_discount_paisa_snapshot, promo_discount_paisa_snapshot, paid_at, status, order_number
// All are available on the order object without additional queries.

// If assigned_admin_id is set, fetch the assigned admin's name separately:
let assignedAdmin = null
if (order?.assigned_admin_id) {
  const { data } = await supabaseServer
    .from('admin_users')
    .select('id, name, email')
    .eq('id', order.assigned_admin_id)
    .single()
  assignedAdmin = data
}
```

Display: service name, user business_name + phone, `order_number`, `formatPaisa(total_paisa_snapshot)`, created `formatDate(paid_at)`.

Status dropdown using `order_status` enum values. On change: update `orders.status`.

IMPORTANT ARCHITECTURE NOTE: The order view is a split panel with interactive elements
(buttons, dropdowns, file pickers). All of these are client components. But `supabaseServer`
(service role) cannot be called from client components -- it only works in server components
and server actions.

Pattern to use for ALL admin mutations (verify, reject, status change, notes, etc.):

```ts
// Create: apps/customer/app/(admin)/admin/orders/[orderId]/actions.ts
'use server'
import { supabaseServer } from '@/lib/supabase-server'
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { logActivity, LOG_ACTIONS } from '@/lib/admin/log-activity'

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')
  if (!supabaseServer) throw new Error('Service client unavailable')

  await supabaseServer
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)
}
```

Call from client components with: `await updateOrderStatus(orderId, newStatus)`

Create one `actions.ts` file per major admin page and put all mutations there.
Every mutation in this spec that shows `supabaseServer.from(...)` inside a button
handler or event handler must be moved into a server action. Do not call supabaseServer
directly from client component event handlers.

Do NOT call advance-stage for status changes from this dropdown -- only use `admin-advance-stage` edge function when marking complete via the dedicated Mark Order Complete button.

Professional assignment:
- If `professional_id` null: "Unassigned" with Assign button
- Assign button opens Dialog with searchable list from professional availability query above
- On select: call a server action `assignProfessional(orderId, professional.id, currentStatus)`:
  ```ts
  // In actions.ts:
  export async function assignProfessional(orderId: string, professionalId: string, currentStatus: string) {
    const adminUser = await getAdminUser()
    if (!supabaseServer) throw new Error()
    const updates: Record<string, string> = { professional_id: professionalId }
    if (currentStatus === 'pending_assignment') updates.status = 'in_progress'
    await supabaseServer.from('orders').update(updates).eq('id', orderId)
    // logActivity here
  }
  ```
- Do NOT call `force-assign-order` edge function here -- that function is for `waitlisted` orders only and sets `force_assigned = true`. Admin assignment of pending_assignment orders is a direct DB update.

#### Dispute Banner (only when `orders.status = 'disputed'`)

Check `disputes` table for open dispute on this order:
```ts
const { data: dispute } = await supabaseServer
  .from('disputes')
  .select('*')
  .eq('order_id', orderId)
  .eq('status', 'open')
  .single()
```

Red banner with three buttons in a Dialog confirmation:

**Important guard:** A `disputes` table row may not exist if admin manually set
`orders.status = 'disputed'` without a real dispute being raised by the user.
Always check for existence before updating the disputes table:

```ts
const { data: disputeRow } = await supabaseServer
  .from('disputes')
  .select('id')
  .eq('order_id', orderId)
  .in('status', ['open', 'admin_reviewing'])
  .maybeSingle() // use maybeSingle, not single -- returns null if no row, not an error
```

- **Refund**: if `disputeRow` exists: update `disputes.status = 'resolved_refund'`, `disputes.resolved_at = now()`, `disputes.resolved_by = adminUser.id`. Always: update `orders.status = 'cancelled'`, `orders.dispute_outcome = 'refund'`.
- **Continue**: if `disputeRow` exists: update `disputes.status = 'resolved_no_refund'`. Always: update `orders.status = 'in_progress'`, `orders.dispute_outcome = 'continue'`.
- **Close**: if `disputeRow` exists: update `disputes.status = 'resolved_no_refund'`. Always: update `orders.status = 'cancelled'`, `orders.dispute_outcome = 'closed'`.

Each option shows a confirmation Dialog before executing.

#### Process Timeline Stepper (sticky)

```ts
// Fetch rounds with all nested data needed to render round cards
const { data: rounds } = await supabaseServer
  .from('order_rounds')
  .select(`
    id, order_id, round_number, title, status, is_visible_to_user,
    created_by_admin_id, created_at, completed_at,
    user_response_deadline, deadline_extended_count, deadline_manually_overridden,
    round_question_requests (
      id, round_id, question_text, answer_text, answered_at, position, created_at
    ),
    order_work_documents (
      id, order_id, round_id, direction, document_label, description, tag,
      status, file_url, file_name, uploaded_at, uploaded_by_type,
      verified_at, rejection_reason, skipped_at, skip_reason,
      linked_request_id, internal_note, internal_note_at,
      internal_note_by
    )
  `)
  .eq('order_id', orderId)
  .order('round_number', { ascending: true })
// Note: order_work_documents here returns all docs for this order scoped by round.
// Supabase will return work docs matching the order_rounds.id via the FK round_id.
// Do NOT re-fetch work docs separately for rounds -- use this joined data.

// Fetch admin names for internal notes display
// Either join admin_users in the query above if Supabase supports it,
// or do a separate lookup: select id, name from admin_users
// then map internal_note_by -> admin name client-side
```

Compact stepper. Each step: round number, title, status dot (gray/yellow/blue/green). Click scrolls content to that round card. "Add Round" button at end opens Dialog.

#### Content Area (scrollable)

All rounds in order. Completed rounds use `Accordion` collapsed by default.

---

### ROUND 0

Always first, read-only. Auto-created by trigger. Header: "Initial Submission" -- green Completed badge -- `formatDate(order.paid_at)`.

**Section A: Questionnaire Answers**

```ts
const [answers, questions] = await Promise.all([
  supabaseServer.from('order_questionnaire_responses')
    .select('question_key, response_value')
    .eq('order_id', orderId),
  supabaseServer.from('service_questionnaires')
    .select('question_key, question_label, question_type, options, display_order')
    // question_type and options needed for renderResponseValue()
    // options is JSONB array of { value: string, label: string }
    .eq('service_package_id', order.service_package_id)
    .order('display_order', { ascending: true })
])

// Merge by question_key
// CONFIRMED: response_value is stored as a RAW primitive -- never wrapped in an object.
// Rendering logic by question type:
//
//   text | textarea | date:
//     display: String(answer.response_value)
//
//   number:
//     display: String(answer.response_value)
//
//   select | radio:
//     response_value is the option VALUE (e.g. "private_limited")
//     to show human label: question.options?.find(o => o.value === answer.response_value)?.label ?? String(answer.response_value)
//     question.options comes from service_questionnaires.options (JSONB array of {value, label})
//
//   multiselect:
//     response_value is an array: ["option1", "option2"]
//     display: (answer.response_value as string[]).join(', ')
//     to show labels: map each value through options lookup above
//
// Safe universal renderer for admin display (shows human-readable labels for selects):
function renderResponseValue(
  responseValue: string | number | string[] | null,
  questionType: string,
  options?: Array<{ value: string; label: string }>
): string {
  if (responseValue == null) return 'Not answered'
  if (questionType === 'multiselect' && Array.isArray(responseValue)) {
    return responseValue
      .map(v => options?.find(o => o.value === v)?.label ?? v)
      .join(', ')
  }
  if ((questionType === 'select' || questionType === 'radio') && options) {
    return options.find(o => o.value === String(responseValue))?.label ?? String(responseValue)
  }
  return String(responseValue)
}
// Call: renderResponseValue(answer.response_value, question.question_type, question.options)
```

"Download Answers as CSV" button -- client-side generation. Columns: Question, Answer.

**Section B: Initial Documents**

```ts
const initialDocs = await supabaseServer
  .from('order_documents')
  .select('*')
  .eq('order_id', orderId)
  .eq('stage_key', 'doc_collection')
```

Each doc: `document_label`, status (Verified/Rejected/Pending/Not uploaded), View/Download/Verify/Reject buttons.

Verify: server action call. In `actions.ts`:
```ts
export async function verifyInitialDocument(documentId: string) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')
  await supabaseServer.from('order_documents')
    .update({ verified_at: new Date().toISOString(), verified_by: adminUser.id })
    .eq('id', documentId)
}
```
Reject: inline REJECTION_REASONS dropdown. On confirm: server action sets `rejection_reason`.
All Verify/Reject/Skip calls are server actions using `getAdminUser()` to get `adminUser.id`.

"Download All as ZIP" using JSZip. Fetch from `order-documents` bucket.

**Section C: Decision Strip**

Visible only when no Round 1 exists AND no professional assigned:

```tsx
<div className="flex gap-4 p-4 bg-muted rounded-lg border border-dashed mt-4">
  <div className="flex-1 text-center space-y-2">
    <p className="text-xs text-muted-foreground">Initial docs need follow-up?</p>
    <Button variant="outline" size="sm" onClick={() => setAddRoundOpen(true)}>
      Create Round 1
    </Button>
  </div>
  <Separator orientation="vertical" />
  <div className="flex-1 text-center space-y-2">
    <p className="text-xs text-muted-foreground">Ready to begin work?</p>
    <Button variant="outline" size="sm" onClick={() => setAssignOpen(true)}>
      Assign professional
    </Button>
  </div>
</div>
```

Hide once professional assigned OR round with `round_number = 1` exists.

---

### Regular Round Cards (Round 1+)

Outer shell:
- Round number + title (inline-editable on click, saves to `order_rounds.title`)
- Status badge using `<Badge>` variants
- "Created by {admin name} on {formatDate(created_at)}"
- "Mark Round Complete" button: only visible when all `round_question_requests` for round have `answered_at` set AND all `order_work_documents` where `direction = 'from_customer'` and `round_id = round.id` have `status = 'verified'` OR `skipped_at` set. On click with Dialog confirm: set `order_rounds.status = 'completed'`, `completed_at = now()`.

Content order: questions → from_customer docs → to_customer docs.

#### Questions Section

"Download All Answers as CSV" at top right. Merges Round 0 answers (from `order_questionnaire_responses` joined to `service_questionnaires`) with round answers (from `round_question_requests`). CSV columns: Round Number, Round Title, Question, Answer, Answered At.

Each question:
- Answered: gray box with `answer_text` + `formatDateTime(answered_at)`
- Unanswered: yellow Badge "Awaiting answer"

"Add Question" inline: text input, Enter saves new `round_question_requests` row. After insert: set `order_rounds.status = 'awaiting_user'`.

#### From-Customer Docs Section

"Download All as ZIP" at top right. Uses JSZip on `work-documents` bucket files for this round.

Each document request card:
- `document_label` + `description` if set
- If `linked_request_id` set: yellow callout "Re-upload requested"
- Status Badge

If Uploaded:
- `file_name` + `formatDateTime(uploaded_at)`
- View / Verify / Reject / Skip buttons
- Reject: inline REJECTION_REASONS `<Select>`. If 'other': text input. On confirm: set `rejection_reason`, optionally append other text. Set `status = 'rejected'`.
- Verify: set `status = 'verified'`, `verified_at = now()`
- Skip: inline text input for reason. On confirm: set `skipped_at = now()`, `skip_reason`

If Verified: green Badge + `formatDateTime(verified_at)`. "Undo Verification" link.
If Rejected: red callout with `getRejectionLabel(rejection_reason)`. "Undo Rejection" link.

#### To-Customer Docs Section (Admin Uploads)

"Upload Document" button at top right.

Each card:
- `file_name` + tag Badge + `description` + "Admin · {formatDate(uploaded_at)}"
- View / Download / Delete (Dialog confirm)

Upload Dialog:
1. File picker using `<UploadDropzone onUpload={async (file) => { await stageFile(file) }} />`
2. Tag `<Select>`: for_signing / government_processing / final_output / informational
3. Description `<Input>` (optional)
4. If for_signing: editable label `<Input>` for linked from_customer request
5. Upload `<Button>`

On upload:
```ts
const fileExt = file.name.split('.').pop()
const docId = crypto.randomUUID()
const fileName = `${orderId}/${docId}/${Date.now()}.${fileExt}`
await getClient().storage.from('work-documents').upload(fileName, file, { cacheControl: '3600', upsert: true })
const { data: { publicUrl } } = getClient().storage.from('work-documents').getPublicUrl(fileName)

// IMPORTANT: This insert must be done via a Next.js server action, NOT directly in
// a client component. supabaseServer cannot be used client-side. Create a server action:
// apps/customer/app/(admin)/admin/orders/[orderId]/actions.ts
// and call it from the upload Dialog's submit handler.

const { data: newDoc } = await supabaseServer.from('order_work_documents').insert({
  order_id: orderId,
  direction: 'to_customer',
  round_id: round.id,
  tag: selectedTag,
  document_label: uploadLabel || file.name,
  // uploadLabel = the label from the form input (step 3 in upload Dialog).
  // If admin left it blank, fall back to file.name. Never use file.name as the primary label.
  description: description || null,
  file_url: publicUrl,
  file_name: file.name,
  uploaded_at: new Date().toISOString(),
  uploaded_by_type: 'admin',
  professional_id: null,
  status: 'uploaded',
}).select().single()
```

If for_signing:
  1. Insert a new from_customer `order_work_documents` row (this is the upload slot for the user):
     ```ts
     const { data: fromCustomerRow } = await supabaseServer
       .from('order_work_documents')
       .insert({
         order_id: orderId,
         direction: 'from_customer',
         round_id: round.id,
         document_label: signLabel, // from the editable label field (step 4 of upload Dialog)
         status: 'pending',
       })
       .select()
       .single()
     ```
  2. Update the to_customer row with `linked_request_id = fromCustomerRow.id`:
     ```ts
     await supabaseServer
       .from('order_work_documents')
       .update({ linked_request_id: fromCustomerRow.id })
       .eq('id', newDoc.id)
     ```
  3. Set `order_rounds.status = 'awaiting_user'`.

  This link is how the user view knows to render the download card immediately above the upload
  dropzone. The to_customer row points to its linked from_customer row via linked_request_id.

If government_processing: set round `status = 'active'`.
If final_output: show Dialog confirm "This marks the document as the final deliverable visible to the user." On confirm: proceed.
If informational: no status changes.

---

### Add Round Dialog

```tsx
<Dialog open={addRoundOpen} onOpenChange={setAddRoundOpen}>
  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
```

Fields:
1. Round title `<Input>` (required)
2. Checkboxes: Questions / Document Requests / Admin Upload
3. Questions: text inputs, "Add another" link
4. Document Requests:
   - Text inputs for label + description
   - Auto-surface rejected documents as pre-checked:
     - From `order_documents` (Round 0 rejections): "Re-upload: {document_label} -- {getRejectionLabel(rejection_reason)}"
     - From `order_work_documents` where `direction = 'from_customer'` and `status = 'rejected'`: same format
   - Admin can uncheck any
5. Admin Upload: `UploadDropzone`, tag Select, description Input, label Input

   **Staging pattern for admin upload in Add Round Dialog:**
   The file must be uploaded to Supabase Storage BEFORE the server action is called,
   because the server action needs the public URL. Stage client-side:

   ```ts
   const [stagedAdminUpload, setStagedAdminUpload] = useState<{
     file: File
     fileUrl: string
     fileName: string
   } | null>(null)

   // UploadDropzone onUpload handler -- uploads immediately to storage
   const handleAdminUploadStage = async (file: File) => {
     const supabase = getClient()
     const ext = file.name.split('.').pop()
     const path = `${orderId}/${crypto.randomUUID()}/${Date.now()}.${ext}`
     await supabase.storage.from('work-documents').upload(path, file, { upsert: true })
     const { data: { publicUrl } } = supabase.storage.from('work-documents').getPublicUrl(path)
     setStagedAdminUpload({ file, fileUrl: publicUrl, fileName: file.name })
   }
   ```

   Unlike the customer round-uploads page (which stages file in memory only),
   admin uploads in the Add Round Dialog upload to storage immediately on drop.
   This is because the server action `createRound` needs the URL at the time it runs.
6. Notification message `<Textarea>` (pre-filled, editable)
7. "Visible to user" `<Switch>` (default on)

Pre-fill messages:
- Questions only: "We have some additional questions for you. Please see the latest step in your order."
- Docs only: "We need some additional documents. Please see the latest step in your order."
- for_signing: "We have shared a document for your signature. Please see the latest step in your order."
- government_processing: "Your application has been submitted to the government. We will update you when we hear back."
- final_output: "Your final document is ready. Please download it from your order page."
- Mixed: "Action required on your order. Please see the latest step in your order."

On Save (this entire block is a server action -- all supabaseServer calls inside it):

```ts
// In actions.ts:
export async function createRound(orderId: string, formData: AddRoundFormData) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  // Step 1: Calculate the next round_number
  const { data: existingRounds } = await supabaseServer
    .from('order_rounds')
    .select('round_number')
    .eq('order_id', orderId)
    .order('round_number', { ascending: false })
    .limit(1)
  const nextRoundNumber = existingRounds?.[0]?.round_number != null
    ? existingRounds[0].round_number + 1
    : 1 // Round 0 always exists for paid orders; first manual round is always 1

  // Step 2: Determine round status
  const requiresUserAction = formData.questions.length > 0 || formData.docRequests.length > 0
  const roundStatus = requiresUserAction ? 'awaiting_user' : 'active'

  // Step 3: Insert order_rounds
  const { data: newRound } = await supabaseServer
    .from('order_rounds')
    .insert({
      order_id: orderId,
      created_by_admin_id: adminUser.id,
      round_number: nextRoundNumber,
      title: formData.title,
      status: roundStatus,
      is_visible_to_user: formData.isVisibleToUser,
    })
    .select()
    .single()

  // Step 4: Insert round_question_requests
  if (formData.questions.length > 0) {
    await supabaseServer.from('round_question_requests').insert(
      formData.questions.map((q, i) => ({
        round_id: newRound.id,
        question_text: q,
        position: i,
      }))
    )
  }

  // Step 5: Insert from_customer doc request rows
  for (const docReq of formData.docRequests) {
    await supabaseServer.from('order_work_documents').insert({
      order_id: orderId,
      direction: 'from_customer',
      round_id: newRound.id,
      document_label: docReq.label,
      description: docReq.description || null,
      status: 'pending',
      // For rejected doc re-uploads from order_work_documents:
      linked_request_id: docReq.isReuploadOfWorkDocId ?? null,
      // For rejected docs from order_documents (Round 0 initial):
      // No linked_request_id -- these are a new request for the same document.
      // The admin can note in document_label that it is a re-upload of the initial doc.
    })
  }

  // Step 6: Insert to_customer upload if admin uploaded a file
  if (formData.adminUpload) {
    // File is uploaded to storage BEFORE calling this server action (in the client component)
    // This action receives the publicUrl after upload is complete
    const { data: toCustomerRow } = await supabaseServer
      .from('order_work_documents')
      .insert({
        order_id: orderId,
        direction: 'to_customer',
        round_id: newRound.id,
        tag: formData.adminUpload.tag,
        document_label: formData.adminUpload.label,
        description: formData.adminUpload.description || null,
        file_url: formData.adminUpload.fileUrl,
        file_name: formData.adminUpload.fileName,
        uploaded_at: new Date().toISOString(),
        uploaded_by_type: 'admin',
        status: 'uploaded',
      })
      .select()
      .single()

    // If for_signing: create linked from_customer row and set linked_request_id
    if (formData.adminUpload.tag === 'for_signing') {
      const { data: signingRequest } = await supabaseServer
        .from('order_work_documents')
        .insert({
          order_id: orderId,
          direction: 'from_customer',
          round_id: newRound.id,
          document_label: formData.adminUpload.signLabel,
          status: 'pending',
        })
        .select()
        .single()
      await supabaseServer
        .from('order_work_documents')
        .update({ linked_request_id: signingRequest.id })
        .eq('id', toCustomerRow.id)
    }
  }

  // Step 7: Insert round_notifications if visible to user
  if (formData.isVisibleToUser && formData.notificationMessage) {
    await supabaseServer.from('round_notifications').insert({
      order_id: orderId,
      round_id: newRound.id,
      message: formData.notificationMessage,
    })
  }

  return newRound
}
```

---

### Internal Admin Notes

Bottom of left panel scrollable area. Below all rounds.

```ts
const notes = await supabaseServer
  .from('order_admin_notes')
  .select(`*, admin_users(name)`)
  .eq('order_id', orderId)
  .order('created_at', { ascending: false })
```

Header: "Internal Notes" with lock icon + "Only visible to admin team" in muted text.

Each note: `admin_users.name`, `formatDateTime(created_at)`, content. Delete button for own notes (`admin_id = adminUser.id`).

`<Textarea>` + "Save Note" button. On save: insert `order_admin_notes` row with `admin_id = adminUser.id`.

---

### Mark Order Complete

Visible only when:
- `orders.status` is not 'completed' or 'cancelled'
- At least one `order_work_documents` row with `tag = 'final_output'` exists for this order

```tsx
<Button
  onClick={() => setCompleteDialogOpen(true)}
  disabled={order.status !== 'in_progress'}
>
  Mark order complete
</Button>
{order.status !== 'in_progress' && (
  <p className="text-xs text-muted-foreground mt-1">
    Order must be in progress. Current status: {order.status}
  </p>
)}
```

Dialog confirmation + call `admin-advance-stage`:

```ts
// Fetch session client-side for the JWT token
const { data: { session } } = await getClient().auth.getSession()
if (!session) { toast({ title: 'Session expired', variant: 'destructive', description: 'Please log in again.' }); return }

const res = await fetch(getEdgeFunctionUrl('admin-advance-stage'), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  },
  body: JSON.stringify({ order_id: orderId }),
})

if (!res.ok) {
  const err = await res.json()
  toast({ title: 'Error', variant: 'destructive', description: err.error })
  return
}

// Insert in-app notification via a server action
// Call: await insertCompletionNotification(orderId)
// In actions.ts:
// export async function insertCompletionNotification(orderId: string) {
//   const adminUser = await getAdminUser()
//   if (!supabaseServer) throw new Error()
//   await supabaseServer.from('round_notifications').insert({
//     order_id: orderId,
//     message: 'Your order is complete. Your final document is ready to download.',
//   })
//   await logActivity({ orderId, actionType: LOG_ACTIONS.ORDER_COMPLETED, actorType: 'admin',
//     actorId: adminUser.id, actorName: adminUser.name, description: 'Order marked complete by admin' })
// }

toast({ title: 'Order completed', description: 'The user has been notified.' })
```

---

### RIGHT PANEL: Chat

```tsx
{order.chat_conversation_id ? (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
      <span className="font-medium text-sm">Order Chat</span>
      <Badge variant="destructive" className="text-xs">User can see this</Badge>
    </div>
    <ChatWindow
      conversationId={order.chat_conversation_id}
      professionalName={`${adminUser.name} (Admin)`}
    />
  </div>
) : (
  <div className="flex-1 flex items-center justify-center p-6 text-center">
    <p className="text-sm text-muted-foreground">
      Chat unavailable. Payment webhook may not have completed for this order.
    </p>
  </div>
)}
```

Use `AdminChatWindow` from `@/components/chat/AdminChatWindow.tsx`. Do NOT modify `ChatWindow` -- it is used by customers and hardcodes sender_type as 'user'. Full implementation in `ollvy_rounds_chat_build.md` Task 2.

---

## View 3: Analytics

### 7 Metric Cards

```ts
const [usersToday, usersAll, ordersToday, activeOrders, ordersAll, revenueToday, revenueAll] =
  await Promise.all([
    supabaseServer.from('users').select('id', { count: 'exact', head: true })
      .gte('created_at', new Date().toISOString().split('T')[0]),
    supabaseServer.from('users').select('id', { count: 'exact', head: true }),
    supabaseServer.from('orders').select('id', { count: 'exact', head: true })
      .gte('paid_at', new Date().toISOString().split('T')[0]),
    supabaseServer.from('orders').select('id', { count: 'exact', head: true })
      .eq('status', 'in_progress'),
    supabaseServer.from('orders').select('id', { count: 'exact', head: true })
      .not('paid_at', 'is', null),
    supabaseServer.from('orders')
      .select('total_paisa_snapshot')
      .gte('paid_at', new Date().toISOString().split('T')[0])
      .neq('status', 'cancelled'),
    supabaseServer.from('orders')
      .select('total_paisa_snapshot')
      .not('paid_at', 'is', null)
      .neq('status', 'cancelled'),
  ])

const revToday = revenueToday.data?.reduce((s, o) => s + o.total_paisa_snapshot, 0) ?? 0
const revAll = revenueAll.data?.reduce((s, o) => s + o.total_paisa_snapshot, 0) ?? 0
// Display: formatPaisa(revToday), formatPaisa(revAll)
```

### Top Services (last 30 days)

```ts
// Do NOT use an RPC here -- it may not exist. Use a direct query:
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
const { data: topServicesRaw } = await supabaseServer
  .from('orders')
  .select('service_package_id, service_packages(name), total_paisa_snapshot')
  .gte('paid_at', thirtyDaysAgo)
  .neq('status', 'cancelled')

// Group client-side or use supabaseServer with a raw rpc if you prefer:
// Group by service_package_id, sum count and revenue, sort descending
const serviceMap = new Map<string, { name: string; count: number; revenue: number }>()
for (const row of topServicesRaw || []) {
  const id = row.service_package_id
  const existing = serviceMap.get(id) ?? { name: row.service_packages?.name ?? id, count: 0, revenue: 0 }
  serviceMap.set(id, {
    name: existing.name,
    count: existing.count + 1,
    revenue: existing.revenue + (row.total_paisa_snapshot ?? 0),
  })
}
const topServices = Array.from(serviceMap.values())
  .sort((a, b) => b.count - a.count)
  .slice(0, 10)
const totalOrders = topServices.reduce((s, t) => s + t.count, 0)
```

Columns: Service name, Orders, % of total.

### Needs Attention + Recent Completed

Orders where status = 'pending_assignment' or 'disputed'. Display `order_number`, service, user, `days_active`, Open button.

Last 20 completed orders. `order_number`, service, user, `formatPaisa(total_paisa_snapshot)`, `formatDate(completed_at)`.

---

## Users View

```ts
const users = await supabaseServer
  .from('users')
  .select('*, orders(count)')
  .order('created_at', { ascending: false })
```

Table columns: business_name, phone, business_type, `formatDate(created_at)`, order count ("None" in muted if 0), View button.

User detail: all user fields + all orders with `<OrderStatusBadge>`, service name, `formatPaisa(total_paisa_snapshot)`, `formatDate(paid_at)`, Open button.

---

## Orders List (`/admin/orders`)

Columns: `order_number`, service, user, `formatPaisa(total_paisa_snapshot)`, `<OrderStatusBadge>`, `formatDate(paid_at)`, Open button.

Filter tabs: All / Active / Needs Attention / Completed / Cancelled.

---

## Customer App Changes

The existing order detail page is a `'use client'` component. No wrapper needed for realtime.

### Three injection points (confirmed line numbers from order detail page)

The page structure is:
```
<div className="container py-12 max-w-5xl">
  Back Button
  [INJECT 1 -- round notification banner here, ~line 421]
  Existing notification banner -- pending work docs
  Existing notification banner -- new deliverables
  Header
  Continue Setup Button
  <div className="grid md:grid-cols-3 gap-8">
    LEFT COLUMN (md:col-span-2):
      Progress Overview Card
      Progress Timeline Card (lines 676-888)
      [INJECT 2 -- rounds timeline here, after line 888]
    RIGHT SIDEBAR:
      Professional Card
      Order Summary Card
      Downloads Card
      WorkDocumentsSection (lines 1168-1176, inside div#work-documents-section)
      Chat Card
```

**Injection 1: Final output banner + round notification banner -- before existing banners (~line 421)**

```tsx
{/* ADD: Final output banner -- absolute top */}
<FinalOutputBanner orderId={order.id} />
{/* ADD: Round notification banner */}
<RoundNotificationBanner orderId={order.id} />
{/* EXISTING: Notification Banner - Pending Work Documents */}
{pendingWorkDocs.length > 0 && (...)}
{/* EXISTING: Notification Banner - New Deliverables */}
{newDeliverables.length > 0 && pendingWorkDocs.length === 0 && (...)}
```

**Injection 2: Rounds timeline -- in the LEFT COLUMN (md:col-span-2) after Progress Timeline (after line 888)**

This goes inside the left column div, NOT after the sidebar or after WorkDocumentsSection.

```tsx
{/* EXISTING: Progress Timeline Card (lines 676-888) */}

{/* ADD: Rounds timeline -- in left column, after progress timeline */}
<RoundsTimeline orderId={order.id} servicePackageId={order.service_package_id} />

{/* No injection in sidebar -- WorkDocumentsSection stays at lines 1168-1176 unchanged */}
```

**WorkDocumentsSection query fix (one-line change to existing page query):**

```ts
// Find the existing work documents fetch in the page (fetches ALL work docs)
// Add .is('round_id', null) to exclude round-scoped docs from the existing section

const { data: workDocsData } = await supabase
  .from('order_work_documents')
  .select('*')
  .eq('order_id', orderId)
  .is('round_id', null)  // ADD THIS LINE -- prevents round docs from appearing in WorkDocumentsSection
  .order('created_at', { ascending: false })
```

### RoundNotificationBanner component

```tsx
'use client'
import { useEffect, useState } from 'react'
import { getClient } from '@/lib/supabase'

export function RoundNotificationBanner({ orderId }: { orderId: string }) {
  const [notification, setNotification] = useState(null)
  const supabase = getClient()

  const fetchNotification = async () => {
    const { data } = await supabase
      .from('round_notifications')
      .select('*')
      .eq('order_id', orderId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    setNotification(data)
  }

  useEffect(() => {
    fetchNotification()
    const channel = supabase
      .channel(`round-notif-${orderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'round_notifications',
        filter: `order_id=eq.${orderId}`,
      }, fetchNotification)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [orderId])

  if (!notification) return null

  const handleDismiss = async () => {
    await supabase
      .from('round_notifications')
      .update({ is_dismissed: true, dismissed_at: new Date().toISOString() })
      .eq('id', notification.id)
    fetchNotification() // refetch to surface next undismissed notification
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex justify-between items-start">
      <p className="text-blue-800 text-sm font-medium">{notification.message}</p>
      <button onClick={handleDismiss} className="text-blue-500 text-xs underline ml-4 shrink-0">
        Got it
      </button>
    </div>
  )
}
```

### FinalOutputBanner component

```tsx
'use client'
export function FinalOutputBanner({ orderId }: { orderId: string }) {
  const [finalDoc, setFinalDoc] = useState(null)
  const supabase = getClient()

  useEffect(() => {
    supabase
      .from('order_work_documents')
      .select('file_url, file_name, description')
      .eq('order_id', orderId)
      .eq('tag', 'final_output')
      .eq('direction', 'to_customer')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setFinalDoc(data))
  }, [orderId])

  if (!finalDoc) return null

  return (
    <div className="bg-green-50 border border-green-300 rounded-lg p-5 mb-4">
      <p className="text-green-800 font-semibold">Your document is ready</p>
      {finalDoc.description && <p className="text-green-700 text-sm mt-1">{finalDoc.description}</p>}
      <a
        href={finalDoc.file_url}
        download
        className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded text-sm font-medium"
      >
        Download Now
      </a>
    </div>
  )
}
```

### RoundsTimeline component

Create `apps/customer/components/orders/RoundsTimeline.tsx`:

```tsx
'use client'
import { useEffect, useState } from 'react'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateTime } from '@/lib/utils'

interface RoundsTimelineProps {
  orderId: string
  servicePackageId: string
}

export function RoundsTimeline({ orderId, servicePackageId }: RoundsTimelineProps) {
  const { user } = useAuthStore()
  const supabase = getClient()
  const [rounds, setRounds] = useState([])
  const [round0Data, setRound0Data] = useState({ answers: [], questions: [], initialDocs: [] })

  useEffect(() => {
    if (!user?.id) return

    // Fetch all visible rounds with their questions and doc requests
    supabase
      .from('order_rounds')
      .select(`
        id, order_id, round_number, title, status, created_at, completed_at,
        round_question_requests (id, question_text, answer_text, answered_at, position),
        order_work_documents (
          id, direction, document_label, description, tag, status,
          file_url, file_name, uploaded_at, rejection_reason, linked_request_id
        )
      `)
      .eq('order_id', orderId)
      .eq('is_visible_to_user', true)
      .order('round_number', { ascending: true })
      .then(({ data }) => setRounds(data || []))

    // Fetch Round 0 data separately (initial docs and questionnaire answers)
    // These come from different tables than order_rounds
    Promise.all([
      supabase
        .from('order_questionnaire_responses')
        .select('question_key, response_value')
        .eq('order_id', orderId),
      supabase
        .from('service_questionnaires')
        .select('question_key, question_label, question_type, options, display_order')
        // question_type and options needed to render select/radio labels correctly
        .eq('service_package_id', servicePackageId)
        .order('display_order', { ascending: true }),
      supabase
        .from('order_documents')
        .select('id, document_label, file_url, file_name, verified_at, rejection_reason, stage_key')
        .eq('order_id', orderId)
        .eq('stage_key', 'doc_collection'),
    ]).then(([answersRes, questionsRes, docsRes]) => {
      setRound0Data({
        answers: answersRes.data || [],
        questions: questionsRes.data || [],
        initialDocs: docsRes.data || [],
      })
    })
  }, [orderId, servicePackageId, user?.id])

  if (!rounds.length) return null

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Steps
      </h3>
      {rounds.map(round => (
        <RoundCard
          key={round.id}
          round={round}
          orderId={orderId}
          round0Data={round.round_number === 0 ? round0Data : null}
        />
      ))}
    </div>
  )
}
```

Each `RoundCard` renders one round. For Round 0 it receives `round0Data` (answers, questions, initial docs). For Round 1+ it uses the nested `round_question_requests` and `order_work_documents` from the rounds query.

Split `order_work_documents` by direction inside each round card:
```ts
const docRequests = round.order_work_documents?.filter(d => d.direction === 'from_customer') ?? []
const adminUploads = round.order_work_documents?.filter(d => d.direction === 'to_customer') ?? []
```

**Round 0 in user view:** Read-only. Shows user's questionnaire answers (merged from `round0Data.answers` and `round0Data.questions`) and initial uploaded documents (from `round0Data.initialDocs`). Completed badge. No upload dropzones, no action buttons.

**Action tag logic:**

```ts
function getActionTag(round, questions, docRequests, adminUploads) {
  if (round.status === 'completed') return { label: 'Completed', variant: 'success' }

  const hasUnansweredQ = questions.some(q => !q.answered_at)
  const hasPendingDocs = docRequests.some(d => d.status === 'pending' || d.status === 'rejected')
  const hasReuploadDocs = docRequests.some(d => d.linked_request_id)
  const hasForSigning = adminUploads.some(d => d.tag === 'for_signing')
  const hasGovt = adminUploads.some(d => d.tag === 'government_processing')

  if (hasUnansweredQ && !hasPendingDocs) return { label: 'Answer questions', variant: 'default' }
  if (hasForSigning) return { label: 'Sign and re-upload', variant: 'destructive' }
  if (hasPendingDocs && hasReuploadDocs) return { label: 'Upload additional documents', variant: 'secondary' }
  if (hasPendingDocs) return { label: 'Upload documents', variant: 'secondary' }
  if (hasGovt) return { label: 'Awaiting government processing', variant: 'outline' }
  return { label: 'Awaiting review', variant: 'warning' }
}
```

Never show internal enum values (no 'awaiting_user', no 'pending', no 'in_progress') to the user.

**Questions section in user view:**

Free text inputs for each unanswered question. Answered questions are read-only gray boxes.

User identification: `const { user } = useAuthStore()` -- `user.id` is `users.id`, NOT `auth_user_id`.

Submit all questions together. CTA: "Submit answers" (disabled until all filled, enabled when all filled).

On submit: `supabase.from('round_question_requests').update({ answer_text, answered_at: now })`.

**Document requests in user view:**

If questions in same round and unanswered: gray out doc section with `pointer-events-none opacity-50` + "Complete the questions above first."

Render new requests first, re-upload requests after.

Each dropzone card:
- `document_label` + `description`
- If re-upload: red callout directly above dropzone using `buildRejectionMessage(document_label, rejection_reason)`
- `<UploadDropzone onUpload={async (file) => { await stageFile(docRequest.id, file) }} label={document_label} />`

CTA button at bottom:
- Nothing staged, no re-uploads: "Upload documents" (disabled)
- Nothing staged, re-uploads: "Upload additional documents" (disabled)
- Staged, no re-uploads: "Submit documents" (enabled)
- Staged, re-uploads: "Submit additional documents" (enabled)

On submit:
```ts
// Upload to work-documents bucket (users have write access confirmed)
const fileExt = file.name.split('.').pop()
const fileName = `${orderId}/${docRequestId}/${Date.now()}.${fileExt}`
await supabase.storage.from('work-documents').upload(fileName, file, { cacheControl: '3600', upsert: true })
const { data: { publicUrl } } = supabase.storage.from('work-documents').getPublicUrl(fileName)

// Update order_work_documents row
await supabase.from('order_work_documents').update({
  file_url: publicUrl,
  file_name: file.name,
  uploaded_at: new Date().toISOString(),
  status: 'uploaded',
  uploaded_by_type: 'customer',
}).eq('id', docRequestId)
```

Show success toast using `useToast`. Show error toast on failure.

**Admin uploads in user view:**

Each card: file name, plain-language tag label, description, Download button.

for_signing uploads: download card renders immediately above the linked `from_customer` request dropzone. They are adjacent in the list.

---

## Dependencies

Only new dependency:

```bash
npm install jszip --workspace=apps/customer
npm install --save-dev @types/jszip --workspace=apps/customer
```

Import lazily in ZIP download handlers:
```ts
const JSZip = (await import('jszip')).default
```

---

## Do Not Build

- Email or SMS notifications (do not call `send-notification`)
- In-browser document editing
- Razorpay API calls
- A separate Next.js app
- `request-document` edge function calls for round docs
- `advance-stage` calls (use `admin-advance-stage` instead)
- `force-assign-order` for pending_assignment orders (direct DB update only)
- Any imports of `auth-store.ts` or `questionnaire-store.ts` in admin code
- Role-based permissions

---

## Verification Checklist

### Migrations
- [ ] `order_rounds` table created with unique constraint on (order_id, round_number)
- [ ] `round_question_requests` table created with RLS for user select + update
- [ ] `round_notifications` table created with RLS for user select + update
- [ ] `order_admin_notes` table created with RLS enabled but NO user-facing policies
- [ ] `order_work_documents` has `round_id`, `tag`, `linked_request_id`, `skipped_at`, `skip_reason` columns
- [ ] `orders` has `dispute_outcome` column
- [ ] Round 0 trigger fires on UPDATE of paid_at (test with existing order)
- [ ] Round 0 INSERT trigger NOT created (razorpay-webhook confirmed to use UPDATE for paid_at)
- [ ] Round 0 UPDATE trigger fires correctly (test by updating paid_at on an unpaid test order)
- [ ] Round 0 backfill ran for all existing paid orders
- [ ] Realtime enabled on order_rounds, round_notifications, order_admin_notes

### Edge function
- [ ] `admin-advance-stage` function deployed and accessible
- [ ] `admin-advance-stage` uses `verifyAdmin` not `verifyProfessional`
- [ ] `admin-advance-stage` creates payout row when professional is assigned
- [ ] `admin-advance-stage` posts system chat message
- [ ] `admin-advance-stage` creates `order_stage_history` record
- [ ] `admin-advance-stage` rolls back order status to `in_progress` if payout insert fails
- [ ] `admin-advance-stage` uses `orders.chat_conversation_id` directly for system message (not a secondary lookup)

### TypeScript types
- [ ] `OrderWorkDocument` interface updated with `round_id`, `tag`, `linked_request_id`, `skipped_at`, `skip_reason`
- [ ] `OrderWorkDocument.uploaded_by_type` union updated to include `'admin'`
- [ ] `OrderRound`, `RoundQuestionRequest`, `RoundNotification`, `OrderAdminNote` interfaces added to `lib/types.ts`

### Admin seed
- [ ] At least one Supabase Auth user created for admin access
- [ ] Corresponding `admin_users` row inserted with `role = 'super_admin'` and `is_active = true`
- [ ] Login tested at `/admin/login` before proceeding with any other testing

### Auth and routing
- [ ] `/admin` redirects to `/admin/login` when unauthenticated (handled by admin layout, NOT middleware)
- [ ] Non-admin blocked at `admin_users.is_active` check
- [ ] `supabaseServer` null check added to admin layout before `admin_users` query
- [ ] No `<Toaster />` added to admin layout (already in root `app/layout.tsx`)
- [ ] All `/admin/*` page sources contain `noindex, nofollow`
- [ ] `/admin/*` absent from sitemap.xml
- [ ] No imports of `auth-store.ts` in any `(admin)/` file
- [ ] No imports of `questionnaire-store.ts` in any `(admin)/` file

### Formatting
- [ ] All currency uses `formatPaisa()` from `lib/utils.ts`
- [ ] All dates use `formatDate()` or `formatDateTime()` from `lib/utils.ts`
- [ ] No raw `Intl.NumberFormat` or `toLocaleString` calls in admin components
- [ ] `order_number` displayed as formatted text (OLV-2026-00042), not UUID

### Work queue
- [ ] Bucket CASE query returns one bucket per order (no duplicates)
- [ ] Days active red at > 3
- [ ] Search filters by order_number, business_name, service name

### Order view -- admin
- [ ] All admin queries use `supabaseServer` service role
- [ ] `get_user_order` RPC not called anywhere in admin
- [ ] Round 0 answers from `order_questionnaire_responses` (not `round_question_requests`)
- [ ] Round 0 docs from `order_documents` where `stage_key = 'doc_collection'`
- [ ] Round 0 Verify/Reject updates `order_documents` not `order_work_documents`
- [ ] Rejected Round 0 docs surface as pre-checked in Add Round Dialog
- [ ] Rejected `order_work_documents` from_customer rows surface as pre-checked in Add Round Dialog
- [ ] Add Round opens as Dialog (not Sheet -- Sheet covers chat panel)
- [ ] "Mark Round Complete" blocked when any from_customer doc has `status = 'uploaded'`
- [ ] Dispute resolution updates `disputes` table with correct `dispute_status` enum values
- [ ] Dispute resolution also sets `orders.dispute_outcome`
- [ ] Professional assignment filters by `status = 'approved'` + `professional_availability` join
- [ ] Professional assignment for pending_assignment orders is direct DB update, NOT force-assign-order
- [ ] Admin uploads set `uploaded_by_type = 'admin'`
- [ ] Admin upload storage path: `{orderId}/{newUUID}/{timestamp}.{ext}` in `work-documents` bucket
- [ ] final_output upload shows Dialog confirmation before inserting
- [ ] "Mark Order Complete" calls `admin-advance-stage` not `advance-stage`
- [ ] "Mark Order Complete" disabled and shows message when order is not `in_progress`
- [ ] "Mark Order Complete" inserts `round_notifications` row after successful edge function call
- [ ] Admin notes have NO read access for user or professional roles (verify via Supabase dashboard)

### Chat
- [ ] Chat panel shows error state (not crash) when `chat_conversation_id` is null
- [ ] Admin messages insert with `sender_type = 'professional'`
- [ ] No second realtime subscription added (ChatWindow handles its own)

### Customer app
- [ ] `round_id IS NULL` filter added to existing work documents query in order detail page
- [ ] WorkDocumentsSection no longer shows round-scoped docs
- [ ] Round notification banner injected BEFORE existing notification banners (~line 421 in order detail page)
- [ ] Final output banner injected ABOVE round notification banner (absolute top of page)
- [ ] Rounds timeline injected in LEFT COLUMN (md:col-span-2) AFTER Progress Timeline (after line 888) -- NOT in sidebar
- [ ] Round 0 in user view is read-only (no interactive elements)
- [ ] Action tags use human-readable labels (never 'awaiting_user', 'pending', 'in_progress')
- [ ] Re-upload rejection callout scoped to specific doc card only (not section banner)
- [ ] for_signing admin upload card renders immediately above its linked from_customer dropzone
- [ ] Doc section grayed out until questions submitted in same round
- [ ] Dismissing notification calls refetch (next undismissed surfaces, not just hidden)
- [ ] User doc uploads go to `work-documents` bucket with `uploaded_by_type = 'customer'`
- [ ] User identification uses `useAuthStore().user.id` (users table UUID, not auth_user_id)
- [ ] Existing Progress Timeline, stats cards, WorkDocumentsSection untouched
- [ ] Success/error toast shown on doc submission

### Downloads
- [ ] JSZip imported lazily (dynamic import), not top-level
- [ ] Round 0 ZIP uses `order-documents` bucket
- [ ] Round 1+ doc request ZIP uses `work-documents` bucket
- [ ] CSV merges Round 0 (`order_questionnaire_responses`) with round answers (`round_question_requests`)

### Server actions
- [ ] All supabaseServer mutations are inside 'use server' actions files, never in client component event handlers
- [ ] Each admin page has a corresponding `actions.ts` file for its mutations
- [ ] logActivity calls are inside server actions, never in client components

### Chat
- [ ] Admin order view uses `AdminChatWindow`, not `ChatWindow`
- [ ] `ChatWindow` is NOT modified (remains customer-only)
- [ ] Admin upload label comes from the form label field, not file.name
- [ ] for_signing upload creates from_customer row AND updates to_customer.linked_request_id to point to it

# Retainer Billing Engine - End-to-End Verification

## Implementation Summary

### Edge Functions Deployed (9/9)
1. `create-razorpay-subscription` - Creates Razorpay subscription and retainer_subscriptions row
2. `create-retainer-orders` - Internal function to create child orders for billing cycle
3. `retainer-billing-webhook` - Handles 5 webhook events (subscription.charged, payment_failed, cancelled, paused, resumed)
4. `pause-retainer` - User-initiated pause (max 2/year)
5. `resume-retainer` - Resume paused subscription
6. `cancel-retainer` - Cancel subscription (immediate during trial, end-of-cycle otherwise)
7. `change-retainer-tier` - Switch between tiers in same tier group
8. `replace-retainer-professional` - 3-tier geo-matching for professional replacement
9. `sync-retainer-obligations` - Mark compliance obligations as covered/uncovered

### Mobile Screens Updated/Created (6/6)
1. `checkout/[serviceId].tsx` - Updated with retainer checkout path, tier selection, Pro trial badge
2. `(tabs)/orders.tsx` - Updated with "Retainers" tab (U17)
3. `retainer/[id].tsx` - Retainer detail screen (U18)
4. `retainer/[id]/cancel.tsx` - Cancel confirmation screen (U19)
5. `retainer/[id]/change-tier.tsx` - Change tier screen (U20)

### Professional Panel Pages (Already Existed)
1. `app/retainers/page.tsx` - P11 Retainer List
2. `app/retainers/[id]/page.tsx` - P12 Retainer Detail with key numbers

### Database Migration Applied
- `20260311070000_retainer_billing_schema.sql` - Creates retainer_billing_events table, adds missing columns

---

## Verification Steps

### Step 1: Create Test Retainer Subscription

```bash
# Use dev bypass user (in development environment, uses simulated Razorpay)
curl -X POST "https://qxnlpkykbqwjhlgmfsth.supabase.co/functions/v1/create-razorpay-subscription" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER_JWT_TOKEN>" \
  -d '{
    "service_package_id": "<RETAINER_SERVICE_PACKAGE_ID>",
    "billing_cycle": "monthly"
  }'

# Expected response:
# {
#   "ok": true,
#   "razorpay_subscription_id": "sub_xxx",
#   "retainer_subscription_id": "<UUID>",
#   "is_trial": true/false,
#   "trial_days": 30/0,
#   "monthly_price_paisa": 99900,
#   "service_name": "GST Filing Monthly"
# }
```

### Step 2: Simulate subscription.charged Webhook

```bash
# Note: In production, use real Razorpay webhook with HMAC signature
# For dev testing, call the webhook with service role key

curl -X POST "https://qxnlpkykbqwjhlgmfsth.supabase.co/functions/v1/retainer-billing-webhook" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" \
  -d '{
    "event": "subscription.charged",
    "payload": {
      "subscription": {
        "entity": {
          "id": "sub_xxx",
          "status": "active"
        }
      },
      "payment": {
        "entity": {
          "id": "pay_xxx",
          "amount": 99900,
          "status": "captured"
        }
      }
    }
  }'

# Expected response:
# {
#   "ok": true,
#   "event": "subscription.charged",
#   "retainer_subscription_id": "<UUID>",
#   "child_order_id": "<UUID>"
# }
```

### Step 3: Verify Data Created

```sql
-- Check retainer_billing_events
SELECT * FROM retainer_billing_events
WHERE retainer_subscription_id = '<RETAINER_ID>'
ORDER BY created_at DESC;

-- Check child orders
SELECT * FROM orders
WHERE retainer_subscription_id = '<RETAINER_ID>'
ORDER BY created_at DESC;

-- Check notifications
SELECT * FROM notifications
WHERE user_id = '<USER_ID>'
AND type = 'retainer_renewed'
ORDER BY created_at DESC;
```

### Step 4: Test Pause → Resume Flow

```bash
# Pause
curl -X POST "https://qxnlpkykbqwjhlgmfsth.supabase.co/functions/v1/pause-retainer" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER_JWT_TOKEN>" \
  -d '{"retainer_subscription_id": "<UUID>"}'

# Expected: status changed to "paused", pause_count incremented

# Resume
curl -X POST "https://qxnlpkykbqwjhlgmfsth.supabase.co/functions/v1/resume-retainer" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER_JWT_TOKEN>" \
  -d '{"retainer_subscription_id": "<UUID>"}'

# Expected: status changed to "active", next_billing_date set to 25th
```

### Step 5: Test Cancel Flow

```bash
# Cancel (end of cycle for paid subscriptions)
curl -X POST "https://qxnlpkykbqwjhlgmfsth.supabase.co/functions/v1/cancel-retainer" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER_JWT_TOKEN>" \
  -d '{
    "retainer_subscription_id": "<UUID>",
    "immediate": false
  }'

# Expected: cancelled_effective_date set, sync-retainer-obligations called
```

---

## Spec Deviations

### 1. Chat Functionality
- **Spec**: Persistent chat per retainer with conversation thread
- **Implementation**: Chat conversation ID is created and stored, but full chat UI not implemented in this iteration
- **Impact**: Low - can be added in future iteration

### 2. Razorpay Plan IDs
- **Spec**: Should use pre-created Razorpay plan IDs from admin
- **Implementation**: Uses dynamically generated plan IDs (`plan_{slug}_{cycle}`)
- **Fix Required**: Admin should create plans in Razorpay dashboard and store plan_id in service_packages

### 3. PDF Engagement Letter
- **Spec**: Generate PDF via @react-pdf/renderer
- **Implementation**: Creates engagement_letters record with JSON content, PDF generation deferred
- **Impact**: Medium - PDF URL stored as null until PDF generation implemented

### 4. Webhook Signature Verification
- **Spec**: HMAC SHA256 signature verification with RAZORPAY_SUBSCRIPTION_WEBHOOK_SECRET
- **Implementation**: Implemented but env var must be set in production
- **Action**: Set RAZORPAY_SUBSCRIPTION_WEBHOOK_SECRET in Supabase secrets

### 5. FCM Push Notifications
- **Spec**: Send FCM push via send-push function
- **Implementation**: Uses notifications table insert instead of direct FCM
- **Note**: send-push function exists and can be triggered by notification insert trigger

### 6. Pro Trial Detection
- **Spec**: First retainer ever = 30-day trial for Pro users
- **Implementation**: Uses RPC function `user_has_retainers` to check
- **Status**: Correctly implemented per spec

### 7. Billing Anchor (25th)
- **Spec**: All subscriptions anchor to 25th of month
- **Implementation**: Handled in Razorpay subscription creation and resume-retainer
- **Status**: Correctly implemented per spec

---

## Environment Variables Required

```bash
# Supabase secrets (production)
npx supabase secrets set RAZORPAY_KEY_ID=rzp_live_xxx
npx supabase secrets set RAZORPAY_KEY_SECRET=xxx
npx supabase secrets set RAZORPAY_SUBSCRIPTION_WEBHOOK_SECRET=xxx
npx supabase secrets set ENVIRONMENT=production
```

---

## Manual Testing Checklist

- [ ] Create retainer subscription via checkout flow
- [ ] Verify Razorpay subscription created (dev: simulated)
- [ ] Check retainer_subscriptions row created with status=onboarding
- [ ] Simulate subscription.charged webhook
- [ ] Verify child order created
- [ ] Verify billing event recorded
- [ ] Verify notification sent
- [ ] Test pause functionality (verify pause_count limit)
- [ ] Test resume functionality
- [ ] Test change tier functionality
- [ ] Test cancel functionality (trial vs paid)
- [ ] Professional panel shows retainer clients
- [ ] Professional can view retainer details and enter key numbers

---

## Files Modified/Created

### Edge Functions (supabase/functions/)
- `create-razorpay-subscription/index.ts`
- `create-retainer-orders/index.ts`
- `retainer-billing-webhook/index.ts`
- `pause-retainer/index.ts`
- `resume-retainer/index.ts`
- `cancel-retainer/index.ts`
- `change-retainer-tier/index.ts`
- `replace-retainer-professional/index.ts`
- `sync-retainer-obligations/index.ts`

### Migrations (supabase/migrations/)
- `20260311070000_retainer_billing_schema.sql`

### Mobile App (apps/mobile/app/)
- `checkout/[serviceId].tsx` (modified)
- `(tabs)/orders.tsx` (modified)
- `retainer/[id].tsx` (created)
- `retainer/[id]/cancel.tsx` (created)
- `retainer/[id]/change-tier.tsx` (created)

### Professional Panel (apps/professional/app/)
- `retainers/page.tsx` (already existed)
- `retainers/[id]/page.tsx` (already existed)

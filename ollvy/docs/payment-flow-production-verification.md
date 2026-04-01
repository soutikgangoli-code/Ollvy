# Payment Flow Production Verification

This checklist is for validating Razorpay payment reliability in production.

## Required frontend env vars

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

## Required edge function env vars

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `ENVIRONMENT=production`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RAZORPAY_SUBSCRIPTION_WEBHOOK_SECRET`
- `RAZORPAY_PRO_WEBHOOK_SECRET`
- `RAZORPAY_ACCOUNT_NUMBER` (required for payout flows)
- `OLLVY_GST_STATE`

## Verification steps

1. Place a real checkout order from customer app.
2. Complete payment in Razorpay modal.
3. Confirm order moves to paid/in-progress and has `razorpay_payment_id`.
4. Confirm invoice, chat conversation, and success notification are created.
5. Replay the same webhook payload and verify idempotent response.
6. Send webhook with invalid signature and verify `401` response.

## Production safety expectations

- Payment order creation must fail if Razorpay keys are missing in production.
- Webhook handlers must reject missing/invalid signatures outside development.
- No payment handler should silently continue when required payment secrets are absent.

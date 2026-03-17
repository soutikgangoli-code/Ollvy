The local Supabase instance is already running. Do not say "requires running system."

Run: npx supabase status
This will give you the local API URL (http://127.0.0.1:54321) and the anon key.

Use these to actually run every flow test with curl. Do not do code review — run the actual calls.

─────────────────────────────────────
FLOW A — User registration
─────────────────────────────────────
curl -X POST http://127.0.0.1:54321/functions/v1/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999990000"}'
# Expected: {"sent":true}

curl -X POST http://127.0.0.1:54321/functions/v1/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999990000","otp":"000000"}'
# Expected: {"session":{...},"isNewUser":true}
# Save the access_token from session — use it as $TOKEN for all subsequent calls

curl -X POST http://127.0.0.1:54321/functions/v1/seed-compliance-obligations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
# Expected: {"seeded":true,"count":N}

npx supabase db execute -c "SELECT business_type, state FROM users WHERE phone='9999990000';"
# Expected: business_type and state populated after onboarding

npx supabase db execute -c "SELECT COUNT(*) FROM compliance_obligations WHERE user_id=(SELECT id FROM users WHERE phone='9999990000');"
# Expected: > 0

─────────────────────────────────────
FLOW B — One-time order
─────────────────────────────────────
curl http://127.0.0.1:54321/functions/v1/search-services
# Expected: 42 services

# Get Pvt Ltd Incorporation service id:
npx supabase db execute -c "SELECT id, price_base_paisa, price_govt_fees_paisa FROM service_packages WHERE name ILIKE '%private limited%' LIMIT 1;"
# Save as $SERVICE_ID

curl -X POST http://127.0.0.1:54321/functions/v1/create-razorpay-order \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"service_package_id\":\"$SERVICE_ID\"}"
# Expected: {razorpay_order_id, amount_paisa, order_id}
# Save order_id as $ORDER_ID
# Verify GST: for Delhi user, should be CGST 9% + SGST 9%

npx supabase db execute -c "SELECT status, price_base_paisa_snapshot, gst_paisa, total_paisa FROM orders WHERE id='$ORDER_ID';"
# Expected: status=pending_assignment, prices correct, no floats

# Simulate webhook:
npx supabase db execute -c "SELECT razorpay_order_id FROM orders WHERE id='$ORDER_ID';"
curl -X POST http://127.0.0.1:54321/functions/v1/razorpay-webhook \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: test" \
  -d "{\"event\":\"payment.captured\",\"payload\":{\"payment\":{\"entity\":{\"order_id\":\"$RAZORPAY_ORDER_ID\",\"id\":\"pay_test123\",\"amount\":100000}}}}"
# Note: webhook signature will fail in test — temporarily disable signature check for local testing, then re-enable

npx supabase db execute -c "SELECT status, professional_id FROM orders WHERE id='$ORDER_ID';"
# Expected: status=in_progress, professional_id not null

npx supabase db execute -c "SELECT COUNT(*) FROM processed_webhook_events WHERE razorpay_event_id='pay_test123';"
# Expected: 1 (idempotency row)

# Send same webhook again — confirm idempotency:
# Run the same curl again
npx supabase db execute -c "SELECT COUNT(*) FROM processed_webhook_events WHERE razorpay_event_id='pay_test123';"
# Expected: still 1

─────────────────────────────────────
FLOW C — Promo code
─────────────────────────────────────
# Insert test promo directly:
npx supabase db execute -c "INSERT INTO promo_codes (code, discount_type, discount_value, is_active, per_user_limit) VALUES ('TEST20', 'percent', 20, true, 10);"

curl -X POST http://127.0.0.1:54321/functions/v1/resolve-promo \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"TEST20\",\"service_package_id\":\"$SERVICE_ID\",\"user_id\":\"$USER_ID\",\"base_price_paisa\":500000}"
# Expected: {"valid":true,"discount_paisa":100000}

─────────────────────────────────────
FLOW D — Dispute
─────────────────────────────────────
curl -X POST http://127.0.0.1:54321/functions/v1/open-dispute \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"order_id\":\"$ORDER_ID\",\"reason\":\"Professional not responding\"}"
# Expected: {dispute_id, status: "open"}

npx supabase db execute -c "SELECT status FROM orders WHERE id='$ORDER_ID';"
# Expected: disputed

─────────────────────────────────────
FLOW E — RLS check
─────────────────────────────────────
# Register a second user:
curl -X POST http://127.0.0.1:54321/functions/v1/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"8888880000","otp":"000000"}'
# Save as $TOKEN2

# Try to read user 1's orders with user 2's token:
curl "http://127.0.0.1:54321/rest/v1/orders?id=eq.$ORDER_ID" \
  -H "Authorization: Bearer $TOKEN2" \
  -H "apikey: $ANON_KEY"
# Expected: empty array [] — RLS blocks cross-user read

─────────────────────────────────────
FLOW F — Professional approval
─────────────────────────────────────
npx supabase db execute -c "INSERT INTO professional_applications (full_name, phone, city, profession_type, years_experience, status) VALUES ('Test CA', '7777770000', 'Delhi', 'ca', 5, 'submitted') RETURNING id;"
# Save as $APP_ID

curl -X POST http://127.0.0.1:54321/functions/v1/approve-professional \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"application_id\":\"$APP_ID\"}"
# Expected: professional row created, status=approved

npx supabase db execute -c "SELECT status FROM professionals WHERE phone='7777770000';"
# Expected: approved

─────────────────────────────────────
FINAL REPORT
─────────────────────────────────────
After running every curl above, output:

Flow A (User registration): PASS/FAIL — actual curl output
Flow B (One-time order): PASS/FAIL — actual curl output
Flow C (Promo code): PASS/FAIL — actual curl output
Flow D (Dispute): PASS/FAIL — actual curl output
Flow E (RLS): PASS/FAIL — actual curl output
Flow F (Professional approval): PASS/FAIL — actual curl output
Idempotency test: PASS/FAIL
Any errors encountered and how they were fixed
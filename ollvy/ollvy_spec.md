OLLVY
The Compliance OS for Indian Businesses
MASTER BUILD SPEC  ·  Claude Code Complete Handoff  ·  v10.0
React Native (Expo)  ·  Next.js 14  ·  Supabase  ·  Razorpay  ·  FCM  ·  MSG91  ·  Resend
32 Services  ·  Monthly Retainers  ·  Compliance OS  ·  Invoicing  ·  Payouts  ·  Disputes  ·  Pro Subscription
Consolidates v8 (functional spec) + v9 (pathway audit) + v10 (infrastructure audit). This is the only document Claude Code needs.
How To Use This Document
READ THIS FIRST. This is the single canonical spec for the entire Ollvy platform. Read it completely before writing any code. Every decision is made. Every edge case is specified. Follow the build sequence in Section 14. Do not invent behaviour not listed here.
Section
Contents
1 — Platform Vision
Revenue model, three strategic principles, what gets built
2 — Architecture
Tech stack, all key decisions, monorepo structure
3 — Pricing Rules
Price columns, GST calculation, snapshot rules. Critical.
4 — Database Schema
Every table, every column, RLS rules, critical constraints
5 — Service Catalogue
All 32 services, prices in paisa, situation_tags, active/inactive
6 — Retainer Architecture
Complete recurring billing system, tiers, onboarding, pause, cancel
7 — Professionals as Infrastructure
Invisibility rules, lifecycle, bank details, payout gate
8 — Order Status State Machine
Every valid status transition, triggers, side effects
9 — Chat Architecture
One chat per order vs one per retainer, RLS, Realtime
10 — Invoice Generation
GST-compliant PDF, CGST/SGST vs IGST, storage, signed URLs
11 — Webhook Registration
Two separate Razorpay webhook URLs. Critical.
12 — Quote Flow
Variable-price services: quote → confirm → payment bridge
13 — Notification Taxonomy
Every notification, every actor, every channel
14 — Admin Systems
Notifications, email, chat visibility, professional management
15 — FCM & Push
Token registration, lifecycle, null guard
16 — Storage Bucket RLS
Access policies for all four buckets
17 — Pro Tier
Features, discount mechanisms, grace period cron
18 — Compliance OS
Obligations, calendar, health score, profile completeness gate
19 — Confused Founder Onboarding
Situation flow, situation_tags, recommendations ranking
20 — Auto-Assign Algorithm
Geo-matching, load balancing, Pro priority, leave/availability
21 — SLA & Disputes
SLA state machine, strike system, dispute resolution
22 — Edge Functions (complete)
All 47 functions with triggers, changes, purpose
23 — Cron Schedule
All 23 crons with exact IST times (v16 update)
24 — Schema Additions Summary
Every new column added across v8/v9/v10 in one table
25 — Build Sequence
8 phases, 17–18 weeks, file order 0–43
26 — Open Decisions
14 items that must be resolved before Phase 1
27 — Verification Checklist
60+ checks across all systems
28 — Professional Acquisition
ollvy.com/join landing page, application flow, professional_applications table, admin /professionals/applications
29 — Public Trust Layer
Ratings on service cards, DB trigger for avg_rating, platform-wide stats, where shown
30 — Monthly Retainer Digest
Proof-of-work PDF per billing cycle, retainer_digests table, get-digest-url, Monthly Reports tab
31 — Pro Annual Plan & Value Prop
Annual ₹9,990 plan, pro_plan_type, penalty calculator on upgrade screen, fear hook
32 — Acquisition & Growth Mechanics
Referral program, CA-referral, public SEO service pages, UTM attribution
33 — Engagement Letters
Scope of work PDF at checkout, scope_included/excluded on services, user acknowledgement flow
34 — Annual Service Renewal System
Renewal tracking, statutory deadline calendar, renewal reminders for all users
1. Platform Vision
Registrations + Licensing + Monthly Retainers + Compliance OS + Data Moat. The confused founder comes because they don&#x2019;t know what they need. The growing business stays because Ollvy manages everything. The professional gets reliable income without chasing clients.
Revenue Layer
Services
Monetisation
One-time registrations + licensing
Incorporation, GST reg, FSSAI, trademark, IEC, and 26 more
20% commission on price_base_paisa per order
Monthly retainers
GST filing, TDS, payroll, PF/ESIC every month without thinking
20% commission on price_base_paisa per billing cycle
Ollvy Pro subscription
Compliance calendar, reminders, health score, priority assignment
₹999/month Razorpay Subscription
Fintech (v9+ foundation)
Filing data → credit decisions, insurance underwriting
Commission on financial products (v10+)
Principle 1: Professionals are invisible infrastructure. Users book Ollvy, not a CA. Urban Company model applied to compliance.
Principle 2: The compliance calendar owns the intent signal before the transaction. Every reminder is a booking trigger. Every obligation links to a service.
Principle 3: Every filing processed creates structured financial data. Services today = underwriting data tomorrow.
2. Architecture Decisions
Decision
Choice
Platform
React Native (Expo) for USER APP only. Next.js 14 for ADMIN PANEL (admin.ollvy.com) and PROFESSIONAL PANEL (pro.ollvy.com). Static Next.js for landing pages. Professional panel is a web app, not mobile — accessed from any browser on desktop or mobile.
Auth
Phone OTP via MSG91. Rate limiting: 5 attempts/hour, 3/10min per number. Dev bypass: 000000.
Database
Supabase (PostgreSQL + RLS + Storage + Realtime). One project.
One-time payments
Razorpay Orders API.
Recurring payments
Razorpay Subscriptions API. Both retainer and Ollvy Pro.
Payouts
Razorpay Route. 20% platform fee on every payout. Requires fund_account_id per professional.
State (mobile)
Zustand. Stores: auth, orders, retainers, chat, compliance, businessHealth.
Search
search-services edge function. Queries name + short_description + situation_tags[]. 300ms debounce. Public endpoint.
Chat
Supabase Realtime on chat_messages. One chat per one-time order. One persistent chat per retainer subscription.
Storage
Supabase Storage. Buckets: /avatars, /documents, /certifications, /invoices. RLS specified in Section 16.
Invoices
generate-invoice edge function. PDF via @react-pdf/renderer (Deno-compatible). Stored in /invoices/. Accessed via signed URL only.
Push notifications
FCM via Expo push token. fcm_token stored on users table (React Native app). Professionals use Web Push (register-web-push). register-fcm-token called on every user app launch.
register-web-push
HTTP POST (auth)
PROFESSIONAL WEB PANEL ONLY. Body: { subscription: PushSubscriptionJSON }. Stores browser Push API subscription in professionals.web_push_subscription (JSONB). Called after user grants Web Push permission at pro.ollvy.com. On logout: sets web_push_subscription = NULL.
Admin email
Resend/SendGrid. Recipient list stored in app_settings table. send-admin-email edge function.
Monorepo
pnpm workspaces: apps/mobile (React Native), apps/professional (Next.js web — pro.ollvy.com), apps/admin (Next.js web — admin.ollvy.com), apps/landing (Next.js static), packages/shared, packages/supabase.
Monorepo Structure
ollvy/
├── apps/
│   ├── mobile/          # React Native (Expo) — user app (26 screens)
│   ├── professional/    # Next.js 14 web panel — pro.ollvy.com (15 pages, see Section 37)
│   ├── admin/           # Next.js 14 — admin dashboard (22 pages)
│   └── landing/         # Next.js static — homepage + /join + /b/[id] + /ref/[code]
├── packages/
│   ├── shared/          # Types, formatPaisa, calculateGST, addWorkingDays
│   └── supabase/        # Generated DB types
└── supabase/
    ├── migrations/      # 001_initial_schema.sql, 002_rls_policies.sql
SCHEMA ADDITION (v15): analytics_cache table must be included in 001_initial_schema.sql. It has no foreign keys and can be added at the end of the initial migration. The cron update-analytics-cache (7:05am daily) begins populating it from Phase 7. The table itself must exist from Phase 1 because admin /dashboard reads from it with graceful null handling (shows zero if empty).
    └── functions/       # Edge functions (Deno runtime)
React Native Navigation Structure (expo-router)
apps/mobile uses expo-router (file-based routing). Do NOT use react-navigation directly. Install: expo install expo-router expo-constants expo-linking expo-status-bar react-native-safe-area-context react-native-screens.
Root layout: apps/mobile/app/_layout.tsx — wraps app in Zustand auth check. If !session, redirect to (auth)/login.
apps/mobile/app/
  _layout.tsx              # Root layout — auth guard + Zustand init
  (auth)/
    login.tsx              # U02 Phone entry
    otp.tsx                # U03 OTP verify
  (onboarding)/
    situations.tsx         # U04
    business-type.tsx      # U05
    state.tsx              # U06
    recommendations.tsx    # U07
  (tabs)/
    _layout.tsx            # Bottom tab navigator — 4 tabs
    index.tsx              # U08 Home / Service Catalogue
    orders.tsx             # U14 Order List
    compliance.tsx         # U21 Compliance Calendar (Pro-gated)
    profile.tsx            # U23 My Profile
  service/[id].tsx         # U09 Service Detail
  checkout/[serviceId].tsx # U12/U13 Checkout (one-time or retainer)
  order/[id].tsx           # U15 Order Detail
  order/[id]/chat.tsx      # U16 Chat
  retainer/
    index.tsx              # U17 Retainer List
    [id].tsx               # U18 Retainer Detail
    [id]/cancel.tsx        # U19 Cancel Confirm
    [id]/change-tier.tsx   # U20 Tier Change
  quote/[id].tsx           # U11 Quote Detail / Accept
  quote/request/[serviceId].tsx # U10 Quote Request Form
  business.tsx             # U22 My Business (Pro-gated)
  upgrade.tsx              # U24 Ollvy Pro Upgrade
  notifications.tsx        # U25 Notifications Inbox
  settings.tsx             # U26 Settings / Account
Bottom tab navigator (apps/mobile/app/(tabs)/_layout.tsx): 4 tabs — Home (house icon), Orders (receipt icon), Compliance (calendar icon, Pro badge overlay if not Pro), Profile (person icon). Tab bar background: #FFFFFF. Active tint: #1E3A5F. Inactive tint: #9CA3AF. Badge on Orders tab: count of pending_assignment + in_progress orders.
Styling — NativeWind + Design Tokens
apps/mobile uses NativeWind v4 (Tailwind CSS for React Native). Install: npx expo install nativewind tailwindcss. Configure tailwind.config.js at monorepo root with content: ['./apps/mobile/**/*.{ts,tsx}']. All styling uses Tailwind className props — do NOT use StyleSheet.create() in new components.
Design tokens (packages/shared/src/theme.ts) — import these; do not hardcode hex values:
export const colors = {
  navy:       '#1E3A5F',   // Primary brand — buttons, headings, tab active
  navyLight:  '#2E5299',   // Hover states
  cream:      '#FAFAF7',   // App background
  white:      '#FFFFFF',   // Cards, inputs
  bodyText:   '#1A1A2E',   // Primary text
  mutedText:  '#6B7280',   // Secondary text, placeholders
  border:     '#E5E7EB',   // Input borders, dividers
  stripe:     '#EEF4FA',   // Alternating table rows
  green:      '#1A7340',   // Success, completed status
  amber:      '#D4700A',   // Warning, SLA approaching
  red:        '#C0392B',   // Error, disputed status, destructive
  proGold:    '#B8860B',   // Pro tier badge
}
export const spacing = { xs:4, sm:8, md:16, lg:24, xl:32, xxl:48 }
export const radius  = { sm:4, md:8, lg:12, xl:16, full:9999 }
export const font    = { sm:12, base:14, md:16, lg:18, xl:22, xxl:28, h1:34 }
Next.js apps (admin + professional) use Tailwind CSS v3. tailwind.config.js extends theme with the same color palette above. shadcn/ui is NOT used — custom components only, consistent with the design token set above. Global CSS: apps/admin/src/app/globals.css and apps/professional/src/app/globals.css both import tailwind base/components/utilities.
Expo App Config (app.json)
apps/mobile/app.json — required before first build. Claude Code must create this file:
{
  "expo": {
    "name": "Ollvy",
    "slug": "ollvy",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": { "image": "./assets/splash.png", "resizeMode": "contain", "backgroundColor": "#FAFAF7" },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.ollvy.app",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "Required to upload compliance documents and profile photos.",
        "NSPhotoLibraryUsageDescription": "Required to select documents and photos from your library."
      }
    },
    "android": {
      "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png", "backgroundColor": "#FAFAF7" },
      "package": "com.ollvy.app",
      "versionCode": 1,
      "permissions": ["CAMERA", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"]
    },
    "web": { "favicon": "./assets/favicon.png" },
    "plugins": ["expo-router", "expo-font",
      ["expo-notifications", { "icon": "./assets/notification-icon.png", "color": "#1E3A5F" }]
    ],
    "scheme": "ollvy",
    "extra": { "eas": { "projectId": "REPLACE_WITH_EAS_PROJECT_ID" } }
  }
}
Environment Variables (.env.local for each app)
Create one .env.local per app. NEVER commit these. Add .env.local to .gitignore at monorepo root. The shared Supabase vars are the same across all apps.
apps/mobile/.env.local (also readable as app.config.js extra.env):
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
apps/professional/.env.local:
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
apps/admin/.env.local:
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
supabase/functions/.env (applies to all edge functions via Deno.env.get):
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
RAZORPAY_SUBSCRIPTION_WEBHOOK_SECRET=your_sub_webhook_secret
OLLVY_PRO_ANNUAL_PLAN_ID=plan_XXXXXXXXXX
OLLVY_GSTIN=22AAAAA0000A1Z5
OLLVY_GST_STATE=DL
MSG91_AUTH_KEY=your_msg91_auth_key
MSG91_TEMPLATE_ID=your_msg91_otp_template_id
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=admin@ollvy.com
Supabase Project Setup
Before running any migration: (1) Create new Supabase project at app.supabase.com. (2) Run: npx supabase login then npx supabase link --project-ref YOUR_PROJECT_REF from monorepo root. (3) Run migrations in order: npx supabase db push (runs all files in supabase/migrations/ alphabetically). Migration files: 001_initial_schema.sql (all 34 tables + indexes + triggers), 002_rls_policies.sql (all RLS enable + policies), 003_seed.sql (32 service packages + urgency scores + compliance_obligation_rules seed data). (4) Enable Realtime on tables: chat_messages, notifications, admin_notifications. (5) Create storage buckets: /avatars (public read), /documents (private), /certifications (private), /invoices (private). Apply bucket RLS from Section 16. (6) Deploy edge functions: npx supabase functions deploy --no-verify-jwt send-otp verify-otp (these are public). Deploy all others with default JWT verification.
003_seed.sql must include: 32 service packages (from Section 5 with all prices in paisa, urgency_score, situation_tags), 25 compliance_obligation_rules rows (from Section 18a seed data), initial app_settings rows: platform_fee_percent='20', dispute_auto_refund_days='7', admin_email_recipients='["admin@ollvy.com"]'.
User App — 26 Screens
Every screen, its DB source, and its edge function dependencies. Realtime subscriptions as noted. All 26 screens map 1:1 to the mobile/ app in the monorepo.
#
Screen Name
DB Tables / Edge Functions
Spec Notes
U01
Splash / Launch
register-fcm-token called immediately after auth session confirmed.
FCM token refreshed on every launch.
U02
Login — Phone Entry
send-otp, otp_rate_limits
Phone number input. Rate limit: 5/hr, 3/10min. Shows remaining attempts on block.
U03
Login — OTP Verify
verify-otp
6-digit OTP. Dev bypass: 000000. Returns JWT on success.
U04
Onboarding — Situations
get-recommendations
Multi-select: Just starting out / Need to hire / Taking payments / Selling food or beverages / Importing or exporting / Have investors / Protect my brand / Need to file taxes / Regulated industry. Skippable.
U05
Onboarding — Business Type
users (business_type update)
Sole Prop / Partnership / Pvt Ltd / LLP / Not yet registered. Pre-fills compliance obligation engine.
U06
Onboarding — State
users (state update)
Dropdown. Seeds city for geo-matching and GST type calculation.
U07
Recommendations Result
get-recommendations, service_packages
Up to 5 services ranked by urgency_score DESC. One-line reason per card. Non-skippable banner for 3 days post-registration.
U08
Home — Service Catalogue
search-services, service_filter_categories, service_packages
Filter chips (single-select by filter_category_id). Search bar, 300ms debounce, min 2 chars. Service cards: name, price, is_active filter. Sort: urgency_score DESC by default.
U09
Service Detail
service_packages, service_tier_groups
Price breakdown (base + GST + govt fees). Tier picker (radio) if tier_group_id set. 'Book Now' CTA if price_varies_by_state=false. 'Get Exact Quote' CTA if price_varies_by_state=true.
U10
Quote Request Form
create-quote-request
Business details, state, specific requirements. Inserts quote_requests row (status=pending). Admin notified via badge.
U11
Quote Detail / Accept
quote_requests, create-razorpay-order (with quoteRequestId)
Shows confirmed_price_paisa + govt fees + GST. 48h expiry countdown. 'Accept and Book' CTA triggers Razorpay order at confirmed price. Expired state shows re-request CTA.
U12
Checkout — One-Time
create-razorpay-order, Razorpay SDK
Price summary: base, Pro discount (5% if applicable), promo code input, GST, total. Server recalculates before order creation. Razorpay payment sheet.
U13
Checkout — Retainer
create-razorpay-subscription, Razorpay SDK
Tier confirmed. First month free badge if Pro + first retainer ever (trial_period=30). Billing anchor date shown. Monthly price + GST.
U14
Order List
orders WHERE user_id=me (Realtime)
All orders, all statuses. Status badge per row. Realtime status updates via Supabase subscription.
U15
Order Detail
orders, order_stage_history, documents, chat_conversations
Stage progress bar. Documents tab (upload required_input docs). Chat tab. Invoice download (get-invoice-url). Dispute CTA shown if status=in_progress or completed-within-7-days.
U16
Chat
chat_messages, chat_conversations (Realtime)
Realtime subscription: conversation_id IN user conversations. Professional shown as '[First name], Ollvy Compliance Team'. System messages as centred grey pill, no avatar.
U17
Retainer List
retainer_subscriptions WHERE user_id=me (Realtime)
Status badge: onboarding / active / paused / payment_failed / cancelled. Billing date. Monthly price.
U18
Retainer Detail
retainer_subscriptions, orders (child cycles), payouts
Tier info. Billing history (child orders with invoice links). Pause / Cancel / Change Tier CTAs. Compliance coverage badge. payment_paused banner if applicable.
U19
Retainer Cancellation Confirm
cancel-retainer
Shows: exact end date, last document delivery date (5 working days post last cycle), no-charge confirmation. Immediate cancel if is_trial_active=true.
U20
Retainer Tier Change
change-retainer-tier
Current tier vs new tier. Old price vs new price. Effective date (next cycle). Confirm CTA.
U21
Compliance Calendar (Pro-gated)
compliance_obligations, compliance_obligation_rules (Realtime)
Pro: full obligations list with status badges, snooze, Book CTA per obligation. Free: read-only list, 'Upgrade to Pro' CTA. Below 60% profile completeness: 'Complete your profile' CTA instead.
U22
My Business Tab (Pro-gated)
users (health_score, completeness), invoices, compliance_obligations
Health score gauge (0-100). Invoice vault (all invoices via get-invoice-url, 60-min signed URLs). Compliance history. Shareable business card: business_name, business_type, state, city (URL share mechanism — resolve Open Decision #14).
U23
Profile Setup / Edit
users, update-profile-photo
Fields: business_name (10%), state (20%), city (10%), business_type (15%), gst_registered (15%), has_employees (15%), incorporation_date (15%). Completeness score shown live. Avatar upload to /avatars bucket.
U24
Ollvy Pro Upgrade
create-razorpay-subscription (Pro plan)
Feature comparison table: Free vs Pro. Monthly ₹999. Razorpay subscription CTA. First retainer free benefit called out.
U25
Notifications Inbox
notifications WHERE user_id=me
All push notifications logged. read_at timestamp. Mark all read CTA.
U26
Settings / Account
Supabase Auth, register-fcm-token (logout clears token)
Logout: clears fcm_token (set to NULL). App version. Support link.
U12 — Promo Code UX Specification
The promo code input on U12 (Checkout — One-Time) sits between the price breakdown and the Razorpay payment CTA. It is an optional, collapsible section labelled 'Have a promo code?'.
Input behaviour:
Collapsed by default. Tapping 'Have a promo code?' expands a text input + 'Apply' button.
Input: single-line text, auto-uppercased, max 20 chars. Placeholder: 'Enter promo code'.
Apply button: calls resolve-promo. Disabled while loading (spinner replaces button text).
States after Apply:
Valid: green tick appears inline. 'SUMMER25 applied — Rs 250 off' message below input. Price breakdown updates: new line 'Promo discount' in red/green with the discount amount. Total recalculates. 'Remove' link shown to clear the code.
Invalid code (not found): inline error below input — 'This promo code is not valid.'
Expired: 'This promo code has expired.'
Used (per-user limit reached): 'You’ve already used this promo code.'
Wrong service: 'This promo code is not valid for this service.'
Min order not met: 'This promo code requires a minimum order of Rs X,XXX.'
All error states: input border turns red, error text in red (#D32F2F). Clears on next keypress.
Server-side enforcement:
Client-side promo validation is display only. The actual discount is re-validated server-side inside create-razorpay-order before the Razorpay order is created. If the promo is no longer valid at order creation time (e.g. race condition on last use), create-razorpay-order returns error code PROMO_INVALID and the checkout screen shows a toast: 'Promo code is no longer valid — please try another.' The order is not created.
resolve-promo function spec (full):
Input: { code, service_package_id, user_id, base_price_paisa }
Validations in order: (1) code exists and is_active=true. (2) expires_at IS NULL OR expires_at > now(). (3) applicable_to = 'all' OR service_package_id IN promo_codes.service_package_ids[]. (4) min_order_paisa IS NULL OR base_price_paisa >= min_order_paisa. (5) per_user_limit: count of orders WHERE user_id=user_id AND promo_code_used=code < per_user_limit. (6) max_total_uses IS NULL OR total uses across all orders < max_total_uses.
Returns on success: { valid: true, discount_paisa: N, description: 'X% off' | 'Rs X off', code }.
Returns on failure: { valid: false, reason: 'EXPIRED' | 'NOT_FOUND' | 'USER_LIMIT' | 'WRONG_SERVICE' | 'MIN_ORDER' | 'TOTAL_EXHAUSTED' }.
Promo abuse detection: if a single user_id applies 3+ distinct promo codes in a 24h window, log to fraud_review_queue with type='promo_abuse' and fire send-admin-email.
orders table: add promo_code_used TEXT NULLABLE column. Populated by create-razorpay-order on successful order creation.
Professional Panel — 15 Pages (Web App, pro.ollvy.com)
ARCHITECTURE UPDATE (v14): The professional interface is a Next.js 14 web app at pro.ollvy.com — NOT a React Native mobile app. This heading is retained as a navigation anchor only. The full specification for all 15 pages (P01–P15) is in Section 37 of this document. Section 37 supersedes any mobile-specific notes below and is the authoritative spec.
Page
URL
Summary
P01
ollvy.com/join
Join landing page (static, pre-auth). See Section 28.
P02
pro.ollvy.com/login
Phone OTP login. Web form. Supabase session via httpOnly cookie.
P03
pro.ollvy.com/onboarding/basics
Basic info: name, email, profession_type, city, state, experience.
P04
pro.ollvy.com/onboarding/services
Service areas multi-select. Monthly capacity slider.
P05
pro.ollvy.com/onboarding/certifications
Cert doc drag-and-drop upload. ICAI / Bar Council number.
P06
pro.ollvy.com/onboarding/pending
Pending approval screen. Polls for status change every 60s.
P07
pro.ollvy.com/dashboard
Home dashboard: KPIs, new orders, retainers due, availability toggle.
P08
pro.ollvy.com/orders
Order list table. Realtime. Filter by status, service, date.
P09
pro.ollvy.com/orders/[id]
Order detail: stage stepper, docs, govt fee input, strike appeal.
P10
pro.ollvy.com/orders/[id]/chat
Chat: Supabase Realtime. File attachments. System messages.
P11
pro.ollvy.com/retainers
Retainer list. Realtime status badges.
P12
pro.ollvy.com/retainers/[id]
Retainer detail: key numbers input, billing history, chat.
P13
pro.ollvy.com/earnings
Earnings breakdown. Payout history. Bank gate overlay.
P14
pro.ollvy.com/settings/bank
Bank details form. IFSC autocomplete. Admin-verified.
P15
pro.ollvy.com/settings/profile
Profile edit. Leave management. Cert status. Notification prefs.
Full spec for every page: see Section 37.
3. Pricing Rules
CRITICAL: All prices live in the database. No price is ever hardcoded in application code. Frontend displays only. Backend always recalculates before charging. Violation of this rule is a production bug.
Column
Purpose
Example
price_base_paisa
Professional fee + platform margin. Ollvy and professional split this.
GST Registration: 899900 (₹8,999)
price_govt_fees_paisa
Govt fees passed through at cost. For variable: 0 and quote handles it.
Alcohol License Delhi: 0 (state actuals quoted)
price_gst_rate
GST rate on price_base_paisa ONLY. Govt fees are not GST-able.
18 (18%)
price_display_note
Shown on service card when set. For variable-price services.
'Govt fees vary by state. Confirmed in your quote.'
price_varies_by_state
If true: 'Get Exact Quote' CTA, not 'Book Now'. Quote flow instead of direct checkout.
Alcohol License: true. GST Registration: false.
Server-Side Price Calculation
// ALWAYS on server, never trust client-sent totals
const gst = Math.round(pkg.price_base_paisa * (pkg.price_gst_rate / 100))
// Pro 5% discount (one-time orders only, applied to base price)
const proDiscount = user.subscription_tier==='pro' ? Math.round(pkg.price_base_paisa * 0.05) : 0
const promoDiscount = promoCode ? await resolvePromo(promoCode, ...) : 0
const total = (pkg.price_base_paisa - proDiscount) + pkg.price_govt_fees_paisa + gst - promoDiscount
// Quote path: use quote.confirmed_price_paisa instead of pkg.price_base_paisa
Orders snapshot pricing at creation. Prices on the order row never change after creation.
Pro discount: 5% off price_base_paisa on one-time orders. Promo applied AFTER Pro discount. Do NOT apply Pro discount to retainer subscription amounts — use Razorpay trial_period instead.
GST type: if user.state === OLLVY_GST_STATE (env var) → CGST 9% + SGST 9%. Else → IGST 18%. Same total either way. Label on invoice changes.
4. Database Schema — Complete
All Tables
Table
Purpose
Key Columns
users
Business owners
auth_user_id, business_name, business_type, state, city, incorporation_date, gst_registered, has_employees, subscription_tier (free|pro), pro_subscription_razorpay_id, compliance_health_score, profile_completeness_score, pro_grace_start, preferred_professional_id (INTERNAL routing only, never shown in UI), fcm_token, is_returning.
professionals
CAs, Lawyers, CS, Licensing Consultants, Payroll Specialists
auth_user_id, name, phone, email, profession_type enum (ca|lawyer|cs|licensing_consultant|payroll_specialist|registered_valuer), bio, experience_years, languages[], service_areas[] (stores service_package_ids — not city names), status (pending|approved|rejected|suspended), strike_count, last_assigned_at, fcm_token.
professional_education
Degrees
professional_id, degree, institution, year.
professional_certifications
Credentials
professional_id, name, issuing_body, membership_number, year, expiry_date (date nullable), document_url, verified bool.
professional_bank_accounts
Payout destination
professional_id (unique), account_holder_name, account_number (encrypted), ifsc_code, bank_name, razorpay_contact_id, razorpay_fund_account_id, is_verified bool default false.
professional_waitlist
Pre-launch supply
name, phone, email, profession_type, city, years_experience.
professional_availability
Capacity + leave
professional_id, city, is_available bool, max_concurrent_orders default 3, current_active_orders (DB trigger only), on_leave_until (date nullable).
admins
Admin users
Supabase Auth role='admin'.
app_settings
Admin-configurable settings
key (PK), value (JSON string), updated_at, updated_by. Keys: admin_email_recipients, platform_fee_percent, dispute_auto_refund_days.
service_filter_categories
Filter buckets
name, slug, icon_name, display_order, is_active.
service_tier_groups
Links tiered packages
id, name (internal, e.g. 'GST Monthly Filing'), description.
service_packages
Full catalogue
name, short_description, filter_category_id, tier_group_id (nullable), tier_label, order_type (one_time|recurring), billing_cycle (monthly|quarterly|annual|one_time), price_base_paisa, price_govt_fees_paisa, price_gst_rate, price_display_note, price_varies_by_state, sla_working_days, situation_tags[], workflow_stages JSONB (array of {stage_key, stage_name, sla_working_days, wait_for_govt bool} objects — this is a COLUMN on service_packages, NOT a separate table), urgency_score int default 50, display_order, is_active.
orders
Every order instance
user_id, professional_id, service_package_id, retainer_subscription_id (nullable), chat_conversation_id FK, order_type (one_time | recurring), status ENUM (pending_assignment | waitlisted | in_progress | completed | disputed | cancelled) NOT NULL, city text (snapshot from user.city at order creation), price_base_paisa_snapshot, price_govt_fees_paisa_snapshot, price_gst_paisa_snapshot, pro_discount_paisa_snapshot, promo_discount_paisa_snapshot, total_paisa_snapshot, payment_paused bool default false, force_assigned bool default false, price_source text default 'base' (values: base | state_override), completed_at.
order_stage_history
Immutable stage log
order_id, stage_key, stage_name, started_at, stage_due_date (set at creation, working days only), completed_at, notes. Append-only.
order_waitlist
Overflow queue
order_id, position (DB trigger), assigned_at, estimated_assignment_hours.
retainer_subscriptions
Active recurring contracts
user_id, service_package_id, assigned_professional_id (set at first assignment, persistent), razorpay_subscription_id, billing_cycle, monthly_price_paisa (snapshot), first_billing_date, next_billing_date, status (active|paused|cancelled|payment_failed|onboarding), is_trial_active bool, pause_count_this_year (max 2), pause_start_date, started_at, onboarding_completed_at.
invoices
Tax invoices for every charge
order_id or retainer_subscription_id (one must be set), user_id, invoice_number (INV-YYYY-NNNNN, DB trigger), amount_base_paisa, amount_gst_paisa, amount_govt_fees_paisa, amount_total_paisa, pdf_url (path in /invoices bucket), issued_at, type (order|retainer_cycle).
documents
File vault
order_id, professional_id, document_type (required_input|professional_deliverable|admin_upload), file_url, visible_to_user bool, parsed_data JSONB (NULL in v10, populated by v11 extraction pipeline).
document_requests
Pro requests docs from client
order_id, professional_id, message, due_date, fulfilled_at.
chat_conversations
One per order OR one per retainer
order_id (nullable), retainer_subscription_id (nullable). One must be set. For retainers: persistent across all cycles.
chat_messages
Messages
conversation_id, sender_id (nullable), sender_type (user|professional|system), content, created_at.
payouts
Professional earnings
order_id, professional_id, amount_paisa, platform_fee_paisa, status (pending|held|paid|failed), retainer_subscription_id (nullable), billing_period (text, e.g. 'March 2025'), created_at.
disputes
Dispute resolution
order_id, raised_by_type, reason_category, description, status (open|admin_reviewing|resolved_refund|resolved_no_refund|resolved_partial|appealed|appeal_resolved), resolution_amount_paisa, resolved_at.
quote_requests
Variable-price quotes
user_id, service_package_id, submitted_details JSONB, admin_id, confirmed_price_paisa, confirmed_govt_fees_paisa, status (pending|quoted|accepted|expired), quoted_at, accepted_at, expires_at (quoted_at + 48h).
promo_codes
Discounts
code, discount_type (percent|flat_paisa), discount_value, applicable_to (one_time_only|first_retainer_month|both), service_package_ids[] nullable, max_uses, used_count, per_user_limit, valid_from, valid_until, min_order_paisa.
feedback
Private ratings
order_id, user_id, retainer_subscription_id (nullable), rating 1-5, comment, created_at.
notifications
Push + SMS log
user_id or professional_id, type, title, body, read_at, fcm_status, sms_status.
compliance_obligation_rules
Rules engine
business_type[], state[], obligation_type, label, recurrence, due_date_formula, linked_service_package_id, advance_reminder_days[], is_active.
compliance_obligations
Per-user instances
user_id, rule_id, obligation_type, label, due_date, status (upcoming|due_soon|overdue|completed|snoozed|covered_by_retainer), completed_order_id, retainer_subscription_id, notified_days[], snooze_until.
admin_notifications
In-app admin alerts
type, title, body, related_id, related_type, read_at, created_at.
sla_alerts
SLA breach log
order_id, stage_key, due_date, alerted_at, alert_count, professional_strike_applied bool.
capacity_alerts
Capacity log
service_package_id, city, load_percent, alerted_at.
user_service_recommendations
Post-order upsells
user_id, service_package_id, reason, shown_at, booked bool.
otp_rate_limits
OTP abuse prevention
phone, attempt_count, window_start. Max 5/hour, 3/10min.
Critical Schema Rules
All money in paisa integers. Never floats. formatPaisa(n) in packages/shared for display.
Orders snapshot pricing at creation. Never recalculate after creation.
stage_due_date calculated at order creation from sla_working_days. Working days only (excludes weekends + public holidays). Never editable.
professional_availability.current_active_orders maintained exclusively by DB trigger on order status changes. Application code never sets this directly.
retainer_subscriptions.assigned_professional_id set at first order creation. Only changed by replace-retainer-professional edge function.
chat_messages.sender_id is nullable. System messages: sender_id=NULL, sender_type='system'. DB constraint: if sender_type != 'system' then sender_id IS NOT NULL.
professionals.service_areas[] stores service_package_ids (UUIDs), NOT city names. auto-assign queries .overlaps('service_areas', [order.service_package_id]).
invoices are generated for every successful Razorpay payment — both razorpay-webhook and retainer-billing-webhook call generate-invoice.
Required Database Indexes
JSONB columns require GIN indexes for performant jsonb_path_ops queries. Without them, filtering on JSONB fields causes full table scans — critical issue at scale. Add these in 001_initial_schema.sql after the table definitions:
CREATE INDEX idx_service_packages_workflow_stages ON service_packages USING GIN (workflow_stages jsonb_path_ops); — supports stage key lookups and filtering by stage properties. CREATE INDEX idx_service_packages_situation_tags ON service_packages USING GIN (situation_tags); — supports the recommendations engine tag matching.
CREATE INDEX idx_retainer_digests_stages_completed ON retainer_digests USING GIN (stages_completed jsonb_path_ops); — supports digest lookups by stage key. CREATE INDEX idx_retainer_digests_key_numbers ON retainer_digests USING GIN (key_numbers jsonb_path_ops); — supports financial reporting queries.
Standard B-tree indexes (also add to initial schema): CREATE UNIQUE INDEX idx_processed_webhook_events_razorpay_event_id ON processed_webhook_events (razorpay_event_id); CREATE INDEX idx_orders_user_id_status ON orders (user_id, status); CREATE INDEX idx_orders_professional_id_status ON orders (professional_id, status); CREATE INDEX idx_chat_messages_conversation_id ON chat_messages (conversation_id, sent_at DESC); CREATE INDEX idx_compliance_obligations_user_id ON compliance_obligations (user_id, next_due_date); CREATE INDEX idx_sla_alerts_order_id ON sla_alerts (order_id, professional_strike_applied); CREATE UNIQUE INDEX idx_service_packages_slug ON service_packages (slug);
5. Service Catalogue — 32 Services
All 32 services seeded in 001_initial_schema.sql with real prices in paisa. is_active=false by default except the 4 MVP services. Activate from admin as professional supply is confirmed.
MVP Launch (4 Active Services)
Service
price_base_paisa
price_govt_fees_paisa
Notes
Private Limited Incorporation
2499900 (₹24,999)
0 (billed separately, actuals ~₹7,000)
One-time. order_type=one_time.
GST Registration
899900 (₹8,999)
0
One-time.
GST Monthly Filing — Up to ₹50L/year
299900 (₹2,999/mo)
0
Recurring. tier_group_id=GST_MONTHLY. tier_label='Up to ₹50L/year'.
Business ITR Filing
1199900 (₹11,999)
0
One-time. Annual filing.
Full Catalogue — All 32 Services
#
Service
price_base_paisa
Recurring?
Active?
1
Private Limited Incorporation
2499900
No
YES
2
LLP Registration
1999900
No
No
3
Partnership Deed Drafting
699900
No
No
4
Sole Proprietorship Setup
499900
No
No
5
OPC (One Person Company)
2199900
No
No
6
Startup India Registration
799900
No
No
7
MSME / Udyam Registration
299900
No
No
8
GST Registration
899900
No
YES
9
FSSAI Basic Registration
799900
No
No
10
IEC (Import Export Code)
699900
No
No
11
Professional Tax Registration
399900
No
No
12
Trademark — Word Mark
1499900 + 450000 govt
No
No
13
Trademark — Logo
1699900 + 450000 govt
No
No
14
Copyright Registration
899900
No
No
15
Patent Filing (Provisional)
3499900 (varies)
No
No
16
Design Registration
899900
No
No
17
FSSAI State License
1899900 (varies by state)
No
No
18
FSSAI Central License
3499900
No
No
19
Alcohol License
4999900 (varies by state)
No
No
20
Eating House License
899900 (varies by state)
No
No
21
Fire NOC
899900 (varies by state)
No
No
22
Shop & Establishment Registration
399900 (varies by state)
No
No
23
Drug License (Retail)
2499900 (varies)
No
No
24
PCB Consent to Operate
2999900 (varies)
No
No
25
PESO License
3499900
No
No
26
Trade License
499900 (varies)
No
No
27
GST Monthly Filing — Up to ₹50L
299900
YES (monthly)
YES
28
GST Monthly Filing — ₹50L-5Cr
499900
YES (monthly)
No
29
GST Monthly Filing — ₹5Cr+
799900
YES (monthly)
No
30
TDS Monthly Compliance
399900
YES (monthly)
No
31
Payroll Mgmt — up to 10 employees
599900
YES (monthly)
No
32
Payroll Mgmt — 11–25 employees
999900
YES (monthly)
No
33
Payroll Mgmt — 26–50 employees
1399900
YES (monthly)
No
34
PF/ESIC Monthly Filing
399900
YES (monthly)
No
35
Business ITR Filing
1199900
No (annual)
YES
36
GST Annual Return (GSTR-9)
899900
No (annual)
No
37
TDS Quarterly Return
499900
No (quarterly)
No
38
MCA Annual Filing Bundle
1499900
No (annual)
No
39
Director KYC (DIR-3 KYC)
399900
No (annual)
No
40
Advance Tax Computation
399900
No (quarterly)
No
41
ROC Compliance Bundle
2999900
No (annual)
No
42
Statutory Audit
3499900
No (annual)
No
Tier Groups (Linked Packages)
Tier Group Name
Packages in Group
tier_label values
GST Monthly Filing
Services #27, #28, #29
'Up to ₹50L/year', '₹50L – 5Cr/year', '₹5Cr+/year'
Payroll Management
Services #31, #32, #33
'Up to 10 employees', '11–25 employees', '26–50 employees'
Situation Tags — All 32 Services (seeded in 001_initial_schema.sql)
Service
situation_tags[]
Pvt Ltd / LLP / OPC / Startup India
just_starting_out, have_investors
Partnership / Sole Prop
just_starting_out
MSME
just_starting_out, need_bank_loan
GST Registration
taking_payments, just_starting_out, importing_exporting
FSSAI Basic + State + Central + Alcohol + Eating House
selling_food_beverages, just_starting_out (basic/eating house), scaling_up (state/central), regulated_industry (alcohol)
IEC
importing_exporting
Prof Tax / Payroll / PF/ESIC / Shop & Establishment
need_to_hire
TDS Monthly + Quarterly
need_to_hire, filing_taxes
Trademark (Word + Logo) / Copyright / Patent
want_to_protect_brand
Patent
want_to_protect_brand, have_investors
Fire NOC / Trade License
just_starting_out, regulated_industry
Drug License / PCB / PESO
regulated_industry
GST Monthly Filing (all tiers)
taking_payments, filing_taxes
Business ITR / Advance Tax / GST Annual / TDS Quarterly
filing_taxes
MCA Annual / Director KYC / ROC / Statutory Audit
have_investors, scaling_up
Urgency Scores (seeded)
Service
urgency_score
GST Registration
95
FSSAI Basic
90
GST Monthly Filing
88
Pvt Ltd Incorporation
80
TDS Monthly
78
Business ITR
75
Shop & Establishment
70
Eating House License
70
Payroll
68
Trademark (Word)
65
IEC
60
MSME
55
All others
50 (default)
6. Retainer Architecture
This is the core recurring revenue engine. Every retainer lifecycle state, billing anchor, professional relationship, and edge case is specified here. Read all subsections before building.
Retainer vs One-Time
Dimension
One-Time
Retainer
Trigger
User books once
Razorpay Subscription charges monthly
Lifecycle
Completes and closes
Parent retainer persists. Each cycle = child order.
Chat
One chat per order
One PERSISTENT chat per retainer (all cycles share it)
Professional
Auto-assigned per order
Dedicated professional. Persistent.
Invoice
One per order
One per billing cycle
Compliance calendar
One obligation marked complete
Ongoing obligations marked covered_by_retainer
Retainer Lifecycle States
Status
Meaning
Transitions To
onboarding
First assigned. Professional collecting credentials.
active (after professional marks complete)
active
Billing running normally.
paused, cancelled, payment_failed
paused
User paused. Max 2/year. Max 1 month.
active (manual resume or auto at 1 month)
payment_failed
Razorpay retries exhausted after 3 days.
active (user updates card + Razorpay retry succeeds)
cancelled
User cancelled. Effective end of billing cycle.
(terminal)
Billing Date Anchor
Onboarding completed on...
first_billing_date
1st – 24th of month
25th of SAME month
25th
25th of NEXT month (avoid same-day billing confusion)
26th – 31st
25th of NEXT month
Tier Routing
Services with multiple price tiers use service_tier_groups. Service card shows single entry with 'From ₹X/month' label.
Tapping card opens detail screen with tier picker (radio buttons). Tier selection is mandatory before checkout.
Checkout sends the specific service_package_id (the tier the user selected), not the tier_group_id.
First-Month Onboarding
Every new retainer starts status=onboarding. First order has stage_key='retainer_onboarding'.
Professional collects: last 3 months' filings, portal credentials, business details. SLA: 5 working days.
User sees 'Setting up your account — estimated 3 working days.' during onboarding.
After professional marks onboarding complete: status=active, first_billing_date set (per table above), sync-retainer-obligations fires.
Dedicated Professional
assigned_professional_id set at first billing. Never changes except by replace-retainer-professional.
If dedicated professional suspended: replace-retainer-professional auto-fires. User notified generically: 'Your Ollvy specialist has been reassigned.' No name given.
If no alternative professional available: retainer auto-pauses. This pause does NOT count against the 2/year limit.
Pause Policy
Max 2 pauses per calendar year per retainer. Max 1 month per pause. Cannot stack.
Mid-cycle pause: current month's order completes normally. Billing pauses from next cycle.
Auto-resume: check-retainer-pauses cron (daily) resumes if pause_start_date > 1 month ago.
3rd attempt blocked: show message with next available pause date (Jan 1 of next year).
Upgrade / Downgrade
change-retainer-tier: cancels current Razorpay Subscription, creates new at new tier price, preserves assigned_professional_id. Effective next cycle.
User sees: 'Switching from [tier A] (₹X/mo) to [tier B] (₹Y/mo). New rate starts [date].'
Cancellation
Effective end of current billing cycle. Current month's work completes. No refund.
Document delivery: 5 working days after last billing cycle close.
Cancellation screen shows: exact end date, last document delivery date, no-charge confirmation.
Trial cancellation (is_trial_active=true): immediate cancellation. No charge. No billing-cycle logic.
Pro First Month Free
Pro users: first retainer ever = 30-day Razorpay trial. create-razorpay-subscription uses trial_period=30.
retainer_subscriptions.is_trial_active=true during trial. Flips false on first successful charge.
Checkout shows: 'Free for 30 days, then ₹X/month.'
Pro discount does NOT apply as a price reduction on the Razorpay plan. Use trial only.
Payment Failure Flow
Day
What Happens
Professional View
Day 0
subscription.payment_failed webhook. user notified. professional notified.
Push: 'Billing issue on client. Work paused.'
Day 1–3
Razorpay auto-retries 3x
App shows 'Awaiting payment resolution'. Advance Stage disabled.
Retry succeeds
subscription.charged fires. payment_paused=false.
Push: 'Payment resolved. Resume work.'
Day 4 (all failed)
retainer status=payment_failed
Push: 'Retainer suspended.'
User updates card
Razorpay hosted page. On success: auto-resumes.
Push: 'Retainer active.'
7. Professionals as Invisible Infrastructure
Users book Ollvy. Not a CA. Not a person. This is a brand and product decision. If users can name and directly contact professionals, Ollvy will be disintermediated within 12 months.
Surface
User Sees
Prohibited
Service detail
'Handled by Ollvy Verified Compliance Team'
Professional name/photo before booking
Order confirmed
'Your Ollvy specialist has been assigned'
Any personal identifier
Order detail
'[First name] from Ollvy Compliance Team'
Last name, phone, email, certs
Chat
'[First name], Ollvy Compliance Team'
Any contact detail outside in-app chat
Retainer detail
'Managed by your Ollvy specialist'
Professional name or photo
Professional Lifecycle
Status
Set By
Action Required
pending
Registration complete
Admin reviews and calls approve-professional or reject-professional
approved
approve-professional edge function
Professional receives push + welcome email. Can now receive orders.
rejected
reject-professional edge function
Professional receives push with reason. Can reapply.
suspended
suspend-professional edge function
All active retainers get new professional assigned. Active orders shown to admin for reassignment.
Bank Details Gate
Professional must save bank details before receiving first payout. save-bank-details creates Razorpay Contact + Fund Account.
HARD GATE (new): auto-assign-professional MUST check razorpay_fund_account_id IS NOT NULL before assigning. If bank details missing, skip professional entirely in assignment algorithm — treat as if capacity is full. Do NOT assign and hold payout; assign only when bank details are present. This prevents professionals going weeks without pay and then raising disputes.
razorpay-payout gate (secondary): if professional_bank_accounts.razorpay_fund_account_id IS NULL at payout time (edge case), skip payout. Create admin_notification: '[Name] has no bank details. Payout of ₹X held.'
Professional app: P07 orientation banner always includes deep link to P14. Earnings screen (P13): prominent red banner 'Add bank details to start receiving orders — you are currently invisible to our assignment system' if razorpay_fund_account_id IS NULL. Repeated push notification at Day 1, Day 3, Day 7 post-approval if bank details still missing.
Availability and Leave
Mechanism
Column
Duration
Auto-reset
Daily toggle
is_available
Same day typically
No — professional toggles back
Extended leave
on_leave_until (date)
Days to weeks
Yes — check-leave-returns cron resets to is_available=true morning after date
Suspension
professionals.status='suspended'
Indefinite
Admin only
Strike System
apply-strike called by check-sla-alerts on FIRST breach only (professional_strike_applied guard prevents double-counting).
Strike 3: admin email + admin_notifications banner. Professional push warning.
Strike 5: auto-suspend via suspend-professional. All retainers replaced. All active orders AUTO-REASSIGNED (see suspension logic in Section 8). Admin receives email summary.
Strike Appeal Flow
When apply-strike fires, professional receives push notification: 'A strike has been applied to order [N] for SLA breach. If the delay was caused by the client, you can appeal within 24 hours.'
New table: strike_appeals — id, professional_id, order_id, sla_alert_id, reason text NOT NULL, submitted_at, status enum(pending|voided|upheld) default pending, reviewed_by admin_id nullable, reviewed_at nullable. RLS: professional can INSERT own appeals, admin can UPDATE status.
Professional app P08 Order Detail: 'Appeal Strike' CTA shown for 24h after strike applied. Tapping opens a text field: 'Explain why the delay was outside your control (e.g. client did not submit documents on time).' POST to submit-strike-appeal edge function.
Admin /professionals/[id] shows pending appeals. Admin can Void (decrement strike_count, set status=voided) or Uphold (status=upheld, no change to strike_count). Both actions send professional push with outcome.
New edge function: submit-strike-appeal (authenticated professional, rate-limit 1 appeal per sla_alert_id). Validates 24h window. Inserts strike_appeals row. Creates admin_notification. Returns error if window expired.
8. Order Status State Machine
Every valid transition listed here. Do not implement any transition not in this table. Invalid transitions must return an error.
From
To
Triggered By
Side Effects
(none)
pending_payment
create-razorpay-order
Order created. Razorpay order created.
pending_payment
paid
razorpay-webhook (payment.captured)
auto-assign-professional called. Chat created. Invoice generated. User notified.
pending_payment
cancelled
Razorpay order expired (15 min) or user closes sheet
No side effects. Order stays for audit.
paid
assigned
auto-assign-professional
Professional notified. First stage logged with stage_due_date. current_active_orders++.
paid
waitlisted
auto-assign-professional (no capacity)
order_waitlist row created. User notified.
waitlisted
assigned
Admin force-assign OR check-waitlist cron retry. Admin force-assign: admin /orders/[id] page shows 'Force Assign' button on waitlisted orders. Tapping opens a professional search modal (search by name/profession type, shows current capacity). Admin selects professional → calls force-assign-order edge function → bypasses capacity check, sets order assigned, notifies both parties. Force-assigned orders are flagged with force_assigned=true column for analytics.
Same as paid→assigned.
assigned
in_progress
Professional advances FIRST stage
Order status updated. User notified.
in_progress
in_progress
Professional advances non-final stage
Stage logged. User notified.
in_progress
completed
Professional advances FINAL stage
Payout row created. User notified. Compliance obligation updated. Recommendations generated. Feedback eligibility checked.
in_progress
disputed
User or professional raises dispute
Payout status→held. Admin notified (email + banner). Order locked.
disputed
in_progress
Admin resolves — no_refund, work not done
Payout released. Professional resumes.
disputed
completed
Admin resolves — no_refund, all stages done
Payout released. Order closed.
disputed
cancelled
Admin resolves — refund
Razorpay refund. Payout cancelled. If retainer: compliance obligation reverts to overdue.
completed
disputed
User raises dispute within 7 days
Payout status→held.
payment_paused=true on a retainer child order blocks Advance Stage. This is not a status transition — it is a column on orders. Set by retainer-billing-webhook on payment failure. Cleared when payment resolves.
9. Chat Architecture
Order Type
Chat Created?
chat_conversations row
One-time order payment confirmed
Yes — one per order
order_id=this order. retainer_subscription_id=NULL.
First retainer cycle charged
Yes — one per retainer
order_id=NULL. retainer_subscription_id=this retainer.
2nd+ retainer cycles
No — reuse existing
orders.chat_conversation_id points to retainer's existing chat_conversation.
Realtime Subscriptions Required
App
Table
Filter
User mobile
chat_messages
conversation_id IN (user's conversations)
User mobile
orders
user_id = me (for status updates)
Professional mobile
chat_messages
conversation_id IN (professional's conversations)
Professional mobile
orders
professional_id = me
Professional mobile
retainer_subscriptions
assigned_professional_id = me (for pause/cancel/tier changes)
Admin Web — DB Sync Method
The admin Next.js app does not use Supabase Realtime. It uses two mechanisms: SWR polling (every 60 seconds) for badge counts and notification banners, and page-load fetch for list pages. The single exception is the disputes chat — the admin chat history view subscribes to Realtime on the specific disputed order's conversation so updates from the user/professional appear without refresh.
Admin does NOT receive FCM push notifications. All critical alerts arrive via email (Resend/SendGrid via send-admin-email) and the in-app admin_notifications banner stack.
Notification Channels — Complete Reference
Three delivery channels exist. Each event specifies exactly which channels fire. No event may use a channel not listed in Section 13. The matrix below is the authoritative routing reference.
FCM Push: USER APP ONLY (React Native). Requires fcm_token on users table. Graceful null guard — send-notification returns silently if fcm_token IS NULL. DO NOT use FCM for professionals.
SMS (MSG91): Fired ONLY for four critical events: (1) OTP delivery, (2) payment failure, (3) order assigned (first notification a user gets that work has started), (4) order completed. All other events are push-only. SMS is never sent without a corresponding push notification. Rationale: SMS costs ₹0.10–0.20 per message at scale; limiting to four events keeps costs predictable while ensuring the highest-urgency moments always reach the user regardless of push opt-out status.
Email (Resend/SendGrid via send-admin-email): Admin only. Critical events: dispute opened, waitlisted order >48h, SLA breach at T+48h, capacity at 95%, dispute approaching auto-refund, promo abuse flag. Recipient list from app_settings key='admin_email_recipients'.
In-app admin banner (admin_notifications table): Non-critical admin alerts. Dismissable. Shown as stack below KPI row on /dashboard. Polled every 60s via SWR.
In-app admin badge (DB count): sidebar link badges on /disputes, /quotes, /professionals, /orders (waitlist). Polled every 60s via SWR. No persistence — count derived live from DB.
PROFESSIONAL PUSH CHANNEL (different from user FCM): For all professional-facing push events, the delivery channel is Web Push via the Browser Push API (Firebase Web Push, same FCM project). Professionals opt in on first login at pro.ollvy.com. Stored as professionals.web_push_subscription (JSONB). If professionals.notification_preference = 'sms_only' OR web push not yet granted: fall back to SMS for events in the SMS_ALLOWED_EVENTS list, or skip entirely for push-only events. The 'Push (pro)' label in the notification matrix below means Web Push to pro.ollvy.com, not FCM to a mobile app.
System Messages
sender_id=NULL, sender_type='system'. Rendered as centred grey pill. No avatar. No sender name.
Trigger
System Message Text
Order assigned
Your Ollvy specialist is on the case. Expect to hear from them within 24 hours.
Order reassigned
Your order has been reassigned to a new Ollvy specialist. No action needed.
Stage advanced
[First name] has updated your order: [stage_name] is now complete.
Document requested
Your specialist has requested a document. Please check the Documents tab.
Dispute opened
A dispute has been raised on this order. Ollvy admin will review within 24 hours.
Dispute resolved
Your dispute has been resolved. See the resolution details below.
Retainer tier changed
Your plan has been updated to [new tier label]. New rate: ₹X/month from [date].
Retainer professional replaced
Your Ollvy specialist has been reassigned to ensure continuity.
Retainer paused
Your retainer has been paused until [resume date].
Retainer resumed
Your retainer is active again. Billing resumes on [date].
Payment failed
There is a billing issue on this account. Work is paused until payment is resolved.
Payment resolved
Payment resolved. Work is resuming.
10. Invoice Generation
Every Razorpay charge generates a GST-compliant PDF invoice. Legally required. Primary trust signal for B2B users — their accountant will ask for it.
invoice_number: INV-YYYY-NNNNN. Auto-generated by DB trigger. Sequential per year.
Issued by: Ollvy Technologies Private Limited. GSTIN from OLLVY_GSTIN env var. Ollvy registered address.
Issued to: user's business name, GSTIN (if registered), state.
Line items: Professional Service Fee + Govt Fees (if any) + CGST 9% + SGST 9% (same state as Ollvy) OR IGST 18% (different state).
// GST determination — generate-invoice edge function
const isSameState = user.state.toLowerCase() === Deno.env.get('OLLVY_GST_STATE')
// Same state: CGST 9% + SGST 9%. Different state: IGST 18%.
// Total is always 18% of price_base_paisa either way.
Invoice Access
PDF stored in Supabase Storage /invoices/ bucket. NEVER exposed via direct URL.
User taps 'Download Invoice': app calls get-invoice-url edge function. Returns signed URL valid 60 minutes. App opens in browser or triggers download.
Surfaces: order detail screen, retainer billing history, My Business vault, admin order detail.
11. Webhook Registration
Register two separate webhook URLs in the Razorpay dashboard. One for Orders, one for Subscriptions. Using one URL for both will cause events to fail silently.
Razorpay Product
Webhook URL
Edge Function
Events to Subscribe
Orders
https://[project].supabase.co/functions/v1/razorpay-webhook
razorpay-webhook
payment.captured, payment.failed, order.paid
Subscriptions (retainers)
https://[project].supabase.co/functions/v1/retainer-billing-webhook
retainer-billing-webhook
subscription.charged, subscription.payment_failed, subscription.cancelled, subscription.paused, subscription.resumed
Subscriptions (Ollvy Pro)
https://[project].supabase.co/functions/v1/pro-subscription-webhook
pro-subscription-webhook
subscription.charged, subscription.payment_failed, subscription.cancelled
Each webhook verified with its own secret (RAZORPAY_WEBHOOK_SECRET for orders, RAZORPAY_SUBSCRIPTION_WEBHOOK_SECRET for retainer/pro).
Dev bypass: if ENVIRONMENT==='development', skip signature verification.
Idempotency — Duplicate Event Handling
Razorpay retries failed webhooks up to 3 times. Without idempotency, a network hiccup could create duplicate orders, double invoices, or double payouts.
New table: processed_webhook_events — id, razorpay_event_id text UNIQUE NOT NULL, event_type text, processed_at timestamptz default now(). No RLS (service role only). Index on razorpay_event_id.
All three webhook handlers (razorpay-webhook, retainer-billing-webhook, pro-subscription-webhook): FIRST action after signature verification = INSERT into processed_webhook_events (razorpay_event_id, event_type). If INSERT fails (unique constraint), return HTTP 200 immediately — event already processed. Only proceed with business logic if INSERT succeeds.
Razorpay event ID is in the payload at payload.event.id. Use this as razorpay_event_id. Cron: delete processed_webhook_events older than 30 days (monthly cleanup, 3:00am, 1st of month).
Step
Actor
Action
DB Change
1
User
Taps 'Get Exact Quote' on service where price_varies_by_state=true
2
User
Fills quote form: business details, state, requirements
quote_requests inserted, status=pending
3
Admin
Sees badge on /quotes page (within 4h SLA)
4
Admin
Sets confirmed_price_paisa + confirmed_govt_fees_paisa
status=quoted, quoted_at set, expires_at=quoted_at+48h
5
System
Push + SMS to user: 'Your quote for [service] is ready: ₹X'
6
User
Taps 'Accept and Book' on quote detail screen
status=accepted
7
System
create-razorpay-order called with quote_request_id
Razorpay order at confirmed_price_paisa
8
User
Pays
9
Webhook
razorpay-webhook fires
Order created, assigned, chat created, invoice generated
Quote expires 48h after quoted_at. check-expired-quotes cron sets status=expired. User notified: 'Quote expired. Request a new one?'
create-razorpay-order: if quote_request_id present, use confirmed_price_paisa (not service_packages price). Quote must be status=accepted.
13. Notification Taxonomy — Every Event
Event
User
Professional
Admin
Channel
Order payment confirmed
'Your order is confirmed'
—
—
Push
Invoice generated
'Your invoice is ready'
—
—
Push
Order assigned
'Your specialist is on it'
'New order: [service], [city]'
—
Push
Order waitlisted
'Finding your specialist'
—
—
Push
Waitlisted > 48h
'Still finding your specialist'
—
Email + banner
Push
Waitlisted order finally assigned
'Great news! Your specialist assigned'
'New order assigned'
—
Push+SMS
Stage advanced
'[First name] updated: [stage]'
—
—
Push
Document requested
'Specialist needs a document'
—
—
Push
Document uploaded by user
—
'[Business] uploaded a document'
—
Push
Order completed
'Your [service] is complete'
—
—
Push+SMS
Compliance due in 30d (Pro)
'[Obligation] due in 30 days'
—
—
Push
Compliance due in 7d (Pro)
'[Obligation] due in 7 days — urgent'
—
—
Push
Compliance due in 1d (Pro)
'[Obligation] due tomorrow'
—
—
Push
Compliance overdue
'[Obligation] is overdue'
—
—
Push
Retainer billing reminder (7d before)
'Card charged ₹X on [date]'
—
—
Push
Retainer payment failed
'Payment failed for [service]'
'Billing issue: [client]'
Banner
Push+SMS
Retainer paused
'[Service] paused until [date]'
'Retainer paused by client'
—
Push
Retainer resumed
'[Service] resumed'
'Retainer active again'
—
Push
Retainer cancelled
'[Service] ends on [date]'
'Retainer cancelled by client'
—
Push
Retainer tier changed
'Plan updated to [tier]'
'Plan change: new rate'
—
Push
Retainer professional replaced
'Specialist reassigned'
Original: 'Reassigned'. New: 'New client assigned'
—
Push
Dispute opened
'Dispute being reviewed'
'Dispute raised on order [N]'
Email+Banner
Push+Email
Dispute resolved (refund)
'Dispute resolved. Refund 5-7 days.'
'No payout'
—
Push
Dispute resolved (no refund)
'Dispute resolved.'
'Payout released'
—
Push
Dispute auto-refund triggered
'Auto-refund processed'
'No payout'
Email
Push+Email
Quote ready
'Your quote is ready: ₹X'
—
—
Push
Quote expired
'Quote expired. Request new?'
—
—
Push
SLA breach
—
'Stage overdue on [N]'
Banner (T+0), Email (T+48h)
Push (pro)
Strike count = 3
—
'Account review required'
Email+Banner
Push+Email (pro)
Cert approved/rejected
—
'[Cert] verified' / 'Not approved: [reason]'
—
Push
Professional approved
—
'Welcome. Start receiving orders.'
—
Push
Pro activated
'Welcome to Ollvy Pro'
—
—
Push
Pro payment failed (day 1)
'Pro payment failed. Update card.'
—
—
Push+SMS
Pro payment failed (day 5)
'2 days left before Pro ends.'
—
—
Push+SMS
Pro payment failed (day 7)
'Last chance: Pro ends tomorrow.'
—
—
Push+SMS
Pro reverted to free
'Pro access ended.'
—
Banner
Push
Retainer onboarding start
'Setting up your account (3 days)'
'New onboarding: [client]'
—
Push
Retainer onboarding complete
'Your retainer is active!'
—
—
Push
Cert expiring in 30/14/7 days
—
'[Cert] expires in [N] days'
—
Push
Leave ended
—
'You&#x2019;re now receiving orders.'
—
Push
Payout processed
—
'Payment of ₹X sent to bank'
—
Push
14. Admin Notification System
Admin uses a web browser. FCM push does not reach admin. Three mechanisms only: in-app badge, email, dashboard banner. Know which event uses which.
Mechanism
When Used
Implementation
In-app badge (sidebar)
Pending items requiring action. Not urgent.
DB count on page load + SWR polling 60s. Badges on: Disputes (N), Quotes (N), Waitlist (N), Cert Verifications (N).
Email (Resend/SendGrid)
Critical events requiring immediate action.
send-admin-email edge function. Recipient list from app_settings key='admin_email_recipients'.
Dashboard banner
Non-critical alerts. Dismissable.
admin_notifications table. Shown as dismissable stack below KPI row.
Admin Pages
Page
Purpose
/dashboard
MRR KPI (from retainer monthly_price_paisa snapshots + Pro count), active orders, disputes pending, SLA breaches, capacity alerts
/orders
All orders. Filter by status, service, date. Reassign professional.
/retainers
All retainer subscriptions. Status, billing, assigned professional.
/quotes
Quote requests queue. Age indicator. Confirm quote action.
/disputes
Disputes queue. 48h SLA. Chat History tab. Resolve actions.
/sla
SLA dashboard. Overdue stages by professional and service.
/capacity
Heatmap of professional capacity by city × service.
/professionals
Professional management. Pending approval queue. Strike history.
/professionals/[id]
Profile, certs (verify/reject), strikes, suspension, bank details status.
/users
User list. Pro status. Health score. Profile completeness.
/services
Service catalogue. Toggle is_active.
/services/builder
8-step service builder including tier group creation (Step 0) and situation_tags.
/tier-groups
Manage tier groups. Reorder tiers. Remove tiers from groups.
/invoices
All invoices. Download PDF. Re-send to user.
/payouts
Payout batches. Trigger payout batch. Per-professional history.
/analytics
MRR trend, churn, SLA compliance, capacity, situation tag conversion, Pro conversion.
/settings
admin_email_recipients, platform_fee_percent, dispute_auto_refund_days.
Admin Page — Field-Level Specifications
The following specs detail every column, filter, action and modal for the five highest-risk admin pages. All admin pages require TOTP-protected session (see Section 40). Destructive actions (suspend, refund, close) must show a confirmation modal before executing.
/orders — All Orders
Table columns (left to right):
Order ID (truncated, click to open /orders/[id])
Service name
User display name (city only, not full name — privacy)
Professional name
Status badge: pending_assignment | waitlisted | in_progress | completed | disputed | cancelled
SLA countdown (days:hours remaining for in_progress orders; red if overdue)
Created At (DD MMM YYYY)
Total (price_base_paisa + govt fees, formatted as Rs X,XXX)
Filters (filter bar above table):
Status — multi-select dropdown
Service — searchable dropdown from service_packages
City — dropdown (distinct cities from orders table)
Professional — searchable dropdown
Date range — from / to date pickers (created_at)
Has open dispute — toggle
Row actions (hover → kebab menu):
Reassign Professional — opens modal: searchable professional list filtered by service + city. Shows capacity. Confirm button calls auto-assign-professional with override flag.
View Invoice — calls get-invoice-url. Opens PDF in new tab.
Mark Waitlisted → In Progress — only for waitlisted orders. Confirmation modal.
Cancel Order — opens modal: requires reason text (min 20 chars). Calls resolve-dispute with refund=true if payment captured.
Pagination: 50 rows per page. Server-side. Total count shown.
/orders/[id] — Admin Order Detail
Header bar: Order ID | Service | Status badge | SLA timer | Created At.
Sections:
Order Summary: user city, business type, professional name, assigned_at, all price line items (base, govt fees, GST, promo discount, total), payment method, Razorpay payment ID.
Govt Fee Reimbursement: shows govt_fees_paid_paisa if set by professional. Receipt download link. Read-only for admin (admin cannot edit this field — see submit-govt-fee-reimbursement spec).
Stages: same stepper as P09 but read-only. Shows completed_at per stage and which professional advanced it.
Documents: full document list with type, uploaded_by, uploaded_at, download link.
Chat transcript: full read-only chat history with timestamps.
Dispute panel (shown if dispute exists): dispute reason, opened_at, SLA deadline, auto-refund date. Actions: Resolve as Refund / Resolve as Completed. Both require confirmation modal with reason field.
Audit log: timestamped list of all status changes, stage advances, professional reassignments.
/retainers — All Retainer Subscriptions
Table columns:
Subscription ID (truncated, click to open detail)
Service name + Tier name
User (city only)
Professional name
Status badge: active | paused | cancelled | payment_failed
Monthly price (Rs X,XXX)
Billing anchor date (e.g. '15th of month')
Pause count (X/2)
Next billing date
Started At
Filters:
Status — multi-select
Service — searchable dropdown
Professional — searchable dropdown
Payment failed only — toggle
Row actions:
Replace Professional — same modal as /orders reassign. Calls replace-retainer-professional.
Force Cancel — modal with reason. Calls cancel-retainer with admin_override=true (bypasses end-of-cycle logic, immediate cancel).
View billing history — inline expansion showing all retainer_billing_events rows for this subscription.
/users — User List
Table columns:
User ID (truncated)
Phone (masked: +91 XXXXX X1234)
City
Business type
Pro status badge (free | pro | pro_grace)
Profile completeness score (0–100%)
Health score (0–100, colour-coded: ≥70 green, 40–69 amber, <40 red)
Order count (total lifetime orders)
Joined At
Filters:
Pro status — multi-select
Health score range — min/max sliders
City — dropdown
Has active dispute — toggle
Profile completeness < 60 — toggle (shows users the compliance calendar is not yet seeded for)
Row actions:
View Profile — navigates to /users/[id].
Flag for Fraud Review — opens /fraud review queue with this user pre-selected. Requires reason.
/users/[id] — User Detail
Header: User ID | Phone (masked) | City | Joined At | Pro status badge.
Sections:
Profile: all users table fields (state, business_type, gst_registered, has_employees, incorporation_date, business_name). Read-only. Link to edit if admin override required (writes to audit log).
Pro Subscription: status, started_at, pro_grace_start (if applicable). Action: Process Pro Refund (14-day policy enforcement — see Section 31). Opens modal requiring confirmation: checks that no Pro-benefit orders exist; if check passes, initiates Razorpay refund and sets pro_status=free.
Orders tab: same table as /orders filtered to this user. All columns + actions.
Retainers tab: same table as /retainers filtered to this user.
Compliance obligations tab: list of all compliance_obligations rows for this user — label, due_date, status, completed_order_id. Admin can manually mark an obligation as 'not_applicable' with a reason (writes to audit log).
Disputes tab: all disputes this user has opened — service, opened_at, resolution, refund amount.
Fraud flags tab: all entries from fraud_review_queue for this user. Status, reviewer notes.
Danger zone: Suspend Account (sets users.is_suspended=true, cancels all active retainers via cancel-retainer with admin_override, blocks new orders). Requires TOTP re-confirmation and reason (min 50 chars). Irreversible via UI — requires DB edit to reinstate.
/disputes — Disputes Queue
Table columns:
Dispute ID
Order ID (link to /orders/[id])
Service name
User city
Professional name
Opened At
SLA deadline (48h from opened_at — red if breached)
Auto-refund date (dispute_auto_refund_days from app_settings after opened_at — amber if within 24h)
Status: open | resolved_refund | resolved_completed
Filters:
Status — multi-select (default: open only)
SLA breached — toggle
Approaching auto-refund (within 24h) — toggle
Row actions:
Open Detail — navigates to /orders/[id] dispute panel.
Resolve as Refund — confirmation modal (reason required). Calls resolve-dispute with refund=true. Triggers Razorpay refund. Sets payout status=cancelled for that order.
Resolve as Completed — confirmation modal (reason required). Calls resolve-dispute with refund=false. Releases payout hold.
Chat History tab: inline panel showing full chat transcript for the disputed order. Read-only.
SLA: admin must resolve within 48h of dispute opening. check-dispute-sla cron fires daily at 10am IST — if dispute is open and SLA deadline has passed, sends admin email and increments sla_alerts. If auto-refund date passes with dispute still open, resolve-dispute is called automatically with refund=true.
/promo-codes — Promo Code Management (NEW PAGE)
List table columns: Code | Discount type | Value | Applicable to | Min order | Per-user limit | Uses / Max uses | Expiry | Status (active/expired/exhausted).
Create Promo modal (+ New Code button):
code: text input (auto-uppercased, alphanumeric + hyphen only, max 20 chars, unique).
discount_type: radio — Percent off / Flat amount off.
discount_value: number input. If percent: 1–100. If flat: amount in Rs (stored as paisa).
applicable_to: radio — All services / Specific services (shows service multi-select if chosen).
min_order_paisa: optional — minimum order value in Rs for code to apply.
per_user_limit: number input (default 1).
max_total_uses: optional — blank = unlimited.
expires_at: optional date picker.
is_active: toggle (default on).
Row actions: Deactivate (sets is_active=false) | Delete (soft-delete, only if 0 uses).
/professionals — Professional Management
Table columns: Professional ID | Display name | City | Profession type | Status badge (pending_review | approved | suspended | rejected) | Active orders count | Avg rating (stars, N/A if < 10) | Strike count (amber if >= 1, red if >= 3) | Cert expiry (red if < 30 days) | Joined at.
Filters: Status (multi-select, default: pending_review + approved), city, profession type, has pending application toggle, cert expiring < 30 days toggle.
Row actions: Open /professionals/[id] | Approve (sets status=approved, sends invite SMS) | Reject (modal: rejection reason required, reason codes: insufficient_certs | incomplete_profile | location_not_served | duplicate_account | other) | Suspend (modal: reason required + TOTP confirmation).
Pending Applications sub-page (/professionals/applications): same columns filtered to professional_applications table. Row actions: Approve (creates professionals row, sends invite SMS) | Reject (sets application status=rejected, sets reapply_after_date = now() + 30 days).
/professionals/[id] — Professional Detail
Header bar: Display name + avatar + status badge + city + profession type. Action buttons: Approve / Reject / Suspend / Reactivate (context-sensitive to current status). All destructive actions require confirmation modal + reason.
Section: Profile — Full name, phone (masked), bio, years_experience, service_areas list, cities list. Read-only. Admin can trigger profile refresh (calls update-professional-profile admin override, writes to admin_audit_log).
Section: Certifications — Table of professional_certifications rows. Columns: cert_type | cert_number | issued_by | expiry_date | verified_at | status. Admin actions per row: Mark Verified (sets verified_at = now()) | Mark Invalid (sets status=invalid, triggers send-notification to professional: cert rejected).
Section: Orders — Paginated list of all orders where professional_id = this professional. Columns: Order ID | Service | User city | Status | SLA status | Created at. Click opens admin /orders/[id].
Section: Strikes — Table of sla_alerts where professional_id = this. Columns: order_id | stage | breach_date | strike applied (bool) | appeal status. Admin action: Void Strike (decrements strike_count, writes admin_audit_log). If strike_count >= 3: auto-suspension warning banner.
Section: Earnings — Sum of paid payouts. Last 4 payout batches with amounts. Fund account status (verified / missing — link to razorpay fund account ID).
Section: Bank Details — Read-only view of professional_bank_accounts row. Admin cannot edit. Shows: bank name, account number (masked), IFSC, razorpay_fund_account_id (if exists), verification status.
Danger Zone: Suspend Account (sets professionals.status=suspended, cancels active order assignments, sets is_available=false. Requires reason >= 50 chars + TOTP confirmation). Reactivate (sets status=approved, is_available=true).
Public Website — apps/landing Pages
apps/landing is a Next.js 14 static site (output: 'export'). It serves: (1) Root homepage (ollvy.com), (2) Professional join page (ollvy.com/join), (3) Public business profiles (ollvy.com/b/[id] — see Section 36), (4) Referral landing (ollvy.com/ref/[code]).
ollvy.com — Root Homepage
File: apps/landing/app/page.tsx. Statically generated. SEO: title='Ollvy — Compliance for Indian Businesses | GST, ITR, Payroll', meta description='Get your GST filings, ITR, payroll, and company compliance done by verified professionals. Fixed prices. No surprises.'
Sections in order:
Nav bar: Ollvy logo (navy). Links: Services | Pricing | For Professionals. CTA button: 'Get Started — Free' (links to deep link ollvy://onboarding or App Store / Play Store via useragent detection). Sticky on scroll.
Hero: H1 'Your business compliance, handled.' Subtext: 'GST filings, ITR, payroll and more — verified CAs and CSs, fixed prices, no surprises. Trusted by [platform_stats.users_count] founders in India.' Primary CTA: 'Start Free'. Secondary CTA: 'See Services'. Background: cream (#FAFAF7). Illustration: simple line-art of founder + documents.
Problem bar (3 pain points): 'Missed deadlines → penalties' | 'Overcharged by CAs' | 'No visibility into what's happening'. Icons only. Neutral grey background.
Service grid: 6 most popular services as cards (fetch from search-services with urgency_score DESC limit 6). Each card: service name, short_description, price 'from Rs X', SLA 'Done in N days'. 'View all services' link below. No pricing for quote-based services — show 'Custom quote'.
How it works (3 steps): 1. Tell us about your business (phone + onboarding). 2. We match you with a verified professional. 3. Get it done — tracked, documented, on time. Numbered blocks, simple icons.
Social proof: platform_stats.orders_completed_total orders completed | platform_stats.professionals_count verified professionals | platform_stats.cities_served cities. Numbers loaded client-side via get-public-profile (user_id=null returns just stats) — show skeleton on load.
Testimonials: 3 hardcoded testimonial cards (founder quotes). Do not build a CMS for this — hardcode in the component.
For Professionals CTA: 'Are you a CA, CS, or tax professional? Join Ollvy and get clients.' Button: 'Apply Now' (links to ollvy.com/join).
Footer: Logo | Links: Privacy Policy, Terms, Contact | Social icons (LinkedIn, Twitter/X). Copyright 2024 Ollvy Technologies Pvt. Ltd.
ollvy.com/join — Professional Interest Page
File: apps/landing/app/join/page.tsx. Purpose: capture professional applications. Form fields: Full name | Phone | City (dropdown, same cities as user app) | Profession type (CA | CS | Tax Professional | Payroll Specialist | Labour Law Consultant) | Years of experience | How did you hear about us? (dropdown). Submit calls professional application flow (see Section 28). After submit: 'We'll review your application within 48 hours. You'll receive an SMS.' Success state replaces form.
ollvy.com/ref/[code] — Referral Landing
File: apps/landing/app/ref/[code]/page.tsx. Shows referrer's first name (from referral_code lookup via get-public-profile) and a 'Your friend invited you to Ollvy' message. CTA: 'Download the app' (App Store / Play Store links). The ref code is passed through to the app via deep link: ollvy://ref/[code]. App captures it at OTP stage and stores in users.referral_code_used.
15. FCM Token Registration
Without stored FCM tokens, 100% of push notifications fail silently. register-fcm-token must be called on every USER APP launch, immediately after auth session is confirmed. This function is USER APP ONLY — professionals use register-web-push at pro.ollvy.com instead.
// register-fcm-token — HTTP POST (auth) — USER APP ONLY — USER APP ONLY
// Body: { fcm_token: string   (app_type param removed — users only)
// Called on every USER APP launch — tokens rotate, always refresh
// Always update user fcm_token — no app_type branch needed:
await db.from('users').update({ fcm_token }).eq('auth_user_id', user.id)
// Professionals use register-web-push edge function instead (see below)
// (removed — professionals do NOT use FCM)
}
// On logout: set fcm_token = NULL
// send-notification: if !target.fcm_token, return silently (user may not have app open)
// register-web-push — HTTP POST (auth) — PROFESSIONAL WEB PANEL ONLY
// Body: { subscription: PushSubscriptionJSON }  (from browser Push API)
// Called after user grants Web Push permission at pro.ollvy.com
// Stores subscription in professionals.web_push_subscription (JSONB)
await db.from('professionals')
  .update({ web_push_subscription: subscription })
  .eq('auth_user_id', user.id)
// On logout: clear web_push_subscription = NULL
// send-notification: if professional, read web_push_subscription;
//   if NULL or notification_preference='sms_only': SMS fallback for
//   order_assigned / order_completed only (in SMS_ALLOWED_EVENTS list).
16. Storage Bucket RLS Policies
Set these policies before testing any file upload feature. Without them, any authenticated user can read any document, invoice, or certification.
Bucket
Read Policy
Write Policy
Delete Policy
/avatars
Public read (profile photos are public)
auth.uid() matches path (avatars/{user_id}/)
Same as write
/documents
Order owner OR assigned professional OR admin (service role)
User: required_input docs only. Professional: deliverable docs for assigned orders. Admin: any.
Admin only (documents immutable for audit)
/certifications
Professional owns cert OR admin
Professional uploads to certifications/{professional_id}/
Admin only (after verification)
/invoices
NEVER direct URL access. get-invoice-url edge function only (checks ownership, returns 60-min signed URL).
Service role only (generate-invoice function)
Service role only (invoices immutable)
17. Ollvy Pro Tier (₹999/month)
Feature
Free
Pro
Service browsing
Full
Full
One-time bookings
Full
Full + 5% off price_base_paisa (server-side only)
Retainers
Full
Full + first retainer ever = 30-day Razorpay trial
Compliance reminders
None
30/7/1 day push + SMS
Compliance calendar
Read-only (no reminders, no CTAs)
Full: reminders, snooze, Book CTAs
Business health score
Hidden
Visible, updated daily by cron
My Business tab
Hidden
Full: vault, history, calendar, shareable card
Assignment priority
Standard queue
Reserved capacity in auto-assign (headroom threshold=2)
Pro Grace Period Cron — check-pro-grace-period (Daily 6:30am IST)
users.pro_grace_start set by pro-subscription-webhook on payment failure.
Day 1: push + SMS nudge. Day 5: push + SMS urgency nudge. Day 7: push + SMS last chance.
Day 8: subscription_tier='free', pro_grace_start=NULL. Push: 'Pro access ended.'
Payment recovery (retry succeeds): pro_grace_start=NULL. User stays on Pro.
18. Compliance OS
Profile Completeness Gate
Field
Weight
Collected in...
state
20%
Confused founder onboarding
business_type
15%
Confused founder onboarding
gst_registered
15%
Profile setup
has_employees
15%
Profile setup
incorporation_date
15%
Profile setup
city
10%
Profile setup
business_name
10%
Profile setup
compliance_obligations seeded only when profile_completeness_score >= 60. Below threshold: calendar shows 'Complete your profile' CTA.
FREEZE RULE: Once compliance_obligations are seeded (profile_completeness_score first crosses 60), obligations are NEVER removed — even if the user later edits their profile and drops below 60%. This is intentional: removing obligations already seeded is confusing to users and legally risky (they might have already acted on them). If the user edits a field that would change which obligations apply (e.g. switches gst_registered to false), the existing obligations remain but their status may change to 'not_applicable'. Only NEW obligations that result from profile changes above the 60% threshold can be added. The seed-compliance-obligations function must check: if user already has seeded obligations, only INSERT new ones (by service_package_id), never DELETE or UPDATE existing ones.
Score recomputed on every profile field save. seed-compliance-obligations fires automatically when threshold crossed (first time only — guard: if count of existing obligations > 0 then only add-new mode, not reseed).
Compliance Obligation Lifecycle
Status values: upcoming | due_soon | overdue | completed | snoozed | covered_by_retainer
covered_by_retainer: set by sync-retainer-obligations when a retainer starts for the linked service. Reverts on retainer cancel.
completed: set by advance-stage (final stage) calling updateComplianceObligation. Matches by user_id + linked_service_package_id. Picks earliest non-completed obligation.
If a retainer cycle order is disputed and resolved as refund: that month's obligation reverts to overdue.
Order Completion — Side Effects Chain
// advance-stage — when professional marks FINAL stage complete:
1. order.status = 'completed'
2. payout row created (status=pending, billing_period set for retainers)
3. updateComplianceObligation(order)  // marks linked obligation complete
4. generateRecommendations(user_id)   // post-order upsell logic
5. checkFeedbackEligibility(order)    // show rating prompt?
6. sendNotification(user, 'order_completed')  // post-completion screen deeplink
7. current_active_orders-- (DB trigger handles this)
Feedback Frequency
One-time orders: always show rating prompt after completion.
Retainer cycles: show after FIRST completed cycle. Then only if last feedback for this retainer was > 6 months ago.
18a. compliance_obligation_rules — Seed Data
These are the canonical rows that must be present in compliance_obligation_rules after running the initial migration. Claude Code must not invent or infer compliance law — seed exactly these rows. The due_date_formula column stores a plain-English formula string that the seed-compliance-obligations edge function resolves at runtime into a concrete due_date for each user based on their profile fields (incorporation_date, gst_registered, has_employees, state, business_type, turnover_crore).
Seeding Rules:
Insert all rows where is_active = true on first migration.
business_type[] = NULL means 'applies to all business types'.
state[] = NULL means 'all states'.
linked_service_package_id: resolved at seed time by slug lookup — do not hardcode UUIDs in migration.
advance_reminder_days[]: default [30, 7, 1] for annual filings; [7, 1] for monthly.
recurrence values: 'monthly' | 'quarterly' | 'half_yearly' | 'annual' | 'one_time' | 'every_10_years'.
#
Obligation Label
Applies To
Recurrence
Due Date Formula
Reminder Days
Linked Service (hint)
GST-01
GSTR-3B (Monthly)
GST registered, any business type
Monthly
20th of following month
30/7/1
GST Return Filing
GST-02
GSTR-1 (Monthly)
GST registered, turnover > Rs 5Cr or opted monthly
Monthly
11th of following month
30/7/1
GST Return Filing
GST-03
GSTR-1 (Quarterly — QRMP)
GST registered, turnover ≤ Rs 5Cr on QRMP scheme
Quarterly
13th of month after quarter-end (Apr/Jul/Oct/Jan)
30/7/1
GST Return Filing
GST-04
GSTR-9 — GST Annual Return
GST registered, any business type
Annual
31 December each year
30/7/1
GST Annual Return
GST-05
GSTR-9C — Reconciliation Statement
GST registered, turnover > Rs 5Cr in year
Annual
31 December each year (same as GSTR-9)
30/7/1
GST Annual Return
ITR-01
ITR Filing — Individual/Proprietor
Proprietorship or individual business owner
Annual
31 July (non-audit); 31 October (audit cases)
30/7/1
ITR Filing
ITR-02
ITR Filing — Partnership Firm
Partnership firm or LLP without audit
Annual
31 July (non-audit); 31 October (audit case)
30/7/1
ITR Filing
ITR-03
ITR Filing — Private Limited Company
Private Limited company
Annual
31 October each year
30/7/1
ITR Filing
ITR-04
Tax Audit (Form 3CA/3CB + 3CD)
Any entity with turnover > Rs 1Cr (business) or Rs 50L (profession)
Annual
30 September each year (report due before ITR)
30/7/1
Tax Audit
TDS-01
TDS Quarterly Return (24Q/26Q)
Any entity making salary/vendor payments above threshold
Quarterly
31 July / 31 Oct / 31 Jan / 31 May
30/7/1
TDS Return Filing
TDS-02
TDS Payment (Challan)
Same as TDS-01
Monthly
7th of following month (March: 30 April)
30/7/1
TDS Return Filing
MCA-01
MCA Annual Return (MGT-7/7A)
Private Limited company
Annual
60 days after AGM (AGM by 30 Sept → filing by 29 Nov)
30/7/1
MCA Annual Return
MCA-02
Financial Statements (AOC-4)
Private Limited company
Annual
30 days after AGM (AGM by 30 Sept → filing by 30 Oct)
30/7/1
MCA Annual Return
MCA-03
DIR-3 KYC — Director KYC
Private Limited company (all directors)
Annual
30 September each year
30/7/1
DIR-3 KYC
MCA-04
Form INC-20A — Commencement of Business
Newly incorporated Private Limited company
One-time
Within 180 days of incorporation
30/7/1
Company Incorporation
MCA-05
DPT-3 — Return of Deposits
Private Limited company with loans from shareholders/directors
Annual
30 June each year
30/7/1
MCA Compliance
MCA-06
MSME Form I — Half-Yearly Return
Companies with outstanding dues to MSME suppliers > 45 days
Half-yearly
31 October (Apr–Sep period); 30 April (Oct–Mar period)
30/7/1
MCA Compliance
PF-01
EPF Monthly Contribution (ECR)
Establishments with ≥ 20 employees
Monthly
15th of following month
30/7/1
EPF Registration & Filing
ESIC-01
ESIC Monthly Contribution
Establishments with ≥ 10 employees (wages ≤ Rs 21K)
Monthly
21st of following month
30/7/1
ESIC Registration & Filing
PT-01
Professional Tax Payment
All employees in applicable states
Monthly
Last day of the month (varies by state)
30/7/1
Professional Tax Registration
PT-02
Professional Tax Return
Same states as PT-01
Annual
30 April each year (varies by state)
30/7/1
Professional Tax Registration
LWF-01
Labour Welfare Fund Contribution
Establishments in applicable states
Half-yearly / Annual
Varies by state (typically Dec 31 for annual)
30/7/1
Labour Compliance
SE-01
Shops & Establishments Registration Renewal
All commercial establishments
Annual
Varies by state (typically Dec 31 or anniversary of registration)
30/7/1
Shops & Establishments Registration
FSSAI-01
FSSAI Licence Renewal
Any entity involved in food business
Annual
30 days before licence expiry (licence valid 1–5 years)
30/7/1
FSSAI Registration / Licence
TM-01
Trademark Renewal
Any entity with a registered trademark
Every 10 years
Before expiry date of trademark registration
30/7/1
Trademark Registration
Due Date Resolution Logic — seed-compliance-obligations
The edge function must implement the following resolution rules when converting due_date_formula to a concrete due_date:
'20th of following month' → next 20th after today's date at seed time.
'31 July' → next occurrence of 31 July from incorporation_date or today.
'60 days after AGM' → incorporation_date + (nearest AGM month, Sept 30) + 60 days. Default: 29 November of current FY.
'Within 180 days of incorporation' → users.incorporation_date + 180 days.
'Before expiry' obligations (FSSAI, Trademark) → require admin to set expiry_date on the obligation row; seed creates obligation with due_date = NULL and status = 'pending_info' until expiry_date is populated.
Monthly obligations seeded with the NEXT due occurrence from today, then regenerated by cron after each cycle completes.
State-specific obligations (PT, LWF) are filtered by users.state at seed time — only insert if user.state is in the applicable states list.
Monthly Obligation Regeneration
After a monthly/quarterly obligation is marked completed (advance-stage final stage), the seed-compliance-obligations function must insert the NEXT cycle's obligation row. Guard: do not insert duplicate (user_id + rule_id + due_date). This ensures the compliance calendar always shows the upcoming obligation, not a stale completed one.
18a. compliance_obligation_rules — Seed Data
These are the canonical rows for compliance_obligation_rules after running the initial migration. Claude Code must not invent or infer Indian compliance law — seed exactly these rows and no others. The due_date_formula column stores a plain-English formula string resolved at runtime by seed-compliance-obligations into a concrete due_date for each user.
Seeding rules:
Insert all rows where is_active = true on first migration.
business_type[] = NULL means the obligation applies to all business types.
state[] = NULL means all states. State-specific obligations (PT, LWF) include the applicable states in the Applies To column — filter by users.state at seed time.
linked_service_package_id: resolve at seed time via slug lookup — do NOT hardcode UUIDs in migration SQL.
advance_reminder_days[]: Reminders column shows days (e.g. 30/7/1 = remind at 30, 7, and 1 day before due_date).
recurrence values: 'monthly' | 'quarterly' | 'half_yearly' | 'annual' | 'one_time' | 'every_10_years'.
FSSAI and Trademark obligations are seeded with status='pending_info' and due_date=NULL. Admin must populate expiry_date on the obligation row to activate reminders.
#
Obligation Label
Applies To
Recurrence
Due Date Formula
Reminders
Linked Service (slug hint)
GST-01
GSTR-3B (Monthly)
GST registered, any business type
Monthly
20th of following month
30/7/1
GST Return Filing
GST-02
GSTR-1 (Monthly)
GST registered, turnover > Rs 5Cr or opted monthly
Monthly
11th of following month
30/7/1
GST Return Filing
GST-03
GSTR-1 (Quarterly — QRMP)
GST registered, turnover <= Rs 5Cr on QRMP
Quarterly
13th of month after quarter-end (Apr/Jul/Oct/Jan)
30/7/1
GST Return Filing
GST-04
GSTR-9 — Annual Return
GST registered, any business type
Annual
31 December each year
60/30/7
GST Annual Return / GSTR-9
GST-05
GSTR-9C — Reconciliation
GST registered, turnover > Rs 5Cr
Annual
31 December (same as GSTR-9)
60/30/7
GST Annual Return / GSTR-9
ITR-01
ITR Filing — Proprietorship/Individual
Proprietorship or individual business owner
Annual
31 July (non-audit); 31 October (audit)
60/30/7
ITR Filing
ITR-02
ITR Filing — Partnership / LLP
Partnership firm or LLP
Annual
31 July (non-audit); 31 October (audit)
60/30/7
ITR Filing
ITR-03
ITR Filing — Private Limited Co.
Private Limited company
Annual
31 October each year
60/30/7
ITR Filing
ITR-04
Tax Audit (Form 3CA/3CB + 3CD)
Turnover > Rs 1Cr (business) or Rs 50L (profession)
Annual
30 September (report due before ITR)
60/30/7
Tax Audit
TDS-01
TDS Quarterly Return (24Q/26Q)
Any entity making salary or vendor payments above threshold
Quarterly
31 Jul / 31 Oct / 31 Jan / 31 May
30/7/1
TDS Return Filing
TDS-02
TDS Monthly Deposit (Challan 281)
Same as TDS-01
Monthly
7th of following month (March: 30 April)
7/1
TDS Return Filing
MCA-01
MCA Annual Return (MGT-7/7A)
Private Limited company
Annual
60 days after AGM (AGM by 30 Sept = 29 Nov deadline)
60/30/7
MCA Annual Return
MCA-02
Financial Statements (AOC-4)
Private Limited company
Annual
30 days after AGM (AGM by 30 Sept = 30 Oct deadline)
60/30/7
MCA Annual Return
MCA-03
DIR-3 KYC — Director KYC
Private Limited company (all directors)
Annual
30 September each year
60/30/7
DIR-3 KYC
MCA-04
INC-20A — Commencement of Business
Newly incorporated Private Limited company
One-time
Within 180 days of incorporation
90/30/7
Company Incorporation
MCA-05
DPT-3 — Return of Deposits
Pvt Ltd with director/shareholder loans
Annual
30 June each year
30/7/1
MCA Compliance Filing
MCA-06
MSME Form I — Half-Yearly Return
Companies with MSME dues outstanding > 45 days
Half-yearly
31 October (Apr–Sep); 30 April (Oct–Mar)
30/7/1
MCA Compliance Filing
PF-01
EPF Monthly Contribution (ECR)
Establishments with >= 20 employees
Monthly
15th of following month
7/1
EPF Registration & Filing
ESIC-01
ESIC Monthly Contribution
Establishments with >= 10 employees (wages <= Rs 21K)
Monthly
21st of following month
7/1
ESIC Registration & Filing
PT-01
Professional Tax Monthly Payment
All employees — applicable states only
Monthly
Last day of month (varies by state)
7/1
Professional Tax Registration
PT-02
Professional Tax Annual Return
Same applicable states as PT-01
Annual
30 April each year (varies by state)
30/7/1
Professional Tax Registration
LWF-01
Labour Welfare Fund Contribution
Establishments in applicable states
Half-yearly / Annual
31 December (annual) or 30 June + 31 Dec (half-yearly)
30/7/1
Labour Compliance Filing
SE-01
Shops & Establishments Renewal
All commercial establishments
Annual
Varies by state (typically 31 Dec or registration anniversary)
60/30/7
Shops & Establishments Registration
FSSAI-01
FSSAI Licence Renewal
Any entity in food business
Annual (1–5 yr licence)
30 days before licence expiry (expiry_date field required)
90/30/7
FSSAI Registration / Licence
TM-01
Trademark Renewal
Any entity with registered trademark
Every 10 years
Before trademark registration expiry date
365/90/30
Trademark Registration
Due Date Resolution Logic in seed-compliance-obligations
The edge function must resolve due_date_formula into a concrete future date:
'20th of following month' → next 20th from today.
'11th of following month' → next 11th from today.
'15th of following month' → next 15th from today.
'21st of following month' → next 21st from today.
'7th of following month (March: 30 April)' → next 7th, except for March TDS which is due 30 April.
'31 December each year' → next 31 December from today.
'31 July' → next 31 July; '31 October' → next 31 October; '30 September' → next 30 Sept.
'30 June each year' → next 30 June from today.
'60 days after AGM' → default AGM = 30 September of current FY + 60 days = 29 November.
'30 days after AGM' → default AGM = 30 September + 30 days = 30 October.
'Within 180 days of incorporation' → users.incorporation_date + 180 days. Requires incorporation_date to be set.
'Quarterly' obligations: compute next quarter-end (Mar/Jun/Sep/Dec) and add the specified offset.
Monthly Obligation Regeneration
After a monthly or quarterly obligation reaches status='completed', seed-compliance-obligations must insert the NEXT cycle's obligation row (same rule_id, new due_date). Guard: do NOT insert a duplicate row where (user_id, rule_id, due_date) already exists. This ensures the compliance calendar always shows the next upcoming obligation.
19. Confused Founder Onboarding
Flow
Step 1: Situation multi-select. Options: Just starting out / Need to hire / Taking payments / Selling food or beverages / Importing or exporting / Have investors / Protect my brand / Need to file taxes / Regulated industry.
Step 2: Business structure. Sole Prop / Partnership / Pvt Ltd / LLP / Not yet registered.
Step 3: State (dropdown).
On submit: get-recommendations. Matches situation_tags[] against active service_packages. Returns up to 5 services ranked by urgency_score DESC. Each card shows one-line reason.
Skippable (goes to home with empty recommendations). Non-skippable banner for first 3 days post-registration.
Intent-Based Search
search-services queries: name ilike '%query%' OR short_description ilike '%query%' OR EXISTS (SELECT 1 FROM unnest(situation_tags) tag WHERE tag ilike '%query%').
Results ranked: exact name match first, then short_description match, then situation_tag match.
Minimum 2 characters to trigger. 300ms debounce. Public endpoint (no auth required). Rate limit: 60 req/IP/min.
20. Auto-Assign Algorithm
// Three-tier geo-matching
let pro = await findAvailablePro({ service_package_id, city: order.city })
if (!pro) pro = await findAvailablePro({ service_package_id, state: order.state })
if (!pro) pro = await findAvailablePro({ service_package_id })  // national
if (!pro) { createWaitlistedOrder(order); return }
// Within matching pool, sort by:
// 1. Pro user priority: if is_pro_user, prefer pros with >2 headroom
// 2. preferred_professional_id match (returning user routing)
// 3. last_assigned_at ASC (least recently used — round-robin fairness)
Professionals must have is_available=true AND on_leave_until < today AND current_active_orders < max_concurrent_orders to be eligible.
last_assigned_at on professionals updated on every assignment.
21. SLA & Disputes
SLA Enforcement
check-sla-alerts cron (daily 9am): finds order_stage_history rows where stage_due_date < now AND completed_at IS NULL.
First breach: sla_alerts row created. apply-strike called. Professional push: 'Stage overdue on order [N].'
T+48h: admin email. professional_strike_applied=true prevents duplicate strikes on same stage.
Retainer onboarding SLA: 5 working days from retainer_subscriptions.started_at. Same alert mechanism.
Dispute Resolution States
Resolution
User
Professional
Compliance Obligation
resolved_no_refund
No refund. See details.
Payout released.
No change.
resolved_refund
Refund in 5-7 days.
No payout.
If retainer: reverts to overdue for that period.
resolved_partial
Partial refund of ₹X.
Partial payout.
Admin judgement — manual if needed.
appeal_resolved
Final. No further appeal.
Final.
Same as original resolution.
22. Edge Functions — Complete List (65)
SECURITY — Internal Functions: All functions marked "Internal" below MUST validate the service role key as the FIRST operation. Check: if (req.headers.get('Authorization') !== `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`) return new Response('Unauthorized', { status: 401 }). This is a single string comparison — negligible performance cost. Internal functions are called only by other edge functions or crons, never by client apps. Without this check, any external caller could invoke them directly.
Auth
Function
Trigger
Notes
send-otp
HTTP POST
Rate limiting via otp_rate_limits (max 5/hr, 3/10min). MSG91.
verify-otp
HTTP POST
Returns JWT on success. Dev bypass: 000000.
register-fcm-token
HTTP POST (auth)
Updates users.fcm_token ONLY. USER APP (React Native) ONLY. Professionals use register-web-push. Call on every user app launch immediately after auth.
register-web-push
HTTP POST (auth)
PROFESSIONAL WEB PANEL ONLY. Body: { subscription: PushSubscriptionJSON } from browser Push API. Stores in professionals.web_push_subscription (JSONB). Called after user grants Web Push permission at pro.ollvy.com. On logout: sets to NULL. See Section 15 for full spec.
Payments
Function
Trigger
Notes
create-razorpay-order
HTTP POST (auth)
Accepts servicePackageId OR quoteRequestId. Applies Pro 5% discount. Snapshots city. Validates promo scope.
razorpay-webhook
Webhook (Orders URL)
payment.captured: auto-assign, create chat, generate-invoice, notify. Snapshots city.
create-razorpay-subscription
HTTP POST (auth)
Validates tier group routing. Checks Pro trial eligibility. Snapshots monthly_price_paisa.
retainer-billing-webhook
Webhook (Subscriptions URL)
subscription.charged: create child order, reuse/create chat_conversation, generate-invoice. payment_failed: set payment_paused=true. cancelled: sync obligations.
pro-subscription-webhook
Webhook (Pro Subscriptions URL)
subscription.charged: clear pro_grace_start. payment_failed: set pro_grace_start=now.
Professional + Payouts
Function
Trigger
Notes
approve-professional
HTTP POST (admin)
Set status=approved. Push + welcome email to professional.
reject-professional
HTTP POST (admin)
Set status=rejected with reason. Push to professional.
suspend-professional
HTTP POST (admin)
Set status=suspended. Fire replace-retainer-professional for all active retainers.
apply-strike
Internal (from check-sla-alerts)
Increment strike_count. Admin alert at 3. Auto-suspend at 5. First-breach-only guard.
save-bank-details
HTTP POST (auth, professional)
Create Razorpay Contact + Fund Account. Upsert professional_bank_accounts.
razorpay-payout
HTTP POST (admin)
Weekly batch. Gate: requires razorpay_fund_account_id. Admin banner if missing.
update-profile-photo
HTTP POST (auth)
Upload to /avatars bucket.
upload-certification-doc
HTTP POST (auth, professional)
Upload to /certifications bucket. Admin must verify.
Orders
Function
Trigger
Notes
auto-assign-professional
Internal (from webhook)
3-tier geo-match. Pro priority. Round-robin fairness via last_assigned_at.
advance-stage
HTTP POST (auth, professional)
Logs stage. If final stage: complete order, create payout, update obligation, recommendations, feedback check. Blocked if payment_paused=true.
generate-invoice
Internal
CGST/SGST vs IGST from OLLVY_GST_STATE env var. PDF to /invoices/. Send push.
get-invoice-url
HTTP GET (auth)
RLS check (user owns invoice). Returns 60-min signed URL.
open-dispute
HTTP POST (auth)
Sets payout status=held. Admin notified (email + banner).
resolve-dispute
HTTP POST (admin)
If refund + retainer: reverts compliance obligation. Creates system chat message.
request-document
HTTP POST (auth, professional)
Creates document_requests row. Notifies user.
parse-document
DB trigger
v10: skeleton only. Sets doc_type, returns. parsed_data=NULL until v11.
submit-govt-fee-reimbursement — Full Specification
Function
Trigger
Spec
submit-govt-fee-reimbursement
HTTP POST (auth, professional)
Body: { order_id, govt_fees_paid_paisa, receipt_storage_path }. Validations: (1) professional must own the order. (2) order.status must be in_progress. (3) service must have price_govt_fees_paisa > 0 (incorporation-type only). (4) govt_fees_paid_paisa must be > 0 and <= 500000 (Rs 5,000 cap — flag for admin review above cap). (5) receipt_storage_path must be a valid path in the /documents/ bucket. On success: sets orders.govt_fees_paid_paisa and orders.govt_fee_receipt_path. Approval: automatic — no admin approval required for amounts <= Rs 5,000. For amounts > Rs 5,000: sets orders.govt_fee_reimbursement_status = pending_review and fires send-admin-email. Payout: the govt_fees_paid_paisa amount is added to the professional’s next Monday payout batch as a separate line item (type=govt_fee_reimbursement) in the payouts table — it is NOT included in the platform fee calculation. Idempotency: calling again on the same order_id overwrites the previous values (professional can correct a wrong amount before payout batch runs).
Schema additions required:
orders.govt_fees_paid_paisa INT NULLABLE — amount professional paid to government.
orders.govt_fee_receipt_path TEXT NULLABLE — storage path to uploaded receipt.
orders.govt_fee_reimbursement_status TEXT DEFAULT 'auto_approved' — values: auto_approved | pending_review | admin_approved | admin_rejected.
payouts.type — add 'govt_fee_reimbursement' as an allowed enum value alongside 'order' and 'retainer_cycle'.
Professional UI (P09 addition):
The Govt Fee Reimbursement section on P09 shows only after order.status = in_progress AND service.price_govt_fees_paisa > 0. It contains: (1) numeric input labelled 'Actual govt fees paid (Rs)' with helper text 'Enter the exact amount paid to the government portal'. (2) File upload button labelled 'Upload receipt (PDF or image, max 5 MB)'. (3) Submit button — disabled until both fields are filled. On success: section collapses and shows 'Rs X,XXX reimbursement recorded. Included in next Monday payout.' On admin-review flag: shows 'Amount flagged for admin review. You will be notified once approved.'
Retainer Engine
Function
Trigger
Notes
pause-retainer
HTTP POST (auth)
Check pause_count < 2. Razorpay pause API. Set pause_start_date.
resume-retainer
HTTP POST (auth) + cron
Manual or auto (check-retainer-pauses). Razorpay resume API.
cancel-retainer
HTTP POST (auth)
If is_trial_active: immediate cancel. Else: effective end of cycle. sync-retainer-obligations.
change-retainer-tier
HTTP POST (auth)
Cancel Razorpay sub. Create new at new price. Preserve assigned_professional_id. Snapshot new monthly_price_paisa.
replace-retainer-professional
Internal
Fired on professional suspension. Find next best pro. If none: auto-pause (no count deducted). Admin alerted.
sync-retainer-obligations
Edge function
On retainer start: covered_by_retainer. On cancel: revert to upcoming/due_soon/overdue.
create-retainer-orders
Cron: 25th 9am IST
Pre-create next month's orders for active retainers. Pro workload visibility.
send-retainer-reminders
Cron: 18th 8am IST
Billing advance notification (7 days before) to all active retainers.
check-retainer-pauses
Cron: daily 11:30am IST
Auto-resume retainers where pause_start_date > 1 month ago.
Discovery + Compliance
Function
Trigger
Notes
search-services
HTTP GET (public)
Queries name + short_description + situation_tags[]. Public endpoint. No sensitive fields in public response.
get-recommendations
HTTP POST
Matches situations to situation_tags[]. Ranks by urgency_score DESC.
generate-recommendations
DB trigger (order completed)
Post-completion upsell logic. Inserts user_service_recommendations.
create-quote-request
HTTP POST (auth)
Inserts quote_requests. expires_at set by confirm-quote, not here.
confirm-quote
HTTP POST (admin)
Sets confirmed prices + expires_at=+48h.
seed-compliance-obligations
HTTP POST (auth) + internal
Fires when profile_completeness_score crosses 60.
send-compliance-reminders
Cron: 8am daily
Pro users only: push + SMS at 30/7/1 days before due_date.
update-health-scores
Cron: 7am daily
Recomputes compliance_health_score for all users.
backfill-compliance-obligations
HTTP POST (admin)
Run after rules changes to update existing users.
Admin + Notifications
Function
Trigger
Notes
send-notification
Internal
Checks fcm_token for users (FCM). Checks web_push_subscription for professionals (Web Push). Graceful null handling for both. SMS fallback for SMS_ALLOWED_EVENTS if push unavailable.
send-admin-email
Internal
Reads admin_email_recipients from app_settings. Sends via Resend/SendGrid.
check-sla-alerts
Cron: 9am daily
Order stage SLA + retainer onboarding SLA. Calls apply-strike on first breach.
check-waitlist
Cron: 11am daily
Retry auto-assign for waitlisted orders. Alert admin + user if > 48h.
check-dispute-sla
Cron: 10am daily
Alert admin on disputes approaching auto-refund deadline.
check-capacity
Cron: 6am daily
City × service load. Banner at 80%. Email at 95%.
check-expired-quotes
Cron: 9:30am daily
Set status=expired on quotes where expires_at < now. Notify user.
check-pro-grace-period
Cron: 6:30am daily
Push nudges at day 1/5/7. Revert to free at day 8.
check-cert-expiry
Cron: 8:30am daily
Warn professional at 30/14/7 days. Auto-unverify expired certs.
check-leave-returns
Cron: 6am daily
Auto-restore is_available=true for professionals past on_leave_until.
resolve-promo
Internal
Validates promo: scope, expiry, per-user limit, min order. Returns discount paisa.
Additional Edge Functions and Cron Jobs
The following functions were referenced throughout the spec but missing from the table above. All are required for a complete build.
Function
Trigger
Notes
get-digest-url
HTTP GET (auth)
Input: retainer_digest_id. RLS check: retainer_subscription.user_id must match JWT user_id OR professional_id. Returns 60-min signed URL for the PDF stored at /documents/{retainer_subscription_id}/digests/{billing_period}.pdf. Same pattern as get-invoice-url.
get-engagement-letter-url
HTTP GET (auth)
Input: order_id. RLS check: order.user_id must match JWT user_id. Returns 60-min signed URL for the PDF stored at /documents/{order_id}/engagement_letter.pdf. Same pattern as get-invoice-url. Returns 404 if engagement_letters row does not exist for this order.
reapply-professional
HTTP POST (auth, professional)
Guard: professionals.status must be rejected AND (reapply_after_date IS NULL OR now() >= reapply_after_date). On success: sets status = pending, clears rejection_reason, clears reapply_after_date, resets onboarding_step = 0 so professional goes through full onboarding again. Sends admin_notification: New reapplication from [professional name]. Rate limit: max 3 reapplications per professional lifetime (tracked via reapplication_count column).
update-professional-profile
HTTP POST (auth, professional)
Body: { step: 1|2|3|4, data: {...} }. Step 1 (P03 Basics): full_name, display_name, bio, years_experience, profession_type. Step 2 (P04 Service Areas): service_areas[] (array of service_package_ids), cities[] (array of city strings). Step 3 (P05 Certifications): list of {cert_type, cert_number, issued_by, issued_date, expiry_date}. Step 4 (P15 Profile Edit, post-onboarding): same as steps 1+2. Validates each field per step. On success: updates professionals row, sets onboarding_step = max(current, step). Returns updated professional object.
update-digest-key-numbers
HTTP POST (auth, professional)
Body: { retainer_subscription_id, billing_period (YYYY-MM), key_numbers: JSONB }. Guard: professional must own this retainer. key_numbers schema varies by service type (GST: {liability_paisa, input_credit_paisa, net_payable_paisa}; Payroll: {employee_count, total_ctc_paisa}; TDS: {amount_deducted_paisa, challans_filed}; Generic: {summary_text}). Upserts into retainer_digests.key_numbers. Returns updated digest row. If digest PDF has already been generated for this period, regenerate it (call generate-retainer-digest).
check-application-sla
Cron: 10:30am IST daily
Finds professional_applications WHERE status = submitted AND submitted_at < now() - interval 72 hours. For each: creates admin_notification row (type=application_sla_breach, body='[N] professional applications have been pending over 72 hours'). Deduplication: only create one notification per breach, not one per day. Does not auto-reject.
activate-service
HTTP POST (admin)
Body: { service_package_id, is_active: bool }. Sets service_packages.is_active. If deactivating: checks for active orders on this service — if found, returns error ACTIVE_ORDERS_EXIST with count. If no active orders: deactivates. If activating: sets is_active = true immediately. Admin audit log entry written on every call.
force-assign-order
HTTP POST (admin)
Body: { order_id, professional_id }. Validates: order.status must be waitlisted. Professional must be active (status=approved, is_available=true). Bypasses capacity check and geo-match. Sets order.professional_id, order.status = in_progress, order.force_assigned = true, order.assigned_at = now(). Creates chat_conversation if not exists. Sends push to both user (order started) and professional (new assignment). Admin audit log entry written.
apply-referral-credit
Internal (from razorpay-webhook)
Called on payment.captured for a user whose users.referral_code_used IS NOT NULL AND first order ever (count of prior completed orders = 0). Looks up referrer by referral_code. Self-referral block: abort if referrer phone = referee phone OR referrer FCM token = referee FCM token at signup. On pass: inserts referral_credits row (referrer_user_id, referee_user_id, credit_paisa = 50000, status = pending). Credit becomes available after referee order completes (advance-stage final stage calls this function again to flip status = available and increment referrer referral_credit_balance_paisa). Fires admin_notification for suspected self-referral attempts.
redeem-referral-credit
Internal (from create-razorpay-order)
Body: { user_id, order_total_paisa }. Checks users.referral_credit_balance_paisa > 0. Applies up to min(balance, order_total_paisa) as discount. Updates users.referral_credit_balance_paisa -= amount_used. Inserts referral_credits row with type = redemption. Returns { discount_paisa }. Called before promo code discount is applied. Combined referral + promo cannot reduce order below govt_fees_paisa + GST floor.
check-expired-referrals
Cron: 11:30pm IST daily
Finds referral_credits rows WHERE status = pending AND created_at < now() - interval 90 days. Marks status = expired. Does NOT reduce referral_credit_balance_paisa (pending credits are not yet in balance). Sends push to referrer: 'Your referral credit for [name] expired as their first order was not completed.'
process-payouts
Cron: every Monday 9:00am IST
For each professional with payouts WHERE status = pending AND amount_total_paisa >= 50000 (Rs 500 min): (1) Check razorpay_fund_account_id exists on professional_bank_accounts — if missing, skip and fire send-admin-email (professional_id, reason=missing_fund_account). (2) Payout split: professional_amount = amount_total_paisa - round(amount_total_paisa * platform_fee_percent / 100) from app_settings. (3) Call Razorpay Transfer API with razorpay_fund_account_id, professional_amount. (4) On API success: set payout.status = paid, payout.paid_at = now(), payout.razorpay_payout_id = response.id. (5) On API failure: set payout.status = failed, log error. (6) Govt fee reimbursement line items (type=govt_fee_reimbursement): transfer full amount with no platform fee deduction. (7) Amounts below Rs 500: leave status=pending, roll into next Monday. Sends weekly earnings summary push to each professional paid.
generate-retainer-digests
Cron: 26th of month 10:15am IST
For each retainer_subscription WHERE status = active: fetches all completed child orders for the billing period, key_numbers from retainer_digests table (if professional has entered them via P12), and order_stage_history for proof of work. Builds PDF using @react-pdf/renderer. PDF sections: header (period, service, professional name), key numbers table, stages completed with dates, documents delivered (list from documents table), compliance summary. Stores at /documents/{retainer_subscription_id}/digests/{YYYY-MM}.pdf. Upserts retainer_digests row (retainer_subscription_id, billing_period, pdf_path, generated_at). Sends push to user: 'Your [Service] monthly report is ready.'
update-analytics-cache
Cron: 2:00am IST daily
Computes and upserts analytics_cache table with pre-aggregated metrics: MRR (sum of active retainer monthly_price_paisa), active_orders_count, completed_orders_7d, completed_orders_30d, sla_compliance_rate_30d (orders completed within SLA / total completed), churn_count_30d (retainers cancelled), avg_rating_30d, city_breakdown JSONB, service_breakdown JSONB. Used by admin /analytics page to avoid expensive real-time aggregations. Cache is invalidated and rebuilt nightly.
update-platform-stats
Cron: 11:45pm IST daily
Updates app_settings key=platform_stats with JSONB: {users_count, professionals_count, services_count, cities_served, orders_completed_total}. Read by get-public-profile and public pages (ollvy.com) to show social proof numbers. Separate from analytics_cache — this is public-facing, analytics_cache is admin-only.
reset-fraud-counters
Cron: 1st of month 3:00am IST
Resets fraud_signals.monthly_count = 0 for all users. Resets users.referral_credit_30d_count = 0. These counters are used for fraud detection rate limiting (e.g. max 5 promo codes per user per month). Does NOT clear fraud_review_queue rows — those persist for audit.
reset-pause-counters
Cron: January 1st 2:00am IST annually
Resets retainer_subscriptions.pause_count = 0 for all active retainers. Pause count is a per-year limit (max 2 pauses per year). Annual reset allows users to pause again in the new year.
send-renewal-reminders
Cron: 8:15am IST daily
Finds service_packages with annual renewal tracking (e.g. Shops and Establishments, FSSAI, Trademark). Queries user_service_recommendations for completed orders on these services where completed_at is approaching the 1-year mark. Sends push at 60/30/7 days before anniversary: 'Your [Service] is due for renewal. Book now to stay compliant.'
otp-rate-limit-cleanup
Cron: 3:30am IST daily
Deletes otp_rate_limits rows WHERE created_at < now() - interval 24 hours. Keeps the table small. No business logic — purely housekeeping.
check-appeal-sla
Cron: 11:15am IST daily
Finds strike_appeals (from submit-strike-appeal calls) WHERE status = pending AND submitted_at < now() - interval 48 hours. For each: auto-accept the appeal (remove the strike, decrement strike_count) and send professional push: 'Your appeal was automatically accepted due to admin inactivity.' Creates admin_notification: '[N] strike appeals were auto-resolved due to SLA breach.'
23. Complete Cron Schedule
All times IST (UTC+5:30). No two crons at the same minute. Register in Supabase Dashboard → Edge Functions → Schedule.
Time (IST)
Function
Frequency
6:00am
check-leave-returns
Daily
6:30am
check-pro-grace-period
Daily
7:00am
update-health-scores
Daily
8:00am
send-compliance-reminders
Daily
8:30am
check-cert-expiry
Daily
9:00am
check-sla-alerts
Daily
9:30am
check-expired-quotes
Daily
10:00am
check-dispute-sla
Daily
11:00am
check-waitlist
Daily
11:30am
check-retainer-pauses
Daily
12:00pm
otp-rate-limit-cleanup
Daily
18th of month, 8:00am
send-retainer-reminders
Monthly
25th of month, 9:00am
create-retainer-orders
Monthly
2:00am
check-expired-referrals
Daily
2:00pm
send-renewal-reminders
Daily
10:30am
check-application-sla
Daily
11:45pm
update-platform-stats
Daily
26th of month, 10:15am
generate-retainer-digests
Monthly
7:05am
update-analytics-cache
Daily
9:00am (Mondays)
process-payouts
Weekly
11:15am
check-appeal-sla
Daily
1st of month, 3:00am
reset-fraud-counters
Monthly
Jan 1, 2:00am
reset-pause-counters
Annual
24. Schema Additions Summary
All new columns added across v8/v9/v10. Carry these into 001_initial_schema.sql.
Table
Column
Type
Default
Source Version
users
city
text
nullable
v9
users
fcm_token
text
nullable
v10
users
pro_grace_start
timestamptz
nullable
v10
users
profile_completeness_score
int
0
v10
orders
city
text
nullable (snapshot from user.city)
v9
orders
chat_conversation_id
uuid FK
nullable
v9
orders
payment_paused
bool
false
v9
orders
pro_discount_paisa_snapshot
int
0
v10
chat_conversations
retainer_subscription_id
uuid FK
nullable
v9
chat_messages
sender_id
uuid
nullable (was NOT NULL)
v10
service_packages
urgency_score
int
50
v9
feedback
retainer_subscription_id
uuid FK
nullable
v9
professionals
last_assigned_at
timestamptz
nullable
v10
professionals
fcm_token
text
nullable
v10
professionals
service_areas
uuid[]
'{}' (stores service_package_ids)
v10 correction
professional_certifications
expiry_date
date
nullable
v10
professional_availability
city
text
required
v9
retainer_subscriptions
monthly_price_paisa
int
required
v10
retainer_subscriptions
first_billing_date
date
nullable
v10
retainer_subscriptions
pause_start_date
timestamptz
nullable
v9
retainer_subscriptions
is_trial_active
bool
false
v9
quote_requests
expires_at
timestamptz
nullable (set by confirm-quote)
v9
promo_codes
applicable_to
enum
one_time_only
v10
promo_codes
service_package_ids
uuid[]
nullable
v10
New Tables
Table
Purpose
Version
professional_bank_accounts
Payout bank details + Razorpay fund account IDs
v10
admin_notifications
In-app admin alert banners
v9
app_settings
Admin-configurable key-value settings (email list, fee %, etc.)
v10
service_tier_groups
Links sibling tier packages for tier picker UI
v8
New Columns — v20
Add these columns to the corresponding tables in 001_initial_schema.sql.
Table
Column
Type
Default
Version
orders
govt_fees_paid_paisa
int
nullable
v20
orders
govt_fee_receipt_path
text
nullable
v20
orders
govt_fee_reimbursement_status
text
default 'auto_approved'
v20
orders
promo_code_used
text
nullable
v20
orders
force_assigned
bool
default false
v20
orders
price_source
text
default 'base'
v20
users
referral_code
text
nullable, unique
v20
users
referral_code_used
text
nullable
v20
users
referral_credit_balance_paisa
int
default 0
v20
users
referral_credit_30d_count
int
default 0
v20
users
public_profile_enabled
bool
default true
v20
professionals
reapplication_count
int
default 0
v20
professionals
reapply_after_date
date
nullable
v20
professionals
web_push_subscription
jsonb
nullable
v20
retainer_subscriptions
pause_count
int
default 0
v20
compliance_obligations
not_applicable_reason
text
nullable
v20
New Tables — v20
Add these tables to 001_initial_schema.sql. Create RLS policies matching the pattern of existing tables with same access scope (user-owned data = user RLS; admin data = service role only).
Table
Schema
Version
retainer_digests
retainer_subscription_id FK, billing_period (YYYY-MM text), pdf_path text, key_numbers JSONB nullable, generated_at timestamptz, compliance_status text default 'on_track' (on_track | at_risk | overdue).
v20
fraud_review_queue
Unified fraud review table — replaces both fraud_review_queue and fraud_signals references. Columns: id, user_id FK nullable, professional_id FK nullable, type (promo_abuse | self_referral | payment_fraud | document_fraud | suspicious_activity), detail JSONB, status (pending | reviewed | dismissed | actioned), reviewer_notes text, reviewed_at timestamptz, reviewed_by uuid FK to admins, monthly_count int default 0, created_at.
v20
admin_audit_log
admin_id FK, action text (e.g. suspend_professional, process_refund, force_assign_order), related_table text, related_id uuid, payload JSONB (before/after values), created_at. Written by every admin-authed edge function via a shared helper. NOT deletable via RLS.
v20
professional_applications
Separate from professionals table. id, full_name, phone, email, city, profession_type, years_experience, certifications JSONB, portfolio_url text, referral_source text, status (submitted | approved | rejected | withdrawn), submitted_at, reviewed_at, reviewer_id FK, rejection_reason text, reapply_after_date date. On approval: creates professionals row and sends credentials.
v20
processed_webhook_events
Idempotency store for Razorpay webhooks. razorpay_event_id text PK, event_type text, processed_at timestamptz. CREATE UNIQUE INDEX idx_processed_webhook_events_razorpay_event_id ON processed_webhook_events (razorpay_event_id). Every webhook handler checks this table first — if event_id exists, return 200 immediately without processing.
v20
analytics_cache
cache_date date PK, mrr_paisa bigint, active_orders_count int, completed_orders_7d int, completed_orders_30d int, sla_compliance_rate_30d numeric(5,2), churn_count_30d int, avg_rating_30d numeric(3,2), city_breakdown JSONB, service_breakdown JSONB, updated_at timestamptz. Rebuilt nightly by update-analytics-cache cron. Admin /analytics reads from here.
v20
referral_credits
id, referrer_user_id FK, referee_user_id FK, credit_paisa int, type (earned | redemption | expiry | reversal), status (pending | available | redeemed | expired), created_at, available_at timestamptz nullable, redeemed_at timestamptz nullable. Unique constraint on (referrer_user_id, referee_user_id, type=earned) to prevent double-crediting.
v20
service_state_pricing
service_package_id FK, state text, price_base_paisa int, price_govt_fees_paisa int, notes text nullable. PK: (service_package_id, state). Populated by admin via /services/builder Step 6 (state pricing overrides). Used by create-razorpay-order: if row exists for user.state, override base prices.
v20
engagement_letters
order_id FK PK (one letter per order), pdf_path text (stored at /documents/{order_id}/engagement_letter.pdf), generated_at timestamptz, version int default 1 (increments if regenerated after rescope), scope_hash text (hash of scope_included+scope_excluded at generation time — used to detect if rescope requires regeneration). IMMUTABLE after first generation unless admin explicitly triggers regeneration.
v20
H2: service_state_pricing — Admin Builder Integration
service_packages.price_varies_by_state = true signals that state-level pricing exists. The admin Service Builder Step 6 (when price_varies_by_state is toggled on) reveals a state pricing table editor: add/remove rows for each state with custom base + govt fees. create-razorpay-order logic: SELECT * FROM service_state_pricing WHERE service_package_id = $1 AND state = $2. If row found: use its prices and set orders.price_source = 'state_override'. If not found: use service_packages base prices and set orders.price_source = 'base'.
H5: generate-engagement-letter — Missing Spec Details
PDF library: @react-pdf/renderer (same as generate-invoice). Reuse the existing PDF generation helper from generate-invoice.
Storage path: /documents/{order_id}/engagement_letter.pdf
Immutability: generate-engagement-letter is called ONCE by razorpay-webhook on payment.captured. The PDF is immutable after generation. If the service scope changes (admin edits scope_included/scope_excluded post-order), the document is NOT automatically regenerated. Only an admin can trigger regeneration via /orders/[id] admin page — this increments engagement_letters.version and overwrites the PDF.
scope_hash: computed as SHA-256(scope_included + scope_excluded) and stored in engagement_letters.scope_hash. Used to detect stale letters.
25. Build Sequence
Phase
Weeks
Contents
Pre-Build
Before Week 1
Deploy /pro landing page. Recruit 15-20 professionals in Delhi. Resolve all 14 Open Decisions (Section 26).
Phase 1
Wks 1-2
001_initial_schema.sql (all 34 tables + indexes + triggers). 002_rls_policies.sql (all table RLS policies). 003_seed.sql (32 service packages + compliance obligation rules + app_settings defaults). packages/shared types + theme.ts. send-otp + verify-otp (with rate limiting). register-fcm-token. Expo app.json configured. All .env.local files populated.
Phase 2
Wks 3-5
User app auth + confused founder onboarding. search-services. One-time order flow (create-razorpay-order, razorpay-webhook, auto-assign, advance-stage). generate-invoice + get-invoice-url. Quote request flow. save-bank-details (professional).
Phase 3
Wks 6-8
Full retainer engine: create-razorpay-subscription, retainer-billing-webhook, all retainer management functions (pause, resume, cancel, change-tier, replace-pro, sync-obligations). Professional web panel (all pages at pro.ollvy.com). Ollvy Pro subscription.
Phase 4
Wks 9-10
Compliance calendar + My Business tab (Pro-gated). update-health-scores cron. profile_completeness_score logic. seed-compliance-obligations gate.
Phase 5
Wks 11-12
SLA enforcement (check-sla-alerts, apply-strike). Capacity management. Dispute state machine (open-dispute, resolve-dispute). check-dispute-sla cron.
Phase 6
Wks 13-14
Professional profiles + certification management. Admin CMS (service builder with tier groups, situation_tags). Chat (Realtime). Documents + document_requests.
Phase 7
Wks 15-16
Promos (resolve-promo). Payouts (razorpay-payout with bank detail gate). Full notification stack (all 13 crons). Pro grace period. Admin notification system.
Phase 8
Wks 17-18
Polish. End-to-end tests. RLS verification on all tables + buckets. App Store prep for user mobile app. Deploy professional web panel to Vercel (pro.ollvy.com).
26. Open Decisions — Resolve Before Phase 1
All decisions are now resolved (v15). Items #4, #9, #13, #14 were resolved in v12-v13. Items #1, #2, #3, #5, #6, #7, #8, #10, #11, #12 were resolved in v15. Claude Code: use this section as the authoritative decision log. No further founder input needed before Phase 1.
#
Decision
Options / Notes
1
Retainer payout timing
RESOLVED: Payout on order completion. Minimum Rs 500 before Razorpay Route transfer. Amounts below Rs 500 accumulate in professionals.pending_payout_paisa and roll into next Monday batch that crosses threshold. New column: professionals.pending_payout_paisa int default 0.
2
Mid-cycle cancellation
RESOLVED: Current month completes normally. No pro-rata credit. Professional is paid for the current cycle. Cancellation takes effect from next billing cycle.
3
OTP fallback
RESOLVED: Hard fail with retry. Message: "OTP delivery failed. Please try again in a few minutes." No secondary provider at launch. Rationale: adding Firebase Phone Auth or Twilio adds vendor complexity. MSG91 SLA sufficient for launch. Revisit when daily OTP volume exceeds 1,000.
4
Quote request SLA
RESOLVED: Auto-escalate to second admin. At hour 4: SMS all admin_email_recipients (uses same list as admin emails): 'Quote request [ID] for [service] has been pending for 4 hours. Please review at /quotes/[id].' Quote remains pending (not expired). At hour 8: second SMS escalation + admin_notification banner. At hour 12: SMS again. Quote only expires when admin actively marks it expired or 48h pass with no action. New column: quotes.escalated_at timestamptz (set at first 4h escalation). New cron: check-quote-escalations at 4:15pm daily (checks all pending quotes >4h old and not yet escalated).
5
Pro grace period length
RESOLVED: 7 days for monthly Pro plan. 14 days for annual Pro plan (already specced in Section 31). No change to spec.
6
Dispute auto-refund days
RESOLVED: 7 days. app_settings key='dispute_auto_refund_days' = 7. If admin takes no action within 7 days of dispute opened: auto-refund fires and order status = refunded. Professional payout held until dispute resolves.
7
Initial filter buckets
RESOLVED: Six buckets confirmed: (1) Registrations, (2) Licensing, (3) Monthly Compliance, (4) Tax Filings, (5) Payroll, (6) Legal. Seeded in 001_initial_schema.sql under service_categories table.
8
Stage SLA weights
RESOLVED: Default sla_working_days per stage type: Document Collection = 3, Govt Portal Filing = 2, Approval Awaited (govt processing) = 15 (flagged wait_for_govt=true, not counted against professional SLA), Certificate Delivery = 1. Custom per-service overrides set in admin Service Builder Step 4.
9
Govt fee billing for incorporation
RESOLVED: The CA/lawyer pays the government directly from their own funds. Ollvy does NOT collect govt fees from the user at checkout. orders.govt_fees_paid_paisa (new column, nullable int) records what the professional paid on the user's behalf — populated by the professional via a new 'Record Govt Fee Payment' field on their order detail screen (P08). This amount is shown as a line item in the engagement letter and the retainer digest for transparency, but is NOT included in the Razorpay charge. Admin can see this field in /orders/[id] for audit purposes.
10
Payout batch frequency
RESOLVED: Every Monday. process-payouts cron fires 9:00am IST every Monday. Professionals see "Next payout: Monday [date]" on P13 Earnings page.
11
Min payout threshold
RESOLVED: Rs 500 minimum before Razorpay Route transfer. Amounts below Rs 500 accumulate and roll into next Monday batch.
12
Retainer pause calendar year vs subscription year
RESOLVED: Calendar year reset (Jan 1). Max 2 pauses per Jan 1 - Dec 31 window regardless of subscription start date. Counter resets to 0 on Jan 1 via reset-pause-counters cron (already in cron schedule).
13
Professional suspension — active one-time order handling
RESOLVED: Auto-reassign all in_progress one-time orders. When suspend-professional fires: (1) iterate all orders with status=in_progress for this professional, (2) call auto-assign-professional for each (standard algorithm, Pro priority, geo matching), (3) if no available professional found for an order, set that order's status=waitlisted and alert admin. Retainers: existing replace-retainer-professional logic (already specced). User receives generic push for each reassigned order: 'Your specialist for [service] has changed. Your order continues without interruption.' No professional name ever shown.
14
Shareable business card (My Business tab)
RESOLVED: URL-based public profile at ollvy.com/b/[business_id]. See Section 36 (new) for full specification. Summary: static Next.js ISR page (revalidate=3600), shows business_name, business_type, state, city, compliance_health_score badge, services active (active retainers + completed one-time orders as 'Trusted with X'). NO financial data, NO order details, NO personal contact info. U22 My Business tab: 'Share My Business Profile' button generates the URL and calls the native share sheet. business_id = users.id (UUID).
27. Verification Checklist — 60+ Checks
Run all checks before calling any phase complete. No check may be skipped. Checks are ordered by system area, not build order.
Payments + Webhooks
Webhook routing: send a test payment.captured event. Verify it hits razorpay-webhook only. Send a test subscription.charged event. Verify it hits retainer-billing-webhook only.
Quote price bridge: book Alcohol License. Admin confirms quote at ₹60,000. User accepts. Verify Razorpay order created at ₹60,000 (not service_packages.price_base_paisa). Invoice shows confirmed prices.
Pro discount: Pro user books a ₹8,999 service. Verify Razorpay order created at ₹8,549 (₹450 off). Not ₹8,999.
Pro first retainer free: Pro user with no prior retainers starts a retainer. Verify Razorpay subscription has trial_period=30. retainer_subscriptions.is_trial_active=true. No immediate charge.
Trial cancellation: cancel retainer while is_trial_active=true. Verify immediate cancellation (not end-of-cycle). No charge created.
Push Notifications
FCM tokens: log out and log back in on user app. Verify users.fcm_token updated. Trigger an order assignment. Verify user receives push. Repeat for professional web panel (pro.ollvy.com): Web Push subscription stored, order assigned triggers Web Push to browser.
Null token guard: set users.fcm_token=NULL. Trigger a notification. Verify send-notification exits silently (no crash, no error).
Pro grace period: set pro_grace_start to 8 days ago. Run check-pro-grace-period. Verify subscription_tier='free', pro_grace_start=NULL, push sent.
Retainers
Chat persistence: start a retainer. Complete 3 billing cycles. Verify ONE chat_conversation row. All 3 cycle orders have the same chat_conversation_id.
Payment failure: simulate subscription.payment_failed. Verify: user push, professional push, admin banner, child order payment_paused=true, Advance Stage disabled.
Payment recovery: simulate subscription.charged after failure. Verify payment_paused=false, Advance Stage re-enabled, professional notified.
Billing date anchor: complete onboarding on the 28th. Verify first_billing_date=25th of NEXT month. Complete onboarding on 10th. Verify first_billing_date=25th of THIS month.
Pause limit: pause a retainer twice. Third attempt: verify app shows 'Both pauses used this year' message (no API call made).
Tier change: change GST filing from ₹2,999 to ₹4,999 tier. Verify old Razorpay subscription cancelled. New created. assigned_professional_id unchanged. monthly_price_paisa updated. Effective from next cycle.
Professional replacement on suspension: suspend a professional with 2 active retainers. Verify both retainers get new professionals. Users receive generic push (no name).
Compliance Calendar
Profile completeness gate: user with only state set (score=20). Verify calendar shows 'Complete profile' CTA. Add business_type+gst_registered+has_employees (score=65). Verify seed-compliance-obligations fires.
covered_by_retainer: start a GST Monthly Filing retainer. Verify GST filing compliance_obligation flips to covered_by_retainer. Cancel retainer. Verify obligation reverts to overdue.
Dispute refund on retainer: complete a retainer cycle order. Raise dispute. Resolve as refund. Verify compliance_obligation for that billing period reverts to overdue. User notified.
Storage + Invoices
Storage RLS: create a document for user A's order. Log in as user B. Attempt to GET the document URL. Verify 403 Forbidden.
Invoice signed URL: user taps Download Invoice. Verify get-invoice-url is called (not a direct Storage URL). Verify URL expires after 60 minutes.
Invoice GST: user in Delhi (same state as Ollvy). Verify invoice shows CGST 9% + SGST 9%. User in Mumbai. Verify IGST 18%.
Professional Lifecycle
Professional approval: admin approves pending professional. Verify status=approved, push sent, welcome email sent.
Strike accumulation: set a stage_due_date to 3 days ago. Run check-sla-alerts. Verify strike_count incremented by 1. Run again tomorrow. Verify NOT incremented again (first-breach guard).
Auto-suspend at strike 5: set strike_count=4, trigger SLA breach. Verify status=suspended, replace-retainer-professional fires for all retainers.
Bank detail gate: professional with no bank details has a completed order. Admin triggers payout batch. Verify that professional's payout is SKIPPED (not crashed). Admin banner appears.
Cert expiry: set expiry_date=25 days from now. Run check-cert-expiry. Verify push sent at exactly 30 days. At expiry: verify verified=false.
Auto-Assign
City-first matching: set user.city='Mumbai'. Create order. Verify only Mumbai professionals considered in first pass.
State fallback: no professionals in Mumbai. Verify state-level professionals considered in second pass.
National fallback: no state-level professionals. Verify any professional considered in third pass.
Pro priority: mark user as Pro. Verify professional with current_active_orders < (max-2) is preferred.
Admin
Admin notification routing: open a dispute. Verify admin sees email AND banner (NOT FCM push). Submit a quote request. Verify admin sees in-app badge ONLY (no email).
Admin chat on disputes: open dispute on an order. Admin navigates to /disputes/[id] Chat History tab. Verify full conversation visible. Verify no send input shown.
MRR calculation: 3 retainers at ₹2,999 + 1 at ₹4,999 + 10 Pro users. Verify admin dashboard MRR = ₹24,986.
Search + Discovery
Intent search: type 'restaurant' in home search. Verify FSSAI + Eating House License in results (via situation_tags).
Unauthenticated search: call search-services with no auth header. Verify response has no tier_group_id, urgency_score, or internal fields. Only is_active=true packages.
Urgency ranking: set GST Registration urgency_score=95, Trademark=65. Confused founder selects 'just_starting_out' + 'want_to_protect_brand'. Verify GST Registration appears before Trademark in recommendations.
Notifications + Cronscheck
All 23 crons: verify each is registered in Supabase dashboard with exact IST time. No two at same minute.
Feedback cooldown: complete retainer cycle 1. User rates. Complete cycle 2 at month 3. Verify NO feedback prompt. Complete cycle at month 7. Verify feedback prompt shown.
Leave return: set on_leave_until=yesterday. Run check-leave-returns. Verify is_available=true, on_leave_until=NULL, push sent to professional.
28. Professional Acquisition — ollvy.com/join
Professionals are the engine. Without a spec for how a CA, lawyer, or licensing consultant discovers, evaluates, and joins Ollvy, the supply side cannot be built. This section specifies the acquisition landing page, application flow, orientation, and the professional-facing product experience that converts a qualified CA into an active order-taker. The landing page lives at ollvy.com/join. It is NOT linked from the user-facing app or the admin dashboard. It is a separate entry point.
Landing Page — apps/landing/join/ (Static Next.js, ollvy.com/join)
The join page is the top of the supply funnel. It targets practicing CAs, lawyers, company secretaries, licensing consultants, and payroll specialists in India. The page is built in apps/landing/join/ and deployed as a static Next.js export at ollvy.com/join. It is entirely separate from the user-facing product.
Page Sections (in order)
Hero: 'Grow your practice. Earn without chasing clients.' Subhead: 'Ollvy matches you with businesses that need your expertise. You do the work. We handle everything else.' CTA: 'Apply Now' → deep links to pro.ollvy.com/login with utm_source=join_page.
Earnings Transparency: 'CAs on Ollvy handling GST Monthly Filing earn ₹18,000–₹45,000/month across 6–15 clients. Retainer clients = predictable income, every 25th.' This is approximate guidance, not a guarantee. Updates quarterly from admin.
How It Works: 3-step visual. Step 1: Apply and get verified (72 hours). Step 2: Accept your first order — we match you by city and expertise. Step 3: Complete work, get paid directly to your bank account.
What Ollvy Handles: Client acquisition, payments, invoicing, GST invoices, dispute resolution. You handle: the actual work.
Testimonials: 3 professional quotes with first name + city + profession_type. Populated manually from CRM, not from the DB. Static content updated by admin.
FAQ: How are orders assigned? (Auto-matched, no bidding.) How fast do I get paid? (Weekly batch, every Monday.) Can I set my own hours? (Yes — availability toggle and leave system.) What happens if a client disputes? (Ollvy admin mediates. You are protected from unfair disputes.) Once approved, will I know what to do? (Yes — the app walks you through every step of each order with a checklist of stages. You'll receive training content in the app before your first order is assigned.)
Footer CTA: 'Apply Now' → same deep link. Also: 'Already applied? Track your application' → pro.ollvy.com/onboarding/pending.
DB: professional_applications (replaces professional_waitlist for full-funnel tracking)
Column
Type
Purpose
id
uuid PK
Primary key
name
text NOT NULL
Full name
phone
text NOT NULL
WhatsApp-reachable number. Unique.
email
text NOT NULL
Professional email
profession_type
enum (same as professionals)
ca|lawyer|cs|licensing_consultant|payroll_specialist|registered_valuer
city
text NOT NULL
Primary practice city
state
text NOT NULL
Primary state
years_experience
int NOT NULL
Years in practice
services_offered
text[] NOT NULL
Self-reported: e.g. [GST Filing, Trademark, Payroll]. Free text, admin maps to service_package_ids on approval.
monthly_capacity
int NOT NULL
How many concurrent clients can you handle? (1-20)
linkedin_url
text nullable
Optional. Admin uses for background check.
bar_council_number
text nullable
Required for lawyers. Admin validates.
icai_membership
text nullable
Required for CAs. Admin validates.
source
text default 'join_page'
join_page | referral | direct | waitlist_converted | admin_invite
referral_code_used
text nullable
If referred by existing professional
status
enum
submitted | under_review | approved | rejected | invited_to_app
admin_notes
text nullable
Internal admin notes from review. Not shown to applicant.
submitted_at
timestamptz default now()
Application submission timestamp
reviewed_at
timestamptz nullable
When admin opened the application
invited_at
timestamptz nullable
When invite SMS was sent. SLA: within 72h of submission.
Application Flow (Professional App — Screens P01–P06 extended)
P01 Join Landing (pre-auth): Professional opens app via ollvy.com/join deep link. Sees: earnings headline, 3-step how-it-works, 'Apply Now' CTA. No login required to start application.
P02 Phone Registration: Phone number → OTP verify (same send-otp / verify-otp flow). On first login, check if professionals row exists. If not → route to application form.
P03 Application Form — Part 1: name, email, profession_type (picker), city, state, years_experience. Required fields.
P04 Application Form — Part 2: services_offered (multi-select from curated list), monthly_capacity (slider 1–20), ICAI/bar council number (conditional on profession_type), LinkedIn URL (optional).
P05 Application Submitted Screen: 'Your application is under review. We'll reach you on [phone] within 72 hours.' Shows estimated timeline. Inserts professional_applications row (status=submitted). Admin notified via badge on /professionals page.
P06 Pending Approval Screen (post-admin-invite): Once admin sets status=invited_to_app and sends invite SMS, professional sees: 'You've been invited to join Ollvy. Complete your profile to start receiving orders.' Routes to full professional profile setup (existing P03–P05 onboarding screens for certifications and service areas).
Admin: /professionals/applications (new admin page)
Lists all professional_applications with status filter. Columns: name, profession_type, city, years_experience, services_offered, submitted_at, status.
Actions per row: Open full application → Review → Approve (sets status=invited_to_app, sends invite SMS via MSG91 with app download link) OR Reject (sets status=rejected, sends rejection SMS with reason).
SLA indicator: badge turns red if submitted_at > 72h ago and status=submitted.
Approved application auto-creates a professionals row (status=pending) ready for in-app onboarding completion.
Edge Functions
Function
Trigger
Notes
submit-professional-application
HTTP POST (public)
Inserts professional_applications. Rate limit: 3 submissions/phone/day to prevent spam. Notifies admin via badge.
approve-application
HTTP POST (admin)
Sets status=invited_to_app. Sends invite SMS: 'Congratulations! You've been approved to join Ollvy. Download the app: [link]'. Creates professionals row (status=pending).
reject-application
HTTP POST (admin)
Sets status=rejected. Sends SMS with rejection reason. Admin must provide reason text.
check-application-sla
Cron: 10:30am daily
Flags applications where submitted_at > 72h and status=submitted. Creates admin_notification banner. Does NOT auto-reject.
New Cron
10:30am IST daily — check-application-sla: Finds professional_applications where submitted_at > 72h AND status=submitted. Creates admin_notification banner: '[N] professional applications past 72h SLA.'
Monorepo Addition
apps/
  └── landing/
        ├── /              # User-facing home (future)
        ├── /pro           # Professional interest page (existing)
        ├── /join          # Professional acquisition page (NEW — ollvy.com/join)
        └── /services/[slug]  # Public SEO service pages (NEW — Section 32)
29. Public Trust Layer — Ratings & Social Proof
Feedback is currently collected and buried. A 1–5 star rating after every order is the most valuable trust signal Ollvy generates. Aggregate ratings on service cards are the difference between a cold visitor converting and bouncing. Professionals remain invisible — no individual rating is ever shown. Only service-level aggregates are public.
DB Changes
New column on service_packages
Column
Type
Purpose
avg_rating
numeric(3,2) default 0.00
Rolling average of all feedback.rating values for orders on this service_package_id. Updated by DB trigger on feedback INSERT.
total_ratings_count
int default 0
Count of feedback rows for this service. Updated by same trigger.
total_orders_count
int default 0
Count of completed orders for this service. Updated by DB trigger on order status → completed. Displayed as '1,200+ services completed'.
DB Trigger: update-service-ratings
-- Fires on feedback INSERT
-- Updates service_packages.avg_rating and total_ratings_count
UPDATE service_packages
SET
  avg_rating = (SELECT AVG(f.rating) FROM feedback f
               JOIN orders o ON f.order_id = o.id
               WHERE o.service_package_id = NEW_service_package_id),
  total_ratings_count = (SELECT COUNT(*) FROM feedback f
                         JOIN orders o ON f.order_id = o.id
                         WHERE o.service_package_id = NEW_service_package_id)
WHERE id = NEW_service_package_id;
-- Fires on orders status UPDATE to 'completed'
UPDATE service_packages
SET total_orders_count = total_orders_count + 1
WHERE id = order.service_package_id;
New column on users (aggregate display)
Column
Type
Purpose
platform_stats_cache
JSONB nullable
Cached at app_settings level. NOT per-user. Stores: { total_orders_completed: int, avg_platform_rating: numeric, cities_served: int }. Updated by update-platform-stats cron daily.
app_settings keys (new)
Key: 'platform_stats' — JSON: { total_orders_completed, avg_platform_rating, cities_served }. Updated nightly by update-platform-stats cron. Read by public endpoints.
Where Ratings Are Displayed
Surface
What Is Shown
Service card (Home screen)
★ 4.8  (1,200 orders). Only shown if total_ratings_count ≥ 10. Below threshold: no rating shown (avoid 1-review distortion).
Service detail screen
★ 4.8 out of 5 based on 1,200 verified orders. No breakdown by star. No individual reviews — professionals are invisible.
Checkout screen
Trust line below price: 'Trusted by 1,200+ businesses. Avg rating: 4.8 ★'
ollvy.com/join landing page
Platform-wide: '15,000+ services completed. 4.8 average rating across all services.' Read from app_settings platform_stats key.
Admin /analytics
Per-service avg_rating and total_ratings_count. Sortable. Flag services with avg < 4.0 for review.
Rules
NEVER show which professional handled an order — ratings are for Ollvy as a brand, not for individuals. The feedback.rating is still used internally for professional performance scoring (future v11 feature).
Minimum 10 ratings before avg_rating is displayed publicly. Below 10: hide the rating entirely from service cards.
feedback table remains private. avg_rating on service_packages is the only public surface.
Rating prompt timing is unchanged: always after one-time order completion, retainer only after first cycle or if last feedback > 6 months ago.
Edge Function Changes
search-services (public endpoint): now returns avg_rating and total_ratings_count alongside service fields. Unauthenticated callers receive these. No change to security posture — these are intended public fields.
update-platform-stats (new, cron 11:45pm IST daily): Computes total_orders_completed + avg_platform_rating + cities_served across all completed orders. Writes to app_settings key='platform_stats'.
30. Monthly Retainer Digest — Proof of Work Delivery
A founder paying ₹2,999/month needs to see what they got. Without a monthly proof-of-work, retainer churn accelerates at months 3–6 when the novelty wears off and the founder asks 'what am I actually paying for?' The digest is the retention mechanism.
What the Digest Is
Every billing cycle, after the retainer child order is marked completed, a digest PDF is generated summarising exactly what was done that month. It is stored in /documents/ and delivered to the user via push notification. It is visible inside the Retainer Detail screen under a 'Monthly Reports' tab.
DB: retainer_digests
Column
Type
Purpose
id
uuid PK
Primary key
retainer_subscription_id
uuid FK NOT NULL
Parent retainer
order_id
uuid FK NOT NULL
The child order this digest covers
user_id
uuid FK NOT NULL
For RLS
billing_period
text NOT NULL
e.g. 'March 2025'. Same format as payouts.billing_period.
service_name
text NOT NULL
Snapshot of service name at generation time
stages_completed
JSONB NOT NULL
Array of { stage_key, stage_name, completed_at, notes }. Pulled from order_stage_history.
compliance_status
text NOT NULL
'Filed on time' | 'Filed (late — [reason])' | 'Not applicable this cycle'
key_numbers
JSONB nullable
Service-specific metrics. For GST: { gst_liability_paisa, input_credit_paisa, net_payable_paisa }. For Payroll: { employees_processed, total_ctc_paisa }. For TDS: { tds_deducted_paisa, challans_filed }. NULL for services without structured output in v10.
next_due_date
date nullable
Next filing/action due date for this service. Pulled from compliance_obligations.
pdf_url
text nullable
Path in /documents/ bucket. Accessed via get-digest-url edge function (60-min signed URL).
generated_at
timestamptz default now()
Generation timestamp
Digest PDF Contents
Section
Content
Header
Ollvy logo. 'Monthly Service Report — [Service Name]'. Period: [billing_period]. Business: [business_name].
What We Did This Month
Stage-by-stage list from stages_completed JSONB. Each stage: name + completion date + any notes. Plain language, not technical.
Compliance Status
Large badge: 'Filed on time ✓' in green, or 'Filed late' in amber with reason. This is the primary reassurance signal.
Key Numbers (if available)
For GST: GST liability this month, input credit claimed, net payable. For Payroll: employees processed, total CTC. NULL for services without structured output.
What's Next
Next due date for this service. 'Your next GST return is due by [date].' Links to compliance calendar in-app.
Footer
'Powered by Ollvy. Questions? Reply in the app.' Invoice reference number.
Edge Functions
Function
Trigger
Notes
generate-retainer-digest
Internal — called by advance-stage when FINAL stage of a retainer child order is completed
Fetches order_stage_history, compliance_obligations, billing_period. Builds stages_completed JSONB. Generates PDF via @react-pdf/renderer. Stores in /documents/{user_id}/digests/. Inserts retainer_digests row. Sends push: 'Your [service] report for [month] is ready.'
get-digest-url
HTTP GET (auth)
RLS: user_id must match. Returns 60-min signed URL for digest PDF. Same pattern as get-invoice-url.
Storage Bucket Update
/documents bucket: add path pattern /documents/{user_id}/digests/. Read policy: user_id owner OR admin service role. Write policy: service role only (generate-retainer-digest function).
User App Screen Changes
U18 Retainer Detail: add 'Monthly Reports' tab alongside existing billing history. Tab lists all retainer_digests for this retainer ordered by billing_period DESC. Each row: period label + compliance_status badge + 'View Report' button (calls get-digest-url, opens signed URL in browser).
Compliance status badge colours: 'Filed on time' → green. 'Filed late' → amber. 'Not applicable' → grey.
advance-stage Side Effects Chain (updated)
// When professional marks FINAL stage complete on a retainer child order:
1. order.status = 'completed'
2. payout row created
3. updateComplianceObligation(order)
4. generateRecommendations(user_id)
5. checkFeedbackEligibility(order)
6. sendNotification(user, 'order_completed')
7. current_active_orders-- (DB trigger)
8. generate-retainer-digest(order_id)  // NEW — only for retainer child orders
   └── generates PDF, stores, pushes 'Your [month] report is ready'
31. Ollvy Pro — Annual Plan & Value Proposition Fix
₹999/month Pro currently pays for itself only if a user books multiple annual services. The fear/savings hook is absent from the product. Adding an annual plan (10 months = 12) reduces churn and improves LTV. Adding a compliance penalty calculator to the upgrade screen makes the value proposition concrete.
Annual Pro Plan
Item
Spec
Price
₹9,990/year (= 10 months, 2 months free). Displayed as 'Save ₹1,998/year vs monthly.'
Razorpay plan
Separate annual Razorpay subscription plan (OLLVY_PRO_ANNUAL_PLAN_ID env var). billing_cycle=yearly. Amount=999000 paisa.
DB change
users.pro_plan_type: enum (monthly|annual) default 'monthly'. Set on pro-subscription-webhook subscription.charged based on which Razorpay plan ID triggered the charge.
Grace period
Annual plan grace period: 14 days (vs 7 for monthly). check-pro-grace-period cron reads pro_plan_type to determine threshold.
Upgrade screen CTA
Toggle between 'Monthly — ₹999/month' and 'Annual — ₹833/month (billed ₹9,990/year). Save ₹1,998.' Default shows annual. Monthly shown as secondary option.
Cancellation
Annual plan cancellation: effective end of annual billing year. No monthly pro-rata refund. Pro features active until year-end.
Compliance Penalty Calculator (U24 — Pro Upgrade Screen)
Shown before the plan picker on the Pro upgrade screen. Interactive. Makes the value of Pro concrete before asking for ₹999.
Input / Output
Spec
Input: business_type
Pre-filled from users.business_type if set. Otherwise a quick picker: Pvt Ltd / LLP / Sole Prop / Partnership.
Input: gst_registered
Toggle: 'Are you GST registered?' Pre-filled from users.gst_registered.
Input: has_employees
Toggle: 'Do you have employees?' Pre-filled from users.has_employees.
Output: risk exposure
Computed client-side from static penalty table. Example: GST registered + Pvt Ltd = 'Missing GST filings: up to ₹50,000 penalty + 18% interest. Late MCA filing: ₹100/day up to ₹1,00,000.' Shows 3–5 penalty lines relevant to their profile.
Output: annual savings
'With Pro reminders: avoid ₹X in likely penalties. Pro costs ₹9,990/year. Net: you save ₹[X - 9,990].' If X < 9,990: don't show savings (don't lie). Show compliance peace-of-mind framing instead.
Penalty Table (seeded, client-side constant — not in DB)
// packages/shared/penaltyTable.ts
// Input: { businessType, gstRegistered, hasEmployees }
// Returns: PenaltyRisk[]
export const PENALTY_TABLE = [
  { condition: { gstRegistered: true }, risk: 'Late GST return', penalty: 'Up to ₹50,000 + 18% p.a. interest' },
  { condition: { businessType: ['pvt_ltd','llp','opc'] }, risk: 'Late MCA annual filing', penalty: '₹100/day, up to ₹1,00,000' },
  { condition: { gstRegistered: true }, risk: 'GSTR-9 non-filing', penalty: '₹200/day up to 0.25% of turnover' },
  { condition: { hasEmployees: true }, risk: 'TDS non-compliance', penalty: '1.5% p.m. interest + 40% disallowance' },
  { condition: { hasEmployees: true }, risk: 'PF/ESIC late payment', penalty: '12% p.a. interest + ₹5,000 penalty per default' },
  { condition: { businessType: ['pvt_ltd','llp'] }, risk: 'Director KYC lapse', penalty: '₹5,000/day until filed' },
]
Pro Upgrade Screen (U24) — Full Updated Spec
Section 1 — Penalty calculator (above). Shown first. Grabs user's profile data to pre-fill.
Section 2 — Feature comparison table (existing): Free vs Pro.
Section 3 — Plan picker toggle: Annual (default, shown first) vs Monthly. Annual highlighted as 'Best Value'.
Section 4 — CTA: 'Start Pro — [₹9,990/year or ₹999/month]'. Tapping calls create-razorpay-subscription with correct plan ID based on toggle state.
Section 5 — Trust line: '14-day money-back if you're not satisfied. Cancel anytime.' RESOLVED: Full 14-day money-back on first purchase only, if no Pro-benefit orders placed. See Pro Refund Policy note below.
PRO REFUND POLICY (RESOLVED): Ollvy Pro offers a 14-day money-back guarantee on first purchase only (not on renewals). Conditions: (1) User requests refund within 14 calendar days of first Pro subscription charge. (2) User has not placed any orders using Pro benefits (e.g. priority matching, advanced analytics). If user placed even one Pro-benefit order: refund is denied. (3) Request via in-app 'Request Refund' on U24 or email support@ollvy.com. Admin processes manually from /users/[id]. (4) Razorpay refund initiated within 2 business days. (5) After refund: users.pro_status = free immediately. Annual plan: same 14-day window, same conditions. Partial pro-rata refund for annual plans is NOT offered — the full annual amount is refunded if within 14 days and no orders used.
DB Change Summary
users: add pro_plan_type enum (monthly|annual) default 'monthly'.
app_settings: new key 'ollvy_pro_annual_plan_id' — Razorpay plan ID for annual Pro subscription.
pro-subscription-webhook: detect plan type from Razorpay payload plan_id. Set users.pro_plan_type accordingly on subscription.charged.
check-pro-grace-period cron: read pro_plan_type. If annual: grace threshold = 14 days (not 7).
32. Acquisition & Growth Mechanics
The product has no front door. This section specifies three acquisition mechanisms: (1) referral program for existing users, (2) CA-referral for professionals to bring their own clients onto Ollvy, and (3) public SEO service pages for organic Google acquisition. Plus UTM attribution so marketing spend can be measured.
32A. User Referral Program
How It Works
Every user gets a unique referral_code (6-char alphanumeric, generated on first app launch). Stored on users.referral_code.
Sharing mechanic: U26 Settings screen has 'Invite a friend — you both get ₹500 off your next order.' Share via WhatsApp/copy link. Link format: ollvy.com/ref/[code].
When a new user registers with a referral link: referred_by_code captured at OTP stage (passed as URL param, stored before auth). On first successful paid order by the new user: ₹500 credit added to BOTH the referrer and the referee.
Credit applies automatically at checkout. Displayed as line item: 'Referral credit: -₹500.' Applied AFTER Pro discount, BEFORE GST. Floor: credit cannot reduce order below ₹0.
DB: referrals
Column
Type
Purpose
id
uuid PK
referrer_user_id
uuid FK NOT NULL
User who shared the code
referee_user_id
uuid FK NOT NULL
User who used the code
referral_code
text NOT NULL
The code used
status
enum
pending (referee registered) | credited (first order paid) | expired (30 days, no order)
credited_at
timestamptz nullable
When credit was applied to both wallets
created_at
timestamptz default now()
DB: referral_credits
Column
Type
Purpose
id
uuid PK
user_id
uuid FK NOT NULL
Credit owner
amount_paisa
int NOT NULL
Credit amount (default 50000 = ₹500)
source
enum
referral_given | referral_received | admin_grant
referral_id
uuid FK nullable
Link back to referrals row
status
enum
available | applied | expired
applied_to_order_id
uuid FK nullable
Set when credit is used at checkout
expires_at
timestamptz
90 days from credited_at. Unused credits expire.
DB changes on existing tables
users: add referral_code text UNIQUE (generate-referral-code on first login), referred_by_code text nullable, referral_credit_balance_paisa int default 0 (denormalised sum of available referral_credits for fast checkout display).
orders: add referral_credit_paisa_snapshot int default 0 (snapshot of credit applied at creation, like pro_discount_paisa_snapshot).
Edge Functions
Function
Trigger
Notes
generate-referral-code
Internal — on first user login
Generates unique 6-char alphanumeric code. Updates users.referral_code. Idempotent (skip if already set).
apply-referral-credit
Internal — on razorpay-webhook payment.captured for referee's FIRST order
Checks referrals.status=pending for this user. If found and first order: sets status=credited, inserts two referral_credits rows (referrer + referee), updates both referral_credit_balance_paisa.
check-expired-referrals
Cron: 2am daily
Sets referrals.status=expired where created_at > 30 days AND status=pending. Sets referral_credits.status=expired where expires_at < now AND status=available.
create-razorpay-order update
// Credit application: after Pro discount, before GST
const availableCredit = user.referral_credit_balance_paisa
const creditApplied = Math.min(availableCredit, price_after_pro_discount)
const total = (price_after_pro_discount - creditApplied)
              + price_govt_fees_paisa + gst - promoDiscount
// Snapshot creditApplied as orders.referral_credit_paisa_snapshot
// On payment.captured: deduct from referral_credit_balance_paisa
32B. CA-Referral (Professional → Client)
A professional can generate a client invite link from their professional app earnings screen. Format: ollvy.com/ref/pro/[professional_code].
When a business owner registers via this link: preferred_professional_id on users is pre-set to the referring professional's ID. First order from this user is auto-assigned to the referring professional (if they have capacity), bypassing normal round-robin.
Incentive: professional earns ₹500 bonus credit added to their next payout on the first paid order from a client they referred. Stored in referral_credits with source=professional_referral. Paid out in next payout batch.
DB: professionals table — add professional_referral_code text UNIQUE (generated same way as user referral code). Add professional_referral_credit_paisa int default 0.
32C. Public SEO Service Pages — apps/landing/services/[slug]/
Each active service_package gets a public landing page at ollvy.com/services/[slug]. Built as static Next.js pages. Indexed by Google. These are the primary organic acquisition channel for high-intent searches like 'GST registration cost Delhi' or 'trademark registration India price.'
Page Element
Spec
URL
ollvy.com/services/[service_package.slug]. Add slug column (text UNIQUE) to service_packages. Seeded from service name (e.g. 'gst-registration', 'private-limited-incorporation').
Title / H1
[Service Name] — [Price] | Ollvy. e.g. 'GST Registration — ₹8,999 | Ollvy'
Content sections
What's included (from workflow_stages JSONB). Price breakdown (base + GST, no govt fees confusion). How long it takes (sla_working_days). Who handles it ('Ollvy Compliance Team — verified professionals'). Rating: avg_rating if ≥ 10 ratings.
CTA
'Get Started — ₹[price]' → links to app download with utm_source=seo_service_page&utm_content=[slug].
Schema markup
JSON-LD: Service schema with name, description, price, rating, provider (Ollvy Technologies). Enables Google rich results.
Static generation
getStaticPaths fetches all service_packages WHERE is_active=true. getStaticProps fetches service detail. Regenerated on-demand (ISR, revalidate=3600) when admin toggles is_active.
DB change: service_packages
Add slug text UNIQUE NOT NULL. Seeded in 001_initial_schema.sql alongside other service data. Format: lowercase-hyphenated from service name.
32D. UTM Attribution
All acquisition tracking. Captured once at registration, stored permanently. Used to measure which channel converts.
Column on users
Type
Source
utm_source
text nullable
e.g. join_page, seo_service_page, referral, instagram, google
utm_medium
text nullable
e.g. organic, paid, referral, direct
utm_campaign
text nullable
e.g. delhi_launch, gst_season_2025
utm_content
text nullable
e.g. service slug for SEO pages, ad creative ID for paid
Captured at OTP verification: app passes UTM params from deep link to verify-otp body. verify-otp writes to users row on creation. Never overwritten after first set.
Admin /analytics: add 'Acquisition Sources' section showing user registrations by utm_source, utm_campaign. Week-by-week trend.
33. Engagement Letters — Scope of Work at Checkout
Ollvy is handling legally and financially consequential tasks for businesses. Incorporating a company incorrectly, missing a filing deadline, or filing an incorrect return creates real liability. An engagement letter generated at order creation is both a legal protection for Ollvy and a trust signal for the user. It defines: what is included, what is not included, the timeline commitment (SLA), and the professional's responsibility.
DB: engagement_letters
Column
Type
Purpose
id
uuid PK
order_id
uuid FK UNIQUE NOT NULL
One letter per order. UNIQUE constraint.
user_id
uuid FK NOT NULL
For RLS
service_package_id
uuid FK NOT NULL
Snapshot of service
service_name_snapshot
text NOT NULL
Service name at generation time
scope_included
text[] NOT NULL
What IS included. Derived from workflow_stages JSONB + service_packages.scope_included[] (new column).
scope_excluded
text[] NOT NULL
What is NOT included. From service_packages.scope_excluded[] (new column). Critical for liability.
timeline_commitment
text NOT NULL
e.g. 'We commit to completing your GST Registration within 7 working days of receiving all required documents.'
price_snapshot_paisa
int NOT NULL
Total paid, including GST. Snapshot from order.
user_acknowledged_at
timestamptz nullable
When user tapped 'I agree' on the acknowledgement screen. NULL if not yet acknowledged (orders created before this feature).
pdf_url
text nullable
Path in /documents/ bucket. Accessed via get-engagement-letter-url.
generated_at
timestamptz default now()
New columns on service_packages
scope_included text[] NOT NULL default '{}': List of what IS included in this service. Plain language. e.g. ['DSC application for 2 directors', 'MCA filing (SPICe+ form)', 'PAN + TAN application', 'Certificate of Incorporation']. Seeded per service in 001_initial_schema.sql.
scope_excluded text[] NOT NULL default '{}': List of what is NOT included. e.g. ['Government stamp duty (paid separately)', 'GST registration (separate service)', 'Registered office address arrangement', 'Post-incorporation bank account opening']. Critical for dispute prevention.
Engagement Letter PDF Contents
Section
Content
Header
'Service Engagement Letter'. Ollvy Technologies Private Limited. Date. Letter number: EL-[order_id_short].
Parties
Service Provider: Ollvy Technologies Private Limited (acting through verified professional). Client: [business_name], [state].
Service Description
Service: [service_name]. Order ID: [order_id_short]. Amount paid: ₹[total].
Scope — What is Included
Bullet list from scope_included[]. Numbered.
Scope — What is NOT Included
Bullet list from scope_excluded[]. Explicitly called out. Prevents 'you said you'd do X' disputes.
Timeline Commitment
timeline_commitment text. SLA in working days. Caveat: 'Subject to timely submission of all required documents by the client.'
Client Obligations
'Client agrees to provide all requested documents within 3 working days of any professional request. Delays by client extend the SLA accordingly.'
Limitation of Liability
'Ollvy's liability is limited to the amount paid for this service. Ollvy is not liable for consequential damages, government penalties arising from client-provided incorrect information, or delays outside Ollvy's control.'
Governing Law
'This engagement is governed by the laws of India. Jurisdiction: [Ollvy registered state].'
Flow — When It Triggers
generate-engagement-letter is called by razorpay-webhook (payment.captured) BEFORE order is assigned. Fires synchronously as part of the webhook chain.
User receives push: 'Your engagement letter is ready — tap to review.' This push comes after the existing 'Your invoice is ready' push.
User app: engagement letter accessible from Order Detail screen → new 'Letter' tab alongside Documents and Chat. 'View Engagement Letter' button calls get-engagement-letter-url.
Acknowledgement: for orders created after v12 launch, the checkout flow includes a mandatory acknowledgement step (new U12 sub-screen) before Razorpay sheet opens: user sees the scope summary (scope_included and scope_excluded bullets) and taps 'I agree and proceed to payment'. user_acknowledged_at is set at this tap, BEFORE payment, so the PDF confirmation can reference it.
Edge Functions
Function
Trigger
Notes
generate-engagement-letter
Internal — razorpay-webhook payment.captured
Fetches service_packages.scope_included[], scope_excluded[], workflow_stages (for timeline). Builds PDF via @react-pdf/renderer. Stores in /documents/{user_id}/letters/. Inserts engagement_letters row. Sends push.
get-engagement-letter-url
HTTP GET (auth)
RLS: user_id must match. Returns 60-min signed URL. Same pattern as get-invoice-url and get-digest-url.
Admin /services/builder Update (Step 9 — Scope Definition)
Add Step 9 to the service builder: 'Define Scope.' Two text-area lists: 'What is included (add items)' and 'What is NOT included (add items).' Required before service can be published. Saves to service_packages.scope_included[] and scope_excluded[].
Existing services: admin must backfill scope_included and scope_excluded before enabling engagement letter generation for that service. Admin /services page shows a 'Scope incomplete' warning badge for services missing these arrays.
razorpay-webhook payment.captured — Updated Side Effects Chain
// Updated chain order:
1. Verify Razorpay signature
2. Create order row (status=paid)
3. generate-invoice(order_id)         // tax invoice PDF
4. generate-engagement-letter(order_id) // scope of work PDF  [NEW]
5. auto-assign-professional(order_id)
6. Create chat_conversation
7. sendNotification(user, 'order_confirmed')
8. sendNotification(user, 'invoice_ready')
9. sendNotification(user, 'engagement_letter_ready')  [NEW]
34. Annual Service Renewal System
Business ITR, Director KYC, GST Annual Return, MCA Annual Filing, TDS Quarterly Return — these services repeat every year or quarter. A user who completed Business ITR in August 2025 needs a nudge in June 2026. Currently this only works for Pro users via the compliance calendar. Free users get nothing. This section specifies the renewal reminder system that works for ALL users regardless of Pro status.
DB: annual_renewal_tracking
Column
Type
Purpose
id
uuid PK
user_id
uuid FK NOT NULL
User to remind
service_package_id
uuid FK NOT NULL
Service that renews
order_id
uuid FK NOT NULL
Original completed order that triggered this tracking row
billing_cycle
text NOT NULL
Inherited from service_packages.billing_cycle. 'annual' or 'quarterly'.
first_completed_at
timestamptz NOT NULL
When the original order was completed
next_renewal_date
date NOT NULL
Calculated: for annual = first_completed_at + 11 months (reminder window starts). For quarterly = first_completed_at + 2.5 months. Recalculated on each renewal.
reminded_at_days
int[] default '{}'
Tracks which reminder milestones have fired: [60, 30, 7, 1]. Guards against duplicate sends.
status
enum
active | snoozed | renewed (new order placed) | cancelled (user dismissed all reminders)
renewed_order_id
uuid FK nullable
Set when user books the renewal. Triggers new annual_renewal_tracking row for the NEXT cycle.
snooze_until
date nullable
User can snooze reminder for 7 or 30 days.
Which Services Get Renewal Tracking
Service
Reminder Window
Business ITR Filing (annual)
Remind at 60, 30, 7 days before next July 31 (standard ITR deadline). Recalculate based on statutory calendar, not just order anniversary.
GST Annual Return / GSTR-9 (annual)
Remind at 60, 30, 7 days before December 31 each year.
MCA Annual Filing Bundle (annual)
Remind at 60, 30, 7 days before September 30.
Director KYC / DIR-3 KYC (annual)
Remind at 60, 30, 7 days before September 30.
ROC Compliance Bundle (annual)
Remind at 60, 30, 7 days. Date varies; use order anniversary + 11 months.
Statutory Audit (annual)
Remind at 60, 30, 7 days. Order anniversary + 11 months.
TDS Quarterly Return (quarterly)
Remind at 30, 7, 1 days before each quarter-end: Jun 30, Sep 30, Dec 31, Mar 31.
Advance Tax Computation (quarterly)
Remind at 30, 7 days before: Jun 15, Sep 15, Dec 15, Mar 15.
For services tied to statutory deadlines (ITR, GSTR-9, MCA), use the statutory deadline calendar, NOT the order anniversary. This ensures reminders fire at the correct regulatory date regardless of when the user first booked.
DB: renewal_deadline_calendar (seeded, admin-maintained)
Column
Type
Purpose
service_package_id
uuid FK NOT NULL
Which service
deadline_label
text NOT NULL
e.g. 'ITR Filing Deadline FY25-26'
deadline_date
date NOT NULL
Actual statutory date. Admin updates annually.
applicable_year
int NOT NULL
Financial year e.g. 2026. Admin adds next year's dates each March.
Edge Functions
Function
Trigger
Notes
seed-renewal-tracking
Internal — advance-stage FINAL stage for non-retainer, annual/quarterly services
On order completion for qualifying billing_cycle: inserts annual_renewal_tracking row. Calculates next_renewal_date from renewal_deadline_calendar if statutory date exists, else order anniversary + 11 months.
send-renewal-reminders
Cron: 2:00pm daily
Finds annual_renewal_tracking where status=active AND snooze_until < today. Checks if next_renewal_date is within 60/30/7/1 days AND that milestone not in reminded_at_days[]. Sends push + SMS. Updates reminded_at_days[]. Works for ALL users regardless of Pro status.
Notification — Renewal Reminder
Milestone
Push Title
Push Body
60 days before
'[Service] due in 60 days'
'Your [Service Name] is due by [date]. Book early to avoid rush fees. Tap to re-book.'
30 days before
'[Service] due in 30 days'
'Your [Service Name] needs to be filed by [date]. Last year it cost ₹[price]. Book now.'
7 days before
'[Service] due in 7 days — urgent'
'[Service Name] is due [date]. Missing the deadline may attract penalties. Book now.'
1 day before
'[Service] due TOMORROW'
'Last day to file [Service Name] without penalty. Tap to book instantly.'
User App Screen Changes
U08 Home — Service Catalogue: add 'Renewals Due' section at the top of home screen for users who have annual_renewal_tracking rows with next_renewal_date within 60 days. Shows: '[Service Name] — due by [date]' card with urgency badge. Appears above the filter chips.
U15 Order Detail: after order completion, show 'We'll remind you when this needs renewing.' with the calculated next_renewal_date. Snooze and dismiss options available.
Snooze options: 7 days or 30 days. Sets annual_renewal_tracking.snooze_until. Does not affect statutory deadline — only delays that specific reminder send.
Admin /analytics Update
Add 'Renewal Pipeline' section: count of annual_renewal_tracking rows by status (active, snoozed, renewed, cancelled) and by service. Renewal conversion rate = renewed / (renewed + cancelled). This is a primary revenue forecasting signal.
Ollvy Master Build Spec v18.0  ·  The Compliance OS for Indian Businesses  ·  For Claude Code
35. Anti-Fraud — Minimum Viable Layer
Ollvy handles legally consequential tasks for businesses. Two primary fraud vectors: (1) users gaming disputes for refunds on completed work, (2) professionals colluding to create fake orders. This section specifies minimum viable detection — not a full fraud system. Expand post-launch based on observed patterns.
35A — Dispute Abuse Detection
Dispute cooldown: a user who has raised a dispute in the last 7 days cannot raise another dispute on a different order. open-dispute edge function checks: if count of open disputes for user >= 1 AND last dispute created_at > now() - interval '7 days', return error: 'You already have an open dispute. Please wait for it to be resolved before raising another.' Users with legitimate concurrent issues can contact admin directly.
Monthly dispute cap: if a user has raised more than 3 disputes in a rolling 30-day window, their account is flagged for admin review. open-dispute checks: if count of disputes for user in last 30 days >= 3, do not block (allow dispute) but set users.fraud_flag=true and create admin_notification: 'User [phone] has raised 3+ disputes this month. Review account.' New column: users.fraud_flag bool default false.
Same-device pattern: if a dispute is raised within 2 hours of order completion on the same FCM token (device), create admin_notification: 'Possible refund gaming: dispute raised immediately after order completed on same device. Order [N].' Admin reviews manually. No automatic block — this could be a legitimate complaint.
35B — Order Integrity
Duplicate order detection: before creating a Razorpay order, check if user already has an active (status NOT IN completed, cancelled, refunded) order for the same service_package_id. If yes, show error: 'You already have an active order for this service. View it in My Orders.' User must complete or cancel existing order first. Exception: retainer services — multiple retainer subscriptions to the same service are blocked at the DB level by unique constraint on (user_id, service_package_id) WHERE status NOT IN (cancelled, expired).
Rapid completion flag: if advance-stage marks an order as completed in less than 20% of the service's sla_working_days, set orders.rapid_completion_flag=true (new column, bool default false) and create admin_notification: 'Order [N] for [service] completed unusually fast (SLA: X days, actual: Y hours). Review for quality.' Not blocked — professionals may be fast — but flagged for admin spot-check. New column: orders.rapid_completion_flag bool default false.
35C — Referral Abuse
Self-referral block: apply-referral-credit checks that referrer_user_id != referee_user_id AND that referrer's phone != referee's phone. Also checks that referrer's FCM token at signup != referee's FCM token (same device). If any check fails, do not credit — silently abort (no error to user — just don't credit). Admin_notification: 'Suspected self-referral blocked: users [A] and [B].'
Referral cap: a single user can refer maximum 10 users who get credited referral_credits in a rolling 30-day period. Beyond that, the referrer still gets credit but admin is notified: 'User [phone] has credited 10+ referrals this month.' New column: users.referral_credit_30d_count int default 0. Reset by monthly cron (1st of month, 4:00am).
35D — New DB Columns Summary
users: add fraud_flag bool default false, referral_credit_30d_count int default 0. orders: add rapid_completion_flag bool default false, force_assigned bool default false (from Section 8 force-assign), govt_fees_paid_paisa int nullable (from Section 26 resolution). New table: strike_appeals (from Section 7). New table: processed_webhook_events (from Section 11). Add to annual_renewal_tracking: quotes.escalated_at timestamptz nullable (from Section 12 resolution). Add to professionals: professional_referral_credit_paisa int default 0 (already in Section 32B).
36. Public Business Profile — ollvy.com/b/[id]
Purpose: a shareable public URL that acts as a trust signal for B2B businesses — founders can share it with investors, vendors, or partners to demonstrate compliance credibility. 'Here's our Ollvy compliance profile.' The URL is not indexed by search engines (noindex meta tag) — it is shared intentionally by the user, not discoverable by accident.
Technical Implementation
File: apps/landing/b/[id]/page.tsx — Next.js 14 ISR page. revalidate=3600 (refreshes every hour). URL: ollvy.com/b/[users.id]. The ID is the existing users UUID — already exists, no new column needed. ISR means the page is built on first visit and cached; subsequent visits are instant until revalidated.
New edge function: get-public-profile (unauthenticated, rate-limited 30 req/min per IP). Input: user_id. Output: { business_name, business_type, state, city, compliance_health_score, profile_created_at (year only), active_retainers: count, completed_orders: count, services_active: string[] (service names only, no pricing), ollvy_verified: true }. NEVER returns: phone, email, order details, invoice amounts, professional names, user UUID.
New column: users.public_profile_enabled bool default true. If false, get-public-profile returns 404 and page shows 'This profile is not publicly available.' User can toggle this in U26 Settings: 'Public Business Profile — [toggle]'. Default ON (most users will want to share it).
Page Content (ollvy.com/b/[id])
Header: Ollvy logo + 'Verified Business Profile' badge. Business name (large, bold). Business type + state + city (e.g. 'Private Limited · Delhi'). 'Ollvy Member since [year]'.
Compliance Health Score: circular gauge (same visual as U22 in-app). Score 0–100. Label: 'Compliance Health'. Below 60: amber, 60–80: green, 80–100: dark green with 'Excellent'. Tooltip on hover: 'This score is calculated by Ollvy based on active compliance coverage, pending obligations, and filing history.'
Services section: 'Managed by Ollvy' — list of service names (from services_active array). Shows active retainers as 'GST Monthly Filing (ongoing)' and completed one-time services as 'Company Incorporation (completed)'. Max 5 services shown. If 0 active services: hide this section entirely.
Footer: 'This profile is managed by Ollvy — India's Compliance OS. This business uses Ollvy to automate their regulatory compliance.' + CTA button: 'Get Started on Ollvy' → ollvy.com with UTM params utm_source=business_profile&utm_medium=share&utm_campaign=profile_cta. meta tags: robots=noindex, nofollow.
U22 My Business Tab — Share CTA
U22 screen update: add 'Share Business Profile' card at the top (above health score gauge). Card text: 'Share your compliance profile with investors, vendors, or partners.' Button: 'Copy Link' — copies ollvy.com/b/[users.id] to clipboard. Second button: 'Share' — calls Expo Sharing.shareAsync({ url: profileUrl, message: 'Here\'s our business compliance profile on Ollvy' }). Shows preview of what the public page looks like (thumbnail/mockup). Toggle below: 'Make profile public' — updates users.public_profile_enabled.
Ollvy Master Build Spec v18.0  ·  The Compliance OS for Indian Businesses  ·  For Claude Code
37. Professional Web Panel — pro.ollvy.com
ARCHITECTURE CORRECTION (v14): The professional panel is a Next.js 14 web app, NOT a React Native mobile app. It is accessible at pro.ollvy.com from any browser (desktop or mobile). This replaces apps/professional from React Native to Next.js. All P01-P15 screens are now web pages. Professional app download links in SMS notifications are replaced with pro.ollvy.com URL.
Why Web, Not Mobile
CAs and lawyers work primarily on desktop — uploading documents, managing stage workflows, generating digests. A web panel fits their work context.
Removes App Store review dependency from the professional onboarding path.
Responsive design handles mobile browsing without a separate native build.
Realtime (Supabase JS client) and push notifications (browser Web Push API or SMS fallback) both work in the browser.
Push Notifications for Professionals
FCM push via Expo does not apply to the web panel. Replace with: (1) Browser Web Push API (Permission prompt on first login. Send via Firebase Web Push for compatible browsers). (2) SMS fallback for order_assigned and order_completed events (already in SMS allowlist). Professional notification preference: professionals.notification_preference enum(web_push|sms_only) default web_push.
Auth — pro.ollvy.com
Phone OTP login — same send-otp / verify-otp edge functions. Web form instead of mobile screen.
Session: Supabase Auth session stored in httpOnly cookie (Next.js middleware). 30-day expiry.
On login: check professionals row. If none and phone matches professional_applications: show P05 status screen. If approved: route to P07 dashboard.
Navigation — Sidebar Layout
Persistent left sidebar (desktop) or bottom nav (mobile). Items: Dashboard, Orders, Retainers, Earnings, Profile, Settings.
Page Specifications — P01 to P15
P01 — Join Landing (pre-auth) — ollvy.com/join
Already specified in Section 28. No change. This is a landing page, not the professional panel.
P02 — Login / OTP Verify
URL: pro.ollvy.com/login
Form: phone number input (Indian +91 prefix auto-added). 'Send OTP' button. Calls send-otp.
OTP entry: 6-digit input. Auto-submit on 6th digit. Calls verify-otp. On success: set Supabase session, redirect to /dashboard.
Error states: incorrect OTP (red inline), rate limited ('Too many attempts. Try again in 10 minutes.').
Dev bypass: 000000 in non-production environment.
P03 — Onboarding: Basic Info (new professionals only)
URL: pro.ollvy.com/onboarding/basics
Shown only if professionals.onboarding_step < 3.
Fields: Full name, email, profession_type (dropdown: CA / Lawyer / CS / Tax Consultant / Other), city, state, years_experience (number input). All required.
Progress bar: Step 1 of 4.
On submit: calls update-professional-profile. Sets onboarding_step = 1.
P04 — Onboarding: Service Areas
URL: pro.ollvy.com/onboarding/services
Multi-select grid of service_packages (name + icon). Shows all 32 services. Professional selects services they can handle.
Monthly capacity slider: 1-20 concurrent orders. Default 5.
City coverage: add/remove cities. Autocomplete from city list in packages/shared.
Progress bar: Step 2 of 4.
P05 — Onboarding: Certifications Upload
URL: pro.ollvy.com/onboarding/certifications
Conditional on profession_type: CA → ICAI membership certificate + CA certificate. Lawyer → Bar Council enrollment. CS → ICSI certificate.
Drag-and-drop file upload to /certifications/[professional_id]/. PDF or image. Max 5MB each.
ICAI number / Bar Council number text input (required for respective profession_types).
Progress bar: Step 3 of 4.
On submit: creates professionals_certifications rows (status=pending_review). Admin notified via badge on /professionals/certifications.
P06 — Onboarding: Pending Approval
URL: pro.ollvy.com/onboarding/pending
Shown when professional.status = pending or certifications are pending_review.
Copy: 'Your application is under review. We will notify you via SMS and this page when approved. Usually within 72 hours.'
Shows submitted_at timestamp and estimated review time.
Auto-refreshes every 60 seconds. On status change to approved: redirects to /dashboard.
P07 — Dashboard
URL: pro.ollvy.com/dashboard
Header KPIs (4 cards, inline): Active Orders | Retainer Clients | This Month Earnings | Strike Count (red badge if > 0).
Bank details banner (if bank_details_verified = false): full-width orange banner. 'Add bank account to receive payments.' CTA: Add Now. Never dismissable until verified.
New orders section: Orders assigned in last 48h with 'New' badge. Service name, client city (no name), SLA deadline. Click to open order detail.
Retainers due this week: retainer child orders due within 7 days. Shows client business type, service, stage.
Availability toggle: large toggle at top right. Sets professionals.is_available. When off: shows 'You are not accepting new orders.'
On-leave indicator: if on_leave_until is set and in future, shows: 'On leave until [date]. Orders paused.' Button to end leave early.
P08 — Order List
URL: pro.ollvy.com/orders
Table view (desktop) / card stack (mobile). Columns: Order ID, Service, Client City, Status, SLA Due Date, Stage, Payment status badge.
Filter bar: Status (all/assigned/in_progress/completed/dispute), Service (dropdown), Date range picker.
Realtime subscription: orders WHERE professional_id = me. New order pops to top with 'New' badge.
payment_paused badge (yellow) on any order where orders.payment_paused = true.
Sort: SLA due date ascending by default (urgent first).
P09 — Order Detail
URL: pro.ollvy.com/orders/[id]
Header: service name, order ID, client city, status badge, SLA countdown timer (days:hours remaining).
Stages panel: vertical stepper. Each stage shows: stage_key, description, sla_working_days, status (pending/in_progress/completed/overdue). Current stage highlighted.
Advance Stage CTA: primary button. Disabled if payment_paused=true (shows 'Payment issue — contact client'), dispute (shows 'Dispute in progress'). Clicking opens confirmation modal: 'Mark [stage_name] as complete? This will notify the client.' Calls advance-stage.
Documents panel: list of uploaded documents. Download button. Document request button (opens modal to specify what is needed).
Chat button: 'Chat with client' opens P10 Chat inline panel (right side on desktop, full screen on mobile).
Govt fee reimbursement section (for incorporation-type services): input field for actual govt fees paid. Upload receipt (PDF/image). Calls submit-govt-fee-reimbursement. Only visible after order is in_progress.
Strike appeal banner: if a strike exists on this order AND created_at is within 24h, shows: 'A performance note was added. Contest within [X]h.' Calls submit-strike-appeal.
P10 — Chat
URL: pro.ollvy.com/orders/[id]/chat (or inline panel on P09)
Realtime Supabase subscription on chat_messages WHERE conversation_id = order.conversation_id.
Messages: right-aligned (sent), left-aligned (received). System messages (grey, centered): 'Specialist updated', 'Stage advanced', etc.
Input: text area + send button + file attachment (uploads to /documents/). Max 2000 chars per message.
Professional cannot see client name — only client city and business type.
P11 — Retainer List
URL: pro.ollvy.com/retainers
Card grid. Each card: service name, client business type, current status badge (active/paused/onboarding/billing_failed), billing cycle date (25th), monthly rate.
Realtime subscription for pause/cancel/tier changes — card badges update live.
Monthly digest indicator: shows whether this month's digest has been generated.
P12 — Retainer Detail
URL: pro.ollvy.com/retainers/[id]
Current cycle order: same view as P09 but scoped to retainer context.
Billing history: past months. Each row: month, status (filed_on_time/filed_late/not_applicable), payout amount.
Key numbers input panel: form to enter compliance data for the month's digest. Fields vary by service (GST: liability/input_credit/net_payable. Payroll: employee count/total CTC. TDS: amount deducted/challans filed). Calls update-digest-key-numbers. These values populate the retainer digest PDF.
Chat section: persistent retainer chat (separate from order chat).
P13 — Earnings / Payouts
URL: pro.ollvy.com/earnings
Header KPIs: This Month Pending Earnings | Last Payout Amount | Total Lifetime Earnings.
Earnings breakdown table: columns: Order/Retainer ID, Service, Completed Date, Base Earnings (80% of base), Govt Fee Reimbursement, Total Payout, Status (pending/batched/paid).
Pending payout total: large number with 'Next payout: Monday [date]' label.
Payout history: list of past payout batches with date, amount, bank account last 4 digits, status.
If bank_details_verified = false: full-screen overlay (non-dismissable): 'Add bank account to see earnings.' CTA: Add Now.
P14 — Bank Details
URL: pro.ollvy.com/settings/bank
Form: Account Holder Name, Account Number (masked on display, show/hide toggle), IFSC Code (autocompletes bank name + branch on valid IFSC), Bank Name (auto-filled from IFSC lookup).
Save calls save-bank-details edge function. Creates Razorpay Fund Account. Sets professional_bank_accounts row.
Verification status banner: 'Under review by Ollvy team. Usually verified within 1 business day.' Admin must set bank_details_verified = true from /professionals/[id].
Cannot edit bank details once verified. Admin reset process: admin navigates to /professionals/[id], clicks 'Reset Bank Details'. This sets bank_details_verified=false, clears razorpay_fund_account_id, and creates an audit log entry. Edge function: admin-reset-bank-details (HTTP POST, admin auth). Professional is notified via Web Push/SMS: 'Your bank details have been reset. Please re-add your account from Settings.' Reason: prevents mid-payout fraud where a professional changes bank details just before a large batch fires. Prevents fraud mid-payout-cycle.
P15 — Profile / Settings
URL: pro.ollvy.com/settings/profile
Editable: bio (text area, max 500 chars), experience_years (number), languages[] (multi-select: English/Hindi/Tamil/etc), services_offered[] (multi-select, same as onboarding), max_concurrent_orders (number, 1-20).
Availability toggle: same as P07 toggle. Sets is_available.
Leave management: 'Set Leave' button. Date picker for leave_start and leave_end. Sets on_leave_until. Calls set-professional-leave edge function. On-leave professionals skip auto-assignment.
Certification status: list of uploaded certs with status (pending_review/approved/rejected). Rejected certs show rejection reason.
Notification preference: toggle between Web Push and SMS Only.
Danger zone: Delete account request (creates admin ticket — not automated).
Supabase Realtime in Next.js
// In apps/professional — use Supabase JS client (not Expo)
// Install: pnpm add @supabase/supabase-js @supabase/ssr
// In professional pages that need realtime:
import { createBrowserClient } from '@supabase/ssr'
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
// Subscribe to new orders:
const channel = supabase
  .channel('professional-orders')
  .on('postgres_changes', {
    event: '*', schema: 'public', table: 'orders',
    filter: `professional_id=eq.${professionalId}`
  }, (payload) => { /* update UI */ })
  .subscribe()
// Clean up on unmount:
return () => supabase.removeChannel(channel)
Web Push Notifications
// In apps/professional/public/sw.js (service worker):
self.addEventListener('push', (event) => {
  const data = event.data.json()
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: { url: data.action_url }
  })
})
// In register-fcm-token edge function: check user_agent header.
// If professional panel: store web push subscription in
// professionals.web_push_subscription (JSONB). Use Firebase Web Push
// (same FCM project, different endpoint for web).
// If SMS_ONLY preference: skip web push, rely on SMS only.
URL Structure Summary
URL
Page
Notes
pro.ollvy.com/login
P02 — OTP Login
Redirect to /dashboard if already logged in
pro.ollvy.com/onboarding/basics
P03 — Basic Info
Shown only during onboarding
pro.ollvy.com/onboarding/services
P04 — Service Areas
pro.ollvy.com/onboarding/certifications
P05 — Cert Upload
pro.ollvy.com/onboarding/pending
P06 — Awaiting Approval
Polls for status change
pro.ollvy.com/dashboard
P07 — Dashboard
Default after login
pro.ollvy.com/orders
P08 — Order List
pro.ollvy.com/orders/[id]
P09 — Order Detail
pro.ollvy.com/orders/[id]/chat
P10 — Chat
Also accessible inline from P09
pro.ollvy.com/retainers
P11 — Retainer List
pro.ollvy.com/retainers/[id]
P12 — Retainer Detail
pro.ollvy.com/earnings
P13 — Earnings
pro.ollvy.com/settings/bank
P14 — Bank Details
pro.ollvy.com/settings/profile
P15 — Profile
38. Admin Service Builder — Step 9: Scope of Work Editor
Step 9 was listed in Section 14 but not fully specced. This section defines the complete scope editor UI. The underlying data (scope_included[], scope_excluded[]) is already in the DB from Section 33.
Full Service Builder Step Sequence (updated)
Step
Name
Contents
0
Tier Group
Optional. Create or assign a tier group if this service has pricing tiers (e.g. GST filing tiers). Skip for flat-price services.
1
Basic Info
service_name (max 80 chars), short_description (max 200 chars), category slug, service_type (one_time|retainer|both), is_active toggle (off by default until Step 9 complete).
2
Pricing
price_base_paisa, price_gst_rate (dropdown: 0/5/12/18%), price_varies_by_state toggle, price_display_note. Preview: 'User sees: Rs X + 18% GST = Rs Y'. Govt fee reimbursement toggle + estimated_govt_fee_paisa field.
3
Workflow Stages
Drag-reorder list. Add stage: stage_key (slug), display_name, description, sla_working_days, requires_document (toggle), document_instructions. Preview of stepper UI as professional will see it.
4
SLA Config
sla_working_days (total), escalation_sla_hours (when to fire SLA alert), auto_strike_on_breach (toggle). Strike threshold per stage if different from platform default.
5
Situation Tags
Multi-select from existing situation_tags. Add new tag inline. Preview: 'This service will appear for users who select: [tag1], [tag2].' Urgency score slider 1-10.
6
Documents Required
List of documents client must provide. Each: label, description, required (toggle), example_filename. These seed document_request items in the order flow.
7
Engagement Letter Setup
Assign engagement letter template. Select applicable terms template (Standard One-Time / Retainer Monthly / Custom). Preview PDF with dummy data.
8
Compliance Calendar
If this service creates compliance_obligation entries: select obligation_type (annual_return/quarterly_filing/monthly_filing/one_time), next_due_date, frequency. Multiple obligations per service allowed.
9
Scope of Work
FULLY SPECCED BELOW.
Review
Publish
Summary of all steps. Validation errors shown as inline red banners. Activate toggle. Cannot activate until Steps 1-9 all show green checkmarks.
Step 9: Scope of Work Editor — Full Spec
This step gates service activation. A service cannot be set to is_active = true until scope_included[] and scope_excluded[] are both non-empty (at least 1 item each). The engagement letter for every order uses these arrays.
Layout
Two side-by-side panels: LEFT = Scope Included (green header), RIGHT = Scope Excluded (red header).
Each panel has: numbered list of current items (drag handles for reorder), Add Item input at bottom, Remove (X) button per item.
Each item: text input (max 200 chars). Required. Cannot be blank. Tab key moves to next item.
Minimum: 1 item in Included, 1 item in Excluded. Cannot save Step 9 with empty panels.
Maximum: 20 items per panel. Add button disabled at 20.
Validation Before Saving Step 9
Validation
Message if Fails
scope_included has at least 1 item
Add at least one included item before saving.
scope_excluded has at least 1 item
Add at least one excluded item. This protects Ollvy from scope disputes.
No item text is blank or whitespace-only
Remove empty items or fill them in.
No duplicate items within same panel
Duplicate item detected: [text].
All item text is max 200 chars
Item [N] is too long. Max 200 characters.
Standard Templates
Admin can load pre-filled templates for each service type to speed up entry:
Service
Default scope_included items (template)
GST Registration
Application on GST portal, document verification, ARN generation, GSTIN delivery | Excluded: GST returns filing, HSN code consulting, state-specific compliance beyond registration
GST Monthly Filing
GSTR-1 filing, GSTR-3B filing, late fee computation up to Rs 500 liability, reconciliation summary report | Excluded: audit response, demand notice reply, GST registration amendments
Private Limited Incorporation
DIN for 2 directors, DSC for 2 directors, name reservation (1 attempt), MOA/AOA drafting, Certificate of Incorporation, PAN, TAN | Excluded: GST registration, MSME, FSSAI, trademark, physical office setup, govt fees (reimbursed separately)
Business ITR
ITR-3 or ITR-4 filing based on income, computation of income, acknowledgement PDF | Excluded: ITR revision after filing, CA certificate for loans, appeal filing, advance tax computation
Templates are read-only suggestions. Admin can edit any field. Templates stored in app_settings key=scope_templates (JSONB).
Engagement Letter Preview
Bottom of Step 9: 'Preview Engagement Letter' button. Opens a modal with a rendered preview of the engagement letter PDF using dummy data (Business Name: 'Sample Pvt Ltd', Professional: 'Test CA'). Shows exactly what clients will see at checkout.
If scope_included or scope_excluded is empty: preview button is disabled with tooltip 'Fill scope first.'
Service Activation Gate
// In activate-service edge function (admin auth):
const svc = await supabase.from('service_packages').select('*').eq('id', serviceId).single()
const checks = {
  has_name:           svc.service_name?.length > 0,
  has_price:          svc.price_base_paisa > 0,
  has_stages:         svc.workflow_stages?.length > 0,
  has_situation_tags: svc.situation_tags?.length > 0,
  has_scope_included: svc.scope_included?.length > 0,
  has_scope_excluded: svc.scope_excluded?.length > 0,
}
const failed = Object.entries(checks).filter(([,v]) => !v).map(([k]) => k)
if (failed.length > 0) {
  return { error: 'Cannot activate. Missing: ' + failed.join(', ') }
}
await supabase.from('service_packages').update({ is_active: true }).eq('id', serviceId)
Admin Services List — Scope Badge
On /services page: each service row shows a 'Scope' badge. Green checkmark = both arrays non-empty. Red 'Incomplete' = missing scope. Services with 'Incomplete' badge cannot be activated.
Hovering the badge shows: 'X included items, Y excluded items' or 'Scope incomplete — add in Service Builder Step 9.'
39. Admin Analytics — Full Specification
The /analytics page is now fully specced with every chart, metric, data source, and calculation. All metrics are computed from existing tables — no new tables required except analytics_cache (below).
Page Structure — Tabs
Tab
Contents
Overview
MRR, ARR, GMV, revenue KPIs, growth rates. The headline dashboard.
Revenue
Revenue by service type, by professional, hourly/daily breakdown, margin analysis.
Customers
Acquisition funnel, Pro conversion, retention, cohort analysis, LTV.
Operations
SLA compliance, dispute rate, capacity heatmap, strike rate.
Professionals
Top earners, utilisation, churn, new applications.
Growth
UTM attribution, referral funnel, SEO page performance, renewal pipeline.
Fraud
Flagged users, dispute-to-order ratio, fraud signal trends. See Section 35.
Global Controls (all tabs)
Date range picker: presets — Today, Last 7 days, Last 30 days, Last 90 days, Year to date, Custom. Default: Last 30 days.
Compare toggle: enables comparison overlay (current period vs previous period). Shows % change on every metric.
City filter: dropdown. All cities | Delhi | Mumbai | Bangalore | etc.
Export button: downloads currently visible tab as CSV. Calls get-analytics-export edge function.
Tab 1 — Overview
KPI Row (4 large cards)
Metric
Calculation
Chart type
MRR
SUM(retainer_subscriptions.monthly_price_paisa WHERE status=active) + (Pro subscriber count * 999 paisa-per-month). EXCLUDES first-month-free retainers until billing starts.
Large number. Trend arrow vs last month.
ARR
MRR * 12. Simple projection.
Large number. Trend arrow.
GMV (30d)
SUM(orders.total_paisa_snapshot WHERE completed_at IN range). Gross Merchandise Value = total billed to users.
Large number. Trend arrow.
Net Revenue (30d)
GMV * 0.20 (platform fee). Does not include GST (remitted to govt).
Large number. Trend arrow.
Active Professionals
COUNT(professionals WHERE status=approved AND is_available=true)
Number. Trend vs last month.
Active Users
COUNT(users WHERE last_active_at > 30 days ago)
Number. Trend.
MRR Trend Chart
Type: Area chart (line with shaded area below). X-axis: past 12 months. Y-axis: MRR in rupees.
Two lines: Retainer MRR (blue) + Pro Subscription MRR (orange). Stacked.
Hover tooltip: month, retainer MRR, Pro MRR, total MRR, MoM growth %.
Data source: calculated from retainer_subscriptions and pro_subscriptions tables, grouped by month. Cached in analytics_cache.
GMV vs Net Revenue Chart
Type: Grouped bar chart. X-axis: past 30 days (daily bars). Two bars per day: GMV (light blue) and Net Revenue (dark blue, 20% of GMV bar).
Hover: date, GMV, net revenue, orders count.
Shows visually how platform revenue tracks GMV.
Orders Funnel Chart
Type: Horizontal funnel. Stages: Users who visited catalogue -> Quote requested -> Order placed -> Professional assigned -> Order completed.
Conversion rate shown between each stage (e.g. 'Order placed: 68% of quotes').
Data: queried from orders, quotes tables. Recomputed daily.
Top 5 Services by GMV (this month)
Type: Horizontal bar chart. Service name on Y-axis, GMV on X-axis.
Shows which services drive the most revenue. Clicking a bar goes to Revenue tab filtered by that service.
Tab 2 — Revenue
Revenue by Service Type
Type: Donut chart. Segments: One-Time Orders, Retainers, Pro Subscriptions.
Inner label: Total Revenue this period. Segments with % and Rs amount on hover.
Below donut: table with columns: Service Type, Orders Count, Avg Order Value, Total Revenue, Platform Fee, YoY Growth.
Revenue by Service (drill-down table)
Service Name
Orders
Avg Value
Total Rev
Trend
Private Limited Incorporation
12
Rs 24,999
Rs 2,99,988
Up 34%
GST Registration
28
Rs 8,999
Rs 2,51,972
Up 12%
GST Monthly Filing (Retainer)
45 clients
Rs 2,999/mo
Rs 1,34,955 MRR
Up 8%
Business ITR
19
Rs 11,999
Rs 2,27,981
Up 41%
Clicking any row expands to show: list of all orders for that service in the selected date range, each professional's contribution, avg completion time vs SLA, dispute rate.
Revenue by Professional (Vendor Revenue)
This is the 'revenue by vendors' view. Shows each professional's contribution to GMV, sortable and filterable.
Professional
City
Orders
GMV
Ollvy Fee
Rating
CA Priya S.
Delhi
23
Rs 3.2L
Rs 64K
4.9
Adv. Rahul M.
Mumbai
18
Rs 2.1L
Rs 42K
4.7
CA Sunita R.
Bangalore
31
Rs 4.1L
Rs 82K
4.8
Columns: Professional Name (masked — 'CA [First] [Last Initial].'), City, Orders Completed, GMV Generated, Ollvy Platform Fee, Avg Rating, Avg Completion Days, Strike Count, Dispute Rate, Status badge.
Sort by: GMV desc (default), Rating desc, Orders desc, Strike count asc.
Filter: City, Profession Type, Status (active/suspended), Rating range.
Clicking a professional: goes to admin /professionals/[id] page.
Export: CSV with all visible professionals and columns.
Hourly Revenue Chart
Shows revenue distribution across hours of the day. Useful for understanding when orders are placed — informs support staffing and push notification timing.
Type: Bar chart. X-axis: hours 0-23 (IST). Y-axis: total order value.
Aggregated over the selected date range (e.g. '30 days' shows average hourly GMV per day).
Overlay: order count line (right Y-axis, in blue).
Hover tooltip: hour range (e.g. 10am-11am), avg daily GMV, avg daily orders.
Expected pattern: peaks at 10am-12pm and 7pm-9pm when founders are free.
Daily Revenue Chart (30-day strip)
Type: Area chart with day-over-day comparison. X-axis: 30 days. Y-axis: daily GMV.
Two lines: current period (solid) + same period last month (dashed). Same x-axis (day 1-30).
Hover: date, GMV, orders count, vs same day last month (Rs +/- and %).
Below chart: 7-day rolling average line always shown in orange.
Margin Analysis Table
Line Item
This Month
Last Month
Change
Notes
Gross Revenue (GMV)
Rs 12.4L
Rs 10.1L
+23%
Total billed to users
GST Collected
Rs 1.9L
Rs 1.5L
+23%
Remitted to govt — not revenue
Platform Net Revenue
Rs 2.1L
Rs 1.7L
+23%
20% of base price
Professional Payouts
Rs 8.4L
Rs 6.8L
+23%
80% of base price
Govt Fee Reimbursements
Rs 0.3L
Rs 0.2L
+15%
At cost — zero margin
SMS Cost (estimated)
Rs 2,400
Rs 2,100
+14%
4 SMS events * volume * Rs 0.30
Payment Gateway (Razorpay ~2%)
Rs 22,000
Rs 18,000
+22%
Approx 2% of GMV
Net Margin
Rs 1.8L
Rs 1.4L
+27%
Platform Rev - SMS - Gateway
Net Margin %
14.4%
14.0%
+0.4pp
Improving as volume scales
Tab 3 — Customers
Acquisition Funnel
Stages: App Install (from UTM data) -> OTP Verified -> Onboarding Completed (situation_tags selected) -> First Service Viewed -> First Order Placed -> Order Completed -> Second Order Placed.
Type: Funnel chart (trapezoid steps). Conversion % at each step.
Time-to-convert: median days between each stage shown below funnel.
UTM Attribution Pie
Segments: organic, referral (user referral codes), pro_referral, SEO (utm_source=svc_page), biz_profile (utm_source=biz_profile_cta), direct.
Table below: each UTM source, users acquired, conversion to first order, revenue attributed.
Pro Conversion Funnel
Free users who viewed U24 (Pro upgrade) -> Started checkout -> Completed. Shows drop-off at each step.
Active Pro users count. Monthly plan vs Annual plan split (donut).
Pro churn: users who let Pro expire in last 30 days. Churn rate as %.
MRR from Pro subscriptions (distinct from retainer MRR).
User Retention Cohort Table
Rows: monthly cohorts (users who placed first order in each month).
Columns: Month 0, Month 1, Month 2 ... Month 12. Each cell: % of cohort who placed an order in that month.
Color coding: green (>40%), yellow (20-40%), red (<20%).
This is the most important retention metric for a marketplace.
LTV Chart
X-axis: months since first order (0-12). Y-axis: cumulative revenue per user.
Two lines: Pro users vs Free users. Shows monetisation gap.
Data: average across all users in each cohort, segmented by Pro status at first order.
Tab 4 — Operations
SLA Compliance Rate
Overall SLA compliance: orders completed before SLA deadline / total completed orders. Large % number with trend.
By service: bar chart. Services sorted by worst SLA compliance first.
By professional: table with columns Professional, Orders, SLA Met %, Avg Days Overdue, Strikes This Month.
SLA breach trend: 30-day area chart of daily SLA breach count.
Dispute Rate
Dispute rate = disputes filed / orders completed. Industry benchmark shown as horizontal line on chart (typical: 3-5%).
By service: which services have highest dispute rates. Early indicator of scope/expectation problems.
Resolution time: avg days from dispute opened to resolved. By outcome (full refund / partial refund / no refund).
Capacity Heatmap
Table: rows = cities, columns = service categories (Registrations, Tax, Compliance, Legal). Cell = utilisation % (current_active_orders / max_concurrent for all professionals in that city+category).
Color: green (<50%), yellow (50-80%), red (>80%), grey (no professionals).
Helps identify where to acquire more professionals.
Tab 5 — Professionals
Top Professionals by GMV
Leaderboard table (masked names — 'CA P.S.' format). Sortable by: GMV, orders, rating, earnings.
Monthly trend sparkline per professional (tiny 4-week bar chart in each row).
New Applications Funnel
This month: submitted -> under_review -> approved -> active (first order received).
Avg time from submission to approval. Comparison vs 72h SLA.
Professional Churn
Professionals who were active last month but not this month (no orders accepted). Churn %.
Reasons (from admin notes on suspension/leave): voluntary_leave, suspended, inactive.
Tab 6 — Growth
Referral Program
User referrals: codes generated, codes used, referral credits issued, orders attributed to referral. Credit-to-order conversion %.
Pro referrals: professional referral codes used, users acquired, first orders placed.
Viral coefficient: avg new users per active referrer (target: >1 for organic growth).
SEO Service Pages
Table: each service slug, page views (from UTM data), CTA clicks, app installs attributed, orders from SEO. Conversion funnel per page.
Renewal Pipeline
Annual renewal tracking: count by status (active/snoozed/renewed/cancelled).
Revenue at risk: sum of service prices for annual renewals due in next 60 days that are not yet renewed.
Renewal conversion rate: renewed / (renewed + cancelled).
analytics_cache Table
Many analytics queries are expensive (full table scans on large orders table). Cache computed metrics daily and provide near-realtime for high-traffic metrics.
Key
Value Type
TTL
Updated By
mrr_current
int (paisa)
1 hour
update-analytics-cache cron (7:05am daily)
arr_current
int (paisa)
1 hour
Same cron
gmv_30d
int (paisa)
1 hour
Same cron
net_revenue_30d
int (paisa)
1 hour
Same cron
top_services_30d
JSONB array
24 hours
Same cron
pro_count_active
int
1 hour
Realtime trigger on professionals update
sla_compliance_rate_30d
numeric(5,2)
24 hours
Same cron
dispute_rate_30d
numeric(5,2)
24 hours
Same cron
hourly_gmv_30d_avg
JSONB (24 buckets)
24 hours
Same cron
cohort_retention
JSONB (12x12 matrix)
7 days
Weekly cron (Sunday 2am)
-- analytics_cache table (add to 001_initial_schema.sql Phase 1):
-- This table is required from Phase 1. Admin /dashboard MRR card reads from it.
CREATE TABLE analytics_cache (
  key         text PRIMARY KEY,
  value       JSONB NOT NULL,
  computed_at timestamptz NOT NULL default now()
);
-- Admin analytics page fetches from cache first:
const cached = await supabase.from('analytics_cache').select('*').in('key', NEEDED_KEYS)
// If cache miss or stale: fall through to live query (slower)
// Client shows 'Data as of [computed_at]' timestamp on each chart
Admin Dashboard (/dashboard) — KPI Row Update
The existing /dashboard KPI row is enhanced. Admin now sees: MRR (from cache), Active Orders (live), Disputes Pending (live badge), Capacity Alert (red if any city >80%), Today Revenue (live from orders WHERE completed_at = today).
New: Today's Revenue card on /dashboard. Shows GMV of orders completed today (live query, not cached). Format: 'Rs X,XXX — N orders'. Updates on page refresh.
New: Weekly Revenue sparkline on /dashboard (tiny 7-bar chart showing last 7 days of daily GMV). Clicking opens /analytics Revenue tab.
MRR card on dashboard shows live MRR (from cache, refreshed hourly) with small arrow indicating vs last month.
40. Admin Authentication — Email + Password + TOTP
Admin (admin.ollvy.com) has financial controls: payouts, refunds, disputes, service activation. Phone OTP is not appropriate — it creates SIM-swap risk and cannot encode role-based access. Recommended: email + password + TOTP (authenticator app) with role-based access control.
Why Not Phone OTP
Admins work on desktop with password managers — email/password is their native credential.
TOTP (Google Authenticator/Authy) cannot be SIM-swapped. SMS OTP can. Admin controls payouts.
Role separation (ops_admin, finance_admin, super_admin) maps naturally to email accounts.
No MSG91 cost for admin logins. Email appears in every audit log — natural accountability.
admin_users Table — Add to Phase 1 Schema
Column
Type
Notes
id
uuid PK
gen_random_uuid()
auth_user_id
uuid UNIQUE NOT NULL
References auth.users(id)
name
text NOT NULL
Display name in audit logs
email
text UNIQUE NOT NULL
Must match Supabase Auth email
role
enum NOT NULL
super_admin | ops_admin | finance_admin
is_active
bool default true
False = access revoked. Checked by middleware on every request.
last_login_at
timestamptz nullable
Updated on each successful session
created_at
timestamptz default now()
Role Permissions
Page / Action
super_admin
ops_admin
finance_admin
/dashboard view
Yes
Yes
Yes
/orders view + reassign
Yes
Yes
No
/disputes resolve + refund
Yes
Yes
No
/quotes confirm price
Yes
Yes
No
/professionals approve/reject/suspend
Yes
Yes
No
/users view + restrict
Yes
Yes
No
/services toggle + builder
Yes
Yes
No
/payouts view + trigger batch
Yes
No
Yes
/invoices view + resend
Yes
Yes
Yes
/analytics all tabs
Yes
Yes
Yes
/fraud review + actions
Yes
Yes
No
/settings edit app_settings
Yes
No
No
Create / deactivate admin_users
Yes
No
No
Login Flow — admin.ollvy.com/login
Step 1 — Email + Password: Supabase signInWithPassword({ email, password }). On failure: 'Invalid email or password.' 3 failures in 10min: account locked 15min.
Step 2 — TOTP Challenge: After password success, if TOTP enrolled (mandatory): 6-digit input. Supabase MFA verifyTOTP. 5 failures: session invalidated, restart.
Step 3 — First Login TOTP Enrollment: New admin accounts redirect to /login/setup-2fa. QR code via Supabase enrollTOTP. Cannot skip — middleware blocks all routes until enrolled.
Session: httpOnly cookie, 8-hour expiry (shorter than pro's 30 days for security).
Middleware (apps/admin/middleware.ts): Every route checks: valid session, admin_users.is_active=true, role permits route. Fails any check: redirect to /login or /unauthorised.
admin_audit_log Table — Add to Phase 1 Schema
Column
Type
Notes
id
uuid PK
admin_user_id
uuid NOT NULL
FK to admin_users.id — actor
action
text NOT NULL
clear_fraud_flag | restrict_user | restore_user | reset_bank_details | force_assign | resolve_dispute | trigger_payout_batch | create_admin_user | deactivate_admin_user
target_type
text NOT NULL
user | professional | order | payout_batch | admin_user
target_id
uuid NOT NULL
Affected row id
notes
text nullable
Required for restrict_user action
created_at
timestamptz default now()
RLS: service_role only. Reads via Next.js server components. Index: CREATE INDEX idx_admin_audit_log_target ON admin_audit_log (target_type, target_id).
Edge Functions
Function
Trigger
Notes
create-admin-user
HTTP POST (super_admin)
Creates Supabase Auth user with email + temp password (24h expiry). Inserts admin_users row. Sends email: 'You have been added as Ollvy admin. Set up 2FA on first login at admin.ollvy.com.'
deactivate-admin-user
HTTP POST (super_admin)
Sets admin_users.is_active=false. Session invalidated on next middleware check.
/settings — Team Management (super_admin only)
Table: name, email, role badge, status (active/inactive), last_login_at. Actions: Invite New Admin, Deactivate, Change Role.
Cannot deactivate your own account — button disabled with tooltip.
All create/deactivate/role-change actions logged to admin_audit_log.
41. Rating & Feedback — Full UX Pathway
The feedback table and avg_rating aggregation are specced in Section 29. This section adds the missing UX pathway: trigger logic, bottom sheet, and edge functions.
Trigger Logic
One-time orders: show bottom sheet when user opens U15 after order.status=completed AND orders.feedback_given=false AND orders.feedback_skipped=false.
Retainer: show on U18 after first billing cycle. Then only if last feedback for this retainer was >6 months ago.
Deep link: order_completed push notification deep links to U15?showRating=true. On mount: show bottom sheet if not yet given/skipped.
Session cap: max one rating prompt per app session. Prompt only for most recently completed order if multiple are unrated.
Rating Bottom Sheet — UI
Slides up from bottom of U15 or U18. Non-blocking — dismissable.
Header: 'How was your experience?' Sub: service name. 5 tap-target stars (min 44x44pt, fill left-to-right).
Comment field: optional, max 300 chars, placeholder 'Tell us more (optional)', character counter. Keyboard-aware.
Submit (primary, disabled until >=1 star selected). Skip text link (always visible).
On Submit: calls submit-feedback, sheet dismisses, toast 'Thank you for your feedback' (2s).
On Skip: calls skip-feedback, sheet dismisses. Will not re-prompt.
Edge Functions
// submit-feedback -- HTTP POST (auth)
// Body: { order_id: uuid, retainer_subscription_id?: uuid,
//         rating: 1|2|3|4|5, comment?: string (max 300 chars) }
// Guards: auth.uid()=order.user_id, order.status=completed,
//         no existing feedback row, rating 1-5, comment<=300
// Action: INSERT INTO feedback; UPDATE orders SET feedback_given=true;
//         DB trigger -> updates service_packages.avg_rating
// skip-feedback -- HTTP POST (auth)
// Body: { order_id: uuid }
// Guard: auth.uid()=order.user_id
// Action: UPDATE orders SET feedback_skipped=true
New Columns
Table
Column
Type
Purpose
orders
feedback_given
bool default false
True after submit-feedback. Prevents re-prompt.
orders
feedback_skipped
bool default false
True after skip-feedback. Prevents re-prompt.
Add to Section 22 — Edge Functions
Function
Trigger
Notes
submit-feedback
HTTP POST (auth)
Inserts feedback row. Guards: owner, completed status, no duplicate, rating 1-5, comment<=300. Sets orders.feedback_given=true. DB trigger updates avg_rating.
skip-feedback
HTTP POST (auth)
Sets orders.feedback_skipped=true. Owner guard only. No feedback row.
42. Admin /services/builder — Steps 0–8 Full Specification
Step 9 (Scope of Work Editor) was fully specced in Section 38. Steps 0-8 were referenced without field-level detail. This section completes all steps. Section 38 remains authoritative.
Builder Overview
URL: admin.ollvy.com/services/builder (new) or /services/[id]/edit (edit existing).
State: held in browser memory across all steps. Single DB write on Step 8 or Step 9 Save.
Progress bar: 10 steps (0-9). Can navigate back to completed steps freely.
Cancel on every step: 'Discard changes?' confirmation modal. Returns to /services.
Step 0 — Tier Group
'Does this service have pricing tiers?' toggle, default off. If off: tier_group_id=null. Proceed to Step 1.
If on: dropdown of existing tier_groups + 'Create new tier group' option.
If tier group selected: 'Tier label for this service' text input (e.g. Silver/Gold/Platinum). Required.
Step 1 — Name & Description
Service Name: required, max 60 chars.
Short Description: required, max 150 chars. Shown on service cards (U08).
Long Description: optional, max 1000 chars. Shown on U09 Service Detail.
Filter Category: required — Registrations | Licensing | Monthly Compliance | Tax Filings | Payroll | Legal.
Order Type: radio — one_time | retainer. Required.
Slug: auto-generated from name. Editable. Must be unique, match /^[a-z0-9-]+$/.
Step 2 — Pricing
Base Price (paisa): required. Helper: 'Enter 249900 for Rs 2,499.'
Govt Fees (paisa): default 0.
GST Rate (%): default 18.
Price Display Note: optional, max 80 chars.
Price Varies By State: toggle (default off). If on: 'Get Quote' CTA instead of 'Book Now', routes to U10-U11.
Live price preview: base + govt fees + GST = total, plus Pro-discounted price.
Step 3 — Workflow Stages
Drag-reorderable stage list. Each stage: Stage Key (slug, required), Stage Label (required), Description (optional), Wait For Govt toggle.
'+ Add Stage' appends card. X removes. Minimum 1 stage. Keys must be unique and match /^[a-z_]+$/.
Default pre-filled: Document Collection -> Processing -> Delivery.
Step 4 — SLA Configuration
Per-stage SLA working days input. Wait For Govt stages show 'Excluded from SLA.'
Live total: 'Total commitment: X working days (excluding govt wait).' Displayed on U09.
Urgency Score: 0-100 slider, default 50. Used by get-recommendations ranking.
Step 5 — Situation Tags
Tag input: type + Enter to add. Removable pills. Suggested from app_settings key=suggested_situation_tags.
Optional. Max 20 tags, 30 chars each, lowercase.
Step 6 — State / Regional Pricing
'State-specific pricing?' toggle, default off. If off: skip to Step 7.
If on: table of State + Base Price (paisa) + Govt Fees (paisa) rows.
Stored in service_state_pricing table (new — see below). create-razorpay-order uses state row if user.state matches.
Step 7 — Service Settings
Recommended For: multi-select business types. Default: all. Controls get-recommendations filtering.
Professional Types: multi-select profession_type enum. Required, min 1. Only matching types auto-assigned.
Retainer only — Digest Fields: GST (liability/input_credit/net_payable), Payroll (employee_count/total_ctc), TDS (amount_deducted/challans_filed), Custom. Populate P12 Key Numbers panel.
is_active toggle: default false. Service visible only when active and qualified professional available.
Step 8 — Preview & Confirm
Full preview of U08 service card and U09 detail view.
Summary table of all Steps 0-7 fields.
Validation across all steps. Missing required: highlight step with red badge.
'Save and Continue to Scope (Step 9)' primary. 'Save without Scope' secondary (scope_ready=false).
Save: single DB transaction INSERT or UPDATE on service_packages.
New Table: service_state_pricing
Column
Type
Notes
id
uuid PK
gen_random_uuid()
service_package_id
uuid NOT NULL
FK service_packages(id) ON DELETE CASCADE
state
text NOT NULL
Matches users.state values
price_base_paisa
int NOT NULL
Overrides service_packages.price_base_paisa for this state
price_govt_fees_paisa
int default 0
Overrides service_packages.price_govt_fees_paisa
RLS: SELECT public. INSERT/UPDATE/DELETE: service_role only.
create-razorpay-order update: query service_state_pricing WHERE service_package_id=X AND state=user.state. If found: use state prices. Log in orders.price_source (new text column, default 'base', values: 'base' | 'state_override').
43. Admin /fraud — Fraud Review Page
Section 35 specifies fraud detection logic. This section adds the admin UI where fraud signals are reviewed and actioned.
Page Basics
URL: admin.ollvy.com/fraud. Access: super_admin and ops_admin only.
Add to admin sidebar under 'Operations', below /disputes.
Sidebar badge: count of fraud_signals WHERE reviewed_at IS NULL. SWR 60s polling.
Tab 1 — Flagged Users
Shows users WHERE fraud_flag=true.
Columns: Phone (masked last 4), Business Name, City, Flag Reason, Flagged At, Orders count, Disputes last 30d.
Actions: (1) Review — side panel with user details. (2) Clear Flag — sets fraud_flag=false, logs admin_audit_log. (3) Restrict Account — sets is_active=false, requires reason text.
Filter: All | Active | Cleared. Default: Active. Sort: Flagged At desc.
Tab 2 — Fraud Signals
All rows from fraud_signals table.
Columns: Signal Type badge (dispute_abuse=red, rapid_refund=orange, self_referral=yellow, duplicate_device=red, rapid_completion=grey), User Phone (masked), Order ID link, Description, Created At, Reviewed.
Actions: Mark Reviewed (sets reviewed_at, reviewed_by). View Order.
Filter: All | Pending | Reviewed. Default: Pending. Bulk: 'Mark All Reviewed'.
Tab 3 — Restricted Accounts
Shows users WHERE is_active=false.
Columns: Phone (masked), Business Name, Restricted At, Restriction Reason (from admin_audit_log), Completed Orders.
Actions: Restore Access (sets is_active=true, logs admin_audit_log). View User.
Note: 'Restricted users can view order history and invoices but cannot place new orders.'
Update Section 14 — Add /fraud to Admin Pages
Page
Purpose
/fraud
Three-tab fraud review: (1) Flagged Users, (2) Fraud Signals queue, (3) Restricted Accounts. ops_admin and super_admin only.
44. Professional Onboarding — Rejected State & Reapply Flow
P06 auto-redirects on approval but the rejected state was not specified. This section adds the rejected display, reason codes, and reapply pathway.
P06 — Rejected State
P06 polling detects professional.status='rejected' and transitions to rejected display.
Heading: 'Application Not Approved'.
Reason codes: CERTIFICATION_INVALID='Your certification could not be verified.' | EXPERIENCE_INSUFFICIENT='We require minimum 2 years of practice experience.' | SERVICE_AREA_OVERSUPPLIED='We have sufficient professionals in your city. We will reach out when capacity opens.' | DOCUMENTS_INCOMPLETE='Required documents were not fully uploaded or were unclear.' | OTHER=[free-text reason string]. If no code: 'We are unable to share the specific reason.'
Reapply note: 'You may submit a new application after [DD MMM YYYY]. Contact support@ollvy.com if this was an error.' Pre-filled email subject: 'Application Review — +91[phone]'.
Reapply button: shown when now() >= reapply_after_date OR reapply_after_date IS NULL. On tap: calls reapply-professional, redirects to P03.
New Columns on professionals
Column
Type
Notes
rejection_reason
text nullable
Free-text reason from admin
rejection_reason_code
text nullable
CERTIFICATION_INVALID | EXPERIENCE_INSUFFICIENT | SERVICE_AREA_OVERSUPPLIED | DOCUMENTS_INCOMPLETE | OTHER
rejected_at
timestamptz nullable
When status was set to rejected
reapply_after_date
timestamptz nullable
now()+30 days on rejection. NULL = immediate. Admin-overrideable from /professionals/[id].
rejection_count
int default 0
Increments per rejection. Shown on admin /professionals/[id].
Updated / New Edge Functions
Function
Change
reject-professional
Updated body: { professional_id, reason?: string, reason_code?: enum }. Sets rejection_reason, rejection_reason_code, rejected_at, reapply_after_date=now()+30d, rejection_count++. SMS: 'Your application was not approved. Log in to pro.ollvy.com to view details and reapply after [date].'
reapply-professional (NEW)
HTTP POST (professional auth). Guard: now() >= reapply_after_date OR IS NULL. Resets: status=pending, clears rejection fields, certifications=pending_review, onboarding_step=0. Creates admin_notification. Returns { redirect: '/onboarding/basics' }.
P06 Routing — Complete
professional.status
P06 Shows
pending
Pending review screen. Polls 60s.
under_review
Under review with submitted_at + 72h estimate. Polls 60s.
approved
Auto-redirect to /dashboard.
rejected
Rejected state: reason, reapply date, support link. Reapply button if eligible.
suspended
'Account suspended. Contact support@ollvy.com.' No reapply option.
45. Empty States, Loading States & Error Handling
These patterns apply across the user app (React Native) and professional panel (Next.js). Claude Code implements these exactly — no independently invented behaviour for error and empty states.
User App — Empty States
Screen
Condition
Display
U14 Order List
No orders ever
Clipboard icon. 'No orders yet.' CTA: 'Explore Services' -> U08.
U14 Order List
Filter, no results
'No orders match this filter.' Link: 'Clear filter'.
U17 Retainer List
No retainers ever
Calendar icon. 'No active retainers.' CTA: 'View retainer services' -> U08 Monthly Compliance.
U21 Compliance Calendar
Profile <60%
Lock icon. 'Complete your profile first.' CTA: 'Complete Profile' -> U23.
U21 Compliance Calendar
Pro, complete, no obligations
Checkmark icon. 'All clear.' 'No upcoming obligations. We'll notify you when something is due.'
U25 Notifications
No notifications ever
Bell icon. 'No notifications yet.' 'We'll notify you about orders, compliance deadlines, and billing.'
U22 My Business
No invoices yet
'Your invoices will appear here after your first order is completed.'
Professional Panel — Empty States
Screen
Condition
Display
P07 Dashboard
Newly approved, no orders
Orientation card (bank gate takes priority): '1. Add bank account. 2. Orders auto-assigned by city and service. 3. Complete work, get paid Monday.' Replaces empty sections.
P08 Order List
No orders ever
'No orders yet.' 'Orders for your services in [city] appear here. Check availability toggle is on.'
P08 Order List
Filter, no results
'No orders match this filter.' Link: 'Clear filter'.
P11 Retainer List
No retainer clients
'No retainer clients yet.'
P13 Earnings
Bank verified, no earnings
'No earnings yet. Earnings appear here after your first completed order.'
Loading States — User App
All list screens (U08, U14, U17, U21, U25): grey animated shimmer skeleton cards. Min 3 rows. Remove when data loads or after 10s (show error state).
U15 Order Detail: skeleton for stage progress bar, docs list, chat tab.
U12/U13 Checkout: price lines show '---' until edge function responds. CTA disabled with spinner. 5s timeout: show error.
U16 Chat: skeleton for last 5 messages. Input box visible immediately.
Loading States — Professional Panel
P07: KPI cards show '--'. P08: 5 skeleton rows. P09: stage stepper greyed, Advance Stage disabled.
All Next.js pages: React Suspense boundaries with skeleton components. No full-page spinner.
Error States — User App
Error
User Message
Action
Network error on list load
'Couldn't load. Check your connection.'
Retry button. Auto-retry after 5s.
Edge function 5xx
'Something went wrong. We're looking into it.'
Retry button.
OTP send failure
'Couldn't send OTP. Try again in a moment.'
Retry button. No countdown on first failure.
OTP rate limited
'Too many attempts. Try again in 10 minutes.'
Countdown timer. CTA disabled.
Razorpay SDK load failure
'Payment unavailable. Try again or contact support.'
Retry + support link.
Payment declined
Razorpay SDK handles natively — do not intercept.
Razorpay native UI.
Webhook delay >5min after payment
'Your payment is processing. We'll notify you shortly.'
Push sent when webhook received.
Document upload failure
'Upload failed. Max 10MB. Try again.'
Re-tap to retry.
Error States — Professional Panel
Error
Display
Page load API error
Next.js error.tsx. 'Something went wrong.' Refresh button. No technical details.
Advance Stage — dispute open
CTA disabled. Tooltip: 'A dispute is open. Resolve it before advancing.'
IFSC lookup failure
Manual entry fields. 'Auto-fill failed. Enter bank details manually.'
File upload >5MB
Inline: 'File too large. Maximum 5MB per file.'
Session expired
Toast: 'Session expired. Redirecting to login.' 2s then /login?reason=expired.
Global Error Boundary & Offline — User App
React Native error boundary (componentDidCatch) wraps entire app. Shows Ollvy logo, 'Something went wrong', 'Restart App' button. No stack trace shown.
Phase 8: wire to Sentry.
Offline (NetInfo from @react-native-community/netinfo): persistent yellow banner (32pt): 'No internet connection.' Non-blocking.
Reconnect: dismiss banner. Re-attempt last pending action once.
Compliance obligations cached in Zustand — show stale with 'Showing cached data' label when offline. All other lists: live only.
v19 Gap Closure Summary
Gap
Fixed In
Admin login/auth — undefined
Section 40: Email+Password+TOTP, admin_users, roles, middleware, admin_audit_log
Rating/feedback UX — unspecced
Section 41: Bottom sheet, submit-feedback + skip-feedback, new columns
Service builder Steps 0-8 — missing
Section 42: All 9 steps field-level spec, service_state_pricing table
Admin /fraud page — absent
Section 43: Three-tab fraud page, signal review, restricted accounts
P06 rejected state — ambiguous
Section 44: Rejected display, reason codes, reapply-professional edge function
Empty/error/loading states — absent
Section 45: All major screens, error boundary, offline detection
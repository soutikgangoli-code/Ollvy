# Ollvy — Complete Reference for Creating a New Service

## IMPORTANT: WHAT CLAUDE NEEDS TO DO

**Everything is already built.** The service page, checkout page, payment flow, order page, questionnaire wizard — all generic. They read from the database and render automatically. Claude does NOT need to create or modify any pages or components.

**Claude only produces CONTENT** in the exact formats below. A developer then pastes each piece into the correct file (marked with `→ GOES INTO:`). That's it — the new service works end-to-end.

### What Claude produces (6-8 pieces of content):

| # | What | Format | Goes Into |
|---|------|--------|-----------|
| A | **DB Migration** — all service data + JSONB content | SQL | New migration file |
| B | **Static Service Config** — fallback content | TypeScript object | `lib/services/data/services-*.ts` |
| C | **Registry Import** — 2 lines | TypeScript | `lib/services/data/index.ts` |
| D | **Fallback Slug** — 1 line | String in array | `lib/data/services.ts` |
| E | **DIY vs Ollvy** — comparison table data | TypeScript object | `components/service/DIYvsOllvy.tsx` |
| F | **Fallback Reviews** — 2+ fake reviews | TypeScript array | `lib/data/fallback-reviews.ts` |
| G | **Questionnaire** (if needed) — questions + step titles | SQL + TypeScript | Migration file + `lib/questionnaire/types.ts` |
| H | **Pre-cursor pricing** (if needed) — slug-specific pricing logic | TypeScript | `checkout/[serviceId]/page.tsx` |

### What already works automatically (NO changes needed):
- `/services/{slug}` — reads from `service_packages` DB row, renders UnifiedServicePage
- `/checkout/{serviceId}` — reads service, shows price breakdown, handles Razorpay
- `/checkout/{serviceId}/eligibility` — reads `service_questionnaires`, runs QuestionnaireWizard
- Payment flow — Razorpay modal → webhook → order status update
- `/orders/{id}` — reads order + stage history + docs + chat, renders OrderPageClient
- Post-payment questionnaire — reads `service_questionnaires`, runs wizard, saves responses

---

## TABLE OF CONTENTS

**Context (how the system works):**
1. [Project Structure](#1-project-structure)
2. [Database Schema](#2-database-schema)
3. [TypeScript Types](#3-typescript-types)
4. [Data Fetching Layer](#4-data-fetching-layer)
5. [Service Page Rendering](#5-service-page-rendering)
6. [Checkout Flow](#6-checkout-flow)
7. [Order Creation Edge Function](#7-order-creation-edge-function)
8. [Payment Webhook](#8-payment-webhook)
9. [Order Summary Page](#9-order-summary-page)
10. [Pre-Questions System](#10-pre-questions-system)
13. [Full User Flow: Pre-Questionnaire → Checkout → Payment → Order Summary](#13-full-user-flow)

**Action (what Claude produces):**
11. [Complete Checklist: Every File to Touch](#11-complete-checklist-every-file-to-touch)
12. [Content Template + GST Registration Reference](#12-content-template--gst-registration-reference)

**Reference:**
15. [Key Files Reference](#15-key-files-reference)

---

## 1. PROJECT STRUCTURE

```
ollvy/
├── supabase/
│   ├── migrations/           # SQL schema + seed data
│   └── functions/            # Deno edge functions (Razorpay, webhooks, etc.)
├── apps/customer/
│   ├── app/(main)/
│   │   ├── services/[slug]/page.tsx        # Service detail page (SSR)
│   │   ├── checkout/[serviceId]/page.tsx   # Checkout page (client)
│   │   ├── checkout/[serviceId]/eligibility/page.tsx  # Pre-payment questions
│   │   └── orders/[id]/page.tsx            # Order detail page (SSR)
│   ├── components/
│   │   ├── service/                        # UnifiedServicePage, BookingPanel, etc.
│   │   ├── checkout/                       # OrderSummaryPanel, AddOnsSection, etc.
│   │   └── questionnaire/                  # QuestionnaireWizard, QuestionField, etc.
│   └── lib/
│       ├── services/          # Static service configs (per-service .ts files)
│       │   ├── types.ts       # ServicePageConfig type
│       │   └── data/
│       │       ├── index.ts   # ★ SERVICE REGISTRY — imports + exports allServices
│       │       ├── services-1-2.ts
│       │       ├── services-3-5.ts
│       │       ├── services-6-9.ts
│       │       └── services-10-14.ts
│       ├── data/
│       │   ├── services.ts    # DB data fetching layer + FALLBACK_SERVICE_SLUGS
│       │   └── fallback-reviews.ts  # ★ Fallback reviews per slug
│       ├── types.ts           # Core TypeScript types
│       ├── questionnaire/     # Question types + validation
│       ├── pre-cursor.ts      # sessionStorage for pre-payment answers
│       ├── utm.ts             # UTM attribution helpers
│       ├── dates.ts           # Completion estimate calculator
│       └── hooks/             # useGTM, usePostHogEvents
```

---

## 2. DATABASE SCHEMA

### 2.1 `service_packages` Table (Full Catalogue)

This is the single source of truth for every service. A new service = a new row here.

```sql
CREATE TABLE service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,               -- URL slug: 'gst-registration'
  short_name TEXT,                          -- Abbreviated name for UI
  short_description TEXT NOT NULL,
  long_description TEXT,
  tagline TEXT,                             -- One-liner under H1
  category TEXT,                            -- 'Registrations', 'GST', 'Tax', etc.
  
  -- Pricing (all in paisa, 1 rupee = 100 paisa)
  price_base_paisa INT NOT NULL,            -- Ollvy fee
  price_govt_fees_paisa INT DEFAULT 0,      -- Government fee
  price_mrp_paisa INT DEFAULT 0,            -- Strikethrough MRP
  price_gst_rate INT DEFAULT 18,            -- GST percentage
  price_display_note TEXT,
  price_varies_by_state BOOLEAN DEFAULT false,
  govt_fee_label TEXT,
  govt_fee_note TEXT,
  
  -- Categorization
  filter_category_id UUID REFERENCES service_filter_categories(id),
  tier_group_id UUID REFERENCES service_tier_groups(id),
  tier_label TEXT,
  
  -- Order config
  order_type order_type NOT NULL DEFAULT 'one_time',
  billing_cycle billing_cycle DEFAULT 'one_time',
  sla_working_days INT DEFAULT 7,
  
  -- Content (JSONB arrays — editable from admin)
  workflow_stages JSONB DEFAULT '[]',       -- Process steps / timeline
  whats_included JSONB DEFAULT '[]',        -- What's included items
  service_risks JSONB DEFAULT '[]',         -- Risk warnings
  profile_personas JSONB DEFAULT '[]',      -- "Who this is for"
  faqs JSONB DEFAULT '[]',                  -- FAQ items
  review_sources JSONB DEFAULT '[]',        -- Source credibility
  unlocks JSONB DEFAULT '[]',               -- "This unlocks" items
  review_keyword_chips JSONB DEFAULT '[]',  -- Review summary chips
  related_slugs JSONB DEFAULT '[]',         -- Related service slugs
  service_explainer JSONB,                  -- "What is X?" section
  
  -- Variants and Addons (JSONB arrays)
  variants JSONB,                           -- [{id, label, sublabel, priceAdjustment, govtFeeAdjustment}]
  default_variant_id TEXT,
  addons JSONB,                             -- [{id, name, description, pricePaisa, govtFeePaisa, required, defaultSelected}]
  is_bundle BOOLEAN DEFAULT false,
  
  -- Comparison section
  comparison_without TEXT[],
  comparison_with TEXT[],
  
  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  
  -- Service metadata
  service_type TEXT,                        -- 'One-time', 'Annual', 'Monthly retainer'
  mandatory_for TEXT,
  legal_basis TEXT,
  penalty_for_missing TEXT,
  penalty_color TEXT DEFAULT 'none',        -- 'amber', 'red', 'none'
  retainer_cycle_label TEXT,
  
  -- Display
  situation_tags TEXT[] DEFAULT '{}',
  urgency_score INT DEFAULT 50,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT false,
  
  -- Scope
  scope_included TEXT[] DEFAULT '{}',
  scope_excluded TEXT[] DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  
  -- Ratings
  avg_rating NUMERIC(3,2),
  rating_count INT DEFAULT 0,
  
  -- Feature flags
  show_completion_stats BOOLEAN DEFAULT false,
  show_approval_rate BOOLEAN DEFAULT false,
  
  -- Completion estimates
  has_govt_processing BOOLEAN DEFAULT false,
  completion_min_days INT,
  completion_max_days INT,
  completion_range_text TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.2 `orders` Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id),
  professional_id UUID REFERENCES professionals(id),
  service_package_id UUID NOT NULL REFERENCES service_packages(id),
  order_type order_type NOT NULL,
  status order_status NOT NULL DEFAULT 'pending_assignment',
  city TEXT,
  
  -- Price snapshots (frozen at purchase time)
  price_base_paisa_snapshot INT NOT NULL,
  price_govt_fees_paisa_snapshot INT DEFAULT 0,
  price_gst_paisa_snapshot INT NOT NULL,
  pro_discount_paisa_snapshot INT DEFAULT 0,
  promo_discount_paisa_snapshot INT DEFAULT 0,
  total_paisa_snapshot INT NOT NULL,
  
  -- Payment
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  promo_code_used TEXT,
  referral_credit_used_paisa INT DEFAULT 0,
  variant_id TEXT,
  engagement_agreed_at TIMESTAMPTZ,
  
  -- Questionnaire
  questionnaire_completed_at TIMESTAMPTZ,
  questionnaire_step INT DEFAULT 0,
  
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.3 `service_questionnaires` Table

```sql
CREATE TABLE service_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  question_label TEXT NOT NULL,
  question_type TEXT NOT NULL,     -- text, textarea, number, select, multiselect, radio, date, file
  options JSONB,                   -- [{value, label}]
  validation JSONB,                -- {required, min, max, minLength, maxLength, pattern, minItems, maxItems}
  placeholder TEXT,
  help_text TEXT,
  depends_on JSONB,                -- {question_key, value} or {question_key, values: []} or {question_key, contains: "val"}
  step_number INT DEFAULT 1,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(service_package_id, question_key)
);
```

### 2.4 Supporting Tables

```sql
-- Document requirements per service (skip for consulting services)
CREATE TABLE service_document_templates (
  service_package_id UUID REFERENCES service_packages(id),
  document_key TEXT NOT NULL,
  document_label TEXT NOT NULL,
  stage_key TEXT,
  is_required BOOLEAN DEFAULT true,
  UNIQUE(service_package_id, document_key)
);

-- Per-order document tracking
CREATE TABLE order_documents (
  order_id UUID REFERENCES orders(id),
  document_key TEXT, document_label TEXT,
  stage_key TEXT, is_required BOOLEAN DEFAULT true,
  uploaded_at TIMESTAMPTZ, file_url TEXT, file_name TEXT,
  verified_at TIMESTAMPTZ, rejection_reason TEXT,
  UNIQUE(order_id, document_key)
);

-- Selected addons per order
CREATE TABLE order_addons (
  order_id UUID REFERENCES orders(id),
  addon_id TEXT, addon_name TEXT,
  price_paisa_snapshot INT, govt_fee_paisa_snapshot INT
);

-- Order stage tracking
CREATE TABLE order_stage_history (
  order_id UUID REFERENCES orders(id),
  stage_key TEXT, stage_name TEXT,
  started_at TIMESTAMPTZ, completed_at TIMESTAMPTZ
);

-- User questionnaire responses
CREATE TABLE order_questionnaire_responses (
  order_id UUID REFERENCES orders(id),
  question_key TEXT, response_value JSONB,
  UNIQUE(order_id, question_key)
);
```

---

## 3. TYPESCRIPT TYPES

### 3.1 JSONB Content Shapes (What Goes in DB)

```typescript
// workflow_stages JSONB
interface DBProcessStep {
  step: number
  title: string
  timeline: string           // "Day 0", "Day 1-2"
  body: string               // Newline-separated bullets
  milestone?: string
  isCompletion?: boolean     // true for final step
  visual?: 'checklist' | 'upload' | 'form' | 'calendar' | 'stamp'
}

// whats_included JSONB
interface DBWhatsIncludedItem {
  title: string
  body: string
  comparisonWithout?: string
  comparisonWithOllvy?: string
  mockVisualType?: 'receipt' | 'status' | 'checklist' | 'calendar' | 'arn'
  mockVisualData?: Record<string, string>
}

// service_risks JSONB
interface DBServiceRisk {
  icon: 'clock' | 'mismatch' | 'document' | 'building' | 'alert'
  title: string
  body: string
}

// profile_personas JSONB
interface DBProfilePersona {
  label: string
  detail: string
}

// faqs JSONB
interface DBServiceFaq {
  category: string     // "General", "Process", "Documents", "After Completion", "Pricing"
  q: string
  a: string
}

// service_explainer JSONB
interface DBServiceExplainer {
  steps: Array<{
    step: number
    title: string      // "What it is", "Why you need it", "What happens without it"
    body: string
    visual?: 'info' | 'scale' | 'sparkles' | 'shield' | 'alert'
  }>
}

// review_sources JSONB
interface DBReviewSource { name: string; url: string; description: string }

// unlocks JSONB
interface DBUnlockItem { name: string; explanation: string; price: string; type: 'required' | 'beneficial'; slug: string }

// variants JSONB (optional)
interface DBServiceVariant { id: string; label: string; sublabel: string; priceAdjustment: number; govtFeeAdjustment: number }

// addons JSONB (optional)
interface DBServiceAddon { id: string; name: string; description: string; pricePaisa: number; govtFeePaisa: number; required: boolean; defaultSelected: boolean }
```

### 3.2 Static Service Page Config (`lib/services/types.ts`)

This is the type used in the static config files (`lib/services/data/services-*.ts`):

```typescript
export interface ServicePageConfig {
  slug: string
  title: string               // H1
  tagline: string             // one line under H1
  seoTitle: string
  seoDescription: string      // 150-160 chars
  canonicalUrl: string
  lastReviewed: string
  category: 'Incorporation' | 'GST' | 'Tax' | 'Compliance' | 'Trademark' | 'Registration' | 'Payroll' | 'Licensing'

  explainer: {
    whatItIs: string
    whyYouNeedIt: string
    whatHappensWithout: string
  }

  workflow: WorkflowStep[]     // { step, title, timeframe, description, milestone }
  included: IncludedItem[]     // { title, description, without?, withOllvy? }
  risks: ServiceRisk[]         // { title, description }
  personas: ServicePersona[]   // { title, description }
  faqs: ServiceFaq[]           // { category, q, a }

  govtFees: ServiceTable       // { caption, headers, rows }
  documents: ServiceTable

  relatedServiceSlugs?: string[]
  relatedLearnSlugs?: string[]
}
```

---

## 4. DATA FETCHING LAYER

All services are fetched from the `service_packages` table. No hardcoded service data on the frontend — the static configs in `lib/services/data/` are fallback/SEO-only.

```typescript
// lib/data/services.ts

// Homepage grid
export async function getActiveServices(): Promise<ServiceCardData[]>

// Service detail page — returns full DBServiceConfig with all JSONB content
export async function getServiceBySlugFromDB(slug: string): Promise<{
  service: DBServiceConfig | null
  pricing: ServicePricingData | null
}>

// Related services sidebar
export async function getRelatedServicesBySlugs(slugs: string[]): Promise<RelatedServiceCard[]>
```

---

## 5. SERVICE PAGE RENDERING

### Route: `/services/[slug]/page.tsx`

```typescript
// Server component, ISR with 1-hour revalidation
export const revalidate = 3600

export default async function ServiceDetailPage({ params }) {
  const { service, pricing } = await getServiceBySlugFromDB(slug)
  const [reviews, relatedServices] = await Promise.all([...])
  
  return (
    <>
      <ServiceStructuredData ... />  {/* JSON-LD for Google */}
      <UnifiedServicePage service={service} pricing={pricing} reviews={reviews} relatedServices={relatedServices} />
    </>
  )
}
```

### `UnifiedServicePage` renders these sections:

| Section | Data Source |
|---------|------------|
| Hero + BookingPanel | name, tagline, pricing, variants |
| "How it works" (ProcessStepper) | `workflow_stages` JSONB |
| "What is X?" (ExplainerStepper) | `service_explainer` JSONB |
| "What you get" (WhatsIncluded) | `whats_included` JSONB |
| "Why Ollvy" (DIYvsOllvy) | `DIYvsOllvy.tsx` DATA map |
| "Risks" (ServiceRisks) | `service_risks` JSONB |
| "Who this is for" (ProfilePersonas) | `profile_personas` JSONB |
| Reviews | DB feedback table + fallback-reviews.ts |
| FAQs (Accordion) | `faqs` JSONB |
| Related Services | `related_slugs` JSONB |

---

## 6. CHECKOUT FLOW

### Route: `/checkout/[serviceId]/page.tsx`

1. Fetch service by ID/slug from Supabase
2. If `price_varies_by_state` → redirect to quote request
3. Show order summary with live price breakdown
4. On "Pay Now" → call `create-razorpay-order` edge function
5. Open Razorpay payment modal
6. On success → PaymentSuccessModal → redirect to `/orders/{id}`

### Client-side price calculation:

```typescript
serviceFee = price_base_paisa + variantPriceAdjustment
govtFees = price_govt_fees_paisa + variantGovtFeeAdjustment
addonsTotal = sum(selected addons)
gst = Math.round((serviceFee + addonsTotal) * gstRate / 100)  // GST on service + addons, NOT govt fees
total = serviceFee + govtFees + addonsTotal + gst - promoDiscount
```

---

## 7. ORDER CREATION EDGE FUNCTION

### `supabase/functions/create-razorpay-order/index.ts`

**Request:**
```json
{
  "service_package_id": "uuid",
  "variant_id": "optional-string",
  "addon_ids": ["optional-array"],
  "promo_code": "optional",
  "use_referral_credit": false,
  "engagement_agreed": true
}
```

**Server-side pricing logic:**
1. Fetch service + user in parallel
2. Apply variant adjustments
3. Add addon prices
4. Pro discount: 5% for `subscription_tier='pro'`, one-time only
5. GST: CGST 9% + SGST 9% (same state) or IGST 18% (different state)
6. Apply promo code
7. Apply referral credit (floor: total >= govt_fees + GST)
8. Create Razorpay order → insert `orders` row with `status='pending_payment'`

**Response:**
```json
{
  "ok": true,
  "order_id": "uuid",
  "order_number": "OL-XXXX",
  "razorpay_order_id": "order_xxx",
  "amount": 999900,
  "currency": "INR",
  "key": "rzp_xxx",
  "price_breakdown": { "base": 0, "govt_fees": 0, "gst": 0, "total": 0 }
}
```

---

## 8. PAYMENT WEBHOOK

### `supabase/functions/razorpay-webhook/index.ts`

- `payment.captured` → updates order `pending_payment` → `in_progress`, creates invoice, assigns professional, creates chat
- `payment.failed` → notify customer
- Idempotent via `processed_webhook_events` table

---

## 9. ORDER SUMMARY PAGE

### Route: `/orders/[id]/page.tsx`

Server-side parallel fetch: order, stage history, documents, work docs, invoice, notifications, questionnaire responses, addons.

For a **consulting service**, the order page shows:
- Order status and timeline
- Professional assignment (consultant)
- Chat interface
- No document upload section (no `service_document_templates` = no docs shown)

---

## 10. PRE-QUESTIONS SYSTEM

### Pre-payment: `/checkout/[serviceId]/eligibility/page.tsx`
- Fetches questions from `service_questionnaires`
- Answers stored in `sessionStorage` via `lib/pre-cursor.ts`
- Can affect pricing (e.g., trademark class count)

### Post-payment: `/orders/[id]/questionnaire/page.tsx`
- Multi-step wizard with conditional logic
- Saves to `order_questionnaire_responses`
- Step titles defined in `lib/questionnaire/types.ts` → `STEP_TITLES`

---

## 11. COMPLETE CHECKLIST: EVERY FILE TO TOUCH

This is the exhaustive list. Give Claude this checklist and the content from Section 12, and every file can be updated.

### REQUIRED (service won't work without these):

#### A. Database Migration (new file)
**Create:** `supabase/migrations/YYYYMMDDHHMMSS_add_[service-slug].sql`

Must INSERT into `service_packages` with ALL columns including JSONB content:
- `slug`, `name`, `short_name`, `short_description`, `tagline`, `category`
- `price_base_paisa`, `price_govt_fees_paisa`, `price_mrp_paisa`, `sla_working_days`
- `billing_cycle`, `order_type`, `is_active`, `display_order`, `urgency_score`
- `scope_included`, `scope_excluded`, `deliverables`
- `seo_title`, `seo_description`, `canonical_url`
- `service_type`, `mandatory_for`, `legal_basis`, `penalty_for_missing`, `penalty_color`
- `service_explainer` (JSONB)
- `workflow_stages` (JSONB)
- `whats_included` (JSONB)
- `service_risks` (JSONB)
- `profile_personas` (JSONB)
- `faqs` (JSONB)
- `review_sources` (JSONB)
- `unlocks` (JSONB)
- `review_keyword_chips` (JSONB)
- `related_slugs` (JSONB)
- `show_completion_stats`, `show_approval_rate`
- `has_govt_processing`, `completion_min_days`, `completion_max_days`, `completion_range_text`

Use `ON CONFLICT (slug) DO UPDATE SET ...` pattern.

If the service has pre/post-payment questions, also INSERT into `service_questionnaires`.

#### B. Static Service Config (new file)
**Create:** `apps/customer/lib/services/data/services-15-16.ts` (or next available number)

Export a `ServicePageConfig` object. See Section 12 for complete example.

#### C. Service Registry
**Edit:** `apps/customer/lib/services/data/index.ts`

```typescript
// Add import
import { yourNewService } from './services-15-16'

// Add to allServices array
export const allServices: ServicePageConfig[] = [
  // ... existing services
  yourNewService,  // ← ADD
]
```

#### D. Fallback Slug
**Edit:** `apps/customer/lib/data/services.ts`

Add slug to `FALLBACK_SERVICE_SLUGS` array:
```typescript
const FALLBACK_SERVICE_SLUGS = [
  // ... existing slugs
  'your-new-service-slug',  // ← ADD
]
```

#### E. DIY vs Ollvy Comparison
**Edit:** `apps/customer/components/service/DIYvsOllvy.tsx`

Add entry to the `DATA` map:
```typescript
export const DATA: Record<string, DIYData> = {
  // ... existing services
  'your-new-service-slug': {
    off_stat: 'X hrs of your time. No deadline. No accountability.',
    on_stat: 'Save X hrs + ₹Y,000 in wasted effort.',
    on_date_label: 'Guaranteed by',  // or 'Done by', 'Filed by'
    rows: [
      { task: '...', own: '...', ollvy_head: '...', ollvy_badge: '...' },
      // 4-5 rows, last row is always "What it actually costs"
      // Use {{GUARANTEE}} placeholder — replaced with actual date at runtime
    ],
  },
}
```

#### F. Fallback Reviews
**Edit:** `apps/customer/lib/data/fallback-reviews.ts`

Add 2+ reviews:
```typescript
export const fallbackReviews: Record<string, FallbackReview[]> = {
  // ... existing services
  'your-new-service-slug': [
    { rating: 5, comment: 'Specific achievement. No generic praise.', date: 'April 2026', name: 'Full Name' },
    { rating: 5, comment: 'Another specific outcome.', date: 'March 2026', name: 'Full Name' },
  ],
}
```

### OPTIONAL (only if applicable):

#### G. Pre-Payment Question Step Titles
**Edit:** `apps/customer/lib/questionnaire/types.ts`

```typescript
export const STEP_TITLES = {
  // ... existing services
  'your-new-service-slug': {
    1: { title: 'Step 1 Title', description: 'Step 1 description' },
    2: { title: 'Step 2 Title', description: 'Step 2 description' },
  },
}
```

#### H. Document Checklist Path
**Edit:** `apps/customer/components/service/UnifiedServicePage.tsx` (line ~50)

```typescript
const documentChecklistPaths: Record<string, string> = {
  // ... existing
  'your-new-service-slug': '/tools/documents/your-service',  // ← ADD if you have a docs page
}
```

#### I. Checkout Slug-Specific Logic
**Edit:** `apps/customer/app/(main)/checkout/[serviceId]/page.tsx`

Only needed if your service has pre-cursor answers that affect pricing (like trademark class count).

#### J. Services Badge
**Edit:** `apps/customer/components/landing/ServicesSimplified.tsx`

```typescript
// Add badge assignment if desired
if (slug === 'your-new-service-slug') return 'New'  // or 'Popular', 'Annual'
```

---

## 12. CONTENT TEMPLATE + GST REGISTRATION REFERENCE

Below is the exact content format for **every piece** a new service needs. Each section is labelled with **→ GOES INTO: [file path]** so you know exactly where to paste it. The GST Registration example shows real, production content in each format.

**INSTRUCTIONS FOR CLAUDE**: When asked to create content for a new service, produce all sections below (12A through 12G) with the new service's content. Use the GST Registration examples as your format reference — match the structure exactly. The developer will paste your output into the correct files.

### 12A. Database Migration SQL

**→ GOES INTO:** `supabase/migrations/YYYYMMDDHHMMSS_add_[slug].sql`
**→ FORMAT:** SQL UPDATE (or INSERT for brand new services)
**→ WHAT IT DOES:** Seeds all service content into the `service_packages` table as JSONB columns

**GST Registration example (actual production content):**

```sql
UPDATE service_packages SET
  tagline = 'Your GSTIN, applied for and obtained. We handle every step.',
  short_description = 'Get your GSTIN within 7 working days. CA assigned same day, ARN shared within 24 hours of filing.',
  service_explainer = '{"steps":[{"step":1,"title":"What it is","visual":"info","body":"GST registration gives you a 15-digit GSTIN under the CGST Act, 2017. It authorises you to collect GST from customers, claim Input Tax Credit on purchases, and file GST returns."},{"step":2,"title":"Why you need it","visual":"sparkles","body":"Mandatory if your turnover exceeds Rs 40 lakh (Rs 20 lakh for services, Rs 10 lakh in special category states), for any inter-state supply, or if you sell on any e-commerce platform. Even below the threshold, being registered lets your B2B clients claim ITC on your invoices - without it, you are harder to work with than a registered competitor."},{"step":3,"title":"What happens without it","visual":"alert","body":"Operating without mandatory registration is tax evasion. Penalty is 100% of tax due plus Rs 10,000 minimum. You cannot claim ITC on your own purchases, cannot generate e-way bills, and platforms like Amazon and Flipkart will not onboard you."}]}'::jsonb,
  workflow_stages = '[{"step":1,"title":"Answer 5 questions - we build your checklist","timeline":"Day 0","body":"Business type, state, turnover estimate, supply type (goods/services/both), and whether you need voluntary registration. CA assigned within 4 hours. They generate a specific document checklist - not the standard 20-item government list.","visual":"checklist","milestone":"CA assigned, personalised checklist sent"},{"step":2,"title":"Upload documents through the app","timeline":"Day 0-1","body":"Upload directly from your phone. CA reviews every document before filing - blurry Aadhaar, address mismatch, wrong format - caught here, not after the officer raises a query.","visual":"upload","milestone":"Documents verified by CA"},{"step":3,"title":"Application filed - ARN in 24 hours","timeline":"Day 1-2","body":"CA files GST REG-01 on the GSTN portal. Application Reference Number generated immediately on submission and shared in your app the same day. You can verify status yourself at gstn.gov.in.","visual":"form","milestone":"ARN generated and sent to your app"},{"step":4,"title":"Officer query handled (if applicable)","timeline":"Day 3-5","body":"GST officers request clarifications in approximately 20% of cases, typically for Aadhaar verification or address proof. Your CA responds within 24 hours. Included in scope - no extra charge.","visual":"form","milestone":"Query responded"},{"step":5,"title":"GSTIN issued","timeline":"Day 5-7","body":"Permanent - no renewal, no expiry as long as you file returns. Compliance calendar updated automatically with your first GSTR-1 (11th of next month) and GSTR-3B (20th of next month) due dates.","visual":"stamp","milestone":"GSTIN active on GSTN portal","isCompletion":true}]'::jsonb,
  whats_included = '[{"title":"CA handles the GSTN portal - all 23 fields","body":"GST REG-01 has 23 fields across 5 tabs. Your CA completes the entire form. You answer 5 questions in the app.","comparisonWithout":"23 fields, 5 tabs, 3-4 hours on government portal","comparisonWithOllvy":"5 questions, approximately 4 minutes"},{"title":"ARN shared same day - track it yourself","body":"ARN is generated on submission and shared immediately. You can verify status on the GSTN portal yourself - you do not have to take our word for it."},{"title":"Officer queries handled - no extra charge","body":"If the GST officer requests clarification, your CA responds within 24 hours. Part of the service."},{"title":"Compliance calendar updated automatically","body":"GSTR-1 and GSTR-3B due dates appear in your calendar the moment GSTIN is issued. Nothing to set up manually."}]'::jsonb,
  service_risks = '[{"icon":"mismatch","title":"Address proof mismatch","body":"The business address on all documents must match exactly - building name, floor, area, and PIN code. Your CA checks every document for consistency before filing."},{"icon":"alert","title":"Aadhaar OTP fails","body":"GST registration requires Aadhaar-based authentication. If the mobile linked to Aadhaar is old or inactive, OTP fails. This must be fixed at an Aadhaar enrolment centre. We verify this upfront."},{"icon":"clock","title":"Already past threshold","body":"If your turnover has crossed the mandatory limit and you are not yet registered, you are liable for 100% of unpaid tax plus Rs 10,000 minimum penalty. Registering now stops the liability from growing."}]'::jsonb,
  profile_personas = '[{"label":"First GST registration","detail":"Never done this before. We explain what each document is for and why it is needed."},{"label":"Turnover just crossed threshold","detail":"You waited until legally required. Now we register you quickly."},{"label":"Voluntary registration","detail":"Below threshold but want to issue GST invoices to B2B clients. Completely legal."},{"label":"Home as principal place of business","detail":"Fully legal. We verify your electricity bill matches before filing."}]'::jsonb,
  faqs = '[{"category":"General","q":"When is GST registration mandatory?","a":"When aggregate turnover crosses Rs 40 lakh (Rs 20 lakh for service providers, Rs 10 lakh for special category states). Also mandatory for any inter-state supply regardless of turnover, and for all e-commerce sellers from day one."},{"category":"General","q":"Can I register voluntarily if I am below the threshold?","a":"Yes. Voluntary registration lets you issue GST invoices and claim ITC on purchases. Cannot be cancelled for at least one year from date of registration."},{"category":"Process","q":"What is an ARN and why does it matter?","a":"Application Reference Number - generated the moment your application is submitted. You can track status on the government portal yourself without waiting for updates from us."},{"category":"Process","q":"What if the officer raises a query?","a":"Your CA responds within 24 hours. Included in the service. Most queries are resolved in one reply."},{"category":"Documents","q":"What documents do I need?","a":"Depends on your business type. Sole proprietor: PAN, Aadhaar, address proof, bank statement. Pvt Ltd: same, plus Certificate of Incorporation, board resolution, and director PANs. We send a personalised checklist."},{"category":"After Completion","q":"What are my obligations after getting GSTIN?","a":"GSTR-1 by 11th of every month (outward supplies), GSTR-3B by 20th (net tax payment). Nil returns required even if there are no transactions. GSTR-9 annual return by December 31. All deadlines added to your compliance calendar automatically."}]'::jsonb
WHERE slug = 'gst-registration';
```

**For a brand new service, use INSERT instead of UPDATE:**

```sql
INSERT INTO service_packages (
  slug, name, short_name, short_description, tagline, category,
  price_base_paisa, price_govt_fees_paisa, price_mrp_paisa, price_gst_rate,
  sla_working_days, billing_cycle, order_type, is_active, display_order, urgency_score,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  has_govt_processing,
  scope_included, scope_excluded, deliverables,
  seo_title, seo_description, canonical_url,
  show_completion_stats, show_approval_rate,
  service_explainer, workflow_stages, whats_included, service_risks,
  profile_personas, faqs, review_sources, unlocks,
  review_keyword_chips, related_slugs
) VALUES (
  'your-new-slug',
  'Service Name',
  'Short Name',
  'Short description shown on service cards.',
  'Tagline shown under H1 on service page.',
  'Tax',   -- or 'Registrations', 'Compliance', 'Licensing', etc.
  899900,  -- ₹8,999 in paisa
  0,       -- govt fee in paisa (0 for consulting)
  0,       -- MRP in paisa (0 if no strikethrough)
  18,      -- GST rate
  7,       -- SLA working days
  'one_time', 'one_time', true, 20, 60,
  'One-time', 'Mandatory for...', 'Legal basis...', 'Penalty...', 'red',
  false,
  ARRAY['Scope item 1', 'Scope item 2'],
  ARRAY['Excluded item 1'],
  '["Deliverable 1", "Deliverable 2"]'::jsonb,
  'SEO Title | Ollvy', 'Meta description 150-160 chars.',
  'https://www.ollvy.com/services/your-new-slug',
  false, false,
  -- JSONB content (same format as GST example above)
  '{"steps":[...]}'::jsonb,   -- service_explainer
  '[...]'::jsonb,              -- workflow_stages
  '[...]'::jsonb,              -- whats_included
  '[...]'::jsonb,              -- service_risks
  '[...]'::jsonb,              -- profile_personas
  '[...]'::jsonb,              -- faqs
  '[...]'::jsonb,              -- review_sources
  '[...]'::jsonb,              -- unlocks
  '["✓ Chip 1","✓ Chip 2"]'::jsonb,  -- review_keyword_chips
  '["related-slug-1","related-slug-2"]'::jsonb  -- related_slugs
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, short_name = EXCLUDED.short_name,
  -- ... (update all fields, same pattern as existing migrations)
  updated_at = now();
```

### 12B. Static Service Config (TypeScript)

**→ GOES INTO:** `apps/customer/lib/services/data/services-[N].ts` (create new file or add to existing)
**→ FORMAT:** TypeScript object matching `ServicePageConfig` type
**→ WHAT IT DOES:** Fallback content used when DB is unavailable + SEO content for static generation

**GST Registration example (actual production content):**

```typescript
// File: apps/customer/lib/services/gst-registration.ts

import { ServiceConfig } from '../services'

export const gstRegistration: ServiceConfig = {
  slug: 'gst-registration',
  name: 'GST Registration',
  shortName: 'GST Reg',
  category: 'Registrations',
  tagline: 'Your GSTIN, applied for and obtained. We handle every step.',

  ollvyFee: 1499,
  govtFee: undefined,
  mrp: 5000,

  slaDays: 7,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Businesses above ₹40L turnover (₹20L for services)',
  legalBasis: 'CGST Act 2017, Section 22',
  penaltyForMissing: '100% of tax due + ₹10,000 minimum',
  penaltyColor: 'red',

  seoTitle: 'GST Registration Online India - GSTIN in 7 Days | ₹8,999 | Ollvy',
  seoDescription: 'Get your GSTIN in 7 working days. No government fee. Fixed price ₹8,999. Ollvy CA assigned same day. ARN shared within 24 hours of filing.',
  canonicalUrl: 'https://www.ollvy.com/services/gst-registration',

  processSteps: [
    {
      step: 1,
      title: 'Answer 5 questions - we build your personalised checklist',
      timeline: 'Day 0',
      body: "Business type, state, turnover, supply type, voluntary registration\nOllvy CA assigned within 4 hours\nPersonalised checklist generated. Not the standard 20-item govt list\nSole proprietor with domestic sales? 4 documents, not 20",
      visual: 'checklist',
      milestone: 'Ollvy CA assigned, personalised checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeline: 'Day 0-1',
      body: 'Upload directly in the app, phone photos accepted\nOllvy CA reviews every document before filing\nBlurry Aadhaar, mismatched address, wrong format. Caught here, not after officer query',
      visual: 'upload',
      milestone: 'Documents verified by Ollvy CA',
    },
    {
      step: 3,
      title: 'Application filed - ARN in 24 hours',
      timeline: 'Day 1-2',
      body: "GST REG-01 filed on GSTN portal\nARN generated immediately, shared in app same day\nVerify status yourself: gstn.gov.in → Search Taxpayer → Search by ARN",
      visual: 'form',
      milestone: 'ARN generated - sent to your app',
    },
    {
      step: 4,
      title: 'If an officer query arrives, Ollvy CA handles it',
      timeline: 'Day 3-5 (if applicable)',
      body: "Officers may request clarifications within 7 days\nOllvy CA responds within 24 hours. Included, no extra charge\nCommon queries: Aadhaar verification, address proof mismatch. Both resolvable",
      visual: 'form',
    },
    {
      step: 5,
      title: 'GSTIN issued',
      timeline: 'Day 5-7',
      body: "GSTIN issued. Permanent, no renewal, no expiry\nDelivered to app immediately\nCompliance calendar auto-updated: GSTR-1 (11th) and GSTR-3B (20th) due dates added",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'GSTIN active on GSTN portal',
    },
  ],

  whatsIncluded: [
    {
      title: 'Ollvy CA handles the GSTN portal - all 23 fields',
      body: "The government form has 23 fields across 5 tabs and times out constantly\nOllvy CA fills the whole thing. You answer 5 questions in the app",
      comparisonWithout: '23 fields · 5 tabs · 3-4 hours on GSTN portal',
      comparisonWithOllvy: '5 questions in app · ~4 minutes',
      mockVisualType: 'status',
      mockVisualData: {
        label: 'GST REG-01 Application',
        row1: 'Business details - complete ✓',
        row2: 'Promoter/Partner info - complete ✓',
        row3: 'Place of business - complete ✓',
        note: 'All 23 fields handled by Ollvy CA',
      },
    },
    {
      title: 'ARN shared same day - you can track it yourself',
      body: "ARN generated the moment it's submitted, shared in app immediately\nYou can verify status yourself at gstn.gov.in → Search Taxpayer → Search by ARN",
      mockVisualType: 'arn',
      mockVisualData: { arn: 'AA270325014782R', status: 'Application Processing', date: '25 Mar 2025' },
    },
    {
      title: 'Officer queries handled - no extra charge',
      body: "Happens in about 20% of cases. Ollvy CA responds within 24 hours\nIncluded in the service, not an extra charge\nCommon queries: Aadhaar verification, address proof, bank details",
    },
    {
      title: 'Compliance calendar updated automatically',
      body: "GSTIN issued → your first GSTR-1 (11th) and GSTR-3B (20th) due dates appear automatically\nNo manual setup needed",
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'GSTR-1 - Due 11 Apr (outward supplies)',
        row2: 'GSTR-3B - Due 20 Apr (net tax payment)',
        row3: 'GSTR-9 - Due 31 Dec (annual return)',
        note: 'Added to your calendar automatically',
      },
    },
  ],

  serviceRisks: [
    { icon: 'document', title: 'Address proof mismatch', body: "Address on all documents must match exactly\nOfficer flags even minor variations (flat number, society name)" },
    { icon: 'clock', title: 'Aadhaar OTP fails', body: "Aadhaar OTP required. Old or inactive mobile number causes failure\nMust be fixed at an Aadhaar centre, no workaround" },
    { icon: 'alert', title: 'Operating without registration', body: "Above ₹40L turnover (₹20L for services) without registration = 100% tax due + ₹10,000 penalty" },
  ],

  profilePersonas: [
    { label: 'First GST registration', detail: 'Never done this before. We explain what each document is for and why it is needed.' },
    { label: 'Turnover just crossed threshold', detail: 'You waited until legally required. Now we register you quickly.' },
    { label: 'Voluntary registration', detail: 'Below threshold but want to issue GST invoices to B2B clients. Completely legal.' },
    { label: 'Home as principal place of business', detail: 'Fully legal. We verify your electricity bill matches before filing.' },
  ],

  reviewKeywordChips: [
    '✓ GSTIN in 5 days', '✓ Ollvy CA was responsive', '✓ ARN shared same day',
    '✓ No extra charges', '✓ Officer query handled',
  ],

  relatedSlugs: ['gst-monthly', 'pvt-ltd-incorporation', 'business-itr'],

  faqs: [
    { category: 'General', q: 'When is GST registration mandatory?', a: 'When aggregate turnover crosses Rs 40 lakh (Rs 20 lakh for service providers, Rs 10 lakh for special category states). Also mandatory for any inter-state supply regardless of turnover, and for all e-commerce sellers from day one.' },
    { category: 'General', q: 'Can I register voluntarily if I am below the threshold?', a: 'Yes. Voluntary registration lets you issue GST invoices and claim ITC on purchases. Cannot be cancelled for at least one year from date of registration.' },
    { category: 'Process', q: 'What is an ARN and why does it matter?', a: 'Application Reference Number - generated the moment your application is submitted. You can track status on the government portal yourself without waiting for updates from us.' },
    { category: 'Process', q: 'What if the officer raises a query?', a: 'Ollvy CA responds within 24 hours. Included in the service. Most queries are resolved in one reply.' },
    { category: 'Documents', q: 'What documents do I need?', a: 'Depends on your business type. Sole proprietor: PAN, Aadhaar, address proof, bank statement. Pvt Ltd: same, plus Certificate of Incorporation, board resolution, and director PANs. We send a personalised checklist.' },
    { category: 'After Completion', q: 'What are my obligations after getting GSTIN?', a: 'GSTR-1 by 11th of every month (outward supplies), GSTR-3B by 20th (net tax payment). Nil returns required even if there are no transactions. GSTR-9 annual return by December 31. All deadlines added to your compliance calendar automatically.' },
  ],

  reviewSources: [
    { name: 'GST Portal', url: 'https://cbic-gst.gov.in', description: 'Official CBIC GST portal - acts, rules, and notifications' },
    { name: 'CGST Act, 2017', url: 'https://cbic-gst.gov.in/gst-acts.html', description: 'Section 22: Registration thresholds. Section 25: Registration procedure.' },
  ],

  unlocks: [
    { name: 'GST Monthly Filing', explanation: 'GSTR-1 by 11th, GSTR-3B by 20th. Every month. Mandatory.', price: 'From ₹2,999/month', type: 'required', slug: 'gst-monthly' },
    { name: 'GSTR-9 Annual Return', explanation: 'Annual reconciliation. Due Dec 31 every year.', price: '₹4,999', type: 'required', slug: 'gstr-9' },
    { name: 'E-invoicing Setup', explanation: 'Mandatory above ₹5Cr turnover. Ollvy sets it up.', price: '₹3,999', type: 'beneficial', slug: 'e-invoicing' },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}
```

### 12C. Service Registry Import

**→ GOES INTO:** `apps/customer/lib/services/data/index.ts`
**→ FORMAT:** Add import line + add to `allServices` array
**→ WHAT IT DOES:** Registers the service so the frontend knows it exists

**How GST is registered (actual file):**

```typescript
// File: apps/customer/lib/services/data/index.ts
// GST is imported from services-3-5.ts and added to allServices:

import { gstRegistration, gstMonthlyFiling, businessItr } from './services-3-5'

export const allServices: ServicePageConfig[] = [
  pvtLtdIncorporation, llpIncorporation,
  gstRegistration,  // ← GST is here
  gstMonthlyFiling, businessItr,
  // ... more services
]

// For YOUR new service, add:
// import { yourNewService } from './services-15-16'
// Then add yourNewService to the allServices array.
```

### 12D. Fallback Slug

**→ GOES INTO:** `apps/customer/lib/data/services.ts` → `FALLBACK_SERVICE_SLUGS` array
**→ FORMAT:** Add slug string to array
**→ WHAT IT DOES:** Ensures page builds during static generation even if DB is down

**How GST is listed:**

```typescript
// File: apps/customer/lib/data/services.ts

const FALLBACK_SERVICE_SLUGS = [
  'pvt-ltd-incorporation',
  'llp-incorporation',
  'business-pan',
  'gst-registration',   // ← GST is here
  'msme-registration',
  // ... more slugs
  // Add YOUR slug here: 'your-new-slug',
]
```

### 12E. DIY vs Ollvy Comparison Data

**→ GOES INTO:** `apps/customer/components/service/DIYvsOllvy.tsx` → `DATA` map
**→ FORMAT:** Object with `off_stat`, `on_stat`, `on_date_label`, and `rows[]` array
**→ WHAT IT DOES:** Powers the "Why Ollvy" comparison table on the service page
**→ SPECIAL:** `{{GUARANTEE}}` placeholder is replaced with actual guaranteed date at runtime. Last row's `ollvy_head` price is overridden with actual service fee at runtime.

**GST Registration example (actual production content):**

```typescript
// File: apps/customer/components/service/DIYvsOllvy.tsx

export const DATA: Record<string, DIYData> = {
  'gst-registration': {
    off_stat: '14 hrs of your time. No deadline. No accountability.',
    on_stat: 'Save 14 hrs + ₹8,000 in wasted effort.',
    on_date_label: 'Guaranteed by',
    rows: [
      { task: 'Gathering documents', own: ' 3-4 hrs. One mismatch and you\'re back to square one.', ollvy_head: 'AI picks your exact list.', ollvy_badge: '98% go through.' },
      { task: 'Filing the application', own: '4-6 hrs on a portal that gives no error messages.', ollvy_head: 'CA checks every field.', ollvy_badge: 'ARN same day.' },
      { task: 'Getting it done', own: '7 days or 22. No way to know.', ollvy_head: '{{GUARANTEE}}', ollvy_badge: '' },
      { task: 'GST officer query', own: '1 in 5 get one. Wrong reply = restart from scratch.', ollvy_head: 'CA replies in 24 hrs.', ollvy_badge: 'Already included.' },
      { task: 'What it actually costs', own: '₹2,000-5,000. More if anything goes wrong.', ollvy_head: '₹999.', ollvy_badge: 'That\'s it.' },
    ],
  },
  // ... other services
  // Add YOUR entry here in the same format.
  // Note: {{GUARANTEE}} is replaced with the actual guaranteed date at runtime.
  // Note: The last row's ollvy_head price is overridden with the actual service price at runtime.
}
```

### 12F. Fallback Reviews

**→ GOES INTO:** `apps/customer/lib/data/fallback-reviews.ts` → `fallbackReviews` map
**→ FORMAT:** Array of `{ rating, comment, date, name }` objects (minimum 2)
**→ WHAT IT DOES:** Displayed on service page when no real reviews exist in DB. Also used in JSON-LD structured data for Google.
**→ STYLE:** Reviews must be specific and outcome-focused. No generic praise ("great service!"). Mention concrete results, timelines, or things the CA caught.

**GST Registration example (actual production content):**

```typescript
// File: apps/customer/lib/data/fallback-reviews.ts

export const fallbackReviews: Record<string, FallbackReview[]> = {
  'gst-registration': [
    { rating: 5, comment: 'Done in 6 days. They caught a document issue before filing that I would never have noticed. Tracked everything on the app.', date: 'March 2026', name: 'Rajesh Kumar Agarwal' },
    { rating: 5, comment: 'Officer asked for something extra and it was handled without me being involved. Saw it resolved on the dashboard.', date: 'February 2026', name: 'Meenakshi Sundaram' },
  ],
  // ... other services
  // Add YOUR 2+ reviews here. Be specific — mention outcomes, not generic praise.
}
```

### 12G. Checkout Page Content Mapping (NO CODE NEEDED — just understand what powers it)

The checkout page is **fully generic** — it reads from the `service_packages` row and renders automatically. Here's what each DB field powers on checkout:

| Checkout UI Element | DB Field | Example (GST Reg) |
|---------------------|----------|-------------------|
| Page title | `name` | "GST Registration" |
| Back link | `slug` | → `/services/gst-registration` |
| Filing Timeline | `workflow_stages` JSONB | 5-step timeline |
| Documents Required | `service_document_templates` table | PAN, Aadhaar, etc. |
| Scope: What's included | `scope_included` TEXT[] | ["CA handles GSTN portal", "ARN shared same day", ...] |
| Scope: What's excluded | `scope_excluded` TEXT[] | ["GST monthly filing", ...] |
| Service fee | `price_base_paisa` | 899900 (₹8,999) |
| Government fees | `price_govt_fees_paisa` | 0 |
| MRP strikethrough | `price_mrp_paisa` | 0 |
| GST rate | `price_gst_rate` | 18 |
| Variant selector | `variants` JSONB | (none for GST) |
| Add-ons checkboxes | `addons` JSONB | (none for GST) |
| Completion estimate | `sla_working_days` + `has_govt_processing` | 7 days |
| Pre-cursor summary | `service_questionnaires` WHERE `is_pre_payment=true` | (none for GST) |

**For a consulting service** (no documents, no govt fees):
- `price_govt_fees_paisa = 0` → no "Government Fees" line in price breakdown
- No `service_document_templates` rows → no "Documents Required" section
- `scope_included` = what the consultation covers
- `scope_excluded` = what it doesn't (filing, ongoing advisory, etc.)
- `completion_range_text` = "Our consultant will call you within X working hours"

**The checkout page does NOT need any code changes for a new service** unless the service has pre-cursor answers that affect pricing (see Section 13.2 for the 3 services that do).

---

### 12H. Questionnaire (Post-Payment Questions) — OPTIONAL

**→ GOES INTO:** Same migration SQL file (12A) — INSERT into `service_questionnaires` table
**→ STEP TITLES GO INTO:** `apps/customer/lib/questionnaire/types.ts` → `STEP_TITLES` map
**→ FORMAT:** SQL INSERTs for questions + TypeScript object for step titles
**→ WHAT IT DOES:** Collects info from customer after payment. Multi-step wizard with conditional logic.
**→ SKIP IF:** Your service doesn't need to collect structured info (e.g., simple consulting calls)

**GST Registration example (actual production content — 3 steps, 7 questions):**

```sql
-- File: supabase/migrations/20260319204945_add_questionnaire_schema.sql
-- GST Registration has 3 steps with 7 questions:

-- Step 1: Business Type (2 questions)
INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
VALUES
(gst_service_id, 'business_type', 'What type of business entity is this?', 'select',
  '[{"value":"proprietorship","label":"Proprietorship"},{"value":"partnership","label":"Partnership Firm"},{"value":"llp","label":"Limited Liability Partnership (LLP)"},{"value":"pvt_ltd","label":"Private Limited Company"},{"value":"opc","label":"One Person Company (OPC)"},{"value":"huf","label":"Hindu Undivided Family (HUF)"}]'::jsonb,
  '{"required":true}'::jsonb, NULL, 'Select the legal structure of your business', 1, 1),
(gst_service_id, 'trade_name', 'Trade Name (Optional)', 'text', NULL,
  '{"required":false,"maxLength":100}'::jsonb, 'e.g., Sharma Electronics',
  'The name under which you do business (if different from legal name)', 1, 2);

-- Step 2: Business Address (3 questions)
-- principal_address (textarea, required, minLength 20)
-- state (select, required, all Indian states as options)
-- pincode (text, required, pattern "^[1-9][0-9]{5}$")

-- Step 3: Business Activity (2 questions)
-- nature_of_business (multiselect, required, minItems 1)
-- business_activity_description (textarea, required, minLength 50)
```

Step titles are defined in `lib/questionnaire/types.ts`:

```typescript
export const STEP_TITLES = {
  'gst-registration': {
    1: { title: 'Business Type', description: 'Tell us about your business structure' },
    2: { title: 'Business Address', description: 'Where is your business located?' },
    3: { title: 'Business Activity', description: 'What does your business do?' },
  },
  // Add YOUR step titles here if your service has questionnaire steps.
}
```

---

## 13. FULL USER FLOW: PRE-QUESTIONNAIRE → CHECKOUT → PAYMENT → ORDER SUMMARY

This section documents the **complete user journey** so Claude understands exactly how data flows from one step to the next.

### 13.1 THE FLOW (with file connectors)

```
User visits /services/gst-registration
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  SERVICE PAGE                                        │
│  → RENDERS FROM: service_packages DB row (JSONB)     │
│  → COMPONENT: UnifiedServicePage.tsx                 │
│  → BookingPanel shows price + "Book Now" button      │
│  → User clicks "Book Now"                            │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  PRE-PAYMENT QUESTIONNAIRE (if service has one)      │
│  → ROUTE: /checkout/{serviceId}/eligibility          │
│  → FILE: checkout/[serviceId]/eligibility/page.tsx   │
│  → FETCHES: service_questionnaires WHERE             │
│             is_pre_payment = true                    │
│  → If NO pre-payment questions → SKIP to checkout    │
│  → COMPONENT: QuestionnaireWizard (mode="pre_payment")│
│  → On complete: storePreCursorAnswers(slug, answers) │
│    → saves to sessionStorage                         │
│  → Redirects to /checkout/{serviceId}                │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  CHECKOUT PAGE                                       │
│  → ROUTE: /checkout/{serviceId}                      │
│  → FILE: checkout/[serviceId]/page.tsx               │
│  → Fetches service from service_packages (client)    │
│  → Loads pre-cursor answers from sessionStorage      │
│  → Shows: Filing Timeline, Documents Required,       │
│           Scope of Work, Add-ons, Order Summary      │
│  → Live price calculation (variant + addons + GST)   │
│  → Pre-cursor answers can adjust govt fees            │
│    (e.g., trademark class count, PVT LTD capital)    │
│  → Opens auth modal if not logged in                 │
│  → User clicks "Pay Now"                             │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  ORDER CREATION (server-side)                        │
│  → EDGE FN: create-razorpay-order/index.ts           │
│  → Calculates: base + variant + addons - pro         │
│    discount - promo - referral + GST                 │
│  → Creates Razorpay order via API                    │
│  → INSERTs into orders table (status=pending_payment)│
│  → Returns razorpay_order_id + order_id              │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  RAZORPAY PAYMENT MODAL (client-side)                │
│  → Opens Razorpay checkout modal                     │
│  → User completes payment                            │
│  → On success handler:                               │
│    1. Saves pre-cursor answers →                     │
│       order_questionnaire_responses table             │
│    2. clearPreCursorAnswers()                        │
│    3. clearAllAttributionData()                      │
│    4. clearCheckoutState()                           │
│    5. trackPurchase() (GTM)                          │
│    6. Shows PaymentSuccessModal                      │
│  → On dismiss: Shows PaymentRetryModal               │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  PAYMENT SUCCESS MODAL                               │
│  → COMPONENT: PaymentSuccessModal.tsx                │
│  → Shows: ✓ checkmark, amount, order number,        │
│           service name, "GUARANTEED BY {date}"       │
│  → Date from: getCompletionEstimate(slaDays, ...)   │
│  → Auto-redirects to /orders/{id} in 5 seconds      │
│  → Button: "Start Setup"                             │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼  (webhook fires in background)
┌─────────────────────────────────────────────────────┐
│  RAZORPAY WEBHOOK (server-side, async)               │
│  → EDGE FN: razorpay-webhook/index.ts                │
│  → Event: payment.captured                           │
│  → Updates order: pending_payment → in_progress      │
│  → Creates invoice                                   │
│  → Assigns professional                              │
│  → Creates chat conversation                         │
│  → Inserts order_documents from                      │
│    service_document_templates                        │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  ORDER SUMMARY PAGE                                  │
│  → ROUTE: /orders/{id}                               │
│  → SERVER: orders/[id]/page.tsx (fetches all data)   │
│  → CLIENT: OrderPageClient.tsx (renders everything)  │
│  → Shows:                                            │
│    - Order status + progress bar                     │
│    - Professional assignment (name, phone, rating)   │
│    - Timeline (workflow_stages with stage_history)    │
│    - Documents to upload (from order_documents)      │
│    - Post-payment questionnaire (if not completed)   │
│    - Work documents (from professional)              │
│    - Chat with professional                          │
│    - Invoice download                                │
│    - Order summary (price breakdown)                 │
│  → Real-time updates via Supabase channels           │
│  → For CONSULTING: no docs section shown             │
│    (no service_document_templates = no order_docs)   │
└─────────────────────────────────────────────────────┘
```

### 13.2 PRE-PAYMENT QUESTIONNAIRE — DETAILED

**→ FILES INVOLVED:**

| File | Purpose |
|------|---------|
| `checkout/[serviceId]/eligibility/page.tsx` | Route + page component |
| `components/questionnaire/QuestionnaireWizard.tsx` | Multi-step form wizard |
| `components/questionnaire/QuestionField.tsx` | Renders individual fields |
| `components/questionnaire/LivePricePreview.tsx` | Shows price updating in real-time |
| `lib/stores/questionnaire-store.ts` | Zustand store for wizard state |
| `lib/questionnaire/schemas.ts` | Zod validation per step |
| `lib/questionnaire/types.ts` | Types + `STEP_TITLES` map |
| `lib/pre-cursor.ts` | sessionStorage helpers |
| `lib/pricing/calculate-price.ts` | Dynamic pricing from answers |

**→ HOW IT WORKS:**

1. User arrives at `/checkout/{serviceId}/eligibility`
2. Page queries `service_questionnaires` for this service WHERE `is_pre_payment = true`
3. If **0 questions** → immediately redirect to `/checkout/{serviceId}` (skip eligibility)
4. If **questions exist** → render `QuestionnaireWizard` in `mode="pre_payment"`
5. Wizard groups questions by `step_number`, orders by `display_order`
6. Conditional questions shown/hidden via `depends_on` field
7. `LivePricePreview` sidebar updates in real-time as user answers (e.g., trademark class count changes govt fee)
8. On complete → `storePreCursorAnswers(slug, answers)` saves to `sessionStorage`
9. Redirect to `/checkout/{serviceId}`

**→ DATA FLOW:**

```
service_questionnaires table (DB)
    ↓ fetched by QuestionnaireWizard
QuestionnaireWizard (form state)
    ↓ onComplete callback
storePreCursorAnswers() → sessionStorage
    ↓ read on checkout page
getPreCursorAnswers() → preCursorAnswers state
    ↓ affects price calculation
checkout page price breakdown (live preview)
    ↓ after payment success
upserted to order_questionnaire_responses table
    ↓ cleared
clearPreCursorAnswers()
```

**→ GST REGISTRATION EXAMPLE (actual pre-payment questions):**

GST Registration has **no pre-payment questions** (`is_pre_payment` column). It has **post-payment questions** only (7 questions across 3 steps, collected after order creation on the order page).

Services that DO have pre-payment questions (affect pricing):
- `trademark-registration` — class count + applicant type → changes govt fee per class
- `pvt-ltd-incorporation` — authorized capital + number of directors → changes govt fee slab + DSC cost
- `llp-incorporation` — total contribution + number of partners → changes govt fee slab + DPIN cost

**→ SLUG-SPECIFIC PRICING LOGIC in checkout page:**

```typescript
// File: checkout/[serviceId]/page.tsx (lines ~329-379)
// These are the ONLY services with pre-cursor pricing adjustments.
// A new service only needs an entry here IF its pre-cursor answers affect pricing.

if (service.slug === 'trademark-registration' && preCursorAnswers.trademark_class_count) {
  const classCount = Number(preCursorAnswers.trademark_class_count)
  const applicantType = String(preCursorAnswers.applicant_type || '')
  const isDiscountEligible = ['individual', 'proprietorship', 'msme', 'startup'].includes(applicantType)
  govtFeePaisa = (isDiscountEligible ? 450000 : 900000) * classCount
}

if (service.slug === 'pvt-ltd-incorporation' && preCursorAnswers.authorized_capital) {
  const capital = String(preCursorAnswers.authorized_capital)
  const directors = Number(preCursorAnswers.number_of_directors) || 2
  const additionalDSCCost = Math.max(0, directors - 2) * 120000
  const capitalSlabs = { '100000': 799900, '500000': 1000000, '1000000': 1500000, ... }
  govtFeePaisa = (capitalSlabs[capital] ?? 799900) + additionalDSCCost
}

if (service.slug === 'llp-incorporation' && preCursorAnswers.total_contribution) {
  const contribution = String(preCursorAnswers.total_contribution)
  const partners = Number(preCursorAnswers.number_of_partners) || 2
  const additionalDSCCost = Math.max(0, partners - 2) * 120000
  const contributionSlabs = { 'upto_1l': 50000, '1l_to_5l': 200000, ... }
  govtFeePaisa = (contributionSlabs[contribution] ?? 500000) + additionalDSCCost
}
```

### 13.3 CHECKOUT PAGE — DETAILED

**→ FILE:** `apps/customer/app/(main)/checkout/[serviceId]/page.tsx`

**→ WHAT IT RENDERS (in order, two-column layout):**

**Left column:**
1. **Pre-cursor summary card** — If user answered eligibility questions, shows answers with "Edit" button
2. **CheckoutStepper** — Step 1: Review & Pay → Step 2: Documents → Step 3: Track
3. **FilingTimeline** — Visual timeline from `service.workflow_stages`
4. **Documents Required** — `DocumentChecklist` component showing what docs to prepare
5. **Scope of Work** — What's included / excluded (`scope_included`, `scope_excluded`)
6. **Add-ons** — If service has `addons` array, checkbox list for optional items

**Right column (sticky sidebar):**
- **OrderSummarySidebar** — Price breakdown:
  - Service fee (base + variant adjustment)
  - Government fees (+ pre-cursor adjustment)
  - Add-ons total
  - GST (18% on service fee + addons, NOT on govt fees)
  - Promo discount
  - **Total**
  - Promo code input
  - "Pay Now" button

**Mobile: MobileBottomBar** — Collapsed total + "Pay Now" button

**→ CHECKOUT STATE PERSISTENCE:**
- Selections (variant, addons, promo) saved to `sessionStorage` via `saveCheckoutState()`
- Restored on page reload via `getCheckoutState(serviceId)`
- Cleared after successful payment via `clearCheckoutState()`

**→ AUTH FLOW:**
- Auth modal opens automatically on page load if not logged in
- "Pay Now" button also triggers auth if not logged in
- No auth required to VIEW the checkout page — only to PAY

### 13.4 PAYMENT SUCCESS → ORDER PAGE — DETAILED

**→ PAYMENT SUCCESS MODAL:**

**File:** `components/checkout/PaymentSuccessModal.tsx`

Shows after Razorpay `handler` fires:
```
┌──────────────────────────┐
│      ✓ (green circle)     │
│    PAYMENT SUCCESSFUL     │
│        ₹8,999            │
│                          │
│  SERVICE   GST Registration │
│  ORDER ID  OL-1234        │
│  GUARANTEED BY  21 Apr    │
│                          │
│    [Start Setup →]        │
│  Redirecting in 5s...     │
└──────────────────────────┘
```

- `GUARANTEED BY` date computed via `getCompletionEstimate(slaDays, hasGovtProcessing, completionMaxDays, completionRangeText)`
- Auto-redirects to `/orders/{orderId}` after 5-second countdown
- "Start Setup" button also redirects

**→ ORDER SUMMARY PAGE:**

**Server component:** `orders/[id]/page.tsx` — fetches all data in parallel:
```typescript
const [orderResult, stageResult, docsResult, workDocsResult,
       invoiceResult, notificationResult, responsesResult, addonsResult]
  = await Promise.all([...8 queries...])
```

**Client component:** `OrderPageClient.tsx` — renders the full order detail:

**What it shows (in order):**

1. **Header** — Order number, status badge, service name
2. **Round notification banner** — If admin has requested info/docs
3. **Final output banner** — If order has final deliverable ready
4. **Progress section:**
   - Document upload progress bar
   - Questionnaire completion status
   - "Complete your setup" CTA if not done
5. **Timeline** — Workflow stages from `workflow_stages` JSONB, cross-referenced with `order_stage_history` for completion status
   - Each stage shows: completed/current/upcoming state
   - Dates calculated from SLA start date (when customer completes setup)
6. **Documents section** — From `order_documents` table
   - Upload interface per document
   - Verification status (pending/verified/rejected)
   - Real-time updates via Supabase channel subscription
7. **Work documents** — Docs exchanged during the work process
   - Documents FROM professional (for review/signing)
   - Documents FROM customer (uploaded at professional's request)
   - Tagged: `for_signing`, `government_processing`, `final_output`, `informational`
8. **Questionnaire responses** — Shows completed answers in a modal
9. **Chat** — `ChatWindow` component for direct messaging with professional
10. **Order summary** — Collapsible price breakdown

**→ REAL-TIME SUBSCRIPTIONS (auto-update without refresh):**
```typescript
// OrderPageClient subscribes to 4 Supabase channels:
supabase.channel(`order-docs-${orderId}`)       // document uploads/verification
supabase.channel(`order-work-docs-${orderId}`)  // work document exchanges
supabase.channel(`order-${orderId}`)            // order status changes
supabase.channel(`order-stage-history-${orderId}`) // stage progress
```

**→ FOR A CONSULTING SERVICE (no documents, straight to summary):**
- No `service_document_templates` → webhook creates no `order_documents` → order page shows no "Documents" section
- Timeline shows simple stages: "Book" → "Consultant calls" → "Summary delivered"
- `completion_range_text` can show "Our consultant will call you within X working hours"
- Chat is still available for coordination
- Post-payment questionnaire optional (can collect basic info like "What topics do you want to discuss?")

### 13.5 POST-PAYMENT QUESTIONNAIRE — DETAILED

**→ ROUTE:** `/orders/{id}/questionnaire`

**→ FILES INVOLVED:**

| File | Purpose |
|------|---------|
| `orders/[id]/questionnaire/page.tsx` | Route page |
| `components/questionnaire/QuestionnaireWizard.tsx` | Same wizard, `mode="post_payment"` |
| `lib/stores/questionnaire-store.ts` | Loads questions from `service_questionnaires` |
| `lib/questionnaire/types.ts` | `STEP_TITLES` for step labels |

**→ HOW IT WORKS:**

1. After payment, order page shows "Complete your setup" CTA
2. User clicks → goes to `/orders/{id}/questionnaire`
3. Wizard loads questions from `service_questionnaires` WHERE `service_package_id` matches AND `is_active = true`
4. Questions grouped by `step_number`, ordered by `display_order`
5. Answers saved to `order_questionnaire_responses` table (upsert on `order_id, question_key`)
6. On final step → calls `complete_order_questionnaire(order_id)` RPC → sets `questionnaire_completed_at`
7. SLA countdown STARTS when both questionnaire AND documents are complete

**→ GST REGISTRATION POST-PAYMENT QUESTIONS (actual content):**

**Step 1: Business Type** (2 questions)
| Key | Label | Type | Options/Validation |
|-----|-------|------|--------------------|
| `business_type` | What type of business entity is this? | `select` | Proprietorship, Partnership, LLP, Pvt Ltd, OPC, HUF |
| `trade_name` | Trade Name (Optional) | `text` | maxLength: 100 |

**Step 2: Business Address** (3 questions)
| Key | Label | Type | Options/Validation |
|-----|-------|------|--------------------|
| `principal_address` | Principal Place of Business Address | `textarea` | required, minLength: 20 |
| `state` | State | `select` | All 36 Indian states/UTs |
| `pincode` | PIN Code | `text` | required, pattern: `^[1-9][0-9]{5}$` |

**Step 3: Business Activity** (2 questions)
| Key | Label | Type | Options/Validation |
|-----|-------|------|--------------------|
| `nature_of_business` | Nature of Business | `multiselect` | Manufacturer, Trader, Service Provider, Works Contractor, Restaurant, E-commerce, Exporter, Other |
| `business_activity_description` | Describe your main business activity | `textarea` | required, minLength: 50 |

**→ STEP TITLES (in `lib/questionnaire/types.ts`):**
```typescript
'gst-registration': {
  1: { title: 'Business Type', description: 'Tell us about your business structure' },
  2: { title: 'Business Address', description: 'Where is your business located?' },
  3: { title: 'Business Activity', description: 'What does your business do?' },
},
```

**→ CONDITIONAL LOGIC EXAMPLE (from DB):**
```sql
-- Show "pincode" only after "state" is answered
depends_on = '{"question_key": "state"}'::jsonb

-- Show "additional_partners" only if business_type is "partnership" or "llp"
depends_on = '{"question_key": "business_type", "values": ["partnership", "llp"]}'::jsonb
```

**→ FOR A NEW SERVICE, provide:**
1. The questions (key, label, type, options, validation, depends_on, step_number, display_order)
2. The step titles (step number → title + description)
3. SQL INSERT statements for `service_questionnaires`
4. TypeScript entry for `STEP_TITLES` in `lib/questionnaire/types.ts`

---

## 15. KEY FILES REFERENCE

| Purpose | File Path |
|---------|-----------|
| **DB Schema** | `supabase/migrations/20260310120000_initial_schema.sql` |
| **Questionnaire Schema** | `supabase/migrations/20260319204945_add_questionnaire_schema.sql` |
| **Content Migration** | `supabase/migrations/20260406120000_update_service_content.sql` |
| **Seed Services** | `supabase/migrations/20260313120000_seed_frontend_services.sql` |
| **Order Creation** | `supabase/functions/create-razorpay-order/index.ts` |
| **Payment Webhook** | `supabase/functions/razorpay-webhook/index.ts` |
| **Service Detail Page** | `apps/customer/app/(main)/services/[slug]/page.tsx` |
| **Checkout Page** | `apps/customer/app/(main)/checkout/[serviceId]/page.tsx` |
| **Order Page** | `apps/customer/app/(main)/orders/[id]/page.tsx` |
| **UnifiedServicePage** | `apps/customer/components/service/UnifiedServicePage.tsx` |
| **BookingPanel** | `apps/customer/components/service/BookingPanel.tsx` |
| **DIYvsOllvy** | `apps/customer/components/service/DIYvsOllvy.tsx` |
| **Service Data Fetching** | `apps/customer/lib/data/services.ts` |
| **Fallback Reviews** | `apps/customer/lib/data/fallback-reviews.ts` |
| **Service Registry** | `apps/customer/lib/services/data/index.ts` |
| **Service Type Defs** | `apps/customer/lib/services/types.ts` |
| **Core Types** | `apps/customer/lib/types.ts` |
| **Questionnaire Types** | `apps/customer/lib/questionnaire/types.ts` |
| **Date/Completion Utils** | `apps/customer/lib/dates.ts` |
| **Example Service Config** | `apps/customer/lib/services/gst-registration.ts` |
| **Landing Badges** | `apps/customer/components/landing/ServicesSimplified.tsx` |

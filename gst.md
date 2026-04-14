# GST Registration — Complete Service Page Content & Schema

This is the full content spec for one Ollvy unified service page. Use it as a template to create any new service.

---

## How a service page works

A service page pulls from **two data sources**:

1. **`lib/services/<slug>.ts`** — The `ServiceConfig` object. Contains: pricing, SLA, process steps, what's included, risks, personas, FAQs, review chips, unlocks, review sources. This is also the seed for the database.
2. **`lib/services/data/services-*.ts`** — The `ServicePageConfig` object. Contains: SEO, explainer text, documents table, govt fees table, and a legacy copy of workflow/included/risks/personas/faqs.

At runtime, the **database** (`service_packages` table) is the source of truth. The TS files are used for seeding and as fallback.

The page also has a **DIY vs Ollvy** comparison defined in `components/service/DIYvsOllvy.tsx` (keyed by slug).

---

## Data source 1: `ServiceConfig` (primary)

**File:** `lib/services/gst-registration.ts`  
**Type:** `ServiceConfig` from `lib/services.ts`

### Schema

```typescript
interface ServiceConfig {
  // Identity
  slug: string                    // URL path: /services/{slug}
  name: string                    // Full name, used in headings
  shortName: string               // Used in sticky bar, chips, section titles
  category: ServiceCategory       // 'Registrations' | 'Licensing' | 'Monthly Compliance' | 'Tax Filings' | 'Payroll' | 'Legal'
  tagline: string                 // One line under the H1

  // Pricing
  ollvyFee: number                // In rupees (not paisa). e.g. 8999
  govtFee?: number                // undefined if no govt fee
  govtFeeLabel?: string           // e.g. "MCA stamp duty"
  govtFeeNote?: string            // Explanation of what the govt fee covers

  // SLA & type
  slaDays: number                 // Working days. 0 for retainers.
  isRetainer: boolean
  retainerCycleLabel?: string     // "per month"
  nextDueDate?: () => string      // Dynamic due date for retainers
  serviceType: 'One-time' | 'Annual' | 'Monthly retainer'
  mandatoryFor: string            // Who must get this
  legalBasis?: string             // Act/Section reference
  penaltyForMissing?: string      // What happens if you don't do it
  penaltyColor: 'amber' | 'red' | 'none'

  // SEO
  seoTitle: string                // <title> tag
  seoDescription: string          // meta description
  canonicalUrl: string

  // Content arrays (these become JSONB in the database)
  processSteps: ProcessStep[]
  whatsIncluded: WhatsIncludedItem[]
  serviceRisks: ServiceRisk[]
  profilePersonas: ProfilePersona[]
  faqs: ServiceFaq[]
  reviewKeywordChips: string[]
  relatedSlugs: string[]
  reviewSources: ReviewSource[]
  unlocks?: UnlockItem[]

  // Feature flags
  showCompletionStats: boolean
  showApprovalRate: boolean
}
```

### Content style rules

**Body text** (in processSteps, whatsIncluded, serviceRisks) uses `\n` to create bullet points. The component renders `\n` as `<ul><li>` bullets. Single-line text stays as a `<p>`.

**Writing tone:**
- Human, not AI. Write like you're explaining it to someone across a table.
- Concise but not telegraphic. Each bullet should be a readable sentence or phrase.
- State what happens. Cut "Your CA will carefully..." — just say what they do.
- No filler: "This is part of the service", "We encourage this", "You don't have to worry".
- Keep facts, cut commentary. If a sentence restates what the title already says, cut it.

---

## GST Registration — Full content

### Core fields

```
slug: 'gst-registration'
name: 'GST Registration'
shortName: 'GST Reg'
category: 'Registrations'
tagline: 'Your GSTIN, applied for and obtained. We handle every step.'

ollvyFee: 8999
govtFee: undefined (no govt fee for GST registration)

slaDays: 7
isRetainer: false
serviceType: 'One-time'
mandatoryFor: 'Businesses above ₹40L turnover (₹20L for services)'
legalBasis: 'CGST Act 2017, Section 22'
penaltyForMissing: '100% of tax due + ₹10,000 minimum'
penaltyColor: 'red'
```

### SEO

```
seoTitle: 'GST Registration Online India - GSTIN in 7 Days | ₹8,999 | Ollvy'
seoDescription: 'Get your GSTIN in 7 working days. No government fee. Fixed price ₹8,999. CA assigned same day. ARN shared within 24 hours of filing.'
canonicalUrl: 'https://www.ollvy.com/services/gst-registration'
```

### processSteps

Rendered by `ProcessStepper.tsx`. Each step shows: numbered tabs at top, icon, timeline badge, title, bulleted body, optional milestone badge.

**Fields per step:**
- `step` — number (1-indexed)
- `title` — the heading
- `timeline` — badge text like "Day 0" or "Day 3-5 (if applicable)"
- `body` — the description. Use `\n` for bullet breaks.
- `visual` — icon type: `'checklist'` | `'upload'` | `'form'` | `'calendar'` | `'stamp'`
- `milestone?` — optional green badge at bottom of step
- `isCompletion?` — `true` on final step. Adds green accent styling.

```
Step 1: "Answer 5 questions - we build your personalised checklist"
  timeline: Day 0
  visual: checklist
  body:
    • Business type, state, turnover, supply type, voluntary registration
    • CA assigned within 4 hours
    • Personalised checklist generated — not the standard 20-item govt list
    • Sole proprietor with domestic sales? 4 documents, not 20
  milestone: "CA assigned, personalised checklist sent"

Step 2: "Upload documents through the app"
  timeline: Day 0-1
  visual: upload
  body:
    • Upload directly in the app — phone photos accepted
    • CA reviews every document before filing
    • Blurry Aadhaar, mismatched address, wrong format — caught here, not after officer query
  milestone: "Documents verified by CA"

Step 3: "Application filed - ARN in 24 hours"
  timeline: Day 1-2
  visual: form
  body:
    • GST REG-01 filed on GSTN portal
    • ARN generated immediately, shared in app same day
    • Verify status yourself: gstn.gov.in → Search Taxpayer → Search by ARN
  milestone: "ARN generated - sent to your app"

Step 4: "If an officer query arrives, your CA handles it"
  timeline: Day 3-5 (if applicable)
  visual: form
  body:
    • Officers may request clarifications within 7 days
    • CA responds within 24 hours — included, no extra charge
    • Common queries: Aadhaar verification, address proof mismatch — both resolvable
  (no milestone)

Step 5: "GSTIN issued"
  timeline: Day 5-7
  visual: stamp
  isCompletion: true
  body:
    • GSTIN issued — permanent, no renewal, no expiry
    • Delivered to app immediately
    • Compliance calendar auto-updated: GSTR-1 (11th) and GSTR-3B (20th) due dates added
  milestone: "GSTIN active on GSTN portal"
```

### whatsIncluded

Rendered in "Everything included" section. Each item has a green checkmark, title, bulleted body, optional comparison boxes, and optional mock visual.

**Fields per item:**
- `title` — the heading
- `body` — description with `\n` for bullets
- `comparisonWithout?` — short text for "Without Ollvy" box
- `comparisonWithOllvy?` — short text for "With Ollvy" box
- `mockVisualType?` — `'receipt'` | `'status'` | `'checklist'` | `'calendar'` | `'arn'`
- `mockVisualData?` — `Record<string, string>` with keys like `label`, `row1`, `row2`, `row3`, `note`

```
Item 1: "CA handles the GSTN portal - all 23 fields"
  body:
    • The government form has 23 fields across 5 tabs and times out constantly
    • Your CA fills the whole thing — you answer 5 questions in the app
  comparisonWithout: "23 fields · 5 tabs · 3-4 hours on GSTN portal"
  comparisonWithOllvy: "5 questions in app · ~4 minutes"
  mockVisualType: status
  mockVisualData:
    label: "GST REG-01 Application"
    row1: "Business details - complete ✓"
    row2: "Promoter/Partner info - complete ✓"
    row3: "Place of business - complete ✓"
    note: "All 23 fields handled by your CA"

Item 2: "ARN shared same day - you can track it yourself"
  body:
    • ARN generated the moment it's submitted, shared in app immediately
    • You can verify status yourself at gstn.gov.in → Search Taxpayer → Search by ARN
  mockVisualType: arn
  mockVisualData:
    arn: "AA270325014782R"
    status: "Application Processing"
    date: "25 Mar 2025"

Item 3: "Officer queries handled - no extra charge"
  body:
    • Happens in about 20% of cases — your CA responds within 24 hours
    • Included in the service, not an extra charge
    • Common queries: Aadhaar verification, address proof, bank details

Item 4: "Compliance calendar updated automatically"
  body:
    • GSTIN issued → your first GSTR-1 (11th) and GSTR-3B (20th) due dates appear automatically
    • No manual setup needed
  mockVisualType: calendar
  mockVisualData:
    row1: "GSTR-1 - Due 11 Apr (outward supplies)"
    row2: "GSTR-3B - Due 20 Apr (net tax payment)"
    row3: "GSTR-9 - Due 31 Dec (annual return)"
    note: "Added to your calendar automatically"
```

### serviceRisks

Rendered in "What could go wrong with GST Reg" section. Each risk has an amber icon, title, and bulleted body.

**Fields per item:**
- `icon` — `'clock'` | `'mismatch'` | `'document'` | `'building'` | `'alert'`
- `title` — the heading
- `body` — description with `\n` for bullets

```
Risk 1: icon=document, "Address proof mismatch"
  body:
    • Address on all documents must match exactly
    • Officer flags even minor variations (flat number, society name)
    • CA reviews for consistency before filing

Risk 2: icon=clock, "Aadhaar OTP fails"
  body:
    • Aadhaar OTP required — old or inactive mobile number causes failure
    • Must be fixed at an Aadhaar centre, no workaround
    • Checked upfront before filing

Risk 3: icon=alert, "Operating without registration"
  body:
    • Above ₹40L turnover (₹20L for services) without registration = 100% tax due + ₹10,000 penalty
    • Registration stops the liability from growing
```

### profilePersonas

Rendered in "We handle the messy situations too" under the Why Ollvy section. Cards with initial letter, label, and detail (detail hidden on mobile).

```
"First GST registration"
  → Never done this before. We explain what each document is for and why it is needed.

"Turnover just crossed threshold"
  → You waited until legally required. Now we register you quickly.

"Voluntary registration"
  → Below threshold but want to issue GST invoices to B2B clients. Completely legal.

"Home as principal place of business"
  → Fully legal. We verify your electricity bill matches before filing.
```

### reviewKeywordChips

Green chips shown above reviews. Short, punchy, start with ✓.

```
✓ GSTIN in 5 days
✓ CA was responsive
✓ ARN shared same day
✓ No extra charges
✓ Officer query handled
```

### faqs

Accordion in the FAQs section. Grouped by category but rendered flat.

**Categories:** General, Process, Documents, After Completion, Pricing

```
General: "When is GST registration mandatory?"
  → When aggregate turnover crosses Rs 40 lakh (Rs 20 lakh for service providers, Rs 10 lakh for special category states). Also mandatory for any inter-state supply regardless of turnover, and for all e-commerce sellers from day one.

General: "Can I register voluntarily if I am below the threshold?"
  → Yes. Voluntary registration lets you issue GST invoices and claim ITC on purchases. Cannot be cancelled for at least one year from date of registration.

Process: "What is an ARN and why does it matter?"
  → Application Reference Number - generated the moment your application is submitted. You can track status on the government portal yourself without waiting for updates from us.

Process: "What if the officer raises a query?"
  → Your CA responds within 24 hours. Included in the service. Most queries are resolved in one reply.

Documents: "What documents do I need?"
  → Depends on your business type. Sole proprietor: PAN, Aadhaar, address proof, bank statement. Pvt Ltd: same, plus Certificate of Incorporation, board resolution, and director PANs. We send a personalised checklist.

After Completion: "What are my obligations after getting GSTIN?"
  → GSTR-1 by 11th of every month (outward supplies), GSTR-3B by 20th (net tax payment). Nil returns required even if there are no transactions. GSTR-9 annual return by December 31. All deadlines added to your compliance calendar automatically.
```

### reviewSources

Shown in "How we reviewed this page" at the bottom. Official government sources only.

```
"GST Portal" → https://cbic-gst.gov.in
  Official CBIC GST portal - acts, rules, and notifications

"CGST Act, 2017" → https://cbic-gst.gov.in/gst-acts.html
  Section 22: Registration thresholds. Section 25: Registration procedure.
```

### unlocks

Shown in "What GST Reg unlocks" section. Cards with name, explanation, price, and type badge.

```
Required: "GST Monthly Filing"
  → GSTR-1 by 11th, GSTR-3B by 20th. Every month. Mandatory.
  → From ₹2,999/month
  → slug: gst-monthly

Required: "GSTR-9 Annual Return"
  → Annual reconciliation. Due Dec 31 every year.
  → ₹4,999
  → slug: gstr-9

Beneficial: "E-invoicing Setup"
  → Mandatory above ₹5Cr turnover. Ollvy sets it up.
  → ₹3,999
  → slug: e-invoicing
```

### Feature flags

```
showCompletionStats: false    // Show "X completed this month" — enable after 10+ orders
showApprovalRate: false       // Show "X% approval rate" — enable after 20+ orders
```

---

## Data source 2: `ServicePageConfig` (documents, govt fees, explainer)

**File:** `lib/services/data/services-3-5.ts`  
**Type:** `ServicePageConfig` from `lib/services/types.ts`

This provides the static tables and SEO explainer that the primary `ServiceConfig` doesn't cover.

### explainer

Collapsed "What is GST Registration?" section below the process stepper.

```
whatItIs:
  GST registration gives you a 15-digit GSTIN under the CGST Act, 2017. It authorises you to collect GST from customers, claim Input Tax Credit on purchases, and file GST returns.

whyYouNeedIt:
  Mandatory if your aggregate turnover exceeds Rs. 40 lakh for goods (Rs. 20 lakh for services, Rs. 10 lakh in special category states), for any interstate supply, or if you sell on any e-commerce platform. Even below the threshold, being registered lets B2B clients claim ITC on your invoices.

whatHappensWithout:
  Operating without mandatory registration is tax evasion. Penalty is 100% of tax due or Rs. 10,000, whichever is higher. You cannot claim ITC on purchases, cannot generate e-way bills, and platforms like Amazon and Flipkart will not onboard you.
```

### documents table

Rendered as an HTML table in the "Documents Required" section.

```
Caption: "Documents Required - GST Registration"
Headers: Document | Sole Proprietor / Individual | Pvt Ltd / LLP

Rows:
  PAN card                    | Owner PAN                           | Company / LLP PAN
  Aadhaar card                | Owner Aadhaar (OTP required)        | Not required at entity level
  Address proof (business)    | Electricity bill (< 2 months old)   | Electricity bill (< 2 months old)
  NOC from property owner     | If premises is rented               | If premises is rented
  Bank account proof          | Cancelled cheque or 3-month stmt    | Cancelled cheque or bank statement
  Business registration proof | Not required (proprietorship)       | Certificate of Incorporation or LLP agreement
  Director/partner PAN        | Not applicable                      | All directors or designated partners
  Board resolution            | Not required                        | Authorising a director to apply
  Passport photo              | Owner photo                         | Authorised signatory photo
```

### govtFees table

Rendered as an accordion FAQ item: "What government fees apply for GST Registration?"

```
Caption: "Government Fees - GST Registration"
Headers: Item | Government Fee | Notes

Rows:
  GST registration (REG-01)          | Nil                                           | No government fee
  Penalty if registering late        | Rs. 10,000 minimum or 100% of unpaid tax      | Whichever is higher
  Late filing fee (non-nil returns)  | Rs. 50/day per return, capped at Rs. 10,000   | Rs. 25 CGST + Rs. 25 SGST
  Late filing fee (nil returns)      | Rs. 20/day per return, capped at Rs. 500      | Rs. 10 CGST + Rs. 10 SGST
```

---

## Data source 3: DIY vs Ollvy comparison

**File:** `components/service/DIYvsOllvy.tsx`  
**Keyed by slug** in the `DATA` object.

This is a toggle table: "Do it yourself" vs "Let Ollvy handle it". Hardcoded per service.

```
off_stat: '14 hrs. No guarantee. No fixed price.'
on_stat: 'Save 14 hrs + ₹8,000.'
on_date_label: 'Guaranteed by'

Rows (task | DIY pain | Ollvy headline | Ollvy badge):

  Gathering documents
    DIY: 3-4 hrs. One mismatch and you're back to square one.
    Ollvy: AI picks your exact list.
    Badge: 98% sail through.

  Filing the application
    DIY: 4-6 hrs on a portal that gives no error messages.
    Ollvy: CA checks every field.
    Badge: ARN same day.

  Getting it done
    DIY: 7 days or 22. No way to know.
    Ollvy: We give you the exact date.
    Badge: Late = free.

  GST officer query
    DIY: 1 in 5 get one. Wrong reply = restart from scratch.
    Ollvy: CA replies in 24 hrs.
    Badge: Already included.

  What it actually costs
    DIY: ₹2,000-5,000. More if anything goes wrong.
    Ollvy: ₹999.
    Badge: That's it.
```

---

## Fallback reviews

**File:** `lib/data/fallback-reviews.ts`

Shown when no real reviews exist for the service yet. 2-3 per service. Must sound like real people — specific details, not generic praise.

```
{ rating: 5, comment: 'Done in 6 days. They caught a document issue before filing that I would never have noticed. Tracked everything on the app.', date: 'March 2026', name: 'Rajesh Kumar Agarwal' },
{ rating: 5, comment: 'Officer asked for something extra and it was handled without me being involved. Saw it resolved on the dashboard.', date: 'February 2026', name: 'Meenakshi Sundaram' },
```

Add your new service's fallback reviews to the `fallbackReviews` object keyed by slug. If no slug-specific reviews exist, `defaultFallbackReviews` is used.

---

## Page route and data fetching

**Route:** `app/(main)/services/[slug]/page.tsx`

This is a Next.js server component. You do NOT need to modify it for a new service. It:
1. Calls `getServiceBySlugFromDB(slug)` — fetches the full service from `service_packages` table
2. Calls `getServiceReviews(service.id)` — fetches real reviews
3. Calls `getRelatedServicesBySlugs(service.relatedSlugs)` — fetches related service cards
4. Renders `<UnifiedServicePage>` with all the data
5. ISR revalidates every 3600 seconds (1 hour)

The page auto-discovers services from the database. If `is_active = true` and the slug exists, the page works.

**Data fetching:** `lib/data/services.ts` → `getServiceBySlugFromDB(slug)`

Queries `service_packages` table and maps DB columns to the `DBServiceConfig` interface. All JSONB fields (workflow_stages, whats_included, service_risks, etc.) are returned as-is and passed to the components.

**Static generation:** `generateStaticParams()` calls `getAllServiceSlugs()` which returns all slugs where `is_active = true`.

---

## Page layout and design

**Component:** `components/service/UnifiedServicePage.tsx`

The page is a single-column layout with a sticky sidebar (desktop) and sticky bottom bar (mobile).

### Visual structure (top to bottom):

```
┌─────────────────────────────────────────────┐
│  HERO                                        │
│  H1: service.name (+ city if geo context)    │
│  Tagline (1 line)                            │
│  Guaranteed by [date] badge                  │
│  [Start Application] CTA button              │
│  Metadata pills: For / Type / Turnaround / ★ │
│  ─── Tab navigation bar ───                  │
│  Process | What's Included | Why Ollvy |     │
│  Risks | Reviews | FAQs                      │
└─────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────┐
│  MAIN CONTENT (left) │  BOOKING PANEL (right)│
│                      │  (sticky sidebar)     │
│  ┌─ Process ───────┐ │  ┌─────────────────┐  │
│  │ ProcessStepper   │ │  │ Price breakdown  │  │
│  │ (tabbed steps)   │ │  │ Guaranteed date  │  │
│  │ "What is X?" btn │ │  │ [CTA button]    │  │
│  └─────────────────┘ │  │ Scope included   │  │
│                      │  │ Scope excluded   │  │
│  ┌─ What's Included┐ │  └─────────────────┘  │
│  │ ✓ title          │ │                      │
│  │   body (bullets)  │ │                      │
│  │   [Without/With]  │ │                      │
│  │   [Mock visual]   │ │                      │
│  └─────────────────┘ │                       │
│                      │                       │
│  ┌─ DIY vs Ollvy ──┐ │                       │
│  │ Toggle table     │ │                       │
│  └─────────────────┘ │                       │
│                      │                       │
│  ┌─ Documents ─────┐ │                       │
│  │ HTML table       │ │                       │
│  └─────────────────┘ │                       │
│                      │                       │
│  ┌─ Why Ollvy ─────┐ │                       │
│  │ Others vs Ollvy  │ │                       │
│  │ Profile personas │ │                       │
│  └─────────────────┘ │                       │
│                      │                       │
│  ┌─ Risks ─────────┐ │                       │
│  │ Amber icon cards │ │                       │
│  └─────────────────┘ │                       │
│                      │                       │
│  ┌─ Unlocks ───────┐ │                       │
│  │ Required/Good    │ │                       │
│  └─────────────────┘ │                       │
│                      │                       │
│  ┌─ Reviews ───────┐ │                       │
│  │ Keyword chips    │ │                       │
│  │ Rating summary   │ │                       │
│  │ Review cards     │ │                       │
│  └─────────────────┘ │                       │
│                      │                       │
│  ┌─ FAQs ──────────┐ │                       │
│  │ Accordion items  │ │                       │
│  │ Govt fees table  │ │                       │
│  └─────────────────┘ │                       │
│                      │                       │
│  ┌─ Related ───────┐ │                       │
│  │ Service cards    │ │                       │
│  └─────────────────┘ │                       │
│                      │                       │
│  ┌─ How We Reviewed┐ │                       │
│  │ Sources + date   │ │                       │
│  └─────────────────┘ │                       │
└──────────────────────┴───────────────────────┘

┌─────────────────────────────────────────────┐
│  FINAL CTA (desktop only)                    │
│  "Get [shortName] done now"                  │
│  Fixed price. Verified CA. Done within X days│
│  [CTA button]                                │
└─────────────────────────────────────────────┘

MOBILE: Sticky bottom bar with price + CTA replaces sidebar
```

### Design system notes:
- **Colors:** Green accent = `hsl(var(--ollvy-green))`, amber = `hsl(var(--ollvy-amber))`
- **Typography:** Headings = font-semibold/bold, mono numbers via `formatWithMonoNumbers()`, uppercase tracking-widest labels for section headers
- **Cards:** `border border-border rounded-xl bg-card` standard pattern
- **Spacing:** Sections separated by `py-16 border-b border-border`
- **Responsive:** `grid-cols-1 lg:grid-cols-[1fr_380px]` — sidebar hidden on mobile, bottom bar shown instead
- **Sticky nav:** Replaces global header when hero scrolls out of view. Tabs scroll to sections.

---

## Database columns mapped

When seeded to the `service_packages` table, the fields map as:

| TypeScript field | DB column | Type |
|---|---|---|
| slug | slug | text |
| name | name | text |
| shortName | short_name | text |
| category | category | text |
| tagline | short_description | text |
| ollvyFee | price_base_paisa | integer (× 100) |
| govtFee | price_govt_fees_paisa | integer (× 100) |
| slaDays | sla_working_days | integer |
| isRetainer | billing_cycle | 'one-time' / 'monthly' / 'yearly' |
| processSteps | workflow_stages | jsonb |
| whatsIncluded | whats_included | jsonb |
| serviceRisks | service_risks | jsonb |
| profilePersonas | profile_personas | jsonb |
| faqs | faqs | jsonb |
| reviewSources | review_sources | jsonb |
| unlocks | unlocks | jsonb |
| reviewKeywordChips | review_keyword_chips | jsonb |
| relatedSlugs | related_slugs | jsonb |
| penaltyForMissing | penalty_for_missing | text |
| penaltyColor | penalty_color | text |
| legalBasis | legal_basis | text |
| mandatoryFor | mandatory_for | text |
| serviceType | service_type | text |
| seoTitle | seo_title | text |
| seoDescription | seo_description | text |
| canonicalUrl | canonical_url | text |

---

## Seed migration pattern (SQL INSERT)

When creating a new service, write a Supabase migration that INSERTs into `service_packages`. Here's the exact column list and format (based on the existing seed migration):

```sql
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  govt_fee_label, govt_fee_note,
  workflow_stages, whats_included, service_risks, profile_personas,
  faqs, review_sources, unlocks, review_keyword_chips, related_slugs
) VALUES (
  'your-slug',
  'Full Service Name',
  'Short Name',
  'Category',
  'Tagline shown under H1',
  'Short description for cards/listings',
  'one_time', 'one_time',        -- or 'retainer', 'monthly'
  899900, 0,                     -- prices in PAISA (₹8,999 = 899900)
  18,                            -- GST rate (always 18)
  7,                             -- SLA in working days
  80,                            -- urgency_score (0-100, affects grid ordering)
  ARRAY['tag1', 'tag2'],         -- situation_tags for matching
  true,                          -- is_active (set true to go live)
  10,                            -- display_order in service grid
  'One-time',                    -- service_type text
  'Who this is mandatory for',
  'Act/Section reference',
  'Penalty text or NULL',
  'red',                         -- penalty_color: 'red', 'amber', or 'none'
  'SEO Title | Ollvy',
  'Meta description under 160 chars',
  'https://www.ollvy.com/services/your-slug',
  'Govt fee label or NULL',
  'Govt fee note or NULL',

  -- workflow_stages (JSONB array)
  '[
    {"step": 1, "title": "...", "timeline": "Day 0", "body": "Line 1\nLine 2", "visual": "checklist", "milestone": "..."},
    {"step": 2, ...}
  ]'::jsonb,

  -- whats_included (JSONB array)
  '[
    {"title": "...", "body": "Line 1\nLine 2", "comparisonWithout": "...", "comparisonWithOllvy": "..."},
    {"title": "...", "body": "...", "mockVisualType": "calendar", "mockVisualData": {"row1": "...", "note": "..."}}
  ]'::jsonb,

  -- service_risks (JSONB array)
  '[
    {"icon": "document", "title": "...", "body": "Line 1\nLine 2"},
    {"icon": "clock", "title": "...", "body": "..."}
  ]'::jsonb,

  -- profile_personas (JSONB array)
  '[
    {"label": "...", "detail": "..."}
  ]'::jsonb,

  -- faqs (JSONB array)
  '[
    {"category": "General", "q": "...", "a": "..."}
  ]'::jsonb,

  -- review_sources (JSONB array)
  '[
    {"name": "...", "url": "https://...", "description": "..."}
  ]'::jsonb,

  -- unlocks (JSONB array)
  '[
    {"name": "...", "explanation": "...", "price": "₹X,XXX", "type": "required", "slug": "..."}
  ]'::jsonb,

  -- review_keyword_chips (text array)
  ARRAY['✓ Chip 1', '✓ Chip 2', '✓ Chip 3'],

  -- related_slugs (text array)
  ARRAY['related-service-1', 'related-service-2']
);
```

**Key rules:**
- Prices are in **paisa** (multiply rupees by 100). ₹8,999 = `899900`.
- Single quotes in text must be escaped as `''` in PostgreSQL.
- `\n` in JSON body strings creates bullet points on the frontend.
- `is_active = true` makes it appear in the grid and enables the `/services/[slug]` route.

---

---

# PART 2: CHECKOUT, QUESTIONNAIRE & POST-PAYMENT FLOW

Everything that happens from CTA click to order completion.

---

## Routing decision — which flow does the user enter?

The CTA button on the service page routes to one of three flows based on service config:

```
Fixed-price service (e.g., GST Registration)
  → /checkout/{serviceId}
  Direct to checkout. No questions before payment.

Questionnaire-based pricing (e.g., Pvt Ltd, LLP, Trademark)
  → /checkout/{serviceId}/eligibility
  Pre-payment questions that affect govt fee. Then checkout.

State-dependent pricing (e.g., services where govt fee varies by state)
  → /quote/request/{serviceId}
  User picks state, gets quote, then checkout.
```

**Which services go where:**
- Hardcoded in `BookingPanel.tsx` and `UnifiedServicePage.tsx`:
  ```
  priceVariesByQuestionnaire = ['trademark-registration', 'pvt-ltd-incorporation', 'llp-incorporation']
  ```
- `service.priceVariesByState` flag from database determines quote flow
- Everything else goes direct to checkout

**URL params passed:** `?variant={id}&addons={id1,id2}` from BookingPanel selections

---

## Flow 1: Eligibility page (pre-payment questionnaire)

**Route:** `app/(main)/checkout/[serviceId]/eligibility/page.tsx`

**What it does:**
1. Fetches service by ID/slug
2. Queries `service_questionnaires` table where `is_pre_payment = true`
3. If no pre-payment questions exist → auto-redirects to `/checkout/{serviceId}`
4. If questions exist → shows `QuestionnaireWizard` with live price preview

**Layout:** Multi-step form on left, live price preview on right (desktop) or sticky footer (mobile).

**On completion:** Answers stored in sessionStorage via `storePreCursorAnswers(serviceSlug, answers)`, then redirects to `/checkout/{serviceId}`.

**Edit mode:** `?edit=true` preserves existing answers for modification (user clicked "Edit" on checkout page).

### Pre-payment questions example: Private Limited Company

```sql
-- Step 1: Company Details (pre-payment, affects price)
question_key: 'number_of_directors'
  label: 'How many directors will the company have?'
  type: select
  options: [2, 3, 4, 5 Directors]
  is_pre_payment: true   ← shown BEFORE payment
  help_text: 'Minimum 2 required. More directors = more document requirements.'

question_key: 'authorized_capital'
  label: 'What authorized capital do you want?'
  type: select
  options: [Rs 1L, 5L, 10L, 25L, 50L, 1Cr, Other]
  is_pre_payment: true   ← shown BEFORE payment
  help_text: 'Government fees depend on this amount.'

-- Step 1 also has company name preferences, but NOT pre-payment:
question_key: 'company_name_preference_1'
  label: 'Company Name Preference 1'
  type: text
  is_pre_payment: false   ← shown AFTER payment

question_key: 'company_name_preference_2'
  label: 'Company Name Preference 2'
  type: text
  is_pre_payment: false   ← shown AFTER payment
```

### Dynamic pricing from pre-payment answers

**File:** `lib/pricing/calculate-price.ts`

Single source of truth. Prices are in **paisa** (₹1 = 100 paisa).

```typescript
// Trademark: govt fee = rate × classes
const isDiscountEligible = ['individual', 'proprietorship', 'msme', 'startup'].includes(applicantType)
const ratePerClass = isDiscountEligible ? 450000 : 900000  // ₹4,500 or ₹9,000
govtFee = ratePerClass * classCount

// Pvt Ltd: govt fee = capital slab + extra directors
const capitalSlabs = {
  '100000':   799900,   // ₹1L   → ₹7,999
  '500000':   1000000,  // ₹5L   → ₹10,000
  '1000000':  1500000,  // ₹10L  → ₹15,000
  '2500000':  2500000,  // ₹25L  → ₹25,000
  '5000000':  3500000,  // ₹50L  → ₹35,000
  '10000000': 4500000,  // ₹1Cr  → ₹45,000
}
govtFee = capitalSlabs[capital] + (directorsAbove2 × 120000)  // ₹1,200/extra director

// LLP: govt fee = contribution slab + extra partners
const contributionSlabs = {
  'upto_1l':   50000,   // ₹500
  '1l_to_5l':  200000,  // ₹2,000
  '5l_to_10l': 400000,  // ₹4,000
  'above_10l': 500000,  // ₹5,000
}
govtFee = contributionSlabs[contribution] + (partnersAbove2 × 120000)

// GST: 18% on (serviceFee + addons), NOT on govt fees
gst = (serviceFee + addonsTotal) × 0.18
total = serviceFee + govtFees + addonsTotal + gst
```

---

## Flow 2: Checkout page (payment)

**Route:** `app/(main)/checkout/[serviceId]/page.tsx`

### What the page shows:

```
┌─────────────────────────────────────────────────────┐
│  CHECKOUT PAGE                                       │
│                                                      │
│  ┌─ Pre-cursor Summary Card ──────────────────────┐  │
│  │  (if eligibility answers exist)                 │  │
│  │  "2 Directors · ₹1L Authorized Capital"         │  │
│  │  [Edit] button → returns to /eligibility?edit   │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─ Filing Timeline ──────────────────────────────┐  │
│  │  workflow_stages rendered as timeline            │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─ Documents Required ───────────────────────────┐  │
│  │  DocumentChecklist component                    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─ Scope of Work ────────────────────────────────┐  │
│  │  Included: [list]    Excluded: [list]           │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─ Add-ons ──────────────────────────────────────┐  │
│  │  Optional: [ ] Extra director DSC ₹1,200       │  │
│  │  Required: [✓] Compliance setup (included)      │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  SIDEBAR (sticky desktop) / BOTTOM BAR (mobile):     │
│  ┌─ Order Summary ────────────────────────────────┐  │
│  │  Service fee        ₹8,999                     │  │
│  │  Govt fee           ₹7,999                     │  │
│  │  Add-ons            ₹0                         │  │
│  │  GST (18%)          ₹1,620                     │  │
│  │  ─────────────────────────                     │  │
│  │  Total              ₹18,618                    │  │
│  │                                                │  │
│  │  [Promo code input]                            │  │
│  │  [Pay Now]                                     │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Payment flow:

```
1. User clicks [Pay Now]
2. If not logged in → auth modal shown (login/signup)
3. POST /functions/v1/create-razorpay-order
   Body: { service_package_id, promo_code, variant_id, addon_ids, engagement_agreed }
   Returns: { razorpay_order_id, order_id, order_number, amount }
4. Razorpay modal opens with the returned order
5. On success:
   - Pre-cursor answers upserted to order_questionnaire_responses
   - SessionStorage cleared
   - Success modal shown with order number
6. On failure:
   - Retry modal shown
```

### Edge function: create-razorpay-order

**File:** `supabase/functions/create-razorpay-order/index.ts`

Creates the `orders` row with `status = 'pending_payment'` and returns a Razorpay order object.

**Price calculation server-side:**
- Fetches service_package prices from DB
- Applies variant adjustments
- Calculates GST (CGST+SGST 9% if Delhi, else IGST 18%)
- Applies Pro discount (5% off base for Pro subscribers)
- Applies promo code discount
- Applies referral credit

---

## Flow 3: After payment — webhook + order lifecycle

### Razorpay webhook: payment.captured

**File:** `supabase/functions/razorpay-webhook/index.ts`

When Razorpay confirms payment:
1. Finds order by `razorpay_order_id`
2. Updates order: `status → 'pending_assignment'`, sets `paid_at`, `razorpay_payment_id`
3. Creates chat conversation (for customer ↔ professional messaging)
4. Creates invoice with full price breakdown
5. Creates engagement letter
6. Sends notification: "Payment successful, specialist assignment in 24 hours"
7. Posts system message in chat

### Order status progression:

```
pending_payment        ← order created, waiting for Razorpay
    ↓ (webhook: payment.captured)
pending_assignment     ← paid, waiting for professional to be assigned
    ↓ (admin assigns professional)
in_progress            ← professional working on it
    ↓ (professional marks complete)
completed              ← done
```

Other states: `cancelled`, `disputed`, `waitlisted`

---

## Flow 4: Post-payment questionnaire

**Route:** `app/(main)/orders/[id]/questionnaire/page.tsx`

After payment, the user completes detailed questions that weren't asked pre-payment.

**How it works:**
1. Page fetches order via `get_user_order()` RPC
2. Loads questions from `service_questionnaires` where `is_pre_payment = false`
3. Pre-payment answers (already stored) shown as a read-only summary card at top
4. User fills remaining questions step by step
5. On completion: `complete_order_questionnaire(order_id)` RPC sets `questionnaire_completed_at`

**Example: Pvt Ltd post-payment questions:**
- Director 1 Full Name, PAN Number, Email
- Director 2 Full Name, PAN Number, Email
- Registered Office Address, State, PIN
- Business Activity Description

---

## Flow 5: Document upload

**Route:** `app/(main)/orders/[id]/documents/page.tsx`

After questionnaire, user uploads required documents.

**How it works:**
1. `initialize_order_documents(orderId)` RPC creates document records from `service_document_templates`
2. Each document shows: label, description, tips, required/optional badge
3. User uploads files → stored in `order-documents` storage bucket
4. `update_order_document()` RPC records the upload
5. Professional reviews and verifies documents (or rejects with reason)

**Document template seed pattern:**
```sql
INSERT INTO service_document_templates
  (service_package_id, document_key, document_label, description, stage_key,
   is_required, display_order, tips, template_url)
SELECT sp.id, dt.document_key, dt.document_label, dt.description,
       dt.stage_key, dt.is_required, dt.display_order, dt.tips, dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('pan_card', 'PAN Card', 'PAN card of the business', 'doc_collection',
   true, 1, ARRAY['Clear photo or scan', 'Must match application name'], NULL),
  ('aadhaar', 'Aadhaar Card', 'Aadhaar of authorized signatory', 'doc_collection',
   true, 2, ARRAY['Front and back both required'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required,
        display_order, tips, template_url)
WHERE sp.slug = 'your-service-slug';
```

---

## Database schemas

### `service_questionnaires` — defines questions per service

```sql
service_questionnaires (
  id                UUID PRIMARY KEY,
  service_package_id UUID REFERENCES service_packages(id),
  question_key      TEXT,        -- unique per service, e.g. 'number_of_directors'
  question_label    TEXT,        -- displayed to user
  question_type     TEXT,        -- text | textarea | number | select | multiselect | radio | date | file
  options           JSONB,       -- for select/radio: [{"value": "2", "label": "2 Directors"}]
  validation        JSONB,       -- {"required": true, "min": 1, "max": 45}
  placeholder       TEXT,
  help_text         TEXT,
  depends_on        JSONB,       -- conditional visibility (see below)
  step_number       INT,         -- groups questions into wizard steps
  display_order     INT,         -- order within step
  is_active         BOOLEAN,
  is_pre_payment    BOOLEAN      -- true = before payment, false = after payment
)
```

### Conditional question visibility (`depends_on`):

```jsonc
// Show only if applicant_type == "individual"
{"question_key": "applicant_type", "value": "individual"}

// Show only if class_count is 1, 2, or 3
{"question_key": "class_count", "values": ["1", "2", "3"]}

// Show only if multiselect "services" contains "customs"
{"question_key": "services", "contains": "customs"}

// Show only if employee_count < 10
{"question_key": "employee_count", "operator": "less_than", "value": 10}
```

### `order_questionnaire_responses` — stores answers

```sql
order_questionnaire_responses (
  id              UUID PRIMARY KEY,
  order_id        UUID REFERENCES orders(id),
  question_key    TEXT,
  response_value  JSONB,       -- string, number, array, or object
  created_at      TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ,
  UNIQUE(order_id, question_key)
)
```

### `orders` — the order record

```sql
orders (
  id, order_number, user_id, professional_id, service_package_id,
  status,                        -- order_status enum (see above)
  price_base_paisa_snapshot,     -- frozen at time of payment
  price_govt_fees_paisa_snapshot,
  price_gst_paisa_snapshot,
  total_paisa_snapshot,
  promo_code_used,
  variant_id,
  razorpay_order_id,
  razorpay_payment_id,
  paid_at,
  chat_conversation_id,
  questionnaire_completed_at,
  engagement_agreed_at,
  created_at, updated_at
)
```

### `service_document_templates` — defines required docs per service

```sql
service_document_templates (
  id, service_package_id, document_key, document_label,
  description, stage_key, is_required, display_order,
  tips (TEXT[]),         -- array of tip strings shown to user
  template_url           -- optional downloadable template
)
```

### `order_documents` — tracks uploads per order

```sql
order_documents (
  id, order_id, document_key, document_label, stage_key,
  is_required, uploaded_at, file_url, file_name,
  verified_at, verified_by, rejection_reason
)
```

---

## Pre-cursor sessionStorage lifecycle

**File:** `lib/pre-cursor.ts`

```
Eligibility page completes
  → storePreCursorAnswers(serviceSlug, answers)  // saves to sessionStorage

Checkout page loads
  → getPreCursorAnswers(serviceSlug)              // reads from sessionStorage
  → used for price calculation + summary card display

Payment succeeds
  → answers upserted to order_questionnaire_responses in DB
  → clearPreCursorAnswers()                        // clears sessionStorage
```

Key detail: `getPreCursorAnswers` only returns answers if the stored `serviceSlug` matches the requested one. This prevents cross-service answer bleed.

---

## Component hierarchy — full flow

```
SERVICE PAGE
  └→ BookingPanel CTA button
      │
      ├→ /checkout/{id}/eligibility (if service has pre-payment questions)
      │   ├→ QuestionnaireWizard (mode: pre_payment)
      │   │   ├→ QuestionField (per question, conditional visibility)
      │   │   └→ LivePricePreview (updates as user answers)
      │   └→ storePreCursorAnswers → redirect to /checkout/{id}
      │
      ├→ /checkout/{id} (all services end up here)
      │   ├→ PreCursorSummaryCard (if answers exist, with Edit button)
      │   ├→ FilingTimeline
      │   ├→ DocumentChecklist
      │   ├→ ScopeOfWork
      │   ├→ AddOnsSection
      │   └→ OrderSummaryPanel → [Pay Now] → Razorpay
      │       └→ create-razorpay-order edge function
      │           └→ orders row created (status: pending_payment)
      │               └→ Razorpay payment modal
      │                   ├→ Success → /orders/{id}/success
      │                   └→ Failure → retry modal
      │
      └→ /quote/request/{id} (if price varies by state)
          └→ State selection → quote created → checkout

POST-PAYMENT:
  /orders/{id}/success     ← confirmation page
  /orders/{id}/questionnaire  ← post-payment questions (director details, address, etc.)
  /orders/{id}/documents      ← upload PAN, Aadhaar, address proof, etc.
  /orders/{id}                ← order tracking (status, chat, documents, timeline)
```

---

## Key files reference

| Purpose | Path |
|---|---|
| Checkout page | `app/(main)/checkout/[serviceId]/page.tsx` |
| Eligibility page | `app/(main)/checkout/[serviceId]/eligibility/page.tsx` |
| Quote request | `app/(main)/quote/request/[serviceId]/page.tsx` |
| Order success | `app/(main)/orders/[id]/success/page.tsx` |
| Order detail | `app/(main)/orders/[id]/page.tsx` |
| Post-payment questionnaire | `app/(main)/orders/[id]/questionnaire/page.tsx` |
| Document upload | `app/(main)/orders/[id]/documents/page.tsx` |
| BookingPanel | `components/service/BookingPanel.tsx` |
| QuestionnaireWizard | `components/questionnaire/QuestionnaireWizard.tsx` |
| LivePricePreview | `components/questionnaire/LivePricePreview.tsx` |
| Price calculator | `lib/pricing/calculate-price.ts` |
| Pre-cursor storage | `lib/pre-cursor.ts` |
| Questionnaire store | `lib/stores/questionnaire-store.ts` |
| Create order function | `supabase/functions/create-razorpay-order/index.ts` |
| Webhook handler | `supabase/functions/razorpay-webhook/index.ts` |

---

## How to add questionnaires for a new service

### 1. Seed pre-payment questions (if pricing depends on answers)

```sql
-- Add to calculate-price.ts if new pricing logic needed

INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, options,
   validation, help_text, is_pre_payment, is_active, step_number, display_order)
VALUES
  ((SELECT id FROM service_packages WHERE slug = 'your-slug'),
   'your_question_key',
   'How many X do you need?',
   'select',
   '[{"value": "1", "label": "1"}, {"value": "2", "label": "2"}]'::jsonb,
   '{"required": true}'::jsonb,
   'Help text shown below the field',
   true,    -- pre-payment = shown BEFORE checkout
   true,
   0,       -- step 0 = eligibility step
   1);      -- display order within step
```

### 2. Seed post-payment questions

```sql
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type,
   validation, placeholder, help_text, is_pre_payment, is_active,
   step_number, display_order)
VALUES
  ((SELECT id FROM service_packages WHERE slug = 'your-slug'),
   'applicant_full_name',
   'Full name of applicant',
   'text',
   '{"required": true, "minLength": 3}'::jsonb,
   'e.g., Rajesh Kumar',
   'As it appears on your PAN card',
   false,   -- post-payment = shown AFTER payment
   true,
   1,       -- step 1 in the post-payment wizard
   1);
```

### 3. Seed document templates

```sql
INSERT INTO service_document_templates
  (service_package_id, document_key, document_label, description,
   stage_key, is_required, display_order, tips, template_url)
SELECT sp.id, dt.*
FROM service_packages sp
CROSS JOIN (VALUES
  ('pan_card', 'PAN Card', 'PAN of the applicant or business',
   'doc_collection', true, 1,
   ARRAY['Clear scan or photo', 'Name must match application'], NULL),
  ('address_proof', 'Address Proof', 'Electricity bill or rent agreement',
   'doc_collection', true, 2,
   ARRAY['Not older than 2 months', 'Address must match application'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required,
        display_order, tips, template_url)
WHERE sp.slug = 'your-slug';
```

### 4. Add pricing logic (if pre-payment questions affect govt fee)

Add a new `if (service.slug === 'your-slug')` block in `lib/pricing/calculate-price.ts`.

### 5. Add to questionnaire routing (if new pre-payment service)

Add slug to the hardcoded list in `BookingPanel.tsx` and `UnifiedServicePage.tsx`:
```typescript
const QUESTIONNAIRE_BASED_SERVICES = [
  'trademark-registration',
  'pvt-ltd-incorporation',
  'llp-incorporation',
  'your-slug',  // ← add here
]
```

---

## How to create a new service — complete checklist

### Files to create:

1. **`lib/services/<slug>.ts`**
   Export a `ServiceConfig` object. This is the seed content and local fallback.

2. **`supabase/migrations/<timestamp>_seed_<slug>.sql`**
   INSERT into `service_packages` with all the content. Run `npx supabase db push` to apply.

### Files to modify:

3. **`lib/services.ts`**
   - Add import: `import { yourService } from './services/<slug>'`
   - Add to `SERVICES` array in the right category group

4. **`lib/services/data/services-*.ts`** (or create a new `services-15-16.ts`)
   Export a `ServicePageConfig` with `documents` table, `govtFees` table, and `explainer`.

5. **`lib/services/data/index.ts`**
   - Add import from the data file
   - Add to `allServices` array

6. **`components/service/DIYvsOllvy.tsx`** (optional but recommended)
   Add entry to the `DATA` object keyed by slug. 4-5 rows comparing DIY pain vs Ollvy.

7. **`lib/data/fallback-reviews.ts`**
   Add 2-3 fallback reviews keyed by slug. Sound like real people — specific, not generic.

### That's it. No route changes needed.

The page at `/services/<slug>` auto-resolves from the database. `generateStaticParams()` picks up all `is_active = true` slugs. ISR revalidates every hour.

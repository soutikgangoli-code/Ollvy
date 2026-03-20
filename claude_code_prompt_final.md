# OLLVY — COMPLETE IMPLEMENTATION PROMPT FOR CLAUDE CODE

Single source of truth. Do everything in order. Do not skip. Do not reorder.

---

## DESIGN RULE

**Do not introduce any new design elements, colours, fonts, component patterns, spacing conventions, or UI styles.** Every change must match what already exists. New pages must look identical to existing pages of the same type.

---

## CRITICAL SLUG CORRECTIONS — READ BEFORE TOUCHING ANY SQL

Every SQL statement in this prompt uses these slugs. Wrong slugs silently affect zero rows.

| Common assumption | Correct slug in DB |
|---|---|
| pvt-ltd-company | `pvt-ltd-incorporation` |
| llp-registration | `llp-incorporation` |
| opc-registration | `opc-incorporation` |
| roc-annual-filing | `mca-annual-filing` |
| director-change | `roc-changes` |
| registered-office-change | `roc-changes` |
| patent-filing | **DOES NOT EXIST — skip all patent steps** |

Confirmed correct: `trademark-registration`, `professional-tax`, `iec-code`, `partnership-registration`, `copyright-registration`, `shop-establishment`, `gst-registration`, `pf-registration`, `esi-registration`, `msme-registration`, `startup-india`, `director-kyc`, `business-itr`.

`question_key` is unique per service only — constraint is `UNIQUE(service_package_id, question_key)`. Every UPDATE on `service_questionnaires` must include `AND service_package_id = (SELECT id FROM service_packages WHERE slug = '...')`.

---

## STEP 1 — SCHEMA CHANGES

Do these first. Everything depends on them.

**1a. Add `is_pre_payment` to `service_questionnaires`**

```sql
ALTER TABLE service_questionnaires 
ADD COLUMN is_pre_payment BOOLEAN NOT NULL DEFAULT false;
```

**1b. Add `condition` to `service_document_templates`**

```sql
ALTER TABLE service_document_templates 
ADD COLUMN condition JSONB DEFAULT NULL;
```

Format: `{"question_key": "registration_type", "operator": "includes", "value": "PTRC"}`

Supported operators: `equals`, `not_equals`, `includes`, `not_includes`, `includes_any`, `less_than`, `exists`

**1c. Add `pending_payment` order status**

Add `pending_payment` to the order status enum or check constraint.

**1d. Add `stage_key` to `workflow_stages` JSONB — fix data model mismatch**

This is a confirmed bug. `workflow_stages` JSONB has `step`, `title`, `timeline`, `body`, `visual`, `milestone`, `isCompletion` — no `stage_key`. Meanwhile `order_work_documents.stage_key` uses free-text values with no connection to `workflow_stages`. Stage filtering cannot work until this is fixed.

`profile/page.tsx` line 266 also accesses `?.stage_name` which does not exist.

The confirmed stage_key → step mapping (from actual seeded data) is:

**Pvt Ltd (`pvt-ltd-incorporation`):**
- step 1 → no stage_key (questionnaire)
- step 2 → no stage_key (initial documents)
- step 3 → `dsc_applied`
- step 4 → `name_approval`
- step 5 → `spice_filed`
- step 6 → `incorporation_certificate`

**LLP (`llp-incorporation`):**
- step 1 → no stage_key (partner details)
- step 2 → no stage_key (initial documents)
- step 3 → `dpin_applied`
- step 4 → `name_approval`
- step 5 → `fillip_filed`
- step 6 → `incorporation_certificate`

**GST (`gst-registration`):** `application_filed`, `officer_query_handled`, `gstin_issued`

**Trademark (`trademark-registration`):** `tm_application_filed`, `examination_report`, `tm_published`, `tm_registered`

**OPC (`opc-incorporation`):** `dsc_applied`, `name_approval`, `spice_filed`, `incorporation_certificate`

**Partnership (`partnership-registration`):** `deed_drafting`, `deed_registration`, `registration_complete`

**Shop & Establishment (`shop-establishment`):** `application_filed`, `certificate_issued`

**MSME (`msme-registration`):** `certificate_issued`

**IEC (`iec-code`):** `application_filed`, `iec_issued`

**Professional Tax (`professional-tax`):** `application_filed`, `certificate_issued`

**ESI (`esi-registration`):** `application_filed`, `registration_certificate`

**PF (`pf-registration`):** `application_filed`, `registration_certificate`

Write the migration using `jsonb_set` to add `stage_key` to each element of the `workflow_stages` array for each service. For services where `workflow_stages` steps 1 and 2 have no corresponding `stage_key` (questionnaire and document upload stages), set `stage_key` to `null` on those elements. For all others, map the step number to the confirmed `stage_key` value above.

For services not listed above (where stage keys are unknown), do not modify their `workflow_stages` — leave them as-is until their document stage keys are confirmed.

After migration:
- Fix `profile/page.tsx` line 266: `?.stage_name` → `?.title` for display text
- Fix `profile/page.tsx` line 266: use `?.stage_key` for filtering logic (separate from display)
- Active stage key for an order: `workflowStages[completedStageCount]?.stage_key`

---

## STEP 2 — SERVICES PAGE: PRICE DISPLAY

**Files:**
- `/components/services/ServiceCard.tsx` lines 43–69
- `/app/(main)/services/[slug]/page.tsx` → `UnifiedServicePage > BookingPanel`

For services where pre-cursor questions change the final price, the flat card price misleads customers. The current DB values are the minimum prices, so "Starting from" is accurate.

**Change price display for these three services only:**

| Slug | DB total | Label |
|---|---|---|
| `trademark-registration` | ₹12,499 | "Starting from ₹12,499" |
| `pvt-ltd-incorporation` | ₹22,999 | "Starting from ₹22,999" |
| `llp-incorporation` | ₹12,999 | "Starting from ₹12,999" |

For all other services — show flat price exactly as today. Do not touch them.

In `ServiceCard.tsx`: check `service.slug`. If it matches one of the three above, prepend "Starting from". Same font, size, colour, layout. Apply identically in `BookingPanel` on the detail page.

---

## STEP 3 — BUTTON LABEL CHANGE

For services with `is_pre_payment = true` questions, change the CTA from **"Checkout"** to **"Check Eligibility & Price"**.

Services that get the new label:
`trademark-registration`, `pvt-ltd-incorporation`, `llp-incorporation`, `professional-tax`, `esi-registration`, `pf-registration`, `copyright-registration`

Same button component, same styling. Label string only.

On click: route to `/checkout/[serviceId]/eligibility` instead of `/checkout/[serviceId]`.

For services without pre-payment questions: "Checkout" button routes to `/checkout/[serviceId]` as today. Zero changes.

---

## STEP 4 — NEW ELIGIBILITY PAGE

Create: `/app/(main)/checkout/[serviceId]/eligibility/page.tsx`

This page sits between the service page and the checkout page. It exists only for services that have `is_pre_payment = true` questions. If a user navigates to this URL for a service with no pre-payment questions, redirect them immediately to `/checkout/[serviceId]`.

### Page behaviour

1. Check if user is authenticated. If not, trigger the existing `openAuthModal()` — same as the checkout page does today. Wait for `user` to become truthy before loading questions.

2. Fetch `is_pre_payment = true` questions for the service from `service_questionnaires`:
```typescript
const { data: questions } = await supabase
  .from('service_questionnaires')
  .select('*')
  .eq('service_package_id', service.id)
  .eq('is_pre_payment', true)
  .eq('is_active', true)
  .order('step_number', { ascending: true })
  .order('display_order', { ascending: true })
```

3. Render the questions using the existing `QuestionnaireWizard` component (see Step 4b for required changes). Pass `mode="pre_payment"`.

4. As the user answers questions, compute and display the dynamic price in the page footer (see Step 5 for logic).

5. On the last question, the "Next" button label is **"See My Price"**.

6. On completion:
   - Store answers using `storePreCursorAnswers(serviceSlug, answers)` from `lib/pre-cursor.ts` (see Step 4c)
   - Navigate to `/checkout/[serviceId]`

### Page layout

Same layout as the existing questionnaire page (`/orders/[id]/questionnaire`). Do not create a new layout. Reuse what exists.

---

## STEP 4b — QUESTIONNAIRE WIZARD: ADD PRE-PAYMENT MODE

**File: `/components/questionnaire/QuestionnaireWizard.tsx`**

Current props:
```typescript
interface QuestionnaireWizardProps {
  orderId: string
  forceEdit?: boolean
}
```

Add:
```typescript
interface QuestionnaireWizardProps {
  orderId?: string                    // optional — not available in pre_payment mode
  serviceId?: string                  // required in pre_payment mode
  forceEdit?: boolean
  mode?: 'pre_payment' | 'post_payment'  // default: 'post_payment'
  onComplete?: (answers: Record<string, any>) => void  // required in pre_payment mode
}
```

**File: `/lib/stores/questionnaire-store.ts`**

The current query at lines 117–124 fetches all active questions. Add a `prePaymentOnly` param:

- `pre_payment` mode: add `.eq('is_pre_payment', true)` — loads only pre-cursor questions, no orderId needed
- `post_payment` mode: add `.eq('is_pre_payment', false)` — excludes pre-cursor questions entirely

In `post_payment` mode, the existing responses query runs as normal. In `pre_payment` mode, skip the responses query — answers start empty, there is no orderId yet.

---

## STEP 4c — CREATE `lib/pre-cursor.ts`

Create this file exactly as Claude Code specified, following the UTM utility pattern:

```typescript
const PRE_CURSOR_KEY = 'ollvy_pre_cursor'

export function storePreCursorAnswers(
  serviceSlug: string, 
  answers: Record<string, any>
): void {
  sessionStorage.setItem(PRE_CURSOR_KEY, JSON.stringify({ serviceSlug, answers }))
}

export function getPreCursorAnswers(
  serviceSlug: string
): Record<string, any> | null {
  const stored = sessionStorage.getItem(PRE_CURSOR_KEY)
  if (!stored) return null
  const data = JSON.parse(stored)
  return data.serviceSlug === serviceSlug ? data.answers : null
}

export function clearPreCursorAnswers(): void {
  sessionStorage.removeItem(PRE_CURSOR_KEY)
}
```

Clears on tab close (sessionStorage). Scoped by `serviceSlug` so answers from a previous service don't bleed in.

---

## STEP 5 — CHECKOUT PAGE: READ PRE-CURSOR ANSWERS AND COMPUTE PRICE

**File: `/app/(main)/checkout/[serviceId]/page.tsx`**

On mount, read pre-cursor answers from sessionStorage:

```typescript
const [preCursorAnswers, setPreCursorAnswers] = useState<Record<string, any>>({})

useEffect(() => {
  if (service) {
    const stored = getPreCursorAnswers(service.slug)
    if (stored) setPreCursorAnswers(stored)
  }
}, [service])
```

### Pricing logic — inject into the existing `useMemo` block at lines 182–217

Ollvy's service fee (`price_base_paisa`) stays fixed. Only `price_govt_fees_paisa` is overridden dynamically based on pre-cursor answers.

```typescript
let govtFeePaisa = service.price_govt_fees_paisa || 0

// ─── TRADEMARK ────────────────────────────────────────────────────────────
// Govt fee = rate per class × number of classes
// Ollvy fee stays fixed at ₹7,999 (price_base_paisa = 799900)
if (service.slug === 'trademark-registration' && preCursorAnswers.trademark_class_count) {
  const classCount = Number(preCursorAnswers.trademark_class_count)
  const isDiscountEligible = ['individual', 'proprietorship', 'msme', 'startup']
    .includes(preCursorAnswers.applicant_type)
  // Individual/Proprietor/MSME/Startup: ₹4,500/class (450000 paisa)
  // Company/LLP/Partnership/Others: ₹9,000/class (900000 paisa)
  govtFeePaisa = (isDiscountEligible ? 450000 : 900000) * classCount
}

// ─── PRIVATE LIMITED COMPANY ──────────────────────────────────────────────
// Govt fee = MCA ROC filing fee + Delhi stamp duty on authorized capital
// Ollvy fee stays fixed at ₹14,999 (price_base_paisa = 1499900)
// Base case (₹1L capital, 2 directors) = ₹7,999 govt fee (current seeded value)
// DSC base covers 2 directors. Each additional director = ₹1,200 extra (paisa: 120000)
if (service.slug === 'pvt-ltd-incorporation' && preCursorAnswers.authorized_capital) {
  const capital = preCursorAnswers.authorized_capital  // value as stored from questionnaire options
  const directors = Number(preCursorAnswers.number_of_directors) || 2
  const additionalDSCCost = Math.max(0, directors - 2) * 120000  // ₹1,200 per director beyond 2

  // Delhi-based stamp duty + MCA ROC fee slabs (Option C — approximate)
  // These are actual government fees passed through to customer with no markup
  const capitalSlabs: Record<string, number> = {
    '100000':   799900,   // ₹1L   → ₹7,999 govt fee  (current base)
    '500000':   1000000,  // ₹5L   → ₹10,000 govt fee
    '1000000':  1500000,  // ₹10L  → ₹15,000 govt fee
    '2500000':  2500000,  // ₹25L  → ₹25,000 govt fee
    '5000000':  3500000,  // ₹50L  → ₹35,000 govt fee
  }

  const capitalValue = String(capital)
  govtFeePaisa = (capitalSlabs[capitalValue] ?? 799900) + additionalDSCCost
}

// ─── LLP ──────────────────────────────────────────────────────────────────
// Govt fee = FiLLiP stamp duty on total capital contribution (central government, uniform)
// Ollvy fee stays fixed at ₹7,999 (price_base_paisa = 799900)
// Base case (up to ₹1L contribution, 2 partners) = ₹5,000 govt fee (current seeded value)
// DSC/DPIN base covers 2 partners. Each additional partner = ₹1,200 extra (paisa: 120000)
if (service.slug === 'llp-incorporation' && preCursorAnswers.total_contribution) {
  const contribution = preCursorAnswers.total_contribution
  const partners = Number(preCursorAnswers.number_of_partners) || 2
  const additionalDSCCost = Math.max(0, partners - 2) * 120000  // ₹1,200 per partner beyond 2

  // FiLLiP govt fee slabs (central government — uniform across states)
  const contributionSlabs: Record<string, number> = {
    'upto_1l':    50000,   // Up to ₹1L   → ₹500 govt fee
    '1l_to_5l':   200000,  // ₹1L–₹5L     → ₹2,000 govt fee
    '5l_to_10l':  400000,  // ₹5L–₹10L    → ₹4,000 govt fee
    'above_10l':  500000,  // Above ₹10L  → ₹5,000 govt fee
  }

  const contributionValue = String(contribution)
  govtFeePaisa = (contributionSlabs[contributionValue] ?? 500000) + additionalDSCCost
}

const govtFees = (govtFeePaisa + variantGovtFeeAdjustment) / 100
// ... rest of existing calculation unchanged
```

**Note on `authorized_capital` and `total_contribution` option values:** The above slab keys must match the `value` field in the options JSONB seeded for those questions. Check the seeded `options` for `authorized_capital` (Pvt Ltd step 1, display_order 4) and `total_contribution` (LLP step 1, display_order 4) and adjust the slab keys to match exactly. If the options store numeric values (e.g., `100000`) use numeric string keys. If they store labels (e.g., `"upto_1l"`) use those. Do not guess — read the seed file.

---

**Show a pre-cursor answer summary on the checkout page:**

If `preCursorAnswers` has values, render a read-only summary card above the price breakdown. Same styling as existing info cards in the app. Label: "Confirmed before payment". Lists each answer as human-readable key: value. Not editable.

**Show price breakdown on checkout page:**

Display three lines:
- Ollvy fee: ₹X (fixed, from `price_base_paisa`)
- Government fees: ₹X (computed dynamically)
- GST: ₹X (on Ollvy fee only, as per existing logic)

**Save pre-cursor answers on payment success:**

In the test-mode success block around line 327, before `setSuccessModal`:

```typescript
if (data.razorpay_order_id?.startsWith('order_test_')) {
  if (Object.keys(preCursorAnswers).length > 0) {
    await supabase.from('order_questionnaire_responses').upsert(
      Object.entries(preCursorAnswers).map(([question_key, response_value]) => ({
        order_id: data.order_id,
        question_key,
        response_value,
      }))
    )
  }
  clearPreCursorAnswers()
  clearAllAttributionData()
  setSuccessModal({ isOpen: true, orderId: data.order_id, orderNumber: data.order_number })
  return
}
```

Existing `onClose` redirect to `/orders/${orderId}/questionnaire` is unchanged.

---

**Dynamic price display in eligibility page footer:**

In `QuestionnaireWizard` when `mode === 'pre_payment'`, show a live price summary in the footer. Update after each answer:

**Trademark:**
- After `applicant_type` answered → show: "Rate: ₹4,500/class" or "Rate: ₹9,000/class"
- After `trademark_class_count` answered → show: "Government fee: ₹X | Ollvy fee: ₹7,999 | Total: ₹X"
- Note below: "Government fee is per class. Our fee covers filing, search, and prosecution."

**Pvt Ltd:**
- After `authorized_capital` answered → show computed govt fee for that slab
- After `number_of_directors` answered → show additional DSC cost if >2
- Show: "Government fees: ₹X | Ollvy fee: ₹14,999 | Total: ₹X"
- Note: "Government fees are approximate (Delhi rates). Final invoice may vary slightly by state."

**LLP:**
- After `total_contribution` answered → show computed FiLLiP fee for that slab
- After `number_of_partners` answered → show additional DPIN/DSC cost if >2
- Show: "Government fees: ₹X | Ollvy fee: ₹7,999 | Total: ₹X"

**PT, ESI, PF, Copyright:**
- Show static "Total: ₹X" from flat base price throughout.

---

**Blocking gates in eligibility page:**

Professional Tax — after `state` answered:
```typescript
const PT_STATES = ['Maharashtra', 'Karnataka', 'West Bengal', 'Telangana', 
  'Andhra Pradesh', 'Tamil Nadu', 'Gujarat', 'Madhya Pradesh', 'Odisha', 
  'Kerala', 'Assam', 'Meghalaya', 'Bihar', 'Jharkhand', 'Sikkim', 'Tripura']
if (!PT_STATES.includes(answer)) {
  // Show inline: "Professional Tax is not applicable in [state]. 
  // This service cannot be completed for your location."
  // Disable "See My Price" button
}
```

ESI — after both `employee_count` and `voluntary_registration` answered:
```typescript
if (employeeCount < 10 && voluntaryRegistration === 'no') {
  // Show: "ESI is mandatory only for establishments with 10 or more employees."
  // Disable "See My Price" button
}
```

PF — same pattern, threshold = 20.

Copyright — no gate. Show: "Registering: [work_category label]"

---

## STEP 6 — POST-PAYMENT QUESTIONNAIRE: EXCLUDE PRE-CURSOR QUESTIONS

**File: `/lib/stores/questionnaire-store.ts`**

`post_payment` mode adds `.eq('is_pre_payment', false)` to the questions query. Pre-cursor questions are not loaded. No skip logic needed — they simply aren't there.

The responses query still runs and fetches all existing answers. If pre-cursor answers exist, render a read-only summary card at the top of the questionnaire. Same info card styling. Label: "Confirmed before payment". Not part of the wizard flow. Not editable.

---

## STEP 7 — SEED PRE-PAYMENT FLAGS

```sql
-- Professional Tax
UPDATE service_questionnaires 
SET is_pre_payment = true
WHERE question_key IN ('state', 'registration_type')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'professional-tax');

-- Trademark
UPDATE service_questionnaires 
SET is_pre_payment = true
WHERE question_key IN ('applicant_type', 'trademark_type')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

INSERT INTO service_questionnaires 
  (service_package_id, question_key, question_label, question_type, help_text, 
   validation, is_pre_payment, is_active, step_number, display_order)
VALUES (
  (SELECT id FROM service_packages WHERE slug = 'trademark-registration'),
  'trademark_class_count', 'How many trademark classes do you need?', 'number',
  'Each class covers a different category of goods or services. Most businesses need 1–2 classes. Not sure? Choose 1 — our CA will advise before filing.',
  '{"required": true, "min": 1, "max": 45}',
  true, true, 0, 2
);

-- Private Limited Company
UPDATE service_questionnaires 
SET is_pre_payment = true
WHERE question_key IN ('number_of_directors', 'authorized_capital')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation');

-- LLP — CORRECTED KEYS: number_of_partners and total_contribution (NOT number_of_designated_partners / total_capital_contribution)
UPDATE service_questionnaires 
SET is_pre_payment = true
WHERE question_key IN ('number_of_partners', 'total_contribution')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation');

-- ESI
UPDATE service_questionnaires SET is_pre_payment = true
WHERE question_key = 'employee_count'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'esi-registration');

INSERT INTO service_questionnaires 
  (service_package_id, question_key, question_label, question_type, options, 
   depends_on, is_pre_payment, is_active, step_number, display_order)
VALUES (
  (SELECT id FROM service_packages WHERE slug = 'esi-registration'),
  'voluntary_registration',
  'You have fewer than 10 employees. ESI is not yet mandatory. Would you like to register voluntarily?',
  'radio',
  '[{"value": "yes", "label": "Yes, register voluntarily"}, {"value": "no", "label": "No, I will register when required"}]',
  '{"question_key": "employee_count", "operator": "less_than", "value": 10}',
  true, true, 0, 2
);

-- PF
UPDATE service_questionnaires SET is_pre_payment = true
WHERE question_key = 'employee_count'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration');

INSERT INTO service_questionnaires 
  (service_package_id, question_key, question_label, question_type, options, 
   depends_on, is_pre_payment, is_active, step_number, display_order)
VALUES (
  (SELECT id FROM service_packages WHERE slug = 'pf-registration'),
  'voluntary_registration',
  'You have fewer than 20 employees. PF is not yet mandatory. Would you like to register voluntarily?',
  'radio',
  '[{"value": "yes", "label": "Yes, register voluntarily"}, {"value": "no", "label": "No, I will register when required"}]',
  '{"question_key": "employee_count", "operator": "less_than", "value": 20}',
  true, true, 0, 2
);

-- Copyright
UPDATE service_questionnaires SET is_pre_payment = true
WHERE question_key = 'work_category'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'copyright-registration');
```

---

## STEP 8 — CONDITIONAL DOCUMENT LOGIC

Evaluate `condition` JSONB against `order_questionnaire_responses` in the document upload renderer. Condition present and false → hide. Condition null → always show.

```sql
UPDATE service_document_templates 
SET condition = '{"question_key": "registration_type", "operator": "includes", "value": "PTRC"}'
WHERE document_key IN ('employee_list', 'salary_register')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'professional-tax');

UPDATE service_document_templates 
SET condition = '{"question_key": "premises_nature", "operator": "equals", "value": "rented"}'
WHERE document_key IN ('rent_agreement', 'noc')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'shop-establishment');

UPDATE service_document_templates 
SET condition = '{"question_key": "applicant_is_author", "operator": "equals", "value": "no"}'
WHERE document_key = 'author_noc'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'copyright-registration');

UPDATE service_document_templates 
SET condition = '{"question_key": "ownership_basis", "operator": "equals", "value": "assignee"}'
WHERE document_key = 'assignment_deed'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'copyright-registration');

UPDATE service_document_templates 
SET condition = '{"question_key": "entity_type", "operator": "not_equals", "value": "sole_proprietorship"}'
WHERE document_key = 'entity_proof'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'gst-registration');

UPDATE service_document_templates 
SET condition = '{"question_key": "entity_type", "operator": "includes_any", "values": ["pvt_ltd", "llp", "public_ltd"]}'
WHERE document_key = 'board_resolution_signed'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'iec-code');

UPDATE service_document_templates 
SET condition = '{"question_key": "applicant_type", "operator": "includes_any", "values": ["msme", "startup"]}'
WHERE document_key = 'msme_startup_cert'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');
```

---

## STEP 9 — MISSING DOCUMENTS TO SEED

**`pvt-ltd-incorporation`:**
```sql
INSERT INTO service_document_templates 
  (service_package_id, document_key, document_label, description, direction, stage_key, is_required, condition, display_order)
VALUES
(
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation'),
  'noc_template', 'NOC from Property Owner — Fillable Template',
  'Our CA provides a pre-filled NOC template. Have your landlord fill in their details and sign. Upload the signed copy back here.',
  'to_customer', 'spice_filed', true,
  '{"question_key": "premises_type", "operator": "not_equals", "value": "owned"}', 100
),
(
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation'),
  'dsc_authorization_template', 'DSC Authorization Letter — Fillable Template',
  'Pre-drafted DSC authorization for each director. Download, sign on company letterhead, and return.',
  'to_customer', 'dsc_applied', true, NULL, 101
),
(
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation'),
  'dir2_consent', 'DIR-2 Consent to Act as Director',
  'CA prepares one per director. Download, sign, and upload back. Required by MCA before SPICe+ is filed.',
  'to_customer', 'spice_filed', true, NULL, 102
),
(
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation'),
  'inc9_declaration', 'INC-9 Declaration',
  'Statutory declaration by each director confirming they are not disqualified. CA prepares this. Download, sign, and return.',
  'to_customer', 'spice_filed', true, NULL, 103
);
```

**`llp-incorporation`:**
```sql
INSERT INTO service_document_templates 
  (service_package_id, document_key, document_label, description, direction, stage_key, is_required, condition, display_order)
VALUES
(
  (SELECT id FROM service_packages WHERE slug = 'llp-incorporation'),
  'noc_template', 'NOC from Property Owner — Fillable Template',
  'Our CA provides a pre-filled NOC template. Have your landlord fill in their details and sign. Upload the signed copy back here.',
  'to_customer', 'fillip_filed', true,
  '{"question_key": "premises_type", "operator": "not_equals", "value": "owned"}', 100
),
(
  (SELECT id FROM service_packages WHERE slug = 'llp-incorporation'),
  'dsc_authorization_template', 'DSC Authorization Letter — Fillable Template',
  'Pre-drafted DSC authorization for each partner. Download, sign, and return.',
  'to_customer', 'dpin_applied', true, NULL, 101
),
(
  (SELECT id FROM service_packages WHERE slug = 'llp-incorporation'),
  'llp5_consent', 'LLP Partner Consent Form (Form LLP-5)',
  'CA prepares one per designated partner. All partners must sign and return before FiLLiP is filed.',
  'to_customer', 'fillip_filed', true, NULL, 102
);
```

**`iec-code` — update:**
```sql
UPDATE service_document_templates
SET direction = 'to_customer',
    document_label = 'Board Resolution — Fillable Template',
    description = 'CA provides a pre-drafted board resolution authorizing the named individual to apply for IEC. Download, have authorized director(s) sign on company letterhead, and upload.'
WHERE document_key = 'board_resolution_signed'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'iec-code');
```

**`roc-changes` — update:**
```sql
UPDATE service_document_templates
SET direction = 'to_customer',
    stage_key = 'forms_preparation',
    document_label = 'Board Resolution — Fillable Template',
    description = 'CA provides a pre-drafted board resolution. Download, have required directors sign on company letterhead, and upload.'
WHERE document_key = 'board_resolution'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'roc-changes');
```

**`mca-annual-filing` — update:**
```sql
UPDATE service_document_templates
SET direction = 'to_customer',
    document_label = 'DSC Authorization Letter — Fillable Template',
    description = 'Pre-drafted authorization for the director whose DSC signs AOC-4 and MGT-7. Download, sign on company letterhead, and upload.'
WHERE document_key = 'director_dsc_authorization'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'mca-annual-filing');
```

**`partnership-registration` — remove:**
```sql
DELETE FROM service_document_templates 
WHERE document_key = 'partnership_deed_draft_input'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'partnership-registration');
```

**`esi-registration` — add:**
```sql
INSERT INTO service_document_templates 
  (service_package_id, document_key, document_label, description, direction, stage_key, is_required, display_order)
VALUES (
  (SELECT id FROM service_packages WHERE slug = 'esi-registration'),
  'specimen_signature_card', 'Specimen Signature Card',
  'ESIC requires a specimen signature of the employer. Download the ESIC format, sign in the designated box, and upload.',
  'from_customer', 'application_filed', true, 100
);
```

**`pf-registration` — add:**
```sql
INSERT INTO service_document_templates 
  (service_package_id, document_key, document_label, description, direction, stage_key, is_required, display_order)
VALUES
(
  (SELECT id FROM service_packages WHERE slug = 'pf-registration'),
  'form_2_nomination', 'Form 2 — Nomination and Declaration (per employee)',
  'Every PF-enrolled employee must submit Form 2 nominating a family member. We provide the blank form. Collect from each employee and upload as a zip.',
  'to_customer', 'registration_certificate', true, 100
),
(
  (SELECT id FROM service_packages WHERE slug = 'pf-registration'),
  'family_declaration_form', 'Family Details Declaration (per employee)',
  'Family details form required by EPFO for each employee. Collect and upload together.',
  'to_customer', 'registration_certificate', true, 101
);
```

---

## STEP 10 — MISSING QUESTIONNAIRE FIELDS

**`gst-registration`:**
```sql
INSERT INTO service_questionnaires 
  (service_package_id, question_key, question_label, question_type, options, validation, is_active, is_pre_payment, step_number, display_order)
VALUES (
  (SELECT id FROM service_packages WHERE slug = 'gst-registration'),
  'has_existing_gstin', 'Does your business have an existing or previously cancelled GSTIN?',
  'radio', '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}]',
  '{"required": true}', true, false, 1, 5
);
INSERT INTO service_questionnaires 
  (service_package_id, question_key, question_label, question_type, validation, depends_on, is_active, is_pre_payment, step_number, display_order)
VALUES (
  (SELECT id FROM service_packages WHERE slug = 'gst-registration'),
  'existing_gstin', 'Existing / previous GSTIN', 'text',
  '{"required": true, "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"}',
  '{"question_key": "has_existing_gstin", "value": "yes"}',
  true, false, 1, 6
);
```

**`iec-code`:**
```sql
INSERT INTO service_questionnaires 
  (service_package_id, question_key, question_label, question_type, options, validation, is_active, is_pre_payment, step_number, display_order)
VALUES (
  (SELECT id FROM service_packages WHERE slug = 'iec-code'),
  'application_purpose', 'Are you applying for a new IEC or modifying an existing one?', 'select',
  '[{"value": "new", "label": "New IEC Registration"}, {"value": "modification", "label": "Modification of Existing IEC"}]',
  '{"required": true}', true, false, 1, 0
);
INSERT INTO service_questionnaires 
  (service_package_id, question_key, question_label, question_type, validation, depends_on, is_active, is_pre_payment, step_number, display_order)
VALUES (
  (SELECT id FROM service_packages WHERE slug = 'iec-code'),
  'existing_iec', 'Existing IEC number', 'text',
  '{"required": true, "minLength": 10, "maxLength": 10}',
  '{"question_key": "application_purpose", "value": "modification"}',
  true, false, 1, 1
);
```

**`trademark-registration`:**
```sql
INSERT INTO service_questionnaires 
  (service_package_id, question_key, question_label, question_type, options, validation, is_active, is_pre_payment, step_number, display_order)
VALUES (
  (SELECT id FROM service_packages WHERE slug = 'trademark-registration'),
  'has_prior_trademarks', 'Do you have any existing trademark registrations in India or abroad?',
  'radio', '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}]',
  '{"required": true}', true, false, 1, 99
);
INSERT INTO service_questionnaires 
  (service_package_id, question_key, question_label, question_type, help_text, depends_on, validation, is_active, is_pre_payment, step_number, display_order)
VALUES (
  (SELECT id FROM service_packages WHERE slug = 'trademark-registration'),
  'prior_trademark_details', 'Details of existing trademarks', 'textarea',
  'Trademark name, registration number, class, country — one per line. Required for TM-A Section 5.',
  '{"question_key": "has_prior_trademarks", "value": "yes"}',
  '{"required": true}', true, false, 1, 100
);
```

**`msme-registration`:**
```sql
INSERT INTO service_questionnaires 
  (service_package_id, question_key, question_label, question_type, validation, is_active, is_pre_payment, step_number, display_order)
VALUES
(
  (SELECT id FROM service_packages WHERE slug = 'msme-registration'),
  'bank_account_number', 'Bank account number', 'text',
  '{"required": true, "minLength": 9, "maxLength": 18, "pattern": "^[0-9]+$"}',
  true, false, 3, 98
),
(
  (SELECT id FROM service_packages WHERE slug = 'msme-registration'),
  'bank_ifsc', 'IFSC code', 'text',
  '{"required": true, "minLength": 11, "maxLength": 11, "pattern": "^[A-Z]{4}0[A-Z0-9]{6}$"}',
  true, false, 3, 99
);
```

**`pvt-ltd-incorporation`, `llp-incorporation`, `partnership-registration` — add `address_same_as_aadhaar` to director/partner step:**
```sql
INSERT INTO service_questionnaires 
  (service_package_id, question_key, question_label, question_type, options, help_text, validation, is_active, is_pre_payment, step_number, display_order)
VALUES (
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation'),
  'address_same_as_aadhaar',
  'Is your current residential address the same as on your Aadhaar card?',
  'radio', '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}]',
  'If yes, your Aadhaar serves as address proof. No separate upload needed.',
  '{"required": true}', true, false, 5, 0
);
-- Repeat for llp-incorporation (use the partner details step_number)
-- Repeat for partnership-registration (use the partner details step_number)
```

Conditional document logic: if `address_same_as_aadhaar = yes` → hide `director_address_proof` / `partner_address_proof`. Registered office utility bill always required — never suppressed.

---

## STEP 11 — WORK DOCUMENTS STAGE FILTERING

**Step 1d must be completed before this step.** `workflow_stages` must have `stage_key` on each object before any stage-based filtering can work.

**File: `/apps/customer/components/orders/WorkDocumentsSection.tsx`**

Only used in `/apps/customer/app/(main)/orders/[id]/page.tsx`. Safe to add a prop.

Add `activeStageKey?: string`. When provided, filter to `doc.stage_key === activeStageKey`. When not provided, show all.

**File: `/apps/customer/app/(main)/orders/[id]/page.tsx`**

```typescript
const completedStages = stageHistoryCount  // count of order_stage_history entries for this order
const workflowStages = order.service_package?.workflow_stages || []
const currentStageIndex = Math.min(completedStages, workflowStages.length - 1)
const activeStageKey = workflowStages[currentStageIndex]?.stage_key  // now exists after Step 1d migration
```

Pass `activeStageKey` to `WorkDocumentsSection`.

Also fix `profile/page.tsx` line 266: change `?.stage_name` to `?.title` for the display string (since `title` is the human-readable field that actually exists in the JSONB).

ZIP download: each stage's document group gets its own "Download all as ZIP" button. Inside the stage section, not on the order summary page. Same button styling as existing download buttons.

---

## DO NOT DO

- Do not create new React components. Extend existing ones.
- Do not create a new answer storage table. Use `order_questionnaire_responses` — `(order_id, question_key)` unique constraint handles coexistence of pre-cursor and post-payment answers.
- Do not load pre-payment questions in the post-payment questionnaire. Use `.eq('is_pre_payment', false)`.
- Do not change checkout flow for services with no pre-payment questions.
- Do not use `question_key` alone in any UPDATE on `service_questionnaires` — always include `service_package_id`.
- Do not touch the patent service — it does not exist.
- Do not introduce any new colours, fonts, spacing, or component patterns.
- Do not attempt stage filtering in WorkDocumentsSection until Step 1d migration is complete and verified.

---

## COMPLETION REPORT — REQUIRED OUTPUT AFTER FINISHING

When all steps are complete, provide a structured report in exactly this format. Do not summarise what you did — answer each question precisely.

**SCHEMA**
- Paste the exact SQL used for the `is_pre_payment` column addition
- Paste the exact SQL used for the `condition` column addition
- What new order status values were added and to which constraint/enum?
- For Step 1d: for each service slug updated, paste the final `workflow_stages` array condensed to just `step` and `stage_key` per object

**ELIGIBILITY PAGE**
- Full file path of the new eligibility page
- For each of the 7 services, does navigating to `/checkout/[serviceId]/eligibility` load the pre-cursor questions? (yes/no per service)
- What happens when a service with no pre-payment questions hits the eligibility URL?

**PRE-CURSOR QUESTIONS — paste the full result of this query:**
```sql
SELECT sp.slug, sq.question_key 
FROM service_questionnaires sq
JOIN service_packages sp ON sq.service_package_id = sp.id
WHERE sq.is_pre_payment = true
ORDER BY sp.slug, sq.display_order;
```

**PRICING SPOT CHECKS**
- Trademark: 2 classes, individual applicant → computed `govtFeePaisa`? (expected: 900000)
- Trademark: 2 classes, MSME applicant → computed `govtFeePaisa`? (expected: 900000)
- Trademark: 3 classes, company applicant → computed `govtFeePaisa`? (expected: 2700000)
- Pvt Ltd: ₹1L capital, 2 directors → computed `govtFeePaisa`? (expected: 799900)
- Pvt Ltd: ₹5L capital, 3 directors → computed `govtFeePaisa`? (expected: 1120000)
- LLP: ₹1L–₹5L contribution, 2 partners → computed `govtFeePaisa`? (expected: 200000)
- LLP: above ₹10L contribution, 4 partners → computed `govtFeePaisa`? (expected: 740000)
- Paste the `options` JSONB for the `authorized_capital` question (Pvt Ltd) — needed to confirm slab keys match
- Paste the `options` JSONB for the `total_contribution` question (LLP) — needed to confirm slab keys match

**SESSIONSTORAGE**
- Exact key used in sessionStorage? (expected: `ollvy_pre_cursor`)
- Is `clearPreCursorAnswers()` called before `setSuccessModal()`? (yes/no)
- If payment fails and user retries, are pre-cursor answers preserved? (yes/no)

**CONDITIONAL DOCUMENTS — paste the full result of this query:**
```sql
SELECT sp.slug, sdt.document_key, sdt.condition
FROM service_document_templates sdt
JOIN service_packages sp ON sdt.service_package_id = sp.id
WHERE sdt.condition IS NOT NULL
ORDER BY sp.slug, sdt.document_key;
```

**POST-PAYMENT QUESTIONNAIRE**
- Does the post-payment questionnaire query include `.eq('is_pre_payment', false)`? (yes/no)
- Is the "Confirmed before payment" summary card rendered if pre-cursor answers exist? (yes/no)
- Are pre-cursor questions shown anywhere in the post-payment flow? (yes/no — must be no)

**WORK DOCUMENTS STAGE FILTERING**
- Does `WorkDocumentsSection` accept `activeStageKey` prop? (yes/no)
- Is `activeStageKey` computed and passed from the order page? (yes/no)
- For a Pvt Ltd order at `dsc_applied` stage — list the `document_key` values shown by `WorkDocumentsSection`

**MISSING DOCUMENTS — paste the full result of this query:**
```sql
SELECT sp.slug, sdt.document_key, sdt.direction, sdt.stage_key
FROM service_document_templates sdt
JOIN service_packages sp ON sdt.service_package_id = sp.id
WHERE sdt.document_key IN (
  'noc_template', 'dsc_authorization_template', 'dir2_consent', 'inc9_declaration',
  'llp5_consent', 'specimen_signature_card', 'form_2_nomination', 'family_declaration_form'
)
ORDER BY sp.slug, sdt.document_key;
```

**DELETED / UPDATED DOCUMENTS**
- `SELECT COUNT(*) FROM service_document_templates WHERE document_key = 'partnership_deed_draft_input'` — paste result (expected: 0)
- `board_resolution_signed` for `iec-code` has `direction = 'to_customer'`? (yes/no)
- `director_dsc_authorization` for `mca-annual-filing` has `direction = 'to_customer'`? (yes/no)

**MISSING QUESTIONNAIRE FIELDS — paste the full result of this query:**
```sql
SELECT sp.slug, sq.question_key
FROM service_questionnaires sq
JOIN service_packages sp ON sq.service_package_id = sp.id
WHERE sq.question_key IN (
  'has_existing_gstin', 'existing_gstin',
  'application_purpose', 'existing_iec',
  'has_prior_trademarks', 'prior_trademark_details',
  'bank_account_number', 'bank_ifsc',
  'address_same_as_aadhaar',
  'trademark_class_count',
  'voluntary_registration'
)
ORDER BY sp.slug, sq.question_key;
```

**BUTTONS AND LABELS**
- For each of the 7 services with pre-cursor questions: CTA label is "Check Eligibility & Price" and routes to `/checkout/[serviceId]/eligibility`? (yes/no per service)
- For all other services: CTA still "Checkout" routing to `/checkout/[serviceId]`? (yes/no)
- `trademark-registration` card shows "Starting from ₹12,499"? (yes/no)
- `pvt-ltd-incorporation` card shows "Starting from ₹22,999"? (yes/no)
- `llp-incorporation` card shows "Starting from ₹12,999"? (yes/no)
- `professional-tax` card shows flat price with no "Starting from"? (yes/no)


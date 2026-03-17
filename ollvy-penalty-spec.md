# Ollvy — Penalty Calculator Suite
## Complete Product + SEO Specification for Claude Code
**Version 2.0 · March 2026 · 10 Calculators**

---

## How to Use This Document

Read every section before writing a single line of code. Later sections override earlier ones if anything conflicts. Build one calculator at a time and pass all test cases before moving to the next.

> **RULE:** Do not infer intent. Every field, formula, slider range, warning trigger, FAQ, and SEO element is specified explicitly. If something is not in this document, ask before guessing.

> **RULE:** All rupee arithmetic uses integers in paisa. Convert to paisa before calculation, convert back to rupees for display. Never use floating point for money.

> **RULE:** Always round UP partial months for all interest calculations (234A, 234B, 201(1A), PF interest). 1.5 months = 2 months of interest. This is statutory — not an approximation.

---

## Table of Contents

1. All 10 Calculators — Overview
2. Global UI Standards and Shared Components
3. Input Slider Maxima and Filtering Logic
4. Calculator 1 — GST Late Filing
5. Calculator 2 — ITR Late Filing
6. Calculator 3 — MCA Annual Filing
7. Calculator 4 — Director KYC
8. Calculator 5 — TDS Late Filing
9. Calculator 6 — PF / ESIC Late Payment
10. Calculator 7 — Professional Tax Penalty
11. Calculator 8 — GST Demand Notice (Section 73 / 74)
12. Calculator 9 — Startup / DPIIT Compliance
13. Calculator 10 — Shops & Establishment Act
14. FAQs — Full Text for All 10 Calculators
15. SEO — Complete Technical Specification
16. Shareable URLs and Download Result
17. Internal Linking Map
18. Content Cluster — Article Briefs
19. Test Cases — All 10 Calculators
20. Implementation Order

---

## Section 1 — All 10 Calculators

| # | Calculator Name | URL Slug | Primary Law | Target User |
|---|---|---|---|---|
| 1 | GST Late Filing Penalty | `gst-late-filing` | CGST Act Sec 47, 50 | All GST-registered businesses |
| 2 | ITR Late Filing Penalty | `itr-late-filing` | IT Act Sec 234A, 234B, 234C, 234F | All taxpaying entities |
| 3 | MCA Annual Filing Penalty | `mca-annual-filing` | Companies Act 2013 Sec 92, 137, 403 | Pvt Ltd, LLP companies |
| 4 | Director KYC Penalty | `director-kyc` | Companies Act 2013 Sec 12(1) | All company directors |
| 5 | TDS Late Filing Penalty | `tds-late-filing` | IT Act Sec 234E, 271H, 201(1A) | Any employer / deductor |
| 6 | PF / ESIC Late Payment | `pf-esic-penalty` | EPF Act 1952, ESI Act 1948 | Any business with employees |
| 7 | Professional Tax Penalty | `professional-tax-penalty` | State PT Acts | Employers in PT-applicable states |
| 8 | GST Demand Notice (Sec 73/74) | `gst-demand-notice` | CGST Act Sec 73, 74 | GST-registered businesses with notices |
| 9 | Startup / DPIIT Compliance | `startup-dpiit-compliance` | FEMA, Companies Act, SEBI | DPIIT-recognised startups, funded cos |
| 10 | Shops & Establishment Act | `shops-establishment-penalty` | State S&E Acts | Any business with a physical office |

Calculators 6–10 are built after 1–5 are live and tested. Infrastructure is identical — build it once, add calculators progressively.

---

## Section 2 — Global UI Standards and Shared Components

### 2.1 Layout

```
Desktop (>=1024px):   Two-column. Left 60% inputs. Right 40% sticky results panel.
Tablet (768–1023px):  Two-column, 55/45 split.
Mobile (<768px):      Single column. Inputs first. Results panel below, not sticky.
Max page width:       1280px, centred.
```

```
┌─────────────────────────────────────┬─────────────────────────────────────┐
│                                     │                                     │
│         INPUT SECTION               │         RESULT SECTION              │
│                                     │                                     │
│  ┌─────────────────────────────┐   │   ┌─────────────────────────────┐   │
│  │  [Icon] Calculator Title    │   │   │  TOTAL PENALTY              │   │
│  └─────────────────────────────┘   │   │                             │   │
│                                     │   │      ₹45,000                │   │
│  Input Field 1                      │   │                             │   │
│  ┌─────────────────────────────┐   │   │  ───────────────────────    │   │
│  │  [Dropdown / Slider / etc]  │   │   │                             │   │
│  └─────────────────────────────┘   │   │  Breakdown:                 │   │
│                                     │   │  • Late Fee: ₹25,000       │   │
│  Input Field 2                      │   │  • Interest: ₹20,000       │   │
│  ┌─────────────────────────────┐   │   │                             │   │
│  │  [Toggle / Input / etc]     │   │   │  ───────────────────────    │   │
│  └─────────────────────────────┘   │   │                             │   │
│                                     │   │  [Statute Reference]        │   │
│  ▼ Advanced filters                 │   │                             │   │
│  ┌─────────────────────────────┐   │   │  ┌─────────────────────┐   │   │
│  │  Additional inputs...       │   │   │  │  [File Now CTA]     │   │   │
│  └─────────────────────────────┘   │   │  └─────────────────────┘   │   │
│                                     │   │                             │   │
│                                     │   │  [Share Result]             │   │
│                                     │   │  [Download PDF]             │   │
│                                     │   └─────────────────────────────┘   │
└─────────────────────────────────────┴─────────────────────────────────────┘
```

### 2.2 Tab Navigation

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [GST Filing]  [ITR Filing]  [MCA Filing]  [Director KYC]  [TDS Filing] │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Inactive tab:** `bg-muted text-muted-foreground` (gray pill)
- **Active tab:** `bg-emerald-600 text-white` (GREEN pill) — NOT red
- **Shape:** `rounded-full`
- **Spacing:** `gap-2` between tabs
- Tab bar scrolls horizontally on mobile — do not truncate or wrap labels
- Show only live tabs. Do not show disabled/greyed-out tabs for unbuilt calculators.

### 2.3 Accordion Label

Every collapsible section of additional inputs must be labelled: **"Advanced filters"**

Not "Calculation details". Not "More options". Not "Additional inputs". Closed by default on every calculator.

### 2.4 Shared Components — Build All Before Starting Any Calculator

#### TurnoverSlider.tsx

- **Range:** ₹0 to ₹5,00,00,00,000 (₹500 Crore). This is the absolute maximum — do not cap lower.
- **Scale:** Logarithmic. Linear scale is unusable — a ₹10L business and a ₹500Cr business both need usable precision.
- **Breakpoint ticks with labels:** ₹1L · ₹5L · ₹10L · ₹50L · ₹1Cr · ₹5Cr · ₹10Cr · ₹50Cr · ₹100Cr · ₹500Cr
- **Display above slider:** Format as human-readable Indian numbers — "₹50 Lakh" / "₹2.5 Crore" / "₹150 Crore" — never raw digits like "150000000"
- **Also show a text input** alongside the slider so users can type exact values
- **Props:** `value` (number, in rupees), `onChange`, `label` (default: "Annual Turnover"), `maxCrore` (default: 500)

#### EmployeeCountSlider.tsx

- **Range:** 1 to 10,000
- **Scale:** Logarithmic
- **Marks:** 1 · 5 · 10 · 20 · 50 · 100 · 250 · 500 · 1000 · 5000 · 10000
- **Display:** "X employees"
- **Props:** `value`, `onChange`, `label` (default: "Number of Employees"), `maxCount` (default: 10000)

#### DaysLateSlider.tsx

- **Range:** 1 to `maxDays` prop
- **Default maxDays:** 365. MCA calculator passes `maxDays=1095`.
- **Marks:** 7 · 30 · 60 · 90 · 180 · 270 · 365. If maxDays > 365 also show: 548 · 730 · 1095
- **Display:** under 365 → "X days late" / 365–729 → "X days (Y months) late" / 730+ → "X days (Y years Z months) late"
- **Props:** `value`, `onChange`, `maxDays` (default: 365), `label`

#### MonthsLateSlider.tsx

- Used by PF/ESIC and Professional Tax calculators
- **Range:** 1 to 60 months (5 years)
- **Marks:** 1 · 3 · 6 · 12 · 24 · 36 · 48 · 60
- **Display:** "X months late" or "X years Y months late"
- **Props:** `value`, `onChange`, `label`

#### RupeeInput.tsx

- On change: strip non-numeric, store raw integer in state
- On blur: format as Indian number system (₹12,45,000 not ₹1,245,000)
- On focus: show raw unformatted number for easy editing
- Placeholder: "Enter amount in ₹"
- **Props:** `value`, `onChange`, `label`, `helpText`, `required`

#### ResultsPanel.tsx

- **Header:** "TOTAL PENALTY" · subtitle: "Calculated as of [today date]"
- **Primary number:** large `text-4xl font-bold text-emerald-700` — total penalty
- **Breakdown table:** label | amount | statute reference (e.g. "Late Filing Fee | ₹1,500 | Sec 47 CGST Act")
- **Divider line** above total row
- **Total row:** bold, slightly larger text
- **Disclaimer (always visible):** "This is an estimate based on the information provided. Actual penalties may differ. This tool does not constitute legal or tax advice. Consult a qualified CA or legal professional for your specific situation."
- **CTA button:** appears only after at least one input has been entered and a non-zero result exists
- **Share Result button:** generates shareable URL with params (see Section 16)
- **Download PDF button:** browser print API (see Section 16)

#### WarningBanner.tsx

- **yellow variant:** `bg-amber-50 border-amber-200 text-amber-900` + amber warning icon
- **red variant:** `bg-red-50 border-red-200 text-red-900` + red alert icon
- **Props:** `variant` ("yellow" | "red"), `title` (bold heading), `body` (explanatory text)

#### InfoBanner.tsx

- `bg-blue-50 border-blue-200 text-blue-900` + blue info icon
- **Props:** `title`, `body`

#### StatutoryRef.tsx

- Small inline chip shown in breakdown table
- e.g. "Sec 47, CGST Act" in `bg-gray-100` with hover tooltip showing full reference
- **Hover tooltip:** "Section 47 of Central Goods and Services Tax Act, 2017 — Late fee for failure to furnish return"

---

## Section 3 — Input Slider Maxima and Filtering Logic

### 3.1 Slider Maxima — Complete Reference

| Slider | Component | Minimum | Maximum | Used In |
|---|---|---|---|---|
| Annual Turnover | TurnoverSlider | ₹0 | ₹500 Crore | GST, ITR, MCA, PT |
| Days Late (short) | DaysLateSlider (maxDays=365) | 1 day | 365 days | GST, ITR, TDS |
| Days Late (long) | DaysLateSlider (maxDays=1095) | 1 day | 1095 days (3 years) | MCA |
| Months Late | MonthsLateSlider | 1 month | 60 months (5 years) | PF/ESIC, PT |
| Employee Count | EmployeeCountSlider | 1 | 10,000 | PF/ESIC, PT, S&E |
| Number of Directors | Number Input | 1 | 50 | Director KYC, MCA |
| Years of Default | Number Input | 1 | 10 | MCA, PF/ESIC |
| TDS Amount | RupeeInput | ₹1 | No cap | TDS |
| Outstanding Tax | RupeeInput | ₹0 | No cap | GST, ITR |
| Advance Tax Paid % | Slider 0–100 | 0% | 100% | ITR |
| Demand Amount (Sec 73/74) | RupeeInput | ₹1 | No cap | GST Demand |

### 3.2 Conditional Show/Hide Rules — Complete Reference

| Calculator | Input Field | Show When | Hide When |
|---|---|---|---|
| GST | Filing Frequency dropdown | Return Type = GSTR-3B | Return Type = GSTR-1 or GSTR-9 |
| GST | QRMP InfoBanner | Turnover ≤ ₹5 Crore AND Return = GSTR-3B | Turnover > ₹5 Crore |
| ITR | Audit Required toggle | Always visible | — |
| ITR | Due date display | Always — auto-computed from entity + turnover | — |
| ITR | Advance Tax Paid Amount | Was Advance Tax Paid = Yes | Was Advance Tax Paid = No |
| ITR | Sec 271B warning | Audit Required = Yes AND filing_date > 31 Oct | Audit Required = No |
| MCA | MGT-7A option | Entity = Pvt Ltd AND Paid-up Capital < ₹10L | Entity = LLP or Capital ≥ ₹10L |
| MCA | LLP Form 8 / Form 11 | Entity = LLP | Entity = Pvt Ltd or Public Ltd |
| MCA | Director disqualification red banner | Years of Default ≥ 3 OR Days > 1095 | Years < 3 AND Days ≤ 1095 |
| MCA | Strike-off warning | Days > 365 | Days ≤ 365 |
| TDS | Days Late — Deposit | Deposit Status = Late or Not Deducted | Deposit Status = On Time |
| TDS | Sec 40(a)(ia) red banner | Deposit Status = Not Deducted | Deposit Status = On Time or Late |
| TDS | Sec 271H advisory | Always — with waiver condition note | — |
| PF/ESIC | ESIC inputs | Employee Count ≥ 10 | Employee Count < 10 |
| PT | PT Rate table | State selected | No state selected |
| GST Demand | Sec 74 calculation | Fraud = Yes | Fraud = No (show Sec 73) |

### 3.3 GSTR-9 Cap Calculation — Critical

```js
// CORRECT — 0.25% cap (Notification 07/2023-Central Tax, 31 March 2023)
const maxPenalty = Math.floor(annual_turnover_rupees * 0.0025)
const dailyFee = 200 * days_late
const lateFee = Math.min(dailyFee, maxPenalty)

// Show both in results:
// "Calculated: ₹X · Cap (0.25% of ₹Y Cr): ₹Z · Applied: ₹[lower]"
```

> **CRITICAL: 0.25% NOT 0.5%.** Notification 07/2023-CT (31 March 2023) reduced the GSTR-9 cap. Source: cbic.gov.in/resources/htdocs-cbec/gst/notfctn-07-central-tax-english-2023.pdf — Anyone using 0.5% is giving wrong output.

### 3.4 QRMP Eligibility

- Show QRMP InfoBanner when: `turnover ≤ ₹5,00,00,000` AND `Return Type = GSTR-3B`
- Banner text: "With annual turnover up to ₹5 Crore, you may be eligible for the QRMP scheme. Under QRMP, GSTR-3B is filed quarterly (not monthly), but tax is paid monthly via PMT-06 challan. Late fees under QRMP apply per quarter."

### 3.5 Employee Count Thresholds

| Count | PF Applicable? | ESIC Applicable? |
|---|---|---|
| 1–9 | No (voluntary) | No |
| 10–19 | No (voluntary) | Yes |
| 20+ | Yes (mandatory) | Yes |

- If `employee_count < 20`: InfoBanner — "PF registration is mandatory for establishments with 20 or more employees. Below 20, registration is voluntary. If you have voluntarily registered, penalties apply from your registration date."
- If `employee_count < 10`: Hide ESIC section entirely — InfoBanner: "ESIC applies to establishments with 10 or more employees."

---

## Section 4 — Calculator 1: GST Late Filing Penalty

**URL:** `/tools/penalty-calculator/gst-late-filing`
**Component:** `GSTLatePenaltyCalculator.tsx`

### Inputs

| Order | Field | Component | Options / Range | Default |
|---|---|---|---|---|
| 1 | Return Type | Dropdown | GSTR-1 (Sales), GSTR-3B (Summary), GSTR-9 (Annual) | GSTR-3B |
| 2 | Is Nil Return? | Toggle Switch | Yes / No | No |
| 3 | Annual Turnover | TurnoverSlider | ₹0 to ₹500 Crore | ₹1 Crore |
| 4 | Days Late | DaysLateSlider (maxDays=365) | 1 to 365 | 30 |
| **Advanced filters** | | | | |
| 5 | Outstanding GST Liability | RupeeInput | ₹0+ | ₹0 |
| 6 | Filing Frequency | Dropdown (show only for GSTR-3B) | Monthly, Quarterly (QRMP) | Monthly |
| 7 | State of Registration | Dropdown (all 36 states/UTs) | All Indian states and UTs | Delhi |

**Helper text:**
- Under "Is Nil Return?": "Nil returns have lower penalty rates"
- Under "Annual Turnover": Show "Eligible for QRMP scheme" badge if ≤ ₹5 Crore
- Under "Days Late": Show the return due date based on return type selected

### Calculation Logic

```js
function calculateGSTPenalty(inputs) {
  const { returnType, isNilReturn, turnover, daysLate, outstandingTax } = inputs

  let dailyRate, maxCap

  if (returnType === 'GSTR-9') {
    dailyRate = 200 // ₹100 CGST + ₹100 SGST
    maxCap = Math.floor(turnover * 0.0025) // 0.25% of turnover — NOT 0.5%
  } else {
    // GSTR-1 or GSTR-3B
    dailyRate = isNilReturn ? 20 : 50 // nil: ₹10+₹10, regular: ₹25+₹25
    maxCap = 5000
  }

  const lateFee = Math.min(dailyRate * daysLate, maxCap)
  // Interest on outstanding tax: Section 50, 18% p.a.
  const interest = Math.round(outstandingTax * 0.18 * (daysLate / 365))

  return {
    lateFee,
    lateFeeCGST: lateFee / 2,
    lateFeeSGST: lateFee / 2,
    interest,
    total: lateFee + interest,
    statute: returnType === 'GSTR-9'
      ? 'Section 47, CGST Act 2017 (Annual Return) + Section 50 (Interest)'
      : 'Section 47, CGST Act 2017 + Section 50 (Interest)'
  }
}
```

### Result Section Display

```
TOTAL PENALTY
₹[total]

────────────────────────
Late Filing Fee
  CGST: ₹[lateFeeCGST]
  SGST: ₹[lateFeeSGST]

Interest on Outstanding Tax
  ₹[interest] (18% p.a., Section 50)

────────────────────────
📅 Your due date was: [dueDate]
📖 [statute]

[File GST Returns →]  [Share Result]  [Download PDF]
```

### Warning Banners

- `days_late > 30`: Yellow — "Late fees are increasing daily. Every additional day adds ₹[rate] to your liability."
- `lateFee >= 5000` (cap hit for GSTR-1/3B): Blue InfoBanner — "Your late fee has reached the maximum cap of ₹5,000. Filing today or in 30 days results in the same late fee — but interest on unpaid tax under Section 50 continues to accrue daily."
- `returnType = GSTR-9 AND lateFee = maxCap`: Blue — "Your GSTR-9 late fee is capped at 0.25% of your annual turnover (₹[cap_amount])."
- `outstandingTax > 0 AND days_late > 30`: Yellow — "Interest on unpaid GST accrues at 18% per annum under Section 50. Make payment immediately to stop interest from growing."

### Page H2 Structure (SEO — Visible HTML, Not Hidden)

- H2: What is the GST late filing penalty in India?
- H2: GST late fee for GSTR-1 and GSTR-3B — how is it calculated?
- H2: GSTR-9 annual return penalty — 2024-25 rates
- H2: Can GST late fees be waived?
- H2: How to avoid GST late fees going forward
  - H3: Set up monthly reminders for GST due dates
  - H3: Switch to QRMP scheme if eligible
  - H3: Use Ollvy for managed GST filing

---

## Section 5 — Calculator 2: ITR Late Filing Penalty

**URL:** `/tools/penalty-calculator/itr-late-filing`
**Component:** `ITRLatePenaltyCalculator.tsx`

### Inputs

| Order | Field | Component | Options / Range | Default |
|---|---|---|---|---|
| 1 | Entity Type | Dropdown | Individual, HUF, Partnership Firm, LLP, Company | Individual |
| 2 | Financial Year | Dropdown | FY 2024-25, FY 2023-24, FY 2022-23, FY 2021-22 | FY 2024-25 |
| 3 | Is Audit Required? | Toggle Switch | Yes / No (auto-suggest, user can override) | Auto |
| 4 | Total Annual Income | TurnoverSlider | ₹0 to ₹500 Crore | ₹10 Lakh |
| 5 | Outstanding Tax Liability | RupeeInput | ₹0+ | ₹0 |
| **Advanced filters** | | | | |
| 6 | Days Late from Due Date | DaysLateSlider (maxDays=365) | 1 to 365 | 30 |
| 7 | Was Advance Tax Paid? | Toggle | Yes / No | Yes |
| 8 | Advance Tax Paid Amount | RupeeInput (show only if above = Yes) | ₹ amount | — |
| 9 | TDS Deducted (₹) | RupeeInput | Credit against tax liability | — |

**Helper text:**
- Under "Entity Type": Show applicable due date based on selection (see Due Date Logic below)
- Under "Is Audit Required?": "Required if turnover > ₹1 Cr (or ₹10 Cr with ≤5% cash)"
- Under "Total Annual Income": "Penalty is ₹1,000 if income ≤ ₹5 lakh, ₹5,000 if higher"

### Due Date Logic — Display Dynamically

| Entity + Condition | Audit Required | Due Date |
|---|---|---|
| Individual/HUF — business turnover ≤ ₹1 Crore | No | 31 July |
| Individual/HUF — business turnover > ₹1 Crore | Yes | 31 October |
| Individual/HUF — profession gross receipts > ₹50 Lakh | Yes | 31 October |
| Individual/HUF — turnover > ₹10 Crore, ≥5% cash | Yes | 31 October |
| Individual/HUF — turnover > ₹10 Crore, <5% cash | No | 31 July |
| Partnership Firm — turnover > ₹1 Crore | Yes | 31 October |
| LLP — any | Yes | 31 October |
| Pvt Ltd / Public Ltd — any | Yes (always) | 31 October |
| Any entity with international transactions (Sec 92E) | Yes | 30 November |

Display: "Based on your inputs: Audit is likely [Required / Not Required]. Your due date: [date]. You are [X] days past the due date."

### Calculation Logic

```js
function calculateITRPenalty(inputs) {
  const { totalIncome, outstandingTax, daysLate, advanceTaxPaid } = inputs

  // Section 234F — FLAT fee, not per day
  let lateFee = 0
  const BASIC_EXEMPTION = 250000 // ₹2.5L for individuals under 60
  // ₹3,00,000 for senior citizens (age 60–79), ₹5,00,000 for super seniors (age 80+)
  // Use the applicable basic exemption based on age — default to ₹2.5L
  if (totalIncome > BASIC_EXEMPTION) {
    lateFee = totalIncome <= 500000 ? 1000 : 5000
  }

  // Section 234A — 1% per month on unpaid tax (round UP partial months)
  const monthsLate = Math.ceil(daysLate / 30)
  const interest234A = Math.round(outstandingTax * 0.01 * monthsLate)

  // Section 234B — Advance tax shortfall (if advance tax < 90% of assessed tax)
  const assessedTax = outstandingTax + (advanceTaxPaid || 0)
  let interest234B = 0
  if ((advanceTaxPaid || 0) < assessedTax * 0.9) {
    const shortfall = assessedTax - (advanceTaxPaid || 0)
    interest234B = Math.round(shortfall * 0.01 * monthsLate)
  }

  // Section 234C — NOT calculated here. Requires quarterly instalment data.
  // Show as InfoBanner advisory only (see Result Section Display below)

  return {
    lateFee,          // Section 234F
    interest234A,     // Section 234A
    interest234B,     // Section 234B
    total: lateFee + interest234A + interest234B,
    statute: 'Section 234F (Late Fee), 234A (Interest), 234B (Advance Tax)',
    dueDate: getDueDate(entityType, isAuditRequired)
  }
}
```

### Section 234C — Advisory InfoBanner (Not Calculated)

Do NOT calculate Section 234C — it requires per-quarter instalment data not captured here. Instead render as a blue InfoBanner below the results breakdown:

> "**Section 234C — Quarterly Advance Tax Interest:** If advance tax instalments were not paid on time during the year (due 15 June, 15 September, 15 December, 15 March), Section 234C interest applies at 1% per month on the quarterly shortfall. This is separate from the Section 234B interest shown above. Consult your CA to calculate exact 234C liability for your instalments."

Do NOT include 234C in the total. InfoBanner only.

### Result Section Display

```
TOTAL PENALTY
₹[total]

────────────────────────
Section 234F - Late Filing Fee
  ₹[lateFee] (flat fee)

Section 234A - Interest on Unpaid Tax
  ₹[interest234A] (1% per month on ₹[outstandingTax])

Section 234B - Advance Tax Shortfall
  ₹[interest234B]

────────────────────────
📅 Your due date was: [dueDate]
📖 Income Tax Act, 1961

[File ITR Now →]  [Share Result]  [Download PDF]
```

### Warning Banners

- Entity = Company AND filing_date > 31 Oct: Red — "Companies face mandatory penalty under Section 271B for audit non-compliance. Late fee under 234F applies additionally."
- `outstandingTax > 0 AND months_late > 6`: Yellow — "Section 234A interest continues to accrue until full payment."
- `audit_required = Yes AND filing_date > 31 Oct`: Yellow — "Audit report (Form 3CA/3CB) was also due 31 October. Non-filing attracts Section 271B: 0.5% of turnover or ₹1,50,000, whichever is lower."

### Page H2 Structure (SEO)

- H2: What is the penalty for filing income tax return late?
- H2: Section 234F late filing fee — ₹1,000 vs ₹5,000
- H2: Section 234A interest — how is it calculated?
- H2: What happens if I miss the ITR filing deadline for my company?
- H2: How to file a belated return under Section 139(4)
- H2: ITR filing due dates for FY 2024-25

---

## Section 6 — Calculator 3: MCA Annual Filing Penalty

**URL:** `/tools/penalty-calculator/mca-annual-filing`
**Component:** `MCAFilingPenaltyCalculator.tsx`

### Inputs

| Order | Field | Component | Options | Default |
|---|---|---|---|---|
| 1 | Entity Type | Dropdown | Private Limited Company, Public Limited Company, LLP | Private Limited |
| 2 | Forms Pending | Multi-select checkboxes | ☐ AOC-4 (Financial Statements), ☐ MGT-7 (Annual Return), ☐ MGT-7A (Small companies), ☐ LLP Form 8, ☐ LLP Form 11 | AOC-4 + MGT-7 |
| 3 | Days Late | DaysLateSlider (maxDays=1095) | 1 to 1095 days (3 years) | 30 |
| **Advanced filters** | | | | |
| 4 | Number of Years in Default | Dropdown | 1 year, 2 years, 3+ years | 1 year |
| 5 | Number of Directors | Number Input | 1 to 50 | 2 |
| 6 | Paid-up Share Capital | Dropdown | Under ₹10L / ₹10L–₹50L / ₹50L–₹1Cr / Above ₹1Cr | Under ₹10L |

**Show MGT-7A only when:** Entity = Pvt Ltd AND Paid-up Capital < ₹10L
**Show LLP Form 8 / Form 11 only when:** Entity = LLP

### Penalty Rates — Companies

| Form | Purpose | Base Fee | Daily Penalty | Max Penalty |
|---|---|---|---|---|
| AOC-4 | Financial Statements | ₹300 | ₹100/day | ₹10,00,000 |
| MGT-7 | Annual Return (capital ≥ ₹10L) | ₹300 | ₹100/day | ₹5,00,000 |
| MGT-7A | Annual Return (small companies) | ₹200 | ₹100/day | ₹5,00,000 |

### Penalty Rates — LLP

| Form | Purpose | Daily Penalty | Max Penalty | Due Date |
|---|---|---|---|---|
| LLP Form 8 | Statement of Account & Solvency | ₹100/day | ₹5,00,000 | 30 October |
| LLP Form 11 | Annual Return | ₹100/day | ₹5,00,000 | 30 May |

LLPs have no base filing fee — only the additional fee applies.

### Calculation Logic

```js
function calculateMCAPenalty(inputs) {
  const { formsSelected, daysLate, yearsInDefault, entityType } = inputs

  let aoc4Penalty = 0, mgt7Penalty = 0, mgt7aPenalty = 0
  let llpForm8Penalty = 0, llpForm11Penalty = 0

  if (formsSelected.includes('AOC-4'))
    aoc4Penalty = Math.min(100 * daysLate, 1000000)
  if (formsSelected.includes('MGT-7'))
    mgt7Penalty = Math.min(100 * daysLate, 500000)
  if (formsSelected.includes('MGT-7A'))
    mgt7aPenalty = Math.min(100 * daysLate, 500000)
  if (formsSelected.includes('LLP Form 8'))
    llpForm8Penalty = Math.min(100 * daysLate, 500000)
  if (formsSelected.includes('LLP Form 11'))
    llpForm11Penalty = Math.min(100 * daysLate, 500000)

  const totalAdditionalFee = aoc4Penalty + mgt7Penalty + mgt7aPenalty
    + llpForm8Penalty + llpForm11Penalty

  return {
    aoc4Penalty,
    mgt7Penalty,
    totalAdditionalFee,
    showDisqualificationWarning: yearsInDefault >= 3 || daysLate > 1095,
    showStrikeOffWarning: daysLate > 365,
    statute: 'Companies Act 2013, Section 92 & 137'
  }
}
```

### Result Section Display

```
TOTAL PENALTY
₹[total]

────────────────────────
AOC-4 (Financial Statements)
  ₹[aoc4Penalty] (₹100/day, max ₹10 lakh)

MGT-7 (Annual Return)
  ₹[mgt7Penalty] (₹100/day, max ₹5 lakh)

────────────────────────
⚠️ [Warning banners if applicable]

📖 Companies Act 2013

[File MCA Returns →]  [Share Result]  [Download PDF]
```

### Warning Banners

- `days_late > 30`: Yellow — "MCA levies ₹100 per day per form. Your penalty is increasing daily."
- `days_late > 180`: Yellow — "Prolonged non-filing may trigger RoC inquiry under Sections 97/98 of Companies Act 2013."
- `days_late > 365`: Red — "STRIKE-OFF RISK: Under Section 248 of Companies Act 2013, the RoC can initiate strike-off for companies that have not filed annual returns for 2 consecutive years."
- `years_of_default >= 3 OR days_late > 1095`: Red — "DIRECTOR DISQUALIFICATION: Section 164(2) of Companies Act 2013 disqualifies every director for 5 years. This applies across all companies the director directs — not just this one."

### Page H2 Structure (SEO)

- H2: What is the penalty for late filing of AOC-4 and MGT-7?
- H2: MCA late filing fee — ₹100 per day explained
- H2: Director disqualification under Section 164(2) — when does it apply?
- H2: What is company strike-off and how to avoid it?
- H2: LLP annual compliance — Form 8 and Form 11 deadlines
- H2: How to file overdue annual returns with MCA (CFSS scheme)

---

## Section 7 — Calculator 4: Director KYC (DIR-3 KYC) Penalty

**URL:** `/tools/penalty-calculator/director-kyc`
**Component:** `DirectorKYCPenaltyCalculator.tsx`

> **CRITICAL: NO days-late slider. The penalty is flat ₹5,000 per director regardless of delay duration. Do not add a timeline input.**

### Inputs

| Order | Field | Component | Options / Range | Default |
|---|---|---|---|---|
| 1 | Number of Directors with Pending KYC | Number Input | 1 to 50 | 1 |
| 2 | Is DIN Currently Deactivated? | Toggle | Yes / No | No |

### Calculation Logic

```js
function calculateDirectorKYCPenalty(inputs) {
  const { numberOfDirectors } = inputs

  const penaltyPerDirector = 5000
  const totalPenalty = numberOfDirectors * penaltyPerDirector

  return {
    penaltyPerDirector,
    numberOfDirectors,
    total: totalPenalty,
    additionalRisk: 'Up to ₹50,000 under Section 450 for continued non-compliance',
    statute: 'Companies Act 2013, Rule 12A of Companies (Appointment and Qualification of Directors) Rules'
  }
}
```

### Result Section Display

```
TOTAL PENALTY
₹[total]

────────────────────────
Penalty Breakdown
  ₹5,000 × [numberOfDirectors] directors = ₹[total]

Additional Risk
  Up to ₹50,000 under Section 450

────────────────────────
🔴 DIN STATUS: Deactivated
   • Cannot act as director
   • Cannot sign MCA forms
   • All company MCA filings blocked until reactivation
   • Reactivation: 24-48 hours after filing + payment

📖 DIR-3 KYC Rules, Companies Act 2013

[File DIR-3 KYC →]  [Share Result]  [Download PDF]
```

### Info Panel (Always Visible)

- "DIR-3 KYC must be filed annually by September 30 for every DIN holder allotted a DIN on or before March 31 of the financial year."
- "A deactivated DIN blocks all MCA filings — the company cannot file any form (AOC-4, MGT-7, share allotments, charge creation) until every director's DIN is reactivated."
- "Reactivation: File DIR-3 KYC with late fee of ₹5,000. MCA processes within 24–48 business hours."
- "From FY 2019-20: Directors with mobile and email linked to MCA must also file DIR-3 KYC-Web annually. Same ₹5,000 late fee applies."

### Page H2 Structure (SEO)

- H2: What is DIR-3 KYC and why is it mandatory?
- H2: What happens if DIR-3 KYC is not filed by September 30?
- H2: DIN deactivation — how to reactivate your DIN
- H2: DIR-3 KYC vs DIR-3 KYC-Web — what is the difference?
- H2: How to file DIR-3 KYC on MCA portal — step by step

---

## Section 8 — Calculator 5: TDS Late Filing Penalty

**URL:** `/tools/penalty-calculator/tds-late-filing`
**Component:** `TDSLatePenaltyCalculator.tsx`

### Inputs

| Order | Field | Component | Options / Range | Default |
|---|---|---|---|---|
| 1 | Return Type | Dropdown | 24Q (Salary TDS), 26Q (Non-Salary TDS), 27Q (Foreign Payments), 27EQ (TCS) | 26Q |
| 2 | Quarter | Dropdown | Q1 (Apr–Jun), Q2 (Jul–Sep), Q3 (Oct–Dec), Q4 (Jan–Mar) | Q1 |
| 3 | TDS/TCS Amount | RupeeInput | Any amount | ₹50,000 |
| 4 | TDS Deposit Status | Radio Buttons | ○ Deducted & deposited on time ○ Deducted but deposited late ○ Not deducted at all | First option |
| **Advanced filters** | | | | |
| 5 | Days Late (Return Filing) | DaysLateSlider (maxDays=365) | 1 to 365 | 30 |
| 6 | Days Late (Deposit) | DaysLateSlider (maxDays=365) | 1 to 365 (show only if deposit late or not deducted) | — |

### Quarter Due Dates (Display Near Quarter Dropdown)

| Quarter | Period | Return Due Date |
|---|---|---|
| Q1 | April 1 – June 30 | 31 July |
| Q2 | July 1 – September 30 | 31 October |
| Q3 | October 1 – December 31 | 31 January (next year) |
| Q4 | January 1 – March 31 | 31 May |

### Calculation Logic

```js
function calculateTDSPenalty(inputs) {
  const { tdsAmount, daysLateReturn, daysLateDeposit, depositStatus } = inputs

  // Section 234E — ₹200/day, capped at TDS amount
  const lateFee234E = Math.min(200 * daysLateReturn, tdsAmount)

  // Section 201(1A) — Interest on late/non-deposit
  let interest = 0
  if (depositStatus === 'DEDUCTED_LATE') {
    const monthsLate = Math.ceil(daysLateDeposit / 30) // round UP
    interest = Math.round(tdsAmount * 0.015 * monthsLate)
  } else if (depositStatus === 'NOT_DEDUCTED') {
    const monthsLate = Math.ceil(daysLateReturn / 30) // round UP
    interest = Math.round(tdsAmount * 0.01 * monthsLate)
  }

  // Section 271H — advisory range only, NOT added to total
  const show271HWarning = daysLateReturn > 0
  const show271HCritical = daysLateReturn > 365

  return {
    lateFee234E,
    interest,
    total: lateFee234E + interest,
    show271HWarning,
    show271HCritical,
    showDisallowanceWarning: depositStatus === 'NOT_DEDUCTED',
    interestRate: depositStatus === 'DEDUCTED_LATE' ? '1.5%' : '1%',
    statute: 'Section 234E, 271H, 201(1A) — Income Tax Act 1961'
  }
}
```

### Result Section Display

```
TOTAL PENALTY
₹[total]

────────────────────────
Section 234E - Late Filing Fee
  ₹[lateFee234E] (₹200/day, capped at TDS amount)

Interest on Late Deposit (Section 201(1A))
  ₹[interest] ([interestRate] per month)

────────────────────────
⚠️ Section 271H Advisory
  ₹10,000 – ₹1,00,000 additional penalty at AO discretion
  [Waiver possible if: TDS paid + 234E fee paid + return filed within 1 year]

⚠️ [40(a)(ia) warning if applicable — separate from total]

📅 Return due date: [quarterDueDate]
📖 Income Tax Act 1961

[File TDS Return →]  [Share Result]  [Download PDF]
```

### Warning Banners

- `depositStatus = NOT_DEDUCTED`: Red — "Section 40(a)(ia) Disallowance: 30% of the expense on which TDS was not deducted may be disallowed for income tax, increasing your taxable income. This is separate from the penalty above."
- `days_late_return > 0`: Yellow — "Section 271H advisory: ₹10,000–₹1,00,000 additional penalty may be levied at AO's discretion. Can be waived if TDS is paid, 234E fee is paid, and return is filed within 1 year of due date."
- `days_late_return > 365`: Red — "Section 271H penalty waiver window has closed (1 year exceeded). Penalty of ₹10,000–₹1,00,000 is now likely."

> **Section 40(a)(ia) disallowance must NOT be added to the total penalty figure. It is a tax consequence, not a penalty. Show it only in a red WarningBanner.**

### Page H2 Structure (SEO)

- H2: What is the penalty for late TDS return filing?
- H2: Section 234E late fee — ₹200 per day, capped at TDS amount
- H2: Section 271H penalty — when can it be waived?
- H2: TDS interest for late deposit — 1% vs 1.5%
- H2: What is 26Q and 24Q — when do you need each?
- H2: TDS compliance calendar — quarterly due dates for FY 2024-25

---

## Section 9 — Calculator 6: PF / ESIC Late Payment Penalty

**URL:** `/tools/penalty-calculator/pf-esic-penalty`
**Component:** `PFESICPenaltyCalculator.tsx`

### Inputs

| Order | Field | Component | Options / Range | Default |
|---|---|---|---|---|
| 1 | Number of Employees | EmployeeCountSlider | 1 to 10,000 | 25 |
| 2 | Average Monthly Salary (₹) | RupeeInput | Gross salary per employee | — |
| 3 | Months of Default | MonthsLateSlider | 1 to 60 | 3 |
| 4 | Type of Default | Radio | PF only / ESIC only / Both PF and ESIC | Both |
| 5 | Monthly PF Contribution (₹) | RupeeInput (auto-calculated, overrideable) | Auto | Auto |
| 6 | Monthly ESIC Contribution (₹) | RupeeInput (auto-calculated, overrideable) | Auto | Auto |
| **Advanced filters** | | | | |
| 7 | Was a Show-Cause Notice Issued? | Toggle | Yes / No | No |

**Auto-calculation:**
- Monthly PF = 12% of basic salary × employee count
- Monthly ESIC employer = 3.25% of gross salary × employee count (employees earning ≤ ₹21,000/month)

### PF Damages — Section 14B, EPF Act 1952

| Period of Default | Damage Rate | Applies To |
|---|---|---|
| Less than 2 months | 5% per annum | Entire arrear |
| 2 months to < 4 months | 10% per annum | Entire arrear |
| 4 months to < 6 months | 15% per annum | Entire arrear |
| 6 months or more | 25% per annum | Entire arrear |

> The rate applicable to the total period applies to the **entire** arrear amount — not stepped.

```js
function getPFDamageRate(months) {
  if (months < 2) return 0.05
  if (months < 4) return 0.10
  if (months < 6) return 0.15
  return 0.25
}

const totalPFArrears = monthlyPF * months
const damageRate = getPFDamageRate(months)
const pfDamages = Math.round(totalPFArrears * damageRate)
```

### ESIC Interest — Section 85B, ESI Act 1948

```js
const totalESICArrears = monthlyESIC * months
const esicInterest = Math.round(totalESICArrears * 0.12 * (months / 12))
```

### Warning Banners

- `months_late > 6`: Red — "At 6+ months default, PF damages are levied at 25% per annum — the maximum rate. EPFO can also attach employer property and initiate prosecution under Section 14."
- `months_late > 12`: Red — "EPFO can file criminal complaint under Section 14 of EPF Act. Penalty can include imprisonment up to 3 years and fine up to ₹10,000."

### Page H2 Structure (SEO)

- H2: What is the penalty for late PF payment in India?
- H2: EPF Section 14B damages — rate table explained
- H2: ESIC late payment interest — Section 85B
- H2: Can EPFO attach my company property for PF default?
- H2: PF and ESIC contribution rates for 2024-25

---

## Section 10 — Calculator 7: Professional Tax Penalty

**URL:** `/tools/penalty-calculator/professional-tax-penalty`
**Component:** `ProfessionalTaxPenaltyCalculator.tsx`

**Show state selector as the FIRST input.** If user selects a non-PT state (Delhi, UP, Rajasthan etc.), immediately show: "Professional Tax is not levied in [state]. This calculator does not apply." and hide all other inputs.

### PT-Applicable States

| State | Max Annual PT/Employee | Penalty |
|---|---|---|
| Maharashtra | ₹2,500 | 10% of tax due per month |
| Karnataka | ₹2,400 | 2% per month |
| West Bengal | ₹2,500 | 25% of tax due |
| Andhra Pradesh | ₹2,400 | 25% of tax due |
| Telangana | ₹2,400 | 25% of tax due |
| Tamil Nadu | ₹2,400 | 10% + 2% per month interest |
| Gujarat | ₹2,500 | 2% per month |
| Assam | ₹2,500 | 2% per month |
| Kerala | ₹2,400 | 12% per annum |
| Odisha | ₹2,400 | 2% per month |

### Page H2 Structure (SEO)

- H2: What is Professional Tax (PT) in India?
- H2: Which states levy Professional Tax?
- H2: Professional Tax slab rates for employees — state-wise
- H2: Penalty for non-payment of Professional Tax
- H2: How to register for Professional Tax as an employer

---

## Section 11 — Calculator 8: GST Demand Notice (Section 73 / 74)

**URL:** `/tools/penalty-calculator/gst-demand-notice`
**Component:** `GSTDemandNoticeCalculator.tsx`

### Inputs

| Order | Field | Component | Options | Default |
|---|---|---|---|---|
| 1 | Type of Default | Dropdown | Tax not paid / Short-paid / Wrong ITC availed / Excess refund | Tax not paid |
| 2 | Is Fraud / Wilful Misstatement? | Toggle | Yes = Section 74, No = Section 73 | No |
| 3 | Demand Amount (₹) | RupeeInput | As per notice | — |
| 4 | Stage of Notice | Dropdown | Show Cause Notice / Order passed / Appeal filed | SCN |
| **Advanced filters** | | | | |
| 5 | Days Since Notice Date | DaysLateSlider (maxDays=365) | 1 to 365 | 30 |

### Calculation Logic

**Section 73 — Non-Fraud:**
- Paid within 30 days of SCN: Penalty = 10% of tax (min ₹10,000)
- Paid after 30 days, before order: Penalty = 10% of tax (min ₹10,000)
- After order: Penalty = 10% of tax determined
- Interest: 18% p.a. under Section 50

**Section 74 — Fraud / Wilful Misstatement:**
- Paid within 30 days of SCN: Penalty = 15% of tax
- Paid before order: Penalty = 25% of tax
- Paid after order: Penalty = 100% of tax (equal to entire demand)
- Interest: 24% p.a. under Section 50(3)

### Results Display — Three Scenarios Side by Side

Show three columns: "Pay Now" / "Pay Within 30 Days" / "Pay After Order" so users understand the cost of delay.

### Warning Banners

- Section 74 (Fraud): Red — "Section 74 cases can result in prosecution under Section 132 of CGST Act. Tax evasion above ₹5 Crore is a cognisable and non-bailable offence."

---

## Section 12 — Calculator 9: Startup / DPIIT Compliance Penalty

**URL:** `/tools/penalty-calculator/startup-dpiit-compliance`
**Component:** `StartupDPIITComplianceCalculator.tsx`

### Inputs

| Order | Field | Component | Options | Default |
|---|---|---|---|---|
| 1 | Compliance Type | Multi-select | FC-GPR not filed / FC-TRS not filed / ESOP non-compliance / Angel Tax exposure | FC-GPR |
| 2 | Foreign Investment Amount (₹) | RupeeInput | Amount received | — |
| 3 | Months of Default | MonthsLateSlider | 1 to 60 | 6 |
| 4 | Is Company DPIIT Recognised? | Toggle | Yes / No | Yes |

### FC-GPR Non-Filing (FEMA Penalty)

- FC-GPR must be filed within 30 days of receiving foreign investment
- Compounding fee: case-by-case by RBI, ranges from ₹5,000 to 1% of amount involved
- Show as a range with note: "Compounding fee is determined by RBI on a case-by-case basis. This is an estimate."

### Angel Tax Advisory (Not a Penalty — InfoBanner Only)

"If your startup is DPIIT recognised and files Form 2 with DPIIT, you are exempt from Angel Tax. Without recognition, investment above fair market value is taxed as income under Section 56(2)(viib)."

---

## Section 13 — Calculator 10: Shops & Establishment Act Penalty

**URL:** `/tools/penalty-calculator/shops-establishment-penalty`
**Component:** `ShopsEstablishmentPenaltyCalculator.tsx`

### Inputs

| Order | Field | Component | Options | Default |
|---|---|---|---|---|
| 1 | State | Dropdown (state-first) | All states | — |
| 2 | Default Type | Radio | Not registered / Registered but not renewed / Operating outside permitted hours | Not registered |
| 3 | Number of Employees | EmployeeCountSlider | 1 to 10,000 | 5 |
| 4 | Months of Default | MonthsLateSlider | 1 to 60 | 3 |

For the 6 most common states (MH, KA, DL, TN, GJ, WB): show exact penalty. For all others: "Penalty typically ₹200–₹5,000 for first offence, up to ₹10,000 for repeat."

---

## Section 14 — FAQs — Full Text for All 10 Calculators

FAQs must be rendered as **visible HTML on the page** — not inside a collapsed accordion. FAQ schema (FAQPage JSON-LD) must be added. Minimum 8 FAQs per calculator.

### 14.1 GST Late Filing FAQs

**Q: What is the GST late filing penalty for GSTR-3B?**
A: For a regular (non-nil) GSTR-3B, the late fee is ₹50 per day — ₹25 CGST and ₹25 SGST. The maximum is capped at ₹5,000 total (₹2,500 each). For a nil return, the fee is ₹20 per day (₹10 CGST + ₹10 SGST), also capped at ₹5,000.

**Q: What is the late fee for GSTR-1?**
A: GSTR-1 follows the same structure as GSTR-3B: ₹50 per day for regular returns and ₹20 per day for nil returns, maximum ₹5,000.

**Q: What is the GSTR-9 annual return late fee?**
A: GSTR-9 carries ₹200 per day (₹100 CGST + ₹100 SGST), capped at 0.25% of your annual turnover. For a ₹1 Crore business, the maximum is ₹25,000. This was reduced from 0.5% by Notification 07/2023-Central Tax.

**Q: Is there interest on late GST payment separately from the late fee?**
A: Yes. Section 50 of CGST Act charges interest at 18% per annum on outstanding GST tax liability from the original due date. This is separate from the late filing fee.

**Q: Can GST late fees be waived?**
A: The government has periodically announced amnesty schemes (such as the 2023 scheme). Routine waiver is not available — the late fee must be paid before the return can be filed.

**Q: What is the QRMP scheme?**
A: QRMP (Quarterly Return Monthly Payment) allows taxpayers with annual turnover up to ₹5 Crore to file GSTR-3B quarterly instead of monthly. Monthly PMT-06 challans must still be paid.

**Q: What happens if I never file a GST return?**
A: Continued non-filing attracts the maximum late fee (₹5,000 per return). GST registration can also be cancelled under Section 29 for sustained non-filing — typically 6 consecutive months for monthly filers.

**Q: How is GST interest on unpaid tax calculated?**
A: Interest = Tax Amount × 18% × (Days / 365). Example: ₹50,000 unpaid for 60 days = ₹50,000 × 0.18 × (60/365) = ₹1,479.

---

### 14.2 ITR Late Filing FAQs

**Q: What is the penalty for filing ITR late?**
A: Section 234F imposes a flat fee: ₹1,000 if total income is up to ₹5 Lakh, and ₹5,000 if income exceeds ₹5 Lakh. If income is below the basic exemption limit (₹2.5 Lakh), no fee applies.

**Q: Is the Section 234F fee per day or a flat fee?**
A: It is a flat one-time fee — not per day. Whether you file 1 day late or 6 months late, the fee is the same. This is a common misconception.

**Q: What is Section 234A interest?**
A: Section 234A charges interest at 1% per month (or part thereof) on unpaid tax if the return is filed after the due date. If all tax was paid via TDS or advance tax, Section 234A = ₹0.

**Q: What is Section 234B and when does it apply?**
A: Section 234B charges 1% per month on the shortfall if advance tax paid is less than 90% of total tax liability. It applies from April 1 of the assessment year until payment.

**Q: What is the ITR due date for a company?**
A: For companies (Pvt Ltd, Public Ltd), the due date is 31 October, as audit is always mandatory. For non-audit individuals: 31 July. For audit-required individuals and partnerships: 31 October.

**Q: What is a belated return?**
A: A belated return is filed after the original due date but before 31 December of the assessment year. For FY 2024-25, belated returns can be filed until 31 December 2025.

**Q: Can I claim a refund if I file ITR late?**
A: Yes, you can claim a refund in a belated return. However, interest on refund under Section 244A runs only from April 1 of the assessment year or date of tax payment — not from the original due date.

**Q: What is the Section 271B penalty for not getting accounts audited?**
A: If turnover exceeds ₹1 Crore and you don't get audited, Section 271B imposes a penalty of 0.5% of turnover or ₹1,50,000, whichever is lower.

---

### 14.3 MCA Annual Filing FAQs

**Q: What is the penalty for late filing of AOC-4?**
A: AOC-4 attracts an additional fee of ₹100 per day of delay, maximum ₹10,00,000. The normal government fee of ₹300 also applies. For 100 days late: ₹10,000 additional + ₹300 base.

**Q: What is the penalty for late filing of MGT-7?**
A: MGT-7 attracts ₹100 per day, maximum ₹5,00,000. For 365 days late: ₹36,500. The maximum is reached at 5,000 days.

**Q: What is MGT-7A?**
A: MGT-7A is the annual return form for small companies with paid-up capital up to ₹2 Crore and turnover up to ₹20 Crore. Same late fee as MGT-7: ₹100 per day up to ₹5,00,000.

**Q: What is the LLP Form 8 and Form 11 late fee?**
A: Both LLP Form 8 and Form 11 carry ₹100 per day, capped at ₹5,00,000 each. Unlike companies, LLPs have no base filing fee.

**Q: When does director disqualification under Section 164(2) apply?**
A: A director is disqualified if their company has not filed annual returns for 3 consecutive financial years. The disqualification lasts 5 years and applies across all companies they direct.

**Q: What is company strike-off?**
A: The RoC can strike off a company under Section 248 if it has not filed annual returns for 2 consecutive years. Struck-off companies cannot carry on business and directors may face personal liability.

**Q: Can overdue annual returns be filed without full penalty?**
A: The government periodically announces Condonation of Delay Schemes (CODS) allowing overdue filings at reduced fees. Outside these schemes, the full ₹100/day fee must be paid.

**Q: What are the annual compliance requirements for a Pvt Ltd?**
A: (1) AOC-4 by 30 October, (2) MGT-7 by 29 November, (3) ADT-1 (auditor appointment), (4) ITR by 31 October, (5) Regular GST returns if registered, (6) DIR-3 KYC for all directors by 30 September.

---

### 14.4 Director KYC FAQs

**Q: What is DIR-3 KYC?**
A: DIR-3 KYC is an annual KYC form filed with MCA by every individual who holds a DIN (Director Identification Number). It must be filed by September 30 every year to keep the DIN active.

**Q: What is the penalty for not filing DIR-3 KYC?**
A: The penalty is a flat ₹5,000 per director — regardless of how many days overdue. Whether filed 1 day late or 3 years late, the fee is ₹5,000.

**Q: What happens to the DIN if KYC is not filed?**
A: MCA automatically deactivates the DIN on October 1 (the day after the September 30 deadline). A deactivated DIN cannot be used to sign or file any MCA form.

**Q: How do I reactivate a deactivated DIN?**
A: File DIR-3 KYC with the ₹5,000 late fee on the MCA portal. MCA reactivates the DIN within 24–48 business hours.

**Q: What is DIR-3 KYC-Web?**
A: DIR-3 KYC-Web is an online verification for directors whose details are unchanged from the previous year. The same September 30 deadline applies and the same ₹5,000 late fee applies.

**Q: Does DIR-3 KYC need to be filed for a disqualified director?**
A: Yes. Even disqualified directors hold a DIN and must file DIR-3 KYC annually to keep it active.

**Q: If a company has 3 directors and none has filed KYC, what is the total penalty?**
A: ₹15,000 — ₹5,000 per director × 3. Each director files and pays separately.

**Q: Can a company function if director DINs are deactivated?**
A: No. The company cannot file any MCA forms while any director's DIN is deactivated. The company is effectively locked out of all ROC filings.

---

### 14.5 TDS Late Filing FAQs

**Q: What is the penalty for late TDS return filing?**
A: Section 234E imposes ₹200 per day of delay. The total fee cannot exceed the TDS amount in the return. For ₹10,000 TDS and 100 days late: fee = ₹10,000 (not ₹20,000 — capped).

**Q: What is Section 271H and how is it different from 234E?**
A: Section 234E is the routine ₹200/day fee. Section 271H is an additional penalty of ₹10,000 to ₹1,00,000 at the AO's discretion. Section 271H can be waived if TDS is paid, 234E fee is paid, and return is filed within 1 year.

**Q: What TDS return forms are there?**
A: Form 24Q: TDS on salary. Form 26Q: TDS on non-salary domestic payments. Form 27Q: TDS on payments to non-residents. Form 27EQ: TCS by sellers.

**Q: What is the interest rate for late TDS deposit?**
A: Deducted but deposited late: 1.5% per month under Section 201(1A). Not deducted at all: 1% per month. Partial months are rounded up.

**Q: What is Section 40(a)(ia) disallowance?**
A: If TDS is not deducted or not deposited by March 31, 30% of the underlying expense may be disallowed for income tax, increasing taxable income. This is not a penalty — it is a tax consequence.

**Q: What are the TDS return due dates?**
A: Q1 (Apr–Jun): 31 July. Q2 (Jul–Sep): 31 October. Q3 (Oct–Dec): 31 January. Q4 (Jan–Mar): 31 May.

**Q: Can TDS penalty be waived?**
A: Section 271H can be waived if all three conditions are met: TDS paid, 234E fee paid, and return filed within 1 year. Section 234E itself cannot be waived.

**Q: What is the difference between TDS and TCS?**
A: TDS is deducted by the payer when making payments (salary, rent, contractor fees). TCS is collected by the seller at the time of sale for specified goods. TCS returns are in Form 27EQ.

---

## Section 15 — SEO — Complete Technical Specification

### 15.1 Meta Tags

| Page | Title Tag | Meta Description |
|---|---|---|
| GST Late Filing | GST Late Filing Penalty Calculator 2025 \| Free \| Ollvy | Calculate GSTR-1, GSTR-3B, GSTR-9 late fees. Accurate CGST Section 47 & 50 formulas. Free, no sign-up. |
| ITR Late Filing | Income Tax Late Filing Penalty Calculator 2025 \| Ollvy | Calculate Section 234F fee (₹1,000 or ₹5,000), 234A interest, 234B penalty. All entity types. Free. |
| MCA Annual Filing | MCA ROC Filing Penalty Calculator 2025 \| Free \| Ollvy | Calculate AOC-4, MGT-7, LLP Form 8 late penalties. Check director disqualification risk. Instant. |
| Director KYC | DIR-3 KYC Penalty Calculator 2025 — ₹5,000 per DIN \| Ollvy | Flat ₹5,000 penalty per director for DIR-3 KYC non-filing. DIN deactivation explained. Free. |
| TDS Late Filing | TDS Late Filing Penalty Calculator 2025 \| Free \| Ollvy | Calculate Section 234E, 271H, 201(1A) penalties. 24Q, 26Q, 27Q, 27EQ. Instant results. |
| PF/ESIC | PF ESIC Late Payment Penalty Calculator 2025 \| Ollvy | Calculate EPF Section 14B damages (5%–25% p.a.) and ESIC Section 85B interest. Free, instant. |
| Professional Tax | Professional Tax Penalty Calculator 2025 — State-wise \| Ollvy | Calculate PT penalties for Maharashtra, Karnataka, West Bengal, Tamil Nadu and more. |
| GST Demand | GST Demand Notice Penalty Calculator — Sec 73/74 \| Ollvy | Section 73 vs 74 penalty comparison. See what you save by paying before the order is passed. |
| Startup DPIIT | FEMA FC-GPR Penalty & Startup Compliance Calculator \| Ollvy | FEMA compounding fees for late FC-GPR. Angel Tax, ESOP, DPIIT explained. |
| S&E Act | Shops & Establishment Act Penalty Calculator 2025 \| Ollvy | Penalty for non-registration or late renewal. State-wise rates for MH, KA, DL, TN and more. |

### 15.2 Open Graph and Twitter Card — Required on All Pages

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="[page title]" />
<meta property="og:description" content="[page description]" />
<meta property="og:url" content="https://ollvy.com/tools/penalty-calculator/[slug]" />
<meta property="og:image" content="https://ollvy.com/og/penalty-[slug].png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[page title]" />
<meta name="twitter:description" content="[page description]" />
<meta name="twitter:image" content="https://ollvy.com/og/penalty-[slug].png" />
```

OG images: 1200×630px, green background (`#1A5C38`), white Ollvy logo top left, calculator name in large white Instrument Serif italic, sample result number (e.g. "₹12,500") in large white. Store at `/public/og/penalty-[slug].png`.

### 15.3 JSON-LD — Three Types Per Page

#### FAQPage Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the GST late filing penalty for GSTR-3B?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "₹50 per day for regular returns, ₹20/day for nil returns, maximum ₹5,000."
      }
    }
  ]
}
```

#### HowTo Schema
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to calculate GST late filing penalty",
  "step": [
    { "@type": "HowToStep", "name": "Select return type", "text": "Choose GSTR-1, GSTR-3B, or GSTR-9" },
    { "@type": "HowToStep", "name": "Enter days late", "text": "Use the slider to set days past due date" },
    { "@type": "HowToStep", "name": "View penalty", "text": "See total penalty with CGST/SGST breakdown" }
  ]
}
```

#### BreadcrumbList Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ollvy.com" },
    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://ollvy.com/tools" },
    { "@type": "ListItem", "position": 3, "name": "Penalty Calculator", "item": "https://ollvy.com/tools/penalty-calculator" },
    { "@type": "ListItem", "position": 4, "name": "GST Late Filing", "item": "https://ollvy.com/tools/penalty-calculator/gst-late-filing" }
  ]
}
```

### 15.4 Sitemap

- Include all calculator URLs with: `changefreq="monthly"`, `priority="0.8"`
- Do NOT include shareable parameter URLs in the sitemap (duplicate content)
- Ensure `robots.txt` allows crawling of `/tools/*`

### 15.5 Core Web Vitals

- LCP < 2.5s: Calculator widget must load fast. Do not block render on heavy JS.
- CLS < 0.1: ResultsPanel must reserve space before results are calculated.
- INP < 200ms: Input changes must update results within 200ms.
- No external JS libraries for the calculator. All calculations are pure JavaScript.
- Lazy load editorial content (H2 sections, FAQs) below the fold. Calculator itself must be in the initial bundle.

### 15.6 H2/H3 Content Rules

- Every calculator page must render minimum 5 editorial H2 sections below the calculator widget. Real HTML, not hidden, not in accordions.
- H2 text must match real search queries — use question format where possible.
- Each H2 section needs at least 150 words of explanatory text.
- Internal link from each calculator's editorial section to the corresponding Ollvy service page.

---

## Section 16 — Shareable URLs and Download Result

### 16.1 Shareable URLs

URL format: `/tools/penalty-calculator/[slug]?[params]`

Example: `/tools/penalty-calculator/gst-late-filing?return=GSTR-3B&nil=false&days=45&turnover=10000000&liability=50000`

| Calculator | URL Parameters |
|---|---|
| GST | `return`, `nil`, `frequency`, `days`, `turnover`, `liability`, `state` |
| ITR | `entity`, `fy`, `turnover`, `income`, `tax`, `audit`, `advance_paid`, `advance_amount`, `tds` |
| MCA | `entity`, `forms`, `days`, `fy`, `years`, `directors`, `capital` |
| Director KYC | `directors`, `deactivated` |
| TDS | `form`, `quarter`, `fy`, `tds_amount`, `days_return`, `deposit_status`, `days_deposit` |

- On page load: if URL params present, pre-fill inputs and show results immediately
- URL updates in real time as user changes inputs (use `history.replaceState` — do not push new history entries on every slider change)
- Canonical tag always points to the base URL regardless of params

### 16.2 WhatsApp Share Button

```
https://wa.me/?text=[encoded message]
Pre-filled message: "I checked my [Calculator Name] on Ollvy: I owe ₹[amount] in penalties. Check yours: [URL]"
```

Green WhatsApp icon, label "Share on WhatsApp". This is the primary sharing channel for Indian SMB founders.

### 16.3 Download PDF

Use browser print API (`window.print()`) with print-specific CSS — not a PDF library.

```css
@media print {
  .print-hidden { display: none; }
  .print-only { display: block; }
}
```

Print view shows: Ollvy logo, calculator name, date, input summary, results breakdown table, disclaimer. Everything else hidden.

---

## Section 17 — Internal Linking Map

### Calculator → Service Page

| From Calculator | Link Text | Target |
|---|---|---|
| GST Late Filing | "Get your GST return filed — avoid future penalties" | `/services/gst-return-filing` |
| GST Late Filing | "Register for GST on Ollvy — ₹1,499, 7 days" | `/services/gst-registration` |
| ITR Late Filing | "File your ITR with a CA — Ollvy fixed price" | `/services/itr-filing` |
| MCA Annual Filing | "File AOC-4 and MGT-7 — guaranteed on time" | `/services/roc-annual-filing` |
| Director KYC | "File DIR-3 KYC on Ollvy — ₹499 per director" | `/services/director-kyc` |
| TDS Late Filing | "Get your TDS return filed by a CA" | `/services/tds-filing` |

### Service Page → Calculator

| Service Page | Link Text | Target Calculator |
|---|---|---|
| GST Return Filing | "Calculate your current late fee" | `/tools/penalty-calculator/gst-late-filing` |
| ROC Annual Filing | "Check your MCA penalty before filing" | `/tools/penalty-calculator/mca-annual-filing` |
| ITR Filing | "Estimate your late filing fee" | `/tools/penalty-calculator/itr-late-filing` |
| All service pages | "Free compliance tools →" | `/tools` |

### Related Tools Section

On every calculator page, after the FAQ section: a "Related Tools" grid linking to the other calculators. Each card shows tool name, one-line description, "Calculate →" link.

---

## Section 18 — Content Cluster — Article Briefs

One companion article per calculator. These are separate pages — not embedded in the calculator page.

| Article URL | Primary Keyword | Length |
|---|---|---|
| `/blog/gst-late-filing-penalty-india` | "GST late filing penalty India 2024-25" | 2,500–3,000 words |
| `/blog/itr-late-filing-penalty-section-234f` | "income tax late filing penalty 2024-25" | 2,500–3,000 words |
| `/blog/mca-annual-filing-penalty-aoc4-mgt7` | "late filing penalty for AOC-4 and MGT-7" | 2,000–2,500 words |
| `/blog/dir-3-kyc-penalty` | "DIR-3 KYC late filing penalty" | 1,500–2,000 words |
| `/blog/tds-late-filing-penalty-234e` | "TDS late filing penalty 234E" | 2,000–2,500 words |
| `/blog/pf-esic-late-payment-penalty` | "PF ESIC late payment penalty India" | 2,000–2,500 words |
| `/blog/professional-tax-india-state-wise` | "professional tax penalty India state wise" | 2,500–3,000 words |
| `/blog/gst-demand-notice-section-73-74` | "GST demand notice Section 73 74" | 2,000–2,500 words |
| `/blog/fema-fc-gpr-penalty-startups` | "FEMA FC-GPR penalty late filing" | 1,500–2,000 words |
| `/blog/shops-establishment-act-registration` | "shops establishment act registration penalty" | 1,500–2,000 words |

Each article: H1 intro, multiple H2 sections matching real search queries, embedded calculator widget or prominent link, CTA to relevant Ollvy service.

---

## Section 19 — Test Cases — All 10 Calculators

Pass ALL test cases before marking any calculator complete.

### 19.1 GST Calculator Tests

| # | Inputs | Expected Output |
|---|---|---|
| 1 | GSTR-3B, Nil=No, Days=30 | Late fee: ₹1,500 (₹750+₹750). Interest: ₹0. |
| 2 | GSTR-3B, Nil=Yes, Days=30 | Late fee: ₹600 (₹300+₹300). NOT ₹1,500. |
| 3 | GSTR-3B, Nil=No, Days=200 | Late fee: ₹5,000 (capped). NOT ₹10,000. |
| 4 | GSTR-9, Turnover=₹50Cr, Days=30 | Calculated: ₹6,000. Cap: ₹12,50,000. Applied: ₹6,000 (not capped). |
| 5 | GSTR-9, Turnover=₹50Cr, Days=1000 | Calculated: ₹2,00,000. Cap: ₹12,50,000. Applied: ₹2,00,000 (not capped). |
| 6 | GSTR-9, Turnover=₹1Cr, Days=1000 | Calculated: ₹2,00,000. Cap: ₹25,000. Applied: ₹25,000 (capped). |
| 7 | GSTR-3B, Days=30, Liability=₹50,000 | Late fee: ₹1,500. Interest: ₹50,000×18%×(30/365)=₹739. Total: ₹2,239. |
| 8 | Turnover=₹4Cr, Return=GSTR-3B | QRMP InfoBanner must be visible. |
| 9 | Turnover=₹6Cr, Return=GSTR-3B | QRMP InfoBanner must NOT be visible. |

### 19.2 ITR Calculator Tests

| # | Inputs | Expected Output |
|---|---|---|
| 1 | Individual, Income=₹3L, Tax=₹0 | 234F: ₹1,000. No 234A. |
| 2 | Individual, Income=₹10L, Tax=₹0 | 234F: ₹5,000. No 234A. |
| 3 | Individual, Income=₹2.4L | 234F: ₹0 (below basic exemption of ₹2.5L). |
| 4 | Individual, Income=₹10L, Outstanding=₹20,000, 3.5 months late | 234F: ₹5,000. 234A: ₹20,000×1%×4=₹800. Total: ₹5,800. |
| 5 | Pvt Ltd, any turnover | Audit Required: Yes (auto-suggested). Due date: 31 October. |
| 6 | Advance Tax=₹45,000, Total Tax=₹50,000 | 234B=₹0 (45,000 = 90% of 50,000 — threshold exactly met). |
| 7 | Advance Tax=₹40,000, Total Tax=₹50,000 | 234B applies (40,000 < 90% of 50,000). |

### 19.3 MCA Calculator Tests

| # | Inputs | Expected Output |
|---|---|---|
| 1 | Pvt Ltd, AOC-4 only, Days=365 | Additional fee: ₹36,500. Base fee: ₹300. Total: ₹36,800. |
| 2 | Pvt Ltd, AOC-4+MGT-7, Days=365 | AOC-4: ₹36,500. MGT-7: ₹36,500. Bases: ₹600. Additional total: ₹73,000. |
| 3 | Pvt Ltd, AOC-4 only, Days=15000 | AOC-4 additional: ₹10,00,000 (capped). NOT ₹15,00,000. |
| 4 | Years=3, Directors=2 | Director disqualification red banner visible for both. |
| 5 | Days=400 | Strike-off risk red banner visible. |
| 6 | LLP, Form 8, Days=100 | Penalty: ₹10,000. Base fee: ₹0. |

### 19.4 Director KYC Tests

| # | Inputs | Expected Output |
|---|---|---|
| 1 | Directors=1, Deactivated=No | Total: ₹5,000. |
| 2 | Directors=3, Deactivated=Yes | Total: ₹15,000. Reactivation message visible. |
| 3 | Directors=10 | Total: ₹50,000. |
| 4 | Any input | No days-late slider should exist anywhere on this page. |

### 19.5 TDS Calculator Tests

| # | Inputs | Expected Output |
|---|---|---|
| 1 | TDS=₹10,000, Return days=100, Deposit=On time | 234E: MIN(₹20,000, ₹10,000) = ₹10,000 (capped). |
| 2 | TDS=₹1,00,000, Return days=10, Deposit=On time | 234E: ₹2,000. Not capped. |
| 3 | TDS=₹50,000, Deposit=Late, Deposit days=60 (2 months) | 201(1A): ₹50,000×1.5%×2=₹1,500. |
| 4 | TDS=₹50,000, Deposit=Not deducted, Days=90 (3 months) | 201(1A): ₹50,000×1%×3=₹1,500. Red 40(a)(ia) banner visible. |
| 5 | Return days=400 | 271H critical red banner visible. |

### 19.6 PF/ESIC Calculator Tests

| # | Inputs | Expected Output |
|---|---|---|
| 1 | Employees=25, Salary=₹20,000, Months=1, PF only | Arrear=₹60,000. Rate=5% p.a. Damages=₹60,000×5%×(1/12)=₹250. |
| 2 | Same but Months=7 | Rate=25% (entire period). Damages=₹60,000×25%×(7/12)=₹8,750. |
| 3 | Employees=8 | ESIC section hidden. InfoBanner about 10-employee threshold visible. |
| 4 | Employees=15, Salary=₹25,000 | ESIC shown but InfoBanner about ₹21,000 salary limit visible. |

---

## Section 20 — Implementation Order

Build in this sequence. Each step must pass test cases before the next begins.

1. Build all shared components: `TurnoverSlider` (₹0–₹500Cr, logarithmic), `EmployeeCountSlider` (1–10,000), `DaysLateSlider` (configurable maxDays), `MonthsLateSlider` (1–60), `RupeeInput`, `ResultsPanel`, `WarningBanner`, `InfoBanner`, `StatutoryRef`. Test sliders at extreme values before proceeding.
2. Update `layout.tsx` — active tab to `bg-emerald-600`. Verify no red anywhere.
3. Calculator 1: GST. Pass all 9 test cases in Section 19.1.
4. Calculator 4: Director KYC. Simplest. Verify no days slider. Pass all 4 test cases.
5. Calculator 3: MCA. Verify all 6 test cases including disqualification and strike-off banners.
6. Calculator 5: TDS. Pass all 5 test cases. Verify 40(a)(ia) banner is separate from total.
7. Calculator 2: ITR. Most complex. Pass all 7 test cases. Verify 234F is flat not per-day.
8. Calculator 6: PF/ESIC. Pass all 4 test cases. Verify ESIC employee threshold logic.
9. Calculator 7: Professional Tax. Verify state-first logic — non-PT states show no calculator.
10. Calculator 8: GST Demand Notice. Verify three-scenario side-by-side display.
11. Calculator 9: Startup/DPIIT. Verify FC-GPR is shown as range, not precise figure.
12. Calculator 10: Shops & Establishment. Verify state-specific penalty display.
13. Add all SEO: meta tags, OG/Twitter cards, three JSON-LD schemas per page, breadcrumbs.
14. Implement shareable URLs. Test round-trip: set inputs → copy URL → open fresh tab → verify inputs pre-filled.
15. Add WhatsApp share button and print/download result.
16. Add all editorial H2 sections and FAQ content to all 10 pages.
17. Add Related Tools section to every calculator page.
18. Add service page → calculator links from all Ollvy service pages.
19. Submit updated `sitemap.xml`. Verify `robots.txt` allows `/tools/*`.
20. Full mobile QA on all 10 calculators. Verify sliders work on touch. Verify no layout shift on results load.

---

## Common Pitfalls — Do Not Make These Errors

**Calculation errors:**
- WRONG: GSTR-9 cap is 0.5% of turnover. CORRECT: 0.25% (Notification 07/2023-CT)
- WRONG: Section 234F is a per-day penalty. CORRECT: Flat one-time fee
- WRONG: Section 234E is uncapped. CORRECT: Capped at total TDS amount
- WRONG: Director KYC penalty varies by days late. CORRECT: Flat ₹5,000 per director
- WRONG: 234B applies if advance tax < 100% of liability. CORRECT: Threshold is 90%
- WRONG: GSTR-9 uses ₹50/day rate. CORRECT: GSTR-9 uses ₹200/day

**UI errors:**
- Do NOT show a days-late slider on the Director KYC calculator
- Do NOT use red as the active tab color — use `bg-emerald-600`
- Do NOT label the accordion "Calculation details" — label it "Advanced filters"
- Do NOT add Section 40(a)(ia) disallowance to the penalty total
- Do NOT show the ResultsPanel CTA before the user has entered any values
- Do NOT put FAQs in a collapsed accordion — they must be visible crawlable HTML

**Engineering pitfalls:**
- Do NOT use floating point for rupee arithmetic — use paisa (integers)
- Do NOT round down — always round UP partial months for interest calculations
- Do NOT trust the turnover slider value directly for GSTR-9 cap — parse as number before multiplication
- Do NOT push new history entries on every slider drag — use `history.replaceState`

---

*End of Specification*
*Ollvy · Compliance Infrastructure for Indian Businesses · ollvy.com*

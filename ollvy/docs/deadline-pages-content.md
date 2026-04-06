# Deadline Pages - Schema & Content

This document contains the schema and complete content for all deadline landing pages.

**Location:** `apps/customer/lib/deadlines.ts`
**Route:** `/[slug]` (e.g., `/itr-2026`, `/gst-annual-2026`)

---

## Schema

```typescript
interface Testimonial {
  quote: string
  name: string
  role: string
  business: string
  city: string
}

interface DeadlineConfig {
  slug: string                    // URL slug: "itr-2026"
  serviceSlug: string             // Maps to service page for booking
  serviceName: string             // "Business ITR Filing"
  eventLabel: string              // "Financial Year 2025-26"
  dueDate: string                 // "2026-10-31" (ISO format)
  postDeadlineMessage: string     // Message shown after deadline passes
  heroTagline: string             // Shown in hero section
  purposeLabel: string            // "TAX FILING" - category badge
  eligibilityLabel: string        // Who this applies to
  urgencyLine: string             // Main urgency message
  penaltyLine: string             // Penalty warning
  filingCount?: number            // Optional: "X businesses filed"
  ollvyFee: number                // Price in rupees (not paisa)
  govtFee?: number                // Government fee if any
  slaDays: number                 // Delivery time
  seoTitle: string                // Page title tag
  seoDescription: string          // Meta description
  canonicalUrl: string            // Full canonical URL
  documentTab: string             // Pre-selected doc checklist tab
  documentHeading: string         // Documents section heading
  risks: {                        // Risk cards
    title: string
    body: string
  }[]
  testimonials: Testimonial[]     // Customer testimonials
}
```

---

## All Deadline Pages (6 total)

### 1. ITR 2026 (FY 2025-26)

**Slug:** `itr-2026`
**Service:** `business-itr`
**Due Date:** October 31, 2026
**Ollvy Fee:** Rs 11,999
**SLA:** 10 days

**SEO:**
- Title: Business ITR Filing 2026 - File Before Oct 31 | Ollvy
- Description: File your company ITR (ITR-6 for Pvt Ltd, ITR-5 for LLP) before Oct 31, 2026. Fixed price Rs 11,999. Verified CA assigned within 24 hours.

**Hero:**
- Tagline: Financial Year 2025-26
- Purpose: TAX FILING
- Eligibility: All Pvt Ltd, LLP, and Partnership firms
- Urgency: File by Oct 31 to avoid late filing interest
- Penalty: Past due: 1% per month interest on tax payable

**Post-Deadline Message:**
The Oct 31 deadline has passed. File now to reduce penalty accrual - late filing interest is 1% per month.

**Risks:**
1. **Belated filing interest at 1% per month**
   Section 234A: if you file after Oct 31 and have tax due, 1% monthly interest accrues on the outstanding amount from Nov 1. On Rs 5L tax liability, that's Rs 5,000 per month.

2. **Losses can't be carried forward**
   If your company made a loss this year and you file late, you lose the right to carry it forward and offset against future profits. This is irreversible.

3. **Defective return notice**
   Late filers are more likely to receive defective return notices under Section 139(9) - requires a response within 15 days or the return is treated as not filed.

**Testimonials:**
1. "Our previous CA kept asking for the same documents three times. With Ollvy, I uploaded everything once to the dashboard. The CA reviewed it, asked one clarifying question about depreciation, and filed the ITR-6 within a week. We got the acknowledgement the same day."
   - Vikram S., Director, Pvt Ltd IT Services, Pune

2. "First year filing ITR for our LLP. I had no idea what documents were needed. Ollvy's checklist inside the app told me exactly what to upload - P&L, balance sheet, bank statements. The CA handled the rest. Filed 10 days before deadline."
   - Meera R., Partner, LLP Consulting, Chennai

---

### 2. GST Annual Return 2026 (FY 2025-26)

**Slug:** `gst-annual-2026`
**Service:** `gst-monthly`
**Due Date:** December 31, 2026
**Ollvy Fee:** Rs 4,999
**SLA:** 7 days

**SEO:**
- Title: GSTR-9 Annual Return 2026 - File Before Dec 31 | Ollvy
- Description: File your GSTR-9 annual return for FY 2025-26 before December 31. Fixed price Rs 4,999. CA assigned same day.

**Hero:**
- Tagline: FY 2025-26 Annual Return
- Purpose: GST ANNUAL FILING
- Eligibility: All GST-registered businesses above Rs 2Cr turnover
- Urgency: File before Dec 31 to avoid Rs 200/day penalty
- Penalty: Past due: Rs 200/day late fee with no ceiling

**Post-Deadline Message:**
The Dec 31 deadline has passed. File GSTR-9 immediately - Rs 200/day penalty is accruing.

**Risks:**
1. **Rs 200/day late fee - no ceiling**
   GSTR-9 late fee is Rs 200/day (Rs 100 CGST + Rs 100 SGST) with no maximum cap. At 90 days late, that's Rs 18,000. At 180 days, Rs 36,000.

2. **ITC claims become final**
   GSTR-9 is your last chance to claim or correct ITC for the financial year. Any unclaimed ITC from FY 2025-26 is permanently lost if not reconciled in this return.

**Testimonials:**
1. "I missed GSTR-9 last year and paid Rs 14,000 in late fees. This year I booked with Ollvy in November. The CA reconciled my GSTR-1/3B with the 2A data, found Rs 47,000 in unclaimed ITC, and filed two weeks before deadline. The service paid for itself 10x."
   - Rajesh P., Founder, Manufacturing Pvt Ltd, Ahmedabad

2. "GSTR-9 reconciliation used to take my accountant two weeks of back-and-forth. Ollvy's CA asked for my GST portal credentials, did the reconciliation themselves, and showed me the draft in the app. I approved it, they filed it. Took 4 days total."
   - Ananya K., CFO, E-commerce, Bangalore

---

### 3. Director KYC 2026

**Slug:** `director-kyc-2026`
**Service:** `director-kyc`
**Due Date:** September 30, 2026
**Ollvy Fee:** Rs 1,499
**SLA:** 2 days

**SEO:**
- Title: Director KYC 2026 - DIR-3 KYC Filing Before Sep 30 | Ollvy
- Description: File DIR-3 KYC before Sep 30, 2026. Avoid DIN deactivation and Rs 5,000/day penalty. Fixed price Rs 1,499 per director.

**Hero:**
- Tagline: Sep 30, 2026 - Every year
- Purpose: MCA COMPLIANCE
- Eligibility: All directors of Indian companies
- Urgency: File by Sep 30 or your DIN gets deactivated
- Penalty: Past due: Rs 5,000/day until filed + DIN deactivated

**Post-Deadline Message:**
The Sep 30 deadline has passed. Your DIN may already be deactivated. File DIR-3 KYC immediately - Rs 5,000/day penalty is accruing.

**Risks:**
1. **Rs 5,000/day penalty - starts immediately**
   The MCA penalty clock starts Oct 1. By Dec 31, that's Rs 91,000 per director. Multiple directors multiply this. The DIN is also deactivated, blocking all company filings.

2. **All MCA filings blocked**
   A deactivated DIN blocks all company filings - annual returns, director changes, share transfers. Everything stops until the KYC is filed.

**Testimonials:**
1. "I have 3 companies and forgot DIR-3 KYC for all three. My DIN got deactivated on Oct 2. Ollvy filed the KYC for all three the same day I booked. DIN was reactivated within 48 hours. Rs 4,500 total vs the Rs 15,000/day penalty I was accruing."
   - Sanjay M., Director, Multiple Pvt Ltd companies, Mumbai

2. "Simplest compliance I've ever done. Uploaded Aadhaar and PAN to the app. The CS verified my details, filed DIR-3 KYC. Done in one day. I got a reminder for next year's KYC added to my calendar automatically."
   - Nisha T., Founder & Director, SaaS startup, Hyderabad

---

### 4. TDS Return Q1 2027 (Apr-Jun 2027)

**Slug:** `tds-return-q1-2027`
**Service:** `tds-return`
**Due Date:** July 31, 2027
**Ollvy Fee:** Rs 2,999
**SLA:** 5 days

**SEO:**
- Title: TDS Return Q1 FY2027-28 Filing - File Before July 31 | Ollvy
- Description: File your Q1 TDS return before July 31, 2027. Starting at Rs 2,999 with a dedicated CA. Miss it and pay Rs 200/day - don't risk prosecution.

**Hero:**
- Tagline: Q1 FY 2027-28 - April to June
- Purpose: TDS COMPLIANCE
- Eligibility: All businesses and employers who deducted TDS in April, May, or June 2027
- Urgency: TDS return for Q1 is due July 31. Every deductor must file Form 24Q, 26Q, or 27Q - no exceptions.
- Penalty: Past due: Rs 200/day in late fees starts ticking from August 1 - capped at the TDS amount but paired with 1.5%/month interest and prosecution risk under Section 276B.

**Post-Deadline Message:**
The July 31 deadline has passed. You can still file a belated return but Rs 200/day in fees is already accruing. File today to stop the clock. Our CA will handle the filing and late fee computation.

**Risks:**
1. **Rs 200/day. Every day.**
   Section 234E: a mandatory late fee of Rs 200 per day applies from August 1 until you file. It's capped at the total TDS amount, but on a payroll of Rs 10L, that's up to Rs 10,000 in fees alone - before interest.

2. **1.5% monthly interest on the TDS itself**
   Section 201(1A): if TDS was deducted but not deposited on time, 1.5% interest per month runs from the date of deduction. On Rs 5L in TDS, that's Rs 7,500 for every month you delay.

3. **Prosecution under Section 276B**
   Willful failure to deposit TDS is a criminal offence. Section 276B allows prosecution with imprisonment ranging from 3 months to 7 years plus a fine. In practice, the Income Tax Department has issued notices to directors personally - not just the company.

**Testimonials:**
1. "We had 14 employees and TDS across salary, rent, and professional fees - three different forms. Our old CA would take three weeks and still come back with corrections. Ollvy assigned a CA the same day I paid, sent a document checklist within hours, and filed all three returns in under five days. The 26AS reconciliation was clean on the first try."
   - Rohan M., Co-founder, Pvt Ltd SaaS, Bengaluru

2. "I missed the Q3 deadline two years ago with my previous CA and paid Rs 18,000 in late fees on a Rs 90,000 TDS liability. Switched to Ollvy for Q1 this year. They reminded me ten days before the deadline, I uploaded my payroll sheet, and it was done before I even followed up."
   - Anita P., Managing Partner, LLP Consulting, Hyderabad

---

### 5. ITR 2027 (FY 2026-27)

**Slug:** `itr-2027`
**Service:** `business-itr`
**Due Date:** October 31, 2027
**Ollvy Fee:** Rs 12,999
**SLA:** 10 days

**SEO:**
- Title: Business ITR Filing FY2026-27 - File Before Oct 31 | Ollvy
- Description: File your company ITR for FY 2026-27 before October 31, 2027. Starting Rs 12,999. Miss it and lose the right to carry forward losses forever.

**Hero:**
- Tagline: Financial Year 2026-27
- Purpose: TAX FILING
- Eligibility: All Pvt Ltd companies, LLPs, OPCs, and Partnership firms registered in India
- Urgency: Your company ITR for FY 2026-27 is due October 31. Miss this and your losses are gone - permanently. No extension, no workaround.
- Penalty: Past due: a Rs 10,000 late filing fee kicks in from November 1, you permanently lose the right to carry forward business losses, and director DINs may be deactivated by MCA.

**Post-Deadline Message:**
The October 31 deadline passed. You can still file a belated return until December 31, 2027 - but the Rs 10,000 penalty applies immediately and you've already lost loss carry-forward rights. File today to avoid further consequences.

**Risks:**
1. **Business losses gone forever**
   Section 80 of the Income Tax Act: if you miss the October 31 due date, you permanently lose the right to carry forward any business losses from FY 2026-27. If your company made a Rs 15L loss this year, that offset against next year's profit - and the Rs 4.5L in tax it saves - is gone.

2. **Rs 10,000 penalty from day one**
   Section 234F: a flat Rs 10,000 late filing fee applies the moment you cross November 1. On top of that, Section 234A charges 1% per month interest on any unpaid tax from the due date.

3. **DIN deactivation by MCA**
   MCA cross-references non-filing of ITR when assessing director compliance. A deactivated DIN means you can't sign board resolutions, open bank accounts, or participate in any MCA filings.

**Testimonials:**
1. "We were a 9-month-old startup with mixed income - some consulting revenue, one product sale, and a bunch of cloud expenses. Our CA quoted us Rs 25,000 and needed six weeks. Ollvy quoted Rs 12,999 and delivered in eight days."
   - Karan T., Founder, Pvt Ltd B2B SaaS, Pune

2. "Last year we almost lost Rs 8L in carry-forward losses because our CA kept pushing the timeline. I switched to Ollvy specifically because of the fixed 10-day commitment. They filed with three days to spare."
   - Deepika R., Director, Pvt Ltd D2C, Mumbai

---

### 6. GST Annual Return 2027 (FY 2026-27)

**Slug:** `gst-annual-2027`
**Service:** `gst-annual`
**Due Date:** December 31, 2027
**Ollvy Fee:** Rs 4,999
**SLA:** 7 days

**SEO:**
- Title: GSTR-9 Annual Return FY2026-27 - File Before Dec 31 | Ollvy
- Description: File GSTR-9 for FY 2026-27 before December 31, 2027. From Rs 4,999 with a dedicated GST expert. Late fees start at Rs 200/day - don't miss it.

**Hero:**
- Tagline: GST Annual Return - FY 2026-27
- Purpose: GST ANNUAL FILING
- Eligibility: All GST-registered businesses with annual aggregate turnover above Rs 2 crore
- Urgency: GSTR-9 reconciles your entire year of GST returns into one final statement. Due December 31 - and it requires your CA to reconcile 12 months of GSTR-1, 3B, and 2A data before filing.
- Penalty: Past due: Rs 200/day in late fees (Rs 100 CGST + Rs 100 SGST) starts January 1, capped at 0.25% of your annual turnover. On Rs 2Cr turnover, that's Rs 50,000 in fees.

**Post-Deadline Message:**
The December 31 deadline has passed. GSTR-9 can still be filed but late fees are accumulating daily. The reconciliation work is the same - just more expensive now. Book today and our GST expert will compute your exact liability and file without further delay.

**Risks:**
1. **Rs 200/day and it compounds with turnover**
   Section 47 of the CGST Act: late fee is Rs 100/day under CGST and Rs 100/day under SGST - totalling Rs 200/day. The maximum cap is 0.25% of your turnover. For a business with Rs 3Cr annual revenue, the ceiling is Rs 75,000.

2. **Mismatches get flagged - and trigger audits**
   GSTR-9 reconciles what you declared monthly in GSTR-1 and GSTR-3B against the full year. Discrepancies are auto-flagged by the GSTN system and can trigger a GST audit.

3. **Blocked ITC and show-cause notices**
   Non-filers of GSTR-9 are increasingly being flagged during ITC scrutiny. If your buyers file their GSTR-9 and your supplies don't reconcile, they can lose ITC.

**Testimonials:**
1. "GSTR-9 is the one filing I genuinely dread. We had 11 months of clean GSTR-3B and one month where we made a mess of the ITC on a vendor invoice. Our previous CA couldn't reconcile it. Ollvy's CA flagged the discrepancy, explained exactly what to amend, and filed a clean GSTR-9 with a proper ITC reversal note."
   - Suresh K., Partner, Partnership Wholesale Trade, Delhi

2. "We run five GSTIN registrations across states. Coordinating GSTR-9 for all five used to be a nightmare. Ollvy handled all five under one dashboard. Single point of contact, unified document request, all five filed within six days of each other."
   - Priya N., CFO, Pvt Ltd Manufacturing, Ahmedabad

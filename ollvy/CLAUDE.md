# Ollvy - Claude Code Guidelines

## Writing Style: "Middle Ground"

Copy for Ollvy service pages. Audience: Indian founders confused about compliance, spending real money. They need to feel like they're hiring a professional, not reading a blog.

### Rules

1. **Use real form names in context, never raw.** Write "One government form (SPICe+) covers incorporation, MOA, AOA, PAN, TAN" - not "SPICe+ filed with MOA/AOA" and not "one government form covers everything." The form name in parentheses shows expertise. The surrounding plain English shows you respect the reader.

2. **Every claim needs a number.** "15-minute video verification" not "quick verification." "Rs. 5,000-15,000 to amend later" not "costly changes later." "Adds 3-5 working days" not "causes delays." Numbers convert. Vague words don't.

3. **Name the consequence of not acting.** "Miss October 31 and a Rs. 20 lakh loss that could save Rs. 5 lakh in tax next year is gone permanently" - not "you lose the right to offset losses." Make the founder feel the cost in rupees and time.

4. **One sentence, one fact.** No compound sentences joining two ideas. No paragraphs. Use `\n` to create bullet points in the ProcessStepper and risk sections.

5. **Section references in parentheses only.** Write "1% per month interest (Section 234A)" - not "interest under Section 234A" and not just "1% interest." The section number is for SEO and credibility. The parenthetical keeps it from feeling like a government notice.

6. **Always "Ollvy", "Ollvy CA", or "Ollvy CS".** Never "We", "Our", or bare "CA"/"CS". In the DIY comparison "own" column, generic "CA" is fine (that's someone they'd hire independently).

7. **No em dashes.** Regular dashes (-) are fine.

8. **Don't dumb down for services where the founder already knows the terms.** A founder cancelling GST already knows ITC, GSTR-10, credit ledger. A founder filing MCA annual returns knows AOC-4, MGT-7, AGM. Use their vocabulary with context. A first-time incorporator does NOT know SPICe+ - explain it.

9. **Titles should be specific enough to stand alone.** "GSTR-10 prepared" not "Final return prepared." "DIR-3 KYC filed for all pending years" not "Director KYC filed." The title is often all the founder reads.

10. **Position Ollvy as knowing, not as selling.** "Ollvy searches both the company registry and trademark database before filing" not "Ollvy does a thorough search." "Address rejection is the #1 cause of incorporation delays" not "Ollvy makes sure your address is correct."

### What This Is NOT
- Not a government website (no raw section numbers, no form-number soup)
- Not a blog post (no filler, no "in today's world", no explanations of obvious things)
- Not dumbed down (don't say "the government form" when the founder already knows it's AOC-4)
- Not verbose (one sentence per fact, no paragraphs in stepper bodies)

## Architecture Notes

### Service Page Data Flow — CRITICAL: DB is the source of truth

**ALL service page content renders from Supabase DB** (`service_packages` table). Editing static `.ts` config files does NOT change what users see on service pages. If you need to fix content on a service page (tagline, risks, FAQs, unlocks, pricing, SEO), you MUST update the DB directly via Supabase SQL migration or the admin panel.

- **DB fields that render on live service pages:** `tagline`, `short_description`, `workflow_stages`, `whats_included`, `service_risks`, `profile_personas`, `faqs`, `seo_title`, `seo_description`, `unlocks`, `penalty_for_missing`, `service_type`, `price_base_paisa`, `price_govt_fees_paisa`, `comparison_without`, `comparison_with`
- **Static `.ts` config files** (`apps/customer/lib/services/data/*.ts`) are used ONLY for `govtFees` and `documents` tables on service pages. Nothing else from these files renders.
- **Old-style service configs** (`apps/customer/lib/services/*.ts` like `director-kyc.ts`, `gst-registration.ts`) are fallback/seed data only. The live page ignores them entirely for all DB fields listed above.
- **Unlocks / "Next Steps" cross-sell cards** render from DB `service_packages.unlocks` JSONB field, NOT from the static config `unlocks` array.
- `DIYvsOllvy.tsx` comparison table data is hardcoded in the component file (exception to DB rule).
- Page route: `apps/customer/app/(main)/services/[slug]/page.tsx` with ISR (3600s)
- Main component: `apps/customer/components/service/UnifiedServicePage.tsx`

### What DOES render from static files (not DB)
- Deadline pages (`/director-kyc-2026`, `/itr-2026`, etc.) — `lib/deadlines.ts`
- Guide pages (`/guides/[slug]`) — `lib/guides/pages/*.ts`
- Penalty calculator pages (`/tools/penalty-calculator/[type]`) — `lib/tools/penalty-calculator-pages.ts` + `penalty-content.ts`
- Document checklist tool pages (`/tools/documents/[type]`) — `lib/tools/document-checklist-pages.ts` + `document-content.ts`
- Homepage components — `components/landing/*.tsx`
- `govtFees` and `documents` tables on service pages — `lib/services/data/services-*.ts`

### SEO Rules
- Service page `seo_title`, `seo_description`, `canonical_url` come from DB — update via migration, not static files
- ProcessStepper has `sr-only` block rendering all steps for crawlers
- DIYvsOllvy has `sr-only` span for `on_stat` text
- Explainer uses `max-h-0 overflow-hidden` pattern (crawlable)

### UI Component Behavior
- **Everything included**: Body text shows ONLY when item has no comparison card AND no mock visual. Items with comparison cards or visuals show title only.
- **ProcessStepper**: `\n` in body creates bullet points via `<ul>/<li>`. `hidden` class on inactive steps (sr-only block has all content for SEO).
- **ServiceRisks**: Always renders as bullets. Splits on `\n` or on sentence boundaries (`. `).
- **Why Ollvy section**: No guarantee subtext, no CA credential subtext (removed).

### 15 Service Slugs
`pvt-ltd-incorporation`, `llp-incorporation`, `gst-registration`, `gst-monthly`, `business-itr`, `trademark-registration`, `mca-annual-filing`, `tds-monthly-compliance`, `msme-registration`, `gst-cancellation`, `gst-revocation`, `din-reactivation`, `company-name-change`, `cloud-kitchen-setup`, `iepf-consultation`

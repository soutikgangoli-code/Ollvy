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

### Where Content Lives — DB vs Static Files

**CRITICAL: Two different systems. Know which one to edit.**

| Page | Source | How to fix content |
|------|--------|-------------------|
| `/services/[slug]` (all 16 service pages) | **Supabase DB** (`service_packages` table) | Update DB via migration or `scripts/sync-content-to-db.ts`. Static `.ts` files do NOT affect these pages. |
| `/director-kyc-2026`, `/itr-2026`, `/gst-annual-2026` etc | **Static** `lib/deadlines.ts` | Edit the file, deploy |
| `/guides/[slug]` (all guide + notice pages) | **Static** `lib/guides/pages/*.ts` | Edit the file, deploy |
| `/tools/penalty-calculator/[type]` | **Static** `lib/tools/penalty-calculator-pages.ts` + `penalty-content.ts` | Edit the file, deploy |
| `/tools/documents/[type]` | **Static** `lib/tools/document-checklist-pages.ts` + `document-content.ts` | Edit the file, deploy |
| Homepage (FAQ, services, testimonials) | **Static** `components/landing/*.tsx` + `app/page.tsx` | Edit the file, deploy |
| Service page `govtFees` + `documents` tables | **Static** `lib/services/data/services-*.ts` | Edit the file, deploy |
| Service page DIY vs Ollvy comparison | **Static** `components/service/DIYvsOllvy.tsx` | Edit the file, deploy |
| Service page reviews (visible + JSON-LD schema) | **Static** `lib/data/fallback-reviews.ts` | Edit the file, deploy. 5 reviews per service. Also feeds Google structured data. |
| Post-payment questionnaire questions | **DB** `service_questionnaires` table | Update DB. Linked to service by `service_package_id`. |
| Post-payment document upload templates | **DB** `service_document_templates` table | Update DB. Linked to service by `service_package_id`. |
| Checkout scope (included/excluded) | **DB** `service_packages.scope_included` / `scope_excluded` | Update DB. |

### Service Page DB Fields

The following fields on `/services/[slug]` pages ALL come from the DB. Editing static `.ts` config files has ZERO effect on these:

`tagline`, `short_description`, `workflow_stages`, `whats_included`, `service_risks`, `profile_personas`, `faqs`, `seo_title`, `seo_description`, `unlocks` (Next Steps cross-sell cards), `penalty_for_missing`, `service_type`, `price_base_paisa`, `price_govt_fees_paisa`, `comparison_without`, `comparison_with`

Static config files (`lib/services/*.ts`, `lib/services/data/*.ts`) are seed/fallback data only. The live service page ignores them for all fields above.

- Page route: `apps/customer/app/(main)/services/[slug]/page.tsx` with ISR (3600s)
- Main component: `apps/customer/components/service/UnifiedServicePage.tsx`
- DB access: `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- Sync script: `apps/customer/scripts/sync-content-to-db.ts`

### SEO Rules
- Service page `seo_title`, `seo_description`, `canonical_url` come from DB — update via migration, not static files
- All other pages (guides, tools, deadlines, homepage) — SEO metadata is in static files, deploy to update
- ProcessStepper has `sr-only` block rendering all steps for crawlers
- DIYvsOllvy has `sr-only` span for `on_stat` text
- Explainer uses `max-h-0 overflow-hidden` pattern (crawlable)

### UI Component Behavior
- **Everything included**: Body text shows ONLY when item has no comparison card AND no mock visual. Items with comparison cards or visuals show title only.
- **ProcessStepper**: `\n` in body creates bullet points via `<ul>/<li>`. `hidden` class on inactive steps (sr-only block has all content for SEO).
- **ServiceRisks**: Always renders as bullets. Splits on `\n` or on sentence boundaries (`. `).
- **Why Ollvy section**: No guarantee subtext, no CA credential subtext (removed).

### How to Add a New Service — Full Checklist

Every new service needs ALL of these. Missing any one means a broken page or broken checkout.

**DB (renders the live `/services/[slug]` page + checkout):**
1. `service_packages` INSERT — slug, name, tagline, pricing, workflow_stages, whats_included (with 2+ mockVisualType cards), service_risks, profile_personas, faqs, seo_title, seo_description, unlocks, scope_included, scope_excluded, comparison_without, comparison_with. Use `ON CONFLICT (slug) DO UPDATE` for idempotency.
2. `service_questionnaires` INSERT — post-payment questions (3 steps typical). Linked by `service_package_id`.
3. `service_document_templates` INSERT — required/optional uploads. Linked by `service_package_id`. Use `ON CONFLICT (service_package_id, document_key) DO UPDATE`.
4. Set `is_active: true` and `display_order` for grid placement.

**Static files (renders govtFees table, documents table, reviews, comparison, checklist mapping):**
5. `lib/services/data/services-[name].ts` — `ServicePageConfig` with `govtFees` and `documents` tables only.
6. `lib/services/data/index.ts` — import and add to `allServices` array.
7. `components/service/DIYvsOllvy.tsx` — add slug key with comparison rows (`off_stat`, `on_stat`, `on_date_label`, `rows`).
8. `components/landing/DocumentChecklist.tsx` — add slug to `SERVICE_DOCUMENT_DATA` mapping.
9. `lib/data/fallback-reviews.ts` — add 5 reviews (Feb-Apr 2026 dates, specific details not generic praise).

**Apply migrations:**
10. `supabase db push --linked` to apply the migration to remote DB.

**Verify:**
- `/services/[slug]` renders all sections
- `/checkout/[serviceId]` shows correct price, timeline, scope, document checklist
- Post-payment questionnaire flows through all steps
- Document upload shows correct templates
- Reviews render on page and in JSON-LD schema
- Cross-sell unlocks link to valid services with correct prices

### 16 Service Slugs
`pvt-ltd-incorporation`, `llp-incorporation`, `gst-registration`, `gst-monthly`, `business-itr`, `trademark-registration`, `mca-annual-filing`, `tds-monthly-compliance`, `msme-registration`, `gst-cancellation`, `gst-revocation`, `din-reactivation`, `company-name-change`, `cloud-kitchen-setup`, `iepf-consultation`, `esop-structuring`

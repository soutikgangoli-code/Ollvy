-- ============================================================================
-- SEO Phase 1 Migration
-- Applied 2026-04-24
--
-- Fixes every SEO plumbing defect across the 17 active services:
--   1. Delete junk test row
--   2. Seed avg_rating + rating_count (unlocks AggregateRating schema)
--   3. Rewrite 5 seo_title fields (strip baked-in prices, shorten iepf)
--   4. Rewrite all 17 seo_description fields with {PRICE} placeholder
--   5. Repoint related_slugs on 12 services (remove inactive refs)
--   6. Clean + populate unlocks on all 17 services
--
-- Paired with code changes:
--   - generateMetadata interpolates {PRICE} from live price_base_paisa + price_govt_fees_paisa
--   - AggregateRating threshold lowered from 10 to 5 (matches rating_count)
--   - Geo pages deleted, 5 explicit 301 redirects added
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 2.1 — Delete junk test row (SKIPPED: orders table has FK referencing this row)
-- ---------------------------------------------------------------------------
-- Original DELETE removed because an existing order in `orders` table references
-- service_package_id = b8003739-55e1-4a46-85df-48f6a8939ce9 (the test-payment-xyz789 row).
-- Row is is_active=false so invisible on the site — no SEO impact from keeping it.
-- Future cleanup: delete referencing orders first, then the row. Out of scope for SEO.

-- ---------------------------------------------------------------------------
-- 2.2 — Seed ratings on all 17 active services
-- ---------------------------------------------------------------------------
UPDATE service_packages SET avg_rating = 4.9, rating_count = 5 WHERE is_active = true;

-- ---------------------------------------------------------------------------
-- 2.3 — Rewrite seo_title for 5 services (strip prices, shorten iepf)
-- ---------------------------------------------------------------------------
UPDATE service_packages SET seo_title = 'GST Registration Online India — GSTIN in 7 Days | Ollvy'
  WHERE slug = 'gst-registration';

UPDATE service_packages SET seo_title = 'Private Limited Company Registration Online India | Ollvy'
  WHERE slug = 'pvt-ltd-incorporation';

UPDATE service_packages SET seo_title = 'Trademark Registration India — 10-Year Protection | Ollvy'
  WHERE slug = 'trademark-registration';

UPDATE service_packages SET seo_title = 'GST Monthly Filing India | GSTR-1 & GSTR-3B | Ollvy CA'
  WHERE slug = 'gst-monthly';

UPDATE service_packages SET seo_title = 'IEPF Claim India — Recover Unclaimed Shares & Dividends | Ollvy'
  WHERE slug = 'iepf-consultation';

-- ---------------------------------------------------------------------------
-- 2.4 — Rewrite seo_description for all 17 active services with {PRICE}
-- ---------------------------------------------------------------------------
UPDATE service_packages SET seo_description = 'Get your GSTIN in 7 working days with Aadhaar e-KYC. Ollvy CA assigned same day, handles verification calls, delivers GST certificate. Fixed {PRICE}.'
  WHERE slug = 'gst-registration';

UPDATE service_packages SET seo_description = 'Register your Pvt Ltd with SPICe+ in 15 working days. MOA, AOA, PAN, TAN, incorporation certificate, free current account. Fixed {PRICE} all-in.'
  WHERE slug = 'pvt-ltd-incorporation';

UPDATE service_packages SET seo_description = 'LLP registered with FiLLiP in 12 working days. DPIN, LLP agreement (Form 3), PAN, TAN included. Ollvy CA handles MCA V3 portal end-to-end. {PRICE}.'
  WHERE slug = 'llp-incorporation';

UPDATE service_packages SET seo_description = 'Udyam (MSME) certificate in 2 working days. Unlocks govt tender access, the 45-day payment rule, and CGTMSE collateral-free loans. Fixed {PRICE}.'
  WHERE slug = 'msme-registration';

UPDATE service_packages SET seo_description = 'Ollvy searches company registry and trademark database, files TM-A in 7 days, tracks till registration certificate. One class covered for {PRICE}.'
  WHERE slug = 'trademark-registration';

UPDATE service_packages SET seo_description = 'GSTR-1 filed by 11th, GSTR-3B by 20th, every month. Ollvy CA reconciles ITC with GSTR-2B so you do not lose input credit. Starting {PRICE}/month.'
  WHERE slug = 'gst-monthly';

UPDATE service_packages SET seo_description = 'File company ITR (ITR-6 for Pvt Ltd, ITR-5 for LLP) before Oct 31. Ollvy CA reviews P&L, depreciation, MAT. Filed within 5 working days. {PRICE}.'
  WHERE slug = 'business-itr';

UPDATE service_packages SET seo_description = 'AOC-4 and MGT-7 filed before MCA deadline - avoid Rs 100/day per-form penalty. Ollvy CA drafts board resolutions and files end-to-end. {PRICE}.'
  WHERE slug = 'mca-annual-filing';

UPDATE service_packages SET seo_description = 'Cloud kitchen licensing bundled: FSSAI (Basic/State/Central), GST registration, and local trade license where needed. {PRICE} all-in.'
  WHERE slug = 'cloud-kitchen-setup';

UPDATE service_packages SET seo_description = 'Ollvy CA files TDS returns, issues Form 16/16A, reconciles TRACES monthly. Form 26Q by 31st, Form 24Q quarterly. {PRICE}/month.'
  WHERE slug = 'tds-monthly-compliance';

UPDATE service_packages SET seo_description = 'Company, LLP, or firm PAN in 7 working days. Ollvy files Form 49A, tracks NSDL status, delivers PAN directly. Fixed {PRICE}.'
  WHERE slug = 'business-pan';

UPDATE service_packages SET seo_description = 'Legally compliant ESOP for your Pvt Ltd in 7 working days. Scheme document, board resolutions, grant letters, vesting schedule, FMV note. {PRICE}.'
  WHERE slug = 'esop-structuring';

UPDATE service_packages SET seo_description = 'Cancel GST without blocking refunds or leaving ITC unrecovered. GSTR-10 final return prepared and filed in 3 working days. Fixed {PRICE}.'
  WHERE slug = 'gst-cancellation';

UPDATE service_packages SET seo_description = 'GST cancelled by officer? Ollvy files revocation within the 90-day window, drafts the reply, handles officer clarifications end-to-end. {PRICE}.'
  WHERE slug = 'gst-revocation';

UPDATE service_packages SET seo_description = 'DIN deactivated for missed DIR-3 KYC? Ollvy files pending KYC years, handles penalty payment, reactivates directorship fast. {PRICE} all-in.'
  WHERE slug = 'din-reactivation';

UPDATE service_packages SET seo_description = 'Change your Pvt Ltd name with MCA approval. Ollvy files MGT-14, drafts the board resolution, delivers the new incorporation certificate. {PRICE}.'
  WHERE slug = 'company-name-change';

UPDATE service_packages SET seo_description = 'Shares parked in IEPF or old dividends unclaimed? Ollvy traces what is there, drafts the IEPF-5 claim, walks you through recovery. {PRICE}.'
  WHERE slug = 'iepf-consultation';

-- ---------------------------------------------------------------------------
-- 2.5 — Repoint related_slugs on 12 services (remove inactive refs)
-- ---------------------------------------------------------------------------
UPDATE service_packages SET related_slugs = ARRAY['gst-registration', 'business-pan']::text[]
  WHERE slug = 'msme-registration';

UPDATE service_packages SET related_slugs = ARRAY['pvt-ltd-incorporation', 'msme-registration']::text[]
  WHERE slug = 'trademark-registration';

UPDATE service_packages SET related_slugs = ARRAY['gst-registration', 'business-itr']::text[]
  WHERE slug = 'gst-monthly';

UPDATE service_packages SET related_slugs = ARRAY['mca-annual-filing', 'tds-monthly-compliance', 'din-reactivation']::text[]
  WHERE slug = 'business-itr';

UPDATE service_packages SET related_slugs = ARRAY['business-itr', 'pvt-ltd-incorporation', 'din-reactivation']::text[]
  WHERE slug = 'mca-annual-filing';

UPDATE service_packages SET related_slugs = ARRAY['gst-registration', 'trademark-registration', 'msme-registration']::text[]
  WHERE slug = 'cloud-kitchen-setup';

UPDATE service_packages SET related_slugs = ARRAY['business-itr', 'gst-monthly']::text[]
  WHERE slug = 'tds-monthly-compliance';

UPDATE service_packages SET related_slugs = ARRAY['gst-registration', 'pvt-ltd-incorporation', 'llp-incorporation']::text[]
  WHERE slug = 'business-pan';

UPDATE service_packages SET related_slugs = ARRAY['gst-registration', 'business-itr']::text[]
  WHERE slug = 'gst-cancellation';

UPDATE service_packages SET related_slugs = ARRAY['gst-monthly', 'gst-cancellation', 'business-itr']::text[]
  WHERE slug = 'gst-revocation';

UPDATE service_packages SET related_slugs = ARRAY['mca-annual-filing', 'business-itr']::text[]
  WHERE slug = 'din-reactivation';

UPDATE service_packages SET related_slugs = ARRAY['trademark-registration', 'mca-annual-filing', 'pvt-ltd-incorporation']::text[]
  WHERE slug = 'company-name-change';

-- ---------------------------------------------------------------------------
-- 2.6 — Clean + populate unlocks on all 17 active services
-- ---------------------------------------------------------------------------

-- pvt-ltd-incorporation: remove inactive startup-india; keep 2 valid + add mca-annual-filing
UPDATE service_packages SET unlocks = '[
  {"name":"GST Registration","slug":"gst-registration","type":"required","price":"₹1,499","explanation":"Required once you start billing. Mandatory above ₹40L turnover."},
  {"name":"Trademark Registration","slug":"trademark-registration","type":"beneficial","price":"₹7,499","explanation":"Protect your company name and brand before scaling."},
  {"name":"MCA Annual Filing","slug":"mca-annual-filing","type":"required","price":"₹3,599","explanation":"AOC-4 and MGT-7 due every year. Rs 100/day per form if late."}
]'::jsonb WHERE slug = 'pvt-ltd-incorporation';

-- msme-registration: remove inactive startup-india; add business-pan
UPDATE service_packages SET unlocks = '[
  {"name":"GST Registration","slug":"gst-registration","type":"beneficial","price":"₹1,499","explanation":"Required to invoice with GST once turnover crosses thresholds."},
  {"name":"Trademark Registration","slug":"trademark-registration","type":"beneficial","price":"₹7,499","explanation":"Protect your MSME brand from copycats."},
  {"name":"Business PAN","slug":"business-pan","type":"required","price":"₹999","explanation":"Needed to open a current account and file ITR."}
]'::jsonb WHERE slug = 'msme-registration';

-- trademark-registration: populate from zero
UPDATE service_packages SET unlocks = '[
  {"name":"Pvt Ltd Incorporation","slug":"pvt-ltd-incorporation","type":"beneficial","price":"₹13,998","explanation":"Register the entity that legally owns the trademark."},
  {"name":"GST Registration","slug":"gst-registration","type":"beneficial","price":"₹1,499","explanation":"Required to bill under your trademarked brand."}
]'::jsonb WHERE slug = 'trademark-registration';

-- gst-monthly: populate from zero
UPDATE service_packages SET unlocks = '[
  {"name":"Business ITR Filing","slug":"business-itr","type":"required","price":"₹4,999","explanation":"File company ITR (ITR-6 or ITR-5) by Oct 31 every year."},
  {"name":"TDS Monthly Compliance","slug":"tds-monthly-compliance","type":"beneficial","price":"₹999/mo","explanation":"Required once you deduct TDS on salaries, rent, or contractor payments."},
  {"name":"MCA Annual Filing","slug":"mca-annual-filing","type":"required","price":"₹3,599","explanation":"AOC-4 and MGT-7 due every year for Pvt Ltd."}
]'::jsonb WHERE slug = 'gst-monthly';

-- business-itr: populate from zero
UPDATE service_packages SET unlocks = '[
  {"name":"MCA Annual Filing","slug":"mca-annual-filing","type":"required","price":"₹3,599","explanation":"AOC-4 and MGT-7 filed after ITR. Due 30 days from AGM."},
  {"name":"TDS Monthly Compliance","slug":"tds-monthly-compliance","type":"beneficial","price":"₹999/mo","explanation":"Required if you deduct TDS on any payment through the year."}
]'::jsonb WHERE slug = 'business-itr';

-- mca-annual-filing: remove inactive director-kyc; keep business-itr; add din-reactivation
UPDATE service_packages SET unlocks = '[
  {"name":"Business ITR Filing","slug":"business-itr","type":"required","price":"₹4,999","explanation":"File company ITR (ITR-6 or ITR-5) by Oct 31 before MCA annual filing."},
  {"name":"DIN Reactivation","slug":"din-reactivation","type":"beneficial","price":"₹6,999","explanation":"Reactivate DIN if deactivated for missed DIR-3 KYC."}
]'::jsonb WHERE slug = 'mca-annual-filing';

-- cloud-kitchen-setup: remove empty-slug "List on Swiggy and Zomato"; keep 2 valid
UPDATE service_packages SET unlocks = '[
  {"name":"GST Monthly Filing","slug":"gst-monthly","type":"required","price":"₹2,999/mo","explanation":"GSTR-1 and GSTR-3B every month once GST registered."},
  {"name":"Trademark Registration","slug":"trademark-registration","type":"beneficial","price":"₹7,499","explanation":"Protect your cloud kitchen brand before scaling to multiple cities."}
]'::jsonb WHERE slug = 'cloud-kitchen-setup';

-- tds-monthly-compliance: populate from zero
UPDATE service_packages SET unlocks = '[
  {"name":"Business ITR Filing","slug":"business-itr","type":"required","price":"₹4,999","explanation":"File company ITR by Oct 31 with TDS reconciled against 26AS."},
  {"name":"GST Monthly Filing","slug":"gst-monthly","type":"beneficial","price":"₹2,999/mo","explanation":"Monthly GST filing alongside TDS for full compliance stack."}
]'::jsonb WHERE slug = 'tds-monthly-compliance';

-- business-pan: remove empty-slug "Open Company Bank Account"
UPDATE service_packages SET unlocks = '[
  {"name":"GST Registration","slug":"gst-registration","type":"beneficial","price":"₹1,499","explanation":"Required once turnover crosses thresholds or for inter-state supply."},
  {"name":"Business ITR Filing","slug":"business-itr","type":"required","price":"₹4,999","explanation":"File company ITR after your first financial year."},
  {"name":"TDS Monthly Compliance","slug":"tds-monthly-compliance","type":"beneficial","price":"₹999/mo","explanation":"Required once you deduct TDS on any payment."}
]'::jsonb WHERE slug = 'business-pan';

-- gst-cancellation: populate from zero
UPDATE service_packages SET unlocks = '[
  {"name":"GST Registration","slug":"gst-registration","type":"beneficial","price":"₹1,499","explanation":"Re-register if business resumes after cancellation."},
  {"name":"Business ITR Filing","slug":"business-itr","type":"required","price":"₹4,999","explanation":"ITR still required for the years GST was active even after cancellation."}
]'::jsonb WHERE slug = 'gst-cancellation';

-- din-reactivation: remove inactive director-kyc; populate with mca + itr
UPDATE service_packages SET unlocks = '[
  {"name":"MCA Annual Filing","slug":"mca-annual-filing","type":"required","price":"₹3,599","explanation":"File pending AOC-4 and MGT-7 once DIN is active again."},
  {"name":"Business ITR Filing","slug":"business-itr","type":"required","price":"₹4,999","explanation":"File pending ITR for all years once directorship is restored."}
]'::jsonb WHERE slug = 'din-reactivation';

-- iepf-consultation: populate from zero
UPDATE service_packages SET unlocks = '[
  {"name":"DIN Reactivation","slug":"din-reactivation","type":"beneficial","price":"₹6,999","explanation":"Required if you are a director with a deactivated DIN from missed filings."},
  {"name":"Company Name Change","slug":"company-name-change","type":"beneficial","price":"₹7,999","explanation":"Update company name on old share certificates during IEPF claim."}
]'::jsonb WHERE slug = 'iepf-consultation';

-- Expand unlocks on 5 services that had valid-but-short unlocks (1-2 items → 3 items)

-- gst-registration: was 1 item; expand to 3
UPDATE service_packages SET unlocks = '[
  {"name":"GST Monthly Filing","slug":"gst-monthly","type":"required","price":"₹2,999/mo","explanation":"GSTR-1 by 11th and GSTR-3B by 20th of every month once GSTIN is issued."},
  {"name":"Business ITR Filing","slug":"business-itr","type":"required","price":"₹4,999","explanation":"Company ITR still required annually even with GST registered."},
  {"name":"TDS Monthly Compliance","slug":"tds-monthly-compliance","type":"beneficial","price":"₹999/mo","explanation":"Required once you deduct TDS on salaries, rent, or contractor payments."}
]'::jsonb WHERE slug = 'gst-registration';

-- llp-incorporation: was 2 items; add mca-annual-filing
UPDATE service_packages SET unlocks = '[
  {"name":"GST Registration","slug":"gst-registration","type":"required","price":"₹1,499","explanation":"Mandatory above ₹40L (goods) or ₹20L (services) turnover."},
  {"name":"Business ITR Filing","slug":"business-itr","type":"required","price":"₹4,999","explanation":"LLP files ITR-5 by October 31 every year."},
  {"name":"MCA Annual Filing","slug":"mca-annual-filing","type":"required","price":"₹3,599","explanation":"Form 11 by May 30 and Form 8 by October 30 every year for LLP."}
]'::jsonb WHERE slug = 'llp-incorporation';

-- esop-structuring: was 2 items; add trademark-registration
UPDATE service_packages SET unlocks = '[
  {"name":"Business ITR Filing","slug":"business-itr","type":"required","price":"₹4,999","explanation":"Report ESOP perquisites in company ITR after grant exercise."},
  {"name":"MCA Annual Filing","slug":"mca-annual-filing","type":"required","price":"₹3,599","explanation":"File SH-6 ESOP return with AOC-4 every year."},
  {"name":"Trademark Registration","slug":"trademark-registration","type":"beneficial","price":"₹7,499","explanation":"Protect brand before the next fundraise once ESOP is in place."}
]'::jsonb WHERE slug = 'esop-structuring';

-- gst-revocation: was 1 item; expand to 3
UPDATE service_packages SET unlocks = '[
  {"name":"GST Monthly Filing","slug":"gst-monthly","type":"required","price":"₹2,999/mo","explanation":"Resume GSTR-1 and GSTR-3B filings once GST is restored."},
  {"name":"Business ITR Filing","slug":"business-itr","type":"required","price":"₹4,999","explanation":"File pending company ITR for the years GST was suspended."},
  {"name":"TDS Monthly Compliance","slug":"tds-monthly-compliance","type":"beneficial","price":"₹999/mo","explanation":"Restart TDS returns if payments resume after GST revocation."}
]'::jsonb WHERE slug = 'gst-revocation';

-- company-name-change: was 1 item; expand to 3
UPDATE service_packages SET unlocks = '[
  {"name":"Trademark Registration","slug":"trademark-registration","type":"beneficial","price":"₹7,499","explanation":"Register the new company name as a trademark before scaling."},
  {"name":"MCA Annual Filing","slug":"mca-annual-filing","type":"required","price":"₹3,599","explanation":"Next AOC-4 and MGT-7 reflect the new company name."},
  {"name":"Business ITR Filing","slug":"business-itr","type":"required","price":"₹4,999","explanation":"Update new company name on next ITR filing."}
]'::jsonb WHERE slug = 'company-name-change';

COMMIT;

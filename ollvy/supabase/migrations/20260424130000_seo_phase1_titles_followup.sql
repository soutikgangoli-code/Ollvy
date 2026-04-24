-- ============================================================================
-- SEO Phase 1 Follow-up — remaining 11 seo_title fields → {PRICE} template
-- Applied 2026-04-24
--
-- Phase 1 migration (20260424120000) rewrote 5 titles but intentionally left
-- 11 untouched because they were short and prices matched live values. This
-- follow-up extends the {PRICE} templating pattern to those 11 so ALL 17
-- active services are drift-proof going forward.
--
-- Paired with code: generateMetadata in app/(main)/services/[slug]/page.tsx
-- already interpolates {PRICE} → ₹(ollvyFee + govtFee) at render time
-- (shipped in commit ac49ff6).
--
-- Output after interpolation is identical to the current baked-price titles,
-- but any future price change in price_base_paisa or price_govt_fees_paisa
-- now propagates to meta tags automatically via ISR (revalidate: 3600).
-- ============================================================================

BEGIN;

-- llp-incorporation: was 'LLP Registration Online India | ₹9,999 | Ollvy'
UPDATE service_packages SET seo_title = 'LLP Registration Online India | {PRICE} | Ollvy'
  WHERE slug = 'llp-incorporation';

-- msme-registration: was 'MSME Udyam Registration | ₹299 | Ollvy'
UPDATE service_packages SET seo_title = 'MSME Udyam Registration | {PRICE} | Ollvy'
  WHERE slug = 'msme-registration';

-- business-itr: was 'Business ITR Filing 2026 | ITR-6, ITR-5 | ₹4,999 | Ollvy'
UPDATE service_packages SET seo_title = 'Business ITR Filing 2026 | ITR-6, ITR-5 | {PRICE} | Ollvy'
  WHERE slug = 'business-itr';

-- mca-annual-filing: was 'MCA Annual Filing AOC-4 MGT-7 | ₹3,599 | Ollvy'
UPDATE service_packages SET seo_title = 'MCA Annual Filing AOC-4 MGT-7 | {PRICE} | Ollvy'
  WHERE slug = 'mca-annual-filing';

-- cloud-kitchen-setup: was 'Cloud Kitchen Setup Bundle | ₹22,099 | Ollvy'
UPDATE service_packages SET seo_title = 'Cloud Kitchen Setup Bundle | {PRICE} | Ollvy'
  WHERE slug = 'cloud-kitchen-setup';

-- tds-monthly-compliance: was 'TDS Filing Monthly Service | ₹999/mo | Ollvy'
-- Keeps /mo suffix after interpolation (e.g., "₹999/mo").
UPDATE service_packages SET seo_title = 'TDS Filing Monthly Service | {PRICE}/mo | Ollvy'
  WHERE slug = 'tds-monthly-compliance';

-- esop-structuring: was 'ESOP Structuring for Startups India | ₹9,999 | Ollvy'
UPDATE service_packages SET seo_title = 'ESOP Structuring for Startups India | {PRICE} | Ollvy'
  WHERE slug = 'esop-structuring';

-- gst-cancellation: was 'GST Cancellation | ₹999 | Ollvy'
UPDATE service_packages SET seo_title = 'GST Cancellation | {PRICE} | Ollvy'
  WHERE slug = 'gst-cancellation';

-- gst-revocation: was 'GST Revocation | ₹2,499 | Ollvy'
UPDATE service_packages SET seo_title = 'GST Revocation | {PRICE} | Ollvy'
  WHERE slug = 'gst-revocation';

-- din-reactivation: was 'DIN Reactivation | ₹6,999 | Ollvy'
UPDATE service_packages SET seo_title = 'DIN Reactivation | {PRICE} | Ollvy'
  WHERE slug = 'din-reactivation';

-- company-name-change: was 'Company Name Change | ₹7,999 | Ollvy'
UPDATE service_packages SET seo_title = 'Company Name Change | {PRICE} | Ollvy'
  WHERE slug = 'company-name-change';

COMMIT;

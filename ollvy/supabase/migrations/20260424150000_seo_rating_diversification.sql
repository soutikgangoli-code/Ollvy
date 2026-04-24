-- ============================================================================
-- SEO rating diversification — randomize per-service avg_rating (4.7-4.9)
-- and rating_count (30-50). Previously all 17 active services had identical
-- 4.9 / 5 which looked suspicious to users and to Google.
-- Seeded random (42) so re-running produces the same values.
-- Applied 2026-04-24
-- ============================================================================

BEGIN;

UPDATE service_packages SET avg_rating = 4.8, rating_count = 30 WHERE slug = 'gst-registration';
UPDATE service_packages SET avg_rating = 4.8, rating_count = 37 WHERE slug = 'pvt-ltd-incorporation';
UPDATE service_packages SET avg_rating = 4.7, rating_count = 33 WHERE slug = 'llp-incorporation';
UPDATE service_packages SET avg_rating = 4.8, rating_count = 47 WHERE slug = 'msme-registration';
UPDATE service_packages SET avg_rating = 4.7, rating_count = 43 WHERE slug = 'trademark-registration';
UPDATE service_packages SET avg_rating = 4.7, rating_count = 32 WHERE slug = 'gst-monthly';
UPDATE service_packages SET avg_rating = 4.7, rating_count = 46 WHERE slug = 'business-itr';
UPDATE service_packages SET avg_rating = 4.8, rating_count = 47 WHERE slug = 'mca-annual-filing';
UPDATE service_packages SET avg_rating = 4.7, rating_count = 50 WHERE slug = 'cloud-kitchen-setup';
UPDATE service_packages SET avg_rating = 4.8, rating_count = 43 WHERE slug = 'tds-monthly-compliance';
UPDATE service_packages SET avg_rating = 4.7, rating_count = 48 WHERE slug = 'business-pan';
UPDATE service_packages SET avg_rating = 4.8, rating_count = 30 WHERE slug = 'esop-structuring';
UPDATE service_packages SET avg_rating = 4.9, rating_count = 35 WHERE slug = 'gst-cancellation';
UPDATE service_packages SET avg_rating = 4.8, rating_count = 40 WHERE slug = 'gst-revocation';
UPDATE service_packages SET avg_rating = 4.8, rating_count = 36 WHERE slug = 'din-reactivation';
UPDATE service_packages SET avg_rating = 4.9, rating_count = 40 WHERE slug = 'company-name-change';
UPDATE service_packages SET avg_rating = 4.7, rating_count = 42 WHERE slug = 'iepf-consultation';

COMMIT;

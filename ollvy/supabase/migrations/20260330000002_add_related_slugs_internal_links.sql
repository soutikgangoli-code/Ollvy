-- Add related_slugs to services that have only one internal link
-- This improves internal linking for SEO

-- company-closure: link to related company services
UPDATE service_packages
SET related_slugs = ARRAY['mca-annual-filing', 'director-kyc', 'pvt-ltd-incorporation']
WHERE slug = 'company-closure'
  AND (related_slugs IS NULL OR array_length(related_slugs, 1) < 2);

-- copyright-registration: link to related IP services
UPDATE service_packages
SET related_slugs = ARRAY['trademark-registration', 'pvt-ltd-incorporation', 'llp-incorporation']
WHERE slug = 'copyright-registration'
  AND (related_slugs IS NULL OR array_length(related_slugs, 1) < 2);

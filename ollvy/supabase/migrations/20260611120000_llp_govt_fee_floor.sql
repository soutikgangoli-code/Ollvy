-- LLP advertised govt-fee floor.
--
-- The service-page "starting from" price should reflect the CHEAPEST contribution
-- slab (contribution up to Rs 1L -> Rs 500 FiLLiP fee), not the Rs 5,000 ceiling.
-- Previously price_govt_fees_paisa was Rs 5,000, so the advertised price was the
-- ceiling and the cheapest real combination came out below it. This sets it to the
-- true floor; the dynamic price still rises by the real FiLLiP tiers for higher
-- contributions (see apps/customer/lib/pricing/calculate-price.ts).
UPDATE service_packages
SET price_govt_fees_paisa = 50000   -- Rs 500
WHERE slug = 'llp-incorporation';

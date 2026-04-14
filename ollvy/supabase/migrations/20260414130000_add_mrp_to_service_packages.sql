-- Add MRP (maximum retail price / comparison price) column to service_packages
ALTER TABLE service_packages ADD COLUMN price_mrp_paisa INT DEFAULT 0;

-- Populate MRP values for all active services
UPDATE service_packages SET price_mrp_paisa = 500000 WHERE slug = 'gst-registration';
UPDATE service_packages SET price_mrp_paisa = 2000000 WHERE slug = 'pvt-ltd-incorporation';
UPDATE service_packages SET price_mrp_paisa = 1500000 WHERE slug = 'llp-incorporation';
UPDATE service_packages SET price_mrp_paisa = 150000 WHERE slug = 'msme-registration';
UPDATE service_packages SET price_mrp_paisa = 1500000 WHERE slug = 'trademark-registration';
UPDATE service_packages SET price_mrp_paisa = 499900 WHERE slug = 'gst-monthly';
UPDATE service_packages SET price_mrp_paisa = 1200000 WHERE slug = 'business-itr';
UPDATE service_packages SET price_mrp_paisa = 1200000 WHERE slug = 'mca-annual-filing';
UPDATE service_packages SET price_mrp_paisa = 3000000 WHERE slug = 'cloud-kitchen-setup';
UPDATE service_packages SET price_mrp_paisa = 299900 WHERE slug = 'tds-monthly-compliance';
UPDATE service_packages SET price_mrp_paisa = 150000 WHERE slug = 'business-pan';
UPDATE service_packages SET price_mrp_paisa = 350000 WHERE slug = 'gst-cancellation';
UPDATE service_packages SET price_mrp_paisa = 799900 WHERE slug = 'gst-revocation';
UPDATE service_packages SET price_mrp_paisa = 1000000 WHERE slug = 'din-reactivation';
UPDATE service_packages SET price_mrp_paisa = 1200000 WHERE slug = 'company-name-change';

-- Strip "Up to ₹50L" turnover suffix from gst-monthly service name.
-- Renders in service page H1 hero and service cards (homepage + /services listing).
UPDATE service_packages
SET name = 'GST Monthly Filing'
WHERE slug = 'gst-monthly';

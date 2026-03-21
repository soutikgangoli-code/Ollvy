-- Add completion estimate fields to service_packages
-- These fields help distinguish services with government processing delays
-- and provide accurate completion timeline information

ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS has_govt_processing BOOLEAN DEFAULT false;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS completion_min_days INTEGER;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS completion_max_days INTEGER;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS completion_range_text TEXT;

-- =============================================
-- COMPANY REGISTRATION
-- =============================================
-- Pvt Ltd: 10-15 working days
UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 10,
  completion_max_days = 15,
  completion_range_text = '10-15 working days'
WHERE slug IN ('pvt-ltd-incorporation', 'llp-registration');

-- OPC: 7-10 working days
UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 7,
  completion_max_days = 10,
  completion_range_text = '7-10 working days'
WHERE slug = 'opc-registration';

-- =============================================
-- IP PROTECTION (long govt delays)
-- =============================================
-- Trademark: 12-18 months (360-540 days)
UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 360,
  completion_max_days = 540,
  completion_range_text = '12-18 months'
WHERE slug IN ('trademark-word', 'trademark-logo', 'trademark-registration');

-- Copyright: 2-3 months (60-90 days)
UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 60,
  completion_max_days = 90,
  completion_range_text = '2-3 months'
WHERE slug = 'copyright-registration';

-- Design: 45-60 days
UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 45,
  completion_max_days = 60,
  completion_range_text = '45-60 days'
WHERE slug = 'design-registration';

-- =============================================
-- FOOD & BEVERAGE (inspection-based)
-- =============================================
-- FSSAI State: 30-45 days
UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 30,
  completion_max_days = 45,
  completion_range_text = '30-45 days'
WHERE slug = 'fssai-state';

-- FSSAI Central: 45-60 days
UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 45,
  completion_max_days = 60,
  completion_range_text = '45-60 days'
WHERE slug = 'fssai-central';

-- Alcohol: 60-90 days
UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 60,
  completion_max_days = 90,
  completion_range_text = '60-90 days'
WHERE slug = 'alcohol-license';

-- Eating House: 14-21 days
UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 14,
  completion_max_days = 21,
  completion_range_text = '14-21 days'
WHERE slug = 'eating-house-license';

-- =============================================
-- OTHER LICENSES (inspection-based)
-- =============================================
UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 21,
  completion_max_days = 30,
  completion_range_text = '21-30 days'
WHERE slug = 'fire-noc';

UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 7,
  completion_max_days = 14,
  completion_range_text = '7-14 days'
WHERE slug IN ('professional-tax', 'shop-establishment', 'trade-license');

UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 45,
  completion_max_days = 60,
  completion_range_text = '45-60 days'
WHERE slug = 'drug-license-retail';

UPDATE service_packages SET
  has_govt_processing = true,
  completion_min_days = 60,
  completion_max_days = 90,
  completion_range_text = '60-90 days'
WHERE slug IN ('pcb-consent', 'peso-license');

-- =============================================
-- SERVICES OLLVY CONTROLS (no govt disclaimer)
-- Keep has_govt_processing = false (default)
-- These include: GST Registration, FSSAI Basic, IEC Code,
-- MSME/Udyam, all recurring/monthly services, annual compliance
-- =============================================

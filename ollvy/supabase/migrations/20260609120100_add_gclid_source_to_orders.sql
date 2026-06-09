-- Add nullable gclid_source column to the existing orders table.
--
-- Records WHICH Google param the click id came from: 'gclid' (standard web),
-- 'gbraid' or 'wbraid' (iOS / privacy-safe variants). Stored alongside the
-- value in orders.gclid so the future offline-conversion-import job can route
-- each id to the correct Google Ads field.
--
-- Additive, idempotent, nullable. Independent of 20260609120000 (the gclid
-- column) — either migration can be applied alone and in any order. Not needed
-- to fire conversions today.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS gclid_source TEXT;

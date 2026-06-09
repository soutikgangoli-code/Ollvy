-- Add nullable gclid column to the existing orders table.
--
-- Forward-looking plumbing for server-side (offline) Google Ads conversion
-- import. Stores the Google click identifier (the gclid / gbraid / wbraid value)
-- captured at first touch on landing and carried through to checkout, then
-- written onto the order at creation time by create-razorpay-order.
--
-- Nullable by design: most orders have no click id (organic, direct, referral,
-- non-Google paid). Not needed to fire conversions today — this only enables a
-- later offline-conversion-import job that matches gclid -> order value/time.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS gclid TEXT;

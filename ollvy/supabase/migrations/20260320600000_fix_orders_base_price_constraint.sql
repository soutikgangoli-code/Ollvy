-- Fix: Drop NOT NULL constraint on legacy columns in orders table
-- These are replaced by price_*_snapshot columns

DO $$
DECLARE
  col_name TEXT;
  legacy_columns TEXT[] := ARRAY[
    'base_price',
    'government_fees',
    'gst_amount',
    'total_amount',
    'platform_fee',
    'professional_fee',
    'platform_fee_percent'
  ];
BEGIN
  FOREACH col_name IN ARRAY legacy_columns
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'orders'
      AND column_name = col_name
      AND is_nullable = 'NO'
    ) THEN
      EXECUTE format('ALTER TABLE orders ALTER COLUMN %I DROP NOT NULL', col_name);
    END IF;
  END LOOP;
END$$;

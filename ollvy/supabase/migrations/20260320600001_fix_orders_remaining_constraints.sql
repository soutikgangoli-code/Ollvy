-- Fix: Drop NOT NULL constraint on remaining legacy columns in orders table

DO $$
DECLARE
  col_name TEXT;
  legacy_columns TEXT[] := ARRAY[
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

-- Fix: Drop NOT NULL constraint on ALL non-essential columns in orders table
-- Keep NOT NULL only on: id, user_id, service_package_id, order_type, status,
-- price_base_paisa_snapshot, price_gst_paisa_snapshot, total_paisa_snapshot

DO $$
DECLARE
  r RECORD;
  essential_columns TEXT[] := ARRAY[
    'id',
    'user_id',
    'service_package_id',
    'order_type',
    'status',
    'price_base_paisa_snapshot',
    'price_gst_paisa_snapshot',
    'total_paisa_snapshot'
  ];
BEGIN
  -- Loop through all NOT NULL columns in orders table
  FOR r IN
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'orders'
    AND is_nullable = 'NO'
    AND column_name != ALL(essential_columns)
  LOOP
    EXECUTE format('ALTER TABLE orders ALTER COLUMN %I DROP NOT NULL', r.column_name);
    RAISE NOTICE 'Dropped NOT NULL on orders.%', r.column_name;
  END LOOP;
END$$;

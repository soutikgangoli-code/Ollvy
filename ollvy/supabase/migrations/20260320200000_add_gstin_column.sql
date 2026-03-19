-- =============================================================================
-- Migration: Add GSTIN column to users table
-- For businesses registered under GST
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'gstin'
  ) THEN
    ALTER TABLE users ADD COLUMN gstin TEXT;
    COMMENT ON COLUMN users.gstin IS 'GST Identification Number for registered businesses (15 characters)';
  END IF;
END $$;

-- Add a check constraint for GSTIN format (optional, for data integrity)
-- GSTIN format: 2 digits state code + 10 char PAN + 1 digit + Z + 1 checksum
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'users' AND constraint_name = 'users_gstin_format_check'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_gstin_format_check
    CHECK (gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
  END IF;
END $$;

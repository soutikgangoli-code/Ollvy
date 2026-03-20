-- Add email, PAN, and Aadhaar fields to users table for persistent identity storage

-- Add new columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS pan_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS aadhaar_number TEXT;

-- PAN format validation (10 chars: 5 letters, 4 digits, 1 letter)
-- Example: ABCDE1234F
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_pan_format'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_pan_format
      CHECK (pan_number IS NULL OR pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]$');
  END IF;
END $$;

-- Aadhaar format validation (12 digits)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_aadhaar_format'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_aadhaar_format
      CHECK (aadhaar_number IS NULL OR aadhaar_number ~ '^\d{12}$');
  END IF;
END $$;

-- Email format validation (basic email pattern)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_email_format'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_format
      CHECK (email IS NULL OR email ~ '^[^@]+@[^@]+\.[^@]+$');
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN users.email IS 'User email address for communication';
COMMENT ON COLUMN users.pan_number IS 'PAN card number (format: ABCDE1234F)';
COMMENT ON COLUMN users.aadhaar_number IS 'Aadhaar number (12 digits)';

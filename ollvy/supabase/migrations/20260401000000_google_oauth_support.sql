-- Google OAuth Support Migration
-- Makes phone nullable (collected post-payment) and adds auth_provider tracking

-- Step 1: Drop the NOT NULL constraint on phone
-- First drop the unique constraint, alter, then re-add unique (allowing nulls)
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;

-- Step 2: Add auth_provider column to track how user signed up
-- Values: 'phone' for existing OTP users, 'google' for OAuth users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'auth_provider'
  ) THEN
    ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'phone';
  END IF;
END $$;

-- Step 3: Add email column if not exists (Google provides email)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email'
  ) THEN
    ALTER TABLE users ADD COLUMN email TEXT;
  END IF;
END $$;

-- Step 4: Add index on email for lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Step 5: Update existing users to have auth_provider = 'phone'
UPDATE users SET auth_provider = 'phone' WHERE auth_provider IS NULL;

-- Comment: Phone unique constraint is kept but now allows NULLs
-- Multiple users can have NULL phone (until they provide it post-payment)

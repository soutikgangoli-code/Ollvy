-- Add CIN field to users table and create auto-sync mechanism for registration numbers

-- 1. Add CIN to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS cin TEXT;

-- CIN format validation (21 characters: L/U + 5 digits + 2 letters + 4 digits + 3 letters + 6 digits)
-- Example: U72200MH2023PTC123456
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_cin_format'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_cin_format
      CHECK (cin IS NULL OR cin ~ '^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$');
  END IF;
END $$;

COMMENT ON COLUMN users.cin IS 'Corporate Identity Number (for Pvt Ltd, LLP, OPC)';

-- 2. Add registration_number field to order_work_documents
-- This allows professionals to input the extracted registration number when uploading deliverables
ALTER TABLE order_work_documents ADD COLUMN IF NOT EXISTS registration_number TEXT;

COMMENT ON COLUMN order_work_documents.registration_number IS 'Extracted registration number from this document (e.g., GSTIN, CIN, LLPIN)';

-- 3. Create mapping table for document types to user profile fields
CREATE TABLE IF NOT EXISTS registration_number_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_key TEXT NOT NULL UNIQUE,
  user_field TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert mappings for which documents should update which user fields
INSERT INTO registration_number_mappings (document_key, user_field, description) VALUES
  ('gst_certificate', 'gstin', 'GST Registration Certificate updates GSTIN'),
  ('gstin_summary', 'gstin', 'GSTIN Summary Sheet updates GSTIN'),
  ('certificate_of_incorporation', 'cin', 'Certificate of Incorporation updates CIN'),
  ('llp_certificate_of_incorporation', 'cin', 'LLP Certificate of Incorporation updates CIN (LLPIN format)')
ON CONFLICT (document_key) DO NOTHING;

-- 4. Create function to sync registration number to user profile
CREATE OR REPLACE FUNCTION sync_registration_number_to_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_user_field TEXT;
  v_service_slug TEXT;
BEGIN
  -- Only process if registration_number is set and document is verified or uploaded
  IF NEW.registration_number IS NULL OR NEW.registration_number = '' THEN
    RETURN NEW;
  END IF;

  -- Only process deliverables (to_customer direction)
  IF NEW.direction != 'to_customer' THEN
    RETURN NEW;
  END IF;

  -- Get the user_id from the order
  SELECT o.user_id INTO v_user_id
  FROM orders o
  WHERE o.id = NEW.order_id;

  IF v_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get the user field to update based on document_key
  SELECT user_field INTO v_user_field
  FROM registration_number_mappings
  WHERE document_key = NEW.document_key;

  IF v_user_field IS NULL THEN
    RETURN NEW;
  END IF;

  -- Update the appropriate user field
  -- Using dynamic SQL to update the correct column
  IF v_user_field = 'gstin' THEN
    UPDATE users SET gstin = UPPER(NEW.registration_number) WHERE id = v_user_id AND (gstin IS NULL OR gstin = '');
  ELSIF v_user_field = 'cin' THEN
    UPDATE users SET cin = UPPER(NEW.registration_number) WHERE id = v_user_id AND (cin IS NULL OR cin = '');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger to auto-sync when registration_number is added/updated
DROP TRIGGER IF EXISTS trigger_sync_registration_number ON order_work_documents;
CREATE TRIGGER trigger_sync_registration_number
  AFTER INSERT OR UPDATE OF registration_number ON order_work_documents
  FOR EACH ROW
  EXECUTE FUNCTION sync_registration_number_to_user();

-- 6. Also sync when a document is verified (in case registration_number was set before verification)
CREATE OR REPLACE FUNCTION sync_registration_on_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when being verified (verified_at changed from NULL to a value)
  IF NEW.verified_at IS NOT NULL AND OLD.verified_at IS NULL THEN
    -- Re-trigger the sync by updating the row (will fire the other trigger)
    IF NEW.registration_number IS NOT NULL AND NEW.registration_number != '' THEN
      -- The sync_registration_number_to_user trigger will handle this
      PERFORM sync_registration_number_to_user();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant necessary permissions
GRANT SELECT ON registration_number_mappings TO authenticated;
GRANT SELECT ON registration_number_mappings TO service_role;

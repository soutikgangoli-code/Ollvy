-- Add more registration number fields to users table for auto-sync from completed orders

-- DIN (Director Identification Number) - 8 digits
ALTER TABLE users ADD COLUMN IF NOT EXISTS din TEXT;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_din_format') THEN
    ALTER TABLE users ADD CONSTRAINT users_din_format
      CHECK (din IS NULL OR din ~ '^\d{8}$');
  END IF;
END $$;
COMMENT ON COLUMN users.din IS 'Director Identification Number (8 digits)';

-- TAN (Tax Deduction Account Number) - 10 chars like PAN
ALTER TABLE users ADD COLUMN IF NOT EXISTS tan TEXT;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_tan_format') THEN
    ALTER TABLE users ADD CONSTRAINT users_tan_format
      CHECK (tan IS NULL OR tan ~ '^[A-Z]{4}[0-9]{5}[A-Z]$');
  END IF;
END $$;
COMMENT ON COLUMN users.tan IS 'Tax Deduction Account Number (format: ABCD12345E)';

-- IEC (Import Export Code) - 10 digits
ALTER TABLE users ADD COLUMN IF NOT EXISTS iec TEXT;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_iec_format') THEN
    ALTER TABLE users ADD CONSTRAINT users_iec_format
      CHECK (iec IS NULL OR iec ~ '^\d{10}$');
  END IF;
END $$;
COMMENT ON COLUMN users.iec IS 'Import Export Code (10 digits)';

-- FSSAI License Number - 14 digits
ALTER TABLE users ADD COLUMN IF NOT EXISTS fssai_number TEXT;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_fssai_format') THEN
    ALTER TABLE users ADD CONSTRAINT users_fssai_format
      CHECK (fssai_number IS NULL OR fssai_number ~ '^\d{14}$');
  END IF;
END $$;
COMMENT ON COLUMN users.fssai_number IS 'FSSAI License Number (14 digits)';

-- MSME/Udyam Registration Number - format: UDYAM-XX-00-0000000
ALTER TABLE users ADD COLUMN IF NOT EXISTS udyam_number TEXT;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_udyam_format') THEN
    ALTER TABLE users ADD CONSTRAINT users_udyam_format
      CHECK (udyam_number IS NULL OR udyam_number ~ '^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$');
  END IF;
END $$;
COMMENT ON COLUMN users.udyam_number IS 'Udyam/MSME Registration Number';

-- Shop & Establishment Registration Number (flexible format - varies by state)
ALTER TABLE users ADD COLUMN IF NOT EXISTS shop_establishment_number TEXT;
COMMENT ON COLUMN users.shop_establishment_number IS 'Shop & Establishment Registration Number';

-- Professional Tax Registration Number (flexible format - varies by state)
ALTER TABLE users ADD COLUMN IF NOT EXISTS pt_number TEXT;
COMMENT ON COLUMN users.pt_number IS 'Professional Tax Registration Number';

-- Trademark Registration Number
ALTER TABLE users ADD COLUMN IF NOT EXISTS trademark_number TEXT;
COMMENT ON COLUMN users.trademark_number IS 'Trademark Registration Number';

-- Add more mappings for auto-sync
INSERT INTO registration_number_mappings (document_key, user_field, description) VALUES
  -- DIN related
  ('din_certificate', 'din', 'DIN Certificate updates DIN'),
  ('din_allotment_letter', 'din', 'DIN Allotment Letter updates DIN'),
  -- TAN related
  ('tan_certificate', 'tan', 'TAN Certificate updates TAN'),
  ('company_tan', 'tan', 'Company TAN updates TAN'),
  ('llp_tan', 'tan', 'LLP TAN updates TAN'),
  -- IEC related
  ('iec_certificate', 'iec', 'IEC Certificate updates IEC'),
  -- FSSAI related
  ('fssai_license', 'fssai_number', 'FSSAI License updates FSSAI Number'),
  ('fssai_certificate', 'fssai_number', 'FSSAI Certificate updates FSSAI Number'),
  -- MSME/Udyam related
  ('udyam_certificate', 'udyam_number', 'Udyam Certificate updates MSME Number'),
  ('msme_certificate', 'udyam_number', 'MSME Certificate updates Udyam Number'),
  -- Shop & Establishment
  ('shop_establishment_certificate', 'shop_establishment_number', 'Shop Act Certificate updates registration'),
  -- Professional Tax
  ('pt_certificate', 'pt_number', 'Professional Tax Certificate updates PT Number'),
  -- Trademark
  ('trademark_certificate', 'trademark_number', 'Trademark Certificate updates TM Number')
ON CONFLICT (document_key) DO NOTHING;

-- Update the sync function to handle all new fields
CREATE OR REPLACE FUNCTION sync_registration_number_to_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_user_field TEXT;
BEGIN
  -- Only process if registration_number is set
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

  -- Update the appropriate user field (only if currently empty)
  CASE v_user_field
    WHEN 'gstin' THEN
      UPDATE users SET gstin = UPPER(NEW.registration_number) WHERE id = v_user_id AND (gstin IS NULL OR gstin = '');
    WHEN 'cin' THEN
      UPDATE users SET cin = UPPER(NEW.registration_number) WHERE id = v_user_id AND (cin IS NULL OR cin = '');
    WHEN 'din' THEN
      UPDATE users SET din = NEW.registration_number WHERE id = v_user_id AND (din IS NULL OR din = '');
    WHEN 'tan' THEN
      UPDATE users SET tan = UPPER(NEW.registration_number) WHERE id = v_user_id AND (tan IS NULL OR tan = '');
    WHEN 'iec' THEN
      UPDATE users SET iec = NEW.registration_number WHERE id = v_user_id AND (iec IS NULL OR iec = '');
    WHEN 'fssai_number' THEN
      UPDATE users SET fssai_number = NEW.registration_number WHERE id = v_user_id AND (fssai_number IS NULL OR fssai_number = '');
    WHEN 'udyam_number' THEN
      UPDATE users SET udyam_number = UPPER(NEW.registration_number) WHERE id = v_user_id AND (udyam_number IS NULL OR udyam_number = '');
    WHEN 'shop_establishment_number' THEN
      UPDATE users SET shop_establishment_number = NEW.registration_number WHERE id = v_user_id AND (shop_establishment_number IS NULL OR shop_establishment_number = '');
    WHEN 'pt_number' THEN
      UPDATE users SET pt_number = NEW.registration_number WHERE id = v_user_id AND (pt_number IS NULL OR pt_number = '');
    WHEN 'trademark_number' THEN
      UPDATE users SET trademark_number = NEW.registration_number WHERE id = v_user_id AND (trademark_number IS NULL OR trademark_number = '');
    ELSE
      -- Unknown field, do nothing
      NULL;
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Migration 004: OTP rate limits table with verification columns
-- =============================================================================

-- Create table if it doesn't exist (with all columns)
CREATE TABLE IF NOT EXISTS otp_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  otp_code TEXT,
  msg91_request_id TEXT,
  attempt_count INT DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  verified BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add columns if table exists but columns don't (for idempotency)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'otp_rate_limits' AND column_name = 'otp_code') THEN
    ALTER TABLE otp_rate_limits ADD COLUMN otp_code TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'otp_rate_limits' AND column_name = 'msg91_request_id') THEN
    ALTER TABLE otp_rate_limits ADD COLUMN msg91_request_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'otp_rate_limits' AND column_name = 'verified') THEN
    ALTER TABLE otp_rate_limits ADD COLUMN verified BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'otp_rate_limits' AND column_name = 'expires_at') THEN
    ALTER TABLE otp_rate_limits ADD COLUMN expires_at TIMESTAMPTZ;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE otp_rate_limits ENABLE ROW LEVEL SECURITY;

-- Index for phone lookup
CREATE INDEX IF NOT EXISTS idx_otp_rate_limits_phone_window
  ON otp_rate_limits(phone, window_start DESC);

-- Index for cleanup cron (expired OTPs)
CREATE INDEX IF NOT EXISTS idx_otp_rate_limits_expires_at
  ON otp_rate_limits(expires_at)
  WHERE expires_at IS NOT NULL;

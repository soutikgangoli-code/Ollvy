-- Migration: OTP Rate Limit Trigger Creation
-- Purpose: Create trigger for OTP rate limiting (depends on enforce_otp_rate_limits function)

-- Use DO block to combine DROP and CREATE as single statement
DO $$
BEGIN
  -- Drop existing trigger if it exists
  DROP TRIGGER IF EXISTS trg_enforce_otp_rate_limits ON otp_rate_limits;

  -- Create trigger to run before each OTP insert
  CREATE TRIGGER trg_enforce_otp_rate_limits
    BEFORE INSERT ON otp_rate_limits
    FOR EACH ROW
    EXECUTE FUNCTION enforce_otp_rate_limits();
END$$

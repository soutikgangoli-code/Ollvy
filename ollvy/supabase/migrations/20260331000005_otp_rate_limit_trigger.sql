-- Migration: OTP Rate Limit Trigger
-- Purpose: Fix race condition where rate limit check and insert are not atomic
-- Related Issue: #13 - OTP Rate Limit Race Condition

-- Create function to enforce OTP rate limits at database level
CREATE OR REPLACE FUNCTION enforce_otp_rate_limits()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_attempts_in_hour INT;
  v_attempts_in_10min INT;
  v_max_per_hour INT := 5;
  v_max_per_10min INT := 3;
BEGIN
  -- Count attempts in the last hour
  SELECT COUNT(*) INTO v_attempts_in_hour
  FROM otp_rate_limits
  WHERE phone = NEW.phone
    AND window_start >= NOW() - INTERVAL '1 hour';

  -- Check hourly limit
  IF v_attempts_in_hour >= v_max_per_hour THEN
    RAISE EXCEPTION 'OTP_RATE_LIMIT_HOUR: Too many OTP attempts. Maximum % per hour exceeded.', v_max_per_hour;
  END IF;

  -- Count attempts in the last 10 minutes
  SELECT COUNT(*) INTO v_attempts_in_10min
  FROM otp_rate_limits
  WHERE phone = NEW.phone
    AND window_start >= NOW() - INTERVAL '10 minutes';

  -- Check 10-minute limit
  IF v_attempts_in_10min >= v_max_per_10min THEN
    RAISE EXCEPTION 'OTP_RATE_LIMIT_10MIN: Too many OTP attempts. Maximum % per 10 minutes exceeded.', v_max_per_10min;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to run before each OTP insert
DROP TRIGGER IF EXISTS trg_enforce_otp_rate_limits ON otp_rate_limits;
CREATE TRIGGER trg_enforce_otp_rate_limits
  BEFORE INSERT ON otp_rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION enforce_otp_rate_limits();

-- Add comment for documentation
COMMENT ON FUNCTION enforce_otp_rate_limits IS
'BEFORE INSERT trigger function that enforces OTP rate limits at database level.
Prevents race condition where concurrent requests could bypass rate limit checks.
Limits: 5 per hour, 3 per 10 minutes.';

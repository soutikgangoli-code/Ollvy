-- Migration: Atomic Strike Increment
-- Purpose: Fix race condition where concurrent SLA violations can lose strike increments
-- Related Issue: #2 - Race Condition: Strike Count Lost Increments

-- Create atomic strike increment function using UPDATE...RETURNING pattern
CREATE OR REPLACE FUNCTION apply_strike_atomic(
  p_professional_id UUID,
  p_order_id UUID,
  p_sla_alert_id UUID,
  p_reason TEXT
)
RETURNS TABLE (
  success BOOLEAN,
  old_strike_count INT,
  new_strike_count INT,
  should_suspend BOOLEAN,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_count INT;
  v_new_count INT;
  v_pro_name TEXT;
  v_pro_status TEXT;
BEGIN
  -- Lock and update the strike count atomically, returning both old and new values
  UPDATE professionals
  SET strike_count = COALESCE(strike_count, 0) + 1
  WHERE id = p_professional_id
  RETURNING
    COALESCE(strike_count - 1, 0), -- old count (current - 1 since we just incremented)
    strike_count,
    name,
    status
  INTO v_old_count, v_new_count, v_pro_name, v_pro_status;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 0, FALSE, 'Professional not found'::TEXT;
    RETURN;
  END IF;

  -- Write to admin audit log
  INSERT INTO admin_audit_log (
    admin_user_id,
    action,
    target_type,
    target_id,
    notes,
    payload
  ) VALUES (
    NULL, -- System action
    'apply_strike',
    'professional',
    p_professional_id,
    p_reason,
    jsonb_build_object(
      'order_id', p_order_id,
      'sla_alert_id', p_sla_alert_id,
      'old_strike_count', v_old_count,
      'new_strike_count', v_new_count
    )
  );

  RETURN QUERY SELECT
    TRUE,
    v_old_count,
    v_new_count,
    (v_new_count >= 5)::BOOLEAN,
    NULL::TEXT;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION apply_strike_atomic(UUID, UUID, UUID, TEXT) TO service_role;

-- Add comment for documentation
COMMENT ON FUNCTION apply_strike_atomic IS
'Atomically increments professional strike count using UPDATE...RETURNING pattern.
Prevents race condition where concurrent SLA violations could lose strike increments.
Returns old count, new count, and whether suspension threshold (5) was reached.';

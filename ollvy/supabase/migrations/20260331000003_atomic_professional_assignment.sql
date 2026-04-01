-- Migration: Atomic Professional Assignment
-- Purpose: Fix race condition where concurrent orders can exceed max_concurrent_orders
-- Related Issue: #3 - Race Condition: Professional Over-Capacity Assignment

-- Create atomic professional assignment function with capacity check and lock
CREATE OR REPLACE FUNCTION assign_professional_atomic(
  p_order_id UUID,
  p_professional_id UUID,
  p_expected_status TEXT DEFAULT 'pending_assignment'
)
RETURNS TABLE (
  success BOOLEAN,
  assigned BOOLEAN,
  current_orders INT,
  max_orders INT,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_active INT;
  v_max_concurrent INT;
  v_is_available BOOLEAN;
  v_on_leave_until DATE;
  v_pro_status TEXT;
  v_order_exists BOOLEAN;
  v_now TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
  -- First verify the order exists and is in expected status
  SELECT EXISTS(
    SELECT 1 FROM orders WHERE id = p_order_id AND status = p_expected_status
  ) INTO v_order_exists;

  IF NOT v_order_exists THEN
    RETURN QUERY SELECT FALSE, FALSE, 0, 0, 'Order not found or not in expected status'::TEXT;
    RETURN;
  END IF;

  -- Lock professional's availability row to prevent concurrent assignments
  SELECT
    pa.current_active_orders,
    pa.max_concurrent_orders,
    pa.is_available,
    pa.on_leave_until,
    p.status
  INTO v_current_active, v_max_concurrent, v_is_available, v_on_leave_until, v_pro_status
  FROM professionals p
  JOIN professional_availability pa ON pa.professional_id = p.id
  WHERE p.id = p_professional_id
  FOR UPDATE OF pa;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, FALSE, 0, 0, 'Professional or availability record not found'::TEXT;
    RETURN;
  END IF;

  -- Check professional status
  IF v_pro_status != 'approved' THEN
    RETURN QUERY SELECT FALSE, FALSE, v_current_active, v_max_concurrent,
      ('Professional status is ' || v_pro_status || ', not approved')::TEXT;
    RETURN;
  END IF;

  -- Check availability
  IF NOT v_is_available THEN
    RETURN QUERY SELECT FALSE, FALSE, v_current_active, v_max_concurrent, 'Professional is not available'::TEXT;
    RETURN;
  END IF;

  -- Check leave status
  IF v_on_leave_until IS NOT NULL AND v_on_leave_until > CURRENT_DATE THEN
    RETURN QUERY SELECT FALSE, FALSE, v_current_active, v_max_concurrent,
      ('Professional is on leave until ' || v_on_leave_until::TEXT)::TEXT;
    RETURN;
  END IF;

  -- Check capacity - this is the key race condition fix
  IF v_current_active >= v_max_concurrent THEN
    RETURN QUERY SELECT FALSE, FALSE, v_current_active, v_max_concurrent, 'Professional at capacity'::TEXT;
    RETURN;
  END IF;

  -- All checks passed - perform the assignment atomically

  -- 1. Update order with professional assignment
  UPDATE orders
  SET
    professional_id = p_professional_id,
    status = 'assigned',
    assigned_at = v_now
  WHERE id = p_order_id
    AND status = p_expected_status; -- Double-check status hasn't changed

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, FALSE, v_current_active, v_max_concurrent, 'Order status changed during assignment'::TEXT;
    RETURN;
  END IF;

  -- 2. Increment professional's active order count
  UPDATE professional_availability
  SET current_active_orders = current_active_orders + 1
  WHERE professional_id = p_professional_id;

  -- 3. Update professional's last_assigned_at
  UPDATE professionals
  SET last_assigned_at = v_now
  WHERE id = p_professional_id;

  RETURN QUERY SELECT TRUE, TRUE, v_current_active + 1, v_max_concurrent, NULL::TEXT;
END;
$$

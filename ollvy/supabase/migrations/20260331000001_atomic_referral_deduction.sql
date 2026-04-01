-- Migration: Atomic Referral Credit Deduction
-- Purpose: Fix race condition where concurrent orders can overdraft user's credit balance
-- Related Issue: #1 - Race Condition: Referral Credit Double-Spending

-- Create atomic referral credit deduction function with FOR UPDATE locking
CREATE OR REPLACE FUNCTION deduct_referral_credit_atomic(
  p_user_id UUID,
  p_requested_amount BIGINT,
  p_max_applicable BIGINT -- Floor amount: max credit that can be applied based on order price
)
RETURNS TABLE (
  success BOOLEAN,
  amount_deducted BIGINT,
  new_balance BIGINT,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance BIGINT;
  v_amount_to_deduct BIGINT;
  v_new_balance BIGINT;
BEGIN
  -- Lock the user row to prevent concurrent modifications
  SELECT referral_credit_balance_paisa INTO v_current_balance
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0::BIGINT, 0::BIGINT, 'User not found'::TEXT;
    RETURN;
  END IF;

  -- Handle null balance
  v_current_balance := COALESCE(v_current_balance, 0);

  -- Calculate amount to deduct: min(current_balance, requested_amount, max_applicable)
  v_amount_to_deduct := LEAST(v_current_balance, p_requested_amount, p_max_applicable);

  -- Ensure non-negative deduction
  v_amount_to_deduct := GREATEST(v_amount_to_deduct, 0);

  IF v_amount_to_deduct <= 0 THEN
    RETURN QUERY SELECT TRUE, 0::BIGINT, v_current_balance, NULL::TEXT;
    RETURN;
  END IF;

  -- Calculate new balance
  v_new_balance := v_current_balance - v_amount_to_deduct;

  -- Update the user's balance
  UPDATE users
  SET referral_credit_balance_paisa = v_new_balance
  WHERE id = p_user_id;

  RETURN QUERY SELECT TRUE, v_amount_to_deduct, v_new_balance, NULL::TEXT;
END;
$$

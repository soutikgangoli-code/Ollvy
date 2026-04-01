-- Migration: Atomic Credit Redemption
-- Purpose: Fix non-atomic partial credit split that could lose credits
-- Related Issue: #12 - Non-Atomic Partial Credit Split

-- Create atomic credit redemption function
CREATE OR REPLACE FUNCTION redeem_credits_atomic(
  p_user_id UUID,
  p_order_id UUID,
  p_amount_to_redeem BIGINT
)
RETURNS TABLE (
  success BOOLEAN,
  credits_redeemed BIGINT,
  credits_updated TEXT[],
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credit RECORD;
  v_remaining BIGINT := p_amount_to_redeem;
  v_credits_to_update UUID[] := '{}';
  v_total_redeemed BIGINT := 0;
  v_new_credit_id UUID;
BEGIN
  -- Validate amount
  IF p_amount_to_redeem <= 0 THEN
    RETURN QUERY SELECT TRUE, 0::BIGINT, '{}'::TEXT[], NULL::TEXT;
    RETURN;
  END IF;

  -- Lock and iterate through available credits (FIFO order)
  FOR v_credit IN
    SELECT id, credit_paisa
    FROM referral_credits
    WHERE (referee_user_id = p_user_id OR referrer_user_id = p_user_id)
      AND status = 'available'
    ORDER BY created_at ASC
    FOR UPDATE
  LOOP
    EXIT WHEN v_remaining <= 0;

    IF v_credit.credit_paisa <= v_remaining THEN
      -- Use entire credit
      UPDATE referral_credits
      SET
        status = 'redeemed',
        redeemed_at = NOW()
      WHERE id = v_credit.id;

      v_remaining := v_remaining - v_credit.credit_paisa;
      v_total_redeemed := v_total_redeemed + v_credit.credit_paisa;
      v_credits_to_update := array_append(v_credits_to_update, v_credit.id);

    ELSE
      -- Partial credit - split the record atomically
      -- First, mark original as redeemed (for the used portion)
      UPDATE referral_credits
      SET
        credit_paisa = v_remaining, -- Reduce to amount used
        status = 'redeemed',
        redeemed_at = NOW()
      WHERE id = v_credit.id;

      -- Create new record with remainder
      INSERT INTO referral_credits (
        referrer_user_id,
        referee_user_id,
        credit_paisa,
        type,
        status,
        available_at,
        expires_at
      )
      SELECT
        referrer_user_id,
        referee_user_id,
        v_credit.credit_paisa - v_remaining, -- Remaining portion
        type,
        'available',
        NOW(),
        expires_at
      FROM referral_credits
      WHERE id = v_credit.id
      RETURNING id INTO v_new_credit_id;

      v_total_redeemed := v_total_redeemed + v_remaining;
      v_credits_to_update := array_append(v_credits_to_update, v_credit.id);
      v_remaining := 0;
    END IF;
  END LOOP;

  -- Update user's credit balance
  UPDATE users
  SET referral_credit_balance_paisa = GREATEST(0, COALESCE(referral_credit_balance_paisa, 0) - v_total_redeemed)
  WHERE id = p_user_id;

  -- Record the redemption
  IF v_total_redeemed > 0 THEN
    INSERT INTO referral_credits (
      referrer_user_id,
      referee_user_id,
      credit_paisa,
      type,
      status,
      redeemed_at
    ) VALUES (
      NULL,
      p_user_id,
      -v_total_redeemed, -- Negative for redemption
      'redemption',
      'redeemed',
      NOW()
    );
  END IF;

  RETURN QUERY SELECT
    TRUE,
    v_total_redeemed,
    ARRAY(SELECT id::TEXT FROM UNNEST(v_credits_to_update) AS id),
    NULL::TEXT;
END;
$$

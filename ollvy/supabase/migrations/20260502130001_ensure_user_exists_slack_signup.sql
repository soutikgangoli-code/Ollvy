-- =============================================================================
-- Migration: ensure_user_exists writes a new-signup row to
-- slack_notifications_queue ONLY when a brand-new public.users row is created.
-- =============================================================================
-- Re-link branch (existing user, new auth_user_id) does NOT enqueue, since
-- it represents a returning user whose Google account was previously phone-only.
--
-- The queue insert is wrapped in a nested BEGIN..EXCEPTION block so any failure
-- there cannot break user creation - the parent operation must always succeed.
-- =============================================================================

CREATE OR REPLACE FUNCTION ensure_user_exists(
  p_email TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_full_name TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_auth_user_id UUID;
  v_user_id UUID;
  v_user_record JSON;
  v_email TEXT;
  v_was_inserted BOOLEAN := FALSE;
BEGIN
  v_auth_user_id := auth.uid();

  IF v_auth_user_id IS NULL THEN
    RETURN json_build_object('error', 'Not authenticated');
  END IF;

  v_email := COALESCE(p_email, (SELECT email FROM auth.users WHERE id = v_auth_user_id));

  -- Check by auth_user_id first.
  SELECT id INTO v_user_id
  FROM users
  WHERE auth_user_id = v_auth_user_id;

  -- Then try email-based account linking.
  IF v_user_id IS NULL AND v_email IS NOT NULL THEN
    SELECT id INTO v_user_id
    FROM users
    WHERE email = v_email;

    IF v_user_id IS NOT NULL THEN
      UPDATE users
      SET auth_user_id = v_auth_user_id,
          auth_provider = 'google',
          avatar_url = COALESCE(p_avatar_url, avatar_url),
          updated_at = NOW()
      WHERE id = v_user_id;
    END IF;
  END IF;

  -- Brand-new user: create the row.
  IF v_user_id IS NULL THEN
    INSERT INTO users (
      auth_user_id,
      email,
      phone,
      auth_provider,
      avatar_url,
      business_name,
      referral_code
    )
    VALUES (
      v_auth_user_id,
      v_email,
      NULL,
      'google',
      p_avatar_url,
      p_full_name,
      'OLV' || upper(substr(md5(random()::text), 1, 6))
    )
    RETURNING id INTO v_user_id;

    v_was_inserted := TRUE;
  END IF;

  -- Enqueue Slack ping ONLY for new signups, never for re-link.
  IF v_was_inserted THEN
    BEGIN
      INSERT INTO slack_notifications_queue (channel, event_type, payload)
      VALUES (
        'leads',
        'new_signup',
        jsonb_build_object(
          'user_id', v_user_id,
          'business_name', p_full_name,
          'email', p_email,
          'auth_provider', 'google'
        )
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'ensure_user_exists: failed to enqueue Slack signup for %: %', v_user_id, SQLERRM;
    END;
  END IF;

  SELECT json_build_object(
    'id', id,
    'auth_user_id', auth_user_id,
    'email', email,
    'phone', phone,
    'business_name', business_name,
    'business_type', business_type,
    'gst_number', gst_number,
    'pan_number', pan_number,
    'avatar_url', avatar_url,
    'referral_code', referral_code,
    'referred_by', referred_by,
    'auth_provider', auth_provider,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO v_user_record
  FROM users
  WHERE id = v_user_id;

  RETURN v_user_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

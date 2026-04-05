-- Create RPC function to ensure user record exists
-- This is called from the frontend as a fallback when user data is not found
-- after OAuth authentication
-- Also handles account linking: if user exists by email but has different auth_user_id,
-- we update their auth_user_id to link the accounts

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
BEGIN
  -- Get the authenticated user's auth ID
  v_auth_user_id := auth.uid();

  IF v_auth_user_id IS NULL THEN
    RETURN json_build_object('error', 'Not authenticated');
  END IF;

  -- Get email from parameter or auth.users
  v_email := COALESCE(p_email, (SELECT email FROM auth.users WHERE id = v_auth_user_id));

  -- First check if user exists by auth_user_id
  SELECT id INTO v_user_id
  FROM users
  WHERE auth_user_id = v_auth_user_id;

  -- If not found by auth_user_id, try finding by email (account linking)
  IF v_user_id IS NULL AND v_email IS NOT NULL THEN
    SELECT id INTO v_user_id
    FROM users
    WHERE email = v_email;

    -- If found by email, link the auth_user_id
    IF v_user_id IS NOT NULL THEN
      UPDATE users
      SET auth_user_id = v_auth_user_id,
          auth_provider = 'google',
          avatar_url = COALESCE(p_avatar_url, avatar_url),
          updated_at = NOW()
      WHERE id = v_user_id;
    END IF;
  END IF;

  -- If still not found, create new user
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
  END IF;

  -- Return the user record
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

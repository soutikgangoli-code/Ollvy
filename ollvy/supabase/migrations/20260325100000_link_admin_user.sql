-- Link admin_users to new auth user
-- Auth user ID: 2619ee80-2bb3-4d51-9d3b-500f5a8735f2
-- Email: soutikgangoli@ollvy.com

DO $$
DECLARE
  new_auth_user_id UUID := '2619ee80-2bb3-4d51-9d3b-500f5a8735f2';
  existing_admin_id UUID;
BEGIN
  -- Check if there's an existing admin_users record to update
  SELECT id INTO existing_admin_id
  FROM admin_users
  WHERE email = 'admin@ollvy.com' OR email = 'soutikgangoli@ollvy.com'
  LIMIT 1;

  IF existing_admin_id IS NOT NULL THEN
    -- Update existing admin user to link to new auth user
    UPDATE admin_users
    SET
      auth_user_id = new_auth_user_id,
      email = 'soutikgangoli@ollvy.com',
      name = 'Soutik Gangoli'
    WHERE id = existing_admin_id;
  ELSE
    -- Insert new admin user
    INSERT INTO admin_users (auth_user_id, name, email, role, is_active)
    VALUES (new_auth_user_id, 'Soutik Gangoli', 'soutikgangoli@ollvy.com', 'super_admin', true);
  END IF;
END $$;

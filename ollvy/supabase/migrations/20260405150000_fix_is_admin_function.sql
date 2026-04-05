-- Fix is_admin() function to check admin_users table instead of professionals
-- The previous implementation was checking professionals.id = auth.uid() which is incorrect
-- Admins are stored in admin_users table with auth_user_id column

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Add a comment explaining the function
COMMENT ON FUNCTION is_admin() IS 'Returns true if the current authenticated user is an admin (exists in admin_users table)';

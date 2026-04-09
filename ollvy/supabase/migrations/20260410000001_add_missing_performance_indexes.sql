-- Add missing indexes on columns used by RLS helper functions and FK joins
-- These are critical for avoiding full table scans on every RLS policy evaluation

-- professionals.auth_user_id: used by get_professional_id() on every professional RLS check
CREATE INDEX IF NOT EXISTS idx_professionals_auth_user_id
ON professionals(auth_user_id);

-- admin_users.auth_user_id: used by is_admin() on every admin RLS check
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id
ON admin_users(auth_user_id);

-- orders.service_package_id: FK used in joins on admin pages
CREATE INDEX IF NOT EXISTS idx_orders_service_package_id
ON orders(service_package_id);

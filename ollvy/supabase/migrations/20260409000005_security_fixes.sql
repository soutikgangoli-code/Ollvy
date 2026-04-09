-- Fix is_admin() to check is_active
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE auth_user_id = auth.uid()
    AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS on admin-only tables (all accessed via service_role, no breakage)
ALTER TABLE payment_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- retainer_subscriptions needs policies BEFORE enabling RLS
ALTER TABLE retainer_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_subscriptions"
ON retainer_subscriptions FOR SELECT
USING (user_id = get_user_id());

CREATE POLICY "service_role_full_access"
ON retainer_subscriptions FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "admin_full_access"
ON retainer_subscriptions FOR ALL
USING (is_admin());

-- work-documents bucket restrictions
UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  file_size_limit = 52428800
WHERE name = 'work-documents';

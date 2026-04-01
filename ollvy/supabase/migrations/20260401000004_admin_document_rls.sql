-- =============================================================================
-- Migration: Admin Document RLS Policies
-- Adds explicit RLS policies for admin users to access order_documents table
-- and order-documents/work-documents storage buckets
-- =============================================================================

-- =============================================================================
-- 1. Admin RLS for order_documents table
-- =============================================================================

-- Admin can view all order documents
CREATE POLICY "Admin can view all order documents"
  ON order_documents FOR SELECT
  USING (is_admin());

-- Admin can update all order documents
CREATE POLICY "Admin can update all order documents"
  ON order_documents FOR UPDATE
  USING (is_admin());

-- =============================================================================
-- 2. Admin RLS for order_work_documents table
-- =============================================================================

-- Admin can view all work documents
CREATE POLICY "Admin can view all work documents"
  ON order_work_documents FOR SELECT
  USING (is_admin());

-- Admin can update all work documents
CREATE POLICY "Admin can update all work documents"
  ON order_work_documents FOR UPDATE
  USING (is_admin());

-- Admin can insert work documents
CREATE POLICY "Admin can insert work documents"
  ON order_work_documents FOR INSERT
  WITH CHECK (is_admin());

-- =============================================================================
-- 3. Admin RLS for order-documents storage bucket
-- =============================================================================

-- Admin can read all order documents from storage
CREATE POLICY "order_documents_admin_read" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'order-documents' AND
    EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Admin can upload order documents to storage
CREATE POLICY "order_documents_admin_insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'order-documents' AND
    EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Admin can update order documents in storage
CREATE POLICY "order_documents_admin_update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'order-documents' AND
    EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Admin can delete order documents from storage
CREATE POLICY "order_documents_admin_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'order-documents' AND
    EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- =============================================================================
-- 4. Admin RLS for work-documents storage bucket
-- =============================================================================

-- Admin can read all work documents from storage
CREATE POLICY "work_documents_admin_read" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'work-documents' AND
    EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Admin can upload work documents to storage
CREATE POLICY "work_documents_admin_insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'work-documents' AND
    EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Admin can update work documents in storage
CREATE POLICY "work_documents_admin_update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'work-documents' AND
    EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Admin can delete work documents from storage
CREATE POLICY "work_documents_admin_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'work-documents' AND
    EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND is_active = true)
  );

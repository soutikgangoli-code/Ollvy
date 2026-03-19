-- =============================================================================
-- Migration: Add order-documents storage bucket
-- Creates storage bucket for order document uploads with RLS policies
-- =============================================================================

DO $$
BEGIN
  -- Create order-documents bucket (private)
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'order-documents',
    'order-documents',
    false,
    52428800, -- 50MB
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  )
  ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 52428800;

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Bucket may already exist or storage extension not enabled: %', SQLERRM;
END $$;

-- =============================================================================
-- RLS Policies for order-documents bucket
-- =============================================================================

-- Users can upload to their own order documents
DROP POLICY IF EXISTS "order_documents_user_insert" ON storage.objects;
CREATE POLICY "order_documents_user_insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'order-documents' AND
    EXISTS (
      SELECT 1 FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
      AND (storage.foldername(name))[1] = 'orders'
      AND (storage.foldername(name))[2] = o.id::text
    )
  );

-- Users can read their own order documents
DROP POLICY IF EXISTS "order_documents_user_read" ON storage.objects;
CREATE POLICY "order_documents_user_read" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'order-documents' AND
    (
      -- User's own order documents
      EXISTS (
        SELECT 1 FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE u.auth_user_id = auth.uid()
        AND (storage.foldername(name))[1] = 'orders'
        AND (storage.foldername(name))[2] = o.id::text
      )
      OR
      -- Professionals can read documents for their assigned orders
      EXISTS (
        SELECT 1 FROM orders o
        JOIN professionals p ON o.professional_id = p.id
        WHERE p.auth_user_id = auth.uid()
        AND (storage.foldername(name))[1] = 'orders'
        AND (storage.foldername(name))[2] = o.id::text
      )
    )
  );

-- Users can update (replace) their own order documents
DROP POLICY IF EXISTS "order_documents_user_update" ON storage.objects;
CREATE POLICY "order_documents_user_update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'order-documents' AND
    EXISTS (
      SELECT 1 FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
      AND (storage.foldername(name))[1] = 'orders'
      AND (storage.foldername(name))[2] = o.id::text
    )
  );

-- Users can delete their own order documents
DROP POLICY IF EXISTS "order_documents_user_delete" ON storage.objects;
CREATE POLICY "order_documents_user_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'order-documents' AND
    EXISTS (
      SELECT 1 FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
      AND (storage.foldername(name))[1] = 'orders'
      AND (storage.foldername(name))[2] = o.id::text
    )
  );

-- Professionals can upload documents for their assigned orders (deliverables)
DROP POLICY IF EXISTS "order_documents_professional_insert" ON storage.objects;
CREATE POLICY "order_documents_professional_insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'order-documents' AND
    EXISTS (
      SELECT 1 FROM orders o
      JOIN professionals p ON o.professional_id = p.id
      WHERE p.auth_user_id = auth.uid()
      AND (storage.foldername(name))[1] = 'orders'
      AND (storage.foldername(name))[2] = o.id::text
    )
  );

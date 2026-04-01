-- =============================================================================
-- Migration: Fix order-documents bucket configuration
-- Updates allowed MIME types to match what the UI accepts
-- Also recreates RLS policies using storage.foldername() pattern for reliability
-- =============================================================================

-- =============================================================================
-- 1. Create or update bucket with correct MIME types
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-documents',
  'order-documents',
  false,
  20971520, -- 20MB
  ARRAY[
    -- Images
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    -- Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    -- Archives
    'application/zip',
    'application/x-zip-compressed'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed'
  ],
  file_size_limit = 20971520;

-- =============================================================================
-- 2. Recreate RLS policies for order-documents bucket
-- Uses storage.foldername() pattern (same as work-documents which works reliably)
-- Path format: orders/{order_id}/documents/filename
-- foldername(name)[1] = 'orders', foldername(name)[2] = order_id
-- =============================================================================

-- Drop existing policies first
DROP POLICY IF EXISTS "order_documents_user_insert" ON storage.objects;
DROP POLICY IF EXISTS "order_documents_user_read" ON storage.objects;
DROP POLICY IF EXISTS "order_documents_user_update" ON storage.objects;
DROP POLICY IF EXISTS "order_documents_user_delete" ON storage.objects;
DROP POLICY IF EXISTS "order_documents_professional_insert" ON storage.objects;

-- Users can upload to their own order documents
CREATE POLICY "order_documents_user_insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'order-documents' AND
    (storage.foldername(name))[1] = 'orders' AND
    (storage.foldername(name))[2] IN (
      SELECT o.id::text FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
    )
  );

-- Users can read their own order documents
CREATE POLICY "order_documents_user_read" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'order-documents' AND
    (storage.foldername(name))[1] = 'orders' AND
    (
      -- User's own order documents
      (storage.foldername(name))[2] IN (
        SELECT o.id::text FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE u.auth_user_id = auth.uid()
      )
      OR
      -- Professionals can read documents for their assigned orders
      (storage.foldername(name))[2] IN (
        SELECT o.id::text FROM orders o
        JOIN professionals p ON o.professional_id = p.id
        WHERE p.auth_user_id = auth.uid()
      )
    )
  );

-- Users can update (replace) their own order documents
CREATE POLICY "order_documents_user_update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'order-documents' AND
    (storage.foldername(name))[1] = 'orders' AND
    (storage.foldername(name))[2] IN (
      SELECT o.id::text FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
    )
  );

-- Users can delete their own order documents
CREATE POLICY "order_documents_user_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'order-documents' AND
    (storage.foldername(name))[1] = 'orders' AND
    (storage.foldername(name))[2] IN (
      SELECT o.id::text FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
    )
  );

-- Professionals can upload documents for their assigned orders (deliverables)
CREATE POLICY "order_documents_professional_insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'order-documents' AND
    (storage.foldername(name))[1] = 'orders' AND
    (storage.foldername(name))[2] IN (
      SELECT o.id::text FROM orders o
      JOIN professionals p ON o.professional_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

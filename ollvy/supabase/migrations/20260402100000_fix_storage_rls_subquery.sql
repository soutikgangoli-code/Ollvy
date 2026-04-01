-- =============================================================================
-- Migration: Fix storage RLS policy subquery issue
-- The subquery inside storage policies is also subject to RLS on orders table,
-- which blocks the check. Solution: Use SECURITY DEFINER function.
-- =============================================================================

-- =============================================================================
-- 1. Create helper function that bypasses RLS to check order ownership
-- =============================================================================

CREATE OR REPLACE FUNCTION public.user_owns_order(order_id_text text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders o
    JOIN public.users u ON o.user_id = u.id
    WHERE o.id::text = order_id_text
    AND u.auth_user_id = auth.uid()
  )
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.user_owns_order(text) TO authenticated;

-- =============================================================================
-- 2. Create helper function for professional access
-- =============================================================================

CREATE OR REPLACE FUNCTION public.professional_has_order(order_id_text text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders o
    JOIN public.professionals p ON o.professional_id = p.id
    WHERE o.id::text = order_id_text
    AND p.auth_user_id = auth.uid()
  )
$$;

GRANT EXECUTE ON FUNCTION public.professional_has_order(text) TO authenticated;

-- =============================================================================
-- 3. Recreate order-documents policies using helper functions
-- =============================================================================

-- Drop existing policies
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
    public.user_owns_order((storage.foldername(name))[2])
  );

-- Users can read their own order documents (or professionals for assigned orders)
CREATE POLICY "order_documents_user_read" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'order-documents' AND
    (storage.foldername(name))[1] = 'orders' AND
    (
      public.user_owns_order((storage.foldername(name))[2])
      OR
      public.professional_has_order((storage.foldername(name))[2])
    )
  );

-- Users can update (replace) their own order documents
CREATE POLICY "order_documents_user_update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'order-documents' AND
    (storage.foldername(name))[1] = 'orders' AND
    public.user_owns_order((storage.foldername(name))[2])
  );

-- Users can delete their own order documents
CREATE POLICY "order_documents_user_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'order-documents' AND
    (storage.foldername(name))[1] = 'orders' AND
    public.user_owns_order((storage.foldername(name))[2])
  );

-- Professionals can upload documents for their assigned orders
CREATE POLICY "order_documents_professional_insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'order-documents' AND
    (storage.foldername(name))[1] = 'orders' AND
    public.professional_has_order((storage.foldername(name))[2])
  );

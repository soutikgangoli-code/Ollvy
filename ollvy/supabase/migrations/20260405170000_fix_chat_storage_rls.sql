-- Fix storage RLS for chat attachments
-- Chat uploads use path: {conversationId}/{timestamp}-{filename}
-- Need policies that check if user has access to the conversation

-- =============================================================================
-- 1. Chat attachment INSERT policy for customers
-- =============================================================================
DROP POLICY IF EXISTS "documents_chat_insert" ON storage.objects;
CREATE POLICY "documents_chat_insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM chat_conversations cc
      WHERE cc.id::text = (storage.foldername(name))[1]
      AND cc.user_id = get_user_id()
    )
  );

-- =============================================================================
-- 2. Chat attachment SELECT policy for customers
-- =============================================================================
DROP POLICY IF EXISTS "documents_chat_select" ON storage.objects;
CREATE POLICY "documents_chat_select" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM chat_conversations cc
      WHERE cc.id::text = (storage.foldername(name))[1]
      AND cc.user_id = get_user_id()
    )
  );

-- =============================================================================
-- 3. Admin storage policies (full access to documents bucket)
-- =============================================================================
DROP POLICY IF EXISTS "documents_admin_select" ON storage.objects;
CREATE POLICY "documents_admin_select" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents' AND is_admin());

DROP POLICY IF EXISTS "documents_admin_insert" ON storage.objects;
CREATE POLICY "documents_admin_insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents' AND is_admin());

DROP POLICY IF EXISTS "documents_admin_update" ON storage.objects;
CREATE POLICY "documents_admin_update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'documents' AND is_admin());

DROP POLICY IF EXISTS "documents_admin_delete" ON storage.objects;
CREATE POLICY "documents_admin_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'documents' AND is_admin());

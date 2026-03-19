-- =============================================================================
-- Migration: Work Documents Schema
-- Adds table for documents exchanged during the work process
-- (deliverables from professional, additional requests from professional)
-- =============================================================================

-- =============================================================================
-- 1. Create document direction type
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_document_direction') THEN
    CREATE TYPE work_document_direction AS ENUM (
      'to_customer',    -- Professional delivers document to customer
      'from_customer'   -- Professional requests document from customer
    );
  END IF;
END $$;

-- =============================================================================
-- 2. Create work document status type
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_document_status') THEN
    CREATE TYPE work_document_status AS ENUM (
      'pending',        -- Waiting for upload (for from_customer)
      'uploaded',       -- File uploaded
      'verified',       -- Professional verified the document
      'rejected'        -- Professional rejected, needs re-upload
    );
  END IF;
END $$;

-- =============================================================================
-- 3. order_work_documents - Documents exchanged during work process
-- =============================================================================

CREATE TABLE IF NOT EXISTS order_work_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
  direction work_document_direction NOT NULL,
  document_label TEXT NOT NULL,           -- 'GST Certificate', 'Additional PAN Copy', etc.
  description TEXT,                       -- Instructions or notes
  stage_key TEXT,                         -- Which workflow stage this belongs to
  status work_document_status NOT NULL DEFAULT 'pending',
  file_url TEXT,
  file_name TEXT,
  due_date DATE,                          -- For from_customer requests
  uploaded_at TIMESTAMPTZ,
  uploaded_by_type TEXT,                  -- 'professional' or 'customer'
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES professionals(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_order_work_documents_order_id ON order_work_documents(order_id);
CREATE INDEX IF NOT EXISTS idx_order_work_documents_professional_id ON order_work_documents(professional_id);
CREATE INDEX IF NOT EXISTS idx_order_work_documents_direction ON order_work_documents(direction);
CREATE INDEX IF NOT EXISTS idx_order_work_documents_status ON order_work_documents(status);

-- =============================================================================
-- 4. Enable RLS
-- =============================================================================

ALTER TABLE order_work_documents ENABLE ROW LEVEL SECURITY;

-- Users can view work documents for their orders
CREATE POLICY "Users can view own order work documents"
  ON order_work_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_work_documents.order_id
      AND o.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Users can update work documents (upload files) for their orders
CREATE POLICY "Users can update own order work documents"
  ON order_work_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_work_documents.order_id
      AND o.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Professionals can view work documents for assigned orders
CREATE POLICY "Professionals can view assigned order work documents"
  ON order_work_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_work_documents.order_id
      AND o.professional_id = (SELECT id FROM professionals WHERE auth_user_id = auth.uid())
    )
  );

-- Professionals can insert work documents for assigned orders
CREATE POLICY "Professionals can insert work documents for assigned orders"
  ON order_work_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_work_documents.order_id
      AND o.professional_id = (SELECT id FROM professionals WHERE auth_user_id = auth.uid())
    )
  );

-- Professionals can update work documents for assigned orders
CREATE POLICY "Professionals can update assigned order work documents"
  ON order_work_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_work_documents.order_id
      AND o.professional_id = (SELECT id FROM professionals WHERE auth_user_id = auth.uid())
    )
  );

-- =============================================================================
-- 5. Updated at trigger
-- =============================================================================

CREATE TRIGGER update_order_work_documents_updated_at
  BEFORE UPDATE ON order_work_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 6. Create storage bucket for work documents
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('work-documents', 'work-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for work documents bucket
CREATE POLICY "Users can upload work documents for their orders"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'work-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT o.id::text FROM orders o
    WHERE o.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  )
);

CREATE POLICY "Users can view work documents for their orders"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'work-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT o.id::text FROM orders o
    WHERE o.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  )
);

CREATE POLICY "Professionals can upload work documents for assigned orders"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'work-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT o.id::text FROM orders o
    WHERE o.professional_id = (SELECT id FROM professionals WHERE auth_user_id = auth.uid())
  )
);

CREATE POLICY "Professionals can view work documents for assigned orders"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'work-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT o.id::text FROM orders o
    WHERE o.professional_id = (SELECT id FROM professionals WHERE auth_user_id = auth.uid())
  )
);

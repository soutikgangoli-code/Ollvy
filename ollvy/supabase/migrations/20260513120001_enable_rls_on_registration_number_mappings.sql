-- Enable RLS on registration_number_mappings.
--
-- This table is a read-only lookup that maps deliverable document types
-- (e.g. 'gst_certificate') to user-profile fields (e.g. 'gstin'). It powers
-- the in-DB trigger sync_registration_number_to_user (defined in
-- 20260320900021_add_cin_and_auto_sync_registrations.sql) which auto-fills
-- users.gstin / users.cin / users.din when a professional uploads a
-- registration document with the extracted number.
--
-- The Supabase advisor flagged this table as critical: RLS is disabled
-- while GRANT SELECT TO authenticated exists, so any anon-or-authenticated
-- caller reaches the table without policy gating. The data itself is
-- low-sensitivity (public-domain mapping with English descriptions), but
-- the posture is wrong.
--
-- This migration:
--   1. Enables RLS on the table.
--   2. Adds a single SELECT policy USING (true) so the existing read
--      behaviour is preserved verbatim — the trigger (which runs as
--      SECURITY DEFINER / service_role) keeps working, and any future
--      authenticated client read keeps working.
--   3. Adds no INSERT / UPDATE / DELETE policies. service_role bypasses
--      RLS, so the trigger logic that touches users.gstin etc still
--      functions; no other role should ever write to this table.
--
-- Safe to re-run: RLS enable is idempotent at the catalog level, and the
-- policy is guarded by a pg_policies existence check.

ALTER TABLE registration_number_mappings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'registration_number_mappings'
      AND policyname = 'registration_number_mappings_read_all'
  ) THEN
    CREATE POLICY registration_number_mappings_read_all
      ON registration_number_mappings
      FOR SELECT
      USING (true);
  END IF;
END $$;

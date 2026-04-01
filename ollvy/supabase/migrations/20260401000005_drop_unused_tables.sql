-- Drop truly unused tables
-- These tables have no references in the codebase (app or edge functions)
-- Audit date: 2026-04-01

-- 1. professional_waitlist - Legacy table, replaced by professional_applications
DROP TABLE IF EXISTS professional_waitlist CASCADE;

-- 2. professional_education - Never used, no .from() calls anywhere
DROP TABLE IF EXISTS professional_education CASCADE;

-- 3. capacity_alerts - Never used, no .from() calls anywhere
DROP TABLE IF EXISTS capacity_alerts CASCADE;

-- 4. user_service_recommendations - Only exists in a code comment, never inserted
DROP TABLE IF EXISTS user_service_recommendations CASCADE;

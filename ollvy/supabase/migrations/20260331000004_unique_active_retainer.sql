-- Migration: Unique Active Retainer Index
-- Purpose: Fix race condition allowing duplicate active subscriptions
-- Related Issue: #7 - Concurrent Retainer Creation

-- Create partial unique index to prevent duplicate active retainers
-- This enforces at the database level that a user can only have one
-- active/onboarding/paused retainer per service package
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_retainer
ON retainer_subscriptions (user_id, service_package_id)
WHERE status IN ('onboarding', 'active', 'paused');

-- Add comment for documentation
COMMENT ON INDEX idx_unique_active_retainer IS
'Prevents duplicate active retainer subscriptions per user per service.
This is a partial unique index that only applies when status is
onboarding, active, or paused. Cancelled subscriptions do not conflict.';

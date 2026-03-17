-- Ollvy RLS Policies
-- 002_rls_policies.sql
-- Enable RLS for all tables and define access policies
-- Service role bypasses all RLS

-- =============================================================================
-- ENABLE RLS FOR ALL TABLES
-- =============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_filter_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_tier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_state_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE retainer_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_obligation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sla_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacity_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_service_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE retainer_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_credits ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Get user_id for current auth user
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Get professional_id for current auth user
CREATE OR REPLACE FUNCTION get_professional_id()
RETURNS UUID AS $$
  SELECT id FROM professionals WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- =============================================================================
-- users
-- =============================================================================

-- Users can read and update their own row
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY users_insert ON users
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

-- =============================================================================
-- professionals
-- =============================================================================

-- Professionals can read and update their own row
CREATE POLICY professionals_select_own ON professionals
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY professionals_update_own ON professionals
  FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY professionals_insert ON professionals
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

-- =============================================================================
-- professional_education
-- =============================================================================

CREATE POLICY professional_education_select ON professional_education
  FOR SELECT USING (professional_id = get_professional_id());

CREATE POLICY professional_education_insert ON professional_education
  FOR INSERT WITH CHECK (professional_id = get_professional_id());

CREATE POLICY professional_education_update ON professional_education
  FOR UPDATE USING (professional_id = get_professional_id());

CREATE POLICY professional_education_delete ON professional_education
  FOR DELETE USING (professional_id = get_professional_id());

-- =============================================================================
-- professional_certifications
-- =============================================================================

CREATE POLICY professional_certifications_select ON professional_certifications
  FOR SELECT USING (professional_id = get_professional_id());

CREATE POLICY professional_certifications_insert ON professional_certifications
  FOR INSERT WITH CHECK (professional_id = get_professional_id());

CREATE POLICY professional_certifications_update ON professional_certifications
  FOR UPDATE USING (professional_id = get_professional_id());

-- =============================================================================
-- professional_bank_accounts
-- =============================================================================

CREATE POLICY professional_bank_accounts_select ON professional_bank_accounts
  FOR SELECT USING (professional_id = get_professional_id());

CREATE POLICY professional_bank_accounts_insert ON professional_bank_accounts
  FOR INSERT WITH CHECK (professional_id = get_professional_id());

CREATE POLICY professional_bank_accounts_update ON professional_bank_accounts
  FOR UPDATE USING (professional_id = get_professional_id());

-- =============================================================================
-- professional_waitlist (public insert for pre-launch signups)
-- =============================================================================

CREATE POLICY professional_waitlist_insert ON professional_waitlist
  FOR INSERT WITH CHECK (true);

-- =============================================================================
-- professional_availability
-- =============================================================================

CREATE POLICY professional_availability_select ON professional_availability
  FOR SELECT USING (professional_id = get_professional_id());

CREATE POLICY professional_availability_update ON professional_availability
  FOR UPDATE USING (professional_id = get_professional_id());

-- =============================================================================
-- admin_users (service_role only)
-- =============================================================================

-- No public policies - service_role only

-- =============================================================================
-- admin_audit_log (service_role only, not deletable)
-- =============================================================================

-- No public policies - service_role only

-- =============================================================================
-- app_settings (public read, admin write via service_role)
-- =============================================================================

CREATE POLICY app_settings_select ON app_settings
  FOR SELECT USING (true);

-- =============================================================================
-- service_filter_categories (public read)
-- =============================================================================

CREATE POLICY service_filter_categories_select ON service_filter_categories
  FOR SELECT USING (true);

-- =============================================================================
-- service_tier_groups (public read)
-- =============================================================================

CREATE POLICY service_tier_groups_select ON service_tier_groups
  FOR SELECT USING (true);

-- =============================================================================
-- service_packages (public read for active packages)
-- =============================================================================

CREATE POLICY service_packages_select ON service_packages
  FOR SELECT USING (true);

-- =============================================================================
-- service_state_pricing (public read)
-- =============================================================================

CREATE POLICY service_state_pricing_select ON service_state_pricing
  FOR SELECT USING (true);

-- =============================================================================
-- orders
-- =============================================================================

-- Users can see their own orders
CREATE POLICY orders_user_select ON orders
  FOR SELECT USING (user_id = get_user_id());

-- Professionals can see their assigned orders
CREATE POLICY orders_professional_select ON orders
  FOR SELECT USING (professional_id = get_professional_id());

-- =============================================================================
-- order_stage_history
-- =============================================================================

-- Users can see stage history for their orders
CREATE POLICY order_stage_history_user_select ON order_stage_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_stage_history.order_id
      AND o.user_id = get_user_id()
    )
  );

-- Professionals can see stage history for their assigned orders
CREATE POLICY order_stage_history_professional_select ON order_stage_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_stage_history.order_id
      AND o.professional_id = get_professional_id()
    )
  );

-- =============================================================================
-- order_waitlist (service_role only)
-- =============================================================================

-- No public policies - managed by service_role

-- =============================================================================
-- retainer_subscriptions
-- =============================================================================

-- Users can see their own retainer subscriptions
CREATE POLICY retainer_subscriptions_user_select ON retainer_subscriptions
  FOR SELECT USING (user_id = get_user_id());

-- Professionals can see retainer subscriptions they are assigned to
CREATE POLICY retainer_subscriptions_professional_select ON retainer_subscriptions
  FOR SELECT USING (assigned_professional_id = get_professional_id());

-- =============================================================================
-- invoices (via signed URL only - no direct read)
-- =============================================================================

-- Users can see their own invoices (for listing)
CREATE POLICY invoices_user_select ON invoices
  FOR SELECT USING (user_id = get_user_id());

-- =============================================================================
-- documents
-- =============================================================================

-- Users can see documents for their orders (visible_to_user = true)
CREATE POLICY documents_user_select ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = documents.order_id
      AND o.user_id = get_user_id()
    )
    AND visible_to_user = true
  );

-- Users can insert required_input documents for their orders
CREATE POLICY documents_user_insert ON documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = documents.order_id
      AND o.user_id = get_user_id()
    )
    AND document_type = 'required_input'
  );

-- Professionals can see all documents for their assigned orders
CREATE POLICY documents_professional_select ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = documents.order_id
      AND o.professional_id = get_professional_id()
    )
  );

-- Professionals can insert deliverable documents for their assigned orders
CREATE POLICY documents_professional_insert ON documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = documents.order_id
      AND o.professional_id = get_professional_id()
    )
    AND document_type = 'professional_deliverable'
  );

-- =============================================================================
-- document_requests
-- =============================================================================

-- Users can see document requests for their orders
CREATE POLICY document_requests_user_select ON document_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = document_requests.order_id
      AND o.user_id = get_user_id()
    )
  );

-- Professionals can see/create/update document requests for their assigned orders
CREATE POLICY document_requests_professional_select ON document_requests
  FOR SELECT USING (professional_id = get_professional_id());

CREATE POLICY document_requests_professional_insert ON document_requests
  FOR INSERT WITH CHECK (professional_id = get_professional_id());

CREATE POLICY document_requests_professional_update ON document_requests
  FOR UPDATE USING (professional_id = get_professional_id());

-- =============================================================================
-- chat_conversations
-- =============================================================================

-- Users can see chat conversations for their orders/retainers
CREATE POLICY chat_conversations_user_select ON chat_conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = chat_conversations.order_id
      AND o.user_id = get_user_id()
    )
    OR EXISTS (
      SELECT 1 FROM retainer_subscriptions rs
      WHERE rs.id = chat_conversations.retainer_subscription_id
      AND rs.user_id = get_user_id()
    )
  );

-- Professionals can see chat conversations for their assigned orders/retainers
CREATE POLICY chat_conversations_professional_select ON chat_conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = chat_conversations.order_id
      AND o.professional_id = get_professional_id()
    )
    OR EXISTS (
      SELECT 1 FROM retainer_subscriptions rs
      WHERE rs.id = chat_conversations.retainer_subscription_id
      AND rs.assigned_professional_id = get_professional_id()
    )
  );

-- =============================================================================
-- chat_messages
-- =============================================================================

-- Users can see messages in their conversations
CREATE POLICY chat_messages_user_select ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_conversations cc
      JOIN orders o ON o.id = cc.order_id
      WHERE cc.id = chat_messages.conversation_id
      AND o.user_id = get_user_id()
    )
    OR EXISTS (
      SELECT 1 FROM chat_conversations cc
      JOIN retainer_subscriptions rs ON rs.id = cc.retainer_subscription_id
      WHERE cc.id = chat_messages.conversation_id
      AND rs.user_id = get_user_id()
    )
  );

-- Users can send messages
CREATE POLICY chat_messages_user_insert ON chat_messages
  FOR INSERT WITH CHECK (
    sender_type = 'user'
    AND sender_id = get_user_id()
    AND (
      EXISTS (
        SELECT 1 FROM chat_conversations cc
        JOIN orders o ON o.id = cc.order_id
        WHERE cc.id = chat_messages.conversation_id
        AND o.user_id = get_user_id()
      )
      OR EXISTS (
        SELECT 1 FROM chat_conversations cc
        JOIN retainer_subscriptions rs ON rs.id = cc.retainer_subscription_id
        WHERE cc.id = chat_messages.conversation_id
        AND rs.user_id = get_user_id()
      )
    )
  );

-- Professionals can see messages in their conversations
CREATE POLICY chat_messages_professional_select ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_conversations cc
      JOIN orders o ON o.id = cc.order_id
      WHERE cc.id = chat_messages.conversation_id
      AND o.professional_id = get_professional_id()
    )
    OR EXISTS (
      SELECT 1 FROM chat_conversations cc
      JOIN retainer_subscriptions rs ON rs.id = cc.retainer_subscription_id
      WHERE cc.id = chat_messages.conversation_id
      AND rs.assigned_professional_id = get_professional_id()
    )
  );

-- Professionals can send messages
CREATE POLICY chat_messages_professional_insert ON chat_messages
  FOR INSERT WITH CHECK (
    sender_type = 'professional'
    AND sender_id = get_professional_id()
    AND (
      EXISTS (
        SELECT 1 FROM chat_conversations cc
        JOIN orders o ON o.id = cc.order_id
        WHERE cc.id = chat_messages.conversation_id
        AND o.professional_id = get_professional_id()
      )
      OR EXISTS (
        SELECT 1 FROM chat_conversations cc
        JOIN retainer_subscriptions rs ON rs.id = cc.retainer_subscription_id
        WHERE cc.id = chat_messages.conversation_id
        AND rs.assigned_professional_id = get_professional_id()
      )
    )
  );

-- =============================================================================
-- payouts
-- =============================================================================

-- Professionals can see their own payouts
CREATE POLICY payouts_professional_select ON payouts
  FOR SELECT USING (professional_id = get_professional_id());

-- =============================================================================
-- disputes
-- =============================================================================

-- Users can see disputes they raised
CREATE POLICY disputes_user_select ON disputes
  FOR SELECT USING (raised_by_user_id = get_user_id());

-- Users can create disputes for their orders
CREATE POLICY disputes_user_insert ON disputes
  FOR INSERT WITH CHECK (
    raised_by_user_id = get_user_id()
    AND EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = disputes.order_id
      AND o.user_id = get_user_id()
    )
  );

-- =============================================================================
-- quote_requests
-- =============================================================================

-- Users can see their own quote requests
CREATE POLICY quote_requests_user_select ON quote_requests
  FOR SELECT USING (user_id = get_user_id());

-- Users can create quote requests
CREATE POLICY quote_requests_user_insert ON quote_requests
  FOR INSERT WITH CHECK (user_id = get_user_id());

-- =============================================================================
-- promo_codes (public read for validation)
-- =============================================================================

CREATE POLICY promo_codes_select ON promo_codes
  FOR SELECT USING (is_active = true);

-- =============================================================================
-- feedback
-- =============================================================================

-- Users can see and create their own feedback
CREATE POLICY feedback_user_select ON feedback
  FOR SELECT USING (user_id = get_user_id());

CREATE POLICY feedback_user_insert ON feedback
  FOR INSERT WITH CHECK (user_id = get_user_id());

-- =============================================================================
-- notifications
-- =============================================================================

-- Users can see their own notifications
CREATE POLICY notifications_user_select ON notifications
  FOR SELECT USING (user_id = get_user_id());

-- Users can update their own notifications (mark read)
CREATE POLICY notifications_user_update ON notifications
  FOR UPDATE USING (user_id = get_user_id());

-- Professionals can see their own notifications
CREATE POLICY notifications_professional_select ON notifications
  FOR SELECT USING (professional_id = get_professional_id());

-- Professionals can update their own notifications (mark read)
CREATE POLICY notifications_professional_update ON notifications
  FOR UPDATE USING (professional_id = get_professional_id());

-- =============================================================================
-- compliance_obligation_rules (public read)
-- =============================================================================

CREATE POLICY compliance_obligation_rules_select ON compliance_obligation_rules
  FOR SELECT USING (is_active = true);

-- =============================================================================
-- compliance_obligations
-- =============================================================================

-- Users can see their own compliance obligations
CREATE POLICY compliance_obligations_user_select ON compliance_obligations
  FOR SELECT USING (user_id = get_user_id());

-- Users can update their own obligations (snooze)
CREATE POLICY compliance_obligations_user_update ON compliance_obligations
  FOR UPDATE USING (user_id = get_user_id());

-- =============================================================================
-- admin_notifications (service_role only)
-- =============================================================================

-- No public policies - service_role only

-- =============================================================================
-- sla_alerts (service_role only)
-- =============================================================================

-- No public policies - service_role only

-- =============================================================================
-- capacity_alerts (service_role only)
-- =============================================================================

-- No public policies - service_role only

-- =============================================================================
-- user_service_recommendations
-- =============================================================================

-- Users can see their own recommendations
CREATE POLICY user_service_recommendations_user_select ON user_service_recommendations
  FOR SELECT USING (user_id = get_user_id());

-- =============================================================================
-- otp_rate_limits (service_role only)
-- =============================================================================

-- No public policies - service_role only

-- =============================================================================
-- retainer_digests
-- =============================================================================

-- Users can see their own digests
CREATE POLICY retainer_digests_user_select ON retainer_digests
  FOR SELECT USING (user_id = get_user_id());

-- =============================================================================
-- fraud_review_queue (service_role only)
-- =============================================================================

-- No public policies - service_role only

-- =============================================================================
-- professional_applications (public insert for applications)
-- =============================================================================

CREATE POLICY professional_applications_insert ON professional_applications
  FOR INSERT WITH CHECK (true);

-- Applicants can view their own application by phone
CREATE POLICY professional_applications_select_own ON professional_applications
  FOR SELECT USING (
    phone = (SELECT phone FROM professionals WHERE auth_user_id = auth.uid() LIMIT 1)
  );

-- =============================================================================
-- processed_webhook_events (service_role only)
-- =============================================================================

-- No public policies - service_role only

-- =============================================================================
-- analytics_cache (service_role only)
-- =============================================================================

-- No public policies - service_role only

-- =============================================================================
-- referrals
-- =============================================================================

-- Users can see referrals they made
CREATE POLICY referrals_referrer_select ON referrals
  FOR SELECT USING (referrer_user_id = get_user_id());

-- Users can see when they were referred
CREATE POLICY referrals_referee_select ON referrals
  FOR SELECT USING (referee_user_id = get_user_id());

-- =============================================================================
-- referral_credits
-- =============================================================================

-- Users can see their own referral credits
CREATE POLICY referral_credits_user_select ON referral_credits
  FOR SELECT USING (referrer_user_id = get_user_id());

-- =============================================================================
-- STORAGE BUCKET POLICIES
-- =============================================================================

-- Note: These policies are created via Supabase dashboard or CLI
-- Included here for reference

-- /avatars bucket - Public read, user write to own path
-- INSERT: auth.uid() matches path prefix (avatars/{user_id}/)
-- SELECT: true (public)
-- UPDATE: auth.uid() matches path prefix
-- DELETE: auth.uid() matches path prefix

-- /documents bucket - Order owner, assigned professional, or admin
-- SELECT: user is order owner OR professional is assigned OR admin
-- INSERT: user uploads required_input OR professional uploads deliverable
-- UPDATE: admin only
-- DELETE: admin only (documents immutable for audit)

-- /certifications bucket - Professional own certs or admin
-- SELECT: professional owns cert OR admin
-- INSERT: professional uploads to certifications/{professional_id}/
-- UPDATE: admin only (after verification)
-- DELETE: admin only

-- /invoices bucket - Never direct access, signed URL only
-- SELECT: never (use get-invoice-url edge function)
-- INSERT: service_role only (generate-invoice function)
-- UPDATE: service_role only
-- DELETE: service_role only (invoices immutable)

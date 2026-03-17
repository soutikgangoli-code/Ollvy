-- Ollvy Database Schema
-- 001_initial_schema.sql
-- All tables from §4, indexes, and triggers
-- All monetary values stored as INT (paisa)

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE profession_type AS ENUM (
  'ca',
  'lawyer',
  'cs',
  'licensing_consultant',
  'payroll_specialist',
  'registered_valuer'
);

CREATE TYPE professional_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'suspended'
);

CREATE TYPE admin_role AS ENUM (
  'super_admin',
  'ops_admin',
  'finance_admin'
);

CREATE TYPE order_type AS ENUM (
  'one_time',
  'recurring'
);

CREATE TYPE order_status AS ENUM (
  'pending_assignment',
  'waitlisted',
  'in_progress',
  'completed',
  'disputed',
  'cancelled'
);

CREATE TYPE subscription_tier AS ENUM (
  'free',
  'pro'
);

CREATE TYPE retainer_status AS ENUM (
  'onboarding',
  'active',
  'paused',
  'cancelled',
  'payment_failed'
);

CREATE TYPE billing_cycle AS ENUM (
  'monthly',
  'quarterly',
  'annual',
  'one_time'
);

CREATE TYPE document_type AS ENUM (
  'required_input',
  'professional_deliverable',
  'admin_upload'
);

CREATE TYPE chat_sender_type AS ENUM (
  'user',
  'professional',
  'system'
);

CREATE TYPE payout_status AS ENUM (
  'pending',
  'held',
  'paid',
  'failed'
);

CREATE TYPE dispute_status AS ENUM (
  'open',
  'admin_reviewing',
  'resolved_refund',
  'resolved_no_refund',
  'resolved_partial',
  'appealed',
  'appeal_resolved'
);

CREATE TYPE quote_status AS ENUM (
  'pending',
  'quoted',
  'accepted',
  'expired'
);

CREATE TYPE discount_type AS ENUM (
  'percent',
  'flat_paisa'
);

CREATE TYPE promo_applicable_to AS ENUM (
  'one_time_only',
  'first_retainer_month',
  'both'
);

CREATE TYPE compliance_status AS ENUM (
  'upcoming',
  'due_soon',
  'overdue',
  'completed',
  'snoozed',
  'covered_by_retainer',
  'pending_info',
  'not_applicable'
);

CREATE TYPE recurrence AS ENUM (
  'monthly',
  'quarterly',
  'half_yearly',
  'annual',
  'one_time',
  'every_10_years'
);

CREATE TYPE business_type AS ENUM (
  'sole_proprietorship',
  'partnership',
  'pvt_ltd',
  'llp',
  'opc',
  'not_registered'
);

CREATE TYPE fraud_type AS ENUM (
  'promo_abuse',
  'self_referral',
  'payment_fraud',
  'document_fraud',
  'suspicious_activity'
);

CREATE TYPE fraud_status AS ENUM (
  'pending',
  'reviewed',
  'dismissed',
  'actioned'
);

CREATE TYPE referral_status AS ENUM (
  'pending',
  'credited',
  'expired'
);

CREATE TYPE referral_credit_type AS ENUM (
  'earned',
  'redemption',
  'expiry',
  'reversal'
);

CREATE TYPE referral_credit_status AS ENUM (
  'pending',
  'available',
  'redeemed',
  'expired'
);

CREATE TYPE pro_plan_type AS ENUM (
  'monthly',
  'annual'
);

CREATE TYPE govt_fee_reimbursement_status AS ENUM (
  'auto_approved',
  'pending_review',
  'approved',
  'rejected'
);

CREATE TYPE professional_application_status AS ENUM (
  'submitted',
  'approved',
  'rejected',
  'withdrawn'
);

CREATE TYPE digest_compliance_status AS ENUM (
  'on_track',
  'at_risk',
  'overdue'
);

-- =============================================================================
-- 1. users - Business owners
-- =============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  business_name TEXT,
  business_type business_type,
  state TEXT,
  city TEXT,
  incorporation_date DATE,
  gst_registered BOOLEAN DEFAULT false,
  has_employees BOOLEAN DEFAULT false,
  subscription_tier subscription_tier DEFAULT 'free',
  pro_subscription_razorpay_id TEXT,
  pro_plan_type pro_plan_type,
  compliance_health_score INT DEFAULT 0,
  profile_completeness_score INT DEFAULT 0,
  pro_grace_start TIMESTAMPTZ,
  preferred_professional_id UUID,
  fcm_token TEXT,
  is_returning BOOLEAN DEFAULT false,
  avatar_url TEXT,
  referral_code TEXT UNIQUE,
  referral_code_used TEXT,
  referral_credit_balance_paisa INT DEFAULT 0,
  referral_credit_30d_count INT DEFAULT 0,
  public_profile_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 2. professionals - CAs, Lawyers, CS, Licensing Consultants, Payroll Specialists
-- =============================================================================

CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profession_type profession_type NOT NULL,
  bio TEXT,
  experience_years INT,
  languages TEXT[] DEFAULT '{}',
  service_areas UUID[] DEFAULT '{}',
  status professional_status DEFAULT 'pending',
  strike_count INT DEFAULT 0,
  last_assigned_at TIMESTAMPTZ,
  fcm_token TEXT,
  web_push_subscription JSONB,
  pending_payout_paisa INT DEFAULT 0,
  rejection_reason TEXT,
  rejection_reason_code TEXT,
  rejected_at TIMESTAMPTZ,
  reapply_after_date DATE,
  reapplication_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 3. professional_education - Degrees
-- =============================================================================

CREATE TABLE professional_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE SET NULL,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  year INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 4. professional_certifications - Credentials
-- =============================================================================

CREATE TABLE professional_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  issuing_body TEXT NOT NULL,
  membership_number TEXT,
  year INT,
  expiry_date DATE,
  document_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 5. professional_bank_accounts - Payout destination
-- =============================================================================

CREATE TABLE professional_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID UNIQUE NOT NULL REFERENCES professionals(id) ON DELETE SET NULL,
  account_holder_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  razorpay_contact_id TEXT,
  razorpay_fund_account_id TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 6. professional_waitlist - Pre-launch supply
-- =============================================================================

CREATE TABLE professional_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  profession_type profession_type NOT NULL,
  city TEXT NOT NULL,
  years_experience INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 7. professional_availability - Capacity + leave
-- =============================================================================

CREATE TABLE professional_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE SET NULL,
  city TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  max_concurrent_orders INT DEFAULT 3,
  current_active_orders INT DEFAULT 0,
  on_leave_until DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 8. admin_users - Admin panel users
-- =============================================================================

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role admin_role NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 9. admin_audit_log - Admin action audit trail
-- =============================================================================

CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  notes TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 10. app_settings - Admin-configurable settings
-- =============================================================================

CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

-- =============================================================================
-- 11. service_filter_categories - Filter buckets
-- =============================================================================

CREATE TABLE service_filter_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_name TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 12. service_tier_groups - Links tiered packages
-- =============================================================================

CREATE TABLE service_tier_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 13. service_packages - Full catalogue
-- =============================================================================

CREATE TABLE service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT,
  filter_category_id UUID REFERENCES service_filter_categories(id) ON DELETE SET NULL,
  tier_group_id UUID REFERENCES service_tier_groups(id) ON DELETE SET NULL,
  tier_label TEXT,
  order_type order_type NOT NULL DEFAULT 'one_time',
  billing_cycle billing_cycle DEFAULT 'one_time',
  price_base_paisa INT NOT NULL,
  price_govt_fees_paisa INT DEFAULT 0,
  price_gst_rate INT DEFAULT 18,
  price_display_note TEXT,
  price_varies_by_state BOOLEAN DEFAULT false,
  sla_working_days INT DEFAULT 7,
  situation_tags TEXT[] DEFAULT '{}',
  workflow_stages JSONB DEFAULT '[]',
  urgency_score INT DEFAULT 50,
  avg_rating NUMERIC(3,2),
  rating_count INT DEFAULT 0,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT false,
  scope_included TEXT[] DEFAULT '{}',
  scope_excluded TEXT[] DEFAULT '{}',
  scope_ready BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 14. service_state_pricing - State-specific price overrides
-- =============================================================================

CREATE TABLE service_state_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE CASCADE,
  state TEXT NOT NULL,
  price_base_paisa INT NOT NULL,
  price_govt_fees_paisa INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(service_package_id, state)
);

-- =============================================================================
-- 15. chat_conversations - One per order OR one per retainer
-- =============================================================================

CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID,
  retainer_subscription_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chat_conversation_one_required CHECK (
    (order_id IS NOT NULL) OR (retainer_subscription_id IS NOT NULL)
  )
);

-- =============================================================================
-- 16. orders - Every order instance
-- =============================================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
  service_package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE SET NULL,
  retainer_subscription_id UUID,
  chat_conversation_id UUID REFERENCES chat_conversations(id) ON DELETE SET NULL,
  order_type order_type NOT NULL,
  status order_status NOT NULL DEFAULT 'pending_assignment',
  city TEXT,
  price_base_paisa_snapshot INT NOT NULL,
  price_govt_fees_paisa_snapshot INT DEFAULT 0,
  price_gst_paisa_snapshot INT NOT NULL,
  pro_discount_paisa_snapshot INT DEFAULT 0,
  promo_discount_paisa_snapshot INT DEFAULT 0,
  total_paisa_snapshot INT NOT NULL,
  payment_paused BOOLEAN DEFAULT false,
  force_assigned BOOLEAN DEFAULT false,
  price_source TEXT DEFAULT 'base',
  govt_fees_paid_paisa INT,
  govt_fee_receipt_path TEXT,
  govt_fee_reimbursement_status govt_fee_reimbursement_status DEFAULT 'auto_approved',
  promo_code_used TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  feedback_given BOOLEAN DEFAULT false,
  feedback_skipped BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add FK for retainer_subscription_id after retainer_subscriptions table is created
-- Add FK for chat_conversations.order_id after orders table is created

-- =============================================================================
-- 17. order_stage_history - Immutable stage log
-- =============================================================================

CREATE TABLE order_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE SET NULL,
  stage_key TEXT NOT NULL,
  stage_name TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  stage_due_date DATE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 18. order_waitlist - Overflow queue
-- =============================================================================

CREATE TABLE order_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE SET NULL,
  position INT NOT NULL,
  assigned_at TIMESTAMPTZ,
  estimated_assignment_hours INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 19. retainer_subscriptions - Active recurring contracts
-- =============================================================================

CREATE TABLE retainer_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  service_package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE SET NULL,
  assigned_professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
  razorpay_subscription_id TEXT,
  billing_cycle billing_cycle NOT NULL DEFAULT 'monthly',
  monthly_price_paisa INT NOT NULL,
  first_billing_date DATE,
  next_billing_date DATE,
  status retainer_status NOT NULL DEFAULT 'onboarding',
  is_trial_active BOOLEAN DEFAULT false,
  pause_count INT DEFAULT 0,
  pause_start_date TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT now(),
  onboarding_completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Now add FK for orders.retainer_subscription_id
ALTER TABLE orders
  ADD CONSTRAINT fk_orders_retainer_subscription
  FOREIGN KEY (retainer_subscription_id)
  REFERENCES retainer_subscriptions(id) ON DELETE SET NULL;

-- Now add FK for chat_conversations
ALTER TABLE chat_conversations
  ADD CONSTRAINT fk_chat_conversations_order
  FOREIGN KEY (order_id)
  REFERENCES orders(id) ON DELETE SET NULL;

ALTER TABLE chat_conversations
  ADD CONSTRAINT fk_chat_conversations_retainer
  FOREIGN KEY (retainer_subscription_id)
  REFERENCES retainer_subscriptions(id) ON DELETE SET NULL;

-- =============================================================================
-- 20. invoices - Tax invoices for every charge
-- =============================================================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  retainer_subscription_id UUID REFERENCES retainer_subscriptions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  amount_base_paisa INT NOT NULL,
  amount_gst_paisa INT NOT NULL,
  amount_govt_fees_paisa INT DEFAULT 0,
  amount_total_paisa INT NOT NULL,
  pdf_url TEXT,
  type TEXT NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT invoice_one_required CHECK (
    (order_id IS NOT NULL) OR (retainer_subscription_id IS NOT NULL)
  )
);

-- =============================================================================
-- 21. documents - File vault
-- =============================================================================

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
  document_type document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT,
  visible_to_user BOOLEAN DEFAULT true,
  parsed_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 22. document_requests - Pro requests docs from client
-- =============================================================================

CREATE TABLE document_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE SET NULL,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  due_date DATE,
  fulfilled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 23. chat_messages - Messages
-- =============================================================================

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE SET NULL,
  sender_id UUID,
  sender_type chat_sender_type NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chat_messages_sender_check CHECK (
    (sender_type = 'system' AND sender_id IS NULL) OR
    (sender_type != 'system' AND sender_id IS NOT NULL)
  )
);

-- =============================================================================
-- 24. payouts - Professional earnings
-- =============================================================================

CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE SET NULL,
  retainer_subscription_id UUID REFERENCES retainer_subscriptions(id) ON DELETE SET NULL,
  amount_paisa INT NOT NULL,
  platform_fee_paisa INT NOT NULL,
  status payout_status NOT NULL DEFAULT 'pending',
  billing_period TEXT,
  razorpay_payout_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 25. disputes - Dispute resolution
-- =============================================================================

CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE SET NULL,
  raised_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  raised_by_type TEXT NOT NULL,
  reason_category TEXT NOT NULL,
  description TEXT,
  status dispute_status NOT NULL DEFAULT 'open',
  resolution_amount_paisa INT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 26. quote_requests - Variable-price quotes
-- =============================================================================

CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  service_package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE SET NULL,
  submitted_details JSONB NOT NULL,
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  confirmed_price_paisa INT,
  confirmed_govt_fees_paisa INT,
  status quote_status NOT NULL DEFAULT 'pending',
  quoted_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  escalated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 27. promo_codes - Discounts
-- =============================================================================

CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type discount_type NOT NULL,
  discount_value INT NOT NULL,
  applicable_to promo_applicable_to DEFAULT 'one_time_only',
  service_package_ids UUID[],
  max_uses INT,
  used_count INT DEFAULT 0,
  per_user_limit INT DEFAULT 1,
  min_order_paisa INT,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 28. feedback - Private ratings
-- =============================================================================

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  retainer_subscription_id UUID REFERENCES retainer_subscriptions(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 29. notifications - Push + SMS log
-- =============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  read_at TIMESTAMPTZ,
  fcm_status TEXT,
  sms_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT notification_recipient_required CHECK (
    (user_id IS NOT NULL) OR (professional_id IS NOT NULL)
  )
);

-- =============================================================================
-- 30. compliance_obligation_rules - Rules engine
-- =============================================================================

CREATE TABLE compliance_obligation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  business_types business_type[],
  states TEXT[],
  obligation_type TEXT NOT NULL,
  recurrence recurrence NOT NULL,
  due_date_formula TEXT NOT NULL,
  advance_reminder_days INT[] DEFAULT '{30,7,1}',
  linked_service_package_id UUID REFERENCES service_packages(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 31. compliance_obligations - Per-user instances
-- =============================================================================

CREATE TABLE compliance_obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  rule_id UUID NOT NULL REFERENCES compliance_obligation_rules(id) ON DELETE SET NULL,
  obligation_type TEXT NOT NULL,
  label TEXT NOT NULL,
  due_date DATE,
  status compliance_status NOT NULL DEFAULT 'upcoming',
  completed_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  retainer_subscription_id UUID REFERENCES retainer_subscriptions(id) ON DELETE SET NULL,
  notified_days INT[] DEFAULT '{}',
  snooze_until DATE,
  not_applicable_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 32. admin_notifications - In-app admin alerts
-- =============================================================================

CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  related_id UUID,
  related_type TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 33. sla_alerts - SLA breach log
-- =============================================================================

CREATE TABLE sla_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE SET NULL,
  stage_key TEXT NOT NULL,
  due_date DATE NOT NULL,
  alerted_at TIMESTAMPTZ DEFAULT now(),
  alert_count INT DEFAULT 1,
  professional_strike_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 34. capacity_alerts - Capacity log
-- =============================================================================

CREATE TABLE capacity_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE SET NULL,
  city TEXT NOT NULL,
  load_percent INT NOT NULL,
  alerted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 35. user_service_recommendations - Post-order upsells
-- =============================================================================

CREATE TABLE user_service_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  service_package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE SET NULL,
  reason TEXT,
  shown_at TIMESTAMPTZ DEFAULT now(),
  booked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 36. otp_rate_limits - OTP abuse prevention
-- =============================================================================

CREATE TABLE otp_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  attempt_count INT DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 37. retainer_digests - Monthly retainer proof-of-work PDF
-- =============================================================================

CREATE TABLE retainer_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retainer_subscription_id UUID NOT NULL REFERENCES retainer_subscriptions(id) ON DELETE SET NULL,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  billing_period TEXT NOT NULL,
  service_name TEXT NOT NULL,
  stages_completed JSONB NOT NULL DEFAULT '[]',
  key_numbers JSONB,
  pdf_path TEXT,
  compliance_status digest_compliance_status DEFAULT 'on_track',
  generated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 38. fraud_review_queue - Unified fraud review table
-- =============================================================================

CREATE TABLE fraud_review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
  type fraud_type NOT NULL,
  detail JSONB,
  status fraud_status NOT NULL DEFAULT 'pending',
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  monthly_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 39. professional_applications - Application funnel tracking
-- =============================================================================

CREATE TABLE professional_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  profession_type profession_type NOT NULL,
  years_experience INT,
  certifications JSONB,
  portfolio_url TEXT,
  referral_source TEXT,
  status professional_application_status DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewer_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  reapply_after_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 40. processed_webhook_events - Idempotency store for Razorpay webhooks
-- =============================================================================

CREATE TABLE processed_webhook_events (
  razorpay_event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 41. analytics_cache - Admin dashboard analytics cache
-- =============================================================================

CREATE TABLE analytics_cache (
  cache_date DATE PRIMARY KEY,
  mrr_paisa BIGINT,
  active_orders_count INT,
  completed_orders_7d INT,
  completed_orders_30d INT,
  sla_compliance_rate_30d NUMERIC(5,2),
  churn_count_30d INT,
  avg_rating_30d NUMERIC(3,2),
  city_breakdown JSONB,
  service_breakdown JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 42. referrals - Referral tracking
-- =============================================================================

CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  referee_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  status referral_status DEFAULT 'pending',
  credited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(referrer_user_id, referee_user_id)
);

-- =============================================================================
-- 43. referral_credits - Referral credit ledger
-- =============================================================================

CREATE TABLE referral_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  referee_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  credit_paisa INT NOT NULL,
  type referral_credit_type NOT NULL,
  status referral_credit_status DEFAULT 'pending',
  available_at TIMESTAMPTZ,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT referral_credits_unique_earned UNIQUE (referrer_user_id, referee_user_id, type)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- GIN indexes for JSONB columns
CREATE INDEX idx_service_packages_workflow_stages ON service_packages USING GIN (workflow_stages jsonb_path_ops);
CREATE INDEX idx_service_packages_situation_tags ON service_packages USING GIN (situation_tags);
CREATE INDEX idx_retainer_digests_stages_completed ON retainer_digests USING GIN (stages_completed jsonb_path_ops);
CREATE INDEX idx_retainer_digests_key_numbers ON retainer_digests USING GIN (key_numbers jsonb_path_ops);

-- B-tree indexes
CREATE UNIQUE INDEX idx_processed_webhook_events_razorpay_event_id ON processed_webhook_events (razorpay_event_id);
CREATE INDEX idx_orders_user_id_status ON orders (user_id, status);
CREATE INDEX idx_orders_professional_id_status ON orders (professional_id, status);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages (conversation_id, sent_at DESC);
CREATE INDEX idx_compliance_obligations_user_id ON compliance_obligations (user_id, due_date);
CREATE INDEX idx_sla_alerts_order_id ON sla_alerts (order_id, professional_strike_applied);
CREATE UNIQUE INDEX idx_service_packages_slug ON service_packages (slug);
CREATE INDEX idx_admin_audit_log_target ON admin_audit_log (target_type, target_id);
CREATE INDEX idx_users_phone ON users (phone);
CREATE INDEX idx_users_auth_user_id ON users (auth_user_id);
CREATE INDEX idx_professionals_phone ON professionals (phone);
CREATE INDEX idx_professionals_status ON professionals (status);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX idx_notifications_user_id ON notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_professional_id ON notifications (professional_id, created_at DESC);
CREATE INDEX idx_invoices_user_id ON invoices (user_id);
CREATE INDEX idx_retainer_subscriptions_user_id ON retainer_subscriptions (user_id);
CREATE INDEX idx_feedback_order_id ON feedback (order_id);
CREATE INDEX idx_quote_requests_status ON quote_requests (status);
CREATE INDEX idx_disputes_status ON disputes (status);
CREATE INDEX idx_professional_availability_city ON professional_availability (city, is_available);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Order number generation trigger (format: OLV-YYYY-NNNNN)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  year_part TEXT;
  next_seq INT;
BEGIN
  year_part := to_char(NOW(), 'YYYY');

  SELECT COALESCE(MAX(
    CAST(SUBSTRING(order_number FROM 10 FOR 5) AS INT)
  ), 0) + 1
  INTO next_seq
  FROM orders
  WHERE order_number LIKE 'OLV-' || year_part || '-%';

  NEW.order_number := 'OLV-' || year_part || '-' || LPAD(next_seq::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- Invoice number generation trigger (format: INV-YYYY-NNNNN)
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
  year_part TEXT;
  next_seq INT;
BEGIN
  year_part := to_char(NOW(), 'YYYY');

  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM 10 FOR 5) AS INT)
  ), 0) + 1
  INTO next_seq
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || year_part || '-%';

  NEW.invoice_number := 'INV-' || year_part || '-' || LPAD(next_seq::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL)
  EXECUTE FUNCTION generate_invoice_number();

-- professional_availability.current_active_orders trigger
CREATE OR REPLACE FUNCTION update_current_active_orders()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- New order created and assigned
    IF NEW.professional_id IS NOT NULL AND NEW.status IN ('pending_assignment', 'in_progress') THEN
      UPDATE professional_availability
      SET current_active_orders = current_active_orders + 1
      WHERE professional_id = NEW.professional_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Professional changed
    IF OLD.professional_id IS DISTINCT FROM NEW.professional_id THEN
      -- Decrement old professional
      IF OLD.professional_id IS NOT NULL AND OLD.status IN ('pending_assignment', 'in_progress') THEN
        UPDATE professional_availability
        SET current_active_orders = GREATEST(0, current_active_orders - 1)
        WHERE professional_id = OLD.professional_id;
      END IF;
      -- Increment new professional
      IF NEW.professional_id IS NOT NULL AND NEW.status IN ('pending_assignment', 'in_progress') THEN
        UPDATE professional_availability
        SET current_active_orders = current_active_orders + 1
        WHERE professional_id = NEW.professional_id;
      END IF;
    -- Status changed
    ELSIF OLD.status IS DISTINCT FROM NEW.status THEN
      IF NEW.professional_id IS NOT NULL THEN
        -- Order became active
        IF OLD.status NOT IN ('pending_assignment', 'in_progress') AND NEW.status IN ('pending_assignment', 'in_progress') THEN
          UPDATE professional_availability
          SET current_active_orders = current_active_orders + 1
          WHERE professional_id = NEW.professional_id;
        -- Order became inactive
        ELSIF OLD.status IN ('pending_assignment', 'in_progress') AND NEW.status NOT IN ('pending_assignment', 'in_progress') THEN
          UPDATE professional_availability
          SET current_active_orders = GREATEST(0, current_active_orders - 1)
          WHERE professional_id = NEW.professional_id;
        END IF;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_current_active_orders
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_current_active_orders();

-- Update avg_rating on service_packages when feedback is submitted
CREATE OR REPLACE FUNCTION update_service_avg_rating()
RETURNS TRIGGER AS $$
DECLARE
  service_id UUID;
  new_avg NUMERIC(3,2);
  new_count INT;
BEGIN
  -- Get the service_package_id from the order
  SELECT service_package_id INTO service_id
  FROM orders
  WHERE id = NEW.order_id;

  IF service_id IS NOT NULL THEN
    -- Calculate new average and count
    SELECT AVG(f.rating)::NUMERIC(3,2), COUNT(*)
    INTO new_avg, new_count
    FROM feedback f
    JOIN orders o ON o.id = f.order_id
    WHERE o.service_package_id = service_id;

    -- Update the service package
    UPDATE service_packages
    SET avg_rating = new_avg, rating_count = new_count
    WHERE id = service_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_service_avg_rating
  AFTER INSERT ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_service_avg_rating();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professional_bank_accounts_updated_at BEFORE UPDATE ON professional_bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professional_availability_updated_at BEFORE UPDATE ON professional_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_packages_updated_at BEFORE UPDATE ON service_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_retainer_subscriptions_updated_at BEFORE UPDATE ON retainer_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quote_requests_updated_at BEFORE UPDATE ON quote_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_obligations_updated_at BEFORE UPDATE ON compliance_obligations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

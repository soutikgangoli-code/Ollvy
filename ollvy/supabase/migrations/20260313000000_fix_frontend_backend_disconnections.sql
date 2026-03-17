-- ============================================================================
-- Migration: Fix Frontend-Backend Disconnections
-- Date: 2026-03-13
--
-- This migration adds all missing tables and columns that the frontend/edge
-- functions expect but don't exist in the current database schema.
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE MISSING TABLES
-- ============================================================================

-- 1.1 Create service_filter_categories table
-- Used by: getActiveServices() in apps/customer/lib/data/services.ts:71
CREATE TABLE IF NOT EXISTS public.service_filter_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.service_filter_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active filter categories"
ON public.service_filter_categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage filter categories"
ON public.service_filter_categories
USING (public.is_admin());

CREATE INDEX idx_service_filter_categories_slug ON public.service_filter_categories(slug);
CREATE INDEX idx_service_filter_categories_active ON public.service_filter_categories(is_active);

-- 1.2 Create quote_requests table
-- Used by: create-quote-request edge function, Quote pages
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    service_package_id UUID NOT NULL REFERENCES public.service_packages(id) ON DELETE CASCADE,
    submitted_details JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'expired', 'cancelled')),
    confirmed_price_paisa INTEGER,
    confirmed_govt_fees_paisa INTEGER,
    quoted_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quote requests"
ON public.quote_requests FOR SELECT
USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can create quote requests"
ON public.quote_requests FOR INSERT
WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Admins can manage all quote requests"
ON public.quote_requests
USING (public.is_admin());

CREATE INDEX idx_quote_requests_user_id ON public.quote_requests(user_id);
CREATE INDEX idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX idx_quote_requests_service ON public.quote_requests(service_package_id);

-- Trigger to update updated_at
CREATE OR REPLACE TRIGGER update_quote_requests_updated_at
    BEFORE UPDATE ON public.quote_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 1.3 Create promo_codes table
-- Used by: create-razorpay-order edge function, resolve-promo edge function
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
    discount_value INTEGER NOT NULL, -- percent (0-100) or fixed (paisa)
    min_order_paisa INTEGER DEFAULT 0,
    max_discount_paisa INTEGER, -- cap for percent discounts
    max_uses INTEGER, -- null = unlimited
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT now(),
    valid_until TIMESTAMPTZ,
    applicable_services UUID[], -- null = all services
    applicable_tiers VARCHAR(10)[], -- ['free', 'pro'] or null = all
    is_single_use_per_user BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.admin_users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage promo codes"
ON public.promo_codes
USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage promo codes"
ON public.promo_codes
USING (public.is_admin());

CREATE INDEX idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX idx_promo_codes_active ON public.promo_codes(is_active);

-- Track promo code usage per user
CREATE TABLE IF NOT EXISTS public.promo_code_usages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    discount_applied_paisa INTEGER NOT NULL,
    used_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(promo_code_id, order_id)
);

ALTER TABLE public.promo_code_usages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own promo usage"
ON public.promo_code_usages FOR SELECT
USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Service role can manage promo usage"
ON public.promo_code_usages
USING (auth.role() = 'service_role');

-- 1.4 Create service_state_pricing table
-- Used by: getStatePricing() in apps/customer/lib/data/services.ts:236
CREATE TABLE IF NOT EXISTS public.service_state_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_package_id UUID NOT NULL REFERENCES public.service_packages(id) ON DELETE CASCADE,
    state VARCHAR(50) NOT NULL,
    price_base_paisa INTEGER NOT NULL,
    price_govt_fees_paisa INTEGER DEFAULT 0,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(service_package_id, state)
);

ALTER TABLE public.service_state_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active state pricing"
ON public.service_state_pricing FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage state pricing"
ON public.service_state_pricing
USING (public.is_admin());

CREATE INDEX idx_service_state_pricing_service ON public.service_state_pricing(service_package_id);
CREATE INDEX idx_service_state_pricing_state ON public.service_state_pricing(state);

-- 1.5 Create compliance_obligation_rules table (parent table)
-- Used by: getUserComplianceObligations() in apps/customer/lib/data/services.ts:363
CREATE TABLE IF NOT EXISTS public.compliance_obligation_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'GST_MONTHLY', 'ITR_ANNUAL'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    frequency VARCHAR(20) CHECK (frequency IN ('monthly', 'quarterly', 'annual', 'one_time')),
    due_day_of_month INTEGER, -- 1-31, null for dynamic
    due_month INTEGER, -- 1-12 for annual, null for monthly/quarterly
    penalty_per_day_paisa INTEGER DEFAULT 0,
    penalty_interest_rate DECIMAL(5,2) DEFAULT 0, -- annual %
    linked_service_package_id UUID REFERENCES public.service_packages(id),
    applies_to_business_types VARCHAR(50)[], -- ['sole_prop', 'pvt_ltd', etc.]
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.compliance_obligation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active compliance rules"
ON public.compliance_obligation_rules FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage compliance rules"
ON public.compliance_obligation_rules
USING (public.is_admin());

-- 1.6 Create compliance_obligations table
-- Used by: getUserComplianceObligations() in apps/customer/lib/data/services.ts:356
CREATE TABLE IF NOT EXISTS public.compliance_obligations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rule_id UUID NOT NULL REFERENCES public.compliance_obligation_rules(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL, -- Display name like "GST Filing - March 2026"
    obligation_type VARCHAR(50), -- 'gst', 'itr', 'mca', etc.
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue', 'waived')),
    completed_at TIMESTAMPTZ,
    completed_order_id UUID REFERENCES public.orders(id),
    reminder_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.compliance_obligations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own compliance obligations"
ON public.compliance_obligations FOR SELECT
USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Admins can manage all compliance obligations"
ON public.compliance_obligations
USING (public.is_admin());

CREATE POLICY "Service role can manage compliance obligations"
ON public.compliance_obligations
USING (auth.role() = 'service_role');

CREATE INDEX idx_compliance_obligations_user ON public.compliance_obligations(user_id);
CREATE INDEX idx_compliance_obligations_due_date ON public.compliance_obligations(due_date);
CREATE INDEX idx_compliance_obligations_status ON public.compliance_obligations(status);

-- Trigger to update updated_at
CREATE OR REPLACE TRIGGER update_compliance_obligations_updated_at
    BEFORE UPDATE ON public.compliance_obligations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- PART 2: ADD MISSING COLUMNS TO service_packages
-- ============================================================================

-- Add scope_included column (frontend uses this, currently only deliverables exists)
ALTER TABLE public.service_packages
ADD COLUMN IF NOT EXISTS scope_included TEXT[] DEFAULT '{}';

-- Add scope_excluded column
ALTER TABLE public.service_packages
ADD COLUMN IF NOT EXISTS scope_excluded TEXT[] DEFAULT '{}';

-- Add avg_rating column (computed from feedback, cached for performance)
ALTER TABLE public.service_packages
ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1) DEFAULT NULL;

-- Add rating_count column (cached count of reviews)
ALTER TABLE public.service_packages
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- Add filter_category_id column (different from category_id, used for filter UI)
ALTER TABLE public.service_packages
ADD COLUMN IF NOT EXISTS filter_category_id UUID REFERENCES public.service_filter_categories(id);

CREATE INDEX IF NOT EXISTS idx_service_packages_filter_category
ON public.service_packages(filter_category_id);

-- Copy deliverables to scope_included for existing data
UPDATE public.service_packages
SET scope_included = ARRAY(SELECT jsonb_array_elements_text(deliverables))
WHERE scope_included = '{}' AND deliverables IS NOT NULL AND deliverables != '[]'::jsonb;

-- ============================================================================
-- PART 3: ADD MISSING COLUMNS TO orders
-- ============================================================================

-- Add order_type column
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS order_type VARCHAR(20) DEFAULT 'one_time' CHECK (order_type IN ('one_time', 'recurring'));

-- Add city column
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Add price snapshot columns with correct names (matching frontend expectations)
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS price_base_paisa_snapshot INTEGER;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS price_govt_fees_paisa_snapshot INTEGER;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS price_gst_paisa_snapshot INTEGER;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS pro_discount_paisa_snapshot INTEGER DEFAULT 0;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS promo_discount_paisa_snapshot INTEGER DEFAULT 0;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS total_paisa_snapshot INTEGER;

-- Add other missing columns
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_paused BOOLEAN DEFAULT false;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS force_assigned BOOLEAN DEFAULT false;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS govt_fees_paid_paisa INTEGER DEFAULT 0;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS govt_fee_receipt_path TEXT;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS govt_fee_reimbursement_status VARCHAR(20);

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS promo_code_used VARCHAR(50);

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS feedback_given BOOLEAN DEFAULT false;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS feedback_skipped BOOLEAN DEFAULT false;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS price_source VARCHAR(20) DEFAULT 'base'; -- 'base' or 'quote'

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS chat_conversation_id UUID;

-- Add index for chat_conversation_id
CREATE INDEX IF NOT EXISTS idx_orders_chat_conversation
ON public.orders(chat_conversation_id);

-- Migrate existing data to new column names
UPDATE public.orders
SET price_base_paisa_snapshot = base_price,
    price_govt_fees_paisa_snapshot = government_fees,
    price_gst_paisa_snapshot = gst_amount,
    total_paisa_snapshot = total_amount
WHERE price_base_paisa_snapshot IS NULL;

-- ============================================================================
-- PART 4: ADD MISSING COLUMNS TO users
-- ============================================================================

-- Add referral_credit_paisa column (total earned)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS referral_credit_paisa INTEGER DEFAULT 0;

-- Add referral_credit_balance_paisa column (available to use)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS referral_credit_balance_paisa INTEGER DEFAULT 0;

-- Add preferred_professional_id column
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS preferred_professional_id UUID REFERENCES public.professionals(id);

CREATE INDEX IF NOT EXISTS idx_users_preferred_professional
ON public.users(preferred_professional_id);

-- ============================================================================
-- PART 5: ADD MISSING COLUMNS TO professionals
-- ============================================================================

-- Add 'name' as an alias column that references full_name
-- Actually, we'll create a computed column or just add it
-- For PostgreSQL, we can add a generated column
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS name VARCHAR(255) GENERATED ALWAYS AS (full_name) STORED;

-- ============================================================================
-- PART 6: FIX ORDER STATUS VALUES
-- ============================================================================

-- The orders.status column uses VARCHAR, so we can add new status values
-- Frontend expects: pending_assignment, waitlisted, in_progress, completed, disputed, cancelled
-- DB currently uses: placed, assigned, in_progress, completed, cancelled

-- Migrate existing 'placed' orders to 'pending_assignment'
UPDATE public.orders
SET status = 'pending_assignment'
WHERE status = 'placed';

-- Migrate 'assigned' to 'in_progress' (or keep as intermediate status)
-- For now, let's keep 'assigned' as is since it's a valid intermediate state

-- Add check constraint to validate status values
-- First drop existing constraint if any
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
ADD CONSTRAINT orders_status_check
CHECK (status IN ('pending_assignment', 'waitlisted', 'assigned', 'in_progress', 'completed', 'disputed', 'cancelled'));

-- ============================================================================
-- PART 7: ADD ORDER STAGE HISTORY MISSING COLUMNS
-- ============================================================================

-- Add sla_breached column
ALTER TABLE public.order_stage_history
ADD COLUMN IF NOT EXISTS sla_breached BOOLEAN DEFAULT false;

-- Add due_at column
ALTER TABLE public.order_stage_history
ADD COLUMN IF NOT EXISTS due_at TIMESTAMPTZ;

-- ============================================================================
-- PART 8: CREATE FUNCTION TO UPDATE SERVICE RATINGS
-- ============================================================================

-- Function to recalculate service package ratings
CREATE OR REPLACE FUNCTION public.update_service_package_ratings()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the service package with new avg rating and count
    UPDATE public.service_packages sp
    SET
        avg_rating = subq.avg_rating,
        rating_count = subq.rating_count,
        updated_at = now()
    FROM (
        SELECT
            o.service_package_id,
            ROUND(AVG(f.rating)::numeric, 1) as avg_rating,
            COUNT(f.id) as rating_count
        FROM public.orders o
        JOIN public.feedback f ON f.order_id = o.id
        WHERE o.service_package_id = (
            SELECT service_package_id FROM public.orders WHERE id = NEW.order_id
        )
        GROUP BY o.service_package_id
    ) subq
    WHERE sp.id = subq.service_package_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update service ratings when feedback is added/updated
DROP TRIGGER IF EXISTS trigger_update_service_ratings ON public.feedback;
CREATE TRIGGER trigger_update_service_ratings
    AFTER INSERT OR UPDATE ON public.feedback
    FOR EACH ROW EXECUTE FUNCTION public.update_service_package_ratings();

-- ============================================================================
-- PART 9: GRANT PERMISSIONS
-- ============================================================================

-- Grant permissions on new tables
GRANT ALL ON TABLE public.service_filter_categories TO anon;
GRANT ALL ON TABLE public.service_filter_categories TO authenticated;
GRANT ALL ON TABLE public.service_filter_categories TO service_role;

GRANT ALL ON TABLE public.quote_requests TO anon;
GRANT ALL ON TABLE public.quote_requests TO authenticated;
GRANT ALL ON TABLE public.quote_requests TO service_role;

GRANT ALL ON TABLE public.promo_codes TO anon;
GRANT ALL ON TABLE public.promo_codes TO authenticated;
GRANT ALL ON TABLE public.promo_codes TO service_role;

GRANT ALL ON TABLE public.promo_code_usages TO anon;
GRANT ALL ON TABLE public.promo_code_usages TO authenticated;
GRANT ALL ON TABLE public.promo_code_usages TO service_role;

GRANT ALL ON TABLE public.service_state_pricing TO anon;
GRANT ALL ON TABLE public.service_state_pricing TO authenticated;
GRANT ALL ON TABLE public.service_state_pricing TO service_role;

GRANT ALL ON TABLE public.compliance_obligation_rules TO anon;
GRANT ALL ON TABLE public.compliance_obligation_rules TO authenticated;
GRANT ALL ON TABLE public.compliance_obligation_rules TO service_role;

GRANT ALL ON TABLE public.compliance_obligations TO anon;
GRANT ALL ON TABLE public.compliance_obligations TO authenticated;
GRANT ALL ON TABLE public.compliance_obligations TO service_role;

-- ============================================================================
-- PART 10: SEED DEFAULT FILTER CATEGORIES
-- ============================================================================

INSERT INTO public.service_filter_categories (name, slug, icon_name, display_order, is_active) VALUES
    ('All Services', 'all', 'Grid', 0, true),
    ('Business Registration', 'registration', 'Building', 1, true),
    ('Tax & Compliance', 'tax', 'Receipt', 2, true),
    ('Licenses & Permits', 'licenses', 'FileCheck', 3, true),
    ('Trademark & IP', 'trademark', 'Shield', 4, true),
    ('Ongoing Compliance', 'ongoing', 'RefreshCw', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- PART 11: SEED DEFAULT COMPLIANCE RULES
-- ============================================================================

INSERT INTO public.compliance_obligation_rules (code, name, description, frequency, due_day_of_month, penalty_per_day_paisa, applies_to_business_types) VALUES
    ('GST_MONTHLY', 'GST Monthly Return (GSTR-3B)', 'Monthly GST return filing', 'monthly', 20, 10000, ARRAY['pvt_ltd', 'llp', 'partnership', 'sole_prop']),
    ('GST_ANNUAL', 'GST Annual Return (GSTR-9)', 'Annual GST reconciliation', 'annual', 31, 20000, ARRAY['pvt_ltd', 'llp', 'partnership', 'sole_prop']),
    ('ITR_BUSINESS', 'Business Income Tax Return', 'Annual ITR filing for businesses', 'annual', NULL, 500000, ARRAY['pvt_ltd', 'llp', 'partnership', 'sole_prop']),
    ('MCA_ANNUAL', 'MCA Annual Filing (AOC-4 & MGT-7)', 'Annual company filings with MCA', 'annual', NULL, 20000, ARRAY['pvt_ltd']),
    ('TDS_MONTHLY', 'TDS Monthly Deposit', 'Monthly TDS payment and return', 'monthly', 7, 20000, ARRAY['pvt_ltd', 'llp', 'partnership']),
    ('DIR_KYC', 'Director KYC (DIR-3)', 'Annual director KYC update', 'annual', NULL, 500000, ARRAY['pvt_ltd'])
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- DONE!
-- ============================================================================

COMMENT ON TABLE public.quote_requests IS 'Quote requests for services with variable pricing (price_varies_by_state=true)';
COMMENT ON TABLE public.promo_codes IS 'Promotional codes for discounts on orders';
COMMENT ON TABLE public.service_state_pricing IS 'State-specific pricing overrides for services';
COMMENT ON TABLE public.compliance_obligations IS 'User-specific compliance deadlines and tracking';
COMMENT ON TABLE public.service_filter_categories IS 'Categories for filtering services in the UI (distinct from service_categories)';

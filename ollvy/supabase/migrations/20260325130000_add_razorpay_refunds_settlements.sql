-- =============================================================================
-- Migration: Add refunds and settlements tables for Razorpay webhook tracking
-- =============================================================================

-- Refunds table - tracks all refunds initiated through Razorpay
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  razorpay_refund_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT NOT NULL,
  amount_paisa INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'created', -- created, processed, failed
  reason TEXT,
  speed TEXT, -- normal, optimum
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  failure_reason TEXT
);

-- Settlements table - tracks when money hits your bank account
CREATE TABLE IF NOT EXISTS settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_settlement_id TEXT UNIQUE NOT NULL,
  amount_paisa INT NOT NULL,
  fees_paisa INT DEFAULT 0,
  tax_paisa INT DEFAULT 0,
  utr TEXT, -- Bank UTR number
  status TEXT NOT NULL DEFAULT 'processed',
  settled_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment disputes from Razorpay (chargebacks)
CREATE TABLE IF NOT EXISTS payment_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  razorpay_dispute_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT NOT NULL,
  amount_paisa INT NOT NULL,
  reason_code TEXT,
  reason_description TEXT,
  phase TEXT, -- chargeback, pre_arbitration, arbitration
  status TEXT NOT NULL DEFAULT 'open', -- open, under_review, won, lost, closed, action_required
  respond_by TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_refunds_order_id ON refunds(order_id);
CREATE INDEX idx_refunds_user_id ON refunds(user_id);
CREATE INDEX idx_refunds_status ON refunds(status);
CREATE INDEX idx_refunds_razorpay_payment_id ON refunds(razorpay_payment_id);

CREATE INDEX idx_settlements_settled_at ON settlements(settled_at);

CREATE INDEX idx_payment_disputes_order_id ON payment_disputes(order_id);
CREATE INDEX idx_payment_disputes_status ON payment_disputes(status);
CREATE INDEX idx_payment_disputes_razorpay_payment_id ON payment_disputes(razorpay_payment_id);

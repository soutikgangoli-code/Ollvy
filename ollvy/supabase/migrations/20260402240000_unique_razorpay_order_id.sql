-- Prevent duplicate orders with same Razorpay order ID
-- This is a database-level protection against double-submission edge cases
-- Using partial unique index (WHERE NOT NULL) so orders without razorpay_order_id
-- (like manual/test orders) aren't affected

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_razorpay_order_id
ON orders (razorpay_order_id)
WHERE razorpay_order_id IS NOT NULL;

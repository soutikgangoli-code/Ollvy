-- order_activity_log.order_id is queried on every order detail page but has no index
CREATE INDEX IF NOT EXISTS idx_order_activity_log_order_id
ON order_activity_log(order_id);

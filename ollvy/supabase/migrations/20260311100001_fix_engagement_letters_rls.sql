-- Fix RLS for engagement_letters table
-- This is the only table missing RLS (created in 20260311060000_order_flow_schema.sql)

ALTER TABLE engagement_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_read_own_engagement_letter" ON engagement_letters
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

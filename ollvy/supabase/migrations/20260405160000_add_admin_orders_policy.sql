-- Add admin SELECT policy to orders table
-- This allows admin RLS subqueries in chat policies to work
CREATE POLICY orders_admin_select ON orders
  FOR SELECT USING (is_admin());

-- Also ensure admin can update order status etc
CREATE POLICY orders_admin_update ON orders
  FOR UPDATE USING (is_admin());

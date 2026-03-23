'use server'

import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { logActivity, LOG_ACTIONS } from '@/lib/admin/log-activity'
import { revalidatePath } from 'next/cache'

export async function bulkAssignOrders(
  orderIds: string[],
  assignToAdminId: string,
  assignToAdminName: string
) {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')
  const now = new Date().toISOString()

  // Step 1: Batch update all selected orders in one query
  await supabaseServer
    .from('orders')
    .update({ assigned_admin_id: assignToAdminId })
    .in('id', orderIds)

  // Step 2: Batch close all open assignment history rows in one query
  await supabaseServer
    .from('order_admin_assignment_history')
    .update({ unassigned_at: now })
    .in('order_id', orderIds)
    .is('unassigned_at', null)

  // Step 3: Batch insert new history rows in one query
  await supabaseServer
    .from('order_admin_assignment_history')
    .insert(
      orderIds.map(orderId => ({
        order_id: orderId,
        assigned_to_admin_id: assignToAdminId,
        assigned_by_admin_id: adminUser.id,
        assigned_to_name: assignToAdminName,
        assigned_by_name: adminUser.name,
        assigned_at: now,
      }))
    )

  // Step 4: Batch insert activity log rows in one query
  await supabaseServer
    .from('order_activity_log')
    .insert(
      orderIds.map(orderId => ({
        order_id: orderId,
        action_type: LOG_ACTIONS.ADMIN_ASSIGNED,
        actor_type: 'admin',
        actor_id: adminUser.id,
        actor_name: adminUser.name,
        description: `Order assigned to ${assignToAdminName} by ${adminUser.name}`,
        metadata: { assigned_to: assignToAdminName, assigned_to_id: assignToAdminId },
        created_at: now,
      }))
    )

  revalidatePath('/admin/queue')
  return { success: true, count: orderIds.length }
}

export async function getAdminUsersWithCounts() {
  const adminUser = await getAdminUser()
  if (!supabaseServer) throw new Error('Service client unavailable')

  // Fetch active admin users
  const { data: adminUsers } = await supabaseServer
    .from('admin_users')
    .select('id, name, email, is_active')
    .eq('is_active', true)
    .order('name')

  if (!adminUsers) return []

  // For each admin user, count their active orders
  const adminWithCounts = await Promise.all(
    adminUsers.map(async (admin) => {
      const { count } = await supabaseServer!
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('assigned_admin_id', admin.id)
        .not('status', 'in', '(completed,cancelled)')
      return { ...admin, activeOrderCount: count ?? 0 }
    })
  )

  // Sort by active order count ascending (lightest workload first)
  adminWithCounts.sort((a, b) => a.activeOrderCount - b.activeOrderCount)

  return adminWithCounts
}

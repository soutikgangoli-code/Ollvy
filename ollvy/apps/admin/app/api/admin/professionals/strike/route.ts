import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { professional_id, reason } = await request.json()

  if (!professional_id) {
    return NextResponse.json({ error: 'Professional ID is required' }, { status: 400 })
  }

  if (!reason || reason.length < 20) {
    return NextResponse.json({ error: 'Reason must be at least 20 characters' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  // Get professional
  const { data: professional, error: fetchError } = await supabase
    .from('professionals')
    .select('id, display_name, phone, status, strike_count')
    .eq('id', professional_id)
    .single()

  if (fetchError || !professional) {
    return NextResponse.json({ error: 'Professional not found' }, { status: 404 })
  }

  const newStrikeCount = (professional.strike_count || 0) + 1

  // Insert strike record
  await supabase.from('professional_strikes').insert({
    professional_id,
    reason,
    admin_id: session.adminId,
  })

  // Update strike count
  const updates: any = {
    strike_count: newStrikeCount,
  }

  // Auto-suspend at 3 strikes
  if (newStrikeCount >= 3 && professional.status === 'approved') {
    updates.status = 'suspended'
    updates.suspended_at = new Date().toISOString()
    updates.suspension_reason = 'Automatic suspension: 3 strikes reached'
    updates.is_available = false

    // Cancel active assignments
    const { data: activeOrders } = await supabase
      .from('orders')
      .select('id')
      .eq('professional_id', professional_id)
      .in('status', ['assigned', 'in_progress'])

    if (activeOrders && activeOrders.length > 0) {
      await supabase
        .from('orders')
        .update({
          status: 'waitlisted',
          professional_id: null,
          assigned_at: null,
        })
        .in('id', activeOrders.map(o => o.id))
    }
  }

  const { error: updateError } = await supabase
    .from('professionals')
    .update(updates)
    .eq('id', professional_id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to add strike' }, { status: 500 })
  }

  // Create audit log entry
  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: 'add_strike',
    target_type: 'professional',
    target_id: professional_id,
    notes: `Strike ${newStrikeCount} added to ${professional.display_name}: ${reason}${newStrikeCount >= 3 ? ' (Auto-suspended)' : ''}`,
  })

  return NextResponse.json({
    success: true,
    newStrikeCount,
    autoSuspended: newStrikeCount >= 3,
  })
}

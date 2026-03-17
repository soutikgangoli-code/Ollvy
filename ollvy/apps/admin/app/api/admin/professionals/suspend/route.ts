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

  if (!reason || reason.length < 50) {
    return NextResponse.json({ error: 'Reason must be at least 50 characters' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  // Get professional
  const { data: professional, error: fetchError } = await supabase
    .from('professionals')
    .select('id, display_name, phone, status')
    .eq('id', professional_id)
    .single()

  if (fetchError || !professional) {
    return NextResponse.json({ error: 'Professional not found' }, { status: 404 })
  }

  if (professional.status !== 'approved') {
    return NextResponse.json({ error: 'Professional is not currently approved' }, { status: 400 })
  }

  // Update status
  const { error: updateError } = await supabase
    .from('professionals')
    .update({
      status: 'suspended',
      suspended_at: new Date().toISOString(),
      suspension_reason: reason,
      is_available: false,
    })
    .eq('id', professional_id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to suspend professional' }, { status: 500 })
  }

  // Cancel active assignments - move orders back to waitlist
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

  // Create audit log entry
  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: 'suspend_professional',
    target_type: 'professional',
    target_id: professional_id,
    notes: `Suspended ${professional.display_name}: ${reason}. ${activeOrders?.length || 0} orders returned to waitlist.`,
  })

  return NextResponse.json({ success: true, ordersReassigned: activeOrders?.length || 0 })
}

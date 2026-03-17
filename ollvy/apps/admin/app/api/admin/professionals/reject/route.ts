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

  if (!reason || reason.length < 10) {
    return NextResponse.json({ error: 'Reason must be at least 10 characters' }, { status: 400 })
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

  if (professional.status !== 'pending_review') {
    return NextResponse.json({ error: 'Professional is not pending review' }, { status: 400 })
  }

  // Update status
  const { error: updateError } = await supabase
    .from('professionals')
    .update({
      status: 'rejected',
      rejected_at: new Date().toISOString(),
      rejection_reason: reason,
    })
    .eq('id', professional_id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to reject professional' }, { status: 500 })
  }

  // Create audit log entry
  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: 'reject_professional',
    target_type: 'professional',
    target_id: professional_id,
    notes: `Rejected ${professional.display_name}: ${reason}`,
  })

  return NextResponse.json({ success: true })
}

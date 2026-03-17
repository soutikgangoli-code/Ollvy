import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { retainer_id, reason } = await request.json()

  if (!retainer_id) {
    return NextResponse.json({ error: 'Retainer ID is required' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  // Get retainer
  const { data: retainer, error: fetchError } = await supabase
    .from('retainers')
    .select('id, status, razorpay_subscription_id')
    .eq('id', retainer_id)
    .single()

  if (fetchError || !retainer) {
    return NextResponse.json({ error: 'Retainer not found' }, { status: 404 })
  }

  if (retainer.status !== 'active') {
    return NextResponse.json({ error: 'Retainer is not active' }, { status: 400 })
  }

  // Update retainer status
  const { error: updateError } = await supabase
    .from('retainers')
    .update({
      status: 'paused',
      paused_at: new Date().toISOString(),
    })
    .eq('id', retainer_id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to pause retainer' }, { status: 500 })
  }

  // Record pause history
  await supabase.from('retainer_pause_history').insert({
    retainer_id,
    reason: reason || 'Admin paused',
    paused_at: new Date().toISOString(),
  })

  // Audit log
  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: 'pause_retainer',
    target_type: 'retainer',
    target_id: retainer_id,
    notes: `Paused retainer: ${reason || 'No reason provided'}`,
  })

  return NextResponse.json({ success: true })
}

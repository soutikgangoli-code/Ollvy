import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { retainer_id } = await request.json()

  if (!retainer_id) {
    return NextResponse.json({ error: 'Retainer ID is required' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  // Get retainer
  const { data: retainer, error: fetchError } = await supabase
    .from('retainers')
    .select('id, status')
    .eq('id', retainer_id)
    .single()

  if (fetchError || !retainer) {
    return NextResponse.json({ error: 'Retainer not found' }, { status: 404 })
  }

  if (retainer.status !== 'paused') {
    return NextResponse.json({ error: 'Retainer is not paused' }, { status: 400 })
  }

  // Update retainer status
  const { error: updateError } = await supabase
    .from('retainers')
    .update({
      status: 'active',
      paused_at: null,
    })
    .eq('id', retainer_id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to resume retainer' }, { status: 500 })
  }

  // Update pause history
  await supabase
    .from('retainer_pause_history')
    .update({ resumed_at: new Date().toISOString() })
    .eq('retainer_id', retainer_id)
    .is('resumed_at', null)

  // Audit log
  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: 'resume_retainer',
    target_type: 'retainer',
    target_id: retainer_id,
    notes: 'Resumed retainer',
  })

  return NextResponse.json({ success: true })
}

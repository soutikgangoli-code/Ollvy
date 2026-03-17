import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { payout_id, utr } = await request.json()

  if (!payout_id || !utr) {
    return NextResponse.json({ error: 'Payout ID and UTR are required' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  // Get payout
  const { data: payout, error: fetchError } = await supabase
    .from('payouts')
    .select('id, status, professional_id, amount_paisa')
    .eq('id', payout_id)
    .single()

  if (fetchError || !payout) {
    return NextResponse.json({ error: 'Payout not found' }, { status: 404 })
  }

  if (payout.status !== 'ready') {
    return NextResponse.json({ error: 'Payout is not ready for processing' }, { status: 400 })
  }

  // Update payout
  const { error: updateError } = await supabase
    .from('payouts')
    .update({
      status: 'completed',
      utr,
      processed_at: new Date().toISOString(),
      processed_by: session.adminId,
    })
    .eq('id', payout_id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to process payout' }, { status: 500 })
  }

  // Audit log
  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: 'process_payout',
    target_type: 'payout',
    target_id: payout_id,
    notes: `Processed payout of Rs ${payout.amount_paisa / 100} with UTR: ${utr}`,
  })

  return NextResponse.json({ success: true })
}

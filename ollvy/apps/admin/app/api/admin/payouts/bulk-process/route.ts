import { NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession, hasPermission } from '@/lib/auth'

export async function POST() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only finance_admin can bulk process
  if (!hasPermission(session.role, '/payouts')) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
  }

  const supabase = createAdminSupabase()

  // Get all ready payouts
  const { data: readyPayouts, error: fetchError } = await supabase
    .from('payouts')
    .select('id, professional_id, amount_paisa')
    .eq('status', 'ready')

  if (fetchError) {
    return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 })
  }

  if (!readyPayouts || readyPayouts.length === 0) {
    return NextResponse.json({ error: 'No payouts ready for processing' }, { status: 400 })
  }

  // Mark all as processing
  const { error: updateError } = await supabase
    .from('payouts')
    .update({
      status: 'processing',
      processed_by: session.adminId,
    })
    .eq('status', 'ready')

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update payouts' }, { status: 500 })
  }

  // Audit log
  const totalAmount = readyPayouts.reduce((sum, p) => sum + p.amount_paisa, 0)
  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: 'bulk_process_payouts',
    target_type: 'payout',
    target_id: 'bulk',
    notes: `Started bulk processing of ${readyPayouts.length} payouts totaling Rs ${totalAmount / 100}`,
  })

  return NextResponse.json({
    success: true,
    count: readyPayouts.length,
    total: totalAmount,
  })
}

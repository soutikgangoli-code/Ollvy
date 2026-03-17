import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { dispute_id, resolution, reason } = await request.json()

  if (!dispute_id) {
    return NextResponse.json({ error: 'Dispute ID is required' }, { status: 400 })
  }

  if (!['refund', 'completed'].includes(resolution)) {
    return NextResponse.json({ error: 'Invalid resolution type' }, { status: 400 })
  }

  if (!reason || reason.length < 10) {
    return NextResponse.json({ error: 'Reason must be at least 10 characters' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  // Get dispute with order
  const { data: dispute, error: fetchError } = await supabase
    .from('disputes')
    .select(`
      id,
      status,
      order_id,
      orders (
        id,
        razorpay_payment_id,
        total_paisa_snapshot,
        professional_id
      )
    `)
    .eq('id', dispute_id)
    .single()

  if (fetchError || !dispute) {
    return NextResponse.json({ error: 'Dispute not found' }, { status: 404 })
  }

  if (dispute.status !== 'open') {
    return NextResponse.json({ error: 'Dispute is not open' }, { status: 400 })
  }

  const order = dispute.orders as any

  // Update dispute status
  const { error: disputeError } = await supabase
    .from('disputes')
    .update({
      status: 'resolved',
      resolution,
      resolution_reason: reason,
      resolved_at: new Date().toISOString(),
      resolved_by: session.adminId,
    })
    .eq('id', dispute_id)

  if (disputeError) {
    return NextResponse.json({ error: 'Failed to resolve dispute' }, { status: 500 })
  }

  if (resolution === 'refund') {
    // Update order to cancelled
    await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: `Dispute resolved as refund: ${reason}`,
      })
      .eq('id', order.id)

    // Queue refund
    if (order.razorpay_payment_id) {
      await supabase.from('refund_queue').insert({
        order_id: order.id,
        payment_id: order.razorpay_payment_id,
        amount_paisa: order.total_paisa_snapshot,
        reason: `Dispute resolved as refund: ${reason}`,
        status: 'pending',
      })
    }

    // Cancel professional payout if any
    if (order.professional_id) {
      await supabase
        .from('payouts')
        .update({ status: 'cancelled' })
        .eq('order_id', order.id)
        .eq('status', 'pending')
    }
  } else {
    // Mark order as completed
    await supabase
      .from('orders')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    // Release professional payout
    if (order.professional_id) {
      await supabase
        .from('payouts')
        .update({ status: 'ready' })
        .eq('order_id', order.id)
        .eq('status', 'pending')
    }
  }

  // Create audit log entry
  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: `resolve_dispute_${resolution}`,
    target_type: 'order',
    target_id: order.id,
    notes: `Dispute resolved as ${resolution}: ${reason}`,
  })

  return NextResponse.json({ success: true, resolution })
}

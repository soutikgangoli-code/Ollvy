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

  if (!reason || reason.length < 20) {
    return NextResponse.json({ error: 'Reason must be at least 20 characters' }, { status: 400 })
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

  if (!['active', 'paused'].includes(retainer.status)) {
    return NextResponse.json({ error: 'Retainer cannot be cancelled' }, { status: 400 })
  }

  // Update retainer status
  const { error: updateError } = await supabase
    .from('retainers')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason,
    })
    .eq('id', retainer_id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to cancel retainer' }, { status: 500 })
  }

  // Cancel Razorpay subscription if exists
  if (retainer.razorpay_subscription_id) {
    const razorpayKey = process.env.RAZORPAY_KEY_ID
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET

    if (razorpayKey && razorpaySecret) {
      try {
        await fetch(`https://api.razorpay.com/v1/subscriptions/${retainer.razorpay_subscription_id}/cancel`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString('base64'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cancel_at_cycle_end: false }),
        })
      } catch (e) {
        console.error('Failed to cancel Razorpay subscription:', e)
      }
    }
  }

  // Audit log
  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: 'cancel_retainer',
    target_type: 'retainer',
    target_id: retainer_id,
    notes: `Cancelled retainer: ${reason}`,
  })

  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { user_id, action, reason } = await request.json()

  if (!user_id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  if (!['flag', 'unflag', 'restrict', 'unrestrict'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  if (['flag', 'restrict'].includes(action) && (!reason || reason.length < 10)) {
    return NextResponse.json({ error: 'Reason must be at least 10 characters' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  // Get user
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('id, phone, is_flagged, is_restricted')
    .eq('id', user_id)
    .single()

  if (fetchError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Build update
  const updates: any = {}
  let auditAction = ''
  let auditNotes = ''

  switch (action) {
    case 'flag':
      updates.is_flagged = true
      updates.flagged_at = new Date().toISOString()
      updates.flag_reason = reason
      auditAction = 'flag_user'
      auditNotes = `Flagged user: ${reason}`
      break
    case 'unflag':
      updates.is_flagged = false
      updates.flagged_at = null
      updates.flag_reason = null
      auditAction = 'unflag_user'
      auditNotes = 'Removed flag from user'
      break
    case 'restrict':
      updates.is_restricted = true
      updates.restricted_at = new Date().toISOString()
      updates.restriction_reason = reason
      auditAction = 'restrict_user'
      auditNotes = `Restricted user: ${reason}`
      break
    case 'unrestrict':
      updates.is_restricted = false
      updates.restricted_at = null
      updates.restriction_reason = null
      auditAction = 'unrestrict_user'
      auditNotes = 'Removed restriction from user'
      break
  }

  // Update user
  const { error: updateError } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user_id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }

  // Create audit log
  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: auditAction,
    target_type: 'user',
    target_id: user_id,
    notes: auditNotes,
  })

  return NextResponse.json({ success: true })
}

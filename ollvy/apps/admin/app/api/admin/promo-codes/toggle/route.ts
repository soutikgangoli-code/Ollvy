import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, is_active } = await request.json()

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  const { error } = await supabase
    .from('promo_codes')
    .update({ is_active })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Failed to update promo code' }, { status: 500 })
  }

  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: is_active ? 'activate_promo_code' : 'deactivate_promo_code',
    target_type: 'promo_code',
    target_id: id,
  })

  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    code,
    discount_type,
    discount_value,
    max_uses,
    valid_from,
    valid_until,
    min_order_paisa,
    max_discount_paisa,
    is_active,
  } = body

  if (!code || !discount_type || !discount_value) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  // Check code uniqueness
  const { data: existing } = await supabase
    .from('promo_codes')
    .select('id')
    .eq('code', code)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Code already exists' }, { status: 400 })
  }

  const { data: promoCode, error } = await supabase
    .from('promo_codes')
    .insert({
      code,
      discount_type,
      discount_value,
      max_uses,
      valid_from,
      valid_until,
      min_order_paisa,
      max_discount_paisa,
      is_active,
      current_uses: 0,
    })
    .select()
    .single()

  if (error) {
    console.error('Promo code creation error:', error)
    return NextResponse.json({ error: 'Failed to create promo code' }, { status: 500 })
  }

  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: 'create_promo_code',
    target_type: 'promo_code',
    target_id: promoCode.id,
    notes: `Created promo code: ${code}`,
  })

  return NextResponse.json({ success: true, promoCode })
}

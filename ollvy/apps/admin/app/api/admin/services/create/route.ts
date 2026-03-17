import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession, hasPermission } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only super_admin can create services
  if (!hasPermission(session.role, '/services')) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
  }

  const body = await request.json()
  const {
    tier_group_id,
    name,
    slug,
    description,
    profession_type,
    price_base_paisa,
    price_govt_fees_paisa,
    professional_share_percent,
    workflow_stages,
    sla_working_days,
    situation_tags,
    state_pricing,
    is_active,
  } = body

  if (!name || !slug || !profession_type || !price_base_paisa) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from('service_packages')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
  }

  // Create service
  const { data: service, error } = await supabase
    .from('service_packages')
    .insert({
      tier_group_id: tier_group_id || null,
      name,
      slug,
      description,
      profession_type,
      price_base_paisa,
      price_govt_fees_paisa: price_govt_fees_paisa || 0,
      professional_share_percent: professional_share_percent || 70,
      workflow_stages,
      sla_working_days,
      situation_tags: situation_tags || [],
      state_pricing: state_pricing || null,
      is_active: is_active || false,
    })
    .select()
    .single()

  if (error) {
    console.error('Service creation error:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }

  // Audit log
  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: 'create_service',
    target_type: 'service',
    target_id: service.id,
    notes: `Created service: ${name}`,
  })

  return NextResponse.json({ success: true, service })
}

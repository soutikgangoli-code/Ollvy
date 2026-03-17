import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminSupabase()

  const { data: tierGroups, error } = await supabase
    .from('tier_groups')
    .select('id, name, is_active')
    .order('name')

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch tier groups' }, { status: 500 })
  }

  return NextResponse.json({ tierGroups })
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, tiers } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const supabase = createAdminSupabase()

    // Create the tier group
    const { data: tierGroup, error: createError } = await supabase
      .from('tier_groups')
      .insert({
        name,
        description,
        is_active: true,
      })
      .select()
      .single()

    if (createError || !tierGroup) {
      console.error('Create tier group error:', createError)
      return NextResponse.json({ error: 'Failed to create tier group' }, { status: 500 })
    }

    // Create tiers as service packages with tier_group_id
    if (tiers && tiers.length > 0) {
      const tierInserts = tiers.map((tier: any) => ({
        name: tier.name,
        tier_group_id: tierGroup.id,
        tier_label: tier.name,
        price_base_paisa: tier.price_paisa,
        display_order: tier.display_order,
        order_type: 'recurring',
        billing_cycle: 'monthly',
        is_active: true,
        sla_working_days: 1,
        urgency_score: 1,
        price_govt_fees_paisa: 0,
        price_gst_rate: 18,
      }))

      const { error: tiersError } = await supabase
        .from('service_packages')
        .insert(tierInserts)

      if (tiersError) {
        console.error('Create tiers error:', tiersError)
        // Don't fail the whole operation, the group was created
      }
    }

    return NextResponse.json({ ok: true, tierGroup })
  } catch (error) {
    console.error('POST tier-groups error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

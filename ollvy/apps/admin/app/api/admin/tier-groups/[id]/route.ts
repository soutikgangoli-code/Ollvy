import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const body = await request.json()
    const { name, description, tiers } = body

    const supabase = createAdminSupabase()

    // Update the tier group
    const { error: updateError } = await supabase
      .from('tier_groups')
      .update({
        name,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('Update tier group error:', updateError)
      return NextResponse.json({ error: 'Failed to update tier group' }, { status: 500 })
    }

    // Update tiers if provided
    if (tiers && tiers.length > 0) {
      // Delete existing service packages with this tier_group_id (that don't have orders)
      const { error: deleteError } = await supabase
        .from('service_packages')
        .delete()
        .eq('tier_group_id', id)
        .is('id', null) // This condition ensures we don't delete packages that might have orders
        // Actually, we should update instead of delete/recreate
        // For now, let's just update the prices

      // Upsert tiers
      for (const tier of tiers) {
        // Try to find existing service package with this tier_group_id and tier_label
        const { data: existingPackage } = await supabase
          .from('service_packages')
          .select('id')
          .eq('tier_group_id', id)
          .eq('tier_label', tier.name)
          .single()

        if (existingPackage) {
          // Update existing
          await supabase
            .from('service_packages')
            .update({
              price_base_paisa: tier.price_paisa,
              display_order: tier.display_order,
            })
            .eq('id', existingPackage.id)
        } else {
          // Insert new
          await supabase
            .from('service_packages')
            .insert({
              name: tier.name,
              tier_group_id: id,
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
            })
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('PATCH tier-groups error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const supabase = createAdminSupabase()

    // Check if any service packages use this tier group
    const { count } = await supabase
      .from('service_packages')
      .select('id', { count: 'exact', head: true })
      .eq('tier_group_id', id)

    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tier group with associated services' },
        { status: 400 }
      )
    }

    // Delete the tier group
    const { error: deleteError } = await supabase
      .from('tier_groups')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Delete tier group error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete tier group' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE tier-groups error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

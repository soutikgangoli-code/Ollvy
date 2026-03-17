import { createAdminSupabase } from '@/lib/supabase-server'
import TierGroupsClient from './TierGroupsClient'

export const dynamic = 'force-dynamic'

export default async function TierGroupsPage() {
  const supabase = createAdminSupabase()

  const { data: tierGroups } = await supabase
    .from('tier_groups')
    .select(`
      id,
      name,
      description,
      created_at,
      retainer_tiers (
        id,
        name,
        display_order,
        price_paisa
      )
    `)
    .order('name')

  // Get tier count and services using each group
  const groupsWithMeta = await Promise.all(
    (tierGroups || []).map(async (group) => {
      const { count: serviceCount } = await supabase
        .from('service_packages')
        .select('id', { count: 'exact', head: true })
        .eq('tier_group_id', group.id)

      return {
        ...group,
        tierCount: group.retainer_tiers?.length || 0,
        serviceCount: serviceCount || 0,
        tiers: (group.retainer_tiers || []).sort((a: any, b: any) => a.display_order - b.display_order),
      }
    })
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-body-text">Tier Groups</h1>
          <p className="text-muted-text mt-1">Manage service tier groups and pricing</p>
        </div>
      </div>

      <TierGroupsClient tierGroups={groupsWithMeta} />
    </div>
  )
}

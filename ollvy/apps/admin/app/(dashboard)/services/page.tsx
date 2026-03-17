import { createAdminSupabase } from '@/lib/supabase-server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const supabase = createAdminSupabase()

  const { data: services } = await supabase
    .from('service_packages')
    .select(`
      id,
      name,
      slug,
      is_active,
      profession_type,
      sla_working_days,
      created_at,
      tier_groups (id, name)
    `)
    .order('created_at', { ascending: false })

  const { data: tierGroups } = await supabase
    .from('tier_groups')
    .select('id, name, is_active')
    .order('name')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-body-text">Services</h1>
          <p className="text-muted-text mt-1">Manage service packages and tier groups</p>
        </div>
        <Link href="/services/builder" className="btn-primary">
          Create Service
        </Link>
      </div>

      {/* Tier Groups */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-body-text">Tier Groups</h2>
          <Link href="/services/tier-groups/new" className="text-navy hover:underline text-sm">
            + Add Tier Group
          </Link>
        </div>
        {tierGroups && tierGroups.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tierGroups.map((group) => (
              <Link
                key={group.id}
                href={`/services/tier-groups/${group.id}`}
                className="p-4 border border-border rounded-lg hover:bg-gray-50"
              >
                <p className="font-medium">{group.name}</p>
                <span className={`badge badge-${group.is_active ? 'approved' : 'suspended'} mt-2`}>
                  {group.is_active ? 'Active' : 'Inactive'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-text">No tier groups created yet</p>
        )}
      </div>

      {/* Services Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Name</th>
                <th className="table-header">Slug</th>
                <th className="table-header">Tier Group</th>
                <th className="table-header">Profession</th>
                <th className="table-header">SLA</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services && services.length > 0 ? (
                services.map((service) => (
                  <tr key={service.id} className="border-b border-border hover:bg-gray-50">
                    <td className="table-cell font-medium">{service.name}</td>
                    <td className="table-cell font-mono text-sm">{service.slug}</td>
                    <td className="table-cell">{(service.tier_groups as any)?.name || '-'}</td>
                    <td className="table-cell">{service.profession_type}</td>
                    <td className="table-cell">{service.sla_working_days} days</td>
                    <td className="table-cell">
                      <span className={`badge badge-${service.is_active ? 'approved' : 'suspended'}`}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Link href={`/services/${service.id}`} className="text-navy hover:underline text-sm">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="table-cell text-center text-muted-text py-12">
                    No services created yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

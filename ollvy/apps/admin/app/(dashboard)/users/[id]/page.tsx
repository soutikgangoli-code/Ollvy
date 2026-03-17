import { createAdminSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import UserDetailClient from './UserDetailClient'

export const dynamic = 'force-dynamic'

export default async function UserDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createAdminSupabase()

  // Fetch user
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !user) {
    notFound()
  }

  // Fetch orders
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total_paisa_snapshot,
      created_at,
      service_packages (name),
      professionals (display_name)
    `)
    .eq('user_id', params.id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Fetch retainers
  const { data: retainers } = await supabase
    .from('retainers')
    .select(`
      id,
      status,
      billing_cycle,
      retainer_tiers (name, price_paisa),
      professionals (display_name)
    `)
    .eq('user_id', params.id)
    .order('created_at', { ascending: false })

  // Fetch disputes
  const { data: disputes } = await supabase
    .from('disputes')
    .select(`
      id,
      reason,
      status,
      opened_at,
      orders (id, service_packages (name))
    `)
    .eq('orders.user_id', params.id)
    .order('opened_at', { ascending: false })

  // Fetch fraud signals
  const { data: fraudSignals } = await supabase
    .from('fraud_signals')
    .select('*')
    .eq('user_id', params.id)
    .order('created_at', { ascending: false })

  // Fetch audit log
  const { data: auditLog } = await supabase
    .from('admin_audit_log')
    .select('*')
    .eq('target_type', 'user')
    .eq('target_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/users" className="text-muted-text hover:text-body-text">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-body-text">{user.phone}</h1>
            {user.is_flagged && <span className="badge badge-disputed">Flagged</span>}
            {user.is_restricted && <span className="badge badge-cancelled">Restricted</span>}
            {!user.is_flagged && !user.is_restricted && <span className="badge badge-approved">Active</span>}
          </div>
          <p className="text-muted-text mt-1">
            {user.city || 'Unknown city'} • {user.business_type || 'No business type'}
          </p>
        </div>
      </div>

      <UserDetailClient
        user={user}
        orders={orders || []}
        retainers={retainers || []}
        disputes={disputes || []}
        fraudSignals={fraudSignals || []}
        auditLog={auditLog || []}
      />
    </div>
  )
}

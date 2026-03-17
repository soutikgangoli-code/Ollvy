import { createAdminSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RetainerDetailClient from './RetainerDetailClient'

export const dynamic = 'force-dynamic'

export default async function RetainerDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createAdminSupabase()

  // Fetch retainer with all related data
  const { data: retainer, error } = await supabase
    .from('retainers')
    .select(`
      *,
      users!inner (id, phone, city, business_type),
      retainer_tiers!inner (id, name, hours_per_month, price_paisa, tier_group_id),
      professionals (id, display_name, phone)
    `)
    .eq('id', params.id)
    .single()

  if (error || !retainer) {
    notFound()
  }

  // Fetch usage logs
  const { data: usageLogs } = await supabase
    .from('retainer_usage_logs')
    .select(`
      id,
      hours_used,
      description,
      created_at,
      orders (id, service_packages (name))
    `)
    .eq('retainer_id', params.id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Fetch billing history
  const { data: billingHistory } = await supabase
    .from('retainer_invoices')
    .select('*')
    .eq('retainer_id', params.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch pause history
  const { data: pauseHistory } = await supabase
    .from('retainer_pause_history')
    .select('*')
    .eq('retainer_id', params.id)
    .order('paused_at', { ascending: false })

  // Fetch audit log
  const { data: auditLog } = await supabase
    .from('admin_audit_log')
    .select('*')
    .eq('target_type', 'retainer')
    .eq('target_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/retainers" className="text-muted-text hover:text-body-text">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-body-text">
              {retainer.retainer_tiers.name} Retainer
            </h1>
            <span className={`badge badge-${retainer.status}`}>
              {retainer.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-muted-text mt-1">
            {retainer.users.city || 'Unknown'} • {retainer.billing_cycle}
          </p>
        </div>
      </div>

      <RetainerDetailClient
        retainer={retainer}
        usageLogs={usageLogs || []}
        billingHistory={billingHistory || []}
        pauseHistory={pauseHistory || []}
        auditLog={auditLog || []}
      />
    </div>
  )
}

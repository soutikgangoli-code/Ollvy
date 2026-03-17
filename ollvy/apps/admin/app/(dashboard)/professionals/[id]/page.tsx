import { createAdminSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProfessionalDetailClient from './ProfessionalDetailClient'

export const dynamic = 'force-dynamic'

export default async function ProfessionalDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createAdminSupabase()

  // Fetch professional with related data
  const { data: professional, error } = await supabase
    .from('professionals')
    .select(`
      *,
      professional_availability (current_active_orders, max_concurrent_orders),
      professional_situations (situation_tags)
    `)
    .eq('id', params.id)
    .single()

  if (error || !professional) {
    notFound()
  }

  // Fetch orders for this professional
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total_paisa_snapshot,
      created_at,
      service_packages (name)
    `)
    .eq('professional_id', params.id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      users (city)
    `)
    .eq('professional_id', params.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch strikes
  const { data: strikes } = await supabase
    .from('professional_strikes')
    .select('*')
    .eq('professional_id', params.id)
    .order('created_at', { ascending: false })

  // Fetch audit log
  const { data: auditLog } = await supabase
    .from('admin_audit_log')
    .select('*')
    .eq('target_type', 'professional')
    .eq('target_id', params.id)
    .order('created_at', { ascending: false })

  // Fetch payouts
  const { data: payouts } = await supabase
    .from('payouts')
    .select('*')
    .eq('professional_id', params.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/professionals" className="text-muted-text hover:text-body-text">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-body-text">{professional.display_name}</h1>
            <span className={`badge badge-${professional.status}`}>
              {professional.status.replace('_', ' ')}
            </span>
            {professional.is_available && (
              <span className="badge badge-approved">Available</span>
            )}
          </div>
          <p className="text-muted-text mt-1">
            {professional.profession_type} • {professional.city || 'No city'}
          </p>
        </div>
      </div>

      <ProfessionalDetailClient
        professional={professional}
        orders={orders || []}
        reviews={reviews || []}
        strikes={strikes || []}
        auditLog={auditLog || []}
        payouts={payouts || []}
      />
    </div>
  )
}

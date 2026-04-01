import { redirect } from 'next/navigation'
import { createServerSupabase, getUser } from '@/lib/supabase-server'
import { ProfilePageClient } from './ProfilePageClient'

interface PageProps {
  searchParams: Promise<{ setup?: string }>
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const params = await searchParams
  const isSetup = params.setup === 'true'

  const user = await getUser()

  if (!user) {
    redirect('/login?returnUrl=/profile')
  }

  const supabase = await createServerSupabase()

  // Single RPC call - ALL dashboard data at once
  const { data: dashboardData, error } = await supabase.rpc('get_user_dashboard')

  if (error) {
    console.error('Error fetching dashboard data:', error)
  }

  // Default empty dashboard data if RPC fails or returns null
  const initialDashboardData = dashboardData || {
    active_orders: [],
    completed_orders: [],
    retainers: [],
    compliance: [],
    doc_counts: {},
    stage_histories: {},
    work_doc_counts: {},
    document_groups: [],
  }

  return (
    <ProfilePageClient
      initialDashboardData={initialDashboardData}
      userData={user}
      isSetup={isSetup}
    />
  )
}

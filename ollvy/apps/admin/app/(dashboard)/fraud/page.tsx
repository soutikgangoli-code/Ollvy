import { createAdminSupabase } from '@/lib/supabase-server'
import FraudClient from './FraudClient'

export const dynamic = 'force-dynamic'

export default async function FraudPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const supabase = createAdminSupabase()
  const tab = searchParams.tab || 'flagged'

  // Fetch flagged users
  const { data: flaggedUsers } = await supabase
    .from('users')
    .select('id, phone, city, business_type, is_flagged, flag_reason, flagged_at')
    .eq('is_flagged', true)
    .order('flagged_at', { ascending: false })
    .limit(50)

  // Fetch fraud signals
  const { data: fraudSignals } = await supabase
    .from('fraud_signals')
    .select(`
      id,
      signal_type,
      description,
      severity,
      created_at,
      users (id, phone, city)
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  // Fetch restricted accounts
  const { data: restrictedAccounts } = await supabase
    .from('users')
    .select('id, phone, city, business_type, is_restricted, restriction_reason, restricted_at')
    .eq('is_restricted', true)
    .order('restricted_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-body-text">Fraud Management</h1>
        <p className="text-muted-text mt-1">Monitor and manage suspicious activity</p>
      </div>

      <FraudClient
        flaggedUsers={flaggedUsers || []}
        fraudSignals={fraudSignals || []}
        restrictedAccounts={restrictedAccounts || []}
        currentTab={tab}
      />
    </div>
  )
}

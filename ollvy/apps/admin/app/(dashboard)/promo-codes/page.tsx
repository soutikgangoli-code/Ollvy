import { createAdminSupabase } from '@/lib/supabase-server'
import PromoCodesClient from './PromoCodesClient'

export const dynamic = 'force-dynamic'

export default async function PromoCodesPage() {
  const supabase = createAdminSupabase()

  const { data: promoCodes } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-body-text">Promo Codes</h1>
          <p className="text-muted-text mt-1">Manage discount codes</p>
        </div>
      </div>

      <PromoCodesClient promoCodes={promoCodes || []} />
    </div>
  )
}

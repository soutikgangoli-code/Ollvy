export type AdminRole = 'super_admin' | 'ops_admin' | 'finance_admin'

export interface AdminUser {
  id: string
  auth_user_id: string
  name: string
  email: string
  role: AdminRole
  is_active: boolean
  last_login_at: string | null
  created_at: string
}

export interface AdminSession {
  admin_user_id: string
  adminId: string // alias for admin_user_id
  email: string
  name: string
  role: AdminRole
  totp_verified: boolean
  expires_at: number
}

export interface Order {
  id: string
  user_id: string
  service_package_id: string
  professional_id: string | null
  status: string
  total_paisa_snapshot: number
  created_at: string
  assigned_at: string | null
  completed_at: string | null
  service_packages?: {
    id: string
    name: string
    slug: string
    sla_working_days: number
  }
  users?: {
    id: string
    city: string
    business_type: string
  }
  professionals?: {
    id: string
    display_name: string
    city: string
  }
}

export interface RetainerSubscription {
  id: string
  user_id: string
  service_package_id: string
  assigned_professional_id: string | null
  status: string
  billing_cycle: string
  monthly_price_paisa: number
  next_billing_date: string | null
  pause_count: number
  started_at: string
  service_packages?: {
    id: string
    name: string
    tier_label: string | null
  }
  users?: {
    id: string
    city: string
  }
  professionals?: {
    id: string
    display_name: string
  }
}

export interface Professional {
  id: string
  auth_user_id: string
  display_name: string
  city: string
  profession_type: string
  status: string
  is_available: boolean
  strike_count: number
  avg_rating: number | null
  created_at: string
}

export interface User {
  id: string
  phone: string
  city: string | null
  state: string | null
  business_type: string | null
  business_name: string | null
  subscription_tier: string
  compliance_health_score: number | null
  profile_completeness_score: number | null
  is_suspended: boolean
  created_at: string
}

export interface Dispute {
  id: string
  order_id: string
  user_id: string
  reason: string
  status: string
  resolution: string | null
  opened_at: string
  resolved_at: string | null
  orders?: Order
}

export interface ServicePackage {
  id: string
  name: string
  slug: string
  short_description: string | null
  long_description: string | null
  category: string
  order_type: string
  price_base_paisa: number
  price_govt_fees_paisa: number
  price_gst_rate: number
  sla_working_days: number
  workflow_stages: any[]
  situation_tags: string[]
  tier_group_id: string | null
  tier_label: string | null
  is_active: boolean
  urgency_score: number
  created_at: string
}

export interface PromoCode {
  id: string
  code: string
  discount_type: 'percent' | 'flat'
  discount_value: number
  applicable_to: string[] | null
  min_order_paisa: number | null
  per_user_limit: number
  max_total_uses: number | null
  current_uses: number
  expires_at: string | null
  is_active: boolean
  created_at: string
}

// Role permissions
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: [
    'dashboard', 'orders', 'retainers', 'quotes', 'disputes', 'sla', 'capacity',
    'professionals', 'users', 'services', 'tier-groups', 'invoices', 'payouts',
    'analytics', 'settings', 'fraud', 'promo-codes'
  ],
  ops_admin: [
    'dashboard', 'orders', 'retainers', 'quotes', 'disputes', 'sla', 'capacity',
    'professionals', 'users', 'services', 'tier-groups', 'invoices',
    'analytics', 'fraud', 'promo-codes'
  ],
  finance_admin: [
    'dashboard', 'invoices', 'payouts', 'analytics'
  ],
}

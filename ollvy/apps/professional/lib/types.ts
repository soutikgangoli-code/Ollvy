export type ProfessionType = 'ca' | 'lawyer' | 'cs' | 'licensing_consultant' | 'payroll_specialist' | 'registered_valuer'

export type ProfessionalStatus = 'pending' | 'pending_review' | 'approved' | 'rejected' | 'suspended'

export interface Professional {
  id: string
  auth_user_id: string
  name: string
  display_name?: string
  phone: string
  email?: string
  profession_type: ProfessionType
  bio?: string
  experience_years?: number
  languages?: string[]
  service_areas?: string[]
  cities?: string[]
  status: ProfessionalStatus
  strike_count: number
  last_assigned_at?: string
  fcm_token?: string
  web_push_subscription?: any
  is_available: boolean
  onboarding_step: number
  max_concurrent_orders: number
  rejection_reason?: string
  reapply_after_date?: string
  created_at: string
  updated_at: string
}

export interface ProfessionalCertification {
  id: string
  professional_id: string
  cert_type: string
  cert_number?: string
  issuing_body?: string
  issued_date?: string
  expiry_date?: string
  document_url?: string
  status: 'pending' | 'verified' | 'invalid' | 'expired'
  rejection_reason?: string
  created_at: string
}

export interface ProfessionalBankAccount {
  id: string
  professional_id: string
  account_holder_name: string
  account_number: string
  ifsc_code: string
  bank_name?: string
  razorpay_contact_id?: string
  razorpay_fund_account_id?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface ProfessionalAvailability {
  id: string
  professional_id: string
  city: string
  is_available: boolean
  max_concurrent_orders: number
  current_active_orders: number
  on_leave_until?: string
}

export interface Order {
  id: string
  user_id: string
  professional_id?: string
  service_package_id: string
  retainer_subscription_id?: string
  chat_conversation_id?: string
  order_type: 'one_time' | 'recurring'
  status: 'pending_assignment' | 'waitlisted' | 'in_progress' | 'completed' | 'disputed' | 'cancelled'
  city?: string
  price_base_paisa_snapshot: number
  price_govt_fees_paisa_snapshot: number
  price_gst_paisa_snapshot: number
  pro_discount_paisa_snapshot: number
  promo_discount_paisa_snapshot: number
  total_paisa_snapshot: number
  payment_paused: boolean
  force_assigned: boolean
  govt_fees_paid_paisa?: number
  govt_fee_receipt_path?: string
  govt_fee_reimbursement_status?: string
  completed_at?: string
  created_at: string
  updated_at: string
  // Joined data
  service_package?: ServicePackage
  user?: { city?: string; business_type?: string }
  order_stage_history?: OrderStageHistory[]
}

export interface ServicePackage {
  id: string
  name: string
  short_description?: string
  filter_category_id?: string
  tier_group_id?: string
  tier_label?: string
  order_type: 'one_time' | 'recurring'
  billing_cycle?: 'monthly' | 'quarterly' | 'annual' | 'one_time'
  price_base_paisa: number
  price_govt_fees_paisa: number
  price_gst_rate: number
  price_display_note?: string
  price_varies_by_state: boolean
  sla_working_days: number
  workflow_stages?: WorkflowStage[]
  urgency_score: number
  display_order: number
  is_active: boolean
}

export interface WorkflowStage {
  stage_key: string
  stage_name: string
  sla_working_days: number
  wait_for_govt?: boolean
}

export interface OrderStageHistory {
  id: string
  order_id: string
  stage_key: string
  stage_name: string
  started_at: string
  stage_due_date: string
  completed_at?: string
  notes?: string
}

export interface RetainerSubscription {
  id: string
  user_id: string
  service_package_id: string
  assigned_professional_id?: string
  razorpay_subscription_id?: string
  billing_cycle: 'monthly' | 'quarterly' | 'annual'
  monthly_price_paisa: number
  first_billing_date?: string
  next_billing_date?: string
  status: 'active' | 'paused' | 'cancelled' | 'payment_failed' | 'onboarding'
  is_trial_active: boolean
  pause_count_this_year: number
  pause_start_date?: string
  started_at?: string
  onboarding_completed_at?: string
  created_at: string
  // Joined data
  service_package?: ServicePackage
  user?: { business_type?: string; city?: string }
}

export interface Payout {
  id: string
  order_id?: string
  retainer_subscription_id?: string
  professional_id: string
  amount_paisa: number
  platform_fee_paisa: number
  type: 'order' | 'retainer_cycle' | 'govt_fee_reimbursement'
  status: 'pending' | 'held' | 'batched' | 'paid' | 'failed'
  billing_period?: string
  paid_at?: string
  razorpay_payout_id?: string
  created_at: string
}

export interface Document {
  id: string
  order_id: string
  professional_id?: string
  document_type: 'required_input' | 'professional_deliverable' | 'admin_upload'
  file_url: string
  visible_to_user: boolean
  parsed_data?: any
  created_at: string
}

export interface DocumentRequest {
  id: string
  order_id: string
  professional_id: string
  message: string
  due_date?: string
  fulfilled_at?: string
  created_at: string
}

// City list for India (matching mobile app)
export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata',
  'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar',
  'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad', 'Ranchi', 'Howrah',
  'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai',
  'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli', 'Mysore',
  'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Tiruppur', 'Moradabad', 'Jalandhar',
  'Bhubaneswar', 'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur',
  'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack',
  'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol',
  'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar',
  'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli',
  'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon',
  'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtala', 'Other'
] as const

export type IndianCity = typeof INDIAN_CITIES[number]

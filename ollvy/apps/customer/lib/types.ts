// Service types

// WorkflowStage for order tracking (used in OrderTimeline)
export interface WorkflowStage {
  stage_key: string
  stage_name: string
  sla_working_days: number
  wait_for_govt?: boolean
}

// WorkflowDisplayStage for checkout timeline display (from service_packages.workflow_stages)
export interface WorkflowDisplayStage {
  step: number
  title: string
  timeline: string
  body: string
  visual?: string
  milestone?: string
  isCompletion?: boolean
}

export interface ServiceAddon {
  id: string
  name: string
  description: string
  pricePaisa: number
  govtFeePaisa: number
  required: boolean
  defaultSelected: boolean
}

export interface ServicePackage {
  id: string
  slug: string
  name: string
  short_description: string
  long_description?: string
  filter_category_id?: string
  tier_group_id?: string
  tier_label?: string
  order_type: 'one_time' | 'recurring'
  billing_cycle: 'one_time' | 'monthly' | 'quarterly' | 'yearly'
  price_base_paisa: number
  price_govt_fees_paisa: number
  price_gst_rate: number
  price_display_note?: string
  price_varies_by_state: boolean
  sla_working_days: number
  situation_tags: string[]
  workflow_stages: WorkflowDisplayStage[]
  urgency_score: number
  avg_rating?: number
  rating_count: number
  display_order: number
  is_active: boolean
  is_bundle?: boolean
  variants?: ServiceVariant[]
  addons?: ServiceAddon[]
  scope_included: string[]
  scope_excluded: string[]
  image_url?: string
  icon_name?: string
  created_at: string
  updated_at: string
}

export interface FilterCategory {
  id: string
  name: string
  slug: string
  icon_name?: string
  display_order: number
  is_active: boolean
}

// Order types
export type OrderStatus =
  | 'pending_assignment'
  | 'waitlisted'
  | 'in_progress'
  | 'completed'
  | 'disputed'
  | 'cancelled'

export interface OrderStageHistory {
  id: string
  order_id: string
  stage_key: string
  stage_name: string
  completed_at?: string
  due_at?: string
  sla_breached: boolean
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  professional_id?: string
  service_package_id: string
  chat_conversation_id?: string
  order_type: 'one_time' | 'recurring'
  status: OrderStatus
  city: string
  price_base_paisa_snapshot: number
  price_govt_fees_paisa_snapshot: number
  price_gst_paisa_snapshot: number
  pro_discount_paisa_snapshot: number
  promo_discount_paisa_snapshot: number
  total_paisa_snapshot: number
  payment_paused: boolean
  force_assigned: boolean
  govt_fees_paid_paisa: number
  govt_fee_receipt_path?: string
  govt_fee_reimbursement_status?: string
  promo_code_used?: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  feedback_given: boolean
  feedback_skipped: boolean
  engagement_agreed_at?: string
  variant_id?: string
  questionnaire_completed_at?: string
  questionnaire_step?: number
  completed_at?: string
  created_at: string
  updated_at: string
  // Joined data
  service_package?: ServicePackage
  order_addons?: OrderAddon[]
  order_documents?: OrderDocument[]
  professional?: Professional
  stage_history?: OrderStageHistory[]
}

export interface Professional {
  id: string
  full_name: string
  phone: string
  email: string
  professional_type: string
  bio?: string
  experience_years?: number
  avatar_url?: string
  avg_rating?: number
}

// Quote types
export type QuoteStatus = 'pending' | 'quoted' | 'accepted' | 'expired' | 'cancelled'

export interface QuoteRequest {
  id: string
  user_id: string
  service_package_id: string
  submitted_details: {
    state: string
    city: string
    requirements?: string
    business_name?: string
    gst_registered?: boolean
  }
  status: QuoteStatus
  confirmed_price_paisa?: number
  confirmed_govt_fees_paisa?: number
  quoted_at?: string
  expires_at?: string
  created_at: string
  service_package?: ServicePackage
}

// Chat types
export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  sender_type: 'user' | 'professional' | 'system'
  content: string
  message_type: 'text' | 'file' | 'system'
  file_path?: string
  file_name?: string
  file_size?: number
  read_at?: string
  created_at: string
}

// Retainer types
export type RetainerStatus = 'active' | 'paused' | 'cancelled' | 'onboarding' | 'payment_failed'

export interface RetainerSubscription {
  id: string
  user_id: string
  professional_id?: string
  tier_group_id: string
  tier_id: string
  status: RetainerStatus
  hours_per_month: number
  price_per_month_paisa: number
  current_cycle_start: string
  current_cycle_end: string
  hours_used_this_cycle: number
  razorpay_subscription_id?: string
  cancelled_at?: string
  paused_at?: string
  created_at: string
  service_package?: ServicePackage
  professional?: Professional
}

// Service variant types
export interface ServiceVariant {
  id: string
  label: string
  sublabel: string
  priceAdjustment?: number
  govtFeeAdjustment?: number
}

// Order document types
export interface OrderDocument {
  id: string
  order_id: string
  document_key: string
  document_label: string
  stage_key?: string
  is_required: boolean
  uploaded_at?: string
  file_url?: string
  file_name?: string
  verified_at?: string
  verified_by?: string
  rejection_reason?: string
  created_at: string
}

// Order addon types
export interface OrderAddon {
  id: string
  order_id: string
  addon_id: string
  addon_name: string
  price_paisa_snapshot: number
  govt_fee_paisa_snapshot: number
  created_at: string
}

// Work document types (documents exchanged during work process)
export type WorkDocumentDirection = 'to_customer' | 'from_customer'
export type WorkDocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected'

export interface OrderWorkDocument {
  id: string
  order_id: string
  professional_id?: string
  direction: WorkDocumentDirection
  document_label: string
  description?: string
  stage_key?: string
  status: WorkDocumentStatus
  file_url?: string
  file_name?: string
  due_date?: string
  uploaded_at?: string
  uploaded_by_type?: 'professional' | 'customer'
  verified_at?: string
  verified_by?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

// User types
export interface User {
  id: string
  auth_user_id: string
  phone: string
  business_name?: string
  business_type?: string
  gstin?: string
  state?: string
  city?: string
  address?: string
  subscription_tier: 'free' | 'pro'
  compliance_health_score: number
  profile_completeness_score: number
  is_returning: boolean
  avatar_url?: string
  referral_code: string
  referral_credit_paisa: number
  referral_credit_balance_paisa: number
  preferred_professional_id?: string
  created_at: string
}

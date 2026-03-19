// Auth Guard Helper Functions
// Shared authentication logic for edge functions

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSupabaseAdmin } from './supabase-admin.ts';

export interface AuthResult {
  success: boolean;
  userId?: string;
  error?: string;
  status?: number;
}

export interface ProfessionalAuthResult extends AuthResult {
  professionalId?: string;
}

export interface AdminAuthResult extends AuthResult {
  adminId?: string;
  role?: string;
}

/**
 * Verify JWT and extract user_id
 * For: HTTP POST (auth) endpoints
 */
export async function verifyUser(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    console.error('Auth: Missing Authorization header');
    return { success: false, error: 'Missing Authorization header', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('Auth: Token received, length:', token.length);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Auth: Missing env vars - URL:', !!supabaseUrl, 'ANON_KEY:', !!supabaseAnonKey);
    return { success: false, error: 'Server configuration error', status: 500 };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: authHeader },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.error('Auth: getUser failed -', error?.message || 'no user');
    return { success: false, error: `Invalid or expired token: ${error?.message || 'unknown'}`, status: 401 };
  }

  console.log('Auth: User verified, auth_user_id:', user.id);

  // Get the user's row from users table
  const supabaseAdmin = getSupabaseAdmin();
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (userError || !userData) {
    return { success: false, error: 'User not found', status: 401 };
  }

  return { success: true, userId: userData.id };
}

/**
 * Verify JWT and confirm user is a professional
 * For: HTTP POST (auth, professional) endpoints
 */
export async function verifyProfessional(req: Request): Promise<ProfessionalAuthResult> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    return { success: false, error: 'Missing Authorization header', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '');

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, error: 'Server configuration error', status: 500 };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: authHeader },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { success: false, error: 'Invalid or expired token', status: 401 };
  }

  // Check if user is a professional
  const supabaseAdmin = getSupabaseAdmin();
  const { data: professional, error: profError } = await supabaseAdmin
    .from('professionals')
    .select('id, status')
    .eq('auth_user_id', user.id)
    .single();

  if (profError || !professional) {
    return { success: false, error: 'Not a professional', status: 403 };
  }

  return {
    success: true,
    userId: user.id,
    professionalId: professional.id
  };
}

/**
 * Verify JWT and confirm user is an admin
 * For: HTTP POST (admin) endpoints
 */
export async function verifyAdmin(req: Request): Promise<AdminAuthResult> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    return { success: false, error: 'Missing Authorization header', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  // Test mode: allow service role key to act as super_admin
  if (serviceRoleKey && token === serviceRoleKey) {
    return {
      success: true,
      userId: 'service-role',
      adminId: 'service-role',
      role: 'super_admin'
    };
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, error: 'Server configuration error', status: 500 };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: authHeader },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { success: false, error: 'Invalid or expired token', status: 401 };
  }

  // Check if user is an admin
  const supabaseAdmin = getSupabaseAdmin();
  const { data: admin, error: adminError } = await supabaseAdmin
    .from('admin_users')
    .select('id, role, is_active')
    .eq('auth_user_id', user.id)
    .single();

  if (adminError || !admin) {
    return { success: false, error: 'Not an admin', status: 403 };
  }

  if (!admin.is_active) {
    return { success: false, error: 'Admin account is deactivated', status: 403 };
  }

  return {
    success: true,
    userId: user.id,
    adminId: admin.id,
    role: admin.role
  };
}

/**
 * Verify service role key for cron jobs
 * For: Cron endpoints
 */
export function verifyCron(req: Request): AuthResult {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    return { success: false, error: 'Missing Authorization header', status: 401 };
  }

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!serviceRoleKey) {
    return { success: false, error: 'Server configuration error', status: 500 };
  }

  // Check if the Authorization header contains the service role key
  if (authHeader !== `Bearer ${serviceRoleKey}`) {
    return { success: false, error: 'Invalid service role key', status: 401 };
  }

  return { success: true };
}

/**
 * Verify webhook signature (for Razorpay webhooks)
 * For: Webhook endpoints
 */
export function verifyWebhookSignature(req: Request, body: string, secret: string): boolean {
  const signature = req.headers.get('X-Razorpay-Signature');

  if (!signature) {
    return false;
  }

  // In production, implement HMAC SHA256 verification
  // For stub: return true
  return true;
}

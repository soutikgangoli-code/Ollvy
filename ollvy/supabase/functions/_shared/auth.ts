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
 * Hit Supabase Auth API directly with a hard timeout.
 *
 * The Supabase JS client doesn't expose a timeout on supabase.auth.getUser,
 * and that call has been observed in production to hang for 10+ seconds
 * before returning an HTML 5xx that the JS client then mis-parses as JSON.
 * Doing the fetch ourselves lets us:
 *   - bail out at a fixed timeout (no 10s waits while users stare at "Pay")
 *   - distinguish HTTP-status auth failures (401/403 = real token problem,
 *     do not retry) from network/5xx blips (= transient, retry)
 *   - return a clean structured error instead of a parsed-SyntaxError mess
 *
 * Returns the parsed user object on success, or throws an Error with a
 * `.status` property (when an HTTP status was returned) so the caller can
 * decide whether to retry.
 */
async function fetchAuthUser(
  supabaseUrl: string,
  anonKey: string,
  token: string,
  timeoutMs: number,
): Promise<{ id: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text();
      let errorMsg = `Auth API ${res.status}`;
      try {
        const parsed = JSON.parse(text);
        errorMsg = parsed.error_description || parsed.msg || parsed.error || errorMsg;
      } catch {
        errorMsg = `Auth API ${res.status}: ${text.slice(0, 80)}`;
      }
      const err = new Error(errorMsg) as Error & { status?: number };
      err.status = res.status;
      throw err;
    }
    const data = await res.json();
    if (!data?.id) {
      throw new Error('Auth API response missing user id');
    }
    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Verify JWT and extract user_id
 * For: HTTP POST (auth) endpoints
 *
 * Two-attempt loop with per-attempt 3s timeout. Retries on network errors,
 * timeouts, and 5xx responses (transient). Does NOT retry on 401/403 from
 * Auth (real token problem — retry won't help). Worst case ~6.5s; previous
 * implementation was unbounded and observed at 10.6s in production.
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

  let authUser: { id: string } | null = null;
  let lastErrorMessage: string | undefined;

  for (let attempt = 0; attempt < 2; attempt++) {
    const t0 = Date.now();
    try {
      authUser = await fetchAuthUser(supabaseUrl, supabaseAnonKey, token, 3000);
      if (attempt > 0) {
        console.log(`Auth: getUser succeeded on retry (${Date.now() - t0}ms)`);
      }
      break;
    } catch (e: unknown) {
      const elapsed = Date.now() - t0;
      const err = e as Error & { status?: number; name?: string };
      lastErrorMessage = err.message || 'unknown';
      console.error(
        `Auth: getUser failed (attempt ${attempt + 1}, ${elapsed}ms, status=${err.status ?? 'n/a'}, name=${err.name ?? 'n/a'}) -`,
        lastErrorMessage,
      );

      // Real auth failures (401/403) are not retryable — the token won't
      // become valid on a second try. Bail immediately.
      if (err.status === 401 || err.status === 403) {
        break;
      }

      // Everything else (timeout/AbortError, 5xx, network) is transient.
      // Short backoff then retry. Supabase 5xx blips usually clear in
      // <200ms; 250ms is enough without piling on latency.
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 250));
      }
    }
  }

  if (!authUser) {
    return {
      success: false,
      error: `Invalid or expired token: ${lastErrorMessage || 'unknown'}`,
      status: 401,
    };
  }

  console.log('Auth: User verified, auth_user_id:', authUser.id);

  // Get the user's row from users table
  const supabaseAdmin = getSupabaseAdmin();
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('auth_user_id', authUser.id)
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

  // Service role key grants super_admin access
  // SECURITY: This should only be used for internal system operations
  // In production, consider alerting on unexpected service role usage
  if (serviceRoleKey && token === serviceRoleKey) {
    // Log service role usage for audit trail
    const endpoint = req.url || 'unknown';
    const timestamp = new Date().toISOString();

    // Async audit logging - don't block the request
    logServiceRoleUsage(endpoint, timestamp).catch(err =>
      console.error('Failed to log service role usage:', err)
    );

    console.warn(`[AUDIT] Service role key used at ${timestamp} for endpoint: ${endpoint}`);

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
 *
 * SECURITY: Implements HMAC-SHA256 verification as required by Razorpay.
 * @see https://razorpay.com/docs/webhooks/validate-test/
 */
export async function verifyWebhookSignature(req: Request, body: string, secret: string): Promise<boolean> {
  const signature = req.headers.get('X-Razorpay-Signature');

  if (!signature) {
    console.error('Webhook verification failed: Missing X-Razorpay-Signature header');
    return false;
  }

  if (!secret) {
    console.error('Webhook verification failed: Missing webhook secret');
    return false;
  }

  try {
    const encoder = new TextEncoder();

    // Import the secret as an HMAC key
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Compute the HMAC signature
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body));

    // Convert to hex string
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time comparison to prevent timing attacks
    if (computedSignature.length !== signature.length) {
      console.error('Webhook verification failed: Signature length mismatch');
      return false;
    }

    let result = 0;
    for (let i = 0; i < computedSignature.length; i++) {
      result |= computedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
    }

    const isValid = result === 0;
    if (!isValid) {
      console.error('Webhook verification failed: Signature mismatch');
    }
    return isValid;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

/**
 * Log service role key usage for audit trail
 * SECURITY: Tracks when service role key is used for admin authentication
 */
async function logServiceRoleUsage(endpoint: string, timestamp: string): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();

    await supabase.from('admin_audit_log').insert({
      admin_user_id: null, // System/service role
      action: 'service_role_auth',
      target_type: 'system',
      target_id: null,
      notes: `Service role key used for admin authentication`,
      payload: {
        endpoint,
        timestamp,
        source: 'verifyAdmin',
      },
    });
  } catch (error) {
    // Log but don't throw - audit logging should not block the request
    console.error('Failed to write service role audit log:', error);
  }
}

import { createClient } from './supabase'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

/**
 * Call a Supabase Edge Function with auth
 */
export async function callFunction<T = unknown>(
  functionName: string,
  body?: Record<string, unknown>
): Promise<{ data: T | null; error: string | null }> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { data: null, error: 'Not authenticated' }
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const result = await response.json()

    if (!response.ok) {
      return { data: null, error: result.error || result.message || 'Request failed' }
    }

    return { data: result as T, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Request failed' }
  }
}

/**
 * Call send-otp (no auth required)
 */
export async function sendOtp(phone: string): Promise<{ data: { sent: boolean; expiresIn: number } | null; error: string | null }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { data: null, error: result.message || result.error || 'Failed to send OTP' }
    }

    return { data: result, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Request failed' }
  }
}

/**
 * Call verify-otp (no auth required)
 */
export async function verifyOtp(phone: string, otp: string): Promise<{
  data: { session: any; user: any; isNewUser: boolean } | null;
  error: string | null
}> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, otp }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { data: null, error: result.message || result.error || 'Invalid OTP' }
    }

    return { data: result, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Request failed' }
  }
}

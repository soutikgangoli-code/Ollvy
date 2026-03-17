// send-otp
// Sends OTP via MSG91 with rate limiting
//
// Spec from §22:
// Rate limiting via otp_rate_limits (max 5/hr, 3/10min). MSG91.
// Dev bypass: if phone ends in 0000, skip MSG91, store OTP as 000000.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const MSG91_AUTH_KEY = Deno.env.get('MSG91_AUTH_KEY');
const MSG91_TEMPLATE_ID = Deno.env.get('MSG91_TEMPLATE_ID');

// Rate limit constants
const MAX_ATTEMPTS_PER_HOUR = 5;
const MAX_ATTEMPTS_PER_10MIN = 3;
const OTP_EXPIRY_MINUTES = 10;

interface SendOtpRequest {
  phone: string;
}

interface RateLimitCheck {
  allowed: boolean;
  retryAfter?: number;
  attemptsInHour?: number;
  attemptsIn10Min?: number;
}

async function checkRateLimits(phone: string): Promise<RateLimitCheck> {
  const supabase = getSupabaseAdmin();
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const tenMinAgo = new Date(now.getTime() - 10 * 60 * 1000);

  // Get attempts in the last hour
  const { data: hourlyAttempts, error: hourlyError } = await supabase
    .from('otp_rate_limits')
    .select('id, window_start')
    .eq('phone', phone)
    .gte('window_start', oneHourAgo.toISOString())
    .order('window_start', { ascending: false });

  if (hourlyError) {
    console.error('Error checking hourly rate limits:', hourlyError);
    throw new Error('Failed to check rate limits');
  }

  const attemptsInHour = hourlyAttempts?.length || 0;

  // Check hourly limit
  if (attemptsInHour >= MAX_ATTEMPTS_PER_HOUR) {
    const oldestAttempt = hourlyAttempts[hourlyAttempts.length - 1];
    const oldestTime = new Date(oldestAttempt.window_start);
    const retryAfter = Math.ceil((oldestTime.getTime() + 60 * 60 * 1000 - now.getTime()) / 1000);
    return {
      allowed: false,
      retryAfter: Math.max(retryAfter, 1),
      attemptsInHour,
      attemptsIn10Min: 0
    };
  }

  // Get attempts in last 10 minutes
  const attemptsIn10Min = hourlyAttempts?.filter(
    a => new Date(a.window_start) >= tenMinAgo
  ).length || 0;

  // Check 10-minute limit
  if (attemptsIn10Min >= MAX_ATTEMPTS_PER_10MIN) {
    const recentAttempts = hourlyAttempts.filter(
      a => new Date(a.window_start) >= tenMinAgo
    );
    const oldestRecent = recentAttempts[recentAttempts.length - 1];
    const oldestTime = new Date(oldestRecent.window_start);
    const retryAfter = Math.ceil((oldestTime.getTime() + 10 * 60 * 1000 - now.getTime()) / 1000);
    return {
      allowed: false,
      retryAfter: Math.max(retryAfter, 1),
      attemptsInHour,
      attemptsIn10Min
    };
  }

  return { allowed: true, attemptsInHour, attemptsIn10Min };
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendViaMSG91(phone: string, otp: string): Promise<{ success: boolean; requestId?: string; error?: string }> {
  if (!MSG91_AUTH_KEY || !MSG91_TEMPLATE_ID) {
    console.error('MSG91 credentials not configured');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    // MSG91 Send OTP API
    const response = await fetch('https://control.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': MSG91_AUTH_KEY,
      },
      body: JSON.stringify({
        template_id: MSG91_TEMPLATE_ID,
        mobile: `91${phone}`,
        otp: otp,
      }),
    });

    const result = await response.json();

    if (result.type === 'success') {
      return { success: true, requestId: result.request_id };
    } else {
      console.error('MSG91 error:', result);
      return { success: false, error: result.message || 'Failed to send OTP' };
    }
  } catch (error) {
    console.error('MSG91 request failed:', error);
    return { success: false, error: 'SMS service unavailable' };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body: SendOtpRequest = await req.json();
    const { phone } = body;

    // Validate phone number (Indian mobile: 10 digits starting with 6-9)
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return new Response(
        JSON.stringify({ error: 'INVALID_PHONE', message: 'Please enter a valid 10-digit Indian mobile number' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Check rate limits
    const rateLimitCheck = await checkRateLimits(phone);

    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: 'RATE_LIMITED',
          retryAfter: rateLimitCheck.retryAfter,
          message: `Too many attempts. Please try again in ${Math.ceil(rateLimitCheck.retryAfter! / 60)} minutes.`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429,
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Dev bypass: if phone ends in 0000, skip MSG91
    const isDevBypass = phone.endsWith('0000');
    let otp: string;
    let msg91RequestId: string | null = null;

    if (isDevBypass) {
      otp = '000000';
    } else {
      otp = generateOtp();
      const msg91Result = await sendViaMSG91(phone, otp);

      if (!msg91Result.success) {
        return new Response(
          JSON.stringify({ error: 'SMS_FAILED', message: msg91Result.error }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      msg91RequestId = msg91Result.requestId || null;
    }

    // Insert OTP record
    const { error: insertError } = await supabase
      .from('otp_rate_limits')
      .insert({
        phone,
        otp_code: otp,
        msg91_request_id: msg91RequestId,
        attempt_count: 1,
        window_start: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        verified: false,
      });

    if (insertError) {
      console.error('Failed to insert OTP record:', insertError);
      return new Response(
        JSON.stringify({ error: 'SERVER_ERROR', message: 'Failed to process request' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Calculate remaining attempts
    const remainingHourly = MAX_ATTEMPTS_PER_HOUR - (rateLimitCheck.attemptsInHour || 0) - 1;
    const remaining10Min = MAX_ATTEMPTS_PER_10MIN - (rateLimitCheck.attemptsIn10Min || 0) - 1;

    return new Response(
      JSON.stringify({
        sent: true,
        expiresIn: OTP_EXPIRY_MINUTES * 60, // seconds
        remainingAttempts: Math.min(remainingHourly, remaining10Min),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('send-otp error:', error);
    return new Response(
      JSON.stringify({ error: 'SERVER_ERROR', message: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// verify-otp
// Verifies OTP and issues Supabase JWT session
//
// Spec from §22:
// Returns JWT on success. Dev bypass: 000000.
// On success: upsert users row, issue JWT, return { session, isNewUser }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

// Secret for generating deterministic passwords (phone-based auth)
const AUTH_SECRET = Deno.env.get('AUTH_PASSWORD_SECRET') || 'ollvy-auth-secret-2024';

function generateAuthPassword(phone: string): string {
  // Generate a deterministic password from phone + secret
  // In production, use a proper HMAC or similar
  return `${phone}_${AUTH_SECRET}_auth`;
}

function generateAuthEmail(phone: string): string {
  return `${phone}@phone.ollvy.local`;
}

function generateReferralCode(): string {
  // Generate a unique 8-character referral code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body: VerifyOtpRequest = await req.json();
    const { phone, otp } = body;

    // Validate inputs
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return new Response(
        JSON.stringify({ error: 'INVALID_PHONE', message: 'Invalid phone number' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return new Response(
        JSON.stringify({ error: 'INVALID_OTP', message: 'OTP must be 6 digits' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const now = new Date();

    // Find the most recent unverified OTP for this phone
    const { data: otpRecords, error: otpError } = await supabaseAdmin
      .from('otp_rate_limits')
      .select('*')
      .eq('phone', phone)
      .eq('verified', false)
      .gt('expires_at', now.toISOString())
      .order('window_start', { ascending: false })
      .limit(1);

    if (otpError) {
      console.error('Error fetching OTP records:', otpError);
      return new Response(
        JSON.stringify({ error: 'SERVER_ERROR', message: 'Failed to verify OTP' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Check if OTP exists and matches
    if (!otpRecords || otpRecords.length === 0) {
      return new Response(
        JSON.stringify({ error: 'INVALID_OTP', message: 'OTP expired or not found. Please request a new one.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    const otpRecord = otpRecords[0];

    // Verify OTP code
    if (otpRecord.otp_code !== otp) {
      return new Response(
        JSON.stringify({ error: 'INVALID_OTP', message: 'Incorrect OTP. Please try again.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    // Mark OTP as verified
    await supabaseAdmin
      .from('otp_rate_limits')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    // Auth credentials
    const email = generateAuthEmail(phone);
    const password = generateAuthPassword(phone);
    const fullPhone = `+91${phone}`;

    let authUser;
    let isNewUser = false;

    // Check if user already exists in Supabase Auth
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = existingUsers?.users?.find(u => u.phone === fullPhone || u.email === email);

    if (existingAuthUser) {
      authUser = existingAuthUser;
    } else {
      // Create new auth user
      const { data: newAuthData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        phone: fullPhone,
        phone_confirm: true,
        user_metadata: {
          phone,
        },
      });

      if (createError) {
        console.error('Error creating auth user:', createError);
        return new Response(
          JSON.stringify({ error: 'SERVER_ERROR', message: 'Failed to create user' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      authUser = newAuthData.user;
      isNewUser = true;
    }

    // Create a client for signing in (not admin, to get session)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Sign in to get session
    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Error signing in:', signInError);
      return new Response(
        JSON.stringify({ error: 'SERVER_ERROR', message: 'Failed to create session' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Check if user exists in users table
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, is_returning')
      .eq('auth_user_id', authUser.id)
      .single();

    let userId: string;

    if (existingUser) {
      // Update existing user
      userId = existingUser.id;
      isNewUser = false; // User exists in our users table

      await supabaseAdmin
        .from('users')
        .update({
          is_returning: true,
          updated_at: now.toISOString(),
        })
        .eq('id', existingUser.id);
    } else {
      // Create new user in users table
      const referralCode = generateReferralCode();

      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          auth_user_id: authUser.id,
          phone,
          referral_code: referralCode,
          is_returning: false,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error creating user record:', insertError);
        return new Response(
          JSON.stringify({ error: 'SERVER_ERROR', message: 'Failed to create user record' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      userId = newUser.id;
      isNewUser = true;
    }

    // Get user data for response
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    return new Response(
      JSON.stringify({
        session: signInData.session,
        user: userData,
        isNewUser,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('verify-otp error:', error);
    return new Response(
      JSON.stringify({ error: 'SERVER_ERROR', message: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

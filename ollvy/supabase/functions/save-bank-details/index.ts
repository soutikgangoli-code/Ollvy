// save-bank-details
// Full implementation per spec §22
//
// Create Razorpay Contact + Fund Account. Upsert professional_bank_accounts.
// Body: { account_holder_name, account_number, ifsc_code, bank_name? }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyProfessional } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID');
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');

interface SaveBankRequest {
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name?: string;
}

interface RazorpayContact {
  id: string;
  entity: string;
  name: string;
  type: string;
}

interface RazorpayFundAccount {
  id: string;
  entity: string;
  contact_id: string;
  account_type: string;
  bank_account: {
    ifsc: string;
    bank_name: string;
    name: string;
    notes: string[];
    account_number: string;
  };
}

async function createRazorpayContact(
  name: string,
  email: string,
  phone: string,
  referenceId: string
): Promise<{ contact?: RazorpayContact; error?: string }> {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.log('Razorpay credentials not configured - using test mode');
    return {
      contact: {
        id: `cont_test_${Date.now()}`,
        entity: 'contact',
        name,
        type: 'vendor',
      },
    };
  }

  try {
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    const response = await fetch('https://api.razorpay.com/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        name,
        email,
        contact: phone,
        type: 'vendor',
        reference_id: referenceId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Razorpay contact creation failed:', result);
      return { error: result.error?.description || 'Failed to create Razorpay contact' };
    }

    return { contact: result };
  } catch (error) {
    console.error('Razorpay contact API error:', error);
    return { error: 'Failed to connect to payment service' };
  }
}

async function createRazorpayFundAccount(
  contactId: string,
  accountHolderName: string,
  accountNumber: string,
  ifscCode: string
): Promise<{ fundAccount?: RazorpayFundAccount; error?: string }> {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.log('Razorpay credentials not configured - using test mode');
    return {
      fundAccount: {
        id: `fa_test_${Date.now()}`,
        entity: 'fund_account',
        contact_id: contactId,
        account_type: 'bank_account',
        bank_account: {
          ifsc: ifscCode,
          bank_name: 'Test Bank',
          name: accountHolderName,
          notes: [],
          account_number: accountNumber,
        },
      },
    };
  }

  try {
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    const response = await fetch('https://api.razorpay.com/v1/fund_accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        contact_id: contactId,
        account_type: 'bank_account',
        bank_account: {
          name: accountHolderName,
          ifsc: ifscCode,
          account_number: accountNumber,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Razorpay fund account creation failed:', result);
      return { error: result.error?.description || 'Failed to create fund account' };
    }

    return { fundAccount: result };
  } catch (error) {
    console.error('Razorpay fund account API error:', error);
    return { error: 'Failed to connect to payment service' };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify JWT and confirm user is a professional
    const authResult = await verifyProfessional(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 403,
        }
      );
    }

    const professionalId = authResult.professionalId;
    const supabase = getSupabaseAdmin();

    // Parse request body
    const body: SaveBankRequest = await req.json();
    const { account_holder_name, account_number, ifsc_code, bank_name } = body;

    // Validate required fields
    if (!account_holder_name?.trim()) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Account holder name is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!account_number || account_number.length < 8 || account_number.length > 18) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Valid account number is required (8-18 digits)' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Validate IFSC code format (4 letters + 0 + 6 alphanumeric)
    if (!ifsc_code || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc_code.toUpperCase())) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Valid IFSC code is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Get professional data
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('id, name, email, phone')
      .eq('id', professionalId)
      .single();

    if (profError || !professional) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Professional not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Check for existing bank account
    const { data: existingBank } = await supabase
      .from('professional_bank_accounts')
      .select('id, razorpay_contact_id, razorpay_fund_account_id, is_verified')
      .eq('professional_id', professionalId)
      .single();

    // If already verified, don't allow changes
    if (existingBank?.is_verified) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Bank account is already verified. Contact support to make changes.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    let razorpayContactId = existingBank?.razorpay_contact_id;
    let razorpayFundAccountId = existingBank?.razorpay_fund_account_id;

    // Create Razorpay Contact if doesn't exist
    if (!razorpayContactId) {
      const { contact, error: contactError } = await createRazorpayContact(
        professional.name || account_holder_name,
        professional.email || `${professional.phone}@phone.ollvy.local`,
        professional.phone,
        professionalId
      );

      if (contactError) {
        return new Response(
          JSON.stringify({ ok: false, error: contactError }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      razorpayContactId = contact!.id;
    }

    // Create Razorpay Fund Account
    const { fundAccount, error: fundError } = await createRazorpayFundAccount(
      razorpayContactId,
      account_holder_name.trim(),
      account_number,
      ifsc_code.toUpperCase()
    );

    if (fundError) {
      return new Response(
        JSON.stringify({ ok: false, error: fundError }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    razorpayFundAccountId = fundAccount!.id;

    // Upsert bank account record
    const bankData = {
      professional_id: professionalId,
      account_holder_name: account_holder_name.trim(),
      account_number,
      ifsc_code: ifsc_code.toUpperCase(),
      bank_name: bank_name || fundAccount!.bank_account?.bank_name || null,
      razorpay_contact_id: razorpayContactId,
      razorpay_fund_account_id: razorpayFundAccountId,
      is_verified: false, // Admin must verify
      updated_at: new Date().toISOString(),
    };

    const { data: bankAccount, error: upsertError } = existingBank
      ? await supabase
          .from('professional_bank_accounts')
          .update(bankData)
          .eq('id', existingBank.id)
          .select()
          .single()
      : await supabase
          .from('professional_bank_accounts')
          .insert(bankData)
          .select()
          .single();

    if (upsertError) {
      console.error('Error saving bank account:', upsertError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to save bank details' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Create admin notification
    await supabase
      .from('admin_notifications')
      .insert({
        type: 'bank_details_submitted',
        title: 'Bank details verification needed',
        body: `Professional ${professional.name || professionalId} submitted bank details for verification.`,
        related_id: professionalId,
        related_type: 'professional',
      });

    return new Response(
      JSON.stringify({
        ok: true,
        bank_account: {
          id: bankAccount.id,
          account_holder_name: bankAccount.account_holder_name,
          account_number_last4: account_number.slice(-4),
          ifsc_code: bankAccount.ifsc_code,
          bank_name: bankAccount.bank_name,
          is_verified: bankAccount.is_verified,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('save-bank-details error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

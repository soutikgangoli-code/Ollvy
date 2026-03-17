// request-document
// HTTP POST (auth, professional)
// Creates document_requests row
// Notifies user

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyProfessional } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface RequestDocumentInput {
  order_id: string;
  message: string;
  due_date?: string; // ISO date string
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

    const professionalId = authResult.professionalId!;
    const body: RequestDocumentInput = await req.json();
    const { order_id, message, due_date } = body;

    // Validate input
    if (!order_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'order_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!message || message.trim().length < 5) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Please provide a detailed message describing what documents are needed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get the order and verify professional owns it
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        user_id,
        professional_id,
        status,
        service_packages (
          name
        )
      `)
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Order not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Verify this professional owns the order
    if (order.professional_id !== professionalId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'You can only request documents for your own orders' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    // Check if order is in a valid state for document requests
    const validStatuses = ['pending_assignment', 'in_progress', 'assigned'];
    if (!validStatuses.includes(order.status)) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: `Cannot request documents for an order with status "${order.status}"`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Parse due_date if provided
    let parsedDueDate: string | null = null;
    if (due_date) {
      const date = new Date(due_date);
      if (isNaN(date.getTime())) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Invalid due_date format' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
      parsedDueDate = date.toISOString().split('T')[0];
    }

    // Create document request
    const { data: docRequest, error: insertError } = await supabase
      .from('document_requests')
      .insert({
        order_id,
        professional_id: professionalId,
        message: message.trim(),
        due_date: parsedDueDate,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create document request:', insertError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to create document request. Please try again.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Get professional name for notification
    const { data: professional } = await supabase
      .from('professionals')
      .select('name')
      .eq('id', professionalId)
      .single();

    // Send notification to user
    await supabase.from('notifications').insert({
      user_id: order.user_id,
      type: 'document_requested',
      title: 'Document Requested',
      body: `Your specialist has requested documents for order ${order.order_number}: "${message.trim().substring(0, 100)}${message.length > 100 ? '...' : ''}"`,
      data: {
        order_id,
        document_request_id: docRequest.id,
        message: message.trim(),
        due_date: parsedDueDate,
      },
    });

    // Also send a chat message for visibility
    // First, get the chat conversation for this order
    const { data: conversation } = await supabase
      .from('chat_conversations')
      .select('id')
      .eq('order_id', order_id)
      .single();

    if (conversation) {
      await supabase.from('chat_messages').insert({
        conversation_id: conversation.id,
        sender_id: professionalId,
        sender_type: 'professional',
        content: `📎 Document requested: ${message.trim()}${parsedDueDate ? `\n\nPlease upload by ${new Date(parsedDueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}`,
        message_type: 'document_request',
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        document_request_id: docRequest.id,
        message: 'Document request sent to client',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('request-document error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

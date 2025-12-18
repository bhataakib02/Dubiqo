import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TicketReplyRequest {
  ticket_id: string;
  user_id: string;
  message: string;
  is_internal?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: TicketReplyRequest = await req.json();
    console.log('Ticket reply request:', body);

    // Verify ticket exists
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('id, status, user_id')
      .eq('id', body.ticket_id)
      .single();

    if (ticketError || !ticket) {
      throw new Error('Ticket not found');
    }

    // Create reply message
    const { data: reply, error: replyError } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: body.ticket_id,
        user_id: body.user_id,
        message: body.message.trim(),
        is_internal: body.is_internal || false,
      })
      .select()
      .single();

    if (replyError) {
      console.error('Error creating reply:', replyError);
      throw replyError;
    }

    // Update ticket status if it was closed
    if (ticket.status === 'closed') {
      await supabase
        .from('tickets')
        .update({ status: 'open', updated_at: new Date().toISOString() })
        .eq('id', body.ticket_id);
    } else {
      // Update ticket updated_at
      await supabase
        .from('tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', body.ticket_id);
    }

    console.log('Ticket reply created:', reply);

    // TODO: Send email notification to ticket owner
    // TODO: Send notification if staff replied to client

    return new Response(
      JSON.stringify({
        success: true,
        reply,
        message: 'Reply added successfully',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ticket-reply:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

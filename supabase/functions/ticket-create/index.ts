import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TicketRequest {
  title: string;
  description: string;
  category?: string;
  priority?: string;
  client_id?: string;
  name?: string;
  email?: string;
  website_url?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: TicketRequest = await req.json();
    console.log('Ticket create request:', body);

    // Validate required fields
    if (!body.title?.trim() || !body.description?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Title and description are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For unauthenticated users, create or find a profile by email
    let clientId = body.client_id;
    
    if (!clientId && body.email) {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', body.email)
        .single();

      if (existingProfile) {
        clientId = existingProfile.id;
      }
    }

    // Create ticket record
    const ticketData: Record<string, unknown> = {
      title: body.title.trim(),
      description: body.description.trim(),
      category: body.category || 'general',
      priority: body.priority || 'medium',
      status: 'open',
      metadata: {
        name: body.name,
        email: body.email,
        website_url: body.website_url,
        source: 'support_form',
      },
    };

    // Only set client_id if we have one (for authenticated users)
    if (clientId) {
      ticketData.client_id = clientId;
    }

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert(ticketData)
      .select()
      .single();

    if (ticketError) {
      console.error('Error creating ticket:', ticketError);
      throw ticketError;
    }

    // Create initial ticket message
    if (clientId) {
      await supabase.from('ticket_messages').insert({
        ticket_id: ticket.id,
        user_id: clientId,
        message: body.description.trim(),
        is_internal: false,
      });
    }

    console.log('Ticket created:', ticket);

    // TODO: Send confirmation email via SendGrid
    // TODO: Send notification to support staff

    return new Response(
      JSON.stringify({ 
        success: true, 
        ticket,
        message: 'Your support request has been submitted. We\'ll respond within 24 hours.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ticket-create:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

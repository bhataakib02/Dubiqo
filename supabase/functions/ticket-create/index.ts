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

    // For unauthenticated users, find a profile by email or use system profile
    let clientId = body.client_id;
    
    if (!clientId && body.email) {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', body.email)
        .maybeSingle();

      if (existingProfile) {
        clientId = existingProfile.id;
      } else {
        // For unauthenticated users without a profile, use a system support profile
        // This allows support requests from anyone, even without an account
        // First, try to find or create a system support profile
        let { data: systemProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', 'support@dubiqo.com')
          .maybeSingle();
        
        // If system profile doesn't exist, we'll need to create it
        // But it requires an auth user, so for now we'll use a fallback
        // In production, ensure a support@dubiqo.com profile exists
        if (!systemProfile) {
          // Try to find any admin/staff profile as fallback
          const { data: adminProfile } = await supabase
            .from('profiles')
            .select('id')
            .limit(1)
            .maybeSingle();
          
          if (adminProfile) {
            systemProfile = adminProfile;
          } else {
            throw new Error('System configuration error. Please contact support directly.');
          }
        }
        
        if (systemProfile) {
          clientId = systemProfile.id;
          // Store the actual requester info in metadata
          console.log(`Using system profile for unauthenticated user: ${body.email}`);
        }
      }
    }

    // client_id is required by the schema
    if (!clientId) {
      throw new Error('Unable to process support request. Please provide a valid email address.');
    }

    // Create ticket record
    const ticketData: Record<string, unknown> = {
      client_id: clientId,
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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelemetryEvent {
  event_type: string;
  event_data: Record<string, unknown>;
  page_url?: string;
  session_id?: string;
  user_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: TelemetryEvent | TelemetryEvent[] = await req.json();
    const events = Array.isArray(body) ? body : [body];
    
    console.log('Telemetry ingest:', events.length, 'events');

    // Validate and insert events
    const validEvents = events.map(event => ({
      event_type: event.event_type || 'unknown',
      event_data: event.event_data || {},
      page_url: event.page_url || null,
      session_id: event.session_id || null,
      user_id: event.user_id || null,
    }));

    const { error } = await supabase
      .from('telemetry_events')
      .insert(validEvents);

    if (error) {
      console.error('Error inserting telemetry:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, count: validEvents.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in telemetry-ingest:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Get analytics data from telemetry_events
    const { data: events, error: eventsError } = await supabase
      .from('telemetry_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (eventsError) {
      throw eventsError;
    }

    // Aggregate data
    const analytics = {
      totalEvents: events?.length || 0,
      pageViews: events?.filter((e) => e.event_type === 'page_view').length || 0,
      clicks: events?.filter((e) => e.event_type === 'click').length || 0,
      conversions: events?.filter((e) => e.event_type === 'conversion').length || 0,
    };

    // Prepare prompt for OpenAI
    const prompt = `Analyze the following website analytics data and provide insights and recommendations:

Total Events: ${analytics.totalEvents}
Page Views: ${analytics.pageViews}
Clicks: ${analytics.clicks}
Conversions: ${analytics.conversions}

Provide:
1. Key insights about user behavior
2. Recommendations for improvement
3. Areas of concern
4. Opportunities for growth

Format the response as JSON with keys: insights, recommendations, concerns, opportunities.`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an analytics expert providing insights on website performance.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`);
    }

    const openaiData = await openaiResponse.json();
    const insights = JSON.parse(openaiData.choices[0].message.content);

    return new Response(
      JSON.stringify({
        success: true,
        analytics,
        insights,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-insights:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

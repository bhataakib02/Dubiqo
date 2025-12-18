import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuoteRequest {
  service_type: string;
  features: string[];
  pages?: number;
  timeline: string;
  name: string;
  email: string;
  details?: string;
  client_id?: string;
}

// Prices in paise (1 INR = 100 paise)
const SERVICE_BASE_PRICES: Record<string, number> = {
  'websites': 249900,      // ₹2,499
  'web-apps': 799900,      // ₹7,999
  'dashboards': 499900,    // ₹4,999
  'ecommerce': 599900,     // ₹5,999
  'repair': 49900,         // ₹499
  'maintenance': 19900,    // ₹199/mo
  'portfolio': 499900,     // ₹4,999
};

const FEATURE_PRICES: Record<string, number> = {
  'cms': 50000,           // ₹500
  'auth': 80000,          // ₹800
  'payments': 100000,     // ₹1,000
  'analytics': 40000,     // ₹400
  'seo': 60000,           // ₹600
  'api': 120000,          // ₹1,200
};

const TIMELINE_MULTIPLIERS: Record<string, number> = {
  'standard': 1,
  'rush': 1.5,
  'urgent': 2,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: QuoteRequest = await req.json();
    console.log('Quote request:', body);

    // Calculate estimated cost in paise
    let estimatedCost = SERVICE_BASE_PRICES[body.service_type] || 249900;

    // Add feature costs
    for (const feature of body.features || []) {
      estimatedCost += FEATURE_PRICES[feature] || 0;
    }

    // Add extra page costs (₹150 per page over 5)
    if (body.service_type === 'websites' && body.pages && body.pages > 5) {
      estimatedCost += (body.pages - 5) * 15000; // ₹150 in paise
    }

    // Apply timeline multiplier
    const multiplier = TIMELINE_MULTIPLIERS[body.timeline] || 1;
    estimatedCost = Math.round(estimatedCost * multiplier);

    // Set valid until 30 days from now
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    // Create quote record
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        client_id: body.client_id || null,
        service_type: body.service_type,
        estimated_cost: estimatedCost, // Store in paise
        valid_until: validUntil.toISOString().split('T')[0],
        status: 'pending',
        project_details: {
          name: body.name,
          email: body.email,
          features: body.features,
          pages: body.pages,
          timeline: body.timeline,
          details: body.details,
        },
      })
      .select()
      .single();

    if (quoteError) {
      console.error('Error creating quote:', quoteError);
      throw quoteError;
    }

    console.log('Quote created:', quote);

    return new Response(
      JSON.stringify({ 
        success: true, 
        quote,
        estimated_cost_display: `₹${(estimatedCost / 100).toLocaleString('en-IN')}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in quote-create:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

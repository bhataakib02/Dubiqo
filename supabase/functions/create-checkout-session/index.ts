import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  invoice_id: string;
  success_url?: string;
  cancel_url?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_SECRET_KEY) {
      console.log('Stripe not configured - returning demo mode');
      return new Response(
        JSON.stringify({ 
          demo_mode: true,
          message: 'Payment demo mode - Stripe not configured',
          checkout_url: null,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: CheckoutRequest = await req.json();
    console.log('Checkout request:', body);

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, profiles!invoices_client_id_fkey(email, full_name)')
      .eq('id', body.invoice_id)
      .single();

    if (invoiceError || !invoice) {
      throw new Error('Invoice not found');
    }

    // Amount is stored in paise, Stripe expects smallest unit
    const amountInPaise = Math.round(Number(invoice.total_amount));

    // Create Stripe Checkout Session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'currency': 'inr',
        'line_items[0][price_data][currency]': 'inr',
        'line_items[0][price_data][product_data][name]': `Invoice ${invoice.invoice_number}`,
        'line_items[0][price_data][product_data][description]': `Payment for services`,
        'line_items[0][price_data][unit_amount]': amountInPaise.toString(),
        'line_items[0][quantity]': '1',
        'customer_email': invoice.profiles?.email || '',
        'success_url': body.success_url || `${req.headers.get('origin')}/client-portal?payment=success&invoice=${invoice.id}`,
        'cancel_url': body.cancel_url || `${req.headers.get('origin')}/client-portal?payment=cancelled`,
        'metadata[invoice_id]': invoice.id,
        'metadata[invoice_number]': invoice.invoice_number,
      }),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe error:', errorText);
      throw new Error('Failed to create checkout session');
    }

    const session = await stripeResponse.json();
    console.log('Stripe session created:', session.id);

    // Update invoice with Stripe session ID
    await supabase
      .from('invoices')
      .update({ stripe_invoice_id: session.id })
      .eq('id', invoice.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        checkout_url: session.url,
        session_id: session.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-checkout-session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

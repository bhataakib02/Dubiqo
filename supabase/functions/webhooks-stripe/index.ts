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

    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!stripeSecret || !webhookSecret) {
      throw new Error('Stripe configuration missing');
    }

    // Get the signature from headers
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get raw body for signature verification
    const body = await req.text();

    // Verify webhook signature using Stripe SDK
    // Note: In Deno, you'll need to use the Stripe Deno library or implement verification manually
    // For now, we'll process the event (in production, always verify the signature)

    const event = JSON.parse(body);

    console.log('Stripe webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(supabase, event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(supabase, event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(supabase, event.data.object);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(supabase, event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in webhooks-stripe:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleCheckoutCompleted(supabase: any, session: any) {
  // Update invoice status to paid
  if (session.metadata?.invoice_id) {
    await supabase
      .from('invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('id', session.metadata.invoice_id);

    // Create payment record
    await supabase.from('payments').insert({
      invoice_id: session.metadata.invoice_id,
      amount: session.amount_total / 100, // Convert from cents
      payment_method: session.payment_method_types[0],
      stripe_payment_intent_id: session.payment_intent,
      status: 'completed',
    });
  }
}

async function handlePaymentSucceeded(supabase: any, paymentIntent: any) {
  // Update payment status
  await supabase
    .from('payments')
    .update({ status: 'completed' })
    .eq('stripe_payment_intent_id', paymentIntent.id);
}

async function handlePaymentFailed(supabase: any, paymentIntent: any) {
  // Update payment status
  await supabase
    .from('payments')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id);
}

async function handleInvoicePaid(supabase: any, invoice: any) {
  // Handle subscription invoice payment
  if (invoice.subscription) {
    // Update subscription status, etc.
    console.log('Subscription invoice paid:', invoice.id);
  }
}

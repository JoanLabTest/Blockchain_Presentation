/**
 * STRIPE WEBHOOK HANDLER — Phase 111 (Automated Revenue)
 * Reference logic for Supabase Edge Functions.
 * Synchronizes Stripe Subscription events with the DCM Core user database.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@12';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2022-11-15',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

export default async function handler(req) {
  const signature = req.headers.get('stripe-signature');

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')
    );

    console.log(`🔔 Received Stripe Event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}

async function handleCheckoutComplete(session) {
  const userId = session.client_reference_id;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  console.log(`✅ Subscription Activated for User: ${userId}`);

  // 1. Update Subscriptions table
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status: 'active',
      plan_type: 'institutional_api',
      updated_at: new Date().toISOString()
    });

  if (subError) throw subError;

  // 2. Grant API_ACCESS via metadata/profile
  const { error: profileError } = await supabase
    .from('user_profiles')
    .update({ 
      subscription_tier: 'institutional',
      api_access_granted: true 
    })
    .eq('id', userId);

  if (profileError) throw profileError;
}

async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;

  console.log(`⚠️ Subscription Canceled for Customer: ${customerId}`);

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_customer_id', customerId);

  if (error) throw error;
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@^13.6.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

// Polyfill required by Stripe Webhook signature verification in Deno
const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
    try {
        const signature = req.headers.get('stripe-signature');
        const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

        if (!signature || !webhookSecret) {
            return new Response('Webhook secret or signature missing', { status: 400 });
        }

        const body = await req.text();
        let event;

        try {
            event = await stripe.webhooks.constructEventAsync(
                body,
                signature,
                webhookSecret,
                undefined,
                cryptoProvider
            );
        } catch (err) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            return new Response(`Webhook Error: ${err.message}`, { status: 400 });
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata?.user_id;
            const plan = session.metadata?.plan;
            const stripeCustomerId = session.customer as string;

            if (userId && plan) {
                const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
                const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
                const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        subscription_tier: plan,
                        stripe_customer_id: stripeCustomerId,
                    })
                    .eq('id', userId);

                if (error) {
                    console.error("Error updating profile in Supabase:", error);
                    return new Response("Database error", { status: 500 });
                }

                console.log(`✅ Upgraded User [${userId}] to [${plan}]. Stripe Customer: ${stripeCustomerId}`);
            } else {
                console.warn("Checkout session missing metadata user_id or plan");
            }
        }

        // Handle subscription cancellation — downgrade user to free
        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            const stripeCustomerId = subscription.customer as string;

            const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
            const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
            const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

            const { error } = await supabaseAdmin
                .from('profiles')
                .update({ subscription_tier: 'free' })
                .eq('stripe_customer_id', stripeCustomerId);

            if (error) {
                console.error("Error downgrading profile:", error);
                return new Response("Database error", { status: 500 });
            }

            console.log(`🔒 Subscription cancelled for Stripe Customer: ${stripeCustomerId}. Downgraded to free.`);
        }

        return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error(`Webhook Handler Error: ${err.message}`);
        return new Response(`Internal Server Error: ${err.message}`, { status: 500 });
    }
});

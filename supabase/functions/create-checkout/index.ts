import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@^13.6.0";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { plan, userId, billing } = await req.json();

        if (!userId) {
            throw new Error('User ID is required');
        }

        const isYearly = billing === 'yearly';

        let priceAmount = 0;
        let productName = "";
        let interval: 'month' | 'year' = isYearly ? 'year' : 'month';

        if (plan === 'pro') {
            // Monthly: 49€, Yearly: 470€ (20% off 588€)
            priceAmount = isYearly ? 47000 : 4900;
            productName = `DCM Pro Access (${isYearly ? 'Annuel' : 'Mensuel'})`;
        } else if (plan === 'institutional') {
            // Monthly: 99€, Yearly: 950€ (20% off)
            priceAmount = isYearly ? 95000 : 9900;
            productName = `DCM Institutional Access (${isYearly ? 'Annuel' : 'Mensuel'})`;
        } else {
            throw new Error("Plan invalide");
        }

        // Handle dynamic origin for return URLs (handle both localhost and deployed GitHub pages URL)
        const requestOrigin = req.headers.get('origin') || "http://localhost:3000";
        const referer = req.headers.get('referer');

        // Base fallback specifically for GitHub pages structure since referer can be flaky
        let basePath = requestOrigin.includes('github.io')
            ? "https://joanlabtest.github.io/Blockchain_Presentation"
            : requestOrigin;

        // If referer is strictly present and matches pattern, override it with referer logic
        if (referer && referer.includes('.html')) {
            basePath = referer.substring(0, referer.lastIndexOf('/'));
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: productName,
                        },
                        unit_amount: priceAmount,
                        recurring: {
                            interval: interval,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${basePath}/dashboard.html?upgrade=success`,
            cancel_url: `${basePath}/pricing.html?upgrade=cancelled`,
            metadata: {
                user_id: userId,
                plan: plan,
                billing: isYearly ? 'yearly' : 'monthly',
            }
        });

        return new Response(JSON.stringify({ url: session.url }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error("Create Checkout Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});

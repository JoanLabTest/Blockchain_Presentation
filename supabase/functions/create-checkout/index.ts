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
        const { plan, userId } = await req.json();

        if (!userId) {
            throw new Error('User ID is required');
        }

        let priceAmount = 0;
        let productName = "";

        if (plan === 'pro') {
            priceAmount = 2900; // 29€ in cents
            productName = "DCM Pro Access (Mensuel)";
        } else if (plan === 'institutional') {
            priceAmount = 9900; // 99€ in cents
            productName = "DCM Institutional Access (Mensuel)";
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
                            interval: 'month',
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

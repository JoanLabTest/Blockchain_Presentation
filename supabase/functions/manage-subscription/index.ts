import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@^13.6.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { userId } = await req.json();

        if (!userId) {
            throw new Error('User ID is required');
        }

        // Retrieve stripe_customer_id from Supabase
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') as string,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
        );

        const { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single();

        if (error || !profile?.stripe_customer_id) {
            throw new Error("Aucun abonnement actif trouvé pour cet utilisateur.");
        }

        // Determine return URL
        const requestOrigin = req.headers.get('origin') || "http://localhost:3000";
        const returnUrl = requestOrigin.includes('github.io')
            ? "https://joanlabtest.github.io/Blockchain_Presentation/pricing.html"
            : `${requestOrigin}/pricing.html`;

        // Create Stripe Customer Portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: returnUrl,
        });

        return new Response(JSON.stringify({ url: session.url }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error("Manage Subscription Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});

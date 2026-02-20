import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Coins to track: CoinGecko IDs
const COINS = "bitcoin,ethereum,solana,binancecoin";
const CURRENCIES = "eur,usd";
const COINGECKO_URL =
    `https://api.coingecko.com/api/v3/simple/price?ids=${COINS}&vs_currencies=${CURRENCIES}&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const response = await fetch(COINGECKO_URL, {
            headers: {
                "Accept": "application/json",
                "User-Agent": "DCM-Intelligence/1.0",
            },
        });

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
        }

        const raw = await response.json();

        // Normalize into a clean, front-end friendly format
        const data = {
            updatedAt: new Date().toISOString(),
            coins: {
                BTC: {
                    name: "Bitcoin",
                    symbol: "BTC",
                    priceEur: raw.bitcoin?.eur ?? null,
                    priceUsd: raw.bitcoin?.usd ?? null,
                    change24h: raw.bitcoin?.eur_24h_change ?? null,
                    marketCapEur: raw.bitcoin?.eur_market_cap ?? null,
                    volume24hEur: raw.bitcoin?.eur_24h_vol ?? null,
                },
                ETH: {
                    name: "Ethereum",
                    symbol: "ETH",
                    priceEur: raw.ethereum?.eur ?? null,
                    priceUsd: raw.ethereum?.usd ?? null,
                    change24h: raw.ethereum?.eur_24h_change ?? null,
                    marketCapEur: raw.ethereum?.eur_market_cap ?? null,
                    volume24hEur: raw.ethereum?.eur_24h_vol ?? null,
                },
                SOL: {
                    name: "Solana",
                    symbol: "SOL",
                    priceEur: raw.solana?.eur ?? null,
                    priceUsd: raw.solana?.usd ?? null,
                    change24h: raw.solana?.eur_24h_change ?? null,
                    marketCapEur: raw.solana?.eur_market_cap ?? null,
                    volume24hEur: raw.solana?.eur_24h_vol ?? null,
                },
                BNB: {
                    name: "BNB",
                    symbol: "BNB",
                    priceEur: raw.binancecoin?.eur ?? null,
                    priceUsd: raw.binancecoin?.usd ?? null,
                    change24h: raw.binancecoin?.eur_24h_change ?? null,
                    marketCapEur: raw.binancecoin?.eur_market_cap ?? null,
                    volume24hEur: raw.binancecoin?.eur_24h_vol ?? null,
                },
            },
        };

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
                // Cache for 60 seconds — protects CoinGecko free rate limit
                "Cache-Control": "public, max-age=60",
            },
        });
    } catch (err) {
        console.error("market-data error:", err);
        return new Response(
            JSON.stringify({ error: err.message, coins: null }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
        );
    }
});

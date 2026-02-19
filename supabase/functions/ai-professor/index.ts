import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// CORS headers are required to be able to fetch from the browser
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Basic In-Memory Rate Limiter (Note: In production with multiple isolates, Redis/KV is better)
const rateLimitMap = new Map();

serve(async (req) => {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Rate Limiting Logic (5 req / minute per IP proxy)
        const ip = req.headers.get('x-forwarded-for') || 'unknown-client';
        const now = Date.now();
        const windowMs = 60000;
        const maxRequests = 5;

        let requests = rateLimitMap.get(ip) || [];
        requests = requests.filter(time => now - time < windowMs);

        if (requests.length >= maxRequests) {
            return new Response(JSON.stringify({ reply: "Désolé, vous posez trop de questions ! Attendez une minute avant de réessayer." }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200, // Send 200 so the frontend chat handles it gracefully without breaking
            })
        }

        requests.push(now);
        rateLimitMap.set(ip, requests);

        const { question, context, user_level, type } = await req.json()

        const openAiKey = Deno.env.get('OPENAI_API_KEY');
        if (!openAiKey) {
            throw new Error('OPENAI_API_KEY is not set in environment variables.');
        }

        let systemPrompt = "Tu es un Professeur IA expert en Blockchain pour les marchés de capitaux. ";

        // Adapt explanation complexity based on user role
        if (user_level === 'Head of Digital' || user_level === 'Expert') {
            systemPrompt += "L'utilisateur est un profil expérimenté ou dirigeant. Utilise un langage très technique, va droit au but, et aborde les aspects de régulation (MiCA, Régime Pilote) et d'infrastructure. Ne vulgarise pas excessivement.";
        } else {
            systemPrompt += "L'utilisateur est un profil plutôt débutant ou intermédiaire. Explique les concepts simplement, avec des analogies claires si nécessaire, tout en gardant un vocabulaire professionnel financier.";
        }

        if (type === 'quiz_feedback') {
            systemPrompt += "\nContexte : L'utilisateur a répondu de travers à un quiz. Corrige-le et explique la bonne réponse de manière pédagogique.";
        } else if (type === 'guide_chat') {
            systemPrompt += "\nContexte : L'utilisateur navigue sur un guide technique. Réponds de manière concise à sa question en te basant sur des faits établis.";
        }

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Can change to gpt-4o if preferred
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Contexte fourni: ${context || 'Aucun'}\n\nQuestion de l'utilisateur: ${question}` }
                ],
                max_tokens: 400,
                temperature: 0.5,
            }),
        });

        if (!response.ok) {
            const errorOutput = await response.text();
            throw new Error(`OpenAI API Error: ${errorOutput}`);
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        return new Response(JSON.stringify({ reply }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error("AI Professor Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with Service Role for privileged backend actions
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function handleStripeWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`❌ Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            await handleSuccessfulSubscription(session);
            break;
        case 'customer.subscription.deleted':
            const subscription = event.data.object;
            await handleCancelledSubscription(subscription);
            break;
        default:
            console.log(`ℹ️ Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
}

/**
 * GENERATE & STORE API KEY (Phase 118)
 * Creates a secure dcm_live key, hashes it, and stores it for the user.
 * Returns the RAW key to be displayed once on the success page.
 */
async function generateAndStoreApiKey(userId) {
    const rawKey = `dcm_live_${crypto.randomBytes(24).toString('hex')}`;
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');

    const { data, error } = await supabase
        .from('api_keys')
        .insert([{
            user_id: userId,
            key_prefix: 'dcm_live_',
            hashed_key: hashedKey,
            display_name: 'Institutional Subscription Key',
            status: 'active'
        }]);

    if (error) {
        console.error("❌ Error generating API Key:", error);
        return null;
    }

    return rawKey; // Return raw to trigger delivery
}

async function handleSuccessfulSubscription(session) {
    const userId = session.client_reference_id; // Passed during checkout
    const customerEmail = session.customer_details.email;

    console.log(`✅ Subscription successful for user ${userId || customerEmail}`);

    // 1. Update User Profile to 'INSTITUTIONAL'
    const { error } = await supabase
        .from('profiles')
        .update({ 
            tier: 'institutional', 
            stripe_customer_id: session.customer,
            subscription_status: 'active' 
        })
        .eq('id', userId);

    if (error) console.error("❌ Error updating profile:", error);

    // 2. PHASE 118: Automate API Key Generation
    const rawKey = await generateAndStoreApiKey(userId);
    
    // 3. TODO: In a real environment, trigger a secure email via SendGrid/Postmark
    console.log(`🗝️ API Key Generated for ${userId}. Key Prefix: dcm_live_...`);
}

async function handleCancelledSubscription(subscription) {
    const customerId = subscription.customer;
    console.log(`⚠️ Subscription cancelled for customer ${customerId}`);

    // 1. Downgrade User to 'BASIC'
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (profile) {
        await supabase
            .from('profiles')
            .update({ tier: 'basic', subscription_status: 'cancelled' })
            .eq('id', profile.id);

        // 2. PHASE 118: Instant Revocation
        await supabase
            .from('api_keys')
            .update({ status: 'revoked' })
            .eq('user_id', profile.id);
            
        console.log(`🛡️ Institutional API Keys revoked for user ${profile.id}`);
    }
}

module.exports = { handleStripeWebhook };

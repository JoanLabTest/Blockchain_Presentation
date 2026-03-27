/**
 * DCM Core Institute: Stripe Webhook Handler (Phase 113)
 * Handles €499/mo Institutional Subscription Lifecycle
 */

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

async function handleSuccessfulSubscription(session) {
    const userId = session.client_reference_id; // Passed during checkout
    const customerEmail = session.customer_details.email;

    console.log(`✅ Subscription successful for user ${userId || customerEmail}`);

    // Update User Profile to 'INSTITUTIONAL'
    const { error } = await supabase
        .from('profiles')
        .update({ tier: 'institutional', stripe_customer_id: session.customer })
        .eq('id', userId);

    if (error) console.error("❌ Error updating profile:", error);

    // TODO: Trigger automated onboarding email or API Key generation event
}

async function handleCancelledSubscription(subscription) {
    const customerId = subscription.customer;
    console.log(`⚠️ Subscription cancelled for customer ${customerId}`);

    // Downgrade User to 'BASIC'
    await supabase
        .from('profiles')
        .update({ tier: 'basic' })
        .eq('stripe_customer_id', customerId);
}

module.exports = { handleStripeWebhook };

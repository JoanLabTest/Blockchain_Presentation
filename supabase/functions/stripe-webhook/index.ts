import Stripe from 'https://esm.sh/stripe@13.3.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── CONFIGURATION ───────────────────────────────────────────
const PRICE_IDS = {
  monthly: 'price_1TCfG9RtamCgCz7PyhxySEEH',   // €49/mo
  annual:  'price_1TCfHzRtamCgCz7PWd5vRvqG',    // €39/mo billed annually (€468)
};

// ─── HELPERS ─────────────────────────────────────────────────
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let r = '';
  for (let i = 0; i < 6; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return `DCM-PRO-${r}`;
}

function getPlanFromPriceId(priceId: string): 'monthly' | 'annual' {
  if (priceId === PRICE_IDS.annual) return 'annual';
  return 'monthly'; // default
}

function getPlanLabel(plan: string): string {
  return plan === 'annual'
    ? 'Academy Pro Annual (€39/mo · billed €468/year)'
    : 'Academy Pro Monthly (€49/mo)';
}

async function sendCodeEmail(
  to: string,
  code: string,
  plan: string,
  trialEnd: Date
): Promise<void> {
  const resendKey = Deno.env.get('RESEND_API_KEY')!;
  const planLabel = getPlanLabel(plan);
  const trialDate = trialEnd.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'DCM Core Institute <academy@dcmcore.com>',
      to: [to],
      subject: 'Your DCM Academy Pro Access Code',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#1a1a2e;">Welcome to DCM Academy Pro</h2>

          <p>Thank you for subscribing to <strong>${planLabel}</strong>.</p>
          <p>Your 7-day free trial is active until <strong>${trialDate}</strong>.</p>

          <p>Your exclusive access code:</p>
          <div style="background:#f0f4ff;border:2px solid #3b5bdb;border-radius:8px;
                      padding:20px;text-align:center;margin:24px 0;">
            <span style="font-family:monospace;font-size:28px;font-weight:bold;
                         color:#3b5bdb;letter-spacing:4px;">
              ${code}
            </span>
          </div>

          <p>To unlock Level 6 (DeFi &amp; RWA Strategies):</p>
          <ol>
            <li>Go to <a href="https://dcmcore.com/en/academy/pro/">DCM Academy Pro</a></li>
            <li>Select Level 6</li>
            <li>Enter your code above when prompted</li>
          </ol>

          <div style="background:#fff8e1;border-left:4px solid #f59e0b;
                      padding:12px 16px;margin:20px 0;border-radius:4px;">
            <strong>7-Day Free Trial</strong><br>
            <span style="font-size:13px;color:#666;">
              You will not be charged until ${trialDate}.
              Cancel anytime from your Stripe billing portal.
            </span>
          </div>

          <p style="color:#666;font-size:13px;">
            This code is single-use and linked to your subscription.<br>
            Keep it safe — do not share it.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:12px;">
            DCM Core Institute · dcmcore.com<br>
            Questions? Contact us at academy@dcmcore.com
          </p>
        </div>
      `,
    }),
  });
}

// ─── MAIN HANDLER ───────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
  });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body, sig!, Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response('Ignored', { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const customerEmail = session.customer_details?.email;

  if (!customerEmail) {
    return new Response('No email in session', { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Idempotence
  const { data: existing } = await supabase
    .from('access_codes')
    .select('code')
    .eq('stripe_session_id', session.id)
    .single();

  if (existing) {
    console.log('Session already processed:', session.id);
    return new Response('Already processed', { status: 200 });
  }

  // Get Price ID
  let priceId = '';
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    priceId = lineItems.data[0]?.price?.id || '';
  } catch (_) {
    // If fail, we can check session.metadata if available, but lineItems is better
  }

  const plan = getPlanFromPriceId(priceId);

  // Generate unique code
  let code = generateCode();
  for (let i = 0; i < 5; i++) {
    const { data: collision } = await supabase
      .from('access_codes').select('id').eq('code', code).single();
    if (!collision) break;
    code = generateCode();
  }

  // Calculate trial end (7 days)
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7);

  // Insert to DB
  const { error } = await supabase.from('access_codes').insert({
    code,
    tier: 'pro',
    plan,
    trial_end: trialEnd.toISOString(),
    stripe_session_id: session.id,
    stripe_customer_email: customerEmail,
    stripe_price_id: priceId,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return new Response('DB Error', { status: 500 });
  }

  // Send Email
  try {
    await sendCodeEmail(customerEmail, code, plan, trialEnd);
    console.log(`Code ${code} (${plan}) sent to ${customerEmail}`);
  } catch (emailErr) {
    console.error('Email error:', emailErr);
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

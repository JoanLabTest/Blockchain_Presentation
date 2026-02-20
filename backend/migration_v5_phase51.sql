-- =============================================
-- Phase 51: Stripe Monetization - Migration v5
-- Adds stripe_customer_id to profiles table for
-- subscription lifecycle management (cancel/downgrade)
-- =============================================

-- 1. Add stripe_customer_id column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT DEFAULT NULL;

-- 2. Add a partial index for fast webhook lookups by stripe_customer_id
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
ON profiles (stripe_customer_id)
WHERE stripe_customer_id IS NOT NULL;

-- 3. (Optional) Update webhook event listener whitelist in Supabase to include:
-- customer.subscription.deleted
-- This must be done via the Supabase Dashboard or `supabase` CLI:
-- supabase functions deploy stripe-webhook

-- Summary of Changes:
-- stripe-webhook now handles:
--   * checkout.session.completed -> set subscription_tier + stripe_customer_id
--   * customer.subscription.deleted -> reset subscription_tier to 'free'
-- create-checkout now handles:
--   * billing: 'yearly' | 'monthly' with 20% annual discount
-- manage-subscription (NEW):
--   * Opens Stripe Customer Portal for self-service subscription management

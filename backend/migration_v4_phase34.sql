-- Migration v4: Phase 34 Stripe Subscriptions --

-- 1. Add the subscription_tier column to public.profiles
ALTER TABLE public.profiles
ADD COLUMN subscription_tier text DEFAULT 'free'
CHECK (subscription_tier IN ('free', 'pro', 'institutional'));

-- 2. Optional: Add a comment to the column for documentation
COMMENT ON COLUMN public.profiles.subscription_tier IS 'User subscription tier: free, pro, or institutional (Phase 34 Stripe Integ)';
